---
title: "SharePoint Column Formatting: A Practical JSON Guide (2026)"
slug: sharepoint-column-formatting-guide
excerpt: "Master JSON-based column formatting to build status badges, progress bars, and interactive visuals without code. Apply instant, tenant-scoped customizations."
date: "2026-02-14"
displayDate: "February 14, 2026"
readTime: "12 min read"
image: "/images/blog/sharepoint-list-formatting-json-guide.png"
category: "SharePoint"
tags:
  - "sharepoint"
  - "column-formatting"
  - "json"
  - "no-code"
  - "microsoft-lists"
---

## What is Column Formatting?

Column formatting is a no-code way to customize how data appears in SharePoint and Microsoft Lists. Instead of building a full SPFx solution, you write declarative JSON to control the HTML, styling, and conditional logic for a single column. Changes apply instantly—no deployment pipelines, no waiting for builds.

**When to use it:** You want visual enhancements like badges, progress bars, or conditional highlighting, and you need them now. Your formatting rules are scoped to a single column and don't require complex business logic.

**When to use SPFx instead:** You're building reusable components, custom web parts, or need deep interaction with SharePoint's REST API. SPFx is more powerful but requires a development workflow.

Column formatting sits in the sweet spot: fast, visual, instant feedback, and zero infrastructure.

## How to Apply Column Formatting

Follow these steps to add JSON formatting to any column:

1. **Open the column menu.** Click the column header dropdown arrow in your list.
2. **Access format options.** Select **Column settings** → **Format this column**.
3. **Enter advanced mode.** In the panel that opens, click the **Advanced mode** toggle (or link, depending on your UI version).
4. **Paste your JSON.** Copy the JSON code block from below and paste it into the editor.
5. **Verify the preview.** Look at the preview pane to see how your formatting renders.
6. **Save.** Click **Save** to apply formatting to all rows in that column.

The formatting takes effect immediately. Existing rows and future rows will all display the custom format.

## Understanding the JSON Schema

Column formatting JSON follows a predictable structure. Here are the key properties:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/column-formatting.schema.json",
  "elmType": "div",
  "txtContent": "=[@CurrentField]",
  "style": {
    "background-color": "#f0f0f0",
    "padding": "8px",
    "border-radius": "4px"
  },
  "attributes": {
    "class": "ms-font-m"
  }
}
```

**Key properties:**

- **`$schema`**: Tells VS Code and SharePoint's editor to provide IntelliSense and validate your JSON. Always include this at the top.
- **`elmType`**: The HTML element to render. Use `div`, `span`, `img`, `a` (hyperlink), or `button`.
- **`txtContent`**: The text displayed inside the element. Use `=[@CurrentField]` to reference the column's value.
- **`style`**: CSS properties as a JSON object. Use camelCase (`backgroundColor`, not `background-color`).
- **`attributes`**: HTML attributes like `class`, `title`, or `href`.

This basic structure is the foundation for everything else.

## Example: Status Badges

Transform a Choice column into color-coded badges. Here's a complete example:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/column-formatting.schema.json",
  "elmType": "span",
  "txtContent": "=[@CurrentField]",
  "style": {
    "background-color": "=if([@CurrentField]=='Active','#107c10',if([@CurrentField]=='Pending','#ffb900',if([@CurrentField]=='Closed','#737373','#f0f0f0')))",
    "color": "=if([@CurrentField]=='Active','white',if([@CurrentField]=='Pending','#000',if([@CurrentField]=='Closed','white','#333')))",
    "padding": "8px 12px",
    "border-radius": "12px",
    "font-weight": "600",
    "display": "inline-block"
  }
}
```

This renders:
- **Active** → bright green (`#107c10`) on white text
- **Pending** → yellow (`#ffb900`) on dark text
- **Closed** → gray (`#737373`) on white text
- **Anything else** → light gray default

The `if()` function nests conditions, checking each value in order. Update the color codes to match your organization's palette.

## Example: Progress Bar

Display a percentage column as a visual bar. Useful for project completion, task progress, or survey responses:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/column-formatting.schema.json",
  "elmType": "div",
  "style": {
    "width": "100%",
    "background-color": "#efefef",
    "border-radius": "4px",
    "overflow": "hidden"
  },
  "children": [
    {
      "elmType": "div",
      "style": {
        "width": "=[@CurrentField]+'%'",
        "background-color": "=if([@CurrentField]>=75,'#107c10',if([@CurrentField]>=50,'#0078d4',if([@CurrentField]>=25,'#ffb900','#d13438')))",
        "height": "24px",
        "transition": "width 0.3s ease"
      }
    },
    {
      "elmType": "div",
      "txtContent": "=[@CurrentField]+'%'",
      "style": {
        "position": "absolute",
        "padding": "4px 8px",
        "color": "#333",
        "font-weight": "600",
        "font-size": "12px"
      }
    }
  ]
}
```

This creates a bar that fills from left to right, with color transitions: green for 75%+, blue for 50%+, amber for 25%+, and red below 25%.

## Example: Due Date Highlighting

Highlight overdue tasks using the `@now` token, which references the current date:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/column-formatting.schema.json",
  "elmType": "span",
  "txtContent": "=[@CurrentField]",
  "style": {
    "background-color": "=if(Date([@CurrentField])<Date('@now'),'#d13438',if(Date([@CurrentField])<addDays('@now',7),'#ffb900','#f0f0f0'))",
    "color": "=if(Date([@CurrentField])<Date('@now'),'white','#333')",
    "padding": "6px 10px",
    "border-radius": "4px",
    "font-weight": "=if(Date([@CurrentField])<Date('@now'),'700','400')"
  }
}
```

Items with a due date in the past appear in red. Items due within 7 days appear in amber. Everything else is light gray.

## Conditional Formatting with forEach

For row-level formatting that depends on multiple columns, use `forEach` to iterate and conditionally render. This is useful for complex dashboards where the appearance depends on several fields:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/column-formatting.schema.json",
  "elmType": "div",
  "children": [
    {
      "elmType": "span",
      "txtContent": "=if([@Priority]=='High','⚠️ ','') + [@CurrentField]",
      "style": {
        "font-weight": "=if([@Priority]=='High','700','400')",
        "color": "=if([@Priority]=='High','#d13438','inherit')"
      }
    }
  ]
}
```

This example checks the `Priority` column and adds a warning emoji and bold styling if the priority is "High". You can extend this to any number of fields.

## Tips and Gotchas

**IntelliSense with `$schema`**: Always include the `$schema` property. It enables auto-complete and validation in VS Code and helps catch syntax errors before you paste into SharePoint.

**Test in a dev site first**: Column formatting can make data unreadable if the logic is wrong. Create a test column in a dev environment, verify the rendering, then copy the JSON to production.

**The 1000-character display limit**: SharePoint shows the first 1000 characters of your formatted output. If your JSON generates very long HTML, truncation may occur. Keep formatting concise.

**Performance considerations**: Complex nested conditions or large datasets can slow rendering. Test with 1000+ rows before assuming your formatting will be fast. Avoid expensive operations in loops.

**Escaping special characters**: If you reference field names with spaces or special characters, wrap them in single quotes: `[@'Field With Spaces']`.

**Mobile view**: Column formatting works on mobile, but small screens may not display complex layouts well. Test on phones before rolling out.

## Frequently Asked Questions

**Q: Can I format multiple columns with a single JSON?**
No, column formatting applies to one column. But you can apply similar formatting to different columns independently.

**Q: Do I need a dev environment to test formatting?**
Recommended, but not required. If you're confident, create a test column in the same list and format it there first.

**Q: What happens to data when I apply formatting?**
The underlying data doesn't change. Formatting is display-only. The actual field value remains unchanged.

**Q: Can I use column formatting in views?**
Yes. Column formatting applies globally to that column across all views.

**Q: How do I remove formatting?**
Click the column header → Column settings → Format this column → Clear formatting → Save.

## Related Resources

- [Microsoft Lists JSON Formatting Complete Guide (2026)](/blog/microsoft-lists-json-formatting-complete-guide-2026)
- [Power Apps Canvas App & SharePoint: Complete Guide](/blog/power-apps-canvas-app-sharepoint-complete-guide)
   