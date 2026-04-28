---
title: "Microsoft Graph Delta Query: Incremental Sync Guide (2026)"
slug: microsoft-graph-delta-query-incremental-sync-2026
excerpt: "Sync mail, drives, users, and groups efficiently with Microsoft Graph delta queries. Token handling, pagination, error recovery, and 2026 production patterns."
date: "2026-04-28T09:00:00.000Z"
displayDate: "April 28, 2026"
readTime: "12 min read"
category: "Graph API"
image: "/images/blog/microsoft-graph-delta-query-incremental-sync-2026.png"
tags:
  - "Microsoft Graph"
  - "Delta Query"
  - "Incremental Sync"
  - "Microsoft 365"
  - "Azure Functions"
  - "2026"
---

## Why Delta Query Beats Re-Reading Everything

If your integration sweeps Microsoft Graph on a schedule and re-fetches the entire mailbox, drive, or user directory just to find what changed, you are paying for the same data over and over. A 50,000-user tenant returns about 12 MB on each `/users` page, and Graph throttles you long before you have read the lot. Worse, you still cannot tell which records were *deleted*, because deletes leave nothing behind to fetch.

Delta query fixes both problems. You ask Graph "what has changed since the last time I synced?" and Graph returns only created, updated, and deleted items, paged with a token you carry between runs. The first call is a full sync. Every subsequent call returns deltas — usually a handful of rows, usually under a second, and crucially with `@removed` markers for hard-deletes.

This guide walks through delta query end to end: which resources support it, how to handle the initial sync versus incremental rounds, the right way to persist `deltaLink` and `nextLink` tokens, and the failure modes that bite people in production. Code samples are Node/TypeScript with the official `@microsoft/microsoft-graph-client` SDK; the same patterns translate cleanly to .NET, Python, or raw HTTP.

---

## Resources That Support Delta Query

Delta is opt-in per resource. As of early 2026, the resources with stable delta support are:

- **Outlook mail** — `/me/messages/delta`, `/me/mailFolders/{id}/messages/delta`, `/me/mailFolders/delta`
- **Outlook calendar** — `/me/calendarView/delta` (note the time-range requirement)
- **Outlook contacts** — `/me/contactFolders/{id}/contacts/delta`
- **OneDrive and SharePoint drives** — `/drives/{id}/root/delta`, `/sites/{site-id}/drives/{drive-id}/root/delta`
- **Users and groups** — `/users/delta`, `/groups/delta`, `/groups/{id}/members/delta`
- **Directory objects** — `/directoryObjects/delta`, `/applications/delta`, `/servicePrincipals/delta`
- **Planner and To Do** — `/planner/plans/{id}/tasks/delta`, `/me/todo/lists/{id}/tasks/delta`
- **Teamwork** — `/teams/{id}/channels/{id}/messages/delta`

Some endpoints only return certain change types. `/users/delta`, for example, will surface deletes via `@removed: { reason: "deleted" }`, but `/me/messages/delta` only marks a message as removed when it leaves the mail folder you subscribed to (moves count as removals from the source folder).

If you need real-time push instead of pull, see [Microsoft Graph Change Notifications: Real-Time Webhooks Guide (2026)](/blog/microsoft-graph-change-notifications-webhooks-guide-2026). Delta query is best when you tolerate seconds-to-minutes latency and need a complete, gap-free record of changes; webhooks are best for instant reaction with at-least-once delivery.

---

## The Token Lifecycle

Delta query has two tokens, and confusing them is the most common bug I see:

- **`@odata.nextLink`** — the next page of the *current* sync round. The URL has a `$skiptoken=...`. Use it immediately to keep paging until it disappears.
- **`@odata.deltaLink`** — the bookmark for the *next* sync round. The URL has a `$deltatoken=...`. Persist it. The next time you sync, call this URL instead of starting over.

Round one looks like this:

```
GET /users/delta
  -> page 1 with nextLink (skiptoken)
  -> page 2 with nextLink (skiptoken)
  -> page 3 with deltaLink   <- save this
```

Round two looks like this:

```
GET <deltaLink from round one>
  -> page 1 with deltaLink   <- save the new one
```

The deltaLink is opaque. Do not parse it, do not regenerate it, and do not assume it is short. Some tenants produce deltaLinks well over 2 KB. Store it as text, not in a column with an index limit.

---

## Step 1: The Initial Sync

A first-time call has no deltaLink yet, so you start at the resource path with `?$select=` for the fields you actually want:

```ts
import { Client } from "@microsoft/microsoft-graph-client";

const graphClient = Client.initWithMiddleware({ authProvider });

async function initialUserSync() {
  let response = await graphClient
    .api("/users/delta")
    .select("id,displayName,userPrincipalName,mail,accountEnabled")
    .get();

  const allUsers: any[] = [];

  while (response) {
    if (response.value) {
      allUsers.push(...response.value);
    }

    if (response["@odata.nextLink"]) {
      response = await graphClient.api(response["@odata.nextLink"]).get();
    } else if (response["@odata.deltaLink"]) {
      await persistDeltaLink("users", response["@odata.deltaLink"]);
      break;
    } else {
      break;
    }
  }

  return allUsers;
}
```

A few things worth flagging:

- **`$select` is not optional in production.** Without it, `/users/delta` returns the full user shape — over 50 fields, many of them empty for most accounts — and your sync becomes a heavy network read for no reason.
- **`$top` is honored on the first request only.** After that, Graph picks the page size for you. Do not assume your `$top=999` will hold across pages.
- **Mailbox delta requires `$select`.** Calling `/me/messages/delta` without `$select` errors with `Selecting at least one property is required for change tracking on this resource`.
- **`$filter` is restricted.** Only a small subset of fields supports filtering inside delta query, and adding an unsupported filter silently returns zero results in some cases. Check the docs per resource before relying on `$filter`.

Once `initialUserSync` returns, you have a baseline. Persist your records, then schedule the next round.

---

## Step 2: The Incremental Round

Round two and beyond start from the saved deltaLink. The shape is the same, but the SDK's high-level builder cannot consume an arbitrary URL — you pass the full deltaLink to `.api()`:

```ts
async function incrementalUserSync() {
  const deltaLink = await loadDeltaLink("users");

  if (!deltaLink) {
    return initialUserSync();
  }

  let response = await graphClient.api(deltaLink).get();
  const changes: { upserts: any[]; removes: string[] } = {
    upserts: [],
    removes: [],
  };

  while (response) {
    for (const item of response.value ?? []) {
      if (item["@removed"]) {
        changes.removes.push(item.id);
      } else {
        changes.upserts.push(item);
      }
    }

    if (response["@odata.nextLink"]) {
      response = await graphClient.api(response["@odata.nextLink"]).get();
    } else if (response["@odata.deltaLink"]) {
      await persistDeltaLink("users", response["@odata.deltaLink"]);
      break;
    } else {
      break;
    }
  }

  await applyChanges(changes);
}
```

The `@removed` flag is your authoritative delete signal. Do not infer deletion from "I expected this id and it is missing" — Graph does not guarantee that every unchanged item is omitted; it only guarantees that every changed item is included. The set of items you receive is a superset of the changes, never a subset.

For `/users/delta`, `@removed.reason` is either `"deleted"` (hard delete or removed from tenant) or `"changed"` (rare, but used for tenant-level filter changes). For `/drives/.../delta`, `@removed.reason` is `"deleted"`. For mail, the absence of an item from a folder's delta means it was moved or deleted — you cannot tell which from the delta alone, and that is by design.

---

## Step 3: Handling Token Invalidation

Deltatokens expire. If you sit on a token long enough, Graph returns `410 Gone` with `code: syncStateNotFound`. The fix is simple but you have to recognize the signal:

```ts
async function safeIncrementalSync(resource: "users" | "drive") {
  try {
    return await incrementalUserSync();
  } catch (err: any) {
    const status = err?.statusCode ?? err?.response?.status;
    const code = err?.code ?? err?.body?.error?.code;

    if (status === 410 || code === "syncStateNotFound" || code === "syncStateInvalid") {
      console.warn(`Delta token invalid for ${resource}, falling back to full sync`);
      await clearDeltaLink(resource);
      return initialUserSync();
    }

    throw err;
  }
}
```

Treat the full-sync fallback as routine, not an emergency. Tokens go stale during long outages, after major tenant changes (a domain rename, for example), and occasionally for no reason that Microsoft will own up to. Build the fallback path the day you build the happy path.

The flip side: do not rebuild from scratch on *any* error. Transient `429`, `503`, and `504` responses do not invalidate the token. Retry with exponential backoff and keep using the same deltaLink. For a deeper look at retry policy across Graph, see [Master Graph API Authentication](/blog/microsoft-graph-api-authentication-guide), which covers the same retry framework that delta callers should reuse.

---

## Step 4: Drive Items, the Pagination Edge Case

Drive item delta has a quirk that catches everyone the first time. The endpoint is `/drives/{id}/root/delta`, and during a page-heavy sync you can receive *both* a `nextLink` and a `deltaLink` on the same page. The official guidance is:

- If a response has a `nextLink`, follow it. Save the deltaLink only from a response that has *no* `nextLink`.
- Some intermediate pages will surface a deltaLink early — ignore it; the canonical bookmark is the one on the final page.

```ts
async function syncDrive(driveId: string) {
  const stored = await loadDeltaLink(`drive:${driveId}`);
  const startUrl = stored ?? `/drives/${driveId}/root/delta`;

  let response = await graphClient
    .api(startUrl)
    .select("id,name,size,deleted,parentReference,file,folder")
    .get();

  while (true) {
    for (const item of response.value ?? []) {
      if (item.deleted) {
        await markDriveItemDeleted(driveId, item.id);
      } else {
        await upsertDriveItem(driveId, item);
      }
    }

    if (response["@odata.nextLink"]) {
      response = await graphClient.api(response["@odata.nextLink"]).get();
      continue;
    }

    if (response["@odata.deltaLink"]) {
      await persistDeltaLink(`drive:${driveId}`, response["@odata.deltaLink"]);
    }
    break;
  }
}
```

Note that drive items signal deletion via `item.deleted`, not `@removed`. This is one of the asymmetries between resources — every endpoint has its own delete shape.

Also worth knowing: drive delta returns one entry per item per change, but it folds rapid edits. If a user renamed a file, then renamed it again, then moved it, you will see one entry with the final state — not three.

---

## Step 5: Mail, Folder-Scoped Delta

Mail delta is per-folder. Calling `/me/messages/delta` is supported but returns only changes in the Inbox; to track Sent Items, Drafts, or a custom folder, hit `/me/mailFolders/{id}/messages/delta`. Each folder needs its own deltaLink.

```ts
async function syncMailFolder(userId: string, folderId: string) {
  const key = `mail:${userId}:${folderId}`;
  const stored = await loadDeltaLink(key);
  const startUrl = stored ?? `/users/${userId}/mailFolders/${folderId}/messages/delta`;

  let response = await graphClient
    .api(startUrl)
    .select("id,subject,from,receivedDateTime,isRead,bodyPreview")
    .get();

  while (true) {
    for (const message of response.value ?? []) {
      if (message["@removed"]) {
        await markMessageRemoved(userId, message.id);
      } else {
        await upsertMessage(userId, folderId, message);
      }
    }

    if (response["@odata.nextLink"]) {
      response = await graphClient.api(response["@odata.nextLink"]).get();
    } else {
      if (response["@odata.deltaLink"]) {
        await persistDeltaLink(key, response["@odata.deltaLink"]);
      }
      break;
    }
  }
}
```

A subtle gotcha: a message moved between folders shows up as `@removed` in the source folder's delta and as a fresh upsert in the destination folder's delta — but only if you are tracking both folders. If you only sync the Inbox, a move to Archive looks identical to a delete. Keep that in mind when reconciling state.

---

## Common Pitfalls

A short list of the failure modes I see most often:

- **Persisting only `nextLink`.** `nextLink` is a within-round bookmark. If your job crashes mid-round and you stored `nextLink` but not the deltaLink from the previous round, you cannot recover safely — the only correct move is a full re-sync. Always persist the *previous* round's deltaLink before you start a new round, and only overwrite it when the new round completes.
- **Re-using a deltaLink from a different `$select`.** Adding fields to your `$select` between rounds is allowed, but Graph treats the new selection as a different sync. The deltaLink keeps working, but new fields are populated only on items that change after the selection change. Plan a one-time full re-sync when you broaden `$select`.
- **Assuming sequential delivery.** Within a folder or drive, ordering is loose. Two updates to the same item can arrive in either order during heavy churn. Always upsert by the item's `lastModifiedDateTime`, not by the order you received the rows in.
- **Hammering the endpoint.** Delta query is not throttle-exempt. Run incremental rounds on a sane cadence (1-15 minutes is typical), back off on `429`, and never run two parallel rounds for the same resource — the second one usually invalidates the first.
- **Storing tokens unencrypted.** A deltaLink contains tenant-identifying material and a long-lived sync handle. Treat it like a refresh token: encrypt at rest, scope access narrowly, rotate when the sync owner changes.

---

## When Not to Use Delta

Delta query is the right answer for "give me everything that changed since I last asked." It is the wrong answer for:

- **Real-time UI.** If a user is staring at a screen waiting for a status change, use change notifications and stream the event. Delta is a poll.
- **Historical reporting.** Delta does not retain history — it only tells you the current state. Pair it with an audit table you populate on each sync round if you need a trail.
- **One-shot exports.** If you need a snapshot for a compliance report and will never sync again, a flat `/users?$top=999` paginated dump is simpler.

For broader context on when each Graph pattern applies, see [Microsoft Graph Connectors: Index External Content for Copilot and Microsoft Search (2026)](/blog/microsoft-graph-connectors-copilot-search-guide-2026), which uses delta on the consumer side once the connector has indexed external data.

---

## Wrapping Up

Delta query is the cheapest way to keep an external system in sync with Microsoft 365 — when you respect the contract. Persist the deltaLink, treat `@removed` as the authoritative delete signal, retry transient errors without rebuilding, and handle the inevitable `410 Gone` with a clean full-sync fallback. Build all four paths the first time, and your sync job will run for years without manual intervention.

If you are wiring this into a SharePoint Framework solution or a Teams app, [Fetch M365 User Profiles in SPFx using the Graph API](/blog/microsoft-graph-api-spfx-user-profiles-teams) shows the auth handoff inside the SPFx context, and [Microsoft Graph API: OAuth 2.0 and App Permissions Guide](/blog/microsoft-graph-api-oauth2-guide) covers the consent and permission scopes you will need for `/users/delta`, `/groups/delta`, and the various mailbox endpoints.

Hit a delta corner case I missed? Drop me a message on LinkedIn — I am collecting edge cases for a follow-up post on syncing across multiple tenants.
