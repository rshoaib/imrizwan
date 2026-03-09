export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  displayDate: string
  readTime: string
  category: 'SPFx' | 'Power Platform' | 'SharePoint' | 'Microsoft 365'
  image?: string
  tags?: string[]
}

export const blogPosts: BlogPost[] = [
  {
    id: '29',
    slug: 'spfx-heft-cli-migration-2026',
    title: 'Migrating SPFx to Heft & the New CLI: A 2026 Developer Guide',
    excerpt: 'The SharePoint Framework (SPFx) toolchain has moved from Gulp to Heft. Learn how to migrate your existing web parts to Webpack 5, remove Yeoman, and prepare for the new 2026 open-source SPFx CLI.',
    image: '/images/blog/spfx-heft-cli-migration-2026.png',
    content: `
## The End of Yeoman and Gulp

The SharePoint Framework (SPFx) ecosystem is undergoing its most significant architectural shift since its inception. Starting with SPFx v1.22 and fully cementing in 2026 with v1.24, Microsoft is replacing the legacy **Gulp** and **Yeoman** toolchain with **Heft** (from the Rush Stack ecosystem) and a brand-new, open-source **SPFx CLI**.

If you've built a [custom SPFx web part](/blog/building-spfx-web-part-crud-react-pnpjs-2026) in the past, your muscle memory probably defaults to \`gulp bundle --ship\`. 

That era is over. Heft brings Webpack 5, declarative JSON configurations, significantly faster build times, and zero \`npm audit\` warnings from unmaintained Gulp plugins.

Here is exactly how to migrate your existing projects and prepare for the new CLI.

---

## 1. Why Heft Over Gulp?

For years, developers have struggled with SPFx bundle sizes and bloated node_modules. Moving to Heft brings three major advantages:

1. **Declarative Configuration:** \`gulpfile.js\` is gone. You now configure builds via JSON files (\`heft.json\`, \`typescript.json\`). 
2. **Speed & Caching:** Heft is designed for large-scale monorepos. Incremental builds for React components are incredibly fast.
3. **Modern Webpack:** By moving to Webpack 5, you get out-of-the-box support for better tree shaking. Check out our [SPFx Performance Optimization guide](/blog/spfx-performance-optimization-bundle-lazy-loading-2026) to see just how much bundle size you can save.

---

## 2. Step-by-Step Migration Guide

To upgrade an existing project, follow these steps. 

> **Best Practice:** Before starting, ensure you are using NVM (Node Version Manager) to switch to Node.js v18+. The new Heft toolchain requires modern Node environments.

### Step A: Clean Up Gulp
First, remove all traces of Gulp from your project:
\`\`\`bash
npm uninstall gulp gulp-core-build @microsoft/sp-build-web
npm uninstall @microsoft/rush-stack-compiler-4.5
\`\`\`
Delete \`gulpfile.js\` completely.

### Step B: Install Heft Dependencies
\`\`\`bash
npm install @microsoft/spfx-web-build-rig @microsoft/spfx-heft-plugins @rushstack/heft --save-dev
\`\`\`

### Step C: Update Package Scripts
In your \`package.json\`, replace your old Gulp commands:
\`\`\`json
"scripts": {
  "build": "heft build --clean",
  "bundle": "heft build --production",
  "serve": "heft start",
  "package-solution": "heft test --production"
}
\`\`\`

### Step D: Add Configuration Files
Create a new \`config/rig.json\` file to tell Heft to use the SPFx rig:
\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/rushstack/rig.schema.json",
  "rigPackageName": "@microsoft/spfx-web-build-rig"
}
\`\`\`

> **Note:** The old \`config/config.json\` used for externals is deprecated. You now define externals using standard Webpack patterns in Heft. 

---

## 3. The New Open-Source SPFx CLI

Releasing in preview alongside SPFx v1.23.1 (April 2026), the new **SPFx CLI** completely replaces Yeoman (\`yo @microsoft/sharepoint\`).

The biggest advantage? **Custom Templates.**
Because the CLI is open-sourced on GitHub, your enterprise can fork the repository and create custom scaffolding templates. Instead of every developer starting from scratch, you can scaffold a new project that already includes PnPjs, Fluent UI path imports, and your company's authentication wrapper.

\`\`\`bash
# The future of scaffolding
spfx new webpart --template my-enterprise-react-template
\`\`\`

---

## 4. Resolving Migration Errors

When you run \`npm run build\` for the first time, you might hit a few walls. Here are the most common fixes:

### Missing Sass Configurations
If your \`.module.scss\` files fail to compile, ensure you've replaced \`sass.json\` with the updated Heft Sass plugin configurations.

### Third-Party Library Issues
Libraries that relied on specific Webpack 4 polyfills (like old versions of crypto or stream APIs) will break in Webpack 5. You must either update those libraries or manually add polyfills to a custom Webpack config inside your Heft setup.

### Rest API Calls Failing?
If your local workbench API mocks break, remember that the local dev server architecture has changed. For production data querying, always rely on standard batching patterns. Check out our [SharePoint REST API Cheat Sheet](/blog/sharepoint-rest-api-cheat-sheet-2026) for updated 2026 endpoint structures.

---

## FAQs

### Can I still use Gulp in 2026?
Technically, yes for older projects on SPFx v1.21 or lower. However, starting with v1.24, Gulp is officially unsupported by Microsoft. It's time to migrate.

### How does this affect PnP PowerShell scripts?
It doesn't! Your [PnP PowerShell scripts](/blog/pnp-powershell-sharepoint-online-scripts-2026) used for provisioning assets and app catalogs will continue to work exactly as they did before. The build toolchain only affects the frontend compilation.

### Does Heft support React 18?
Yes, moving to the new Heft-based SPFx versions provides much stronger alignment with React 18 and Fluent UI v9.

---

## Conclusion & Next Steps

The shift to Heft and the new CLI removes years of technical debt from the SharePoint Framework. Builds are faster, dependencies are cleaner, and the ability to use custom templates will change how enterprise teams operate.

If you don't want to type out deployment commands manually, you can pair your newly built web parts with our **[PnP PowerShell Generator](/tools/pnp-script-generator)** to automate the deployment process straight to your app catalog.
`,
    date: '2026-03-09',
    displayDate: 'March 9, 2026',
    readTime: '6 min read',
    category: 'SPFx',
    tags: ['spfx', 'heft', 'webpack-5', 'cli', 'react'],
  },

  {
    id: '28',
    slug: 'power-automate-expressions-cheat-sheet-2026',
    title: '99+ Power Automate Expressions: The Ultimate 2026 Cheat Sheet',
    excerpt:
      'Stop guessing formulas! Get the ultimate 2026 Power Automate expressions cheat sheet. Master 99+ functions with exact syntax, real-world examples, and copy-paste code.',
    image: '/images/blog/power-automate-expressions-cheat-sheet.png',
    content: `
## Why You Need an Expressions Cheat Sheet

If you've spent more than 10 minutes in Power Automate, you've hit the expression editor. That tiny text box where you type \`formatDateTime(utcNow(), 'yyyy-MM-dd')\` and pray it works.

Power Automate expressions are **the bridge between no-code and low-code**. They let you format dates, manipulate strings, build conditions, and reference dynamic content — but the syntax is easy to forget because you only use each function once in a while.

This cheat sheet organizes every expression you'll actually use, grouped by category, with copy-paste syntax and real output examples.

> **Try it live:** Use our free **[Power Automate Expression Builder](/tools/power-automate-expressions)** to browse, search, and copy any expression instantly.

---

## String Functions

String functions are the workhorses of Power Automate. You'll use them in almost every flow.

| Function | Syntax | Example Output |
|----------|--------|----------------|
| \`concat\` | \`concat('Hello', ' ', 'World')\` | Hello World |
| \`substring\` | \`substring('Hello World', 6, 5)\` | World |
| \`replace\` | \`replace('Hi World', 'World', 'PA')\` | Hi PA |
| \`toLower\` | \`toLower('HELLO')\` | hello |
| \`toUpper\` | \`toUpper('hello')\` | HELLO |
| \`trim\` | \`trim('  hello  ')\` | hello |
| \`indexOf\` | \`indexOf('Hello World', 'World')\` | 6 |
| \`startsWith\` | \`startsWith('Hello', 'He')\` | true |
| \`endsWith\` | \`endsWith('Hello', 'lo')\` | true |
| \`split\` | \`split('a,b,c', ',')\` | ['a','b','c'] |
| \`length\` | \`length('Hello')\` | 5 |
| \`guid\` | \`guid()\` | Random GUID string |

### Pro Tips for Strings

- **Always use single quotes** for string literals — double quotes cause errors
- Chain functions by nesting: \`toLower(trim(triggerBody()?['Email']))\`
- Use \`concat\` to build dynamic file names: \`concat('Report_', formatDateTime(utcNow(), 'yyyyMMdd'), '.pdf')\`

---

## Date & Time Functions

Date expressions are the #1 reason developers search for help. Here's every function you need.

| Function | Syntax | What It Does |
|----------|--------|-------------|
| \`utcNow\` | \`utcNow('yyyy-MM-dd')\` | Current UTC timestamp |
| \`formatDateTime\` | \`formatDateTime(timestamp, 'dd/MM/yyyy')\` | Format any date |
| \`addDays\` | \`addDays(utcNow(), 7)\` | Add days |
| \`addHours\` | \`addHours(utcNow(), 3)\` | Add hours |
| \`addMinutes\` | \`addMinutes(utcNow(), 30)\` | Add minutes |
| \`convertTimeZone\` | \`convertTimeZone(utcNow(), 'UTC', 'Eastern Standard Time')\` | Change timezone |
| \`dayOfWeek\` | \`dayOfWeek('2026-03-08')\` | Day number (0=Sun) |
| \`dayOfMonth\` | \`dayOfMonth('2026-03-08')\` | Day of month (8) |
| \`ticks\` | \`ticks('2026-03-08T00:00:00Z')\` | Ticks value |

### Common Date Format Strings

| Format | Output | Use Case |
|--------|--------|----------|
| \`yyyy-MM-dd\` | 2026-03-08 | ISO standard |
| \`dd/MM/yyyy\` | 08/03/2026 | European format |
| \`MMMM dd, yyyy\` | March 08, 2026 | Display in emails |
| \`hh:mm tt\` | 02:30 PM | 12-hour time |
| \`HH:mm:ss\` | 14:30:00 | 24-hour time |
| \`dddd\` | Sunday | Day name |

> **Common mistake:** Using \`mm\` (minutes) when you mean \`MM\` (months). Capital M = months, lowercase m = minutes.

---

## Collection Functions

Working with arrays from SharePoint lists or API responses? These are essential.

| Function | What It Does |
|----------|-------------|
| \`first(array)\` | Returns the first item |
| \`last(array)\` | Returns the last item |
| \`contains(collection, value)\` | Checks if value exists |
| \`empty(collection)\` | Checks if empty |
| \`join(array, delimiter)\` | Joins array into string |
| \`createArray(items...)\` | Creates a new array |
| \`union(arr1, arr2)\` | Merges arrays (no duplicates) |
| \`intersection(arr1, arr2)\` | Returns common items |
| \`length(array)\` | Count of items |

### Real-World Example

When you get items from a [SharePoint list](/blog/sharepoint-list-formatting-json-complete-guide-2026), check if results exist before processing:

\`\`\`text
if(empty(body('Get_items')?['value']), 'No items found', concat('Found ', string(length(body('Get_items')?['value'])), ' items'))
\`\`\`

---

## Logical Functions

Build conditions and branching logic without the Condition action.

| Function | Syntax | Returns |
|----------|--------|---------|
| \`if\` | \`if(equals(1,1), 'yes', 'no')\` | yes |
| \`equals\` | \`equals(value1, value2)\` | true/false |
| \`and\` | \`and(expr1, expr2)\` | true if ALL true |
| \`or\` | \`or(expr1, expr2)\` | true if ANY true |
| \`not\` | \`not(expression)\` | Opposite boolean |
| \`greater\` | \`greater(10, 5)\` | true |
| \`less\` | \`less(5, 10)\` | true |
| \`coalesce\` | \`coalesce(null, '', 'fallback')\` | First non-null value |

> **Pro tip:** Use \`coalesce()\` to handle null values from SharePoint. Instead of errors, you get a clean fallback: \`coalesce(triggerBody()?['Manager'], 'No manager assigned')\`

---

## Conversion Functions

Convert between data types — essential when [SharePoint REST API](/blog/sharepoint-rest-api-cheat-sheet-2026) responses return numbers as strings.

| Function | Converts To | Example |
|----------|------------|---------|
| \`int('42')\` | Integer | 42 |
| \`float('3.14')\` | Float | 3.14 |
| \`string(42)\` | String | '42' |
| \`bool(1)\` | Boolean | true |
| \`json(jsonString)\` | Object/Array | Parsed JSON |
| \`base64(value)\` | Base64 string | Encoded |
| \`base64ToString(b64)\` | Plain string | Decoded |
| \`uriComponent(value)\` | URL-safe string | Encoded |

---

## Math Functions

Simple arithmetic without variables.

| Function | Example | Result |
|----------|---------|--------|
| \`add(10, 5)\` | Sum | 15 |
| \`sub(10, 5)\` | Subtract | 5 |
| \`mul(3, 4)\` | Multiply | 12 |
| \`div(10, 3)\` | Divide (integer) | 3 |
| \`mod(10, 3)\` | Remainder | 1 |
| \`min(1, 5, 3)\` | Smallest | 1 |
| \`max(1, 5, 3)\` | Largest | 5 |
| \`rand(1, 100)\` | Random int | 42 |

---

## Referencing Functions

Access trigger data, action outputs, and variables at runtime.

| Function | What It Returns |
|----------|----------------|
| \`triggerBody()\` | Trigger's body payload |
| \`triggerOutputs()\` | Trigger's full output |
| \`body('actionName')\` | Action's body output |
| \`outputs('actionName')\` | Action's full output |
| \`items('loopName')\` | Current item in Apply to Each |
| \`variables('varName')\` | Variable value |
| \`parameters('paramName')\` | Workflow parameter |
| \`workflow()\` | Workflow metadata |

### Safe Property Access

Always use the \`?\` operator to avoid null reference errors:

\`\`\`text
triggerBody()?['value']?[0]?['Title']
\`\`\`

This safely navigates nested objects — if any level is null, the whole expression returns null instead of crashing your flow.

---

## 5 Expression Patterns Every Developer Should Know

### 1. Dynamic File Names
\`\`\`text
concat(triggerBody()?['CompanyName'], '_Invoice_', formatDateTime(utcNow(), 'yyyyMMdd'), '.pdf')
\`\`\`

### 2. Null-Safe Email Greeting
\`\`\`text
concat('Hello ', coalesce(triggerBody()?['FirstName'], 'there'), ',')
\`\`\`

### 3. Business Days Check (Skip Weekends)
\`\`\`text
if(or(equals(dayOfWeek(utcNow()), 0), equals(dayOfWeek(utcNow()), 6)), 'Weekend', 'Business Day')
\`\`\`

### 4. Clean and Standardize Input
\`\`\`text
trim(toLower(triggerBody()?['Email']))
\`\`\`

### 5. Conditional Priority Badge
\`\`\`text
if(equals(triggerBody()?['Priority'], 'High'), '🔴 Urgent', if(equals(triggerBody()?['Priority'], 'Medium'), '🟡 Normal', '🟢 Low'))
\`\`\`

---

## FAQs

### Where do I type expressions in Power Automate?
Click any input field in an action, then click \"Expression\" tab (fx icon) in the dynamic content panel. Type your expression and click OK.

### Can I nest expressions inside each other?
Yes — and you should. Nested expressions are common: \`toLower(trim(triggerBody()?['Email']))\` first trims whitespace, then lowercases the result.

### Why does my expression return an error about null values?
The most common cause is accessing a property that doesn't exist. Always use the \`?\` operator for safe access: \`body('action')?['property']\` instead of \`body('action')['property']\`.

### How do I debug expressions?
Use a **Compose** action. Paste your expression in the Compose input, run the flow, and check the output in the run history. This lets you test expressions in isolation without affecting downstream actions.

### What's the difference between body() and outputs()?
\`body()\` returns just the response body (the data). \`outputs()\` returns the full response including headers and status code. Use \`body()\` for data and \`outputs()\` when you need HTTP headers.

---

## Build Expressions Faster

Stop Googling expressions one at a time. Use our free **[Power Automate Expression Builder](/tools/power-automate-expressions)** to browse all 50+ expressions, search by name, filter by category, and copy syntax with one click.

For more Power Platform guides, check out:
- [Power Automate + SharePoint: 7 Document Workflows](/blog/power-automate-sharepoint-document-workflows-2026)
- [PnP PowerShell for SharePoint Online: 25 Scripts](/blog/pnp-powershell-sharepoint-online-scripts-2026)
- [SharePoint REST API Cheat Sheet](/blog/sharepoint-rest-api-cheat-sheet-2026)
`,
    date: '2026-03-08',
    displayDate: 'March 8, 2026',
    readTime: '12 min read',
    category: 'Power Platform',
    tags: ['power-automate', 'expressions', 'cheat-sheet', 'workflow', 'low-code'],
  },
  {
    id: '27',
    slug: 'sharepoint-provisioning-automation-guide-2026',
    title: "Modern SharePoint Provisioning & Automation in 2026: A Developer's Guide",
    excerpt:
      'Stop manually configuring SharePoint sites. Learn how to automate site provisioning in 2026 using PnP PowerShell, Site Scripts, and REST APIs, complete with interactive generator tools.',
    image: '/images/blog/sharepoint-provisioning-automation.png',
    content: `
## The Shift in SharePoint Provisioning

In 2026, SharePoint site provisioning emphasizes automation, robust governance, and leveraging modern Hub Site architectures. The days of deep, nested subsite hierarchies and manual configurations are over. Organizations are now utilizing flat site structures connected via Hub Sites to ensure flexibility, discoverability, and AI readiness for Microsoft Copilot.

Manual provisioning leads to "site sprawl" and inconsistent security policies. By automating your provisioning process, you enforce standard compliance, reduce errors, and save hours of repetitive work.

In this guide, we'll explore the three essential pillars of modern SharePoint automation: **PnP PowerShell**, **Site Scripts**, and **REST APIs**, and provide interactive tools to generate your scripts instantly.

---

## 1. PnP PowerShell for Bulk Operations

The SharePoint Patterns and Practices (PnP) PowerShell module remains the enterprise standard for automating SharePoint tasks. With over 500 cmdlets, PnP PowerShell allows you to programmatically create sites, apply templates, and execute bulk operations across your tenant.

By extracting an XML template from an existing "gold standard" site, you can stamp that exact configuration—lists, libraries, content types, and permissions—onto hundreds of new sites.

### Try It Now
Instead of memorizing cmdlets, use our **[PnP PowerShell Generator](/tools/pnp-script-generator)** to interactively build ready-to-use scripts for site creation, list management, and bulk permissions.

---

## 2. Site Scripts and Site Designs

For seamless integrations directly into the SharePoint UI, Site Scripts (now often applied via Site Templates) provide a lightweight, JSON-based declarative approach to provisioning. When a user creates a new site, a Site Script can automatically trigger actions such as:

- Creating lists and document libraries
- Applying custom theme colors and branding
- Adding navigation links
- Triggering a Power Automate flow for advanced approvals

### Generate Your JSON
Writing Site Script JSON by hand is error-prone. Use our visual **[Site Script Generator](/tools/site-script-generator)** to add your provisioning steps and export the exact JSON required for your tenant.

---

## 3. The Modern SharePoint REST API & CAML Queries

When you're building custom applications, SPFx Web Parts, or external system integrations, the SharePoint REST API is your gateway to automation. Combined with CAML queries, you can dynamically fetch, filter, and provision resources with pinpoint accuracy.

### Build Queries Visually
- Need complex XML filters? Use the **[CAML Query Builder](/tools/caml-query-builder)** to construct conditions and generate raw XML.
- Want to test API endpoints? The **[REST API Builder](/tools/rest-api-builder)** lets you construct OData queries and generates snippets in JavaScript, PnPjs, and PowerShell.

---

## The Role of Power Automate

While developers rely on PnP and REST, Power Automate remains the go-to no-code solution for empowering end-users. You can pair a Microsoft Form with a Power Automate flow to automatically call the SharePoint Provisioning Service or trigger a PnP PowerShell runbook via Azure Automation. 

---

## FAQs

### What is the recommended site structure in 2026?
Microsoft strongly recommends a flat architecture using Hub Sites rather than deeply nested subsites. This provides flexible navigation, centralized branding, and optimized search capabilities for Copilot.

### Should I use PnP PowerShell or Site Scripts?
Use Site Scripts for lightweight, UI-driven provisioning where users trigger the creation themselves. Use PnP PowerShell for complex, multi-step automated deployments, heavy template extraction, or tenant-wide migrations.

### How do I prevent site sprawl when automating?
Implement a strict governance policy. Combine your automation with an approval workflow (via Power Automate) and enforce a site lifecycle policy that automatically archives or deletes inactive sites.

---

## Take Your Automation Further

Stop writing boilerplate code. By leveraging the interactive tools available on this site, you can slash your development time in half. 

Want to design the ultimate data view for your newly provisioned lists? Try our **[JSON Column Formatter](/tools/json-column-formatter)** to paste instant visual templates into your lists.
`,
    date: '2026-03-08',
    displayDate: 'March 8, 2026',
    readTime: '6 min read',
    category: 'SharePoint',
    tags: ['sharepoint', 'automation', 'pnp-powershell', 'provisioning', 'site-scripts'],
  },
  {
    id: '26',
    slug: 'spfx-performance-optimization-bundle-lazy-loading-2026',
    title: 'SPFx Performance Optimization: Bundle Size, Lazy Loading & Best Practices (2026)',
    excerpt:
      'Ship faster SPFx web parts — analyze your bundle with Webpack Bundle Analyzer, lazy-load heavy components, offload libraries to CDN externals, and apply React memoization to cut re-renders.',
    image: '/images/blog/spfx-performance-optimization.png',
    content: `
## Why Performance Matters in SPFx

A single SPFx web part can silently add **500 KB+** to every SharePoint page load. In an enterprise environment where a homepage might host 6–8 web parts, that's megabytes of JavaScript competing for the main thread.

The result? Slow first-paint, janky scrolling, and frustrated users who blame "SharePoint" when the real culprit is unoptimized custom code.

This guide covers the **7 highest-impact optimizations** you can apply today — with real code, real numbers, and a checklist you can run before every deployment.

> **Prerequisites:** You should be comfortable with [building a custom SPFx web part](/blog/building-spfx-web-part-crud-react-pnpjs-2026) and have a basic understanding of Webpack.

---

## 1. Analyze Your Bundle Size

Before optimizing anything, **measure**. Install Webpack Bundle Analyzer:

\`\`\`bash
npm install --save-dev webpack-bundle-analyzer
\`\`\`

Add it to your \\\`gulpfile.js\\\`:

\`\`\`javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    generatedConfiguration.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: false,
      })
    );
    return generatedConfiguration;
  },
});
\`\`\`

Run \\\`gulp bundle --ship\\\` and open \\\`bundle-report.html\\\`. You'll see a visual treemap of every dependency and its size.

### What to Look For

| Problem | Signal | Fix |
|---------|--------|-----|
| Giant library | Single block > 100 KB | CDN external or replace |
| Duplicate deps | Same lib appears twice | Dedupe in \\\`package.json\\\` |
| Unused exports | Large library, few imports | Tree shaking / path imports |
| Dev-only code | \\\`console.log\\\`, test utils | Strip in production build |

---

## 2. Tree Shaking & Path Imports

**Tree shaking** eliminates unused code at build time — but only works with ES module imports. The biggest offender in SPFx projects is Fluent UI.

**Bad** — imports the entire library (~300 KB):
\`\`\`typescript
import { Dropdown, TextField, PrimaryButton } from '@fluentui/react';
\`\`\`

**Good** — imports only what you use (~15 KB per component):
\`\`\`typescript
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField';
import { PrimaryButton } from '@fluentui/react/lib/Button';
\`\`\`

> **SPFx 1.22+ tip:** If you're using Fluent UI v9 with the new Heft build system, tree shaking works out of the box. Path imports are still recommended for v8.

**Impact:** Switching to path imports typically saves **100–200 KB** from your bundle.

---

## 3. CDN Externals for Large Libraries

Large third-party libraries like React, ReactDOM, and Fluent UI don't need to be bundled — SharePoint already loads them. Configure externals in \\\`config/config.json\\\`:

\`\`\`json
{
  "externals": {
    "react": {
      "path": "https://cdn.jsdelivr.net/npm/react@17/umd/react.production.min.js",
      "globalName": "React"
    },
    "react-dom": {
      "path": "https://cdn.jsdelivr.net/npm/react-dom@17/umd/react-dom.production.min.js",
      "globalName": "ReactDOM"
    }
  }
}
\`\`\`

### When to Use Externals

| Library | Bundle Size | Use External? |
|---------|------------|---------------|
| React + ReactDOM | ~130 KB | ✅ Always |
| Fluent UI v8 | ~300 KB | ✅ Yes |
| \\\`@pnp/sp\\\` | ~80 KB | ⚠️ Only if multiple web parts share it |
| Lodash | ~70 KB | ✅ Yes, or use \\\`lodash-es\\\` for tree shaking |
| Day.js | ~2 KB | ❌ Too small, bundle it |

> **Rule of thumb:** Externalize libraries > 50 KB that don't tree-shake well. For everything else, bundle it — the HTTP request overhead isn't worth it.

---

## 4. Lazy Loading with Dynamic Imports

Load heavy components only when they're needed. This is the single biggest win for web parts that have multiple views or tabs.

\`\`\`typescript
import * as React from 'react';

// Lazy-load the chart component (only loaded when tab is clicked)
const HeavyChart = React.lazy(() =>
  import(/* webpackChunkName: "heavy-chart" */ './components/HeavyChart')
);

export default function DashboardWebPart(): React.ReactElement {
  const [showChart, setShowChart] = React.useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>Show Analytics</button>

      {showChart && (
        <React.Suspense fallback={<div>Loading chart...</div>}>
          <HeavyChart />
        </React.Suspense>
      )}
    </div>
  );
}
\`\`\`

### What to Lazy-Load

- **Charts and data visualizations** (Chart.js, Recharts)
- **Rich text editors** (Quill, TinyMCE)
- **Admin/settings panels** (rarely opened)
- **The Property Pane** (use \\\`loadPropertyPaneResources()\\\`)
- **PDF viewers or file previewers**

**Impact:** Lazy-loading a chart library can reduce initial bundle by **150–400 KB**.

---

## 5. React Memoization — Stop Wasted Re-Renders

Every re-render in a SharePoint page costs CPU time. Use React's memoization APIs to skip unnecessary renders:

\`\`\`typescript
import * as React from 'react';

// Memoize expensive list rendering
const ItemList = React.memo(function ItemList({ items }: { items: any[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.Id}>{item.Title}</li>
      ))}
    </ul>
  );
});

export default function TasksWebPart(): React.ReactElement {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [filter, setFilter] = React.useState('');

  // useMemo: only recalculate when tasks or filter change
  const filtered = React.useMemo(
    () => tasks.filter((t) => t.Title.toLowerCase().includes(filter.toLowerCase())),
    [tasks, filter]
  );

  // useCallback: stable reference for event handler
  const handleFilterChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value),
    []
  );

  return (
    <div>
      <input onChange={handleFilterChange} placeholder="Filter tasks..." />
      <ItemList items={filtered} />
    </div>
  );
}
\`\`\`

### When to Memoize

| Scenario | Tool | Worth It? |
|----------|------|-----------|
| Component receives same props | \\\`React.memo\\\` | ✅ Yes |
| Expensive computation | \\\`useMemo\\\` | ✅ Yes |
| Callback passed to child | \\\`useCallback\\\` | ✅ If child is memoized |
| Simple text/icon component | \\\`React.memo\\\` | ❌ Overhead > benefit |

---

## 6. Batch API Calls with PnPjs

If your web part makes 5 separate SharePoint REST calls on load, you're wasting round-trips. Use [PnPjs batching](/blog/building-spfx-web-part-crud-react-pnpjs-2026) to combine them:

\`\`\`typescript
import { spfi, SPFx } from '@pnp/sp';
import { createBatch } from '@pnp/sp/batching';
import '@pnp/sp/lists';
import '@pnp/sp/items';

async function loadDashboardData(context: any) {
  const sp = spfi().using(SPFx(context));
  const [batchedSP, execute] = createBatch(sp);

  // Queue 3 requests — they'll execute in a single HTTP call
  const tasksPromise = batchedSP.web.lists
    .getByTitle('Tasks').items.top(20)();
  const eventsPromise = batchedSP.web.lists
    .getByTitle('Events').items.top(10)();
  const announcementsPromise = batchedSP.web.lists
    .getByTitle('Announcements').items.top(5)();

  await execute();

  const [tasks, events, announcements] = await Promise.all([
    tasksPromise, eventsPromise, announcementsPromise
  ]);

  return { tasks, events, announcements };
}
\`\`\`

**Impact:** 3 sequential API calls taking ~900ms total → 1 batched call taking ~350ms.

> For more PnPjs patterns, see [PnP PowerShell for SharePoint Online](/blog/pnp-powershell-sharepoint-online-scripts-2026).

---

## 7. Production Build Checklist

Before every \\\`gulp bundle --ship\\\`, run through this checklist:

### Pre-Deploy Performance Checklist

- [ ] **Bundle analyzed** — no dependency > 100 KB unbundled
- [ ] **Path imports** — Fluent UI uses \\\`/lib/\\\` paths
- [ ] **Externals configured** — React, ReactDOM externalized
- [ ] **Lazy loading** — heavy components use \\\`React.lazy()\\\`
- [ ] **No dev imports** — remove \\\`console.log\\\`, test utils
- [ ] **API batching** — PnPjs \\\`createBatch()\\\` for multiple calls
- [ ] **React.memo** — applied to list-rendering components
- [ ] **Images optimized** — icons are SVG, photos are compressed
- [ ] **Production flag** — \\\`gulp bundle --ship\\\` (not debug)

### Measuring Results

Run the SharePoint **Page Diagnostics** tool (browser extension) before and after optimization. Key metrics to track:

| Metric | Target | How to Improve |
|--------|--------|----------------|
| SPRequestDuration | < 800ms | Batch API calls |
| Custom JS bundle | < 200 KB | Externals + tree shaking |
| First Meaningful Paint | < 2s | Lazy loading |
| Total Blocking Time | < 300ms | Code splitting |

---

## FAQ

### How much can I realistically reduce my SPFx bundle size?

Most SPFx projects can reduce their bundle by **40–60%** with path imports, CDN externals, and lazy loading. A typical project going from 800 KB to 300 KB is common.

### Should I use the new Heft build system in SPFx 1.22+?

Yes — the Heft-based toolchain has better tree shaking and faster builds. If you're starting a new project in 2026, use SPFx 1.22+. For existing projects, the migration is straightforward.

### Does lazy loading work with the Property Pane?

Yes. SPFx has built-in support via \\\`loadPropertyPaneResources()\\\`. The property pane code is only loaded when a user clicks "Edit" on your web part — saving ~50 KB on every page load.

### How do I know if my externals are loading correctly?

Open browser DevTools → Network tab → filter by JS. You should see your externalized libraries loading from the CDN URL you configured, not from your bundle.

### Is it worth optimizing a web part that's only used on one page?

Yes — that one page might be your organization's homepage, loaded thousands of times daily. A 200ms improvement × 5,000 daily loads = significant cumulative impact on user experience.

---

## Wrapping Up

SPFx performance isn't a nice-to-have — it's the difference between a "SharePoint is slow" complaint and a seamless user experience. Start with the **bundle analyzer** to find your biggest wins, then apply externals, lazy loading, and memoization in that order.

Need help building a web part from scratch? Start with [Building a Custom SPFx Web Part: CRUD Operations with React + PnPjs](/blog/building-spfx-web-part-crud-react-pnpjs-2026), then come back here to optimize it for production.

For more SharePoint developer guides, check out the [Microsoft Graph API examples](/blog/microsoft-graph-api-sharepoint-examples-2026) and [SharePoint REST API cheat sheet](/blog/sharepoint-rest-api-cheat-sheet-2026).
`,
    date: '2026-03-07',
    displayDate: 'March 7, 2026',
    readTime: '16 min read',
    category: 'SPFx',
    tags: ['spfx', 'performance', 'webpack', 'react', 'optimization'],
  },
  {
    id: '25',
    slug: 'sharepoint-list-formatting-json-complete-guide-2026',
    title: 'SharePoint List Formatting: Complete JSON Guide with 15 Templates (2026)',
    excerpt:
      'Transform plain SharePoint lists into visual dashboards using JSON formatting \u2014 column formatting, view formatting, row formatting, and form customization with 15 ready-to-use templates.',
    image: '/images/blog/sharepoint-list-formatting-json-guide.png',
    content: `
## Why JSON Formatting Changes Everything

SharePoint lists are the backbone of most Microsoft 365 solutions \u2014 project trackers, asset inventories, helpdesk tickets, HR onboarding checklists. But out of the box, they look like spreadsheets.

**JSON formatting** lets you transform any column, row, or entire view into a visual dashboard \u2014 without writing a single line of C#, deploying an SPFx web part, or touching the app catalog. You write JSON, paste it into SharePoint, and it works instantly for everyone who views that list.

### What You Can Format

| Formatting Type | What It Does | Where to Apply |
|----------------|-------------|----------------|
| **Column formatting** | Customize how a single column renders | Column settings \u2192 Format this column |
| **View formatting** | Customize the entire list view layout | View dropdown \u2192 Format current view |
| **Row formatting** | Apply styles to entire rows conditionally | View formatting with \`rowFormatter\` |
| **Form customization** | Customize the new/edit form layout | List settings \u2192 Configure layout \u2192 Form |

> **New in 2026:** SharePoint now supports the v2 schema with Excel-style expressions, making formatting significantly easier to write and read.

---

## Getting Started: How to Apply JSON Formatting

### Column Formatting

1. Go to your SharePoint list
2. Click the column header \u2192 **Column settings** \u2192 **Format this column**
3. Switch to **Advanced mode**
4. Paste your JSON
5. Click **Preview** to verify, then **Save**

### View Formatting

1. Click the view dropdown (top right of the list)
2. Select **Format current view**
3. Switch to **Advanced mode**
4. Paste your JSON and save

> **Pro tip:** Always include the \`$schema\` line at the top of your JSON. It enables IntelliSense in VS Code and validates your formatting before you paste it into SharePoint.

---

## The JSON Formatting Structure

Every formatting JSON follows this pattern:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "div",
  "style": {
    "padding": "8px",
    "font-weight": "600"
  },
  "attributes": {
    "class": "sp-css-color-GreenDark"
  },
  "txtContent": "@currentField",
  "children": []
}
\`\`\`

| Property | Purpose | Example |
|----------|---------|---------|
| \`elmType\` | HTML element type | \`div\`, \`span\`, \`a\`, \`img\`, \`button\` |
| \`txtContent\` | Text to display | \`@currentField\`, \`[$Title]\` |
| \`style\` | CSS styles | \`background-color\`, \`padding\`, \`border-radius\` |
| \`attributes\` | HTML attributes and CSS classes | \`class\`, \`href\`, \`title\`, \`iconName\` |
| \`children\` | Nested elements | Array of child elements |

### Key Variables

| Variable | Returns | Example Use |
|----------|---------|-------------|
| \`@currentField\` | Current column value | Status text, number, date |
| \`[$ColumnName]\` | Any other column\\\u2019s value | \`[$Priority]\`, \`[$DueDate]\` |
| \`@me\` | Current user\\\u2019s email | Personalize per user |
| \`@now\` | Current date/time | Compare with due dates |
| \`[$Editor.title]\` | Person field\\\u2019s display name | Show who last edited |

---

## Template 1: Status Badges with Icons

Turn a Choice column into colored pills with Fluent UI icons:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "div",
  "style": {
    "display": "flex",
    "align-items": "center",
    "gap": "6px",
    "padding": "4px 12px",
    "border-radius": "16px",
    "font-size": "13px",
    "font-weight": "600",
    "background-color": "=if(@currentField == 'Active', '#dff6dd', if(@currentField == 'Pending', '#fff4ce', '#fde7e9'))",
    "color": "=if(@currentField == 'Active', '#107c10', if(@currentField == 'Pending', '#797600', '#a80000'))"
  },
  "children": [
    {
      "elmType": "span",
      "attributes": {
        "iconName": "=if(@currentField == 'Active', 'CompletedSolid', if(@currentField == 'Pending', 'Clock', 'ErrorBadge'))"
      }
    },
    {
      "elmType": "span",
      "txtContent": "@currentField"
    }
  ]
}
\`\`\`

---

## Template 2: Progress Bar

Show a Number column (0\u2013100) as a visual bar that changes color based on progress:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "div",
  "style": {
    "width": "100%",
    "height": "20px",
    "background-color": "#f0f0f0",
    "border-radius": "10px",
    "overflow": "hidden",
    "position": "relative"
  },
  "children": [
    {
      "elmType": "div",
      "style": {
        "width": "=toString(@currentField) + '%'",
        "height": "100%",
        "background-color": "=if(@currentField >= 80, '#0078d4', if(@currentField >= 50, '#ffaa44', '#d13438'))",
        "border-radius": "10px",
        "transition": "width 0.3s"
      }
    },
    {
      "elmType": "span",
      "style": {
        "position": "absolute",
        "left": "50%",
        "top": "50%",
        "transform": "translate(-50%,-50%)",
        "font-size": "11px",
        "font-weight": "600",
        "color": "#333"
      },
      "txtContent": "=toString(@currentField) + '%'"
    }
  ]
}
\`\`\`

---

## Template 3: Due Date with Overdue Highlight

Highlight a Date column red if overdue, yellow if due within 7 days, and green if future:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "div",
  "style": {
    "display": "flex",
    "align-items": "center",
    "gap": "6px",
    "padding": "4px 10px",
    "border-radius": "4px",
    "background-color": "=if(@currentField <= @now, '#fde7e9', if(@currentField <= @now + 604800000, '#fff4ce', '#dff6dd'))",
    "color": "=if(@currentField <= @now, '#a80000', if(@currentField <= @now + 604800000, '#797600', '#107c10'))"
  },
  "children": [
    {
      "elmType": "span",
      "attributes": {
        "iconName": "=if(@currentField <= @now, 'Warning', 'Calendar')"
      }
    },
    {
      "elmType": "span",
      "txtContent": "@currentField"
    }
  ]
}
\`\`\`

> **Note:** \`604800000\` is 7 days in milliseconds. Use this for date arithmetic with \`@now\`.

---

## Template 4: Person Column with Profile Image

Display a Person column as an avatar with name instead of plain text:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "div",
  "style": {
    "display": "flex",
    "align-items": "center",
    "gap": "8px"
  },
  "children": [
    {
      "elmType": "img",
      "style": {
        "width": "32px",
        "height": "32px",
        "border-radius": "50%",
        "object-fit": "cover"
      },
      "attributes": {
        "src": "='/_layouts/15/userphoto.aspx?size=S&accountname=' + @currentField.email"
      }
    },
    {
      "elmType": "span",
      "style": { "font-weight": "600" },
      "txtContent": "@currentField.title"
    }
  ]
}
\`\`\`

---

## Template 5: Priority Column with Color Dots

Show a priority level as a colored dot + text:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "div",
  "style": { "display": "flex", "align-items": "center", "gap": "8px" },
  "children": [
    {
      "elmType": "div",
      "style": {
        "width": "10px",
        "height": "10px",
        "border-radius": "50%",
        "background-color": "=if(@currentField == 'Critical', '#d13438', if(@currentField == 'High', '#ffaa44', if(@currentField == 'Medium', '#0078d4', '#76b900')))"
      }
    },
    {
      "elmType": "span",
      "txtContent": "@currentField"
    }
  ]
}
\`\`\`

---

## Template 6: Clickable URL Button

Convert a hyperlink column into a styled action button:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "a",
  "style": {
    "display": "inline-flex",
    "align-items": "center",
    "gap": "6px",
    "padding": "6px 14px",
    "border-radius": "4px",
    "background-color": "#0078d4",
    "color": "#ffffff",
    "text-decoration": "none",
    "font-size": "13px"
  },
  "attributes": {
    "href": "@currentField",
    "target": "_blank"
  },
  "children": [
    {
      "elmType": "span",
      "attributes": { "iconName": "OpenInNewWindow" }
    },
    {
      "elmType": "span",
      "txtContent": "Open Link"
    }
  ]
}
\`\`\`

---

## Template 7: Yes/No Toggle with Icons

Replace the default checkbox with a visual indicator:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "div",
  "style": {
    "display": "flex",
    "align-items": "center",
    "gap": "6px",
    "color": "=if(@currentField == true, '#107c10', '#a80000')"
  },
  "children": [
    {
      "elmType": "span",
      "attributes": {
        "iconName": "=if(@currentField == true, 'CheckboxComposite', 'Checkbox')"
      },
      "style": { "font-size": "18px" }
    },
    {
      "elmType": "span",
      "txtContent": "=if(@currentField == true, 'Complete', 'Incomplete')"
    }
  ]
}
\`\`\`

---

## Template 8: Row Formatting \u2014 Highlight Overdue Items

Apply background color to entire rows using view formatting:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/view-formatting.schema.json",
  "schema": "https://developer.microsoft.com/json-schemas/sp/v2/row-formatting.schema.json",
  "additionalRowClass": "=if([$DueDate] <= @now && [$Status] != 'Completed', 'sp-css-backgroundColor-errorBackground', if([$DueDate] <= @now + 604800000 && [$Status] != 'Completed', 'sp-css-backgroundColor-warningBackground', ''))"
}
\`\`\`

This highlights overdue rows in red and approaching-due rows in yellow, but leaves completed items unstyled.

---

## Excel-Style Expressions vs AST Syntax

SharePoint supports two expression syntaxes. The v2 schema (2024+) supports **Excel-style expressions**, which are much easier to read:

| Syntax | Example | Readability |
|--------|---------|:-----------:|
| **Excel-style** (recommended) | \`=if(@currentField == 'Active', 'green', 'red')\` | \u2705 Easy |
| **AST (legacy)** | \`{"operator": "?", "operands": [{"operator": "==", "operands": ["@currentField", "Active"]}, "green", "red"]}\` | \u274C Verbose |

> **Always use Excel-style expressions** unless you need to support SharePoint Server 2019, which only understands AST syntax.

### Nesting If Statements

\`\`\`
=if(@currentField == 'Critical', '#d13438',
  if(@currentField == 'High', '#ffaa44',
    if(@currentField == 'Medium', '#0078d4', '#76b900')))
\`\`\`

---

## Fluent UI Classes and Icons

SharePoint provides predefined CSS classes and icons from [Fluent UI](https://developer.microsoft.com/fluentui#/styles/web/icons). Using these classes ensures your formatting looks consistent with the rest of SharePoint.

### Useful Predefined Classes

| Class | Effect |
|-------|--------|
| \`sp-css-backgroundColor-successBackground\` | Green background |
| \`sp-css-backgroundColor-warningBackground\` | Yellow background |
| \`sp-css-backgroundColor-errorBackground\` | Red background |
| \`sp-css-color-GreenDark\` | Dark green text |
| \`sp-field-severity--warning\` | Warning severity style |
| \`sp-field-severity--good\` | Good severity style |

### Popular Icon Names

| Icon | \`iconName\` Value | Use Case |
|------|------------------|----------|
| \u2705 Checkmark | \`CompletedSolid\` | Task done |
| \u26A0\uFE0F Warning | \`Warning\` | Overdue item |
| \u2B50 Star | \`FavoriteStar\` | Featured/important |
| \uD83D\uDCC5 Calendar | \`Calendar\` | Date fields |
| \uD83D\uDC64 Person | \`Contact\` | People columns |
| \uD83D\uDCC4 Document | \`Document\` | File references |

Browse all icons at [Fluent UI Icons](https://developer.microsoft.com/fluentui#/styles/web/icons).

---

## Form Customization with JSON

Customize the new/edit form layout by grouping fields into sections:

1. Open list settings \u2192 **Forms** \u2192 **Configure layout**
2. Select **Header**, **Body**, or **Footer**
3. Paste your JSON

### Example: Form Header

\`\`\`json
{
  "elmType": "div",
  "style": {
    "display": "flex",
    "align-items": "center",
    "gap": "12px",
    "padding": "12px",
    "background-color": "#f3f2f1",
    "border-bottom": "2px solid #0078d4"
  },
  "children": [
    {
      "elmType": "span",
      "attributes": { "iconName": "TaskManager" },
      "style": { "font-size": "24px", "color": "#0078d4" }
    },
    {
      "elmType": "span",
      "style": { "font-size": "18px", "font-weight": "600" },
      "txtContent": "=if([$ID], 'Edit Task: ' + [$Title], 'New Task')"
    }
  ]
}
\`\`\`

---

## Debugging Tips

| Problem | Cause | Fix |
|---------|-------|-----|
| Formatting doesn\\\u2019t appear | Invalid JSON syntax | Validate at jsonlint.com before pasting |
| Column shows raw JSON text | Missing \`$schema\` or wrong schema URL | Use the v2 column-formatting schema |
| Icons don\\\u2019t render | Wrong \`iconName\` value | Check the [Fluent UI icon catalog](https://developer.microsoft.com/fluentui#/styles/web/icons) |
| Colors look wrong | Using hex instead of theme classes | Use \`sp-css-\` classes for theme-aware colors |
| Person field shows \`[object]\` | Not accessing \`.title\` or \`.email\` | Use \`@currentField.title\` for display name |

---

## Frequently Asked Questions

**Can I format any column type?**
Almost. JSON formatting works with Text, Choice, Number, Date, Yes/No, Person, Hyperlink, Lookup, and Managed Metadata columns. It does NOT work with Calculated columns.

**Does formatting change the actual data?**
No. JSON formatting only changes how data **displays**. The underlying values remain unchanged. Other systems consuming the list data via REST or Graph API see the raw values.

**Can different users see different formatting?**
The formatting is applied to the view, so everyone who uses that view sees the same formatting. However, you can use \`@me\` in expressions to personalize the display per user (e.g., highlight items assigned to the current user).

**Is there a character limit for the JSON?**
Yes \u2014 the column formatting JSON limit is approximately **100 KB**. For complex formatting, keep your JSON concise by using Excel-style expressions instead of AST.

**Where can I find more templates?**
Check Microsoft\\\u2019s official community repository: [SharePoint List Formatting Samples](https://github.com/SharePoint/sp-dev-list-formatting) \u2014 it contains 300+ community-contributed templates.

---

## Your Next Steps

1. **Start with Template 1** (Status Badges) \u2014 it works on any Choice column in 30 seconds
2. **Combine templates** \u2014 apply different formatting to each column for a dashboard effect
3. **Use row formatting** (Template 8) to highlight overdue or high-priority items across all columns
4. **Explore form customization** to give your new/edit forms a branded, professional look

For related guides:
- [SharePoint CAML Query Guide](/blog/sharepoint-caml-query-complete-guide-examples-2026) \u2014 query the data behind your formatted views
- [SPFx Web Part: CRUD Operations](/blog/building-spfx-web-part-crud-react-pnpjs-2026) \u2014 when formatting isn\\\u2019t enough, build a custom web part
- [PnP PowerShell: 25 Admin Scripts](/blog/pnp-powershell-sharepoint-online-scripts-admin-guide-2026) \u2014 deploy formatting at scale with PowerShell
- [SharePoint Permissions Explained](/blog/sharepoint-permissions-explained-every-level-role-inheritance-2026) \u2014 understand who can edit list formatting
`,
    date: '2026-03-07',
    displayDate: 'March 7, 2026',
    readTime: '14 min read',
    category: 'SharePoint',
    tags: ['SharePoint', 'JSON Formatting', 'Column Formatting', 'View Formatting', 'No-Code'],
  },
  {
    id: '24',
    slug: 'sharepoint-agents-copilot-studio-build-deploy-guide-2026',
    title: 'SharePoint Agents: Build & Deploy AI Assistants with Copilot Studio (2026)',
    excerpt:
      'Step-by-step guide to building SharePoint Agents with Copilot Studio \u2014 connect document libraries, configure knowledge sources, add Power Automate actions, and deploy to your sites.',
    image: '/images/blog/sharepoint-agents-hero.png',
    content: `
## What Are SharePoint Agents?

SharePoint Agents are AI assistants that live directly inside your SharePoint sites. They use your organization\u2019s documents, lists, and pages as their knowledge base to answer employee questions, summarize documents, and automate workflows \u2014 all without leaving SharePoint.

Unlike generic chatbots, SharePoint Agents are **grounded in your content**. They respect SharePoint permissions (a user can only get answers based on documents they have access to), and they\u2019re built using Microsoft Copilot Studio \u2014 no coding required.

### Why This Matters in 2026

- **AI in SharePoint** (formerly Knowledge Agent) is now GA in SharePoint Online
- **Copilot Studio** supports direct deployment to SharePoint sites
- **Power Automate integration** lets agents take action \u2014 create tickets, send emails, update lists
- **Permission-aware**: agents respect existing SharePoint security trimming

> **Related:** If you\u2019re new to Copilot Studio, start with our [Copilot Studio: Build AI Assistants for SharePoint](/blog/copilot-studio-build-ai-assistants-sharepoint-sites-2026) overview first.

---

## Prerequisites

Before you start building, ensure you have:

| Requirement | Details |
|-------------|---------|
| **Microsoft 365 license** | E3/E5, or Microsoft 365 Copilot add-on |
| **Copilot Studio access** | Via [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com) |
| **SharePoint permissions** | Site Owner or Site Collection Admin on target site |
| **Power Automate** | Required only if adding workflow actions |

---

## Step 1: Create Your Agent in Copilot Studio

1. Go to [Copilot Studio](https://copilotstudio.microsoft.com)
2. Click **Create** \u2192 **New Agent**
3. Configure the basics:

\`\`\`
Name:           HR Policy Assistant
Description:    Answers employee questions about HR policies, benefits, and leave procedures
Instructions:   You are an HR assistant for Contoso. Answer questions using only the
                documents in the connected SharePoint library. If you don't know the
                answer, say "I don't have that information" and suggest contacting HR.
\`\`\`

**Pro tip:** Be specific in the instructions. Tell the agent what NOT to do \u2014 this reduces hallucination. Include the department name, company name, and scope boundaries.

---

## Step 2: Connect SharePoint as a Knowledge Source

This is the most important step. The agent\u2019s responses are only as good as the content you connect.

1. In Copilot Studio, go to **Knowledge** \u2192 **Add Knowledge**
2. Select **SharePoint** as the source type
3. Enter your SharePoint site URL:

\`\`\`
https://contoso.sharepoint.com/sites/HR-Policies
\`\`\`

### What You Can Connect

| Source Type | How to Add | Best For |
|-------------|-----------|----------|
| **Entire site** | Enter the site URL | Broad Q&A across all documents |
| **Document library** | Enter library URL | Focused answers from specific docs |
| **Specific folder** | Enter folder path | Narrow scope (e.g., only 2026 policies) |
| **SharePoint list** | Enter list URL | Structured data queries (up to 15 lists) |

### Knowledge Source Best Practices

- **Curate your content first.** Remove outdated documents. The agent will cite 2019 policies if they\u2019re still in the library.
- **Use descriptive filenames.** \\\`2026-Leave-Policy-v3.pdf\\\` is better than \\\`doc1.pdf\\\`.
- **Add metadata.** Tag documents with categories, departments, and dates. The agent uses metadata for better retrieval.
- **Keep it focused.** Connecting your entire tenant sounds powerful but produces vague answers. Start with one library.

---

## Step 3: Configure Topics and Prompts

Topics define how your agent handles specific types of questions.

### Default Fallback Topic

Every agent has a system topic that fires when no other topic matches. Customize this:

\`\`\`
Fallback message:
"I can help with HR policies including leave, benefits, compliance, and onboarding.
Could you rephrase your question? If I still can't help, contact hr@contoso.com."
\`\`\`

### Creating a Custom Topic

Example: **Leave Balance Inquiry**

1. Go to **Topics** \u2192 **New Topic** \u2192 **From blank**
2. Add trigger phrases:
   - "How many leave days do I have?"
   - "What is my PTO balance?"
   - "Check my vacation days"
3. Add a **Generative Answers** node that searches the connected SharePoint library
4. Add a follow-up message:

\`\`\`
"For your exact balance, check the Leave Tracker list or contact HR at hr@contoso.com."
\`\`\`

---

## Step 4: Add Power Automate Actions

This is where agents go from "answering questions" to "getting things done."

### Example: Create a Leave Request

1. In your topic, click **Add node** \u2192 **Call an action** \u2192 **Power Automate**
2. Create a new flow:

\`\`\`
Trigger:        When called from Copilot Studio
Input:          EmployeeName (text), StartDate (date), EndDate (date), LeaveType (text)
Actions:
  1. Create item in SharePoint list "Leave Requests"
     - Title: {EmployeeName} - {LeaveType}
     - StartDate: {StartDate}
     - EndDate: {EndDate}
     - Status: "Pending Approval"
  2. Send approval email to manager
  3. Post in Teams channel #hr-requests
Output:         RequestID (number)
\`\`\`

3. Map the flow inputs to agent variables collected during the conversation
4. Use the flow output to confirm: "Your leave request #{RequestID} has been submitted."

> **Related:** For more Power Automate patterns, see our [7 Document Workflows That Save Hours](/blog/power-automate-sharepoint-document-workflows-2026).

---

## Step 5: Test Your Agent

Before deploying, test thoroughly in Copilot Studio\u2019s built-in simulator:

### Test Checklist

| Test | What to Verify |
|------|---------------|
| Simple Q&A | Agent finds and cites the correct document |
| Permission trimming | Agent doesn\u2019t reveal docs the user can\u2019t access |
| Out-of-scope question | Agent gracefully declines with fallback message |
| Action execution | Power Automate flow completes and returns output |
| Multi-turn conversation | Agent maintains context across follow-up questions |

### Common Issues and Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Agent says "I don't know" for valid questions | Content not indexed | Rename files descriptively, re-sync knowledge |
| Agent cites wrong document | Too many similar documents | Narrow the knowledge source or add metadata |
| Action fails silently | Power Automate flow error | Check flow run history in Power Automate |
| Slow responses | Large document library | Reduce scope to specific folders |

---

## Step 6: Deploy to Your SharePoint Site

1. In Copilot Studio, go to **Channels** \u2192 **SharePoint**
2. Select the target SharePoint site from the list
3. Click **Deploy**
4. Wait 5\u201330 minutes for the agent to appear in the SharePoint sidebar

### Post-Deployment

- **Approve the agent:** Work with the site owner to set the status to "Approved"
- **Pin to sidebar:** The agent appears in the SharePoint copilot panel on the right
- **Monitor usage:** Check Copilot Studio analytics for conversation volume and satisfaction

---

## Real-World Use Cases

| Department | Agent Name | Knowledge Source | Actions |
|------------|-----------|-----------------|---------|
| **HR** | Policy Assistant | HR Policies library | Create leave requests, onboarding checklists |
| **IT** | Help Desk Bot | IT Knowledge Base | Create support tickets, password reset links |
| **Legal** | Contract Reviewer | Contracts library | Summarize clauses, flag renewal dates |
| **Sales** | Product FAQ | Product Docs site | Generate quotes, update CRM |
| **Finance** | Expense Guide | Finance Policies | Check expense limits, link to submission forms |

---

## Frequently Asked Questions

**Do I need a Microsoft 365 Copilot license?**
You need either an E3/E5 license with Copilot Studio access, or the Microsoft 365 Copilot add-on. The exact licensing depends on your tenant configuration.

**Does the agent see documents the user can\u2019t access?**
No. SharePoint Agents respect existing security trimming. If a user doesn\u2019t have Read access to a document, the agent won\u2019t use it to generate responses for that user.

**Can I deploy one agent to multiple sites?**
Yes. In Copilot Studio, go to Channels > SharePoint and add multiple sites. The agent\u2019s knowledge sources remain the same.

**How often does the agent re-index SharePoint content?**
New or updated documents typically appear in the agent\u2019s knowledge within minutes. For lists, updates are near real-time.

**Can I use this with on-premises SharePoint?**
No. SharePoint Agents require SharePoint Online (Microsoft 365). On-premises SharePoint Server does not support this feature.

---

## Your Next Steps

1. **Start small** \u2014 build a single-purpose agent for one department
2. **Curate your content** \u2014 clean up the target document library before connecting it
3. **Test with real users** \u2014 have 3-5 department members test before broad deployment
4. **Add actions gradually** \u2014 start with Q&A only, then add Power Automate flows
5. **Monitor and iterate** \u2014 check Copilot Studio analytics weekly

For related guides:
- [Copilot Studio: Build 3 AI Assistants](/blog/copilot-studio-build-ai-assistants-sharepoint-sites-2026) \u2014 the introductory guide
- [Power Automate + SharePoint: 7 Workflows](/blog/power-automate-sharepoint-document-workflows-2026) \u2014 common automation patterns
- [SharePoint Permissions Explained](/blog/sharepoint-permissions-explained-every-level-role-inheritance-2026) \u2014 understand the security model agents rely on
`,
    date: '2026-03-07',
    displayDate: 'March 7, 2026',
    readTime: '10 min read',
    category: 'Microsoft 365',
    tags: ['SharePoint', 'Copilot Studio', 'AI Agents', 'Power Automate', 'Microsoft 365'],
  },
  {
    id: '23',
    slug: 'sharepoint-caml-query-complete-guide-examples-2026',
    title: 'SharePoint CAML Query: Complete Guide with Examples (2026)',
    excerpt:
      'Master CAML queries for SharePoint Online \u2014 syntax, operators, field types, joins, and ready-to-use examples for every common scenario.',
    image: '/images/blog/sharepoint-caml-query-guide.png',
    content: `
## What Is CAML and Why Does It Still Matter in 2026?

CAML (Collaborative Application Markup Language) is SharePoint\u2019s native XML-based query language. Despite Microsoft pushing REST and Graph APIs, CAML remains the most powerful way to query SharePoint lists and libraries when you need:

- **Complex filters** with nested AND/OR logic
- **Specific field projections** (return only the columns you need)
- **Server-side sorting and pagination**
- **Queries inside SPFx web parts** and Power Automate flows

If you\u2019ve ever tried to build a multi-condition filter using REST API\u2019s \`\$filter\` parameter, you know how limited it is. CAML gives you full control.

> **Shortcut:** Use our free [CAML Query Builder](/tools/caml-query-builder) to build queries visually \u2014 select fields, operators, and values, then copy the generated XML. No memorization needed.

---

## CAML Query Structure

Every CAML query follows this skeleton:

\`\`\`xml
<View>
  <Query>
    <Where>
      <!-- Your filter conditions go here -->
    </Where>
    <OrderBy>
      <FieldRef Name="Created" Ascending="FALSE" />
    </OrderBy>
  </Query>
  <ViewFields>
    <FieldRef Name="Title" />
    <FieldRef Name="Status" />
  </ViewFields>
  <RowLimit>100</RowLimit>
</View>
\`\`\`

| Element | Purpose | Required? |
|---------|---------|:---------:|
| \`<View>\` | Root element | \u2705 Yes |
| \`<Query>\` | Contains Where + OrderBy | \u2705 Yes |
| \`<Where>\` | Filter conditions | Optional |
| \`<OrderBy>\` | Sort results | Optional |
| \`<ViewFields>\` | Columns to return (projection) | Optional |
| \`<RowLimit>\` | Max items to return | Optional |

---

## Comparison Operators

### Basic Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| \`<Eq>\` | Equals | Status = "Active" |
| \`<Neq>\` | Not equals | Status \u2260 "Archived" |
| \`<Gt>\` | Greater than | Priority > 3 |
| \`<Geq>\` | Greater than or equal | DueDate \u2265 Today |
| \`<Lt>\` | Less than | Score < 50 |
| \`<Leq>\` | Less than or equal | Budget \u2264 10000 |
| \`<Contains>\` | Contains text | Title contains "Report" |
| \`<BeginsWith>\` | Starts with | FileLeafRef begins with "2026" |
| \`<IsNull>\` | Field is empty | AssignedTo is null |
| \`<IsNotNull>\` | Field is not empty | DueDate is not null |
| \`<In>\` | Value in list | Status in ("Active", "Pending") |

### Example: Simple Equality Filter

\`\`\`xml
<View>
  <Query>
    <Where>
      <Eq>
        <FieldRef Name="Status" />
        <Value Type="Choice">Active</Value>
      </Eq>
    </Where>
  </Query>
</View>
\`\`\`

---

## Field Types and Value Types

Getting the \`Type\` attribute right is critical. A wrong type will silently return zero results.

| SharePoint Field Type | CAML Value Type | Example |
|----------------------|----------------|---------|
| Single line of text | \`Text\` | \`<Value Type="Text">Report</Value>\` |
| Multiple lines | \`Note\` | \`<Value Type="Note">Description</Value>\` |
| Number | \`Number\` | \`<Value Type="Number">42</Value>\` |
| Currency | \`Currency\` | \`<Value Type="Currency">1500.00</Value>\` |
| Date/Time | \`DateTime\` | \`<Value Type="DateTime">2026-03-07T00:00:00Z</Value>\` |
| Yes/No | \`Boolean\` | \`<Value Type="Boolean">1</Value>\` (1=Yes, 0=No) |
| Choice | \`Choice\` | \`<Value Type="Choice">High</Value>\` |
| Person/Group | \`Integer\` | \`<Value Type="Integer">15</Value>\` (user ID) |
| Lookup | \`Lookup\` | \`<Value Type="Lookup">Marketing</Value>\` |
| Managed Metadata | \`Text\` | Use the term label as text |

---

## Combining Conditions: AND / OR

### AND: Both Conditions Must Be True

\`\`\`xml
<Where>
  <And>
    <Eq>
      <FieldRef Name="Status" />
      <Value Type="Choice">Active</Value>
    </Eq>
    <Geq>
      <FieldRef Name="DueDate" />
      <Value Type="DateTime"><Today /></Value>
    </Geq>
  </And>
</Where>
\`\`\`

### OR: Either Condition Can Be True

\`\`\`xml
<Where>
  <Or>
    <Eq>
      <FieldRef Name="Priority" />
      <Value Type="Choice">High</Value>
    </Eq>
    <Eq>
      <FieldRef Name="Priority" />
      <Value Type="Choice">Critical</Value>
    </Eq>
  </Or>
</Where>
\`\`\`

### Nesting: Complex Multi-Condition Queries

CAML requires binary nesting \u2014 each \`<And>\` or \`<Or>\` takes exactly **two** children. For three+ conditions, nest them:

\`\`\`xml
<Where>
  <And>
    <Eq>
      <FieldRef Name="Status" />
      <Value Type="Choice">Active</Value>
    </Eq>
    <And>
      <Geq>
        <FieldRef Name="DueDate" />
        <Value Type="DateTime"><Today /></Value>
      </Geq>
      <Eq>
        <FieldRef Name="Priority" />
        <Value Type="Choice">High</Value>
      </Eq>
    </And>
  </And>
</Where>
\`\`\`

> **Tip:** This binary nesting gets messy fast with 4+ conditions. Use our [CAML Query Builder](/tools/caml-query-builder) to generate the nested XML automatically.

---

## Ready-to-Use Examples

### 1. Active Items Due This Week

\`\`\`xml
<View>
  <Query>
    <Where>
      <And>
        <Eq>
          <FieldRef Name="Status" />
          <Value Type="Choice">In Progress</Value>
        </Eq>
        <And>
          <Geq>
            <FieldRef Name="DueDate" />
            <Value Type="DateTime"><Today /></Value>
          </Geq>
          <Leq>
            <FieldRef Name="DueDate" />
            <Value Type="DateTime"><Today OffsetDays="7" /></Value>
          </Leq>
        </And>
      </And>
    </Where>
    <OrderBy>
      <FieldRef Name="DueDate" Ascending="TRUE" />
    </OrderBy>
  </Query>
  <RowLimit>50</RowLimit>
</View>
\`\`\`

### 2. Documents Modified in the Last 30 Days

\`\`\`xml
<View Scope="RecursiveAll">
  <Query>
    <Where>
      <Geq>
        <FieldRef Name="Modified" />
        <Value Type="DateTime"><Today OffsetDays="-30" /></Value>
      </Geq>
    </Where>
    <OrderBy>
      <FieldRef Name="Modified" Ascending="FALSE" />
    </OrderBy>
  </Query>
  <ViewFields>
    <FieldRef Name="FileLeafRef" />
    <FieldRef Name="Modified" />
    <FieldRef Name="Editor" />
    <FieldRef Name="File_x0020_Size" />
  </ViewFields>
</View>
\`\`\`

### 3. Items Assigned to the Current User

\`\`\`xml
<View>
  <Query>
    <Where>
      <Eq>
        <FieldRef Name="AssignedTo" />
        <Value Type="Integer"><UserID /></Value>
      </Eq>
    </Where>
  </Query>
</View>
\`\`\`

### 4. Items Where a Choice Column Matches Multiple Values

\`\`\`xml
<View>
  <Query>
    <Where>
      <In>
        <FieldRef Name="Department" />
        <Values>
          <Value Type="Choice">Marketing</Value>
          <Value Type="Choice">Sales</Value>
          <Value Type="Choice">HR</Value>
        </Values>
      </In>
    </Where>
  </Query>
</View>
\`\`\`

### 5. Files Larger Than 10 MB

\`\`\`xml
<View Scope="RecursiveAll">
  <Query>
    <Where>
      <Gt>
        <FieldRef Name="File_x0020_Size" />
        <Value Type="Number">10485760</Value>
      </Gt>
    </Where>
    <OrderBy>
      <FieldRef Name="File_x0020_Size" Ascending="FALSE" />
    </OrderBy>
  </Query>
</View>
\`\`\`

---

## Using CAML in PowerShell

\`\`\`powershell
Connect-PnPOnline -Url "https://contoso.sharepoint.com/sites/Project" -Interactive

\$caml = @"
<View>
  <Query>
    <Where>
      <And>
        <Eq>
          <FieldRef Name='Status' />
          <Value Type='Choice'>Active</Value>
        </Eq>
        <Geq>
          <FieldRef Name='DueDate' />
          <Value Type='DateTime'><Today /></Value>
        </Geq>
      </And>
    </Where>
  </Query>
  <RowLimit>100</RowLimit>
</View>
"@

\$items = Get-PnPListItem -List "Tasks" -Query \$caml
\$items | ForEach-Object {
  Write-Host "\$(\$_.FieldValues.Title) - Due: \$(\$_.FieldValues.DueDate)"
}
\`\`\`

For more PowerShell scripts, see my [PnP PowerShell: 25 Admin Scripts](/blog/pnp-powershell-sharepoint-online-scripts-admin-guide-2026).

---

## Using CAML with the REST API

\`\`\`javascript
// SPFx or JavaScript context
const camlXml = [
  "<View><Query><Where>",
  "<Eq><FieldRef Name='Status' />",
  "<Value Type='Choice'>Active</Value></Eq>",
  "</Where></Query><RowLimit>50</RowLimit></View>"
].join("");

const response = await sp.web.lists
  .getByTitle("Tasks")
  .getItemsByCAMLQuery({ ViewXml: camlXml });
\`\`\`

For the full REST API reference, see our [SharePoint REST API Cheat Sheet](/blog/sharepoint-rest-api-cheat-sheet-every-endpoint-2026).

---

## CAML vs REST \$filter vs Microsoft Graph

| Feature | CAML | REST \$filter | Graph API |
|---------|:-:|:-:|:-:|
| Complex AND/OR nesting | \u2705 Unlimited | \u26A0\uFE0F Limited | \u26A0\uFE0F Limited |
| Date offsets (Today +7) | \u2705 Built-in | \u274C Manual | \u274C Manual |
| Current user filter | \u2705 <UserID /> | \u274C Manual | \u2705 /me |
| Recursive folder search | \u2705 Scope=RecursiveAll | \u274C No | \u274C No |
| Managed metadata | \u2705 Yes | \u26A0\uFE0F Tricky | \u274C No |
| Learning curve | \u274C Steep (XML) | \u2705 Easy | \u2705 Easy |
| Modern tooling support | \u26A0\uFE0F SPFx/PnP only | \u2705 Universal | \u2705 Universal |

**Use CAML when** you need complex filters, date offsets, recursive folder search, or current-user context. **Use REST/Graph** for simple queries and cross-platform integrations.

---

## Frequently Asked Questions

**Is CAML deprecated in SharePoint Online?**
No. CAML is fully supported in SharePoint Online as of 2026. Microsoft has not announced any deprecation. It is used internally by SharePoint\u2019s own views, and PnP PowerShell uses it extensively via the \`-Query\` parameter.

**Why does my CAML query return zero results?**
The most common cause is a wrong \`Type\` attribute in the \`<Value>\` element. For example, using \`Type="Text"\` on a Choice column will silently return nothing. Always match the Value type to the actual SharePoint field type.

**Can I use CAML with Microsoft Graph API?**
No. Microsoft Graph does not support CAML queries. You must use Graph\u2019s own \`\$filter\` syntax. If you need CAML\u2019s power, use the SharePoint REST API (\`/_api/web/lists/getbytitle('List')/GetItems\`) instead.

**How do I query a Person/Group field?**
Use \`Type="Integer"\` with the user\u2019s ID, or use \`<UserID />\` for the current user. You cannot query by email directly in CAML \u2014 use the user ID lookup.

**What is the maximum RowLimit?**
There is no hard maximum, but SharePoint enforces a **list view threshold of 5,000 items**. Queries that scan more than 5,000 items may be throttled. Use indexed columns in your \`<Where>\` clause to avoid this.

---

## Your Next Steps

1. **Start with simple queries** \u2014 single Eq/Neq filters on indexed columns
2. **Build complex queries visually** with our free [CAML Query Builder](/tools/caml-query-builder) \u2014 select fields, operators, and logic, then copy production-ready XML
3. **Test in PowerShell first** using \`Get-PnPListItem -Query\` before embedding in SPFx code
4. **Index your filter columns** to avoid the 5,000-item threshold

For related guides:
- [SharePoint REST API Cheat Sheet](/blog/sharepoint-rest-api-cheat-sheet-every-endpoint-2026) \u2014 every endpoint you need
- [PnP PowerShell: 25 Admin Scripts](/blog/pnp-powershell-sharepoint-online-scripts-admin-guide-2026) \u2014 run CAML queries from the terminal
- [SharePoint Column Formatting](/blog/sharepoint-column-formatting-json) \u2014 style the results of your queries
`,
    date: '2026-03-07',
    displayDate: 'March 7, 2026',
    readTime: '12 min read',
    category: 'SharePoint',
    tags: ['SharePoint', 'CAML', 'Query', 'REST API', 'PowerShell'],
  },

  {
    id: '22',
    slug: 'sharepoint-permissions-explained-every-level-role-inheritance-2026',
    title: 'SharePoint Permissions Explained: Every Level, Role & Inheritance Pattern (2026)',
    excerpt:
      'The complete guide to SharePoint Online permissions \u2014 permission levels, SharePoint groups, inheritance, broken inheritance, and the PowerShell scripts to audit it all.',
    image: '/images/blog/sharepoint-permissions-guide.png',
    content: `
## Why SharePoint Permissions Confuse Everyone

SharePoint permissions are one of the most misunderstood topics in the Microsoft 365 ecosystem. Admins inherit a site collection from someone who left, find 14 custom permission levels, broken inheritance on random folders, and no documentation.

The result? Either everything is locked down too tight (users cannot work), or everything is wide open (data leaks waiting to happen).

This guide breaks down the entire permissions model from the ground up \u2014 what each level does, how inheritance works, when to break it, and the PowerShell scripts to audit your current state.

> **Shortcut:** Use our free [Permission Matrix](/tools/permission-matrix) to visualize which permission levels include which capabilities \u2014 side-by-side comparison without memorizing anything.

---

## The Three Layers of SharePoint Permissions

SharePoint permissions work in three layers:

| Layer | What It Is | Example |
|-------|-----------|---------|
| **Permission Levels** | A named set of individual permissions | "Contribute" = Add, Edit, Delete items |
| **SharePoint Groups** | Collections of users assigned a permission level | "Site Members" group gets "Contribute" |
| **Scope** | Where the permission applies | Site, library, folder, or individual item |

Think of it as: **Users** go into **Groups**, groups get **Permission Levels**, and permission levels apply to a **Scope**.

---

## Built-In Permission Levels

SharePoint Online comes with these default permission levels:

| Permission Level | What Users Can Do | Typical Use |
|------------------|------------------|-------------|
| **Full Control** | Everything \u2014 manage permissions, delete site, change structure | Site owners only |
| **Design** | Create lists/libraries, edit pages, apply themes | Intranet designers |
| **Edit** | Add, edit, delete items and documents | Team members |
| **Contribute** | Add, edit, delete own items | External contributors |
| **Read** | View pages and documents only | Visitors, stakeholders |
| **View Only** | View documents in browser only (no download) | Sensitive document viewers |
| **Limited Access** | Auto-assigned when accessing a specific item below a secured parent | System-managed \u2014 do not assign manually |

### The Difference Between Contribute and Edit

This is the most common source of confusion:

| Capability | Contribute | Edit |
|------------|:---------:|:----:|
| Add items | \u2705 | \u2705 |
| Edit own items | \u2705 | \u2705 |
| Edit others' items | \u274C | \u2705 |
| Delete own items | \u2705 | \u2705 |
| Delete others' items | \u274C | \u2705 |
| Create lists/libraries | \u274C | \u2705 |

**Rule of thumb:** Use **Edit** for internal team members. Use **Contribute** for guests or external users who should only manage their own content.

---

## SharePoint Groups

Every modern site comes with three default groups:

| Group | Default Permission Level | Purpose |
|-------|------------------------|---------|
| **Site Owners** | Full Control | Manage site settings, permissions, structure |
| **Site Members** | Edit | Create and manage content |
| **Site Visitors** | Read | View content only |

### When to Create Custom Groups

Create a custom group when:

- You need a permission level between Edit and Read (e.g., "Contribute" for specific users)
- Different teams need different access to different libraries
- External users need a separate group for easy auditing

\`\`\`powershell
# Create a custom SharePoint group
New-PnPGroup -Title "Project Reviewers" -Owner "admin@contoso.com"

# Assign a permission level to the group
Set-PnPGroupPermissions -Identity "Project Reviewers" -AddRole "Contribute"

# Add users to the group
Add-PnPGroupMember -Group "Project Reviewers" -EmailAddress "reviewer@contoso.com"
\`\`\`

---

## Permission Inheritance: The Most Important Concept

By default, every object in SharePoint inherits permissions from its parent:

\`\`\`
Site Collection (Full Control, Edit, Read)
  \u251C\u2500\u2500 Subsite (inherits from site collection)
  \u2502   \u251C\u2500\u2500 Document Library (inherits from subsite)
  \u2502   \u2502   \u251C\u2500\u2500 Folder (inherits from library)
  \u2502   \u2502   \u2502   \u2514\u2500\u2500 Document (inherits from folder)
\`\`\`

**This means:** If you change permissions at the site level, everything below it automatically gets the same change. This is the intended behavior and keeps things manageable.

### Breaking Inheritance

Sometimes you need different permissions on a specific library, folder, or item. You do this by **breaking inheritance**:

\`\`\`powershell
# Break inheritance on a specific list (stop inheriting from site)
Set-PnPList -Identity "Confidential Documents" -BreakRoleInheritance

# Now set custom permissions on this list
Set-PnPListPermission -Identity "Confidential Documents" \\
  -Group "Site Members" -RemoveRole "Edit"
Set-PnPListPermission -Identity "Confidential Documents" \\
  -Group "HR Team" -AddRole "Contribute"
\`\`\`

### When to Break Inheritance

| Scenario | Break Inheritance? | Better Alternative |
|----------|:-:|----|
| One confidential folder in a shared library | \u2705 Yes | None \u2014 this is the correct use |
| Different permissions per project subfolder | \u26A0\uFE0F Maybe | Consider separate libraries instead |
| Every folder has different permissions | \u274C No | Redesign your information architecture |
| One file needs restricted access | \u2705 Yes | But consider a separate library if recurring |

> **Warning:** Excessive broken inheritance is the #1 cause of permissions chaos. If you are breaking inheritance on more than 5-10 items in a library, you probably need a different structure \u2014 separate libraries or separate sites.

---

## Common Permission Patterns

### Pattern 1: Team Site with External Reviewers

\`\`\`
Site Members (Edit) \u2192 Internal team
Site Visitors (Read) \u2192 Stakeholders
Project Reviewers (Contribute) \u2192 External reviewers (custom group)
\`\`\`

### Pattern 2: Department Site with Confidential Folder

\`\`\`
Document Library \u2192 inherits site permissions (Edit for members)
  \u2514\u2500\u2500 "HR Confidential" folder \u2192 broken inheritance
       \u2192 Only HR Team group has Contribute
       \u2192 Site Members have NO access
\`\`\`

### Pattern 3: Read-Only Archive

\`\`\`powershell
# Convert a library to read-only for everyone except owners
Set-PnPList -Identity "2024 Archive" -BreakRoleInheritance
Set-PnPListPermission -Identity "2024 Archive" \\
  -Group "Site Members" -RemoveRole "Edit"
Set-PnPListPermission -Identity "2024 Archive" \\
  -Group "Site Members" -AddRole "Read"
\`\`\`

---

## Auditing Permissions with PowerShell

### List All Users and Their Permission Levels

\`\`\`powershell
Get-PnPGroup | ForEach-Object {
  \$group = \$_
  \$roles = Get-PnPGroupPermissions -Identity \$group |
    Select-Object -ExpandProperty Name
  Get-PnPGroupMember -Group \$group | ForEach-Object {
    [PSCustomObject]@{
      User    = \$_.Title
      Email   = \$_.Email
      Group   = \$group.Title
      Roles   = (\$roles -join ", ")
    }
  }
} | Format-Table -AutoSize
\`\`\`

### Find All Items with Broken Inheritance

\`\`\`powershell
\$lists = Get-PnPList | Where-Object { \$_.Hidden -eq \$false }
foreach (\$list in \$lists) {
  if (-not \$list.HasUniqueRoleAssignments) { continue }
  Write-Host "BROKEN: \$(\$list.Title)" -ForegroundColor Yellow

  Get-PnPListItem -List \$list -PageSize 500 | ForEach-Object {
    if (\$_.HasUniqueRoleAssignments) {
      Write-Host "  - Item \$(\$_.Id): \$(\$_.FieldValues.FileLeafRef)"
    }
  }
}
\`\`\`

### Export a Full Permissions Report

\`\`\`powershell
\$report = @()
Get-PnPList | Where-Object { -not \$_.Hidden } | ForEach-Object {
  \$list = \$_
  \$report += [PSCustomObject]@{
    List              = \$list.Title
    InheritsPerms     = -not \$list.HasUniqueRoleAssignments
    ItemCount         = \$list.ItemCount
  }
}
\$report | Export-Csv -Path "permissions-report.csv" -NoTypeInformation
Write-Host "Exported \$(\$report.Count) lists."
\`\`\`

For the full PowerShell admin toolkit, see my comprehensive [PnP PowerShell: 25 Scripts Every Admin Needs](/blog/pnp-powershell-sharepoint-online-scripts-admin-guide-2026).

---

## Frequently Asked Questions

**What is Limited Access and why does it appear?**
Limited Access is auto-assigned by SharePoint when a user has permission to a specific item (like a file) but not to the parent library or site. You cannot assign or remove it manually \u2014 it is system-managed.

**Can I create custom permission levels?**
Yes. Go to Site Settings > Site Permissions > Permission Levels > Add a Permission Level. Select only the individual permissions you need. However, keep custom levels to a minimum \u2014 they make auditing harder.

**How do I check what permissions a specific user has?**
Go to Site Settings > Site Permissions > Check Permissions. Enter the user\u2019s email to see their effective permissions and which groups they belong to. In PowerShell: \`Get-PnPUser -Identity "user@contoso.com" | Get-PnPUserEffectivePermissions\`.

**Should I assign permissions to individual users or groups?**
**Always use groups.** Assigning permissions to individuals creates an unmanageable mess. When someone leaves, you have to find and remove them from every library, folder, and item. With groups, you remove them once.

**What happens when I share a file via the Share button?**
SharePoint creates a unique sharing link and breaks inheritance on that specific file. The recipient gets Limited Access at the site level and direct permissions on the file. This is fine for occasional sharing but creates broken inheritance at scale.

---

## Best Practices

| Do | Don\u2019t |
|----|---------|
| Use SharePoint groups for all permissions | Assign permissions to individual users |
| Keep inheritance intact wherever possible | Break inheritance on every folder |
| Use separate libraries for different access levels | Create 10 permission levels for one library |
| Audit permissions quarterly with PowerShell | Assume permissions are correct because they were set once |
| Document your permission model | Rely on tribal knowledge |

---

## Your Next Steps

1. **Audit your current state** \u2014 run the PowerShell scripts above to see where inheritance is broken
2. **Visualize permissions** with our free [Permission Matrix](/tools/permission-matrix) \u2014 compare what each level includes at a glance
3. **Consolidate broken inheritance** \u2014 if more than 5 items in a library have unique permissions, restructure
4. **Document your model** \u2014 write down which groups exist, what they access, and keep it in a shared location

For related guides:
- [PnP PowerShell: 25 Admin Scripts](/blog/pnp-powershell-sharepoint-online-scripts-admin-guide-2026) \u2014 the full admin toolkit
- [Site Scripts & Site Designs](/blog/sharepoint-site-scripts-site-designs-provisioning-guide-2026) \u2014 automate site provisioning with correct permissions from day one
- [SharePoint REST API Cheat Sheet](/blog/sharepoint-rest-api-cheat-sheet-every-endpoint-2026) \u2014 every endpoint you need
`,
    date: '2026-03-07',
    displayDate: 'March 7, 2026',
    readTime: '11 min read',
    category: 'SharePoint',
    tags: ['SharePoint', 'Permissions', 'Security', 'PowerShell', 'Admin'],
  },

  {
    id: '21',
    slug: 'sharepoint-site-scripts-site-designs-provisioning-guide-2026',
    title: 'SharePoint Site Scripts & Site Designs: Automate Site Provisioning (2026)',
    excerpt:
      'Stop building SharePoint sites by hand. Use site scripts and site designs to provision consistent, branded sites with lists, columns, themes, and permissions \u2014 all from a single JSON template.',
    image: '/images/blog/sharepoint-site-scripts-designs-guide.png',
    content: `
## Why You Need Automated Site Provisioning

Every time someone in your organization creates a new SharePoint site, the same questions come up: Where is the task list? Why does this site look different from the others? Who forgot to set the permissions?

**Site scripts** and **site designs** solve this by defining a repeatable blueprint for site creation. You write a JSON file that describes what the site should contain \u2014 lists, columns, themes, navigation, permissions \u2014 and SharePoint executes it automatically every time a new site is created.

No manual setup. No inconsistency. No missed steps.

> **Shortcut:** Use our free [Site Script Generator](/tools/site-script-generator) to build JSON templates visually \u2014 pick actions, configure parameters, and copy the output. No memorization needed.

---

## How Site Scripts and Site Designs Work

Think of it as two layers:

| Component | What It Does | Format |
|-----------|-------------|--------|
| **Site Script** | A JSON file with a list of actions (create list, apply theme, add columns) | JSON |
| **Site Design** | A wrapper that bundles one or more site scripts into a selectable template | PowerShell / REST API |

When a user creates a new site and selects your custom site design, SharePoint runs every action in the linked site scripts \u2014 in order, automatically.

### Key Properties

- **Idempotent**: Running the same script twice does not create duplicates. It updates existing elements.
- **Non-destructive**: Scripts add or modify \u2014 they never delete existing content.
- **Scoped**: Each script targets a single site. No cross-site side effects.

---

## Step-by-Step: Create Your First Site Script

### Step 1: Write the JSON

Here is a complete site script that creates a project management setup:

\`\`\`json
{
  "\$schema": "https://developer.microsoft.com/json-schemas/sp/site-design-script-actions.schema.json",
  "actions": [
    {
      "verb": "createSPList",
      "listName": "Project Tasks",
      "templateType": 100,
      "subactions": [
        {
          "verb": "setDescription",
          "description": "Track all project deliverables and deadlines"
        },
        {
          "verb": "addSPField",
          "fieldType": "DateTime",
          "displayName": "Due Date",
          "internalName": "DueDate",
          "isRequired": true
        },
        {
          "verb": "addSPField",
          "fieldType": "Choice",
          "displayName": "Priority",
          "internalName": "Priority",
          "choices": ["High", "Medium", "Low"]
        },
        {
          "verb": "addSPField",
          "fieldType": "Choice",
          "displayName": "Status",
          "internalName": "Status",
          "choices": ["Not Started", "In Progress", "Completed", "Blocked"]
        },
        {
          "verb": "addSPField",
          "fieldType": "User",
          "displayName": "Assigned To",
          "internalName": "AssignedTo"
        }
      ]
    },
    {
      "verb": "createSPList",
      "listName": "Project Documents",
      "templateType": 101,
      "subactions": [
        {
          "verb": "setDescription",
          "description": "Central repository for all project files"
        },
        {
          "verb": "addSPField",
          "fieldType": "Choice",
          "displayName": "Document Type",
          "internalName": "DocumentType",
          "choices": ["Proposal", "Contract", "Report", "Presentation", "Other"]
        }
      ]
    },
    {
      "verb": "applyTheme",
      "themeName": "Blue"
    },
    {
      "verb": "setSiteLogo",
      "url": "/sites/assets/project-logo.png"
    }
  ]
}
\`\`\`

**Template types:** \`100\` = Generic List, \`101\` = Document Library, \`104\` = Announcements, \`106\` = Calendar.

### Step 2: Register the Site Script

\`\`\`powershell
Connect-PnPOnline -Url "https://contoso.sharepoint.com" -Interactive

\$script = Add-PnPSiteScript \\
  -Title "Project Site Setup" \\
  -Description "Creates task list, document library, and applies branding" \\
  -Content (Get-Content -Path "./project-site-script.json" -Raw)

Write-Host "Site Script ID: \$(\$script.Id)"
\`\`\`

### Step 3: Create the Site Design

\`\`\`powershell
Add-PnPSiteDesign \\
  -Title "Project Site Template" \\
  -Description "Standard project site with task tracking and document management" \\
  -SiteScriptIds \$script.Id \\
  -WebTemplate "64"    # 64 = Team Site, 68 = Communication Site
\`\`\`

### Step 4: Apply to an Existing Site (Optional)

\`\`\`powershell
Invoke-PnPSiteDesign \\
  -Identity "your-site-design-id" \\
  -WebUrl "https://contoso.sharepoint.com/sites/ProjectAlpha"
\`\`\`

---

## Complete Action Reference

Here is every action available in site scripts as of 2026:

### List and Library Actions

| Action (verb) | What It Does |
|---------------|-------------|
| \`createSPList\` | Creates a list or library |
| \`addSPField\` | Adds a column to a list |
| \`addSPFieldXml\` | Adds a column using CAML XML (for complex field types) |
| \`deleteSPField\` | Removes a default column |
| \`addSPView\` | Creates a custom view |
| \`removeSPView\` | Removes a view |
| \`addContentType\` | Adds a content type to a list |
| \`removeContentType\` | Removes a content type |
| \`setSPFieldCustomFormatter\` | Applies JSON column formatting |

### Site Branding Actions

| Action (verb) | What It Does |
|---------------|-------------|
| \`applyTheme\` | Applies a site theme |
| \`setSiteLogo\` | Sets the site logo |
| \`setSiteExternalSharingCapability\` | Controls external sharing |
| \`setRegionalSettings\` | Sets locale, time zone, calendar type |

### Navigation Actions

| Action (verb) | What It Does |
|---------------|-------------|
| \`addNavLink\` | Adds a link to site navigation |
| \`removeNavLink\` | Removes a navigation link |
| \`setNavLayoutType\` | Sets navigation style (cascading, megamenu) |

### Advanced Actions

| Action (verb) | What It Does |
|---------------|-------------|
| \`installSolution\` | Installs an SPFx solution from the app catalog |
| \`associateHubSite\` | Associates the site with a hub site |
| \`addPrincipalToSPGroup\` | Adds a user or group to a SharePoint group |
| \`triggerFlow\` | Triggers a Power Automate flow for advanced provisioning |

> For advanced provisioning beyond what site scripts support natively (page layouts, web parts, complex permissions), use \`triggerFlow\` to call a Power Automate flow that runs a PnP provisioning template. See our guide on [Power Automate + SharePoint workflows](/blog/power-automate-sharepoint-document-workflows-2026).

---

## Real-World Examples

### Example 1: HR Onboarding Site

\`\`\`json
{
  "\$schema": "https://developer.microsoft.com/json-schemas/sp/site-design-script-actions.schema.json",
  "actions": [
    {
      "verb": "createSPList",
      "listName": "Onboarding Checklist",
      "templateType": 100,
      "subactions": [
        {
          "verb": "addSPField",
          "fieldType": "Boolean",
          "displayName": "Completed",
          "internalName": "Completed"
        },
        {
          "verb": "addSPField",
          "fieldType": "Choice",
          "displayName": "Category",
          "internalName": "Category",
          "choices": ["IT Setup", "HR Paperwork", "Team Introduction", "Training"]
        }
      ]
    },
    {
      "verb": "createSPList",
      "listName": "Employee Handbook",
      "templateType": 101
    },
    {
      "verb": "addNavLink",
      "url": "/sites/HR/SitePages/Welcome.aspx",
      "displayName": "Welcome Guide",
      "isWebRelative": true
    }
  ]
}
\`\`\`

### Example 2: Client Portal Site

\`\`\`json
{
  "\$schema": "https://developer.microsoft.com/json-schemas/sp/site-design-script-actions.schema.json",
  "actions": [
    {
      "verb": "createSPList",
      "listName": "Deliverables",
      "templateType": 101,
      "subactions": [
        {
          "verb": "addSPField",
          "fieldType": "Choice",
          "displayName": "Status",
          "internalName": "DeliverableStatus",
          "choices": ["Draft", "In Review", "Approved", "Delivered"]
        },
        {
          "verb": "addSPField",
          "fieldType": "DateTime",
          "displayName": "Deadline",
          "internalName": "Deadline"
        }
      ]
    },
    {
      "verb": "setSiteExternalSharingCapability",
      "capability": "ExistingExternalUserSharingOnly"
    },
    {
      "verb": "applyTheme",
      "themeName": "Teal"
    }
  ]
}
\`\`\`

---

## Managing Site Scripts with PnP PowerShell

### List All Site Scripts

\`\`\`powershell
Get-PnPSiteScript | Select-Object Title, Id, Version | Format-Table -AutoSize
\`\`\`

### Update an Existing Site Script

\`\`\`powershell
Set-PnPSiteScript -Identity "script-id" \\
  -Content (Get-Content -Path "./updated-script.json" -Raw)
\`\`\`

### Delete a Site Script

\`\`\`powershell
Remove-PnPSiteScript -Identity "script-id" -Force
\`\`\`

### List All Site Designs

\`\`\`powershell
Get-PnPSiteDesign | Select-Object Title, Id, WebTemplate | Format-Table -AutoSize
\`\`\`

For more PowerShell admin scripts, see my comprehensive [PnP PowerShell: 25 Scripts Every Admin Needs](/blog/pnp-powershell-sharepoint-online-scripts-admin-guide-2026).

---

## Site Scripts vs. PnP Provisioning Templates

| Feature | Site Scripts | PnP Provisioning Templates |
|---------|:-:|:-:|
| JSON-based | \u2705 Yes | \u274C XML/PnP format |
| Built into SharePoint | \u2705 Native | \u274C Requires PnP module |
| Create lists and columns | \u2705 Yes | \u2705 Yes |
| Apply themes | \u2705 Yes | \u2705 Yes |
| Create pages with web parts | \u274C No | \u2705 Yes |
| Configure complex permissions | \u26A0\uFE0F Limited | \u2705 Full |
| Deploy SPFx solutions | \u2705 Yes | \u2705 Yes |
| Trigger Power Automate | \u2705 Yes | \u2705 Yes |
| Selectable during site creation | \u2705 Yes | \u274C Manual apply |

**Best practice:** Use site scripts for standard provisioning (lists, branding, navigation). Use PnP templates (triggered via \`triggerFlow\`) for advanced scenarios (page layouts, web parts, complex permissions).

---

## Frequently Asked Questions

**How many actions can a single site script contain?**
A site script supports up to **300 actions** in a single JSON block. For complex setups, split your actions across multiple site scripts and link them to one site design.

**Can I use site scripts with classic SharePoint sites?**
No. Site scripts and site designs only work with **modern** Team sites (group-connected) and Communication sites. Classic sites are not supported.

**What happens if I run a site design on a site that already has the lists?**
Nothing breaks. Site scripts are **idempotent** \u2014 if a list already exists, the script skips the creation and applies any missing columns or settings. It will not create duplicates.

**Can I restrict who sees a custom site design?**
Yes. Use \`Grant-PnPSiteDesignRights\` to limit visibility to specific users or security groups. By default, site designs are visible to everyone.

**How do I debug a failing site script?**
Use \`Get-PnPSiteDesignRun\` to check the execution log for a specific site. It shows which actions succeeded, which failed, and error messages for each step.

---

## Your Next Steps

1. **Start simple** \u2014 create a site script with one list and one theme
2. **Test on a dev site** using \`Invoke-PnPSiteDesign\` before making it available tenant-wide
3. **Build scripts visually** with our free [Site Script Generator](/tools/site-script-generator) \u2014 select actions, configure parameters, and export production-ready JSON
4. **Graduate to PnP templates** when you need page layouts, web parts, or complex permissions

For related guides, explore:
- [SharePoint REST API Cheat Sheet](/blog/sharepoint-rest-api-cheat-sheet-every-endpoint-2026) \u2014 every endpoint you need
- [PnP PowerShell: 25 Admin Scripts](/blog/pnp-powershell-sharepoint-online-scripts-admin-guide-2026) \u2014 manage your tenant
- [SharePoint Column Formatting](/blog/sharepoint-column-formatting-json-guide) \u2014 make your lists look professional
`,
    date: '2026-03-07',
    displayDate: 'March 7, 2026',
    readTime: '13 min read',
    category: 'SharePoint',
    tags: ['SharePoint', 'Site Scripts', 'Site Designs', 'Provisioning', 'PowerShell', 'JSON'],
  },

  {
    id: '20',
    slug: 'pnp-powershell-sharepoint-online-scripts-admin-guide-2026',
    title: 'PnP PowerShell for SharePoint Online: 25 Scripts Every Admin Needs (2026)',
    excerpt:
      'The only PnP PowerShell reference you need \u2014 25 ready-to-run scripts for site provisioning, list management, user permissions, file operations, and SPFx deployment.',
    image: '/images/blog/pnp-powershell-admin-scripts-guide.png',
    content: `
## Why PnP PowerShell Is the SharePoint Admin\u2019s Best Friend

If you manage SharePoint Online, you already know the admin center has limits. Bulk operations, automated provisioning, permission audits \u2014 these tasks demand scripting. And in 2026, **PnP PowerShell** is the undisputed standard.

PnP PowerShell is an open-source, community-maintained module that wraps the Microsoft Graph API and SharePoint REST API into clean, intuitive cmdlets. It covers sites, lists, users, files, permissions, and even SPFx deployment \u2014 all from a single terminal.

This guide gives you **25 ready-to-run scripts** organized by category. Copy, paste, adapt. No fluff.

> **Shortcut:** Use our free [PnP PowerShell Generator](/tools/pnp-script-generator) to build scripts visually \u2014 pick an operation, configure parameters, and copy the output. No memorization needed.

---

## Prerequisites: Install and Connect

### Step 1: Install PowerShell 7

PnP PowerShell requires **PowerShell 7.4 or later** (not Windows PowerShell 5.1):

\`\`\`powershell
winget install --id Microsoft.PowerShell --source winget
\`\`\`

### Step 2: Install the PnP PowerShell Module

\`\`\`powershell
Install-Module -Name PnP.PowerShell -Scope CurrentUser
\`\`\`

### Step 3: Connect to Your Tenant

\`\`\`powershell
# Interactive login (MFA supported)
Connect-PnPOnline -Url "https://contoso.sharepoint.com/sites/ProjectHub" -Interactive

# App-only authentication (for automation)
Connect-PnPOnline -Url "https://contoso.sharepoint.com" \\
  -ClientId "your-app-id" \\
  -Tenant "contoso.onmicrosoft.com" \\
  -CertificatePath "./cert.pfx"
\`\`\`

> **Tip:** For scheduled scripts in Azure Automation, use **Managed Identity** authentication. See the [Microsoft docs on PnP + Azure Automation](https://learn.microsoft.com/en-us/sharepoint/dev/declarative-customization/site-design-pnp-provisioning).

---

## Category 1: Site Management (Scripts 1\u20135)

### 1. List All Site Collections

\`\`\`powershell
Get-PnPTenantSite | Select-Object Url, Template, StorageUsageCurrent, Owner |
  Format-Table -AutoSize
\`\`\`

### 2. Create a Modern Communication Site

\`\`\`powershell
New-PnPSite -Type CommunicationSite \\
  -Title "Marketing Hub" \\
  -Url "https://contoso.sharepoint.com/sites/MarketingHub" \\
  -SiteDesign Showcase
\`\`\`

### 3. Apply a Site Design

\`\`\`powershell
# Get available site designs
Get-PnPSiteDesign | Select-Object Title, Id

# Apply one to a site
Invoke-PnPSiteDesign -Identity "your-design-id" \\
  -WebUrl "https://contoso.sharepoint.com/sites/ProjectHub"
\`\`\`

### 4. Export Site Provisioning Template

\`\`\`powershell
Get-PnPSiteTemplate -Out "template.pnp" \\
  -Handlers Lists, Fields, ContentTypes, Navigation
\`\`\`

### 5. Apply a Provisioning Template to Another Site

\`\`\`powershell
Connect-PnPOnline -Url "https://contoso.sharepoint.com/sites/NewSite" -Interactive
Invoke-PnPSiteTemplate -Path "template.pnp"
\`\`\`

---

## Category 2: List and Library Management (Scripts 6\u201310)

### 6. Create a Custom List with Columns

\`\`\`powershell
New-PnPList -Title "Project Tasks" -Template GenericList

Add-PnPField -List "Project Tasks" -DisplayName "Due Date" \\
  -InternalName "DueDate" -Type DateTime
Add-PnPField -List "Project Tasks" -DisplayName "Priority" \\
  -InternalName "Priority" -Type Choice \\
  -Choices "High", "Medium", "Low"
Add-PnPField -List "Project Tasks" -DisplayName "Assigned To" \\
  -InternalName "AssignedTo" -Type User
\`\`\`

### 7. Bulk Add Items to a List

\`\`\`powershell
\$items = Import-Csv -Path "tasks.csv"

foreach (\$item in \$items) {
  Add-PnPListItem -List "Project Tasks" -Values @{
    "Title"    = \$item.Title
    "DueDate"  = \$item.DueDate
    "Priority" = \$item.Priority
  }
}
Write-Host "Imported \$(\$items.Count) items."
\`\`\`

### 8. Export List Items to CSV

\`\`\`powershell
Get-PnPListItem -List "Project Tasks" -PageSize 500 |
  Select-Object @{N='Title';E={\$_.FieldValues.Title}},
    @{N='DueDate';E={\$_.FieldValues.DueDate}},
    @{N='Priority';E={\$_.FieldValues.Priority}} |
  Export-Csv -Path "tasks-export.csv" -NoTypeInformation
\`\`\`

### 9. Delete All Items in a List (Batch)

\`\`\`powershell
\$items = Get-PnPListItem -List "Archive" -PageSize 500
foreach (\$item in \$items) {
  Remove-PnPListItem -List "Archive" -Identity \$item.Id -Force
}
Write-Host "Deleted \$(\$items.Count) items."
\`\`\`

### 10. Copy a List to Another Site

\`\`\`powershell
# Export from source
\$items = Get-PnPListItem -List "Tasks" -PageSize 500

# Connect to target
Connect-PnPOnline -Url "https://contoso.sharepoint.com/sites/Target" -Interactive

# Import
foreach (\$item in \$items) {
  Add-PnPListItem -List "Tasks" -Values @{
    "Title" = \$item.FieldValues.Title
    "Status" = \$item.FieldValues.Status
  }
}
\`\`\`

---

## Category 3: User and Permission Management (Scripts 11\u201315)

### 11. List All Site Collection Admins

\`\`\`powershell
Get-PnPSiteCollectionAdmin | Select-Object Title, Email |
  Format-Table -AutoSize
\`\`\`

### 12. Add a Site Collection Admin

\`\`\`powershell
Add-PnPSiteCollectionAdmin -Owners "admin@contoso.com"
\`\`\`

### 13. Get All Users with Their Permission Levels

\`\`\`powershell
Get-PnPGroup | ForEach-Object {
  \$group = \$_
  Get-PnPGroupMember -Group \$group | ForEach-Object {
    [PSCustomObject]@{
      Group = \$group.Title
      User  = \$_.Title
      Email = \$_.Email
    }
  }
} | Format-Table -AutoSize
\`\`\`

### 14. Grant a User Permissions to a Specific Folder

\`\`\`powershell
Set-PnPFolderPermission \\
  -List "Documents" \\
  -Identity "Shared Documents/Confidential" \\
  -User "user@contoso.com" \\
  -AddRole "Contribute"
\`\`\`

### 15. Remove a User from All SharePoint Groups

\`\`\`powershell
\$userEmail = "departing-employee@contoso.com"
Get-PnPGroup | ForEach-Object {
  try {
    Remove-PnPGroupMember -Group \$_ -LoginName \$userEmail -ErrorAction Stop
    Write-Host "Removed from: \$(\$_.Title)"
  } catch {
    # User not in this group, skip
  }
}
\`\`\`

---

## Category 4: File and Document Operations (Scripts 16\u201319)

### 16. Upload Files from a Local Folder

\`\`\`powershell
\$files = Get-ChildItem -Path "C:\\Reports\\*.pdf"
foreach (\$file in \$files) {
  Add-PnPFile -Path \$file.FullName \\
    -Folder "Shared Documents/Reports"
  Write-Host "Uploaded: \$(\$file.Name)"
}
\`\`\`

### 17. Download All Files from a Library

\`\`\`powershell
\$files = Get-PnPListItem -List "Documents" -PageSize 500 |
  Where-Object { \$_.FileSystemObjectType -eq "File" }

foreach (\$file in \$files) {
  Get-PnPFile -Url \$file.FieldValues.FileRef \\
    -Path "C:\\Backup" -Filename \$file.FieldValues.FileLeafRef -AsFile
}
\`\`\`

### 18. Find Large Files Across a Site

\`\`\`powershell
Get-PnPListItem -List "Documents" -PageSize 5000 |
  Where-Object { \$_.FieldValues.File_x0020_Size -gt 50MB } |
  Select-Object @{N='File';E={\$_.FieldValues.FileLeafRef}},
    @{N='Size (MB)';E={[math]::Round(\$_.FieldValues.File_x0020_Size / 1MB, 2)}},
    @{N='Path';E={\$_.FieldValues.FileRef}} |
  Sort-Object 'Size (MB)' -Descending |
  Format-Table -AutoSize
\`\`\`

### 19. Move Files Between Libraries

\`\`\`powershell
Move-PnPFile \\
  -SourceUrl "/sites/Source/Shared Documents/Report.pdf" \\
  -TargetUrl "/sites/Target/Shared Documents/Report.pdf" \\
  -Force
\`\`\`

---

## Category 5: Tenant Administration (Scripts 20\u201323)

### 20. Get Tenant Storage Usage Report

\`\`\`powershell
Get-PnPTenantSite | Select-Object Url, StorageUsageCurrent |
  Sort-Object StorageUsageCurrent -Descending |
  Select-Object -First 20 |
  Format-Table -AutoSize
\`\`\`

### 21. Block External Sharing on a Site

\`\`\`powershell
Set-PnPTenantSite -Url "https://contoso.sharepoint.com/sites/Confidential" \\
  -SharingCapability Disabled
\`\`\`

### 22. Enable Version History on All Libraries

\`\`\`powershell
Get-PnPList | Where-Object { \$_.BaseTemplate -eq 101 } | ForEach-Object {
  Set-PnPList -Identity \$_ -EnableVersioning \$true -MajorVersions 50
  Write-Host "Versioning enabled: \$(\$_.Title)"
}
\`\`\`

### 23. Audit External Users Across All Sites

\`\`\`powershell
Get-PnPTenantSite | ForEach-Object {
  Connect-PnPOnline -Url \$_.Url -Interactive
  \$externals = Get-PnPUser | Where-Object { \$_.LoginName -like "*#ext#*" }
  if (\$externals.Count -gt 0) {
    [PSCustomObject]@{
      Site          = \$_.Url
      ExternalUsers = \$externals.Count
    }
  }
} | Format-Table -AutoSize
\`\`\`

---

## Category 6: SPFx Deployment (Scripts 24\u201325)

### 24. Deploy an SPFx Package to the Tenant App Catalog

\`\`\`powershell
Connect-PnPOnline -Url "https://contoso.sharepoint.com/sites/appcatalog" -Interactive

# Upload the .sppkg file
Add-PnPApp -Path "./solution.sppkg" -Scope Tenant -Overwrite

# Deploy (make available tenant-wide)
Publish-PnPApp -Identity "your-app-id" -Scope Tenant
\`\`\`

### 25. List All SPFx Solutions and Their Versions

\`\`\`powershell
Get-PnPApp -Scope Tenant |
  Select-Object Title, AppCatalogVersion, Deployed, InstalledVersion |
  Format-Table -AutoSize
\`\`\`

For more on building SPFx solutions to deploy, see my guides on [building SPFx web parts with React + PnPjs](/blog/spfx-web-part-crud-operations-complete-guide-2026) and [the SPFx 1.23 toolchain migration](/blog/spfx-1-23-new-cli-replacing-yeoman-heft-migration-guide-2026).

---

## Quick Reference: PnP PowerShell vs. Other Tools

| Task | PnP PowerShell | SharePoint Admin Shell | Microsoft Graph PowerShell |
|------|:-:|:-:|:-:|
| Site provisioning | \u2705 Full | \u2705 Basic | \u26A0\uFE0F Limited |
| List/item CRUD | \u2705 Full | \u274C None | \u26A0\uFE0F Via Graph |
| File operations | \u2705 Full | \u274C None | \u2705 Full |
| User/permission mgmt | \u2705 Full | \u2705 Basic | \u2705 Full |
| SPFx deployment | \u2705 Yes | \u274C No | \u274C No |
| Provisioning templates | \u2705 Yes | \u274C No | \u274C No |
| Teams integration | \u2705 Yes | \u274C No | \u2705 Yes |
| Community maintained | \u2705 Active | \u274C Legacy | \u2705 Microsoft |

**Bottom line:** PnP PowerShell covers the widest range of SharePoint operations and is the only module that handles provisioning templates and SPFx deployment.

---

## Frequently Asked Questions

**Do I need Azure AD app registration to use PnP PowerShell?**
For interactive use (manual scripts), no \u2014 you can authenticate with your browser. For automation (Azure Automation, scheduled tasks), yes \u2014 register an app in Microsoft Entra ID with the required API permissions and use certificate or managed identity authentication.

**Can I use PnP PowerShell with Windows PowerShell 5.1?**
No. PnP PowerShell requires **PowerShell 7.4 or later**. Windows PowerShell 5.1 is no longer supported. Install PowerShell 7 separately \u2014 both can coexist on the same machine.

**How do I update PnP PowerShell to the latest version?**
Run \`Update-Module -Name PnP.PowerShell\`. The module is updated frequently with new cmdlets and bug fixes. Check the [PnP PowerShell changelog](https://pnp.github.io/powershell/articles/changelog.html) for release notes.

**Is PnP PowerShell supported by Microsoft?**
PnP PowerShell is a **community-driven** project maintained under the Microsoft 365 Platform Community (PnP) initiative. While not officially supported by Microsoft, it is widely used in production environments and receives contributions from Microsoft employees.

**How do I handle throttling in bulk operations?**
PnP PowerShell has built-in retry logic for throttled requests. For very large operations (10,000+ items), use \`-PageSize\` to batch requests and add \`Start-Sleep -Seconds 1\` between batches to avoid hitting the SharePoint Online rate limit.

---

## Your Next Steps

1. **Install PnP PowerShell** on PowerShell 7.4+ and connect to your tenant
2. **Start with read-only scripts** (listing sites, exporting items) before running modifications
3. **Automate recurring tasks** by scheduling scripts in Azure Automation
4. **Build scripts faster** with our free [PnP PowerShell Generator](/tools/pnp-script-generator) \u2014 select an operation, configure parameters, and copy ready-to-run code

For working with data via APIs instead of PowerShell, see my [SharePoint REST API Cheat Sheet](/blog/sharepoint-rest-api-cheat-sheet-every-endpoint-2026) and [Microsoft Graph API: 10 Practical Examples](/blog/microsoft-graph-api-10-practical-examples-sharepoint-2026).
`,
    date: '2026-03-07',
    displayDate: 'March 7, 2026',
    readTime: '14 min read',
    category: 'SharePoint',
    tags: ['SharePoint', 'PnP PowerShell', 'PowerShell', 'Admin', 'Automation'],
  },

  {
    id: '19',
    slug: 'sharepoint-online-csp-enforcement-spfx-developer-guide-2026',
    title: 'SharePoint Online CSP Enforcement: The SPFx Developer Survival Guide (2026)',
    excerpt:
      'SharePoint Online now enforces Content Security Policy \u2014 and it will break your SPFx solutions if you are not prepared. Here is everything you need to audit, fix, and future-proof your code.',
    image: '/images/blog/sharepoint-csp-enforcement-guide.png',
    content: `
## SharePoint Online Is Enforcing CSP \u2014 And It Will Break Things

Starting **March 1, 2026**, SharePoint Online enforces a strict Content Security Policy (CSP) on all modern pages. Any script that is not explicitly trusted will be **blocked** \u2014 not just logged, but silently killed.

If you maintain SPFx web parts, extensions, or custom solutions that load external scripts, inject inline JavaScript, or depend on third-party CDNs, this change affects you directly.

This guide gives you everything you need: what changed, how to audit your solutions, and the exact steps to fix every common violation.

> **Quick test:** Append \`?csp=enforce\` to any modern SharePoint page URL right now. If your solution breaks, you have work to do. Keep reading.

---

## What Is Content Security Policy (CSP)?

CSP is a browser-level security mechanism. The server sends an HTTP header that tells the browser which script sources are allowed. Everything else is blocked.

| Directive | What It Controls | Example |
|-----------|-----------------|---------|
| \`script-src\` | JavaScript execution | Which domains can serve scripts |
| \`style-src\` | CSS loading | Which domains can serve stylesheets |
| \`connect-src\` | Network requests | Which APIs your code can call |
| \`img-src\` | Image loading | Which domains can serve images |

SharePoint Online\u2019s CSP header restricts \`script-src\` to trusted sources. If your script is not on the approved list, the browser refuses to execute it.

---

## Timeline: What Happened and What Is Coming

| Date | Event | Impact |
|------|-------|--------|
| **September 2025** | CSP enabled in report-only mode | Violations logged, nothing blocked |
| **March 1, 2026** | CSP enforcement begins | Non-compliant scripts blocked |
| **June 1, 2026** | Grace period ends | Delay option expires |

### Can You Delay Enforcement?

Yes, but only until June 1, 2026. Run this PowerShell command:

\`\`\`powershell
Set-SPOTenant -DelayContentSecurityPolicyEnforcement $true
\`\`\`

This buys you 90 days. After June 1, enforcement is mandatory for all tenants. **Use this time to fix, not to wait.**

---

## Who Is Affected?

Not every SPFx solution will break. Here is a quick decision matrix:

| Your Scenario | At Risk? | Action Required |
|---------------|:--------:|-----------------|
| SPFx web part with all code bundled in .sppkg | \u2705 Safe | None \u2014 ClientSideAssets are trusted by default |
| SPFx loading scripts from a custom CDN | \u26A0\uFE0F At Risk | Register CDN domain as trusted source |
| SPFx using \`SPComponentLoader.loadScript()\` from external URLs | \u26A0\uFE0F At Risk | Register the external domain |
| Inline JavaScript in modern page HTML | \u274C Will Break | Refactor to external bundled scripts |
| Script Editor web parts (classic pages) | \u274C Will Break | Migrate to SPFx or register domain |
| Third-party SPFx solutions from vendors | \u26A0\uFE0F Check | Verify vendor has updated their CDN config |

---

## How to Audit Your Tenant Right Now

### Step 1: Test CSP Enforcement on a Page

Append \`?csp=enforce\` to any modern SharePoint page URL:

\`\`\`
https://contoso.sharepoint.com/sites/ProjectHub/SitePages/Home.aspx?csp=enforce
\`\`\`

Open the browser\u2019s DevTools console (F12). Look for errors like:

\`\`\`
Refused to load the script 'https://cdn.example.com/widget.js'
because it violates the Content Security Policy directive: "script-src ..."
\`\`\`

Every error is a script that will stop working when enforcement goes live.

### Step 2: Check CSP Violations in Microsoft Purview

CSP violations are logged in the **Microsoft Purview audit logs**:

1. Go to [compliance.microsoft.com](https://compliance.microsoft.com)
2. Navigate to **Audit** > **Search**
3. Filter by activity type: \`ContentSecurityPolicyViolation\`
4. Review the source URLs that triggered violations

This gives you a tenant-wide view of every page and solution that will be affected.

### Step 3: Inventory Your SPFx Solutions

Use PnP PowerShell to list all SPFx packages and their CDN configuration:

\`\`\`powershell
Connect-PnPOnline -Url "https://contoso.sharepoint.com/sites/appcatalog" -Interactive

# List all SPFx solutions in the tenant app catalog
Get-PnPApp -Scope Tenant | Select-Object Title, Deployed, AppCatalogVersion |
  Format-Table -AutoSize

# Check each solution's manifest for external script references
Get-PnPApp -Scope Tenant | ForEach-Object {
  Write-Host "--- \$($_.Title) ---"
  # Review the .sppkg contents for cdnBasePath or external URLs
}
\`\`\`

---

## The 4 Most Common Violations (and How to Fix Each)

### Violation 1: External CDN for SPFx Bundles

**The problem:** Your SPFx solution hosts its JavaScript bundles on a custom CDN (Azure Blob Storage, CloudFront, etc.) instead of packaging them in the .sppkg file.

**The fix:** Register the CDN domain as a trusted script source.

**Option A: SharePoint Admin Center**

1. Go to the SharePoint Admin Center
2. Navigate to **Settings** > **Advanced** > **Script Sources**
3. Add your CDN domain: \`https://cdn.yourcompany.com\`

**Option B: PowerShell**

\`\`\`powershell
# View current trusted sources
Get-SPOTenantContentSecurityPolicy

# Add your CDN domain
Add-SPOTenantContentSecurityPolicySource -Source "https://cdn.yourcompany.com"

# Verify it was added
Get-SPOTenantContentSecurityPolicy
\`\`\`

### Violation 2: Dynamic Script Loading via DOM Injection

**The problem:** Your code creates \`<script>\` elements and appends them to the DOM at runtime:

\`\`\`typescript
// BAD: This will be blocked by CSP
const script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_KEY';
document.head.appendChild(script);
\`\`\`

**The fix:** Use \`SPComponentLoader\` instead \u2014 it is the SPFx-approved way to load external scripts:

\`\`\`typescript
// GOOD: SPFx-approved dynamic loading
import { SPComponentLoader } from '@microsoft/sp-loader';

await SPComponentLoader.loadScript(
  'https://maps.googleapis.com/maps/api/js?key=YOUR_KEY'
);
\`\`\`

**Important:** You still need to register \`https://maps.googleapis.com\` as a trusted source. \`SPComponentLoader\` does not bypass CSP \u2014 it just uses the approved loading mechanism.

### Violation 3: Inline JavaScript in HTML

**The problem:** Event handlers or inline scripts embedded directly in HTML:

\`\`\`html
<!-- BAD: Inline event handlers blocked by CSP -->
<button onclick="handleClick()">Click me</button>

<!-- BAD: Inline script tags blocked by CSP -->
<script>
  var config = { apiKey: 'abc123' };
</script>
\`\`\`

**The fix:** Move all JavaScript into your bundled TypeScript/JavaScript files:

\`\`\`typescript
// GOOD: Event binding in your SPFx component
public render(): void {
  this.domElement.innerHTML = '<button id="myBtn">Click me</button>';
  this.domElement.querySelector('#myBtn')
    ?.addEventListener('click', this.handleClick.bind(this));
}
\`\`\`

If you are using React (which most modern SPFx solutions do), this is already how you work. React event handlers are not inline scripts \u2014 they are JavaScript function references.

### Violation 4: Third-Party Widget Scripts

**The problem:** Your solution loads analytics, chat widgets, or mapping libraries from external domains.

**The fix:** Register each domain as a trusted source, then load via \`SPComponentLoader\`:

\`\`\`powershell
# Common third-party domains to register
Add-SPOTenantContentSecurityPolicySource -Source "https://www.googletagmanager.com"
Add-SPOTenantContentSecurityPolicySource -Source "https://maps.googleapis.com"
Add-SPOTenantContentSecurityPolicySource -Source "https://cdn.jsdelivr.net"
\`\`\`

> **Warning:** Do not add wildcard entries like \`https://*.com\`. SharePoint blocks overly permissive wildcards. Be specific about each domain you trust.

---

## Best Practices for CSP-Compliant SPFx Development

| Practice | Why |
|----------|-----|
| Bundle everything in .sppkg | ClientSideAssets are auto-trusted \u2014 zero CSP config needed |
| Use \`SPComponentLoader\` for external scripts | Only approved loading mechanism in SPFx |
| Never inject \`<script>\` tags via DOM | Blocked by CSP, even if the source domain is trusted |
| Audit with \`?csp=enforce\` during development | Catch violations before they reach production |
| Keep your trusted sources list minimal | Fewer domains = smaller attack surface |
| Check vendor CDN configurations | Third-party SPFx solutions may need their CDN registered |

---

## The Bigger Picture: SharePoint Security in 2026

CSP enforcement is part of a broader security push in SharePoint Online:

- **Script-src restrictions** block untrusted JavaScript (this article)
- **SharePoint Embedded** isolates ISV document storage from the main tenant
- **Microsoft Purview** integration enforces compliance labels on all content
- **Copilot governance** ensures AI agents operate within security boundaries

If you are building for the Microsoft 365 ecosystem, security-first development is no longer optional \u2014 it is the default.

For more on the 2026 SharePoint developer landscape, see my guides on [SPFx 1.23 and the new Heft build system](/blog/spfx-1-23-new-cli-replacing-yeoman-heft-migration-guide-2026) and [SharePoint Embedded for document management](/blog/sharepoint-embedded-build-document-management-app-2026).

---

## Frequently Asked Questions

**Will my existing SPFx solutions break on March 1, 2026?**
Only if they load scripts from external domains that are not registered as trusted sources. Solutions that bundle all code in the .sppkg file are safe. Test with \`?csp=enforce\` to be sure.

**How do I find which external scripts my SPFx solution loads?**
Open the page with your solution in the browser, go to DevTools > Network tab, filter by "JS", and look for any scripts loaded from domains other than \`*.sharepoint.com\`. Those are the ones you need to register.

**Can I use eval() or new Function() in SPFx with CSP enabled?**
No. CSP blocks \`eval()\`, \`new Function()\`, and similar dynamic code execution by default. If your code (or a library you depend on) uses these, you will need to find an alternative or replace the library.

**Does CSP affect classic SharePoint pages?**
CSP enforcement currently applies to **modern pages** only. Classic pages are not affected in the March 2026 rollout. However, Microsoft continues to encourage migration to modern experiences.

**How many trusted script sources can I add?**
SharePoint supports up to **300 trusted source entries**. You can use subdomain wildcards (e.g., \`https://*.yourcompany.com\`) to consolidate entries, but root-level wildcards are blocked.

---

## Your Action Plan

1. **This week:** Test every modern page with \`?csp=enforce\` appended to the URL
2. **Review violations:** Check the Purview audit logs for \`ContentSecurityPolicyViolation\` events
3. **Register trusted sources:** Add required CDN domains via the SharePoint Admin Center or PowerShell
4. **Refactor inline scripts:** Move all JavaScript into bundled files and use \`SPComponentLoader\` for dynamic loading
5. **Test again:** Verify with \`?csp=enforce\` that all violations are resolved

Need help building or debugging SPFx solutions? Check out these tools:
- [GUID Generator](/tools/guid-generator) \u2014 generate GUIDs for SPFx component manifests
- [SharePoint REST API Builder](/tools/rest-api-builder) \u2014 build and test API calls visually
- [PnP PowerShell Generator](/tools/pnp-script-generator) \u2014 generate ready-to-run admin scripts
- [CAML Query Builder](/tools/caml-query-builder) \u2014 build complex queries without memorizing syntax

For the full SPFx migration story, read my guide on [SPFx 1.23: New CLI + Heft Build System Migration](/blog/spfx-1-23-new-cli-replacing-yeoman-heft-migration-guide-2026).
`,
    date: '2026-03-06',
    displayDate: 'March 6, 2026',
    readTime: '12 min read',
    category: 'SharePoint',
    tags: ['SharePoint', 'CSP', 'SPFx', 'Security', 'PowerShell'],
  },

  {
    id: '18',
    slug: 'sharepoint-rest-api-cheat-sheet-every-endpoint-2026',
    title: 'SharePoint REST API Cheat Sheet: Every Endpoint You Need (2026)',
    excerpt:
      'The only SharePoint REST API reference you need — every endpoint for lists, items, files, users, and sites with OData examples, code snippets, and a free visual URL builder.',
    image: '/images/blog/sharepoint-rest-api-cheatsheet.png',
    content: `
## Why You Need a SharePoint REST API Cheat Sheet

Every SharePoint developer has been there — you know the endpoint exists, but you can never remember the exact URL format. Was it \\\`getbytitle\\\` or \\\`GetByTitle\\\`? Does \\\`$filter\\\` use \\\`eq\\\` or \\\`==\\\`?

This cheat sheet is the **definitive reference** for the SharePoint REST API in 2026. Bookmark it, share it, and never Google "sharepoint rest api get all list items" again.

> **Shortcut:** Use our free [SharePoint REST API Builder](/tools/rest-api-builder) to generate URLs and code snippets visually — no memorization needed.

---

## Base URL Structure

Every SharePoint REST API call follows this pattern:

\`\`\`
https://{tenant}.sharepoint.com/sites/{site}/_api/web/{resource}
\`\`\`

| Part | Example | Description |
|------|---------|-------------|
| **Tenant** | \\\`contoso.sharepoint.com\\\` | Your Microsoft 365 tenant |
| **Site** | \\\`/sites/ProjectHub\\\` | Site collection path |
| **API Root** | \\\`/_api/web\\\` | REST API entry point |
| **Resource** | \\\`/lists\\\`, \\\`/siteusers\\\` | What you want to access |

---

## List & Library Endpoints

### Get All Lists
\`\`\`
GET /_api/web/lists
\`\`\`
Returns every list and library in the site, including hidden system lists.

### Get a List by Title
\`\`\`
GET /_api/web/lists/getbytitle('Documents')
\`\`\`

### Get a List by GUID
\`\`\`
GET /_api/web/lists(guid'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
\`\`\`

### Get List Fields (Columns)
\`\`\`
GET /_api/web/lists/getbytitle('Tasks')/fields
\`\`\`

### Get List Content Types
\`\`\`
GET /_api/web/lists/getbytitle('Documents')/contenttypes
\`\`\`

---

## List Item Endpoints (CRUD)

### Read: Get All Items
\`\`\`
GET /_api/web/lists/getbytitle('Tasks')/items
\`\`\`

### Read: Get a Single Item
\`\`\`
GET /_api/web/lists/getbytitle('Tasks')/items(42)
\`\`\`

### Create: Add a New Item
\`\`\`
POST /_api/web/lists/getbytitle('Tasks')/items

Headers:
  Accept: application/json;odata=verbose
  Content-Type: application/json;odata=verbose
  X-RequestDigest: {formDigestValue}

Body:
{
  "__metadata": { "type": "SP.Data.TasksListItem" },
  "Title": "New Task"
}
\`\`\`

**Tip:** The \\\`type\\\` value follows the pattern \\\`SP.Data.{ListName}ListItem\\\`. For a list named "Project Tasks", it becomes \\\`SP.Data.Project_x0020_TasksListItem\\\` (spaces become \\\`_x0020_\\\`).

### Update: Modify an Existing Item
\`\`\`
POST /_api/web/lists/getbytitle('Tasks')/items(42)

Headers:
  Accept: application/json;odata=verbose
  Content-Type: application/json;odata=verbose
  X-RequestDigest: {formDigestValue}
  IF-MATCH: *
  X-HTTP-Method: MERGE

Body:
{
  "__metadata": { "type": "SP.Data.TasksListItem" },
  "Title": "Updated Task Title"
}
\`\`\`

> **Why POST instead of PATCH?** SharePoint REST uses \\\`X-HTTP-Method: MERGE\\\` on a POST verb for compatibility. Using \\\`IF-MATCH: *\\\` skips the ETag check.

### Delete: Remove an Item
\`\`\`
POST /_api/web/lists/getbytitle('Tasks')/items(42)

Headers:
  X-RequestDigest: {formDigestValue}
  IF-MATCH: *
  X-HTTP-Method: DELETE
\`\`\`

---

## OData Query Parameters

This is where the real power is. OData parameters let you filter, sort, and shape your data **server-side** before it hits the wire.

### $select — Choose Which Fields to Return
\`\`\`
GET /_api/web/lists/getbytitle('Tasks')/items?$select=Title,Status,DueDate
\`\`\`
**Always use \\\`$select\\\`.** Without it, SharePoint returns every field — including hidden ones — which wastes bandwidth and processing.

### $filter — Server-Side Filtering
\`\`\`
GET /_api/web/lists/getbytitle('Tasks')/items?$filter=Status eq 'Active'
\`\`\`

| Operator | Meaning | Example |
|----------|---------|---------|
| \\\`eq\\\` | Equals | \\\`Status eq 'Done'\\\` |
| \\\`ne\\\` | Not equals | \\\`Priority ne 'Low'\\\` |
| \\\`gt\\\` | Greater than | \\\`DueDate gt '2026-01-01'\\\` |
| \\\`lt\\\` | Less than | \\\`Created lt '2026-06-01'\\\` |
| \\\`ge\\\` | Greater or equal | \\\`Priority ge 2\\\` |
| \\\`le\\\` | Less or equal | \\\`Priority le 3\\\` |
| \\\`and\\\` | Logical AND | \\\`Status eq 'Active' and Priority eq 'High'\\\` |
| \\\`or\\\` | Logical OR | \\\`Status eq 'Active' or Status eq 'Pending'\\\` |
| \\\`startswith\\\` | String starts with | \\\`startswith(Title, 'Project')\\\` |
| \\\`substringof\\\` | String contains | \\\`substringof('report', Title)\\\` |

### $expand — Include Lookup & Person Fields
\`\`\`
GET /_api/web/lists/getbytitle('Tasks')/items
  ?$select=Title,AssignedTo/Title,AssignedTo/EMail
  &$expand=AssignedTo
\`\`\`
Without \\\`$expand\\\`, lookup and person fields only return the ID. Use \\\`$expand\\\` to get the display name, email, or other lookup properties.

### $orderby — Sort Results
\`\`\`
GET /_api/web/lists/getbytitle('Tasks')/items?$orderby=Created desc
\`\`\`
Add \\\`desc\\\` for descending order. Default is ascending (\\\`asc\\\`).

### $top — Limit Results
\`\`\`
GET /_api/web/lists/getbytitle('Tasks')/items?$top=10
\`\`\`
The default page size is 100 items. Maximum is **5,000** per request, but stay under 100 for performance.

### Combining All Parameters
\`\`\`
GET /_api/web/lists/getbytitle('Tasks')/items
  ?$select=Title,Status,DueDate,AssignedTo/Title
  &$filter=Status eq 'Active' and DueDate lt '2026-12-31'
  &$expand=AssignedTo
  &$orderby=DueDate asc
  &$top=25
\`\`\`

---

## Site & User Endpoints

### Get Site Information
\`\`\`
GET /_api/web
\`\`\`

### Get Current User
\`\`\`
GET /_api/web/currentuser
\`\`\`

### Get All Site Users
\`\`\`
GET /_api/web/siteusers
\`\`\`

### Get SharePoint Groups
\`\`\`
GET /_api/web/sitegroups
\`\`\`

### Get Site Content Types
\`\`\`
GET /_api/web/contenttypes
\`\`\`

---

## File & Folder Endpoints

### Get Files in a Folder
\`\`\`
GET /_api/web/GetFolderByServerRelativeUrl('/sites/MySite/Shared Documents')/Files
\`\`\`

### Get Folder Properties
\`\`\`
GET /_api/web/GetFolderByServerRelativeUrl('/sites/MySite/Shared Documents')
\`\`\`

### Upload a File (< 2 MB)
\`\`\`
POST /_api/web/GetFolderByServerRelativeUrl('/sites/MySite/Shared Documents')
  /Files/add(url='filename.docx', overwrite=true)

Headers:
  X-RequestDigest: {formDigestValue}
Body: [binary file content]
\`\`\`

For files **> 2 MB**, use the chunked upload approach with \\\`StartUpload\\\`, \\\`ContinueUpload\\\`, and \\\`FinishUpload\\\`.

---

## Authentication in 2026

### In SPFx Web Parts (Automatic)
SPFx handles authentication for you. Use \\\`this.context.spHttpClient\\\` or PnPjs — no tokens needed:

\`\`\`typescript
import { spfi, SPFx } from "@pnp/sp";
const sp = spfi().using(SPFx(this.context));
const items = await sp.web.lists.getByTitle("Tasks").items();
\`\`\`

### External Apps (Microsoft Entra ID)
Register an app in **Microsoft Entra ID** (Azure AD) and use OAuth 2.0:

1. Register app in the [Azure Portal](https://portal.azure.com)
2. Add \\\`Sites.Read.All\\\` or \\\`Sites.ReadWrite.All\\\` API permissions
3. Use **Client Credentials Flow** (app-only) or **Authorization Code Flow** (delegated)
4. Pass the access token in the \\\`Authorization: Bearer {token}\\\` header

---

## SharePoint REST API vs. Microsoft Graph

| Feature | SharePoint REST API | Microsoft Graph |
|---------|:---:|:---:|
| SharePoint-specific endpoints | ✅ Full coverage | ⚠️ Partial |
| Unified Microsoft 365 access | ❌ SharePoint only | ✅ All services |
| OData \\\`$filter\\\` support | ✅ Complete | ✅ Complete |
| File operations | ✅ Full | ✅ Full |
| Managed metadata / taxonomy | ✅ Yes | ⚠️ Limited |
| Site provisioning | ✅ Yes | ❌ No |

**Rule of thumb:** Use **Microsoft Graph** when working across multiple Microsoft 365 services. Use the **SharePoint REST API** for SharePoint-specific operations that Graph doesn't cover (taxonomy, site scripts, managed metadata).

For more on Graph API, see our guide: [Microsoft Graph API: 10 Practical Examples](/blog/microsoft-graph-api-10-practical-examples-sharepoint-2026).

---

## Free Tool: Build URLs Visually

Tired of hand-typing these URLs? Try our free [SharePoint REST API Builder](/tools/rest-api-builder) — pick an operation, configure OData parameters, and copy code snippets in JavaScript, PnPjs, or PowerShell. No login required.

You might also find these useful:
- [CAML Query Builder](/tools/caml-query-builder) — for complex query scenarios
- [PnP PowerShell Generator](/tools/pnp-script-generator) — ready-to-run admin scripts
- [Site Script Generator](/tools/site-script-generator) — build provisioning templates

---

## FAQ

**What is the SharePoint REST API item limit per request?**
The default is 100 items. You can request up to 5,000 using \\\`$top=5000\\\`. For larger datasets, use pagination with \\\`$skiptoken\\\` or the \\\`__next\\\` URL from the response.

**Do I need a request digest for GET requests?**
No. The \\\`X-RequestDigest\\\` header is only required for write operations (POST, MERGE, DELETE). In SPFx, use \\\`this.context.pageContext.formDigestValue\\\`.

**How do I filter by a date field?**
Use ISO 8601 format: \\\`$filter=DueDate gt '2026-01-01T00:00:00Z'\\\`. SharePoint stores dates in UTC.

**Can I use the REST API with Power Automate?**
Yes. Use the **"Send an HTTP request to SharePoint"** action in Power Automate. It handles authentication automatically. See our guide: [Power Automate + SharePoint Workflows](/blog/power-automate-sharepoint-document-workflows-2026).

**What replaced the \\\_api/contextinfo endpoint?**
Use \\\`POST /_api/contextinfo\\\` to get the form digest value. In SPFx, this is available via \\\`this.context.pageContext.formDigestValue\\\` without any extra API calls.
`,
    date: '2026-03-06',
    displayDate: 'March 6, 2026',
    readTime: '10 min read',
    category: 'SharePoint',
    tags: ['SharePoint', 'REST API', 'OData', 'JavaScript'],
  },
  {
    id: '17',
    slug: 'sharepoint-embedded-build-document-management-app-2026',
    title: 'SharePoint Embedded: Build Document Management into Any App (2026)',
    excerpt:
      'Use SharePoint Embedded to add enterprise document management, collaboration, and AI to your custom applications \u2014 without exposing the SharePoint UI. Complete guide with React + Node.js code.',
    image: '/images/blog/sharepoint-embedded-guide.png',
    content: `
## What Is SharePoint Embedded?

SharePoint Embedded is a **headless, API-only** version of SharePoint document management. It lets you store, manage, and collaborate on files inside your own custom application \u2014 while Microsoft 365 handles storage, compliance, security, and AI behind the scenes.

Unlike traditional SharePoint Online, users never see the SharePoint interface. Your application owns the entire user experience. Files are stored in **File Storage Containers** within the customer\u2019s Microsoft 365 tenant, so data governance stays intact.

Think of it this way:

| Feature | SharePoint Online | SharePoint Embedded |
|---------|------------------|-------------------|
| User interface | SharePoint UI (sites, pages, lists) | Your custom UI |
| Storage location | Customer\u2019s M365 tenant | Customer\u2019s M365 tenant |
| API access | Microsoft Graph + SharePoint REST | Microsoft Graph only |
| Collaboration | Co-authoring in Office apps | Co-authoring in Office apps |
| Compliance | Microsoft Purview | Microsoft Purview |
| AI / Copilot | Copilot for M365 | Embedded AI Agent SDK |
| Billing model | Included in M365 license | Consumption-based (metered) |

**Who is this for?** Independent software vendors (ISVs) building SaaS products, and enterprise developers building line-of-business apps that need document management without the SharePoint chrome.

## When Should You Use SharePoint Embedded?

Not every project needs SharePoint Embedded. Use this decision matrix:

| Scenario | Best Option | Why |
|----------|------------|-----|
| Internal team site with pages and lists | SharePoint Online | Full UI, no development needed |
| Custom app that stores user documents | **SharePoint Embedded** | Headless API, your UI |
| SPFx web part on a SharePoint page | SharePoint Online + SPFx | SPFx is designed for SharePoint pages |
| SaaS product with per-tenant file storage | **SharePoint Embedded** | Isolated containers per customer tenant |
| Simple file upload/download from M365 | OneDrive API (Graph) | Lighter integration, no Container Type setup |
| Document-heavy app needing compliance and AI | **SharePoint Embedded** | Purview compliance + Embedded AI Agent |

If your app needs **enterprise-grade document management** with compliance, versioning, co-authoring, and AI \u2014 but you do not want the SharePoint UI \u2014 SharePoint Embedded is the right choice.

## Architecture Overview

SharePoint Embedded uses a **provider/consumer model**:

1. **Provider tenant** \u2014 Your organization (the developer). You register your app and create a Container Type here.
2. **Consumer tenant** \u2014 Your customer\u2019s Microsoft 365 tenant. File Storage Containers live here, so customer data stays in their tenant.
3. **Microsoft Graph API** \u2014 All operations (CRUD, permissions, sharing) go through Graph.

The key components:

| Component | Purpose |
|-----------|---------|
| **Entra ID App** | Authentication and authorization via OAuth 2.0 |
| **Container Type** | A template that defines what your app can store (registered once) |
| **File Storage Container** | The actual storage instance in the consumer tenant |
| **Microsoft Graph** | The API layer for all file operations |

### Authentication Flow

Your app authenticates with Microsoft Entra ID and obtains tokens to call Microsoft Graph:

    1. User signs in via MSAL (Microsoft Authentication Library)
    2. App requests Graph API token with FileStorageContainer.Selected scope
    3. App calls Graph endpoints to manage containers and files
    4. Graph returns data from the consumer tenant

## Step-by-Step: Create Your First Container

### Prerequisites

- Microsoft 365 developer tenant (or any M365 tenant with admin access)
- Node.js v18 or later
- Visual Studio Code with the SharePoint Embedded extension

### Step 1: Register an Entra ID Application

1. Go to [entra.microsoft.com](https://entra.microsoft.com) and navigate to **App registrations**
2. Click **New registration**
3. Name: "My Document App"
4. Supported account types: "Accounts in any organizational directory" (multi-tenant)
5. Redirect URI: Single-page application (SPA), \\\`http://localhost:3000\\\`
6. Click **Register**

Save your **Application (Client) ID** and **Directory (Tenant) ID**.

### Step 2: Configure API Permissions

In your app registration, go to **API permissions** and add:

| API | Permission | Type |
|-----|-----------|------|
| Microsoft Graph | FileStorageContainer.Selected | Delegated |
| Microsoft Graph | FileStorageContainer.Selected | Application |
| Microsoft Graph | Files.ReadWrite.All | Delegated |

Click **Grant admin consent** for your tenant.

### Step 3: Create a Container Type

Use the SharePoint Embedded VS Code extension or call the API directly:

    POST https://graph.microsoft.com/v1.0/storage/fileStorageContainers
    Content-Type: application/json

    {
      "displayName": "My Document App Container",
      "description": "Stores documents for My Document App",
      "containerTypeId": "{your-container-type-id}"
    }

> **Tip:** The VS Code extension simplifies this process significantly. Install it from the Extensions marketplace and follow the guided setup.

### Step 4: Register the Container Type in the Consumer Tenant

For multi-tenant apps, the consumer tenant admin must consent to your Container Type. This is a one-time setup per customer:

    POST https://{consumer-tenant}.sharepoint.com/_api/v2.1/storageContainerTypes/{containerTypeId}/applicationPermissions

The admin consent flow ensures the customer explicitly approves your app\u2019s access to their tenant.

## Building the Application: React + Node.js

### Backend: Node.js REST API

Create a simple Express server that handles authentication and Graph API calls:

    const express = require('express');
    const { ConfidentialClientApplication } = require('@azure/msal-node');

    const msalConfig = {
      auth: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        authority: \\\`https://login.microsoftonline.com/\\\${process.env.TENANT_ID}\\\`
      }
    };

    const cca = new ConfidentialClientApplication(msalConfig);

    app.get('/api/containers', async (req, res) => {
      const tokenResponse = await cca.acquireTokenByClientCredential({
        scopes: ['https://graph.microsoft.com/.default']
      });

      const response = await fetch(
        'https://graph.microsoft.com/v1.0/storage/fileStorageContainers',
        {
          headers: {
            'Authorization': \\\`Bearer \\\${tokenResponse.accessToken}\\\`
          }
        }
      );

      const data = await response.json();
      res.json(data.value);
    });

### Frontend: React SPA with MSAL

Use \\\`@azure/msal-react\\\` for user authentication:

    import { useMsal } from '@azure/msal-react';
    import { InteractionRequiredAuthError } from '@azure/msal-browser';

    function DocumentList() {
      const { instance, accounts } = useMsal();
      const [files, setFiles] = useState([]);

      const getFiles = async (containerId) => {
        const tokenRequest = {
          scopes: ['FileStorageContainer.Selected', 'Files.ReadWrite.All'],
          account: accounts[0]
        };

        const response = await instance.acquireTokenSilent(tokenRequest);

        const graphResponse = await fetch(
          \\\`https://graph.microsoft.com/v1.0/storage/fileStorageContainers/\\\${containerId}/drive/root/children\\\`,
          {
            headers: {
              'Authorization': \\\`Bearer \\\${response.accessToken}\\\`
            }
          }
        );

        const data = await graphResponse.json();
        setFiles(data.value);
      };

      return (
        <ul>
          {files.map(file => (
            <li key={file.id}>{file.name} - {file.size} bytes</li>
          ))}
        </ul>
      );
    }

This gives you a fully custom document browser \u2014 no SharePoint UI visible to the user.

## The Embedded AI Agent SDK

**New in 2026:** SharePoint Embedded now includes an **AI Agent SDK** that adds Retrieval-Augmented Generation (RAG) to your app. The agent can answer questions from documents stored in your containers \u2014 without you building a vector database or custom AI pipeline.

### How It Works

1. Install the SDK: \\\`npm install @microsoft/sharepoint-embedded-agent\\\`
2. Initialize the agent with your container ID
3. Send natural language queries
4. The agent returns answers grounded in your stored documents

### Example Integration

    import { SharePointEmbeddedAgent } from '@microsoft/sharepoint-embedded-agent';

    const agent = new SharePointEmbeddedAgent({
      containerId: 'your-container-id',
      accessToken: graphAccessToken
    });

    const answer = await agent.ask(
      'What is our return policy?'
    );

    console.log(answer.text);
    // "Based on the Returns Policy document,
    //  customers can return items within 30 days..."

    console.log(answer.citations);
    // [{ documentName: 'Returns Policy.docx',
    //    url: '...' }]

This is a game-changer for document-heavy apps. Instead of building custom search and AI pipelines, you get enterprise-grade RAG out of the box.

For more on building AI assistants for Microsoft 365, see my [Copilot Studio + SharePoint guide](/blog/copilot-studio-sharepoint-ai-assistants-guide-2026).

## Pricing and Billing

SharePoint Embedded uses **consumption-based billing** tied to an Azure subscription:

| Metric | Description |
|--------|-------------|
| Storage | Per GB stored per month |
| API calls | Per transaction (CRUD operations) |
| AI Agent usage | Per query (when using the Embedded Agent SDK) |

This is **separate from Microsoft 365 licensing**. Your customers need an M365 tenant for the storage infrastructure, but SharePoint Embedded costs are billed to your Azure subscription as the provider.

> **Key benefit for ISVs:** You control the billing relationship. Your customers do not need additional M365 licenses for SharePoint Embedded functionality \u2014 they just need a base M365 tenant.

## Best Practices

| Practice | Why |
|----------|-----|
| Use the VS Code extension for setup | Simplifies Container Type registration and local development |
| Request minimum Graph permissions | Follow least-privilege for security |
| Implement proper token caching | Avoid hitting Entra ID rate limits |
| Use delta queries for sync scenarios | Reduces API calls for change detection |
| Enable Purview labels on containers | Ensures compliance from day one |
| Test with multiple consumer tenants | Catches permission and consent issues early |

## Frequently Asked Questions

**Q: Do my customers need SharePoint Online licenses?**

Your customers need a Microsoft 365 tenant, but SharePoint Embedded costs are billed separately through your Azure subscription. They do not need individual SharePoint Online licenses for content stored in Embedded containers.

**Q: Can I migrate existing SharePoint document libraries to Embedded containers?**

There is no direct migration tool. You would need to copy files programmatically using the Graph API. For existing SharePoint-heavy workflows, consider whether SPFx extensions on SharePoint Online might be a better fit \u2014 see my [SPFx web part guide](/blog/spfx-web-part-crud-operations-complete-guide-2026).

**Q: How does SharePoint Embedded handle permissions?**

Permissions are managed through the Graph API. You set permissions at the container level and at individual file/folder levels. The Entra ID app registration controls which apps can access which containers.

**Q: Can I use SharePoint Embedded with Power Automate?**

Yes. Files stored in Embedded containers can trigger Power Automate flows through Graph API subscriptions (webhooks). For Power Automate integration patterns, see my [document workflows guide](/blog/power-automate-sharepoint-document-workflows-2026).

**Q: Is SharePoint Embedded available in government clouds?**

SharePoint Embedded is currently available in commercial Microsoft 365 tenants. Government cloud (GCC, GCC High, DoD) support is on the roadmap but not yet generally available as of March 2026.

## What to Build Next

SharePoint Embedded opens up document management for any application \u2014 from SaaS products to internal LOB apps. The combination of headless storage, Purview compliance, and the new AI Agent SDK makes it the most complete document platform available to developers.

Start with these next steps:

1. **Set up a dev tenant** \u2014 Use the [Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program) for a free sandbox
2. **Install the VS Code extension** \u2014 The guided setup gets you running in minutes
3. **Build a proof of concept** \u2014 A React SPA with document upload/download is a great starting point
4. **Explore the AI Agent SDK** \u2014 Add document Q&A to your app with minimal code

For more Microsoft 365 development, explore my guides on [Microsoft Graph API examples](/blog/microsoft-graph-api-10-practical-examples-sharepoint-2026), [Viva Connections Adaptive Card Extensions](/blog/viva-connections-adaptive-card-extensions-build-guide-2026), and [Power Automate document workflows](/blog/power-automate-sharepoint-document-workflows-2026).
`,
    date: '2026-03-06',
    displayDate: 'March 6, 2026',
    readTime: '15 min read',
    category: 'SharePoint',
    tags: ['sharepoint-embedded', 'microsoft-graph', 'react', 'node-js', 'document-management', 'ai-agent'],
  },
  {
    id: '16',
    slug: 'spfx-1-23-new-cli-replacing-yeoman-heft-migration-guide-2026',
    title: 'SPFx 1.23: New CLI Replacing Yeoman + Heft Build System Migration Guide (2026)',
    excerpt:
      'The biggest SPFx toolchain overhaul in years \u2014 Yeoman is out, the new SPFx CLI is in, and Heft replaces Gulp. Here is your complete migration guide with step-by-step commands.',
    image: '/images/blog/spfx-1-23-heft-migration-guide.png',
    content: `
## The Biggest SPFx Toolchain Change in Years

March 2026 marks a turning point for SharePoint Framework developers. Two major changes are happening simultaneously:

1. **SPFx 1.22** replaced Gulp with **Heft** as the build system
2. **SPFx 1.23** introduces a preview of the **new SPFx CLI** that replaces the Yeoman generator

If you maintain SPFx projects, you need to understand both changes. This guide covers what changed, why it matters, and exactly how to migrate your existing projects.

## What Changed and Why

### The Problem with the Old Toolchain

The original SPFx toolchain had accumulated years of technical debt:

| Issue | Impact |
|-------|--------|
| Gulp dependency chain | 50+ npm audit warnings in every new project |
| Yeoman generator coupling | Generator version locked to SPFx version |
| Outdated build pipeline | Blocked TypeScript 5.x adoption |
| Custom gulp tasks | Fragile, undocumented extension points |

Microsoft addressed all four issues across SPFx 1.22 and 1.23.

### Timeline of Changes

| Version | Release | Change | Status |
|---------|---------|--------|--------|
| SPFx 1.21 | September 2025 | Last version with Gulp-only toolchain | Stable |
| SPFx 1.22 | December 2025 | Heft replaces Gulp (Gulp still available via flag) | Stable |
| SPFx 1.23 | March 2026 | New SPFx CLI preview, open-source templates | Preview |
| SPFx 1.24 | June 2026 | SPFx CLI general availability | Planned |

## Change 1: Gulp to Heft (SPFx 1.22+)

### What is Heft?

Heft is a build orchestrator from the Rush Stack ecosystem. It replaces Gulp as the task runner but **Webpack still handles bundling** under the hood. Think of it as a modern wrapper around the same compilation pipeline.

### What Changed in Your Project

| Before (Gulp) | After (Heft) |
|---------------|-------------|
| gulpfile.js | Removed |
| gulp serve | npm run serve (calls Heft) |
| gulp bundle --ship | npm run build (calls Heft) |
| gulp package-solution --ship | npm run package (calls Heft) |
| Custom gulp tasks in gulpfile.js | Heft plugins or rig extensions |

### New Configuration Files

SPFx 1.22 projects include several new files in the ./config folder:

**config/rig.json** \u2014 References the shared SPFx build configuration:

    {
      "$schema": "https://developer.microsoft.com/json-schemas/rig-package/rig.schema.json",
      "rigPackageName": "@microsoft/spfx-web-build-rig"
    }

**config/sass.json** \u2014 Sass plugin configuration:

    {
      "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft-sass-plugin.schema.json",
      "extends": "@microsoft/spfx-web-build-rig/profiles/default/config/sass.json"
    }

The rig system means most configuration lives in the shared **@microsoft/spfx-web-build-rig** package rather than in your project. This keeps your project clean and makes future upgrades easier.

### Step-by-Step: Migrate an Existing Project to Heft

Follow these steps to migrate an SPFx 1.21 project to the Heft-based toolchain:

**Step 1: Update SPFx Dependencies**

Update your package.json to reference SPFx 1.22 packages. The CLI for Microsoft 365 can generate the exact changes needed:

    npx @pnp/cli-microsoft365 spfx project upgrade
      --toVersion 1.22.0 --output md

This outputs a markdown report with every dependency change required.

**Step 2: Remove Gulp Dependencies**

Uninstall the Gulp packages that are no longer needed:

    npm uninstall gulp @microsoft/sp-build-web
      @microsoft/sp-module-interfaces

**Step 3: Install Heft Dependencies**

    npm install @rushstack/heft @microsoft/spfx-web-build-rig
      --save-dev

**Step 4: Update npm Scripts**

Replace the gulp commands in your package.json:

    {
      "scripts": {
        "build": "heft build --clean",
        "bundle": "heft build --clean",
        "serve": "heft build --watch",
        "package": "heft build --clean
          && node ./node_modules/@pnp/spfx-controls-react/node_modules/.bin/package-solution"
      }
    }

> **Note:** The exact scripts may vary. Check the scripts generated by a fresh SPFx 1.22 project for the most current commands.

**Step 5: Add Configuration Files**

Create the rig.json and sass.json files in your ./config directory as shown above.

**Step 6: Delete gulpfile.js**

Remove the gulpfile.js from your project root. If you had custom gulp tasks, see the "Migrating Custom Gulp Tasks" section below.

**Step 7: Test the Build**

    npm run build

If the build succeeds, your migration is complete. Run \`npm run serve\` to verify the local development experience works as expected.

### Migrating Custom Gulp Tasks

If you had custom logic in gulpfile.js (such as custom bundling steps or environment variable injection), you have three options:

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

For complex scenarios, you can create a custom Heft plugin. This is more involved but provides a cleaner, more maintainable extension point than custom gulp tasks ever did.

## Change 2: New SPFx CLI (SPFx 1.23+)

### What is the New SPFx CLI?

The Yeoman generator (\`yo @microsoft/sharepoint\`) is being replaced by a standalone **SPFx CLI**. Key differences:

| Feature | Yeoman Generator | New SPFx CLI |
|---------|-----------------|-------------|
| Installation | npm install -g yo @microsoft/generator-sharepoint | Standalone CLI (npm package) |
| Version coupling | Locked to SPFx version | Decoupled from SPFx versions |
| Templates | Bundled in generator | Open-source on GitHub |
| Customization | Limited | Company-specific templates supported |
| Status in 1.23 | Still available | Preview |
| Status in 1.24 | Deprecated | General Availability |

### Why This Matters

The decoupling is the biggest win. Today, you install a specific version of the Yeoman generator to scaffold a specific version of SPFx. With the new CLI, you install it once and it can scaffold any supported SPFx version.

The open-source templates mean your organization can create standardized project templates with your preferred libraries, folder structure, and configurations baked in.

### Using the New SPFx CLI (Preview)

As of SPFx 1.23, the CLI is in preview. To try it:

    npm install -g @microsoft/spfx-cli@preview

Then create a new project:

    spfx new --solution-name my-webpart --component-type webpart
      --framework react

> **Important:** The exact commands may evolve before the 1.24 GA release. Check the [official SPFx documentation](https://learn.microsoft.com/sharepoint/dev/spfx/sharepoint-framework-overview) for current syntax.

## Decision Matrix: When Should You Migrate?

Not every project needs to migrate immediately. Use this matrix:

| Scenario | Recommendation |
|----------|---------------|
| Starting a brand new SPFx project | Use SPFx 1.23 with Heft (skip Gulp entirely) |
| Active project on SPFx 1.21 | Migrate to 1.22 Heft when you have a sprint for tech debt |
| Legacy project in maintenance mode | Stay on current version until a feature update is needed |
| Project with heavy custom gulp tasks | Plan migration carefully \u2014 test custom logic conversion first |
| CI/CD pipelines using gulp commands | Update pipeline scripts when migrating to Heft |

**The key deadline:** Gulp support will eventually be removed. Microsoft has not announced a hard deprecation date, but SPFx 1.22 already defaults to Heft, and the trend is clear. Plan your migration in 2026 rather than being forced into it later.

## CI/CD Pipeline Updates

If your DevOps pipelines use gulp commands, update them when migrating:

**Before (Gulp-based pipeline):**

    - script: gulp bundle --ship
    - script: gulp package-solution --ship

**After (Heft-based pipeline):**

    - script: npm run build
    - script: npm run package

Both Azure DevOps and GitHub Actions pipelines need this update. The npm scripts abstract the underlying tool, so future toolchain changes will not require pipeline updates.

## What About the CLI for Microsoft 365?

The [CLI for Microsoft 365](https://pnp.github.io/cli-microsoft365/) remains your best friend for project upgrades. Its \`spfx project upgrade\` command generates a detailed migration report:

    npx @pnp/cli-microsoft365 spfx project upgrade
      --toVersion 1.23.0 --output md

This tool does not modify your files automatically. Instead, it produces a step-by-step guide specific to your project, listing every dependency change, configuration update, and potential breaking change.

## What Else Is New in SPFx 1.23

Beyond the CLI preview, SPFx 1.23 includes:

- **Open-source solution templates** \u2014 Project scaffolding templates are now on GitHub, enabling community contributions
- **TypeScript 5.8** \u2014 Continued from SPFx 1.22, bringing modern language features like \`using\` declarations
- **Clean npm audits** \u2014 Zero audit warnings in new projects (a huge win for enterprise compliance)
- **Navigation Customizers preview** \u2014 Override top and side navigation elements (GA in 1.24)

For building web parts with these new tools, see my [SPFx web part complete guide](/blog/spfx-web-part-crud-operations-complete-guide-2026). To leverage SPFx with Microsoft Graph, check out [10 practical Graph API examples](/blog/microsoft-graph-api-10-practical-examples-sharepoint-2026).

## Frequently Asked Questions

**Q: Do I have to migrate to Heft immediately?**

No. SPFx 1.22 includes a \`--use-gulp\` flag for the Yeoman generator that creates projects with the legacy Gulp toolchain. Existing projects on older SPFx versions continue to work without changes. However, new features and security patches will only come to the Heft-based toolchain going forward.

**Q: Will my existing SPFx web parts break?**

No. The toolchain change affects how you build and serve your project, not how it runs in SharePoint. Your deployed .sppkg files work the same regardless of whether they were built with Gulp or Heft.

**Q: Can I use the new SPFx CLI in production today?**

The CLI is in preview with SPFx 1.23. For production projects, continue using the Yeoman generator until the CLI reaches GA with SPFx 1.24 (June 2026). Test the CLI with side projects to familiarize yourself with the new workflow.

**Q: What happened to the local workbench?**

The local workbench (/temp/workbench.html) has been deprecated in favor of **in-page debugging** directly on SharePoint Online. This provides a more accurate testing environment since your web parts run in the real SharePoint context. Use \`npm run serve\` and navigate to your SharePoint site with \`?debugManifestsFile=...\` in the URL.

**Q: How do I handle custom gulp tasks for environment-specific builds?**

Convert simple tasks to npm \`pre\` and \`post\` scripts. For complex build customizations, create a custom Heft plugin. See the [Heft plugin documentation](https://heft.rushstack.io/) for patterns and examples.

## What to Do Next

1. **Audit your current SPFx projects** \u2014 List all projects and their current SPFx version
2. **Try the Heft toolchain** \u2014 Scaffold a new SPFx 1.22+ project and compare the dev experience
3. **Test the CLI preview** \u2014 Install the preview CLI and scaffold a test project
4. **Update CI/CD pipelines** \u2014 Replace gulp commands with npm scripts when you migrate
5. **Plan your migration timeline** \u2014 Use the decision matrix above to prioritize

For more SharePoint development guides, explore my articles on [building Viva Connections ACEs](/blog/viva-connections-adaptive-card-extensions-build-guide-2026), [Power Automate document workflows](/blog/power-automate-sharepoint-document-workflows-2026), and [Copilot Studio AI assistants](/blog/copilot-studio-sharepoint-ai-assistants-guide-2026).
`,
    date: '2026-03-06',
    displayDate: 'March 6, 2026',
    readTime: '14 min read',
    category: 'SPFx',
    tags: ['spfx', 'heft', 'build-tools', 'migration', 'cli', 'yeoman'],
  },
  {
    id: '15',
    slug: 'copilot-studio-sharepoint-ai-assistants-guide-2026',
    title: 'Copilot Studio + SharePoint: Build 3 AI Assistants for Your Organization (2026)',
    excerpt:
      'Create AI-powered assistants that answer questions from SharePoint documents, search across sites, and automate workflows \u2014 all with Microsoft Copilot Studio. No coding required.',
    image: '/images/blog/copilot-studio-sharepoint-guide.png',
    content: `
## Why Copilot Studio for SharePoint?

Microsoft Copilot Studio is a low-code platform for building AI agents (chatbots) that connect to your organization\u2019s data. When combined with SharePoint, these agents can:

- **Answer questions** from documents stored in SharePoint libraries
- **Search across multiple sites** to find policies, procedures, and knowledge base articles
- **Automate workflows** by triggering Power Automate flows from a chat conversation
- **Serve employees directly** inside SharePoint pages, Teams, or Microsoft 365 Copilot Chat

Unlike generic chatbots, Copilot Studio agents are **grounded in your data** \u2014 they pull answers from your actual SharePoint content, not from the public internet.

**What changed in 2026?**

| Feature | Availability |
|---------|-------------|
| Copilot Studio agent deployment to SharePoint | GA (May 2025) |
| Grounding on SharePoint lists in Copilot Chat | March 2026 |
| AI-assisted content creation in SharePoint | Preview (March 2026) |
| Custom actions with Power Automate | GA |
| Multi-site knowledge grounding | GA |

This guide walks you through building 3 progressively complex agents:

1. **FAQ Bot** \u2014 Answers employee questions from a SharePoint document library
2. **Document Search Assistant** \u2014 Searches across multiple SharePoint sites
3. **Workflow Bot** \u2014 Performs actions (submitting requests, creating items) via Power Automate

## Prerequisites

- **Microsoft 365 license** with Copilot Studio access (E3/E5 or standalone license)
- **SharePoint Online** with at least one site containing documents
- **Power Automate** access (for the workflow bot)
- **Admin or site owner permissions** on the SharePoint sites you want to connect

## Agent 1: FAQ Bot

The simplest agent \u2014 it answers employee questions using documents from a single SharePoint site.

### Step 1: Create a New Agent

1. Go to [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com)
2. Click **Create** in the left navigation
3. Select **New agent**
4. Give it a name: "HR Policy Assistant"
5. Add a description: "Answers questions about company HR policies, benefits, and procedures"
6. Click **Create**

### Step 2: Add SharePoint as a Knowledge Source

1. In your agent, go to the **Knowledge** tab
2. Click **+ Add knowledge**
3. Select **SharePoint**
4. Paste the URL of your SharePoint site (e.g., https://contoso.sharepoint.com/sites/HR)
5. You can add specific document libraries or folders for more focused results
6. Click **Add**

The agent will now index the documents in that SharePoint location. It uses Azure AI Search under the hood to understand document content and return relevant answers.

### Step 3: Configure the System Prompt

The system prompt controls how the agent behaves. Click **Settings** and edit the prompt:

    You are an HR Policy Assistant for Contoso.
    Answer questions using ONLY the documents provided
    in your knowledge sources.
    If you cannot find the answer, say: "I could not
    find this in our HR policies. Please contact
    hr@contoso.com for assistance."
    Always cite the document name where you found
    the answer.
    Keep answers concise - 2-3 paragraphs maximum.

### Step 4: Test the Agent

1. Click **Test your agent** in the top right
2. Ask a question like: "What is our parental leave policy?"
3. The agent should respond with information from your SharePoint documents
4. Verify it cites the correct source document

### Step 5: Deploy to SharePoint

1. Go to **Channels** in the left navigation
2. Click **SharePoint**
3. Select the SharePoint site where you want the agent to appear
4. Choose the page or create a new one
5. The agent will appear as a chat widget on that page

**Result:** Employees can now ask HR questions directly from a SharePoint page and get answers grounded in your actual policy documents.

## Agent 2: Document Search Assistant

This agent searches across **multiple SharePoint sites** \u2014 useful for organizations with department-specific sites (HR, IT, Legal, Finance).

### Add Multiple Knowledge Sources

In the Knowledge tab, add multiple SharePoint sources:

| Knowledge Source | SharePoint URL | Purpose |
|-----------------|----------------|---------|
| HR Policies | /sites/HR | Benefits, leave, onboarding |
| IT Knowledge Base | /sites/ITSupport | Troubleshooting, access requests |
| Legal Compliance | /sites/Legal | Contracts, compliance docs |
| Finance Procedures | /sites/Finance | Expense reports, budgets |

### Configure Search Behavior

Update the system prompt to handle multi-site searches:

    You are a company knowledge assistant for Contoso.
    You have access to documents from HR, IT, Legal,
    and Finance departments.
    When answering questions:
    1. Search across all available knowledge sources
    2. Always state which department the information
       comes from
    3. If multiple departments have relevant info,
       include all perspectives
    4. Cite the specific document and department

### Add Topic-Based Routing

For better accuracy, create **topics** that route questions to the right knowledge source:

1. Go to the **Topics** tab
2. Click **+ Add a topic**
3. Create topics like:
   - "IT Support" \u2014 triggered by phrases like "password reset", "VPN", "laptop"
   - "HR Questions" \u2014 triggered by "leave", "benefits", "salary"
   - "Legal Review" \u2014 triggered by "contract", "NDA", "compliance"

Each topic can have its own response instructions that prioritize the most relevant knowledge source.

### Enable Authentication

For sensitive documents, enable user authentication:

1. Go to **Settings** then **Security**
2. Select **Authenticate with Microsoft**
3. Enable "Require users to sign in"
4. The agent will now respect SharePoint permissions \u2014 users only see documents they have access to

> **Important:** Always enable authentication when the agent has access to confidential documents. This ensures SharePoint permission boundaries are respected.

## Agent 3: Workflow Bot with Custom Actions

This is the most powerful agent \u2014 it not only answers questions but **performs actions** by triggering Power Automate flows.

### Use Case: IT Service Desk Bot

The bot can:
- Answer IT questions from the knowledge base
- Submit support tickets to a SharePoint list
- Check the status of existing tickets
- Reset user permissions (via Power Automate)

### Step 1: Create the Power Automate Flow

First, create a flow that the agent can call. This example creates a support ticket in a SharePoint list:

1. Go to [make.powerautomate.com](https://make.powerautomate.com)
2. Create a new **Instant cloud flow**
3. Choose the trigger: **Run a flow from Copilot**
4. Add inputs:
   - **Title** (text) \u2014 The ticket subject
   - **Description** (text) \u2014 Detailed description
   - **Priority** (text) \u2014 Low, Medium, High
   - **UserEmail** (text) \u2014 The requester email

5. Add a SharePoint action: **Create item**
   - Site: https://contoso.sharepoint.com/sites/ITSupport
   - List: Support Tickets
   - Map the inputs to the list columns

6. Add a response: **Respond to Copilot**
   - Return the ticket ID and confirmation message

7. Save and test the flow

For more Power Automate patterns, see my [SharePoint document workflows guide](/blog/power-automate-sharepoint-document-workflows-2026).

### Step 2: Add the Action to Your Agent

1. In Copilot Studio, go to your agent
2. Click **Actions** in the left navigation
3. Click **+ Add an action**
4. Select **Power Automate flow**
5. Find and select your "Create Support Ticket" flow
6. Map the flow inputs to agent variables

### Step 3: Create a Topic for Ticket Submission

Create a topic that guides users through submitting a ticket:

1. Go to the **Topics** tab
2. Create a new topic: "Submit IT Ticket"
3. Add trigger phrases: "I need help", "submit a ticket", "IT support request"
4. Build the conversation flow:
   - Ask: "What is the issue?" (save to variable Title)
   - Ask: "Please describe the problem in detail" (save to variable Description)
   - Ask: "What priority? Low, Medium, or High?" (save to variable Priority)
   - Call the Power Automate action with the collected variables
   - Display the confirmation: "Your ticket #[TicketID] has been submitted"

### Step 4: Add a Status Check Action

Create a second flow that retrieves ticket status:

1. Create a Power Automate flow with trigger **Run a flow from Copilot**
2. Input: **TicketID** (text)
3. Action: SharePoint **Get items** with a filter (ID eq TicketID)
4. Response: Return the ticket status, assigned agent, and last update

Add this as another action in your agent with the topic "Check Ticket Status".

## Deployment Options

### Deploy to SharePoint Pages

1. Go to **Channels** then **SharePoint**
2. Select the target site
3. The agent appears as a chat interface on the page
4. Users interact with it directly in SharePoint

### Deploy to Microsoft Teams

1. Go to **Channels** then **Microsoft Teams**
2. Click **Turn on Teams**
3. The agent becomes available as a Teams app
4. Users can chat with it in Teams just like messaging a colleague

### Deploy to Microsoft 365 Copilot Chat

1. Go to **Channels** then **Microsoft 365 Copilot**
2. Publish the agent to the M365 App Store
3. Users can invoke it from Copilot Chat with @AgentName

### Audience Targeting

Control who can access your agent:

| Scope | How to Set |
|-------|-----------|
| Everyone in the organization | Default setting |
| Specific security groups | Settings then Security then User access |
| Specific SharePoint sites only | Deploy to selected sites only |

## Best Practices

| Practice | Why |
|----------|-----|
| Use specific knowledge sources over entire sites | Narrower scope = more accurate answers |
| Always enable authentication for confidential docs | Respects SharePoint permission boundaries |
| Create topic-based routing for multi-department agents | Improves answer relevance |
| Set fallback responses for unknown questions | Prevents hallucination |
| Test with real user questions before deploying | Catches edge cases early |
| Monitor analytics in Copilot Studio dashboard | Identify gaps in knowledge coverage |

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Agent returns "I do not know" for documented topics | Document not indexed | Re-add the knowledge source and wait for indexing |
| Agent gives wrong answers | Too broad knowledge scope | Narrow the knowledge source to specific libraries |
| Users cannot access the agent | Authentication not configured | Enable Microsoft authentication in Settings |
| Power Automate action fails | Flow not shared with agent service | Share the flow with the Copilot Studio service account |
| Agent does not appear on SharePoint page | Deployment not completed | Check the Channels tab and complete the SharePoint deployment |
| Slow responses | Large document libraries | Use specific folders instead of entire sites |

## Frequently Asked Questions

**Q: Does Copilot Studio require a separate license?**

Copilot Studio is included with Microsoft 365 E3/E5 licenses for basic scenarios. For advanced features (custom actions, extended message capacity), you may need a standalone Copilot Studio license. Check the Microsoft 365 licensing page for current details.

**Q: Can the agent access on-premises SharePoint?**

No. Copilot Studio agents only connect to SharePoint Online in Microsoft 365. For on-premises data, you would need to sync it to SharePoint Online first or use a custom connector.

**Q: How does the agent handle document permissions?**

When authentication is enabled, the agent respects SharePoint permissions. A user can only get answers from documents they have access to. This ensures your security model stays intact.

**Q: Can I use custom instructions to limit the agent scope?**

Yes. Use the system prompt to restrict what the agent discusses. For example: "Only answer questions about IT support topics. For HR questions, direct users to the HR portal." This prevents scope creep even if the knowledge sources contain broader content.

**Q: How many SharePoint sites can I connect?**

There is no hard limit on knowledge sources, but Microsoft recommends keeping the total under 10 for optimal indexing performance. For very large organizations, consider creating separate agents per department.

## What to Build Next

You have seen how to build 3 types of agents \u2014 from a simple FAQ bot to a workflow-powered service desk. The same patterns work for any scenario:

- **Onboarding assistant** that guides new hires through company policies
- **Project manager bot** that searches project documentation and updates task lists
- **Compliance checker** that answers regulatory questions from your legal library

For more Microsoft 365 development, check out my guides on [building SPFx web parts](/blog/spfx-web-part-crud-operations-complete-guide-2026), [Microsoft Graph API examples](/blog/microsoft-graph-api-10-practical-examples-sharepoint-2026), and [Power Automate workflows](/blog/power-automate-sharepoint-document-workflows-2026). To extend your agents to Viva Connections dashboards, see my [Adaptive Card Extensions guide](/blog/viva-connections-adaptive-card-extensions-build-guide-2026).
`,
    date: '2026-03-05',
    displayDate: 'March 5, 2026',
    readTime: '16 min read',
    category: 'Microsoft 365',
    tags: ['copilot-studio', 'sharepoint', 'ai-assistants', 'power-automate', 'microsoft-365'],
  },
  {
    id: '14',
    slug: 'viva-connections-adaptive-card-extensions-build-guide-2026',
    title: 'Building Viva Connections ACEs: 3 Adaptive Card Extensions from Scratch (2026)',
    excerpt:
      'Go beyond the Hello World template \u2014 build 3 production-ready Adaptive Card Extensions for Viva Connections with data charts, Quick Views, and Graph API integration.',
    image: '/images/blog/viva-connections-ace-guide.png',
    content: `
## What Are Adaptive Card Extensions (ACEs)?

Adaptive Card Extensions are a component type in SharePoint Framework (SPFx) designed specifically for **Viva Connections dashboards**. Think of them as smart cards that surface information and actions from across Microsoft 365 \u2014 directly in the employee\u2019s dashboard.

Each ACE has two parts:

- **Card View** \u2014 The compact card displayed on the dashboard (small, medium, or large size)
- **Quick View** \u2014 The expanded, interactive view that opens when users click the card

ACEs work across desktop, web, and mobile. They are the primary way to extend Viva Connections with custom functionality.

**Why build ACEs instead of web parts?**

| Feature | Web Parts | ACEs |
|---------|-----------|------|
| Where they appear | SharePoint pages | Viva Connections dashboard |
| Mobile support | Limited | Full native support |
| Card-based UI | No | Yes \u2014 Adaptive Card framework |
| Data visualization | Custom (build your own) | Built-in charts (line, bar, pie, donut) |
| Quick actions | Full page interaction | Lightweight Quick Views |
| Audience | SharePoint users | All employees via Viva |

This guide walks you through building 3 ACEs, from simple to advanced:

1. **Announcement Card** \u2014 Static content with a CTA button
2. **KPI Chart Card** \u2014 Data visualization with line/bar/pie charts
3. **Task List Card** \u2014 Interactive Quick Views with SharePoint list data

## Prerequisites

- **SPFx 1.21+** development environment ([set up guide](/blog/spfx-web-part-crud-operations-complete-guide-2026))
- **Node.js v22** \u2014 Required by SPFx 1.21
- **Viva Connections** enabled in your Microsoft 365 tenant
- **SharePoint Admin access** \u2014 To deploy to the App Catalog and configure the dashboard

## ACE 1: Announcement Card

The simplest ACE \u2014 a card that displays a message with a call-to-action button.

### Scaffold the Project

    yo @microsoft/sharepoint

Choose these options:

- **Component type:** Adaptive Card Extension
- **Template:** Generic Card Template
- **Name:** AnnouncementCard

### Implement the Card View

The Card View defines what users see on the dashboard. Edit the card view file:

**File:** src/adaptiveCardExtensions/announcementCard/cardView/CardView.ts

    import {
      BaseComponentsCardView,
      ComponentsCardViewParameters,
      BasicCardView,
      IExternalLinkCardAction,
    } from "@microsoft/sp-adaptive-card-extension-base";

    export class CardView extends BaseComponentsCardView<
      IAnnouncementCardAdaptiveCardExtensionProps,
      IAnnouncementCardAdaptiveCardExtensionState
    > {
      public get cardViewParameters(): ComponentsCardViewParameters {
        return BasicCardView({
          cardBar: {
            componentName: "cardBar",
            title: this.properties.title || "Announcement",
            icon: {
              url: "https://res-1.cdn.office.net/files/fabric-cdn-prod_20230815.002/assets/item-types/16/news.svg",
            },
          },
          header: {
            componentName: "text",
            text: this.properties.heading || "Important Update",
          },
          body: {
            componentName: "text",
            text: this.properties.description || "Check out the latest company news.",
          },
          footer: {
            componentName: "cardButton",
            title: "Learn More",
            style: "positive",
            action: {
              type: "ExternalLink",
              parameters: {
                target: this.properties.linkUrl || "https://contoso.sharepoint.com/news",
              },
            } as IExternalLinkCardAction,
          },
        });
      }
    }

### Add Property Pane Configuration

Let admins customize the announcement text without editing code:

**File:** src/adaptiveCardExtensions/announcementCard/AnnouncementCardAdaptiveCardExtension.ts

    import { PropertyPaneTextField } from "@microsoft/sp-property-pane";

    protected getPropertyPaneConfiguration() {
      return {
        pages: [{
          header: { description: "Announcement Card Settings" },
          groups: [{
            groupName: "Content",
            groupFields: [
              PropertyPaneTextField("title", { label: "Card Title" }),
              PropertyPaneTextField("heading", { label: "Heading" }),
              PropertyPaneTextField("description", { label: "Description", multiline: true }),
              PropertyPaneTextField("linkUrl", { label: "Button URL" }),
            ],
          }],
        }],
      };
    }

**Result:** A dashboard card that displays a custom announcement with a "Learn More" button. Admins configure the content through the property pane \u2014 no code changes needed for content updates.

## ACE 2: KPI Chart Card

This ACE displays data visualizations directly on the dashboard card \u2014 no Quick View needed for a quick overview.

**New in SPFx 1.19+:** Built-in chart support (line charts). **SPFx 1.20+** adds bar, pie, and donut charts.

### Card View with a Line Chart

**File:** src/adaptiveCardExtensions/kpiChart/cardView/CardView.ts

    import {
      BaseComponentsCardView,
      ComponentsCardViewParameters,
      DataVisualizationCardView,
    } from "@microsoft/sp-adaptive-card-extension-base";

    export class CardView extends BaseComponentsCardView<
      IKpiChartProps, IKpiChartState
    > {
      public get cardViewParameters(): ComponentsCardViewParameters {
        return DataVisualizationCardView({
          cardBar: {
            componentName: "cardBar",
            title: "Monthly Active Users",
          },
          body: {
            componentName: "dataVisualization",
            dataVisualizationKind: "line",
            series: [{
              data: [
                { x: "Jan", y: 1200 },
                { x: "Feb", y: 1450 },
                { x: "Mar", y: 1380 },
                { x: "Apr", y: 1620 },
                { x: "May", y: 1890 },
                { x: "Jun", y: 2100 },
              ],
              color: "#0078d4",
              lastDataPointStyle: "callout",
            }],
          },
        });
      }
    }

### Fetching Real Data from a SharePoint List

Instead of hardcoded data, pull KPI values from a SharePoint list:

    import { getSP } from "../pnpConfig";

    public async onInit(): Promise<void> {
      const sp = getSP(this.context);
      const items = await sp.web.lists
        .getByTitle("KPI Metrics")
        .items.select("Month", "ActiveUsers")
        .orderBy("Month", true)
        .top(12)();

      this.setState({
        chartData: items.map(item => ({
          x: item.Month,
          y: item.ActiveUsers,
        })),
      });
    }

### Chart Type Options

| Chart Type | SPFx Version | Best For |
|-----------|-------------|----------|
| Line | 1.19+ | Trends over time |
| Bar | 1.20+ | Comparing categories |
| Pie | 1.20+ | Part-to-whole relationships |
| Donut | 1.20+ | Percentages with center label |

**Pro tip:** Use the "callout" style on the last data point to highlight the most recent value. Set the card size to "large" for charts \u2014 they need the extra space to be readable.

## ACE 3: Interactive Task List Card

This is the most complex ACE \u2014 it reads data from a SharePoint list, displays a summary on the Card View, and opens an interactive Quick View where users can update tasks.

### Card View: Task Summary

Show a count of pending tasks on the card:

    export class CardView extends BaseComponentsCardView<
      ITaskListProps, ITaskListState
    > {
      public get cardViewParameters(): ComponentsCardViewParameters {
        const pendingCount = this.state.tasks.filter(
          t => t.Status !== "Completed"
        ).length;

        return BasicCardView({
          cardBar: {
            componentName: "cardBar",
            title: "My Tasks",
          },
          header: {
            componentName: "text",
            text: pendingCount + " tasks pending",
          },
          body: {
            componentName: "text",
            text: "Click to view and manage your tasks",
          },
          footer: {
            componentName: "cardButton",
            title: "View Tasks",
            style: "positive",
            action: {
              type: "QuickView",
              parameters: { view: "TASK_LIST_VIEW" },
            },
          },
        });
      }
    }

### Quick View: Task List with Adaptive Card JSON

Quick Views use Adaptive Card JSON templates to render interactive content.

**File:** src/adaptiveCardExtensions/taskList/quickView/template/TaskListTemplate.json

    {
      "type": "AdaptiveCard",
      "version": "1.5",
      "body": [
        {
          "type": "TextBlock",
          "text": "My Tasks",
          "weight": "Bolder",
          "size": "Large"
        },
        {
          "type": "Container",
          "items": [
            {
              "type": "ColumnSet",
              "columns": [
                {
                  "type": "Column",
                  "width": "stretch",
                  "items": [
                    { "type": "TextBlock", "weight": "Bolder", "wrap": true }
                  ]
                },
                {
                  "type": "Column",
                  "width": "auto",
                  "items": [
                    { "type": "TextBlock", "weight": "Bolder" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }

### Quick View Class

Wire the template to your data:

**File:** src/adaptiveCardExtensions/taskList/quickView/TaskListQuickView.ts

    import { BaseAdaptiveCardQuickView } from
      "@microsoft/sp-adaptive-card-extension-base";
    import template from "./template/TaskListTemplate.json";

    export class TaskListQuickView extends BaseAdaptiveCardQuickView<
      ITaskListProps, ITaskListState
    > {
      public get data() {
        return {
          tasks: this.state.tasks.map(task => ({
            title: task.Title,
            status: task.Status,
            dueDate: new Date(task.DueDate).toLocaleDateString(),
            id: task.Id,
          })),
        };
      }

      public get template() {
        return template;
      }
    }

### Register the Quick View

In your main ACE class, register the Quick View so the Card View can reference it:

    import { TaskListQuickView } from "./quickView/TaskListQuickView";

    protected onInit(): Promise<void> {
      this.quickViewNavigator.register(
        "TASK_LIST_VIEW",
        () => new TaskListQuickView()
      );
      return this.fetchTasks();
    }

### HTML Quick Views (SPFx 1.20+)

Starting with SPFx 1.20, you can use **HTML instead of Adaptive Card JSON** for Quick Views. This unlocks full layout control and React integration:

    import { BaseHTMLQuickView } from
      "@microsoft/sp-adaptive-card-extension-base";

    export class TaskHTMLQuickView extends BaseHTMLQuickView<
      ITaskListProps, ITaskListState
    > {
      public render(): void {
        this.domElement.innerHTML = this.state.tasks
          .map(task => "<div>" + task.Title + "</div>")
          .join("");
      }
    }

**When to use HTML vs Adaptive Card Quick Views:**

| Feature | Adaptive Card JSON | HTML Quick View |
|---------|-------------------|-----------------|
| Complexity | Simple forms and lists | Complex layouts |
| Framework support | None \u2014 JSON only | React, vanilla JS |
| Styling | Limited | Full CSS control |
| SPFx version | 1.14+ | 1.20+ |
| Mobile rendering | Native on all platforms | Web rendering |
| Best for | Standard data display | Custom visualizations |

> **Recommendation:** Use Adaptive Card JSON for standard scenarios (lists, forms, details). Use HTML Quick Views when you need custom styling, charts, or React components that Adaptive Cards cannot support.

## Fetching Data with Microsoft Graph

ACEs are powerful when connected to [Microsoft Graph](/blog/microsoft-graph-api-10-practical-examples-sharepoint-2026). Here is a pattern for fetching the current user's tasks from Planner:

    import { MSGraphClientV3 } from "@microsoft/sp-http";

    private async fetchPlannerTasks(): Promise<void> {
      const graphClient: MSGraphClientV3 = await this.context
        .msGraphClientFactory.getClient("3");

      const response = await graphClient
        .api("/me/planner/tasks")
        .select("title,percentComplete,dueDateTime")
        .top(10)
        .get();

      this.setState({
        tasks: response.value.map(task => ({
          Title: task.title,
          Status: task.percentComplete === 100 ? "Completed" : "In Progress",
          DueDate: task.dueDateTime,
        })),
      });
    }

**Required permission** (in package-solution.json):

    { "resource": "Microsoft Graph", "scope": "Tasks.Read" }

This pattern works for any Graph endpoint \u2014 email counts, Teams activity, calendar events, or user analytics. See my [Graph API examples guide](/blog/microsoft-graph-api-10-practical-examples-sharepoint-2026) for 10 more patterns.

## Deployment to Viva Connections

### Build and Package

    gulp bundle --ship
    gulp package-solution --ship

### Deploy to App Catalog

1. Upload the .sppkg to your tenant App Catalog
2. Check "Make this solution available to all sites"
3. Click Deploy
4. If the ACE uses Graph API, approve the API permissions in the SharePoint Admin Center

### Add to the Dashboard

1. Go to your Viva Connections home site
2. Click the gear icon, then select **Manage dashboard**
3. Click **+ Add a card**
4. Find your ACE in the list and click it
5. Configure properties in the property pane
6. Set the card size (small, medium, or large)
7. Click **Publish**

### Audience Targeting

Target ACEs to specific groups so different departments see different cards:

1. In the dashboard editor, select your ACE
2. Click the audience targeting icon
3. Select Microsoft 365 groups or security groups
4. Only members of those groups will see the card

## Performance Tips

| Tip | Why |
|-----|-----|
| Use onInit() for data fetching, not the Card View | Card View renders on every dashboard visit \u2014 keep it fast |
| Cache API responses | Use session storage for data that does not change frequently |
| Limit list queries with .top() and .select() | Reduce payload size and avoid throttling |
| Use medium card size for text, large for charts | Charts need space to be readable |
| Batch Graph API calls | Reduce HTTP overhead \u2014 see [batching example](/blog/microsoft-graph-api-10-practical-examples-sharepoint-2026) |

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| ACE does not appear in dashboard | Not deployed tenant-wide | Check "Make available to all sites" in App Catalog |
| Quick View does not open | View ID mismatch | Ensure the QuickView parameters.view matches the registered ID |
| Access denied on Graph calls | Permissions not approved | Approve API permissions in SharePoint Admin Center |
| Card shows error message | Unhandled error in onInit() | Wrap data fetching in try/catch |
| Chart data does not render | Wrong card size | Set cardSize to "Large" for data visualization cards |
| ACE not visible on mobile | Cache issue | Clear the Viva Connections mobile app cache |

## Frequently Asked Questions

**Q: Can I use React in ACE Quick Views?**

Yes, starting with SPFx 1.20. Use the BaseHTMLQuickView class and render your React components into this.domElement \u2014 the same pattern as SPFx web parts. For simple data display, Adaptive Card JSON templates are easier to maintain.

**Q: Do ACEs work outside Viva Connections?**

ACEs are designed for Viva Connections dashboards. However, since SPFx 1.18, you can also add ACEs to modern SharePoint pages using the Dashboard for Viva Connections web part. They are not standalone web parts, though.

**Q: What is the maximum number of ACEs on a dashboard?**

There is no hard limit, but Microsoft recommends 20-30 cards for optimal performance. Each card makes its own API calls during initialization, so too many cards can slow down the dashboard load time.

**Q: Can end users personalize their dashboard?**

Yes! SPFx 1.21 introduced card personalization. When enabled by admins, users can add, remove, and reorder ACEs on their personal view of the dashboard without affecting other users.

**Q: How do I debug ACEs locally?**

Run gulp serve (or heft start in newer tooling) and navigate to the hosted Workbench. Add the Dashboard for Viva Connections web part and configure it in Preview mode. For SPFx 1.21+, the new debugging toolbar on SharePoint pages also supports ACEs.

## What is Next

You have built 3 ACEs covering the most common patterns \u2014 static content, data visualization, and interactive list data. The same architecture works for any dashboard scenario: IT ticket counts, HR announcements, sales KPIs, or company event feeds.

For more SPFx development, check out my guides on [building web parts with CRUD operations](/blog/spfx-web-part-crud-operations-complete-guide-2026) and [SharePoint column formatting with JSON](/blog/sharepoint-column-formatting-json-complete-guide). To connect your ACEs to external data, see my [Microsoft Graph API examples](/blog/microsoft-graph-api-10-practical-examples-sharepoint-2026).
`,
    date: '2026-03-05',
    displayDate: 'March 5, 2026',
    readTime: '17 min read',
    category: 'Microsoft 365',
    tags: ['viva-connections', 'adaptive-cards', 'spfx', 'ace', 'dashboard', 'microsoft-365'],
  },
  {
    id: '13',
    slug: 'microsoft-graph-api-10-practical-examples-sharepoint-2026',
    title: 'Microsoft Graph API: 10 Practical Examples for SharePoint Developers (2026)',
    excerpt:
      'Stop reading docs and start building. Here are 10 copy-paste Graph API examples for SharePoint — from fetching user profiles and querying sites to creating pages, uploading files, and setting up webhooks.',
    image: '/images/blog/microsoft-graph-api-examples.png',
    content: `
## Why Microsoft Graph for SharePoint?

Microsoft Graph is the single API endpoint for accessing data across the entire Microsoft 365 ecosystem — users, files, mail, calendar, Teams, SharePoint, and more. Instead of calling separate APIs for each service, you call one unified endpoint: https://graph.microsoft.com.

For SharePoint developers, Graph unlocks capabilities that go beyond what the SharePoint REST API offers:

- **Cross-service queries** — Get a user's profile, their recent files, AND their Teams channels in a single batch request
- **Granular permissions** — Use Sites.Selected to grant access to specific sites instead of the entire tenant
- **Consistent authentication** — One token works for SharePoint, Teams, OneDrive, Outlook, and more
- **Modern tooling** — Graph Explorer for testing, SDKs for every language, and built-in batching

This guide gives you 10 production-ready examples you can use in [SPFx web parts](/blog/spfx-web-part-crud-operations-complete-guide-2026), Power Automate flows, or standalone applications.

## Setup: Authentication in SPFx

Before diving into the examples, here's how to authenticate Graph API calls in an SPFx web part using the built-in MSGraphClientV3:

**In your web part class:**

    import { MSGraphClientV3 } from "@microsoft/sp-http";

    // Get the Graph client
    const graphClient: MSGraphClientV3 = await this.context
      .msGraphClientFactory.getClient("3");

**In package-solution.json**, declare the permissions you need:

    "webApiPermissionRequests": [
      { "resource": "Microsoft Graph", "scope": "User.Read.All" },
      { "resource": "Microsoft Graph", "scope": "Sites.Read.All" }
    ]

After deploying the .sppkg, a tenant admin must approve these permissions in the SharePoint Admin Center under API access.

> **Tip:** Always request the minimal permissions your app needs. Start with .Read scopes and only upgrade to .ReadWrite when you actually need write access.

## Example 1: Get Current User Profile

The simplest and most common Graph call — fetch the signed-in user's profile.

**Permission required:** User.Read

    const response = await graphClient
      .api("/me")
      .select("displayName,mail,jobTitle,department,officeLocation")
      .get();

    console.log(response.displayName); // "Rizwan Shoaib"
    console.log(response.jobTitle);    // "Senior Developer"

**Use case:** Display the current user's name and department in a personalized web part header. This replaces the older SharePoint _api/SP.UserProfiles call with a single, faster Graph request.

**Get a user's profile photo:**

    const photoBlob = await graphClient
      .api("/me/photo/$value")
      .responseType("blob")
      .get();

    const photoUrl = URL.createObjectURL(photoBlob);

## Example 2: Search for Users in the Tenant

Build a people picker or user directory by searching across your organization.

**Permission required:** User.ReadBasic.All

    const response = await graphClient
      .api("/users")
      .filter("startswith(displayName,'Riz')")
      .select("id,displayName,mail,jobTitle,department")
      .top(10)
      .orderby("displayName")
      .get();

    const users = response.value;
    // Returns: [{ displayName: "Rizwan Shoaib", mail: "riz@...", ... }]

**Filter by department:**

    const finance = await graphClient
      .api("/users")
      .filter("department eq 'Finance'")
      .select("displayName,mail,jobTitle")
      .top(50)
      .get();

**Use case:** Build a department directory web part that shows all team members with their photos and contact info. Much faster than querying the SharePoint User Information List.

## Example 3: Query SharePoint Sites

Find and access SharePoint sites programmatically.

**Permission required:** Sites.Read.All

**Search for sites by keyword:**

    const response = await graphClient
      .api("/sites?search=Marketing")
      .select("id,displayName,webUrl,description")
      .get();

    const sites = response.value;
    // Returns all sites matching "Marketing"

**Get a specific site by URL:**

    const site = await graphClient
      .api("/sites/contoso.sharepoint.com:/sites/hr-portal")
      .select("id,displayName,webUrl,createdDateTime")
      .get();

**List all subsites:**

    const subsites = await graphClient
      .api("/sites/contoso.sharepoint.com:/sites/hr-portal:/sites")
      .get();

**Use case:** Build a site directory or navigation web part that dynamically lists all project sites across your tenant.

## Example 4: CRUD Operations on SharePoint List Items

Full create, read, update, and delete on SharePoint list items through Graph.

**Permission required:** Sites.ReadWrite.All

**Read items from a list:**

    const items = await graphClient
      .api("/sites/{site-id}/lists/{list-id}/items")
      .expand("fields")
      .top(100)
      .get();

    items.value.forEach(item => {
      console.log(item.fields.Title, item.fields.Status);
    });

**Create a new item:**

    await graphClient
      .api("/sites/{site-id}/lists/{list-id}/items")
      .post({
        fields: {
          Title: "New Task",
          Status: "Not Started",
          Priority: "High",
          DueDate: "2026-04-01"
        }
      });

**Update an item:**

    await graphClient
      .api("/sites/{site-id}/lists/{list-id}/items/{item-id}/fields")
      .patch({
        Status: "Completed"
      });

**Delete an item:**

    await graphClient
      .api("/sites/{site-id}/lists/{list-id}/items/{item-id}")
      .delete();

**Use case:** When you need cross-site list operations (reading from multiple sites in a single web part), Graph is easier than making separate SharePoint REST calls to each site. For same-site operations, [PnPjs is faster and more ergonomic](/blog/spfx-web-part-crud-operations-complete-guide-2026).

## Example 5: Read and Create SharePoint Pages

The Pages API (GA since April 2024) lets you programmatically manage modern SharePoint pages.

**Permission required:** Sites.ReadWrite.All

**List all pages in a site:**

    const pages = await graphClient
      .api("/sites/{site-id}/pages")
      .select("id,title,webUrl,createdDateTime,lastModifiedDateTime")
      .top(50)
      .get();

**Get a specific page with its web parts:**

    const page = await graphClient
      .api("/sites/{site-id}/pages/{page-id}/microsoft.graph.sitePage")
      .expand("canvasLayout")
      .get();

    // Access web parts in the page layout
    const sections = page.canvasLayout.horizontalSections;

**Create a new page:**

    const newPage = await graphClient
      .api("/sites/{site-id}/pages")
      .post({
        "@odata.type": "#microsoft.graph.sitePage",
        name: "project-update.aspx",
        title: "Project Update - March 2026",
        pageLayout: "article",
      });

**Use case:** Automate page creation for recurring reports — a Power Automate flow that creates a new SharePoint page every Monday with the previous week's metrics, pre-populated from a list.

## Example 6: Upload and Manage Files in SharePoint

Work with files in SharePoint document libraries through OneDrive for Business endpoints.

**Permission required:** Files.ReadWrite.All or Sites.ReadWrite.All

**Upload a small file (< 4 MB):**

    const fileContent = "Hello, SharePoint!";
    await graphClient
      .api("/sites/{site-id}/drive/root:/Documents/report.txt:/content")
      .put(fileContent);

**Upload a large file (> 4 MB) with resumable upload:**

    // 1. Create upload session
    const session = await graphClient
      .api("/sites/{site-id}/drive/root:/Documents/large-file.pdf:/createUploadSession")
      .post({ item: { name: "large-file.pdf" } });

    // 2. Upload in 10 MB chunks using session.uploadUrl
    // (Use the LargeFileUploadTask from @microsoft/microsoft-graph-client)

**List files in a folder:**

    const files = await graphClient
      .api("/sites/{site-id}/drive/root:/Documents:/children")
      .select("id,name,size,lastModifiedDateTime,webUrl")
      .get();

**Download a file:**

    const fileStream = await graphClient
      .api("/sites/{site-id}/drive/items/{item-id}/content")
      .responseType("blob")
      .get();

**Use case:** Build a document upload web part that lets users drag-and-drop files into a specific library, with automatic metadata tagging. Combine this with [Power Automate document workflows](/blog/power-automate-sharepoint-document-workflows-2026) for post-upload processing.

## Example 7: Post Messages to Teams Channels

Send notifications from SharePoint events to Microsoft Teams.

**Permission required:** ChannelMessage.Send (delegated) or Teamwork.Migrate.All (application)

**Send a message to a Teams channel:**

    await graphClient
      .api("/teams/{team-id}/channels/{channel-id}/messages")
      .post({
        body: {
          contentType: "html",
          content: "<b>New document uploaded:</b> Q1 Report.pdf<br>Uploaded by: Rizwan Shoaib"
        }
      });

**Send an Adaptive Card:**

    await graphClient
      .api("/teams/{team-id}/channels/{channel-id}/messages")
      .post({
        body: {
          contentType: "html",
          content: '<attachment id="card1"></attachment>'
        },
        attachments: [{
          id: "card1",
          contentType: "application/vnd.microsoft.card.adaptive",
          content: JSON.stringify({
            type: "AdaptiveCard",
            version: "1.4",
            body: [
              { type: "TextBlock", text: "Document Approval Required", weight: "Bolder", size: "Medium" },
              { type: "TextBlock", text: "Q1 Financial Report needs your review.", wrap: true },
              { type: "FactSet", facts: [
                { title: "Uploaded by:", value: "Rizwan" },
                { title: "Due date:", value: "March 15, 2026" }
              ]}
            ],
            actions: [
              { type: "Action.OpenUrl", title: "Review Document", url: "https://contoso.sharepoint.com/..." }
            ]
          })
        }]
      });

**Use case:** When a document is uploaded to a SharePoint library, [trigger a Power Automate flow](/blog/power-automate-sharepoint-document-workflows-2026) that sends a rich Adaptive Card to the team's channel with an approval button.

## Example 8: Search Across Microsoft 365

Use the unified search endpoint to find content across SharePoint, OneDrive, Teams, and more.

**Permission required:** Sites.Read.All

    const searchResults = await graphClient
      .api("/search/query")
      .post({
        requests: [{
          entityTypes: ["driveItem", "listItem", "site"],
          query: { queryString: "quarterly report 2026" },
          from: 0,
          size: 25,
          fields: ["title", "webUrl", "lastModifiedDateTime", "createdBy"]
        }]
      });

    const hits = searchResults.value[0].hitsContainers[0].hits;
    hits.forEach(hit => {
      console.log(hit.resource.name, hit.resource.webUrl);
    });

**Filter by file type:**

    query: { queryString: "quarterly report filetype:pdf" }

**Filter by site:**

    query: { queryString: "quarterly report site:contoso.sharepoint.com/sites/finance" }

**Use case:** Build a custom search web part that searches across all SharePoint sites AND OneDrive simultaneously, with faceted filtering by file type, date range, and author. The built-in SharePoint search only covers SharePoint content.

## Example 9: Set Up Change Notifications (Webhooks)

Get real-time notifications when SharePoint content changes — no polling required.

**Permission required:** Sites.ReadWrite.All

**Create a subscription (webhook):**

    const subscription = await graphClient
      .api("/subscriptions")
      .post({
        changeType: "created,updated,deleted",
        notificationUrl: "https://your-azure-function.azurewebsites.net/api/webhook",
        resource: "/sites/{site-id}/lists/{list-id}/items",
        expirationDateTime: "2026-04-05T11:00:00.000Z",
        clientState: "secretClientValue"
      });

**Renew a subscription before it expires:**

    await graphClient
      .api("/subscriptions/{subscription-id}")
      .patch({
        expirationDateTime: "2026-05-05T11:00:00.000Z"
      });

**What your webhook endpoint receives:**

    // POST to your notificationUrl
    {
      "value": [{
        "subscriptionId": "...",
        "changeType": "created",
        "resource": "sites/.../lists/.../items/42",
        "clientState": "secretClientValue"
      }]
    }

**Important notes:**

- Subscriptions expire (max 30 days for most resources). Set up a timer to renew them
- The notification only tells you WHAT changed, not the new values. You need a follow-up GET call to fetch the updated item
- Your webhook endpoint must respond with 202 Accepted within 30 seconds

**Use case:** Build a real-time dashboard that updates automatically when list items change, without users needing to refresh the page. Pair this with SignalR or Server-Sent Events for a live UI.

## Example 10: Batch Multiple Requests

Reduce HTTP overhead by sending up to 20 Graph API calls in a single request.

**Permission required:** Depends on the individual requests

    const batchRequest = {
      requests: [
        {
          id: "1",
          method: "GET",
          url: "/me"
        },
        {
          id: "2",
          method: "GET",
          url: "/me/joinedTeams"
        },
        {
          id: "3",
          method: "GET",
          url: "/sites/contoso.sharepoint.com:/sites/hr-portal"
        },
        {
          id: "4",
          method: "GET",
          url: "/me/drive/recent"
        }
      ]
    };

    const batchResponse = await graphClient
      .api("/$batch")
      .post(batchRequest);

    // Each response has an id matching the request
    batchResponse.responses.forEach(response => {
      console.log("Request " + response.id + ":", response.status);
      if (response.status === 200) {
        console.log(response.body);
      }
    });

**Why batching matters:**

| Approach | HTTP Calls | Latency |
|----------|-----------|---------|
| Individual requests | 4 calls | ~400ms each = ~1.6s total |
| Batch request | 1 call | ~500ms total |

**Use case:** A dashboard web part that shows the current user's profile, their teams, recent files, and upcoming events. Without batching, that's 4 separate API calls. With batching, it's one.

## Permissions Reference

Here's a quick reference for the permissions needed across all examples:

| Example | Permission | Type |
|---------|-----------|------|
| 1. User profile | User.Read | Delegated |
| 2. Search users | User.ReadBasic.All | Delegated |
| 3. Query sites | Sites.Read.All | Both |
| 4. List CRUD | Sites.ReadWrite.All | Both |
| 5. Pages | Sites.ReadWrite.All | Both |
| 6. Files | Files.ReadWrite.All | Both |
| 7. Teams messages | ChannelMessage.Send | Delegated |
| 8. Search | Sites.Read.All | Both |
| 9. Webhooks | Sites.ReadWrite.All | Application |
| 10. Batching | Per-request | Varies |

> **Security tip:** Use **Sites.Selected** instead of Sites.ReadWrite.All when your app only needs access to specific sites. This is a granular permission that lets a tenant admin grant access on a per-site basis — much safer for production apps.

## Frequently Asked Questions

**Q: Should I use Graph API or the SharePoint REST API?**

Use Graph when you need cross-service data (users + files + Teams), granular permissions (Sites.Selected), or modern features (Pages API, search). Use the SharePoint REST API (or [PnPjs](/blog/spfx-web-part-crud-operations-complete-guide-2026)) when you need SharePoint-specific features like content types, term store, or managed metadata — these aren't fully available in Graph yet.

**Q: Can I use Graph API in Power Automate?**

Yes. Power Automate has a built-in "Send an HTTP request" action that calls Graph directly. Or use the premium "Microsoft Graph" connector for a no-code experience. See my guide on [Power Automate + SharePoint workflows](/blog/power-automate-sharepoint-document-workflows-2026).

**Q: What's the rate limit for Graph API?**

SharePoint-specific endpoints allow 10,000 API calls per 10 minutes per app per tenant. For user-specific endpoints, it's 1,200 requests per 20 seconds per app per user. Use batching (Example 10) to stay well within limits.

**Q: How do I test Graph API calls without writing code?**

Use **Graph Explorer** at https://developer.microsoft.com/graph/graph-explorer. You can sign in with your Microsoft 365 account, run queries, and see the exact JSON responses. It also shows you which permissions each endpoint needs.

**Q: Is Graph API available for SharePoint on-premises?**

No. Microsoft Graph only works with Microsoft 365 cloud services. For SharePoint Server, continue using the SharePoint REST API or CSOM.

## What's Next

Microsoft Graph is the future of Microsoft 365 development. Every new feature — Copilot extensions, SharePoint Embedded, Loop components — is built on Graph first. Learning it now puts you ahead of the curve.

Start with Examples 1-3 (user profiles, user search, site queries) to get comfortable with the authentication flow and API patterns. Then tackle the write operations (Examples 4-7) for real-world solutions.

For more Microsoft 365 development, check out my guides on [building SPFx web parts with CRUD operations](/blog/spfx-web-part-crud-operations-complete-guide-2026) and [Viva Connections Adaptive Card Extensions](/blog/building-viva-connections-adaptive-card-extensions-spfx).
`,
    date: '2026-03-05',
    displayDate: 'March 5, 2026',
    readTime: '18 min read',
    category: 'Microsoft 365',
    tags: ['microsoft-graph', 'sharepoint', 'api', 'spfx', 'microsoft-365', 'rest-api'],
  },
  {
    id: '12',
    slug: 'spfx-web-part-crud-operations-complete-guide-2026',
    title: 'Building a Custom SPFx Web Part: CRUD Operations with React + PnPjs (2026)',
    excerpt:
      'Go beyond Hello World — build a production-ready SPFx web part that creates, reads, updates, and deletes SharePoint list items using React and PnPjs v4. Covers environment setup, property pane configuration, and deployment.',
    image: '/images/blog/spfx-custom-webpart-guide.png',
    content: `
## Why Build a Custom SPFx Web Part?

SharePoint Framework (SPFx) is Microsoft's recommended model for extending SharePoint and Microsoft 365. If you've built a [Hello World web part](/blog/building-spfx-hello-world-webpart), you know the basics. But real-world web parts need to do more — they need to interact with SharePoint data.

This guide walks you through building a **Task Manager web part** that performs full CRUD (Create, Read, Update, Delete) operations against a SharePoint list. By the end, you'll have a production-ready component that you can deploy to your tenant's App Catalog.

**What you'll build:**

- A React-based web part that displays SharePoint list items in a responsive table
- Create, edit, and delete operations with inline forms
- Property pane configuration for selecting the target list
- PnPjs v4 for all SharePoint API calls
- Proper error handling and loading states
- Packaging and deployment to the App Catalog

## Prerequisites

Before you start, make sure you have:

- **Node.js v22** — The only version supported by SPFx 1.21+ (January 2026)
- **npm v10+** — Comes with Node.js v22
- **Yeoman and the SPFx generator** — Install globally with npm
- **Visual Studio Code** — Recommended editor
- **A SharePoint Online tenant** — A developer tenant works fine for testing
- **SharePoint list** — Create a list called "Tasks" with these columns:

| Column | Type | Required |
|--------|------|----------|
| Title | Single line of text | Yes |
| Description | Multiple lines of text | No |
| AssignedTo | Person | No |
| DueDate | Date | No |
| Status | Choice (Not Started, In Progress, Completed) | Yes |
| Priority | Choice (Low, Medium, High) | Yes |

## Step 1: Scaffold the SPFx Project

Open your terminal and run the Yeoman generator:

    npm install -g yo @microsoft/generator-sharepoint
    mkdir task-manager-webpart
    cd task-manager-webpart
    yo @microsoft/sharepoint

When prompted, choose these options:

- **Solution name:** task-manager-webpart
- **Target:** SharePoint Online only
- **Place files in current folder:** Yes
- **Tenant-scoped deployment:** No (for testing)
- **Framework:** React
- **Web part name:** TaskManager
- **Description:** A web part for managing tasks in a SharePoint list

The generator creates the project structure. Open it in VS Code:

    code .

## Step 2: Install PnPjs v4

PnPjs is the de facto library for interacting with SharePoint from SPFx. Install the required packages:

    npm install @pnp/sp @pnp/logging

**Why PnPjs over raw REST calls?**

- Type-safe API — IntelliSense and compile-time checks
- Batching support — Send multiple requests in a single HTTP call
- Caching — Built-in request caching for performance
- Fluent API — Readable, chainable syntax

## Step 3: Configure PnPjs with SPFx Context

PnPjs needs the SPFx web part context to authenticate API calls. Create a configuration file.

**File:** src/webparts/taskManager/pnpConfig.ts

    import { spfi, SPFx } from "@pnp/sp";
    import "@pnp/sp/webs";
    import "@pnp/sp/lists";
    import "@pnp/sp/items";
    import "@pnp/sp/site-users/web";
    import { WebPartContext } from "@microsoft/sp-webpart-base";

    let _sp: ReturnType<typeof spfi>;

    export const getSP = (context?: WebPartContext) => {
      if (context) {
        _sp = spfi().using(SPFx(context));
      }
      return _sp;
    };

**Key points:**

- The selective imports (webs, lists, items) keep your bundle size small — PnPjs is tree-shakeable
- The singleton pattern ensures the SP instance is created once and reused
- Call getSP(this.context) in your web part's onInit() to initialize

## Step 4: Build the React Component

Now build the main TaskManager component. This handles rendering the task list and all CRUD operations.

**File:** src/webparts/taskManager/components/TaskManager.tsx

    import * as React from "react";
    import { useState, useEffect, useCallback } from "react";
    import { getSP } from "../pnpConfig";
    import styles from "./TaskManager.module.scss";

    interface ITask {
      Id: number;
      Title: string;
      Description: string;
      Status: string;
      Priority: string;
      DueDate: string;
    }

    interface ITaskManagerProps {
      listName: string;
    }

    const TaskManager: React.FC<ITaskManagerProps> = ({ listName }) => {
      const [tasks, setTasks] = useState<ITask[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const [editingId, setEditingId] = useState<number | null>(null);
      const [newTask, setNewTask] = useState({
        Title: "",
        Description: "",
        Status: "Not Started",
        Priority: "Medium",
        DueDate: "",
      });

      // READ - Fetch all tasks
      const fetchTasks = useCallback(async () => {
        try {
          setLoading(true);
          const sp = getSP();
          const items = await sp.web.lists
            .getByTitle(listName)
            .items.select(
              "Id", "Title", "Description",
              "Status", "Priority", "DueDate"
            )
            .orderBy("DueDate", true)();
          setTasks(items);
          setError(null);
        } catch (err) {
          setError("Failed to load tasks. Check list permissions.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }, [listName]);

      useEffect(() => {
        fetchTasks();
      }, [fetchTasks]);

      // CREATE - Add a new task
      const addTask = async () => {
        if (!newTask.Title.trim()) return;
        try {
          const sp = getSP();
          await sp.web.lists.getByTitle(listName).items.add({
            Title: newTask.Title,
            Description: newTask.Description,
            Status: newTask.Status,
            Priority: newTask.Priority,
            DueDate: newTask.DueDate || null,
          });
          setNewTask({
            Title: "", Description: "",
            Status: "Not Started",
            Priority: "Medium", DueDate: "",
          });
          await fetchTasks();
        } catch (err) {
          setError("Failed to add task.");
          console.error(err);
        }
      };

      // UPDATE - Edit an existing task
      const updateTask = async (id: number, updates: Partial<ITask>) => {
        try {
          const sp = getSP();
          await sp.web.lists
            .getByTitle(listName)
            .items.getById(id)
            .update(updates);
          setEditingId(null);
          await fetchTasks();
        } catch (err) {
          setError("Failed to update task.");
          console.error(err);
        }
      };

      // DELETE - Remove a task
      const deleteTask = async (id: number) => {
        if (!confirm("Delete this task?")) return;
        try {
          const sp = getSP();
          await sp.web.lists
            .getByTitle(listName)
            .items.getById(id)
            .delete();
          await fetchTasks();
        } catch (err) {
          setError("Failed to delete task.");
          console.error(err);
        }
      };

      if (loading) return <div className={styles.loading}>Loading...</div>;
      if (error) return <div className={styles.error}>{error}</div>;

      return (
        <div className={styles.taskManager}>
          <h2>Task Manager</h2>
          {/* Render task table and forms here */}
        </div>
      );
    };

    export default TaskManager;

**What's happening in this code:**

- **READ:** fetchTasks() uses PnPjs's fluent API to query the SharePoint list with .select() for specific columns and .orderBy() for sorting
- **CREATE:** addTask() calls .items.add() with the form data
- **UPDATE:** updateTask() uses .items.getById(id).update() for partial updates
- **DELETE:** deleteTask() calls .items.getById(id).delete() after confirmation
- **Error handling:** Each operation wraps the API call in try/catch and sets an error state
- **Loading state:** Prevents rendering stale data during API calls

## Step 5: Wire Up the Web Part

Connect the React component to the SPFx web part class.

**File:** src/webparts/taskManager/TaskManagerWebPart.ts

    import * as React from "react";
    import * as ReactDom from "react-dom";
    import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
    import {
      PropertyPaneTextField,
    } from "@microsoft/sp-property-pane";
    import TaskManager from "./components/TaskManager";
    import { getSP } from "./pnpConfig";

    export interface ITaskManagerWebPartProps {
      listName: string;
    }

    export default class TaskManagerWebPart
      extends BaseClientSideWebPart<ITaskManagerWebPartProps> {

      public onInit(): Promise<void> {
        getSP(this.context);
        return super.onInit();
      }

      public render(): void {
        const element = React.createElement(TaskManager, {
          listName: this.properties.listName || "Tasks",
        });
        ReactDom.render(element, this.domElement);
      }

      protected getPropertyPaneConfiguration() {
        return {
          pages: [
            {
              header: { description: "Task Manager Settings" },
              groups: [
                {
                  groupName: "Configuration",
                  groupFields: [
                    PropertyPaneTextField("listName", {
                      label: "SharePoint List Name",
                      value: this.properties.listName,
                      placeholder: "Enter the list name (e.g., Tasks)"
                    }),
                  ],
                },
              ],
            },
          ],
        };
      }

      protected onDispose(): void {
        ReactDom.unmountComponentAtNode(this.domElement);
      }
    }

**Key patterns:**

- **onInit()** initializes PnPjs with the web part context — this must happen before any API calls
- **Property pane** lets end users configure the list name without editing code
- **onDispose()** cleans up the React component when the web part is removed from the page

## Step 6: Add Styling

SPFx uses CSS Modules for scoped styles. Update the SCSS file.

**File:** src/webparts/taskManager/components/TaskManager.module.scss

    .taskManager {
      padding: 20px;
      font-family: "Segoe UI", system-ui, sans-serif;

      h2 {
        color: #323130;
        border-bottom: 2px solid #0078d4;
        padding-bottom: 8px;
        margin-bottom: 20px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 16px;

        th, td {
          padding: 10px 12px;
          text-align: left;
          border-bottom: 1px solid #edebe9;
        }

        th {
          background-color: #f3f2f1;
          font-weight: 600;
          color: #323130;
        }

        tr:hover {
          background-color: #f3f2f1;
        }
      }

      .statusBadge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;

        &.completed { background: #dff6dd; color: #107c10; }
        &.inProgress { background: #fff4ce; color: #797600; }
        &.notStarted { background: #f3f2f1; color: #605e5c; }
      }

      .priorityHigh { color: #d13438; font-weight: 600; }
      .priorityMedium { color: #ca5010; }
      .priorityLow { color: #107c10; }

      .addForm {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        flex-wrap: wrap;

        input, select {
          padding: 8px;
          border: 1px solid #c8c6c4;
          border-radius: 4px;
          font-size: 14px;
        }

        button {
          padding: 8px 16px;
          background-color: #0078d4;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;

          &:hover { background-color: #106ebe; }
        }
      }

      .actions button {
        margin-right: 4px;
        padding: 4px 8px;
        font-size: 12px;
        border: 1px solid #c8c6c4;
        border-radius: 4px;
        background: white;
        cursor: pointer;

        &:hover { background: #f3f2f1; }
        &.delete { color: #d13438; border-color: #d13438; }
      }

      .loading, .error {
        padding: 20px;
        text-align: center;
        font-size: 16px;
      }

      .error { color: #d13438; }
    }

The styles use Microsoft's Fluent UI color palette to match the SharePoint look and feel. CSS Modules ensure your styles don't leak into other web parts on the page.

## Step 7: Test Locally

Start the local development server:

    gulp trust-dev-certificate
    gulp serve

This opens the SharePoint Workbench at https://localhost:4321/temp/workbench.html. However, the Workbench **cannot connect to real SharePoint data**. To test with live data, use the hosted Workbench:

    https://your-tenant.sharepoint.com/_layouts/15/workbench.aspx

> **Note (SPFx 1.21+):** Microsoft is deprecating the Workbench in favor of a new **debugging toolbar** that lets you debug directly on live SharePoint pages. If you're on SPFx 1.21 or later, you can add your web part to a real page and use the toolbar for testing. Check the [SPFx 1.23 migration guide](/blog/spfx-1-23-heft-build-system-new-cli-migration-guide) for details on the new tooling.

## Step 8: Deploy to the App Catalog

When you're ready for production, package and deploy:

**1. Bundle for production:**

    gulp bundle --ship

**2. Create the .sppkg package:**

    gulp package-solution --ship

This generates a .sppkg file in the sharepoint/solution/ folder.

**3. Upload to the App Catalog:**

- Go to your SharePoint Admin Center → More features → Apps → App Catalog
- Upload the .sppkg file to the "Apps for SharePoint" library
- Check "Make this solution available to all sites in the organization" for tenant-wide deployment
- Click Deploy

**4. Add to a page:**

- Navigate to any modern SharePoint page
- Click Edit → Add a web part → Search for "TaskManager"
- Configure the list name in the property pane

## Performance Best Practices

Once your web part works, optimize it for production:

**1. Use batching for multiple requests:**

    const sp = getSP();
    const [batch, execute] = sp.batched();
    const list = batch.web.lists.getByTitle("Tasks");

    // Queue multiple operations in a single HTTP request
    list.items.getById(1).update({ Status: "Completed" });
    list.items.getById(2).update({ Status: "Completed" });
    list.items.getById(3).delete();

    await execute(); // One HTTP call for all 3 operations

**2. Use select() and top() to limit data:**

    // BAD: Fetches all columns and all items
    const items = await sp.web.lists.getByTitle("Tasks").items();

    // GOOD: Fetches only needed columns, first 100 items
    const items = await sp.web.lists
      .getByTitle("Tasks")
      .items.select("Id", "Title", "Status")
      .top(100)();

**3. Implement pagination** for large lists (5,000+ items):

    const items = await sp.web.lists
      .getByTitle("Tasks")
      .items.select("Id", "Title")
      .top(50)
      .skip(50)(); // Page 2

**4. Cache responses** where appropriate:

    import { Caching } from "@pnp/queryable";

    const sp = getSP();
    const cachedSp = sp.using(Caching({ store: "session" }));
    const items = await cachedSp.web.lists
      .getByTitle("Tasks").items();

## Common Pitfalls

| Issue | Cause | Fix |
|-------|-------|-----|
| "Unauthorized" error | Missing API permissions | Grant Sites.ReadWrite.All in SharePoint Admin Center |
| Empty results | Wrong list name | Check listName property matches exactly (case-sensitive) |
| "List does not exist" | Site URL mismatch | Verify the web part runs on the correct site |
| Slow initial load | Fetching all items | Use .top(50) and implement pagination |
| CORS errors in local dev | Using wrong Workbench | Use the hosted Workbench, not localhost |
| Build fails on Node.js | Wrong Node version | SPFx 1.21+ requires Node.js v22 only |

## Going Further

This tutorial gives you a solid foundation. Here's how to extend it:

- **Add Microsoft Graph integration** for user profiles and Teams notifications — see my [Microsoft Graph API guide](/blog/microsoft-graph-api-spfx-integration)
- **Use Adaptive Cards** for richer Teams experiences — see [Building Viva Connections ACEs](/blog/building-viva-connections-adaptive-card-extensions-spfx)
- **Integrate with Power Automate** to trigger workflows when tasks change — see [Power Automate document workflows](/blog/power-automate-sharepoint-document-workflows-2026)
- **Add AI capabilities** with Copilot integration for intelligent task suggestions
- **Use the new Heft build system** in SPFx 1.23+ for faster builds — see my [migration guide](/blog/spfx-1-23-heft-build-system-new-cli-migration-guide)

## Frequently Asked Questions

**Q: Can I use this web part with SharePoint on-premises?**

SPFx web parts work on SharePoint Server 2019 and later, but PnPjs v4 requires SharePoint Online. For on-premises, use PnPjs v3 or the native SharePoint REST API directly.

**Q: Do I need a Power Automate license for CRUD operations?**

No. SPFx web parts call the SharePoint REST API directly using the current user's permissions. No Power Automate or premium connectors are needed for basic CRUD operations.

**Q: What happens with large lists (5,000+ items)?**

SharePoint's list view threshold blocks queries returning more than 5,000 items. Use indexed columns and .top() with pagination to stay under the limit. PnPjs supports automatic paging with the .using(Paged()) behavior.

**Q: Can I use Fluent UI (React) components?**

Yes! SPFx includes Fluent UI React by default. Import components like DetailsList, CommandBar, and Panel for a native SharePoint look. Just install @fluentui/react.

**Q: How do I debug in production?**

SPFx bundles include source maps in debug mode. Use the browser developer tools (F12) to set breakpoints. In SPFx 1.21+, the new debugging toolbar on SharePoint Online pages makes this even easier.

## Summary

You've built a complete SPFx web part that reads, creates, updates, and deletes SharePoint list items. The project uses React for the UI, PnPjs v4 for type-safe SharePoint API calls, and follows SPFx best practices for configuration and deployment.

The full pattern works for any list-driven web part — employee directories, project trackers, inventory managers, or request forms. Change the column mappings and you have a new web part.

For your next step, check out [Power Automate integration with SharePoint](/blog/power-automate-sharepoint-document-workflows-2026) to add automated workflows to your list data, or explore [SharePoint column formatting with JSON](/blog/sharepoint-column-formatting-json-complete-guide) to make your list views visually rich without any code.
`,
    date: '2026-03-05',
    displayDate: 'March 5, 2026',
    readTime: '16 min read',
    category: 'SPFx',
    tags: ['spfx', 'sharepoint', 'react', 'pnpjs', 'web-parts', 'crud', 'microsoft-365'],
  },
  {
    id: '11',
    slug: 'power-automate-sharepoint-document-workflows-2026',
    title: 'Power Automate + SharePoint: 7 Document Workflows That Save Hours Every Week (2026)',
    excerpt:
      'Stop doing manual document management. Here are 7 Power Automate workflows for SharePoint that handle approvals, metadata tagging, archiving, notifications, and more — including the new unified workflows experience shipping in March 2026.',
    image: '/images/blog/power-automate-sharepoint-workflows.png',
    content: `
## Why Automate Document Workflows in SharePoint?

If you manage a SharePoint document library with more than a few dozen files, you already know the pain. Someone uploads a document and forgets to tag it. An approval sits untouched for a week because nobody noticed. Old contracts pile up in the library long past their retention date.

**Power Automate** fixes all of this by connecting SharePoint events to automated actions — no code required. And with the **new unified workflows experience** rolling out in SharePoint in March 2026, building these automations has never been easier.

This guide covers 7 production-ready workflows that I use across enterprise tenants. Each one solves a specific document management headache.

## What's New: The Unified Workflows Experience (March 2026)

Before we dive into the workflows, here's the big news. Microsoft is shipping a **completely redesigned workflows experience** directly inside SharePoint lists and libraries. This brings Power Automate's connectors, triggers, and actions into the SharePoint UI itself.

Here's what's changing:

| Feature | Before (2025) | After (March 2026) |
|---------|--------------|-------------------|
| Creating flows | Navigate to Power Automate portal | Build directly in SharePoint |
| Templates | Generic Power Automate templates | SharePoint-specific templates |
| Approvals | Multi-step setup in Power Automate | One-click enablement in library settings |
| Quick automation | Not available | **Quick Steps** — button-based automation |
| Conditional triggers | Build in Power Automate | **Rules** — set conditions in SharePoint UI |

The key additions:

- **Quick Steps** — Lightweight, button-based automation. Click a button on a document to trigger an action (move to folder, send email, update metadata)
- **Rules** — Auto-trigger actions when conditions are met (new file uploaded, column value changes, due date approaching)
- **Enhanced Approvals** — Default approvers, ordered multi-stage approvals, and in-context tracking directly in the library

> **When should you still use full Power Automate?** Use it for complex logic with conditions, loops, parallel branches, or cross-system integrations (Dynamics 365, third-party APIs). For simple automation, Quick Steps and Rules are faster to set up and maintain.

## Workflow 1: Document Approval with Escalation

The most common request I get. A document is uploaded → manager approves or rejects → status updates automatically.

But production approval flows need more than the basics. Here's what a real-world flow looks like:

**Trigger:** When a file is created in the \`Contracts\` library

**Flow logic:**

\`\`\`
1. Get file properties (metadata: department, contract value)
2. Determine approver:
   - If contract value > $50,000 → VP Finance
   - If contract value > $10,000 → Department Manager
   - If contract value ≤ $10,000 → Auto-approve
3. Start approval (with document link + summary)
4. Wait for response:
   - Approved → Update status column to "Approved", move to "Active Contracts" folder
   - Rejected → Update status to "Rejected", send rejection email with comments
5. If no response in 3 business days → Send reminder
6. If no response in 5 business days → Escalate to next-level manager
\`\`\`

**Key configuration:**

- Use **Start and wait for an approval** (not just "Create an approval") so the flow pauses until a decision is made
- Set the **Assigned to** field dynamically using the department manager lookup from a SharePoint "Managers" list
- Use **Do until** with a timeout for the escalation pattern

If you want the basics first, check out my earlier guide: [Building a SharePoint Approval Flow with Power Automate](/blog/power-automate-sharepoint-approval-flow).

## Workflow 2: Auto-Tag Documents with Metadata

This workflow eliminates the "forgot to tag it" problem permanently.

**Trigger:** When a file is created or modified in any document library

**What it does:**

\`\`\`
1. Get the file name and content type
2. Apply metadata rules:
   - File name contains "INV" → Set Document Type = "Invoice"
   - File name contains "PO" → Set Document Type = "Purchase Order"
   - File extension is .pdf → Set Format = "PDF"
   - Uploaded to "Legal" folder → Set Department = "Legal"
3. If content type is "Contract":
   - Extract dates from file name (YYYY-MM-DD pattern)
   - Set Expiry Date column
4. Update the file properties with the new metadata
\`\`\`

**Pro tips:**

- Use **expressions** in Power Automate to parse file names: \`contains(triggerOutputs()?['body/{FilenameWithExtension}'], 'INV')\`
- For AI-powered tagging, combine this with [AI Builder document processing](/blog/power-automate-ai-builder-intelligent-document-processing) to extract metadata from the document content itself — not just the file name
- **New in 2026:** With the Rules feature, you can set simple metadata rules directly in the library settings without building a full flow

## Workflow 3: Automated Document Archiving

Keep your document libraries clean by automatically archiving old documents.

**Trigger:** Recurrence — runs daily at 11 PM

**Flow logic:**

\`\`\`
1. Get items from "Active Documents" library
   Filter: Modified date < 18 months ago AND Status = "Completed"
2. For each matching document:
   a. Copy file to "Archive" library (preserving metadata)
   b. Add archival record to "Archive Log" list:
      - Original location
      - Archive date
      - Archived by (system account)
      - Retention period (based on document type)
   c. Delete original file from "Active Documents"
3. Send weekly summary email to library owners:
   - Documents archived this week: X
   - Storage recovered: Y MB
   - Next scheduled archive: Z
\`\`\`

**Configuration details:**

- Use the **Send an HTTP request to SharePoint** action to copy files with metadata (the standard "Copy file" action doesn't preserve metadata)
- Set the recurrence to run outside business hours to avoid contention
- Use SharePoint's **file-level archiving** (new in 2026) for cold storage instead of copying to a separate library — it's cheaper and keeps content discoverable

## Workflow 4: Smart Notifications and Reminders

Replace "Did you see the email?" with intelligent, context-aware notifications.

**Trigger:** Multiple triggers combined in a single flow

**Notification scenarios:**

| Event | Channel | Who Gets Notified |
|-------|---------|------------------|
| New document uploaded | Teams channel | Team members |
| Document pending approval > 2 days | Teams direct message | Approver |
| Contract expiring in 30 days | Email + Teams | Legal team + document owner |
| Document checked out > 24 hours | Teams DM | Person who checked it out |
| Failed document processing | Email | IT admin |

**Example: Contract expiry reminder**

\`\`\`
Trigger: Recurrence (daily at 9 AM)
1. Get items from "Contracts" list
   Filter: ExpiryDate between today+25 and today+35
   AND ReminderSent ≠ true
2. For each expiring contract:
   a. Post adaptive card to Teams:
      - Contract name, vendor, expiry date
      - Buttons: "Renew", "Let Expire", "View Contract"
   b. Send email to contract owner with renewal link
   c. Update ReminderSent = true
3. Second filter: ExpiryDate between today and today+7
   → Send URGENT notification to legal team channel
\`\`\`

**Pro tip:** Use **Adaptive Cards** in Teams notifications instead of plain text messages. They're interactive — users can take action directly from the notification without opening SharePoint.

## Workflow 5: Document Generation from Templates

Automatically generate standardized documents from SharePoint list data.

**Trigger:** When an item is created in the "New Client Onboarding" list

**Flow logic:**

\`\`\`
1. Get the new item properties:
   - Client name, address, contract type, start date, terms
2. Use "Populate a Microsoft Word template" action:
   - Template: stored in "Templates" library
   - Map list columns to template placeholders
3. Create the generated document in "Client Documents" library:
   - Folder: Client Name/Year
   - File name: "{ClientName}_Contract_{Date}.docx"
4. Convert to PDF using "Convert file" action
5. Store both .docx and .pdf versions
6. Update the list item with a link to the generated document
7. Send Teams notification to the account manager
\`\`\`

**Configuration tips:**

- Create your Word template with **Content Controls** (Developer tab → Rich Text Content Control). Each control's title must match the Power Automate field mapping
- For complex documents (multi-page contracts with conditional sections), use the **Plumsail Documents** connector — it supports conditional content, tables with dynamic rows, and page breaks
- Store templates in a dedicated "Templates" library with versioning enabled so you can roll back template changes

## Workflow 6: Content Type Routing

Automatically route documents to the correct library based on their content type.

**Trigger:** When a file is created in the "Inbox" document library

**Flow logic:**

\`\`\`
1. Get the file's content type and metadata
2. Route based on content type:
   - "Invoice" → Move to Finance/Invoices library
   - "Contract" → Move to Legal/Contracts library
   - "Policy" → Move to HR/Policies library
   - "Technical Spec" → Move to Engineering/Specs library
   - Unknown → Leave in Inbox, notify admin
3. After moving:
   a. Apply destination library's default metadata
   b. Trigger the destination library's approval flow (if configured)
   c. Log the routing in "Document Routing Log" list
\`\`\`

**Why this matters:**

In large organizations, people don't know (or don't care) where documents should go. A single "drop-box" library with automatic routing solves this. Users upload to one place, and the system handles the rest.

**Pro tip:** Combine this with **information barriers** and **sensitivity labels** for compliance. For example, if a document is labeled "Confidential", route it to a library with restricted access and add an extra approval step.

## Workflow 7: AI-Assisted Document Classification

Use AI Builder to automatically classify and process documents based on their content — not just their file name or metadata.

**Trigger:** When a file is created in the "Unprocessed Documents" library

**Flow logic:**

\`\`\`
1. Send the document to AI Builder's document processing model
2. AI extracts:
   - Document type (invoice, contract, memo, report)
   - Key entities (vendor name, amounts, dates, parties)
   - Confidence score for classification
3. Route based on confidence:
   - Confidence ≥ 90% → Auto-classify and route
   - Confidence 70-89% → Classify but flag for review
   - Confidence < 70% → Send to admin for manual classification
4. Apply extracted metadata as column values
5. Move to the appropriate library
6. Log classification results for model improvement
\`\`\`

For a deep dive on building custom AI models for document processing, check out my full guide: [Power Automate + AI Builder: Intelligent Document Processing](/blog/power-automate-ai-builder-intelligent-document-processing).

## When to Use What: Decision Matrix

With Quick Steps, Rules, and full Power Automate flows all available, here's how to choose:

| Scenario | Use This | Why |
|----------|---------|-----|
| Move document to folder on click | **Quick Step** | Simple, button-triggered, no conditions |
| Send notification when document is uploaded | **Rule** | Single trigger, single action, no logic |
| Approval with escalation logic | **Power Automate** | Complex conditions, timeouts, loops |
| Auto-tag based on file name | **Rule** | Simple pattern matching |
| AI classification + routing | **Power Automate** | AI Builder integration, multi-step |
| Generate document from template | **Power Automate** | Multiple actions, file creation |
| Archive old documents on schedule | **Power Automate** | Scheduled trigger, batch processing |
| Update metadata when column changes | **Rule** | Reactive, single action |

**Rule of thumb:** If it takes one trigger and one action, use a Rule. If it needs a button click, use a Quick Step. If it needs conditions, loops, or external connectors, use Power Automate.

## Production Checklist

Before deploying any of these workflows to your tenant:

- [ ] **Error handling** — Wrap actions in Scope blocks with "Configure run after" settings for failure paths
- [ ] **Throttling** — SharePoint has API limits (600 calls/min per user). Use batching and delays for high-volume libraries
- [ ] **Permissions** — The flow runs under the creator's account. Use a service account for production flows
- [ ] **Testing** — Test with edge cases: large files (>250 MB), special characters in file names, empty metadata fields
- [ ] **Monitoring** — Set up the Power Automate analytics dashboard to track flow runs, failures, and durations
- [ ] **Documentation** — Document each flow's purpose, trigger, and expected behavior in a shared Confluence or SharePoint page

## Frequently Asked Questions

**Q: Can I use these workflows with SharePoint on-premises?**

Power Automate works with SharePoint Server through the **on-premises data gateway**. However, the new unified workflows experience (Quick Steps, Rules) is SharePoint Online only. For on-premises, you'll need to build full Power Automate flows with the gateway connector.

**Q: What licenses do I need?**

Most SharePoint triggers and actions work with a **Microsoft 365** license (E3/E5, Business Basic/Standard/Premium). AI Builder requires **Power Automate Premium** or a standalone AI Builder license. The new Quick Steps and Rules features are included in Microsoft 365 licenses.

**Q: How many flows can I create?**

With a Microsoft 365 license, you can create unlimited cloud flows. However, there are **run limits** — standard plans allow 6,000 flow runs per month per user. Power Automate Premium removes this cap.

**Q: Will these flows work with Teams-connected SharePoint sites?**

Yes. Every Microsoft Team has an associated SharePoint site. Flows triggered on the team's document library work exactly the same way. You can even post notifications back to the team's channel as part of the flow.

**Q: What happens if a flow fails mid-execution?**

Power Automate has built-in **retry policies** for transient errors (429 throttling, 503 service unavailable). For permanent failures, use the Scope + "Configure run after" pattern described in the production checklist. Failed runs are logged in the Power Automate admin center with full error details.

## What's Next

Document workflow automation with Power Automate is one of the highest-ROI investments you can make in the Microsoft 365 ecosystem. Start with the simplest workflow that solves your biggest pain point — usually document approvals or notifications — and expand from there.

The new unified workflows experience makes the barrier to entry even lower. If you haven't already, explore the **Rules** and **Quick Steps** features rolling out in your SharePoint libraries this month.

For more Power Platform content, check out my guides on [building canvas apps with SharePoint](/blog/power-apps-canvas-app-sharepoint-complete-guide) and [SharePoint agents for AI-powered search](/blog/sharepoint-agents-ai-powered-assistants).
`,
    date: '2026-03-05',
    displayDate: 'March 5, 2026',
    readTime: '14 min read',
    category: 'Power Platform',
    tags: ['power-automate', 'sharepoint', 'document-management', 'workflows', 'automation', 'microsoft-365'],
  },
  {
    id: '10',
    slug: 'power-automate-ai-builder-intelligent-document-processing',
    title: 'Power Automate + AI Builder: Intelligent Document Processing Complete Guide',
    excerpt:
      'Learn how to build automated document processing pipelines using Power Automate and AI Builder — extract data from invoices, receipts, and forms with prebuilt and custom AI models, no code required.',
    content: `
## What Is Intelligent Document Processing ?

** Intelligent Document Processing(IDP) ** uses AI to automatically extract, classify, and process data from unstructured documents like invoices, receipts, contracts, and forms.Instead of manually typing data from a PDF into a spreadsheet, IDP reads the document for you.

In the Microsoft ecosystem, this is powered by ** AI Builder ** — a low - code AI capability built directly into the ** Power Platform **.Combined with ** Power Automate **, you can build end - to - end pipelines that:

1. Receive a document(via email, SharePoint upload, or Teams message)
2. Extract structured data using an AI model
3. Validate and route the data to downstream systems
4. Notify stakeholders and log an audit trail

All without writing a single line of traditional code.

## Why This Matters in 2026

The push toward ** hyperautomation ** — automating entire business processes rather than individual tasks — has made document processing one of the highest - ROI automation targets.Here's why:

  - ** 80 % of enterprise data is unstructured ** (PDFs, scanned images, emails). Traditional RPA tools can't handle them reliably
    - ** AI Builder models are pre - trained on millions of documents **, so they work out of the box for common document types(invoices, receipts, business cards, passports)
      - ** Custom AI models ** let you train on your own document formats with as few as 5 sample documents
        - ** Power Automate integration ** means extracted data flows directly into SharePoint, Dataverse, Dynamics 365, or any of 1,000 + connectors

## Prerequisites

Before you start building:

- ** Power Automate Premium license ** (AI Builder requires Premium or per - user plan)
- ** AI Builder credits ** — included with certain Microsoft 365 and Dynamics 365 plans, or purchasable separately
  - ** SharePoint Online ** — for document storage and triggers
    - ** A Microsoft 365 environment ** — developer tenant works fine for testing

## Step 1: Choose Your AI Model

AI Builder offers several prebuilt models that require zero training:

| Model | What It Extracts | Best For |
| -------| -----------------| ----------|
| ** Invoice Processing ** | Vendor, amounts, line items, dates, PO numbers | Accounts payable automation |
| ** Receipt Processing ** | Merchant, total, tax, date, payment method | Expense report automation |
| ** Identity Document Reader ** | Name, DOB, address, document number | KYC / onboarding workflows |
| ** Business Card Reader ** | Name, title, company, email, phone | CRM lead capture |
| ** Text Recognition(OCR) ** | Raw text from any image or PDF | General - purpose extraction |
| ** Custom Document Processing ** | Any fields you define | Custom forms, applications |

  For this guide, we'll build an **invoice processing pipeline** — the most common enterprise use case.

## Step 2: Build the Power Automate Flow

### Trigger: When a File Is Created in SharePoint

Create a new ** Automated cloud flow ** in Power Automate:

1. Go to[make.powerautomate.com](https://make.powerautomate.com)
  2. Click ** Create ** → ** Automated cloud flow **
3. Name it: \`Invoice Processing Pipeline\`
4. Trigger: **When a file is created (properties only)** — SharePoint
5. Configure:
   - **Site Address:** Your SharePoint site
   - **Library Name:** \`Invoices\` (create this document library if it doesn't exist)

### Action: Extract Information from Invoices

Add the AI Builder action:

1. Click **New step** → search for **AI Builder**
2. Select **Extract information from invoices**
3. For the **Invoice file** parameter, use the dynamic content picker to select the file content from the SharePoint trigger

This is the magic step. AI Builder will analyze the document and return structured data including:

- **Invoice ID**
- **Invoice date** and **due date**
- **Vendor name** and **vendor address**
- **Customer name**
- **Subtotal**, **tax**, and **total amount**
- **Line items** (description, quantity, unit price, amount)
- **Purchase order number**
- **Confidence scores** for each extracted field

### Action: Create Item in SharePoint List

Now store the extracted data in a structured SharePoint list:

1. Add **Create item** — SharePoint
2. Configure:
   - **Site Address:** Your SharePoint site
   - **List Name:** \`Invoice Records\`
   - Map the AI Builder outputs to your list columns:

\`\`\`
Vendor Name    →  AI Builder: Vendor name
Invoice Number →  AI Builder: Invoice ID
Invoice Date   →  AI Builder: Invoice date
Total Amount   →  AI Builder: Total
Status         →  "Pending Review"
Confidence     →  AI Builder: Confidence score
\`\`\`

### Action: Handle Low-Confidence Results

Not every extraction will be perfect. Add a **Condition** to route uncertain results for human review:

\`\`\`
If AI Builder Confidence Score is less than 0.85
  → Send an adaptive card to Teams for manual review
Else
  → Auto-approve and update status to "Approved"
\`\`\`

This **human-in-the-loop** pattern is critical for production deployments. It ensures accuracy while still automating 80-90% of documents automatically.

### Action: Send Notification

Add a final step to notify the finance team:

1. Add **Post a message in a chat or channel** — Microsoft Teams
2. Select the \`#invoices\` channel
3. Include a summary of the extracted data

## Step 3: Train a Custom AI Model (Optional)

When your documents don't match any prebuilt model — for example, custom internal forms, insurance claims, or government applications — you can train a custom model.

### Create the Model

1. Go to [make.powerapps.com](https://make.powerapps.com) → **AI Builder** → **Explore**
2. Click **Document processing** → **Create custom model**
3. Define the **fields** you want to extract (e.g., "Claim Number", "Policy ID", "Incident Date")
4. Upload **at least 5 sample documents** (more samples = better accuracy)
5. Tag each field on the sample documents using the visual tagging tool
6. Click **Train** — this takes 15-30 minutes depending on complexity

### Use the Custom Model in Power Automate

Once trained, your custom model appears alongside the prebuilt models:

1. In Power Automate, add **Process and save information from forms** — AI Builder
2. Select your custom model from the dropdown
3. Map the file content from your trigger
4. The output will include your custom fields with confidence scores

## Step 4: Production-Ready Patterns

### Error Handling

Always wrap AI Builder actions in a **Try-Catch** pattern using **Scope** actions:

\`\`\`
Scope: "Try - Process Invoice"
  ├── Extract information from invoices
  ├── Create item in SharePoint
  └── Send Teams notification

Scope: "Catch - Handle Errors" (Configure to Run After: "Try" has failed)
  ├── Log error to SharePoint "Error Log" list
  ├── Move failed document to "Failed" folder
  └── Send alert email to admin
\`\`\`

### Batch Processing

For high-volume scenarios, use the **Apply to each** action to process multiple documents:

\`\`\`
Trigger: Recurrence (daily at 8 AM)
  → Get files from "Unprocessed Invoices" folder
  → Apply to each file:
      → Extract information from invoices
      → Create item in SharePoint
      → Move file to "Processed" folder
\`\`\`

### Approval Workflow Integration

Combine AI Builder extraction with **Power Automate Approvals** for a complete procure-to-pay workflow:

\`\`\`
Document received
  → AI extracts data
  → If amount > $5,000: Start approval with VP Finance
  → If amount > $1,000: Start approval with Manager
  → If amount < $1,000: Auto-approve
  → Update ERP system via connector
\`\`\`

## Real-World Performance Metrics

Based on enterprise deployments I've worked with:

| Metric | Before IDP | After IDP |
|--------|-----------|-----------|
| Invoice processing time | 15-20 min/invoice | 30 seconds |
| Error rate | 5-8% (human entry) | 1-2% (AI + human review) |
| Monthly capacity | ~500 invoices/person | ~5,000 invoices/person |
| Staff reallocation | 3 FTE on data entry | 0.5 FTE on exception handling |

The ROI is typically realized within 2-3 months.

## Licensing and Costs

AI Builder uses a **credit-based** consumption model:

- **Prebuilt models** (invoice, receipt): ~1 credit per page processed
- **Custom models**: ~1 credit per page processed
- **Credits included** with Power Automate Premium, Power Apps Premium, and certain Dynamics 365 licenses
- **Additional credits** can be purchased in packs of 1 million (~$500/month)

For most SMBs processing under 5,000 documents/month, the included credits are sufficient.

## Tips and Best Practices

- **Start with prebuilt models first.** They're remarkably accurate for standard document types and require zero setup time
- **Use PDF format when possible.** AI Builder handles scanned images, but clean PDFs yield better extraction accuracy
- **Set confidence thresholds per field.** Some fields (like total amount) may need a higher threshold than others (like vendor address)
- **Build a feedback loop.** Log extraction accuracy over time and retrain custom models when accuracy drops below your target
- **Test with edge cases.** Multi-page invoices, rotated pages, low-quality scans, and multi-language documents can trip up models
- **Use SharePoint metadata columns** to make extracted data searchable and filterable without opening documents

## What's Next for AI Builder in 2026

Microsoft's roadmap includes exciting capabilities:

- **Multi-modal document understanding** — Combining text, images, and table extraction in a single pass
- **Cross-document intelligence** — Linking related documents (PO → Invoice → Receipt) automatically
- **Continuous learning** — Models that improve from corrections without manual retraining
- **Natural language queries** — Ask questions about your documents using Copilot directly in Power Automate

AI Builder is no longer a "nice-to-have" — it's becoming the standard way to bridge the gap between physical documents and digital business processes in the Microsoft ecosystem.
`,
    date: '2026-03-03',
    displayDate: 'March 3, 2026',
    readTime: '12 min read',
    category: 'Power Platform',
    tags: ['power-automate', 'ai-builder', 'document-processing', 'automation', 'low-code', 'microsoft-365'],
  },
  {
    id: '9',
    slug: 'building-viva-connections-adaptive-card-extensions-spfx',
    title: 'Building Viva Connections Adaptive Card Extensions (ACEs) with SPFx',
    excerpt:
      'A complete hands-on guide to creating Adaptive Card Extensions for Microsoft Viva Connections dashboards — from scaffolding your first ACE with SPFx to building interactive Quick View cards with real data.',
    content: `
## What Are Adaptive Card Extensions?

**Adaptive Card Extensions (ACEs)** are the building blocks of the **Microsoft Viva Connections** dashboard — the employee experience hub in Microsoft 365. Every card on the Viva Connections dashboard is an ACE.

As an SPFx developer, ACEs let you build compact, interactive dashboard widgets that surface real-time business data directly on the Viva Connections home screen. Think of them as SPFx web parts, but purpose-built for mobile-first, glanceable dashboards.

An ACE has two visual states:

- **Card View** — The compact card shown on the dashboard (like a widget on your phone home screen)
- **Quick View** — A richer, larger panel that opens when the user clicks the card (like tapping a widget to expand it)

Both are rendered using **Adaptive Card JSON** — the same cross-platform card format used in Teams, Outlook, and Bot Framework.

## Why Build ACEs in 2026?

With Viva Connections rolling out as the default Teams home experience for many enterprise organizations, the Viva dashboard is now the first screen employees see every day. This makes ACEs one of the highest-visibility touchpoints in the entire Microsoft 365 ecosystem.

Real-world ACE use cases that are trending right now:

- **IT Service Desk** — Show open ticket count, let users submit new tickets
- **Leave Balance Tracker** — Display remaining leave days, link to the request form
- **Company News Feed** — Surface the latest announcements from SharePoint News
- **Attendance Summary** — Show today's in-office vs. remote headcount
- **Project Status Tracker** — At-a-glance KPIs for active projects from Planner or Dataverse
- **Birthday & Anniversary Cards** — Celebrate team milestones pulled from HR data

## Prerequisites

Set up your environment before starting:

- **SPFx 1.19+** (ACE improvements require at minimum 1.18; 1.21+ recommended for latest ACE features)
- **Node.js 18.x LTS** — use \`nvm\` to manage versions
- **Yeoman + SPFx generator** (or the new \`@microsoft/spfx-cli\` for SPFx 1.23+)
- **Microsoft 365 developer tenant** with Viva Connections enabled
- **Viva Connections license** — included in Microsoft 365 E3/E5, or available as standalone

Verify your environment:

\`\`\`bash
node --version   # Should be 18.x
npm --version    # Should be 9.x or higher
yo --version     # Should be installed globally
\`\`\`

## Step 1: Scaffold Your First ACE

Create a new project using the SPFx generator:

\`\`\`bash
yo @microsoft/sharepoint
\`\`\`

When prompted:

1. **Solution name:** \`leave-balance-ace\`
2. **Target:** SharePoint Online only (latest)
3. **Place files:** Current folder
4. **Type of client-side component:** Adaptive Card Extension
5. **Template:** Generic Card Template
6. **ACE name:** \`LeaveBalanceACE\`

This creates the following structure:

\`\`\`
leave-balance-ace/
├── src/
│   └── adaptiveCardExtensions/
│       └── leaveBalance/
│           ├── LeaveBalanceAdaptiveCardExtension.ts   ← Main ACE class
│           ├── LeaveBalanceAdaptiveCardExtension.manifest.json
│           ├── cardView/
│           │   └── CardView.ts                        ← Card view definition
│           ├── quickView/
│           │   └── QuickView.ts                       ← Quick view definition
│           └── loc/
│               └── en-us.js
├── config/
├── package.json
└── gulpfile.js
\`\`\`

## Step 2: Understand the ACE Architecture

Open \`LeaveBalanceAdaptiveCardExtension.ts\`. This is the brain of your ACE:

\`\`\`typescript
import { IAdaptiveCardExtensionCard, BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';

export interface ILeaveBalanceACEState {
  annualLeaveRemaining: number;
  sickLeaveRemaining: number;
  lastUpdated: string;
}

export interface ILeaveBalanceACEProperties {
  title: string;
}

const CARD_VIEW_REGISTRY_ID = 'LeaveBalance_CARD_VIEW';
export const QUICK_VIEW_REGISTRY_ID = 'LeaveBalance_QUICK_VIEW';

export default class LeaveBalanceACE extends BaseAdaptiveCardExtension<
  ILeaveBalanceACEProperties,
  ILeaveBalanceACEState
> {
  public async onInit(): Promise<void> {
    this.state = {
      annualLeaveRemaining: 0,
      sickLeaveRemaining: 0,
      lastUpdated: '',
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_REGISTRY_ID, () => new QuickView());

    await this._fetchLeaveData();
    return Promise.resolve();
  }

  private async _fetchLeaveData(): Promise<void> {
    // Fetch from SharePoint list, Graph API, or any REST endpoint
    // For this example, we'll use a SharePoint list
    const response = await this.context.spHttpClient.get(
      \`\${this.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Leave Balances')/items?$filter=EmployeeEmail eq '\${this.context.pageContext.user.email}'&$select=AnnualLeave,SickLeave\`,
      SPHttpClient.configurations.v1
    );
    
    const data = await response.json();
    
    if (data.value && data.value.length > 0) {
      this.setState({
        annualLeaveRemaining: data.value[0].AnnualLeave,
        sickLeaveRemaining: data.value[0].SickLeave,
        lastUpdated: new Date().toLocaleDateString(),
      });
    }
  }

  protected get iconProperty(): string {
    return 'Calendar';  // Fluent UI icon name
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import('./LeaveBalancePropertyPane')
      .then(component => {
        this._deferredPropertyPane = new component.LeaveBalancePropertyPane();
      });
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }
}
\`\`\`

The key concepts:

- **\`onInit()\`** — Called when the ACE loads. Fetch your data here and set the initial state
- **\`setState()\`** — Updates state and triggers re-render of both card and quick views
- **\`renderCard()\`** — Returns the ID of the card view to display
- **\`cardNavigator\` / \`quickViewNavigator\`** — Navigation stacks for view routing

## Step 3: Build the Card View

Open \`cardView/CardView.ts\`. The card view defines what users see on the dashboard:

\`\`\`typescript
import {
  BasePrimaryTextCardView,
  IPrimaryTextCardViewParameters,
} from '@microsoft/sp-adaptive-card-extension-base';
import { QUICK_VIEW_REGISTRY_ID } from '../LeaveBalanceAdaptiveCardExtension';

export class CardView extends BasePrimaryTextCardView<
  ILeaveBalanceACEProperties,
  ILeaveBalanceACEState
> {
  public get data(): IPrimaryTextCardViewParameters {
    return {
      title: this.properties.title || 'Leave Balance',
      primaryText: \`\${this.state.annualLeaveRemaining} days\`,
      description: \`Annual leave remaining · Updated \${this.state.lastUpdated}\`,
    };
  }

  public get cardButtons(): [ICardButton] | [ICardButton, ICardButton] | undefined {
    return [
      {
        title: 'View Details',
        action: {
          type: 'QuickView',
          parameters: {
            view: QUICK_VIEW_REGISTRY_ID,
          },
        },
      },
    ];
  }
}
\`\`\`

### Built-in Card View Templates

SPFx provides several pre-built card view base classes so you don't need to design from scratch:

| Class | When to Use |
|-------|------------|
| \`BasePrimaryTextCardView\` | Title + primary text + description |
| \`BaseImageCardView\` | Card with a featured image |
| \`BaseTextInputCardView\` | Card with an inline text input (search, quick submit) |
| \`BaseBasicCardView\` | Minimal card — just title and buttons |

Pick the template that fits your content type. Most dashboard widgets use \`BasePrimaryTextCardView\`.

## Step 4: Build the Quick View

The Quick View is a full Adaptive Card that opens when users click your card. Edit \`quickView/QuickView.ts\`:

\`\`\`typescript
import {
  BaseAdaptiveCardView,
  IAdaptiveCardViewParameters,
} from '@microsoft/sp-adaptive-card-extension-base';

export class QuickView extends BaseAdaptiveCardView<
  ILeaveBalanceACEProperties,
  ILeaveBalanceACEState,
  ILeaveBalanceData
> {
  public get data(): ILeaveBalanceData {
    return {
      annualLeave: this.state.annualLeaveRemaining,
      sickLeave: this.state.sickLeaveRemaining,
      lastUpdated: this.state.lastUpdated,
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "type": "AdaptiveCard",
      "version": "1.5",
      "body": [
        {
          "type": "TextBlock",
          "text": "Your Leave Balance",
          "size": "Large",
          "weight": "Bolder",
          "wrap": true
        },
        {
          "type": "FactSet",
          "facts": [
            {
              "title": "Annual Leave",
              "value": "\${annualLeave} days remaining"
            },
            {
              "title": "Sick Leave",
              "value": "\${sickLeave} days remaining"
            },
            {
              "title": "Last Updated",
              "value": "\${lastUpdated}"
            }
          ]
        },
        {
          "type": "ActionSet",
          "actions": [
            {
              "type": "Action.OpenUrl",
              "title": "Request Leave",
              "url": "https://yourcompany.sharepoint.com/sites/HR/leave-request"
            }
          ]
        }
      ]
    };
  }
}
\`\`\`

### Adaptive Card Templating

Notice the \`\${annualLeave}\` syntax — this is **Adaptive Card Templating**. The \`data()\` getter provides the data object, and the template binds to it using \`\${...}\` expressions. This separation of data and presentation makes cards easy to maintain.

You can design and test your Adaptive Card JSON at [adaptivecards.io/designer](https://adaptivecards.io/designer/) before embedding it in your Quick View.

## Step 5: Test in the Local Workbench

\`\`\`bash
gulp serve
\`\`\`

This opens the Viva Connections workbench at \`https://localhost:4321/temp/workbench.html\`. You can add your ACE to the preview canvas and interact with both the card view and quick view.

For testing against real SharePoint data, use the hosted workbench:

\`\`\`
https://YOUR_TENANT.sharepoint.com/_layouts/15/workbench.aspx
\`\`\`

## Step 6: Add a Property Pane for Configuration

Let administrators configure the ACE without code changes. Create \`LeaveBalancePropertyPane.ts\`:

\`\`\`typescript
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';

export class LeaveBalancePropertyPane {
  public getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Configure Leave Balance Card',
          },
          groups: [
            {
              groupName: 'Settings',
              groupFields: [
                PropertyPaneTextField('title', {
                  label: 'Card Title',
                  placeholder: 'e.g. My Leave Balance',
                }),
                PropertyPaneTextField('listName', {
                  label: 'SharePoint List Name',
                  placeholder: 'e.g. Leave Balances',
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
\`\`\`

Reference it in the main ACE class:

\`\`\`typescript
protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return this._deferredPropertyPane!.getPropertyPaneConfiguration();
}
\`\`\`

## Step 7: Deploy to Viva Connections

Build and package your ACE:

\`\`\`bash
gulp bundle --ship
gulp package-solution --ship
\`\`\`

This creates a \`.sppkg\` file in the \`sharepoint/solution/\` folder.

**Deploy to App Catalog:**
1. Go to your **SharePoint Admin Center** → **Advanced** → **App catalog**
2. Go to **Apps for SharePoint** → **Upload** your \`.sppkg\`
3. Click **Deploy** when prompted
4. Check **Make this solution available to all sites**

**Add to Viva Connections Dashboard:**
1. Open your **Viva Connections** home page in Teams
2. Click **Edit** (requires SharePoint Admin or the Viva Connections Admin role)
3. Click **Add a card** → find your ACE in the list
4. Configure it using the property pane
5. **Save** and **Publish**

Your card is now live on the Viva Connections dashboard for your entire organization.

## Advanced: Real-time State Updates

ACEs support periodic background data refreshes. Add a timer to your \`onInit()\`:

\`\`\`typescript
public async onInit(): Promise<void> {
  // ... existing init code ...

  // Refresh data every 5 minutes
  setInterval(async () => {
    await this._fetchLeaveData();
  }, 5 * 60 * 1000);

  return Promise.resolve();
}
\`\`\`

This keeps dashboard cards current without requiring page reloads — critical for time-sensitive data like IT tickets or on-call rotations.

## Advanced: Deep-Linking to Teams

Open a Teams channel, chat, or app directly from your ACE action:

\`\`\`typescript
public get cardButtons(): [ICardButton] {
  return [
    {
      title: 'Open in Teams',
      action: {
        type: 'ExternalLink',
        parameters: {
          isTeamsDeepLink: true,
          target: 'https://teams.microsoft.com/l/channel/...',
        },
      },
    },
  ];
}
\`\`\`

This is especially powerful for service desk ACEs where clicking the card drops the user directly into the IT support channel.

## Common ACE Patterns

After building ACEs for enterprise dashboards, here are the patterns I reach for repeatedly:

### 1. Loading State Pattern

Always show a loading state while data fetches:

\`\`\`typescript
public async onInit(): Promise<void> {
  this.state = { isLoading: true, data: null };
  
  this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());

  try {
    const data = await this._fetchData();
    this.setState({ isLoading: false, data });
  } catch (error) {
    this.setState({ isLoading: false, error: 'Failed to load data' });
  }
}
\`\`\`

### 2. Conditional Card Buttons

Show different buttons based on state — like hiding "Submit" after a form is completed:

\`\`\`typescript
public get cardButtons(): [ICardButton] | undefined {
  if (this.state.isLoading) return undefined;
  if (this.state.submitted) return undefined;

  return [{ title: 'Submit Request', action: { type: 'QuickView', parameters: { view: FORM_VIEW } } }];
}
\`\`\`

### 3. Multi-View Navigation

Navigate between multiple Quick Views like a mini wizard:

\`\`\`typescript
// In QuickView 1 — navigate to QuickView 2 on action
public onAction(action: IActionArguments): void {
  if (action.type === 'Submit') {
    this.quickViewNavigator.push(CONFIRM_VIEW_ID);
  }
}

// Navigate back
this.quickViewNavigator.pop();

// Reset to card view
this.quickViewNavigator.close();
\`\`\`

## Performance Tips

- **Cache API responses.** Store fetched data in the ACE state and only re-fetch on explicit refresh. Viva Connections can display dozens of cards — unnecessary API calls compound quickly
- **Use Adaptive Card v1.5.** It supports more features and renders better on mobile
- **Keep card view minimal.** Show 2-3 key numbers maximum. The quick view is for details
- **Test on mobile.** Viva Connections is heavily used on Teams mobile. Design your card views for a 390px-wide phone screen first
- **Handle 403 errors gracefully.** If the user doesn't have access to your data source, show a friendly fallback message instead of a broken card

## What's Coming for ACEs in SPFx 1.24

Looking at Microsoft's roadmap for mid-2026:

- **ACE actions without Quick View** — Trigger Power Automate flows or Graph API calls directly from card view buttons, with an in-place confirmation
- **Image Card View improvements** — Animated images and richer layout options for visual cards
- **Enhanced mobile gestures** — Swipe actions on cards for quick approvals
- **AI-generated card content** — Integration point for Copilot-generated summaries directly in ACE card views

Viva Connections ACEs are the most direct way for SPFx developers to impact the daily experience of every employee in an organization. With mobile-first usage growing and Viva becoming the default Teams home page, the investment in learning ACEs pays dividends quickly.
`,
    date: '2026-03-02',
    displayDate: 'March 2, 2026',
    readTime: '14 min read',
    category: 'SPFx',
    tags: ['spfx', 'viva-connections', 'adaptive-card-extensions', 'ace', 'microsoft-365', 'dashboard'],
  },
  {
    id: '8',
    slug: 'microsoft-graph-api-spfx-user-profiles-teams',
    title: '10 Microsoft Graph API Examples Every SPFx Developer Must Know (2026)',
    excerpt:
      'Unlock the power of Microsoft Graph in your SPFx web parts! Copy these 10 production-ready examples for user profiles, Teams, and calendar data.',
    content: `
## Why Microsoft Graph API in SPFx?

If you're building SharePoint Framework web parts, you'll quickly hit the limits of what pure SharePoint APIs can do. Need to show the current user's photo? Display their Teams memberships? Pull calendar events? Send emails?  That's where **Microsoft Graph** comes in.

Microsoft Graph is the **unified API for all of Microsoft 365**. From a single endpoint (\`https://graph.microsoft.com\`), you can access:

- **User profiles** — photos, job titles, managers, direct reports
- **Teams and channels** — list teams, post messages, get channel members
- **Calendar events** — upcoming meetings, availability, free/busy status
- **OneDrive files** — recent files, shared documents, file previews
- **Mail** — read, send, and search emails
- **Planner** — tasks, buckets, plans across your organization
- **SharePoint** — sites, lists, and pages (beyond what the SP REST API offers)

The best part? **SPFx has built-in Graph support** through the \`MSGraphClientV3\` — no need to manually handle OAuth tokens.

## Prerequisites

Before you start, make sure you have:

- **SPFx 1.19+** development environment set up ([see my SPFx Hello World guide](/blog/building-spfx-hello-world-webpart))
- **Microsoft 365 developer tenant** or access to a SharePoint Online site
- **API permissions** configured in your \`package-solution.json\`
- **Admin consent** granted for the Graph scopes you need

## Step 1: Request API Permissions

The first thing you need is to declare which Graph permissions your web part requires. Open \`config/package-solution.json\` and add the \`webApiPermissionRequests\` section:

\`\`\`json
{
  "solution": {
    "name": "graph-webpart-client-side-solution",
    "id": "your-guid-here",
    "version": "1.0.0.0",
    "includeClientSideAssets": true,
    "isDomainIsolated": false,
    "webApiPermissionRequests": [
      {
        "resource": "Microsoft Graph",
        "scope": "User.Read"
      },
      {
        "resource": "Microsoft Graph",
        "scope": "User.ReadBasic.All"
      },
      {
        "resource": "Microsoft Graph",
        "scope": "Team.ReadBasic.All"
      },
      {
        "resource": "Microsoft Graph",
        "scope": "Sites.Read.All"
      }
    ]
  }
}
\`\`\`

### Understanding Permission Scopes

Choose the **least privileged scope** that works for your scenario:

| What You Need | Scope | Permission Type |
|--------------|-------|----------------|
| Current user's profile | \`User.Read\` | Delegated |
| Any user's basic profile | \`User.ReadBasic.All\` | Delegated |
| User photos | \`User.Read.All\` | Delegated |
| List Teams memberships | \`Team.ReadBasic.All\` | Delegated |
| Read SharePoint sites | \`Sites.Read.All\` | Delegated |
| Send mail | \`Mail.Send\` | Delegated |
| Read calendars | \`Calendars.Read\` | Delegated |

**Important:** After deploying your \`.sppkg\` package, a **tenant admin** must approve these permissions in the SharePoint Admin Center → **API access** page. Without admin consent, your Graph calls will fail with a 403.

## Step 2: Initialize the Graph Client

In your web part file (e.g., \`GraphDemoWebPart.ts\`), get the Graph client from the SPFx context:

\`\`\`typescript
import { MSGraphClientV3 } from '@microsoft/sp-http';

// Inside your web part class:
private async getGraphClient(): Promise<MSGraphClientV3> {
  return await this.context.msGraphClientFactory.getClient('3');
}
\`\`\`

That's it. No OAuth configuration, no client secrets, no token management. SPFx handles the entire authentication flow for you using the current user's Azure AD session.

## Step 3: Fetch the Current User's Profile

Let's start with the most common scenario — getting the signed-in user's profile data:

\`\`\`typescript
interface UserProfile {
  displayName: string;
  mail: string;
  jobTitle: string;
  officeLocation: string;
  department: string;
  businessPhones: string[];
}

private async getCurrentUser(): Promise<UserProfile> {
  const client = await this.getGraphClient();
  
  const response: UserProfile = await client
    .api('/me')
    .select('displayName,mail,jobTitle,officeLocation,department,businessPhones')
    .get();
  
  return response;
}
\`\`\`

### Get the User's Photo

User photos are returned as binary blobs, so you need to convert them to a data URL:

\`\`\`typescript
private async getUserPhoto(): Promise<string> {
  const client = await this.getGraphClient();
  
  try {
    const photoBlob: Blob = await client
      .api('/me/photo/$value')
      .responseType('blob' as any)
      .get();
    
    return URL.createObjectURL(photoBlob);
  } catch {
    // User has no photo — return a placeholder
    return '';
  }
}
\`\`\`

## Step 4: List the User's Teams

Show which Microsoft Teams the current user belongs to:

\`\`\`typescript
interface Team {
  id: string;
  displayName: string;
  description: string;
}

private async getMyTeams(): Promise<Team[]> {
  const client = await this.getGraphClient();
  
  const response = await client
    .api('/me/joinedTeams')
    .select('id,displayName,description')
    .get();
  
  return response.value;
}
\`\`\`

## Step 5: Search SharePoint Sites

Use Graph to search across all SharePoint sites in the tenant:

\`\`\`typescript
interface SiteResult {
  id: string;
  displayName: string;
  webUrl: string;
  description: string;
}

private async searchSites(query: string): Promise<SiteResult[]> {
  const client = await this.getGraphClient();
  
  const response = await client
    .api('/sites')
    .query({ search: query })
    .select('id,displayName,webUrl,description')
    .get();
  
  return response.value;
}
\`\`\`

## Step 6: Put It All Together in React

Here's how to wire everything up in a React component:

\`\`\`typescript
import * as React from 'react';
import { useState, useEffect } from 'react';

const GraphDemo: React.FC<{ graphClient: MSGraphClientV3 }> = ({ graphClient }) => {
  const [user, setUser] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, teamsData] = await Promise.all([
          graphClient.api('/me')
            .select('displayName,mail,jobTitle,department')
            .get(),
          graphClient.api('/me/joinedTeams')
            .select('id,displayName,description')
            .get()
        ]);
        
        setUser(userData);
        setTeams(teamsData.value);
      } catch (error) {
        console.error('Graph API error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [graphClient]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Welcome, {user?.displayName}</h2>
      <p>{user?.jobTitle} — {user?.department}</p>
      
      <h3>Your Teams ({teams.length})</h3>
      <ul>
        {teams.map(team => (
          <li key={team.id}>
            <strong>{team.displayName}</strong>
            <span>{team.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
\`\`\`

## Error Handling Patterns

Graph API calls can fail for many reasons. Here's a robust pattern:

\`\`\`typescript
private async safeGraphCall<T>(
  apiCall: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await apiCall();
  } catch (error: any) {
    if (error.statusCode === 403) {
      console.warn('Permission denied. Has admin approved the API permissions?');
    } else if (error.statusCode === 404) {
      console.warn('Resource not found.');
    } else if (error.statusCode === 429) {
      console.warn('Throttled. Retry after:', error.headers?.['Retry-After']);
    }
    return fallback;
  }
}
\`\`\`

## Batching Multiple Requests

Instead of making 5 separate Graph calls, batch them into one:

\`\`\`typescript
private async batchGraphCalls(): Promise<any> {
  const client = await this.getGraphClient();
  
  const batchContent = {
    requests: [
      { id: '1', method: 'GET', url: '/me' },
      { id: '2', method: 'GET', url: '/me/joinedTeams' },
      { id: '3', method: 'GET', url: '/me/manager' },
      { id: '4', method: 'GET', url: '/me/events?$top=5' },
    ]
  };
  
  const response = await client
    .api('/$batch')
    .post(batchContent);
  
  return response.responses;
}
\`\`\`

This is **significantly faster** than sequential calls, especially on slower connections.

## PnP JS Alternative

If you prefer a more developer-friendly wrapper, **PnP JS** provides a Graph client with chainable, typed methods:

\`\`\`typescript
import { graphfi, SPFx } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/teams";

// In onInit():
const graph = graphfi().using(SPFx(this.context));

// Usage:
const me = await graph.me();
const teams = await graph.me.joinedTeams();
const photo = await graph.me.photo.getBlob();
\`\`\`

PnP JS handles batching, caching, and error handling for you. If you're building complex Graph integrations, it's worth the extra dependency.

## Common Mistakes

After building dozens of Graph-powered SPFx web parts, these are the issues I see most:

- **Forgetting admin consent.** Your web part silently gets 403 errors. Always check the API access page first
- **Requesting too many scopes.** Only request what you need. \`User.Read\` is enough for the current user
- **Not using \`$select\`.** Without it, Graph returns every field. Always specify exactly what you need
- **Ignoring throttling.** On pages with many Graph web parts, you'll hit rate limits. Batch your calls and cache responses
- **Hardcoding tenant URLs.** Use Graph's relative paths (\`/me\`, \`/sites\`) instead of hardcoded SharePoint URLs

Microsoft Graph turns your SPFx web parts from "SharePoint only" to "Microsoft 365 powered." Once you start pulling in Teams, calendar, and user data, your web parts become genuinely useful productivity tools — not just SharePoint widgets.
`,
    date: '2026-03-01',
    displayDate: 'March 1, 2026',
    readTime: '12 min read',
    category: 'SPFx',
    tags: ['spfx', 'microsoft-graph', 'pnp-js', 'sharepoint-online', 'react', 'teams'],
  },
  {
    id: '7',
    slug: 'power-apps-canvas-app-sharepoint-complete-guide',
    title: 'Building a Power Apps Canvas App with SharePoint: A Complete Guide',
    excerpt:
      'Step-by-step guide to building a fully functional Power Apps canvas app connected to a SharePoint list — from creating your data source to publishing a polished app with search, filters, and forms.',
    content: `
## Why Power Apps + SharePoint?

If you work in the Microsoft 365 ecosystem, **Power Apps + SharePoint** is the most practical combination for building internal business apps — fast. You get a relational data store (SharePoint lists), a visual app builder (Power Apps), and enterprise-grade auth (Entra ID) — all without provisioning a single server.

Here's when this combo makes sense:

- **Team task trackers** — replace shared Excel files with a real app
- **Inventory management** — visual interface over SharePoint list data
- **Service request forms** — structured intake with validation and routing
- **Employee directories** — searchable, filterable team databases
- **Approval dashboards** — combined with Power Automate for workflow

The alternative is building a custom SPFx webpart or a full-stack web app. Both are 10–50x more effort for these scenarios. Power Apps gets you from idea to production app in hours, not weeks.

## Prerequisites

Before you start, make sure you have:

- **Microsoft 365 license** with Power Apps included (most E3/E5 plans, or standalone Power Apps license)
- **SharePoint Online** — a site where you can create lists
- **Power Apps maker access** — go to \`make.powerapps.com\` to verify
- **A modern browser** — Edge or Chrome recommended

## Step 1: Create the SharePoint List

Every Power App needs a data source. We'll create a **Project Tracker** list that the app will read and write to.

Go to your SharePoint site → **New** → **List** → **Blank list**. Name it \`Project Tracker\`.

Add these columns:

| Column Name | Type | Details |
|-------------|------|---------|
| Title | Single line of text | Default column — use for project name |
| Status | Choice | Choices: Not Started, In Progress, Completed, On Hold |
| Priority | Choice | Choices: High, Medium, Low |
| AssignedTo | Person or Group | Allow single selection |
| DueDate | Date | Date only, no time |
| Description | Multiple lines of text | Plain text, 6 lines |
| PercentComplete | Number | Min: 0, Max: 100, 0 decimal places |

Add 3–5 sample items so you have data to work with in the app.

### Why This Structure Matters

Power Apps works best with **flat, well-typed columns**. Avoid:
- Lookup columns with complex multi-value selections (delegation issues)
- Calculated columns (read-only in Power Apps)
- Deeply nested folder structures (use metadata instead)

## Step 2: Generate the App from SharePoint

The fastest way to start is to let Power Apps scaffold the app for you:

1. Go to your SharePoint list → click **Integrate** → **Power Apps** → **Create an app**
2. Name your app: \`Project Tracker App\`
3. Power Apps opens with a **three-screen app** auto-generated:
   - **BrowseScreen1** — gallery showing all items
   - **DetailScreen1** — read-only view of a single item
   - **EditScreen1** — edit form for creating/updating items

This auto-generated app is functional but ugly. Let's customize it.

## Step 3: Customize the Browse Gallery

Select **BrowseGallery1** on BrowseScreen1. This is the main list view.

### Change the Layout

In the Properties pane, change **Layout** to **Title, subtitle, and body**. Then set:

\`\`\`
Title: ThisItem.Title
Subtitle: ThisItem.Status & " • " & ThisItem.Priority
Body: "Due: " & Text(ThisItem.DueDate, "MMM dd, yyyy")
\`\`\`

### Add Conditional Formatting

Select the **Status** label in the gallery. Set its **Color** property:

\`\`\`
Switch(
    ThisItem.Status.Value,
    "Completed", Color.Green,
    "In Progress", Color.DodgerBlue,
    "On Hold", Color.Orange,
    "Not Started", Color.Gray,
    Color.Black
)
\`\`\`

This gives instant visual feedback — green for done, blue for active, orange for blocked.

### Add a Priority Icon

Insert an **Icon** control into the gallery. Set the **Icon** property:

\`\`\`
Switch(
    ThisItem.Priority.Value,
    "High", Icon.Warning,
    "Medium", Icon.Edit,
    "Low", Icon.CheckBadge,
    Icon.Information
)
\`\`\`

Set the **Color** property:

\`\`\`
Switch(
    ThisItem.Priority.Value,
    "High", RGBA(220, 38, 38, 1),
    "Medium", RGBA(234, 179, 8, 1),
    "Low", RGBA(34, 197, 94, 1),
    Color.Gray
)
\`\`\`

## Step 4: Build the Edit Form

Select **EditForm1** on EditScreen1. This is where users create and edit items.

### Configure Data Cards

Each field in the form is a **Data Card**. To customize:

1. Select the data card → **Advanced** tab → **Unlock** the card
2. Now you can modify individual controls inside the card

### Add Validation

Select the **Save** icon (or button) and wrap the \`SubmitForm\` call with validation:

\`\`\`
If(
    IsBlank(DataCardValue_Title.Text),
    Notify("Project name is required", NotificationType.Error),
    IsBlank(DataCardValue_DueDate.SelectedDate),
    Notify("Due date is required", NotificationType.Error),
    SubmitForm(EditForm1)
)
\`\`\`

### Set Default Values

For new items, set default values on the data cards:

- **Status** default: \`"Not Started"\`
- **Priority** default: \`"Medium"\`
- **PercentComplete** default: \`0\`

Select the data card → \`Default\` property → set your value.

## Step 5: Add Search and Filtering

Back on BrowseScreen1, let's add real search and filter capabilities.

### Search Bar

The auto-generated app includes a search box. Update the gallery's **Items** property:

\`\`\`
SortByColumns(
    Filter(
        'Project Tracker',
        StartsWith(Title, TextSearchBox1.Text) ||
        TextSearchBox1.Text = ""
    ),
    "DueDate",
    SortOrder.Ascending
)
\`\`\`

This searches by project title and sorts by due date.

### Status Filter Dropdown

Insert a **Dropdown** control above the gallery. Set its properties:

\`\`\`
Items: ["All", "Not Started", "In Progress", "Completed", "On Hold"]
Default: "All"
\`\`\`

Update the gallery's **Items** property to include the filter:

\`\`\`
SortByColumns(
    Filter(
        'Project Tracker',
        (StartsWith(Title, TextSearchBox1.Text) || TextSearchBox1.Text = "")
        && (StatusFilter.Selected.Value = "All" || Status.Value = StatusFilter.Selected.Value)
    ),
    "DueDate",
    SortOrder.Ascending
)
\`\`\`

Now users can search by name AND filter by status simultaneously.

## Step 6: Add a Dashboard Header

Let's add a summary bar at the top of BrowseScreen1 showing key metrics.

Insert a **horizontal container** at the top. Add four **Label** controls inside:

\`\`\`
"Total: " & CountRows('Project Tracker')
"Active: " & CountIf('Project Tracker', Status.Value = "In Progress")
"Completed: " & CountIf('Project Tracker', Status.Value = "Completed")
"Overdue: " & CountIf('Project Tracker', DueDate < Today() && Status.Value <> "Completed")
\`\`\`

Style each label with a colored background to create a metrics dashboard — similar to the KPI cards you see in Power BI.

## Step 7: Publish and Share

Once your app is ready:

1. **File** → **Save** → **Publish** → **Publish this version**
2. **Share** → enter the names or email addresses of your team
3. Users can access the app at \`apps.powerapps.com\` or:

### Embed in SharePoint

Add the app directly to a SharePoint page using the **Power Apps web part**:

1. Edit your SharePoint page → **Add a web part** → **Power Apps**
2. Paste your app's **App ID** (found in app details)
3. The app renders inline on the page — no separate window needed

### Embed in Microsoft Teams

1. Open Teams → **Apps** → **Built for your org**
2. Find your app and **Add** it
3. Pin it as a tab in any Teams channel

This is the best distribution method — your team sees the app right where they already work.

## Power Fx Formulas Cheat Sheet

Here are the formulas you'll use most with SharePoint-connected apps:

| Formula | What It Does |
|---------|-------------|
| \`Filter('List', Status.Value = "Active")\` | Get items matching a condition |
| \`LookUp('List', ID = Gallery.Selected.ID)\` | Get a single item by ID |
| \`Patch('List', Defaults('List'), {Title: "New Item"})\` | Create a new item directly (no form) |
| \`Patch('List', Gallery.Selected, {Status: {Value: "Done"}})\` | Update a single field |
| \`Remove('List', Gallery.Selected)\` | Delete an item |
| \`CountRows(Filter('List', Priority.Value = "High"))\` | Count items with a condition |
| \`SortByColumns(Filter(...), "DueDate", Ascending)\` | Sort filtered results |
| \`Search('List', SearchBox.Text, "Title", "Description")\` | Full-text search across columns |
| \`Collect(colLocal, 'List')\` | Cache list data locally for speed |
| \`Concurrent(fn1, fn2, fn3)\` | Run multiple data calls in parallel |

## Performance Tips

Power Apps + SharePoint has one critical concept you must understand: **delegation**.

### What Is Delegation?

When you write a \`Filter()\` or \`Search()\` formula, Power Apps tries to send the query to SharePoint (server-side). If it can't — because the formula isn't delegable — it downloads **only 500 items** (or 2000 with admin settings) and filters locally.

This means **your app silently returns incomplete data** if you exceed the delegation limit.

### Delegable vs Non-Delegable

| Delegable (Server-side) | Non-Delegable (Local only) |
|------------------------|---------------------------|
| \`Filter()\` with =, <>, <, >, StartsWith | \`Search()\` (partially delegable) |
| \`Sort()\` on indexed columns | \`in\` operator |
| \`LookUp()\` | \`IsBlank()\` inside Filter |
| \`StartsWith()\` | \`Len()\`, \`Left()\`, \`Mid()\` |

### How to Avoid Delegation Issues

1. **Index your SharePoint columns** — go to List Settings → Indexed Columns → add indexes on columns you filter by (Status, Priority, DueDate)
2. **Use \`StartsWith()\` instead of \`Search()\`** for delegable text searches
3. **Increase the data row limit** — Settings → General → Data row limit → set to 2000
4. **Use \`Collect()\` for small lists** (under 2000 items) — cache the entire list in a local collection on app start
5. **Use \`Concurrent()\`** to parallelize multiple data source calls on screen load

### App Load Performance

Add this to your **App.OnStart** for faster perceived performance:

\`\`\`
Concurrent(
    ClearCollect(colProjects, 'Project Tracker'),
    ClearCollect(colTeam, Office365Users.SearchUser({searchTerm: "", top: 100})),
    Set(varToday, Today())
);
\`\`\`

This loads all your data sources in parallel instead of sequentially, cutting load time significantly.

## My Recommendations

After building dozens of Power Apps for enterprise teams, here's what actually matters:

1. **Start from SharePoint, not from scratch.** The auto-generated three-screen app gives you 70% of what you need. Customize from there instead of building screen by screen
2. **Keep your list under 2000 items.** Above this, delegation issues become a real headache. For larger datasets, use Dataverse instead of SharePoint lists
3. **Use variables for shared state.** Store the current user (\`Set(varCurrentUser, User())\`) and frequently used values in global variables on App.OnStart
4. **Test with real data volumes.** An app that works with 10 items might break with 500 due to delegation. Always test with production-scale data
5. **Invest in the UI.** Default Power Apps look like enterprise software from 2005. Spend 20% of your time on visual polish — rounded corners, consistent spacing, and a color theme do wonders for adoption
6. **Use components for reusable elements.** Headers, navigation bars, and status badges should be components, not copy-pasted across screens
7. **Version your apps.** Power Apps has built-in versioning. Before every major change, publish a version so you can roll back if needed

Power Apps isn't trying to replace custom development — it's for the 80% of internal tools that don't justify a full dev cycle. For a SharePoint developer, it's the fastest way to put a polished UI on top of your list data without writing a single line of TypeScript.
`,
    date: '2026-03-01',
    displayDate: 'March 1, 2026',
    readTime: '10 min read',
    category: 'Power Platform',
    tags: ['power-apps', 'sharepoint', 'canvas-app', 'low-code', 'power-platform'],
  },
  {
    id: '6',
    slug: 'spfx-1-23-new-cli-replacing-yeoman-migration-guide',
    title: 'SPFx 1.23: The New CLI That Replaces Yeoman — What You Need to Know',
    excerpt:
      'Microsoft is replacing the Yeoman generator with a new open-source SPFx CLI in version 1.23. Here\'s what changes, how to migrate, and why this is the biggest SPFx tooling shift in years.',
    content: `
## The Biggest SPFx Tooling Change in Years

If you've been building SPFx solutions, you've typed \`yo @microsoft/sharepoint\` hundreds of times. That's about to change. **SPFx 1.23** (rolling out February–March 2026) introduces a brand-new, open-source CLI that replaces the Yeoman generator entirely.

This isn't just a cosmetic update — it's a fundamental shift in how SPFx projects are scaffolded, built, and maintained. Combined with the Gulp-to-Heft migration from SPFx 1.22, the entire developer toolchain is being modernized.

## What's Changing in SPFx 1.23

Here's the short version:

| What | Before (SPFx ≤ 1.22) | After (SPFx 1.23+) |
|------|----------------------|---------------------|
| Project scaffolding | Yeoman generator | New SPFx CLI |
| Build system | Gulp | Heft + Webpack |
| Templates | Closed-source, bundled | Open-source on GitHub |
| Custom templates | Not supported | Fully supported |
| CLI versioning | Tied to SPFx version | Decoupled — independent releases |

### The New SPFx CLI

The new CLI is a standalone tool, **decoupled from the SPFx release cycle**. This means:

- **Faster updates:** CLI improvements ship independently of SPFx versioning
- **Open-source templates:** All scaffolding templates are on GitHub — you can fork, modify, and contribute
- **Company-specific templates:** Organizations can create custom scaffolding baselines with pre-configured linting, testing frameworks, and folder structures
- **Community contributions:** Anyone can submit PRs to improve the default templates

### How to Use the New CLI

Install it globally (replaces \`yo @microsoft/sharepoint\`):

\`\`\`bash
npm install -g @microsoft/spfx-cli
\`\`\`

Scaffold a new project:

\`\`\`bash
spfx new webpart --name hello-world --framework react
\`\`\`

The command structure is more intuitive than Yeoman's interactive prompts. You can also run it non-interactively for CI/CD pipelines:

\`\`\`bash
spfx new webpart --name my-webpart --framework react --skip-install
\`\`\`

### Custom Company Templates

This is the feature enterprise developers have been asking for. You can now create your own template repository:

\`\`\`bash
spfx new webpart --template https://github.com/your-org/spfx-template
\`\`\`

Your template can include:
- Pre-configured ESLint rules
- Company-standard folder structure
- Built-in PnP JS setup
- Standard CI/CD files (GitHub Actions, Azure DevOps)
- Shared utility libraries

## The Build System: Gulp Is Gone

SPFx 1.22 already introduced the new build toolchain, and 1.23 makes it the default:

### Old Pipeline (Gulp-based)

\`\`\`bash
gulp serve        # Local development
gulp bundle --ship     # Bundle for production
gulp package-solution --ship  # Create .sppkg
\`\`\`

### New Pipeline (Heft-based)

\`\`\`bash
npm run serve     # Local development (uses Heft + Webpack)
npm run build     # Production build
npm run package   # Create .sppkg
\`\`\`

Under the hood, **Heft** (from the Rush Stack family) replaces Gulp as the task runner, and **Webpack** handles bundling directly. This brings several advantages:

- **Faster builds:** Heft parallelizes tasks better than Gulp's sequential pipeline
- **Better tree-shaking:** Direct Webpack integration means smaller bundle sizes
- **Modern tooling:** No more Gulp plugins that haven't been updated in years
- **Standard npm scripts:** \`npm run build\` just works — no global Gulp CLI needed

## Migration Guide: Yeoman to New CLI

If you have existing SPFx projects, here's what you need to do:

### For New Projects

Simply use the new CLI instead of Yeoman. No migration needed:

\`\`\`bash
# Old way (still works but deprecated)
yo @microsoft/sharepoint

# New way
spfx new webpart --name my-webpart
\`\`\`

### For Existing Projects

Existing projects built with Yeoman **will continue to work**. Microsoft isn't breaking backward compatibility. However, to get the benefits of the new build toolchain:

1. **Update SPFx version** in your \`package.json\` to 1.23
2. **Run the upgrade report:** Use the Microsoft 365 CLI to see exactly what needs to change:

\`\`\`bash
npx @pnp/cli-microsoft365 spfx project upgrade --output md
\`\`\`

3. **Follow the generated report** — it lists every file change, dependency update, and config migration needed
4. **Replace Gulp tasks** with npm scripts in \`package.json\`
5. **Test thoroughly** — run \`npm run serve\` and verify everything works in the local workbench

### Key Dependency Changes

\`\`\`json
{
  "devDependencies": {
    "@microsoft/sp-build-web": "1.23.0",
    "@rushstack/heft": "^0.67.0",
    "webpack": "^5.90.0"
  }
}
\`\`\`

Remove these deprecated packages:
- \`gulp\`
- \`@microsoft/sp-build-core-tasks\`
- \`@microsoft/sp-module-interfaces\`

## Other SPFx 1.23 Features

### Command Set Enhancements

Command Sets (toolbar buttons) for lists and libraries get new capabilities:

- **Command grouping:** Group related commands under a dropdown menu instead of cluttering the toolbar
- **Conditional visibility:** Show/hide commands based on item metadata, not just selection count
- **Panel-level overrides:** Replace the default side panel in Microsoft Lists with your own SPFx component

### Debugging Toolbar

The new server-side debugging toolbar (introduced in 1.22.2) is now stable:

- Debug SPFx solutions directly in live SharePoint pages
- View component props, state, and render timing
- No need to use the workbench for testing
- Toggle it on/off with a URL parameter: \`?debugManifestsFile=...\`

## What's Coming Next: SPFx 1.24

Looking ahead to May/June 2026:

- **Navigation customizers:** Override SharePoint navigation nodes with SPFx components — build fully custom nav experiences
- **Enhanced form customizers:** More control over list form rendering
- **AI-assisted development:** Integration with Copilot for generating SPFx components from natural language descriptions

## My Recommendations

After testing the SPFx 1.23 preview extensively, here's my advice:

1. **Start using the new CLI now** for all new projects. The old Yeoman generator still works, but it's deprecated and won't get new features
2. **Don't rush to migrate existing projects.** Wait until your next major feature release, then do the upgrade alongside other changes
3. **Create company templates** if you're building multiple SPFx solutions. The time investment pays off quickly when every project starts with your standard setup
4. **Embrace Heft.** The Gulp ecosystem for SPFx was always fragile — Heft is a significant improvement in reliability and performance
5. **Use the M365 CLI upgrade report.** Don't manually figure out what to change — let the tooling tell you exactly what's needed

The transition from Yeoman to the new CLI is the biggest SPFx tooling shift since SPFx was first released. But unlike some Microsoft migrations, this one is actually well-planned, backward-compatible, and genuinely improves the developer experience.
`,
    date: '2026-02-25',
    displayDate: 'February 25, 2026',
    readTime: '10 min read',
    category: 'SPFx',
    tags: ['spfx', 'cli', 'yeoman', 'migration', 'heft', 'webpack'],
  },
  {
    id: '5',
    slug: 'building-copilot-declarative-agents-teams-toolkit',
    title: 'Building Declarative Agents for Microsoft 365 Copilot with Teams Toolkit',
    excerpt:
      'A hands-on guide to creating your first Copilot declarative agent — from scaffolding with Teams Toolkit to defining capabilities, adding API plugins, and deploying to your tenant.',
    content: `
## What Are Declarative Agents?

Declarative agents are **custom extensions** for Microsoft 365 Copilot that let you tailor Copilot's behavior for specific scenarios — without writing complex bot code. Instead of building an entire conversational AI from scratch, you **declare** what the agent should do using a JSON manifest.

Think of it this way: Microsoft 365 Copilot is the engine, and declarative agents let you put a custom steering wheel on it. You control:

- **What knowledge** the agent can access (SharePoint sites, Graph connectors, specific files)
- **What tone** it uses (formal, friendly, technical)
- **What actions** it can perform via API plugins
- **What boundaries** it stays within

## Why Declarative Agents Over Custom Bots?

If you've built Teams bots before, you know the pain: Bot Framework SDK, OAuth flows, adaptive cards, deployment infrastructure. Declarative agents skip all of that:

| Feature | Custom Bot | Declarative Agent |
|---------|-----------|------------------|
| Code required | Hundreds of lines | Zero (JSON only) |
| Hosting | Your own server/Azure | Microsoft-hosted |
| Auth | Manual OAuth setup | Automatic SSO |
| AI model | BYO (OpenAI, etc.) | Microsoft 365 Copilot |
| Knowledge | Manual RAG pipeline | Point at SharePoint/Graph |
| Deployment | App registration + publish | Sideload or admin deploy |

For most enterprise scenarios — IT help desks, HR assistants, project knowledge bases — declarative agents are the right choice.

## Prerequisites

Before you start building, make sure you have:

- **Microsoft 365 Copilot license** (E3/E5 + Copilot add-on or Copilot Pro)
- **Teams Toolkit for VS Code** (v5.10 or later — install from Extensions marketplace)
- **Node.js 18+** and **npm**
- **Microsoft 365 developer tenant** (or your production tenant with sideloading enabled)
- **Teams desktop or web client** for testing

## Step 1: Scaffold the Project

Open VS Code, then use the Teams Toolkit to create your project:

1. Press **Ctrl+Shift+P** → type **Teams: Create a New App**
2. Select **Copilot Agent** → **Declarative Agent**
3. Choose **No plugin** (we'll add one later)
4. Name your project: \`hr-policy-agent\`

Teams Toolkit generates this structure:

\`\`\`
hr-policy-agent/
├── appPackage/
│   ├── declarativeAgent.json    ← Agent definition
│   ├── manifest.json            ← Teams app manifest
│   └── color.png / outline.png
├── env/
│   ├── .env.dev
│   └── .env.dev.user
├── teamsapp.yml                 ← Lifecycle config
└── package.json
\`\`\`

The magic lives in **declarativeAgent.json** — this is where you define everything.

## Step 2: Configure the Agent Manifest

Open \`appPackage/declarativeAgent.json\`. Here's a real-world configuration for an HR policy assistant:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/declarative-agent/v1.2/schema.json",
  "version": "v1.2",
  "name": "HR Policy Assistant",
  "description": "Answers questions about company HR policies including leave, benefits, onboarding, and workplace guidelines.",
  "instructions": "You are the HR Policy Assistant for our organization. Answer questions using ONLY the provided knowledge sources. Be professional but approachable. If you cannot find the answer in the knowledge sources, say: 'I don't have that information in our HR documentation. Please contact hr@company.com or visit the HR portal.' Never fabricate policies or provide legal advice. Always cite which document your answer comes from."
}
\`\`\`

### Key Fields Explained

- **name**: Shows up in the Copilot UI when users mention the agent
- **description**: Helps Copilot understand when to route questions to your agent
- **instructions**: The system prompt — this is the most important field. Be specific about tone, boundaries, and fallback behavior

## Step 3: Add Knowledge Sources

The real power of declarative agents is grounding them in your organization's data. Add a \`capabilities\` section:

\`\`\`json
{
  "capabilities": [
    {
      "name": "OneDriveAndSharePoint",
      "items_by_url": [
        {
          "url": "https://contoso.sharepoint.com/sites/HR/Policies"
        },
        {
          "url": "https://contoso.sharepoint.com/sites/HR/Employee-Handbook"
        }
      ]
    }
  ]
}
\`\`\`

The agent will **only** answer from these SharePoint locations. This is crucial for enterprise compliance — you control exactly what data the agent can reference.

### Supported Knowledge Sources

- **SharePoint sites and libraries** — most common for enterprise knowledge bases
- **Microsoft Graph connectors** — pull data from external systems (ServiceNow, Confluence, etc.)
- **Specific files and folders** — narrow scope to individual documents

## Step 4: Add an API Plugin (Optional but Powerful)

Want your agent to **do things**, not just answer questions? Add an API plugin. For example, let's add the ability to submit a leave request:

Create \`appPackage/apiPlugin.json\`:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/copilot/plugin/v2.2/schema.json",
  "schema_version": "v2.2",
  "name_for_human": "Leave Request",
  "description_for_human": "Submit and check leave requests",
  "namespace": "leaveRequests",
  "functions": [
    {
      "name": "submitLeaveRequest",
      "description": "Submit a new leave request for the current user",
      "capabilities": {
        "confirmation": {
          "type": "AdaptiveCard",
          "title": "Confirm Leave Request",
          "body": "Submit a leave request from {{startDate}} to {{endDate}}?"
        }
      }
    }
  ],
  "runtimes": [
    {
      "type": "OpenApi",
      "auth": { "type": "OAuthPluginVault" },
      "spec": { "url": "apiSpecification/openapi.json" }
    }
  ]
}
\`\`\`

Then reference it in your \`declarativeAgent.json\`:

\`\`\`json
{
  "actions": [
    {
      "id": "leaveRequestPlugin",
      "file": "apiPlugin.json"
    }
  ]
}
\`\`\`

Now your agent can answer HR questions **and** take actions — all within the Copilot chat interface.

## Step 5: Test Locally

Teams Toolkit makes testing straightforward:

1. Press **F5** in VS Code (or click the **Run** button in Teams Toolkit)
2. Teams Toolkit will:
   - Package your app manifest
   - Sideload the agent to your Teams client
   - Open Teams in your browser
3. Open **Microsoft 365 Copilot** in Teams
4. Click the **agent icon** (right side of chat) → select your agent
5. Ask a question: *"What is our parental leave policy?"*

### Debugging Tips

- **Agent doesn't appear?** Check that sideloading is enabled in your tenant admin center
- **Wrong answers?** Refine your \`instructions\` field — more specific prompts give better results
- **No knowledge grounding?** Verify the SharePoint URLs are accessible to the logged-in user
- **API plugin errors?** Check the OpenAPI spec matches your actual API endpoints

## Step 6: Deploy to Your Organization

When you're ready to go live:

### Option A: Admin Deployment (Recommended for Enterprise)

1. Run \`Teams: Zip Teams Metadata Package\` from the command palette
2. Go to the **Teams Admin Center** → **Manage Apps** → **Upload**
3. Upload the \`.zip\` package
4. Assign the app to specific users or the entire organization
5. Users will see the agent in their Copilot sidebar within 24 hours

### Option B: Developer Sideload

For testing or small teams, keep using the F5 sideload approach. The agent will only be available to developers who sideload it.

## Best Practices for Production Agents

After building dozens of these for enterprise clients, here are the patterns that work:

- **Be ruthlessly specific in instructions.** Vague instructions = vague answers. Tell the agent exactly what to do and what NOT to do
- **Scope knowledge narrowly.** Start with one SharePoint site, not the entire tenant. Expand based on user feedback
- **Add example questions.** Include 3-5 sample prompts in your agent's \`conversation_starters\` to guide users
- **Monitor and iterate.** Check Copilot analytics in the admin center to see what users ask. Update knowledge sources based on gaps
- **Version your manifests.** Treat \`declarativeAgent.json\` like code — commit to Git, review changes, tag releases
- **Test with real users.** What makes sense to you as a developer might confuse end users. Run a pilot with 10-20 people before org-wide rollout

## What's Coming Next

Microsoft's 2026 roadmap for declarative agents is exciting:

- **Multi-agent orchestration** — agents that delegate to other agents for complex workflows
- **Autonomous triggers** — agents that proactively notify users based on events (e.g., policy updates)
- **Enhanced Graph connector support** — connect to 50+ enterprise systems out of the box
- **Agent analytics dashboard** — ROI tracking, usage patterns, and knowledge gap analysis

Declarative agents represent the future of enterprise AI assistants. They're simple enough to build in an afternoon, yet powerful enough to handle real business scenarios. If you're already in the Microsoft 365 ecosystem, this is the fastest path from idea to deployed AI assistant.
`,
    date: '2026-02-24',
    displayDate: 'February 24, 2026',
    readTime: '11 min read',
    category: 'Microsoft 365',
    tags: ['copilot', 'declarative-agents', 'teams-toolkit', 'microsoft-365', 'ai-development'],
  },
  {
    id: '4',
    slug: 'sharepoint-agents-ai-powered-assistants',
    title: 'SharePoint Agents: Build AI-Powered Assistants for Your Intranet',
    excerpt:
      'Learn how to create AI-powered agents that use your SharePoint site content as a knowledge base — from setup in Copilot Studio to deploying in Teams chat.',
    content: `
## What Are SharePoint Agents?

SharePoint Agents are **AI-powered assistants** that live on your SharePoint sites and answer questions based on your site's content. Think of them as a custom ChatGPT trained exclusively on your organization's documents, pages, and list data.

Powered by **Microsoft 365 Copilot**, these agents can:
- Answer employee questions using site content as the knowledge base
- Search across pages, documents, and list items
- Be accessed directly in **Microsoft Teams** chat
- Be scoped to specific content so they only answer what they should

## Why SharePoint Agents Matter

Every organization has the same problem: employees can't find information. It's buried in SharePoint libraries, nested in folder structures, or locked inside PDFs nobody reads.

SharePoint Agents solve this by putting an **AI layer on top of your existing content**:

- **Reduce IT/HR support tickets** by 40-60% with self-service answers
- **Faster onboarding** — new hires ask the agent instead of bothering colleagues
- **Always up-to-date** — the agent reads live site content, not a static FAQ
- **Zero training data needed** — your SharePoint content IS the training data

## Prerequisites

Before you create your first agent, make sure you have:

- **Microsoft 365 Copilot license** (included in Copilot for Microsoft 365)
- **SharePoint Online** — agents are not available for on-premises
- **Site Owner or Site Collection Admin** permissions
- **Copilot Studio** access (included with Copilot license)
- **Well-structured content** — agents work best when your pages have clear headings and metadata

## Step-by-Step: Creating Your First Agent

### Step 1: Navigate to Your SharePoint Site

Go to the SharePoint site you want the agent to cover. This could be an HR portal, IT knowledge base, or project site.

### Step 2: Open Copilot Studio from Site Settings

Click the **Settings gear** → **Copilot Studio** → **Create an Agent**.

Alternatively, go directly to \`https://copilotstudio.microsoft.com\` and select **New Agent** → **SharePoint** as the knowledge source.

### Step 3: Configure Knowledge Sources

Add the content your agent should know about:

\`\`\`
Knowledge Sources:
├── SharePoint Site Pages     (auto-indexed)
├── Document Libraries        (PDFs, Word, Excel)
├── SharePoint Lists           (structured data)
└── Specific Folders           (scoped access)
\`\`\`

**Pro tip:** Start narrow. Pick one library or set of pages rather than the entire site. You can always expand later.

### Step 4: Write Agent Instructions

This is where you define the agent's personality and boundaries:

\`\`\`
You are the IT Help Desk assistant for Contoso.
Answer questions using only the content from the IT Knowledge Base site.
If you don't know the answer, say "I don't have that information.
Please contact helpdesk@contoso.com for further assistance."
Always be professional and concise.
Do not make up answers or reference external sources.
\`\`\`

### Step 5: Test in the Preview Pane

Copilot Studio provides a live preview where you can ask questions and see how the agent responds. Test with:
- Questions your employees actually ask
- Edge cases (topics NOT on the site)
- Different phrasings of the same question

### Step 6: Publish

Click **Publish** to make the agent live. Choose where it should be accessible:
- On the SharePoint site itself (embedded chat widget)
- In Microsoft Teams (as a bot in 1:1 or group chat)
- Both

## Customizing Agent Behavior

### Setting Topics

Topics let you define structured conversation flows for common scenarios:

- **Password Reset** → Guide through self-service portal steps
- **Leave Policy** → Pull from HR policy documents
- **Software Request** → Link to the request form

### Adjusting Tone

You control the agent's personality through the system instructions:

- **Formal:** "Respond in a professional, third-person tone"
- **Friendly:** "Be conversational and use first-person language"
- **Technical:** "Include technical details and reference document sections"

### Setting Boundaries

Critical for enterprise deployment:

- **Scope:** Only answer from approved knowledge sources
- **Fallback:** Always provide a human escalation path
- **Guardrails:** Prevent the agent from discussing topics outside its scope

## Using Your Agent in Teams

Once published, users can interact with the agent directly in Microsoft Teams:

1. Open **Teams** → **Chat** → **Search** for your agent name
2. Start a 1:1 conversation
3. Ask questions in natural language
4. The agent responds with answers sourced from your SharePoint content
5. Responses include **citations** linking back to the original SharePoint page or document

This is the killer feature — employees don't need to leave Teams to get answers from SharePoint.

## Best Practices

- **Content hygiene is everything.** Agents are only as good as the content they read. Clean up outdated pages, fix broken metadata, and use descriptive titles
- **Use metadata and columns.** Agents reason better over structured data. Add categories, departments, and dates to your lists and libraries
- **Respect permissions.** Agents honor SharePoint permissions — users only see answers from content they have access to
- **Start small, iterate fast.** Launch with one department (IT or HR), gather feedback, then expand
- **Monitor analytics.** Copilot Studio provides conversation analytics — track what users ask, what goes unanswered, and where the agent struggles
- **Update regularly.** As you add new content to SharePoint, the agent automatically picks it up — but review its responses quarterly

## What's Next

Microsoft's roadmap for SharePoint Agents in late 2026 includes:

- **Autonomous multi-step agents** that can perform actions (not just answer questions) — like submitting forms, creating list items, or triggering Power Automate flows
- **Cross-site agents** that span multiple SharePoint sites for organization-wide knowledge
- **Agent-to-agent orchestration** where specialized agents hand off to each other
- **Advanced analytics dashboards** showing ROI and knowledge gaps

SharePoint Agents represent a fundamental shift in how organizations interact with their intranet. The content you've been building in SharePoint for years is now the fuel for AI-powered experiences — and the best part is, you don't need to write a single line of code.
`,
    date: '2026-02-24',
    displayDate: 'February 24, 2026',
    readTime: '9 min read',
    category: 'SharePoint',
    tags: ['sharepoint', 'copilot', 'ai-agents', 'microsoft-365', 'copilot-studio'],
  },
  {
    id: '1',
    slug: 'building-spfx-hello-world-webpart',
    title: 'Building Your First SPFx Web Part: A Complete Hello World Guide',
    excerpt:
      'Step-by-step guide to creating your first SharePoint Framework (SPFx) web part — from scaffolding to deployment, with real screenshots from my tenant.',
    content: `
## Why SPFx?

SharePoint Framework (SPFx) is the recommended way to customize and extend SharePoint Online. Unlike legacy solutions (farm solutions, sandboxed solutions), SPFx runs client-side in the browser and works seamlessly with modern SharePoint pages.

## Prerequisites

Before we start, make sure you have:

- **Node.js** v18.x (LTS) — SPFx 1.19 requires this specific version
- **Gulp CLI** — \`npm install -g gulp-cli\`
- **Yeoman** — \`npm install -g yo\`
- **SPFx Generator** — \`npm install -g @microsoft/generator-sharepoint\`

## Scaffold the Project

Open your terminal and run:

\`\`\`bash
yo @microsoft/sharepoint
\`\`\`

When prompted:
1. **Solution name:** hello-world-webpart
2. **Target:** SharePoint Online only
3. **Framework:** React
4. **Web part name:** HelloWorld

## Project Structure

After scaffolding, your project looks like:

\`\`\`
hello-world-webpart/
├── src/
│   └── webparts/
│       └── helloWorld/
│           ├── HelloWorldWebPart.ts
│           ├── components/
│           │   ├── HelloWorld.tsx
│           │   └── HelloWorld.module.scss
│           └── loc/
├── config/
├── gulpfile.js
└── package.json
\`\`\`

## Key Files Explained

### HelloWorldWebPart.ts
This is the entry point. It extends \`BaseClientSideWebPart\` and defines the property pane configuration.

### HelloWorld.tsx
The React component that renders the UI. This is where most of your development happens.

## Run It Locally

\`\`\`bash
gulp serve
\`\`\`

This opens the SharePoint Workbench at \`https://localhost:4321/temp/workbench.html\`.

## Deploy to SharePoint

1. \`gulp bundle --ship\`
2. \`gulp package-solution --ship\`
3. Upload the \`.sppkg\` file to your App Catalog
4. Add the web part to a modern page

## Common Gotchas

- **Node version mismatch:** SPFx 1.19 needs Node 18. Use \`nvm\` to manage versions.
- **Certificate errors:** Run \`gulp trust-dev-cert\` before first \`gulp serve\`.
- **Property pane not updating:** Make sure to call \`this.render()\` in \`onPropertyPaneFieldChanged\`.

## Next Steps

In the next post, I'll cover how to add real SharePoint data using PnP JS and the Microsoft Graph API.
`,
    date: '2026-02-18',
    displayDate: 'February 18, 2026',
    readTime: '8 min read',
    category: 'SPFx',
    tags: ['spfx', 'webpart', 'react', 'sharepoint-online'],
  },
  {
    id: '2',
    slug: 'power-automate-sharepoint-approval-flow',
    title: 'Building a SharePoint Approval Flow with Power Automate',
    excerpt:
      'How I built a document approval workflow using Power Automate that sends Teams notifications and updates SharePoint list status — complete walkthrough.',
    content: `
## The Problem

My team needed a document approval process:
1. User uploads a document to a SharePoint library
2. Manager gets notified in Teams
3. Manager approves/rejects
4. SharePoint column updates automatically
5. User gets email notification

## The Solution: Power Automate

### Trigger: When a file is created

Use the **"When a file is created (properties only)"** trigger. Select your SharePoint site and document library.

### Step 1: Start an Approval

Add the **"Start and wait for an approval"** action:
- **Approval type:** Approve/Reject - First to respond
- **Title:** Document Approval: [File Name]
- **Assigned to:** manager@company.com

### Step 2: Check the Response

Add a **Condition** action:
- \`Outcome\` is equal to \`Approve\`

### Step 3: Update SharePoint

In the **Yes** branch, add **"Update file properties"**:
- Set the \`Status\` column to \`Approved\`

In the **No** branch:
- Set the \`Status\` column to \`Rejected\`

### Step 4: Send Notification

Add **"Send an email"** or **"Post message in Teams"** to notify the original uploader.

## Tips

- **Always add error handling:** Use \`Configure run after\` on critical steps
- **Use parallel branches** for Teams + Email notifications (faster execution)
- **Add a timeout** to the approval step (e.g., 7 days) so flows don't run forever

## Performance

This flow runs in under 30 seconds for the approval notification. The total cycle time depends on how fast the manager responds.
`,
    date: '2026-02-16',
    displayDate: 'February 16, 2026',
    readTime: '6 min read',
    category: 'Power Platform',
    tags: ['power-automate', 'sharepoint', 'approval', 'teams'],
  },
  {
    id: '3',
    slug: 'sharepoint-column-formatting-json',
    title: 'SharePoint Column Formatting: Beautiful List Views with JSON',
    excerpt:
      'Transform boring SharePoint lists into visual dashboards using JSON column formatting. Status badges, progress bars, and conditional icons — no code deployment needed.',
    content: `
## Why Column Formatting?

SharePoint column formatting lets you customize how columns look using JSON. No SPFx deployment, no app catalog — just paste JSON into the column settings.

## Example 1: Status Badge

Turn a plain text column into colored badges:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "div",
  "style": {
    "padding": "4px 12px",
    "border-radius": "16px",
    "display": "inline-block",
    "font-size": "12px",
    "font-weight": "600"
  },
  "attributes": {
    "class": {
      "operator": ":",
      "operands": [
        { "operator": "==", "operands": ["@currentField", "Active"] },
        "sp-css-backgroundColor-successBackground sp-css-color-SuccessText",
        {
          "operator": ":",
          "operands": [
            { "operator": "==", "operands": ["@currentField", "Pending"] },
            "sp-css-backgroundColor-warningBackground sp-css-color-WarningText",
            "sp-css-backgroundColor-errorBackground sp-css-color-ErrorText"
          ]
        }
      ]
    }
  },
  "txtContent": "@currentField"
}
\`\`\`

## Example 2: Progress Bar

Show a percentage column as a visual progress bar:

\`\`\`json
{
  "$schema": "https://developer.microsoft.com/json-schemas/sp/v2/column-formatting.schema.json",
  "elmType": "div",
  "style": {
    "width": "100%",
    "height": "20px",
    "background-color": "#e0e0e0",
    "border-radius": "10px",
    "overflow": "hidden"
  },
  "children": [
    {
      "elmType": "div",
      "style": {
        "width": "=toString(@currentField) + '%'",
        "height": "100%",
        "background-color": "=if(@currentField >= 80, '#4caf50', if(@currentField >= 50, '#ff9800', '#f44336'))",
        "border-radius": "10px",
        "transition": "width 0.3s"
      }
    }
  ]
}
\`\`\`

## How to Apply

1. Go to your SharePoint list
2. Click the column header → **Column settings** → **Format this column**
3. Switch to **Advanced mode**
4. Paste your JSON
5. Click **Save**

## Tips

- Always include the \`$schema\` line for IntelliSense in VS Code
- Test with the **Preview** button before saving
- Use \`@me\` to personalize views per user
- Check Microsoft's official samples: [Column Formatting Samples](https://github.com/SharePoint/sp-dev-list-formatting)
`,
    date: '2026-02-14',
    displayDate: 'February 14, 2026',
    readTime: '7 min read',
    category: 'SharePoint',
    tags: ['sharepoint', 'column-formatting', 'json', 'no-code'],
  },
]
