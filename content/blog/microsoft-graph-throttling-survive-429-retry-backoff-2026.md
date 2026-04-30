---
title: "Microsoft Graph Throttling: Survive 429s with Smart Retry, Backoff, and Caching (2026)"
slug: microsoft-graph-throttling-survive-429-retry-backoff-2026
excerpt: "Microsoft Graph throttles aggressively in production. Build a retry-with-backoff layer, respect Retry-After, reduce call volume, and avoid the patterns that get you blocked."
date: "2026-04-30T13:00:00.000Z"
displayDate: "April 30, 2026"
readTime: "12 min read"
category: "Graph API"
image: "/images/blog/microsoft-graph-throttling-survive-429-retry-backoff-2026.png"
tags:
  - "Microsoft Graph"
  - "Throttling"
  - "Performance"
  - "Retry Logic"
  - "REST API"
  - "Microsoft 365"
  - "2026"
---

## Why Throttling Is the Silent Killer of Graph Integrations

A Microsoft Graph integration that worked beautifully in dev and load-tests fine on a single tenant has one consistent way of falling over in production: it gets throttled. Not in a way that causes loud errors during the smoke test — usually in a way that surfaces three weeks after launch as a tail of mysterious 429 responses, paged users, missing notifications, and a queue that quietly stops draining at 9:05 every morning when half a department signs in at once.

Throttling is not optional plumbing. It is a first-class part of the Graph contract, with documented per-app, per-tenant, per-user, and per-resource limits that the service enforces aggressively to protect Microsoft 365 from runaway clients. Once you trip a limit, Graph returns `429 Too Many Requests` (or, less often, `503 Service Unavailable`) with a `Retry-After` header that tells you exactly how long to wait. Code that ignores that header — or, worse, retries immediately and tightens the loop — gets escalated to longer cooldowns and, in extreme cases, blocked at the app-registration level.

This guide shows you how to build a Graph client that does not get throttled in production: how the limits actually work, how to write a retry wrapper that respects `Retry-After`, how to reduce call volume through caching and batching, and the patterns that quietly turn one chatty webhook handler into a tenant-wide outage. Examples are TypeScript using the official `@microsoft/microsoft-graph-client` SDK; the same pattern translates directly to .NET, Python, and PowerShell.

---

## How Microsoft Graph Throttling Actually Works

Throttling on Graph is not one global limit. It is a layered set of buckets, and any one of them can trip independently:

- **Per-app, per-tenant.** Each app registration has a budget per tenant, scaled by the size of the tenant and the resource being called. A small app calling a 200K-seat tenant has a much higher ceiling than the same app on a 50-seat tenant.
- **Per-user.** Calls made on behalf of a single user (delegated permissions) share that user's per-resource bucket — so if one user is also using Outlook on the web heavily, your headroom shrinks.
- **Per-resource.** Mail, OneDrive, Teams, SharePoint, and directory all have separate limits. A burst of `/me/messages` reads does not cost against your `/sites` budget.
- **Service-level fairness.** Even if you are inside your documented limit, downstream services (Exchange, SharePoint) can throttle independently when they are under regional pressure. You see this as 429s that do not match the documented numbers.

The single most important fact: Graph tells you what to do. Every 429 carries a `Retry-After` header, in seconds. That number is authoritative. Do not guess, do not subtract, do not add a "safety margin" by retrying earlier. Sleep for at least that long, then try again. Retrying early is the fastest way to get your cooldown extended.

A second important fact: not every 429 is your fault. Sometimes Graph throttles you because *another* app on the same tenant is hammering the same resource, and the service is shedding load fairly. Your job is to back off, not to escalate.

---

## Read Retry-After and Honor It (Always)

The naive retry loop is the one almost every team writes first and ships:

```ts
// DON'T DO THIS
async function callGraph(url: string, token: string) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return res.json();
    // hard-coded sleep, ignores Retry-After
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("Graph call failed");
}
```

This is exactly the pattern that gets your app's cooldown extended. The fixed 1-second wait is shorter than most `Retry-After` values, so each retry hits while you are still over the limit, and the service punishes you for it.

The correct version reads the header, parses both the seconds-form and the HTTP-date form, and falls back to exponential backoff only when the header is missing:

```ts
async function callGraphWithRetry(
  url: string,
  token: string,
  init: RequestInit = {},
  maxAttempts = 5,
) {
  let attempt = 0;
  while (true) {
    const res = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init.headers ?? {}),
      },
    });

    // Success or non-retryable error
    if (res.status !== 429 && res.status !== 503 && res.status !== 504) {
      return res;
    }

    attempt++;
    if (attempt >= maxAttempts) {
      throw new Error(`Graph call failed after ${maxAttempts} attempts`);
    }

    const waitMs = parseRetryAfter(res.headers.get("Retry-After"), attempt);
    await new Promise((r) => setTimeout(r, waitMs));
  }
}

function parseRetryAfter(header: string | null, attempt: number): number {
  if (!header) {
    // Exponential backoff with jitter: 1s, 2s, 4s, 8s + 0-500ms
    const base = Math.min(2 ** (attempt - 1), 30) * 1000;
    return base + Math.floor(Math.random() * 500);
  }
  const seconds = Number(header);
  if (!Number.isNaN(seconds)) return seconds * 1000;
  // HTTP-date form
  const dateMs = Date.parse(header);
  if (!Number.isNaN(dateMs)) return Math.max(0, dateMs - Date.now());
  return 5000; // safe fallback
}
```

Three things this gets right that the naive version doesn't: it parses both the integer-seconds and HTTP-date variants of `Retry-After`, it adds jitter to the fallback backoff (so a fleet of clients does not retry in lockstep), and it caps total attempts so a stuck tenant does not pin a worker forever.

It also handles 503 and 504 the same way. Those are not throttling per se — they are transient service errors — but the right response is identical: back off and retry.

---

## A Production-Grade Retry Wrapper in TypeScript

The fetch-level wrapper above is fine for one-off scripts. For real apps you want to plug retry into the Graph SDK so every request — REST, batched, paged — gets the same treatment.

The official client takes a `middleware` array. Drop a custom middleware in front of the auth middleware:

```ts
import {
  Client,
  Middleware,
  Context,
  RetryHandler,
  RetryHandlerOptions,
} from "@microsoft/microsoft-graph-client";

class ThrottleAwareMiddleware implements Middleware {
  private next?: Middleware;
  setNext(next: Middleware) {
    this.next = next;
  }

  async execute(context: Context): Promise<void> {
    const maxAttempts = 5;
    let attempt = 0;
    while (true) {
      await this.next!.execute(context);
      const res = context.response;
      if (!res || (res.status !== 429 && res.status !== 503 && res.status !== 504)) {
        return;
      }
      attempt++;
      if (attempt >= maxAttempts) return; // give up; let caller see 429

      const waitMs = parseRetryAfter(res.headers.get("Retry-After"), attempt);
      logThrottleEvent({
        url: context.request as string,
        status: res.status,
        attempt,
        waitMs,
      });
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
}

const client = Client.initWithMiddleware({
  middleware: composeMiddleware([
    new ThrottleAwareMiddleware(),
    new AuthenticationMiddleware(provider),
    new HttpMessageHandler(),
  ]),
});
```

A few production-grade refinements worth making before this hits real traffic:

- **Per-resource backoff state.** Keep a small in-memory map of `resource → cooldownUntil`. When you get a 429 from `/me/messages`, mark `/me/messages` as cold for the returned interval. Future calls to that resource queue or short-circuit until the timer expires. This stops you from sending five more doomed requests while you wait for the first one.
- **Bounded concurrency.** Limit how many simultaneous Graph calls a single worker fires. A `p-limit(5)` per worker is a sane default. Graph's per-app burst budget is finite; ten parallel page-1 fetches eat it instantly.
- **Idempotency on writes.** Retrying a `POST` that already succeeded creates a duplicate. Use the `client-request-id` header so you can correlate, and prefer `PATCH` with deterministic IDs over `POST` where the API supports it.

The SDK ships its own `RetryHandler` that handles the basics, and for many apps it is enough. The custom middleware above earns its keep when you need observability — counting throttle events per resource, alerting on extended cooldowns, or feeding the data into a circuit breaker.

---

## Reduce Pressure: Batching, Caching, and Selective Reads

The fastest retry policy is the one you do not need. Every call you remove from the wire is a call that cannot be throttled. Three levers, in order of impact:

**Batch.** Collapsing five Graph calls into one `$batch` envelope means one auth round trip and one throttling cost instead of five. The [Microsoft Graph $batch Requests Guide (2026)](/blog/microsoft-graph-batch-requests-combine-api-calls-2026) walks through the envelope, sequencing, and limits — but the throttling angle alone is reason enough to default to batched reads. A batched envelope still counts against your bucket, but as a single weighted request, not as five.

**Cache.** Most Graph data does not change every second. The signed-in user's profile, their photo, the org chart, mailbox folder lists, SharePoint site metadata — all of these are safe to cache for minutes or hours. A simple in-memory cache with a 5-minute TTL on `/me`, `/me/photo`, and `/me/manager` removes 80% of dashboard traffic on most apps:

```ts
const cache = new Map<string, { value: unknown; expiresAt: number }>();

async function cachedGraphGet<T>(
  client: Client,
  path: string,
  ttlMs = 5 * 60_000,
): Promise<T> {
  const hit = cache.get(path);
  if (hit && hit.expiresAt > Date.now()) return hit.value as T;
  const value = await client.api(path).get();
  cache.set(path, { value, expiresAt: Date.now() + ttlMs });
  return value as T;
}
```

For longer-lived data (group memberships, SharePoint site lists), consider a server-side Redis layer keyed by tenant + user + path, with a sensible TTL and a manual purge for known-changed entities.

**Use `$select` and `$top` aggressively.** Asking for `/me/messages?$top=10&$select=subject,from,receivedDateTime` is materially cheaper than `/me/messages` returning 25 full message envelopes. Smaller payloads do not directly avoid throttling, but they reduce overall service load and let you do more work inside your bucket.

For high-volume sync workloads, switch from polling to delta or change notifications. Delta queries return only what has changed since the last token — see the [Microsoft Graph Delta Query: Incremental Sync Guide (2026)](/blog/microsoft-graph-delta-query-incremental-sync-2026) for the lifecycle. For sub-second latency, push notifications eliminate polling entirely; the [Microsoft Graph Change Notifications Webhooks Guide (2026)](/blog/microsoft-graph-change-notifications-webhooks-guide-2026) covers subscription setup and renewal.

---

## Per-User vs Per-App Limits — Picking the Right Auth

A common mistake on multi-tenant SaaS apps: routing all calls through a single delegated user identity, then watching that user's bucket get exhausted while the rest of the tenant's headroom sits idle.

There are two auth shapes for Graph, and they have very different throttling characteristics:

- **Delegated permissions** — calls run as a signed-in user. The bucket is per-user, per-resource. Good for: anything that needs the user's view of their own data, anything user-driven, OAuth web apps. Bad for: high-volume background work that should not be charged to one human's quota.
- **Application permissions** — the app calls Graph as itself. The bucket is per-app, per-tenant, scaled by tenant size. Good for: scheduled jobs, webhook receivers, multi-user reads, anything not tied to one human. Bad for: cases where you need the user's own permissions (sharing, presence, etc.).

A typical productivity SaaS architecture splits the two:

- The frontend uses **delegated** auth via MSAL, calling Graph for the signed-in user's profile, calendar, and mail. Heavy operations are kicked to the backend.
- The backend uses **application** permissions for any cross-user query, any scheduled job, and any webhook receiver. Each tenant gets the full app-tenant bucket, which is much larger than any one user's.

If you need a refresher on these flows and how to wire them up, the [Microsoft Graph API Authentication Guide](/blog/microsoft-graph-api-authentication-guide) and [Microsoft Graph API OAuth2 Guide](/blog/microsoft-graph-api-oauth2-guide) cover the token plumbing end to end.

The throttling-aware version of "should this be delegated or app-only?" is: *whose quota are you spending?* If the answer is "one user, repeatedly, for non-user-specific data" — switch to app-only.

---

## Monitoring Throttling: What to Log and Alert On

You cannot fix what you cannot see. The minimum observability for a Graph integration is:

- **Counter: `graph.throttle.events`** — labeled by resource (mail, sites, users, etc.) and status (429, 503). A sudden spike on one label means a downstream service is having a bad day; a steady climb across all labels means your traffic is growing past your bucket and you need to add caching.
- **Histogram: `graph.retry_after.seconds`** — the distribution of `Retry-After` values you see. Most should be under 10 seconds; values over 60 seconds mean you have been escalated and need to back off harder.
- **Counter: `graph.requests`** by resource — so you can compute throttle rate as `throttle.events / requests`. Anything over 1% sustained is a problem.
- **Trace: `client-request-id` round-trip** — set this header on every outbound call (`request-id` in the SDK) and log it on both sides of any retry. Microsoft support cannot help you debug a 429 storm without these IDs.

Wire alerts on two things: throttle rate above 5% over a 5-minute window (something is wrong with your traffic shape), and any single `Retry-After` over 120 seconds (something is wrong with the tenant or the service). Both should page someone, not just go to a dashboard.

For deeper visibility into tenant-level health, the Microsoft 365 admin center exposes a service health page and Graph API usage metrics under the tenant's app registrations. Cross-checking your numbers against the admin view is the fastest way to tell whether you are the cause or a victim.

---

## Common Pitfalls

**Retrying too fast.** The most common bug. Hard-coded 1-second waits, exponential backoff that starts at 100 ms, parallel retries that fire ten copies of the same request — all of these dig you a deeper hole. Read `Retry-After`. Honor it.

**Sharing one HTTP client across tenants.** If your app talks to many tenants, give each tenant its own client (or at least its own retry state). One throttled tenant should not slow down requests to a healthy tenant.

**Polling when you could subscribe.** A loop that hits `/me/messages` every 30 seconds to check for new mail is hostile to the service and to your own quota. Replace it with a webhook subscription. See the [Microsoft Graph Change Notifications Webhooks Guide (2026)](/blog/microsoft-graph-change-notifications-webhooks-guide-2026).

**Not caching photos.** `/me/photo/$value` is a binary call that returns rarely-changing data. Cache it server-side for hours, not minutes. Pulling a 50 KB JPEG on every page render is the textbook example of an avoidable bucket burn.

**Unbounded `$expand`.** `?$expand=members` on a large group is a single HTTP request that internally does enormous work. Graph charges that against your budget and may throttle the entire app for minutes. Fetch members with `$top` paging instead.

**Treating webhook deliveries as "free."** When a notification fires, your handler still calls Graph to fetch the changed resource. A burst of 50 notifications fires 50 fetches. Handlers must batch and de-dupe before calling back; the [Change Notifications Guide](/blog/microsoft-graph-change-notifications-webhooks-guide-2026) has the receiver patterns.

---

## FAQ

**What is the actual throttle limit on Microsoft Graph?** There is no single number. Limits are per-resource, scaled by tenant size, and Microsoft documents them at [the Graph throttling reference](https://learn.microsoft.com/graph/throttling). Treat the documented numbers as ceilings, not targets — service-level fairness can throttle you below the documented limit when others are loud.

**Does `$batch` count as one request or many for throttling?** As one weighted request. The inner requests still count individually against per-resource buckets, but you pay one network and one app-level cost. It is almost always a win for throttling.

**Should I retry on 5xx errors?** Yes, on 503, 504, and sometimes 502, with the same backoff logic as 429. Do not retry on 500 — that is a server bug, and retrying makes it worse, not better. Surface 500s to your error tracker.

**Is throttling different on `/beta` vs `/v1.0`?** Limits are similar, but `/beta` has tighter SLAs and less generous burst capacity. Production apps should default to `/v1.0` for anything load-bearing. Use `/beta` only where the feature you need is not in v1.0 yet.

**My app is throttled but Graph admin metrics show low usage. Why?** Two common causes. First, another app on the same tenant is hot, and the resource-level fairness logic is shedding load across all callers. Second, you are hitting a per-user cap rather than a per-app cap — check whether your traffic is concentrated on one or two delegated identities.

**Will Microsoft block my app for repeated throttling?** Sustained, abusive retry patterns can lead to extended cooldowns and, in extreme cases, app-level blocks. Honoring `Retry-After` and capping retries is the contract that keeps you on the right side of this.

---

## Next Steps

A throttle-resilient Graph client is the foundation. The next two layers to add on top are *fewer calls* and *push instead of pull*. For the first, the [Microsoft Graph $batch Requests Guide (2026)](/blog/microsoft-graph-batch-requests-combine-api-calls-2026) is the highest-leverage change you can make — bundle calls and the throttle pressure drops linearly. For the second, swap polling for [Change Notifications Webhooks (2026)](/blog/microsoft-graph-change-notifications-webhooks-guide-2026) so Graph tells you when something changed instead of you asking constantly.

If you are building inside SharePoint Framework and want batched, throttle-aware data fetching out of the box, the [Microsoft Graph Toolkit: Build M365-Powered Web Apps Guide (2026)](/blog/microsoft-graph-toolkit-web-apps-guide-2026) covers the providers and components that already do most of this work for you.

429s never disappear from a real Microsoft Graph integration — at scale, you will always see some baseline rate. The goal is not zero throttling. It is throttling that does not become an outage. A retry wrapper that respects `Retry-After`, a cache layer that absorbs 80% of reads, batched calls for everything else, and the right auth shape for the workload — that is the kit that keeps your dashboard rendering in 200 ms even at 9:05 on a Monday morning.
