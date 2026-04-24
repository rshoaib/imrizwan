---
title: "Microsoft Graph Change Notifications: Real-Time Webhooks Guide (2026)"
slug: microsoft-graph-change-notifications-webhooks-guide-2026
excerpt: "Subscribe to Microsoft Graph change notifications and react to mailbox, drive, and Teams events in real time. Full webhook setup, validation, and lifecycle handling."
date: "2026-04-24T09:00:00.000Z"
displayDate: "April 24, 2026"
readTime: "12 min read"
category: "Graph API"
image: "/images/blog/microsoft-graph-change-notifications-webhooks-guide-2026.png"
tags:
  - "Microsoft Graph"
  - "Change Notifications"
  - "Webhooks"
  - "Azure Functions"
  - "Microsoft 365"
  - "Event-Driven"
---

## Why Change Notifications Beat Polling

If your integration polls Microsoft Graph on a timer, you are burning throttling budget, adding latency, and still missing events. Polling every five minutes means a worst-case five-minute delay on every message, file upload, or calendar change — and twelve calls per hour even when nothing happens.

Microsoft Graph change notifications (the feature you may still hear called "Graph webhooks") invert that model. You subscribe to a resource once, and Graph calls your endpoint the moment something changes. Your code runs on the event, not the clock. Throttling goes away, the end-to-end latency collapses to under a second, and your logs show only real activity.

This guide walks through a production-grade subscription lifecycle end to end: creating a subscription, handling the validation handshake, processing notifications, renewing before expiry, and decrypting the resource payload when you need the actual changed data. Code samples target Node/TypeScript with Azure Functions, which is the shortest path to a working endpoint in 2026.

---

## What You Can Subscribe To

Change notifications are not available on every Graph resource. As of early 2026, the resources with the broadest support are:

- **Outlook mail** — `/me/messages`, `/users/{id}/messages`, `/users/{id}/mailFolders/{id}/messages`
- **Outlook calendar** — `/me/events`, `/users/{id}/events`
- **Outlook contacts** — `/me/contacts`
- **OneDrive and SharePoint drive items** — `/drives/{id}/root`, `/sites/{site-id}/drives/{drive-id}/root`
- **Teams chats and channels** — `/chats/{id}/messages`, `/teams/{id}/channels/{id}/messages`, `/communications/callRecords`
- **Users, groups, and directory objects** — `/users`, `/groups`, `/groups/{id}/members`
- **Print jobs, security alerts, and to-do tasks**

Each resource has its own maximum subscription lifetime — from about 60 minutes for Teams messages to 30 days for mail and directory objects. You need to renew before the expiry, which I will cover below.

For a working reference on Graph authentication and app registration, see [Master Graph API Authentication](/blog/microsoft-graph-api-authentication-guide) and [Microsoft Graph API: OAuth 2.0 and App Permissions Guide](/blog/microsoft-graph-api-oauth2-guide).

---

## The Notification Flow at a High Level

A single subscription flows through four phases:

1. **Create** — your app POSTs a subscription to `/subscriptions` with a resource, a `changeType`, a `notificationUrl`, and an `expirationDateTime`.
2. **Validate** — Graph immediately sends a GET to your notification URL with a `validationToken` query parameter. You have 10 seconds to echo it back as plain text.
3. **Notify** — whenever the resource changes, Graph POSTs a JSON payload to your endpoint. You respond with a `202 Accepted` within 3 seconds and do the real work in the background.
4. **Renew** — before the `expirationDateTime`, your app PATCHes the subscription with a new expiry. Miss the window and you have to recreate from scratch (and you will miss any events between expiry and recreation).

Every phase has a failure mode that people hit in production. I will walk through each one.

---

## Step 1: Create the Subscription

First, your notification endpoint must be publicly reachable over HTTPS before you create the subscription. Graph validates the URL immediately, and if the handshake fails your POST returns `400 Bad Request`. For local development use a tunnel like `ngrok`, Dev Tunnels, or the Azure Functions Core Tools dev loop — do not try to test from localhost without a tunnel.

Here is the minimum payload for a mail subscription:

```ts
import { Client } from "@microsoft/microsoft-graph-client";

const graphClient = Client.initWithMiddleware({ authProvider });

const subscription = await graphClient
  .api("/subscriptions")
  .post({
    changeType: "created,updated",
    notificationUrl: "https://notifications.contoso.com/api/graph-webhook",
    resource: "/users/alex@contoso.com/mailFolders('Inbox')/messages",
    expirationDateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    clientState: "a-secret-you-generate-and-verify-later"
  });

console.log("Subscription id:", subscription.id);
```

A few details that matter more than they look:

- **`changeType`** is a comma-separated list of `created`, `updated`, and `deleted`. Pick the narrowest set that satisfies your use case — you pay in notification volume for every type you include.
- **`clientState`** is an opaque string you define. Graph echoes it back in every notification. Use it to verify that incoming calls are actually from your subscription and not a spoofing attempt.
- **`expirationDateTime`** must be ISO 8601 with a `Z` suffix (UTC). Set it to the resource's maximum allowed lifetime minus a safety margin of a few minutes.
- **Application permissions** on `/users/{id}/messages` require `Mail.Read` granted with admin consent. Delegated permissions require the signed-in user to match the resource.

If you are running under application permissions, [Microsoft Graph API: OAuth 2.0 and App Permissions Guide](/blog/microsoft-graph-api-oauth2-guide) covers the client credentials flow you will need.

---

## Step 2: Handle the Validation Handshake

When Graph receives your POST, it immediately sends a GET to the `notificationUrl` with a `validationToken` query parameter. You have exactly 10 seconds to respond with:

- HTTP status `200 OK`
- Content-Type `text/plain`
- Body containing only the decoded validation token

Here is an Azure Function handler in TypeScript that gets this right:

```ts
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function graphWebhook(
  req: HttpRequest,
  ctx: InvocationContext
): Promise<HttpResponseInit> {
  // Validation handshake — Graph calls GET with validationToken
  const validationToken = req.query.get("validationToken");
  if (validationToken) {
    return {
      status: 200,
      headers: { "Content-Type": "text/plain" },
      body: validationToken
    };
  }

  // Otherwise, this is a real notification (see Step 3)
  return await handleNotification(req, ctx);
}

app.http("graphWebhook", {
  route: "graph-webhook",
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: graphWebhook
});
```

The pitfalls here are always the same. If you serialize the body as JSON, Graph's validator sees quotes around the token and rejects it. If your framework auto-sets `Content-Type: application/json`, same problem. If your app takes more than 10 seconds to cold-start, the handshake times out and `POST /subscriptions` returns an error with no useful detail. Pre-warm the function or use a consumption plan with an always-on setting for production traffic.

---

## Step 3: Receive and Acknowledge Notifications

Once the subscription is active, Graph POSTs a JSON body whenever the resource changes. The shape looks like this:

```json
{
  "value": [
    {
      "subscriptionId": "0fc0d6a0-6a1e-4c4b-8d7e-6d1c8b8a1f2c",
      "subscriptionExpirationDateTime": "2026-04-24T10:00:00.000Z",
      "changeType": "created",
      "resource": "Users/8b9d1e4a-9c0a-4d8e-a4b1-4a7f2b3d9e1c/Messages/AAM...=",
      "resourceData": {
        "id": "AAM...=",
        "@odata.type": "#Microsoft.Graph.Message",
        "@odata.id": "Users/.../Messages/AAM...="
      },
      "clientState": "a-secret-you-generate-and-verify-later",
      "tenantId": "72f988bf-86f1-41af-91ab-2d7cd011db47"
    }
  ]
}
```

Two rules that your handler must follow:

1. **Respond with `202 Accepted` within 3 seconds.** Graph does not wait for your processing to finish. If you take longer, Graph retries, and you end up processing the same event twice.
2. **Always verify `clientState`.** If it does not match what you set when creating the subscription, drop the message.

Here is the full `handleNotification` function, using a queue for the actual work:

```ts
async function handleNotification(
  req: HttpRequest,
  ctx: InvocationContext
): Promise<HttpResponseInit> {
  const expectedClientState = process.env.GRAPH_CLIENT_STATE;
  const payload = (await req.json()) as { value: ChangeNotification[] };

  const validNotifications = payload.value.filter(
    (n) => n.clientState === expectedClientState
  );

  if (validNotifications.length !== payload.value.length) {
    ctx.warn("Dropped notifications with invalid clientState");
  }

  // Fan out to a queue for async processing — keeps the response under 3s
  for (const notification of validNotifications) {
    await queueClient.sendMessage(Buffer.from(JSON.stringify(notification)).toString("base64"));
  }

  return { status: 202 };
}
```

The queue pattern is the most important production detail in this post. Your HTTP handler does nothing except validate and enqueue. A separate queue-triggered function calls back to Graph to fetch the actual resource, runs your business logic, and handles retries on its own timer. Mixing notification receipt with resource fetching in the same handler is how people end up with duplicate processing, 429s, and silent data loss.

For patterns on fan-out processing with Power Automate specifically, see [Power Automate AI Builder: Document Processing Guide](/blog/power-automate-ai-builder-intelligent-document-processing).

---

## Step 4: Fetch the Changed Resource

Notice that `resourceData` does not contain the message body, the file content, or the event details. It contains an ID and a pointer. You have to call Graph again to fetch the actual data:

```ts
async function processQueueItem(notification: ChangeNotification) {
  if (notification.changeType === "deleted") {
    // Resource is gone — handle your cleanup logic locally
    await markDeleted(notification.resourceData.id);
    return;
  }

  const message = await graphClient
    .api(`/${notification.resource}`)
    .select("id,subject,from,receivedDateTime,bodyPreview")
    .get();

  await indexMessage(message);
}
```

Two details worth knowing:

- For **deleted** events, you cannot fetch the resource — it is already gone. Plan for this in your handler.
- Use `$select` to fetch only the fields you actually need. Defaults return the full object, which is wasteful and slower. The `bodyPreview` field is almost always enough; fall back to `body` only when you need full HTML content.

---

## Step 5: Rich Notifications with Encrypted Payloads

The queue fan-out pattern works, but it doubles your Graph traffic — one call per notification to fetch the resource. For high-volume subscriptions (Teams messages, mailbox activity on shared accounts) you can ask Graph to include the resource data in the notification itself, encrypted with a public key you supply.

Set these fields on the subscription:

```ts
const subscription = await graphClient.api("/subscriptions").post({
  changeType: "created",
  notificationUrl: "https://notifications.contoso.com/api/graph-webhook",
  resource: "/chats/getAllMessages",
  expirationDateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  clientState: process.env.GRAPH_CLIENT_STATE,
  includeResourceData: true,
  encryptionCertificate: process.env.PUBLIC_CERT_B64, // base64 DER
  encryptionCertificateId: "cert-2026-04"
});
```

Graph now includes an `encryptedContent` block in every notification. You decrypt it locally using the private key pair of the certificate you uploaded. The flow is:

1. Decrypt the symmetric key from `encryptedContent.dataKey` using your RSA private key (OAEP-SHA1 padding).
2. Verify the HMAC signature in `encryptedContent.dataSignature` to confirm the payload has not been tampered with.
3. Decrypt `encryptedContent.data` using the symmetric key (AES-256-CBC).
4. Parse the resulting JSON — it is the full resource.

This is not a casual feature. You have to manage the certificate lifecycle, store the private key in Azure Key Vault (never on disk), and rotate before expiry. The Microsoft Graph SDK for .NET has helper classes for the decryption; in Node you will use the built-in `crypto` module. Only use this pattern when notification volume actually makes the extra Graph call painful.

---

## Step 6: Renew Before the Subscription Expires

Every subscription has an `expirationDateTime`. When it passes, Graph stops sending notifications — silently. Your app has to PATCH the subscription before expiry to extend it.

The right way to do this is a scheduled job that runs well before any subscription's expiry:

```ts
import { app, InvocationContext, Timer } from "@azure/functions";

export async function renewSubscriptions(timer: Timer, ctx: InvocationContext) {
  const subscriptions = await graphClient.api("/subscriptions").get();

  const soonToExpire = subscriptions.value.filter((s: Subscription) => {
    const expires = new Date(s.expirationDateTime).getTime();
    return expires - Date.now() < 15 * 60 * 1000; // renew within 15 minutes of expiry
  });

  for (const sub of soonToExpire) {
    const newExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await graphClient.api(`/subscriptions/${sub.id}`).patch({ expirationDateTime: newExpiry });
    ctx.log(`Renewed subscription ${sub.id} until ${newExpiry}`);
  }
}

app.timer("renewSubscriptions", {
  schedule: "0 */10 * * * *", // every 10 minutes
  handler: renewSubscriptions
});
```

Two non-obvious rules:

- You cannot extend past the resource's maximum lifetime. Teams messages cap at roughly 60 minutes from now; mail at 10080 minutes (7 days); directory objects at 43200 minutes (30 days). Attempting a longer extension returns `400`.
- If a subscription has already expired, PATCH will fail. You have to delete and recreate — and accept the event gap.

Back your renewal job with a small store of subscription IDs and metadata, so you can detect drift between what you think exists and what Graph actually has. The list endpoint is the source of truth; trust it over your own records.

---

## Lifecycle Notifications — Don't Ignore Them

Some subscription types (Teams channel messages, chat messages, user presence) also emit **lifecycle notifications**: special messages that warn you when a subscription needs attention even before normal expiry. They come in three flavors:

- `reauthorizationRequired` — the access token Graph uses to send your notifications is about to expire. Reauthorize the subscription within 24 hours or it will stop.
- `subscriptionRemoved` — your subscription has been removed (user deleted, permissions revoked). Recreate if needed.
- `missed` — Graph was unable to deliver at least one notification. You will need to backfill using `/delta` queries.

Add a second notification URL for lifecycle events:

```ts
await graphClient.api("/subscriptions").post({
  // ... other fields
  lifecycleNotificationUrl: "https://notifications.contoso.com/api/graph-lifecycle"
});
```

Handle these in a separate endpoint or the same one with a dispatcher on the `lifecycleEvent` field. Ignoring lifecycle notifications is the single most common reason production integrations mysteriously stop working after a few days. They were introduced specifically to prevent silent failure modes.

---

## Common Pitfalls and How to Avoid Them

**Forgetting that the validation response must be plain text.** Every framework that auto-serializes to JSON will break this. Check the `Content-Type` header explicitly in your handler tests.

**Running validation from an app that cold-starts slowly.** If your function takes 12 seconds to warm up, the 10-second validation window is already gone. Use pre-warmed instances or a dedicated plan for webhook endpoints.

**Not using `clientState`.** Without it, anyone with your endpoint URL can send fake notifications and trigger your business logic. Always generate a long random secret, store it in Key Vault, and verify on every request.

**Using application permissions with no filter.** A subscription on `/users` with application permissions fires on every user in the tenant. For a large tenant that is a firehose. Scope down to specific users, groups, or mail folders whenever possible.

**Missing the 3-second response window.** Processing in-line means your first call-back to Graph, your first DB write, and your first external HTTP call are all on the critical path. Move them all to a queue and return `202` immediately.

**Not backfilling after a `missed` lifecycle event.** Change notifications are at-least-once in normal operation but not guaranteed during outages. Combine webhooks with periodic `/delta` queries on the same resource to catch anything dropped.

---

## FAQ

**Do I have to use Azure Functions?** No. Any HTTPS endpoint that responds within the timing rules works — Express, Flask, Go, SharePoint Framework `BaseApplicationCustomizer` handlers via an intermediate function, whatever. Azure Functions is just the shortest path.

**Can I subscribe to a specific mailbox folder?** Yes. Use `/users/{id}/mailFolders('Inbox')/messages` or any folder ID. This narrows the notification volume significantly for mailboxes with auto-filed messages.

**How do I handle rate limits on the Graph callback?** Graph throttles you the same way it throttles any API call. Your queue-consumer function should respect `Retry-After` and back off. Your webhook endpoint itself is not what Graph throttles — the throttling hits your resource fetches after the fact.

**What happens if my endpoint is down when Graph tries to notify me?** Graph retries with exponential backoff for about 4 hours. After that, the notification is dropped. Lifecycle `missed` notifications alert you when this happens on supported resource types.

**Can I test change notifications with Graph Explorer?** No. Graph Explorer does not support the validation handshake flow. Use a tunnel (ngrok, Dev Tunnels) pointing at your local function for end-to-end testing.

---

## Wrapping Up

Change notifications turn Microsoft Graph integrations from polling loops into event-driven services. The minimum setup — a publicly reachable HTTPS endpoint, a 10-second validation response, and a renewal job — is small. The production grade details (queue fan-out, `clientState` verification, lifecycle handling, encrypted payloads for high volume) are what separates a demo from an integration your ops team will not page you about at 2 a.m.

Start with a single resource, get the validation handshake right, and run a renewal loop from day one. Expand to encrypted rich notifications only when volume demands it. And pair every webhook subscription with a `/delta` query fallback so that when Graph drops an event — and it eventually will — your system notices and backfills automatically.

For the broader authentication context, the companion posts [Microsoft Graph API: OAuth 2.0 and App Permissions Guide](/blog/microsoft-graph-api-oauth2-guide) and [Getting Started with Microsoft Graph API in 2026](/blog/microsoft-graph-api-getting-started) cover the app registration and token-acquisition patterns that every subscription depends on.
