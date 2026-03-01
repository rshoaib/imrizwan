export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  displayDate: string
  readTime: string
  category: 'SPFx' | 'Power Platform' | 'SharePoint' | 'Microsoft 365'
  image?: string
  tags?: string[]
}

export const blogPosts: BlogPost[] = [
  {
    id: '8',
    slug: 'microsoft-graph-api-spfx-user-profiles-teams',
    title: 'Using Microsoft Graph API in SPFx: Fetch User Profiles, Teams, and Site Data',
    excerpt:
      'Learn how to use Microsoft Graph API in SharePoint Framework web parts — from setting up permissions to fetching user profiles, Teams memberships, and SharePoint site data with real code examples.',
    content: `
## Why Microsoft Graph API in SPFx?

If you're building SharePoint Framework web parts, you'll quickly hit the limits of what pure SharePoint APIs can do. Need to show the current user's photo? Display their Teams memberships? Pull calendar events? Send emails?  That's where **Microsoft Graph** comes in.

Microsoft Graph is the **unified API for all of Microsoft 365**. From a single endpoint (\\\`https://graph.microsoft.com\\\`), you can access:

- **User profiles** — photos, job titles, managers, direct reports
- **Teams and channels** — list teams, post messages, get channel members
- **Calendar events** — upcoming meetings, availability, free/busy status
- **OneDrive files** — recent files, shared documents, file previews
- **Mail** — read, send, and search emails
- **Planner** — tasks, buckets, plans across your organization
- **SharePoint** — sites, lists, and pages (beyond what the SP REST API offers)

The best part? **SPFx has built-in Graph support** through the \\\`MSGraphClientV3\\\` — no need to manually handle OAuth tokens.

## Prerequisites

Before you start, make sure you have:

- **SPFx 1.19+** development environment set up ([see my SPFx Hello World guide](/blog/building-spfx-hello-world-webpart))
- **Microsoft 365 developer tenant** or access to a SharePoint Online site
- **API permissions** configured in your \\\`package-solution.json\\\`
- **Admin consent** granted for the Graph scopes you need

## Step 1: Request API Permissions

The first thing you need is to declare which Graph permissions your web part requires. Open \\\`config/package-solution.json\\\` and add the \\\`webApiPermissionRequests\\\` section:

\\\`\\\`\\\`json
{
  "solution": {
    "name": "graph-webpart-client-side-solution",
    "id": "your-guid-here",
    "version": "1.0.0.0",
    "includeClientSideAssets": true,
    "isDomainIsolated": false,
    "webApiPermissionRequests": [
      {
        "resource": "Microsoft Graph",
        "scope": "User.Read"
      },
      {
        "resource": "Microsoft Graph",
        "scope": "User.ReadBasic.All"
      },
      {
        "resource": "Microsoft Graph",
        "scope": "Team.ReadBasic.All"
      },
      {
        "resource": "Microsoft Graph",
        "scope": "Sites.Read.All"
      }
    ]
  }
}
\\\`\\\`\\\`

### Understanding Permission Scopes

Choose the **least privileged scope** that works for your scenario:

| What You Need | Scope | Permission Type |
|--------------|-------|----------------|
| Current user's profile | \\\`User.Read\\\` | Delegated |
| Any user's basic profile | \\\`User.ReadBasic.All\\\` | Delegated |
| User photos | \\\`User.Read.All\\\` | Delegated |
| List Teams memberships | \\\`Team.ReadBasic.All\\\` | Delegated |
| Read SharePoint sites | \\\`Sites.Read.All\\\` | Delegated |
| Send mail | \\\`Mail.Send\\\` | Delegated |
| Read calendars | \\\`Calendars.Read\\\` | Delegated |

**Important:** After deploying your \\\`.sppkg\\\` package, a **tenant admin** must approve these permissions in the SharePoint Admin Center → **API access** page. Without admin consent, your Graph calls will fail with a 403.

## Step 2: Initialize the Graph Client

In your web part file (e.g., \\\`GraphDemoWebPart.ts\\\`), get the Graph client from the SPFx context:

\\\`\\\`\\\`typescript
import { MSGraphClientV3 } from '@microsoft/sp-http';

// Inside your web part class:
private async getGraphClient(): Promise<MSGraphClientV3> {
  return await this.context.msGraphClientFactory.getClient('3');
}
\\\`\\\`\\\`

That's it. No OAuth configuration, no client secrets, no token management. SPFx handles the entire authentication flow for you using the current user's Azure AD session.

## Step 3: Fetch the Current User's Profile

Let's start with the most common scenario — getting the signed-in user's profile data:

\\\`\\\`\\\`typescript
interface UserProfile {
  displayName: string;
  mail: string;
  jobTitle: string;
  officeLocation: string;
  department: string;
  businessPhones: string[];
}

private async getCurrentUser(): Promise<UserProfile> {
  const client = await this.getGraphClient();
  
  const response: UserProfile = await client
    .api('/me')
    .select('displayName,mail,jobTitle,officeLocation,department,businessPhones')
    .get();
  
  return response;
}
\\\`\\\`\\\`

### Get the User's Photo

User photos are returned as binary blobs, so you need to convert them to a data URL:

\\\`\\\`\\\`typescript
private async getUserPhoto(): Promise<string> {
  const client = await this.getGraphClient();
  
  try {
    const photoBlob: Blob = await client
      .api('/me/photo/$value')
      .responseType('blob' as any)
      .get();
    
    return URL.createObjectURL(photoBlob);
  } catch {
    // User has no photo — return a placeholder
    return '';
  }
}
\\\`\\\`\\\`

## Step 4: List the User's Teams

Show which Microsoft Teams the current user belongs to:

\\\`\\\`\\\`typescript
interface Team {
  id: string;
  displayName: string;
  description: string;
}

private async getMyTeams(): Promise<Team[]> {
  const client = await this.getGraphClient();
  
  const response = await client
    .api('/me/joinedTeams')
    .select('id,displayName,description')
    .get();
  
  return response.value;
}
\\\`\\\`\\\`

## Step 5: Search SharePoint Sites

Use Graph to search across all SharePoint sites in the tenant:

\\\`\\\`\\\`typescript
interface SiteResult {
  id: string;
  displayName: string;
  webUrl: string;
  description: string;
}

private async searchSites(query: string): Promise<SiteResult[]> {
  const client = await this.getGraphClient();
  
  const response = await client
    .api('/sites')
    .query({ search: query })
    .select('id,displayName,webUrl,description')
    .get();
  
  return response.value;
}
\\\`\\\`\\\`

## Step 6: Put It All Together in React

Here's how to wire everything up in a React component:

\\\`\\\`\\\`typescript
import * as React from 'react';
import { useState, useEffect } from 'react';

const GraphDemo: React.FC<{ graphClient: MSGraphClientV3 }> = ({ graphClient }) => {
  const [user, setUser] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, teamsData] = await Promise.all([
          graphClient.api('/me')
            .select('displayName,mail,jobTitle,department')
            .get(),
          graphClient.api('/me/joinedTeams')
            .select('id,displayName,description')
            .get()
        ]);
        
        setUser(userData);
        setTeams(teamsData.value);
      } catch (error) {
        console.error('Graph API error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [graphClient]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome, {user?.displayName}</h2>
      <p>{user?.jobTitle} — {user?.department}</p>
      
      <h3>Your Teams ({teams.length})</h3>
      <ul>
        {teams.map(team => (
          <li key={team.id}>
            <strong>{team.displayName}</strong>
            <span>{team.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
\\\`\\\`\\\`

## Error Handling Patterns

Graph API calls can fail for many reasons. Here's a robust pattern:

\\\`\\\`\\\`typescript
private async safeGraphCall<T>(
  apiCall: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await apiCall();
  } catch (error: any) {
    if (error.statusCode === 403) {
      console.warn('Permission denied. Has admin approved the API permissions?');
    } else if (error.statusCode === 404) {
      console.warn('Resource not found.');
    } else if (error.statusCode === 429) {
      console.warn('Throttled. Retry after:', error.headers?.['Retry-After']);
    }
    return fallback;
  }
}
\\\`\\\`\\\`

## Batching Multiple Requests

Instead of making 5 separate Graph calls, batch them into one:

\\\`\\\`\\\`typescript
private async batchGraphCalls(): Promise<any> {
  const client = await this.getGraphClient();
  
  const batchContent = {
    requests: [
      { id: '1', method: 'GET', url: '/me' },
      { id: '2', method: 'GET', url: '/me/joinedTeams' },
      { id: '3', method: 'GET', url: '/me/manager' },
      { id: '4', method: 'GET', url: '/me/events?$top=5' },
    ]
  };
  
  const response = await client
    .api('/$batch')
    .post(batchContent);
  
  return response.responses;
}
\\\`\\\`\\\`

This is **significantly faster** than sequential calls, especially on slower connections.

## PnP JS Alternative

If you prefer a more developer-friendly wrapper, **PnP JS** provides a Graph client with chainable, typed methods:

\\\`\\\`\\\`typescript
import { graphfi, SPFx } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/teams";

// In onInit():
const graph = graphfi().using(SPFx(this.context));

// Usage:
const me = await graph.me();
const teams = await graph.me.joinedTeams();
const photo = await graph.me.photo.getBlob();
\\\`\\\`\\\`

PnP JS handles batching, caching, and error handling for you. If you're building complex Graph integrations, it's worth the extra dependency.

## Common Mistakes

After building dozens of Graph-powered SPFx web parts, these are the issues I see most:

- **Forgetting admin consent.** Your web part silently gets 403 errors. Always check the API access page first
- **Requesting too many scopes.** Only request what you need. \\\`User.Read\\\` is enough for the current user
- **Not using \\\`$select\\\`.** Without it, Graph returns every field. Always specify exactly what you need
- **Ignoring throttling.** On pages with many Graph web parts, you'll hit rate limits. Batch your calls and cache responses
- **Hardcoding tenant URLs.** Use Graph's relative paths (\\\`/me\\\`, \\\`/sites\\\`) instead of hardcoded SharePoint URLs

Microsoft Graph turns your SPFx web parts from "SharePoint only" to "Microsoft 365 powered." Once you start pulling in Teams, calendar, and user data, your web parts become genuinely useful productivity tools — not just SharePoint widgets.
`,
    date: '2026-03-01',
    displayDate: 'March 1, 2026',
    readTime: '12 min read',
    category: 'SPFx',
    tags: ['spfx', 'microsoft-graph', 'pnp-js', 'sharepoint-online', 'react', 'teams'],
  },
  {
    id: '7',
    slug: 'power-apps-canvas-app-sharepoint-complete-guide',
    title: 'Building a Power Apps Canvas App with SharePoint: A Complete Guide',
    excerpt:
      'Step-by-step guide to building a fully functional Power Apps canvas app connected to a SharePoint list — from creating your data source to publishing a polished app with search, filters, and forms.',
    content: `
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
- **Power Apps maker access** — go to \`make.powerapps.com\` to verify
- **A modern browser** — Edge or Chrome recommended

## Step 1: Create the SharePoint List

Every Power App needs a data source. We'll create a **Project Tracker** list that the app will read and write to.

Go to your SharePoint site → **New** → **List** → **Blank list**. Name it \`Project Tracker\`.

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
2. Name your app: \`Project Tracker App\`
3. Power Apps opens with a **three-screen app** auto-generated:
   - **BrowseScreen1** — gallery showing all items
   - **DetailScreen1** — read-only view of a single item
   - **EditScreen1** — edit form for creating/updating items

This auto-generated app is functional but ugly. Let's customize it.

## Step 3: Customize the Browse Gallery

Select **BrowseGallery1** on BrowseScreen1. This is the main list view.

### Change the Layout

In the Properties pane, change **Layout** to **Title, subtitle, and body**. Then set:

\`\`\`
Title: ThisItem.Title
Subtitle: ThisItem.Status & " • " & ThisItem.Priority
Body: "Due: " & Text(ThisItem.DueDate, "MMM dd, yyyy")
\`\`\`

### Add Conditional Formatting

Select the **Status** label in the gallery. Set its **Color** property:

\`\`\`
Switch(
    ThisItem.Status.Value,
    "Completed", Color.Green,
    "In Progress", Color.DodgerBlue,
    "On Hold", Color.Orange,
    "Not Started", Color.Gray,
    Color.Black
)
\`\`\`

This gives instant visual feedback — green for done, blue for active, orange for blocked.

### Add a Priority Icon

Insert an **Icon** control into the gallery. Set the **Icon** property:

\`\`\`
Switch(
    ThisItem.Priority.Value,
    "High", Icon.Warning,
    "Medium", Icon.Edit,
    "Low", Icon.CheckBadge,
    Icon.Information
)
\`\`\`

Set the **Color** property:

\`\`\`
Switch(
    ThisItem.Priority.Value,
    "High", RGBA(220, 38, 38, 1),
    "Medium", RGBA(234, 179, 8, 1),
    "Low", RGBA(34, 197, 94, 1),
    Color.Gray
)
\`\`\`

## Step 4: Build the Edit Form

Select **EditForm1** on EditScreen1. This is where users create and edit items.

### Configure Data Cards

Each field in the form is a **Data Card**. To customize:

1. Select the data card → **Advanced** tab → **Unlock** the card
2. Now you can modify individual controls inside the card

### Add Validation

Select the **Save** icon (or button) and wrap the \`SubmitForm\` call with validation:

\`\`\`
If(
    IsBlank(DataCardValue_Title.Text),
    Notify("Project name is required", NotificationType.Error),
    IsBlank(DataCardValue_DueDate.SelectedDate),
    Notify("Due date is required", NotificationType.Error),
    SubmitForm(EditForm1)
)
\`\`\`

### Set Default Values

For new items, set default values on the data cards:

- **Status** default: \`"Not Started"\`
- **Priority** default: \`"Medium"\`
- **PercentComplete** default: \`0\`

Select the data card → \`Default\` property → set your value.

## Step 5: Add Search and Filtering

Back on BrowseScreen1, let's add real search and filter capabilities.

### Search Bar

The auto-generated app includes a search box. Update the gallery's **Items** property:

\`\`\`
SortByColumns(
    Filter(
        'Project Tracker',
        StartsWith(Title, TextSearchBox1.Text) ||
        TextSearchBox1.Text = ""
    ),
    "DueDate",
    SortOrder.Ascending
)
\`\`\`

This searches by project title and sorts by due date.

### Status Filter Dropdown

Insert a **Dropdown** control above the gallery. Set its properties:

\`\`\`
Items: ["All", "Not Started", "In Progress", "Completed", "On Hold"]
Default: "All"
\`\`\`

Update the gallery's **Items** property to include the filter:

\`\`\`
SortByColumns(
    Filter(
        'Project Tracker',
        (StartsWith(Title, TextSearchBox1.Text) || TextSearchBox1.Text = "")
        && (StatusFilter.Selected.Value = "All" || Status.Value = StatusFilter.Selected.Value)
    ),
    "DueDate",
    SortOrder.Ascending
)
\`\`\`

Now users can search by name AND filter by status simultaneously.

## Step 6: Add a Dashboard Header

Let's add a summary bar at the top of BrowseScreen1 showing key metrics.

Insert a **horizontal container** at the top. Add four **Label** controls inside:

\`\`\`
"Total: " & CountRows('Project Tracker')
"Active: " & CountIf('Project Tracker', Status.Value = "In Progress")
"Completed: " & CountIf('Project Tracker', Status.Value = "Completed")
"Overdue: " & CountIf('Project Tracker', DueDate < Today() && Status.Value <> "Completed")
\`\`\`

Style each label with a colored background to create a metrics dashboard — similar to the KPI cards you see in Power BI.

## Step 7: Publish and Share

Once your app is ready:

1. **File** → **Save** → **Publish** → **Publish this version**
2. **Share** → enter the names or email addresses of your team
3. Users can access the app at \`apps.powerapps.com\` or:

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
| \`Filter('List', Status.Value = "Active")\` | Get items matching a condition |
| \`LookUp('List', ID = Gallery.Selected.ID)\` | Get a single item by ID |
| \`Patch('List', Defaults('List'), {Title: "New Item"})\` | Create a new item directly (no form) |
| \`Patch('List', Gallery.Selected, {Status: {Value: "Done"}})\` | Update a single field |
| \`Remove('List', Gallery.Selected)\` | Delete an item |
| \`CountRows(Filter('List', Priority.Value = "High"))\` | Count items with a condition |
| \`SortByColumns(Filter(...), "DueDate", Ascending)\` | Sort filtered results |
| \`Search('List', SearchBox.Text, "Title", "Description")\` | Full-text search across columns |
| \`Collect(colLocal, 'List')\` | Cache list data locally for speed |
| \`Concurrent(fn1, fn2, fn3)\` | Run multiple data calls in parallel |

## Performance Tips

Power Apps + SharePoint has one critical concept you must understand: **delegation**.

### What Is Delegation?

When you write a \`Filter()\` or \`Search()\` formula, Power Apps tries to send the query to SharePoint (server-side). If it can't — because the formula isn't delegable — it downloads **only 500 items** (or 2000 with admin settings) and filters locally.

This means **your app silently returns incomplete data** if you exceed the delegation limit.

### Delegable vs Non-Delegable

| Delegable (Server-side) | Non-Delegable (Local only) |
|------------------------|---------------------------|
| \`Filter()\` with =, <>, <, >, StartsWith | \`Search()\` (partially delegable) |
| \`Sort()\` on indexed columns | \`in\` operator |
| \`LookUp()\` | \`IsBlank()\` inside Filter |
| \`StartsWith()\` | \`Len()\`, \`Left()\`, \`Mid()\` |

### How to Avoid Delegation Issues

1. **Index your SharePoint columns** — go to List Settings → Indexed Columns → add indexes on columns you filter by (Status, Priority, DueDate)
2. **Use \`StartsWith()\` instead of \`Search()\`** for delegable text searches
3. **Increase the data row limit** — Settings → General → Data row limit → set to 2000
4. **Use \`Collect()\` for small lists** (under 2000 items) — cache the entire list in a local collection on app start
5. **Use \`Concurrent()\`** to parallelize multiple data source calls on screen load

### App Load Performance

Add this to your **App.OnStart** for faster perceived performance:

\`\`\`
Concurrent(
    ClearCollect(colProjects, 'Project Tracker'),
    ClearCollect(colTeam, Office365Users.SearchUser({searchTerm: "", top: 100})),
    Set(varToday, Today())
);
\`\`\`

This loads all your data sources in parallel instead of sequentially, cutting load time significantly.

## My Recommendations

After building dozens of Power Apps for enterprise teams, here's what actually matters:

1. **Start from SharePoint, not from scratch.** The auto-generated three-screen app gives you 70% of what you need. Customize from there instead of building screen by screen
2. **Keep your list under 2000 items.** Above this, delegation issues become a real headache. For larger datasets, use Dataverse instead of SharePoint lists
3. **Use variables for shared state.** Store the current user (\`Set(varCurrentUser, User())\`) and frequently used values in global variables on App.OnStart
4. **Test with real data volumes.** An app that works with 10 items might break with 500 due to delegation. Always test with production-scale data
5. **Invest in the UI.** Default Power Apps look like enterprise software from 2005. Spend 20% of your time on visual polish — rounded corners, consistent spacing, and a color theme do wonders for adoption
6. **Use components for reusable elements.** Headers, navigation bars, and status badges should be components, not copy-pasted across screens
7. **Version your apps.** Power Apps has built-in versioning. Before every major change, publish a version so you can roll back if needed

Power Apps isn't trying to replace custom development — it's for the 80% of internal tools that don't justify a full dev cycle. For a SharePoint developer, it's the fastest way to put a polished UI on top of your list data without writing a single line of TypeScript.
`,
    date: '2026-03-01',
    displayDate: 'March 1, 2026',
    readTime: '10 min read',
    category: 'Power Platform',
    tags: ['power-apps', 'sharepoint', 'canvas-app', 'low-code', 'power-platform'],
  },
  {
    id: '6',
    slug: 'spfx-1-23-new-cli-replacing-yeoman-migration-guide',
    title: 'SPFx 1.23: The New CLI That Replaces Yeoman — What You Need to Know',
    excerpt:
      'Microsoft is replacing the Yeoman generator with a new open-source SPFx CLI in version 1.23. Here\'s what changes, how to migrate, and why this is the biggest SPFx tooling shift in years.',
    content: `
## The Biggest SPFx Tooling Change in Years

If you've been building SPFx solutions, you've typed \`yo @microsoft/sharepoint\` hundreds of times. That's about to change. **SPFx 1.23** (rolling out February–March 2026) introduces a brand-new, open-source CLI that replaces the Yeoman generator entirely.

This isn't just a cosmetic update — it's a fundamental shift in how SPFx projects are scaffolded, built, and maintained. Combined with the Gulp-to-Heft migration from SPFx 1.22, the entire developer toolchain is being modernized.

## What's Changing in SPFx 1.23

Here's the short version:

| What | Before (SPFx ≤ 1.22) | After (SPFx 1.23+) |
|------|----------------------|---------------------|
| Project scaffolding | Yeoman generator | New SPFx CLI |
| Build system | Gulp | Heft + Webpack |
| Templates | Closed-source, bundled | Open-source on GitHub |
| Custom templates | Not supported | Fully supported |
| CLI versioning | Tied to SPFx version | Decoupled — independent releases |

### The New SPFx CLI

The new CLI is a standalone tool, **decoupled from the SPFx release cycle**. This means:

- **Faster updates:** CLI improvements ship independently of SPFx versioning
- **Open-source templates:** All scaffolding templates are on GitHub — you can fork, modify, and contribute
- **Company-specific templates:** Organizations can create custom scaffolding baselines with pre-configured linting, testing frameworks, and folder structures
- **Community contributions:** Anyone can submit PRs to improve the default templates

### How to Use the New CLI

Install it globally (replaces \`yo @microsoft/sharepoint\`):

\`\`\`bash
npm install -g @microsoft/spfx-cli
\`\`\`

Scaffold a new project:

\`\`\`bash
spfx new webpart --name hello-world --framework react
\`\`\`

The command structure is more intuitive than Yeoman's interactive prompts. You can also run it non-interactively for CI/CD pipelines:

\`\`\`bash
spfx new webpart --name my-webpart --framework react --skip-install
\`\`\`

### Custom Company Templates

This is the feature enterprise developers have been asking for. You can now create your own template repository:

\`\`\`bash
spfx new webpart --template https://github.com/your-org/spfx-template
\`\`\`

Your template can include:
- Pre-configured ESLint rules
- Company-standard folder structure
- Built-in PnP JS setup
- Standard CI/CD files (GitHub Actions, Azure DevOps)
- Shared utility libraries

## The Build System: Gulp Is Gone

SPFx 1.22 already introduced the new build toolchain, and 1.23 makes it the default:

### Old Pipeline (Gulp-based)

\`\`\`bash
gulp serve        # Local development
gulp bundle --ship     # Bundle for production
gulp package-solution --ship  # Create .sppkg
\`\`\`

### New Pipeline (Heft-based)

\`\`\`bash
npm run serve     # Local development (uses Heft + Webpack)
npm run build     # Production build
npm run package   # Create .sppkg
\`\`\`

Under the hood, **Heft** (from the Rush Stack family) replaces Gulp as the task runner, and **Webpack** handles bundling directly. This brings several advantages:

- **Faster builds:** Heft parallelizes tasks better than Gulp's sequential pipeline
- **Better tree-shaking:** Direct Webpack integration means smaller bundle sizes
- **Modern tooling:** No more Gulp plugins that haven't been updated in years
- **Standard npm scripts:** \`npm run build\` just works — no global Gulp CLI needed

## Migration Guide: Yeoman to New CLI

If you have existing SPFx projects, here's what you need to do:

### For New Projects

Simply use the new CLI instead of Yeoman. No migration needed:

\`\`\`bash
# Old way (still works but deprecated)
yo @microsoft/sharepoint

# New way
spfx new webpart --name my-webpart
\`\`\`

### For Existing Projects

Existing projects built with Yeoman **will continue to work**. Microsoft isn't breaking backward compatibility. However, to get the benefits of the new build toolchain:

1. **Update SPFx version** in your \`package.json\` to 1.23
2. **Run the upgrade report:** Use the Microsoft 365 CLI to see exactly what needs to change:

\`\`\`bash
npx @pnp/cli-microsoft365 spfx project upgrade --output md
\`\`\`

3. **Follow the generated report** — it lists every file change, dependency update, and config migration needed
4. **Replace Gulp tasks** with npm scripts in \`package.json\`
5. **Test thoroughly** — run \`npm run serve\` and verify everything works in the local workbench

### Key Dependency Changes

\`\`\`json
{
  "devDependencies": {
    "@microsoft/sp-build-web": "1.23.0",
    "@rushstack/heft": "^0.67.0",
    "webpack": "^5.90.0"
  }
}
\`\`\`

Remove these deprecated packages:
- \`gulp\`
- \`@microsoft/sp-build-core-tasks\`
- \`@microsoft/sp-module-interfaces\`

## Other SPFx 1.23 Features

### Command Set Enhancements

Command Sets (toolbar buttons) for lists and libraries get new capabilities:

- **Command grouping:** Group related commands under a dropdown menu instead of cluttering the toolbar
- **Conditional visibility:** Show/hide commands based on item metadata, not just selection count
- **Panel-level overrides:** Replace the default side panel in Microsoft Lists with your own SPFx component

### Debugging Toolbar

The new server-side debugging toolbar (introduced in 1.22.2) is now stable:

- Debug SPFx solutions directly in live SharePoint pages
- View component props, state, and render timing
- No need to use the workbench for testing
- Toggle it on/off with a URL parameter: \`?debugManifestsFile=...\`

## What's Coming Next: SPFx 1.24

Looking ahead to May/June 2026:

- **Navigation customizers:** Override SharePoint navigation nodes with SPFx components — build fully custom nav experiences
- **Enhanced form customizers:** More control over list form rendering
- **AI-assisted development:** Integration with Copilot for generating SPFx components from natural language descriptions

## My Recommendations

After testing the SPFx 1.23 preview extensively, here's my advice:

1. **Start using the new CLI now** for all new projects. The old Yeoman generator still works, but it's deprecated and won't get new features
2. **Don't rush to migrate existing projects.** Wait until your next major feature release, then do the upgrade alongside other changes
3. **Create company templates** if you're building multiple SPFx solutions. The time investment pays off quickly when every project starts with your standard setup
4. **Embrace Heft.** The Gulp ecosystem for SPFx was always fragile — Heft is a significant improvement in reliability and performance
5. **Use the M365 CLI upgrade report.** Don't manually figure out what to change — let the tooling tell you exactly what's needed

The transition from Yeoman to the new CLI is the biggest SPFx tooling shift since SPFx was first released. But unlike some Microsoft migrations, this one is actually well-planned, backward-compatible, and genuinely improves the developer experience.
`,
    date: '2026-02-25',
    displayDate: 'February 25, 2026',
    readTime: '10 min read',
    category: 'SPFx',
    tags: ['spfx', 'cli', 'yeoman', 'migration', 'heft', 'webpack'],
  },
  {
    id: '5',
    slug: 'building-copilot-declarative-agents-teams-toolkit',
    title: 'Building Declarative Agents for Microsoft 365 Copilot with Teams Toolkit',
    excerpt:
      'A hands-on guide to creating your first Copilot declarative agent — from scaffolding with Teams Toolkit to defining capabilities, adding API plugins, and deploying to your tenant.',
    content: `
## What Are Declarative Agents?

Declarative agents are **custom extensions** for Microsoft 365 Copilot that let you tailor Copilot's behavior for specific scenarios — without writing complex bot code. Instead of building an entire conversational AI from scratch, you **declare** what the agent should do using a JSON manifest.

Think of it this way: Microsoft 365 Copilot is the engine, and declarative agents let you put a custom steering wheel on it. You control:

- **What knowledge** the agent can access (SharePoint sites, Graph connectors, specific files)
- **What tone** it uses (formal, friendly, technical)
- **What actions** it can perform via API plugins
- **What boundaries** it stays within

## Why Declarative Agents Over Custom Bots?

If you've built Teams bots before, you know the pain: Bot Framework SDK, OAuth flows, adaptive cards, deployment infrastructure. Declarative agents skip all of that:

| Feature | Custom Bot | Declarative Agent |
|---------|-----------|------------------|
| Code required | Hundreds of lines | Zero (JSON only) |
| Hosting | Your own server/Azure | Microsoft-hosted |
| Auth | Manual OAuth setup | Automatic SSO |
| AI model | BYO (OpenAI, etc.) | Microsoft 365 Copilot |
| Knowledge | Manual RAG pipeline | Point at SharePoint/Graph |
| Deployment | App registration + publish | Sideload or admin deploy |

For most enterprise scenarios — IT help desks, HR assistants, project knowledge bases — declarative agents are the right choice.

## Prerequisites

Before you start building, make sure you have:

- **Microsoft 365 Copilot license** (E3/E5 + Copilot add-on or Copilot Pro)
- **Teams Toolkit for VS Code** (v5.10 or later — install from Extensions marketplace)
- **Node.js 18+** and **npm**
- **Microsoft 365 developer tenant** (or your production tenant with sideloading enabled)
- **Teams desktop or web client** for testing

## Step 1: Scaffold the Project

Open VS Code, then use the Teams Toolkit to create your project:

1. Press **Ctrl+Shift+P** → type **Teams: Create a New App**
2. Select **Copilot Agent** → **Declarative Agent**
3. Choose **No plugin** (we'll add one later)
4. Name your project: \`hr-policy-agent\`

Teams Toolkit generates this structure:

\`\`\`
hr-policy-agent/
├── appPackage/
│   ├── declarativeAgent.json    ← Agent definition
│   ├── manifest.json            ← Teams app manifest
│   └── color.png / outline.png
├── env/
│   ├── .env.dev
│   └── .env.dev.user
├── teamsapp.yml                 ← Lifecycle config
└── package.json
\`\`\`

The magic lives in **declarativeAgent.json** — this is where you define everything.

## Step 2: Configure the Agent Manifest

Open \`appPackage/declarativeAgent.json\`. Here's a real-world configuration for an HR policy assistant:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.2/schema.json",
  "version": "v1.2",
  "name": "HR Policy Assistant",
  "description": "Answers questions about company HR policies including leave, benefits, onboarding, and workplace guidelines.",
  "instructions": "You are the HR Policy Assistant for our organization. Answer questions using ONLY the provided knowledge sources. Be professional but approachable. If you cannot find the answer in the knowledge sources, say: 'I don't have that information in our HR documentation. Please contact hr@company.com or visit the HR portal.' Never fabricate policies or provide legal advice. Always cite which document your answer comes from."
}
\`\`\`

### Key Fields Explained

- **name**: Shows up in the Copilot UI when users mention the agent
- **description**: Helps Copilot understand when to route questions to your agent
- **instructions**: The system prompt — this is the most important field. Be specific about tone, boundaries, and fallback behavior

## Step 3: Add Knowledge Sources

The real power of declarative agents is grounding them in your organization's data. Add a \`capabilities\` section:

\`\`\`json
{
  "capabilities": [
    {
      "name": "OneDriveAndSharePoint",
      "items_by_url": [
        {
          "url": "https://contoso.sharepoint.com/sites/HR/Policies"
        },
        {
          "url": "https://contoso.sharepoint.com/sites/HR/Employee-Handbook"
        }
      ]
    }
  ]
}
\`\`\`

The agent will **only** answer from these SharePoint locations. This is crucial for enterprise compliance — you control exactly what data the agent can reference.

### Supported Knowledge Sources

- **SharePoint sites and libraries** — most common for enterprise knowledge bases
- **Microsoft Graph connectors** — pull data from external systems (ServiceNow, Confluence, etc.)
- **Specific files and folders** — narrow scope to individual documents

## Step 4: Add an API Plugin (Optional but Powerful)

Want your agent to **do things**, not just answer questions? Add an API plugin. For example, let's add the ability to submit a leave request:

Create \`appPackage/apiPlugin.json\`:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/plugin/v2.2/schema.json",
  "schema_version": "v2.2",
  "name_for_human": "Leave Request",
  "description_for_human": "Submit and check leave requests",
  "namespace": "leaveRequests",
  "functions": [
    {
      "name": "submitLeaveRequest",
      "description": "Submit a new leave request for the current user",
      "capabilities": {
        "confirmation": {
          "type": "AdaptiveCard",
          "title": "Confirm Leave Request",
          "body": "Submit a leave request from {{startDate}} to {{endDate}}?"
        }
      }
    }
  ],
  "runtimes": [
    {
      "type": "OpenApi",
      "auth": { "type": "OAuthPluginVault" },
      "spec": { "url": "apiSpecification/openapi.json" }
    }
  ]
}
\`\`\`

Then reference it in your \`declarativeAgent.json\`:

\`\`\`json
{
  "actions": [
    {
      "id": "leaveRequestPlugin",
      "file": "apiPlugin.json"
    }
  ]
}
\`\`\`

Now your agent can answer HR questions **and** take actions — all within the Copilot chat interface.

## Step 5: Test Locally

Teams Toolkit makes testing straightforward:

1. Press **F5** in VS Code (or click the **Run** button in Teams Toolkit)
2. Teams Toolkit will:
   - Package your app manifest
   - Sideload the agent to your Teams client
   - Open Teams in your browser
3. Open **Microsoft 365 Copilot** in Teams
4. Click the **agent icon** (right side of chat) → select your agent
5. Ask a question: *"What is our parental leave policy?"*

### Debugging Tips

- **Agent doesn't appear?** Check that sideloading is enabled in your tenant admin center
- **Wrong answers?** Refine your \`instructions\` field — more specific prompts give better results
- **No knowledge grounding?** Verify the SharePoint URLs are accessible to the logged-in user
- **API plugin errors?** Check the OpenAPI spec matches your actual API endpoints

## Step 6: Deploy to Your Organization

When you're ready to go live:

### Option A: Admin Deployment (Recommended for Enterprise)

1. Run \`Teams: Zip Teams Metadata Package\` from the command palette
2. Go to the **Teams Admin Center** → **Manage Apps** → **Upload**
3. Upload the \`.zip\` package
4. Assign the app to specific users or the entire organization
5. Users will see the agent in their Copilot sidebar within 24 hours

### Option B: Developer Sideload

For testing or small teams, keep using the F5 sideload approach. The agent will only be available to developers who sideload it.

## Best Practices for Production Agents

After building dozens of these for enterprise clients, here are the patterns that work:

- **Be ruthlessly specific in instructions.** Vague instructions = vague answers. Tell the agent exactly what to do and what NOT to do
- **Scope knowledge narrowly.** Start with one SharePoint site, not the entire tenant. Expand based on user feedback
- **Add example questions.** Include 3-5 sample prompts in your agent's \`conversation_starters\` to guide users
- **Monitor and iterate.** Check Copilot analytics in the admin center to see what users ask. Update knowledge sources based on gaps
- **Version your manifests.** Treat \`declarativeAgent.json\` like code — commit to Git, review changes, tag releases
- **Test with real users.** What makes sense to you as a developer might confuse end users. Run a pilot with 10-20 people before org-wide rollout

## What's Coming Next

Microsoft's 2026 roadmap for declarative agents is exciting:

- **Multi-agent orchestration** — agents that delegate to other agents for complex workflows
- **Autonomous triggers** — agents that proactively notify users based on events (e.g., policy updates)
- **Enhanced Graph connector support** — connect to 50+ enterprise systems out of the box
- **Agent analytics dashboard** — ROI tracking, usage patterns, and knowledge gap analysis

Declarative agents represent the future of enterprise AI assistants. They're simple enough to build in an afternoon, yet powerful enough to handle real business scenarios. If you're already in the Microsoft 365 ecosystem, this is the fastest path from idea to deployed AI assistant.
`,
    date: '2026-02-24',
    displayDate: 'February 24, 2026',
    readTime: '11 min read',
    category: 'Microsoft 365',
    tags: ['copilot', 'declarative-agents', 'teams-toolkit', 'microsoft-365', 'ai-development'],
  },
  {
    id: '4',
    slug: 'sharepoint-agents-ai-powered-assistants',
    title: 'SharePoint Agents: Build AI-Powered Assistants for Your Intranet',
    excerpt:
      'Learn how to create AI-powered agents that use your SharePoint site content as a knowledge base — from setup in Copilot Studio to deploying in Teams chat.',
    content: `
## What Are SharePoint Agents?

SharePoint Agents are **AI-powered assistants** that live on your SharePoint sites and answer questions based on your site's content. Think of them as a custom ChatGPT trained exclusively on your organization's documents, pages, and list data.

Powered by **Microsoft 365 Copilot**, these agents can:
- Answer employee questions using site content as the knowledge base
- Search across pages, documents, and list items
- Be accessed directly in **Microsoft Teams** chat
- Be scoped to specific content so they only answer what they should

## Why SharePoint Agents Matter

Every organization has the same problem: employees can't find information. It's buried in SharePoint libraries, nested in folder structures, or locked inside PDFs nobody reads.

SharePoint Agents solve this by putting an **AI layer on top of your existing content**:

- **Reduce IT/HR support tickets** by 40-60% with self-service answers
- **Faster onboarding** — new hires ask the agent instead of bothering colleagues
- **Always up-to-date** — the agent reads live site content, not a static FAQ
- **Zero training data needed** — your SharePoint content IS the training data

## Prerequisites

Before you create your first agent, make sure you have:

- **Microsoft 365 Copilot license** (included in Copilot for Microsoft 365)
- **SharePoint Online** — agents are not available for on-premises
- **Site Owner or Site Collection Admin** permissions
- **Copilot Studio** access (included with Copilot license)
- **Well-structured content** — agents work best when your pages have clear headings and metadata

## Step-by-Step: Creating Your First Agent

### Step 1: Navigate to Your SharePoint Site

Go to the SharePoint site you want the agent to cover. This could be an HR portal, IT knowledge base, or project site.

### Step 2: Open Copilot Studio from Site Settings

Click the **Settings gear** → **Copilot Studio** → **Create an Agent**.

Alternatively, go directly to \`https://copilotstudio.microsoft.com\` and select **New Agent** → **SharePoint** as the knowledge source.

### Step 3: Configure Knowledge Sources

Add the content your agent should know about:

\`\`\`
Knowledge Sources:
├── SharePoint Site Pages     (auto-indexed)
├── Document Libraries        (PDFs, Word, Excel)
├── SharePoint Lists           (structured data)
└── Specific Folders           (scoped access)
\`\`\`

**Pro tip:** Start narrow. Pick one library or set of pages rather than the entire site. You can always expand later.

### Step 4: Write Agent Instructions

This is where you define the agent's personality and boundaries:

\`\`\`
You are the IT Help Desk assistant for Contoso.
Answer questions using only the content from the IT Knowledge Base site.
If you don't know the answer, say "I don't have that information.
Please contact helpdesk@contoso.com for further assistance."
Always be professional and concise.
Do not make up answers or reference external sources.
\`\`\`

### Step 5: Test in the Preview Pane

Copilot Studio provides a live preview where you can ask questions and see how the agent responds. Test with:
- Questions your employees actually ask
- Edge cases (topics NOT on the site)
- Different phrasings of the same question

### Step 6: Publish

Click **Publish** to make the agent live. Choose where it should be accessible:
- On the SharePoint site itself (embedded chat widget)
- In Microsoft Teams (as a bot in 1:1 or group chat)
- Both

## Customizing Agent Behavior

### Setting Topics

Topics let you define structured conversation flows for common scenarios:

- **Password Reset** → Guide through self-service portal steps
- **Leave Policy** → Pull from HR policy documents
- **Software Request** → Link to the request form

### Adjusting Tone

You control the agent's personality through the system instructions:

- **Formal:** "Respond in a professional, third-person tone"
- **Friendly:** "Be conversational and use first-person language"
- **Technical:** "Include technical details and reference document sections"

### Setting Boundaries

Critical for enterprise deployment:

- **Scope:** Only answer from approved knowledge sources
- **Fallback:** Always provide a human escalation path
- **Guardrails:** Prevent the agent from discussing topics outside its scope

## Using Your Agent in Teams

Once published, users can interact with the agent directly in Microsoft Teams:

1. Open **Teams** → **Chat** → **Search** for your agent name
2. Start a 1:1 conversation
3. Ask questions in natural language
4. The agent responds with answers sourced from your SharePoint content
5. Responses include **citations** linking back to the original SharePoint page or document

This is the killer feature — employees don't need to leave Teams to get answers from SharePoint.

## Best Practices

- **Content hygiene is everything.** Agents are only as good as the content they read. Clean up outdated pages, fix broken metadata, and use descriptive titles
- **Use metadata and columns.** Agents reason better over structured data. Add categories, departments, and dates to your lists and libraries
- **Respect permissions.** Agents honor SharePoint permissions — users only see answers from content they have access to
- **Start small, iterate fast.** Launch with one department (IT or HR), gather feedback, then expand
- **Monitor analytics.** Copilot Studio provides conversation analytics — track what users ask, what goes unanswered, and where the agent struggles
- **Update regularly.** As you add new content to SharePoint, the agent automatically picks it up — but review its responses quarterly

## What's Next

Microsoft's roadmap for SharePoint Agents in late 2026 includes:

- **Autonomous multi-step agents** that can perform actions (not just answer questions) — like submitting forms, creating list items, or triggering Power Automate flows
- **Cross-site agents** that span multiple SharePoint sites for organization-wide knowledge
- **Agent-to-agent orchestration** where specialized agents hand off to each other
- **Advanced analytics dashboards** showing ROI and knowledge gaps

SharePoint Agents represent a fundamental shift in how organizations interact with their intranet. The content you've been building in SharePoint for years is now the fuel for AI-powered experiences — and the best part is, you don't need to write a single line of code.
`,
    date: '2026-02-24',
    displayDate: 'February 24, 2026',
    readTime: '9 min read',
    category: 'SharePoint',
    tags: ['sharepoint', 'copilot', 'ai-agents', 'microsoft-365', 'copilot-studio'],
  },
  {
    id: '1',
    slug: 'building-spfx-hello-world-webpart',
    title: 'Building Your First SPFx Web Part: A Complete Hello World Guide',
    excerpt:
      'Step-by-step guide to creating your first SharePoint Framework (SPFx) web part — from scaffolding to deployment, with real screenshots from my tenant.',
    content: `
## Why SPFx?

SharePoint Framework (SPFx) is the recommended way to customize and extend SharePoint Online. Unlike legacy solutions (farm solutions, sandboxed solutions), SPFx runs client-side in the browser and works seamlessly with modern SharePoint pages.

## Prerequisites

Before we start, make sure you have:

- **Node.js** v18.x (LTS) — SPFx 1.19 requires this specific version
- **Gulp CLI** — \`npm install -g gulp-cli\`
- **Yeoman** — \`npm install -g yo\`
- **SPFx Generator** — \`npm install -g @microsoft/generator-sharepoint\`

## Scaffold the Project

Open your terminal and run:

\`\`\`bash
yo @microsoft/sharepoint
\`\`\`

When prompted:
1. **Solution name:** hello-world-webpart
2. **Target:** SharePoint Online only
3. **Framework:** React
4. **Web part name:** HelloWorld

## Project Structure

After scaffolding, your project looks like:

\`\`\`
hello-world-webpart/
├── src/
│   └── webparts/
│       └── helloWorld/
│           ├── HelloWorldWebPart.ts
│           ├── components/
│           │   ├── HelloWorld.tsx
│           │   └── HelloWorld.module.scss
│           └── loc/
├── config/
├── gulpfile.js
└── package.json
\`\`\`

## Key Files Explained

### HelloWorldWebPart.ts
This is the entry point. It extends \`BaseClientSideWebPart\` and defines the property pane configuration.

### HelloWorld.tsx
The React component that renders the UI. This is where most of your development happens.

## Run It Locally

\`\`\`bash
gulp serve
\`\`\`

This opens the SharePoint Workbench at \`https://localhost:4321/temp/workbench.html\`.

## Deploy to SharePoint

1. \`gulp bundle --ship\`
2. \`gulp package-solution --ship\`
3. Upload the \`.sppkg\` file to your App Catalog
4. Add the web part to a modern page

## Common Gotchas

- **Node version mismatch:** SPFx 1.19 needs Node 18. Use \`nvm\` to manage versions.
- **Certificate errors:** Run \`gulp trust-dev-cert\` before first \`gulp serve\`.
- **Property pane not updating:** Make sure to call \`this.render()\` in \`onPropertyPaneFieldChanged\`.

## Next Steps

In the next post, I'll cover how to add real SharePoint data using PnP JS and the Microsoft Graph API.
`,
    date: '2026-02-18',
    displayDate: 'February 18, 2026',
    readTime: '8 min read',
    category: 'SPFx',
    tags: ['spfx', 'webpart', 'react', 'sharepoint-online'],
  },
  {
    id: '2',
    slug: 'power-automate-sharepoint-approval-flow',
    title: 'Building a SharePoint Approval Flow with Power Automate',
    excerpt:
      'How I built a document approval workflow using Power Automate that sends Teams notifications and updates SharePoint list status — complete walkthrough.',
    content: `
## The Problem

My team needed a document approval process:
1. User uploads a document to a SharePoint library
2. Manager gets notified in Teams
3. Manager approves/rejects
4. SharePoint column updates automatically
5. User gets email notification

## The Solution: Power Automate

### Trigger: When a file is created

Use the **"When a file is created (properties only)"** trigger. Select your SharePoint site and document library.

### Step 1: Start an Approval

Add the **"Start and wait for an approval"** action:
- **Approval type:** Approve/Reject - First to respond
- **Title:** Document Approval: [File Name]
- **Assigned to:** manager@company.com

### Step 2: Check the Response

Add a **Condition** action:
- \`Outcome\` is equal to \`Approve\`

### Step 3: Update SharePoint

In the **Yes** branch, add **"Update file properties"**:
- Set the \`Status\` column to \`Approved\`

In the **No** branch:
- Set the \`Status\` column to \`Rejected\`

### Step 4: Send Notification

Add **"Send an email"** or **"Post message in Teams"** to notify the original uploader.

## Tips

- **Always add error handling:** Use \`Configure run after\` on critical steps
- **Use parallel branches** for Teams + Email notifications (faster execution)
- **Add a timeout** to the approval step (e.g., 7 days) so flows don't run forever

## Performance

This flow runs in under 30 seconds for the approval notification. The total cycle time depends on how fast the manager responds.
`,
    date: '2026-02-16',
    displayDate: 'February 16, 2026',
    readTime: '6 min read',
    category: 'Power Platform',
    tags: ['power-automate', 'sharepoint', 'approval', 'teams'],
  },
  {
    id: '3',
    slug: 'sharepoint-column-formatting-json',
    title: 'SharePoint Column Formatting: Beautiful List Views with JSON',
    excerpt:
      'Transform boring SharePoint lists into visual dashboards using JSON column formatting. Status badges, progress bars, and conditional icons — no code deployment needed.',
    content: `
## Why Column Formatting?

SharePoint column formatting lets you customize how columns look using JSON. No SPFx deployment, no app catalog — just paste JSON into the column settings.

## Example 1: Status Badge

Turn a plain text column into colored badges:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "div",
  "style": {
    "padding": "4px 12px",
    "border-radius": "16px",
    "display": "inline-block",
    "font-size": "12px",
    "font-weight": "600"
  },
  "attributes": {
    "class": {
      "operator": ":",
      "operands": [
        { "operator": "==", "operands": ["@currentField", "Active"] },
        "sp-css-backgroundColor-successBackground sp-css-color-SuccessText",
        {
          "operator": ":",
          "operands": [
            { "operator": "==", "operands": ["@currentField", "Pending"] },
            "sp-css-backgroundColor-warningBackground sp-css-color-WarningText",
            "sp-css-backgroundColor-errorBackground sp-css-color-ErrorText"
          ]
        }
      ]
    }
  },
  "txtContent": "@currentField"
}
\`\`\`

## Example 2: Progress Bar

Show a percentage column as a visual progress bar:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "div",
  "style": {
    "width": "100%",
    "height": "20px",
    "background-color": "#e0e0e0",
    "border-radius": "10px",
    "overflow": "hidden"
  },
  "children": [
    {
      "elmType": "div",
      "style": {
        "width": "=toString(@currentField) + '%'",
        "height": "100%",
        "background-color": "=if(@currentField >= 80, '#4caf50', if(@currentField >= 50, '#ff9800', '#f44336'))",
        "border-radius": "10px",
        "transition": "width 0.3s"
      }
    }
  ]
}
\`\`\`

## How to Apply

1. Go to your SharePoint list
2. Click the column header → **Column settings** → **Format this column**
3. Switch to **Advanced mode**
4. Paste your JSON
5. Click **Save**

## Tips

- Always include the \`$schema\` line for IntelliSense in VS Code
- Test with the **Preview** button before saving
- Use \`@me\` to personalize views per user
- Check Microsoft's official samples: [Column Formatting Samples](https://github.com/SharePoint/sp-dev-list-formatting)
`,
    date: '2026-02-14',
    displayDate: 'February 14, 2026',
    readTime: '7 min read',
    category: 'SharePoint',
    tags: ['sharepoint', 'column-formatting', 'json', 'no-code'],
  },
]
