---
title: "SharePoint Online CSP Enforcement: SPFx Developer Guide"
slug: sharepoint-online-csp-enforcement-spfx-developer-guide-2026
excerpt: "Fix SPFx web parts broken by Content Security Policy enforcement: resolve inline scripts, eval calls, and style violations with practical solutions."
date: "2026-04-03"
displayDate: "April 3, 2026"
readTime: "10 min read"
category: "SPFx"
image: "/images/blog/sharepoint-csp-enforcement-guide.png"
tags:
  - "SharePoint"
  - "CSP"
  - "SPFx"
  - "security"
  - "Content Security Policy"
---


## Your SPFx Web Part Just Stopped Working

You deploy a SharePoint Framework solution that has been running fine for months. Suddenly, users report a blank web part or broken functionality. You open the browser console and see this:

```
Refused to execute inline script because it violates the following
Content Security Policy directive: "script-src 'nonce-...'"
```

This is the result of Microsoft enforcing Content Security Policy headers on SharePoint Online pages. If you have SPFx solutions in production, you need to audit them now.

## What Is CSP and Why Microsoft Is Enforcing It

Content Security Policy is an HTTP response header that tells the browser which sources of content are trusted. It prevents cross-site scripting (XSS) attacks by blocking unauthorized inline scripts, eval calls, and resources loaded from untrusted origins.

SharePoint Online has historically been lenient with CSP. That changed as Microsoft moved to harden the platform against supply-chain attacks targeting custom solutions. CSP enforcement gives Microsoft a server-side control to limit what client-side code can do, even in tenant-deployed SPFx packages.

## Enforcement Rollout Timeline

| Date | Change | Impact |
|------|--------|--------|
| June 2025 | CSP headers added in report-only mode | No breakage; violations logged |
| October 2025 | `script-src` enforcement begins (targeted release tenants) | Inline scripts blocked |
| January 2026 | `script-src` and `style-src` enforcement reaches GA tenants | Inline scripts and styles blocked |
| March 2026 | Full CSP enforcement including `connect-src` restrictions | Unauthorized API calls blocked |
| June 2026 (planned) | Strict nonce-based policy for all tenants | Only nonce-tagged scripts execute |

If your tenant is on targeted release, you are already under full enforcement. GA tenants have been catching up since Q1 2026.

## What Breaks: Common SPFx Patterns That Violate CSP

### Inline Scripts via innerHTML

Setting `innerHTML` with `<script>` tags is the most common violation. CSP blocks any script element not present in the original server response.

```typescript
// BREAKS under CSP
this.domElement.innerHTML = `
  <div id="app"></div>
  <script>initWidget('app')</script>
`;
```

### eval() and new Function()

Both `eval()` and `new Function()` are blocked by `script-src` policies that do not include `'unsafe-eval'`. Some template libraries and older utility packages use these internally.

```typescript
// BREAKS under CSP
const result = eval('2 + 2');
const dynamicFn = new Function('a', 'b', 'return a + b');
```

### Inline Styles via element.style

Setting styles directly through JavaScript properties or `setAttribute('style', ...)` violates `style-src` when `'unsafe-inline'` is not allowed.

```typescript
// BREAKS under CSP
element.style.backgroundColor = '#0078d4';
element.setAttribute('style', 'color: red; font-size: 14px;');
```

### Dynamic Script Loading

Creating `<script>` elements and appending them to the DOM to load third-party libraries will fail unless the source domain is in the `script-src` allowlist.

```typescript
// BREAKS under CSP (unless cdn.example.com is allowlisted)
const script = document.createElement('script');
script.src = 'https://cdn.example.com/library.js';
document.head.appendChild(script);
```

### Third-Party CDN Resources

Loading fonts, images, or stylesheets from CDNs not on the CSP allowlist triggers violations for `font-src`, `img-src`, or `style-src` respectively.

## How to Detect CSP Violations

### Browser DevTools Console

Open DevTools (F12) on any SharePoint page where your web part runs. CSP violations appear as red errors in the Console tab. Each error message includes the directive that was violated and the blocked resource.

Filter console output with `Content Security Policy` to isolate violations from other noise.

### CSP Reporting Endpoints

Microsoft logs CSP violations internally, but you can also add client-side detection in development:

```typescript
document.addEventListener('securitypolicyviolation', (event) => {
  console.warn('CSP Violation:', {
    directive: event.violatedDirective,
    blockedURI: event.blockedURI,
    sourceFile: event.sourceFile,
    lineNumber: event.lineNumber,
  });
});
```

Add this listener early in your web part's `onInit()` method during development to catch every violation your component triggers.

## Fix Patterns: Before and After

### Replace innerHTML with DOM API

Instead of injecting HTML strings, build elements programmatically.

```typescript
// BEFORE (violates CSP)
this.domElement.innerHTML = `
  <div class="${styles.container}">
    <h2>${title}</h2>
    <script>initWidget()</script>
  </div>
`;

// AFTER (CSP-compliant)
const container = document.createElement('div');
container.className = styles.container;

const heading = document.createElement('h2');
heading.textContent = title;
container.appendChild(heading);

this.domElement.appendChild(container);

// Call the init function directly instead of via inline script
initWidget();
```

If you use React (the recommended SPFx rendering approach), you already avoid innerHTML in most cases. Audit any places where you use `dangerouslySetInnerHTML`.

### Replace eval with Safe Alternatives

```typescript
// BEFORE (violates CSP)
const value = eval(userExpression);

// AFTER (CSP-compliant) — use a purpose-built parser
import { evaluate } from 'mathjs';
const value = evaluate(userExpression);
```

For dynamic property access, use bracket notation instead of eval:

```typescript
// BEFORE
const val = eval(`obj.${propertyName}`);

// AFTER
const val = obj[propertyName];
```

### Move Inline Styles to CSS Modules

SPFx generates CSS modules by default. Use them.

```typescript
// BEFORE (violates CSP)
element.style.backgroundColor = isActive ? '#0078d4' : '#ffffff';

// AFTER (CSP-compliant) — toggle CSS classes
import styles from './MyWebPart.module.scss';

element.className = isActive ? styles.active : styles.inactive;
```

Define the styles in your `.module.scss` file:

```scss
.active {
  background-color: #0078d4;
}

.inactive {
  background-color: #ffffff;
}
```

### Use SPFx-Approved Script Loading

Instead of dynamically injecting `<script>` tags, use the SPFx module loader or dynamic imports.

```typescript
// BEFORE (violates CSP)
const script = document.createElement('script');
script.src = 'https://cdn.example.com/charting-lib.js';
document.head.appendChild(script);

// AFTER (CSP-compliant) — use SPFx externals config or dynamic import
// Option 1: Add to config/config.json externals
// Option 2: Dynamic import from a bundled module
const chartLib = await import(
  /* webpackChunkName: "charting" */ './charting-lib'
);
```

For libraries that must be loaded externally, declare them in your `config/config.json` under the `externals` key. SPFx handles the loading in a CSP-compatible way.

### Bundle Third-Party Dependencies

Stop loading libraries from public CDNs at runtime. Install them as npm dependencies and let webpack bundle them.

```bash
npm install chart.js
```

```typescript
// BEFORE (violates CSP — loads from external CDN)
// Loaded via <script> tag from cdnjs.cloudflare.com

// AFTER (CSP-compliant — bundled with your package)
import { Chart } from 'chart.js';
```

This increases your `.sppkg` size but eliminates the CDN dependency entirely. If bundle size is a concern, use webpack code splitting to lazy-load heavy modules. If you are migrating your build toolchain at the same time, see [SPFx Migration Guide: Gulp to Heft & Webpack](/blog/spfx-migrate-gulp-heft-webpack-2026) for the full webpack configuration.

## CSP Directives Reference

These are the directives Microsoft enforces on SharePoint Online pages as of March 2026:

| Directive | What It Controls | Allowed Sources |
|-----------|-----------------|-----------------|
| `script-src` | JavaScript execution | `'nonce-{value}'`, `'strict-dynamic'`, SharePoint CDN origins |
| `style-src` | CSS and stylesheets | `'nonce-{value}'`, SharePoint CDN origins |
| `img-src` | Images | `data:`, `blob:`, `https:` (broadly allowed) |
| `connect-src` | XHR, fetch, WebSocket | SharePoint origin, Graph API, tenant-specific endpoints |
| `font-src` | Web fonts | SharePoint CDN, `data:` |
| `frame-src` | Iframes | SharePoint origin, select Microsoft domains |
| `object-src` | Plugins (Flash, etc.) | `'none'` |

The nonce value changes on every page load. You cannot hardcode it. SPFx handles nonce injection for scripts and styles that go through its pipeline, which is why using SPFx's built-in mechanisms is the safest path.

## Testing Your Fixes

After updating your code, test systematically:

1. **Build with no warnings.** Run `gulp bundle --ship` (or `heft build` on SPFx 1.22+) and resolve any build errors.
2. **Deploy to a test site.** Use an app catalog site collection for isolated testing.
3. **Open DevTools before loading the page.** CSP violations only appear at execution time, so the console must be open before the web part renders.
4. **Filter for "Content Security Policy"** in the console. Zero violations means you are clean.
5. **Test with targeted release enabled** on your test tenant if your production tenant is still on standard release. This gives you the strictest policy.

For a baseline SPFx project setup to test against, walk through [Building Your First SPFx Hello World Web Part](/blog/building-spfx-hello-world-webpart) and confirm it runs without CSP errors before layering in your custom logic.

## Frequently Asked Questions

### Does CSP enforcement affect classic SharePoint pages?

No. CSP enforcement applies to modern SharePoint pages and the SPFx workbench. Classic pages are not receiving these headers. However, classic pages are on a deprecation path, so this is not a reason to avoid fixing your code.

### Can I add domains to the CSP allowlist for my tenant?

Not directly. Microsoft controls the CSP headers on SharePoint Online pages. You cannot modify them through tenant settings or PowerShell. The supported approach is to bundle your dependencies or use the SPFx externals configuration, which routes through the SharePoint CDN.

### Will CSS-in-JS libraries like styled-components work?

Most CSS-in-JS libraries inject `<style>` tags at runtime, which violates `style-src` without `'unsafe-inline'`. Some libraries support nonce-based injection. Check if your library accepts a `nonce` prop or configuration. If not, switch to CSS modules or `.scss` files that are processed at build time.

### My web part uses a third-party library that calls eval internally. What do I do?

Check if the library has a newer version that removed the eval dependency. Many popular libraries (Handlebars, Lodash templates) shipped CSP-safe builds after eval restrictions became common. If no safe version exists, you need to find an alternative library or fork and patch the eval call yourself.
