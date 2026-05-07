---
title: "Microsoft Graph Large File Uploads in 2026: Resumable Uploads with createUploadSession"
slug: microsoft-graph-large-file-uploads-upload-session-2026
excerpt: "Upload large files to OneDrive and SharePoint via Microsoft Graph with createUploadSession — chunking, resume, retries, conflict handling, and production patterns."
date: "2026-05-07T09:00:00.000Z"
displayDate: "May 7, 2026"
readTime: "13 min read"
category: "Graph API"
image: "/images/blog/microsoft-graph-large-file-uploads-upload-session-2026.png"
tags:
  - "Microsoft Graph"
  - "OneDrive"
  - "SharePoint"
  - "File Upload"
  - "REST API"
  - "2026"
---

## Why Simple PUT Stops Working at 4 MB

The first time most developers upload a file with Microsoft Graph, they reach for the obvious endpoint:

```http
PUT /drives/{drive-id}/items/{parent-id}:/{filename}:/content
```

It works beautifully — until someone uploads a PDF larger than 4 MB and the request returns `413 Payload Too Large` or, worse, hangs at 99% on a flaky office Wi-Fi connection and silently truncates. That 4 MB ceiling is not a soft suggestion. It is a hard limit baked into the simple-upload endpoint, and any file larger than that needs the resumable upload protocol via `createUploadSession`.

Resumable uploads are also the only sane choice for anything you actually care about getting all the way to OneDrive or SharePoint Embedded. Networks drop. Laptops sleep. Browsers throttle background tabs. A 1.2 GB Teams meeting recording or a 400 MB CAD model uploaded in one HTTP request will fail enough of the time that "upload from scratch" is not an acceptable retry strategy. Upload sessions let you slice the file into chunks, send them serially, and resume from the last successful byte if anything goes wrong — exactly what every desktop sync client does under the hood.

This guide is the practical 2026 walkthrough: how the protocol actually works, the chunk sizes and timing that survive contact with reality, conflict handling that does not silently overwrite the wrong file, retry logic that respects throttling, and the SDK helpers that make all of this pleasant in TypeScript and .NET. Everything has been verified against the current `v1.0` Graph endpoint behavior.

---

## How createUploadSession Actually Works

The protocol is three steps. The hard parts hide in step two.

**Step 1.** You POST to `createUploadSession` for the target item. Graph responds with an `uploadUrl` — a temporary, pre-authenticated URL good for about an hour — plus an expiration timestamp. No bytes have moved yet.

```http
POST /drives/{drive-id}/items/{parent-id}:/{filename}:/createUploadSession
Authorization: Bearer eyJ0eXAi...
Content-Type: application/json

{
  "item": {
    "@microsoft.graph.conflictBehavior": "rename",
    "name": "quarterly-report.pdf"
  }
}
```

A successful response looks like:

```json
{
  "uploadUrl": "https://api.onedrive.com/rup/abcd1234...",
  "expirationDateTime": "2026-05-07T10:14:23.000Z",
  "nextExpectedRanges": ["0-"]
}
```

**Step 2.** You PUT the file content to that `uploadUrl` in chunks. Each chunk carries a `Content-Range` header telling the service which bytes it contains and how big the whole file is. Graph responds with the next range it expects, so you always know where to pick up.

**Step 3.** When the last chunk lands, Graph returns the finished `driveItem` with its real ID, `webUrl`, `eTag`, and metadata. The session URL becomes invalid immediately — you cannot replay it. If you need to upload again, create a fresh session.

The reason this works for resume is that the `uploadUrl` itself is the state. As long as you still have that URL and it has not expired, you can reissue a GET against it to ask "what bytes do you have?" and Graph will tell you in `nextExpectedRanges`. Persist the URL somewhere durable (a database row keyed to your upload job) and you can resume after a process restart or a user closing the tab.

Crucially, the `uploadUrl` is **already authenticated**. You do not — and must not — send the `Authorization` header on the chunk PUTs. Sending it anyway will not break the upload, but it does leak your access token to a different host (`api.onedrive.com` for personal OneDrive, `*.sharepoint.com` for work and school) than the one it was issued for. Strip it.

---

## Picking the Right Chunk Size

Graph's documentation says chunks must be a multiple of **320 KiB** (327,680 bytes), with a recommended size of **5 MiB to 10 MiB** for most scenarios and a hard ceiling of **60 MiB** per chunk. Those are not arbitrary numbers — they line up with the underlying storage's stripe size, and using a non-multiple of 320 KiB will get you a `400 Bad Request` with a cryptic error.

The sweet spot in 2026, on a typical corporate connection, is **10 MiB** chunks. Here is the rough trade-off:

- **Smaller chunks (320 KiB to 1 MiB)** — better for very poor connections (mobile, hotel Wi-Fi). A failed chunk costs you less. But you pay per-request overhead 50× more often, and you are far more likely to hit throttling on a multi-gigabyte upload.
- **Medium chunks (5 to 10 MiB)** — the default for most apps. Fast on good networks, recoverable enough on bad ones.
- **Large chunks (32 to 60 MiB)** — only worth it on a fat, stable pipe (datacenter to datacenter, server-side migrations). On any consumer network the failure rate per chunk gets ugly.

A safe compute:

```ts
const CHUNK_MULTIPLE = 320 * 1024;          // 327,680 bytes
const TARGET_CHUNK_SIZE = 10 * 1024 * 1024; // 10 MiB

function pickChunkSize(): number {
  // Round target down to nearest 320 KiB multiple.
  return Math.floor(TARGET_CHUNK_SIZE / CHUNK_MULTIPLE) * CHUNK_MULTIPLE;
}
```

Do not vary the chunk size mid-upload unless you have a reason to. Graph does not require constant chunk sizes, but mixing them makes resume math harder to reason about.

---

## A Working TypeScript Implementation

Here is an end-to-end uploader using `fetch` and the official `@microsoft/microsoft-graph-client` for session creation. The chunk loop is hand-rolled because it is short and you almost always want to customize the progress and retry behavior.

```ts
import { Client } from "@microsoft/microsoft-graph-client";

interface UploadSession {
  uploadUrl: string;
  expirationDateTime: string;
}

interface ChunkResponse {
  nextExpectedRanges?: string[];
  id?: string;
  webUrl?: string;
}

const CHUNK_SIZE = 10 * 1024 * 1024; // 10 MiB

export async function uploadLargeFile(
  graph: Client,
  driveId: string,
  parentItemId: string,
  fileName: string,
  fileBytes: Uint8Array,
  onProgress?: (uploaded: number, total: number) => void,
): Promise<{ id: string; webUrl: string }> {
  // 1. Create the session.
  const session: UploadSession = await graph
    .api(`/drives/${driveId}/items/${parentItemId}:/${encodeURIComponent(fileName)}:/createUploadSession`)
    .post({
      item: {
        "@microsoft.graph.conflictBehavior": "rename",
        name: fileName,
      },
    });

  const total = fileBytes.byteLength;
  let offset = 0;

  // 2. Upload chunks serially.
  while (offset < total) {
    const end = Math.min(offset + CHUNK_SIZE, total);
    const chunk = fileBytes.slice(offset, end);
    const contentRange = `bytes ${offset}-${end - 1}/${total}`;

    const res = await fetch(session.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Length": String(chunk.byteLength),
        "Content-Range": contentRange,
        // NO Authorization header — uploadUrl is pre-authenticated.
      },
      body: chunk,
    });

    if (res.status === 202) {
      // More chunks expected.
      const body: ChunkResponse = await res.json();
      offset = nextOffsetFromRanges(body.nextExpectedRanges, end);
      onProgress?.(offset, total);
      continue;
    }

    if (res.status === 200 || res.status === 201) {
      // Final chunk — Graph returns the finished driveItem.
      const item: ChunkResponse = await res.json();
      onProgress?.(total, total);
      return { id: item.id!, webUrl: item.webUrl! };
    }

    if (res.status === 429 || res.status >= 500) {
      // Transient — caller should retry the same offset.
      const retryAfter = Number(res.headers.get("Retry-After") ?? "5");
      await sleep(retryAfter * 1000);
      continue;
    }

    throw new Error(`Chunk PUT failed: ${res.status} ${await res.text()}`);
  }

  throw new Error("Upload finished loop without final response");
}

function nextOffsetFromRanges(ranges: string[] | undefined, fallback: number): number {
  if (!ranges || ranges.length === 0) return fallback;
  const first = ranges[0]; // e.g. "10485760-"
  const dash = first.indexOf("-");
  return Number(first.slice(0, dash));
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}
```

A few details worth calling out. The `Content-Range` header uses **inclusive end bytes**, so a 10 MiB chunk starting at offset 0 ends at byte `10485759`, not `10485760`. Off-by-one mistakes here are the single most common cause of "my chunks upload but the file is corrupted" support tickets. The total size at the end (`/{total}`) must be the same on every chunk and must match the actual final size — Graph rejects mismatches.

The `onProgress` callback fires after each successful chunk, which is exactly the right granularity for a UI progress bar. Do not try to compute progress from bytes sent before the server acknowledges them; a partial chunk that fails mid-flight is not progress.

---

## Resuming After a Failure

If your process dies or the user closes the tab, you can resume as long as (a) you persisted the `uploadUrl` and (b) it has not expired (typically 1 hour after creation, sometimes longer for active sessions).

```ts
export async function resumeUpload(
  uploadUrl: string,
  fileBytes: Uint8Array,
): Promise<{ id: string; webUrl: string }> {
  // GET the session to find out what bytes the server has.
  const status = await fetch(uploadUrl, { method: "GET" });
  if (status.status === 404) {
    throw new Error("Upload session expired or canceled — start a new one");
  }
  const { nextExpectedRanges } = (await status.json()) as ChunkResponse;
  const offset = nextOffsetFromRanges(nextExpectedRanges, 0);

  // Continue from `offset` with the same chunk loop as a fresh upload.
  return continueUpload(uploadUrl, fileBytes, offset);
}
```

Two practical notes. First, the session URL is sensitive: anyone who has it can write to the eventual file location until it expires. Treat it like an access token — do not log it, do not put it in URLs, and store it encrypted at rest. Second, if the GET for status returns `404`, the session is gone for good. There is no "extend session" call; you must create a new one and start over. Do not retry the GET in a loop hoping it comes back.

---

## Conflict Behavior — the One Setting Most Apps Get Wrong

The `@microsoft.graph.conflictBehavior` field on the create-session call has three values, and the difference between them is the difference between a happy user and a data-loss incident.

**`fail`** — if a file with that name already exists, the upload fails with `409 Conflict` before any bytes move. Use this for "must not overwrite" workflows like archival, where uploading on top of an existing item would be a bug.

**`replace`** — overwrites the existing item, **preserving its driveItem ID**. This is the right choice when you genuinely want a new version of the same file (collaborative editing flows, document management). A common mistake: assuming `replace` creates a new item with a new ID. It does not. The ID is stable, which is exactly what you want for sharing links and citations to keep working.

**`rename`** — if the name is taken, Graph appends a numeric suffix like `quarterly-report 1.pdf`. Use this for user-driven uploads where two unrelated files happening to share a name should not collide. The name in the response will tell you what it actually got named.

The default if you omit the field is `fail`. That is rarely what you want. Always set it explicitly.

If you are uploading for a feature that needs versioning, `replace` is correct — Graph preserves the version history on the existing driveItem, so the previous content is recoverable through `/versions`. You do not need to manage versioning yourself; the storage does it.

---

## Throttling, Retries, and the One Header That Saves You

Graph throttles. It throttles harder than most newcomers expect, and the symptoms during a large upload are unpleasant: `429 Too Many Requests` partway through chunk 47 of 120, with a `Retry-After` header telling you to wait 30 seconds.

The contract is simple but strict: when you see `429` or any `5xx` response on a chunk, **do not move on**. Resend the same chunk after waiting at least the `Retry-After` value. Graph does not penalize honest retries that respect the header; it does penalize hammering. Burning through three retries in a tight loop on a `429` will get you a much longer cool-off period.

For production code, wrap the chunk PUT in an exponential-backoff retry with a jittered delay capped at the `Retry-After` value:

```ts
async function putChunkWithRetry(
  url: string,
  chunk: Uint8Array,
  contentRange: string,
  maxAttempts = 5,
): Promise<Response> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Length": String(chunk.byteLength),
        "Content-Range": contentRange,
      },
      body: chunk,
    });

    if (res.status < 500 && res.status !== 429) return res;

    const retryAfter = Number(res.headers.get("Retry-After") ?? "0");
    const backoff = retryAfter > 0
      ? retryAfter * 1000
      : Math.min(1000 * 2 ** attempt + Math.random() * 500, 60_000);
    await new Promise(r => setTimeout(r, backoff));
  }
  throw new Error("Chunk PUT exhausted retries");
}
```

This is the same pattern that covers `$batch` requests and any other long-running Graph operation — see the [Microsoft Graph throttling guide](/blog/microsoft-graph-throttling-survive-429-retry-backoff-2026) for the deeper background on what triggers throttling and how to avoid it before it bites.

---

## Common Pitfalls

A short tour of the mistakes that have eaten the most engineering hours, in rough order of frequency.

**Sending the Authorization header on chunk PUTs.** As mentioned above, the `uploadUrl` is pre-authenticated. Many SDKs add `Authorization` automatically; you must strip it for the chunk requests. Forgetting this leaks tokens to OneDrive's storage hosts.

**Wrong Content-Range math.** End byte is inclusive. Total is the full file size, not the chunk size. Three values, three places to be off by one. When in doubt, log every `Content-Range` header you send for the first failing upload.

**Chunk size not a multiple of 320 KiB.** This produces a `400 Bad Request` with an error like `invalidRange`. Round down, never up.

**Treating the uploadUrl as low-sensitivity.** It bypasses your auth. Treat it like a bearer token: encrypted at rest, not logged, not in URLs.

**Not handling nextExpectedRanges properly on resume.** Graph can return multiple ranges if there are gaps (rare, but possible). Always fill from the first range's start.

**Uploading sequentially when you have many small files.** Upload sessions are for **one** large file. If you have 200 PDFs that are each 2 MB, do 200 simple PUTs (or better, use [Graph $batch requests](/blog/microsoft-graph-batch-requests-combine-api-calls-2026) where applicable). Upload sessions add overhead that is wasted on small files.

**Forgetting to URL-encode the filename.** Filenames with spaces, commas, or non-ASCII characters need encoding in the path. The session creation will silently succeed and then the resulting file will have the wrong name.

**Assuming sessions can be paused indefinitely.** They cannot. The expiration is real. Build your resume logic around "we have one hour, then start over" rather than "this session is forever."

---

## When to Use the SDK's Built-in Uploader Instead

For most apps, you do not need to write the chunk loop yourself. The official SDKs ship with helpers that handle the protocol correctly:

- **`@microsoft/microsoft-graph-client`** ships with a `LargeFileUploadTask` class that handles chunking, progress, and retries. Pass it a stream and a session and it does the rest.
- **Microsoft Graph .NET SDK** (`Microsoft.Graph` v5+) has `LargeFileUploadTask<DriveItem>` with the same shape. Cancellation tokens are supported, so wiring this up to an ASP.NET Core background job is straightforward.
- **Microsoft Graph PowerShell SDK** abstracts uploads behind the same cmdlets used for everything else — see the [PowerShell SDK guide](/blog/microsoft-graph-powershell-sdk-guide-2026) for examples.

Roll your own when you need (a) custom progress reporting that the SDK does not expose, (b) parallel chunked uploads (only useful for very large files on very fast networks, and even then only if you serialize the order on the wire — Graph itself accepts chunks in order), or (c) resume across processes that the SDK cannot persist for you.

---

## Putting It Together

The recipe that has held up well across production deployments looks like this. Use the SDK's `LargeFileUploadTask` for in-process uploads where the user is sitting in front of the UI; roll your own loop when you need to persist the session URL to durable storage and resume across restarts. Use **10 MiB chunks** unless you have measured a reason to vary. Set `conflictBehavior` explicitly — `replace` for versioning workflows, `rename` for user uploads, `fail` for archival. Strip the `Authorization` header from chunk PUTs. Honor `Retry-After`. Persist the `uploadUrl` somewhere durable for any upload that takes longer than a coffee break.

Done correctly, `createUploadSession` is one of the most reliable upload protocols in any major cloud storage API. Done lazily, it is the source of mysterious 1% data loss that surfaces six months after launch. Pick the boring, careful path the first time and the file uploads will quietly never come up in a postmortem again.

For the broader picture of working with the Graph API, the [Graph $batch guide](/blog/microsoft-graph-batch-requests-combine-api-calls-2026) covers bundling many small operations efficiently, and the [Graph throttling guide](/blog/microsoft-graph-throttling-survive-429-retry-backoff-2026) covers the rate-limiting rules that govern this and every other Graph endpoint. If you are wiring auth for the first time, start with the [Graph API authentication guide](/blog/microsoft-graph-api-authentication-guide).
