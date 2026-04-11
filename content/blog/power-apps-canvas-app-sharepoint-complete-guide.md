---
title: "Power Apps Canvas App with SharePoint: Practical Guide"
slug: power-apps-canvas-app-sharepoint-complete-guide
excerpt: "Build a Power Apps canvas app connected to SharePoint — from data source setup to a polished app with search, filters, and forms."
date: "2026-03-01"
displayDate: "March 1, 2026"
readTime: "10 min read"
image: "/images/blog/sharepoint-rest-api-cheatsheet.png"
category: "Power Platform"
tags:
  - "power-apps"
  - "sharepoint"
  - "canvas-app"
  - "low-code"
  - "power-platform"
---

## Why Power Apps + SharePoint?

If you work in the Microsoft 365 ecosystem, **Power Apps + SharePoint** is the most practical combination for building internal business apps — fast. You get a relational data store (SharePoint lists), a visual app builder (Power Apps), and enterprise-grade auth (Entra ID) — all without provisioning a single server.

Here's when this combo makes sense:

- **Team task trackers** — replace shared Excel files with a real app
- **Inventory management** — visual interface over SharePoint list data
- **Service request forms** — structured intake with validation and routing
- **Employee directories** — searchable, filterable team databases
- **Approval dashboards** — combined with Power Automate for workflow

The alternative is building a custom SPFx webpart or a full-stack web app. Both are 10–50x more effort for these scenarios. Power Apps gets you from idea to production app in hours, not weeks.

## Prerequisites

Before you start, make sure you have:

- **Microsoft 365 license** with Power Apps included (most E3/E5 plans, or standalone Power Apps license)
- **SharePoint Online** — a site where you can create lists
- **Power Apps maker access** — go to `make.powerapps.com` to verify
- **A modern browser** — Edge or Chrome recommended

## Step 1: Create the SharePoint List

Every Power App needs a data source. We'll create a **Project Tracker** list that the app will read and write to.

Go to your SharePoint site → **New** → **List** → **Blank list**. Name it `Project Tracker`.

Add these columns:

| Column Name | Type | Details |
|-------------|------|---------|
| Title | Single line of text | Default column — use for project name |
| Status | Choice | Choices: Not Started, In Progress, Completed, On Hold |
| Priority | Choice | Choices: High, Medium, Low |
| AssignedTo | Person or Group | Allow single selection |
| DueDate | Date | Date only, no time |
| Description | Multiple lines of text | Plain text, 6 lines |
| PercentComplete | Number | Min: 0, Max: 100, 0 decimal places |

Add 3–5 sample items so you have data to work with in the app.

### Why This Structure Matters

Power Apps works best with **flat, well-typed columns**. Avoid:
- Lookup columns with complex multi-value selections (delegation issues)
- Calculated columns (read-only in Power Apps)
- Deeply nested folder structures (use metadata instead)

## Step 2: Generate the App from SharePoint

The fastest way to start is to let Power Apps scaffold the app for you:

1. Go to your SharePoint list → click **Integrate** → **Power Apps** → **Create an app**
2. Name your app: `Project Tracker App`
3. Power Apps opens with a **three-screen app** auto-generated:
   - **BrowseScreen1** — gallery showing all items
   - **DetailScreen1** — read-only view of a single item
   - **EditScreen1** — edit form for creating/updating items

This auto-generated app is functional but ugly. Let's customize it.

## Step 3: Customize the Browse Gallery

Select **BrowseGallery1** on BrowseScreen1. This is the main list view.

### Change the Layout

In the Properties pane, change **Layout** to **Title, subtitle, and body**. Then set:

```
Title: ThisItem.Title
Subtitle: ThisItem.Status & " • " & ThisItem.Priority
Body: "Due: " & Text(ThisItem.DueDate, "MMM dd, yyyy")
```

### Add Conditional Formatting

Select the **Status** label in the gallery. Set its **Color** property:

```
Switch(
    ThisItem.Status.Value,
    "Completed", Color.Green,
    "In Progress", Color.DodgerBlue,
    "On Hold", Color.Orange,
    "Not Started", Color.Gray,
    Color.Black
)
```

This gives instant visual feedback — green for done, blue for active, orange for blocked.

### Add a Priority Icon

Insert an **Icon** control into the gallery. Set the **Icon** property:

```
Switch(
    ThisItem.Priority.Value,
    "High", Icon.Warning,
    "Medium", Icon.Edit,
    "Low", Icon.CheckBadge,
    Icon.Information
)
```

Set the **Color** property:

```
Switch(
    ThisItem.Priority.Value,
    "High", RGBA(220, 38, 38, 1),
    "Medium", RGBA(234, 179, 8, 1),
    "Low", RGBA(34, 197, 94, 1),
    Color.Gray
)
```

## Step 4: Build the Edit Form

Select **EditForm1** on EditScreen1. This is where users create and edit items.

### Configure Data Cards

Each field in the form is a **Data Card**. To customize:

1. Select the data card → **Advanced** tab → **Unlock** the card
2. Now you can modify individual controls inside the card

### Add Validation

Select the **Save** icon (or button) and wrap the `SubmitForm` call with validation:

```
If(
    IsBlank(DataCardValue_Title.Text),
    Notify("Project name is required", NotificationType.Error),
    IsBlank(DataCardValue_DueDate.SelectedDate),
    Notify("Due date is required", NotificationType.Error),
    SubmitForm(EditForm1)
)
```

### Set Default Values

For new items, set default values on the data cards:

- **Status** default: `"Not Started"`
- **Priority** default: `"Medium"`
- **PercentComplete** default: `0`

Select the data card → `Default` property → set your value.

## Step 5: Add Search and Filtering

Back on BrowseScreen1, let's add real search and filter capabilities.

### Search Bar

The auto-generated app includes a search box. Update the gallery's **Items** property:

```
SortByColumns(
    Filter(
        'Project Tracker',
        StartsWith(Title, TextSearchBox1.Text) ||
        TextSearchBox1.Text = ""
    ),
    "DueDate",
    SortOrder.Ascending
)
```

This searches by project title and sorts by due date.

### Status Filter Dropdown

Insert a **Dropdown** control above the gallery. Set its properties:

```
Items: ["All", "Not Started", "In Progress", "Completed", "On Hold"]
Default: "All"
```

Update the gallery's **Items** property to include the filter:

```
SortByColumns(
    Filter(
        'Project Tracker',
        (StartsWith(Title, TextSearchBox1.Text) || TextSearchBox1.Text = "")
        && (StatusFilter.Selected.Value = "All" || Status.Value = StatusFilter.Selected.Value)
    ),
    "DueDate",
    SortOrder.Ascending
)
```

Now users can search by name AND filter by status simultaneously.

## Step 6: Add a Dashboard Header

Let's add a summary bar at the top of BrowseScreen1 showing key metrics.

Insert a **horizontal container** at the top. Add four **Label** controls inside:

```
"Total: " & CountRows('Project Tracker')
"Active: " & CountIf('Project Tracker', Status.Value = "In Progress")
"Completed: " & CountIf('Project Tracker', Status.Value = "Completed")
"Overdue: " & CountIf('Project Tracker', DueDate < Today() && Status.Value <> "Completed")
```

Style each label with a colored background to create a metrics dashboard — similar to the KPI cards you see in Power BI.

## Step 7: Publish and Share

Once your app is ready:

1. **File** → **Save** → **Publish** → **Publish this version**
2. **Share** → enter the names or email addresses of your team
3. Users can access the app at `apps.powerapps.com` or:

### Embed in SharePoint

Add the app directly to a SharePoint page using the **Power Apps web part**:

1. Edit your SharePoint page → **Add a web part** → **Power Apps**
2. Paste your app's **App ID** (found in app details)
3. The app renders inline on the page — no separate window needed

### Embed in Microsoft Teams

1. Open Teams → **Apps** → **Built for your org**
2. Find your app and **Add** it
3. Pin it as a tab in any Teams channel

This is the best distribution method — your team sees the app right where they already work.

## Power Fx Formulas Cheat Sheet

Here are the formulas you'll use most with SharePoint-connected apps:

| Formula | What It Does |
|---------|-------------|
| `Filter('List', Status.Value = "Active")` | Get items matching a condition |
| `LookUp('List', ID = Gallery.Selected.ID)` | Get a single item by ID |
| `Patch('List', Defaults('List'), {Title: "New Item"})` | Create a new item directly (no form) |
| `Patch('List', Gallery.Selected, {Status: {Value: "Done"}})` | Update a single field |
| `Remove('List', Gallery.Selected)` | Delete an item |
| `CountRows(Filter('List', Priority.Value = "High"))` | Count items with a condition |
| `SortByColumns(Filter(...), "DueDate", Ascending)` | Sort filtered results |
| `Search('List', SearchBox.Text, "Title", "Description")` | Full-text search across columns |
| `Collect(colLocal, 'List')` | Cache list data locally for speed |
| `Concurrent(fn1, fn2, fn3)` | Run multiple data calls in parallel |

## Performance Tips

Power Apps + SharePoint has one critical concept you must understand: **delegation**.

### What Is Delegation?

When you write a `Filter()` or `Search()` formula, Power Apps tries to send the query to SharePoint (server-side). If it can't — because the formula isn't delegable — it downloads **only 500 items** (or 2000 with admin settings) and filters locally.

This means **your app silently returns incomplete data** if you exceed the delegation limit.

### Delegable vs Non-Delegable

| Delegable (Server-side) | Non-Delegable (Local only) |
|------------------------|---------------------------|
| `Filter()` with =, <>, <, >, StartsWith | `Search()` (partially delegable) |
| `Sort()` on indexed columns | `in` operator |
| `LookUp()` | `IsBlank()` inside Filter |
| `StartsWith()` | `Len()`, `Left()`, `Mid()` |

### How to Avoid Delegation Issues

1. **Index your SharePoint columns** — go to List Settings → Indexed Columns → add indexes on columns you filter by (Status, Priority, DueDate)
2. **Use `StartsWith()` instead of `Search()`** for delegable text searches
3. **Increase the data row limit** — Settings → General → Data row limit → set to 2000
4. **Use `Collect()` for small lists** (under 2000 items) — cache the entire list in a local collection on app start
5. **Use `Concurrent()`** to parallelize multiple data source calls on screen load

### App Load Performance

Add this to your **App.OnStart** for faster perceived performance:

```
Concurrent(
    ClearCollect(colProjects, 'Project Tracker'),
    ClearCollect(colTeam, Office365Users.SearchUser({searchTerm: "", top: 100})),
    Set(varToday, Today())
);
```

This loads all your data sources in parallel instead of sequentially, cutting load time significantly.

## My Recommendations

After building dozens of Power Apps for enterprise teams, here's what actually matters:

1. **Start from SharePoint, not from scratch.** The auto-generated three-screen app gives you 70% of what you need. Customize from there instead of building screen by screen
2. **Keep your list under 2000 items.** Above this, delegation issues become a real headache. For larger datasets, use Dataverse instead of SharePoint lists
3. **Use variables for shared state.** Store the current user (`Set(varCurrentUser, User())`) and frequently used values in global variables on App.OnStart
4. **Test with real data volumes.** An app that works with 10 items might break with 500 due to delegation. Always test with production-scale data
5. **Invest in the UI.** Default Power Apps look like enterprise software from 2005. Spend 20% of your time on visual polish — rounded corners, consistent spacing, and a color theme do wonders for adoption
6. **Use components for reusable elements.** Headers, navigation bars, and status badges should be components, not copy-pasted across screens
7. **Version your apps.** Power Apps has built-in versioning. Before every major change, publish a version so you can roll back if needed

Power Apps isn't trying to replace custom development — it's for the 80% of internal tools that don't justify a full dev cycle. For a SharePoint developer, it's the fastest way to put a polished UI on top of your list data without writing a single line of TypeScript.

### Debugging Annoying Power Platform Errors
If you ever encounter a cryptic `0x80070005` or similar error while building Canvas Apps, don't panic. Paste the raw log directly into the **[SharePoint & Power Platform Error Decoder](/tools/error-decoder)** to get an instant human-readable translation and fix.
