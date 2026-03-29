# Microsoft Graph API Authentication: The Complete Guide for SharePoint Developers (2026)

Every SharePoint developer eventually hits the same wall: "I want to call Graph API, but how do I handle authentication?" Whether you're building an SPFx web part, a Power Automate flow, or a standalone Node.js service, the authentication model determines everything — what data you can access, whose permissions you use, and whether your solution works in production.

This guide covers every authentication scenario you'll encounter as a SharePoint developer in 2026, with working code for each one.

## Understanding the Two Permission Types

Before writing any code, you need to understand a fundamental distinction that trips up even experienced developers:

| Type | Also Called | When to Use | User Consent? |
|------|-------------|-------------|---------------|
| **Delegated** | "On behalf of a user" | SPFx web parts, user-facing apps | Yes — user must consent or admin pre-approves |
| **Application** | "Daemon / service" | Background jobs, Power Automate, APIs | No — app runs as itself with admin consent |

**The key rule:** If a real user is logged in and initiating the action, use delegated. If no user is present (scheduled jobs, webhooks, automation), use application.

## Method 1: SPFx Web Parts (AadHttpClient)

This is the most common scenario for SharePoint developers. Your SPFx web part needs to call Graph API on behalf of the currently logged-in user.

### Why Not Use MSGraphClientV3 Directly?

The `MSGraphClientV3` abstraction in SPFx is convenient but limited. It doesn't support custom scopes well, and Microsoft has been steering developers toward `AadHttpClient` for more control.

### The Code

```typescript
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';

export async function getMyProfile(context: WebPartContext): Promise<any> {
  const client = await context.aadHttpClientFactory
    .getClient('https://graph.microsoft.com');

  const response: HttpClientResponse = await client.get(
    'https://graph.microsoft.com/v1.0/me',
    AadHttpClient.configurations.v1
  );

  if (!response.ok) {
    throw new Error(`Graph API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}
```

### What Happens Behind the Scenes

1. SharePoint acquires a token from Azure AD using the user's session
2. The token is scoped to `https://graph.microsoft.com` with delegated permissions
3. Your web part calls Graph API with this token in the `Authorization` header
4. Graph API validates the token and returns data the user has permission to see

### Required Setup

In your SPFx solution's `package-solution.json`, declare the API permissions:

```json
"webApiPermissionRequests": [
  {
    "resource": "Microsoft Graph",
    "scope": "User.Read"
  },
  {
    "resource": "Microsoft Graph",
    "scope": "Sites.Read.All"
  }
]
```

After deploying the `.sppkg`, a tenant admin must approve these permissions in the SharePoint Admin Center → **API access** page.

## Method 2: MSAL.js (Standalone Web Apps)

If you're building a React or Next.js app outside of SharePoint that needs Graph API access, use MSAL.js directly.

### Install MSAL

```bash
npm install @azure/msal-browser @azure/msal-react
```

### Configure the Auth Provider

```typescript
// authConfig.ts
import { Configuration, PopupRequest } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: 'YOUR_APP_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: 'http://localhost:3000',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const graphScopes: PopupRequest = {
  scopes: ['User.Read', 'Sites.Read.All'],
};
```

### Acquire Token and Call Graph

```typescript
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, graphScopes } from './authConfig';

const msalInstance = new PublicClientApplication(msalConfig);

export async function callGraphApi(endpoint: string): Promise<any> {
  const accounts = msalInstance.getAllAccounts();

  if (accounts.length === 0) {
    // No user signed in — trigger login
    await msalInstance.loginPopup(graphScopes);
  }

  const tokenResponse = await msalInstance.acquireTokenSilent({
    ...graphScopes,
    account: msalInstance.getAllAccounts()[0],
  });

  const response = await fetch(`https://graph.microsoft.com/v1.0${endpoint}`, {
    headers: {
      Authorization: `Bearer ${tokenResponse.accessToken}`,
    },
  });

  return await response.json();
}
```

### Azure AD App Registration

1. Go to **Azure Portal** → **App registrations** → **New registration**
2. Set the redirect URI to your app URL (e.g., `http://localhost:3000`)
3. Under **API permissions**, add the Graph API scopes you need
4. Under **Authentication**, enable **Access tokens** and **ID tokens**
5. Copy the **Application (client) ID** — this is your `clientId`

## Method 3: Client Credentials (Daemon/Service Apps)

For background services, scheduled jobs, or Power Automate HTTP actions that run without a user context.

### Using a Client Secret

```typescript
// Node.js service
import { ConfidentialClientApplication } from '@azure/msal-node';

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET!,
  },
};

const cca = new ConfidentialClientApplication(msalConfig);

export async function getAppToken(): Promise<string> {
  const result = await cca.acquireTokenByClientCredential({
    scopes: ['https://graph.microsoft.com/.default'],
  });

  if (!result?.accessToken) {
    throw new Error('Failed to acquire token');
  }

  return result.accessToken;
}

// Usage
async function listAllSites() {
  const token = await getAppToken();

  const response = await fetch('https://graph.microsoft.com/v1.0/sites?search=*', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return await response.json();
}
```

### Using a Certificate (Production Best Practice)

Client secrets expire and can leak. For production, use certificate-based authentication:

```typescript
import { readFileSync } from 'fs';

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientCertificate: {
      thumbprint: process.env.CERT_THUMBPRINT!,
      privateKey: readFileSync('./certs/private-key.pem', 'utf-8'),
    },
  },
};
```

## Method 4: Managed Identity (Azure Functions / App Service)

If your code runs inside Azure (Functions, App Service, Container Apps), use **Managed Identity** — the most secure option because there are no credentials to manage at all.

```typescript
import { DefaultAzureCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from
  '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';

const credential = new DefaultAzureCredential();
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
  scopes: ['https://graph.microsoft.com/.default'],
});

const graphClient = Client.initWithMiddleware({ authProvider });

// Now call Graph API — no secrets anywhere
const sites = await graphClient.api('/sites?search=*').get();
```

### Setup

1. Enable **System-assigned managed identity** on your Azure Function/App Service
2. In Azure AD → **Enterprise applications**, find the managed identity
3. Grant it the required Graph API **application permissions** using PowerShell:

```powershell
# Grant Sites.Read.All to the managed identity
$graphAppId = "00000003-0000-0000-c000-000000000000"
$graphSp = Get-AzureADServicePrincipal -Filter "appId eq '$graphAppId'"
$role = $graphSp.AppRoles | Where-Object { $_.Value -eq "Sites.Read.All" }
$msi = Get-AzureADServicePrincipal -ObjectId "YOUR_MSI_OBJECT_ID"
New-AzureADServiceAppRoleAssignment -ObjectId $msi.ObjectId -PrincipalId $msi.ObjectId -ResourceId $graphSp.ObjectId -Id $role.Id
```

## Quick Decision Guide

| Scenario | Method | Permissions Type |
|----------|--------|-----------------|
| SPFx web part calling Graph API | AadHttpClient | Delegated |
| React/Next.js app with user login | MSAL.js | Delegated |
| Background job / scheduled task | Client Credentials | Application |
| Azure Function / App Service | Managed Identity | Application |
| Power Automate HTTP action | Client Credentials (via HTTP connector) | Application |
| CLI script (dev/testing) | Device Code Flow | Delegated |

## Common Mistakes to Avoid

### 1. Using Application Permissions When Delegated Would Work

Application permissions give access to **all** resources (e.g., all sites, all users). Delegated permissions limit access to what the current user can see. Always prefer delegated when a user is present.

### 2. Hardcoding Client Secrets

Never put credentials in your source code. Use Azure Key Vault, environment variables, or managed identities.

### 3. Requesting Too Many Scopes

Only request the permissions you actually need. `Sites.ReadWrite.All` when you only need `Sites.Read.All` will be flagged during admin consent review.

### 4. Ignoring Token Caching

MSAL caches tokens automatically, but if you're using raw `fetch` calls, make sure you're not requesting a new token for every API call. Tokens are valid for ~60-90 minutes.

### 5. Not Handling Consent Errors

In multi-tenant scenarios, your app may encounter `interaction_required` errors when a user from a new tenant hasn't consented yet. Always implement a fallback to `acquireTokenPopup` or `acquireTokenRedirect`.

## FAQ

### What's the difference between v1.0 and beta Graph API endpoints?

The `v1.0` endpoint is stable and supported. The `beta` endpoint has newer features but can change without notice. Use `v1.0` in production; use `beta` only for features not yet in v1.0.

### Can I call Graph API from a SharePoint Framework Extension?

Yes. SPFx Extensions (Application Customizers, Command Sets, Field Customizers) have the same `context.aadHttpClientFactory` available as web parts. The permission model is identical.

### How do I test Graph API calls without deploying to SharePoint?

Use [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) to test queries interactively. For local development, use MSAL.js with the device code flow to get a token without a redirect URI.

### What permissions do I need to read SharePoint lists via Graph API?

`Sites.Read.All` (delegated or application) lets you read site content. For writing, use `Sites.ReadWrite.All`. For more granular control, use `Sites.Selected` and grant permissions per-site.

## Next Steps

Now that you understand the authentication landscape, put it into practice:

- **Build with SPFx**: Follow our [SPFx CRUD Web Part Tutorial](/blog/spfx-crud-web-part-react-pnpjs) to build a working web part with Graph API integration
- **Automate with Power Platform**: See our [Power Automate + SharePoint Workflows](/blog/power-automate-sharepoint-document-workflows) guide for no-code Graph API consumption
- **Explore Graph API endpoints**: Check out [10 Practical Graph API Examples](/blog/microsoft-graph-api-examples) for ready-to-use queries

The authentication is the hardest part — once you have a working token, the rest is just HTTP calls.
