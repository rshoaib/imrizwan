---
title: "Getting Started with Microsoft Graph API in 2026"
slug: microsoft-graph-api-getting-started
excerpt: "Microsoft Graph API getting started for 2026 — Entra ID app registration, your first call, common endpoints, and Power Automate integration."
date: "2026-02-12"
displayDate: "February 12, 2026"
readTime: "9 min read"
image: "/images/blog/microsoft-graph-api-examples.png"
category: "Microsoft 365"
tags:
  - "microsoft-graph"
  - "api"
  - "oauth"
  - "microsoft-365"
  - "entra-id"
  - "authentication"
---

## What is Microsoft Graph?

Microsoft Graph is a unified REST API that gives you a single gateway to all your Microsoft 365 data and services. Instead of juggling separate APIs for Exchange (email), SharePoint, Teams, OneDrive, and a dozen other services, you work with one endpoint: `graph.microsoft.com`.

Think of it as a translator between your application and Microsoft's entire ecosystem. Whether you need to read a user's email, create a Teams channel, list files in SharePoint, or update a Planner task, you're hitting the same API with consistent patterns and authentication.

Graph runs on top of Microsoft Entra ID (the modern identity platform for Microsoft 365), so authentication is centralized, consistent, and secure.

## Authentication via Microsoft Entra ID

Before you can call the Graph API, you need to register your application in Microsoft Entra ID and obtain an access token.

### Registering Your App in Microsoft Entra ID

1. Go to the [Microsoft Entra ID admin center](https://entra.microsoft.com)
2. Navigate to **Applications > App registrations** and click **New registration**
3. Give your app a name, select **Accounts in this organizational directory only**, and click **Register**
4. Copy the **Application (client) ID** and **Directory (tenant) ID**
5. Go to **Certificates & secrets**, create a new client secret, and save the value immediately
6. Go to **API permissions** and click **Add a permission**
7. Select **Microsoft Graph**, then choose **Delegated permissions** or **Application permissions**
8. Search for and add the permissions you need (e.g., `User.Read`, `Mail.Read`, `Sites.Read.All`)
9. Click **Grant admin consent** if you're in a tenant where you have admin rights

### Understanding Permission Types

**Delegated permissions** require a user to be logged in. When the app makes a Graph call, it's constrained to what that user can access.

**Application permissions** don't require a user—your app authenticates directly using the client secret. Use this when you're running background processes or integrations without a user signing in.

For a deeper dive into OAuth 2.0 flows, token acquisition with MSAL, and managing permissions at scale, see our [Microsoft Graph API OAuth 2.0 and App Permissions Guide](/blog/microsoft-graph-api-oauth2-guide). We also have a companion [Graph API Authentication Guide](/blog/microsoft-graph-api-authentication-guide) covering common pitfalls and troubleshooting.

## Making Your First API Call

Once you have an access token, making a Graph call is straightforward:

```typescript
const accessToken = "your_access_token_here";

const graphUrl = "https://graph.microsoft.com/v1.0/me";

fetch(graphUrl, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  }
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log("Display name:", data.displayName);
    console.log("Email:", data.mail);
  })
  .catch(error => console.error("Error:", error));
```

## Common Endpoints

| Endpoint | Description | Common Permission |
|----------|-------------|-------------------|
| `/me` | Current user's profile | `User.Read` |
| `/users/{id}` | Specific user's profile | `User.Read.All` |
| `/me/messages` | Current user's emails | `Mail.Read` |
| `/me/events` | User's calendar events | `Calendar.Read` |
| `/sites/{siteId}` | SharePoint site metadata | `Sites.Read.All` |
| `/sites/{siteId}/lists` | Lists in a SharePoint site | `Sites.Read.All` |
| `/teams/{teamId}` | Teams team metadata | `Team.ReadBasic.All` |
| `/teams/{teamId}/channels` | Channels in a team | `Channel.ReadBasic.All` |
| `/me/drive/root/children` | Files/folders in user's OneDrive | `Files.Read` |
| `/me/planner/tasks` | User's Planner tasks | `Tasks.Read` |
| `/groups` | Microsoft 365 groups | `Group.Read.All` |

## Using Graph Explorer

The **[Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)** is a browser-based tool that lets you test Graph endpoints without writing code:

1. Go to [developer.microsoft.com/graph/graph-explorer](https://developer.microsoft.com/graph/graph-explorer)
2. Sign in with your Microsoft account
3. Type or select an endpoint (e.g., `/me` or `/me/messages`)
4. Choose the HTTP method and click **Run query**
5. See the response JSON and the exact permissions required

Before writing a line of production code, drive each endpoint in Graph Explorer to see the response shape and confirm the exact permission scope you need.

Once you're comfortable with these endpoints, put them to practical use inside SharePoint Framework solutions. Our guide on [using the Graph API in SPFx for user profiles and Teams data](/blog/microsoft-graph-api-spfx-user-profiles-teams) walks through a real-world example. When you start scaling — combine calls with [Graph $batch requests](/blog/microsoft-graph-batch-requests-combine-api-calls-2026) and use [delta query for incremental sync](/blog/microsoft-graph-delta-query-incremental-sync-2026).

## Error Handling and Common Status Codes

| Status Code | Meaning | What to Do |
|-------------|---------|------------|
| `200` | OK | Your request succeeded. Parse the response JSON. |
| `400` | Bad Request | Your request is malformed. Check query parameters and JSON body. |
| `401` | Unauthorized | Token missing, invalid, or expired. Refresh your token and retry. |
| `403` | Forbidden | Authenticated but don't have permission. Check your scopes. |
| `404` | Not Found | The endpoint or resource doesn't exist. |
| `429` | Too Many Requests | Rate limit hit. Retry after the `Retry-After` header. |
| `500` | Internal Server Error | Microsoft's servers had an issue. Retry after a delay. |

**Pro tip**: Always read the error response body. Graph returns a detailed error message in JSON:

```json
{
  "error": {
    "code": "Authorization_RequestDenied",
    "message": "Insufficient privileges to complete the operation."
  }
}
```

## FAQ

### Do I need an Azure subscription to use Microsoft Graph?

No. You need a Microsoft 365 tenant to get data from Microsoft 365, but that's different from an Azure subscription. Sign up for a free [Microsoft 365 developer tenant](https://developer.microsoft.com/microsoft-365/dev-program) to experiment.

### What's the difference between v1.0 and beta endpoints?

**v1.0** endpoints are stable and supported. Use these in production. **Beta** endpoints are experimental and subject to change. Never rely on beta in production code.

### Can I use Microsoft Graph from Power Automate?

Absolutely. Power Automate has a native **HTTP** action that lets you call any Graph endpoint. You can also use the **Office 365 Outlook**, **SharePoint**, and **Teams** connectors, which are built on top of Graph.

### How do I test Microsoft Graph without building an app?

Use **Graph Explorer** — no code required. Sign in, select an endpoint, and run the query. You get live results and can see the exact JSON structure.
