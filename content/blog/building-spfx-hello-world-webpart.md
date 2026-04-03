---
title: "Building Your First SPFx Web Part: A Complete Hello World Guide"
slug: building-spfx-hello-world-webpart
excerpt: "Step-by-step guide to creating and deploying your first SharePoint Framework web part with React."
date: "2026-02-18"
displayDate: "February 18, 2026"
readTime: "8 min read"
category: "SPFx"
tags:
  - "spfx"
  - "webpart"
  - "react"
  - "sharepoint-online"
---

## Prerequisites

- Node.js LTS (v18)
- Yeoman + SPFx generator
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
