---
description: Run the COMPLETE SEO suite — audit, GSC analysis, rich results test, Bing setup, and GA4 setup — all in one command
---

# Full SEO Suite

One command to run **everything**: 79-checkpoint code audit, Google Search Console analysis, Rich Results validation, Bing Webmaster setup, and GA4 setup.

## How to Use
Say: `/full-seo https://your-site.com`

---

## Sprint 1: SEO Audit (79 Checkpoints)
Run the full `/seo-audit` workflow. See [seo-audit.md](./seo-audit.md) for the complete 79-checkpoint list across 12 categories:
- On-Page SEO, Technical SEO, Structured Data (JSON-LD)
- GEO, AEO, E-E-A-T
- International SEO, Social/OG Tags
- Content Quality, Performance, Security, AdSense

**Output:** Scorecard table with /10 rating per category + fixes applied.

---

## Sprint 2: Google Search Console Audit
Run the full `/gsc-audit` workflow. See [gsc-audit.md](./gsc-audit.md):
- Performance metrics (clicks, impressions, CTR, position)
- Top queries and top pages
- Indexing status (indexed vs not indexed)
- Sitemap submission/resubmission
- Manual URL inspection for top pages
- Core Web Vitals (real user data)
- Security & Manual Actions check

**Output:** GSC report with metrics table + screenshots.

---

## Sprint 3: Rich Results Validation
Run the full `/rich-results-test` workflow. See [rich-results-test.md](./rich-results-test.md):
- Identify all JSON-LD schemas in codebase
- Test homepage, blog post, tool page, about page via Google Rich Results Test
- Validate via Schema Markup Validator
- Fix any errors/warnings

**Output:** Schema validation table with pass/fail per page type.

---

## Sprint 4: Bing Webmaster Tools Setup
Run the full `/bing-setup` workflow. See [bing-setup.md](./bing-setup.md):
- Create Bing Webmaster account (or import from GSC)
- Verify domain
- Submit sitemap
- Configure crawl settings

**Output:** Bing dashboard screenshot + confirmation.

---

## Sprint 5: Google Analytics 4 Setup
Run the full `/ga4-setup` workflow. See [ga4-setup.md](./ga4-setup.md):
- Create GA4 property + data stream
- Add gtag.js or React component
- Configure custom events (tool_used, file_processed, download)
- AdSense compliance check
- Verify realtime tracking

**Output:** GA4 realtime screenshot + confirmation.

---

## Final Deliverable

After all 5 sprints, produce a **Master SEO Report**:

| Sprint | Status | Key Metric |
|--------|--------|------------|
| SEO Audit | ✅/⚠️ | Overall score /10 |
| GSC Audit | ✅/⚠️ | Indexed pages, impressions |
| Rich Results | ✅/⚠️ | Schemas validated |
| Bing Setup | ✅/⚠️ | Sitemap submitted |
| GA4 Setup | ✅/⚠️ | Tracking confirmed |

Plus a prioritized list of remaining action items.
