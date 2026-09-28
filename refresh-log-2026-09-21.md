# OTA Dashboard Refresh Log — 2026-09-21

**Run type:** scheduled background refresh (`refresh-ota-travel-dashboard`)
**Outcome:** ⚠️ **Live site NOT refreshed (7th consecutive blocked run).** No writes were made to
the dashboard, its data files, or anywhere else. Root cause unchanged since 2026-08-06:
`airtool` is not installed, so `kyber` cannot run, so nothing can deploy.

---

## 🔴 The cron has now missed three consecutive nights

| Check | 2026-09-20 log | Today (2026-09-21) | Change |
|---|---|---|---|
| `airtool is required` failures in `scripts/refresh.log` | 39 | **39** | ⚠️ no new entry |
| Last line in `scripts/refresh.log` | Sep 17, 17:00 PDT | **Sep 17, 17:00 PDT** | ⚠️ unchanged |
| `public/news-data.js` mtime | Sep 17, 17:00 PDT | **Sep 17, 17:00 PDT** | ⚠️ unchanged |
| `public/index.html` mtime | Sep 17, 17:06 PDT | **Sep 17, 17:06 PDT** | ⚠️ unchanged |
| `dist/` mtime | Sep 3, 21:13 | **Sep 3, 21:13** | unchanged |
| Last successful `kyber deploy` | Jul 6, 14:37 PDT | **Jul 6, 14:37 PDT** | ~10.9 weeks stale |

A flat failure count with no new log line means the job **didn't execute** — it isn't executing
and failing. Sep 18, 19 and 20 were all skipped. Three in a row confirms the
laptop-asleep-at-17:00-PT diagnosis rather than a one-off. `cron` does not replay missed jobs.

**Staleness picture:**

- Live site: frozen at **Jul 6** (~10.9 weeks)
- Local working copy: **4 days** stale (was same-day fresh through Sep 17)

### ✅ The fix (unchanged, one-time, ~2 min, needs Bimpe on VPN)

```bash
# 1. Connect to VPN, then:
cd "/Users/bimpe_abimbola/Claude Projects/ota-dashboard"
kyber                 # lets airtool download + install itself
npm run refresh-news  # regenerate content (local copy is 4 days behind)
kyber deploy          # ship it
```

### 🔧 Two follow-ups

1. **`airtool` install** — the blocker. Nothing ships until this is done.
2. **Missed-run resilience** — a fixed 17:00 PT cron on a laptop keeps silently skipping days; it
   has now skipped three in a row. Options: `launchd` with `StartCalendarInterval` (which *does*
   run missed jobs on wake), a catch-up check on login, or have the script write an explicit
   "skipped" marker so missed runs are visible instead of invisible.

---

## Why this session couldn't route around it

Per the task file, no workarounds were attempted. All four routes remain closed — re-verified this
run, not carried over:

| Route | Result |
|---|---|
| Claude in Chrome (route the task specifies) | `Claude in Chrome is not connected` — extension unreachable / not signed in (retried 2×) |
| Built-in browser pane | `prototypes.sandcastle.musta.ch is blocked by your organization's policy` |
| In-page refresh control | **Does not exist** — re-verified: `public/index.html` contains **0** `<input>` and **0** `<textarea>` elements, and every `onclick` handler in the file is a view toggle (`setCoView`, `setView`, `showTable`, `switchDataView`, `switchTab`, `toggleCollapsible`). The `.news-refresh-btn` CSS rule is still orphaned with no matching element. |
| Run the pipeline from this session | `which kyber airtool` → nothing (only `/usr/bin/node`, `/usr/bin/npm`); Linux sandbox has no network route to the RSS feeds (`skift.com/feed/` and `phocuswire.com/rss` both → `403 from proxy after CONNECT`); deploy needs VPN + SSO on Bimpe's Mac regardless |

Neither browser failure is an SSO/login wall — no request got far enough to authenticate, so
step 2's stop condition ("if a login wall appears, note it and stop") doesn't technically apply;
the block is upstream of login. Step 3 of the task ("look for an input field / refresh button") is
not blocked by circumstance, it is **impossible by design** for this prototype: it's a static
`template: "html"` prototype with no mechanism to feed news in through the page. The only
supported path is `npm run refresh-news` → `kyber deploy`.

---

## News gathered — to Mon Sep 21, 2026

Recorded here since it could not be delivered to the page. This run had working general web search
plus a direct fetch of the Skift homepage, so the headline set is current as of this morning.

### Headline story — Skift Global Forum starts tomorrow

**Skift Global Forum, New York, Sep 22–24 — Tuesday, tomorrow.** CEOs of Airbnb, Booking Holdings,
Expedia, Hilton and Uber, plus OpenAI chairman Bret Taylor, across three days at North Javits.
The inaugural **Skift Creator Summit** runs alongside it on Sep 22 (100+ travel marketing and
growth leaders, on creator-led discovery reshaping travel demand). Speaker previews published over
the weekend point at where the conversation is heading:

- **Spotnana CEO Steve Singh** on what happens *after* the booking — servicing as the unsolved
  cost center. ([Skift](https://skift.com/2026/09/19/skift-global-forum-preview-spotnana-ceo-after-booking-servicing/))
- **IHG CCMO Heather Balsley** on "making hotels legible to AI" — i.e. supplier-side optimization
  for agentic discovery. ([Skift](https://skift.com/2026/09/18/skift-global-forum-preview-ihg-ai-hotel-visibility/))

The three prior logs flagged that the dashboard needed fixing *before* SGF week. **That window
closes today.** If the board is meant to be useful during the conference, the `airtool` install
plus a manual `npm run refresh-news` has to happen this morning.

### 🏠 Airbnb — the lead OTA story today

- **"What Uber and Airbnb Reveal About Expanding Beyond the Core"** (Rafat Ali, published ~10h ago
  — the freshest online-travel item on the board). Frames the two companies' pushes into hotels as
  a test of which advantage travels further: **Uber has frequency, Airbnb has travel intent.**
  This is the most directly Airbnb-relevant piece of the cycle and sets up Chesky's SGF appearance.
  ([Skift](https://skift.com/2026/09/20/what-uber-and-airbnb-reveal-about-expanding-beyond-the-core/))
- **Pepijn Rijvers named chief business officer** — formerly Tripadvisor Group CBO, 12 years at
  Booking.com before that. A pointed hire given the hotels push above.
- **Delta partnership expanded** — SkyMiles members earn 3 miles per $1 on qualifying Airbnb
  experiences and services, 1 mile per $1 on stays. Loyalty extended across more of the trip.
- **$250M Housing Accelerator** (announced Sep 14) — last-dollar financing intended to unlock >$5B
  of housing capital over a decade, opening with affordable housing in **Austin, Texas**, plus
  backing for pro-housing policy reform and a housing-policy dataset later in 2026. Still the
  pre-emptive answer to the STR-regulation overhang.
- Regulatory overhang unchanged: **EU Affordable Housing Act** proposal, **EU STR Data Regulation
  2024/1028** in force since May 20, heavy Spanish delistings.

### Regulatory — Booking/Etraveli remains the durable story

- **EU General Court upheld the block on Booking Holdings' €1.63B Etraveli acquisition**
  (judgment Sep 9). First time the EU courts have endorsed a **"reverse leveraging" / entrenchment**
  theory in a platform merger: flights are a low-margin customer-acquisition channel feeding
  Booking's high-margin hotel business, so even a small share increment can entrench dominance
  where network effects exist. Practical read-through: **Expedia now has the freer hand in M&A.**
  ([Skift](https://skift.com/2026/09/10/with-bookings-etraveli-deal-still-blocked-expedia-has-the-edge-in-ma/))
- **HOTREC European Hotel Distribution Study 2026:** Booking Holdings + Expedia = **85.4% of
  European OTA bookings.** Booking Holdings alone is **68.8%** (up from ~60% in 2013);
  Booking.com by itself is **66.1%**. This is the number HOTREC will keep pointing regulators at.
  ([Travel Daily News](https://www.traveldailynews.com/statistics-trends/booking-and-expedia-control-85-4-of-europes-ota-bookings/))
- **DMA status:** Booking.com designated a gatekeeper May 13 2024, says it is now compliant;
  parity requirements removed starting July. No new fine or enforcement action found this cycle —
  searched specifically and came up empty, so treat any claim of one as unconfirmed.
- **Spanish criminal complaint** (filed Feb 2026) against eDreams ODIGEO, Booking.com and an
  Expedia subsidiary — background, unresolved.

### AI & agentic booking — still the dominant theme

- **56% of U.S. leisure travelers now use AI for travel planning** — one of the fastest behavior
  shifts the industry has recorded. ChatGPT Agent Mode has planned complete multi-day trips by
  autonomously searching Airbnb, comparing options and opening the reservation page.
- **Google is building agentic hotel and flight booking into AI Mode**, two weeks after shipping
  the same for restaurants, tickets and wellness. Launch partners: **Booking.com, Expedia,
  Marriott, IHG, Choice, Wyndham.** The notable part remains that the major OTAs are participating
  as *suppliers into Google's agent* rather than resisting it.
- **Expedia's Explore 2026:** new AI traveler experiences, marketplace expansion, **CLEAR** and
  **Uber** partnerships, an AllTrails tie-up, and the Expedia Trails Fund. Separately, 12
  partner-facing products across **Vrbo** and **Escapia** — global rollout of pay-per-booked-night
  Sponsored Listings and a rebuilt Escapia reservation grid.
- **Expedia full-trip-bundling research:** travelers increasingly want to plan and manage the whole
  trip on one trusted platform — framed as a growth opening for whoever owns that surface.
  ([Expedia IR](https://ir.expediagroup.com/news-and-events/news/news-details/2026/EXPEDIA-GROUP-UNVEILS-NEW-GLOBAL-RESEARCH-SHOWING-TRAVELER-DEMAND-FOR-FULL-TRIP-PLANNING/default.aspx))
- **Agoda:** launched a multi-product booking engine (hotels + flights + activities in one
  transaction), and on Aug 17 replaced its Yield Control System with a new **Partner Portal**
  that uses AI to process guest reviews.
- **Phocuswright:** 95% of travel startups are using or actively exploring AI.

### Funding / M&A

- **Q1 2026:** ~$1B across **44 rounds**, down from 66 rounds / ~$1.2B in Q1 2025 — deal *volume*
  at a new low. Amadeus acquired **SkyLink**; **HeyMax** raised an $11M Series A.
- **Q2 2026:** **Long Lake Management acquired Amex GBT for $6.3B** (the quarter's largest);
  **Expedia–CarTrawler** (closing H2 2026); **Juniper–Deem**; **Lighthouse–Hotelrank.ai**.
- **Expedia** also acquired **Tiqets** and **Layla** (AI-native trip planning) this year.
- **Banyan Group completed its Newmark acquisition** — 26 asset-light hotels in Africa.
  ([Skift](https://skift.com/2026/09/17/singapores-banyan-group-buys-newmark-to-add-26-hotels-in-africa/))
- **Nium** acquired **Ixaris** and launched stablecoin card issuance in 2026, plugging digital
  assets into Visa and Mastercard rails.

### OTA market structure

- **U.S. OTA gross bookings rose 4% in 2025 to $100.3B** — OTAs are now ~**20% of all U.S. travel
  gross bookings**, projected to reach **21% by 2028**.
- **2025 global OTA rankings:** Booking.com, Expedia, Airbnb held the top three; **Despegar** moved
  up and **Tiket.com** entered the global top 10 for the first time.
- **Commissions** typically 15–25% and climbing. **APAC divergence** persists: in Q1 2026 Agoda was
  the only major OTA still growing in the region (+13.6%) vs Booking.com (−9.7%) and
  Expedia (−21.0%).
- **Cleartrip** launched a loyalty program explicitly pitched at reducing "travel anxiety."
  ([Skift](https://skift.com/2026/09/16/cleartrips-new-loyalty-program-is-about-reducing-travel-anxiety/))
- **Sam's Club Travel relaunched** with cruises and a deal with Rocket Travel's founders.
  ([Skift](https://skift.com/2026/09/16/sams-club-travel-relaunches-with-cruises-and-deal-with-rocket-travels-founders/))
- **"The Banks That Don't Want to Become Travel Companies"** — counter-programming to the
  bank-as-OTA thesis. ([Skift](https://skift.com/2026/09/16/the-banks-that-dont-want-to-become-travel-companies/))

### Demand backdrop

- **UN Tourism cut its 2026 global arrivals growth forecast to 1–2%**, down from 3–4% in January.
  International arrivals grew just **0.4% YoY in H1 2026** (~690M travelers): +2% in Q1, then −1%
  in Q2. Middle East conflict (regional arrivals −22%) and elevated costs are the drivers.
- **U.S. tourism slide deepened — −12% in August.**
  ([Skift](https://skift.com/2026/09/17/u-s-tourism-slide-deepens-with-12-drop-in-august/))
- **Brand USA's Covid-era funding windfall is running thin** — a one-time $250M from Congress let
  it operate a nearly fully funded FY26 budget after a dramatic federal cut; that money is about to
  run dry heading into FY27. Bad news compounding the arrivals decline above.
  ([Skift](https://skift.com/2026/09/20/brand-usa-budget-fiscal-2027/))
- **Skift Travel Health Index held flat at 100 in June 2026** — World Cup anticipation did not
  produce a broad lift, but underlying demand stayed stable.
- **Skift Power Rankings 2026** published Sep 16 — top 25 "builders" in travel.
  ([Skift](https://skift.com/2026/09/16/power-rankings-2026/))

---

## Note on scope

Per the task file this is a background refresh with no delivery step, so nothing was sent — no
email, no Slack, no message. I did not hand-edit `public/news-data.js`, `public/index.html`, or
`dist/`: the cron regenerates the first two from RSS and would overwrite anything written here,
overwriting `dist/` publishes nothing (only `kyber deploy` publishes) and would destroy the only
local record of what the live site actually serves. The fix is the `airtool` install, not new
content.
