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
    id: '15',
    slug: 'copilot-studio-sharepoint-ai-assistants-guide-2026',
    title: 'Copilot Studio + SharePoint: Build 3 AI Assistants for Your Organization (2026)',
    excerpt:
      'Create AI-powered assistants that answer questions from SharePoint documents, search across sites, and automate workflows \u2014 all with Microsoft Copilot Studio. No coding required.',
    image: '/images/blog/copilot-studio-sharepoint-guide.png',
    content: `
## Why Copilot Studio for SharePoint?

Microsoft Copilot Studio is a low-code platform for building AI agents (chatbots) that connect to your organization\u2019s data. When combined with SharePoint, these agents can:

- **Answer questions** from documents stored in SharePoint libraries
- **Search across multiple sites** to find policies, procedures, and knowledge base articles
- **Automate workflows** by triggering Power Automate flows from a chat conversation
- **Serve employees directly** inside SharePoint pages, Teams, or Microsoft 365 Copilot Chat

Unlike generic chatbots, Copilot Studio agents are **grounded in your data** \u2014 they pull answers from your actual SharePoint content, not from the public internet.

**What changed in 2026?**

| Feature | Availability |
|---------|-------------|
| Copilot Studio agent deployment to SharePoint | GA (May 2025) |
| Grounding on SharePoint lists in Copilot Chat | March 2026 |
| AI-assisted content creation in SharePoint | Preview (March 2026) |
| Custom actions with Power Automate | GA |
| Multi-site knowledge grounding | GA |

This guide walks you through building 3 progressively complex agents:

1. **FAQ Bot** \u2014 Answers employee questions from a SharePoint document library
2. **Document Search Assistant** \u2014 Searches across multiple SharePoint sites
3. **Workflow Bot** \u2014 Performs actions (submitting requests, creating items) via Power Automate

## Prerequisites

- **Microsoft 365 license** with Copilot Studio access (E3/E5 or standalone license)
- **SharePoint Online** with at least one site containing documents
- **Power Automate** access (for the workflow bot)
- **Admin or site owner permissions** on the SharePoint sites you want to connect

## Agent 1: FAQ Bot

The simplest agent \u2014 it answers employee questions using documents from a single SharePoint site.

### Step 1: Create a New Agent

1. Go to [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com)
2. Click **Create** in the left navigation
3. Select **New agent**
4. Give it a name: "HR Policy Assistant"
5. Add a description: "Answers questions about company HR policies, benefits, and procedures"
6. Click **Create**

### Step 2: Add SharePoint as a Knowledge Source

1. In your agent, go to the **Knowledge** tab
2. Click **+ Add knowledge**
3. Select **SharePoint**
4. Paste the URL of your SharePoint site (e.g., https://contoso.sharepoint.com/sites/HR)
5. You can add specific document libraries or folders for more focused results
6. Click **Add**

The agent will now index the documents in that SharePoint location. It uses Azure AI Search under the hood to understand document content and return relevant answers.

### Step 3: Configure the System Prompt

The system prompt controls how the agent behaves. Click **Settings** and edit the prompt:

    You are an HR Policy Assistant for Contoso.
    Answer questions using ONLY the documents provided
    in your knowledge sources.
    If you cannot find the answer, say: "I could not
    find this in our HR policies. Please contact
    hr@contoso.com for assistance."
    Always cite the document name where you found
    the answer.
    Keep answers concise - 2-3 paragraphs maximum.

### Step 4: Test the Agent

1. Click **Test your agent** in the top right
2. Ask a question like: "What is our parental leave policy?"
3. The agent should respond with information from your SharePoint documents
4. Verify it cites the correct source document

### Step 5: Deploy to SharePoint

1. Go to **Channels** in the left navigation
2. Click **SharePoint**
3. Select the SharePoint site where you want the agent to appear
4. Choose the page or create a new one
5. The agent will appear as a chat widget on that page

**Result:** Employees can now ask HR questions directly from a SharePoint page and get answers grounded in your actual policy documents.

## Agent 2: Document Search Assistant

This agent searches across **multiple SharePoint sites** \u2014 useful for organizations with department-specific sites (HR, IT, Legal, Finance).

### Add Multiple Knowledge Sources

In the Knowledge tab, add multiple SharePoint sources:

| Knowledge Source | SharePoint URL | Purpose |
|-----------------|----------------|---------|
| HR Policies | /sites/HR | Benefits, leave, onboarding |
| IT Knowledge Base | /sites/ITSupport | Troubleshooting, access requests |
| Legal Compliance | /sites/Legal | Contracts, compliance docs |
| Finance Procedures | /sites/Finance | Expense reports, budgets |

### Configure Search Behavior

Update the system prompt to handle multi-site searches:

    You are a company knowledge assistant for Contoso.
    You have access to documents from HR, IT, Legal,
    and Finance departments.
    When answering questions:
    1. Search across all available knowledge sources
    2. Always state which department the information
       comes from
    3. If multiple departments have relevant info,
       include all perspectives
    4. Cite the specific document and department

### Add Topic-Based Routing

For better accuracy, create **topics** that route questions to the right knowledge source:

1. Go to the **Topics** tab
2. Click **+ Add a topic**
3. Create topics like:
   - "IT Support" \u2014 triggered by phrases like "password reset", "VPN", "laptop"
   - "HR Questions" \u2014 triggered by "leave", "benefits", "salary"
   - "Legal Review" \u2014 triggered by "contract", "NDA", "compliance"

Each topic can have its own response instructions that prioritize the most relevant knowledge source.

### Enable Authentication

For sensitive documents, enable user authentication:

1. Go to **Settings** then **Security**
2. Select **Authenticate with Microsoft**
3. Enable "Require users to sign in"
4. The agent will now respect SharePoint permissions \u2014 users only see documents they have access to

> **Important:** Always enable authentication when the agent has access to confidential documents. This ensures SharePoint permission boundaries are respected.

## Agent 3: Workflow Bot with Custom Actions

This is the most powerful agent \u2014 it not only answers questions but **performs actions** by triggering Power Automate flows.

### Use Case: IT Service Desk Bot

The bot can:
- Answer IT questions from the knowledge base
- Submit support tickets to a SharePoint list
- Check the status of existing tickets
- Reset user permissions (via Power Automate)

### Step 1: Create the Power Automate Flow

First, create a flow that the agent can call. This example creates a support ticket in a SharePoint list:

1. Go to [make.powerautomate.com](https://make.powerautomate.com)
2. Create a new **Instant cloud flow**
3. Choose the trigger: **Run a flow from Copilot**
4. Add inputs:
   - **Title** (text) \u2014 The ticket subject
   - **Description** (text) \u2014 Detailed description
   - **Priority** (text) \u2014 Low, Medium, High
   - **UserEmail** (text) \u2014 The requester email

5. Add a SharePoint action: **Create item**
   - Site: https://contoso.sharepoint.com/sites/ITSupport
   - List: Support Tickets
   - Map the inputs to the list columns

6. Add a response: **Respond to Copilot**
   - Return the ticket ID and confirmation message

7. Save and test the flow

For more Power Automate patterns, see my [SharePoint document workflows guide](/blog/power-automate-sharepoint-document-workflows-2026).

### Step 2: Add the Action to Your Agent

1. In Copilot Studio, go to your agent
2. Click **Actions** in the left navigation
3. Click **+ Add an action**
4. Select **Power Automate flow**
5. Find and select your "Create Support Ticket" flow
6. Map the flow inputs to agent variables

### Step 3: Create a Topic for Ticket Submission

Create a topic that guides users through submitting a ticket:

1. Go to the **Topics** tab
2. Create a new topic: "Submit IT Ticket"
3. Add trigger phrases: "I need help", "submit a ticket", "IT support request"
4. Build the conversation flow:
   - Ask: "What is the issue?" (save to variable Title)
   - Ask: "Please describe the problem in detail" (save to variable Description)
   - Ask: "What priority? Low, Medium, or High?" (save to variable Priority)
   - Call the Power Automate action with the collected variables
   - Display the confirmation: "Your ticket #[TicketID] has been submitted"

### Step 4: Add a Status Check Action

Create a second flow that retrieves ticket status:

1. Create a Power Automate flow with trigger **Run a flow from Copilot**
2. Input: **TicketID** (text)
3. Action: SharePoint **Get items** with a filter (ID eq TicketID)
4. Response: Return the ticket status, assigned agent, and last update

Add this as another action in your agent with the topic "Check Ticket Status".

## Deployment Options

### Deploy to SharePoint Pages

1. Go to **Channels** then **SharePoint**
2. Select the target site
3. The agent appears as a chat interface on the page
4. Users interact with it directly in SharePoint

### Deploy to Microsoft Teams

1. Go to **Channels** then **Microsoft Teams**
2. Click **Turn on Teams**
3. The agent becomes available as a Teams app
4. Users can chat with it in Teams just like messaging a colleague

### Deploy to Microsoft 365 Copilot Chat

1. Go to **Channels** then **Microsoft 365 Copilot**
2. Publish the agent to the M365 App Store
3. Users can invoke it from Copilot Chat with @AgentName

### Audience Targeting

Control who can access your agent:

| Scope | How to Set |
|-------|-----------|
| Everyone in the organization | Default setting |
| Specific security groups | Settings then Security then User access |
| Specific SharePoint sites only | Deploy to selected sites only |

## Best Practices

| Practice | Why |
|----------|-----|
| Use specific knowledge sources over entire sites | Narrower scope = more accurate answers |
| Always enable authentication for confidential docs | Respects SharePoint permission boundaries |
| Create topic-based routing for multi-department agents | Improves answer relevance |
| Set fallback responses for unknown questions | Prevents hallucination |
| Test with real user questions before deploying | Catches edge cases early |
| Monitor analytics in Copilot Studio dashboard | Identify gaps in knowledge coverage |

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Agent returns "I do not know" for documented topics | Document not indexed | Re-add the knowledge source and wait for indexing |
| Agent gives wrong answers | Too broad knowledge scope | Narrow the knowledge source to specific libraries |
| Users cannot access the agent | Authentication not configured | Enable Microsoft authentication in Settings |
| Power Automate action fails | Flow not shared with agent service | Share the flow with the Copilot Studio service account |
| Agent does not appear on SharePoint page | Deployment not completed | Check the Channels tab and complete the SharePoint deployment |
| Slow responses | Large document libraries | Use specific folders instead of entire sites |

## Frequently Asked Questions

**Q: Does Copilot Studio require a separate license?**

Copilot Studio is included with Microsoft 365 E3/E5 licenses for basic scenarios. For advanced features (custom actions, extended message capacity), you may need a standalone Copilot Studio license. Check the Microsoft 365 licensing page for current details.

**Q: Can the agent access on-premises SharePoint?**

No. Copilot Studio agents only connect to SharePoint Online in Microsoft 365. For on-premises data, you would need to sync it to SharePoint Online first or use a custom connector.

**Q: How does the agent handle document permissions?**

When authentication is enabled, the agent respects SharePoint permissions. A user can only get answers from documents they have access to. This ensures your security model stays intact.

**Q: Can I use custom instructions to limit the agent scope?**

Yes. Use the system prompt to restrict what the agent discusses. For example: "Only answer questions about IT support topics. For HR questions, direct users to the HR portal." This prevents scope creep even if the knowledge sources contain broader content.

**Q: How many SharePoint sites can I connect?**

There is no hard limit on knowledge sources, but Microsoft recommends keeping the total under 10 for optimal indexing performance. For very large organizations, consider creating separate agents per department.

## What to Build Next

You have seen how to build 3 types of agents \u2014 from a simple FAQ bot to a workflow-powered service desk. The same patterns work for any scenario:

- **Onboarding assistant** that guides new hires through company policies
- **Project manager bot** that searches project documentation and updates task lists
- **Compliance checker** that answers regulatory questions from your legal library

For more Microsoft 365 development, check out my guides on [building SPFx web parts](/blog/spfx-web-part-crud-operations-complete-guide-2026), [Microsoft Graph API examples](/blog/microsoft-graph-api-10-practical-examples-sharepoint-2026), and [Power Automate workflows](/blog/power-automate-sharepoint-document-workflows-2026). To extend your agents to Viva Connections dashboards, see my [Adaptive Card Extensions guide](/blog/viva-connections-adaptive-card-extensions-build-guide-2026).
`,
    date: '2026-03-05',
    displayDate: 'March 5, 2026',
    readTime: '16 min read',
    category: 'Microsoft 365',
    tags: ['copilot-studio', 'sharepoint', 'ai-assistants', 'power-automate', 'microsoft-365'],
  },
  {
    id: '14',
    slug: 'viva-connections-adaptive-card-extensions-build-guide-2026',
    title: 'Building Viva Connections ACEs: 3 Adaptive Card Extensions from Scratch (2026)',
    excerpt:
      'Go beyond the Hello World template \u2014 build 3 production-ready Adaptive Card Extensions for Viva Connections with data charts, Quick Views, and Graph API integration.',
    image: '/images/blog/viva-connections-ace-guide.png',
    content: `
## What Are Adaptive Card Extensions (ACEs)?

Adaptive Card Extensions are a component type in SharePoint Framework (SPFx) designed specifically for **Viva Connections dashboards**. Think of them as smart cards that surface information and actions from across Microsoft 365 \u2014 directly in the employee\u2019s dashboard.

Each ACE has two parts:

- **Card View** \u2014 The compact card displayed on the dashboard (small, medium, or large size)
- **Quick View** \u2014 The expanded, interactive view that opens when users click the card

ACEs work across desktop, web, and mobile. They are the primary way to extend Viva Connections with custom functionality.

**Why build ACEs instead of web parts?**

| Feature | Web Parts | ACEs |
|---------|-----------|------|
| Where they appear | SharePoint pages | Viva Connections dashboard |
| Mobile support | Limited | Full native support |
| Card-based UI | No | Yes \u2014 Adaptive Card framework |
| Data visualization | Custom (build your own) | Built-in charts (line, bar, pie, donut) |
| Quick actions | Full page interaction | Lightweight Quick Views |
| Audience | SharePoint users | All employees via Viva |

This guide walks you through building 3 ACEs, from simple to advanced:

1. **Announcement Card** \u2014 Static content with a CTA button
2. **KPI Chart Card** \u2014 Data visualization with line/bar/pie charts
3. **Task List Card** \u2014 Interactive Quick Views with SharePoint list data

## Prerequisites

- **SPFx 1.21+** development environment ([set up guide](/blog/spfx-web-part-crud-operations-complete-guide-2026))
- **Node.js v22** \u2014 Required by SPFx 1.21
- **Viva Connections** enabled in your Microsoft 365 tenant
- **SharePoint Admin access** \u2014 To deploy to the App Catalog and configure the dashboard

## ACE 1: Announcement Card

The simplest ACE \u2014 a card that displays a message with a call-to-action button.

### Scaffold the Project

    yo @microsoft/sharepoint

Choose these options:

- **Component type:** Adaptive Card Extension
- **Template:** Generic Card Template
- **Name:** AnnouncementCard

### Implement the Card View

The Card View defines what users see on the dashboard. Edit the card view file:

**File:** src/adaptiveCardExtensions/announcementCard/cardView/CardView.ts

    import {
      BaseComponentsCardView,
      ComponentsCardViewParameters,
      BasicCardView,
      IExternalLinkCardAction,
    } from "@microsoft/sp-adaptive-card-extension-base";

    export class CardView extends BaseComponentsCardView<
      IAnnouncementCardAdaptiveCardExtensionProps,
      IAnnouncementCardAdaptiveCardExtensionState
    > {
      public get cardViewParameters(): ComponentsCardViewParameters {
        return BasicCardView({
          cardBar: {
            componentName: "cardBar",
            title: this.properties.title || "Announcement",
            icon: {
              url: "https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/item-types/16/news.svg",
            },
          },
          header: {
            componentName: "text",
            text: this.properties.heading || "Important Update",
          },
          body: {
            componentName: "text",
            text: this.properties.description || "Check out the latest company news.",
          },
          footer: {
            componentName: "cardButton",
            title: "Learn More",
            style: "positive",
            action: {
              type: "ExternalLink",
              parameters: {
                target: this.properties.linkUrl || "https://contoso.sharepoint.com/news",
              },
            } as IExternalLinkCardAction,
          },
        });
      }
    }

### Add Property Pane Configuration

Let admins customize the announcement text without editing code:

**File:** src/adaptiveCardExtensions/announcementCard/AnnouncementCardAdaptiveCardExtension.ts

    import { PropertyPaneTextField } from "@microsoft/sp-property-pane";

    protected getPropertyPaneConfiguration() {
      return {
        pages: [{
          header: { description: "Announcement Card Settings" },
          groups: [{
            groupName: "Content",
            groupFields: [
              PropertyPaneTextField("title", { label: "Card Title" }),
              PropertyPaneTextField("heading", { label: "Heading" }),
              PropertyPaneTextField("description", { label: "Description", multiline: true }),
              PropertyPaneTextField("linkUrl", { label: "Button URL" }),
            ],
          }],
        }],
      };
    }

**Result:** A dashboard card that displays a custom announcement with a "Learn More" button. Admins configure the content through the property pane \u2014 no code changes needed for content updates.

## ACE 2: KPI Chart Card

This ACE displays data visualizations directly on the dashboard card \u2014 no Quick View needed for a quick overview.

**New in SPFx 1.19+:** Built-in chart support (line charts). **SPFx 1.20+** adds bar, pie, and donut charts.

### Card View with a Line Chart

**File:** src/adaptiveCardExtensions/kpiChart/cardView/CardView.ts

    import {
      BaseComponentsCardView,
      ComponentsCardViewParameters,
      DataVisualizationCardView,
    } from "@microsoft/sp-adaptive-card-extension-base";

    export class CardView extends BaseComponentsCardView<
      IKpiChartProps, IKpiChartState
    > {
      public get cardViewParameters(): ComponentsCardViewParameters {
        return DataVisualizationCardView({
          cardBar: {
            componentName: "cardBar",
            title: "Monthly Active Users",
          },
          body: {
            componentName: "dataVisualization",
            dataVisualizationKind: "line",
            series: [{
              data: [
                { x: "Jan", y: 1200 },
                { x: "Feb", y: 1450 },
                { x: "Mar", y: 1380 },
                { x: "Apr", y: 1620 },
                { x: "May", y: 1890 },
                { x: "Jun", y: 2100 },
              ],
              color: "#0078d4",
              lastDataPointStyle: "callout",
            }],
          },
        });
      }
    }

### Fetching Real Data from a SharePoint List

Instead of hardcoded data, pull KPI values from a SharePoint list:

    import { getSP } from "../pnpConfig";

    public async onInit(): Promise<void> {
      const sp = getSP(this.context);
      const items = await sp.web.lists
        .getByTitle("KPI Metrics")
        .items.select("Month", "ActiveUsers")
        .orderBy("Month", true)
        .top(12)();

      this.setState({
        chartData: items.map(item => ({
          x: item.Month,
          y: item.ActiveUsers,
        })),
      });
    }

### Chart Type Options

| Chart Type | SPFx Version | Best For |
|-----------|-------------|----------|
| Line | 1.19+ | Trends over time |
| Bar | 1.20+ | Comparing categories |
| Pie | 1.20+ | Part-to-whole relationships |
| Donut | 1.20+ | Percentages with center label |

**Pro tip:** Use the "callout" style on the last data point to highlight the most recent value. Set the card size to "large" for charts \u2014 they need the extra space to be readable.

## ACE 3: Interactive Task List Card

This is the most complex ACE \u2014 it reads data from a SharePoint list, displays a summary on the Card View, and opens an interactive Quick View where users can update tasks.

### Card View: Task Summary

Show a count of pending tasks on the card:

    export class CardView extends BaseComponentsCardView<
      ITaskListProps, ITaskListState
    > {
      public get cardViewParameters(): ComponentsCardViewParameters {
        const pendingCount = this.state.tasks.filter(
          t => t.Status !== "Completed"
        ).length;

        return BasicCardView({
          cardBar: {
            componentName: "cardBar",
            title: "My Tasks",
          },
          header: {
            componentName: "text",
            text: pendingCount + " tasks pending",
          },
          body: {
            componentName: "text",
            text: "Click to view and manage your tasks",
          },
          footer: {
            componentName: "cardButton",
            title: "View Tasks",
            style: "positive",
            action: {
              type: "QuickView",
              parameters: { view: "TASK_LIST_VIEW" },
            },
          },
        });
      }
    }

### Quick View: Task List with Adaptive Card JSON

Quick Views use Adaptive Card JSON templates to render interactive content.

**File:** src/adaptiveCardExtensions/taskList/quickView/template/TaskListTemplate.json

    {
      "type": "AdaptiveCard",
      "version": "1.5",
      "body": [
        {
          "type": "TextBlock",
          "text": "My Tasks",
          "weight": "Bolder",
          "size": "Large"
        },
        {
          "type": "Container",
          "items": [
            {
              "type": "ColumnSet",
              "columns": [
                {
                  "type": "Column",
                  "width": "stretch",
                  "items": [
                    { "type": "TextBlock", "weight": "Bolder", "wrap": true }
                  ]
                },
                {
                  "type": "Column",
                  "width": "auto",
                  "items": [
                    { "type": "TextBlock", "weight": "Bolder" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }

### Quick View Class

Wire the template to your data:

**File:** src/adaptiveCardExtensions/taskList/quickView/TaskListQuickView.ts

    import { BaseAdaptiveCardQuickView } from
      "@microsoft/sp-adaptive-card-extension-base";
    import template from "./template/TaskListTemplate.json";

    export class TaskListQuickView extends BaseAdaptiveCardQuickView<
      ITaskListProps, ITaskListState
    > {
      public get data() {
        return {
          tasks: this.state.tasks.map(task => ({
            title: task.Title,
            status: task.Status,
            dueDate: new Date(task.DueDate).toLocaleDateString(),
            id: task.Id,
          })),
        };
      }

      public get template() {
        return template;
      }
    }

### Register the Quick View

In your main ACE class, register the Quick View so the Card View can reference it:

    import { TaskListQuickView } from "./quickView/TaskListQuickView";

    protected onInit(): Promise<void> {
      this.quickViewNavigator.register(
        "TASK_LIST_VIEW",
        () => new TaskListQuickView()
      );
      return this.fetchTasks();
    }

### HTML Quick Views (SPFx 1.20+)

Starting with SPFx 1.20, you can use **HTML instead of Adaptive Card JSON** for Quick Views. This unlocks full layout control and React integration:

    import { BaseHTMLQuickView } from
      "@microsoft/sp-adaptive-card-extension-base";

    export class TaskHTMLQuickView extends BaseHTMLQuickView<
      ITaskListProps, ITaskListState
    > {
      public render(): void {
        this.domElement.innerHTML = this.state.tasks
          .map(task => "<div>" + task.Title + "</div>")
          .join("");
      }
    }

**When to use HTML vs Adaptive Card Quick Views:**

| Feature | Adaptive Card JSON | HTML Quick View |
|---------|-------------------|-----------------|
| Complexity | Simple forms and lists | Complex layouts |
| Framework support | None \u2014 JSON only | React, vanilla JS |
| Styling | Limited | Full CSS control |
| SPFx version | 1.14+ | 1.20+ |
| Mobile rendering | Native on all platforms | Web rendering |
| Best for | Standard data display | Custom visualizations |

> **Recommendation:** Use Adaptive Card JSON for standard scenarios (lists, forms, details). Use HTML Quick Views when you need custom styling, charts, or React components that Adaptive Cards cannot support.

## Fetching Data with Microsoft Graph

ACEs are powerful when connected to [Microsoft Graph](/blog/microsoft-graph-api-10-practical-examples-sharepoint-2026). Here is a pattern for fetching the current user's tasks from Planner:

    import { MSGraphClientV3 } from "@microsoft/sp-http";

    private async fetchPlannerTasks(): Promise<void> {
      const graphClient: MSGraphClientV3 = await this.context
        .msGraphClientFactory.getClient("3");

      const response = await graphClient
        .api("/me/planner/tasks")
        .select("title,percentComplete,dueDateTime")
        .top(10)
        .get();

      this.setState({
        tasks: response.value.map(task => ({
          Title: task.title,
          Status: task.percentComplete === 100 ? "Completed" : "In Progress",
          DueDate: task.dueDateTime,
        })),
      });
    }

**Required permission** (in package-solution.json):

    { "resource": "Microsoft Graph", "scope": "Tasks.Read" }

This pattern works for any Graph endpoint \u2014 email counts, Teams activity, calendar events, or user analytics. See my [Graph API examples guide](/blog/microsoft-graph-api-10-practical-examples-sharepoint-2026) for 10 more patterns.

## Deployment to Viva Connections

### Build and Package

    gulp bundle --ship
    gulp package-solution --ship

### Deploy to App Catalog

1. Upload the .sppkg to your tenant App Catalog
2. Check "Make this solution available to all sites"
3. Click Deploy
4. If the ACE uses Graph API, approve the API permissions in the SharePoint Admin Center

### Add to the Dashboard

1. Go to your Viva Connections home site
2. Click the gear icon, then select **Manage dashboard**
3. Click **+ Add a card**
4. Find your ACE in the list and click it
5. Configure properties in the property pane
6. Set the card size (small, medium, or large)
7. Click **Publish**

### Audience Targeting

Target ACEs to specific groups so different departments see different cards:

1. In the dashboard editor, select your ACE
2. Click the audience targeting icon
3. Select Microsoft 365 groups or security groups
4. Only members of those groups will see the card

## Performance Tips

| Tip | Why |
|-----|-----|
| Use onInit() for data fetching, not the Card View | Card View renders on every dashboard visit \u2014 keep it fast |
| Cache API responses | Use session storage for data that does not change frequently |
| Limit list queries with .top() and .select() | Reduce payload size and avoid throttling |
| Use medium card size for text, large for charts | Charts need space to be readable |
| Batch Graph API calls | Reduce HTTP overhead \u2014 see [batching example](/blog/microsoft-graph-api-10-practical-examples-sharepoint-2026) |

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| ACE does not appear in dashboard | Not deployed tenant-wide | Check "Make available to all sites" in App Catalog |
| Quick View does not open | View ID mismatch | Ensure the QuickView parameters.view matches the registered ID |
| Access denied on Graph calls | Permissions not approved | Approve API permissions in SharePoint Admin Center |
| Card shows error message | Unhandled error in onInit() | Wrap data fetching in try/catch |
| Chart data does not render | Wrong card size | Set cardSize to "Large" for data visualization cards |
| ACE not visible on mobile | Cache issue | Clear the Viva Connections mobile app cache |

## Frequently Asked Questions

**Q: Can I use React in ACE Quick Views?**

Yes, starting with SPFx 1.20. Use the BaseHTMLQuickView class and render your React components into this.domElement \u2014 the same pattern as SPFx web parts. For simple data display, Adaptive Card JSON templates are easier to maintain.

**Q: Do ACEs work outside Viva Connections?**

ACEs are designed for Viva Connections dashboards. However, since SPFx 1.18, you can also add ACEs to modern SharePoint pages using the Dashboard for Viva Connections web part. They are not standalone web parts, though.

**Q: What is the maximum number of ACEs on a dashboard?**

There is no hard limit, but Microsoft recommends 20-30 cards for optimal performance. Each card makes its own API calls during initialization, so too many cards can slow down the dashboard load time.

**Q: Can end users personalize their dashboard?**

Yes! SPFx 1.21 introduced card personalization. When enabled by admins, users can add, remove, and reorder ACEs on their personal view of the dashboard without affecting other users.

**Q: How do I debug ACEs locally?**

Run gulp serve (or heft start in newer tooling) and navigate to the hosted Workbench. Add the Dashboard for Viva Connections web part and configure it in Preview mode. For SPFx 1.21+, the new debugging toolbar on SharePoint pages also supports ACEs.

## What is Next

You have built 3 ACEs covering the most common patterns \u2014 static content, data visualization, and interactive list data. The same architecture works for any dashboard scenario: IT ticket counts, HR announcements, sales KPIs, or company event feeds.

For more SPFx development, check out my guides on [building web parts with CRUD operations](/blog/spfx-web-part-crud-operations-complete-guide-2026) and [SharePoint column formatting with JSON](/blog/sharepoint-column-formatting-json-complete-guide). To connect your ACEs to external data, see my [Microsoft Graph API examples](/blog/microsoft-graph-api-10-practical-examples-sharepoint-2026).
`,
    date: '2026-03-05',
    displayDate: 'March 5, 2026',
    readTime: '17 min read',
    category: 'Microsoft 365',
    tags: ['viva-connections', 'adaptive-cards', 'spfx', 'ace', 'dashboard', 'microsoft-365'],
  },
  {
    id: '13',
    slug: 'microsoft-graph-api-10-practical-examples-sharepoint-2026',
    title: 'Microsoft Graph API: 10 Practical Examples for SharePoint Developers (2026)',
    excerpt:
      'Stop reading docs and start building. Here are 10 copy-paste Graph API examples for SharePoint — from fetching user profiles and querying sites to creating pages, uploading files, and setting up webhooks.',
    image: '/images/blog/microsoft-graph-api-examples.png',
    content: `
## Why Microsoft Graph for SharePoint?

Microsoft Graph is the single API endpoint for accessing data across the entire Microsoft 365 ecosystem — users, files, mail, calendar, Teams, SharePoint, and more. Instead of calling separate APIs for each service, you call one unified endpoint: https://graph.microsoft.com.

For SharePoint developers, Graph unlocks capabilities that go beyond what the SharePoint REST API offers:

- **Cross-service queries** — Get a user's profile, their recent files, AND their Teams channels in a single batch request
- **Granular permissions** — Use Sites.Selected to grant access to specific sites instead of the entire tenant
- **Consistent authentication** — One token works for SharePoint, Teams, OneDrive, Outlook, and more
- **Modern tooling** — Graph Explorer for testing, SDKs for every language, and built-in batching

This guide gives you 10 production-ready examples you can use in [SPFx web parts](/blog/spfx-web-part-crud-operations-complete-guide-2026), Power Automate flows, or standalone applications.

## Setup: Authentication in SPFx

Before diving into the examples, here's how to authenticate Graph API calls in an SPFx web part using the built-in MSGraphClientV3:

**In your web part class:**

    import { MSGraphClientV3 } from "@microsoft/sp-http";

    // Get the Graph client
    const graphClient: MSGraphClientV3 = await this.context
      .msGraphClientFactory.getClient("3");

**In package-solution.json**, declare the permissions you need:

    "webApiPermissionRequests": [
      { "resource": "Microsoft Graph", "scope": "User.Read.All" },
      { "resource": "Microsoft Graph", "scope": "Sites.Read.All" }
    ]

After deploying the .sppkg, a tenant admin must approve these permissions in the SharePoint Admin Center under API access.

> **Tip:** Always request the minimal permissions your app needs. Start with .Read scopes and only upgrade to .ReadWrite when you actually need write access.

## Example 1: Get Current User Profile

The simplest and most common Graph call — fetch the signed-in user's profile.

**Permission required:** User.Read

    const response = await graphClient
      .api("/me")
      .select("displayName,mail,jobTitle,department,officeLocation")
      .get();

    console.log(response.displayName); // "Rizwan Shoaib"
    console.log(response.jobTitle);    // "Senior Developer"

**Use case:** Display the current user's name and department in a personalized web part header. This replaces the older SharePoint _api/SP.UserProfiles call with a single, faster Graph request.

**Get a user's profile photo:**

    const photoBlob = await graphClient
      .api("/me/photo/$value")
      .responseType("blob")
      .get();

    const photoUrl = URL.createObjectURL(photoBlob);

## Example 2: Search for Users in the Tenant

Build a people picker or user directory by searching across your organization.

**Permission required:** User.ReadBasic.All

    const response = await graphClient
      .api("/users")
      .filter("startswith(displayName,'Riz')")
      .select("id,displayName,mail,jobTitle,department")
      .top(10)
      .orderby("displayName")
      .get();

    const users = response.value;
    // Returns: [{ displayName: "Rizwan Shoaib", mail: "riz@...", ... }]

**Filter by department:**

    const finance = await graphClient
      .api("/users")
      .filter("department eq 'Finance'")
      .select("displayName,mail,jobTitle")
      .top(50)
      .get();

**Use case:** Build a department directory web part that shows all team members with their photos and contact info. Much faster than querying the SharePoint User Information List.

## Example 3: Query SharePoint Sites

Find and access SharePoint sites programmatically.

**Permission required:** Sites.Read.All

**Search for sites by keyword:**

    const response = await graphClient
      .api("/sites?search=Marketing")
      .select("id,displayName,webUrl,description")
      .get();

    const sites = response.value;
    // Returns all sites matching "Marketing"

**Get a specific site by URL:**

    const site = await graphClient
      .api("/sites/contoso.sharepoint.com:/sites/hr-portal")
      .select("id,displayName,webUrl,createdDateTime")
      .get();

**List all subsites:**

    const subsites = await graphClient
      .api("/sites/contoso.sharepoint.com:/sites/hr-portal:/sites")
      .get();

**Use case:** Build a site directory or navigation web part that dynamically lists all project sites across your tenant.

## Example 4: CRUD Operations on SharePoint List Items

Full create, read, update, and delete on SharePoint list items through Graph.

**Permission required:** Sites.ReadWrite.All

**Read items from a list:**

    const items = await graphClient
      .api("/sites/{site-id}/lists/{list-id}/items")
      .expand("fields")
      .top(100)
      .get();

    items.value.forEach(item => {
      console.log(item.fields.Title, item.fields.Status);
    });

**Create a new item:**

    await graphClient
      .api("/sites/{site-id}/lists/{list-id}/items")
      .post({
        fields: {
          Title: "New Task",
          Status: "Not Started",
          Priority: "High",
          DueDate: "2026-04-01"
        }
      });

**Update an item:**

    await graphClient
      .api("/sites/{site-id}/lists/{list-id}/items/{item-id}/fields")
      .patch({
        Status: "Completed"
      });

**Delete an item:**

    await graphClient
      .api("/sites/{site-id}/lists/{list-id}/items/{item-id}")
      .delete();

**Use case:** When you need cross-site list operations (reading from multiple sites in a single web part), Graph is easier than making separate SharePoint REST calls to each site. For same-site operations, [PnPjs is faster and more ergonomic](/blog/spfx-web-part-crud-operations-complete-guide-2026).

## Example 5: Read and Create SharePoint Pages

The Pages API (GA since April 2024) lets you programmatically manage modern SharePoint pages.

**Permission required:** Sites.ReadWrite.All

**List all pages in a site:**

    const pages = await graphClient
      .api("/sites/{site-id}/pages")
      .select("id,title,webUrl,createdDateTime,lastModifiedDateTime")
      .top(50)
      .get();

**Get a specific page with its web parts:**

    const page = await graphClient
      .api("/sites/{site-id}/pages/{page-id}/microsoft.graph.sitePage")
      .expand("canvasLayout")
      .get();

    // Access web parts in the page layout
    const sections = page.canvasLayout.horizontalSections;

**Create a new page:**

    const newPage = await graphClient
      .api("/sites/{site-id}/pages")
      .post({
        "@odata.type": "#microsoft.graph.sitePage",
        name: "project-update.aspx",
        title: "Project Update - March 2026",
        pageLayout: "article",
      });

**Use case:** Automate page creation for recurring reports — a Power Automate flow that creates a new SharePoint page every Monday with the previous week's metrics, pre-populated from a list.

## Example 6: Upload and Manage Files in SharePoint

Work with files in SharePoint document libraries through OneDrive for Business endpoints.

**Permission required:** Files.ReadWrite.All or Sites.ReadWrite.All

**Upload a small file (< 4 MB):**

    const fileContent = "Hello, SharePoint!";
    await graphClient
      .api("/sites/{site-id}/drive/root:/Documents/report.txt:/content")
      .put(fileContent);

**Upload a large file (> 4 MB) with resumable upload:**

    // 1. Create upload session
    const session = await graphClient
      .api("/sites/{site-id}/drive/root:/Documents/large-file.pdf:/createUploadSession")
      .post({ item: { name: "large-file.pdf" } });

    // 2. Upload in 10 MB chunks using session.uploadUrl
    // (Use the LargeFileUploadTask from @microsoft/microsoft-graph-client)

**List files in a folder:**

    const files = await graphClient
      .api("/sites/{site-id}/drive/root:/Documents:/children")
      .select("id,name,size,lastModifiedDateTime,webUrl")
      .get();

**Download a file:**

    const fileStream = await graphClient
      .api("/sites/{site-id}/drive/items/{item-id}/content")
      .responseType("blob")
      .get();

**Use case:** Build a document upload web part that lets users drag-and-drop files into a specific library, with automatic metadata tagging. Combine this with [Power Automate document workflows](/blog/power-automate-sharepoint-document-workflows-2026) for post-upload processing.

## Example 7: Post Messages to Teams Channels

Send notifications from SharePoint events to Microsoft Teams.

**Permission required:** ChannelMessage.Send (delegated) or Teamwork.Migrate.All (application)

**Send a message to a Teams channel:**

    await graphClient
      .api("/teams/{team-id}/channels/{channel-id}/messages")
      .post({
        body: {
          contentType: "html",
          content: "<b>New document uploaded:</b> Q1 Report.pdf<br>Uploaded by: Rizwan Shoaib"
        }
      });

**Send an Adaptive Card:**

    await graphClient
      .api("/teams/{team-id}/channels/{channel-id}/messages")
      .post({
        body: {
          contentType: "html",
          content: '<attachment id="card1"></attachment>'
        },
        attachments: [{
          id: "card1",
          contentType: "application/vnd.microsoft.card.adaptive",
          content: JSON.stringify({
            type: "AdaptiveCard",
            version: "1.4",
            body: [
              { type: "TextBlock", text: "Document Approval Required", weight: "Bolder", size: "Medium" },
              { type: "TextBlock", text: "Q1 Financial Report needs your review.", wrap: true },
              { type: "FactSet", facts: [
                { title: "Uploaded by:", value: "Rizwan" },
                { title: "Due date:", value: "March 15, 2026" }
              ]}
            ],
            actions: [
              { type: "Action.OpenUrl", title: "Review Document", url: "https://contoso.sharepoint.com/..." }
            ]
          })
        }]
      });

**Use case:** When a document is uploaded to a SharePoint library, [trigger a Power Automate flow](/blog/power-automate-sharepoint-document-workflows-2026) that sends a rich Adaptive Card to the team's channel with an approval button.

## Example 8: Search Across Microsoft 365

Use the unified search endpoint to find content across SharePoint, OneDrive, Teams, and more.

**Permission required:** Sites.Read.All

    const searchResults = await graphClient
      .api("/search/query")
      .post({
        requests: [{
          entityTypes: ["driveItem", "listItem", "site"],
          query: { queryString: "quarterly report 2026" },
          from: 0,
          size: 25,
          fields: ["title", "webUrl", "lastModifiedDateTime", "createdBy"]
        }]
      });

    const hits = searchResults.value[0].hitsContainers[0].hits;
    hits.forEach(hit => {
      console.log(hit.resource.name, hit.resource.webUrl);
    });

**Filter by file type:**

    query: { queryString: "quarterly report filetype:pdf" }

**Filter by site:**

    query: { queryString: "quarterly report site:contoso.sharepoint.com/sites/finance" }

**Use case:** Build a custom search web part that searches across all SharePoint sites AND OneDrive simultaneously, with faceted filtering by file type, date range, and author. The built-in SharePoint search only covers SharePoint content.

## Example 9: Set Up Change Notifications (Webhooks)

Get real-time notifications when SharePoint content changes — no polling required.

**Permission required:** Sites.ReadWrite.All

**Create a subscription (webhook):**

    const subscription = await graphClient
      .api("/subscriptions")
      .post({
        changeType: "created,updated,deleted",
        notificationUrl: "https://your-azure-function.azurewebsites.net/api/webhook",
        resource: "/sites/{site-id}/lists/{list-id}/items",
        expirationDateTime: "2026-04-05T11:00:00.000Z",
        clientState: "secretClientValue"
      });

**Renew a subscription before it expires:**

    await graphClient
      .api("/subscriptions/{subscription-id}")
      .patch({
        expirationDateTime: "2026-05-05T11:00:00.000Z"
      });

**What your webhook endpoint receives:**

    // POST to your notificationUrl
    {
      "value": [{
        "subscriptionId": "...",
        "changeType": "created",
        "resource": "sites/.../lists/.../items/42",
        "clientState": "secretClientValue"
      }]
    }

**Important notes:**

- Subscriptions expire (max 30 days for most resources). Set up a timer to renew them
- The notification only tells you WHAT changed, not the new values. You need a follow-up GET call to fetch the updated item
- Your webhook endpoint must respond with 202 Accepted within 30 seconds

**Use case:** Build a real-time dashboard that updates automatically when list items change, without users needing to refresh the page. Pair this with SignalR or Server-Sent Events for a live UI.

## Example 10: Batch Multiple Requests

Reduce HTTP overhead by sending up to 20 Graph API calls in a single request.

**Permission required:** Depends on the individual requests

    const batchRequest = {
      requests: [
        {
          id: "1",
          method: "GET",
          url: "/me"
        },
        {
          id: "2",
          method: "GET",
          url: "/me/joinedTeams"
        },
        {
          id: "3",
          method: "GET",
          url: "/sites/contoso.sharepoint.com:/sites/hr-portal"
        },
        {
          id: "4",
          method: "GET",
          url: "/me/drive/recent"
        }
      ]
    };

    const batchResponse = await graphClient
      .api("/$batch")
      .post(batchRequest);

    // Each response has an id matching the request
    batchResponse.responses.forEach(response => {
      console.log("Request " + response.id + ":", response.status);
      if (response.status === 200) {
        console.log(response.body);
      }
    });

**Why batching matters:**

| Approach | HTTP Calls | Latency |
|----------|-----------|---------|
| Individual requests | 4 calls | ~400ms each = ~1.6s total |
| Batch request | 1 call | ~500ms total |

**Use case:** A dashboard web part that shows the current user's profile, their teams, recent files, and upcoming events. Without batching, that's 4 separate API calls. With batching, it's one.

## Permissions Reference

Here's a quick reference for the permissions needed across all examples:

| Example | Permission | Type |
|---------|-----------|------|
| 1. User profile | User.Read | Delegated |
| 2. Search users | User.ReadBasic.All | Delegated |
| 3. Query sites | Sites.Read.All | Both |
| 4. List CRUD | Sites.ReadWrite.All | Both |
| 5. Pages | Sites.ReadWrite.All | Both |
| 6. Files | Files.ReadWrite.All | Both |
| 7. Teams messages | ChannelMessage.Send | Delegated |
| 8. Search | Sites.Read.All | Both |
| 9. Webhooks | Sites.ReadWrite.All | Application |
| 10. Batching | Per-request | Varies |

> **Security tip:** Use **Sites.Selected** instead of Sites.ReadWrite.All when your app only needs access to specific sites. This is a granular permission that lets a tenant admin grant access on a per-site basis — much safer for production apps.

## Frequently Asked Questions

**Q: Should I use Graph API or the SharePoint REST API?**

Use Graph when you need cross-service data (users + files + Teams), granular permissions (Sites.Selected), or modern features (Pages API, search). Use the SharePoint REST API (or [PnPjs](/blog/spfx-web-part-crud-operations-complete-guide-2026)) when you need SharePoint-specific features like content types, term store, or managed metadata — these aren't fully available in Graph yet.

**Q: Can I use Graph API in Power Automate?**

Yes. Power Automate has a built-in "Send an HTTP request" action that calls Graph directly. Or use the premium "Microsoft Graph" connector for a no-code experience. See my guide on [Power Automate + SharePoint workflows](/blog/power-automate-sharepoint-document-workflows-2026).

**Q: What's the rate limit for Graph API?**

SharePoint-specific endpoints allow 10,000 API calls per 10 minutes per app per tenant. For user-specific endpoints, it's 1,200 requests per 20 seconds per app per user. Use batching (Example 10) to stay well within limits.

**Q: How do I test Graph API calls without writing code?**

Use **Graph Explorer** at https://developer.microsoft.com/graph/graph-explorer. You can sign in with your Microsoft 365 account, run queries, and see the exact JSON responses. It also shows you which permissions each endpoint needs.

**Q: Is Graph API available for SharePoint on-premises?**

No. Microsoft Graph only works with Microsoft 365 cloud services. For SharePoint Server, continue using the SharePoint REST API or CSOM.

## What's Next

Microsoft Graph is the future of Microsoft 365 development. Every new feature — Copilot extensions, SharePoint Embedded, Loop components — is built on Graph first. Learning it now puts you ahead of the curve.

Start with Examples 1-3 (user profiles, user search, site queries) to get comfortable with the authentication flow and API patterns. Then tackle the write operations (Examples 4-7) for real-world solutions.

For more Microsoft 365 development, check out my guides on [building SPFx web parts with CRUD operations](/blog/spfx-web-part-crud-operations-complete-guide-2026) and [Viva Connections Adaptive Card Extensions](/blog/building-viva-connections-adaptive-card-extensions-spfx).
`,
    date: '2026-03-05',
    displayDate: 'March 5, 2026',
    readTime: '18 min read',
    category: 'Microsoft 365',
    tags: ['microsoft-graph', 'sharepoint', 'api', 'spfx', 'microsoft-365', 'rest-api'],
  },
  {
    id: '12',
    slug: 'spfx-web-part-crud-operations-complete-guide-2026',
    title: 'Building a Custom SPFx Web Part: CRUD Operations with React + PnPjs (2026)',
    excerpt:
      'Go beyond Hello World — build a production-ready SPFx web part that creates, reads, updates, and deletes SharePoint list items using React and PnPjs v4. Covers environment setup, property pane configuration, and deployment.',
    image: '/images/blog/spfx-custom-webpart-guide.png',
    content: `
## Why Build a Custom SPFx Web Part?

SharePoint Framework (SPFx) is Microsoft's recommended model for extending SharePoint and Microsoft 365. If you've built a [Hello World web part](/blog/building-spfx-hello-world-webpart), you know the basics. But real-world web parts need to do more — they need to interact with SharePoint data.

This guide walks you through building a **Task Manager web part** that performs full CRUD (Create, Read, Update, Delete) operations against a SharePoint list. By the end, you'll have a production-ready component that you can deploy to your tenant's App Catalog.

**What you'll build:**

- A React-based web part that displays SharePoint list items in a responsive table
- Create, edit, and delete operations with inline forms
- Property pane configuration for selecting the target list
- PnPjs v4 for all SharePoint API calls
- Proper error handling and loading states
- Packaging and deployment to the App Catalog

## Prerequisites

Before you start, make sure you have:

- **Node.js v22** — The only version supported by SPFx 1.21+ (January 2026)
- **npm v10+** — Comes with Node.js v22
- **Yeoman and the SPFx generator** — Install globally with npm
- **Visual Studio Code** — Recommended editor
- **A SharePoint Online tenant** — A developer tenant works fine for testing
- **SharePoint list** — Create a list called "Tasks" with these columns:

| Column | Type | Required |
|--------|------|----------|
| Title | Single line of text | Yes |
| Description | Multiple lines of text | No |
| AssignedTo | Person | No |
| DueDate | Date | No |
| Status | Choice (Not Started, In Progress, Completed) | Yes |
| Priority | Choice (Low, Medium, High) | Yes |

## Step 1: Scaffold the SPFx Project

Open your terminal and run the Yeoman generator:

    npm install -g yo @microsoft/generator-sharepoint
    mkdir task-manager-webpart
    cd task-manager-webpart
    yo @microsoft/sharepoint

When prompted, choose these options:

- **Solution name:** task-manager-webpart
- **Target:** SharePoint Online only
- **Place files in current folder:** Yes
- **Tenant-scoped deployment:** No (for testing)
- **Framework:** React
- **Web part name:** TaskManager
- **Description:** A web part for managing tasks in a SharePoint list

The generator creates the project structure. Open it in VS Code:

    code .

## Step 2: Install PnPjs v4

PnPjs is the de facto library for interacting with SharePoint from SPFx. Install the required packages:

    npm install @pnp/sp @pnp/logging

**Why PnPjs over raw REST calls?**

- Type-safe API — IntelliSense and compile-time checks
- Batching support — Send multiple requests in a single HTTP call
- Caching — Built-in request caching for performance
- Fluent API — Readable, chainable syntax

## Step 3: Configure PnPjs with SPFx Context

PnPjs needs the SPFx web part context to authenticate API calls. Create a configuration file.

**File:** src/webparts/taskManager/pnpConfig.ts

    import { spfi, SPFx } from "@pnp/sp";
    import "@pnp/sp/webs";
    import "@pnp/sp/lists";
    import "@pnp/sp/items";
    import "@pnp/sp/site-users/web";
    import { WebPartContext } from "@microsoft/sp-webpart-base";

    let _sp: ReturnType<typeof spfi>;

    export const getSP = (context?: WebPartContext) => {
      if (context) {
        _sp = spfi().using(SPFx(context));
      }
      return _sp;
    };

**Key points:**

- The selective imports (webs, lists, items) keep your bundle size small — PnPjs is tree-shakeable
- The singleton pattern ensures the SP instance is created once and reused
- Call getSP(this.context) in your web part's onInit() to initialize

## Step 4: Build the React Component

Now build the main TaskManager component. This handles rendering the task list and all CRUD operations.

**File:** src/webparts/taskManager/components/TaskManager.tsx

    import * as React from "react";
    import { useState, useEffect, useCallback } from "react";
    import { getSP } from "../pnpConfig";
    import styles from "./TaskManager.module.scss";

    interface ITask {
      Id: number;
      Title: string;
      Description: string;
      Status: string;
      Priority: string;
      DueDate: string;
    }

    interface ITaskManagerProps {
      listName: string;
    }

    const TaskManager: React.FC<ITaskManagerProps> = ({ listName }) => {
      const [tasks, setTasks] = useState<ITask[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const [editingId, setEditingId] = useState<number | null>(null);
      const [newTask, setNewTask] = useState({
        Title: "",
        Description: "",
        Status: "Not Started",
        Priority: "Medium",
        DueDate: "",
      });

      // READ - Fetch all tasks
      const fetchTasks = useCallback(async () => {
        try {
          setLoading(true);
          const sp = getSP();
          const items = await sp.web.lists
            .getByTitle(listName)
            .items.select(
              "Id", "Title", "Description",
              "Status", "Priority", "DueDate"
            )
            .orderBy("DueDate", true)();
          setTasks(items);
          setError(null);
        } catch (err) {
          setError("Failed to load tasks. Check list permissions.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }, [listName]);

      useEffect(() => {
        fetchTasks();
      }, [fetchTasks]);

      // CREATE - Add a new task
      const addTask = async () => {
        if (!newTask.Title.trim()) return;
        try {
          const sp = getSP();
          await sp.web.lists.getByTitle(listName).items.add({
            Title: newTask.Title,
            Description: newTask.Description,
            Status: newTask.Status,
            Priority: newTask.Priority,
            DueDate: newTask.DueDate || null,
          });
          setNewTask({
            Title: "", Description: "",
            Status: "Not Started",
            Priority: "Medium", DueDate: "",
          });
          await fetchTasks();
        } catch (err) {
          setError("Failed to add task.");
          console.error(err);
        }
      };

      // UPDATE - Edit an existing task
      const updateTask = async (id: number, updates: Partial<ITask>) => {
        try {
          const sp = getSP();
          await sp.web.lists
            .getByTitle(listName)
            .items.getById(id)
            .update(updates);
          setEditingId(null);
          await fetchTasks();
        } catch (err) {
          setError("Failed to update task.");
          console.error(err);
        }
      };

      // DELETE - Remove a task
      const deleteTask = async (id: number) => {
        if (!confirm("Delete this task?")) return;
        try {
          const sp = getSP();
          await sp.web.lists
            .getByTitle(listName)
            .items.getById(id)
            .delete();
          await fetchTasks();
        } catch (err) {
          setError("Failed to delete task.");
          console.error(err);
        }
      };

      if (loading) return <div className={styles.loading}>Loading...</div>;
      if (error) return <div className={styles.error}>{error}</div>;

      return (
        <div className={styles.taskManager}>
          <h2>Task Manager</h2>
          {/* Render task table and forms here */}
        </div>
      );
    };

    export default TaskManager;

**What's happening in this code:**

- **READ:** fetchTasks() uses PnPjs's fluent API to query the SharePoint list with .select() for specific columns and .orderBy() for sorting
- **CREATE:** addTask() calls .items.add() with the form data
- **UPDATE:** updateTask() uses .items.getById(id).update() for partial updates
- **DELETE:** deleteTask() calls .items.getById(id).delete() after confirmation
- **Error handling:** Each operation wraps the API call in try/catch and sets an error state
- **Loading state:** Prevents rendering stale data during API calls

## Step 5: Wire Up the Web Part

Connect the React component to the SPFx web part class.

**File:** src/webparts/taskManager/TaskManagerWebPart.ts

    import * as React from "react";
    import * as ReactDom from "react-dom";
    import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
    import {
      PropertyPaneTextField,
    } from "@microsoft/sp-property-pane";
    import TaskManager from "./components/TaskManager";
    import { getSP } from "./pnpConfig";

    export interface ITaskManagerWebPartProps {
      listName: string;
    }

    export default class TaskManagerWebPart
      extends BaseClientSideWebPart<ITaskManagerWebPartProps> {

      public onInit(): Promise<void> {
        getSP(this.context);
        return super.onInit();
      }

      public render(): void {
        const element = React.createElement(TaskManager, {
          listName: this.properties.listName || "Tasks",
        });
        ReactDom.render(element, this.domElement);
      }

      protected getPropertyPaneConfiguration() {
        return {
          pages: [
            {
              header: { description: "Task Manager Settings" },
              groups: [
                {
                  groupName: "Configuration",
                  groupFields: [
                    PropertyPaneTextField("listName", {
                      label: "SharePoint List Name",
                      value: this.properties.listName,
                      placeholder: "Enter the list name (e.g., Tasks)"
                    }),
                  ],
                },
              ],
            },
          ],
        };
      }

      protected onDispose(): void {
        ReactDom.unmountComponentAtNode(this.domElement);
      }
    }

**Key patterns:**

- **onInit()** initializes PnPjs with the web part context — this must happen before any API calls
- **Property pane** lets end users configure the list name without editing code
- **onDispose()** cleans up the React component when the web part is removed from the page

## Step 6: Add Styling

SPFx uses CSS Modules for scoped styles. Update the SCSS file.

**File:** src/webparts/taskManager/components/TaskManager.module.scss

    .taskManager {
      padding: 20px;
      font-family: "Segoe UI", system-ui, sans-serif;

      h2 {
        color: #323130;
        border-bottom: 2px solid #0078d4;
        padding-bottom: 8px;
        margin-bottom: 20px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 16px;

        th, td {
          padding: 10px 12px;
          text-align: left;
          border-bottom: 1px solid #edebe9;
        }

        th {
          background-color: #f3f2f1;
          font-weight: 600;
          color: #323130;
        }

        tr:hover {
          background-color: #f3f2f1;
        }
      }

      .statusBadge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;

        &.completed { background: #dff6dd; color: #107c10; }
        &.inProgress { background: #fff4ce; color: #797600; }
        &.notStarted { background: #f3f2f1; color: #605e5c; }
      }

      .priorityHigh { color: #d13438; font-weight: 600; }
      .priorityMedium { color: #ca5010; }
      .priorityLow { color: #107c10; }

      .addForm {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        flex-wrap: wrap;

        input, select {
          padding: 8px;
          border: 1px solid #c8c6c4;
          border-radius: 4px;
          font-size: 14px;
        }

        button {
          padding: 8px 16px;
          background-color: #0078d4;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;

          &:hover { background-color: #106ebe; }
        }
      }

      .actions button {
        margin-right: 4px;
        padding: 4px 8px;
        font-size: 12px;
        border: 1px solid #c8c6c4;
        border-radius: 4px;
        background: white;
        cursor: pointer;

        &:hover { background: #f3f2f1; }
        &.delete { color: #d13438; border-color: #d13438; }
      }

      .loading, .error {
        padding: 20px;
        text-align: center;
        font-size: 16px;
      }

      .error { color: #d13438; }
    }

The styles use Microsoft's Fluent UI color palette to match the SharePoint look and feel. CSS Modules ensure your styles don't leak into other web parts on the page.

## Step 7: Test Locally

Start the local development server:

    gulp trust-dev-certificate
    gulp serve

This opens the SharePoint Workbench at https://localhost:4321/temp/workbench.html. However, the Workbench **cannot connect to real SharePoint data**. To test with live data, use the hosted Workbench:

    https://your-tenant.sharepoint.com/_layouts/15/workbench.aspx

> **Note (SPFx 1.21+):** Microsoft is deprecating the Workbench in favor of a new **debugging toolbar** that lets you debug directly on live SharePoint pages. If you're on SPFx 1.21 or later, you can add your web part to a real page and use the toolbar for testing. Check the [SPFx 1.23 migration guide](/blog/spfx-1-23-heft-build-system-new-cli-migration-guide) for details on the new tooling.

## Step 8: Deploy to the App Catalog

When you're ready for production, package and deploy:

**1. Bundle for production:**

    gulp bundle --ship

**2. Create the .sppkg package:**

    gulp package-solution --ship

This generates a .sppkg file in the sharepoint/solution/ folder.

**3. Upload to the App Catalog:**

- Go to your SharePoint Admin Center → More features → Apps → App Catalog
- Upload the .sppkg file to the "Apps for SharePoint" library
- Check "Make this solution available to all sites in the organization" for tenant-wide deployment
- Click Deploy

**4. Add to a page:**

- Navigate to any modern SharePoint page
- Click Edit → Add a web part → Search for "TaskManager"
- Configure the list name in the property pane

## Performance Best Practices

Once your web part works, optimize it for production:

**1. Use batching for multiple requests:**

    const sp = getSP();
    const [batch, execute] = sp.batched();
    const list = batch.web.lists.getByTitle("Tasks");

    // Queue multiple operations in a single HTTP request
    list.items.getById(1).update({ Status: "Completed" });
    list.items.getById(2).update({ Status: "Completed" });
    list.items.getById(3).delete();

    await execute(); // One HTTP call for all 3 operations

**2. Use select() and top() to limit data:**

    // BAD: Fetches all columns and all items
    const items = await sp.web.lists.getByTitle("Tasks").items();

    // GOOD: Fetches only needed columns, first 100 items
    const items = await sp.web.lists
      .getByTitle("Tasks")
      .items.select("Id", "Title", "Status")
      .top(100)();

**3. Implement pagination** for large lists (5,000+ items):

    const items = await sp.web.lists
      .getByTitle("Tasks")
      .items.select("Id", "Title")
      .top(50)
      .skip(50)(); // Page 2

**4. Cache responses** where appropriate:

    import { Caching } from "@pnp/queryable";

    const sp = getSP();
    const cachedSp = sp.using(Caching({ store: "session" }));
    const items = await cachedSp.web.lists
      .getByTitle("Tasks").items();

## Common Pitfalls

| Issue | Cause | Fix |
|-------|-------|-----|
| "Unauthorized" error | Missing API permissions | Grant Sites.ReadWrite.All in SharePoint Admin Center |
| Empty results | Wrong list name | Check listName property matches exactly (case-sensitive) |
| "List does not exist" | Site URL mismatch | Verify the web part runs on the correct site |
| Slow initial load | Fetching all items | Use .top(50) and implement pagination |
| CORS errors in local dev | Using wrong Workbench | Use the hosted Workbench, not localhost |
| Build fails on Node.js | Wrong Node version | SPFx 1.21+ requires Node.js v22 only |

## Going Further

This tutorial gives you a solid foundation. Here's how to extend it:

- **Add Microsoft Graph integration** for user profiles and Teams notifications — see my [Microsoft Graph API guide](/blog/microsoft-graph-api-spfx-integration)
- **Use Adaptive Cards** for richer Teams experiences — see [Building Viva Connections ACEs](/blog/building-viva-connections-adaptive-card-extensions-spfx)
- **Integrate with Power Automate** to trigger workflows when tasks change — see [Power Automate document workflows](/blog/power-automate-sharepoint-document-workflows-2026)
- **Add AI capabilities** with Copilot integration for intelligent task suggestions
- **Use the new Heft build system** in SPFx 1.23+ for faster builds — see my [migration guide](/blog/spfx-1-23-heft-build-system-new-cli-migration-guide)

## Frequently Asked Questions

**Q: Can I use this web part with SharePoint on-premises?**

SPFx web parts work on SharePoint Server 2019 and later, but PnPjs v4 requires SharePoint Online. For on-premises, use PnPjs v3 or the native SharePoint REST API directly.

**Q: Do I need a Power Automate license for CRUD operations?**

No. SPFx web parts call the SharePoint REST API directly using the current user's permissions. No Power Automate or premium connectors are needed for basic CRUD operations.

**Q: What happens with large lists (5,000+ items)?**

SharePoint's list view threshold blocks queries returning more than 5,000 items. Use indexed columns and .top() with pagination to stay under the limit. PnPjs supports automatic paging with the .using(Paged()) behavior.

**Q: Can I use Fluent UI (React) components?**

Yes! SPFx includes Fluent UI React by default. Import components like DetailsList, CommandBar, and Panel for a native SharePoint look. Just install @fluentui/react.

**Q: How do I debug in production?**

SPFx bundles include source maps in debug mode. Use the browser developer tools (F12) to set breakpoints. In SPFx 1.21+, the new debugging toolbar on SharePoint Online pages makes this even easier.

## Summary

You've built a complete SPFx web part that reads, creates, updates, and deletes SharePoint list items. The project uses React for the UI, PnPjs v4 for type-safe SharePoint API calls, and follows SPFx best practices for configuration and deployment.

The full pattern works for any list-driven web part — employee directories, project trackers, inventory managers, or request forms. Change the column mappings and you have a new web part.

For your next step, check out [Power Automate integration with SharePoint](/blog/power-automate-sharepoint-document-workflows-2026) to add automated workflows to your list data, or explore [SharePoint column formatting with JSON](/blog/sharepoint-column-formatting-json-complete-guide) to make your list views visually rich without any code.
`,
    date: '2026-03-05',
    displayDate: 'March 5, 2026',
    readTime: '16 min read',
    category: 'SPFx',
    tags: ['spfx', 'sharepoint', 'react', 'pnpjs', 'web-parts', 'crud', 'microsoft-365'],
  },
  {
    id: '11',
    slug: 'power-automate-sharepoint-document-workflows-2026',
    title: 'Power Automate + SharePoint: 7 Document Workflows That Save Hours Every Week (2026)',
    excerpt:
      'Stop doing manual document management. Here are 7 Power Automate workflows for SharePoint that handle approvals, metadata tagging, archiving, notifications, and more — including the new unified workflows experience shipping in March 2026.',
    image: '/images/blog/power-automate-sharepoint-workflows.png',
    content: `
## Why Automate Document Workflows in SharePoint?

If you manage a SharePoint document library with more than a few dozen files, you already know the pain. Someone uploads a document and forgets to tag it. An approval sits untouched for a week because nobody noticed. Old contracts pile up in the library long past their retention date.

**Power Automate** fixes all of this by connecting SharePoint events to automated actions — no code required. And with the **new unified workflows experience** rolling out in SharePoint in March 2026, building these automations has never been easier.

This guide covers 7 production-ready workflows that I use across enterprise tenants. Each one solves a specific document management headache.

## What's New: The Unified Workflows Experience (March 2026)

Before we dive into the workflows, here's the big news. Microsoft is shipping a **completely redesigned workflows experience** directly inside SharePoint lists and libraries. This brings Power Automate's connectors, triggers, and actions into the SharePoint UI itself.

Here's what's changing:

| Feature | Before (2025) | After (March 2026) |
|---------|--------------|-------------------|
| Creating flows | Navigate to Power Automate portal | Build directly in SharePoint |
| Templates | Generic Power Automate templates | SharePoint-specific templates |
| Approvals | Multi-step setup in Power Automate | One-click enablement in library settings |
| Quick automation | Not available | **Quick Steps** — button-based automation |
| Conditional triggers | Build in Power Automate | **Rules** — set conditions in SharePoint UI |

The key additions:

- **Quick Steps** — Lightweight, button-based automation. Click a button on a document to trigger an action (move to folder, send email, update metadata)
- **Rules** — Auto-trigger actions when conditions are met (new file uploaded, column value changes, due date approaching)
- **Enhanced Approvals** — Default approvers, ordered multi-stage approvals, and in-context tracking directly in the library

> **When should you still use full Power Automate?** Use it for complex logic with conditions, loops, parallel branches, or cross-system integrations (Dynamics 365, third-party APIs). For simple automation, Quick Steps and Rules are faster to set up and maintain.

## Workflow 1: Document Approval with Escalation

The most common request I get. A document is uploaded → manager approves or rejects → status updates automatically.

But production approval flows need more than the basics. Here's what a real-world flow looks like:

**Trigger:** When a file is created in the \`Contracts\` library

**Flow logic:**

\`\`\`
1. Get file properties (metadata: department, contract value)
2. Determine approver:
   - If contract value > $50,000 → VP Finance
   - If contract value > $10,000 → Department Manager
   - If contract value ≤ $10,000 → Auto-approve
3. Start approval (with document link + summary)
4. Wait for response:
   - Approved → Update status column to "Approved", move to "Active Contracts" folder
   - Rejected → Update status to "Rejected", send rejection email with comments
5. If no response in 3 business days → Send reminder
6. If no response in 5 business days → Escalate to next-level manager
\`\`\`

**Key configuration:**

- Use **Start and wait for an approval** (not just "Create an approval") so the flow pauses until a decision is made
- Set the **Assigned to** field dynamically using the department manager lookup from a SharePoint "Managers" list
- Use **Do until** with a timeout for the escalation pattern

If you want the basics first, check out my earlier guide: [Building a SharePoint Approval Flow with Power Automate](/blog/power-automate-sharepoint-approval-flow).

## Workflow 2: Auto-Tag Documents with Metadata

This workflow eliminates the "forgot to tag it" problem permanently.

**Trigger:** When a file is created or modified in any document library

**What it does:**

\`\`\`
1. Get the file name and content type
2. Apply metadata rules:
   - File name contains "INV" → Set Document Type = "Invoice"
   - File name contains "PO" → Set Document Type = "Purchase Order"
   - File extension is .pdf → Set Format = "PDF"
   - Uploaded to "Legal" folder → Set Department = "Legal"
3. If content type is "Contract":
   - Extract dates from file name (YYYY-MM-DD pattern)
   - Set Expiry Date column
4. Update the file properties with the new metadata
\`\`\`

**Pro tips:**

- Use **expressions** in Power Automate to parse file names: \`contains(triggerOutputs()?['body/{FilenameWithExtension}'], 'INV')\`
- For AI-powered tagging, combine this with [AI Builder document processing](/blog/power-automate-ai-builder-intelligent-document-processing) to extract metadata from the document content itself — not just the file name
- **New in 2026:** With the Rules feature, you can set simple metadata rules directly in the library settings without building a full flow

## Workflow 3: Automated Document Archiving

Keep your document libraries clean by automatically archiving old documents.

**Trigger:** Recurrence — runs daily at 11 PM

**Flow logic:**

\`\`\`
1. Get items from "Active Documents" library
   Filter: Modified date < 18 months ago AND Status = "Completed"
2. For each matching document:
   a. Copy file to "Archive" library (preserving metadata)
   b. Add archival record to "Archive Log" list:
      - Original location
      - Archive date
      - Archived by (system account)
      - Retention period (based on document type)
   c. Delete original file from "Active Documents"
3. Send weekly summary email to library owners:
   - Documents archived this week: X
   - Storage recovered: Y MB
   - Next scheduled archive: Z
\`\`\`

**Configuration details:**

- Use the **Send an HTTP request to SharePoint** action to copy files with metadata (the standard "Copy file" action doesn't preserve metadata)
- Set the recurrence to run outside business hours to avoid contention
- Use SharePoint's **file-level archiving** (new in 2026) for cold storage instead of copying to a separate library — it's cheaper and keeps content discoverable

## Workflow 4: Smart Notifications and Reminders

Replace "Did you see the email?" with intelligent, context-aware notifications.

**Trigger:** Multiple triggers combined in a single flow

**Notification scenarios:**

| Event | Channel | Who Gets Notified |
|-------|---------|------------------|
| New document uploaded | Teams channel | Team members |
| Document pending approval > 2 days | Teams direct message | Approver |
| Contract expiring in 30 days | Email + Teams | Legal team + document owner |
| Document checked out > 24 hours | Teams DM | Person who checked it out |
| Failed document processing | Email | IT admin |

**Example: Contract expiry reminder**

\`\`\`
Trigger: Recurrence (daily at 9 AM)
1. Get items from "Contracts" list
   Filter: ExpiryDate between today+25 and today+35
   AND ReminderSent ≠ true
2. For each expiring contract:
   a. Post adaptive card to Teams:
      - Contract name, vendor, expiry date
      - Buttons: "Renew", "Let Expire", "View Contract"
   b. Send email to contract owner with renewal link
   c. Update ReminderSent = true
3. Second filter: ExpiryDate between today and today+7
   → Send URGENT notification to legal team channel
\`\`\`

**Pro tip:** Use **Adaptive Cards** in Teams notifications instead of plain text messages. They're interactive — users can take action directly from the notification without opening SharePoint.

## Workflow 5: Document Generation from Templates

Automatically generate standardized documents from SharePoint list data.

**Trigger:** When an item is created in the "New Client Onboarding" list

**Flow logic:**

\`\`\`
1. Get the new item properties:
   - Client name, address, contract type, start date, terms
2. Use "Populate a Microsoft Word template" action:
   - Template: stored in "Templates" library
   - Map list columns to template placeholders
3. Create the generated document in "Client Documents" library:
   - Folder: Client Name/Year
   - File name: "{ClientName}_Contract_{Date}.docx"
4. Convert to PDF using "Convert file" action
5. Store both .docx and .pdf versions
6. Update the list item with a link to the generated document
7. Send Teams notification to the account manager
\`\`\`

**Configuration tips:**

- Create your Word template with **Content Controls** (Developer tab → Rich Text Content Control). Each control's title must match the Power Automate field mapping
- For complex documents (multi-page contracts with conditional sections), use the **Plumsail Documents** connector — it supports conditional content, tables with dynamic rows, and page breaks
- Store templates in a dedicated "Templates" library with versioning enabled so you can roll back template changes

## Workflow 6: Content Type Routing

Automatically route documents to the correct library based on their content type.

**Trigger:** When a file is created in the "Inbox" document library

**Flow logic:**

\`\`\`
1. Get the file's content type and metadata
2. Route based on content type:
   - "Invoice" → Move to Finance/Invoices library
   - "Contract" → Move to Legal/Contracts library
   - "Policy" → Move to HR/Policies library
   - "Technical Spec" → Move to Engineering/Specs library
   - Unknown → Leave in Inbox, notify admin
3. After moving:
   a. Apply destination library's default metadata
   b. Trigger the destination library's approval flow (if configured)
   c. Log the routing in "Document Routing Log" list
\`\`\`

**Why this matters:**

In large organizations, people don't know (or don't care) where documents should go. A single "drop-box" library with automatic routing solves this. Users upload to one place, and the system handles the rest.

**Pro tip:** Combine this with **information barriers** and **sensitivity labels** for compliance. For example, if a document is labeled "Confidential", route it to a library with restricted access and add an extra approval step.

## Workflow 7: AI-Assisted Document Classification

Use AI Builder to automatically classify and process documents based on their content — not just their file name or metadata.

**Trigger:** When a file is created in the "Unprocessed Documents" library

**Flow logic:**

\`\`\`
1. Send the document to AI Builder's document processing model
2. AI extracts:
   - Document type (invoice, contract, memo, report)
   - Key entities (vendor name, amounts, dates, parties)
   - Confidence score for classification
3. Route based on confidence:
   - Confidence ≥ 90% → Auto-classify and route
   - Confidence 70-89% → Classify but flag for review
   - Confidence < 70% → Send to admin for manual classification
4. Apply extracted metadata as column values
5. Move to the appropriate library
6. Log classification results for model improvement
\`\`\`

For a deep dive on building custom AI models for document processing, check out my full guide: [Power Automate + AI Builder: Intelligent Document Processing](/blog/power-automate-ai-builder-intelligent-document-processing).

## When to Use What: Decision Matrix

With Quick Steps, Rules, and full Power Automate flows all available, here's how to choose:

| Scenario | Use This | Why |
|----------|---------|-----|
| Move document to folder on click | **Quick Step** | Simple, button-triggered, no conditions |
| Send notification when document is uploaded | **Rule** | Single trigger, single action, no logic |
| Approval with escalation logic | **Power Automate** | Complex conditions, timeouts, loops |
| Auto-tag based on file name | **Rule** | Simple pattern matching |
| AI classification + routing | **Power Automate** | AI Builder integration, multi-step |
| Generate document from template | **Power Automate** | Multiple actions, file creation |
| Archive old documents on schedule | **Power Automate** | Scheduled trigger, batch processing |
| Update metadata when column changes | **Rule** | Reactive, single action |

**Rule of thumb:** If it takes one trigger and one action, use a Rule. If it needs a button click, use a Quick Step. If it needs conditions, loops, or external connectors, use Power Automate.

## Production Checklist

Before deploying any of these workflows to your tenant:

- [ ] **Error handling** — Wrap actions in Scope blocks with "Configure run after" settings for failure paths
- [ ] **Throttling** — SharePoint has API limits (600 calls/min per user). Use batching and delays for high-volume libraries
- [ ] **Permissions** — The flow runs under the creator's account. Use a service account for production flows
- [ ] **Testing** — Test with edge cases: large files (>250 MB), special characters in file names, empty metadata fields
- [ ] **Monitoring** — Set up the Power Automate analytics dashboard to track flow runs, failures, and durations
- [ ] **Documentation** — Document each flow's purpose, trigger, and expected behavior in a shared Confluence or SharePoint page

## Frequently Asked Questions

**Q: Can I use these workflows with SharePoint on-premises?**

Power Automate works with SharePoint Server through the **on-premises data gateway**. However, the new unified workflows experience (Quick Steps, Rules) is SharePoint Online only. For on-premises, you'll need to build full Power Automate flows with the gateway connector.

**Q: What licenses do I need?**

Most SharePoint triggers and actions work with a **Microsoft 365** license (E3/E5, Business Basic/Standard/Premium). AI Builder requires **Power Automate Premium** or a standalone AI Builder license. The new Quick Steps and Rules features are included in Microsoft 365 licenses.

**Q: How many flows can I create?**

With a Microsoft 365 license, you can create unlimited cloud flows. However, there are **run limits** — standard plans allow 6,000 flow runs per month per user. Power Automate Premium removes this cap.

**Q: Will these flows work with Teams-connected SharePoint sites?**

Yes. Every Microsoft Team has an associated SharePoint site. Flows triggered on the team's document library work exactly the same way. You can even post notifications back to the team's channel as part of the flow.

**Q: What happens if a flow fails mid-execution?**

Power Automate has built-in **retry policies** for transient errors (429 throttling, 503 service unavailable). For permanent failures, use the Scope + "Configure run after" pattern described in the production checklist. Failed runs are logged in the Power Automate admin center with full error details.

## What's Next

Document workflow automation with Power Automate is one of the highest-ROI investments you can make in the Microsoft 365 ecosystem. Start with the simplest workflow that solves your biggest pain point — usually document approvals or notifications — and expand from there.

The new unified workflows experience makes the barrier to entry even lower. If you haven't already, explore the **Rules** and **Quick Steps** features rolling out in your SharePoint libraries this month.

For more Power Platform content, check out my guides on [building canvas apps with SharePoint](/blog/power-apps-canvas-app-sharepoint-complete-guide) and [SharePoint agents for AI-powered search](/blog/sharepoint-agents-ai-powered-assistants).
`,
    date: '2026-03-05',
    displayDate: 'March 5, 2026',
    readTime: '14 min read',
    category: 'Power Platform',
    tags: ['power-automate', 'sharepoint', 'document-management', 'workflows', 'automation', 'microsoft-365'],
  },
  {
    id: '10',
    slug: 'power-automate-ai-builder-intelligent-document-processing',
    title: 'Power Automate + AI Builder: Intelligent Document Processing Complete Guide',
    excerpt:
      'Learn how to build automated document processing pipelines using Power Automate and AI Builder — extract data from invoices, receipts, and forms with prebuilt and custom AI models, no code required.',
    content: `
## What Is Intelligent Document Processing ?

** Intelligent Document Processing(IDP) ** uses AI to automatically extract, classify, and process data from unstructured documents like invoices, receipts, contracts, and forms.Instead of manually typing data from a PDF into a spreadsheet, IDP reads the document for you.

In the Microsoft ecosystem, this is powered by ** AI Builder ** — a low - code AI capability built directly into the ** Power Platform **.Combined with ** Power Automate **, you can build end - to - end pipelines that:

1. Receive a document(via email, SharePoint upload, or Teams message)
2. Extract structured data using an AI model
3. Validate and route the data to downstream systems
4. Notify stakeholders and log an audit trail

All without writing a single line of traditional code.

## Why This Matters in 2026

The push toward ** hyperautomation ** — automating entire business processes rather than individual tasks — has made document processing one of the highest - ROI automation targets.Here's why:

  - ** 80 % of enterprise data is unstructured ** (PDFs, scanned images, emails). Traditional RPA tools can't handle them reliably
    - ** AI Builder models are pre - trained on millions of documents **, so they work out of the box for common document types(invoices, receipts, business cards, passports)
      - ** Custom AI models ** let you train on your own document formats with as few as 5 sample documents
        - ** Power Automate integration ** means extracted data flows directly into SharePoint, Dataverse, Dynamics 365, or any of 1,000 + connectors

## Prerequisites

Before you start building:

- ** Power Automate Premium license ** (AI Builder requires Premium or per - user plan)
- ** AI Builder credits ** — included with certain Microsoft 365 and Dynamics 365 plans, or purchasable separately
  - ** SharePoint Online ** — for document storage and triggers
    - ** A Microsoft 365 environment ** — developer tenant works fine for testing

## Step 1: Choose Your AI Model

AI Builder offers several prebuilt models that require zero training:

| Model | What It Extracts | Best For |
| -------| -----------------| ----------|
| ** Invoice Processing ** | Vendor, amounts, line items, dates, PO numbers | Accounts payable automation |
| ** Receipt Processing ** | Merchant, total, tax, date, payment method | Expense report automation |
| ** Identity Document Reader ** | Name, DOB, address, document number | KYC / onboarding workflows |
| ** Business Card Reader ** | Name, title, company, email, phone | CRM lead capture |
| ** Text Recognition(OCR) ** | Raw text from any image or PDF | General - purpose extraction |
| ** Custom Document Processing ** | Any fields you define | Custom forms, applications |

  For this guide, we'll build an **invoice processing pipeline** — the most common enterprise use case.

## Step 2: Build the Power Automate Flow

### Trigger: When a File Is Created in SharePoint

Create a new ** Automated cloud flow ** in Power Automate:

1. Go to[make.powerautomate.com](https://make.powerautomate.com)
  2. Click ** Create ** → ** Automated cloud flow **
3. Name it: \`Invoice Processing Pipeline\`
4. Trigger: **When a file is created (properties only)** — SharePoint
5. Configure:
   - **Site Address:** Your SharePoint site
   - **Library Name:** \`Invoices\` (create this document library if it doesn't exist)

### Action: Extract Information from Invoices

Add the AI Builder action:

1. Click **New step** → search for **AI Builder**
2. Select **Extract information from invoices**
3. For the **Invoice file** parameter, use the dynamic content picker to select the file content from the SharePoint trigger

This is the magic step. AI Builder will analyze the document and return structured data including:

- **Invoice ID**
- **Invoice date** and **due date**
- **Vendor name** and **vendor address**
- **Customer name**
- **Subtotal**, **tax**, and **total amount**
- **Line items** (description, quantity, unit price, amount)
- **Purchase order number**
- **Confidence scores** for each extracted field

### Action: Create Item in SharePoint List

Now store the extracted data in a structured SharePoint list:

1. Add **Create item** — SharePoint
2. Configure:
   - **Site Address:** Your SharePoint site
   - **List Name:** \`Invoice Records\`
   - Map the AI Builder outputs to your list columns:

\`\`\`
Vendor Name    →  AI Builder: Vendor name
Invoice Number →  AI Builder: Invoice ID
Invoice Date   →  AI Builder: Invoice date
Total Amount   →  AI Builder: Total
Status         →  "Pending Review"
Confidence     →  AI Builder: Confidence score
\`\`\`

### Action: Handle Low-Confidence Results

Not every extraction will be perfect. Add a **Condition** to route uncertain results for human review:

\`\`\`
If AI Builder Confidence Score is less than 0.85
  → Send an adaptive card to Teams for manual review
Else
  → Auto-approve and update status to "Approved"
\`\`\`

This **human-in-the-loop** pattern is critical for production deployments. It ensures accuracy while still automating 80-90% of documents automatically.

### Action: Send Notification

Add a final step to notify the finance team:

1. Add **Post a message in a chat or channel** — Microsoft Teams
2. Select the \`#invoices\` channel
3. Include a summary of the extracted data

## Step 3: Train a Custom AI Model (Optional)

When your documents don't match any prebuilt model — for example, custom internal forms, insurance claims, or government applications — you can train a custom model.

### Create the Model

1. Go to [make.powerapps.com](https://make.powerapps.com) → **AI Builder** → **Explore**
2. Click **Document processing** → **Create custom model**
3. Define the **fields** you want to extract (e.g., "Claim Number", "Policy ID", "Incident Date")
4. Upload **at least 5 sample documents** (more samples = better accuracy)
5. Tag each field on the sample documents using the visual tagging tool
6. Click **Train** — this takes 15-30 minutes depending on complexity

### Use the Custom Model in Power Automate

Once trained, your custom model appears alongside the prebuilt models:

1. In Power Automate, add **Process and save information from forms** — AI Builder
2. Select your custom model from the dropdown
3. Map the file content from your trigger
4. The output will include your custom fields with confidence scores

## Step 4: Production-Ready Patterns

### Error Handling

Always wrap AI Builder actions in a **Try-Catch** pattern using **Scope** actions:

\`\`\`
Scope: "Try - Process Invoice"
  ├── Extract information from invoices
  ├── Create item in SharePoint
  └── Send Teams notification

Scope: "Catch - Handle Errors" (Configure to Run After: "Try" has failed)
  ├── Log error to SharePoint "Error Log" list
  ├── Move failed document to "Failed" folder
  └── Send alert email to admin
\`\`\`

### Batch Processing

For high-volume scenarios, use the **Apply to each** action to process multiple documents:

\`\`\`
Trigger: Recurrence (daily at 8 AM)
  → Get files from "Unprocessed Invoices" folder
  → Apply to each file:
      → Extract information from invoices
      → Create item in SharePoint
      → Move file to "Processed" folder
\`\`\`

### Approval Workflow Integration

Combine AI Builder extraction with **Power Automate Approvals** for a complete procure-to-pay workflow:

\`\`\`
Document received
  → AI extracts data
  → If amount > $5,000: Start approval with VP Finance
  → If amount > $1,000: Start approval with Manager
  → If amount < $1,000: Auto-approve
  → Update ERP system via connector
\`\`\`

## Real-World Performance Metrics

Based on enterprise deployments I've worked with:

| Metric | Before IDP | After IDP |
|--------|-----------|-----------|
| Invoice processing time | 15-20 min/invoice | 30 seconds |
| Error rate | 5-8% (human entry) | 1-2% (AI + human review) |
| Monthly capacity | ~500 invoices/person | ~5,000 invoices/person |
| Staff reallocation | 3 FTE on data entry | 0.5 FTE on exception handling |

The ROI is typically realized within 2-3 months.

## Licensing and Costs

AI Builder uses a **credit-based** consumption model:

- **Prebuilt models** (invoice, receipt): ~1 credit per page processed
- **Custom models**: ~1 credit per page processed
- **Credits included** with Power Automate Premium, Power Apps Premium, and certain Dynamics 365 licenses
- **Additional credits** can be purchased in packs of 1 million (~$500/month)

For most SMBs processing under 5,000 documents/month, the included credits are sufficient.

## Tips and Best Practices

- **Start with prebuilt models first.** They're remarkably accurate for standard document types and require zero setup time
- **Use PDF format when possible.** AI Builder handles scanned images, but clean PDFs yield better extraction accuracy
- **Set confidence thresholds per field.** Some fields (like total amount) may need a higher threshold than others (like vendor address)
- **Build a feedback loop.** Log extraction accuracy over time and retrain custom models when accuracy drops below your target
- **Test with edge cases.** Multi-page invoices, rotated pages, low-quality scans, and multi-language documents can trip up models
- **Use SharePoint metadata columns** to make extracted data searchable and filterable without opening documents

## What's Next for AI Builder in 2026

Microsoft's roadmap includes exciting capabilities:

- **Multi-modal document understanding** — Combining text, images, and table extraction in a single pass
- **Cross-document intelligence** — Linking related documents (PO → Invoice → Receipt) automatically
- **Continuous learning** — Models that improve from corrections without manual retraining
- **Natural language queries** — Ask questions about your documents using Copilot directly in Power Automate

AI Builder is no longer a "nice-to-have" — it's becoming the standard way to bridge the gap between physical documents and digital business processes in the Microsoft ecosystem.
`,
    date: '2026-03-03',
    displayDate: 'March 3, 2026',
    readTime: '12 min read',
    category: 'Power Platform',
    tags: ['power-automate', 'ai-builder', 'document-processing', 'automation', 'low-code', 'microsoft-365'],
  },
  {
    id: '9',
    slug: 'building-viva-connections-adaptive-card-extensions-spfx',
    title: 'Building Viva Connections Adaptive Card Extensions (ACEs) with SPFx',
    excerpt:
      'A complete hands-on guide to creating Adaptive Card Extensions for Microsoft Viva Connections dashboards — from scaffolding your first ACE with SPFx to building interactive Quick View cards with real data.',
    content: `
## What Are Adaptive Card Extensions?

**Adaptive Card Extensions (ACEs)** are the building blocks of the **Microsoft Viva Connections** dashboard — the employee experience hub in Microsoft 365. Every card on the Viva Connections dashboard is an ACE.

As an SPFx developer, ACEs let you build compact, interactive dashboard widgets that surface real-time business data directly on the Viva Connections home screen. Think of them as SPFx web parts, but purpose-built for mobile-first, glanceable dashboards.

An ACE has two visual states:

- **Card View** — The compact card shown on the dashboard (like a widget on your phone home screen)
- **Quick View** — A richer, larger panel that opens when the user clicks the card (like tapping a widget to expand it)

Both are rendered using **Adaptive Card JSON** — the same cross-platform card format used in Teams, Outlook, and Bot Framework.

## Why Build ACEs in 2026?

With Viva Connections rolling out as the default Teams home experience for many enterprise organizations, the Viva dashboard is now the first screen employees see every day. This makes ACEs one of the highest-visibility touchpoints in the entire Microsoft 365 ecosystem.

Real-world ACE use cases that are trending right now:

- **IT Service Desk** — Show open ticket count, let users submit new tickets
- **Leave Balance Tracker** — Display remaining leave days, link to the request form
- **Company News Feed** — Surface the latest announcements from SharePoint News
- **Attendance Summary** — Show today's in-office vs. remote headcount
- **Project Status Tracker** — At-a-glance KPIs for active projects from Planner or Dataverse
- **Birthday & Anniversary Cards** — Celebrate team milestones pulled from HR data

## Prerequisites

Set up your environment before starting:

- **SPFx 1.19+** (ACE improvements require at minimum 1.18; 1.21+ recommended for latest ACE features)
- **Node.js 18.x LTS** — use \`nvm\` to manage versions
- **Yeoman + SPFx generator** (or the new \`@microsoft/spfx-cli\` for SPFx 1.23+)
- **Microsoft 365 developer tenant** with Viva Connections enabled
- **Viva Connections license** — included in Microsoft 365 E3/E5, or available as standalone

Verify your environment:

\`\`\`bash
node --version   # Should be 18.x
npm --version    # Should be 9.x or higher
yo --version     # Should be installed globally
\`\`\`

## Step 1: Scaffold Your First ACE

Create a new project using the SPFx generator:

\`\`\`bash
yo @microsoft/sharepoint
\`\`\`

When prompted:

1. **Solution name:** \`leave-balance-ace\`
2. **Target:** SharePoint Online only (latest)
3. **Place files:** Current folder
4. **Type of client-side component:** Adaptive Card Extension
5. **Template:** Generic Card Template
6. **ACE name:** \`LeaveBalanceACE\`

This creates the following structure:

\`\`\`
leave-balance-ace/
├── src/
│   └── adaptiveCardExtensions/
│       └── leaveBalance/
│           ├── LeaveBalanceAdaptiveCardExtension.ts   ← Main ACE class
│           ├── LeaveBalanceAdaptiveCardExtension.manifest.json
│           ├── cardView/
│           │   └── CardView.ts                        ← Card view definition
│           ├── quickView/
│           │   └── QuickView.ts                       ← Quick view definition
│           └── loc/
│               └── en-us.js
├── config/
├── package.json
└── gulpfile.js
\`\`\`

## Step 2: Understand the ACE Architecture

Open \`LeaveBalanceAdaptiveCardExtension.ts\`. This is the brain of your ACE:

\`\`\`typescript
import { IAdaptiveCardExtensionCard, BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';

export interface ILeaveBalanceACEState {
  annualLeaveRemaining: number;
  sickLeaveRemaining: number;
  lastUpdated: string;
}

export interface ILeaveBalanceACEProperties {
  title: string;
}

const CARD_VIEW_REGISTRY_ID = 'LeaveBalance_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID = 'LeaveBalance_QUICK_VIEW';

export default class LeaveBalanceACE extends BaseAdaptiveCardExtension<
  ILeaveBalanceACEProperties,
  ILeaveBalanceACEState
> {
  public async onInit(): Promise<void> {
    this.state = {
      annualLeaveRemaining: 0,
      sickLeaveRemaining: 0,
      lastUpdated: '',
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    await this._fetchLeaveData();
    return Promise.resolve();
  }

  private async _fetchLeaveData(): Promise<void> {
    // Fetch from SharePoint list, Graph API, or any REST endpoint
    // For this example, we'll use a SharePoint list
    const response = await this.context.spHttpClient.get(
      \`\${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Leave Balances')/items?$filter=EmployeeEmail eq '\${this.context.pageContext.user.email}'&$select=AnnualLeave,SickLeave\`,
      SPHttpClient.configurations.v1
    );
    
    const data = await response.json();
    
    if (data.value && data.value.length > 0) {
      this.setState({
        annualLeaveRemaining: data.value[0].AnnualLeave,
        sickLeaveRemaining: data.value[0].SickLeave,
        lastUpdated: new Date().toLocaleDateString(),
      });
    }
  }

  protected get iconProperty(): string {
    return 'Calendar';  // Fluent UI icon name
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import('./LeaveBalancePropertyPane')
      .then(component => {
        this._deferredPropertyPane = new component.LeaveBalancePropertyPane();
      });
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }
}
\`\`\`

The key concepts:

- **\`onInit()\`** — Called when the ACE loads. Fetch your data here and set the initial state
- **\`setState()\`** — Updates state and triggers re-render of both card and quick views
- **\`renderCard()\`** — Returns the ID of the card view to display
- **\`cardNavigator\` / \`quickViewNavigator\`** — Navigation stacks for view routing

## Step 3: Build the Card View

Open \`cardView/CardView.ts\`. The card view defines what users see on the dashboard:

\`\`\`typescript
import {
  BasePrimaryTextCardView,
  IPrimaryTextCardViewParameters,
} from '@microsoft/sp-adaptive-card-extension-base';
import { QUICK_VIEW_REGISTRY_ID } from '../LeaveBalanceAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<
  ILeaveBalanceACEProperties,
  ILeaveBalanceACEState
> {
  public get data(): IPrimaryTextCardViewParameters {
    return {
      title: this.properties.title || 'Leave Balance',
      primaryText: \`\${this.state.annualLeaveRemaining} days\`,
      description: \`Annual leave remaining · Updated \${this.state.lastUpdated}\`,
    };
  }

  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: 'View Details',
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID,
          },
        },
      },
    ];
  }
}
\`\`\`

### Built-in Card View Templates

SPFx provides several pre-built card view base classes so you don't need to design from scratch:

| Class | When to Use |
|-------|------------|
| \`BasePrimaryTextCardView\` | Title + primary text + description |
| \`BaseImageCardView\` | Card with a featured image |
| \`BaseTextInputCardView\` | Card with an inline text input (search, quick submit) |
| \`BaseBasicCardView\` | Minimal card — just title and buttons |

Pick the template that fits your content type. Most dashboard widgets use \`BasePrimaryTextCardView\`.

## Step 4: Build the Quick View

The Quick View is a full Adaptive Card that opens when users click your card. Edit \`quickView/QuickView.ts\`:

\`\`\`typescript
import {
  BaseAdaptiveCardView,
  IAdaptiveCardViewParameters,
} from '@microsoft/sp-adaptive-card-extension-base';

export class QuickView extends BaseAdaptiveCardView<
  ILeaveBalanceACEProperties,
  ILeaveBalanceACEState,
  ILeaveBalanceData
> {
  public get data(): ILeaveBalanceData {
    return {
      annualLeave: this.state.annualLeaveRemaining,
      sickLeave: this.state.sickLeaveRemaining,
      lastUpdated: this.state.lastUpdated,
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard",
      "version": "1.5",
      "body": [
        {
          "type": "TextBlock",
          "text": "Your Leave Balance",
          "size": "Large",
          "weight": "Bolder",
          "wrap": true
        },
        {
          "type": "FactSet",
          "facts": [
            {
              "title": "Annual Leave",
              "value": "\${annualLeave} days remaining"
            },
            {
              "title": "Sick Leave",
              "value": "\${sickLeave} days remaining"
            },
            {
              "title": "Last Updated",
              "value": "\${lastUpdated}"
            }
          ]
        },
        {
          "type": "ActionSet",
          "actions": [
            {
              "type": "Action.OpenUrl",
              "title": "Request Leave",
              "url": "https://yourcompany.sharepoint.com/sites/HR/leave-request"
            }
          ]
        }
      ]
    };
  }
}
\`\`\`

### Adaptive Card Templating

Notice the \`\${annualLeave}\` syntax — this is **Adaptive Card Templating**. The \`data()\` getter provides the data object, and the template binds to it using \`\${...}\` expressions. This separation of data and presentation makes cards easy to maintain.

You can design and test your Adaptive Card JSON at [adaptivecards.io/designer](https://adaptivecards.io/designer/) before embedding it in your Quick View.

## Step 5: Test in the Local Workbench

\`\`\`bash
gulp serve
\`\`\`

This opens the Viva Connections workbench at \`https://localhost:4321/temp/workbench.html\`. You can add your ACE to the preview canvas and interact with both the card view and quick view.

For testing against real SharePoint data, use the hosted workbench:

\`\`\`
https://YOUR_TENANT.sharepoint.com/_layouts/15/workbench.aspx
\`\`\`

## Step 6: Add a Property Pane for Configuration

Let administrators configure the ACE without code changes. Create \`LeaveBalancePropertyPane.ts\`:

\`\`\`typescript
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';

export class LeaveBalancePropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Configure Leave Balance Card',
          },
          groups: [
            {
              groupName: 'Settings',
              groupFields: [
                PropertyPaneTextField('title', {
                  label: 'Card Title',
                  placeholder: 'e.g. My Leave Balance',
                }),
                PropertyPaneTextField('listName', {
                  label: 'SharePoint List Name',
                  placeholder: 'e.g. Leave Balances',
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
\`\`\`

Reference it in the main ACE class:

\`\`\`typescript
protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return this._deferredPropertyPane!.getPropertyPaneConfiguration();
}
\`\`\`

## Step 7: Deploy to Viva Connections

Build and package your ACE:

\`\`\`bash
gulp bundle --ship
gulp package-solution --ship
\`\`\`

This creates a \`.sppkg\` file in the \`sharepoint/solution/\` folder.

**Deploy to App Catalog:**
1. Go to your **SharePoint Admin Center** → **Advanced** → **App catalog**
2. Go to **Apps for SharePoint** → **Upload** your \`.sppkg\`
3. Click **Deploy** when prompted
4. Check **Make this solution available to all sites**

**Add to Viva Connections Dashboard:**
1. Open your **Viva Connections** home page in Teams
2. Click **Edit** (requires SharePoint Admin or the Viva Connections Admin role)
3. Click **Add a card** → find your ACE in the list
4. Configure it using the property pane
5. **Save** and **Publish**

Your card is now live on the Viva Connections dashboard for your entire organization.

## Advanced: Real-time State Updates

ACEs support periodic background data refreshes. Add a timer to your \`onInit()\`:

\`\`\`typescript
public async onInit(): Promise<void> {
  // ... existing init code ...

  // Refresh data every 5 minutes
  setInterval(async () => {
    await this._fetchLeaveData();
  }, 5 * 60 * 1000);

  return Promise.resolve();
}
\`\`\`

This keeps dashboard cards current without requiring page reloads — critical for time-sensitive data like IT tickets or on-call rotations.

## Advanced: Deep-Linking to Teams

Open a Teams channel, chat, or app directly from your ACE action:

\`\`\`typescript
public get cardButtons(): [ICardButton] {
  return [
    {
      title: 'Open in Teams',
      action: {
        type: 'ExternalLink',
        parameters: {
          isTeamsDeepLink: true,
          target: 'https://teams.microsoft.com/l/channel/...',
        },
      },
    },
  ];
}
\`\`\`

This is especially powerful for service desk ACEs where clicking the card drops the user directly into the IT support channel.

## Common ACE Patterns

After building ACEs for enterprise dashboards, here are the patterns I reach for repeatedly:

### 1. Loading State Pattern

Always show a loading state while data fetches:

\`\`\`typescript
public async onInit(): Promise<void> {
  this.state = { isLoading: true, data: null };
  
  this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());

  try {
    const data = await this._fetchData();
    this.setState({ isLoading: false, data });
  } catch (error) {
    this.setState({ isLoading: false, error: 'Failed to load data' });
  }
}
\`\`\`

### 2. Conditional Card Buttons

Show different buttons based on state — like hiding "Submit" after a form is completed:

\`\`\`typescript
public get cardButtons(): [ICardButton] | undefined {
  if (this.state.isLoading) return undefined;
  if (this.state.submitted) return undefined;

  return [{ title: 'Submit Request', action: { type: 'QuickView', parameters: { view: FORM_VIEW } } }];
}
\`\`\`

### 3. Multi-View Navigation

Navigate between multiple Quick Views like a mini wizard:

\`\`\`typescript
// In QuickView 1 — navigate to QuickView 2 on action
public onAction(action: IActionArguments): void {
  if (action.type === 'Submit') {
    this.quickViewNavigator.push(CONFIRM_VIEW_ID);
  }
}

// Navigate back
this.quickViewNavigator.pop();

// Reset to card view
this.quickViewNavigator.close();
\`\`\`

## Performance Tips

- **Cache API responses.** Store fetched data in the ACE state and only re-fetch on explicit refresh. Viva Connections can display dozens of cards — unnecessary API calls compound quickly
- **Use Adaptive Card v1.5.** It supports more features and renders better on mobile
- **Keep card view minimal.** Show 2-3 key numbers maximum. The quick view is for details
- **Test on mobile.** Viva Connections is heavily used on Teams mobile. Design your card views for a 390px-wide phone screen first
- **Handle 403 errors gracefully.** If the user doesn't have access to your data source, show a friendly fallback message instead of a broken card

## What's Coming for ACEs in SPFx 1.24

Looking at Microsoft's roadmap for mid-2026:

- **ACE actions without Quick View** — Trigger Power Automate flows or Graph API calls directly from card view buttons, with an in-place confirmation
- **Image Card View improvements** — Animated images and richer layout options for visual cards
- **Enhanced mobile gestures** — Swipe actions on cards for quick approvals
- **AI-generated card content** — Integration point for Copilot-generated summaries directly in ACE card views

Viva Connections ACEs are the most direct way for SPFx developers to impact the daily experience of every employee in an organization. With mobile-first usage growing and Viva becoming the default Teams home page, the investment in learning ACEs pays dividends quickly.
`,
    date: '2026-03-02',
    displayDate: 'March 2, 2026',
    readTime: '14 min read',
    category: 'SPFx',
    tags: ['spfx', 'viva-connections', 'adaptive-card-extensions', 'ace', 'microsoft-365', 'dashboard'],
  },
  {
    id: '8',
    slug: 'microsoft-graph-api-spfx-user-profiles-teams',
    title: 'Using Microsoft Graph API in SPFx: Fetch User Profiles, Teams, and Site Data',
    excerpt:
      'Learn how to use Microsoft Graph API in SharePoint Framework web parts — from setting up permissions to fetching user profiles, Teams memberships, and SharePoint site data with real code examples.',
    content: `
## Why Microsoft Graph API in SPFx?

If you're building SharePoint Framework web parts, you'll quickly hit the limits of what pure SharePoint APIs can do. Need to show the current user's photo? Display their Teams memberships? Pull calendar events? Send emails?  That's where **Microsoft Graph** comes in.

Microsoft Graph is the **unified API for all of Microsoft 365**. From a single endpoint (\`https://graph.microsoft.com\`), you can access:

- **User profiles** — photos, job titles, managers, direct reports
- **Teams and channels** — list teams, post messages, get channel members
- **Calendar events** — upcoming meetings, availability, free/busy status
- **OneDrive files** — recent files, shared documents, file previews
- **Mail** — read, send, and search emails
- **Planner** — tasks, buckets, plans across your organization
- **SharePoint** — sites, lists, and pages (beyond what the SP REST API offers)

The best part? **SPFx has built-in Graph support** through the \`MSGraphClientV3\` — no need to manually handle OAuth tokens.

## Prerequisites

Before you start, make sure you have:

- **SPFx 1.19+** development environment set up ([see my SPFx Hello World guide](/blog/building-spfx-hello-world-webpart))
- **Microsoft 365 developer tenant** or access to a SharePoint Online site
- **API permissions** configured in your \`package-solution.json\`
- **Admin consent** granted for the Graph scopes you need

## Step 1: Request API Permissions

The first thing you need is to declare which Graph permissions your web part requires. Open \`config/package-solution.json\` and add the \`webApiPermissionRequests\` section:

\`\`\`json
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
\`\`\`

### Understanding Permission Scopes

Choose the **least privileged scope** that works for your scenario:

| What You Need | Scope | Permission Type |
|--------------|-------|----------------|
| Current user's profile | \`User.Read\` | Delegated |
| Any user's basic profile | \`User.ReadBasic.All\` | Delegated |
| User photos | \`User.Read.All\` | Delegated |
| List Teams memberships | \`Team.ReadBasic.All\` | Delegated |
| Read SharePoint sites | \`Sites.Read.All\` | Delegated |
| Send mail | \`Mail.Send\` | Delegated |
| Read calendars | \`Calendars.Read\` | Delegated |

**Important:** After deploying your \`.sppkg\` package, a **tenant admin** must approve these permissions in the SharePoint Admin Center → **API access** page. Without admin consent, your Graph calls will fail with a 403.

## Step 2: Initialize the Graph Client

In your web part file (e.g., \`GraphDemoWebPart.ts\`), get the Graph client from the SPFx context:

\`\`\`typescript
import { MSGraphClientV3 } from '@microsoft/sp-http';

// Inside your web part class:
private async getGraphClient(): Promise<MSGraphClientV3> {
  return await this.context.msGraphClientFactory.getClient('3');
}
\`\`\`

That's it. No OAuth configuration, no client secrets, no token management. SPFx handles the entire authentication flow for you using the current user's Azure AD session.

## Step 3: Fetch the Current User's Profile

Let's start with the most common scenario — getting the signed-in user's profile data:

\`\`\`typescript
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
\`\`\`

### Get the User's Photo

User photos are returned as binary blobs, so you need to convert them to a data URL:

\`\`\`typescript
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
\`\`\`

## Step 4: List the User's Teams

Show which Microsoft Teams the current user belongs to:

\`\`\`typescript
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
\`\`\`

## Step 5: Search SharePoint Sites

Use Graph to search across all SharePoint sites in the tenant:

\`\`\`typescript
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
\`\`\`

## Step 6: Put It All Together in React

Here's how to wire everything up in a React component:

\`\`\`typescript
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
\`\`\`

## Error Handling Patterns

Graph API calls can fail for many reasons. Here's a robust pattern:

\`\`\`typescript
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
\`\`\`

## Batching Multiple Requests

Instead of making 5 separate Graph calls, batch them into one:

\`\`\`typescript
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
\`\`\`

This is **significantly faster** than sequential calls, especially on slower connections.

## PnP JS Alternative

If you prefer a more developer-friendly wrapper, **PnP JS** provides a Graph client with chainable, typed methods:

\`\`\`typescript
import { graphfi, SPFx } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/teams";

// In onInit():
const graph = graphfi().using(SPFx(this.context));

// Usage:
const me = await graph.me();
const teams = await graph.me.joinedTeams();
const photo = await graph.me.photo.getBlob();
\`\`\`

PnP JS handles batching, caching, and error handling for you. If you're building complex Graph integrations, it's worth the extra dependency.

## Common Mistakes

After building dozens of Graph-powered SPFx web parts, these are the issues I see most:

- **Forgetting admin consent.** Your web part silently gets 403 errors. Always check the API access page first
- **Requesting too many scopes.** Only request what you need. \`User.Read\` is enough for the current user
- **Not using \`$select\`.** Without it, Graph returns every field. Always specify exactly what you need
- **Ignoring throttling.** On pages with many Graph web parts, you'll hit rate limits. Batch your calls and cache responses
- **Hardcoding tenant URLs.** Use Graph's relative paths (\`/me\`, \`/sites\`) instead of hardcoded SharePoint URLs

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
