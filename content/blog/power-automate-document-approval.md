---
title: "Building a Document Approval Workflow with Power Automate"
slug: power-automate-document-approval
excerpt: "Automate document approvals in SharePoint — trigger on upload, approve, and notify via Teams."
date: "2026-02-16"
displayDate: "February 16, 2026"
readTime: "6 min read"
category: "Power Platform"
tags:
  - "power-automate"
  - "sharepoint"
  - "approval"
  - "teams"
---

## The Scenario

When a document is uploaded:
1. Send approval request to manager
2. Update document status
3. Notify uploader via Teams

## Steps

1. **Trigger:** "When a file is created (properties only)"
2. **Approval:** "Start and wait for an approval"
3. **Condition:** Check if Outcome = "Approve"
4. **Notify:** Post message in Teams

## Tips

- Always add error handling
- Use "Do until" for multi-level approvals
- Test with the "Test" button
