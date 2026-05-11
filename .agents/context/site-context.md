# imrizwan.com — Site Context

> **URL**: https://imrizwan.com
> **Stack**: Next.js + Markdown content
> **Niche**: Developer blog — Microsoft 365, SharePoint, Power Platform, Teams, Adaptive Cards
> **Audience**: Enterprise M365 developers, IT pros adopting Power Platform, consultants

## 🎤 Brand Voice

- **Tone**: Technical, code-heavy, helpful. Like an experienced M365 dev sharing what actually works in production.
- **Style**: Concrete examples with code blocks. Show schema/JSON for Adaptive Cards, SPFx, Power Automate. Skim-friendly headings.
- **Address**: Second person ("you"). Audience is technical.
- **Values**: Pragmatic. Show real Microsoft docs links. Call out gotchas.

## 🎯 Topic Pillars

| Pillar | Category | Topics |
|---|---|---|
| Adaptive Cards | `Microsoft 365` | schema versions, Teams/Outlook/Viva, data binding |
| Power Platform | `Power Platform` | Power Automate flows, Power Apps, Dataverse |
| SharePoint | `SharePoint` | SPFx, lists, modern pages, governance |
| Teams Development | `Teams` | Tabs, messaging extensions, bots |
| Microsoft Graph | `Microsoft 365` | APIs, auth (MSAL), Graph Explorer patterns |
| M365 Governance | `Microsoft 365` | Purview, retention, sensitivity labels |

## 📝 Frontmatter Convention (matches existing posts)

```yaml
---
title: "..."
slug: kebab-case-no-quotes
excerpt: "..."
date: "ISO 8601"
displayDate: "Month DD, YYYY"
readTime: "N min read"
category: "..."
image: "/images/blog/<slug>.png"
tags:
  - "..."
---
```

Body is Markdown with code fences (`json, `tsx, `powershell, etc.).

## 🔗 Internal Link Patterns

Cross-link related M365 posts. Anchor text should match the destination's primary keyword (e.g., "Adaptive Cards schema versions" not "click here"). Use `/blog/<slug>` paths.
