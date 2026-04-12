# Monthly Content Audit Report — April 2026

**Site:** imrizwan.com
**Audit Date:** April 13, 2026
**Period:** Last 28 days (March 14 – April 10, 2026)
**Posts Audited:** 31

---

## 1. Executive Summary

**Content Health Score: 74/100**

This audit analyzed all 31 blog posts in `content/blog/` across four dimensions: outdated content, thin posts, SEO metadata quality, and internal linking. Google Search Console data was collected for the last 28 days to inform prioritization.

| Metric | Count |
|--------|-------|
| Total posts audited | 31 |
| Titles shortened (> 60 chars) | 3 |
| Excerpts expanded (< 120 chars) | 17 |
| Tags renamed (azure-ad → entra-id) | 1 |
| Thin posts flagged (< 800 words) | 6 |
| Azure AD body references (manual review) | 9 posts, 14 total mentions |
| Broken internal links | 20 |
| Orphan posts (0 inbound links) | 2 |

**GSC Headline Metrics (Last 28 Days):**

| Metric | Value |
|--------|-------|
| Total Clicks | 14 |
| Total Impressions | 2,660 |
| Average CTR | 0.5% |
| Average Position | 9.5 |
| Total indexed pages | 25 |
| Total not indexed | 13 |

---

## 2. GSC Performance Dashboard

### 2a. Indexing Status

| Status | Count |
|--------|-------|
| Indexed | 25 |
| Not Indexed | 13 |

**Top reasons for non-indexing:**

| Reason | Source | Validation | Pages |
|--------|--------|------------|-------|
| Crawled — currently not indexed | Google systems | Failed | 4 |
| Alternate page with proper canonical tag | Website | Started | 3 |
| Excluded by 'noindex' tag | Website | Not Started | 2 |
| Not found (404) | Website | Started | 2 |
| Redirect error | Website | Started | 1 |
| Soft 404 | Website | Started | 1 |

### 2b. Top 20 Queries by Impressions (Last 28 Days)

| Query | Clicks | Impressions | CTR | Position |
|-------|--------|-------------|-----|----------|
| pnp.powershell minimum powershell version requirement 2026 | 0 | 32 | 0% | 9.1 |
| power automate expressions | 0 | 27 | 0% | 45.8 |
| pnp.powershell latest version march 2026 | 0 | 25 | 0% | 4.8 |
| "if(condition, valueiftrue, valueiffalse)" "adaptive cards" | 0 | 22 | 0% | 1.6 |
| spfx 1.23 | 0 | 22 | 0% | 7.2 |
| pnp.powershell latest version 2026 | 0 | 18 | 0% | 6.9 |
| pnp.powershell current version 2026 | 0 | 16 | 0% | 7.4 |
| caml query | 0 | 13 | 0% | 50.3 |
| power automate outputs('actionname') expression documentation | 0 | 12 | 0% | 7.2 |
| pnp.powershell current version march 2026 | 0 | 10 | 0% | 7.9 |
| power automate outputs('stepname') expression documentation | 0 | 10 | 0% | 8.2 |
| sharepoint permissions matrix | 0 | 10 | 0% | 17.7 |
| power automate expressions list | 0 | 10 | 0% | 39.2 |
| graph api explorer | 0 | 10 | 0% | 41.0 |
| power automate function reference | 0 | 8 | 0% | 50.3 |
| power automate min function expression documentation | 0 | 7 | 0% | 7.7 |
| power automate expressions reference | 0 | 7 | 0% | 26.4 |
| "calendar.events.send" oauth scope | 0 | 6 | 0% | 11.3 |
| site script | 0 | 6 | 0% | 49.2 |
| sharepoint json generator | 1 | 5 | 20% | 12.0 |

**Total unique queries:** 76

### 2c. Top 20 Pages by Clicks (Last 28 Days)

| Page | Clicks | Impressions | CTR | Position |
|------|--------|-------------|-----|----------|
| /blog/spfx-migrate-gulp-heft-webpack-2026 | 4 | 173 | 2.3% | 7.0 |
| /tools/json-column-formatter | 4 | 371 | 0.8% | 14.2 |
| /blog/spfx-cli-migrate-yeoman-heft-2026 | 2 | 90 | 2.2% | 5.0 |
| /tools/site-script-generator | 2 | 25 | 8% | 32.5 |
| /blog/power-automate-expressions-cheat-sheet-2026 | 1 | 378 | 0.3% | 11.6 |
| /blog/sharepoint-online-csp-enforcement-spfx-developer-guide-2026 | 1 | 80 | 1.2% | 7.1 |
| /blog/pnp-powershell-sharepoint-online-scripts-admin-guide-2026 | 0 | 571 | 0% | 7.2 |
| /blog/building-copilot-declarative-agents-teams-toolkit | 0 | 407 | 0% | 6.3 |
| /tools/power-automate-expressions | 0 | 323 | 0% | 12.6 |
| /blog/microsoft-graph-api-authentication-guide | 0 | 231 | 0% | 14.0 |
| /blog/building-custom-copilots-sharepoint-copilot-studio | 0 | 121 | 0% | 9.8 |
| /blog/sharepoint-ai-copilot-governance-checklist-2026 | 0 | 56 | 0% | 11.3 |
| /blog/microsoft-graph-api-spfx-user-profiles-teams | 0 | 44 | 0% | 8.1 |
| /blog/sharepoint-provisioning-automation-guide-2026 | 0 | 36 | 0% | 7.0 |
| /blog/building-viva-connections-adaptive-card-extensions-spfx | 0 | 29 | 0% | 8.9 |
| /tools/permission-matrix | 0 | 28 | 0% | 9.1 |
| /tools/caml-query-builder | 0 | 28 | 0% | 44.6 |
| /tools/graph-api-explorer | 0 | 18 | 0% | 27.6 |
| /blog/sharepoint-column-formatting-guide | 0 | 8 | 0% | 5.8 |
| / (homepage) | 0 | 8 | 0% | 4.9 |

**Total pages with impressions:** 24

### 2d. CTR Gap Analysis

**Quick Wins (position 5–20, 100+ impressions, CTR < 3%) — rewrite titles/descriptions:**

| Page | Position | Impressions | CTR | Action |
|------|----------|-------------|-----|--------|
| /blog/pnp-powershell-sharepoint-online-scripts-admin-guide-2026 | 7.2 | 571 | 0% | **#1 priority** — highest impressions, 0 clicks |
| /blog/building-copilot-declarative-agents-teams-toolkit | 6.3 | 407 | 0% | Great position, needs compelling meta description |
| /blog/power-automate-expressions-cheat-sheet-2026 | 11.6 | 378 | 0.3% | Near page 1 — title/description needs click appeal |
| /tools/json-column-formatter | 14.2 | 371 | 0.8% | Tool page — add structured data, better meta |
| /tools/power-automate-expressions | 12.6 | 323 | 0% | Create supporting blog content |
| /blog/microsoft-graph-api-authentication-guide | 14.0 | 231 | 0% | Add year to title, improve specificity |
| /blog/building-custom-copilots-sharepoint-copilot-studio | 9.8 | 121 | 0% | Good position, weak click-through |

**Page 1 Pushes (position 8–20, high impressions):**

| Page | Position | Impressions | Opportunity |
|------|----------|-------------|-------------|
| /blog/power-automate-expressions-cheat-sheet-2026 | 11.6 | 378 | Content expansion + internal linking could push to top 5 |
| /tools/json-column-formatter | 14.2 | 371 | Add blog content around this tool |
| /tools/power-automate-expressions | 12.6 | 323 | Create supporting blog content |
| /blog/microsoft-graph-api-authentication-guide | 14.0 | 231 | Content freshness signal needed |

**Zero-Click Pages:**
7 blog posts and 4 tool pages have impressions but zero clicks. The PnP PowerShell scripts page (571 impressions, 0 clicks) and Copilot declarative agents post (407 impressions, 0 clicks) are the most critical — these need title and meta description rewrites.

### 2e. Query-to-Content Mapping

**Content Gaps (queries with impressions but no dedicated post):**
- "caml query" / "caml query builder" — 13+ impressions, position 50+ → only a tool page exists, no blog post
- "power automate min function" — 7+ impressions across variants, no dedicated content
- "oauth2allowimplicitflow" — 3 impressions, niche but addressable in an existing auth post
- "aadsts700016" — error code query, could be addressed in a troubleshooting section

**Potential Cannibalization:**
- `spfx-migrate-gulp-heft-webpack-2026` vs `spfx-cli-migrate-yeoman-heft-2026` vs `migrate-yeoman-to-new-spfx-cli` — three posts cover overlapping SPFx migration territory. Consider consolidating or differentiating titles/intents.
- `microsoft-copilot-governance-best-practices-2026` vs `sharepoint-ai-copilot-governance-checklist-2026` vs `enterprise-governance-sharepoint-ai-developer-checklist` — three governance posts that may compete for similar queries.

### 2f. Sitemap Status

| Field | Value |
|-------|-------|
| Sitemap URL | /sitemap.xml |
| Submitted | March 29, 2026 |
| Last Read | March 29, 2026 |
| Status | Success |
| Discovered Pages | 41 |

### 2g. Core Web Vitals

| Device | Status |
|--------|--------|
| Mobile | Not enough usage data (last 90 days) |
| Desktop | Not enough usage data (last 90 days) |

---

## 3. GSC Action Items (Prioritized)

### Priority 1: Quick Wins — CTR Fixes
1. **Rewrite title/excerpt for PnP PowerShell scripts post** — 571 impressions, 0 clicks, position 7.2
2. **Rewrite title/excerpt for Copilot declarative agents post** — 407 impressions, 0 clicks, position 6.3
3. **Rewrite title/excerpt for Power Automate expressions cheat sheet** — 378 impressions, 1 click, position 11.6
4. **Improve meta for Graph API authentication guide** — 231 impressions, 0 clicks

### Priority 2: Page 1 Pushes
5. Expand content on Power Automate expressions cheat sheet to improve ranking from position 11.6
6. Create supporting blog content for json-column-formatter tool (position 14.2, 371 impressions)
7. Create supporting blog content for power-automate-expressions tool (position 12.6, 323 impressions)

### Priority 3: Content Gaps
8. Write a dedicated "CAML Query in SharePoint" blog post (queries getting 13+ impressions)
9. Add Power Automate function reference content (multiple "min function", "expressions reference" queries)

### Priority 4: Cannibalization
10. Differentiate or consolidate the three SPFx migration posts
11. Differentiate or consolidate the three governance/Copilot posts

### Priority 5: Indexing
12. Investigate 4 pages "Crawled — currently not indexed" (validation failed)
13. Fix 2 "Not found (404)" pages
14. Investigate 1 redirect error

---

## 4. Auto-Fixes Applied

### Titles Shortened (over 60 characters)

| Filename | Old Title | New Title |
|----------|-----------|-----------|
| adaptive-cards-m365-developer-guide.md | Adaptive Cards for Microsoft 365: Complete Developer Guide (2026) (65 chars) | Adaptive Cards: Developer Guide (2026) (38 chars) |
| building-custom-copilots-sharepoint-copilot-studio.md | Train Microsoft Copilot Studio on SharePoint Document Libraries (63 chars) | Copilot Studio on SharePoint Documents (39 chars) |
| power-automate-document-approval.md | Power Automate Document Approval Workflow: Complete Guide (2026) (64 chars) | Power Automate: Approval Workflow (2026) (40 chars) |

### Excerpts Expanded (under 120 characters → 130–155 range)

| Filename | Old (chars) | New (chars) |
|----------|-------------|-------------|
| building-custom-copilots-sharepoint-copilot-studio.md | 119 | 136 |
| building-viva-connections-adaptive-card-extensions-spfx.md | 104 | 140 |
| copilot-studio-sharepoint-ai-assistants-guide-2026.md | 88 | 132 |
| enterprise-governance-sharepoint-ai-developer-checklist.md | 112 | 147 |
| microsoft-copilot-governance-best-practices-2026.md | 100 | 150 |
| pnp-powershell-sharepoint-online-scripts-admin-guide-2026.md | 98 | 143 |
| power-apps-canvas-app-sharepoint-complete-guide.md | 85 | 130 |
| power-automate-ai-builder-intelligent-document-processing.md | 82 | 148 |
| power-automate-expressions-cheat-sheet-2026.md | 117 | 148 |
| power-automate-html-table-styling-css.md | 116 | 156 |
| sharepoint-online-csp-enforcement-spfx-developer-guide-2026.md | 89 | 148 |
| sharepoint-online-permissions-complete-guide.md | 109 | 152 |
| sharepoint-provisioning-automation-guide-2026.md | 107 | 143 |
| spfx-application-customizer-header-footer-sharepoint-2026.md | 118 | 155 |
| spfx-migrate-gulp-heft-webpack-2026.md | 86 | 149 |

### Tag Renamed

| Filename | Old Tag | New Tag |
|----------|---------|---------|
| microsoft-graph-api-oauth2-guide.md | azure-ad | entra-id |

---

## 5. Critical Issues (Manual Review Needed)

### Outdated "Azure AD" Terminology in Body Text

These posts reference "Azure AD" or "Azure Active Directory" in body content. Microsoft officially renamed this to "Microsoft Entra ID" in 2023. Body text updates require careful review to maintain technical accuracy.

| Filename | Mentions | Priority |
|----------|----------|----------|
| microsoft-graph-api-authentication-guide.md | 4 | High |
| building-custom-copilots-sharepoint-copilot-studio.md | 2 | High |
| sharepoint-ai-copilot-governance-checklist-2026.md | 2 | High |
| sharepoint-online-permissions-complete-guide.md | 2 | Medium |
| building-copilot-declarative-agents-teams-toolkit.md | 1 | Medium |
| microsoft-graph-api-oauth2-guide.md | 1 | Medium |
| microsoft-graph-api-spfx-user-profiles-teams.md | 1 | Low |
| pnp-powershell-sharepoint-online-scripts-admin-guide-2026.md | 1 | Low |
| power-automate-document-approval.md | 1 | Low |

### Broken Internal Links (20 Total)

These internal links point to blog slugs that do not exist in `content/blog/`. They may reference planned/unpublished posts or renamed slugs.

| Source Post | Broken Link Target |
|-------------|--------------------|
| adaptive-cards-m365-developer-guide | viva-connections-ace-adaptive-card-extension |
| building-spfx-hello-world-webpart | spfx-teams-tabs-integration |
| copilot-studio-sharepoint-ai-assistants-guide-2026 | microsoft-graph-api-10-practical-examples-sharepoint-2026 |
| copilot-studio-sharepoint-ai-assistants-guide-2026 | power-automate-sharepoint-document-workflows-2026 |
| copilot-studio-sharepoint-ai-assistants-guide-2026 | spfx-web-part-crud-operations-complete-guide-2026 |
| copilot-studio-sharepoint-ai-assistants-guide-2026 | viva-connections-adaptive-card-extensions-build-guide-2026 |
| enterprise-governance-sharepoint-ai-developer-checklist | pnp-powershell-sharepoint-scripts |
| enterprise-governance-sharepoint-ai-developer-checklist | sharepoint-agents-copilot-studio |
| enterprise-governance-sharepoint-ai-developer-checklist | sharepoint-permissions-explained |
| microsoft-copilot-governance-best-practices-2026 | pnp-powershell-25-scripts-every-admin-needs |
| microsoft-copilot-governance-best-practices-2026 | sharepoint-permissions-explained-guide |
| microsoft-graph-api-authentication-guide | microsoft-graph-api-sharepoint-examples |
| microsoft-lists-json-formatting-complete-guide-2026 | microsoft-365-statistics-2026 |
| power-automate-html-table-styling-css | power-automate-sharepoint-document-workflows-2026 |
| sharepoint-embedded-developer-guide-2026 | microsoft-365-statistics-2026 |
| spfx-application-customizer-header-footer-sharepoint-2026 | sharepoint-framework-field-customizer-retirement |
| spfx-migrate-gulp-heft-webpack-2026 | microsoft-graph-api-10-practical-examples-sharepoint-2026 |
| spfx-migrate-gulp-heft-webpack-2026 | power-automate-sharepoint-document-workflows-2026 |
| spfx-migrate-gulp-heft-webpack-2026 | spfx-web-part-crud-operations-complete-guide-2026 |
| spfx-migrate-gulp-heft-webpack-2026 | viva-connections-adaptive-card-extensions-build-guide-2026 |

### Deprecated Tool References

Posts that mention Yeoman and Gulp do so in migration context (discussing moving away from these tools), so no changes needed. Verify migration instructions remain current.

| Filename | Tools Mentioned | Context |
|----------|----------------|---------|
| building-spfx-hello-world-webpart.md | Gulp, Yeoman | Notes these as deprecated |
| migrate-yeoman-to-new-spfx-cli.md | Yeoman, Gulp | Migration guide |
| spfx-cli-migrate-yeoman-heft-2026.md | Yeoman | Migration guide |
| spfx-migrate-gulp-heft-webpack-2026.md | Gulp | Migration guide |

---

## 6. SEO Improvements (Remaining)

### Titles Needing Manual Rewrite (GSC-Informed)
Posts with 0% CTR and high impressions need human-crafted title/description rewrites — these require judgment about click appeal and cannot be safely auto-fixed. See Section 3, Priority 1.

### Missing Year in Titles
Several evergreen/tutorial posts lack "2026" in title, which can improve CTR for year-qualified queries:
- sharepoint-column-formatting-guide.md
- microsoft-graph-api-spfx-user-profiles-teams.md
- power-apps-canvas-app-sharepoint-complete-guide.md

### Sparse Tags
No posts have fewer than 3 tags. All posts have 4–7 tags.

---

## 7. Thin Content (Under 800 Words)

| Filename | Word Count | GSC Impressions | Priority |
|----------|-----------|-----------------|----------|
| sharepoint-provisioning-automation-guide-2026.md | 517 | 36 | High |
| spfx-pnp-js-sharepoint-data.md | 607 | — | High |
| microsoft-graph-api-spfx-user-profiles-teams.md | 646 | 44 | High |
| power-automate-html-table-styling-css.md | 653 | — | Medium |
| power-automate-ai-builder-intelligent-document-processing.md | 755 | — | Medium |
| migrate-yeoman-to-new-spfx-cli.md | 761 | — | Low (overlaps with other migration posts) |

---

## 8. Internal Linking Opportunities

### Orphan Posts (Zero Inbound Links)

| Post | Suggested Link-From |
|------|-------------------|
| sharepoint-ai-copilot-governance-checklist-2026 | microsoft-copilot-governance-best-practices-2026, enterprise-governance-sharepoint-ai-developer-checklist |
| spfx-cli-migrate-yeoman-heft-2026 | building-spfx-hello-world-webpart, spfx-migrate-gulp-heft-webpack-2026 |

### Missing Cross-Links Between Related Topics

| Post A | Post B | Relationship |
|--------|--------|-------------|
| microsoft-graph-api-getting-started | microsoft-graph-api-spfx-user-profiles-teams | Graph API series |
| sharepoint-column-formatting-guide | sharepoint-online-permissions-complete-guide | SharePoint admin topics |
| power-automate-document-approval | power-automate-ai-builder-intelligent-document-processing | Document processing |
| building-copilot-declarative-agents-teams-toolkit | copilot-studio-sharepoint-ai-assistants-guide-2026 | Copilot development |

---

## 9. Per-Post Detail

| Filename | Title | Words | GSC Clicks | GSC Impr. | Issues | Auto-Fixed | Priority |
|----------|-------|-------|------------|-----------|--------|------------|----------|
| adaptive-cards-m365-developer-guide.md | Adaptive Cards: Developer Guide (2026) | 1,864 | — | — | title shortened, 1 broken link | Yes | Low |
| building-copilot-declarative-agents-teams-toolkit.md | Build Declarative Agents for M365 Copilot with Teams Toolkit | 1,642 | 0 | 407 | Azure AD (1), 0% CTR | No | **High** |
| building-custom-copilots-sharepoint-copilot-studio.md | Copilot Studio on SharePoint Documents | 2,169 | 0 | 121 | Azure AD (2), title shortened, excerpt expanded | Yes | Medium |
| building-spfx-hello-world-webpart.md | Build Your First SPFx Web Part: Hello World Guide (2026) | 993 | — | — | 1 broken link | No | Low |
| building-viva-connections-adaptive-card-extensions-spfx.md | Building Viva Connections ACEs | 925 | 0 | 29 | excerpt expanded | Yes | Low |
| copilot-studio-sharepoint-ai-assistants-guide-2026.md | Copilot Studio + SharePoint: Build 3 AI Assistants | 2,045 | — | — | excerpt expanded, 4 broken links | Yes | Medium |
| enterprise-governance-sharepoint-ai-developer-checklist.md | Enterprise Governance for SharePoint AI: Checklist | 1,351 | — | — | excerpt expanded, 3 broken links | Yes | Medium |
| microsoft-copilot-governance-best-practices-2026.md | Microsoft Copilot Governance: 8 Controls Every Admin Needs | 1,177 | — | — | excerpt expanded, 2 broken links | Yes | Low |
| microsoft-graph-api-authentication-guide.md | Microsoft Graph API Authentication Explained (2026) | 983 | 0 | 231 | Azure AD (4), 0% CTR | No | **High** |
| microsoft-graph-api-getting-started.md | Getting Started with Microsoft Graph API in 2026 | 1,470 | 0 | 6 | — | No | Low |
| microsoft-graph-api-oauth2-guide.md | Microsoft Graph API: OAuth 2.0 and App Permissions Guide | 849 | — | — | Azure AD (1), tag renamed | Yes | Low |
| microsoft-graph-api-spfx-user-profiles-teams.md | Fetch M365 User Profiles in SPFx using the Graph API | 646 | 0 | 44 | thin post, Azure AD (1) | No | Medium |
| microsoft-lists-json-formatting-complete-guide-2026.md | Microsoft Lists JSON Formatting: Complete Guide (2026) | 3,503 | — | — | 1 broken link | No | Low |
| migrate-yeoman-to-new-spfx-cli.md | Migrate from Yeoman to the New SPFx CLI | 761 | — | — | thin post, overlaps migration posts | No | Low |
| pnp-powershell-sharepoint-online-scripts-admin-guide-2026.md | PnP PowerShell Scripts for SharePoint Admins | 1,024 | 0 | 571 | Azure AD (1), 0% CTR on 571 impr., excerpt expanded | Yes | **Critical** |
| power-apps-canvas-app-sharepoint-complete-guide.md | Power Apps Canvas App with SharePoint: Practical Guide | 1,558 | — | — | excerpt expanded | Yes | Low |
| power-automate-ai-builder-intelligent-document-processing.md | Power Automate + AI Builder: Document Processing Guide | 755 | — | — | thin post, excerpt expanded | Yes | Medium |
| power-automate-document-approval.md | Power Automate: Approval Workflow (2026) | 1,505 | — | — | Azure AD (1), title shortened | Yes | Low |
| power-automate-expressions-cheat-sheet-2026.md | Power Automate Expressions Cheat Sheet: 50+ Functions | 1,268 | 1 | 378 | excerpt expanded, 0.3% CTR on 378 impr. | Yes | **High** |
| power-automate-html-table-styling-css.md | Power Automate: How to Style HTML Tables with CSS | 653 | — | — | thin post, excerpt expanded, 1 broken link | Yes | Medium |
| sharepoint-ai-copilot-governance-checklist-2026.md | M365 Copilot Governance Checklist for SharePoint Admins | 960 | 0 | 56 | Azure AD (2), orphan post | No | Medium |
| sharepoint-column-formatting-guide.md | SharePoint Column Formatting: A Practical JSON Guide (2026) | 869 | 0 | 8 | — | No | Low |
| sharepoint-embedded-developer-guide-2026.md | SharePoint Embedded: Build Document Apps on Microsoft 365 | 1,978 | — | — | 1 broken link | No | Low |
| sharepoint-online-csp-enforcement-spfx-developer-guide-2026.md | SharePoint Online CSP Enforcement: SPFx Developer Guide | 1,158 | 1 | 80 | excerpt expanded | Yes | Low |
| sharepoint-online-permissions-complete-guide.md | SharePoint Online Permissions: Security Guide | 1,719 | — | — | Azure AD (2), excerpt expanded | Yes | Medium |
| sharepoint-provisioning-automation-guide-2026.md | Modern SharePoint Provisioning & Automation Guide | 517 | 0 | 36 | thin post (517 words), excerpt expanded | Yes | **High** |
| spfx-application-customizer-header-footer-sharepoint-2026.md | SPFx Application Customizer: Build Global Headers & Footers | 2,354 | — | — | excerpt expanded, 1 broken link | Yes | Low |
| spfx-cli-migrate-yeoman-heft-2026.md | Migrating from Yeoman to the New SPFx CLI in 2026 | 1,369 | 2 | 90 | orphan (0 inbound links) | No | Medium |
| spfx-fluent-ui-v9-web-parts-migration-guide-2026.md | SPFx and Fluent UI v9: Modern Web Parts with React | 1,231 | — | — | — | No | Low |
| spfx-migrate-gulp-heft-webpack-2026.md | Migrate SPFx from Gulp to Heft & Webpack | 1,758 | 4 | 173 | excerpt expanded, 4 broken links | Yes | Medium |
| spfx-pnp-js-sharepoint-data.md | PnP JS in SPFx: Read and Write SharePoint Data (2026) | 607 | — | — | thin post (607 words) | No | **High** |

---

*Report generated automatically on April 13, 2026. Next audit scheduled for May 2026.*
