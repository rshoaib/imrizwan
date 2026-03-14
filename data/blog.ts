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
    id: "1",
    slug: "sharepoint-2013-workflows-power-automate-migration",
    title: "SharePoint 2013 Workflows to Power Automate Migration Guide (2026)",
    excerpt: "With the final April 2026 deadline approaching, learn the step-by-step developer approach to migrating legacy SharePoint 2013 Workflows to Power Automate. Covers the M365 Assessment Tool, logic rebuilding, and interactive automation tools.",
    date: new Date().toISOString(),
    displayDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readTime: "8 min read",
    category: "Power Platform",
    image: "/images/blog/sharepoint-2013-workflows-migration.png",
    tags: ["Power Automate", "SharePoint", "Migration", "2026"],
    content: `## The April 2026 Deadline: Are You Ready?

Microsoft has drawn a firm line in the sand: **SharePoint 2013 workflows will be completely retired for existing tenants by April 2, 2026**. (They were already disabled for new tenants in April 2024).

If your organization still relies on legacy SharePoint Designer workflows for critical business processes—like document approvals, list item updates, or notification routing—the clock is ticking. You must transition to Power Automate. But migrating isn't just a simple copy-paste operation; it requires a strategic shift in how you build and structure your logic.

In this guide, I'll walk you through a pragmatic, developer-focused approach to moving away from SharePoint 2013 workflows safely and efficiently.

---

## 1. Assessment: The Microsoft 365 Assessment Tool

Before writing a single line of a new flow or dropping an action into the visual designer, you need a complete picture of your environment. Do not rely on manual audits or "institutional knowledge."

Instead, use the **Microsoft 365 Assessment Tool**.

### Why the Assessment Tool is Mandatory
This official scanner connects to your tenant and generates a Power BI report detailing every active workflow, its usage frequency, its association (Lists vs. Content Types), and, crucially, an "upgradability score." This score indicates how seamlessly a workflow translates to Power Automate.

**Pro-Tip:** Focus first on workflows with high execution counts and high upgradability scores. These "quick wins" build momentum with your stakeholders.

---

## 2. Re-engineering vs. 1:1 Migration

The biggest mistake developers make is trying to migrate a SharePoint Designer workflow 1:1 into Power Automate. Power Automate is structurally fundamentally different. 

**SharePoint workflows are state machines.** They wait for changes gracefully over months. 
**Power Automate flows are stateless execution engines.** They have a strict 30-day run limit.

### Structural Differences

| Feature | SharePoint 2013 Workflows | Power Automate |
|---------|---------------------------|----------------|
| **Architecture** | State Machine (Event-driven) | Stateless (Trigger-based) |
| **Max Run Duration** | Indefinite | 30 Days (Hard limit) |
| **Approvals** | Task Lists (cumbersome) | Native Approvals Connector |
| **Integrations** | Limited (Mostly internal) | 1,000+ Premium Connectors |

Because of the 30-day timeout, **never build a single flow that waits for a multi-stage approval that could take weeks**. Instead, break the process into smaller, independent flows triggered by status column updates in your SharePoint List.

---

## 3. Rebuilding the Logic: Essential Tools

Power Automate provides a powerful web-based designer, but writing complex formulas and organizing your outputs can get messy quickly. Unlike SharePoint Designer's simplistic UI, Power Automate requires you to use **Expressions** (which behave similarly to Excel formulas) to reshape data.

### Tool 1: Mastering Expressions
If you've struggled with expressions like \`formatDateTime()\` or \`coalesce()\`, you need a reliable quick reference. I've built a free interactive [Power Automate Expressions directory](/tools/power-automate-expressions) that lets you search and copy exact syntax, with real-world examples. It's an indispensable companion when you're deeply nested inside an "Apply to Each" loop.

### Tool 2: The Action Outputs (Formatting HTML)
One of the most common tasks in a legacy workflow is generating a summary email containing a table of line items. In Power Automate, you use the **Create HTML table** action.

By default, the output is exceptionally ugly—just raw, unstyled HTML. To make your automated emails look professional and enterprise-grade, use my [HTML Table Styler tool](/tools/html-table-styler). You can visually design your table (colors, padding, borders) and it instantly generates the exact CSS block to inject before your table output.

---

## 4. Addressing Workflow History and Approvals

### The Loss of Workflow History
A major shock for users migrating from SharePoint 2013 is the absence of the classic "Workflow History" list. Power Automate maintains a 30-day run history, which is not easily accessible to end-users and disappears quickly.

**The Fix:** Create a dedicated "Audit Log" SharePoint list. In your flow, explicitly add "Create Item" actions at key milestones to log statuses, approver comments, and timestamps to this list. This provides a permanent, searchable record.

### Modernizing Approvals
Abandon the old logic of creating tasks in a SharePoint list. Power Automate's native "Start and wait for an approval" action pushes interactive Adaptive Cards directly to Microsoft Teams and Outlook. Approvers can click "Approve" or "Reject" without ever opening SharePoint. It is the single biggest "wow" factor you can deliver during this migration.

---

## Conclusion & Next Steps

The April 2026 deprecation of SharePoint 2013 workflows is a hard deadline, but it is also an opportunity to completely modernize your enterprise processes. By leveraging tools like the M365 Assessment Tool, breaking complex state machines into modular flows, and utilizing deep resources like the [Power Automate Expressions directory](/tools/power-automate-expressions), you can make the transition flawless.

Start scanning your tenant today. 2026 will come faster than you think.
`
  }
];
