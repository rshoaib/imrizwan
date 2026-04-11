---
title: "SharePoint Column Formatting: No-Code Visual Customization"
slug: sharepoint-column-formatting-guide
excerpt: "Transform plain columns into status badges and progress bars using JSON — no SPFx required."
date: "2026-02-14"
displayDate: "February 14, 2026"
readTime: "7 min read"
image: "/images/blog/sharepoint-list-formatting-json-guide.png"
category: "SharePoint"
tags:
  - "sharepoint"
  - "column-formatting"
  - "json"
  - "no-code"
---

## What is Column Formatting?

Customize how SharePoint columns look using JSON. No deployment needed.

## How to Apply

1. Click column header → Column settings → Format this column
2. Switch to "Advanced mode"
3. Paste your JSON
4. Save

## Example: Status Badge

Turn text into colored badges with border-radius and conditional background colors.

## Example: Progress Bar

Show percentage as a visual bar using nested divs with dynamic width.

## Tips

- Use the `$schema` property for IntelliSense
- Test in a dev site first
- Formatting is tenant-scoped
