---
title: "Microsoft Graph API Authentication Explained (OAuth 2.0)"
slug: microsoft-graph-api-authentication-guide
excerpt: "Confused by App Registrations and Bearer tokens? A zero-to-hero guide on securely authenticating with the Microsoft Graph API."
date: "2026-03-27"
displayDate: "March 29, 2026"
readTime: "12 min read"
category: "Graph API"
image: "/images/blog/graph-api-auth-hero.png"
tags:
  - "Graph API"
  - "Azure AD"
  - "MSAL"
  - "Microsoft 365"
  - "Authentication"
---

## Why Authentication Is the Hardest Part of Graph API

Microsoft Graph API is incredibly powerful — it unlocks access to users, mail, calendar, SharePoint, Teams, and OneDrive through a single REST endpoint. But most developers hit a wall at the very first step: **authentication**.

The auth system involves Azure AD app registrations, OAuth 2.0 flows, MSAL libraries, and permission scopes that differ between delegated and application contexts. Get one setting wrong and you'll spend hours debugging cryptic `AADSTS` error codes.

This guide walks you through every auth pattern you'll need in 2026, with working code you can copy-paste into your projects.

---

## Step 1: Register Your Application in Azure AD

Every Graph API call requires a registered application in Azure Active Directory (now Microsoft Entra ID).

### How to Register

1. Go to the [Azure Portal](https://portal.azure.com) → **Microsoft Entra ID** → **App registrations** → **New registration**.
2. Set a **display name** (e.g., "Graph API Demo App").
3. Choose a **supported account type**:
   - **Single tenant** — Only your organization (most common for enterprise apps).
   - **Multitenant** — Any Azure AD organization.
   - **Personal accounts** — Include Microsoft accounts (Outlook.com, Xbox).
4. Set a **redirect URI** (for web apps: `http://localhost:3000/auth/callback`; for SPAs: `http://localhost:3000`).
5. Click **Register**.

### After Registration — Collect These Values

You'll need three values from the app's **Overview** page:

```
Application (client) ID:    xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Directory (tenant) ID:      xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Client Secret (or cert):    Created in "Certificates & secrets"
```

**Save these securely.** The client secret is only shown once.

---

## Step 2: Understand Permission Types

Graph API uses two permission models. Choosing the wrong one is the #1 cause of auth failures.

### Delegated Permissions (User Context)

The app acts **on behalf of a signed-in user**. The intersection of the user's permissions and the app's permissions determines what it can access.

**Example:** A web app that reads the signed-in user's emails requires `Mail.Read` delegated permission.

### Application Permissions (Daemon/Service)

The app acts **as itself** — no user is signed in. Used for background services, scheduled jobs, and automation scripts.

**Example:** A Power Automate flow that reads all users' calendars requires `Calendars.Read` application permission + **admin consent**.

### Quick Reference

| Scenario | Permission Type | Admin Consent? | MSAL Flow |
|----------|----------------|---------------|-----------|
| User reads own profile | Delegated | No | Auth Code |
| User reads team files | Delegated | Yes | Auth Code |
| Background job sends mail | Application | Yes | Client Credentials |
| SPFx web part reads lists | Delegated | Depends | Implicit/Auth Code |
| Power Automate connector | Delegated/App | Yes | Various |

---

## Step 3: Configure API Permissions

1. In your app registration, go to **API permissions** → **Add a permission** → **Microsoft Graph**.
2. Choose **Delegated** or **Application** permissions.
3. Search for the specific scope (e.g., `User.Read`, `Files.ReadWrite.All`, `Sites.Read.All`).
4. Click **Add permissions**.
5. If the permission requires admin consent, click **Grant admin consent for [tenant]**.

### Common Permission Scopes

```plaintext
User.Read              — Read signed-in user's profile
User.Read.All          — Read all users' profiles (admin)
Mail.Read              — Read user's mail
Mail.Send              — Send mail as user
Files.ReadWrite.All    — Read/write all files in OneDrive/SharePoint
Sites.Read.All         — Read all SharePoint sites
Calendars.ReadWrite    — Read/write user's calendar
Team.ReadBasic.All     — Read Teams info
```

---

## Step 4: Authenticate with MSAL.js (Browser Apps)

MSAL.js v2 ([@azure/msal-browser](https://github.com/AzureAD/microsoft-authentication-library-for-js)) is the recommended library for single-page applications.

### Installation

```bash
npm install @azure/msal-browser
```

### Configuration

```typescript
// authConfig.ts
import { Configuration, PublicClientApplication } from '@azure/msal-browser';

const msalConfig: Configuration = {
  auth: {
    clientId: 'YOUR_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: 'http://localhost:3000',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
```

### Acquiring a Token

```typescript
// graphService.ts
import { msalInstance } from './authConfig';

const loginRequest = {
  scopes: ['User.Read', 'Mail.Read'],
};

export async function getToken(): Promise<string> {
  const accounts = msalInstance.getAllAccounts();
  
  if (accounts.length > 0) {
    // Silent token acquisition (from cache)
    try {
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      return response.accessToken;
    } catch (error) {
      // Cache miss — fall through to interactive
    }
  }

  // Interactive login (popup or redirect)
  const response = await msalInstance.acquireTokenPopup(loginRequest);
  return response.accessToken;
}
```

### Making a Graph API Call

```typescript
export async function getMyProfile() {
  const token = await getToken();
  
  const response = await fetch('https://graph.microsoft.com/v1.0/me', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Graph API error: ${response.status}`);
  }

  return response.json();
}
```

---

## Step 5: Authenticate in Node.js (Server-Side / Daemon)

For background services and APIs, use [@azure/msal-node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) with the **Client Credentials** flow.

### Installation

```bash
npm install @azure/msal-node
```

### Client Secret Authentication

```typescript
import { ConfidentialClientApplication } from '@azure/msal-node';

const msalConfig = {
  auth: {
    clientId: 'YOUR_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    clientSecret: 'YOUR_CLIENT_SECRET',
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

async function getAppToken(): Promise<string> {
  const result = await cca.acquireTokenByClientCredential({
    scopes: ['https://graph.microsoft.com/.default'],
  });
  
  if (!result) throw new Error('Token acquisition failed');
  return result.accessToken;
}
```

### Certificate Authentication (Production Recommended)

For production workloads, Microsoft recommends certificate-based auth over client secrets. Client secrets expire (max 24 months) and can be leaked in logs.

```typescript
import { readFileSync } from 'fs';
import { ConfidentialClientApplication } from '@azure/msal-node';

const msalConfig = {
  auth: {
    clientId: 'YOUR_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    clientCertificate: {
      thumbprint: 'YOUR_CERT_THUMBPRINT',
      privateKey: readFileSync('./certs/private-key.pem', 'utf-8'),
    },
  },
};

const cca = new ConfidentialClientApplication(msalConfig);
// Usage is identical to client secret
```

---

## Step 6: Authenticate in SPFx Web Parts

SPFx provides a built-in `AadHttpClient` that handles authentication automatically — no need for MSAL directly.

```typescript
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';

export default class GraphWebPart extends BaseClientSideWebPart {
  
  public async render(): Promise<void> {
    const client: AadHttpClient = await this.context.aadHttpClientFactory
      .getClient('https://graph.microsoft.com');
    
    const response: HttpClientResponse = await client.get(
      'https://graph.microsoft.com/v1.0/me',
      AadHttpClient.configurations.v1
    );
    
    const profile = await response.json();
    // Render profile data
  }
}
```

**Important:** You still need to approve the API permissions in the SharePoint Admin Center under **API access** or via the `spo serviceprincipal grant add` CLI command.

---

## Troubleshooting Common Auth Errors

| Error Code | Meaning | Fix |
|-----------|---------|-----|
| `AADSTS700016` | App not found in tenant | Verify Client ID and Tenant ID |
| `AADSTS65001` | User hasn't consented | Add consent redirect or grant admin consent |
| `AADSTS7000215` | Invalid client secret | Regenerate secret in Azure Portal |
| `AADSTS50076` | MFA required | Use interactive auth flow, not silent |
| `AADSTS700024` | Client assertion expired | Renew certificate or secret |
| `AADSTS50011` | Redirect URI mismatch | Update redirect URI in app registration |
| `InvalidAuthenticationToken` | Token expired or wrong audience | Re-acquire token with correct scope |

---

## FAQ

### What is the difference between delegated and application permissions?

**Delegated permissions** require a signed-in user and operate within that user's access level. **Application permissions** run without a user and typically have tenant-wide access. Application permissions always require admin consent.

### Do I need a client secret or certificate for Graph API?

For browser apps (SPAs), you don't need either — MSAL.js uses the Authorization Code flow with PKCE. For server-side apps and daemons, you need either a client secret or certificate. Certificates are more secure and recommended for production.

### How long do Graph API tokens last?

Access tokens are valid for **60-90 minutes** by default. MSAL handles token caching and automatic refresh via refresh tokens (which last up to 90 days). Always use `acquireTokenSilent` first to leverage cached tokens.

### Can I use Graph API without Azure AD?

No. Microsoft Graph API exclusively uses Azure AD (Microsoft Entra ID) for authentication. There is no API key or basic auth option. Every call requires a valid OAuth 2.0 bearer token.

### How do I test Graph API calls without building an app?

Use the [Microsoft Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer) — a browser-based tool where you can sign in with your Microsoft account and test any Graph API endpoint interactively.

---

*For more practical Graph API examples, check out our [Microsoft Graph API: 10 Practical Examples](/blog/microsoft-graph-api-sharepoint-examples) guide. Need help with SPFx authentication specifically? See our [SPFx CRUD tutorial](/blog/building-spfx-hello-world-webpart) for the full setup.*

*This guide covers authentication patterns current as of March 2026 (MSAL.js v2.x, Microsoft Entra ID). Always reference the [official Microsoft documentation](https://learn.microsoft.com/en-us/graph/auth/) for the latest updates.*
