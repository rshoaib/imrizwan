---
title: "Getting Started with Microsoft Graph API"
slug: microsoft-graph-api-getting-started
excerpt: "Microsoft Graph is the unified API for M365 data. Learn authentication and first API calls."
date: "2026-02-12"
displayDate: "February 12, 2026"
readTime: "9 min read"
category: "Microsoft 365"
tags:
  - "microsoft-graph"
  - "api"
  - "oauth"
  - "microsoft-365"
---

## What is Microsoft Graph?

One REST endpoint (graph.microsoft.com) for Users, Mail, SharePoint, Teams, OneDrive, Planner.

## Authentication

1. Register app in Azure AD
2. Add API permissions (User.Read)
3. Use MSAL.js to get tokens

## First API Call

```
GET https://graph.microsoft.com/v1.0/me
Authorization: Bearer {token}
```

## Common Endpoints

- `/me/messages` — Emails
- `/sites/{id}/lists` — SharePoint lists
- `/teams/{id}/channels` — Teams channels

Use [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) to test.

### Need a Quick No-Auth Sandbox?
Before writing a single line of code, you can easily test endpoints and view exact permission scopes using the **[Microsoft Graph API Explorer Lite](/tools/graph-api-explorer)** tool. It’s perfect for exploring the JSON structures without needing an active Entra ID tenant token.
