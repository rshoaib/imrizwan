---
title: "PnP JS in SPFx: Read and Write SharePoint Data (2026)"
slug: spfx-pnp-js-sharepoint-data
excerpt: "Master PnP JS for CRUD operations, filtering, batching, and error handling in SharePoint. Write cleaner TypeScript with fluent APIs instead of raw REST."
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

If you're still concatenating REST URLs and managing CORS headers manually, it's time to upgrade.

## Setup in Your SPFx Project

First, install the required packages:

```bash
npm install @pnp/sp @pnp/logging
```

Then initialize PnP JS in your web part's `onInit()` method. Here's a typical setup for an SPFx class web part:

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
    
    // Initialize PnP JS with SPFx context
    this.sp = spfi().using(SPFx(this.context));
    
    // Optional: Enable logging for debugging
    Logger.subscribe(new ConsoleListener());
    Logger.activeLogLevel = LogLevel.Warning;
  }

  protected async onRender(): Promise<void> {
    // Your component rendering logic here
  }
}
```

The `SPFx()` context automatically uses your web part's existing credentials, so you don't need to worry about authentication.

## CRUD Operations

PnP JS makes it simple to create, read, update, and delete list items. Let's walk through each operation with real examples.

### Get Items

Retrieve items from a list with filtering and selection:

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

Add new items to a list with full type support:

```typescript
// Simple add
const result = await this.sp.web.lists
  .getByTitle('Tasks')
  .items.add({
    Title: 'New Task',
    Status: 'Active',
    DueDate: new Date('2026-12-31')
  });

// Capture the new item's ID
const newId = result.data.ID;

// Chained add with select to return the full item
const newItem = await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .add({
    Title: 'Urgent Task',
    Priority: 'High',
    AssignedTo: { results: [{ id: 5 }] } // Lookup fields
  })
  .then(r => r.item.select('*')());
```

### Update Items

Modify existing items in place:

```typescript
// Update a single item
await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .getById(1)
  .update({
    Status: 'Completed',
    CompletedDate: new Date()
  });

// Update with error handling
try {
  await this.sp.web.lists
    .getByTitle('Tasks')
    .items
    .getById(1)
    .update({ Title: 'Updated Title' });
  console.log('Item updated successfully');
} catch (error) {
  console.error('Update failed:', error);
}

// Update multiple items (without batching)
const itemIds = [1, 2, 3];
for (const id of itemIds) {
  await this.sp.web.lists
    .getByTitle('Tasks')
    .items
    .getById(id)
    .update({ Status: 'In Progress' });
}
```

### Delete Items

Remove items from lists:

```typescript
// Delete a single item
await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .getById(1)
  .delete();

// Delete with confirmation
const itemId = 5;
const item = await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .getById(itemId)
  .select('Title')();

if (confirm(`Delete "${item.Title}"?`)) {
  await this.sp.web.lists
    .getByTitle('Tasks')
    .items
    .getById(itemId)
    .delete();
}
```

## Filtering and Paging

When you're working with large lists, filtering and paging are essential for performance.

### Filter Syntax

PnP JS uses OData filter syntax (same as the REST API):

```typescript
// Basic filters
const archived = await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .filter("Status eq 'Archived'")();

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

// Negation
const incomplete = await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .filter("Status ne 'Completed'")();
```

### Ordering and Paging

Control result order and retrieve data in pages:

```typescript
// Order by a column
const sorted = await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .orderBy('DueDate')();

// Order descending
const newestFirst = await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .orderBy('Created', false)();

// Limit result count
const top10 = await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .top(10)();

// Skip for paging
const pageSize = 20;
const pageNumber = 2;
const page = await this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .skip((pageNumber - 1) * pageSize)
  .top(pageSize)
  .orderBy('ID')();

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

When you need to perform multiple operations, batching combines them into a single HTTP request, dramatically improving performance.

### Basic Batching

```typescript
const tasksListUrl = this.sp.web.lists.getByTitle('Tasks');
const batch = tasksListUrl.items.createBatch();

// Queue multiple operations
const item1Promise = tasksListUrl.items.inBatch(batch).add({ Title: 'Task 1' });
const item2Promise = tasksListUrl.items.inBatch(batch).add({ Title: 'Task 2' });
const item3Promise = tasksListUrl.items.inBatch(batch).add({ Title: 'Task 3' });

// Execute all at once
await batch.execute();

// Access results
const item1 = await item1Promise;
const item2 = await item2Promise;
const item3 = await item3Promise;

console.log('Created items:', item1.data.ID, item2.data.ID, item3.data.ID);
```

### Mixed Operations in One Batch

```typescript
const batch = this.sp.web.lists.getByTitle('Tasks').items.createBatch();

// Mix gets, adds, and updates
const getPromise = this.sp.web.lists
  .getByTitle('Tasks')
  .items.getById(1)
  .inBatch(batch)
  .select('Title', 'Status')();

const addPromise = this.sp.web.lists
  .getByTitle('Tasks')
  .items
  .inBatch(batch)
  .add({ Title: 'New Item' });

const updatePromise = this.sp.web.lists
  .getByTitle('Tasks')
  .items.getById(2)
  .inBatch(batch)
  .update({ Status: 'In Progress' });

// Execute all together
await batch.execute();

const item = await getPromise;
const newItem = await addPromise;
await updatePromise;
```

### Real-World Batching Example

Imagine you're syncing data from an external source and need to bulk-update items:

```typescript
async bulkUpdateTasks(updates: Array<{ id: number; status: string }>) {
  const batch = this.sp.web.lists.getByTitle('Tasks').items.createBatch();
  const promises = [];

  for (const update of updates) {
    const promise = this.sp.web.lists
      .getByTitle('Tasks')
      .items
      .getById(update.id)
      .inBatch(batch)
      .update({ Status: update.status });
    promises.push(promise);
  }

  // Execute all updates in one HTTP call
  await batch.execute();

  // Wait for all promises to resolve
  await Promise.all(promises);
  console.log(`Updated ${updates.length} items in one batch request`);
}
```

## Error Handling

SharePoint operations can fail for many reasons. Proper error handling keeps your app stable and your users informed.

### Common Errors

- **403 Forbidden**: You lack permission to perform the action
- **404 Not Found**: The item or list doesn't exist
- **503 Service Unavailable**: SharePoint is throttling your requests
- **Validation errors**: Required fields are missing or invalid

### Try/Catch Patterns

```typescript
// Basic error handling
try {
  const item = await this.sp.web.lists
    .getByTitle('Tasks')
    .items.getById(999)();
} catch (error: any) {
  console.error('Failed to get item:', error.message);
}

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

// Handle validation errors
try {
  await this.sp.web.lists
    .getByTitle('Tasks')
    .items.add({ Title: '' }); // Missing required field
} catch (error: any) {
  if (error.message.includes('Required')) {
    console.error('Validation failed:', error.message);
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

// Usage
const items = await this.retryWithBackoff(() =>
  this.sp.web.lists.getByTitle('Tasks').items()
);
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

A: Absolutely. Initialize it the same way in the `onInit()` method of your extension class. The `SPFx()` context works anywhere in SPFx.

**Q: How do I handle very large lists (10,000+ items)?**

A: Use paging with batching. Retrieve items in smaller chunks using `skip()` and `top()`, process them, then move to the next page. This prevents timeout issues and keeps your app responsive.

**Q: What's the difference between PnP JS and the Graph API?**

A: PnP JS wraps the SharePoint REST API with a fluent interface. The Graph API is Microsoft's unified API for Microsoft 365. Use PnP JS for SharePoint-specific operations; use Graph for cross-Microsoft-365 scenarios like calendar, mail, or organizational data.

## Next Steps

You now have the foundations to read, write, filter, batch, and handle errors with PnP JS. To deepen your skills:

- Explore the [PnP JS GitHub](https://github.com/pnp/pnpjs) repository for advanced patterns
- Combine PnP JS with [Fluent UI for polished web parts](/blog/spfx-fluent-ui-v9-web-parts-migration-guide-2026)
- Modernize your build toolchain with [the Heft migration guide](/blog/spfx-migrate-gulp-heft-webpack-2026)
- Check the [official PnP JS docs](https://pnp.github.io/pnpjs/) for the latest updates
