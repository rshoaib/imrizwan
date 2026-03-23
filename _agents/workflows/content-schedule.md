---
description: Weekly content publishing schedule — shows which sites to publish on each day
---
# 📅 2026 Content Publishing Schedule (9 Sites)

This workflow defines the global content publishing schedule across the 9 core utility and portfolio properties. The schedule is designed to produce 27 articles a week, hitting a goal of 3 articles per site per week, by rotating between two site groups.

## The A/B Group Rotation

The 9 sites are split into two groups. We process 1 article for every site in the active group on their designated days.

### 🔵 Group A (Runs Mon, Wed, Fri) - 5 Sites
1. `legalpolicygen.com`
2. `mycalcfinance.com`
3. `buildwithriz.com`
4. `orderviachat.com`
5. `imrizwan.com`

### 🟢 Group B (Runs Tue, Thu, Sat) - 4 Sites
1. `getcertquiz.com`
2. `dailysmartcalc.com` (Directory: `dailysmartcalc-next`)
3. `onlineimageshrinker.com`
4. `tinypdftools.com` (Directory: `pdftoolkit`)

### ⚪ Sunday
Rest Day / SEO Audits / Keyword Research

---

## 🤖 Agentic Execution Protocol

When the user says `@[/content-schedule]`:

1. **Check the Current Day**: Use the current system date to determine if it is a Group A day or a Group B day.
2. **Review Dashboard Status**: Read the `content_dashboard.md` artifact to cross-reference which sites in today's group still need their article for today.
3. **Execute Pipeline in Batch**: For each site in today's group, run the `@[/content-pipeline]` protocol sequentially. Find the top priority keyword for that site, write the article, build, deploy, and verify. Do not ask for permission between sites unless you hit a blocker.
4. **Update Dashboard**: After the batch runs successfully, update the `content_dashboard.md` artifact with the checkmarks for today's completed articles.
