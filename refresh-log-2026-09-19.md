# OTA Dashboard Refresh Log — 2026-09-19

**Run type:** scheduled background refresh (`refresh-ota-travel-dashboard`)
**Outcome:** ⚠️ **Live site NOT refreshed (5th consecutive blocked run).** No writes were made to
the dashboard, its data files, or anywhere else. Root cause unchanged from the 2026-09-18 log —
but there is **one new and worse datapoint** below.

---

## 🔴 New this run: the nightly cron did not run at all on Sep 18

Yesterday's log pinned the failure to the last step of the pipeline (`kyber deploy` → missing
`airtool`). That is still true. What is new is that the pipeline **didn't execute last night**,
so even the local working copy has now gone stale.

| Check | 2026-09-18 log | Today (2026-09-19) | Change |
|---|---|---|---|
| `airtool is required` failures in `scripts/refresh.log` | 39 | **39** | ⚠️ no new entry |
| Last line in `scripts/refresh.log` | Sep 17, 17:00 PDT | **Sep 17, 17:00 PDT** | ⚠️ unchanged |
| `public/news-data.js` mtime | Sep 17, 17:00 PDT | **Sep 17, 17:00 PDT** | ⚠️ unchanged |
| `public/index.html` mtime | Sep 17, 17:06 PDT | **Sep 17, 17:06 PDT** | ⚠️ unchanged |
| Last successful `kyber deploy` | Jul 6, 14:37 PDT | **Jul 6, 14:37 PDT** | ~10.5 weeks stale |

An identical failure count with no new log line means the 17:00 PT cron on **Thu Sep 18 never
fired** — not that it fired and failed. The most likely cause is the laptop being asleep or
powered off at 17:00 PT (this session also hit a "computer went to sleep" interruption mid-run,
which is consistent). `cron` does not replay missed jobs.

**Revised staleness picture:**

- Live site: frozen at **Jul 6** (~10.5 weeks)
- Local working copy: now **2 days** stale as well, where it used to be same-day fresh

So the "at least the local copy is current" consolation from previous logs no longer holds.

### ✅ The fix (unchanged, one-time, ~2 min, needs Bimpe on VPN)

```bash
# 1. Connect to VPN, then:
cd "/Users/bimpe_abimbola/Claude Projects/ota-dashboard"
kyber                 # lets airtool download + install itself
npm run refresh-news  # regenerate today's content (local copy is 2 days behind)
kyber deploy          # ship it
```

### 🔧 Two follow-ups now clearly worth doing

1. **`airtool` install** — the blocker. Nothing ships until this is done.
2. **Missed-run resilience** — cron at a fixed 17:00 PT on a laptop will keep silently skipping
   days. Options: move to `launchd` with `StartCalendarInterval` (which *does* run missed jobs on
   wake), add a catch-up check on login, or have the script log an explicit "skipped" marker so
   missed runs are visible rather than invisible. Yesterday's log flagged the VPN-timing version of
   this risk; last night showed the sleep/power version of it is real.

---

## Why this session couldn't route around it

Per the task file, no workarounds were attempted. All four routes remain closed:

| Route | Result |
|---|---|
| Claude in Chrome (route the task specifies) | `Claude in Chrome is not connected` — extension unreachable / not signed in (retried 2×) |
| Built-in browser pane | `prototypes.sandcastle.musta.ch is blocked by your organization's policy` |
| In-page refresh control | **Does not exist** — static `template: "html"` prototype; `.news-refresh-btn` CSS is orphaned with no matching element in the markup |
| Run the pipeline from this session | Linux sandbox has no network route to the RSS feeds; `kyber` not installed there; deploy needs VPN + SSO on Bimpe's Mac regardless |

Neither browser failure is an SSO/login wall — no request got far enough to authenticate.

---

## News gathered — 24–48h to Sat Sep 19, 2026

Recorded here since it could not be delivered to the page. Sourced from Skift and PhocusWire.
Note: this is a Saturday run, so the last 24h are light; the substantive items are Sep 17–18.

### Headline story

**U.S. tourism slide deepens — 12% drop in August.** Still the most consequential demand-side
datapoint on the board, and it has not been answered by anything since.
([Skift](https://skift.com/2026/09/17/u-s-tourism-slide-deepens-with-12-drop-in-august/))

### OTA / online travel

- **Skift Power Rankings 2026** published — the top 25 people building in travel; a useful read on
  where the industry thinks power now sits.
  ([Skift](https://skift.com/2026/09/16/power-rankings-2026/))
- **Spotnana CEO previews Skift Global Forum** on the "what happens after the booking" servicing
  gap — a direct challenge to OTA post-booking economics.
  ([Skift](https://skift.com/2026/09/19/skift-global-forum-preview-spotnana-ceo-after-booking-servicing/))
- **Trip.com Group's antitrust reset** could change how hotels compete on its platform.
  ([Skift](https://skift.com/2026/09/16/trip-com-groups-antitrust-reset-could-change-how-hotels-compete-on-its-platform/))
- **Booking's Etraveli block upheld** by Europe's General Court (€1.63B / ~$1.9B), endorsing the
  theory that a dominant firm expanding into an adjacent line can harm competition — leaving
  Expedia the freer hand in M&A.
  ([Skift](https://skift.com/2026/09/10/with-bookings-etraveli-deal-still-blocked-expedia-has-the-edge-in-ma/))
- **Cleartrip launches Elite loyalty**, pitched around reducing "travel anxiety" rather than perks.
  ([Skift](https://skift.com/2026/09/16/cleartrips-new-loyalty-program-is-about-reducing-travel-anxiety/))
- **Sam's Club Travel relaunches** with cruises and a deal with Rocket Travel's founders.
  ([Skift](https://skift.com/2026/09/16/sams-club-travel-relaunches-with-cruises-and-deal-with-rocket-travels-founders/))
- **The banks that don't want to become travel companies** — card issuers pulling back from owning
  the booking layer. ([Skift](https://skift.com/2026/09/16/the-banks-that-dont-want-to-become-travel-companies/))
- **APAC distribution:** Q1 2026 had Agoda as the only major OTA still growing (+13.6%) against
  Booking.com (−9.7%) and Expedia (−21.0%).
  ([PhocusWire](https://www.phocuswire.com/news/distribution/apac-hotel-distribution-slower-growth-rising-regional-otas-direct-channels-under-pressure))
- **Commission pressure:** OTA commissions now typically 15–25% and still climbing; hotels report
  channel share swinging (one cohort down to 22% of bookings from 30%).
  ([PhocusWire](https://www.phocuswire.com/hotels-booking-increasingly-go-separate-ways))

### AI & agentic booking — still the dominant theme

- **Booking Holdings is running 5 AI bets** — planning tools at Priceline, Agoda and Booking.com
  plus two stealth greenfield ventures. Priceline's agentic *Penny* is the early standout on CSAT,
  engagement and conversion. Agoda's is next.
  ([Skift](https://skift.com/2026/09/14/bookings-5-ai-experiments-and-why-agodas-is-next/))
- **Expedia took the opposite path** — scrapped the all-in-one Romie chatbot, moved to a
  multi-agent architecture, acquired trip-planning startup Layla.
- **What it takes to make AI booking work at scale** — HotelPlanner is licensing its voice booking
  stack (Reservations.ai) to OTAs, TMCs and distributors, arguing in-house builds take 3–4 years
  versus weeks to deploy.
  ([Skift](https://skift.com/2026/09/17/reservations-ai-travel-booking-technology/))
- **IHG's CMO on making hotels "legible to AI"** — SGF preview; supply-side answer to agentic
  discovery. ([Skift](https://skift.com/2026/09/18/skift-global-forum-preview-ihg-ai-hotel-visibility/))
- **Meta has entered travel** with an AI agent capable of booking (via Duffel) — a new distribution
  entrant after TikTok GO. Skift's hospitality podcast flagged it as the thing STR operators
  should be watching.

### Airbnb / short-term rental 🏠

- **EU Affordable Housing Act proposed** (early Sep) — gives local authorities firmer legal footing
  to restrict STRs in housing-pressured areas. The most significant regulatory overhang for Airbnb
  right now. ([Skift](https://skift.com/2026/09/09/eu-proposed-rules-short-term-rentals/))
- **EU STR Data Regulation (2024/1028)** in force since May 20, 2026 — registration numbers must
  appear on listings across Airbnb, Booking.com and others.
- **Enforcement biting in Spain** — tens of thousands of delistings on national registration
  requirements; >10,000 Airbnb listings removed in Barcelona. Austin is running one of the
  strongest U.S. platform-enforcement pushes of 2026.
- **Airbnb–Tripadvisor Experiences partnership** (Aug) — Viator/Tripadvisor inventory becomes
  bookable on Airbnb later in 2026, replacing the build-your-own strategy.
  ([Skift](https://skift.com/2026/08/11/airbnb-partners-with-tripadvisor-experiences-drops-build-your-own-strategy/))
- **Airbnb added rental cars** in May, stepping directly onto Expedia's and Booking's turf.
  ([Skift](https://skift.com/2026/05/20/airbnb-adds-rental-cars-stepping-onto-expedia-and-bookings-turf/))

### Funding & M&A

- **Q1 2026 was a low** — ~$1B across 44 rounds, down from 66 rounds / ~$1.2B a year earlier. B2B
  travel tech is still where the money goes; AI has made the environment harder, not easier.
  ([PhocusWire](https://www.phocuswire.com/news/startups/travel-startup-funding-acquisitions-q1-2026))
- **Expedia / CarTrawler** expected to close H2 2026; Expedia also picked up Tiqets this year.
- **Long Lake Management acquired Amex GBT** for $6.3B; **Apollo agreed a $5.7B takeover of
  easyJet**.
- **Banyan Group buys Newmark**, adding 26 asset-light hotels in Africa.
  ([Skift](https://skift.com/2026/09/17/singapores-banyan-group-buys-newmark-to-add-26-hotels-in-africa/))
- **HalalBooking raised $2M** for a marketing push.
  ([PhocusWire](https://www.phocuswire.com/halalbooking-funding))

### Hotels, airlines & climate

- **Hilton pivots to mid-market in Saudi Arabia** — the luxury boom is largely built; franchising
  is the next leg, with Turkey as the proof case.
  ([Skift](https://skift.com/2026/09/18/hilton-has-luxury-coming-out-of-its-ears-in-saudi-arabia-now-it-wants-the-middle-market/))
- **H World's Grand Ji** is building a distinctly Chinese premium brand.
  ([Skift](https://skift.com/2026/09/18/h-world-grand-ji-chinese-premium-hospitality/))
- **Minor Hotels** signs its first Hanoi property, targeting 2028.
  ([Skift](https://skift.com/2026/09/17/minor-hotels-signs-first-hanoi-property-targets-2028-opening/))
- **Heathrow:** UK climate advisors say expansion is incompatible with net-zero; demand management
  is now openly on the table.
  ([Skift](https://skift.com/2026/09/18/cutting-passenger-demand-may-be-only-way-to-save-heathrows-net-zero-case/))
- **Ultra-low-cost carriers squeezed by jet fuel**, little room to raise fares, renewed push for
  tax relief.
  ([Skift](https://skift.com/2026/09/17/ultra-low-cost-airlines-renew-push-for-tax-break-to-offset-soaring-jet-fuel-costs/))
- **IndiGo** holds low base fares but is repricing extras.
  ([Skift](https://skift.com/2026/09/18/indigos-low-fares-remain-the-extras-are-getting-pricier/))
- **AirAsia** pushes back on rivals taking its Malaysian slots.
  ([Skift](https://skift.com/2026/09/18/airasia-pushes-back-on-rivals-taking-its-place-in-malaysia/))
- **Europe issued €430M in SAF permits** last year.
  ([Skift](https://skift.com/2026/09/17/europe-handed-out-e430-million-in-saf-permits-last-year-see-which-airlines-got-the-most/))
- **Skift Travel Health Index** held flat at 100 in June 2026 — the World Cup did not lift global
  travel metrics, but underlying demand is stable.

### Diary — ⏰ this is the deadline

**Skift Global Forum, New York, Sep 22–24 — Tuesday, three days out.** CEOs of Airbnb, Booking
Holdings, Expedia, Hilton and Uber, plus OpenAI chairman Bret Taylor. Chesky has said he is "not
happy" with Airbnb's growth rate and is pitching a rebuild around experiences, hotels and
international expansion.

Yesterday's log said "if the dashboard is going to be fixed, before Monday is the moment." That is
now **this weekend**. If the dashboard is meant to be useful to anyone during SGF week, the
`airtool` install has to happen before Monday — and since last night's cron was also skipped, the
content will need a manual `npm run refresh-news` at the same time.

---

## Note on scope

Per the task file this is a background refresh with no delivery step, so nothing was sent — no
email, no Slack, no message. I did not hand-edit `public/news-data.js` or `public/index.html`: the
cron regenerates them from RSS and would overwrite anything written here, and without a working
`kyber deploy` it would not reach the live site either way. The fix is the `airtool` install, not
new content.
