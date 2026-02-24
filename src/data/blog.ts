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
