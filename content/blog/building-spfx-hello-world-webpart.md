---
title: "Build Your First SPFx Web Part: Hello World Guide (2026)"
slug: building-spfx-hello-world-webpart
excerpt: "Create and deploy your first SharePoint Framework web part using the modern SPFx CLI with Heft. Works in SharePoint, Teams, and Viva."
date: "2026-02-18"
displayDate: "February 18, 2026"
readTime: "15 min read"
image: "/images/blog/spfx-custom-webpart-guide.png"
category: "SPFx"
tags:
  - "spfx"
  - "webpart"
  - "react"
  - "sharepoint-online"
  - "heft"
  - "spfx-cli"
---

## What Is SharePoint Framework (SPFx)?

SharePoint Framework is Microsoft's modern development model for building extensible applications that run securely within SharePoint Online, Microsoft Teams, and Viva Connections. Unlike legacy SharePoint Solutions, SPFx web parts are lightweight, maintainable, and built with contemporary web technologies like React, TypeScript, and Webpack.

SPFx web parts execute in a sandboxed browser context (the isolated web part domain), which means you can build feature-rich components without server-side code or elevated permissions. This guide walks you through building your first web part using the current best-practice toolchain: **SPFx CLI with Heft**.

## Prerequisites

Before you start, ensure you have:

- **Node.js 20+ LTS** (v20.11 or later; **NOT v18**, which has reached end-of-life)
- **SPFx CLI** (the modern scaffolding tool; replaces Yeoman)
- **VS Code** with [SharePoint Framework Tools extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-spfx)
- A **SharePoint Online tenant** (or developer site) with App Catalog enabled
- Basic familiarity with **TypeScript** and **React**

Verify your Node.js version:

```bash
node --version
```

## Install SPFx CLI

The SPFx CLI is the recommended way to scaffold new projects. Install it globally:

```bash
npm install -g @microsoft/spfx
```

Verify installation:

```bash
spfx --version
```

## Scaffold Your Project Using SPFx CLI

The SPFx CLI simplifies project setup with interactive prompts. Run:

```bash
spfx init
```

You'll be guided through:

1. **Package name** — `hello-world-webpart`
2. **Framework** — Select `React`
3. **Component name** — `HelloWorld`
4. **Web part description** — `My first SPFx web part`

The CLI creates a complete project structure with modern tooling (Heft, Webpack, ESLint) already configured.

## Project Structure Overview

Here's what SPFx scaffolds for you:

| Folder | Purpose |
|--------|---------|
| `src/` | TypeScript/React source files |
| `src/webparts/HelloWorld/` | Your web part component and manifest |
| `lib/` | Compiled JavaScript (generated on build) |
| `sharepoint/` | Solution package configuration |
| `config/` | Build configuration (Heft, Webpack) |
| `node_modules/` | Dependencies |
| `package.json` | Project metadata and scripts |

The key files you'll edit are inside `src/webparts/HelloWorld/`:

- **HelloWorldWebPart.ts** — Main web part class (entry point)
- **HelloWorld.tsx** — React component (your UI)
- **HelloWorldWebPart.manifest.json** — Web part metadata (name, description, icon)

## Install Dependencies

Navigate to your project and install:

```bash
cd hello-world-webpart
npm install
```

## Run Locally with Heft

The modern SPFx stack uses **Heft** as the task runner. Start the development server:

```bash
heft run build
```

In another terminal:

```bash
npm run serve
```

This launches a local workbench at `https://localhost:4321/workbench`. You'll see your web part rendered in a test page, complete with hot reload on file changes.

## Understanding the HelloWorld Web Part

Open `src/webparts/HelloWorld/HelloWorld.tsx`:

```tsx
import * as React from 'react';
import styles from './HelloWorld.module.scss';

export interface IHelloWorldProps {
  title: string;
}

export const HelloWorld: React.FC<IHelloWorldProps> = (props) => {
  return (
    <div className={styles.container}>
      <h1>{props.title}</h1>
      <p>Welcome to your first SPFx web part!</p>
    </div>
  );
};
```

This is a simple React functional component. You can modify the JSX to build your UI.

## Adding a Property Pane

The property pane lets users configure your web part without editing code. Open `HelloWorldWebPart.ts` and update the `getPropertyPaneConfiguration()` method:

```typescript
protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return {
    pages: [
      {
        header: { description: 'Configure your web part' },
        groups: [
          {
            groupName: 'Settings',
            groupFields: [
              PropertyPaneTextField('title', {
                label: 'Web Part Title',
                value: this.properties.title,
                onPropertyPaneFieldChanged: this.onPropertyTitleChanged.bind(this),
              }),
            ],
          },
        ],
      },
    ],
  };
}

private onPropertyTitleChanged(value: string): void {
  this.properties.title = value;
}
```

Now users can edit the `title` property via the web part's settings panel.

## Build and Bundle for Production

When you're ready to deploy, create an optimized bundle:

```bash
heft run build --production
```

This generates minified code in `lib/`. Next, package the solution:

```bash
npm run package
```

This creates a `.sppkg` file in the `sharepoint/solution/` folder.

## Deploy to SharePoint

1. **Upload to App Catalog**: Go to your SharePoint tenant's App Catalog site (usually at `https://[tenant]-admin.sharepoint.com/sites/appcatalog`).
2. **Upload the .sppkg** — Drag the `.sppkg` file into the Apps for SharePoint library.
3. **Trust the solution** — Check "Make this solution available to all sites in the organization" if desired, then click **Deploy**.
4. **Add to a site** — Go to any SharePoint site, open the site's App Catalog, find your web part app, and click **Add It**.
5. **Place the web part** — Edit a modern page, click **+**, search for your web part, and add it.

## Common Errors & Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `Node version not supported` | Node.js < 20 | Update: `nvm install 20` or download from [nodejs.org](https://nodejs.org) |
| `Module not found: @microsoft/sp-core-library` | Dependencies not installed | Run `npm install` |
| `Certificate error on localhost` | Dev cert issue | Run `spfx trust-dev-cert` |
| `Web part not visible in workbench` | Manifest misconfiguration | Verify `HelloWorldWebPart.manifest.json` has correct `componentType: "WebPart"` |
| `Build fails with ESLint errors` | Code style violations | Run `npm run lint -- --fix` to auto-correct |
| `SPPKG deployment fails` | App already exists with same ID | Change `id` in `package-solution.json` and rebuild |

## Legacy: Yeoman + Gulp (SPFx < 1.22)

If you're maintaining a project on an older version of SPFx (before 1.22), you may still be using the Yeoman + Gulp workflow. This is now **deprecated** but documented here for reference.

**Installation:**

```bash
npm install -g @microsoft/generator-sharepoint
npm install -g yo
```

**Scaffold (legacy):**

```bash
yo @microsoft/sharepoint
```

**Run locally (legacy):**

```bash
gulp serve
```

**Build and package (legacy):**

```bash
gulp bundle --ship
gulp package-solution --ship
```

**Why upgrade?** The SPFx CLI + Heft approach is faster, leaner, and better aligned with modern tooling. See our guide on [migrating from Gulp to Heft and Webpack](/blog/spfx-migrate-gulp-heft-webpack-2026) for details.

## FAQ

**Q: Can I use SPFx web parts in Microsoft Teams?**
Yes. SPFx web parts can be deployed as Teams tabs. Your web part automatically works in Teams if it's registered in the solution manifest.

**Q: How do I query SharePoint data from my web part?**
Use the [PnP JS library](https://pnp.github.io/pnpjs/), which provides a fluent API for REST calls. Check out our guide on [querying SharePoint lists with PnP JS](/blog/spfx-pnp-js-sharepoint-data).

**Q: What's the difference between a web part and an Application Customizer?**
Web parts are page-level components that users add to specific pages. Application Customizers run globally across your site and are great for injecting headers, footers, or site-wide navigation. Learn more in our [Application Customizer guide](/blog/spfx-application-customizer-header-footer-sharepoint-2026).

**Q: Can I build SPFx solutions without React?**
Yes. The scaffolding tool offers options for React, Vue, or even plain TypeScript (no framework). Choose whichever fits your project needs.

## Next Steps

Now that you have a working Hello World web part, here are some paths to level up your SPFx skills:

- **Connect to real data** — Learn how to [query SharePoint lists and libraries using PnP JS](/blog/spfx-pnp-js-sharepoint-data) inside your web part.
- **Modernize your toolchain** — Understand the architecture behind Heft and Webpack. See our guide on [migrating from Gulp to Heft and Webpack](/blog/spfx-migrate-gulp-heft-webpack-2026) for the latest approach.
- **Build for Viva Connections** — Extend your skills beyond web parts by [creating Adaptive Card Extensions for Viva Connections](/blog/building-viva-connections-adaptive-card-extensions-spfx).
- **Add a global header or footer** — Use an [SPFx Application Customizer to inject headers and footers](/blog/spfx-application-customizer-header-footer-sharepoint-2026) across your entire SharePoint site.
