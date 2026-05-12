---
title: "Migrate from Yeoman to SPFx CLI in 2026"
slug: migrate-yeoman-to-new-spfx-cli
excerpt: "Replace yo @microsoft/sharepoint with the new SPFx CLI. Step-by-step migration guide for 2026 with Heft and modern tooling."
date: "2026-04-17"
displayDate: "April 17, 2026"
readTime: "7 min read"
category: "SPFx"
image: "/images/blog/spfx-migrate-yeoman-cli.png"
tags:
  - "spfx"
  - "yeoman"
  - "spfx-cli"
  - "migration"
  - "heft"
---

## The End of `yo @microsoft/sharepoint`

If you've scaffolded SharePoint Framework projects over the past several years, you know the ritual: install Yeoman globally, install the SharePoint generator globally, wait for both to become outdated, reinstall, try again. With **SPFx 1.23**, Microsoft shipped the official replacement: the **SPFx CLI**.

This guide covers exactly what changes, what stays the same, and how to update your workflow.

## What's Replacing What

| Old Tool | New Tool | Status |
|----------|----------|--------|
| `yo @microsoft/sharepoint` | `@microsoft/spfx` CLI | Replaced |
| `gulp serve` | `heft build --watch` + in-page debug | Replaced |
| `gulp bundle --ship` | `heft build --production` | Replaced |
| `gulp package-solution --ship` | `heft run --only package-solution -- --production` | Replaced |
| `gulp test` | `heft test` | Replaced |

## Install the New SPFx CLI

```bash
npm install -g @microsoft/spfx
spfx --version
```

Unlike the Yeoman generator which was version-locked to a specific SPFx release, the SPFx CLI is **decoupled** from the framework version. You install it once and it can scaffold any supported SPFx version.

## Scaffold a New Project

```bash
# Old way
yo @microsoft/sharepoint

# New way
spfx new
```

The `spfx new` command walks through the same options as Yeoman: component type, React vs plain TypeScript, component name, etc. The output is a project configured for **Heft** instead of Gulp.

## What the New Project Looks Like

Key differences from a Yeoman-scaffolded project:

**`package.json` scripts:**
```json
{
  "build": "heft build --clean",
  "bundle": "heft build --clean",
  "serve": "heft build --watch",
  "package-solution": "heft build --clean && heft run --only package-solution -- --production",
  "test": "heft test --clean"
}
```

**No `gulpfile.js`** — Heft configuration lives in `config/heft.json` and `config/rig.json`.

**No Yeoman dependency** — No generator version to keep in sync.

## Migrate an Existing Project

For existing projects, use the **CLI for Microsoft 365** migration tool:

```bash
# Install if needed
npm install -g @pnp/cli-microsoft365

# Generate migration report
m365 spfx project upgrade --toVersion 1.23.0 --output md > migration-report.md
```

Open `migration-report.md` for exact diff of every file that needs updating.

**Core changes manually:**

1. Remove `gulp`, `@microsoft/sp-build-web`, and related Gulp packages
2. Install `@rushstack/heft` and `@microsoft/spfx-heft-plugins`
3. Delete `gulpfile.js`, create `heft.json`
4. Update `package.json` scripts (see above)
5. Add `config/rig.json` pointing to `@microsoft/spfx-web-build-rig`

## CI/CD Pipeline Updates

If your pipelines use gulp commands, update them:

```yaml
# Before
- script: gulp bundle --ship
- script: gulp package-solution --ship

# After  
- script: npm run bundle
- script: npm run package-solution
```

## What About Local Workbench?

The local workbench (`/temp/workbench.html`) is **gone** from SPFx 1.22+. In-page debugging on SharePoint Online replaces it:

1. Run `heft build --watch`
2. Open SharePoint Online in your browser
3. Append `?debugManifestsFile=https://localhost:4321/temp/manifests.js` to the page URL
4. Accept the certificate warning
5. Edit the page and add your web part

This approach tests against real SharePoint data and permissions from the start.

## FAQ

**Q: Do I need to migrate immediately?**
No. Existing Yeoman + Gulp projects continue to work. SPFx 1.22 still includes a `--use-gulp` flag. But new projects should use the SPFx CLI.

**Q: Can I have both Yeoman and SPFx CLI installed?**
Yes. They're separate npm packages and don't conflict.

**Q: Where did the local workbench go?**
Deprecated in favor of in-page debugging on SharePoint Online. See the section above.

**Q: My company uses a private Yeoman generator for templates. What replaces it?**
The SPFx CLI supports custom templates via GitHub repositories. You can fork the official templates and publish your company's version as a GitHub repo, then point `spfx new --template` to it.

For more detail on the Heft build system, see [Migrate SPFx from Gulp to Heft & Webpack](/blog/spfx-migrate-gulp-heft-webpack-2026). For the full CLI migration walkthrough, see [Migrating from Yeoman to the New SPFx CLI in 2026](/blog/spfx-cli-migrate-yeoman-heft-2026).
