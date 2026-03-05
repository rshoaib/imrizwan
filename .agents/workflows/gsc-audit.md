---
description: Run a Google Search Console audit — indexing, performance, sitemap, and manual URL inspection
---

# Google Search Console Audit

<!--
PROGRESS INSTRUCTIONS: When executing this workflow, update the Task View status
at each phase using the format shown in the progress comments below.
Example: "📊 Phase 2/9: Collecting performance data..."
-->

Run this workflow to analyze a site's GSC data, find growth opportunities, and produce actionable recommendations.

## Prerequisites
- The site must already be verified in Google Search Console
- The user must be logged into their Google account in the browser

## How to Use
Say: `/gsc-audit https://your-site.com`

---

## Phase 1: Access GSC
<!-- progress: "🔑 Phase 1/9: Accessing Google Search Console..." -->

1. Open Google Search Console: `https://search.google.com/search-console?resource_id=https://<domain>/`
2. If prompted, select the correct property matching the domain

---

## Phase 2: Performance Data Collection
<!-- progress: "📊 Phase 2/9: Collecting performance data (clicks, impressions, queries)..." -->

1. Go to **Performance** (left sidebar)
2. Set date range to **Last 3 months**
3. Record these metrics:
   - Total clicks
   - Total impressions
   - Average CTR
   - Average position
4. Switch to **Queries** tab — list top 20 queries with clicks + impressions + CTR + position
5. Switch to **Pages** tab — list top 20 pages with clicks + impressions
6. Take screenshots of both tabs

---

## Phase 3: Indexing Status
<!-- progress: "📄 Phase 3/9: Checking indexing status & finding unindexed pages..." -->

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
<!-- progress: "🗺️ Phase 4/9: Verifying sitemap submission & page discovery..." -->

1. Go to **Indexing** > **Sitemaps** (left sidebar)
2. Check if sitemap is submitted and its status
3. Compare "Discovered pages" count vs actual URLs in sitemap
4. If sitemap is stale or not submitted:
   - Enter `sitemap.xml` in the "Add a new sitemap" field
   - Click **SUBMIT**
5. Take a screenshot

---

## Phase 5: Manual URL Inspection (for top pages)
<!-- progress: "🔎 Phase 5/9: Inspecting top pages & requesting indexing..." -->

1. Go to **URL Inspection** (top bar)
2. Enter the homepage URL and check:
   - Is it indexed?
   - Mobile usability
   - Rich results detected?
3. If NOT indexed, click **Request Indexing**
4. Repeat for the top 5-10 most important pages/tools

---

## Phase 6: Core Web Vitals (Real User Data)
<!-- progress: "⚡ Phase 6/9: Checking Core Web Vitals (mobile + desktop)..." -->

1. Go to **Experience** > **Core Web Vitals** (left sidebar)
2. Check if there's enough real-user data (needs traffic)
3. If data is available, record:
   - Mobile: Good / Needs Improvement / Poor URLs
   - Desktop: Good / Needs Improvement / Poor URLs
4. Take a screenshot

---

## Phase 7: Security & Manual Actions
<!-- progress: "🔒 Phase 7/9: Checking security issues & manual actions..." -->

1. Go to **Security & Manual Actions** > **Security Issues**
   - Should say "No issues detected"
2. Go to **Security & Manual Actions** > **Manual Actions**
   - Should say "No issues detected"
3. Report any issues found

---

## Phase 8: Deep Analysis (Actionable Insights)
<!-- progress: "🧠 Phase 8/9: Deep analysis — finding quick wins, CTR gaps, cannibalization..." -->

Using the data collected in Phases 2-7, perform the following analyses:

### 8a. Quick Wins — "Almost Ranking" Queries
Find queries where:
- **Position is 5–20** (bottom of page 1 or page 2)
- **Impressions > 100** (people are searching for this)

These are your **biggest opportunities** — a small content boost could push them to top 3.

**Action for each:** Identify the ranking page → improve its title, add more depth, add internal links, or create a dedicated page if one doesn't exist.

| Query | Position | Impressions | Clicks | CTR | Ranking Page | Recommended Action |
|-------|----------|-------------|--------|-----|-------------|-------------------|
| ... | ... | ... | ... | ... | ... | ... |

### 8b. CTR Optimization — High Impressions, Low CTR
Find pages where:
- **Impressions > 500**
- **CTR < 2%**

These pages **appear in search results but nobody clicks**. The title/description isn't compelling enough.

**Action for each:** Rewrite the meta title to be more engaging. Add numbers, power words, or brackets. Rewrite the meta description with a clear value prop.

| Page | Impressions | CTR | Current Title | Suggested New Title |
|------|-------------|-----|--------------|-------------------|
| ... | ... | ... | ... | ... |

### 8c. Content Gap Detection
Find queries where:
- You're getting impressions but **have no dedicated page**
- The query doesn't match any existing page title closely

**Action:** Create new content targeting these queries, or add a section to an existing page.

| Query | Impressions | Closest Existing Page | Action |
|-------|-------------|----------------------|--------|
| ... | ... | ... | Create new page / Add section |

### 8d. Cannibalization Check
Find cases where:
- **Multiple pages rank for the same query**
- This splits your authority and hurts both pages

**Action:** Consolidate content into one strong page, redirect the weaker one, or differentiate them with unique angles.

| Query | Page 1 | Page 2 | Action |
|-------|--------|--------|--------|
| ... | ... | ... | Merge / Differentiate / Redirect |

### 8e. Declining Queries
Compare last 28 days vs previous 28 days:
- Find queries where **clicks dropped > 30%**
- These need immediate attention — competitor may have overtaken you

**Action:** Update the content, refresh the date in the title, add new sections, or improve internal linking.

---

## Phase 9: Actionable Report
<!-- progress: "📝 Phase 9/9: Generating prioritized action report..." -->

Produce a **prioritized recommendation list** sorted by estimated impact:

### Summary Table
| Metric | Value | Assessment |
|--------|-------|------------|
| Total Clicks (3 months) | ? | 📈/📉 vs benchmark |
| Total Impressions | ? | |
| Average CTR | ? | Good (>3%) / Needs work (<2%) |
| Average Position | ? | |
| Indexed Pages | ? / ? total | |
| Sitemap Status | ? | |
| CWV Status | ? | |
| Security Issues | ? | |
| Manual Actions | ? | |

### Prioritized Actions (sorted by impact)

| Priority | Action | Expected Impact | Effort |
|----------|--------|----------------|--------|
| 🔴 P1 | [Highest impact action] | +X clicks/month | Low/Med/High |
| 🔴 P1 | ... | ... | ... |
| 🟡 P2 | ... | ... | ... |
| 🟢 P3 | ... | ... | ... |

### Quick Wins Summary
- **X queries** in positions 5-20 that could be pushed to top 3
- **X pages** with high impressions but low CTR (title/description rewrite needed)
- **X content gaps** found (new pages or sections to create)
- **X cannibalization issues** found (pages to merge or differentiate)
- **X declining queries** need content refresh
