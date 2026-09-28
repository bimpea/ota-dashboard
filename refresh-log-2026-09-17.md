# OTA Dashboard Refresh Log — 2026-09-17

**Run type:** scheduled background refresh (`refresh-ota-travel-dashboard`)
**Outcome:** ⚠️ **Live site NOT refreshed.** Third consecutive blocked run. Both browsers are
still unreachable, the dashboard still has no in-page refresh control, and the nightly cron has
now missed **three** nights (Sep 15, 16, 17). No writes were made to the dashboard or its data
files.

---

## Summary

News was gathered successfully (step 1) and is recorded below. Every route to actually
refreshing the live dashboard is blocked — and today a fourth blocker was confirmed that
yesterday's log had not tested: **the Linux sandbox has no network route to the RSS feeds**, so
the fetch pipeline can't even be run manually from this session. Per task instructions, no
workarounds were attempted.

---

## Blocker 1 — Could not open the live page (unchanged, 3rd day)

| Route | Result |
|---|---|
| Claude in Chrome | `Claude in Chrome is not connected` — extension unreachable / not signed in (retried 3×, same result) |
| Built-in browser pane | `prototypes.sandcastle.musta.ch is blocked by your organization's policy` |
| `web_fetch` | `HTTP 403 — Invalid authorization / account_session_invalid` |

This is **not** an SSO/login wall — no request got far enough to authenticate. Chrome is the
route the task file specifies; the built-in browser was tried as a substitute and is blocked by
a separate policy.

## Blocker 2 — The dashboard has no in-page refresh control (unchanged)

Re-confirmed from source. `template: "html"` in `.kyber/manifest.json` — this is a static Kyber
HTML prototype with no input field, paste area, or "update" button. Refresh happens entirely
outside the browser:

```
scripts/refresh-and-deploy.sh   # cron, daily @ 17:00 PT
  ├─ node scripts/fetch-news.cjs    → writes public/news-data.js from RSS feeds
  ├─ node scripts/inject-news.cjs   → inlines that data into public/index.html
  └─ kyber deploy                   → publishes to sandcastle
```

**Steps 2–4 of the task file describe a dashboard that doesn't exist.** They should be rewritten
against this pipeline (see *Suggested fix*).

## Blocker 3 — Cron has now missed three consecutive nights ⚠️ WORSE

`scripts/refresh.log` last entry is still `Mon Sep 14 17:00:00 PDT 2026`, and its mtime is still
Sep 14 17:06. Nothing has been appended for Sep 15, Sep 16, or Sep 17. Yesterday's log flagged
one missed night; it is now three, so this is a persistent failure rather than a one-off.

Log tallies: 52 `Starting news refresh` entries, 38 `airtool is required` deploy failures — i.e.
the deploy step has failed on every run since Jul 6 even when the fetch step succeeded.

## Blocker 4 — Sandbox cannot reach the RSS feeds ⚠️ NEW

Yesterday's log declined to freshen the local data on the grounds that it wouldn't help. Today I
tested whether it was even possible. It is not:

```
000  https://skift.com/feed/
000  https://www.travelweekly.com/rss
000  https://www.phocuswire.com/rss
```

`000` = no connection at all (the sandbox allows only allowlisted hosts; these feeds aren't on
it). `kyber` and `airtool` are also absent from the sandbox (`NOT_FOUND`). So this session cannot
run *any* stage of the pipeline — not fetch, not inject, not deploy. The refresh must happen on
the Mac, on VPN.

**Current state of the data:**

| File | Data as of | Status |
|---|---|---|
| `public/news-data.js` | Sep 14, 2026, 5:00 PM PDT | ⚠️ 3 days stale |
| `public/index.html` | Sep 14, 2026, 5:06 PM PDT | ⚠️ 3 days stale |
| `dist/news-data.js` | Sep 3, 2026 | ❌ stale |
| `dist/index.html` | Sep 3, 2026 | ❌ stale |
| **Live site** | ~Jul 6, 2026 | ❌ **~10 weeks stale** |

Per `CLAUDE.md` ("Surface VPN/auth errors to the user"), this is surfaced rather than worked
around. No local files were modified: there is nothing fresher to write them from, and
overwriting the last known-good Sep 14 state would be a straight loss.

### Suggested fix (in order)

1. **Check whether the job is still scheduled.** Three nights missed points at the schedule
   itself, not the deploy:
   ```bash
   crontab -l | grep -i refresh
   launchctl list | grep -i ota     # if it's a launchd agent
   ```
2. **Clear the backlog manually while on VPN:**
   ```bash
   cd "/Users/bimpe_abimbola/Claude Projects/ota-dashboard"
   npm run refresh-news     # fetch + copy to dist + deploy
   ```
3. **Rewrite the scheduled-task file.** Steps 2–4 tell the agent to drive a browser UI that this
   prototype doesn't have, which guarantees a blocked run every day. It should instead invoke
   the pipeline — and that means the task needs to run somewhere with VPN + `airtool` + feed
   access, which the Cowork sandbox does not have. As written, this task cannot succeed from
   this environment on any day.

Carried over and still unfixed:

- `refresh-and-deploy.sh` never copies `public/` → `dist/`, while `npm run refresh-news` does.
  A repaired deploy could still ship stale content until the two paths are reconciled.
- `refresh-and-deploy.sh` exits quietly into the log on the `airtool`/VPN failure. It should
  alert — 38 silent failures is how this reached 10 weeks of staleness unnoticed.
- **Feed health:** last successful run showed `Phocuswire` 403, `Travel Weekly` 403,
  `Hospitality Net` 403. The OTA category is being built from a degraded source set.

---

## News gathered today (not yet published)

Collected in step 1 before the blockers were hit. Recorded here so it isn't lost; the
`fetch-news.cjs` RSS pipeline remains the source of truth for the dashboard itself.

### OTAs & marketplaces

- **Trip.com Group's Q2 was hit by the SAMR penalty** (PhocusWire, Sep 16). Accommodation
  revenue was offset by the fine. Full terms now confirmed: RMB 5.2B / ~$770M total — China's
  largest platform antitrust penalty since Alibaba's in 2021 — comprising a RMB 3,521M
  ($518.9M) fine at 7.5% of 2025 PRC sales, RMB 1,658M ($244.4M) of confiscated gains, and a
  RMB 122M ($18.0M) refund of compulsorily deducted hotel deposits. Violations were of Article
  22(4) and (5) of the Anti-Monopoly Law: forcing hotels into exclusive deals and
  "lowest-price-across-the-internet" terms via traffic allocation, platform rules and technical
  measures. Q2 revenue growth guidance was cut to 3–8% from 17% in Q1. TCOM rose 6.5% on
  governance-overhaul plans following the decision.
- **Booking Holdings is running five AI initiatives** (Skift, Sep 14) — two internal startups
  plus a soon-to-launch Agoda trip-planning tool, per executive comments at investor
  conferences. Priceline's Penny, rebuilt as an agentic system, is the standout so far and is
  being touted on earnings calls.
- **Etraveli block upheld; M&A edge shifts to Expedia** (Skift, Sep 10). The EU General Court
  upheld the veto of Booking's ~€1.63B Etraveli deal, endorsing the theory that a dominant firm
  expanding into an adjacent business (flights feeding hotels) can harm competition. Practical
  effect: Expedia can acquire to build, Booking in Europe largely cannot.
- **Expedia's CarTrawler acquisition is expected to close in H2 2026**, framed as building a
  "one-stop shop for B2B travel."
- **Booking Holdings' B2B consolidation continues** — a new unit pulling together Booking.com,
  Agoda and Priceline to power other companies' travel offerings, overseen by Agoda CEO Omri
  Morgenshtern. Separately, BKNG Ads now sells advertising across all three brands through one
  platform, a first for the group.
- **Airbnb is filling in the OTA bingo card** — hotels, short-term rentals, experiences and now
  cars, leaving only flights and cruise. It is increasingly in direct competition with Expedia
  and Booking rather than adjacent to them.
- **Agoda launched its Partner Portal** on Aug 17, replacing the Yield Control System.

### Airbnb

- **$250M Housing Accelerator launched**, structured to unlock $5B+ in housing capital over ten
  years, starting with a $6.4M investment in Austin (Fortune, Sep 16). Positioned against the
  rent/home-price backlash, and against the statistic that 1 in 3 Gen Z and millennials are
  living in their parents' home.
- **Morgan Stanley set a $170 target with Equal-Weight on Sep 16.** ABNB closed $167.51, down
  0.5%, still 23.4% above its 2026 open of $135.72.
- **Single host-only fee took effect Sep 15** — all remaining non-EU hosts moved to a single
  15.5% host service fee with no separate guest fee at checkout. Host pushback continues.

### Regulatory

- **Google's DMA compliance is reshaping hotel search**, shifting visibility between direct
  booking channels and intermediaries; reporting suggests the net effect favours OTAs. Notably
  paired with ChatGPT stepping back from booking.
- **EU short-term rental framework** — the Commission's Sep 9 proposal would set common ground
  rules for when local authorities may restrict STRs, requiring evidence of a housing problem
  (e.g. high price-to-income ratio, or sustained cost growth over a decade) for restrictions to
  count as necessary and proportionate. Regulation (EU) 2024/1028 has been in force since
  May 20, 2026 (platform data sharing + digital host registration); CCIA published criticism
  this month that the rules lack enforcement teeth and offer no redress against
  disproportionate local restrictions.

### Trends & tech

- **Travel marketers are chasing AI visibility and prepping for agentic booking** (PhocusWire,
  Sep 16) — the distribution question is shifting from SEO to being surfaced inside assistants.
- **Agentic AI is real but still small.** AI travel agents handle an estimated 3–5% of hotel
  bookings in major markets as of early 2026, up from near zero in 2024; 56% of U.S. leisure
  travelers use AI for planning. The constraint is trust: ~70% still want to complete the final
  booking with a known travel brand. OpenAI quietly pulled its integrated booking feature in
  March 2026 after users researched in ChatGPT then left to book elsewhere.
- **Expedia's AI push** — acquired Layla (AI-native trip planning, founded 2023), and at Explore
  2026 launched new AI experiences plus an expanded partner ecosystem. Its own research argues
  travelers increasingly want to plan and book a full trip on one platform, which is the
  strategic case for the bundling.
- **Travelport CTO Andrew Jordan** on AI innovation, in PhocusWire's AI Transformation in Travel
  series (Sep 16).
- **M&A over venture, still.** ~$1B across 44 rounds in Q1 2026 (down from 66 rounds / ~$1.2B a
  year earlier), mostly Series A — a record-low deal volume. Meanwhile: Long Lake Management
  bought Amex GBT for $6.3B, Apollo agreed a $5.7B take-private of easyJet, Amadeus bought
  SkyLink, and Dormakaba is acquiring hotel tech specialist Alliants (Sep 16). Consolidation is
  the prevailing growth strategy; well-capitalised players are buying capabilities rather than
  building them.
- **Funding that did land:** HeyMax (PhocusWire Hot 25 for 2026) raised $11M Series A; Vuelo
  secured €64M seed for AI-native travel booking.
- **Other:** Qantas opened a product innovation centre in Adelaide, 50 staff in place and 40
  more roles open (Sep 16). 21% of corporate travel buyers name slow AI integration as a top
  tech pain point.

---

## Actions taken

- No deploy performed (impossible from this environment — no `kyber`, no `airtool`, no VPN).
- No dashboard or data files modified (nothing fresher available to write from).
- No messages, emails or Slack sent (per task instructions — pure background refresh).
- This log written to the project folder, following the existing `refresh-log-YYYY-MM-DD.md`
  convention.

## Sources

- [PhocusWire — Latest news](https://www.phocuswire.com/Latest-News)
- [PhocusWire travel tech news briefs — September 11](https://www.phocuswire.com/travel-tech-news-briefs/2026/september-11)
- [Trip.com Group hit with $763M penalty from Chinese regulators — PhocusWire](https://www.phocuswire.com/news/online/tripcom-group-fine-china-2026-monopoly-antitrust)
- [China's $770 Million Crackdown on Trip.com Is Really About Platform Power — Skift](https://skift.com/2026/07/27/chinas-770-million-crackdown-on-trip-com-is-really-about-platform-power/)
- [Trip.com Group Sincerely Accepts Administrative Penalty Decision Issued by SAMR](https://finance.yahoo.com/markets/stocks/articles/trip-com-group-sincerely-accepts-083000691.html)
- [SAMR imposes $762.3M fine on Ctrip for exclusive dealing and MFN pricing restrictions — Concurrences](https://www.concurrences.com/en/bulletin/news-issues/preview/the-chinese-state-administration-for-market-regulation-imposes-a-762-3m-fine)
- [Booking's 5 AI Experiments — and Why Agoda's Is Next — Skift](https://skift.com/2026/09/14/bookings-5-ai-experiments-and-why-agodas-is-next/)
- [With Booking's Etraveli Deal Still Blocked, Expedia Has the Edge in M&A — Skift](https://skift.com/2026/09/10/with-bookings-etraveli-deal-still-blocked-expedia-has-the-edge-in-ma/)
- [Booking Holdings Is Forming a New B2B Unit, Agoda CEO Is Overseeing It — Skift](https://skift.com/2026/07/10/booking-holdings-is-forming-a-new-b2b-unit-agoda-ceo-is-overseeing-it-scoop/)
- [Booking Holdings to Sell Ads Across All Three OTA Brands for the First Time — Skift](https://skift.com/2026/05/21/booking-holdings-to-sell-ads-across-all-three-ota-brands-for-the-first-time-exclusive/)
- [Airbnb Is Becoming a Real OTA — Skift](https://skift.com/2026/05/22/airbnb-is-becoming-a-real-ota/)
- [Expedia Group Unveils New AI Experiences, Expands Travel Ecosystem at Explore 2026](https://www.expedia.com/newsroom/expedia-group-unveils-new-ai-experiences-expands-travel-ecosystem-and-launches-philanthropy-program-at-explore-2026/)
- [Expedia Group Unveils New Global Research Showing Traveler Demand for Full-Trip Planning](https://ir.expediagroup.com/news-and-events/news/news-details/2026/EXPEDIA-GROUP-UNVEILS-NEW-GLOBAL-RESEARCH-SHOWING-TRAVELER-DEMAND-FOR-FULL-TRIP-PLANNING/default.aspx)
- [Airbnb is swooping in with a $250 million fund for affordable rental homes — Fortune](https://fortune.com/2026/09/16/1-in-3-gen-z-and-millennials-stuck-in-parents-home-airbnb-swooping-in-250-million-fund-affordable-rental-homes/)
- [Airbnb stock eases as Morgan Stanley sets USD 170 target](https://www.ad-hoc-news.de/boerse/news/corporate-news/airbnb-stock-eases-as-morgan-stanley-sets-usd-170-target/70118104)
- [Google's DMA Compliance Shifts Hotel Search Visibility Toward OTAs as ChatGPT Steps Back from Booking — Hospitality Net](https://www.hospitalitynet.org/editorial/4131805/googles-dma-compliance-shifts-hotel-search-visibility-toward-otas-as-chatgpt-steps-back-from-booking)
- [Travel funding deal volume hits new low in Q1 2026 — PhocusWire](https://www.phocuswire.com/news/startups/travel-startup-funding-acquisitions-q1-2026)
- [The travel startup funding deals and acquisitions that stood out in Q2 — PhocusWire](https://www.phocuswire.com/news/startups/startup-funding-mergers-acquisition-q2-2026)
- [Startup M&A fills the void as travel funding deal volume hits a new low — Travel Tech Talent](https://www.traveltechtalent.com/insights/traveltech-news-startup-ma-funding-low-2026)
- [Vuelo secures €64 million in Seed funding to build an AI-native travel booking experience — EU-Startups](https://www.eu-startups.com/2026/03/vuelo-secures-e64-million-in-seed-funding-to-build-an-ai-native-travel-booking-experience/)
- [Presenting the Hot 25 Travel Startups for 2026 — PhocusWire](https://www.phocuswire.com/hot-25-travel-startups-2026)
- [Hotel Rate Parity in 2026 and New OTA Rules — QloApps](https://qloapps.com/hotel-rate-parity-2026/)
- [Digital Markets Act guide for hotels in Europe — SiteMinder](https://www.siteminder.com/r/digital-markets-act/)
