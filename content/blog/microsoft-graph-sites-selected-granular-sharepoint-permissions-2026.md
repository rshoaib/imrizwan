---
title: "Microsoft Graph Sites.Selected: Least-Privilege SharePoint App Permissions (2026)"
slug: microsoft-graph-sites-selected-granular-sharepoint-permissions-2026
excerpt: "Replace Sites.Read.All and Sites.FullControl.All with Sites.Selected — grant a single app access to only the SharePoint sites it needs, with PowerShell and Graph code."
date: "2026-05-05T11:00:00.000Z"
displayDate: "May 5, 2026"
readTime: "13 min read"
category: "Graph API"
image: "/images/blog/microsoft-graph-sites-selected-granular-sharepoint-permissions-2026.png"
tags:
  - "Microsoft Graph"
  - "SharePoint"
  - "Sites.Selected"
  - "Entra ID"
  - "App Permissions"
  - "Security"
  - "2026"
---

## The Permission That Tenant Admins Actually Approve in 2026

If you have submitted a Graph app registration to a Microsoft 365 tenant admin in the last twelve months, you have probably watched them recoil at the words `Sites.Read.All` or, worse, `Sites.FullControl.All`. Those permissions grant your app access to every SharePoint site, every OneDrive, every team site, every executive document library in the tenant. For a tool that needs one HR site, that is dramatically more access than anyone wants to approve — and most enterprise admins now refuse the consent outright.

`Sites.Selected` is the permission that actually gets approved. It is the SharePoint equivalent of resource-specific consent: the app is registered with the right to access SharePoint, but it gets zero sites by default. A SharePoint admin then grants it `read` or `write` access to specific sites, one at a time, using the Graph API. Revoke a single site and the app loses access to that site only. There is no broad scope to compromise.

This guide walks through what `Sites.Selected` is, how it differs from the legacy permissions, how to register the app, how to grant a site-specific role with PowerShell or Graph, how to call the Graph API once you are authorized, and the common 403s you will hit on the way. By the end you will have a working app-only integration that a security-conscious admin will sign off on without an hour-long meeting.

## What Sites.Selected Actually Grants

The first thing that confuses people is that `Sites.Selected` is a Graph permission, but the *grant* of which sites the app can read or write is configured separately on each site. The flow is:

1. Register an app and request `Sites.Selected` (Application permission).
2. A tenant admin consents to `Sites.Selected`.
3. A SharePoint admin (or owner of a specific site, depending on your config) calls Graph to grant your app a role — `read`, `write`, `manage`, or `fullControl` — on a single site.
4. Your app calls Graph against that site only. Any attempt to access a different site returns `403 Forbidden`.

The roles map roughly onto SharePoint's permission levels: `read` lets you list and read items; `write` adds create/update/delete; `manage` adds settings and lists management; `fullControl` is everything except site collection administration. Most production apps need `read` or `write`. Reach for `manage` only if you genuinely need to mutate site-level settings, and almost never use `fullControl` from app-only code — you can do every legitimate operation with `manage` plus targeted list permissions.

The legacy `Sites.Read.All` and `Sites.FullControl.All` give the same operations, but tenant-wide. Compare:

```
Sites.Read.All           → app can read every site in the tenant
Sites.FullControl.All    → app can do anything on every site in the tenant
Sites.Selected + read    → app can read exactly the sites you grant
Sites.Selected + write   → app can read+write exactly the sites you grant
```

If you have an app today asking for `Sites.Read.All`, you can almost certainly migrate it to `Sites.Selected`. The exception is search-style scenarios where the app legitimately needs to query across the whole tenant — but even there, [Microsoft Graph Connectors](/blog/microsoft-graph-connectors-copilot-search-guide-2026) are usually a better fit than a wide-open Graph permission.

## Register the App in Entra ID

Open the Microsoft Entra admin center, go to App registrations, and create a new registration. Single-tenant is fine for internal apps. After creation, note the **Application (client) ID** and **Directory (tenant) ID** from the overview page.

Under **Certificates & secrets**, generate a client secret and store it in your secret manager. For production, use a certificate instead of a client secret — Microsoft has been steadily moving toward certificate-only auth for app-only Graph access, and your security team will appreciate the switch.

Under **API permissions**, add the Microsoft Graph **Application** permission `Sites.Selected`. Then click **Grant admin consent**. Application permissions require admin consent regardless of permission scope — `Sites.Selected` is not magically self-service. The consent simply registers that the app is allowed to be granted site-specific roles; it does not grant any sites yet.

A common stumble: people add `Sites.Selected` as a *delegated* permission and wonder why nothing works. Sites.Selected only exists as an Application permission. Delegated calls to SharePoint use the user's own permissions and do not need any tenant-wide Graph permission, so there is nothing to "select" in the delegated path.

## Grant a Site Role via Graph

Granting a role to your app on a specific site is itself a Graph call. You need someone with `Sites.FullControl.All` (or a SharePoint Administrator role) to make the call once per app, per site. The payload looks like this:

```http
POST https://graph.microsoft.com/v1.0/sites/{site-id}/permissions
Content-Type: application/json

{
  "roles": ["write"],
  "grantedToIdentities": [
    {
      "application": {
        "id": "11111111-2222-3333-4444-555555555555",
        "displayName": "HR Onboarding Bot"
      }
    }
  ]
}
```

`{site-id}` is the Graph site identifier — the comma-separated tuple `hostname,site-collection-guid,site-guid`. You can grab it for any site with:

```http
GET https://graph.microsoft.com/v1.0/sites/contoso.sharepoint.com:/sites/HR
```

The response includes the canonical `id` field. Save it in your config; do not try to look it up at runtime on every call — it never changes for a given site.

The response from the `POST /permissions` call returns a permission ID. Save that too. You will need it later to update the role (for example to upgrade from `read` to `write`) or to revoke access entirely.

Updating an existing grant uses `PATCH`:

```http
PATCH https://graph.microsoft.com/v1.0/sites/{site-id}/permissions/{permission-id}
Content-Type: application/json

{
  "roles": ["read"]
}
```

Revoking is a `DELETE` against the same URL. Revocation is immediate — the next Graph call from your app will return `403`.

## PowerShell: The One-Liner Most Teams Use

Hand-crafting Graph calls is fine for a custom admin portal, but most internal teams just want a script. The Microsoft Graph PowerShell SDK exposes the same operations:

```powershell
Connect-MgGraph -Scopes "Sites.FullControl.All"

$siteId = (Get-MgSite -SiteId "contoso.sharepoint.com:/sites/HR").Id

$params = @{
  Roles = @("write")
  GrantedToIdentities = @(
    @{
      Application = @{
        Id          = "11111111-2222-3333-4444-555555555555"
        DisplayName = "HR Onboarding Bot"
      }
    }
  )
}

New-MgSitePermission -SiteId $siteId -BodyParameter $params
```

This is the canonical script you will hand to a SharePoint admin when onboarding a new app. Keep it in your repo alongside the app code — the next person who needs to grant access in a different environment will thank you. Pair it with a similarly small revoke script (`Remove-MgSitePermission`) so the admin never has to read Graph docs to clean up.

If your tenant still relies on PnP PowerShell, the equivalent is `Grant-PnPAzureADAppSitePermission`. Both work; pick the one your team already uses. There is a quick reference for the broader set of SharePoint admin scripts in the [PnP PowerShell guide](/blog/pnp-powershell-sharepoint-online-scripts-admin-guide-2026) on this site.

## Calling Graph from Your App

Once the role is granted, calling Graph is straightforward — it is no different from any other app-only flow. Acquire a token with the client credentials grant, then call any site-scoped endpoint.

Here is a full TypeScript example using `@azure/identity` and `@microsoft/microsoft-graph-client`:

```ts
import { ClientSecretCredential } from "@azure/identity";
import {
  Client,
  AuthenticationProvider,
} from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";

const tenantId = process.env.TENANT_ID!;
const clientId = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;
const siteId = process.env.HR_SITE_ID!; // hostname,collGuid,siteGuid

const credential = new ClientSecretCredential(
  tenantId,
  clientId,
  clientSecret
);

const authProvider: AuthenticationProvider = {
  getAccessToken: async () => {
    const token = await credential.getToken(
      "https://graph.microsoft.com/.default"
    );
    if (!token) throw new Error("Failed to acquire Graph token");
    return token.token;
  },
};

const graph = Client.initWithMiddleware({ authProvider });

// List drives on the HR site — works because we granted "write" earlier
const drives = await graph.api(`/sites/${siteId}/drives`).get();
console.log(drives.value.map((d: any) => d.name));

// Read items in the default drive
const items = await graph.api(`/sites/${siteId}/drive/root/children`).get();
console.log(items.value.length, "items");
```

The same pattern works against any site-scoped endpoint: `/sites/{id}/lists`, `/sites/{id}/pages`, `/sites/{id}/onenote`, and so on. There is no special header to add and no `Sites.Selected` claim to inspect — the Graph service knows your app's grants and enforces them transparently.

What you cannot do with `Sites.Selected` is iterate the tenant. Calls like `GET /sites?search=*` or `GET /sites/getAllSites` will return `403`. If you need a list of sites you have access to, store it in your app config or, better, get the list from the same place that calls your grant script — typically a list of "tenant onboarding entries" maintained by the team that owns the app.

## Common Pitfalls

By far the most reported problem is "everything looks correct but I get `403 Forbidden`." The fix is almost always one of three things:

The app was granted access with the wrong client ID. Easy to do when you have a dev and prod registration with similar names. Compare the `id` in the `grantedToIdentities` payload to the **Application (client) ID** in Entra. They must match exactly — Graph does not warn you when you mistype it.

The role is `read` and you tried to write. The error message is just `403`, with no hint that an upgrade to `write` would fix it. Pull the current grant with `GET /sites/{id}/permissions` and check the `roles` array.

You are calling a non-site-scoped endpoint. `/users`, `/groups`, `/me`, and the search APIs are not gated by `Sites.Selected`. Even if you have site grants, those endpoints return `403` with app-only credentials unless you also have the matching tenant-wide permission. Sites.Selected only authorizes calls under `/sites/{id}`.

A subtler one: lists created before the app was granted access can sometimes appear in the drive listing but `403` on item-level reads if the list itself has unique permissions. Sites.Selected respects SharePoint-side ACLs on top of the Graph permission. If a list is broken-inheritance restricted, you must either restore inheritance or add the app's service principal to the list's permissions directly.

Finally, a process pitfall: do not store the bearer token across runs. The default `ClientSecretCredential` caches tokens in memory for the lifetime of the process, which is correct for a long-lived service. For Functions or short-lived scripts, that cache is empty on every cold start — you do not need to do anything special, but do not roll your own caching layer with a TTL longer than the token's expiry. The Graph SDK retries on 401 by default and will get a fresh token when the cached one expires.

## Auditing and Revoking Access

You should be able to answer two questions at any time: which sites does my app have access to, and how do I cut that access if it leaks. Both are one Graph call.

```http
GET https://graph.microsoft.com/v1.0/sites/{site-id}/permissions
```

Run that for each site you intend to control and you have a complete grant inventory. There is no tenant-wide "list all Sites.Selected grants for app X" endpoint as of writing — you have to walk the sites you know about. For a managed-service style integration where one team controls onboarding, this is fine; build the inventory list at grant time and persist it.

Revocation, as noted, is `DELETE /sites/{id}/permissions/{permId}`. The companion script you give the SharePoint admin should know how to do this without help, because the day someone calls saying "rotate the secret, the app might be compromised" you do not want to be reading Graph docs.

For a defense-in-depth view, also turn on **Microsoft Purview audit logging** for SharePoint. App-only operations show up under the app's display name in the unified audit log, with the site and the action — exactly what you need for incident response. The [enterprise governance checklist](/blog/enterprise-governance-sharepoint-ai-developer-checklist) on this site goes deeper into the audit configuration if you have not set it up yet.

## Migrating an Existing App from Sites.Read.All

If you already have a production app on `Sites.Read.All`, the migration plan is mechanical:

Add the `Sites.Selected` permission alongside the existing one. Do not remove `Sites.Read.All` yet.

Identify every site the app actually touches. The audit log is the cleanest source — query the last 30 days of operations from the app's service principal and group by site. You will usually find a much smaller list than the team thinks.

Run the grant script for each site, with the role the app needs (`read` or `write`).

Deploy a code change that removes any cross-site iteration and pins to a configurable list of site IDs. Test against the new permission only by temporarily removing admin consent for `Sites.Read.All` in a non-prod tenant — you will get fast feedback on anything you missed.

Finally, remove `Sites.Read.All` from the app registration and re-consent. Your security team will likely want this commit reviewed; surface it.

The same playbook works for `Sites.FullControl.All` → `Sites.Selected` + `write` or `manage`. Most apps that asked for `FullControl` did not actually need it and were either over-cautious or copied a sample from a blog post. Sites.Selected is a chance to fix that.

## Wrapping Up

`Sites.Selected` is a small permission with an outsized impact on whether your Microsoft 365 app gets approved in 2026. The mechanics — register the app, grant per-site roles, call Graph normally — are simple once you have done it once. The hard part is convincing yourself, and your team, that the marginal hassle of explicit grants is worth the dramatic reduction in blast radius. It is.

If you are building a fuller Graph-backed integration, two related guides on this site will save you time: the [Microsoft Graph API authentication guide](/blog/microsoft-graph-api-authentication-guide) covers the full app-only flow including certificate auth, and the [Microsoft Graph $batch requests guide](/blog/microsoft-graph-batch-requests-combine-api-calls-2026) shows how to compose multiple Sites.Selected calls into a single round trip. For the throttling layer that production apps inevitably need, see the [Graph throttling guide](/blog/microsoft-graph-throttling-survive-429-retry-backoff-2026).
