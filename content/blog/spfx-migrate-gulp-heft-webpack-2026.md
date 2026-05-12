---
title: "Migrate SPFx from Gulp to Heft & Webpack (2026)"
slug: spfx-migrate-gulp-heft-webpack-2026
excerpt: "Step-by-step SPFx migration off Gulp to the new Heft + Webpack toolchain — gotchas, breaking changes, and a working sample for 2026."
date: "2026-03-13"
displayDate: "March 13, 2026"
readTime: "6 min read"
category: "SPFx"
image: "/images/blog/spfx-1-23-heft-migration-guide.png"
tags:
  - "SPFx"
  - "TypeScript"
  - "Next.js"
  - "Webpack"
  - "Heft"
---


## The Biggest SPFx Toolchain Change in Years

March 2026 marks a turning point for SharePoint Framework developers. Two major changes are happening simultaneously:

1. **SPFx 1.22** replaced Gulp with **Heft** as the build system
2. **SPFx 1.23** introduces a preview of the **new SPFx CLI** that replaces the Yeoman generator

If you maintain SPFx projects, you need to understand both changes. This guide covers what changed, why it matters, and exactly how to migrate your existing projects.

## What Changed and Why

### The Problem with the Old Toolchain

| Issue | Impact |
|-------|--------|
| Gulp dependency chain | 50+ npm audit warnings in every new project |
| Yeoman generator coupling | Generator version locked to SPFx version |
| Outdated build pipeline | Blocked TypeScript 5.x adoption |
| Custom gulp tasks | Fragile, undocumented extension points |

### Timeline of Changes

| Version | Release | Change | Status |
|---------|---------|--------|--------|
| SPFx 1.21 | September 2025 | Last version with Gulp-only toolchain | Stable |
| SPFx 1.22 | December 2025 | Heft replaces Gulp (Gulp still available via flag) | Stable |
| SPFx 1.23 | March 2026 | New SPFx CLI preview, open-source templates | Preview |
| SPFx 1.24 | June 2026 | SPFx CLI general availability | Planned |

## Change 1: Gulp to Heft (SPFx 1.22+)

### What is Heft?

Heft is a build orchestrator from the Rush Stack ecosystem. It replaces Gulp as the task runner but **Webpack still handles bundling** under the hood.

### What Changed in Your Project

| Before (Gulp) | After (Heft) |
|---------------|--------------|
| gulpfile.js | Removed |
| gulp serve | npm run serve (calls Heft) |
| gulp bundle --ship | npm run build (calls Heft) |
| gulp package-solution --ship | npm run package (calls Heft) |
| Custom gulp tasks in gulpfile.js | Heft plugins or rig extensions |

### New Configuration Files

**config/rig.json** — References the shared SPFx build configuration:

    {
      "$schema": "https://developer.microsoft.com/json-schemas/rig-package/rig.schema.json",
      "rigPackageName": "@microsoft/spfx-web-build-rig"
    }

**config/sass.json** — Sass plugin configuration:

    {
      "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft-sass-plugin.schema.json",
      "extends": "@microsoft/spfx-web-build-rig/profiles/default/config/sass.json"
    }

### Step-by-Step: Migrate an Existing Project to Heft

**Step 1: Update SPFx Dependencies**

    npx @pnp/cli-microsoft365 spfx project upgrade
      --toVersion 1.22.0 --output md

**Step 2: Remove Gulp Dependencies**

    npm uninstall gulp @microsoft/sp-build-web
      @microsoft/sp-module-interfaces

**Step 3: Install Heft Dependencies**

    npm install @rushstack/heft @microsoft/spfx-web-build-rig
      --save-dev

**Step 4: Update npm Scripts**

    {
      "scripts": {
        "build": "heft build --clean",
        "bundle": "heft build --clean",
        "serve": "heft build --watch",
        "package": "heft build --clean && node ./node_modules/.bin/package-solution"
      }
    }

**Step 5: Add Configuration Files**

Create the rig.json and sass.json files in your ./config directory as shown above.

**Step 6: Delete gulpfile.js**

Remove the gulpfile.js from your project root.

**Step 7: Test the Build**

    npm run build

### Migrating Custom Gulp Tasks

| Approach | Complexity | Best For |
|----------|-----------|----------|
| Heft plugins | Medium | Reusable build steps shared across projects |
| Pre/post npm scripts | Low | Simple one-off commands |
| Rig ejection | High | Full control over the entire build pipeline |

**The simplest migration path** for most custom gulp tasks is to convert them to npm scripts:

    {
      "scripts": {
        "prebuild": "node ./scripts/inject-env-vars.js",
        "build": "heft build --clean"
      }
    }

## Change 2: New SPFx CLI (SPFx 1.23+)

| Feature | Yeoman Generator | New SPFx CLI |
|---------|-----------------|-------------|
| Installation | npm install -g yo @microsoft/generator-sharepoint | Standalone CLI (npm package) |
| Version coupling | Locked to SPFx version | Decoupled from SPFx versions |
| Templates | Bundled in generator | Open-source on GitHub |
| Customization | Limited | Company-specific templates supported |
| Status in 1.23 | Still available | Preview |
| Status in 1.24 | Deprecated | General Availability |

### Using the New SPFx CLI (Preview)

    npm install -g @microsoft/spfx-cli@preview
    spfx new --solution-name my-webpart --component-type webpart --framework react

## Decision Matrix: When Should You Migrate?

| Scenario | Recommendation |
|----------|---------------|
| Starting a brand new SPFx project | Use SPFx 1.23 with Heft (skip Gulp entirely) |
| Active project on SPFx 1.21 | Migrate to 1.22 Heft when you have a sprint for tech debt |
| Legacy project in maintenance mode | Stay on current version until a feature update is needed |
| Project with heavy custom gulp tasks | Plan migration carefully — test custom logic conversion first |
| CI/CD pipelines using gulp commands | Update pipeline scripts when migrating to Heft |

## CI/CD Pipeline Updates

**Before (Gulp-based pipeline):**

    - script: gulp bundle --ship
    - script: gulp package-solution --ship

**After (Heft-based pipeline):**

    - script: npm run build
    - script: npm run package

## What Else Is New in SPFx 1.23

- **Open-source solution templates** — Project scaffolding templates are now on GitHub
- **TypeScript 5.8** — Continued from SPFx 1.22, bringing modern language features
- **Clean npm audits** — Zero audit warnings in new projects
- **Navigation Customizers preview** — Override top and side navigation elements (GA in 1.24)

## Frequently Asked Questions

**Q: Do I have to migrate to Heft immediately?**

No. SPFx 1.22 includes a `--use-gulp` flag for the Yeoman generator that creates projects with the legacy Gulp toolchain. However, new features will only come to the Heft-based toolchain going forward.

**Q: Will my existing SPFx web parts break?**

No. The toolchain change affects how you build and serve your project, not how it runs in SharePoint.

**Q: Can I use the new SPFx CLI in production today?**

The CLI is in preview with SPFx 1.23. For production projects, continue using the Yeoman generator until the CLI reaches GA with SPFx 1.24 (June 2026).

**Q: What happened to the local workbench?**

The local workbench has been deprecated in favor of **in-page debugging** directly on SharePoint Online.

**Q: How do I handle custom gulp tasks for environment-specific builds?**

Convert simple tasks to npm `pre` and `post` scripts. For complex build customizations, create a custom Heft plugin.

## What to Do Next

1. **Audit your current SPFx projects** — List all projects and their current SPFx version
2. **Try the Heft toolchain** — Scaffold a new SPFx 1.22+ project and compare the dev experience
3. **Test the CLI preview** — Install the preview CLI and scaffold a test project
4. **Update CI/CD pipelines** — Replace gulp commands with npm scripts when you migrate
5. **Plan your migration timeline** — Use the decision matrix above to prioritize


### Visualize Your Upgraded Architecture
As you migrate your SPFx projects, use the free **[M365 Architecture Canvas](/tools/m365-architecture-canvas)** to drag and drop SharePoint and Teams components into a visually exportable architecture diagram.
