---
description: Discover and evaluate profitable niches for mobile apps and websites using market research, keyword analysis, and competition scoring
---

# Niche Discovery Workflow

A systematic 6-phase workflow to find, evaluate, and validate profitable niches for **mobile apps** and **websites** that **solve real people's pain points**.

> [!IMPORTANT]
> **Core Principles (non-negotiable):**
> - ❌ No user data / no accounts / no login
> - ❌ No payment integration / no subscriptions / no in-app purchases
> - ❌ No backend / no database / no server costs
> - ✅ Monetization via **AdMob (mobile)** and **AdSense (web)** ONLY
> - ✅ Stateless, client-side, offline-capable apps
> - ✅ Simple, focused utility apps (like Azan Time)
> - ✅ Must **solve a real pain point** — apps people actually need daily
> - ✅ Focus on problems people currently solve with clunky, ad-heavy, or bloated alternatives
> - ✅ Tech stack: **React Native Expo** (mobile) / **Vite + React** (web)
> - ✅ Free hosting: Vercel / Netlify (web), Play Store / App Store (mobile)

---

## Phase 1: Ideation & Brainstorming
// turbo

> **Platform**: Always search for BOTH mobile (React Native Expo + AdMob) and web (Vite + React + AdSense) opportunities. Present results in two sections.

1. **Web search** for pain points & trending niches (search ALL of these):
   - Search: "most downloaded free utility apps {current_year}"
   - Search: "simple app ideas with ads revenue {current_year}"
   - Search: "everyday problems apps can solve {current_year}"
   - Search: "reddit what app do you wish existed"
   - Search: "annoying daily tasks that need a simple app"
   - Search: "free tool website niches high adsense rpm {current_year}"
   - Search: "simple react native app ideas {current_year}"
   - Search: "free online tools people use daily {current_year}"

2. **Generate a raw list** of 15-20 niche ideas that fit the constraints:
   - **Solves a real pain point** — what frustration does this remove?
   - No backend required (fully client-side / local data)
   - Can work offline or with minimal free API calls
   - High daily usage = high ad impressions
   - For each idea, mark: 📱 Mobile | 🌐 Web | 📱🌐 Both
   - User's existing portfolio skills (React Native Expo, Vite + React)

---

## Phase 2: Market Demand Analysis

For each niche from Phase 1:

1. **Google Trends check** — Search web for `site:trends.google.com "{niche keyword}"`:
   - Is the trend rising, stable, or declining?
   - Mark: 🟢 Rising | 🟡 Stable | 🔴 Declining

2. **Keyword volume estimation** — Search for:
   - "{niche} app" monthly searches
   - "{niche} online free" monthly searches
   - "{niche} calculator/converter/tool" monthly searches

3. **App Store / Play Store check** — Search for:
   - How many free competitors exist?
   - What are their ratings?
   - What do negative reviews complain about? (= opportunity gaps)
   - Do competitors have excessive ads? (= chance to offer cleaner UX)

4. **Output a table** with columns:
   | Niche | Trend | Est. Monthly Searches | Play Store Competition | Opportunity Score |

---

## Phase 3: Competition Deep-Dive

For the **top 5 niches** from Phase 2:

1. **Search for existing apps** — Web search:
   - "best free {niche} app {current_year}"
   - "best {niche} website free no login"
   - "{niche} app no ads reddit"

2. **Analyze top 3 competitors** for each niche:
   | Competitor | Platform | Free/Paid | Rating | Downloads | Key Features | Weak Points |

3. **Identify pain points & gaps** — What real problems are users frustrated about?
   - Search: "{competitor name} review complaints"
   - Search: "reddit {niche} app recommendation"
   - Search: "{niche} app frustrating reddit"
   - Search: "{niche} why is there no good app"
   - Common pain points: Too many ads, bloated, requires login, no offline, privacy concerns, slow, ugly UI, missing key feature, overcomplicated for a simple task
   - **Key question**: Can we solve this pain point with a SIMPLER, CLEANER app?

4. **Score each niche** on Competition Level:
   - 🟢 Low (< 3 serious free competitors)
   - 🟡 Medium (3-10 competitors, but with clear UX/feature gaps)
   - 🔴 High (10+ strong free competitors, no clear gaps)

---

## Phase 4: Ad Revenue Viability

For each of the top 5 niches:

1. **Estimate AdMob/AdSense revenue potential**:
   - Search: "{niche} admob rpm {current_year}"
   - Search: "{niche} adsense cpc {current_year}"
   - **Key metric**: Daily Active Users × Sessions per Day × Ads per Session

2. **Ad format suitability**:
   | Ad Format | Suitability | Why |
   | Banner | ✅/❌ | Always visible, low RPM |
   | Interstitial | ✅/❌ | Between actions, higher RPM |
   | Rewarded | ✅/❌ | User opts in, highest RPM |
   | Native | ✅/❌ | Blends with content |

3. **Usage frequency check** — How often would a user open this app?
   - 🟢 Daily (prayer times, weather, habits) = best for ads
   - 🟡 Weekly (converters, calculators) = moderate
   - 🔴 Rarely (one-time tools) = poor for ads

4. **Cost check** — Confirm ZERO ongoing costs:
   - ✅ No backend needed
   - ✅ No paid API calls (or has generous free tier)
   - ✅ Free hosting (Vercel/Netlify for web, Play Store for mobile)
   - ❌ REJECT any niche requiring paid APIs or servers

5. **Score each niche** on Ad Revenue Viability:
   | Niche | Est. RPM | Usage Frequency | Ad Format Fit | Hosting Cost | Net Score |

---

## Phase 5: Feasibility & Effort Scoring

For each niche, evaluate:

1. **Technical complexity** (1-5 scale, target 1-3 only):
   - 1 = Simple static tool / calculator (e.g., unit converter)
   - 2 = Uses device APIs (e.g., location for prayer times, camera for QR)
   - 3 = Uses free APIs with local caching (e.g., weather, currency rates)
   - 4 = ❌ SKIP — needs backend
   - 5 = ❌ SKIP — needs auth/payment/heavy infra

2. **Time to MVP** estimate:
   - ⚡ 1-2 weeks (ideal)
   - 🕐 2-4 weeks (acceptable)
   - 🗓️ 1-2 months (only if very high potential)
   - 📅 2+ months → ❌ SKIP

3. **Offline capability**:
   - Can the core feature work without internet?
   - 🟢 Fully offline | 🟡 Partial (cached data) | 🔴 Requires internet

4. **Final Scoring Matrix**:
   | Niche | Demand | Competition | Ad Revenue | Feasibility | TOTAL |
   
   Score each 1-10, weight:
   - Demand: 25%
   - Competition (inverse — low = high score): 25%
   - Ad Revenue potential: 30%
   - Feasibility (simplicity): 20%

---

## Phase 6: Final Recommendation & Action Plan

1. **Present the top 3 niches** ranked by total score with:
   - **Pain point it solves** — what daily frustration does this fix?
   - Why this niche?
   - Target audience
   - Core features for MVP (keep it minimal!)
   - Ad placement strategy (banner, interstitial, rewarded)
   - Estimated time to launch
   - First 3 steps to start

2. **Ask the user** which niche they want to pursue

3. **Generate a project kickoff brief**:
   - App name suggestions (3-5 options)
   - Feature list (MVP only — resist feature creep!)
   - Tech stack: React Native Expo (mobile) or Vite + React (web)
   - AdMob/AdSense ad placement plan
   - ASO (App Store Optimization) keywords
   - Play Store / App Store listing copy draft

---

## Example Output Format

```
🏆 NICHE RECOMMENDATION REPORT

#1 — [Niche Name] (Score: 8.7/10)
   🎯 Pain Point: [What frustration this solves]
   📊 Demand: Rising trend, ~12K monthly searches
   🏁 Competition: Low (2 weak free competitors)
   💰 Revenue: AdMob banner + interstitial, est. $3-5 RPM
   📱 Usage: Daily (high ad impressions)
   ⚡ Time to MVP: 1-2 weeks
   💵 Hosting Cost: $0
   🎯 Target: [Who would use this]
   
#2 — [Niche Name] (Score: 7.9/10)
   ...

#3 — [Niche Name] (Score: 7.2/10)
   ...
```

---

## Disqualification Criteria

Immediately REJECT any niche that requires:
- ❌ User accounts / login / registration
- ❌ Payment processing (Stripe, RevenueCat, IAP)
- ❌ Backend server / database
- ❌ Paid API calls with no free tier
- ❌ Complex infrastructure (WebSockets, real-time sync)
- ❌ User-generated content moderation
