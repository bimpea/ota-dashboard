# OTA Dashboard Refresh — Internal Log

**Run:** scheduled task `refresh-ota-travel-dashboard`
**Date:** 2026-09-11
**Outcome:** ⚠️ BLOCKED — news gathered, but dashboard was not updated.

## Blocker

Could not reach `https://prototypes.sandcastle.musta.ch/ota-dashboard/` with either browser:

1. **Claude in Chrome** — extension not connected. Retried twice; both calls returned
   "Claude in Chrome is not connected." Extension is likely not installed, not signed in,
   or the side panel isn't open.
2. **Built-in browser pane** — navigation refused:
   `https://prototypes.sandcastle.musta.ch is blocked by your organization's policy.`

No workarounds attempted (no curl/fetch against the host, no edits or redeploy of the
local Kyber prototype), per the task's instruction to stop and log on an access wall.

**To unblock:** reconnect the Claude in Chrome extension (install + sign into the side
panel with the same account as the desktop app), confirm VPN/SSO to sandcastle, and re-run.
The built-in browser is not a viable fallback here — the sandcastle domain is policy-blocked
for it.

Note: because the page never loaded, the dashboard's actual input mechanism (text field vs.
paste area vs. plain reload button) is still unverified.

---

## Travel / OTA news gathered (ready to paste on the next run)

Sourced 2026-09-11. Items are from the last ~72 hours; the strict 24-hour window yielded
thin results, so the window was widened slightly to give the dashboard usable content.

### Regulatory

- **Booking Holdings loses Etraveli appeal.** The EU General Court upheld the European
  Commission's 2023 veto of Booking's €1.63B acquisition of Etraveli Group (Gotogate,
  Mytrip, TripStack), rejecting Booking's argument that the Commission applied the wrong
  legal standard. Booking is reviewing the judgment and may appeal to the Court of Justice.
- **Google strips vacation rentals from EEA search.** Effective 2026-09-08, Google removed
  the dedicated vacation-rental unit from Search results across the EEA as part of DMA
  compliance. Rental feeds still serve Maps and google.com/hotels, and the unit remains
  live outside the EEA. Compliance deadline is ~2026-09-21; non-compliance exposes Google
  to penalties of up to 5% of worldwide daily turnover. Effect is to push EEA travelers
  back toward Airbnb, Booking.com and Vrbo.

### Major players

- **Airbnb — Chesky on monetization.** At the Goldman Sachs Communacopia and Technology
  Conference, CEO Brian Chesky laid out margin and growth levers, covering seller services
  and category expansion.
- **Airbnb — leadership.** Tripadvisor executive Pepijn Rijvers joins as chief business
  officer, succeeding Dave Stephenson, who is leaving after eight years.
- **Expedia — AI.** CEO Ariane Gorin, also at Goldman Sachs Communacopia (2026-09-09),
  discussed AI's expanding role in trip planning and booking and Expedia's roadmap.
- **Priceline — AI.** CTO Sejal Amin profiled on the company's AI transformation.
- **Meta.** Launched an AI agent with travel booking capability (Duffel-powered flights).
- **Google.** Hotel booking has gone live inside Google's AI Mode; flights are not yet
  enabled.

### Distribution & partnerships

- **Marriott + Spotnana** unveiled a CRS integration giving corporate buyers real-time
  pricing, inventory and property content across Marriott's global portfolio.
- **Cendyn + Google** — Cendyn joined Google's closed beta for "search campaigns for
  travel," a format merging booking links and search ads under Smart Bidding, feeding
  Google live rates, availability and first-party guest data.
- **Guesty + AirDNA** launched an integration piping Guesty portfolio data into AirDNA
  Adapt for dynamic pricing, with nightly rates and min-stays syncing back to listings.
- **Traxo + Everbridge** partnered to stream real-time booking data (1,000+ points of
  sale, including out-of-policy bookings) into Everbridge's critical event management
  platform for traveler-location visibility.
- **Uganda Airlines + Amadeus** — carrier adopted Amadeus SkyWORKS for schedule planning,
  extending an existing Altéa/revenue/loyalty relationship.

### M&A and funding

- **Navan** posted Q2 FY2027 revenue up 25% to $233M and GBV up 45% to $3B, and acquired
  **BoomPop** to add online meetings/events capability.
- **Flagship** launched with three tours-and-activities brands and signalled further
  acquisitions.
- **Flight Centre** said it is open to TMC acquisitions as corporate travel consolidates.
- **Passhub** (Brazil, B2B distribution for travel agencies) raised $1.5M pre-seed.
- **Laters.com**, a payments-first OTA, raised $1.5M seed.
- **Zerolook** raised $1.9M to work on AI-search-driven flight price prediction.
- Funding backdrop: ~$1B across 44 rounds in Q1 2026, a record-low deal count; Q2 stayed
  quiet, and investors are raising the bar on AI-branded travel startups.

### Trends

- **Agentic/AI distribution is the dominant storyline.** Travel brands are chasing
  visibility in LLM answers as the landscape shifts (Reddit citations in LLM results have
  fallen sharply), and AI search is rewriting the marketing playbook.
- **Trust is fragmenting.** Phocuswright research on European travelers finds they aren't
  rejecting technology so much as getting selective about which brands earn their trust.
- **Airline ancillaries** are growing roughly twice as fast as overall airline revenue.
- **Southeast Asia demand.** Vietnam logged ~13.9M international arrivals through July
  (+13.8% YoY); Klook reported its own Vietnam demand up 72%, signed MOUs with Vinpearl
  and Sun Hospitality, and cited 30–40% growth in Da Nang and Phu Quoc.
- **Japan Silver Week.** Agoda sees domestic travel interest +120% and international +131%
  for the Sept 19–23 five-day break, Japan's first in 11 years.
- **Emerging Travel Group** launched Marketing Hub, an in-house ad unit spanning RateHawk
  and ZenHotels channels plus external media partners.
- **Omio Business** went worldwide after a U.K. launch, targeting small teams and
  freelancers with no contracts or minimum spend.

## Sources

- https://www.phocuswire.com/
- https://www.phocuswire.com/travel-tech-news-briefs/2026/september-11
- https://www.phocuswire.com/news/online/booking-holdings-etraveli-acquisition-general-court-europe-decision
- https://www.phocuswire.com/news/distribution/google-removes-vacation-rentals-search-results-eea
- https://www.phocuswire.com/news/online/airbnb-brian-chesky-talks-monetization-strategy-seller-services-category-expansion
- https://www.phocuswire.com/news/technology/expedia-ceo-ariane-gorin-ai-growing-role-travel-planning-booking
- https://www.phocuswire.com/news/finance/navan-q2-fiscal-2027-boompop-acquisition
- https://www.phocuswire.com/news/distribution/marriott-spotnana-unveil-crs-integration
- https://www.phocuswire.com/news/online/tripadvisor-exec-pepijn-rijvers-joins-airbnb-chief-business-officer
- https://skift.com/2026/09/08/google-update-europe-travel-search-results-dma/
- https://curia.europa.eu/site/upload/docs/application/pdf/2026-09/cp260125en.pdf
- https://www.prnewswire.com/apac/news-releases/agoda-reveals-growing-travel-interest-for-2026-silver-week-in-japan-driven-by-first-five-day-holiday-in-11-years-302866115.html
- https://www.phocuswire.com/news/startups/travel-startup-funding-acquisitions-q1-2026
