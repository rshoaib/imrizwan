---
title: "Microsoft Graph $batch Requests: Combine Up to 20 API Calls in One Round Trip (2026)"
slug: microsoft-graph-batch-requests-combine-api-calls-2026
excerpt: "Combine up to 20 Microsoft Graph API calls in a single HTTP request with $batch. Sequencing, dependsOn, error handling, and 2026 production patterns."
date: "2026-04-30T09:00:00.000Z"
displayDate: "April 30, 2026"
readTime: "13 min read"
category: "Graph API"
image: "/images/blog/microsoft-graph-batch-requests-combine-api-calls-2026.png"
tags:
  - "Microsoft Graph"
  - "Batch Requests"
  - "Performance"
  - "REST API"
  - "Microsoft 365"
  - "2026"
---

## Why $batch Is the Quietly Most Important Graph Endpoint

The single biggest performance lever in a Microsoft Graph integration is not your auth library, not your retry policy, and not how you cache tokens. It is whether you bundle calls. A typical M365 page that needs the signed-in user, their photo, their manager, their direct reports, and their last five emails is five round trips, each carrying its own TLS handshake-equivalent latency, its own throttling cost, and its own authentication overhead. Run that against `https://graph.microsoft.com` from a server in another region and you are watching the wall clock burn for no good reason.

Graph's `/$batch` endpoint solves this. You POST one JSON envelope containing up to 20 individual requests, the service fans them out internally (often in parallel), and you get one response with an array of results. You pay one network round trip and one auth check. Done right, it is the difference between a dashboard that renders in 200 ms and one that takes three seconds.

This guide walks through `$batch` end to end: the envelope shape, sequencing with `dependsOn`, mixing GETs and writes safely, throttling behavior, the gotchas that quietly corrupt your results, and the SDK helpers that hide the JSON wrangling. Code is TypeScript with the official `@microsoft/microsoft-graph-client` SDK; the same envelope works from .NET, Python, PowerShell, or raw curl.

---

## How a $batch Request Is Shaped

You POST to `https://graph.microsoft.com/v1.0/$batch` with a body that wraps an array of inner requests. Each inner request needs an `id` (any string you choose, unique within the batch), a `method`, and a `url` that is **relative to the Graph version root** — leading slash, no host, no `/v1.0` prefix.

```json
{
  "requests": [
    {
      "id": "1",
      "method": "GET",
      "url": "/me"
    },
    {
      "id": "2",
      "method": "GET",
      "url": "/me/photo/$value"
    },
    {
      "id": "3",
      "method": "GET",
      "url": "/me/manager"
    }
  ]
}
```

Graph responds with a parallel `responses` array. Order is **not guaranteed** to match your input — always look up by `id`:

```json
{
  "responses": [
    { "id": "3", "status": 200, "body": { "displayName": "Sara Davis" } },
    { "id": "1", "status": 200, "body": { "displayName": "Adele Vance" } },
    { "id": "2", "status": 404, "body": { "error": { "code": "ImageNotFound" } } }
  ]
}
```

Three things to internalise from that response:

- The outer call returned **200 OK** even though one inner call 404'd. The HTTP status of the outer batch reflects whether Graph could process the envelope, not whether every inner call succeeded.
- Inner failures show up as `status: 4xx` on individual entries. You must iterate the array and check each one.
- Order is shuffled. Always key responses by `id`, never by array index.

The hard limits to memorise:

- **20 inner requests max** per batch (v1.0 and beta).
- **Total request size 4 MB.**
- Each inner request inherits the outer auth token. You cannot mix tokens.
- Each inner request counts toward Graph's per-resource throttling budget *individually* — `$batch` does not get you a free pass.

---

## Step 1: Building a Batch With the SDK

The TypeScript SDK ships a helper class that handles the envelope, the lookup-by-id, and serialisation of nested binary content. Here is a clean example that fans out the homepage data for an M365 dashboard:

```ts
import {
  Client,
  BatchRequestContent,
  BatchResponseContent,
} from "@microsoft/microsoft-graph-client";

interface DashboardData {
  me: any;
  manager: any | null;
  reports: any[];
  recentMessages: any[];
}

async function loadDashboard(graph: Client): Promise<DashboardData> {
  const batch = new BatchRequestContent();

  batch.addRequest({
    id: "me",
    request: new Request("https://graph.microsoft.com/v1.0/me", {
      method: "GET",
    }),
  });

  batch.addRequest({
    id: "manager",
    request: new Request("https://graph.microsoft.com/v1.0/me/manager", {
      method: "GET",
    }),
  });

  batch.addRequest({
    id: "reports",
    request: new Request(
      "https://graph.microsoft.com/v1.0/me/directReports?$select=id,displayName,mail",
      { method: "GET" }
    ),
  });

  batch.addRequest({
    id: "messages",
    request: new Request(
      "https://graph.microsoft.com/v1.0/me/messages?$top=5&$select=subject,from,receivedDateTime",
      { method: "GET" }
    ),
  });

  const content = await batch.getContent();
  const result = await graph.api("/$batch").post(content);
  const responses = new BatchResponseContent(result);

  return {
    me: await unwrap(responses, "me"),
    manager: await safeUnwrap(responses, "manager"),
    reports: (await unwrap(responses, "reports")).value ?? [],
    recentMessages: (await unwrap(responses, "messages")).value ?? [],
  };
}

async function unwrap(rs: BatchResponseContent, id: string) {
  const r = rs.getResponseById(id);
  if (!r || !r.ok) {
    const body = await r?.json().catch(() => null);
    throw new Error(`Batch part "${id}" failed: ${r?.status} ${JSON.stringify(body)}`);
  }
  return r.json();
}

async function safeUnwrap(rs: BatchResponseContent, id: string) {
  const r = rs.getResponseById(id);
  return r && r.ok ? await r.json() : null;
}
```

A few patterns worth highlighting. `safeUnwrap` lets a single inner part fail without taking down the whole page — useful for the "manager" call, which 404s for the CEO. `BatchResponseContent` wraps each inner response as a real `Response` object so you can call `.json()`, `.text()`, or `.blob()` without re-parsing yourself. And every URL is fully qualified — the SDK strips the host before sending, so this works locally and in cloud sovereign clouds without conditional logic.

For raw HTTP, the same envelope ships against `POST /v1.0/$batch` with `Content-Type: application/json` and the same bearer token you would use on any other Graph call. See the [Microsoft Graph API Authentication Guide](/blog/microsoft-graph-api-authentication-guide) for the auth flow that produces that token.

---

## Sequencing with dependsOn

By default Graph runs inner requests **in parallel**. That is what you want for the dashboard above — independent reads should not wait on each other. But sometimes you need order: create a folder, then create three files inside it; or create a calendar event, then attach an extension. For that, use `dependsOn`:

```json
{
  "requests": [
    { "id": "1", "method": "POST", "url": "/me/drive/root/children",
      "headers": { "Content-Type": "application/json" },
      "body": { "name": "Quarterly Review", "folder": {} }
    },
    { "id": "2", "method": "PUT",
      "url": "/me/drive/root:/Quarterly Review/notes.txt:/content",
      "headers": { "Content-Type": "text/plain" },
      "body": "Draft notes go here.",
      "dependsOn": ["1"]
    },
    { "id": "3", "method": "PATCH",
      "url": "/me/drive/root:/Quarterly Review:",
      "headers": { "Content-Type": "application/json" },
      "body": { "description": "Q2 2026 review materials" },
      "dependsOn": ["1"]
    }
  ]
}
```

Rules of the road for `dependsOn`:

- All dependencies must point to earlier `id`s in the array.
- Dependencies must form a chain (`A → B → C`) or a fan-out from one parent (`A → B`, `A → C`). You **cannot** have multiple parents in a single `dependsOn` array — an inner request can only have one direct dependency.
- If a dependency fails (status >= 400), the dependent request is **not executed**. It returns `424 Failed Dependency` so you know to skip it in your error rollup.
- The whole batch still returns 200; you must walk the array and decide which 424s are expected fallout vs. unexpected.

That last point bites people: you cannot use `$batch` as a transactional unit. There is no rollback. If step 2 of a 5-step write fails, steps 1, 3, 4, and 5 still committed (or, with `dependsOn`, 3/4/5 might be skipped, but step 1 is permanent). For true transactionality, design idempotent operations and reconcile on retry — Graph does not give you transactions.

---

## Mixing Reads and Writes

A `$batch` can mix any combination of HTTP methods. The most useful pattern is "look up something, then write based on it" — but because inner parts cannot reference each other's response data, you usually do this in two batches: one read, one write keyed off the result.

The exception is when you already know the IDs. For example, to grant a user access to three SharePoint sites in one batch:

```ts
async function grantAccess(graph: Client, userId: string, siteIds: string[]) {
  const batch = new BatchRequestContent();

  siteIds.forEach((siteId, i) => {
    batch.addRequest({
      id: `grant-${i}`,
      request: new Request(
        `https://graph.microsoft.com/v1.0/sites/${siteId}/permissions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roles: ["read"],
            grantedToIdentities: [
              { user: { id: userId } },
            ],
          }),
        }
      ),
    });
  });

  const content = await batch.getContent();
  const result = await graph.api("/$batch").post(content);
  const responses = new BatchResponseContent(result);

  const failures: { id: string; status: number; body: any }[] = [];
  for (const id of siteIds.map((_, i) => `grant-${i}`)) {
    const r = responses.getResponseById(id)!;
    if (!r.ok) {
      failures.push({ id, status: r.status, body: await r.json() });
    }
  }
  return { granted: siteIds.length - failures.length, failures };
}
```

Three things to notice in that function. First, IDs are predictable (`grant-0`, `grant-1`, ...) so you can iterate them after the fact. Second, the body of each inner request is a serialised JSON string when constructed via `Request`, but Graph parses it as JSON because the `Content-Type` header says so — get that header wrong and your body is stored as a string, not a permission object. Third, the function returns a structured failure list rather than throwing on the first 4xx; that is almost always the right shape for batch operations because partial success is the norm.

If you need more than 20 writes, chunk the input array and run multiple batches sequentially or in small parallelism. Do not run 100 parallel `$batch` calls — you will hit the per-app throttling ceiling instantly.

---

## Throttling, 429s, and Retry-After

A common misconception is that `$batch` insulates you from throttling. It does not. Each inner request counts toward the resource's RU budget exactly as if you had called it on its own. What `$batch` saves you is the per-call HTTP and auth overhead, not the underlying resource cost.

When throttling kicks in, you see it at two levels:

- **Outer 429 / 503:** the entire batch was throttled before processing. The outer response has a `Retry-After` header. Sleep, then retry the whole batch.
- **Inner 429:** some specific inner requests were throttled. Each throttled inner part has its own `Retry-After` in its `headers` field. Retry just those parts (in a new batch), not the whole thing.

```ts
async function postBatchWithRetry(graph: Client, content: any, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await graph.api("/$batch").post(content);
    } catch (err: any) {
      if (err.statusCode === 429 || err.statusCode === 503) {
        const retryAfter = parseInt(err.headers?.["retry-after"] ?? "5", 10);
        await new Promise((r) => setTimeout(r, retryAfter * 1000));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Batch retries exhausted");
}
```

For inner-level retries, walk the response array, collect inner parts whose status is 429, and rebuild a smaller batch from just those. Honour the longest `Retry-After` you saw across them. The same backoff philosophy applies as to any other Graph call — see the patterns in the [Microsoft Graph Delta Query: Incremental Sync Guide (2026)](/blog/microsoft-graph-delta-query-incremental-sync-2026), which deals heavily with retry semantics on long-running syncs.

---

## Common Pitfalls

A handful of mistakes show up over and over in support tickets and pull request reviews.

**Forgetting that the URL is relative.** The inner `url` field starts with `/` and excludes the host and version segment. Writing `https://graph.microsoft.com/v1.0/me` inside an inner request returns `400 Bad Request: Invalid URL`. The SDK strips the host for you, but if you build envelopes by hand, get the prefix right.

**Treating 200 as success.** The outer 200 only confirms the envelope was processed. A batch where every inner part 4xx'd still returns 200. You must iterate `responses`. I recommend logging a summary like `batch: 12/20 ok, 5x 404, 3x 429` after every call — it surfaces partial failures that would otherwise vanish.

**Sending more than 20 requests.** The endpoint returns `400 Bad Request: TooManyRequestsInBatch` and rejects the whole envelope. Chunk before you call. The SDK's `BatchRequestContent.MAX_NUMBER_OF_REQUESTS` constant is exactly 20; assert against it.

**Body type confusion for binary content.** PUTting a file's bytes inside a batch is technically possible but awkward — the bytes must be base64-encoded into a string and the inner request must include `"headers": { "Content-Type": "application/octet-stream" }` plus `"body": "<base64>"` and a `binary` content-type indicator. For files larger than a few hundred KB, do the upload outside the batch using upload sessions. Batches are best for metadata and small-payload operations.

**Forgetting `Content-Type: application/json` on inner POSTs/PATCHes.** Without it, Graph treats your JSON object as a string. The inner call returns 400 with a confusing schema error and you spend an hour debugging until you spot the missing header. Always set it explicitly on inner write requests.

**Assuming dependsOn means transaction.** It does not. A failed dependency cascades skip-forward (424s), but earlier successes are not rolled back. Design for partial commit and reconcile.

---

## When NOT to Use $batch

Bundling is not free. There are three cases where you should keep calls separate:

- **Long-running operations.** If one of your inner requests takes 30+ seconds (a large search, a heavy `$expand`), the whole batch waits on it. The other 19 results are held until the slow one finishes. Pull slow operations out and run them parallel to the batch.
- **File uploads over ~1 MB.** Use `createUploadSession` instead. Batched binary uploads break the 4 MB envelope limit fast and add encoding overhead.
- **Operations that need different scopes or app contexts.** A single batch is one auth context. Cross-tenant or cross-app calls need separate clients.

For everything else — dashboards, list scaffolding, bulk metadata patches, multi-resource reads — `$batch` should be your default. The rule of thumb is "if I'm about to make three or more Graph calls back-to-back without using each other's results, batch them."

---

## FAQ

**Is `$batch` available on the beta endpoint?** Yes — `/beta/$batch` works identically and accepts beta resource paths inside inner requests. You cannot mix `/v1.0` and `/beta` URLs in the same envelope; the outer endpoint determines the version namespace.

**Can I batch across different users in app-only context?** Yes. With application permissions and `Client.init` configured for app-only auth, inner URLs like `/users/{id1}/messages` and `/users/{id2}/messages` work in one batch.

**Do batched calls bill differently for SharePoint Embedded or paid Graph APIs?** Per-resource billing is unchanged — each inner request bills as if called directly. The only saving is on the network and auth cost.

**Can I cancel a batch mid-flight?** No. Once Graph accepts the envelope, all inner requests are dispatched. Aborting the outer HTTP call does not stop server-side processing of writes; design writes to be idempotent.

**What's the practical request count where $batch starts paying off?** Three or more independent calls. At two, the network savings rarely beat the envelope overhead. At three or more, you are solidly ahead.

---

## Next Steps

Once you have `$batch` integrated, the next two performance wins to chase are smart paging (use `$top` and `$select` aggressively to keep payloads small) and incremental sync. For long-running data refresh jobs, switch from full sweeps to delta queries — see the [Microsoft Graph Delta Query: Incremental Sync Guide (2026)](/blog/microsoft-graph-delta-query-incremental-sync-2026) for the token lifecycle and the [Microsoft Graph Change Notifications: Real-Time Webhooks Guide (2026)](/blog/microsoft-graph-change-notifications-webhooks-guide-2026) for push-style alternatives.

If you are wiring batch-aware data fetching into a SharePoint Framework solution, the [Microsoft Graph Toolkit: Build M365-Powered Web Apps Guide (2026)](/blog/microsoft-graph-toolkit-web-apps-guide-2026) covers the providers and components that already do batched fetches under the hood — a useful reference architecture.

A 200 ms page that used to be 2 seconds is the kind of win that gets noticed in M365 dashboards. `$batch` is usually the first lever to pull.
