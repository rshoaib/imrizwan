---
description: Check site against Google AdSense policies — ad placement, content quality, required pages, and compliance
---

# AdSense Compliance Audit

Run a full audit of the current site against Google AdSense program policies.
Produces a scored report with actionable fixes.

---

## Phase 1: Required Pages & Legal Compliance
<!-- progress: "📋 Phase 1/6: Checking required pages..." -->

1. **Privacy Policy page** — verify it exists, is linked from footer, and mentions:
   - Google AdSense / third-party ad serving
   - Use of cookies and web beacons
   - DoubleClick DART cookie opt-out link
   - Link to Google's ad privacy policy
2. **About page** — verify it exists and has meaningful content (not boilerplate)
3. **Contact / feedback mechanism** — verify users can report issues
4. **Terms of Service** — check if present (recommended but not required)

> **Policy ref:** [AdSense Program Policies — Required Content](https://support.google.com/adsense/answer/48182)

---

## Phase 2: Ad Placement Rules
<!-- progress: "📐 Phase 2/6: Auditing ad placement in code..." -->

5. **Scan all `<AdSlot>` usages** across every page component:
   ```
   grep -rn "AdSlot" src/pages/ src/components/
   ```
6. For each ad placement, check:
   - [ ] Ad is NOT directly adjacent to a `<button>`, `<a>`, or `<input>` (min visual gap required)
   - [ ] Ad is NOT inside a modal, popup, or overlay
   - [ ] Ad is NOT floating or sticky (no fixed-position ads)
   - [ ] Ad is NOT placed where it could be accidentally clicked (e.g., below a "Calculate" button with no spacing)
   - [ ] Ad has a clear "Advertisement" label via `aria-label` or visible text
7. **Count ads per page** — Google recommends no more than 3 ad units per page on content-light pages. Verify:
   - [ ] Calculator pages: max 3 ad slots (leaderboard + sidebar rectangle + mobile banner)
   - [ ] Blog pages: max 3-4 ad slots
   - [ ] Homepage: max 2 ad slots
8. **Ad density check** — ads should NOT outweigh content area. Verify the content-to-ad ratio is reasonable (content should be the primary focus).
9. **Mobile ad placement** — verify:
   - [ ] No 300×250 ad above the fold on mobile (Google policy violation)
   - [ ] Mobile banner (320×50) is used instead
   - [ ] `ad-slot-rectangle` is hidden on mobile via CSS media query

---

## Phase 3: Content Quality Signals
<!-- progress: "📝 Phase 3/6: Evaluating content quality..." -->

10. **Thin content check** — scan all page components and verify:
    - [ ] Every calculator page has at least 300+ words of SEO content (explainer text, formulas, worked examples)
    - [ ] Every blog post has at least 800+ words
    - [ ] No pages are empty shells with only a form and ads
11. **Original content** — verify:
    - [ ] SEO content sections are unique per calculator (not copy-pasted between calculators)
    - [ ] Each page has a unique `<h1>`, `<title>`, and meta description
12. **No prohibited content** — quick scan for:
    - [ ] No misleading financial advice presented as fact (all calculators have disclaimers)
    - [ ] Disclaimer text exists in footer: "for informational purposes only"
    - [ ] No "guaranteed returns" or "get rich" language
13. **User value test** — verify each calculator page:
    - [ ] Has working interactive functionality (not just text)
    - [ ] Produces meaningful results (not blank/broken)
    - [ ] Has FAQ section with real questions

---

## Phase 4: Technical Compliance
<!-- progress: "⚙️ Phase 4/6: Checking technical compliance..." -->

14. **ads.txt** — verify `public/ads.txt` exists with correct publisher ID:
    ```
    google.com, pub-XXXXXXXXXX, DIRECT, f08c47fec0942fa0
    ```
15. **Ad code implementation** — verify AdSlot component:
    - [ ] Uses standard ad unit sizes (728×90, 300×250, 320×50)
    - [ ] Has proper `aria-label="Advertisement"` for accessibility
    - [ ] Does not programmatically click or refresh ads
    - [ ] Does not modify ad code or behavior
16. **Page load performance** — ads should not block content:
    - [ ] Ad scripts are loaded asynchronously
    - [ ] Core Web Vitals are not degraded by ad placement (CLS < 0.1)
    - [ ] Ad slots have fixed dimensions (no layout shift when ads load)
17. **No navigation interference** — verify:
    - [ ] Ads don't appear during page transitions
    - [ ] No interstitial/popup ads
    - [ ] Back button works normally (no ad-triggered redirects)

---

## Phase 5: Behavioral Compliance
<!-- progress: "🔒 Phase 5/6: Checking behavioral policies..." -->

18. **No incentivized clicks** — verify:
    - [ ] No text like "click our ads" or "support us by clicking"
    - [ ] No arrows or visual cues pointing to ads
    - [ ] No rewards for interacting with ads
19. **No artificial traffic** — verify:
    - [ ] No auto-refresh on pages with ads
    - [ ] No meta refresh tags
    - [ ] No suspicious redirects to ad-heavy pages
20. **Stateless design** — verify:
    - [ ] No login required to use calculators
    - [ ] No user data stored server-side
    - [ ] All calculations run client-side in the browser

---

## Phase 6: Generate Report
<!-- progress: "📊 Phase 6/6: Generating compliance report..." -->

21. **Score the site** on a scale per category:

| Category | Weight | Score (0-10) |
|----------|--------|--------------|
| Required Pages & Legal | 20% | |
| Ad Placement | 25% | |
| Content Quality | 25% | |
| Technical Compliance | 15% | |
| Behavioral Compliance | 15% | |
| **Overall** | 100% | |

22. **List all findings** in priority order:
    - 🔴 **Critical** — must fix before applying/to avoid suspension
    - 🟡 **Warning** — should fix soon, risk of policy flag
    - 🟢 **Pass** — compliant
    - 💡 **Recommendation** — not required but improves compliance

23. **Action items** — for each critical/warning finding, provide:
    - What the issue is
    - Which file(s) to change
    - Exact fix (code diff or content change)
    - Which AdSense policy it violates (with link)

---

## Quick Command
```
/adsense-audit
Site: [site-name]  (optional — defaults to current project)
```
