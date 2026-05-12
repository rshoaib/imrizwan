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

## What Breaks: Common SPFx Patterns That Violate CSP

### Inline Scripts via innerHTML

```typescript
// BREAKS under CSP
this.domElement.innerHTML = `
  <div id="app"></div>
  <script>initWidget('app')</script>
`;
```

### eval() and new Function()

```typescript
// BREAKS under CSP
const result = eval('2 + 2');
const dynamicFn = new Function('a', 'b', 'return a + b');
```

### Inline Styles via element.style

```typescript
// BREAKS under CSP
element.style.backgroundColor = '#0078d4';
element.setAttribute('style', 'color: red; font-size: 14px;');
```

### Dynamic Script Loading

```typescript
// BREAKS under CSP (unless cdn.example.com is allowlisted)
const script = document.createElement('script');
script.src = 'https://cdn.example.com/library.js';
document.head.appendChild(script);
```

## How to Detect CSP Violations

### Browser DevTools Console

Open DevTools (F12) on any SharePoint page where your web part runs. CSP violations appear as red errors in the Console tab. Filter console output with `Content Security Policy` to isolate violations.

### CSP Reporting Endpoints

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

## Fix Patterns: Before and After

### Replace innerHTML with DOM API

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
initWidget();
```

### Replace eval with Safe Alternatives

```typescript
// BEFORE (violates CSP)
const value = eval(userExpression);

// AFTER (CSP-compliant)
import { evaluate } from 'mathjs';
const value = evaluate(userExpression);
```

### Move Inline Styles to CSS Modules

```typescript
// BEFORE (violates CSP)
element.style.backgroundColor = isActive ? '#0078d4' : '#ffffff';

// AFTER (CSP-compliant)
import styles from './MyWebPart.module.scss';
element.className = isActive ? styles.active : styles.inactive;
```

### Use SPFx-Approved Script Loading

```typescript
// BEFORE (violates CSP)
const script = document.createElement('script');
script.src = 'https://cdn.example.com/charting-lib.js';
document.head.appendChild(script);

// AFTER (CSP-compliant)
const chartLib = await import(
  /* webpackChunkName: "charting" */ './charting-lib'
);
```

### Bundle Third-Party Dependencies

```bash
npm install chart.js
```

```typescript
// AFTER (CSP-compliant — bundled with your package)
import { Chart } from 'chart.js';
```

## CSP Directives Reference

| Directive | What It Controls | Allowed Sources |
|-----------|-----------------|------------------|
| `script-src` | JavaScript execution | `'nonce-{value}'`, `'strict-dynamic'`, SharePoint CDN origins |
| `style-src` | CSS and stylesheets | `'nonce-{value}'`, SharePoint CDN origins |
| `img-src` | Images | `data:`, `blob:`, `https:` (broadly allowed) |
| `connect-src` | XHR, fetch, WebSocket | SharePoint origin, Graph API, tenant-specific endpoints |
| `font-src` | Web fonts | SharePoint CDN, `data:` |
| `frame-src` | Iframes | SharePoint origin, select Microsoft domains |
| `object-src` | Plugins (Flash, etc.) | `'none'` |

## Testing Your Fixes

1. **Build with no warnings.** Run `heft build` (SPFx 1.22+) and resolve any build errors.
2. **Deploy to a test site.** Use an app catalog site collection for isolated testing.
3. **Open DevTools before loading the page.** CSP violations only appear at execution time.
4. **Filter for "Content Security Policy"** in the console. Zero violations means you are clean.
5. **Test with targeted release enabled** on your test tenant for the strictest policy.

## Frequently Asked Questions

### Does CSP enforcement affect classic SharePoint pages?

No. CSP enforcement applies to modern SharePoint pages and the SPFx workbench. Classic pages are not receiving these headers.

### Can I add domains to the CSP allowlist for my tenant?

Not directly. Microsoft controls the CSP headers on SharePoint Online pages. The supported approach is to bundle your dependencies or use the SPFx externals configuration.

### Will CSS-in-JS libraries like styled-components work?

Most CSS-in-JS libraries inject `<style>` tags at runtime, which violates `style-src` without `'unsafe-inline'`. Some libraries support nonce-based injection. If not, switch to CSS modules or `.scss` files processed at build time.

### My web part uses a third-party library that calls eval internally. What do I do?

Check if the library has a newer version that removed the eval dependency. Many popular libraries (Handlebars, Lodash templates) shipped CSP-safe builds after eval restrictions became common.
