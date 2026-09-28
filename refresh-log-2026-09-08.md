# OTA Dashboard Refresh — Run Log

**Run date:** 2026-09-08 06:05 PDT
**Task:** `refresh-ota-travel-dashboard`
**Outcome:** ⚠️ BLOCKED — news gathered; live site **not** refreshed. Nineteenth consecutive non-deploying run.

---

## Blockers

### Blocker 1 — no browser (blocks steps 2 and 3)

The Claude in Chrome extension is unreachable. Unchanged since 2026-08-07 — now 33 days.

- `navigate` → "Claude in Chrome is not connected"
- `tabs_context_mcp{createIfEmpty:true}` → same (retried after an 8s wait)

`https://prototypes.sandcastle.musta.ch/ota-dashboard/` was **never reached**, so no
input field or refresh control could be located or used. To be explicit: this is
**not** an SSO failure and **not** a login wall — the page was never requested. No
workarounds were attempted: no curl, no Python, no archive mirrors.

**Fix:** install / sign in to the Claude in Chrome extension on the Mac
(https://chromewebstore.google.com/detail/fcoeoabgfenejglbffodgkkbkcdhcgfn), open the
side panel, sign in with the same account as the desktop app, then re-run the task.

### Blocker 2 — `kyber deploy` still failing on the Mac cron (VPN / airtool)

Unchanged. Tail of `scripts/refresh.log`:

```
Mon Sep  7 17:00:01 PDT 2026: Starting news refresh...
✅ 32 MECE articles across 4 categories  (Generated: Sep 7, 2026, 5:00 PM PDT)
✅ News data inlined into public/index.html (225.4 KB total)
airtool is required to run kyber. Connect to VPN and run kyber again so it can be
downloaded and installed.
```

| File | Last written |
|---|---|
| `public/news-data.js` (staged) | Sep 7 17:00 |
| `public/index.html` (staged) | Sep 7 17:06 |
| `dist/index.html` (last successful build/deploy) | Sep 3 21:13 |

The live site is still serving **Sep 3** content — now **five days** stale. A **Sep 7**
build is staged in `public/` and has never shipped.

**Fix:** connect to VPN on the Mac and run `kyber deploy` from
`~/Claude Projects/ota-dashboard` once so airtool installs. The deploy step cannot be
run from this session — the shell here is an isolated Linux sandbox with no VPN and
no kyber/airtool.

### Blocker 3 — feed sources still erroring (recurring)

Same three failures every run inside `scripts/fetch-news.cjs`:

- **Travel Weekly: 403** and **Phocuswire: 404** on the `ota` category
- **Hospitality Net: 403** on `hotels`

Consequence: `ota` had 54 raw candidates vs 95 (`airlines`) and 106 (`tech`), so the
OTA bucket keeps padding with stale evergreen items. Worth updating those three feed
URLs.

Note on Blocker 3 from the Sep 7 log (missing Sep 5 cron run): **resolved** — the
Sep 7 17:00 run fired and logged normally, so the Sep 5 gap looks like a one-off
(machine asleep) rather than a broken crontab.

No files were modified this run other than this log. `public/` was left untouched (the
5:00 PM cron owns it). No summary, email, or Slack message was sent — per task spec,
background refresh only.

---

## Currently staged dashboard content (in `public/`, awaiting deploy)

Generated Sep 7 2026 5:00 PM PDT — 32 articles, 8 per category (see
`public/news-data.js` for the full list).

---

## News gathered this run (web search, 2026-09-08)

Search coverage was noticeably thinner than prior runs — queries scoped to Sep 7–8
returned mostly evergreen and hub pages rather than fresh datelined stories. Items
below are the current state of play; where an item is carried forward from the Sep 7
run rather than newly surfaced today, it's marked **(carried)**.

### Regulatory

- **EU Affordable Housing Act — due tomorrow, Sep 9.** The draft lets cities cap
  short-term rentals in housing-shortage areas using data-driven indicators such as
  price-to-income ratios, aimed at commercial multi-property operators rather than
  single-listing hosts. Still the most consequential near-term item for Airbnb and
  Booking. Framing to watch: Europe is preparing a law to *support* city-level
  crackdowns, not to impose a single EU-wide cap. **(carried — becomes live news
  tomorrow)**
- **EU Regulation 2024/1028** (STR transparency) in force since 2026-05-20 across all
  27 member states. Platforms must collect and verify registration numbers before
  listing, display them, and transmit standardized monthly activity data — nights
  booked, guest counts, property addresses — to national Single Digital Entry Points.
- **Booking.com rate-parity litigation continues.** Hotrec has gathered 10,000+
  properties for the Amsterdam class action; hotel associations from 25+ European
  countries are pursuing pan-European damages following the CJEU ruling of
  2024-09-19 (Case C-264/23). Under the DMA, parity clauses no longer bind — direct
  rates can undercut OTA rates. Booking maintains its "visibility booster" loyalty
  programmes are DMA-compliant; hotels counter that ranking algorithms still penalise
  non-parity rates even with clauses formally removed.

### Booking Holdings / Expedia

- **Booking Holdings is consolidating hotel room sales** across Booking.com, Agoda and
  Priceline into a single operation running on **Agoda's engine** — the structural
  story on the Booking side.
- **Expedia Explore 2026** announcements: new AI traveler experiences, expanded
  marketplace capabilities, a **CLEAR partnership**, and a long-term philanthropy
  commitment.
- **Expedia's restructured One Key is live** — earning rates now depend on status tier,
  **flight bookings earn nothing**, and the Hotel Price Guarantee has been removed from
  both Expedia and Hotels.com. Material downgrade; expect host/consumer backlash
  coverage.
- **Expedia × CarTrawler** expected to close H2 2026. **Layla** (AI trip planning,
  founded 2023) already absorbed.
- Expedia research: travelers increasingly want to plan and manage the full trip — cars,
  flights, activities, trip protection — on one trusted platform, across multiple
  booking moments.
- Both Expedia and Booking beat Q2 estimates on domestic strength; cross-border demand
  still uneven. Expedia FY2026 gross bookings guidance ~$130.8B. **(carried)**
- **Vrbo sponsored search listings** went global Sep 1 as part of a ~12-item Expedia
  Group fall rollout across Vrbo and Escapia. **(carried)**

### Airbnb

- **Pepijn Rijvers** (ex-Tripadvisor, ex-Booking) is chief business officer, succeeding
  Dave Stephenson after eight years. **(carried)**
- **Airbnb × Tripadvisor experiences partnership** progressing — ~425k
  Tripadvisor/Viator experiences to surface on Airbnb later in 2026. **(carried)**
- 2026 Summer Release still rolling out: **grocery delivery, airport transfers, car
  rental, Bounce luggage storage**, plus AI tools. STR-investor commentary continues to
  work through what the services expansion means for hosts.
- Distribution debate continues — Airbnb is pushing the industry to redefine what a
  "direct booking" even is. **(carried)**

### Agoda / Tripadvisor / APAC

- **Agoda Partner Portal** live since 2026-08-17, replacing the Yield Control System;
  uses AI to process guest reviews.
- **Agoda 2026 search-filter ranking:** booking **flexibility** is a fast-rising factor
  for Asian travelers.
- **Agoda × Taiwan Tourism Administration** destination campaign running Jul–Dec 2026,
  targeting Singapore, Hong Kong, Japan, South Korea.
- **Japan Silver Week (Sep 19–23)** demand spike: domestic interest +120%,
  international +131% for Japan's first five-day holiday in 11 years. **(carried)**

### Agentic AI / distribution — the structural story

- **Google AI Mode agentic hotel booking is live in the US** with Marriott,
  Booking.com, Expedia, Priceline, Hotels.com, Trip.com, Hilton, IHG, Choice and
  Wyndham. **Flights still not bookable.** AI Mode now also surfaces points/miles cost
  for flights and hotels from Alaska/Hawaiian, American, Choice, Hilton and Wyndham.
- **Booking.com:** 89% of consumers say they plan to use AI for future travel — the
  adoption headline, though it still doesn't extend to autonomous checkout.
- **Civitatis integrated its activity catalog with ChatGPT and Claude** via a single MCP
  server — discovery, availability and cart in-conversation, checkout on Civitatis' own
  site. Gemini validated but not live pending Google's partner programme. This is the
  emerging compromise shape: assistants do inspiration, the supplier keeps the
  transaction. **(carried)**
- **Amadeus is working with Anthropic** to help developers access travel content via
  Claude — weeks after Amadeus shut its self-service developer API portal. **(carried)**
- **Arbitrip × El Al:** white-label hotel booking platform inside the airline's loyalty
  programme, AI-personalised on traveler profile and booking history.
- **AI visibility strategies being reworked** — reported declines in Reddit citations in
  LLM results have travel brands rethinking where they invest for AI-answer presence.
  **(carried)**
- The commission question on agentic bookings remains unanswered industry-wide.

### Funding & M&A

- **Q1 2026 travel funding deal volume hit a record low** (~$1B across 44 rounds, vs 66
  rounds / ~$1.2B in Q1 2025). Q2 stayed slow and skewed toward seed or Series B. Most
  observers do not expect 2026 to be a big M&A year either, though more "preemptive
  approaches" like Expedia/CarTrawler are plausible.
- **Consolidation is the growth strategy** — well-capitalised players are buying
  capabilities rather than building them, and in M&A the money is going into AI.
  Reference deals: Expedia/CarTrawler, Amadeus/SkyLink, Long Lake/Amex GBT ($6.3B),
  Apollo/easyJet ($5.7B), Juniper/Deem, Lighthouse/Hotelrank.ai,
  GoldSpring/Travel Tech Consulting (Jan 2026).
- **WeTravel acquired Tourwriter** (Sep 2, undisclosed) — separate platforms, Glenn
  Campbell staying to lead Tourwriter. Follows WeTravel's $92M Series C. **(carried)**
- Recent small rounds **(carried)**: **Laters.com** $1.5M seed (payments-first OTA),
  **PassHub** $1.5M pre-seed (Brazil, B2B agency distribution), **Piney** €1.6M (STR
  cleaning ops with AI).
- **Blackstone** reportedly planning a **$7B IPO** of Spanish resort owner Hotel
  Investment Partners. **(carried)**
- **FlightHub** added hotels — 2.6M+ properties — moving to flights + hotels +
  packages on one platform.
- Horizontal travel-tech categories at all-time-high activity: payments, fintech,
  martech, loyalty, insurance.

### Travel tech / supply side (carried, no fresh movement today)

- **HBX Group × Vorsee** — ActionOS embedded across HBX's partner portal, Roiback and
  Civitfun.
- **Amadeus × Talma Travel Solutions** — multiyear deal, primary platform for the TMC
  across US, UK, APAC, Germany (3,000+ corporate customers).
- **AirDNA Adapt** — AI-native RMS for STR hosts; integrates Airbnb, Guesty, Hostaway.
- **Lighthouse "Ernest Crews"** — 30–60-day embedded four-person teams configuring its
  Ernest AI teammate per hotel group.
- **Klook** creator storefront now 30,000+ creators across 88 markets.
- **Marriott × LG** — cloud in-room entertainment pilot in 40 US/Canada hotels.
- **Mews** CEO Matthijs Welle on acquisition strategy and the recent reorg.

### Calendar

- **Travel Marketing AI Summit, London — today, Sep 8**
- **FTE Global, Dallas–Fort Worth — Sep 8–10** · GlobeMeets, Istanbul, Sep 10–11
- **EU Affordable Housing Act expected Sep 9**
- Onyx BI webinar, Sep 17 · Japan Silver Week Sep 19–23
- **Skift Global Forum, NYC, Sep 22–24** — theme "Travel's Great Recalibration"; CEOs of
  Airbnb, Booking Holdings, Expedia, Hilton and Uber plus OpenAI chairman Bret Taylor,
  at North Javits
- **Skift Creator Summit, NYC, Sep 22** (inaugural) — 100+ senior travel marketing and
  growth leaders on creator-led demand. Framing stat: social inspires ~$115B in travel
  demand but converts only ~$7B in bookings.
- Phocuswright Conference, Ft. Lauderdale, Nov 17–19
- **Skift Research State of Travel 2026** — restructured around a new four-layer
  "travel stack" framework (Consumers, Commerce, Operations, Experiences) across the
  $11T industry

---

## Sources

- [PhocusWire Latest News](https://www.phocuswire.com/Latest-News)
- [Hotel booking goes live in Google's AI Mode, flights still waiting (PhocusWire)](https://www.phocuswire.com/news/technology/google-ai-mode-hotel-booking-agentic-flights-loyalty)
- [Booking.com News (PhocusWire)](https://www.phocuswire.com/Booking-com)
- [Travel funding deal volume hits new low in Q1 2026 (PhocusWire)](https://www.phocuswire.com/news/startups/travel-startup-funding-acquisitions-q1-2026)
- [The travel startup funding deals and acquisitions that stood out in Q2 (PhocusWire)](https://www.phocuswire.com/news/startups/startup-funding-mergers-acquisition-q2-2026)
- [Expedia Group Unveils New AI Experiences at Explore 2026 (Expedia Newsroom)](https://www.expedia.com/newsroom/expedia-group-unveils-new-ai-experiences-expands-travel-ecosystem-and-launches-philanthropy-program-at-explore-2026/)
- [Expedia Group global research on full-trip planning demand (Expedia IR)](https://ir.expediagroup.com/news-and-events/news/news-details/2026/EXPEDIA-GROUP-UNVEILS-NEW-GLOBAL-RESEARCH-SHOWING-TRAVELER-DEMAND-FOR-FULL-TRIP-PLANNING/default.aspx)
- [Booking.com Press](https://news.booking.com/)
- [Online Travel Agencies (OTAs) — News & Updates (10 Minutes News for Hoteliers)](https://en.10minhotel.com/top-news-hospitality-summary/online-travel-agencies/)
- [Latest news about Agoda (10 Minutes News for Hoteliers)](https://en.10minhotel.com/top-news-hospitality-summary/latest-news-about-agoda/)
- [Latest news about Expedia (10 Minutes News for Hoteliers)](https://en.10minhotel.com/top-news-hospitality-summary/expedia-news-hub-latest-updates-insights/)
- [OTA News in Hospitality — Expedia, Booking, Trip.com, Airbnb (10 Minutes News)](https://en.10minhotel.com/top-news-hospitality-summary/ota-news-hospitality/)
- [EU short-term rental regulations 2026 (Minut)](https://www.minut.com/blog/eu-short-term-rental-regulations)
- [Short-Term Rental Regulations 2026: EU Data Deadline (Rental Scale-Up)](https://www.rentalscaleup.com/short-term-rental-regulations-2026-eu-australia-us/)
- [EU Short-Term Rental Regulations 2026: What the Data Shows (AirROI)](https://www.airroi.com/blog/eu-short-term-rental-regulations-2026)
- [Airbnb 2026 Summer Release (Airbnb Newsroom)](https://news.airbnb.com/airbnb-2026-summer-release)
- [Airbnb's 2026 Summer Release: What STR Investors Need to Know (Rabbu)](https://rabbu.com/blog/airbnbs-2026-summer-release-what-short-term-rental-investors-need-to-know)
- [More Travel Leaders Join the Skift Global Forum 2026 Stage (Skift)](https://skift.com/2026/08/11/skift-global-forum-2026-second-round-speakers/)
- [Announcing Skift Creator Summit 2026 (Skift)](https://skift.com/2026/07/30/announcing-skift-creator-summit/)
- [State of Travel 2026 (Skift Research)](https://research.skift.com/reports/state-of-travel-2026/)
- [M&A trends in travel, leisure and hospitality (KPMG)](https://kpmg.com/us/en/articles/mergers-acquisitions-trends-travel-leisure-hospitality.html)
- [The 10 Best Online Travel Agencies in 2026 for Hotels (Cloudbeds)](https://www.cloudbeds.com/online-travel-agencies/best/)
