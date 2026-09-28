# OTA Dashboard Refresh — Run Log

**Run date:** 2026-09-09
**Task:** refresh-ota-travel-dashboard
**Outcome:** ⚠️ BLOCKED — news gathered, but dashboard not updated.

## Blocker

Step 2 could not be completed. The Claude in Chrome extension was not
reachable ("Claude in Chrome is not connected"); retried 3× over ~90s and
`list_connected_browsers` returned an empty list. Without browser tools there
is no way to load `https://prototypes.sandcastle.musta.ch/ota-dashboard/` or
interact with its refresh control, so no update was pushed.

This is **not** an SSO/login wall — the page was never reached. Same blocker as
the 2026-09-04 run, so it is now recurring rather than transient. To unblock:
install/sign into the Claude in Chrome extension (same account as the desktop
app), confirm the side panel is open, then re-run the task.

Several MCP servers also failed to connect this run (datako, tableau, gandalf,
github, airchat, oracle-erp) with 30s connect timeouts, and finance:bigquery
reported an incompatible auth server. None were needed for this task, but the
pattern suggests the host may have been off VPN.

No summary, email, or Slack message was sent (per task spec — background
refresh only).

## Travel / OTA news gathered (ready to paste into the dashboard)

### Top story — EU Affordable Housing Act (today)
- The European Commission **approved the Affordable Housing Act on 9 September**.
  It sets common criteria for declaring an area under "housing stress" (e.g.
  price-to-income ratios) and, once designated, gives local authorities explicit
  European legal grounds to **restrict or block short-term rentals** — and even
  to block property purchases intended for STR use.
- Short-term letting of a **primary residence is generally exempt**, on the
  reasoning that it doesn't remove housing from the long-term market.
- Context cited: EU property values +64.9% (2015–2025), rents +21.8%.
  Dan Jørgensen is the EU's first housing commissioner.
- Direct read-through to Airbnb, Booking.com and Vrbo supply in constrained
  European cities.

### Second story — Google strips EU travel search features (8 September)
- To comply with the **Digital Markets Act**, Google removed date filters, live
  pricing and descriptive tags for European travel searchers, and planned to pull
  its **vacation rentals unit** from EU search results as early as 8 September.
- Google's framing: past DMA adjustments drove a ~30% drop in direct booking
  traffic, shifting volume toward commission-charging intermediaries — i.e. the
  OTAs. Net-positive for OTA traffic share in the EU, at least short term.

### Booking.com / Booking Holdings
- Merging the hotel-room sales arms of Booking.com, Agoda and Priceline into a
  single operation running on **Agoda's engine** — a significant consolidation of
  supply-side tech.
- Building its own **agentic AI** through the Connected Trip platform, positioned
  as more personalized than general-purpose LLM agents.
- CFO Ewout Steenbergen (Q2 2026): conversational-agent bookings are **under 1%**
  of group room-nights, with no meaningful recent change in that share.
- GenAI cut customer-service costs while booking volume rose ~10%.
- PhocusWire opinion this cycle: the "connected trip" vision never really
  materialized, and AI is both the latest threat to it and its best shot.

### Expedia Group
- At **Explore 2026**: new AI traveler experiences, expanded marketplace/travel
  ecosystem capabilities, and a new philanthropy program (the Expedia Trails Fund).
- New global research pushing the full-trip thesis — travelers increasingly want
  cars, flights, activities and trip protection on one trusted platform.
- Continues to integrate **Layla**, the AI-native trip-planning platform it
  acquired (founded 2023), for personalization on top of Expedia supply.

### Airbnb
- **Delta partnership expanded:** SkyMiles members earn 3 miles per $1 on
  qualifying Airbnb experiences and services, 1 mile per $1 on stays.
- **Earnings Protection** launched — optional paid insurance compensating US
  hosts for income lost when unexpected events interrupt hosting.
- Partnered with IAFCI on consumer travel-scam guidance, citing research that 42%
  of Americans have been scammed online.
- Most exposed of the majors to the EU Affordable Housing Act above.

### Tripadvisor / Viator
- Agreed to sell **TheFork** (European restaurant booking) to **American Express
  for $700M cash**, clearing the way to concentrate on Viator and experiences.

### Agoda
- **Partner Portal** live since 2026-08-17, replacing the Yield Control System;
  includes AI processing of guest reviews.
- Now also the technical engine for Booking Holdings' consolidated hotel-room
  sales operation (see above).

### AI / agentic booking
- Google's **agentic hotel booking** test in AI Mode (US, Amadeus as technical
  partner) has launch partners including Booking.com, Expedia, Hilton, Marriott,
  IHG, Choice, Wyndham, Priceline, Hotels.com and Trip.com.
- The gap remains the story: executive enthusiasm far ahead of consumer adoption,
  with agent-driven bookings still ~1% of volume at Booking Holdings.

### Travel tech launches (PhocusWire briefs, early September)
- **Azira One** — AI location-intelligence platform letting DMOs and travel brands
  query location data in natural language; built on ~13 trillion location signals.
- **AirDNA Adapt** — AI-native revenue management for short-term rental hosts:
  nightly rates and minimum stays with stated rationale, four pricing strategies,
  auto-built comp sets, performance dashboard, AI assistant.
- **Marriott + LG** — cloud-based guest-room entertainment/technology platform,
  piloting across 40 US hotels.
- Earlier briefs this cycle featured HBX, Marriott, Lighthouse, Sabre, Eurostar
  and Civitatis.

### Funding & M&A
- **WeRoad raised $58M** — the standout recent round; evidence that a repeatable,
  community-led group-trip format can still raise well.
- Q1 2026 travel funding deal volume hit a **record low**; Q2 stayed slow. **M&A
  has replaced venture funding as the sector's main growth mechanism.**
- Investors are writing larger checks but demanding contracts, benchmarks,
  retention and a clear revenue path — favoring hard technical work and
  real-world operational infrastructure.

### Regulatory (beyond today's Act)
- **EU Regulation 2024/1028** (STR transparency) has been in force since
  2026-05-20: interoperable registration, registration numbers displayed in
  listings, monthly platform data reporting via national single digital entry
  points. Hotels and hostels are out of scope. It does not itself impose caps or
  night limits — the new Affordable Housing Act is what supplies that authority.

### Market structure
- Booking.com, Expedia and Airbnb held the top three OTA spots in 2025;
  **Despegar** climbed and **Tiket.com** entered the global top 10 for the first
  time. Booking Holdings + Expedia Group remain ~60–65% of the market.

### Industry calendar
- **Skift Global Forum, 22–24 September 2026**, North Javits Center, NYC.
  Preview coverage running now — Intrepid chairman Darrell Wade on including
  customer flights in tour-operator carbon accounting.

## Sources

- [EU Offers Legal Backing for Cities Targeting Short-Term Rentals (Bloomberg)](https://www.bloomberg.com/news/articles/2026-09-09/eu-offers-legal-backing-for-cities-targeting-short-term-rentals)
- [EU draft outlines framework for local STR caps (ShortTermRentalz)](https://shorttermrentalz.com/news/eu-draft-str-caps/)
- [Europe Prepares New Law to Support Cities' Airbnb Crackdowns (Skift)](https://skift.com/2026/09/04/european-commission-short-term-rental-crackdown/)
- [Google Strips Out EU Travel Search Features to Avoid More Fines (Skift)](https://skift.com/2026/09/08/google-update-europe-travel-search-results-dma/)
- [Google's Agentic Hotel Booking Tool Comes to AI Mode (Skift)](https://skift.com/2026/08/27/googles-agentic-hotel-booking-tool-comes-to-ai-mode/)
- [Google launches AI agent hotel booking test in the United States (Hospitality ON)](https://hospitality-on.com/en/distribution/google-launches-ai-agent-hotel-booking-test-united-states)
- [Booking Holdings Bets on Agentic AI to Challenge Big Tech (Yahoo Finance)](https://finance.yahoo.com/news/booking-holdings-bets-agentic-ai-202919906.html)
- [AI Cuts Booking Holdings Customer Service Costs 10% as Volumes Rise (PYMNTS)](https://www.pymnts.com/earnings/2026/ai-cuts-booking-holdings-customer-service-costs-10-as-volumes-rise/)
- [Booking Holdings' 'connected trip' vision never materialized (PhocusWire)](https://www.phocuswire.com/opinion/online/booking-connected-trip-vision-never-materialized-ai-could-change-that)
- [Expedia Group Unveils New AI Experiences at Explore 2026 (Expedia Newsroom)](https://www.expedia.com/newsroom/expedia-group-unveils-new-ai-experiences-expands-travel-ecosystem-and-launches-philanthropy-program-at-explore-2026/)
- [Expedia Group global research on full-trip planning demand (Expedia IR)](https://ir.expediagroup.com/news-and-events/news/news-details/2026/EXPEDIA-GROUP-UNVEILS-NEW-GLOBAL-RESEARCH-SHOWING-TRAVELER-DEMAND-FOR-FULL-TRIP-PLANNING/default.aspx)
- [PhocusWire travel tech news briefs: HBX, Marriott, Lighthouse and more (September 4)](https://www.phocuswire.com/travel-tech-news-briefs/september-4)
- [PhocusWire travel tech news briefs: Airbnb, Agoda, BizTrip AI and more](https://www.phocuswire.com/travel-tech-news-briefs/2026/may-8)
- [OTA News in Hospitality — Expedia, Booking, Trip.com, Airbnb (10 Minutes News for Hoteliers)](https://en.10minhotel.com/top-news-hospitality-summary/ota-news-hospitality/)
- [Travel Startup Funding Slows in Q2 as M&A Activity Accelerates (AirGuide)](https://airguide.info/travel-startup-funding-slows-in-q2-as-ma-activity-accelerates/)
- [The travel startup funding deals and acquisitions that stood out in Q2 (PhocusWire)](https://www.phocuswire.com/news/startups/startup-funding-mergers-acquisition-q2-2026)
- [Travel funding deal volume hits new low in Q1 2026 (PhocusWire)](https://www.phocuswire.com/news/startups/travel-startup-funding-acquisitions-q1-2026)
- [Online short-term accommodation rental services – data collection and sharing (EUR-Lex)](https://eur-lex.europa.eu/EN/legal-content/summary/online-short-term-accommodation-rental-services-data-collection-and-sharing.html)
- [EU short-term rental regulations (2026): What changes in May 2026 (Minut)](https://www.minut.com/blog/eu-short-term-rental-regulations)
- [Europe's short-term rental rules are changing (Airbnb Newsroom)](https://news.airbnb.com/europes-short-term-rental-rules-are-changing-we-need-to-get-them-right)
- [Skift Global Forum Preview: Intrepid's Chairman on Carbon Cost (Skift)](https://skift.com/2026/09/08/skift-global-forum-preview-intrepid-chairman-carbon-emissions-flights/)
- [Online Travel Agencies Market Share Across the World (Mize)](https://mize.tech/blog/online-travel-agencies-market-share-across-the-world/)
