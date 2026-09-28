# OTA Dashboard Refresh Log — 2026-09-16

**Run type:** scheduled background refresh (`refresh-ota-travel-dashboard`)
**Outcome:** ⚠️ **Live site NOT refreshed.** Same two client-side blockers as yesterday, plus a
**new** finding: the nightly cron appears to have stopped running entirely. No writes were made
to the dashboard or its data files.

---

## Summary

News was gathered successfully (step 1) and is recorded below. The live dashboard at
`https://prototypes.sandcastle.musta.ch/ota-dashboard/` could not be opened by either browser,
and the dashboard has no in-page refresh control to drive anyway — so steps 2–3 of the task
could not be executed. Per task instructions, no workarounds were attempted.

Separately, the local pipeline has now regressed further than yesterday's log described.

---

## Blocker 1 — Could not open the live page (unchanged)

| Browser | Result |
|---|---|
| Claude in Chrome | `Claude in Chrome is not connected` — extension unreachable / not signed in (retried, same result) |
| Built-in browser pane | `prototypes.sandcastle.musta.ch is blocked by your organization's policy`; an explicit access request was also refused by policy |

This is **not** an SSO/login wall — neither request got far enough to authenticate.

## Blocker 2 — The dashboard has no in-page refresh control (unchanged)

Confirmed again from the project source. The dashboard is a static Kyber HTML prototype with
no input field, paste area, or "update" button. Refresh happens outside the browser:

```
scripts/refresh-and-deploy.sh   # cron, daily @ 17:00 PT
  ├─ node scripts/fetch-news.cjs    → writes public/news-data.js from RSS feeds
  ├─ node scripts/inject-news.cjs   → inlines that data into public/index.html
  └─ kyber deploy                   → publishes to sandcastle
```

Steps 3–4 of the task file do not apply to this dashboard and should be rewritten to reference
this pipeline instead.

## Blocker 3 — `kyber deploy` still failing, and the cron itself has now stopped ⚠️ NEW

Yesterday's log recorded 38 consecutive deploy failures since Jul 6 (`airtool is required to
run kyber. Connect to VPN…`). That is still the case, but there is a new symptom on top of it:

**`scripts/refresh.log` has no entry for the Sep 15 17:00 PT run.** The log's last entry is
`Mon Sep 14 17:00:00 PDT 2026`, and the file's own mtime is Sep 14 17:06. So the fetch step —
which had been succeeding reliably every night even while the deploy failed — did not run last
night. The cron/launchd job appears to have stopped firing, or is failing before it can write
to the log.

**Current state of the data:**

| File | Data as of | Status |
|---|---|---|
| `public/news-data.js` | Sep 14, 2026, 5:00 PM PDT | ⚠️ 2 days stale (was current yesterday) |
| `public/index.html` | Sep 14, 2026, 5:06 PM PDT | ⚠️ 2 days stale |
| `dist/news-data.js` | Sep 3, 2026 | ❌ stale |
| `dist/index.html` | Sep 3, 2026 | ❌ stale |
| **Live site** | ~Jul 6, 2026 | ❌ **~10 weeks stale** |

Per `CLAUDE.md` ("Surface VPN/auth errors to the user"), this is surfaced rather than worked
around. No deploy is possible from this session — `kyber` runs on the Mac and needs VPN +
`airtool`; this session only has an isolated Linux sandbox with no access to the Mac's cron
table.

### Why no local files were written

Freshening `public/news-data.js` from here would not refresh anything the user can see (the
deploy step would still fail) and would overwrite the last known-good Sep 14 state. Given the
task's guidance that a report is the correct output when blocked, the local files were left
untouched.

### Suggested fix (two things now, in order)

1. **Check whether the job is still scheduled.** Nothing ran on Sep 15:
   ```bash
   crontab -l | grep -i refresh
   # or, if it's a launchd agent:
   launchctl list | grep -i ota
   ```
2. **Clear the backlog manually while on VPN:**
   ```bash
   cd "/Users/bimpe_abimbola/Claude Projects/ota-dashboard"
   npm run refresh-news     # fetch + copy to dist + deploy
   ```

Longer term: move the schedule to a time when VPN is reliably up, and have
`refresh-and-deploy.sh` alert on the `airtool`/VPN failure instead of exiting quietly into the
log. Yesterday's note still stands too — `refresh-and-deploy.sh` never copies `public/` →
`dist/`, while `npm run refresh-news` does, so a fixed deploy could still ship stale content
until the two paths are reconciled.

### Feed health (from the last successful run, Sep 14)

Worth fixing alongside the above: `Phocuswire` returned 403, `Travel Weekly` 403, and
`Hospitality Net` 403. The OTA category is being built from a degraded source set.

---

## News gathered today (not yet published)

Collected in step 1 before the blockers were hit. Recorded here so it isn't lost; the
`fetch-news.cjs` RSS pipeline remains the source of truth for the dashboard itself.

### OTAs & marketplaces

- **Booking Holdings closed at $171.32 on Sep 15, down 2.30%**, underperforming the S&P 500
  (−0.45%) and the Dow (−0.63%). The slide traces back to the Sep 9 EU General Court ruling
  upholding the veto of the Etraveli deal.
- **OTA marketing spend keeps climbing.** Booking Holdings lifted total Q2 marketing spend to
  $2.37B from $2.14B a year earlier (+11% YoY). Across the sector, OTAs spent roughly $5.37B
  on marketing in Q2 2026, with Booking the largest single contributor.
- **Expedia closed at $287.32 on Sep 14, up 2.3%**, outpacing the Nasdaq Composite on analyst
  notes highlighting Q2 revenue +14% and adjusted EPS of $5.76. A quarterly dividend of $0.48
  per share pays out Sep 17. CEO Ariane Gorin did a fireside chat at Goldman Sachs
  Communacopia on Sep 9.
- **Emerging Travel Group launched Marketing Hub**, an advertising unit combining RateHawk and
  ZenHotels' owned channels with an external media network, targeting hotels, airlines, rail
  operators and tourism boards.
- **Agoda's 2026 Repeat Visitor Ranking (Sep 14):** Tokyo took the top spot for the first
  time, overtaking Bangkok; New Delhi leads India. Earlier, Agoda reported overseas
  accommodation searches up 131% for Japan's Silver Week (Sep 21–23) — its first five-day
  holiday in over a decade — with Hong Kong +245%, Barcelona +210%, New York +178%.

### Airbnb

- **Single host-only fee took effect Sep 15.** All remaining non-EU hosts are now on a single
  15.5% host service fee, with no separate guest service fee at checkout. The transition has
  drawn host pushback.
- **$250M housing initiative**, structured to unlock more than $5B in housing capital over ten
  years — positioned as a response to the rent/home-price backlash.
- Shares closed $168.32 on Sep 15, down 1.37%. Truist maintained Hold with a $161 target.

### Regulatory

- **European Commission proposed an EU housing framework on Sep 9** that would set common
  ground rules for when regional and local authorities may restrict short-term rentals.
  Restrictions would require evidence of a housing problem — e.g. a high price-to-income ratio
  or sustained cost growth over at least a decade — to be considered necessary and
  proportionate.
- **Regulation (EU) 2024/1028 has been in force since May 20, 2026**, mandating platform data
  sharing with local authorities plus a digital host registration system. CCIA published
  criticism this month arguing the new rules lack enforcement teeth and offer no redress
  against disproportionate local restrictions.

### Trends & tech

- **Agentic AI is real but small.** AI travel agents handle an estimated 3–5% of hotel
  bookings in major markets as of early 2026, up from near zero in 2024; 56% of U.S. leisure
  travelers now use AI for planning.
- **The trust gap is the constraint.** Nearly 70% of travelers still prefer to complete the
  final booking with a trusted travel brand. OpenAI quietly pulled its integrated booking
  feature in March 2026 — users would research in ChatGPT, then leave to book elsewhere.
  Booking and Expedia have both launched apps inside ChatGPT; Google announced agentic booking
  in AI Mode while stating it has "no intention of becoming an OTA."
- **Distribution is repositioning around AI assistants**, with a new class of AI-native travel
  sellers emerging. Atlas deepened its Citilink API integration on Sep 16, framed explicitly
  around flight retailing moving beyond traditional OTAs.
- **Corporate travel:** 21% of buyers name slow AI integration as a top tech pain point
  (Business Travel Show America).
- **M&A over venture.** 2026 has seen 242 global travel deals worth $39.6B, three
  take-privates, and nearly $6B of card-issuer capital buying travel supply — while venture
  funding hit record-low deal volume in Q1. Expedia's CarTrawler acquisition is expected to
  close in H2 2026; Amadeus bought SkyLink. Consolidation is the prevailing growth strategy.
- **Other partnerships:** Traxo–Everbridge feeds live booking data into critical-event
  management; Uganda Airlines adopted Amadeus SkyWORKS; HBX Group is embedding Vorsee's
  ActionOS across its hotel tech stack.

---

## Actions taken

- No deploy performed.
- No dashboard or data files modified.
- No messages, emails or Slack sent (per task instructions — pure background refresh).
- This log written to the project folder, following the existing `refresh-log-YYYY-MM-DD.md`
  convention.

## Sources

- [PhocusWire travel tech news briefs — September 11](https://www.phocuswire.com/travel-tech-news-briefs/2026/september-11)
- [PhocusWire travel tech news briefs — September 4](https://www.phocuswire.com/travel-tech-news-briefs/september-4)
- [Booking Holdings stock heads into the open after a 2.3% slide](https://www.ad-hoc-news.de/boerse/news/corporate-news/booking-holdings-stock-heads-into-the-open-after-a-2-3-percent-slide/70109303)
- [Booking Holdings stock steady as Q2 2026 marketing spend jumps 11 percent](https://www.ad-hoc-news.de/boerse/news/corporate-news/booking-holdings-stock-steady-as-q2-2026-marketing-spend-jumps-11-percent/70107472)
- [Expedia Group stock gains as analysts highlight strong Q2 2026 results](https://www.ad-hoc-news.de/boerse/news/corporate-news/expedia-group-stock-gains-as-analysts-highlight-strong-q2-2026-results/70098509)
- [Expedia Group to Participate in Goldman Sachs Communacopia + Technology Conference 2026](https://www.nasdaq.com/press-release/expedia-group-participate-goldman-sachs-communacopia-technology-conference-2026-2026)
- [Expedia Group Q2 2026 earnings release](https://www.sec.gov/Archives/edgar/data/1324424/000132442426000051/earningsrelease-q22026.htm)
- [Airbnb stock heads into the open after a 1.4% drop](https://www.ad-hoc-news.de/boerse/news/corporate-news/airbnb-stock-heads-into-the-open-after-a-1-4-percent-drop/70108195)
- [Airbnb to Fund Affordable Housing After Rent Backlash — Seoul Economic Daily](https://en.sedaily.com/international/2026/09/16/airbnb-to-fund-affordable-housing-after-rent-backlash)
- [Airbnb Launches $250 Million Housing Initiative to Unlock $5 Billion in Investment](https://www.marketscreener.com/news/airbnb-launches-250-million-housing-initiative-to-unlock-5-billion-in-investment-ce785bdddb81f620)
- [Airbnb Is Switching All Hosts to a Single Fee by September 15](https://hostandflowstr.com/airbnb-is-switching-all-hosts-to-a-single-fee-by-september-15-here-is-everything-you-need-to-know/)
- [Airbnb's new fee change frustrates hosts — CNBC](https://www.cnbc.com/2026/08/22/airbnb-fee-change-frustrates-hosts-what-to-know-before-listing.html)
- [Agoda Unveils 2026 Return Visitor Ranking: New Delhi Leads India, Tokyo Tops Asia](https://www.tribuneindia.com/news/business/agoda-unveils-2026-return-visitor-ranking-new-delhi-leads-india-tokyo-tops-asia)
- [Agoda Reveals Growing Travel Interest for 2026 Silver Week in Japan](https://www.manilatimes.net/2026/09/04/tmt-newswire/pr-newswire/agoda-reveals-growing-travel-interest-for-2026-silver-week-in-japan-driven-by-first-five-day-holiday-in-11-years/2418498)
- [New rules bring increased transparency to the short-term rentals sector — European Commission](https://single-market-economy.ec.europa.eu/news/new-rules-bring-increased-transparency-short-term-rentals-sector-2026-05-20_en)
- [New EU Rules on Short-Term Rentals Lack Enforcement and Redress for Restrictions — CCIA](https://ccianet.org/news/2026/09/new-eu-rules-on-short-term-rentals-lack-enforcement-and-redress-for-restrictions)
- [Online short-term accommodation rental services – data collection and sharing — EUR-Lex](https://eur-lex.europa.eu/EN/legal-content/summary/online-short-term-accommodation-rental-services-data-collection-and-sharing.html)
- [Will Agentic AI Replace OTAs? The 2026 Reality Check — Gimmonix](https://gimmonix.com/news/agentic-ai-is-coming-to-cut-otas-out-or-is-it)
- [Google Clarifies Its Agentic AI Booking Plans: 'No Intention of Becoming an OTA' — Skift](https://skift.com/2025/11/20/google-agentic-ai-travel-booking-no-intention-become-ota/)
- [Atlas Deepens Citilink API Integration as AI Pushes Flight Retailing Beyond Traditional OTAs](https://travelprnews.com/atlas-deepens-citilink-api-integration-as-ai-pushes-flight-retailing-beyond-traditional-otas/travel-press-release/2026/09/16/)
- [Skift Capital Allocation Brief](https://skift.com/2026/08/09/skift-capital-allocation-brief-a-new-quarterly-read-on-where-travels-money-goes/)
- [Travel funding deal volume hits new low in Q1 2026 — PhocusWire](https://www.phocuswire.com/news/startups/travel-startup-funding-acquisitions-q1-2026)
- [The travel startup funding deals and acquisitions that stood out in Q2 — PhocusWire](https://www.phocuswire.com/news/startups/startup-funding-mergers-acquisition-q2-2026)
