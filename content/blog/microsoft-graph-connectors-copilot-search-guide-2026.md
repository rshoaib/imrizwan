---
title: "Microsoft Graph Connectors: Index External Content for Copilot and Microsoft Search (2026)"
slug: microsoft-graph-connectors-copilot-search-guide-2026
excerpt: "Build a Microsoft Graph connector that indexes external content into Microsoft Search and Copilot. Schema design, ingestion code, ACLs, and 2026-era best practices."
date: "2026-04-25T09:00:00.000Z"
displayDate: "April 25, 2026"
readTime: "13 min read"
category: "Graph API"
image: "/images/blog/microsoft-graph-connectors-copilot-search-guide-2026.png"
tags:
  - "Microsoft Graph"
  - "Graph Connectors"
  - "Microsoft Search"
  - "Copilot"
  - "Microsoft 365"
  - "2026"
---

If you want Microsoft 365 Copilot to ground its responses on data that lives outside Microsoft 365 — a Confluence wiki, a ServiceNow knowledge base, a homegrown product catalog, anything — you have exactly one supported path in 2026: a **Microsoft Graph connector**. Connectors push content from external systems into Microsoft's semantic index, where it becomes searchable in Microsoft Search results, returnable from the Graph Search API, and grounded into Copilot answers across Word, Outlook, Teams, and the Copilot chat experience.

This guide walks through building a custom Graph connector end to end: registering the connector with the Microsoft Graph API, designing a search schema, ingesting items with ACLs, surfacing the content in a Microsoft Search vertical, and exposing it as a knowledge source for a declarative agent. Every code sample uses the v1.0 Graph API endpoints that are GA as of early 2026.

## What a Graph Connector Actually Does

A Graph connector is an application registration that you grant the `ExternalConnection.ReadWrite.OwnedBy` permission, then drive through three Graph API surfaces:

- **`/external/connections`** — the connector instance itself. One connection per external system you're indexing (one for Confluence, one for your CRM, etc.).
- **`/external/connections/{id}/schema`** — the shape of items in that connection, including which fields are searchable, retrievable, queryable, and refinable.
- **`/external/connections/{id}/items`** — the actual records you push into Microsoft's semantic index. Each item carries content, properties, and an access control list.

Microsoft hosts the index. You handle ingestion. Once items are accepted, they show up in Microsoft Search within minutes, in the Graph Search API the same hour, and in Copilot grounding once a tenant admin enables your connection as a knowledge source. There is no inverted index for you to maintain, no shard management, no relevance tuning — Microsoft's index runs the show, and your job is to keep it fresh.

## Prerequisites and Permissions

You'll need:

- A Microsoft 365 tenant with at least one **Microsoft 365 Copilot** license if you want Copilot grounding (Microsoft Search alone works on any tenant).
- An **Entra ID app registration** with the application permission `ExternalConnection.ReadWrite.OwnedBy` (admin consent required) and `ExternalItem.ReadWrite.OwnedBy`.
- A client secret or certificate for app-only authentication. Connectors run unattended, so delegated auth isn't a fit.
- The Microsoft Graph SDK for your language. Examples below use `@microsoft/microsoft-graph-client` (Node 20+, TypeScript).

Register the app in [entra.microsoft.com](https://entra.microsoft.com), grant the two permissions under **API permissions → Microsoft Graph → Application permissions**, and click **Grant admin consent**. Save the tenant ID, client ID, and secret — your connector will not run without them.

```ts
// graphClient.ts
import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import "isomorphic-fetch";

const credential = new ClientSecretCredential(
  process.env.TENANT_ID!,
  process.env.CLIENT_ID!,
  process.env.CLIENT_SECRET!
);

const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ["https://graph.microsoft.com/.default"],
});

export const graph = Client.initWithMiddleware({ authProvider });
```

## Step 1: Create the External Connection

A connection is the container that owns your schema and items. Pick an `id` that's stable forever — you cannot rename it later, and ACL references depend on it. The convention is a short, lowercase identifier like `confluencewiki` or `productcatalog2026`.

```ts
// createConnection.ts
import { graph } from "./graphClient";

export async function createConnection() {
  return graph.api("/external/connections").post({
    id: "productcatalog2026",
    name: "Product Catalog",
    description: "Internal product specs, datasheets, and release notes",
    activitySettings: {
      urlToItemResolvers: [
        {
          "@odata.type": "#microsoft.graph.externalConnectors.itemIdResolver",
          urlMatchInfo: {
            baseUrls: ["https://catalog.contoso.com"],
            urlPattern: "/products/(?<productId>[^/]+)",
          },
          itemId: "{productId}",
          priority: 1,
        },
      ],
    },
  });
}
```

The `activitySettings.urlToItemResolvers` block lets Microsoft Search recognize URLs from your source system and tie them back to indexed items — important for Copilot, which uses URL-to-item resolution to attribute citations correctly.

## Step 2: Define the Schema

The schema declares every field your items will carry, plus four flags per field:

- **`isSearchable`** — content of this field is matched against the user's query.
- **`isRetrievable`** — value is returned in search results.
- **`isQueryable`** — clients can filter on the field with `$filter`.
- **`isRefinable`** — field can drive aggregations and refiners in the Search vertical UI.

You can ship up to 128 properties per schema. Once published, you can add new properties but cannot remove or rename existing ones, so think carefully before the first registration call.

```ts
// registerSchema.ts
import { graph } from "./graphClient";

export async function registerSchema(connectionId: string) {
  return graph
    .api(`/external/connections/${connectionId}/schema`)
    .header("Prefer", "respond-async")
    .post({
      baseType: "microsoft.graph.externalItem",
      properties: [
        { name: "title", type: "String", isSearchable: true, isRetrievable: true, isQueryable: true, labels: ["title"] },
        { name: "description", type: "String", isSearchable: true, isRetrievable: true },
        { name: "productId", type: "String", isQueryable: true, isRetrievable: true },
        { name: "category", type: "String", isQueryable: true, isRefinable: true, isRetrievable: true },
        { name: "releaseDate", type: "DateTime", isQueryable: true, isRefinable: true, isRetrievable: true },
        { name: "owner", type: "String", isQueryable: true, isRetrievable: true },
        { name: "url", type: "String", isRetrievable: true, labels: ["url"] },
      ],
    });
}
```

The `labels` array is how you map your custom fields to **semantic labels** that Microsoft Search and Copilot understand. `title` and `url` are the two you almost always need — without them, search results render with a blank headline and a broken click-through.

Schema registration returns a `Location` header pointing at a long-running operation. Poll it until `status` flips to `completed` before you ingest the first item:

```ts
async function waitForSchema(operationUrl: string) {
  while (true) {
    const op = await graph.api(operationUrl).get();
    if (op.status === "completed") return;
    if (op.status === "failed") throw new Error(`Schema registration failed: ${op.error?.message}`);
    await new Promise((r) => setTimeout(r, 5000));
  }
}
```

## Step 3: Ingest Items With ACLs

Each item is a PUT to `/items/{id}`. The `id` must be stable — re-PUTing the same id updates the item in place; a new id creates a new one. This is also how you implement deletes: track which ids you've sent, diff against the source, and DELETE the ones that disappeared.

The single most important field is `acl`. Microsoft enforces it on every search query, so getting it wrong means either leaking content (everyone-sees-everything) or hiding content from the people who should see it.

```ts
// ingestItem.ts
import { graph } from "./graphClient";

export interface ProductRecord {
  id: string;
  title: string;
  description: string;
  productId: string;
  category: string;
  releaseDate: string;
  owner: string;
  url: string;
  allowedGroupIds: string[];
}

export async function ingestItem(connectionId: string, record: ProductRecord) {
  return graph.api(`/external/connections/${connectionId}/items/${record.id}`).put({
    acl: [
      // Deny everyone first, then grant specific groups — defense in depth
      { type: "everyone", value: "everyone", accessType: "deny" },
      ...record.allowedGroupIds.map((groupId) => ({
        type: "group",
        value: groupId,
        accessType: "grant",
      })),
    ],
    properties: {
      title: record.title,
      description: record.description,
      productId: record.productId,
      category: record.category,
      releaseDate: record.releaseDate,
      owner: record.owner,
      url: record.url,
    },
    content: {
      value: record.description,
      type: "text", // or "html" — Copilot can ground from either
    },
  });
}
```

The ACL `value` for groups is the Entra ID **object id**, not the group name. For users, it's the user's object id. For `everyone`, the literal string `"everyone"`. The `accessType` order matters: when both `grant` and `deny` apply, deny wins. Modeling external permissions as deny-by-default + explicit grants is the safest pattern, and it lines up with how Copilot honors ACLs in grounded responses.

## Step 4: Run the Crawl

A connector is two crawls running on a schedule:

1. **Full crawl** — on first run and after schema changes, walk the entire source and PUT every item.
2. **Incremental crawl** — on every subsequent run, fetch only items modified since the last successful run.

Most teams run incremental every 15 minutes and full crawls weekly. Microsoft's index doesn't care which mode you're in — the only difference is what you choose to push.

```ts
// runCrawl.ts
import { graph } from "./graphClient";
import { ingestItem, ProductRecord } from "./ingestItem";
import { fetchModifiedSince, fetchAll } from "./sourceSystem";

export async function runIncrementalCrawl(connectionId: string, since: Date) {
  const records = await fetchModifiedSince(since);
  for (const record of records) {
    try {
      await ingestItem(connectionId, record);
    } catch (err: any) {
      // 429 means throttled — back off and retry
      if (err.statusCode === 429) {
        const retryAfter = Number(err.responseHeaders?.["retry-after"] ?? "30");
        await new Promise((r) => setTimeout(r, retryAfter * 1000));
        await ingestItem(connectionId, record);
      } else {
        console.error(`Failed to index ${record.id}:`, err.message);
      }
    }
  }
}
```

Microsoft's published throughput limit is **4 requests per second per connection**. In practice, ingesting through `Promise.all` with a bounded concurrency of 4 keeps you under the throttle ceiling without sacrificing throughput. Anything higher and you'll see `429 Too Many Requests` consistently.

## Step 5: Make It Visible to Users

A connection without surfaces is invisible. You have three places to expose it:

### Microsoft Search vertical

In the Microsoft 365 admin center, go to **Settings → Search & intelligence → Customizations → Verticals**. Create a new vertical named after your content (e.g., "Products"), set the source to your connection id, and pick which refinable properties to expose as filters. Within an hour, users will see a new tab in the Microsoft Search results page at [bing.com/work](https://www.bing.com/work) and on SharePoint.

### Copilot grounding

In the same admin center, navigate to **Copilot → Settings → Connectors**, find your connection, and toggle it on. From this point, Copilot will consider items from your connection when grounding responses across Word, Outlook, Teams, and Copilot chat. Citations link back to the URL you set in the schema.

### Declarative agents

If you've built a [declarative Copilot agent](/blog/building-copilot-declarative-agents-teams-toolkit), you can scope it to a specific connection by adding the connection id to the agent manifest's `capabilities` array. The agent will only ground on items from that connection — useful for tightly scoped agents like "Product Spec Lookup" that should not pull from the wider tenant index.

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.0/schema.json",
  "version": "v1.0",
  "name": "Product Spec Lookup",
  "description": "Answers questions from the internal product catalog",
  "instructions": "You answer questions about Contoso products...",
  "capabilities": [
    {
      "name": "GraphConnectors",
      "connections": [{ "connection_id": "productcatalog2026" }]
    }
  ]
}
```

## Common Pitfalls

**Schema field name collisions.** If you name a property `category` in one connection and a different `category` in another, the Search vertical will treat them as the same field. Prefix property names with the connection id (`productcatalog_category`) when you have any chance of cross-connection refinement queries.

**Ingesting empty content.** Items with `content.value === ""` are accepted but will never rank. Microsoft's index needs at least 50–100 characters of meaningful text to embed and rank an item. If your source has metadata-only records, concatenate the title, description, and any free-text fields into the content body.

**Forgetting `everyone: deny` in the ACL.** A `grant` to specific groups does not implicitly deny everyone else — items with no matching grant are silently visible to all users in 2025-era APIs. The 2026 GA behavior is more conservative, but the deny-everyone-first idiom is still the only safe pattern. Audit older connectors that pre-date this guidance.

**Polling for schema operations.** Schema registration is async and can take several minutes for large schemas. Don't ingest before the operation reports `completed` — items posted against a half-registered schema return 400 with confusing error text.

**Over-marking properties as `isSearchable`.** Every searchable field expands the embedding cost and dilutes relevance. Mark only fields that contain real, user-facing prose. Identifiers, status codes, and timestamps should be retrievable but not searchable.

## Operational Concerns

Treat your connector like any production data pipeline:

- **Logging.** Log every PUT response. The Graph API surfaces ingestion errors per item, and silent partial failures will quietly desync your index from your source.
- **Monitoring.** The connection's `state` property flips to `quarantined` if too many items fail validation. Poll `/external/connections/{id}` daily and page on quarantine.
- **Cost.** Ingestion itself is free, but storage of indexed content counts against your tenant's Microsoft Search storage quota. Audit the **Connection statistics** page in the admin center monthly.
- **Source-of-truth deletes.** When an item is deleted from the source, you must DELETE it from the connection. Forgetting this is the #1 cause of stale Copilot citations.

## What's Next

Microsoft Graph connectors are the foundation for any 2026 Copilot grounding strategy that includes data outside SharePoint and OneDrive. Once your first connector is in production, common follow-ups include:

- Building a [declarative Copilot agent](/blog/building-copilot-declarative-agents-teams-toolkit) scoped to that connector for a focused experience.
- Wrapping the connector's content in a [Microsoft Graph Toolkit web app](/blog/microsoft-graph-toolkit-web-apps-guide-2026) for non-Copilot search experiences.
- Following the [enterprise governance checklist](/blog/enterprise-governance-sharepoint-ai-developer-checklist) to make sure your ingestion respects the same data-residency and DLP controls as the rest of M365.

The connector pattern looks simple on the surface — push items, set ACLs, done — but the operational surface is where real production work lives. Ship the simplest possible connector first, get the ACL model right, and only then start tuning relevance and adding refiners.
