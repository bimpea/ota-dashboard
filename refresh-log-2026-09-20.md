# OTA Dashboard Refresh Log — 2026-09-20

**Run type:** scheduled background refresh (`refresh-ota-travel-dashboard`)
**Outcome:** ⚠️ **Live site NOT refreshed (6th consecutive blocked run).** No writes were made to
the dashboard, its data files, or anywhere else. Root cause unchanged since 2026-08-06.

---

## 🔴 The cron has now missed two consecutive nights

Yesterday's log flagged that the Sep 18 17:00 PT cron never fired. Sep 19 didn't either.

| Check | 2026-09-19 log | Today (2026-09-20) | Change |
|---|---|---|---|
| `airtool is required` failures in `scripts/refresh.log` | 39 | **39** | ⚠️ no new entry |
| Last line in `scripts/refresh.log` | Sep 17, 17:00 PDT | **Sep 17, 17:00 PDT** | ⚠️ unchanged |
| `public/news-data.js` mtime | Sep 17, 17:00 PDT | **Sep 17, 17:00 PDT** | ⚠️ unchanged |
| `public/index.html` mtime | Sep 17, 17:06 PDT | **Sep 17, 17:06 PDT** | ⚠️ unchanged |
| `dist/` mtime | Sep 3, 21:13 | **Sep 3, 21:13** | unchanged |
| Last successful `kyber deploy` | Jul 6, 14:37 PDT | **Jul 6, 14:37 PDT** | ~10.7 weeks stale |

A flat failure count with no new log line means the job **didn't execute**, not that it executed
and failed. Two skipped nights in a row makes the laptop-asleep-at-17:00-PT theory from yesterday
look correct rather than incidental. `cron` does not replay missed jobs.

**Staleness picture:**

- Live site: frozen at **Jul 6** (~10.7 weeks)
- Local working copy: **3 days** stale (was same-day fresh through Sep 17)

### ✅ The fix (unchanged, one-time, ~2 min, needs Bimpe on VPN)

```bash
# 1. Connect to VPN, then:
cd "/Users/bimpe_abimbola/Claude Projects/ota-dashboard"
kyber                 # lets airtool download + install itself
npm run refresh-news  # regenerate content (local copy is 3 days behind)
kyber deploy          # ship it
```

### 🔧 Two follow-ups

1. **`airtool` install** — the blocker. Nothing ships until this is done.
2. **Missed-run resilience** — a fixed 17:00 PT cron on a laptop will keep silently skipping days;
   it has now skipped two in a row. Options: `launchd` with `StartCalendarInterval` (which *does*
   run missed jobs on wake), a catch-up check on login, or have the script write an explicit
   "skipped" marker so missed runs are visible instead of invisible.

---

## Why this session couldn't route around it

Per the task file, no workarounds were attempted. All four routes remain closed:

| Route | Result |
|---|---|
| Claude in Chrome (route the task specifies) | `Claude in Chrome is not connected` — extension unreachable / not signed in (retried 3×; one call also timed out after 180s) |
| Built-in browser pane | `prototypes.sandcastle.musta.ch is blocked by your organization's policy` |
| In-page refresh control | **Does not exist** — re-verified this run. Static `template: "html"` prototype; every `<button>` in `public/index.html` is a tab or view toggle (`switchTab`, `showTable`, `setView`, `setCoView`, `toggleCollapsible`). No `<input>`, no `<textarea>`, no refresh/update control. The `.news-refresh-btn` CSS rule is orphaned with no matching element in the markup. |
| Run the pipeline from this session | Linux sandbox has no network route to the RSS feeds; `which kyber airtool` → nothing (only `/usr/bin/node`, `/usr/bin/npm`); deploy needs VPN + SSO on Bimpe's Mac regardless |

Neither browser failure is an SSO/login wall — no request got far enough to authenticate. Step 3 of
the task ("look for an input field / refresh button") is not blocked by circumstance, it is
**impossible by design** for this prototype: there is no mechanism to feed news in through the page.
The only supported path is `npm run refresh-news` → `kyber deploy`.

---

## News gathered — to Sun Sep 20, 2026

Recorded here since it could not be delivered to the page. This run's search access was limited to
general web search (no direct Skift/PhocusWire fetch), so this is thinner than yesterday's and
leans on items confirmable from multiple outlets. **Yesterday's log (2026-09-19) remains the
better content snapshot** and should be the one used if a manual refresh happens.

### Headline story

**UN Tourism cut its 2026 global arrivals growth forecast to 1–2%**, down from 3–4% in January.
International arrivals grew just **0.4% YoY in H1 2026** (~690M travelers): +2% in Q1, then −1% in
Q2. Drivers are the Middle East conflict (regional arrivals −22%) and elevated travel costs.
Announced Sep 17; still propagating through trade coverage over the weekend. This is the
demand-side frame for everything else on the board, and it pairs with the U.S. tourism slide
(−12% in August) that led yesterday's log.
([Xinhua](https://english.news.cn/20260918/105bdbdeb1794426be1d2d61b4bcacc9/c.html),
[Hospitality Net](https://www.hospitalitynet.org/news/4134434/international-tourism-holds-steady-with-04-growth-in-first-half-of-2026-as-middle-east-conflict-and-rising-costs-weigh-on-momentum),
[Nation Thailand](https://www.nationthailand.com/news/world/40071190))

### Regulatory — the Booking/Etraveli ruling is the durable story

- **EU General Court upheld the block on Booking Holdings' €1.63B Etraveli acquisition**
  (judgment Sep 9). First time the EU courts have endorsed a **"reverse leveraging" / entrenchment**
  theory of harm in a platform merger: flight bookings are a low-margin customer-acquisition
  channel feeding Booking's high-margin hotel business, so even a small share increment can
  entrench dominance where network effects are present. Practical read-through: **Expedia now has
  the freer hand in M&A.**
  ([Skift](https://skift.com/2026/09/10/with-bookings-etraveli-deal-still-blocked-expedia-has-the-edge-in-ma/),
  [Goodwin](https://www.goodwinlaw.com/en/insights/publications/2026/09/alerts-technology-antc-what-booking-etraveli-means-for-platform-deals),
  [Concurrences](https://www.concurrences.com/en/bulletin/news-issues/september-2026-iii/the-eu-general-court-upholds-the-prohibition-of-an-online-travel-platform-s))
- **Spanish criminal complaint** (filed Feb 2026) against eDreams ODIGEO, Booking.com and an
  Expedia subsidiary by a coalition of civil society organisations — background, unresolved.

### AI & agentic booking — still the dominant theme

- **Google is building agentic hotel and flight booking into AI Mode**, two weeks after shipping
  the same for restaurants, event tickets and wellness appointments. Named launch partners:
  **Booking.com, Expedia, Marriott, IHG, Choice and Wyndham.** The significant part is that the
  major OTAs are participating as suppliers into Google's agent rather than resisting it.
  ([PhocusWire](https://www.phocuswire.com/google-agentic-travel-booking-ai))
- **Expedia's Explore 2026** announcements: new AI traveler experiences, marketplace expansion,
  partnerships with **CLEAR** and **Uber**, an AllTrails tie-up, and the Expedia Trails Fund
  philanthropy program — positioning Expedia past booking into the full trip.
  ([Expedia Newsroom](https://www.expedia.com/newsroom/expedia-group-unveils-new-ai-experiences-expands-travel-ecosystem-and-launches-philanthropy-program-at-explore-2026/))
- **Expedia research on full-trip bundling** — travelers increasingly want to plan and manage the
  whole trip on one trusted platform; framed as a growth opening for whoever owns that surface.
  ([Expedia IR](https://ir.expediagroup.com/news-and-events/news/news-details/2026/EXPEDIA-GROUP-UNVEILS-NEW-GLOBAL-RESEARCH-SHOWING-TRAVELER-DEMAND-FOR-FULL-TRIP-PLANNING/default.aspx))
- **Agoda launched a multi-product booking engine** — hotels, flights and activities in a single
  transaction. Directly relevant to the bundling thesis above.
  ([PhocusWire](https://www.phocuswire.com/travel-tech-news-briefs/2026/may-15))
- **Phocuswright on "agentic travelers"** — a sizable segment is willing to transact through AI;
  skews younger, highly AI-engaged, commercially valuable.
  ([PhocusWire](https://www.phocuswire.com/partner-content/wex-agentic-traveler-is-travel-ready-ai-booking-demand))

### OTA market structure

- **U.S. OTA gross bookings rose 4% in 2025 to $100.3B.** OTAs are now ~**20% of all U.S. travel
  gross bookings**, projected to hit **21% by 2028**. Phocuswright's framing: the "13% number"
  explaining why OTAs still need hotels to keep working.
  ([PhocusWire](https://www.phocuswire.com/news/online/ota-market-essentials-2026-phocuswright-research))
- **2025 global OTA rankings:** Booking.com, Expedia and Airbnb held the top three;
  **Despegar moved up** and **Tiket.com entered the global top 10 for the first time.**
- **Commission pressure and APAC divergence** carried over from yesterday's log: commissions
  typically 15–25% and climbing; in Q1 2026 Agoda was the only major OTA still growing in APAC
  (+13.6%) versus Booking.com (−9.7%) and Expedia (−21.0%).

### Airbnb 🏠

- **$250M Housing Accelerator** announced Sep 14 — last-dollar financing intended to unlock >$5B
  of housing capital over a decade, opening with affordable housing in **Austin, Texas**. Airbnb
  will also back pro-housing policy reform (zoning, permitting, building codes) and will publish a
  housing-policy dataset later in 2026. Stock rose on the announcement. Read it as a pre-emptive
  answer to the STR-regulation overhang — note Austin is simultaneously running one of the
  strongest U.S. platform-enforcement pushes of 2026.
  ([Airbnb Newsroom](https://news.airbnb.com/announcing-housing-accelerator))
- **Brian Chesky spoke at Goldman Sachs Communacopia + Technology** on Sep 8.
- Regulatory overhang unchanged from yesterday: **EU Affordable Housing Act** proposal, **EU STR
  Data Regulation 2024/1028** in force since May 20, and heavy Spanish delistings.

### Hotels & M&A

- **Banyan Group completed its Newmark acquisition** — 26 asset-light hotels in Africa.
  ([Skift](https://skift.com/2026/09/17/singapores-banyan-group-buys-newmark-to-add-26-hotels-in-africa/))
- **Expedia's CarTrawler** deal expected to close H2 2026; **Tiqets** already acquired this year;
  **Layla** (AI-native trip planning, founded 2023) acquired for the agentic stack.
- Weekend trade coverage was aviation-led — World Airline Awards, UK air-traffic-control scrutiny,
  airport investment — with hospitality centered on Michelin Keys and Hilton's J.D. Power results.
  Light, as expected for a Saturday/Sunday.
  ([Travel PR News](https://travelprnews.com/skytrax-wins-uk-atc-scrutiny-and-hotel-accolades-define-a-packed-day-in-global-travel-2/travel-press-release/2026/09/20/))

### Diary — ⏰ deadline is now

**Skift Global Forum, New York, Sep 22–24 — Tuesday, two days out.** CEOs of Airbnb, Booking
Holdings, Expedia, Hilton and Uber, plus OpenAI chairman Bret Taylor. Chesky has said he is "not
happy" with Airbnb's growth rate and is pitching a rebuild around experiences, hotels and
international expansion.

The last three logs said the dashboard needed fixing before SGF week. **That window closes
tomorrow.** If it is meant to be useful during the conference, the `airtool` install plus a manual
`npm run refresh-news` has to happen today or Monday morning — and because the cron has now missed
two nights, the content regeneration is no longer optional, it's required.

---

## Note on scope

Per the task file this is a background refresh with no delivery step, so nothing was sent — no
email, no Slack, no message. I did not hand-edit `public/news-data.js`, `public/index.html`, or
`dist/`: the cron regenerates the first two from RSS and would overwrite anything written here,
overwriting `dist/` publishes nothing (only `kyber deploy` publishes) and would destroy the only
local record of what the live site actually serves. The fix is the `airtool` install, not new
content.
