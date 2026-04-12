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

That's it. No OAuth configuration, no client secrets, no token management. SPFx handles the entire authentication flow for you using the current user's Microsoft Entra ID session.

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

## Step 5.5: Check User Presence and Team Membership Queries

Beyond basic team listings, you can query detailed team membership and user presence (online status):

```typescript
// Get user's presence status (online, away, busy, offline, etc.)
private async getUserPresence(): Promise<string> {
  const client = await this.getGraphClient();
  const response = await client
    .api('/me/presence')
    .get();
  return response.availability; // e.g., "Available", "Away"
}

// Get all members of a specific Team with detailed info
private async getTeamMembers(teamId: string): Promise<TeamMember[]> {
  const client = await this.getGraphClient();
  const response = await client
    .api(`/teams/${teamId}/members`)
    .select('id,displayName,email,roles')
    .get();
  return response.value;
}
```

Presence information is particularly useful for "online status indicators" in collaborative SPFx components.

## Step 6: Put It All Together in React

Here's how to wire everything up in a React component using `useEffect` and `Promise.all` for parallel data loading:

```typescript
import React, { useEffect, useState } from 'react';

interface ComponentProps {
  context: any; // Your SPFx web part context
}

const GraphDataComponent: React.FC<ComponentProps> = ({ context }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGraphData();
  }, []);

  const loadGraphData = async () => {
    try {
      const client = await context.msGraphClientFactory.getClient('3');
      
      // Load multiple requests in parallel
      const [profile, teamsData] = await Promise.all([
        client.api('/me').select('displayName,mail,jobTitle').get(),
        client.api('/me/joinedTeams').select('id,displayName').get()
      ]);

      setUserProfile(profile);
      setTeams(teamsData.value);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>{userProfile?.displayName}</h2>
      <p>{userProfile?.jobTitle}</p>
      <h3>Teams</h3>
      <ul>
        {teams.map(t => <li key={t.id}>{t.displayName}</li>)}
      </ul>
    </div>
  );
};
```

## Error Handling Patterns

Graph API calls can fail for many reasons. Use a `safeGraphCall` wrapper that catches 403 (permission denied), 404 (not found), and 429 (throttling) errors with appropriate fallbacks:

```typescript
private async safeGraphCall<T>(
  apiCall: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await apiCall();
  } catch (error: any) {
    if (error.status === 403) {
      console.warn('Permission denied. Check admin consent.');
    } else if (error.status === 429) {
      console.warn('Throttled. Retry after delay.');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return this.safeGraphCall(apiCall, fallback);
    }
    return fallback;
  }
}
```

## Batching Multiple Requests

Use the `/$batch` endpoint to combine up to 20 Graph calls into a single request — significantly faster than sequential calls:

```typescript
private async batchGraphCalls(): Promise<any[]> {
  const client = await this.getGraphClient();
  const requests = [
    { id: '1', method: 'GET', url: '/me' },
    { id: '2', method: 'GET', url: '/me/joinedTeams' },
    { id: '3', method: 'GET', url: '/me/presence' }
  ];

  const response = await client
    .api('/$batch')
    .post({ requests });
  return response.responses;
}
```

## PnP JS Alternative

If you prefer a more developer-friendly wrapper, **PnP JS** provides a Graph client with chainable, typed methods and handles batching, caching, and error handling for you.

## FAQ

### What's the difference between `User.Read` and `User.ReadBasic.All`?
`User.Read` is for reading the current signed-in user only. `User.ReadBasic.All` lets you read any user's basic profile (name, photo, job title) but not sensitive fields like email or phone.

### Why am I getting 403 errors even with correct scopes?
Admin consent hasn't been granted. A tenant administrator must approve your API permissions in the SharePoint Admin Center → API access page.

### How do I cache Graph responses to avoid repeated calls?
Store the response in React state with a timestamp. Before calling Graph again, check if the cached data is still fresh (e.g., less than 5 minutes old).

### Can I batch more than 20 requests?
No. The `/$batch` endpoint has a hard limit of 20 requests. For more, split into multiple batches or use sequential calls with throttling safeguards.

## Common Mistakes

- **Forgetting admin consent.** Your web part silently gets 403 errors
- **Requesting too many scopes.** Only request what you need
- **Not using `$select`.** Always specify exactly what fields you need
- **Ignoring throttling.** Batch your calls and cache responses
- **Hardcoding tenant URLs.** Use Graph's relative paths (`/me`, `/sites`)

Microsoft Graph turns your SPFx web parts from "SharePoint only" to "Microsoft 365 powered."
