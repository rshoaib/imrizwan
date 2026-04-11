---
title: "Building a Document Approval Workflow with Power Automate"
slug: power-automate-document-approval
excerpt: "Automate document approvals in SharePoint — trigger on upload, approve, and notify via Teams."
date: "2026-02-16"
displayDate: "February 16, 2026"
readTime: "6 min read"
image: "/images/blog/power-automate-sharepoint-workflows.png"
category: "Power Platform"
tags:
  - "power-automate"
  - "sharepoint"
  - "approval"
  - "teams"
---

## The Scenario

When a document is uploaded to a SharePoint library:
1. Send approval request to manager
2. Update document status
3. Notify uploader via Teams

This is one of the most common Power Automate use cases. If you are new to SharePoint document libraries and permissions, our [SharePoint Online Permissions Complete Guide](/blog/sharepoint-online-permissions-complete-guide) covers the access model your flow will operate within.

## Steps

1. **Trigger:** "When a file is created (properties only)"
2. **Approval:** "Start and wait for an approval"
3. **Condition:** Check if Outcome = "Approve"
4. **Notify:** Post message in Teams

## Tips

- Always add error handling — use expressions like `if()` and `coalesce()` for robust condition checks. Our [Power Automate Expressions Cheat Sheet](/blog/power-automate-expressions-cheat-sheet-2026) is a handy reference.
- Use "Do until" for multi-level approvals
- Test with the "Test" button
- Need to send a polished approval summary email? Learn how to [style HTML tables with CSS in Power Automate](/blog/power-automate-html-table-styling-css) for professional-looking notification emails.

## Going Further

Once your approval workflow is running, consider building a front-end for it. You can [create a Canvas App connected to SharePoint](/blog/power-apps-canvas-app-sharepoint-complete-guide) that lets users submit documents and track approval status from a single interface. For more advanced scenarios involving AI-powered document classification before approval, see our guide on [AI Builder Intelligent Document Processing](/blog/power-automate-ai-builder-intelligent-document-processing).
