---
description: Data-driven keyword research using free tools — Google Autocomplete, People Also Ask, and competition analysis
---

# /keyword-research Workflow

**Model**: Gemini 3.1 Pro (web search required)

## Overview

This workflow finds **low-competition, high-intent keywords** for a specific site using free data sources. It replaces guesswork with actual search data.

---

## Phase 1: Gather Seed Keywords (2 min)

1. Read the site's `.agents/context/site-context.md`
2. Extract the **top 3-5 broad seed keywords** from the topic clusters
3. Note which tools/pages already exist on the site (for intent matching)

**Example seeds for CertQuiz:**
```
vce player, practice test free, certification exam simulator
```

---

## Phase 2: Expand with Google Autocomplete (5 min)

For each seed keyword, query Google Autocomplete to find what people **actually type**:

1. Search the web for each seed keyword
2. Note the **autocomplete suggestions** (these are real searches with volume)
3. Note the **"People Also Ask"** questions
4. Note the **"Related Searches"** at the bottom of results

**For each seed, collect:**
- 5-10 autocomplete suggestions
- 3-5 "People Also Ask" questions
- 5+ related searches

This gives you 40-60 **real keyword phrases** from 3-5 seeds.

---

## Phase 3: Filter with the 4-Point Scorecard (10 min)

For each expanded keyword, score it on these 4 criteria:

| Criteria | Score 1 (Bad) | Score 3 (Good) | Score 5 (Great) |
|---|---|---|---|
| **Intent Match** | Searcher wants something we don't offer | Partially related to our tool | Searcher wants exactly what we have |
| **Competition** | Page 1 = Forbes, Microsoft, big brands | Mix of big and small sites | Page 1 = Reddit threads, forums, thin articles |
| **Long-tail Specificity** | 1-2 words ("exam") | 3 words ("free practice test") | 4+ words ("free vce player online no download") |
| **Internal Link Value** | No tool to link to | Can link to a related page | Directly drives traffic to a live tool |

**Scoring:**
- **16-20 total** → 🔴 Priority 1 (publish immediately)
- **12-15 total** → 🟠 Priority 2 (publish this month)
- **8-11 total** → 🟡 Priority 3 (publish when ready)
- **Below 8** → ❌ Drop it

---

## Phase 4: Competition Deep-Dive (5 min per keyword)

For each keyword scoring 12+, do a **manual Google check**:

1. Search the exact keyword phrase in Google
2. Look at the **top 5 results** and answer:

| Question | Good Sign ✅ | Bad Sign ❌ |
|---|---|---|
| Who ranks #1? | Reddit, Quora, a small blog | Forbes, Microsoft, Wikipedia |
| Do results match intent? | Many results are off-topic or generic | Results perfectly match the query |
| Content quality? | Thin articles, listicles, outdated (2023) | Deep, well-written, recent guides |
| Are there ads? | No ads (low commercial value = easier) | Many ads (competitive niche) |
| Domain authority? | Small sites (DA < 30) on page 1 | All sites are DA 70+ |

**If 3+ answers are "Good Sign"** → confirmed low competition, keep it.

---

## Phase 5: Cluster and Prioritize (5 min)

1. Group related keywords into clusters (one article can rank for 3-5 related phrases)
2. Assign each cluster to a **pillar** in `site-context.md`
3. Rank clusters by their scorecard total
4. Update the **Content Priority Queue** in `site-context.md`

**Cluster Example:**
```
Cluster: "VCE Player Free"
├── "free vce player online" (Score: 18)
├── "vce file opener no download" (Score: 17)
├── "open vce file without software" (Score: 16)
└── "vce player browser" (Score: 14)

→ One article can target all 4, with the highest-scoring phrase as the H1/title
```

---

## Phase 6: Output

Update `site-context.md` with:
1. New keyword clusters added to the topic table
2. Updated Content Priority Queue with scores
3. Add a `## Keyword Research Log` section tracking when research was last done

**Format for priority queue:**
```
| Priority | Keyword | Score | Volume Hint | Competition |
|---|---|---|---|---|
| 🔴 1 | "free vce player online no download" | 18/20 | High (autocomplete) | Low (Reddit, forums) |
```

---

## Notes

- **"Volume Hint"** = We use Google Autocomplete as a proxy. If Google suggests it, it has volume. The more specific the suggestion, the more targeted the traffic.
- **No paid tools needed** — this workflow uses only Google Search, Autocomplete, and manual analysis.
- **Run monthly** per site to discover new opportunities as search trends shift.
- **Pair with /content-pipeline** — once keywords are prioritized, use the content pipeline to write and publish.
