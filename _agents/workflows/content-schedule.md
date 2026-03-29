---
description: Run the content pipeline for ALL 9 sites sequentially — one article per site
---
# 📅 Content Pipeline — All Sites

When the user runs `@[/content-schedule]`, generate **one article per site** for all 9 sites, running sequentially.

---

## 📋 Site Order

Process sites in this exact order:

| # | Site | Directory | Branch |
|---|------|-----------|--------|
| 1 | `legalpolicygen.com` | `legalpolicygen` | `master` |
| 2 | `mycalcfinance.com` | `mycalcfinance` | `master` |
| 3 | `buildwithriz.com` | `buildwithriz` | `main` |
| 4 | `orderviachat.com` | `orderviachat` | `main` |
| 5 | `imrizwan.com` | `imrizwan` | `main` |
| 6 | `getcertquiz.com` | `certquiz` | `main` |
| 7 | `dailysmartcalc.com` | `dailysmartcalc-next` | `main` |
| 8 | `onlineimageshrinker.com` | `onlineimageshrinker` | `master` |
| 9 | `tinypdftools.com` | `pdftoolkit` | `main` |

---

## 🤖 Execution Protocol

For **each site** (1 through 9), do the following:

### Step 1: Show Scratchpad
Before starting each site, display a live scratchpad showing progress:

```
╔════════════════════════════════════════════════════════════╗
║  🚀 Content Schedule — Progress                           ║
╠════════════════════════════════════════════════════════════╣
║  1. legalpolicygen.com      ✅ Published                  ║
║  2. mycalcfinance.com       ✅ Published                  ║
║  3. buildwithriz.com        ⏳ In Progress...              ║
║  4. orderviachat.com        ⬜ Pending                    ║
║  5. imrizwan.com            ⬜ Pending                    ║
║  6. getcertquiz.com         ⬜ Pending                    ║
║  7. dailysmartcalc.com      ⬜ Pending                    ║
║  8. onlineimageshrinker.com ⬜ Pending                    ║
║  9. tinypdftools.com        ⬜ Pending                    ║
╠════════════════════════════════════════════════════════════╣
║  ✅ Completed: 2/9  │  ⏱️ Current: buildwithriz.com       ║
╚════════════════════════════════════════════════════════════╝
```

### Step 2: Run Content Pipeline
Execute the full `@[/content-pipeline]` workflow for the current site:
1. Phase 0: Publishing frequency check
2. Phase 1: Research & keyword selection
3. Phase 2: Competitor scan
4. Phase 3: Write the article (with AI stealth rules)
5. Phase 4: Quality check
6. Phase 5: Add to codebase
7. Phase 6: Build & deploy
8. Phase 7: Verify & submit to GSC

### Step 3: Update Scratchpad
After each site completes (or is skipped), update the scratchpad:
- ✅ = article published successfully
- ⏭️ = skipped (daily/weekly limit reached)
- ❌ = failed (with reason)

### Step 4: Continue to Next Site
Move to the next site immediately. Do NOT ask for permission between sites unless you hit a blocker that requires user input.

---

## ⚠️ Skip Rules

- If a site has already published **1 article today** → mark as ⏭️ Skipped and continue
- If a site has published **3 articles this week** → mark as ⏭️ Skipped and continue
- If build fails → mark as ❌ Failed, log the error, and continue to next site

---

## 📊 Final Summary

After all 9 sites are processed, show a final summary:

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║  📊 Content Schedule — Final Report                                             ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║  ✅ Published: 7 articles                                                       ║
║  ⏭️ Skipped:   1 (daily limit)                                                  ║
║  ❌ Failed:    1 (build error)                                                  ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║  #  │ Site                    │ Article Title              │ Total │ Live URL    ║
║  ───┼─────────────────────────┼────────────────────────────┼───────┼─────────── ║
║  1  │ legalpolicygen.com      │ Privacy Policy for AI Apps │  32   │ https://…  ║
║  2  │ mycalcfinance.com       │ 401k vs Roth IRA 2026      │  28   │ https://…  ║
║  3  │ buildwithriz.com        │ Invoice Tips for 2026      │  19   │ https://…  ║
║  4  │ orderviachat.com        │ WhatsApp Menu Design       │  14   │ https://…  ║
║  5  │ imrizwan.com            │ SPFx Column Formatting     │  45   │ https://…  ║
║  6  │ getcertquiz.com         │ ⏭️ Skipped (daily limit)   │  12   │ —          ║
║  7  │ dailysmartcalc.com      │ BMI Calculator Guide       │  22   │ https://…  ║
║  8  │ onlineimageshrinker.com │ ❌ Build failed            │  35   │ —          ║
║  9  │ tinypdftools.com        │ Merge PDF on iPhone        │  18   │ https://…  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

- **Total** = total number of articles on that site as of today (count from data file or database)
- **Live URL** = the full production URL of the newly published article (clickable)
- For skipped/failed sites, still show the total article count but use `—` for the URL

