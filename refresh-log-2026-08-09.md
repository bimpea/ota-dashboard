# OTA Dashboard Refresh Log

## Run: 2026-08-09 (scheduled task `refresh-ota-travel-dashboard`)

**Status: BLOCKED — refresh not applied.**

**Blocker:** The Claude in Chrome extension was not reachable. `tabs_context_mcp`
timed out after 180s, and `list_connected_browsers` returned an empty list on
three attempts. Without a connected browser, the dashboard at
https://prototypes.sandcastle.musta.ch/ota-dashboard/ could not be opened, so no
input field or refresh control could be found or used.

This is not an SSO/login-wall failure — the page was never reached.

**Fix:** Install / sign in to the Claude in Chrome extension
(https://chromewebstore.google.com/detail/fcoeoabgfenejglbffodgkkbkcdhcgfn),
confirm VPN, then re-run this task.

**Step 1 (news gathering) completed successfully.** The content below is ready to
paste into the dashboard on the next run.

---

## Travel / OTA news — last 24–72 hours (as of 2026-08-09)

### Agentic AI takes over hotel search and booking
- **Google confirms agentic hotel booking is in testing.** Google moved agentic
  hotel booking from promise to product test; how much of the transaction and the
  customer relationship it intends to own is still unclear.
  https://skift.com/2026/08/07/google-confirms-hotel-agentic-booking-is-now-in-testing/
- **Google brings agentic AI to Ask Maps hotel search.** Google Maps adds hotel
  and event discovery to its Ask Maps conversational interface, rolling out in the
  U.S. Spatial context plus personal itinerary data makes this more than a routine
  AI search update.
  https://skift.com/2026/08/07/google-brings-agentic-ai-to-ask-maps-hotel-search/
  https://www.phocuswire.com/news/online/google-maps-ask-maps-hotel-discovey

### Q2 2026 earnings — the AI-spend-vs-conversion gap
- **Airbnb is growing faster than rivals; hotel push "stepping on the gas."**
  Brian Chesky says AI is now materially speeding up product releases and argues
  Airbnb went from mid-pack to "a leader in AI" outside the LLM and hyperscaler set.
  https://skift.com/2026/08/06/airbnb-is-growing-faster-than-rivals-as-ai-speeds-up-product-releases/
  https://www.phocuswire.com/news/finance/airbnb-q2-2026-earnings
- **Booking Holdings: AI visibility up, but AI referrals stay under 1% of room
  nights.** The clearest datapoint yet that AI discovery has not converted into
  volume.
  https://www.phocuswire.com/news/finance/booking-holdings-q2-2026-earnings
- **Expedia Group is investing in AI that doesn't convert yet.**
  https://www.phocuswire.com/news/finance/expedia-group-q2-2026-earnings
- **Tripadvisor revenue and net income dipped in Q2.** The TheFork sale is
  progressing and is still expected to close by year end.
  https://www.phocuswire.com/news/finance/tripadvisor-q2-2026-earnings
- **Trivago ramped internal AI spend fivefold** — more spent on AI in the first
  seven months of 2026 than in all of 2025.
  https://www.phocuswire.com/news/technology/trivago-q2-2026-earnings
- **Sabre raised 2026 guidance** after Q2 beat; adjusted EBITDA $143M, up 21% YoY,
  helped by lower labor cost.
  https://www.phocuswire.com/news/finance/sabre-q2-2026-earnings
- **Earnings roundup:** Uber, Amex GBT, Ixigo, MakeMyTrip, Lyft.
  https://www.phocuswire.com/news/finance/uber-amex-gbt-mmt-lyft-earnings-roundup-aug-2026
- **Lodging REITs beat and raised.** Park Hotels, Ryman, RLJ, Service Properties
  followed Host, Sunstone, Apple Hospitality, Summit and Braemar; RevPAR topped
  forecasts across the group.
  https://dlr.skift.com/2026/08/07/lodging-reit-earnings-roll-on-with-beats-and-raised-guidance/

### Funding and M&A
- **Moove raised $250M (Series C)** to build "Nests" — depot infrastructure where
  autonomous fleets are charged, serviced and orchestrated.
  https://www.phocuswire.com/news/finance/moove-autonomous-vehicle-mobility-series-c-funding
- **Fora reached unicorn status ($1B)** as an AI-powered travel advisory, framed as
  a challenge to Expedia and Booking.com.
  https://www.forbes.com/sites/jacquesledbetter/2026/07/17/can-1-billion-fora-travel-challenge-expedia-and-bookingcom/
- **Ixigo is exploring a move into corporate travel** as higher airfares squeeze
  leisure demand.
  https://skift.com/2026/08/06/ixigos-next-shift-its-exploring-a-move-into-corporate-travel/
- **Recent large deals still in flight:** Expedia Group / CarTrawler (close expected
  H2 2026), Juniper / Deem, Long Lake Management / Amex GBT ($6.3B), Apollo /
  easyJet ($5.7B). Q1 2026 startup funding hit a new low — ~$1B across 44 rounds vs
  ~$1.2B across 66 rounds a year earlier.
  https://www.phocuswire.com/news/startups/startup-funding-mergers-acquisition-q2-2026
- **Skift launched a quarterly Capital Allocation Brief** tracking M&A, venture
  money, buybacks and take-privates in travel.
  https://skift.com/2026/08/05/skift-capital-allocation-brief-a-new-quarterly-read-on-where-travels-money-goes/

### Regulatory and tax
- **GetYourGuide will pass its digital services tax bill to tour operators.** Taxes
  aimed at Big Tech revenue are landing on suppliers instead.
  https://skift.com/2026/08/07/getyourguide-to-pass-its-digital-services-tax-bill-on-to-suppliers/
- **Short-term rental enforcement tightening.** Roughly 1,600 unlicensed listings on
  OTA platforms were given a two-month permit window before delisting, with
  enforcement starting 1 August 2026. In the U.S., three states passed host-friendly
  preemption laws in 2026, two preemption bills failed, and New York City passed
  $72M in cumulative STR fines. Hillsborough County (Tampa area) is moving toward an
  STR registry and zoning-based caps.
  https://www.rentalscaleup.com/short-term-rental-regulations/

### Themes to watch
- AI discovery is reshaping the top of the funnel faster than the booking step —
  every major OTA is spending heavily against sub-1% referral conversion.
- Distribution power is shifting toward Google and AI assistants; concern is growing
  that large OTAs may buy preferential placement inside AI assistants.
- Airlines' "recapture" pricing strategy beat expectations, pushing leisure
  travelers toward cheaper options and pulling platforms like Ixigo toward corporate.
- Amazon is testing AI-driven travel booking through Alexa; IHG launched
  conversational AI search in beta on web and app.
