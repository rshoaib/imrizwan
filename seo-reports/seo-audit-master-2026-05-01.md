# SEO Audit Master Dashboard — May 1, 2026

> **Audit Date:** 2026-05-01
> **Sites Audited:** 9
> **Method:** Code inspection, robots.txt/sitemap analysis, PageSpeed Insights API
> **Note:** PageSpeed Insights API returned 429 (quota exceeded) for most sites. CWV scores are from code-level analysis except tinypdftools.com which returned live data.

---

## Portfolio Health Overview

| # | Site | Score | Grade | Critical | Warnings | Framework | Pages |
|---|------|-------|-------|----------|----------|-----------|-------|
| 1 | **imrizwan.com** | **82** | B+ | 3 | 4 | Hugo + Next.js | 38 blog |
| 2 | **tinypdftools.com** | **82** | B+ | 3 | 7 | React SPA | 73 (17 tools + 50 blog) |
| 3 | **dailysmartcalc.com** | **78** | B | 1 | 5 | Next.js SSG | 438 (39 calc + 356 pSEO) |
| 4 | **buildwithriz.com** | **74** | B- | 4 | 7 | Next.js | 30 (22 blog + 8 pages) |
| 5 | **onlineimageshrinker.com** | **74** | B- | 5 | 8 | Next.js | 243 (tools + blog) |
| 6 | **mycalcfinance.com** | **72** | C+ | 4 | 5 | Next.js SSG | 195 (22 calc + 63 blog) |
| 7 | **certquiz.com** | **72** | C+ | 3 | 5 | Next.js | 17 (10 blog + 7 pages) |
| 8 | **orderviachat.com** | **62** | C- | 4 | 7 | Next.js + Supabase | 44 (38 blog + 6 pages) |
| 9 | **legalpolicygen.com** | **62** | C- | 3 | 8 | Next.js | 156 (60 industry + 47 blog) |

**Portfolio Average: 73/100 (C+)**

---

## Score Breakdown by Category

| Site | Technical | On-Page | Content | Structured Data | Performance |
|------|-----------|---------|---------|-----------------|-------------|
| imrizwan.com | 90 | 80 | 85 | 90 | 65* |
| tinypdftools.com | 85 | 85 | 90 | 80 | 59 |
| dailysmartcalc.com | 85 | 75 | 80 | 85 | 65* |
| buildwithriz.com | 75 | 70 | 80 | 75 | 65* |
| onlineimageshrinker.com | 75 | 70 | 60 | 65 | 55* |
| mycalcfinance.com | 65 | 65 | 75 | 80 | 70* |
| certquiz.com | 60 | 70 | 75 | 80 | 65* |
| orderviachat.com | 55 | 65 | 70 | 75 | 50* |
| legalpolicygen.com | 55 | 55 | 70 | 70 | 65* |

*\* Estimated from code analysis (PageSpeed API quota exceeded)*

---

## Top 3 Actions Per Site

### 1. imrizwan.com (82/100)
1. **Fix `dateModified` in JSON-LD** — Currently always equals `datePublished`, killing freshness signals for updated posts. Fix in `app/blog/[slug]/page.tsx` line 67.
2. **Shorten 2 over-length titles** — Batch requests post (84 chars) and throttling post (86 chars) get truncated in SERPs.
3. **Resolve 3 keyword cannibalization clusters** — SPFx migration (3 posts), Copilot governance (3 posts), Graph authentication (3 posts).

### 2. tinypdftools.com (82/100)
1. **Fix pdftoolkit.com redirect** — Currently redirects to radpdf.com (competitor!) instead of tinypdftools.com. All historical link equity is lost.
2. **Add OG images across all 73 pages** — Social shares show blank previews everywhere.
3. **Remove hardcoded fake AggregateRating** — 4.8/5 from 1247 reviews in JSON-LD risks Google manual action.

### 3. dailysmartcalc.com (78/100)
1. **Add metadata to 4 static pages** — About, Contact, Privacy, Terms inherit homepage title/description.
2. **Fix brand inconsistency** — OG says "SmartCalc" but JSON-LD says "DailySmartCalc".
3. **Consolidate 5 cannibalization clusters** — BMI (4 pages), FIRE (4), Debt Payoff (3), Mortgage (3), Auto Loan (3).

### 4. buildwithriz.com (74/100)
1. **Fix 9 broken internal links** — Blog posts link to slugs that don't exist (404s). Wastes crawl budget.
2. **Add missing blog post to sitemap** — `invoice-vs-receipt-difference` exists but isn't in sitemap.
3. **Move homepage content to server component** — Entire homepage is `'use client'`, delaying indexing of marketing content.

### 5. onlineimageshrinker.com (74/100)
1. **Consolidate 12 cannibalized blog posts** — 5 clusters (background removal, transparent images, face blur, AI upscaler, OCR). Pick one winner per topic, 301-redirect the rest.
2. **Expand 10+ thin posts** — Several under 250 words (some as low as 144 words).
3. **Enable Next.js image optimization** — `images.unoptimized: true` in next.config.mjs disables all optimization.

### 6. mycalcfinance.com (72/100)
1. **Fix trailing slash mismatch** — `trailingSlash: true` in config but 195 sitemap URLs and canonicals lack trailing slashes. Causes redirect chains.
2. **Create OG image** — `layout.jsx` references `/og-image.png` but file doesn't exist (404).
3. **Add meta titles/descriptions to 55 of 63 blog posts** — Currently falling back to truncated editorial titles.

### 7. certquiz.com (72/100)
1. **Add metadata to upload page** — The primary conversion page (free VCE player) has zero SEO metadata.
2. **Remove /upload from robots.txt Disallow** — The key page is blocked from crawling.
3. **Fix domain resolution** — `certquiz.com` doesn't resolve; site is at `www.getcertquiz.com`. Configure proper 301 redirect.

### 8. orderviachat.com (62/100)
1. **Fix canonical inheritance bug** — Root layout sets `canonical: 'https://orderviachat.com'` which /blog, /terms, /refund inherit. Each page needs its own canonical.
2. **Add metadata to Terms and Refund pages** — Currently have wrong title, no description, wrong canonical.
3. **Switch from `force-dynamic` to ISR** — Homepage and 38 blog pages re-render on every request. Use `revalidate` for caching.

### 9. legalpolicygen.com (62/100)
1. **Remove client-side `<SEO>` component** — Migrate to server-side `metadata`/`generateMetadata` exports. This single change fixes 5 issues: duplicate titles, missing canonical, invisible hreflang, missing OG tags.
2. **Expand 33 meta descriptions** — Currently under 70 characters (Google recommends 120-160).
3. **Deduplicate /tos-generator and /terms-of-service-generator** — Same content, different URLs.

---

## Cross-Site Patterns (Systemic Issues)

| Issue | Affected Sites | Priority |
|-------|---------------|----------|
| **Keyword cannibalization** | imrizwan, dailysmartcalc, onlineimageshrinker, mycalcfinance, certquiz | P0 |
| **Missing OG images** | tinypdftools, buildwithriz, onlineimageshrinker, certquiz (partial) | P1 |
| **Sitemap lastmod = build date** | dailysmartcalc, onlineimageshrinker | P1 |
| **Static pages missing metadata** | dailysmartcalc, orderviachat, certquiz, legalpolicygen | P1 |
| **Client-side rendering of SEO elements** | buildwithriz (homepage), legalpolicygen (SEO component), certquiz (upload) | P0 |
| **Canonical tag issues** | mycalcfinance (trailing slash), orderviachat (inheritance), legalpolicygen (missing) | P0 |
| **Thin content** | onlineimageshrinker (10+ posts), mycalcfinance (6 posts), certquiz (1 post) | P2 |
| **Missing dateModified in JSON-LD** | imrizwan, certquiz | P1 |
| **Force-dynamic on cacheable pages** | orderviachat | P0 |

---

## Recommended Fix Priority (All Sites)

### This Week (P0 — Critical SEO Impact)
1. **legalpolicygen.com** — Remove `<SEO>` client component, migrate to server metadata (fixes 5 issues)
2. **orderviachat.com** — Fix canonical inheritance in root layout.tsx
3. **certquiz.com** — Remove /upload from robots.txt Disallow + add metadata
4. **tinypdftools.com** — Redirect pdftoolkit.com to tinypdftools.com (not radpdf.com)
5. **mycalcfinance.com** — Fix trailing slash mismatch in sitemap + canonicals
6. **buildwithriz.com** — Fix 9 broken internal links

### Next Week (P1 — High Impact)
7. **imrizwan.com** — Fix dateModified in JSON-LD schema
8. **onlineimageshrinker.com** — Consolidate 5 cannibalization clusters with 301 redirects
9. **dailysmartcalc.com** — Add metadata to 4 static pages
10. **All sites** — Add proper OG images where missing
11. **mycalcfinance.com** — Add meta titles/descriptions to 55 blog posts

### Next Month (P2 — Optimization)
12. **onlineimageshrinker.com** — Enable Next.js image optimization + expand thin content
13. **tinypdftools.com** — Remove fake AggregateRating, reduce JS bundles
14. **orderviachat.com** — Switch from force-dynamic to ISR
15. **buildwithriz.com** — Move homepage to server component

---

## Individual Report Locations

| Site | Report Path |
|------|------------|
| imrizwan.com | `C:\Projects\imrizwan\seo-reports\seo-audit-2026-05-01.md` |
| buildwithriz.com | `C:\Projects\buildwithriz\seo-reports\seo-audit-2026-05-01.md` |
| certquiz.com | `C:\Projects\certquiz\seo-reports\seo-audit-2026-05-01.md` |
| dailysmartcalc.com | `C:\Projects\dailysmartcalc-next\seo-reports\seo-audit-2026-05-01.md` |
| legalpolicygen.com | `C:\Projects\legalpolicygen\seo-reports\seo-audit-2026-05-01.md` |
| mycalcfinance.com | `C:\Projects\mycalcfinance\seo-reports\seo-audit-2026-05-01.md` |
| onlineimageshrinker.com | `C:\Projects\onlineimageshrinker\seo-reports\seo-audit-2026-05-01.md` |
| orderviachat.com | `C:\Projects\orderviachat\seo-reports\seo-audit-2026-05-01.md` |
| tinypdftools.com | `C:\Projects\pdftoolkit\seo-reports\seo-audit-2026-05-01.md` |

---

*Generated by Claude Code SEO Auditor — 2026-05-01*
