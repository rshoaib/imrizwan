---
title: "PnP JS in SPFx: Read and Write SharePoint Data (2026)"
slug: spfx-pnp-js-sharepoint-data
excerpt: "PnP JS for SPFx in 2026 — CRUD, filtering, batching, and error handling for SharePoint with cleaner TypeScript than raw REST."
date: "2026-02-10"
displayDate: "February 10, 2026"
readTime: "12 min read"
image: "/images/blog/sharepoint-rest-api-cheatsheet.png"
category: "SPFx"
tags:
  - "spfx"
  - "pnpjs"
  - "sharepoint"
  - "typescript"
  - "crud"
---

## Why PnP JS?

Writing SharePoint REST API calls directly is verbose, error-prone, and leaves you with boilerplate everywhere. PnP JS (Patterns and Practices JavaScript) gives you a fluent, chainable API that dramatically reduces the friction of working with SharePoint data.

Here's what you get:

- **Fluent API**: Chain method calls naturally instead of building URL strings
- **TypeScript support**: Full type safety and intellisense for SharePoint objects
- **Built-in batching**: Combine multiple requests into a single HTTP call for better performance
- **Less boilerplate**: No manual header construction, no parsing response JSON manually
- **Error handling**: Consistent, predictable error patterns across all operations
- **Community-driven**: Maintained by the PnP community with constant updates

## Setup in Your SPFx Project

First, install the required packages:

```bash
npm install @pnp/sp @pnp/logging
```

Then initialize PnP JS in your web part's `onInit()` method:

```typescript
import { spfi, SPFx } from "@pnp/sp";
import { LogLevel } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export default class MyTaskWebPart extends BaseClientSideWebPart<IMyTaskWebPartProps> {
  private sp: SPFI;

  protected async onInit(): Promise<void> {
    await super.onInit();
    this.sp = spfi().using(SPFx(this.context));
  }
}
```

The `SPFx()` context automatically uses your web part's existing credentials, so you don't need to worry about authentication.

## CRUD Operations

### Get Items

```typescript
// Get all items from a list
const allItems = await this.sp.web.lists.getByTitle('Tasks').items();

// Get specific columns only
const items = await this.sp.web.lists
  .getByTitle('Tasks')
  .items.select('ID', 'Title', 'Status')();

// Get with a filter
const activeTasks = await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .filter("Status eq 'Active'")();

// Get a single item by ID
const singleItem = await this.sp.web.lists
  .getByTitle('Tasks')
  .items.getById(1)();
```

### Create Items

```typescript
const result = await this.sp.web.lists
  .getByTitle('Tasks')
  .items.add({
    Title: 'New Task',
    Status: 'Active',
    DueDate: new Date('2026-12-31')
  });

const newId = result.data.ID;
```

### Update Items

```typescript
await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .getById(1)
  .update({
    Status: 'Completed',
    CompletedDate: new Date()
  });
```

### Delete Items

```typescript
await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .getById(1)
  .delete();
```

## Filtering and Paging

### Filter Syntax

```typescript
// Multiple conditions (AND)
const highPriority = await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .filter("Status eq 'Active' and Priority eq 'High'")();

// Text contains
const searchResults = await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .filter("substringof('urgent', Title)")();

// Date comparisons
const upcoming = await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .filter("DueDate gt datetime'2026-04-12T00:00:00Z'")();
```

### Ordering and Paging

```typescript
// Order descending, limit results
const newestFirst = await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .orderBy('Created', false)
  .top(10)();

// Combined: filter, order, and page
const results = await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .select('ID', 'Title', 'Status', 'DueDate')
  .filter("Status ne 'Archived'")
  .orderBy('DueDate')
  .skip(0)
  .top(50)();
```

## Batching for Performance

```typescript
const tasksListUrl = this.sp.web.lists.getByTitle('Tasks');
const batch = tasksListUrl.items.createBatch();

const item1Promise = tasksListUrl.items.inBatch(batch).add({ Title: 'Task 1' });
const item2Promise = tasksListUrl.items.inBatch(batch).add({ Title: 'Task 2' });
const item3Promise = tasksListUrl.items.inBatch(batch).add({ Title: 'Task 3' });

await batch.execute();

const item1 = await item1Promise;
const item2 = await item2Promise;
const item3 = await item3Promise;
```

## Error Handling

```typescript
// Check error status
try {
  await this.sp.web.lists
    .getByTitle('Tasks')
    .items
    .getById(1)
    .update({ Title: 'Updated' });
} catch (error: any) {
  if (error.status === 403) {
    alert('You do not have permission to update this item');
  } else if (error.status === 404) {
    alert('Item not found');
  } else {
    alert('An error occurred: ' + error.message);
  }
}

// Retry logic for throttling
async retryWithBackoff(
  operation: () => Promise<any>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<any> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      if (error.status === 503 && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)));
        continue;
      }
      throw error;
    }
  }
}
```

## Frequently Asked Questions

**Q: How do I work with lookup and people picker fields?**

A: Lookup fields require an object with a `results` array:
```typescript
await this.sp.web.lists.getByTitle('Tasks').items.add({
  Title: 'Task',
  AssignedTo: { results: [{ id: 5 }] },
  RelatedProject: { results: [{ id: 12 }] }
});
```

**Q: Can I use PnP JS in SPFx extensions or application customizers?**

A: Absolutely. Initialize it the same way in the `onInit()` method of your extension class.

**Q: How do I handle very large lists (10,000+ items)?**

A: Use paging with batching. Retrieve items in smaller chunks using `skip()` and `top()`, process them, then move to the next page.

**Q: What's the difference between PnP JS and the Graph API?**

A: PnP JS wraps the SharePoint REST API with a fluent interface. The Graph API is Microsoft's unified API for Microsoft 365. Use PnP JS for SharePoint-specific operations; use Graph for cross-Microsoft-365 scenarios. For Graph from inside SPFx, see [Microsoft Graph API: getting started](/blog/microsoft-graph-api-getting-started).

## Next Steps

- Explore the [PnP JS GitHub](https://github.com/pnp/pnpjs) repository for advanced patterns
- Combine PnP JS with [Fluent UI for polished web parts](/blog/spfx-fluent-ui-v9-web-parts-migration-guide-2026)
- Modernize your build toolchain with [the Heft migration guide](/blog/spfx-migrate-gulp-heft-webpack-2026)
- Cut request volume with [Microsoft Graph $batch requests](/blog/microsoft-graph-batch-requests-combine-api-calls-2026)
