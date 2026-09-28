# OTA Dashboard Refresh Log — 2026-09-22

**Run type:** scheduled background refresh (`refresh-ota-travel-dashboard`)
**Outcome:** ⚠️ **Live site NOT refreshed (8th consecutive blocked run).** No writes were made to
the dashboard, its data files, or anywhere else. Root cause unchanged since 2026-08-06: `airtool`
is not installed, so `kyber` cannot run, so nothing can deploy.

**One thing genuinely improved:** the cron **ran last night** after three skipped nights. Content
generation succeeded; only the deploy step failed.

---

## 🟡 Cron is executing again — deploy is the only broken link

| Check | 2026-09-21 log | Today (2026-09-22) | Change |
|---|---|---|---|
| `airtool is required` failures in `scripts/refresh.log` | 39 | **40** | ✅ +1 — job ran |
| Last line in `scripts/refresh.log` | Sep 17, 17:00 PDT | **Sep 21, 17:00 PDT** | ✅ advanced |
| `public/news-data.js` mtime | Sep 17, 17:00 PDT | **Sep 21, 17:00 PDT** | ✅ regenerated |
| `public/index.html` mtime | Sep 17, 17:06 PDT | **Sep 21, 17:06 PDT** | ✅ re-inlined (225.8 KB) |
| `dist/` mtime | Sep 3, 21:13 | **Sep 3, 21:13** | unchanged |
| Last successful `kyber deploy` | Jul 6, 14:37 PDT | **Jul 6, 14:37 PDT** | ~11.1 weeks stale |

Last night's run pulled **32 MECE articles across 4 categories** (ota 8 / hotels 8 / airlines 8 /
tech 8) from 277 raw articles, inlined them, then died on the same line:

```
airtool is required to run kyber. Connect to VPN and run kyber again so it can be downloaded and installed.
```

Feed-level 403s persist and are worth noting separately: **Travel Weekly**, **Phocuswire** and
**Hospitality Net** all returned 403 to the scraper, so the `ota` and `hotels` buckets are drawing
from a narrower source set than intended even when the pipeline works.

**Staleness picture:**

- Live site: frozen at **Jul 6** (~11.1 weeks)
- Local working copy: **1 day** stale — back to near-fresh

### ✅ The fix (unchanged, one-time, ~2 min, needs Bimpe on VPN)

```bash
# 1. Connect to VPN, then:
cd "/Users/bimpe_abimbola/Claude Projects/ota-dashboard"
kyber                 # lets airtool download + install itself
kyber deploy          # ship it — local content is already current as of Sep 21
```

`npm run refresh-news` is no longer strictly needed first; last night's cron already regenerated
the content. One `kyber` + one `kyber deploy` would put an 11-week-stale live site back to current.

### 🔧 Follow-ups

1. **`airtool` install** — still the only blocker. Nothing ships until this is done.
2. **Missed-run resilience** — downgraded from urgent, but not resolved. Last night ran; Sep 18/19/20
   were silently skipped by the fixed 17:00 PT cron. `launchd` with `StartCalendarInterval` (which
   *does* run missed jobs on wake) or a "skipped" marker written on login would make gaps visible.
3. **Feed 403s** — three sources are being turned away. Worth a user-agent or feed-URL review so the
   OTA bucket isn't quietly thinned.

---

## Why this session couldn't route around it

Per the task file, no workarounds were attempted. All four routes re-verified this run:

| Route | Result |
|---|---|
| Claude in Chrome (route the task specifies) | `Claude in Chrome is not connected` — extension unreachable / not signed in (retried 2×) |
| Built-in browser pane | `prototypes.sandcastle.musta.ch is blocked by your organization's policy` |
| In-page refresh control | **Does not exist** — re-verified against the Sep 21 rebuild of `public/index.html`: **0** `<input>`, **0** `<textarea>`, and every `onclick` handler is a view toggle (`setCoView`, `setView`, `showTable`, `switchDataView`, `switchTab`, `toggleCollapsible`) |
| Run the pipeline from this session | `which kyber airtool` → nothing (only `/usr/bin/node`, `/usr/bin/npm`); deploy needs VPN + SSO on Bimpe's Mac regardless |

Also worth noting: several internal MCP servers failed this session with
`network unreachable: cannot validate token or authenticate (try again when online)` (Gandalf) and
30s connect timeouts (Glean, data-warehouse, GitHub, Tableau, Oracle). **The Mac is very likely off
VPN right now**, which is consistent with the sandcastle block and means the fix above can't be run
until VPN is back up.

Neither browser failure is an SSO/login wall — no request got far enough to authenticate, so
step 2's stop condition ("if a login wall appears, note it and stop") doesn't technically apply; the
block is upstream of login. Step 3 of the task ("look for an input field / refresh button") is not
blocked by circumstance, it is **impossible by design** for this prototype: it's a static
`template: "html"` prototype with no mechanism to feed news in through the page. The only supported
path is `npm run refresh-news` → `kyber deploy`.

---

## News gathered — to Tue Sep 22, 2026

Recorded here since it could not be delivered to the page. General web search worked this run, plus a
direct fetch of the Skift homepage, so the headline set is current as of this morning.

### Headline story — Skift Global Forum week is here

Three Skift events run **today, Sep 22**: the inaugural **Skift Live Tourism Summit** (New York,
80+ senior leaders on the business of the live economy), the inaugural **Skift Creator Summit**
(New York, 100+ marketing/growth leaders on creator-led travel demand), and **Skift Meetings Forum**
(Dallas). **Skift Global Forum 2026** itself runs **Sep 23–24** at North Javits — note the dates
firmed up to two days; earlier previews had said Sep 22–24. Theme: *Travel's Great Recalibration*.
Airbnb, Booking Holdings, Expedia, Hilton and Uber CEOs plus OpenAI chairman Bret Taylor are on the
program.

Skift also **relaunched itself today** — "The New Skift" and "The Next Dollar" both published this
morning, rebuilding the publication around **Skift Intelligence**, a decision-oriented layer that
ties news to actions. Relevant to this dashboard's purpose: a competitor-adjacent product is now
pitching exactly the "what should I do about this" framing.
([The New Skift](https://skift.com/2026/09/22/the-new-skift/) ·
[The Next Dollar](https://skift.com/2026/09/22/the-next-dollar-who-moves-travels-money/))

The prior four logs flagged that the dashboard needed fixing *before* SGF week. **That window has
now closed** — the conference starts tomorrow and the board is serving July content.

### 🏠 Airbnb — lead OTA story, two days running

- **"Airbnb's Pivot: Inside Its New Push Into Hotels"** (Sep 21) — the deep-dive on the hotels
  strategy, published the day before Chesky takes the SGF stage. This is the single most
  Airbnb-relevant item in the cycle.
  ([Skift](https://skift.com/2026/09/21/airbnbs-pivot-inside-its-new-push-into-hotels/))
- **"What Uber and Airbnb Reveal About Expanding Beyond the Core"** (Rafat Ali, Sep 20) — frames both
  companies' hotel pushes as a test of which advantage travels further: **Uber has frequency, Airbnb
  has travel intent.**
  ([Skift](https://skift.com/2026/09/20/what-uber-and-airbnb-reveal-about-expanding-beyond-the-core/))
- **Tripadvisor/Viator partnership** — a selection of Tripadvisor Group's 425,000+ tours, activities
  and attractions becomes bookable on Airbnb later this year; Airbnb dropped its build-your-own
  experiences strategy in favor of the partnership. Read: Airbnb conceding it needs mainstream scale.
  ([Skift](https://skift.com/2026/08/11/airbnb-partners-with-tripadvisor-experiences-drops-build-your-own-strategy/))
- **Pepijn Rijvers named chief business officer** — formerly Tripadvisor Group CBO, 12 years at
  Booking.com before that. A pointed hire given the hotels push.
- **Delta partnership expanded** — SkyMiles members earn 3 miles per $1 on qualifying Airbnb
  experiences and services, 1 mile per $1 on stays.
- **$250M Housing Accelerator** (Sep 14) — last-dollar financing intended to unlock >$5B of housing
  capital over a decade, opening with affordable housing in **Austin, Texas**.

### Sponsored listings — the new monetization fight

**"Sponsored Listings Are Spreading Across Online Travel — Just as AI Agents Threaten to Ignore
Them"** (Sep 22). Expedia's **Vrbo** launched pay-per-booked-night sponsored listings, letting a
rental pay to rank higher; **Airbnb has called the same thing a billion-dollar opportunity.** The
tension the piece names is the interesting part: paid placement is expanding at exactly the moment
agentic booking surfaces may route around ranked-search UI entirely.
([Skift](https://skift.com/2026/09/22/sponsored-listings-are-spreading-across-online-travel-just-as-ai-agents-threaten-to-ignore-them/))

### Regulatory

- **EU Affordable Housing Act** — proposal presented **Sep 9**. Would let member states and cities
  restrict purchase/occupation of residential property for non-primary-residence purposes, and cap
  short-term rentals where local authorities can show they contribute to housing shortage.
- **Industry pushback** — CCIA argues the new rules **lack enforcement guardrails and redress** for
  operators hit by restrictions, and that Europe is moving to restrict *before* it has comparable
  EU-wide data to justify it. The **STR Data Regulation (2024/1028)** only took effect **May 20,
  2026**. ([CCIA](https://ccianet.org/news/2026/09/new-eu-rules-on-short-term-rentals-lack-enforcement-and-redress-for-restrictions))
- **Booking/Etraveli** — EU General Court upheld the block on the €1.63B acquisition (judgment
  Sep 9). First EU court endorsement of a **"reverse leveraging" / entrenchment** theory in a
  platform merger. Practical read-through: **Expedia has the freer hand in M&A.**
- **HOTREC European Hotel Distribution Study 2026** — Booking Holdings + Expedia = **85.4% of
  European OTA bookings**; Booking Holdings alone **68.8%** (up from ~60% in 2013); Booking.com by
  itself **66.1%**.
  ([Travel Daily News](https://www.traveldailynews.com/statistics-trends/booking-and-expedia-control-85-4-of-europes-ota-bookings/))
- **DMA** — Booking.com designated a gatekeeper May 2024, says it is now compliant; parity
  requirements removed from July. No new fine found this cycle.
- **Spanish criminal complaint** (Feb 2026) against eDreams ODIGEO, Booking.com and an Expedia
  subsidiary — unresolved background.

### AI & agentic booking

- **56% of U.S. leisure travelers now use AI for travel planning.** ChatGPT Agent Mode has planned
  complete multi-day trips by autonomously searching Airbnb and opening the reservation page.
- **Google is building agentic hotel and flight booking into AI Mode.** Launch partners: Booking.com,
  Expedia, Marriott, IHG, Choice, Wyndham — i.e. the major OTAs participating as *suppliers into
  Google's agent* rather than resisting it. Skift's own intelligence panel claims **metasearch
  click-through down 31% in tested markets** where AI Overviews surface hotel prices directly.
- **Supplier-side response:** IHG CCMO Heather Balsley on "making hotels legible to AI" — explicit
  optimization for agentic discovery.
  ([Skift](https://skift.com/2026/09/18/skift-global-forum-preview-ihg-ai-hotel-visibility/))
- **Ex-Remington CEO Sloan Dean is building an "AI-native" hotel operator** (exclusive, Sep 21) —
  the operating-company version of the same bet.
  ([Skift](https://skift.com/2026/09/21/ex-remington-ceo-is-building-an-ai-native-hotel-operator-exclusive/))
- **Expedia's Explore 2026:** new AI traveler experiences, **CLEAR** and **Uber** partnerships, an
  AllTrails tie-up, plus 12 partner-facing products across Vrbo and Escapia.
- **Agoda:** multi-product booking engine (hotels + flights + activities in one transaction); Aug 17
  replaced its Yield Control System with an AI-driven **Partner Portal**.
- **Phocuswright:** 95% of travel startups are using or actively exploring AI.
- **Spotnana CEO Steve Singh** on what happens *after* the booking — servicing as travel's unsolved
  cost center. ([Skift](https://skift.com/2026/09/19/skift-global-forum-preview-spotnana-ceo-after-booking-servicing/))

### Funding / M&A

- **Q1 2026:** ~$1B across **44 rounds**, down from 66 rounds / ~$1.2B in Q1 2025 — deal *volume* at
  a new low, mostly Series A.
  ([PhocusWire](https://www.phocuswire.com/news/startups/travel-startup-funding-acquisitions-q1-2026))
- **Q2 2026:** **Long Lake Management acquired Amex GBT for $6.3B** (quarter's largest);
  **Expedia–CarTrawler** (closing H2 2026); **Juniper–Deem**; **Lighthouse–Hotelrank.ai**.
  ([PhocusWire](https://www.phocuswire.com/news/startups/startup-funding-mergers-acquisition-q2-2026))
- **Expedia** also acquired **Tiqets** and **Layla** (AI-native trip planning) this year; Amadeus
  acquired **SkyLink**; **HeyMax** raised an $11M Series A.
- **Banyan Group completed its Newmark acquisition** — 26 asset-light hotels in Africa.

### OTA market structure

- **U.S. OTA gross bookings rose 4% in 2025 to $100.3B** — ~**20% of all U.S. travel gross
  bookings**, projected **21% by 2028**.
- **2025 global rankings:** Booking.com, Expedia, Airbnb held the top three; **Despegar** moved up and
  **Tiket.com** entered the global top 10 for the first time.
- **Commissions** — Skift now puts OTA commission fees at a record **22–28%**, up from the 15–25%
  range carried in earlier logs. Direct-booking breakeven has shifted materially.
- **APAC divergence** persists: in Q1 2026 Agoda was the only major OTA still growing in the region
  (+13.6%) vs Booking.com (−9.7%) and Expedia (−21.0%).

### Demand backdrop

- **UN Tourism cut its 2026 global arrivals growth forecast to 1–2%**, down from 3–4% in January.
  H1 2026 arrivals grew just **0.4% YoY** (~690M): +2% in Q1, −1% in Q2. Middle East conflict
  (regional arrivals −22%) and elevated costs are the drivers.
- **U.S. tourism slide deepened — −12% in August.**
  ([Skift](https://skift.com/2026/09/17/u-s-tourism-slide-deepens-with-12-drop-in-august/))
- **Brand USA's Covid-era funding windfall is running thin** — a one-time $250M from Congress funded
  a near-full FY26 budget after a dramatic federal cut; it runs dry heading into FY27.
  ([Skift](https://skift.com/2026/09/20/brand-usa-budget-fiscal-2027/))
- **K-shaped demand hardening** — Skift projects mid-scale RevPAR **−4% to −7%** against the Q3 2025
  baseline.
- **FAA equipment outage** triggered a ground stop and widespread delays/cancellations at New York–area
  and Philadelphia airports (Sep 21).
  ([Skift](https://skift.com/2026/09/21/equipment-outage-snarls-air-travel-in-new-york-philadelphia/))
- **Heathrow:** UK climate advisors told the government expansion is incompatible with climate goals;
  demand management is on the table if emissions tech doesn't materialize.
  ([Skift](https://skift.com/2026/09/18/cutting-passenger-demand-may-be-only-way-to-save-heathrows-net-zero-case/))

---

## Note on scope

Per the task file this is a background refresh with no delivery step, so nothing was sent — no email,
no Slack, no message. I did not hand-edit `public/news-data.js`, `public/index.html`, or `dist/`: the
cron regenerates the first two from RSS and would overwrite anything written here, and overwriting
`dist/` publishes nothing (only `kyber deploy` publishes) while destroying the only local record of
what the live site actually serves. The local content is already current as of Sep 21 — **the fix is
the `airtool` install plus one `kyber deploy`, not new content.**
