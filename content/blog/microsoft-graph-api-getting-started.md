---
title: "Getting Started with Microsoft Graph API in 2026"
slug: microsoft-graph-api-getting-started
excerpt: "Master Microsoft Graph: the unified API for M365 data. Learn authentication, make your first call, explore endpoints, and integrate with Power Automate."
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

This matters because it dramatically simplifies building integrations. You don't need to learn the quirks of each service's API—Graph handles the heavy lifting. It's the foundation for tools like Power Automate connectors, SharePoint Framework (SPFx) apps, and any third-party app that works with Microsoft 365 data.

Graph runs on top of Microsoft Entra ID (the modern identity platform for Microsoft 365), so authentication is centralized, consistent, and secure. Whether you're building a simple web app or integrating into an enterprise environment, Graph is the right tool.

## Authentication via Microsoft Entra ID

Before you can call the Graph API, you need to register your application in Microsoft Entra ID and obtain an access token. Here's the process:

### Registering Your App in Microsoft Entra ID

1. Go to the [Microsoft Entra ID admin center](https://entra.microsoft.com)
2. Navigate to **Applications > App registrations** and click **New registration**
3. Give your app a name (e.g., "My Graph App"), select **Accounts in this organizational directory only** (or **Multitenant** if needed), and click **Register**
4. Copy the **Application (client) ID** and **Directory (tenant) ID** — you'll need these
5. Go to **Certificates & secrets**, create a new client secret, and save the value immediately (you won't be able to see it again)
6. Go to **API permissions** and click **Add a permission**
7. Select **Microsoft Graph**, then choose **Delegated permissions** or **Application permissions**:
   - **Delegated**: Your app acts on behalf of a signed-in user (good for web apps with a UI)
   - **Application**: Your app acts as itself without a user context (good for background jobs, scheduled tasks)
8. Search for and add the permissions you need (e.g., `User.Read`, `Mail.Read`, `Sites.Read.All`)
9. Click **Grant admin consent** if you're in a tenant where you have admin rights

### Understanding Permission Types

**Delegated permissions** require a user to be logged in. When the app makes a Graph call, it's constrained to what that user can access. This is safer for interactive applications.

**Application permissions** don't require a user—your app authenticates directly using the client secret. Use this when you're running background processes or integrations that don't have a user signing in. Be careful: these are more powerful and should be restricted appropriately.

For a deeper dive into OAuth 2.0 flows, token acquisition with MSAL, and managing permissions at scale, see our [Microsoft Graph API OAuth 2.0 and App Permissions Guide](/blog/microsoft-graph-api-oauth2-guide). We also have a companion [Graph API Authentication Guide](/blog/microsoft-graph-api-authentication-guide) covering common pitfalls and troubleshooting.

## Making Your First API Call

Once you have an access token, making a Graph call is straightforward. Here's a practical example in TypeScript/JavaScript using the Fetch API:

```typescript
// Assuming you've already obtained an accessToken from Microsoft Entra ID
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
    console.log("User data:", data);
    console.log("Display name:", data.displayName);
    console.log("Email:", data.mail);
  })
  .catch(error => console.error("Error:", error));
```

This example calls the `/me` endpoint, which returns the profile of the authenticated user. The key pieces:

- **`Authorization: Bearer {token}`** — This header is required for every Graph call. Replace `{token}` with your actual access token.
- **Response handling** — Check `response.ok` (status 200–299) before parsing JSON. Graph returns detailed error messages in the response body if something goes wrong.
- **Parsing JSON** — Most Graph endpoints return JSON, so `response.json()` is your friend.

The endpoint `/me` is a shorthand for the current user. If you have the User ID, you can also call `/users/{userId}` to get another user's profile (permissions permitting).

## Common Endpoints

Below are some of the most-used Graph API endpoints. Each requires specific permissions—check the Graph documentation or the Graph Explorer for the exact scopes needed.

| Endpoint | Description | Common Permission |
|----------|-------------|-------------------|
| `/me` | Current user's profile | `User.Read` |
| `/users/{id}` | Specific user's profile | `User.Read.All` |
| `/me/messages` | Current user's emails | `Mail.Read` |
| `/me/mailFolders` | User's email folders | `Mail.Read` |
| `/me/events` | User's calendar events | `Calendar.Read` |
| `/sites/{siteId}` | SharePoint site metadata | `Sites.Read.All` |
| `/sites/{siteId}/lists` | Lists in a SharePoint site | `Sites.Read.All` |
| `/teams/{teamId}` | Teams team metadata | `Team.ReadBasic.All` |
| `/teams/{teamId}/channels` | Channels in a team | `Channel.ReadBasic.All` |
| `/me/drive/root/children` | Files/folders in user's OneDrive | `Files.Read` |
| `/me/planner/tasks` | User's Planner tasks | `Tasks.Read` |
| `/groups` | Microsoft 365 groups | `Group.Read.All` |

These are just a sample—Graph has hundreds of endpoints covering nearly every M365 service. The [Microsoft Graph REST API reference](https://learn.microsoft.com/graph/api/overview) is your authoritative source, but the Graph Explorer (below) is faster for quick lookups.

## Using Graph Explorer

The **[Graph Explorer](https://developer.microsoft.com/graph/graph-explorer)** is a browser-based tool that lets you test Graph endpoints without writing code. Here’s how to use it:

1. Go to [developer.microsoft.com/graph/graph-explorer](https://developer.microsoft.com/graph/graph-explorer)
2. You’ll be prompted to sign in with your Microsoft account (use a test tenant if you have one)
3. In the left panel, type or select an endpoint (e.g., `/me` or `/me/messages`)
4. Choose the HTTP method (GET, POST, PATCH, DELETE) from the dropdown
5. Click the **Run query** button
6. You’ll see the response JSON on the right, plus the exact permissions required

This is invaluable for exploration. You can see the JSON structure before you write a single line of code, test pagination, filter results with query parameters (`$filter`, `$select`), and verify you have the right permissions. If you get a `401` or `403` error, the response tells you what permission is missing.

Before writing a single line of code, you can also easily test endpoints and view exact permission scopes using the **[Microsoft Graph API Explorer Lite](/tools/graph-api-explorer)** tool. It’s perfect for exploring the JSON structures without needing an active Entra ID tenant token.

Once you’re comfortable with these endpoints, you can put them to practical use inside SharePoint Framework solutions. Our guide on [using the Graph API in SPFx for user profiles and Teams data](/blog/microsoft-graph-api-spfx-user-profiles-teams) walks through a real-world example. You can also leverage Graph in modern Microsoft 365 scenarios like [SharePoint Embedded for document management](/blog/sharepoint-embedded-developer-guide-2026).

## Error Handling and Common Status Codes

Graph doesn’t always succeed on the first try. Here’s what common HTTP status codes mean and how to respond:

| Status Code | Meaning | What to Do |
|-------------|---------|-----------|
| `200` | OK | Your request succeeded. Parse the response JSON. |
| `400` | Bad Request | Your request is malformed (syntax error, invalid parameter). Check query parameters and JSON body. |
| `401` | Unauthorized | Your token is missing, invalid, or expired. Refresh your token and retry. |
| `403` | Forbidden | You’re authenticated but don’t have permission to access this resource. Check your scopes in Microsoft Entra ID. |
| `404` | Not Found | The endpoint or resource doesn’t exist. Double-check the endpoint URL and IDs. |
| `429` | Too Many Requests | You’ve hit the rate limit. Implement exponential backoff and retry after the `Retry-After` header. |
| `500` | Internal Server Error | Microsoft’s servers had an issue. Retry after a delay; if it persists, check the [Microsoft 365 status page](https://status.office365.com). |

**Pro tip**: Always read the error response body. Graph returns a detailed error message in JSON, often including which permission you’re missing or what field is invalid:

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

No. You need a Microsoft 365 tenant to get data from Microsoft 365, but that’s different from an Azure subscription. Most organizations already have a Microsoft 365 tenant. You can also sign up for a free [Microsoft 365 developer tenant](https://developer.microsoft.com/microsoft-365/dev-program) to experiment with Graph—it comes with sample data and a sandbox environment.

### What’s the difference between v1.0 and beta endpoints?

**v1.0** endpoints are stable and supported by Microsoft. Use these in production.

**Beta** endpoints are experimental and subject to change. Use them only if you need a feature that isn’t available in v1.0 yet, and always have a fallback plan in case the endpoint changes. Never rely on beta in production code.

### Can I use Microsoft Graph from Power Automate?

Absolutely. Power Automate has a native **HTTP** action that lets you call any Graph endpoint with the right authentication. You can also use the **Office 365 Outlook**, **SharePoint**, and **Teams** connectors, which are built on top of Graph. For maximum flexibility and custom scenarios, the HTTP action is your friend. Just set the URI to the Graph endpoint and pass your bearer token in the headers.

### How do I test Microsoft Graph without building an app?

Use **Graph Explorer** (mentioned above)—no code required. Sign in, select an endpoint, and run the query. You get live results and can see the exact JSON structure. This is perfect for quick testing, learning the API, and verifying permissions before you start coding.
