---
title: "Power Automate: Approval Workflow (2026)"
slug: power-automate-document-approval
excerpt: "Build a complete document approval workflow triggered on SharePoint uploads, with approval actions, conditional branching, and Teams notifications."
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

Before you start, make sure you have:

- **A SharePoint Online site** with a document library (or permission to create one)
- **Power Automate license** — cloud flows work with a free license, but approval actions work best with a paid subscription (or trial)
- **Microsoft Teams** installed and configured for your org
- **Appropriate permissions** — ability to create flows in your tenant, and edit the SharePoint library where approvals will trigger
- Basic familiarity with [SharePoint document library structure](/blog/sharepoint-online-permissions-complete-guide)

## Building Your Approval Flow

### Setting Up the Trigger

The foundation of your approval workflow is the trigger. You'll use "When a file is created (properties only)" rather than "When a file is created or modified"—this prevents accidental re-triggers when Power Automate updates file properties during the flow run.

**To configure the trigger:**

1. Create a new cloud flow and select **Automated cloud flow**
2. Search for **SharePoint** and choose **"When a file is created (properties only)"**
3. Set **Site Address** to your SharePoint site
4. Set **Library Name** to the document library where approvals will trigger
5. (Optional) Add a **filter** to limit approvals to specific file types:
   - Filter: `substringof('.docx', Name)` (Word docs only)
   - Or use the UI filter for file extensions

The "properties only" trigger means Power Automate reads the file's metadata (name, size, created by) but doesn't read the file content—this keeps your flow lightweight and fast.

### Adding the Approval Action

Once a document is uploaded, you need to send it to an approver. Power Automate's **"Start and wait for an approval"** action handles this.

**Configure the approval action like this:**

1. Add a new action: **Approvals** > **"Start and wait for an approval"**
2. Set **Approval type**:
   - **Approve/Reject** — the approver picks one option
   - **First to respond** — multiple approvers, first one wins
   - **Everyone must approve** — all approvers must sign off (slowest, most rigorous)
3. Fill in the approval details:
   - **Assigned to:** Use dynamic content to pull the document's created-by user's manager, or hardcode a specific approver's email
   - **Title:** Something like "Document Review: @{triggerOutputs()['body/DisplayName']}}"
   - **Details:** Include the document name, upload date, and a link to the document in SharePoint
   - **Item link:** Use the SharePoint file link so the approver can jump to the document

Here's a practical **Details** field format:

```
Document Name: @{triggerOutputs()['body/DisplayName']}
Uploaded by: @{triggerOutputs()['body/Author/DisplayName']}
Upload Date: @{utcNow()}
Link: @{triggerOutputs()['body/ItemUrl']}
```

### Branching on the Approval Outcome

After the approver responds, your flow needs to decide what happens next. Use a **Condition** action to check the outcome.

1. Add a **Condition** action
2. Set the first field to **Outcome** (from the approval action)
3. Set the operator to **is equal to**
4. Set the value to **"Approve"** (or **"Reject"** for the false branch)

Now you have two paths:

**If Approved (true branch):**
- Update the file's approval status property to "Approved"
- Post a success message in Teams
- (Optional) Send the document onward to the next stage

**If Rejected (false branch):**
- Update the file's approval status property to "Rejected"
- Post a rejection message in Teams with space for the approver's comments
- (Optional) Move the file to a "Rejected" folder

### Notifying via Teams

Send a notification to both the approver and the document uploader so everyone stays informed.

**Use the "Post message in a chat or channel" action:**

1. Add a new action: **Teams** > **"Post message in a chat or channel"**
2. Set **Posting as:** Bot
3. Set **Post in:** Channel (or Chat if you're notifying a specific person)
4. Set **Channel:** Select your team and channel (e.g., #approvals or #document-tracking)
5. Format your message with the **Message** field:

```
**Document Approval Update**

Document: @{triggerOutputs()['body/DisplayName']}
Status: @{body('Condition')?['Approve']} ✓ Approved
Approver: @{outputs('Start_and_wait_for_an_approval')?['body/approvers/approverEmailAddress']}
Uploaded by: @{triggerOutputs()['body/Author/DisplayName']}

[View Document](@{triggerOutputs()['body/ItemUrl']})
```

For rejections, tweak the message to include a comments field if your approval action captures them.

## Error Handling and Timeouts

Approval workflows can stall if approvers don't respond. Add robustness with these patterns:

**1. Set an Approval Timeout**

By default, approvals expire after 30 days. To shorten this:

- In the approval action, look for the **timeout** setting (if available in your version)
- Alternatively, wrap the approval in a "Do until" loop that manually checks elapsed time

**2. Escalation on Timeout**

If an approval isn't answered after, say, 3 days, escalate to the approver's manager:

```
Add condition: @{addDays(triggerOutputs()['body/Date'], 3)} < utcNow()

If true:
  - Send a reminder email to the original approver
  - Start a new approval with the manager
  - Log the escalation in SharePoint
```

**3. Error Handling in the Flow**

Use a **Configure run after** setting on key actions to catch failures:

- If **Start and wait for an approval** fails, run error logging
- If **Post message in a chat or channel** fails, send a fallback email notification
- Always include a final "If flow fails" action to notify the flow owner

## Multi-Level Approvals

Sometimes you need sequential approvals—manager approves first, then director. Here's the pattern:

1. **Create your first approval** (manager)
2. **Add a Condition** — if Approved:
   - Start a second approval (director)
   - Add another Condition for the second approval outcome
3. **Keep nesting** until you've covered all approval levels

For three or more levels, consider using a **"Do until"** loop with a variable tracking the approval chain. This keeps your flow cleaner and easier to modify.

Example structure:

```
Approval Level 1 (Manager) →
  If Approved → Approval Level 2 (Director) →
    If Approved → Update status to "Final Approval"
    If Rejected → Update status to "Rejected at Director"
  If Rejected → Update status to "Rejected at Manager"
```

## Tips and Best Practices

### Use Parallel Approvals When Possible

If you need approval from **multiple people who don't have a hierarchy** (e.g., both Finance and Legal must sign off), use **"First to respond"** or **"Everyone must approve"** in a single approval action instead of sequential approvals. This is faster and clearer.

### Leverage Expressions for Smarter Logic

Combine approvals with dynamic expressions to route documents intelligently:

```
Assigned to: if(contains(triggerOutputs()['body/FilePath'], '/Contracts/'), 'legal@yourorg.com', 'manager@yourorg.com')
```

This routes contracts to Legal automatically. For more expression patterns, see our [Power Automate Expressions Cheat Sheet](/blog/power-automate-expressions-cheat-sheet-2026).

### Test Your Flow Thoroughly

- Use the **Test** button in Power Automate to manually trigger the flow
- Upload test documents and watch the approval request appear
- Approve and reject to test both branches
- Check Teams notifications arrive correctly
- Verify SharePoint file properties update as expected

### Style Your Notifications

Make Teams messages professional and scannable:

- Use **bold** for labels: `**Document:** Name`
- Use bullet points for details
- Include action links so approvers can jump to the document
- Use emoji sparingly (✓ for approved, ✗ for rejected is fine)

For even more polish, learn how to [style HTML tables with CSS in Power Automate](/blog/power-automate-html-table-styling-css) for professional-looking notification emails.

### Document Your Flow

Add notes in Power Automate's action descriptions (the three-dot menu > **Rename**) to explain why each action exists. Future you—or your colleague—will thank you.

## Scaling Up: Canvas Apps and AI

Once your approval workflow is running, consider building a front-end for it. You can [create a Canvas App connected to SharePoint](/blog/power-apps-canvas-app-sharepoint-complete-guide) that lets users submit documents and track approval status from a single interface. For more advanced scenarios involving AI-powered document classification before approval, see our guide on [AI Builder Intelligent Document Processing](/blog/power-automate-ai-builder-intelligent-document-processing).

## FAQ

**Q: Can I add comments when I reject a document?**
A: Yes. In the approval action, enable the **Include comments** option. When an approver rejects, they can add a note, which you can then include in your rejection notification: `@{outputs('Start_and_wait_for_an_approval')?['body/comment']}`.

**Q: What if I need to approve documents from someone without a manager set up in Microsoft Entra ID?**
A: Hardcode the approver's email in the "Assigned to" field instead of using the manager lookup. Alternatively, use a Column in your SharePoint library that specifies the approver, then pull that value into the flow: `@{triggerOutputs()['body/Approver']}`.

**Q: How do I know if an approval timed out?**
A: Check the flow's run history. Look for actions that didn't complete or returned a null Outcome. Consider adding a Condition that checks `if(Outcome == null)` and logs or escalates timeouts. You can also set a maximum run duration in the flow settings.

**Q: Can I re-send an approval request if the first one is ignored?**
A: Yes. Use a **"Do until"** loop with a delay. Inside the loop, check if an approval has been answered. If not, wait 24 hours and re-send. Use a counter variable to avoid infinite loops (e.g., max 3 re-sends).

**Q: Should I use First to Respond or Everyone Must Approve?**
A: **First to Respond** is faster and better for most scenarios (faster path to approval). **Everyone Must Approve** is stricter and better for high-risk documents (contracts, compliance docs). If you need a mix, nest two separate approvals: the first is "First to Respond," and conditional on approval, the second is "Everyone Must Approve" for the next level.
