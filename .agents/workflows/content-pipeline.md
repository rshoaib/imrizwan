---
description: Comprehensive content pipeline for all sites using Google Ultra subscription
---

# Content Pipeline Workflow

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
| 6 | **imrizwan.com** | Next.js | Developer blog | Portfolio |
| 7 | **azanapp** | React Native (Expo) | Prayer times app | Free/Ads |

---

## 🔄 Content Pipeline Phases

### Phase 1: Research & Plan (Gemini 3.1 Pro)
// turbo
1. Ask Gemini to research trending keywords for the target site
2. Identify content gaps and competitor analysis
3. Create a content calendar with topics and target keywords
4. Validate AdSense compliance for ad placement

### Phase 2: Content Creation (Gemini 3.1 Pro)
5. Generate blog post drafts with SEO-optimized headings
6. Create meta descriptions and Open Graph tags
7. Generate images/assets for the content
8. Write structured data (JSON-LD) for rich snippets

### Phase 3: Code Implementation (Claude Opus 4.5)
9. Implement new pages/components for the content
10. Add programmatic SEO pages if applicable
11. Ensure responsive design and accessibility
12. Add internal cross-links between sites (footer links)

### Phase 4: Quality & Deployment (Claude Opus 4.5)
13. Run TypeScript compilation check (`npx tsc --noEmit`)
14. Test on local dev server (`npm run dev`)
15. Push to production (`git add -A && git commit && git push`)
16. Verify deployment on Vercel dashboard

### Phase 5: Index & Monitor (Gemini 3.1 Pro)
17. Submit new URLs to Google Search Console
18. Request indexing for priority pages
19. Monitor Core Web Vitals (CLS, LCP, FID)
20. Check AdSense compliance after deployment

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
1. `npx tsc --noEmit` — Check for TypeScript errors
2. `npm run build` — Verify production build
3. `git add -A && git status` — Stage all changes
4. `git commit -m "descriptive message"` — Commit
5. `git push origin main` — Push to production

---

## 📊 AdSense Rules (All Sites)
- Standard ad units: 728x90 (leaderboard) or 300x250 (medium rectangle)
- Ads must NOT be too close to buttons or interactive elements
- No hidden or obscured ad units
- Stateless (no-login, no-database) for zero hosting costs
- Always verify Policy Center after changes
