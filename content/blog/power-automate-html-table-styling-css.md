---
title: "Power Automate: How to Style HTML Tables with CSS"
slug: power-automate-html-table-styling-css
excerpt: "Style Power Automate HTML tables with custom CSS for professional-looking emails. Free generator included to create polished email tables without writing code."
date: "2026-03-13"
displayDate: "March 13, 2026"
readTime: "5 min read"
category: "Power Platform"
image: "/images/blog/power-automate-html-table-styling-css.png"
tags:
  - "power-automate"
  - "css"
  - "html-table"
  - "workflow"
  - "styling"
---

## Stop Sending Ugly Emails

By default, the Power Automate **"Create HTML table"** action generates a functional but incredibly ugly table. If you're sending automated daily reports, approval requests, or SharePoint list summaries to executives, an unstyled, borderless table looks unprofessional.

Fortunately, you can inject custom CSS directly into your flow before sending the email. 

This guide will show you the exact architecture needed to style your tables, and introduce a free tool to generate the CSS instantly without writing code.

---

## 1. The Power Automate Architecture

To style an HTML table in Power Automate, you need three actions in this specific order:

1. **Create HTML table**: This action takes your array of data (e.g., from "Get items" in SharePoint) and converts it to raw HTML.
2. **Compose (for CSS)**: This is where you store your `<style>` tags containing your CSS rules.
3. **Send an email (V2)**: Here, you combine the CSS and the table output.

### Formatting Your Data First
Before creating your table, ensure your data is clean. You don't want raw timestamps or null values polluting your report. Use a **Select** action to map your SharePoint columns to clean headers, and use [Power Automate Expressions](/blog/power-automate-expressions-cheat-sheet-2026) like `formatDateTime()` or `coalesce()` to clean up the data.

---

## 2. Writing the CSS (The Compose Action)

Once your table is created, add a **Compose** action. Rename it to "Compose - CSS". 

In the inputs, you need to write standard CSS wrapped in `<style>` tags. Because Power Automate tables use standard HTML elements (`<table>`, `<th>`, `<tr>`, `<td>`), you target those tags directly.

### Basic Professional Table Styling

An example of a simple CSS block:

```html
<style>
  table {
    border-collapse: collapse;
    width: 100%;
    font-family: Calibri, Arial, sans-serif;
    max-width: 600px;
  }
  th {
    background-color: #4f46e5;
    color: white;
    padding: 12px;
    text-align: left;
    font-weight: bold;
    border: 1px solid #3730a3;
  }
  td {
    border-bottom: 1px solid #e2e8f0;
    padding: 10px;
    border-left: 1px solid #e2e8f0;
  }
  tr:nth-child(even) {
    background-color: #f8fafc;
  }
</style>
```

### Responsive & Email-Safe CSS Patterns

Email clients (especially Outlook) have limited CSS support. Here's a responsive pattern that works reliably across all email clients:

```html
<style>
  table {
    border-collapse: collapse;
    width: 100%;
    font-family: Calibri, Segoe UI, sans-serif;
    font-size: 14px;
    line-height: 1.5;
  }
  th {
    background-color: #1f2937;
    color: #ffffff;
    padding: 12px;
    text-align: left;
    border: 1px solid #111827;
    font-weight: bold;
  }
  td {
    padding: 10px 12px;
    border: 1px solid #d1d5db;
  }
  tr:nth-child(odd) td {
    background-color: #ffffff;
  }
  tr:nth-child(even) td {
    background-color: #f3f4f6;
  }
  /* Outlook compatibility */
  mso-table-lspace: 0pt;
  mso-table-rspace: 0pt;
</style>
```

### Conditional Row Coloring by Status

To highlight specific rows based on their content (e.g., red for "Failed", green for "Approved"), you need to use Power Automate expressions to inject inline styles:

```html
<style>
  .status-failed td { background-color: #fee2e2; }
  .status-approved td { background-color: #dcfce7; }
  .status-pending td { background-color: #fef3c7; }
</style>
```

Then in your "Apply to each" loop that generates the table rows, conditionally assign the class:

```
<tr class="@{if(equals(item()['Status'], 'Failed'), 'status-failed', 'status-approved')}">
```

---

## 3. The Secret Weapon: The HTML Table Styler

Manually tweaking hex codes, padding sizes, and border widths inside a tiny Power Automate Compose box is frustrating. You can't see what the table looks like until you run the flow and check your email.

Instead of guessing, use our free **[Power Automate HTML Table Styler](/tools/html-table-styler)**.

This visual tool allows you to:
- Pick premium color themes (Corporate Blue, Midnight Dark, Emerald, etc.)
- Adjust padding and font sizes instantly
- Toggle borders and striped rows
- See a **live preview** of exactly how your table will look in Outlook

Once you're happy with the design, simply click **Copy CSS** and paste it directly into your "Compose - CSS" action.

---

## 4. Combine and Send

The final step is to merge your CSS and your Table in the email body.

1. Add a **Send an email (V2)** action.
2. Click the `</>` icon to switch to **HTML View** (this is critical!).
3. In the body, place your dynamic content in this exact order:
   - First: The **Outputs** from your "Compose - CSS" action.
   - Second: Any introductory text (e.g., "Here is the daily report:").
   - Third: The **Output** from your "Create HTML table" action.

When the email arrives, Outlook (or Gmail/Teams) will read the hidden `<style>` block and apply your beautiful styling to the table!

> **Want to do more with SharePoint data?** Read our guide on [Power Automate + SharePoint: 7 Document Workflows That Save Hours](/blog/power-automate-document-approval) to see how sending styled reports fits into larger enterprise solutions.

---

## FAQs

### Does this work in Outlook and Microsoft Teams?
Yes! Both Outlook desktop/web and Microsoft Teams support inline `<style>` tags appended before HTML tables. The CSS generated by our tool is highly compatible with modern email clients.

### Why are my table borders not showing?
Ensure that your CSS targets the `table`, `th`, and `td` elements specifically, and double-check that you switched your Email action to **HTML View (`</>`)** before inserting the dynamic content.

### Can I conditionally format rows (e.g., turn a row red if "Status" is "Failed")?
The base "Create HTML table" action does not support row-level conditional formatting natively. To achieve this, you must write a custom HTML loop using an "Apply to each" action and [Power Automate expressions](/blog/power-automate-expressions-cheat-sheet-2026) to inject `style="color:red"` on specific `<tr>` tags based on conditions. We showed an example above using CSS classes.

### What if Outlook doesn't render my colors or borders?
Outlook has notoriously limited CSS support. Stick to these Outlook-safe properties: `background-color`, `color`, `padding`, `border` (single pixel values only), `text-align`, `font-weight`, and `font-size`. Avoid: `border-radius`, `box-shadow`, `gradient`, `transform`, and `flexbox`. Test in both Outlook desktop and web versions.

### Can I create multi-row headers or merged cells?
Merged cells in HTML tables (`colspan`, `rowspan`) work in web browsers, but Outlook often breaks them. For robust email design, avoid merged cells entirely and instead use creative CSS or separate rows to achieve a similar visual effect.

### How do I embed images or links in styled tables?
You can embed `<img>` tags and `<a>` tags inside your table cells. However, in Outlook, images must be absolute URLs (not data URLs), and you need to set explicit width/height. Example:

```html
<td>
  <img src="https://yourcdn.blob.core.windows.net/images/logo.png" 
       width="100" height="40" alt="Logo" 
       style="display:block;" />
</td>
<td>
  <a href="https://yoursite.sharepoint.com" style="color:#0563c1;text-decoration:none;">View Report</a>
</td>
```

