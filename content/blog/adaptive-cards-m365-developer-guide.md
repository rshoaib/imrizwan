---
title: "Adaptive Cards for Microsoft 365: Complete Developer Guide (2026)"
slug: adaptive-cards-m365-developer-guide
excerpt: "Master Adaptive Cards across Teams, Outlook, and Viva Connections. Covers schema versions, data binding, platform differences, and a free AI-powered card builder."
date: "2026-03-21T09:22:47.227Z"
displayDate: "March 21, 2026"
readTime: "10 min read"
category: "Microsoft 365"
image: "/images/blog/adaptive-cards-guide.png"
tags:
  - "Adaptive Cards"
  - "Teams"
  - "Outlook"
  - "SPFx"
  - "Viva Connections"
  - "Power Automate"
---

## Why Adaptive Cards Matter for M365 Developers

If you build anything in the Microsoft 365 ecosystem — Teams bots, Power Automate notifications, Outlook Actionable Messages, or Viva Connections dashboards — you will encounter **Adaptive Cards**. They are the universal UI building block for interactive experiences across every M365 surface.

The core idea is elegant: you write a **single JSON schema**, and each host application (Teams, Outlook, SharePoint) renders it natively in its own visual style. No custom HTML. No platform-specific code. One card, everywhere.

But the documentation is scattered across three different Microsoft Learn sites, and the relationship between Adaptive Cards, ACEs, and Actionable Messages is genuinely confusing. This guide consolidates everything into one practical reference.

---

## The Adaptive Card Architecture

An Adaptive Card is a **declarative JSON object** that describes a piece of UI. The JSON follows a versioned schema (currently v1.5/v1.6) maintained by Microsoft.

### How It Works

```
Developer → writes JSON schema → Host App renders natively
```

The rendering pipeline:
1. You author a card in JSON (or use a visual builder like our [Adaptive Card AI Generator](/tools/adaptive-card-generator))
2. You deliver the card to a host (Teams message, Outlook email, Viva dashboard)
3. The host's **Adaptive Card Renderer** parses the JSON and displays native UI elements
4. User interactions (button clicks, form submissions) are sent back to your app/flow

### Schema Structure

Every Adaptive Card starts with this skeleton:

```json
{
  "type": "AdaptiveCard",
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "version": "1.5",
  "body": [
    {
      "type": "TextBlock",
      "text": "Hello, Adaptive Cards!",
      "size": "Large",
      "weight": "Bolder"
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "Approve"
    }
  ]
}
```

The `body` array holds **layout elements** (TextBlock, Image, ColumnSet, Container), and the `actions` array holds **interactive buttons** (Submit, OpenUrl, ShowCard, Execute).

---

## Platform-Specific Usage: Where Cards Live

### 1. Microsoft Teams

Teams is the most common Adaptive Card host. Cards appear in:
- **Bot messages** — rich interactive replies from Teams bots
- **Message extensions** — search results and action responses
- **Task modules / Dialogs** — modal forms triggered from messages
- **Meeting apps** — in-meeting interactive panels
- **Workflow notifications** — Power Automate "Post adaptive card" action

**Key Teams-specific features:**
- `Action.Execute` (Universal Actions) replaces `Action.Submit` for cross-platform bots
- `msteams` property for Teams-specific behaviors (e.g., `"width": "Full"`)
- Refresh cards with `"refresh"` property for real-time updates

**Power Automate Integration:**

The most common developer workflow is sending Adaptive Cards from Power Automate:

```
Trigger → Build JSON → "Post adaptive card and wait" → Process response
```

This action sends an interactive card to a Teams channel or chat, **waits for the user to respond**, and returns the submitted data to the flow. Use it for approvals, surveys, and task assignments.

### 2. Outlook Actionable Messages

Outlook renders Adaptive Cards as **Actionable Messages** — interactive emails that let recipients take action without leaving their inbox.

**Common use cases:**
- Expense approvals
- Survey responses
- CRM opportunity updates
- IT helpdesk ticket actions

**Critical differences from Teams:**
- `Action.Submit` is **not supported** — use `Action.Http` to call external APIs
- Cards must include an `originator` ID (registered with Microsoft)
- Recipients must have an Exchange Online mailbox
- Maximum JSON payload: **50KB** (vs. 28KB in Teams)

**Registration requirement:** Before Actionable Messages work in production, you must register your provider at the [Actionable Email Developer Dashboard](https://outlook.office.com/connectors/oam/publish).

### 3. Viva Connections (SPFx ACEs)

Adaptive Card Extensions (ACEs) are **SPFx component types** that render in the Viva Connections dashboard. They use the Adaptive Card schema under the hood but are built using the SharePoint Framework.

**ACE Architecture:**
- **Card View** — the compact card shown on the dashboard (limited elements)
- **Quick View** — a detailed modal that opens when the user clicks the card

```typescript
// In your ACE class
public get cardSize(): 'Medium' | 'Large' {
  return 'Medium';
}

protected getCardView(): ISPFxAdaptiveCardView {
  return CardView; // Your template JSON
}
```

ACEs are perfect for:
- Company announcements
- KPI dashboards
- Quick-entry forms (expense reports, time tracking)
- Deep links to Teams apps or SharePoint pages

For a full walkthrough, see our article on [building your first Viva Connections ACE](/blog/viva-connections-ace-adaptive-card-extension).

---

## Essential Card Elements Reference

### Layout Elements

| Element | Purpose | v1.5 | v1.6 |
|---------|---------|------|------|
| `TextBlock` | Display text with formatting | ✅ | ✅ |
| `Image` | Display images | ✅ | ✅ |
| `ColumnSet` / `Column` | Multi-column layouts | ✅ | ✅ |
| `Container` | Group elements with shared styling | ✅ | ✅ |
| `FactSet` | Key-value pair display | ✅ | ✅ |
| `ImageSet` | Gallery of images | ✅ | ✅ |
| `ActionSet` | Inline action buttons | ✅ | ✅ |
| `Table` | Structured data table | ❌ | ✅ |
| `Carousel` | Swipeable card container | ❌ | ✅ |

### Input Elements

| Element | Purpose | Best For |
|---------|---------|----------|
| `Input.Text` | Free-text input (single or multi-line) | Comments, descriptions |
| `Input.Number` | Numeric input with min/max | Quantities, amounts |
| `Input.Date` | Date picker | Deadlines, schedules |
| `Input.Time` | Time picker | Meeting times |
| `Input.Toggle` | Boolean toggle (yes/no) | Opt-in, agreements |
| `Input.ChoiceSet` | Dropdown or radio buttons | Categories, selections |

### Action Types

| Action | Behavior | Supported In |
|--------|----------|-------------|
| `Action.OpenUrl` | Opens a URL in the browser | All hosts |
| `Action.Submit` | Sends form data to the bot/flow | Teams, Viva |
| `Action.ShowCard` | Reveals a nested card inline | All hosts |
| `Action.Execute` | Universal Action (cross-platform) | Teams, Outlook (preview) |
| `Action.Http` | Calls an HTTP endpoint | Outlook only |
| `Action.ToggleVisibility` | Show/hide elements | All hosts |

---

## Practical Example: Building an Approval Card

Here is a production-ready approval card that works in Teams and Viva:

```json
{
  "type": "AdaptiveCard",
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "version": "1.5",
  "body": [
    {
      "type": "TextBlock",
      "text": "Expense Approval Request",
      "size": "Large",
      "weight": "Bolder",
      "color": "Accent"
    },
    {
      "type": "FactSet",
      "facts": [
        { "title": "Submitted By:", "value": "Sarah Johnson" },
        { "title": "Amount:", "value": "$1,240.00" },
        { "title": "Category:", "value": "Travel & Conferences" },
        { "title": "Date:", "value": "March 15, 2026" }
      ]
    },
    {
      "type": "TextBlock",
      "text": "Description",
      "weight": "Bolder",
      "spacing": "Medium"
    },
    {
      "type": "TextBlock",
      "text": "Flight and hotel for Microsoft 365 Community Conference in Las Vegas.",
      "wrap": true
    },
    {
      "type": "Input.Text",
      "id": "approverComments",
      "placeholder": "Add comments (optional)...",
      "isMultiline": true
    }
  ],
  "actions": [
    {
      "type": "Action.Submit",
      "title": "✅ Approve",
      "style": "positive",
      "data": { "action": "approve" }
    },
    {
      "type": "Action.Submit",
      "title": "❌ Reject",
      "style": "destructive",
      "data": { "action": "reject" }
    }
  ]
}
```

This card renders a clean approval form with a fact table, comment box, and approve/reject buttons. In Power Automate, the submitted data includes the `action` value and the `approverComments` text.

**Pro Tip:** Use our free [Adaptive Card AI Generator](/tools/adaptive-card-generator) to build cards like this visually — describe what you need in plain English and get the JSON instantly.

---

## Data Binding and Templating

Adaptive Card Templating lets you **separate your layout (template) from your data**. This is essential for dynamic cards that display SharePoint list data or API responses.

### The Template

```json
{
  "type": "AdaptiveCard",
  "version": "1.5",
  "body": [
    {
      "type": "TextBlock",
      "text": "Order #${orderNumber}",
      "size": "Large"
    },
    {
      "type": "FactSet",
      "facts": [
        { "title": "Customer:", "value": "${customerName}" },
        { "title": "Total:", "value": "${orderTotal}" },
        { "title": "Status:", "value": "${status}" }
      ]
    }
  ]
}
```

### The Data

```json
{
  "orderNumber": "ORD-2026-0042",
  "customerName": "Contoso Ltd.",
  "orderTotal": "$3,500.00",
  "status": "Pending Approval"
}
```

The SDK merges them at runtime using `${property}` syntax. The template stays static; only the data changes per card instance.

### Using the Templating SDK

```javascript
import * as ACData from "adaptivecards-templating";

const template = new ACData.Template(cardTemplate);
const card = template.expand({ $root: orderData });

// Send 'card' to Teams via Bot Framework or Graph API
```

This pattern is incredibly powerful for SharePoint-driven scenarios. Fetch list items via the [REST API](/tools/rest-api-builder), then render each item as a templated Adaptive Card in Teams.

---

## Version Compatibility Matrix

Not every host supports every schema version. Here is the current compatibility:

| Host Application | Max Schema | Notes |
|-----------------|------------|-------|
| Teams (Desktop/Web) | v1.5 | Full support, use `Action.Execute` for Universal Actions |
| Teams (Mobile) | v1.5 | Limited: no `Action.ShowCard` nesting |
| Outlook (Web) | v1.5 | Requires Actionable Message registration |
| Outlook (Desktop) | v1.4 | More limited than web; test thoroughly |
| Viva Connections | v1.5 | Rendered via SPFx ACE; Card View is restricted |
| Power Automate | v1.4 | "Post adaptive card" uses v1.4 renderer |
| Windows Notifications | v1.6 | Newest; supports Table and Carousel |

**Rule of thumb:** Target **v1.5** for maximum cross-platform compatibility. Only use v1.6 features (Table, Carousel, badges, icons) if you know your audience is exclusively on Windows/Teams Desktop.

---

## Performance Best Practices

### Card Payload Size
- **Teams limit:** 28KB JSON payload
- **Outlook limit:** 50KB JSON payload
- Keep images as URLs (not base64) to avoid inflating the payload

### Rendering Speed
- Target under **200ms render time**
- Avoid deeply nested containers (>5 levels)
- Use `ColumnSet` instead of nested `Container` elements for layouts
- Minimize the number of `Image` elements (each triggers an HTTP request)

### Accessibility
- Always set `"wrap": true` on TextBlocks to prevent horizontal scrolling
- Use `"altText"` on all Image elements
- Ensure sufficient color contrast (avoid light text on light backgrounds)
- Use `"label"` on Input elements for screen reader compatibility

---

## Common Mistakes and Fixes

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Using `Action.Submit` in Outlook | Card renders but buttons do nothing | Switch to `Action.Http` with a registered originator |
| Missing `"version"` property | Card fails to render entirely | Always include `"version": "1.5"` |
| Using v1.6 features in Power Automate | Elements missing or layout broken | Downgrade to v1.4 elements |
| Base64 images in payload | Card rejected (too large) | Use hosted image URLs instead |
| Missing `"wrap": true` | Text truncated on mobile | Add `"wrap": true` to all TextBlocks |
| Nested `Action.ShowCard` in Teams Mobile | Inner card not displayed | Flatten the card structure or use `Action.ToggleVisibility` |

For instant diagnostics on any M365 error, try our [Error Decoder tool](/tools/error-decoder).

---

## Tools That Accelerate Adaptive Card Development

Building Adaptive Cards from scratch means writing raw JSON — which is tedious and error-prone. Here are the tools that speed up the process:

| Tool | What It Does | Link |
|------|-------------|------|
| **Adaptive Card AI Generator** | Describe a card in plain English, get the JSON instantly | [Try it free →](/tools/adaptive-card-generator) |
| **Adaptive Cards Designer** | Microsoft's official drag-and-drop builder | [adaptivecards.io/designer](https://adaptivecards.io/designer) |
| **Bot Framework Emulator** | Test Teams bot cards locally | [GitHub](https://github.com/microsoft/BotFramework-Emulator) |

Our [Adaptive Card AI Generator](/tools/adaptive-card-generator) is purpose-built for M365 developers — it generates SPFx-ready JSON with Viva Connections Card View and Quick View templates, optimized for Teams and Outlook delivery.

---

## FAQ

### What is an Adaptive Card in Microsoft 365?
An Adaptive Card is a platform-agnostic, JSON-based UI snippet that renders natively across Teams, Outlook, Viva Connections, and Windows. Developers write the schema once and each host application styles it automatically.

### Can I use Adaptive Cards without writing code?
Yes. Power Automate has built-in actions ("Post adaptive card and wait for a response") that send interactive cards to Teams channels and chats without any code. You only need to provide the card JSON.

### What is the difference between Adaptive Cards and Adaptive Card Extensions (ACEs)?
Adaptive Cards are the raw JSON schemas rendered by host applications. ACEs (Adaptive Card Extensions) are SPFx components built for Viva Connections dashboards — they use the Adaptive Card schema internally but are wrapped in the SharePoint Framework for deployment and lifecycle management.

### Which Adaptive Card schema version should I use?
Use version 1.5 for maximum cross-platform compatibility across Teams, Outlook, and Viva. Only use v1.6 if you specifically need Table or Carousel elements and your audience is on supported clients.

### How do I test Adaptive Cards before deploying?
Use the Adaptive Cards Designer at adaptivecards.io/designer to preview your card in different host contexts. For Teams bots, use the Bot Framework Emulator. For quick iteration, try our free [Adaptive Card AI Generator](/tools/adaptive-card-generator).

---

## What to Build Next

Now that you understand the Adaptive Card ecosystem, here are the highest-impact projects to start with:

1. **Approval workflows in Power Automate** — Replace plain-text notification emails with interactive approval cards in Teams
2. **Viva Connections dashboard cards** — Build ACEs that surface KPIs, announcements, or quick-entry forms
3. **Actionable Messages in Outlook** — Embed approval or survey actions directly in notification emails

Start with our [Adaptive Card AI Generator](/tools/adaptive-card-generator) to prototype your first card in seconds — describe what you need, get the JSON, and deploy it to Teams or Viva today.
