---
title: "Azure Static Web Apps with Microsoft Graph (2026)"
slug: azure-static-web-apps-microsoft-graph-2026
excerpt: "Ship a secure Microsoft 365 dashboard on Azure Static Web Apps with Entra ID auth and Microsoft Graph — config, MSAL code, and 2026 production patterns."
date: "2026-05-04T09:00:00.000Z"
displayDate: "May 4, 2026"
readTime: "13 min read"
category: "Microsoft 365"
image: "/images/blog/azure-static-web-apps-microsoft-graph-2026.png"
tags:
  - "Azure Static Web Apps"
  - "Microsoft Graph"
  - "Entra ID"
  - "Microsoft 365"
  - "Authentication"
  - "TypeScript"
  - "2026"
---

## Why Azure Static Web Apps Is the Right Frontend for Microsoft 365

If you have ever shipped a Microsoft 365 internal tool — a directory browser, a mailbox dashboard, a Teams analytics page — you know the painful triangle: a static frontend, a small Functions backend, and an OAuth flow gluing them together. You can wire that up on App Service or container apps, but you end up running infrastructure for what is, in essence, a single page that talks to Microsoft Graph.

Azure Static Web Apps (SWA) collapses that triangle. It hosts the static bundle on a global CDN, ships managed Functions on the same domain, and — most usefully for our scenario — has first-class **custom authentication with Entra ID** baked in. No reverse proxy, no redirect dance, no `/api/auth/login` route to write yourself. The platform handles the OAuth handshake, then exposes the user identity as a clean header inside your Functions.

Combined with Microsoft Graph, this is the lowest-friction stack in 2026 for building tenant-internal Microsoft 365 dashboards. This guide walks through it end-to-end: project setup, Entra ID configuration, MSAL on the frontend for delegated Graph calls, server-side Graph calls from a Function with the user's token, local development, and the production hardening you'll wish you'd done before shipping.

---

## What You're Building

We'll build a small SWA that, after the user signs in with their work account, displays:

- The user's profile (`/me`)
- Their five most recent emails (`/me/messages`)
- Members of a specific Microsoft 365 group, fetched server-side from a Function

The architecture:

```
[ Browser ]  --(SWA static assets)-->     [ SWA CDN ]
[ Browser ]  --(/.auth/login/aad)-->      [ SWA platform ]  --(OIDC)-->  [ Entra ID ]
[ Browser ]  --(MSAL token request)-->    [ Entra ID ]  --(Graph token)-->  [ Graph ]
[ Browser ]  --(/api/group-members)-->    [ SWA Function ]  --(OBO)-->  [ Graph ]
```

Two distinct Graph call paths — that's the point. Frontend MSAL handles low-risk reads (`User.Read`, `Mail.Read`). Server-side Functions handle anything that needs a higher-trust scope or that you don't want exposed in the browser. We'll do both.

---

## Project Setup

We'll use Vite + React + TypeScript for the frontend and a TypeScript Function under `/api`. SWA expects this layout out of the box:

```bash
npm create vite@latest m365-dashboard -- --template react-ts
cd m365-dashboard
npm install
npm install @azure/msal-browser @azure/msal-react @microsoft/microsoft-graph-client isomorphic-fetch
```

Now scaffold the API folder:

```bash
mkdir -p api/group-members
cd api
npm init -y
npm install @azure/functions @microsoft/microsoft-graph-client isomorphic-fetch
npm install -D typescript @types/node
```

Add a minimal `api/tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2022",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

And a `host.json` so Functions v4 picks up the right runtime:

```json
{
  "version": "2.0",
  "extensionBundle": {
    "id": "Microsoft.Azure.Functions.ExtensionBundle",
    "version": "[4.*, 5.0.0)"
  }
}
```

The folder layout you should end up with:

```
m365-dashboard/
  src/                      # React app
  api/
    src/
      group-members/
        index.ts
        function.json
    host.json
    package.json
    tsconfig.json
  staticwebapp.config.json
  package.json
```

---

## Configuring Entra ID Authentication

SWA supports two flavors of Entra ID auth: the **default Azure AD provider** (zero-config, but limited to your home tenant and basic scopes), and **custom Azure AD authentication**, which is what you want in any real M365 scenario because it gives you control over the app registration, audience, and scopes.

### Step 1 — Register an app in Entra ID

In the Azure portal, **Microsoft Entra ID → App registrations → New registration**:

- **Name:** `m365-dashboard`
- **Supported account types:** Accounts in this organizational directory only
- **Redirect URI (Web):** `https://<your-swa>.azurestaticapps.net/.auth/login/aad/callback`

After creation, on the app's overview page, copy the **Application (client) ID** and **Directory (tenant) ID**. Then go to **Certificates & secrets** and create a new client secret — record the value immediately, you can't see it again.

Add API permissions: **Microsoft Graph → Delegated permissions → User.Read, Mail.Read, GroupMember.Read.All**. Click **Grant admin consent** for your tenant.

Under **Expose an API**, set the Application ID URI to `api://<client-id>` (the default works) and add a scope `access_as_user` so the frontend can request a token that the Function can exchange (more on that in the OBO section).

### Step 2 — Wire the secret into SWA

Both the client ID and the secret need to live in SWA application settings (never commit them):

```bash
# from the repo root, after deploying the SWA once
swa env --env production AAD_CLIENT_ID=<client-id> AAD_CLIENT_SECRET=<secret>
```

Or set them in the portal under **Configuration → Application settings**.

### Step 3 — staticwebapp.config.json

This is the file that turns generic SWA hosting into an M365-aware app. Put it at the repo root:

```json
{
  "auth": {
    "identityProviders": {
      "azureActiveDirectory": {
        "registration": {
          "openIdIssuer": "https://login.microsoftonline.com/<tenant-id>/v2.0",
          "clientIdSettingName": "AAD_CLIENT_ID",
          "clientSecretSettingName": "AAD_CLIENT_SECRET"
        }
      }
    }
  },
  "routes": [
    { "route": "/api/*", "allowedRoles": ["authenticated"] },
    { "route": "/dashboard/*", "allowedRoles": ["authenticated"] }
  ],
  "responseOverrides": {
    "401": { "redirect": "/.auth/login/aad", "statusCode": 302 }
  },
  "globalHeaders": {
    "Content-Security-Policy": "default-src 'self'; connect-src 'self' https://graph.microsoft.com https://login.microsoftonline.com; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https://graph.microsoft.com data:;"
  }
}
```

The `responseOverrides` block converts unauthenticated requests on protected routes into a redirect to the Entra ID login. The `globalHeaders` CSP is the bare minimum for a Graph-calling SPA; tighten as needed.

---

## Calling Microsoft Graph from the Frontend (MSAL)

The platform's `/.auth/login/aad` flow gives you a session, but the cookie it issues is opaque — you can't extract a Graph access token from it. For frontend-initiated Graph calls you still need MSAL to mint a real token tied to the same app registration.

Set up the MSAL provider in `src/main.tsx`:

```tsx
import { createRoot } from "react-dom/client";
import { PublicClientApplication, Configuration } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import App from "./App";

const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AAD_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AAD_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: { cacheLocation: "sessionStorage" },
};

const pca = new PublicClientApplication(msalConfig);
await pca.initialize();

createRoot(document.getElementById("root")!).render(
  <MsalProvider instance={pca}>
    <App />
  </MsalProvider>,
);
```

Now a hook that returns a Graph client wired with on-demand token acquisition:

```ts
import { Client } from "@microsoft/microsoft-graph-client";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export function useGraphClient(scopes: string[]) {
  const { instance, accounts } = useMsal();

  return Client.init({
    authProvider: async (done) => {
      const account = accounts[0];
      if (!account) return done("No account", null);
      try {
        const result = await instance.acquireTokenSilent({ scopes, account });
        done(null, result.accessToken);
      } catch (err) {
        if (err instanceof InteractionRequiredAuthError) {
          const result = await instance.acquireTokenPopup({ scopes, account });
          done(null, result.accessToken);
        } else {
          done(err as Error, null);
        }
      }
    },
  });
}
```

And a component that uses it:

```tsx
import { useEffect, useState } from "react";
import { useGraphClient } from "./useGraphClient";

interface Message { id: string; subject: string; from: { emailAddress: { name: string } } }

export function RecentMail() {
  const graph = useGraphClient(["Mail.Read"]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    graph.api("/me/messages")
      .top(5)
      .select("subject,from")
      .get()
      .then((res) => setMessages(res.value));
  }, []);

  return (
    <ul>
      {messages.map((m) => (
        <li key={m.id}>
          <strong>{m.from.emailAddress.name}</strong>: {m.subject}
        </li>
      ))}
    </ul>
  );
}
```

That's the entire frontend Graph path. MSAL caches tokens silently, the Graph SDK handles paging and retry, and the SWA platform handles the session cookie.

---

## Server-Side Graph Calls with On-Behalf-Of

Some queries shouldn't run from the browser. Tenant-wide group enumeration, license assignment, audit logs — all things you don't want a curious user to inspect via DevTools. Push them to a Function and use the **On-Behalf-Of (OBO)** flow to swap the user's token for a Graph token, server-side, while still acting as the user.

First, in your frontend, request a token for your own API's scope and forward it:

```ts
const apiToken = await instance.acquireTokenSilent({
  scopes: [`api://${import.meta.env.VITE_AAD_CLIENT_ID}/access_as_user`],
  account: accounts[0],
});

const res = await fetch("/api/group-members?groupId=" + groupId, {
  headers: { Authorization: `Bearer ${apiToken.accessToken}` },
});
const members = await res.json();
```

Then in `api/src/group-members/index.ts`:

```ts
import { app, HttpRequest, InvocationContext, HttpResponseInit } from "@azure/functions";
import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

async function exchangeToken(userAssertion: string): Promise<string> {
  const tenant = process.env.AAD_TENANT_ID!;
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    client_id: process.env.AAD_CLIENT_ID!,
    client_secret: process.env.AAD_CLIENT_SECRET!,
    assertion: userAssertion,
    scope: "https://graph.microsoft.com/.default",
    requested_token_use: "on_behalf_of",
  });

  const r = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  if (!r.ok) throw new Error(`OBO failed: ${r.status} ${await r.text()}`);
  return (await r.json()).access_token as string;
}

export async function groupMembers(req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return { status: 401, body: "Missing bearer" };

  const groupId = req.query.get("groupId");
  if (!groupId) return { status: 400, body: "groupId required" };

  const graphToken = await exchangeToken(auth.slice(7));
  const graph = Client.init({ authProvider: (done) => done(null, graphToken) });

  const members = await graph.api(`/groups/${groupId}/members`)
    .select("id,displayName,mail")
    .top(100)
    .get();

  return { jsonBody: members.value };
}

app.http("group-members", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: groupMembers,
});
```

The `authLevel: "anonymous"` is fine — SWA's `routes` rule already gates `/api/*` to authenticated users. The `assertion` we hand to Entra ID is the user's own token, which is why this counts as acting on behalf of the user rather than as the app itself. The user's permission grants still apply.

---

## Local Development with the SWA CLI

Local dev is where most teams give up and just push to a dev SWA. Don't — the CLI is good in 2026:

```bash
npm install -g @azure/static-web-apps-cli
swa start http://localhost:5173 --api-location ./api --run "npm run dev"
```

This boots Vite, the Functions runtime, and the SWA emulator at `http://localhost:4280`. Auth still works locally: visit `/.auth/login/aad` and the emulator presents a fake claims form where you set the user identity. For Graph calls you need real tokens, so most teams do MSAL against a "dev" app registration with `http://localhost:4280` as a redirect URI.

Two things will bite you locally:

1. **CORS on the Functions side.** The SWA emulator serves both frontend and Functions on the same origin, so you don't usually need extra CORS config. If you split them, set `Host` config in `local.settings.json`.
2. **Different redirect URIs per environment.** Add both the prod and `localhost:4280` redirects in the app registration. Also add the `localhost:5173` Vite dev port if you ever run Vite standalone.

---

## Production Hardening

Before you tweet the URL:

- **Lock the audience.** Validate the `aud` and `iss` claims of the bearer token in your Function before calling Graph. The MSAL token from the frontend should have `aud = api://<your-client-id>` and `iss = https://sts.windows.net/<tenant>/`. The OBO call will fail if the audience is wrong, but you waste a network round-trip on every bad request unless you reject early.
- **Pin Graph endpoints.** Use the `v1.0` endpoint (`https://graph.microsoft.com/v1.0/...`) for stable surfaces; only opt into `beta` per-call when you have a specific reason. The Graph SDK lets you do this with `.api(...).version("beta")`.
- **Rate limit your Functions.** SWA Standard tier has built-in concurrency limits but not per-user rate limiting. Add a simple memory-cache layer keyed by user oid for read-heavy endpoints.
- **Logging.** Application Insights is one toggle in SWA — turn it on. Without it, debugging an OBO failure means staring at "401 from Graph" with no further clues.
- **Custom domain.** Put `app.contoso.com` in front of the `azurestaticapps.net` URL and update the Entra redirect URIs to match. SWA-managed certs renew automatically.
- **Conditional Access.** If the tenant requires CA policies, your app registration must be marked accordingly. The user sees the CA prompt mid-flow, and your CSP must allow `https://login.microsoftonline.com` (already covered above).

---

## Common Pitfalls

**"AADSTS50011: Reply URL does not match"** — you forgot to add the SWA callback URL to the Entra app registration. The exact URL is `https://<your-swa>.azurestaticapps.net/.auth/login/aad/callback`. Trailing slash matters.

**"AADSTS500011: Resource not found in tenant"** — the `scope` you're requesting points to an Application ID URI that doesn't exist. Either you typoed `api://<client-id>/access_as_user` or you skipped the **Expose an API** step.

**Graph returns 401 from the Function but 200 from the frontend** — almost always an OBO mistake. The most common is requesting `Mail.Read` from MSAL but `https://graph.microsoft.com/.default` in the OBO exchange without the user having consented to `.default`. Use `Mail.Read` on both sides during dev, then move to admin-consented scopes in prod.

**MSAL token request hangs forever** — popup blockers. Use `acquireTokenSilent` first, fall back to `acquireTokenRedirect` (not popup) if you are inside an iframe like a Teams tab.

**`/.auth/me` returns null** even after sign-in — the SWA cookie did not survive the redirect, usually because you have `same-site=Strict` overrides in `staticwebapp.config.json`. Remove or change to `Lax`.

**Function deploys but never runs** — check `host.json` is at `api/host.json`, not the repo root. SWA's build pipeline ignores a misplaced one silently.

---

## Wrapping Up

You now have an SWA-hosted M365 dashboard that authenticates via Entra ID, calls Graph from the browser with MSAL for low-risk reads, and routes higher-trust calls through a Function using On-Behalf-Of. That is the same architecture Microsoft's own internal tools tend to use for tenant dashboards in 2026 — minus the unnecessary Kubernetes that your team does not need.

If you want to go deeper on the auth side, my [Microsoft Graph API Authentication Guide](/blog/microsoft-graph-api-authentication-guide) walks through MSAL configuration in detail, and the [Microsoft Graph $batch Requests guide](/blog/microsoft-graph-batch-requests-combine-api-calls-2026) is essential reading once your dashboard starts making more than two or three Graph calls per page render. For ironclad production behavior, also read the [Microsoft Graph Throttling guide](/blog/microsoft-graph-throttling-survive-429-retry-backoff-2026) — SWA traffic spikes are exactly when 429s show up.

The full repo for this article lives in a public template you can clone and rebrand — start there if you'd rather skip the scaffolding and jump straight to the Graph calls.
