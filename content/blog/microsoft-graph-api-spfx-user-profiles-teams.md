---
title: "Fetch M365 User Profiles in SPFx using the Graph API"
slug: microsoft-graph-api-spfx-user-profiles-teams
excerpt: "Learn how to securely authenticate and fetch Microsoft 365 user profile data inside your SPFx components and Teams apps."
date: "2026-03-01"
displayDate: "March 1, 2026"
readTime: "12 min read"
image: "/images/blog/microsoft-graph-api-examples.png"
category: "SPFx"
tags:
  - "spfx"
  - "microsoft-graph"
  - "pnp-js"
  - "sharepoint-online"
  - "react"
  - "teams"
---

## Why Microsoft Graph API in SPFx?

If you're building SharePoint Framework web parts, you'll quickly hit the limits of what pure SharePoint APIs can do. Need to show the current user's photo? Display their Teams memberships? Pull calendar events? Send emails? That's where **Microsoft Graph** comes in.

Microsoft Graph is the **unified API for all of Microsoft 365**. From a single endpoint (https://graph.microsoft.com), you can access:

- **User profiles** — photos, job titles, managers, direct reports
- **Teams and channels** — list teams, post messages, get channel members
- **Calendar events** — upcoming meetings, availability, free/busy status
- **OneDrive files** — recent files, shared documents, file previews
- **Mail** — read, send, and search emails
- **Planner** — tasks, buckets, plans across your organization
- **SharePoint** — sites, lists, and pages (beyond what the SP REST API offers)

The best part? **SPFx has built-in Graph support** through the `MSGraphClientV3` — no need to manually handle OAuth tokens.

## Prerequisites

Before you start, make sure you have:

- **SPFx 1.19+** development environment set up ([see my SPFx Hello World guide](/blog/building-spfx-hello-world-webpart))
- **Microsoft 365 developer tenant** or access to a SharePoint Online site
- **API permissions** configured in your `package-solution.json`
- **Admin consent** granted for the Graph scopes you need

## Step 1: Request API Permissions

The first thing you need is to declare which Graph permissions your web part requires. Open `config/package-solution.json` and add the `webApiPermissionRequests` section:

```json
{
  "solution": {
    "name": "graph-webpart-client-side-solution",
    "id": "your-guid-here",
    "version": "1.0.0.0",
    "includeClientSideAssets": true,
    "isDomainIsolated": false,
    "webApiPermissionRequests": [
      { "resource": "Microsoft Graph", "scope": "User.Read" },
      { "resource": "Microsoft Graph", "scope": "User.ReadBasic.All" },
      { "resource": "Microsoft Graph", "scope": "Team.ReadBasic.All" },
      { "resource": "Microsoft Graph", "scope": "Sites.Read.All" }
    ]
  }
}
```

### Understanding Permission Scopes

Choose the **least privileged scope** that works for your scenario:

| What You Need | Scope | Permission Type |
|--------------|-------|----------------|
| Current user's profile | `User.Read` | Delegated |
| Any user's basic profile | `User.ReadBasic.All` | Delegated |
| User photos | `User.Read.All` | Delegated |
| List Teams memberships | `Team.ReadBasic.All` | Delegated |
| Read SharePoint sites | `Sites.Read.All` | Delegated |
| Send mail | `Mail.Send` | Delegated |
| Read calendars | `Calendars.Read` | Delegated |

**Important:** After deploying your `.sppkg` package, a **tenant admin** must approve these permissions in the SharePoint Admin Center — **API access** page. Without admin consent, your Graph calls will fail with a 403.

## Step 2: Initialize the Graph Client

In your web part file (e.g., `GraphDemoWebPart.ts`), get the Graph client from the SPFx context:

```typescript
import { MSGraphClientV3 } from '@microsoft/sp-http';

// Inside your web part class:
private async getGraphClient(): Promise<MSGraphClientV3> {
  return await this.context.msGraphClientFactory.getClient('3');
}
```

That's it. No OAuth configuration, no client secrets, no token management. SPFx handles the entire authentication flow for you using the current user's Azure AD session.

## Step 3: Fetch the Current User's Profile

Let's start with the most common scenario — getting the signed-in user's profile data:

```typescript
interface UserProfile {
  displayName: string;
  mail: string;
  jobTitle: string;
  officeLocation: string;
  department: string;
  businessPhones: string[];
}

private async getCurrentUser(): Promise<UserProfile> {
  const client = await this.getGraphClient();
  const response: UserProfile = await client
    .api('/me')
    .select('displayName,mail,jobTitle,officeLocation,department,businessPhones')
    .get();
  return response;
}
```

### Get the User's Photo

User photos are returned as binary blobs, so you need to convert them to a data URL:

```typescript
private async getUserPhoto(): Promise<string> {
  const client = await this.getGraphClient();
  try {
    const photoBlob: Blob = await client
      .api('/me/photo/$value')
      .responseType('blob' as any)
      .get();
    return URL.createObjectURL(photoBlob);
  } catch {
    return '';
  }
}
```

## Step 4: List the User's Teams

Show which Microsoft Teams the current user belongs to:

```typescript
interface Team {
  id: string;
  displayName: string;
  description: string;
}

private async getMyTeams(): Promise<Team[]> {
  const client = await this.getGraphClient();
  const response = await client
    .api('/me/joinedTeams')
    .select('id,displayName,description')
    .get();
  return response.value;
}
```

## Step 5: Search SharePoint Sites

Use Graph to search across all SharePoint sites in the tenant:

```typescript
private async searchSites(query: string): Promise<SiteResult[]> {
  const client = await this.getGraphClient();
  const response = await client
    .api('/sites')
    .query({ search: query })
    .select('id,displayName,webUrl,description')
    .get();
  return response.value;
}
```

## Step 6: Put It All Together in React

Here's how to wire everything up in a React component using `useEffect` and `Promise.all` for parallel data loading.

## Error Handling Patterns

Graph API calls can fail for many reasons. Use a `safeGraphCall` wrapper that catches 403 (permission denied), 404 (not found), and 429 (throttling) errors with appropriate fallbacks.

## Batching Multiple Requests

Use the `/$batch` endpoint to combine up to 20 Graph calls into a single request — significantly faster than sequential calls.

## PnP JS Alternative

If you prefer a more developer-friendly wrapper, **PnP JS** provides a Graph client with chainable, typed methods and handles batching, caching, and error handling for you.

## Common Mistakes

- **Forgetting admin consent.** Your web part silently gets 403 errors
- **Requesting too many scopes.** Only request what you need
- **Not using `$select`.** Always specify exactly what fields you need
- **Ignoring throttling.** Batch your calls and cache responses
- **Hardcoding tenant URLs.** Use Graph's relative paths (`/me`, `/sites`)

Microsoft Graph turns your SPFx web parts from "SharePoint only" to "Microsoft 365 powered."
