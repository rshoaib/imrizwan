---
title: "Power Automate: Approval Workflow (2026)"
slug: power-automate-document-approval
excerpt: "Build a Power Automate document approval flow end-to-end — SharePoint trigger, approver routing, parallel branches, and notifications."
date: "2026-02-16"
displayDate: "February 16, 2026"
readTime: "10 min read"
image: "/images/blog/power-automate-sharepoint-workflows.png"
category: "Power Platform"
tags:
  - "power-automate"
  - "sharepoint"
  - "approval"
  - "teams"
  - "workflow"
---

## Why Document Approvals Matter

Document approval workflows are among the most common Power Automate use cases—and for good reason. Manually routing documents through email chains, tracking approvals in spreadsheets, and chasing down sign-offs is slow, error-prone, and creates compliance risks. With Power Automate, you can move approvals from inboxes to structured workflows that are faster, auditable, and integrated with tools your team already uses.

In this guide, you'll build a complete approval workflow that triggers when someone uploads a document to SharePoint, sends an approval request to the right person, branches on their response, and notifies everyone involved via Teams. We'll also cover multi-level approvals, error handling, and practical tips you'll use in real-world scenarios.

## Prerequisites

- **A SharePoint Online site** with a document library
- **Power Automate license** — cloud flows work with a free license, but approval actions work best with a paid subscription
- **Microsoft Teams** installed and configured for your org
- Basic familiarity with [SharePoint document library structure](/blog/sharepoint-online-permissions-complete-guide)

## Building Your Approval Flow

### Setting Up the Trigger

Use "When a file is created (properties only)" rather than "When a file is created or modified"—this prevents accidental re-triggers when Power Automate updates file properties during the flow run.

1. Create a new cloud flow and select **Automated cloud flow**
2. Search for **SharePoint** and choose **"When a file is created (properties only)"**
3. Set **Site Address** to your SharePoint site
4. Set **Library Name** to the document library where approvals will trigger

### Adding the Approval Action

1. Add a new action: **Approvals** > **"Start and wait for an approval"**
2. Set **Approval type**:
   - **Approve/Reject** — the approver picks one option
   - **First to respond** — multiple approvers, first one wins
   - **Everyone must approve** — all approvers must sign off
3. Fill in the approval details:
   - **Assigned to:** dynamic content to pull the document's created-by user's manager, or hardcode a specific approver's email
   - **Title:** `Document Review: @{triggerOutputs()['body/DisplayName']}`
   - **Details:** Include document name, upload date, and a link
   - **Item link:** SharePoint file link

### Branching on the Approval Outcome

1. Add a **Condition** action
2. Set the first field to **Outcome** (from the approval action)
3. Set the operator to **is equal to**
4. Set the value to **"Approve"**

**If Approved (true branch):**
- Update the file's approval status to "Approved"
- Post a success message in Teams

**If Rejected (false branch):**
- Update the file's approval status to "Rejected"
- Post a rejection message in Teams with the approver's comments

### Notifying via Teams

1. Add: **Teams** > **"Post message in a chat or channel"**
2. Set **Posting as:** Bot
3. Format your message:

```
**Document Approval Update**

Document: @{triggerOutputs()['body/DisplayName']}
Status: ✓ Approved
Approver: @{outputs('Start_and_wait_for_an_approval')?['body/approvers/approverEmailAddress']}
Uploaded by: @{triggerOutputs()['body/Author/DisplayName']}

[View Document](@{triggerOutputs()['body/ItemUrl']})
```

## Error Handling and Timeouts

**1. Set an Approval Timeout**

By default, approvals expire after 30 days. Wrap the approval in a "Do until" loop that checks elapsed time to shorten this.

**2. Escalation on Timeout**

If an approval isn't answered after 3 days, escalate to the approver's manager:

```
Add condition: @{addDays(triggerOutputs()['body/Date'], 3)} < utcNow()

If true:
  - Send a reminder email to the original approver
  - Start a new approval with the manager
  - Log the escalation in SharePoint
```

**3. Error Handling in the Flow**

Use a **Configure run after** setting on key actions to catch failures.

## Customizing the form itself

If the default SharePoint forms aren't doing it, [SPFx Form Customizer Extensions: Modern List Forms (2026)](/blog/spfx-form-customizer-extensions-modernize-sharepoint-list-forms-2026) shows how to swap them for a fully custom React UI.

## Multi-Level Approvals

```
Approval Level 1 (Manager) →
  If Approved → Approval Level 2 (Director) →
    If Approved → Update status to "Final Approval"
    If Rejected → Update status to "Rejected at Director"
  If Rejected → Update status to "Rejected at Manager"
```

For three or more levels, use a **"Do until"** loop with a variable tracking the approval chain.

## Tips and Best Practices

### Use Parallel Approvals When Possible

If you need approval from **multiple people who don't have a hierarchy**, use **"First to respond"** or **"Everyone must approve"** in a single approval action instead of sequential approvals.

### Leverage Expressions for Smarter Logic

```
Assigned to: if(contains(triggerOutputs()['body/FilePath'], '/Contracts/'), 'legal@yourorg.com', 'manager@yourorg.com')
```

For more expression patterns, see our [Power Automate Expressions Cheat Sheet](/blog/power-automate-expressions-cheat-sheet-2026).

### Style Your Notifications

For polished notification emails, learn how to [style HTML tables with CSS in Power Automate](/blog/power-automate-html-table-styling-css).

## Scaling Up: Canvas Apps and AI

You can [create a Canvas App connected to SharePoint](/blog/power-apps-canvas-app-sharepoint-complete-guide) that lets users submit documents and track approval status. For AI-powered document classification before approval, see [AI Builder Intelligent Document Processing](/blog/power-automate-ai-builder-intelligent-document-processing).

## FAQ

**Q: Can I add comments when I reject a document?**
A: Yes. Enable the **Include comments** option in the approval action. Access comments via: `@{outputs('Start_and_wait_for_an_approval')?['body/comment']}`.

**Q: What if I need to approve documents from someone without a manager set up in Microsoft Entra ID?**
A: Hardcode the approver's email, or use a Column in your SharePoint library that specifies the approver: `@{triggerOutputs()['body/Approver']}`.

**Q: How do I know if an approval timed out?**
A: Check the flow's run history. Add a Condition that checks `if(Outcome == null)` and logs or escalates timeouts.

**Q: Can I re-send an approval request if the first one is ignored?**
A: Yes. Use a **"Do until"** loop with a delay and counter variable to avoid infinite loops (e.g., max 3 re-sends).

**Q: Should I use First to Respond or Everyone Must Approve?**
A: **First to Respond** is faster and better for most scenarios. **Everyone Must Approve** is stricter and better for high-risk documents like contracts and compliance docs.
