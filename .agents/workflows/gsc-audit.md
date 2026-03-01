---
description: Run a Google Search Console audit — indexing, performance, sitemap, and manual URL inspection
---

# Google Search Console Audit

Run this workflow to analyze a site's GSC data and fix indexing issues.

## Prerequisites
- The site must already be verified in Google Search Console
- The user must be logged into their Google account in the browser

## How to Use
Say: `/gsc-audit https://your-site.com`

---

## Phase 1: Access GSC

1. Open Google Search Console: `https://search.google.com/search-console?resource_id=https://<domain>/`
2. If prompted, select the correct property matching the domain

---

## Phase 2: Performance Analysis

1. Go to **Performance** (left sidebar)
2. Set date range to **Last 3 months**
3. Record these metrics:
   - Total clicks
   - Total impressions
   - Average CTR
   - Average position
4. Switch to **Queries** tab — list top 10 queries with clicks + impressions
5. Switch to **Pages** tab — list top 10 pages with clicks + impressions
6. Take screenshots of both tabs

---

## Phase 3: Indexing Status

1. Go to **Indexing** > **Pages** (left sidebar)
2. Record:
   - Number of indexed pages
   - Number of not-indexed pages
   - Any error reasons listed
3. Take a screenshot
4. If there are "Not indexed" pages, check the reasons:
   - "Discovered - currently not indexed" = Google knows about it but hasn't crawled
   - "Crawled - currently not indexed" = Google crawled but decided not to index
   - "Excluded by noindex tag" = intentional exclusion
   - "Duplicate without user-selected canonical" = possible issue

---

## Phase 4: Sitemap Check

1. Go to **Indexing** > **Sitemaps** (left sidebar)
2. Check if sitemap is submitted and its status
3. Compare "Discovered pages" count vs actual URLs in sitemap
4. If sitemap is stale or not submitted:
   - Enter `sitemap.xml` in the "Add a new sitemap" field
   - Click **SUBMIT**
5. Take a screenshot

---

## Phase 5: Manual URL Inspection (for top pages)

1. Go to **URL Inspection** (top bar)
2. Enter the homepage URL and check:
   - Is it indexed?
   - Mobile usability
   - Rich results detected?
3. If NOT indexed, click **Request Indexing**
4. Repeat for the top 5-10 most important pages/tools

---

## Phase 6: Core Web Vitals (Real User Data)

1. Go to **Experience** > **Core Web Vitals** (left sidebar)
2. Check if there's enough real-user data (needs traffic)
3. If data is available, record:
   - Mobile: Good / Needs Improvement / Poor URLs
   - Desktop: Good / Needs Improvement / Poor URLs
4. Take a screenshot

---

## Phase 7: Security & Manual Actions

1. Go to **Security & Manual Actions** > **Security Issues**
   - Should say "No issues detected"
2. Go to **Security & Manual Actions** > **Manual Actions**
   - Should say "No issues detected"
3. Report any issues found

---

## Phase 8: Report

Produce a summary table:

| Metric | Value | Assessment |
|--------|-------|------------|
| Total Clicks | ? | |
| Total Impressions | ? | |
| Average CTR | ? | |
| Average Position | ? | |
| Indexed Pages | ? / ? total | |
| Sitemap Status | ? | |
| CWV Status | ? | |
| Security Issues | ? | |
| Manual Actions | ? | |

Include top queries, top pages, and recommendations.
