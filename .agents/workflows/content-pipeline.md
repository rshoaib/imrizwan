---
description: Comprehensive content pipeline for all sites using Google Ultra subscription
---

# Content Pipeline Workflow

<!-- 
PROGRESS INSTRUCTIONS: When executing this workflow, update the Task View status 
at each phase using the format shown in the progress comments below.
Example: "✍️ Phase 3/7: Writing article draft..."
-->

## 🎯 Model Selection Matrix

| Task Type | Model | Why |
|-----------|-------|-----|
| UI/UX design, CSS, layouts | **Gemini 3.1 Pro** | Visual-first reasoning |
| SEO keywords, meta tags, schema | **Gemini 3.1 Pro** | Web search + content |
| Blog posts, marketing copy | **Gemini 3.1 Pro** | Content generation |
| Image generation, assets | **Gemini 3.1 Pro** | Image capabilities |
| Web research, market analysis | **Gemini 3.1 Pro** | Live web access |
| Bug fixing, debugging | **Claude Opus 4.5** | Deep code tracing |
| Complex logic, algorithms | **Claude Opus 4.5** | Reasoning strength |
| Multi-file refactoring | **Claude Opus 4.5** | Large context |
| Database schema, queries | **Claude Opus 4.5** | Precision |
| Security audits, RLS | **Claude Opus 4.5** | Critical analysis |
| Unit/integration tests | **Claude Opus 4.5** | Edge case coverage |

---

## 📋 Sites Portfolio

| # | Site | Stack | Purpose | Revenue Model |
|---|------|-------|---------|---------------|
| 1 | **orderviachat.com** | Next.js + Supabase | WhatsApp ordering SaaS | SaaS subscriptions |
| 2 | **dailysmartcalc.com** | Static/Next.js | Calculator tools | AdSense |
| 3 | **onlineimageshrinker.com** | Static/Next.js | Image compression | AdSense |
| 4 | **legalpolicygen.com** | Static/Next.js | Legal policy generator | AdSense |
| 5 | **mycalcfinance.com** | Static/Next.js | Finance calculators | AdSense |
| 6 | **imrizwan.com** | Next.js | Developer blog | Portfolio | AdSense |
| 7 | **azanapp** | React Native (Expo) | Prayer times app | Free/Ads |

---

## 📁 Context Files (READ FIRST!)

Before writing ANY content, read the context files for the target site:

| File | Purpose | Location |
|------|---------|----------|
| **Brand Voice** | Tone, writing rules, formatting standards | `.agents/context/brand-voice.md` |
| **Internal Links** | All tool URLs + cross-linking rules | `.agents/context/internal-links.md` |
| **Target Keywords** | Keyword clusters, priorities, content calendar | `.agents/context/target-keywords.md` |
| **Site Context** | Combined brand/links/keywords (non-OIS sites) | `.agents/context/site-context.md` |

> **Rule:** Always read the context files before writing. Use target keywords to identify the best topic.

---

## 🔄 Content Pipeline Phases (7 Phases)

### Phase 1: Research & Plan (Gemini 3.1 Pro)
<!-- progress: "🔍 Phase 1/7: Researching keywords & reading context files..." -->
// turbo
1. **Read context files** — target keywords for content calendar, brand voice for tone
2. Research trending keywords for the target site (web search)
3. Cross-check target keywords for content gaps and priorities
4. Identify the highest-impact topic (search volume × relevance × ease)
5. Validate AdSense compliance for ad placement

### Phase 2: Competitor Scan (Gemini 3.1 Pro)
<!-- progress: "📊 Phase 2/7: Scanning top 3 competitors for [keyword]..." -->
6. **Search Google for the target keyword** and read the top 3 ranking articles
7. Note what each competitor covers — headings, depth, examples, media
8. Identify **gaps they missed** — angles, tools, data, or sections you can add
9. Identify **unique value** your article can offer (e.g., link to your free tool, include comparison tables they lack)
10. Document your content angle: "Cover everything they cover + add [X unique thing]"

> **Goal:** Never publish a weaker article than what already ranks. Your article must be equal or better in depth AND offer something unique (usually your tool).

### Phase 3: Content Creation (Gemini 3.1 Pro)
<!-- progress: "✍️ Phase 3/7: Writing article — [title]..." -->
11. **Read brand voice** — apply tone, sentence length, and formatting rules
12. Generate blog post draft with SEO-optimized headings
13. **Read internal links map** — add 3-6 internal links using natural anchor text
14. Create meta descriptions and Open Graph tags
15. Write structured data (JSON-LD FAQPage schema) for FAQ sections
16. End the article with a clear CTA linking to the most relevant tool
17. **Generate a hero image** using the `generate_image` tool — a custom illustration that matches the article topic. Save to the site's `/public/images/blog/` directory.

### Phase 4: Quality Check (before code)
<!-- progress: "✅ Phase 4/7: Running quality checks (readability, links, SEO)..." -->
18. **Readability check** — verify:
    - Average sentence length < 25 words
    - No paragraph longer than 4 lines
    - Uses subheadings every 200-300 words
    - Tables for all comparisons
    - Bold on key takeaways
19. **Internal link audit** — verify:
    - At least 3 tool links per article
    - At least 1 cross-link to another blog post (if relevant)
    - No broken URLs (check against internal links map)
    - Descriptive anchor text (never "click here")
20. **SEO checklist**:
    - [ ] Title tag includes primary keyword + year
    - [ ] H1 matches title tag
    - [ ] Meta description < 155 chars with keyword + "free"
    - [ ] FAQ section with 3-5 questions
    - [ ] CTA at end linking to relevant tool
    - [ ] Article length 800-2000 words
    - [ ] Hero image generated and referenced

### Phase 5: Code Implementation (Claude Opus 4.5)
<!-- progress: "💻 Phase 5/7: Adding article to codebase..." -->
21. Add article to site's data file (e.g., `articles.js`)
22. Reference the hero image in the article metadata (if supported)
23. Verify icon is imported in BlogList component
24. Add programmatic SEO pages if applicable

### Phase 6: Build & Deployment (Claude Opus 4.5)
<!-- progress: "🚀 Phase 6/7: Building & deploying to production..." -->
// turbo-all
25. `npm run build` — Verify production build
26. `git add -A` — Stage all changes
27. `git commit -m "content: descriptive message"` — Commit
28. `git push origin master` — Push to production

### Phase 7: Verify & Index (Gemini 3.1 Pro)
<!-- progress: "🎯 Phase 7/7: Verifying on production & requesting indexing..." -->
29. Open the article URL in browser and verify rendering
30. Verify hero image loads correctly
31. Submit new URL to Google Search Console
32. Request indexing for the new page
33. **Update target keywords** — mark topic as ✅ published

---

## 🚀 Quick Commands

### New Blog Post
```
/content-pipeline
Site: [site-name]
Type: blog-post
Topic: [topic]
Keywords: [keyword1, keyword2]
```

### New Feature
```
/content-pipeline
Site: [site-name]
Type: feature
Description: [what to build]
```

### SEO Audit
```
/content-pipeline
Site: [site-name]
Type: seo-audit
Focus: [keywords/technical/speed]
```

### Bug Fix
```
/content-pipeline
Site: [site-name]
Type: bug-fix
Issue: [describe the bug]
```

---

## ⚡ Turbo Deployment Checklist
// turbo-all
1. `npm run build` — Verify production build
2. `git add -A` — Stage all changes
3. `git commit -m "descriptive message"` — Commit
4. `git push origin master` — Push to production

---

## 📊 AdSense Rules (All Sites)
- Standard ad units: 728x90 (leaderboard) or 300x250 (medium rectangle)
- Ads must NOT be too close to buttons or interactive elements
- No hidden or obscured ad units
- Stateless (no-login, no-database) for zero hosting costs
- Always verify Policy Center after changes