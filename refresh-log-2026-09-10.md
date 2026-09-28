# OTA Dashboard Refresh — Run Log

**Run date:** 2026-09-10
**Task:** refresh-ota-travel-dashboard
**Outcome:** ⚠️ BLOCKED — news gathered, but dashboard not updated.

## Blocker

Step 2 could not be completed. Neither browser was usable:

- **Claude in Chrome** — `tabs_context_mcp` returned "Claude in Chrome is not
  connected" on both attempts. Same failure as the 2026-09-04 and 2026-09-09
  runs, so this is now a persistent condition, not a transient one.
- **Built-in browser pane** (attempted as a fallback) — `navigate` refused the
  URL because `prototypes.sandcastle.musta.ch` is not on the allowed-site list,
  and `request_access` failed twice with "site policy check is unavailable".
  Site approval needs a person present, which a scheduled run does not have.

`https://prototypes.sandcastle.musta.ch/ota-dashboard/` was therefore never
loaded and no refresh control was triggered. This is **not** an SSO/login wall —
the page was never reached. Per the task spec, no workarounds (curl, wget,
scripted HTTP) were attempted.

To unblock: install/sign into the Claude in Chrome extension under the same
account as the desktop app and confirm the side panel is open, **or** grant the
browser pane standing access to `prototypes.sandcastle.musta.ch` from an
interactive session. Then re-run the task.

Note: the same MCP servers failed to connect again this run (datako, tableau,
gandalf, github, airchat, oracle-erp — all `handshake` not found in `$PATH`),
and finance:bigquery/slack need authorization. None were needed for this task,
but combined with the browser failures the pattern still suggests the host is
off VPN or missing the `handshake` binary.

No summary, email, or Slack message was sent (per task spec — background
refresh only).

## Travel / OTA news gathered (ready to paste into the dashboard)

### Top story — Gulf tourism's lost year (10 September)
- Skift reports Gulf hotel rooms filling at **half-price** rather than on
  restored demand — occupancy propped up by discounting, not recovery.
- Hits global brands and independents alike, but only the large balance sheets
  can absorb a sustained rate war; expect independent distress and possible
  distribution/M&A knock-on effects in the region.

### AI in discovery — the trust gap is the story
- Skift Research **State of Travel 2026**: discovery is shifting from
  *search-scroll-compare* to *ask-shortlist-decide*.
- **30% of travelers** report "extensive" AI use for trip planning, but
  willingness to *transact* through AI platforms lags well behind — **direct and
  OTA channels remain the most trusted** booking surfaces.
- Corroborating datapoint from the prior cycle: agent-driven bookings are still
  **under 1%** of Booking Holdings room-nights. Executive enthusiasm continues to
  run ahead of consumer adoption.
- Broader adoption stat in circulation: 56% of US leisure travelers now use AI
  somewhere in planning; the meaningful shift is toward **agentic** systems that
  execute multi-step tasks rather than just answer questions.

### Regulatory — EU Affordable Housing Act (proposed 9 September)
- The European Commission presented its **Affordable Housing Act** framework on
  9 September: a common methodology for designating areas under "housing
  stress," plus a framework for assessing measures affecting housing use.
- Once an area is designated, local authorities gain explicit European legal
  grounds to **restrict or block short-term rentals**.
- Short-term letting of a **primary residence is generally exempt**.
- Context cited: EU property values +64.9% (2015–2025), rents +21.8%.
- Direct read-through to Airbnb, Booking.com and Vrbo supply in constrained
  European cities.

### Regulatory — national and in-force rules
- **Poland**: cabinet approved a bill on **2 September** letting municipalities,
  condominiums and housing cooperatives ban or restrict STRs in their own
  communities.
- **EU Regulation 2024/1028** (STR transparency) in force since **20 May 2026**:
  platforms must randomly verify host registration numbers against national
  databases, display them on listings, and file **monthly** activity reports
  (nights booked, guest counts) to national authorities via single digital entry
  points. Hotels and hostels are out of scope; the regulation itself imposes no
  caps — the Affordable Housing Act is what would supply that authority.
- **Google / DMA**: to comply, Google stripped date filters, live pricing and
  descriptive tags for European travel searchers and moved to pull its vacation
  rentals unit from EU results. Google's own framing is that past DMA changes cut
  direct booking traffic ~30%, shifting volume to commission-charging
  intermediaries — net-positive for OTA traffic share in the EU near term.
- Consumer-protection enforcement against **deceptive travel platforms** is
  picking up (fake-urgency, drip pricing, misrepresented inventory).

### Airbnb
- **Chesky at Goldman Sachs Communacopia + Technology, 8 September**: Airbnb is
  no longer a "one-hit wonder" built on short-term rentals — it now spans hotels,
  services, experiences, car rentals, resort passes and longer-term stays.
- He credited a **rebuild of the underlying technology base**, which produced
  reusable components that make launching new categories materially cheaper.
- Positioning shift from **marketplace to community model**, with further
  announcements promised on user profiles and personalization.
- **2026 Summer Release** remains the current product baseline.
- Most exposed of the majors to the EU Affordable Housing Act above.
- Also an investor on the supply side of adjacent categories — led **WeRoad's
  $58M Series C**.

### Booking Holdings / Booking.com
- Market leader: ~**$175.6B** market cap, revenue ~**$26.04B** for the twelve
  months to September 2025 (+~13% YoY). Booking.com averages **409M monthly
  visits**, the most-visited travel site globally.
- Consolidating the hotel-room sales arms of **Booking.com, Agoda and Priceline**
  into a single operation running on **Agoda's engine**.
- Building proprietary **agentic AI** via the Connected Trip platform, pitched as
  more personalized than general-purpose LLM agents.
- GenAI cut customer-service costs while booking volume rose ~10%.

### Expedia Group
- **Explore 2026**: new AI traveler experiences, expanded travel ecosystem, and a
  new philanthropy program.
- New global research pushing the **full-trip thesis** — travelers increasingly
  want cars, flights, activities and trip protection on one trusted platform.
- Partnerships with **CLEAR** and **Uber** extending beyond booking itself.
- **CarTrawler acquisition** expected to close in H2 2026, building out a
  "one-stop shop for B2B travel."

### Tripadvisor / Viator
- Agreed to sell **TheFork** to **American Express for $700M cash**, concentrating
  the portfolio on Viator and experiences.

### Agoda
- **4 September**: published Silver Week demand data for Japan — first five-day
  holiday in 11 years driving outbound interest. Hong Kong +245%, Barcelona
  +210%, New York +178%.
- **Partner Portal** live since 2026-08-17, replacing the Yield Control System;
  includes AI processing of guest reviews.
- Now the technical engine for Booking Holdings' consolidated hotel-room sales
  operation (see above).

### Distribution & market structure
- **TikTok GO** launched in the US in May 2026 — in-app discovery and booking
  backed by deep API integrations with Booking.com, Expedia, Viator,
  GetYourGuide and Trip.com. A genuinely new top-of-funnel channel.
- Mobile now accounts for **68% of travel searches** and **63% of online travel
  bookings** globally.
- Booking.com, Expedia and Airbnb held the top three OTA spots in 2025;
  **Despegar** climbed and **Tiket.com** entered the global top 10 for the first
  time. Booking Holdings + Expedia Group remain ~60–65% of the market.
- OTA market sizing in circulation: **$943.16B (2025) → $996.12B (2026)**.
- Longer-tail structural note: the field is diversifying from a few global powers
  toward bank-backed portals, AI-native startups, regional leaders and
  experience-native niche platforms.

### Funding & M&A
- **Q1 2026 was the lowest travel startup funding deal volume on record**; Q2
  stayed slow. **M&A has replaced venture funding as the sector's main growth
  mechanism** — well-capitalized players buying capabilities instead of building.
- Notable deals: **Amex GBT acquired by Long Lake Management for $6.3B**;
  Expedia/CarTrawler; Tripadvisor/TheFork→Amex.
- Notable rounds: **WeRoad $58M Series C** (led by Airbnb), **Smartness €47M
  Series B**.
- Investors are writing larger checks but demanding contracts, benchmarks,
  retention and a clear revenue path.

### Demand outlook
- **39–40% of global travelers** plan to spend more on travel in 2026 than 2025.
- But **65%** say cost of living still constrains their 2026 plans — a
  trade-down/discounting dynamic consistent with the Gulf rate story above.

### Industry calendar
- **Skift Global Forum, 22–24 September 2026**, North Javits Center, NYC. Preview
  coverage running now, framed around five executive "decisions in the room."

## Sources

- [A Lost Year for Gulf Tourism (Skift)](https://skift.com/2026/09/10/a-lost-year-for-gulf-tourism/)
- [Skift Global Forum 2026: Five Decisions in the Room (Skift)](https://skift.com/2026/09/09/skift-global-forum-2026-five-decisions-in-the-room/)
- [State of Travel 2026 (Skift Research)](https://research.skift.com/reports/state-of-travel-2026/)
- [Airbnb, Inc. (ABNB) Presents at Goldman Sachs Communacopia + Technology Conference 2026 — Transcript (Seeking Alpha)](https://seekingalpha.com/article/4944120-airbnb-inc-abnb-presents-at-goldman-sachs-communacopia-technology-conference-2026-transcript)
- [Airbnb at Goldman Sachs conference: Chesky sees wider runway (Investing.com)](https://www.investing.com/news/transcripts/airbnb-at-goldman-sachs-conference-chesky-sees-wider-runway-93CH-4892583)
- [Airbnb 2026 Summer Release (Airbnb Newsroom)](https://news.airbnb.com/product-releases/airbnb-2026-summer-release/)
- [Expedia Group Unveils New AI Experiences at Explore 2026 (Expedia Newsroom)](https://www.expedia.com/newsroom/expedia-group-unveils-new-ai-experiences-expands-travel-ecosystem-and-launches-philanthropy-program-at-explore-2026/)
- [Expedia Group global research on full-trip planning demand (Expedia IR)](https://ir.expediagroup.com/news-and-events/news/news-details/2026/EXPEDIA-GROUP-UNVEILS-NEW-GLOBAL-RESEARCH-SHOWING-TRAVELER-DEMAND-FOR-FULL-TRIP-PLANNING/default.aspx)
- [Agoda Reveals Growing Travel Interest for 2026 Silver Week in Japan (PR Newswire)](https://www.prnewswire.com/apac/news-releases/agoda-reveals-growing-travel-interest-for-2026-silver-week-in-japan-driven-by-first-five-day-holiday-in-11-years-302866115.html)
- [New rules bring increased transparency to the short-term rentals sector (European Commission)](https://single-market-economy.ec.europa.eu/news/new-rules-bring-increased-transparency-short-term-rentals-sector-2026-05-20_en)
- [Online short-term accommodation rental services – data collection and sharing (EUR-Lex)](https://eur-lex.europa.eu/EN/legal-content/summary/online-short-term-accommodation-rental-services-data-collection-and-sharing.html)
- [Short-Term Rental Regulations 2026: EU Data Deadline, Australia, US States (Rental Scale-Up)](https://www.rentalscaleup.com/short-term-rental-regulations-2026-eu-australia-us/)
- [EU proposes common framework for short-term rental restrictions (TravelDailyNews)](https://www.traveldailynews.com/hospitality/eu-proposes-common-framework-for-short-term-rental-restrictions/)
- [EU short-term rental regulations (2026): What changes in May 2026 (Minut)](https://www.minut.com/blog/eu-short-term-rental-regulations)
- [Authorities Close In on Deceptive Travel Platforms (Foster Garvey)](https://www.foster.com/newsroom/blog/duff-on-hospitality-law/authorities-close-in-on-deceptive-travel-platforms/)
- [Travel funding deal volume hits new low in Q1 2026 (PhocusWire)](https://www.phocuswire.com/news/startups/travel-startup-funding-acquisitions-q1-2026)
- [The travel startup funding deals and acquisitions that stood out in Q2 (PhocusWire)](https://www.phocuswire.com/news/startups/startup-funding-mergers-acquisition-q2-2026)
- [Startup M&A fills the void as travel funding deal volume hits a new low (Travel Tech Talent)](https://www.traveltechtalent.com/insights/traveltech-news-startup-ma-funding-low-2026)
- [PhocusWire travel tech news briefs: HBX, Marriott, Lighthouse and more (September 4)](https://www.phocuswire.com/travel-tech-news-briefs/september-4)
- [A year in review: Top trends influencing the OTA industry (Cloudbeds)](https://www.cloudbeds.com/online-travel-agencies/trends/)
- [Travel Industry Trends 2025: How New OTAs Reshaped the Market (Zeal Connect)](https://zealconnect.com/travel-industry-trends-2025-how-new-otas-reshaped-the-market-2026-outlook/)
- [70+ Online Travel Booking Statistics and Trends 2026 (Perk)](https://www.perk.com/blog/online-travel-booking-statistics/)
- [The $1.2 Trillion Digital Voyage: OTA Industry Analysis and 2026 Forecast (Travel And Tour World)](https://www.travelandtourworld.com/news/article/the-1-2-trillion-digital-voyage-online-travel-agent-industry-analysis-and-2026-forecast/)
- [Online Travel Agencies Market Share Across the World (Mize)](https://mize.tech/blog/online-travel-agencies-market-share-across-the-world/)
- [OTA Market Snapshot 2025: Shifts, Trends and Impact (The Hotel Blueprint)](https://thehotelblueprint.com/hotel-market-intel/distribution/ota-market-snapshot-2025-strategic-shifts-trends/)
