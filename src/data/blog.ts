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
