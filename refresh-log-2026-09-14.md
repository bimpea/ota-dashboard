# OTA Dashboard Refresh — Internal Log

**Run:** 2026-09-14 (scheduled task `refresh-ota-travel-dashboard`)
**Outcome:** BLOCKED — dashboard could not be reached. No refresh performed.
**Note:** This is the **second consecutive blocked run** (see `refresh-log-2026-09-13.md`).

## What happened

1. **News gathering: succeeded.** Six web searches completed; payload below.
2. **Opening the dashboard: failed.** Both browser paths were unavailable:
   - **Claude in Chrome** (the browser the task file specifies): `tabs_context_mcp`
     returned "Claude in Chrome is not connected" on three separate attempts,
     spaced across the run. Extension is likely not installed, not signed in, or
     Chrome was not running.
   - **Built-in browser** (attempted as a fallback): navigation to
     `https://prototypes.sandcastle.musta.ch` was refused —
     *"blocked by your organization's policy."*
3. **Steps 3 and 4 (feed news in, verify): not attempted.** Per the task file's
   instruction to note the blocker and stop rather than attempt workarounds.

This was *not* an SSO/login wall — the request never reached the origin. No
credentials were entered and no workarounds were attempted.

## To unblock

- Ensure Chrome is running with the Claude in Chrome extension installed and
  signed in to the same account as the desktop app, and that the machine is on
  VPN (sandcastle URLs require it).
- The built-in browser is not a viable substitute: `prototypes.sandcastle.musta.ch`
  sits on the org's blocklist for that surface.
- **Alternative worth considering:** this repo already contains a local refresh
  toolchain — `scripts/fetch-news.cjs`, `scripts/inject-news.cjs` and
  `scripts/refresh-and-deploy.sh`, writing into `public/news-data.js`. Running
  that path would bypass the browser entirely. It was *not* used on this run
  because it ends in a `kyber deploy` (a publish action) that the task file did
  not authorize. If you'd like scheduled runs to take that route instead, the
  task file can be updated to say so.

## News payload gathered (ready to apply on the next successful run)

### Regulatory / M&A
- **EU General Court upheld the block on Booking's ~€1.63B Etraveli acquisition**
  (reported Sept 10, 2026), endorsing the theory that a dominant firm expanding
  into an adjacent business (flights feeding hotels) can harm competition. Skift's
  read: Expedia now holds the clearer path on M&A.
- **Asymmetric regulatory field.** Booking.com remains a DMA-designated gatekeeper;
  Expedia — not deemed dominant in Europe — has closed **Tiqets (~$279M)** and
  **CarTrawler (~$350M)** this year without EU prohibition despite similar
  one-stop-shop ambitions. CarTrawler is expected to close in H2 2026.
- **U.S. short-term rental landscape shifted in 2026:** three states passed new
  host-friendly preemption laws, two saw preemption bills fail, and NYC crossed
  **$72M in STR fines**. Washington D.C.'s *Short-Term Rental Regulation Amendment
  Act of 2026* lets renters (not just owners) operate STRs, adds a special-event
  license category, and permits a license on a second D.C. property.

### Company moves
- **Expedia acquired Layla**, an AI-native trip-planning platform (founded 2023),
  and is expanding its **Rapid API** ecosystem across cars, flights, activities and
  trip protection. New AI experiences plus a philanthropy program launched at
  **Explore 2026**.
- **Airbnb × Tripadvisor Experiences partnership:** a selection of Tripadvisor
  Group's **425,000+** tours, activities and attractions becomes bookable on Airbnb
  later this year. Airbnb grew Experiences supply **~80% YoY in Q2**.
- **AmEx Global Business Travel acquired by Long Lake Management for $6.3B**;
  Juniper acquired **Deem**.

### Market structure
- Booking.com, Expedia and Airbnb held the top three global OTA spots in 2025;
  **Despegar** moved up and **Tiket.com** entered the global top 10 for the first
  time. Booking Holdings at a record **~$175.6B** market cap on **$26.04B** TTM
  revenue (+~13% YoY).
- **U.S. OTA gross bookings rose 4% in 2025 to $100.3B** — roughly one fifth of all
  U.S. travel gross bookings, projected to reach **21% by 2028**.
- Global OTA market: **$663.7B (2025) → $718.9B (2026) → $1,316.8B (2033)**, a 9.0%
  CAGR. Event/sports/entertainment travel is the fastest-growing slice at 10.1%.

### Trends
- **AI-first discovery.** Skift Research's *State of Travel 2026* frames the shift as
  search-scroll-compare → **ask-shortlist-decide**. **30%** of travelers now report
  "extensive" AI use for trip planning (up 17pp YoY, more than double), and **56%**
  of U.S. leisure travelers use AI to plan. But sentiment toward *letting AI book*
  is still net negative, and direct + OTA channels remain the most trusted. The live
  edge is **agentic AI** executing multi-step tasks. Skift flagged **Instinct**, a new
  AI assistant that books and rebooks trips from a text thread, as the clearest
  demonstration yet of what frictionless actually means.
- **Social commerce.** **TikTok GO** launched in the U.S. in May 2026 — in-app
  discovery and booking backed by API integrations with Booking.com, Expedia,
  Viator, GetYourGuide and Trip.com.
- **Demand outlook improving but lopsided.** U.S. hotel 2026 RevPAR forecast revised
  from a decline to **+2.8%**. September U.S. reservations **+11.8% YoY**, room nights
  **+11.5%** (SiteMinder), helped by the FIFA World Cup and America 250. Corporate
  booking pace runs **5.6–8.6%** ahead for Aug–Oct. **International inbound is the
  single largest risk** — the only major demand pillar in outright decline.
- **Startup funding still tight.** ~**$1B across 44 rounds in Q1 2026**, down from 66
  rounds / ~$1.2B a year earlier; M&A has generated more activity than funding.
- **Calendar:** Skift Global Forum 2026 runs **Sept 22–24** in New York (theme:
  *Travel's Great Recalibration*) with the CEOs of Booking Holdings (Glenn Fogel),
  Expedia (Ariane Gorin), Airbnb, Hilton (Christopher Nassetta), Accor, Uber,
  Wyndham, Carnival, Qatar Airways, plus OpenAI chairman Bret Taylor on who owns
  the traveler when AI agents do the booking.

## Sources

- [With Booking's Etraveli Deal Still Blocked, Expedia Has the Edge in M&A — Skift](https://skift.com/2026/09/10/with-bookings-etraveli-deal-still-blocked-expedia-has-the-edge-in-ma/)
- [Skift Global Forum 2026: Five Decisions in the Room](https://skift.com/2026/09/09/skift-global-forum-2026-five-decisions-in-the-room/)
- [A Viral AI Bot Just Showed Travel What Frictionless Actually Means — Skift](https://skift.com/2026/09/04/a-viral-ai-bot-just-showed-travel-what-frictionless-actually-means/)
- [State of Travel 2026 — Skift Research](https://research.skift.com/reports/state-of-travel-2026/)
- [More Travel Leaders Join the Skift Global Forum 2026 Stage](https://skift.com/2026/08/11/skift-global-forum-2026-second-round-speakers/)
- [Expedia Group Unveils New AI Experiences at Explore 2026](https://www.expedia.com/newsroom/expedia-group-unveils-new-ai-experiences-expands-travel-ecosystem-and-launches-philanthropy-program-at-explore-2026/)
- [Expedia Group global research on full-trip planning demand](https://ir.expediagroup.com/news-and-events/news/news-details/2026/EXPEDIA-GROUP-UNVEILS-NEW-GLOBAL-RESEARCH-SHOWING-TRAVELER-DEMAND-FOR-FULL-TRIP-PLANNING/default.aspx)
- [Airbnb partners with Tripadvisor amid plans to scale Experiences — PhocusWire](https://www.phocuswire.com/news/distribution/airbnb-partners-tripadvisor-scale-experiences)
- [The travel startup funding deals and acquisitions that stood out in Q2 — PhocusWire](https://www.phocuswire.com/news/startups/startup-funding-mergers-acquisition-q2-2026)
- [Travel funding deal volume hits new low in Q1 2026 — PhocusWire](https://www.phocuswire.com/news/startups/travel-startup-funding-acquisitions-q1-2026)
- [13% is the number that explains why OTAs need hotels to keep working — PhocusWire](https://www.phocuswire.com/news/online/ota-market-essentials-2026-phocuswright-research)
- [5 OTA Trends Shaping Hotel Distribution in 2026 — Cloudbeds](https://www.cloudbeds.com/online-travel-agencies/trends/)
- [Online Travel Agencies Market Size, Share Report 2026-2033 — Grand View Research](https://www.grandviewresearch.com/industry-analysis/online-travel-agencies-market-report)
- [September Hotel Bookings Rise as Travel Demand Grows — Asian Hospitality](https://www.asianhospitality.com/september-hotel-bookings-rise-travel-demand/)
- [Hotel forecast brightens as U.S. demand surges — Travel Weekly](https://www.travelweekly.com/Travel-News/Hotel-News/Early-numbers-brighten-2026-forecast-US-hotels)
- [Short-term rental laws in the US: 2026 guide — Minut](https://www.minut.com/blog/short-term-rental-laws-us)
- [Mayor Bowser Announces New Short-Term Rental Legislation — DC](https://mayor.dc.gov/release/mayor-bowser-announces-new-short-term-rental-legislation-create-more-economic-opportunities)
