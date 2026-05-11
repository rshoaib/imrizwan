---
title: "SPFx Library Components: Share Code, Services & Types Across Web Parts (2026)"
slug: spfx-library-components-share-code-services-2026
excerpt: "Stop copy-pasting helpers between SPFx solutions. Build a library component once, expose typed services and React components, and version it cleanly across your tenant."
date: "2026-05-11T09:00:00.000Z"
displayDate: "May 11, 2026"
readTime: "13 min read"
category: "SPFx"
image: "/images/blog/spfx-library-components-share-code-services-2026.png"
tags:
  - "SPFx"
  - "Library Component"
  - "TypeScript"
  - "React"
  - "SharePoint Online"
  - "SharePoint"
  - "2026"
---

## Why Library Components Matter in 2026

Every SPFx tenant I have audited eventually grows the same disease. The first solution ships with a tidy `services/GraphService.ts`, a `utils/formatDate.ts`, and a small `<UserCard />` React component. The second solution copy-pastes them. The third solution copy-pastes a slightly older version. Two years in, the tenant has nine variants of the "same" Graph wrapper, three of them with subtle bugs, two of them logging telemetry to a property bag nobody updates, and the people who wrote the originals have left. A breaking change in the Graph SDK means rewriting nine places at once.

SharePoint Framework Library Components solve exactly this problem. They were introduced years ago, but in 2026 — with the new SPFx CLI replacing the Yeoman generator and tenant-wide app deployment now standard for most enterprises — they have become the de-facto answer for any code shared across more than one solution. A library component is just an SPFx package whose output is a versioned, tenant-deployable JavaScript module that other SPFx web parts and extensions can `import` from like any npm package, but at runtime the bits are loaded from the SharePoint App Catalog, not bundled into every consumer.

This guide walks through building a real library component end-to-end with the modern toolchain: scaffolding with the SPFx CLI, exposing a typed singleton service via `ServiceKey`, sharing React components and types, and the versioning rules that keep the whole arrangement from collapsing the first time you ship a breaking change.

## What a Library Component Actually Is (and What It Isn't)

A library component is a SPFx component type — same family as web parts, extensions, and ACEs — but it does not render anything by itself. Its job is to expose **named exports** to other SPFx components running on the same page. The SPFx loader (SystemJS under the hood) resolves the import at runtime, deduplicates instances, and wires up the version that is installed in the tenant App Catalog.

A few distinctions are easy to get wrong:

- A library component is **not an npm package**. You install it into the tenant via the App Catalog, not into your `node_modules`. Consumers reference it by component ID, not by `npm install`.
- A library component is **not a shared bundle**. The runtime loader caches it once per page, so two web parts on the same page share **one** instance — which is exactly what makes the singleton-service pattern work.
- A library component is **not magic dependency injection**. There is no IoC container. You expose a `ServiceKey<T>` and consumers ask the `serviceScope` for the implementation; that is the whole protocol.
- A library component **must follow semver** discipline. Because the loader resolves by component ID + version, shipping a breaking change as a minor bump silently breaks every consumer the next time they hot-reload.

If what you actually want is "code reuse inside one solution," do not reach for a library component — use a normal `lib/` folder. Library components only earn their keep when the same code needs to ship to more than one solution, when you want to upgrade consumers independently, or when you want to centralize cross-cutting concerns like telemetry, feature flags, or a Graph wrapper.

## Scaffolding a Library Component with the New SPFx CLI

The new `@microsoft/spfx` CLI (replacing the Yeoman generator) ships a library template directly. If you have not migrated yet, see [migrating from Yeoman to the new SPFx CLI](/blog/spfx-cli-migrate-yeoman-heft-2026) first — the rest of this post assumes the new toolchain.

Create a new solution and pick the library template:

```bash
# install the CLI globally if you have not already
npm install -g @microsoft/spfx

# scaffold a new library component
mkdir contoso-spfx-shared && cd contoso-spfx-shared
spfx init --component-type library \
          --component-name ContosoShared \
          --solution-name contoso-spfx-shared \
          --no-prompt
```

The generated solution looks similar to a web part solution, with two important differences. First, the `src/libraries/contosoShared/` folder contains an `index.ts` instead of a manifest tied to a render method. Second, `config/package-solution.json` declares the component with `"componentType": "Library"` and a `componentId` GUID — that GUID is the public identity of the library and must never change once you have shipped.

```json
// config/package-solution.json (excerpt)
{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/package-solution.schema.json",
  "solution": {
    "name": "Contoso Shared Library",
    "id": "8a2b3c4d-1111-4444-aaaa-bbbbccccdddd",
    "version": "1.0.0.0",
    "isLibrary": true,
    "skipFeatureDeployment": true,
    "developer": {
      "name": "Contoso Platform Team",
      "websiteUrl": "https://contoso.sharepoint.com",
      "privacyUrl": "https://contoso.com/privacy",
      "termsOfUseUrl": "https://contoso.com/terms",
      "mpnId": ""
    }
  },
  "paths": {
    "zippedPackage": "solution/contoso-spfx-shared.sppkg"
  }
}
```

`isLibrary: true` flips the loader behavior so the .sppkg is treated as a runtime dependency rather than a renderable app. `skipFeatureDeployment: true` means the library is auto-available on every site once you upload to the tenant App Catalog — which is what you want; you do not need users adding "the library" as an app on every site.

Open `src/libraries/contosoShared/index.ts` and you will find an empty barrel file. Everything you put here — and re-export — becomes part of your public surface. Treat it like a published package's `index.ts`: anything you export is forever, anything you do not export is private.

## Exposing a Typed Service with ServiceKey

The pattern that makes library components worth the trouble is the typed singleton service. SPFx ships with a tiny IoC system (`ServiceScope` + `ServiceKey`) that lets a library declare "here is the contract; here is the default implementation," and any consumer that has a `serviceScope` (every web part and extension does) can resolve it. Because the loader caches the library bundle, two web parts on the same page get the **same instance** — so a single Graph token cache, a single MSAL pop-up, a single telemetry batcher.

Here is a minimal Graph wrapper exposed as a library service:

```ts
// src/libraries/contosoShared/services/IGraphHelper.ts
export interface IGraphHelper {
  getMe(): Promise<{ id: string; displayName: string; mail?: string }>;
  getMyManager(): Promise<{ id: string; displayName: string } | null>;
  search<T>(entityType: "driveItem" | "listItem", query: string): Promise<T[]>;
}
```

```ts
// src/libraries/contosoShared/services/GraphHelper.ts
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { MSGraphClientV3, MSGraphClientFactory } from "@microsoft/sp-http";
import { IGraphHelper } from "./IGraphHelper";

export class GraphHelper implements IGraphHelper {
  public static readonly serviceKey: ServiceKey<IGraphHelper> =
    ServiceKey.create<IGraphHelper>("contoso:GraphHelper", GraphHelper);

  private _clientPromise: Promise<MSGraphClientV3>;

  constructor(serviceScope: ServiceScope) {
    serviceScope.whenFinished(() => {
      const factory = serviceScope.consume(MSGraphClientFactory.serviceKey);
      this._clientPromise = factory.getClient("3");
    });
  }

  public async getMe() {
    const client = await this._clientPromise;
    return client.api("/me").select("id,displayName,mail").get();
  }

  public async getMyManager() {
    const client = await this._clientPromise;
    try {
      return await client.api("/me/manager").select("id,displayName").get();
    } catch (err: any) {
      if (err?.statusCode === 404) return null;
      throw err;
    }
  }

  public async search<T>(entityType: "driveItem" | "listItem", query: string) {
    const client = await this._clientPromise;
    const body = {
      requests: [
        { entityTypes: [entityType], query: { queryString: query } },
      ],
    };
    const res = await client.api("/search/query").post(body);
    return (res.value?.[0]?.hitsContainers?.[0]?.hits ?? []).map((h: any) => h.resource as T);
  }
}
```

Two things to notice. The `ServiceKey.create("contoso:GraphHelper", GraphHelper)` call gives the contract a stable string ID — pick a vendor prefix and stick to it forever, the same way Java packages are namespaced. The `serviceScope.whenFinished` callback defers the `MSGraphClientFactory` lookup until the SPFx scope is fully constructed; doing it in the constructor body directly works in dev but blows up in production where the factory may not be wired yet.

Re-export from the barrel:

```ts
// src/libraries/contosoShared/index.ts
export { GraphHelper } from "./services/GraphHelper";
export type { IGraphHelper } from "./services/IGraphHelper";
```

A consumer web part now uses it with two lines:

```ts
// in a consumer web part
import { GraphHelper, IGraphHelper } from "contoso-spfx-shared";

protected onInit(): Promise<void> {
  this._graph = this.context.serviceScope.consume(GraphHelper.serviceKey);
  return Promise.resolve();
}

private _graph: IGraphHelper;

private async _loadUser(): Promise<void> {
  const me = await this._graph.getMe();
  this.domElement.querySelector(".user")!.textContent = me.displayName;
}
```

The `serviceScope.consume(GraphHelper.serviceKey)` call is what guarantees you get the page-wide singleton. Call it once in `onInit`, cache the instance, and every other web part on the page that does the same gets the same object — which means the underlying MSAL token cache, batch queue, or telemetry buffer is shared.

If you want a richer wrapper than the raw Graph SDK gives you, see [PnP JS in SPFx](/blog/spfx-pnp-js-sharepoint-data) — the same library-component pattern works for wrapping PnP JS, and it is often a cleaner public contract than the raw `MSGraphClient`.

## Sharing React Components and TypeScript Types

Library components shine for non-render code, but they are also the right home for **shared UI primitives** — the buttons, cards, and dialog wrappers that every web part on your tenant should look identical with. Put them in the library, version them, and consumers get pixel-perfect consistency without copy-pasted Fluent UI imports.

Add a React component to the library:

```tsx
// src/libraries/contosoShared/components/UserCard.tsx
import * as React from "react";
import { Persona, Text, mergeClasses, makeStyles } from "@fluentui/react-components";

export interface IUserCardProps {
  displayName: string;
  email?: string;
  imageUrl?: string;
  compact?: boolean;
  className?: string;
}

const useStyles = makeStyles({
  card: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "8px",
    backgroundColor: "var(--colorNeutralBackground2)",
  },
  compact: { padding: "6px 8px" },
});

export const UserCard: React.FC<IUserCardProps> = ({
  displayName,
  email,
  imageUrl,
  compact,
  className,
}) => {
  const styles = useStyles();
  return (
    <div className={mergeClasses(styles.card, compact && styles.compact, className)}>
      <Persona
        name={displayName}
        secondaryText={email}
        avatar={{ image: imageUrl ? { src: imageUrl } : undefined }}
        size={compact ? "small" : "medium"}
      />
      {!compact && email && <Text size={200}>{email}</Text>}
    </div>
  );
};
```

Re-export from the barrel:

```ts
// src/libraries/contosoShared/index.ts
export { UserCard } from "./components/UserCard";
export type { IUserCardProps } from "./components/UserCard";
```

A consumer simply imports it:

```tsx
import { UserCard } from "contoso-spfx-shared";

<UserCard displayName="Ada Lovelace" email="ada@contoso.com" compact />
```

Three rules keep shared UI sane. First, every prop must be optional or have a sensible default — adding a required prop is a breaking change. Second, never accept a free-form `style={{}}` prop; expose a `className` slot instead so consumers cannot reach inside your design tokens. Third, peg the library to a specific Fluent UI v9 version and document it in the README — if a consumer pulls in a different Fluent version, you get two design systems on the page, and SPFx's bundle dedup will not save you. (Fluent UI v9 with SPFx has its own gotchas; see the [Fluent UI v9 SPFx migration guide](/blog/spfx-fluent-ui-v9-web-parts-migration-guide-2026).)

For shared TypeScript types — the kind every consumer needs to type a Graph response or a list item — export them as `type` declarations from the same barrel. They cost nothing at runtime and disappear in compilation, so there is no dedup worry:

```ts
// src/libraries/contosoShared/types/index.ts
export interface ITenantUser {
  id: string;
  displayName: string;
  mail?: string;
  jobTitle?: string;
  department?: string;
}

export interface IDocumentHit {
  id: string;
  name: string;
  webUrl: string;
  lastModifiedDateTime: string;
  modifiedBy: { displayName: string };
}

// re-export from src/libraries/contosoShared/index.ts
export type { ITenantUser, IDocumentHit } from "./types";
```

## Versioning, Deployment & Tenant-wide Considerations

Library components live or die on versioning discipline. The SPFx loader caches the library bundle by `componentId` — so two consumers asking for the same component on the same page get the **same** version, even if they were built against different package versions. That is convenient until you ship a breaking change.

The rules I have learned the hard way:

1. **Bump `version` in `package-solution.json` on every change.** Vercel-style "zero downtime" requires that consumers see a new bundle; the loader uses this to invalidate caches.
2. **Treat the major version as a hard contract.** Consumers should `npm install contoso-spfx-shared@^2.0.0`, not `*`. When you ship 3.0.0 with a breaking change, old consumers keep resolving to the latest 2.x bundle deployed to the tenant.
3. **Deploy multiple major versions side-by-side** during migration windows. Because each version is its own .sppkg with its own `componentId` (or, more commonly, the same `componentId` with version negotiation), you can ship `contoso-spfx-shared` and `contoso-spfx-shared-v3` to the App Catalog at the same time. Most teams find it simpler to allocate a fresh `componentId` for major v3 and let consumers migrate at their own pace.
4. **Never delete a public export.** Even renaming `getMe()` to `getCurrentUser()` is breaking. Add the new name, mark the old name `@deprecated`, and remove only at the next major.

Deployment is straightforward. Build the package, upload to the tenant App Catalog, and tick **Make this solution available to all sites in the organization**:

```bash
# from the library solution root
npm run build
gulp bundle --ship
gulp package-solution --ship
# upload sharepoint/solution/contoso-spfx-shared.sppkg to:
# https://<tenant>-admin.sharepoint.com/_layouts/15/online/AppCatalog.aspx
```

Because `isLibrary: true` and `skipFeatureDeployment: true` are set, no per-site activation is needed — the library is loadable anywhere in the tenant the moment it is deployed. Consumer web parts deployed afterward pick up the new version on the next page load (the loader respects browser cache, so a hard reload may be needed in the first few minutes).

For local development, consumers reference the library through `npm link` or a private feed pointing at the library's `lib/` output. Production builds resolve from the App Catalog instead — same imports, different runtime origin. The CLI's `serve` command will warn if a library reference cannot be resolved locally; treat that warning as an error in CI.

## Common Pitfalls & FAQ

**My web part says `Cannot find module 'contoso-spfx-shared'` but the library is deployed.** The library .sppkg is in the tenant App Catalog, but the consumer was built against a different `componentId` than the deployed package. Open the consumer's `package-solution.json`, find the `componentDependencies` block (added by SPFx when you scaffolded the consumer), and confirm the GUID matches the deployed library.

**Two web parts on the same page each get their own instance of my service.** You either forgot the `ServiceKey.create` call (and are exporting a class, not a service contract), or you are calling `new GraphHelper(...)` directly in the consumer instead of `serviceScope.consume(GraphHelper.serviceKey)`. The singleton guarantee is provided by the scope, not the import.

**Hot reload picks up library changes locally but production never updates.** You forgot to bump `version` in `package-solution.json`, or you bumped the npm `package.json` version but not the SPFx solution version. The App Catalog dedupes by solution version; without a bump, the old bundle stays cached.

**Adding a Fluent UI v9 component to my library doubled my consumers' bundle size.** The library and the consumer are pulling in different Fluent UI v9 versions, so dedup fails. Pin Fluent UI v9 to a specific version in the library's `package.json` and document it; consumers must match. SPFx bundle analyzers will show the duplicate React contexts as a giveaway.

**Can a library component itself depend on another library component?** Yes — declare the dependency in `package-solution.json` under `componentDependencies`. Be careful with version cycles; in 2026 the loader still does not detect circular library deps and will fail with an opaque "Component not registered" error at runtime.

**Should I publish my library to npm as well?** For TypeScript types only, yes — that gives consumers IntelliSense without a tenant deploy. For runtime code, no — npm and the App Catalog will diverge, and you will spend the rest of your career chasing version skew. Keep the App Catalog as the single source of truth for runtime bits.

**Does this work with extensions and ACEs, not just web parts?** Yes. Anywhere you have a `serviceScope`, the `serviceScope.consume(...)` pattern works identically. Application customizers, command sets, field customizers, and Viva Connections ACEs are all valid consumers.

## Wrapping Up

A library component is not exotic infrastructure — it is just an SPFx solution that exports things instead of rendering things, deployed to the tenant App Catalog and loaded at runtime by anyone who imports it. The hard parts are the discipline around it: a stable `ServiceKey` namespace, religious semver, a barrel file you treat as a public contract, and a Fluent UI version pin you commit to in writing.

Get those right and you stop maintaining nine variants of the same Graph wrapper. Get them wrong and you have invented a worse copy-paste with extra deployment steps. The patterns in this post — typed singleton services via `ServiceKey`, slot-based React components, types as the public contract — are the ones I have seen survive multi-year tenant rollouts intact.

If you are still on the Yeoman generator, start with the [SPFx CLI migration guide](/blog/spfx-cli-migrate-yeoman-heft-2026) before adopting library components — the new template makes everything in this post one command instead of three. And if your library will wrap SharePoint data access specifically, [PnP JS in SPFx](/blog/spfx-pnp-js-sharepoint-data) pairs naturally with the library-component pattern: one PnP setup, one batched `sp` instance, every consumer reusing the same configured client.
