---
title: "Build Your First SPFx Web Part: Hello World Guide"
slug: building-spfx-hello-world-webpart
excerpt: "Step-by-step guide to creating and deploying your first SharePoint Framework web part with React."
date: "2026-02-18"
displayDate: "February 18, 2026"
readTime: "8 min read"
image: "/images/blog/spfx-custom-webpart-guide.png"
category: "SPFx"
tags:
  - "spfx"
  - "webpart"
  - "react"
  - "sharepoint-online"
---

## Prerequisites

- Node.js LTS (v18)
- Yeoman + SPFx generator (or the newer [SPFx CLI that replaces Yeoman](/blog/migrate-yeoman-to-new-spfx-cli))
- VS Code with SPFx Snippets

## Scaffold the Project

```bash
yo @microsoft/sharepoint
```

Choose: Web part → React → "HelloWorld"

## Run Locally

```bash
gulp serve
```

## Deploy

```bash
gulp bundle --ship
gulp package-solution --ship
```

Upload the .sppkg to your App Catalog.

## Next Steps

Now that you have a working Hello World web part, here are some paths to level up your SPFx skills:

- **Connect to real data** — Learn how to [query SharePoint lists and libraries using PnP JS](/blog/spfx-pnp-js-sharepoint-data) inside your web part.
- **Modernize your toolchain** — The default Gulp-based build is being replaced. See our guide on [migrating from Gulp to Heft and Webpack](/blog/spfx-migrate-gulp-heft-webpack-2026) for the latest approach.
- **Build for Viva Connections** — Extend your skills beyond web parts by [creating Adaptive Card Extensions for Viva Connections](/blog/building-viva-connections-adaptive-card-extensions-spfx).
- **Add a global header or footer** — Use an [SPFx Application Customizer to inject headers and footers](/blog/spfx-application-customizer-header-footer-sharepoint-2026) across your entire SharePoint site.
