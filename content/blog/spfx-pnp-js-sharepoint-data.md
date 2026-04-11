---
title: "PnP JS in SPFx: The Easiest Way to Read SharePoint Data"
slug: spfx-pnp-js-sharepoint-data
excerpt: "PnP JS simplifies SharePoint REST API calls. Query lists, add items, and batch requests with clean TypeScript."
date: "2026-02-10"
displayDate: "February 10, 2026"
readTime: "7 min read"
image: "/images/blog/sharepoint-rest-api-cheatsheet.png"
category: "SPFx"
tags:
  - "spfx"
  - "pnpjs"
  - "sharepoint"
  - "typescript"
---

## Why PnP JS?

Fluent, chainable API with TypeScript support instead of raw REST.

## Setup

```bash
npm install @pnp/sp @pnp/logging
```

## Common Operations

**Get items:**
```typescript
const items = await sp.web.lists.getByTitle('Tasks').items();
```

**Add item:**
```typescript
await sp.web.lists.getByTitle('Tasks').items.add({ Title: 'New' });
```

**Batching:**
Combine multiple requests into one HTTP call for better performance.
