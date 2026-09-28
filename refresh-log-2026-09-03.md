# OTA Dashboard Refresh Log

## Run: 2026-09-03 06:05 PDT (scheduled task `refresh-ota-travel-dashboard`)

**Status: BLOCKED — live site not refreshed. Fourteenth consecutive non-deploying run.**

Step 1 (news gathering) succeeded. Steps 2 and 3 (browser) were impossible again —
no browser. Step 4 (delivery) intentionally skipped per the task definition.

Both blockers are unchanged from 2026-09-01 and both need action on the Mac.

---

### Blocker 1 — no browser (blocks steps 2 and 3)

The Claude in Chrome extension is unreachable.

- `navigate` → "Claude in Chrome is not connected".
- `tabs_context_mcp{createIfEmpty:true}` → same.
- `list_connected_browsers` → `[]`.

`https://prototypes.sandcastle.musta.ch/ota-dashboard/` was **never reached**, so no
input field or refresh control could be located or used.

To be explicit, as in every prior run: this is **not** an SSO failure and **not** a
login wall. The page was never requested. No workarounds were attempted — no curl,
no Python, no archive mirrors.

**Fix:** install/sign in to the Claude in Chrome extension on the Mac
(https://chromewebstore.google.com/detail/fcoeoabgfenejglbffodgkkbkcdhcgfn), open the
side panel, and sign in with the same account as the desktop app.

### Blocker 2 — no publish path (unchanged since 2026-08-06)

- In the task sandbox, `which kyber airtool` returns nothing. Only `/usr/bin/node`
  and `/usr/bin/npm` are present. `kyber` lives at `/Users/bimpe_abimbola/.bun/bin/kyber`
  on the Mac and is not reachable from here.
- `scripts/refresh.log` shows the Sep 2 17:00 deploy attempt still ending with:

      airtool is required to run kyber. Connect to VPN and run kyber again so it
      can be downloaded and installed.

`dist/` is still dated **2026-08-05 17:18** and `dist/news-data.js` still carries the
Aug 5 generation stamp (its top `ota` item is still the Aug 5 Wynn UAE casino story).
The live dashboard is serving content **29 days stale**.

`dist/` was again deliberately left untouched. Overwriting it by hand publishes
nothing — `kyber deploy` is what publishes — and it would destroy the only local
record of what the live site actually serves.

**Fix:** on the Mac, connect to VPN and run `kyber deploy` once (or just `kyber` once
so `airtool` self-installs). One successful manual deploy on VPN should unblock the
cron, which already does everything else correctly.

### Local pipeline — healthy

- `public/news-data.js` is stamped **Sep 2, 2026, 5:00 PM PDT**; `public/index.html`
  was rewritten at Sep 2 17:06 (226.2 KB, 32 MECE articles across ota / hotels /
  airlines / tech, 8 each). Both the Sep 1 and Sep 2 evening cron slots fired on
  schedule. Fetch → inject is working; only the deploy step fails.
- Minor, pre-existing: the fetcher still logs 403/404s from Travel Weekly, Phocuswire
  and Hospitality Net. It still clears its per-category quota from other sources, so
  this stays cosmetic, but those three feeds contribute nothing to the fetch.
- **Categorizer relevance — now worse, and worth fixing.** Flagged on 2026-09-01 and
  unaddressed. Current off-topic placements in `public/news-data.js`:
  - `hotels` top slot: "Uber to Lay Off 3,300 Employees" — not a hotel story.
  - `tech` carries four non-travel items: "Google's New Phone Comes With Plenty of
    A.I." (NYT), "Introducing Gemini Spark ... in India" (blog.google), "Perplexity
    Comet vs ChatGPT Atlas vs Gemini Agent" (tech-insider.org), and "The rise of the
    military-technology complex" (Bulletin of the Atomic Scientists). That is half
    the category.
  - `airlines` is heavy on equity-analysis filler from kalkine.ca (three of eight).
  A keyword-filter tightening pass in `scripts/fetch-news.cjs` would help; a source
  denylist for kalkine.ca / tech-insider.org would help more. Does not block anything.
- The sandbox still has **no outbound DNS** (`dns.lookup('skift.com')` → `EAI_AGAIN`),
  so `scripts/fetch-news.cjs` cannot be run from here as a fallback. That only
  matters if the Mac cron stops again.

---

## Step 1 output — travel / OTA news gathered (for the record)

Collected via web search and a direct read of PhocusWire's Latest News index on
2026-09-03. Not injected anywhere; recorded here so the run is not a total loss and
so the content is available if someone refreshes by hand. Items dated Sep 1–3 are a
genuine 24–48 hour window this cycle; older items are labelled.

### Major players

- **Airbnb executive change (Sep 1).** Airbnb named Tripadvisor executive Pepijn
  Rijvers chief business officer. He succeeds Dave Stephenson, who is moving on after
  eight years. Notable given the Airbnb × Tripadvisor experiences partnership below —
  the same week's hire comes straight from the partner.
- **Airbnb × Tripadvisor** (announced Aug 11; still the defining story of the cycle).
  Tripadvisor Group tours, activities and attractions become bookable on Airbnb, with
  launch expected later in 2026. Tripadvisor Group's catalog spans more than 425,000
  experiences across Tripadvisor, Viator and partner storefronts.
- **Expedia Group / Vrbo (Sep 1).** Vrbo launched sponsored search listings globally
  as part of a fall rollout of roughly a dozen vacation-rental product launches
  across Vrbo and Escapia. Expedia's CarTrawler acquisition is still expected to
  close in H2 2026, framed as a "one-stop shop for B2B travel."
- **Booking Holdings.** Continuing to merge the hotel room-sales arms of Booking.com,
  Agoda and Priceline into a single operation on Agoda's engine. Agoda's Partner
  Portal (launched Aug 17) has replaced the Yield Control System.
- **Skyscanner (Sep 2).** Chief AI officer Piero Sierra gave a wide-ranging interview
  on agentic search and AI's effect on flight discovery.
- **Mews (Sep 3).** CEO Matthijs Welle discussed the company's acquisition strategy
  and a recent reorg — relevant as a read on hotel-tech consolidation appetite.
- **Airbnb direct-booking test (Aug 30, opinion).** Airbnb is testing lower fees on
  host-shared booking links while keeping the reservation on Airbnb, which is
  prompting debate about what "direct booking" now means for distribution cost.

### Trends

- **Google AI Mode hotel booking went live (Aug 27).** U.S. travelers can now book
  hotels inside Google's AI Mode with partners including Marriott, Booking.com and
  Expedia. Flight booking is not yet available. This is the single most consequential
  distribution story of the past week for OTAs.
- **AI beyond research (Sep 1, Phocuswright Research).** European travelers are using
  AI well past initial search, across booking and in-trip stages. Separately, 56% of
  U.S. leisure travelers report using AI for travel planning.
- **AI search reshaping acquisition (Sep 1, opinion).** Travelier CMO Mario Gavira
  argues travel marketers need to rebuild around AI search surfaces rather than
  classic SEO.
- **Market concentration.** Booking Holdings and Expedia Group together account for
  an estimated 85–90% of global OTA hotel bookings; hotels continue pushing direct
  channels in response.
- **Mobile.** 68% of travel searches and 63% of online travel bookings globally now
  originate on mobile.
- **Expedia consumer research.** "Unpack '26" reports 54% of travelers now book
  multiple hotels within a single destination. Expedia's 2026 Air Hacks report finds
  Friday has become the cheapest day to both fly and book.

### Funding / M&A

- **WeTravel acquired Tourwriter (Sep 2)** to broaden its custom/tailor-made travel
  focus. The two will run as separate platforms, with Glenn Campbell continuing to
  lead Tourwriter.
- **Piney raised €1.6M (Sep 3).** Short-term-rental cleaning and operations provider;
  funds go to AI for real-time cleaning verification, flagging issues before cleaners
  leave a property.
- **Passhub raised $1.5M pre-seed (Sep 1).** Brazil-based B2B distribution platform
  centralizing travel agencies' access to consolidators and suppliers. Led by
  Parceiro Ventures.
- **Context.** Q1 2026 set a record low for travel startup funding deal volume and Q2
  stayed thin, with M&A rather than venture rounds carrying growth. Larger 2026 rounds
  to date: Smartness €47M, WeRoad $58M Series C (led by Airbnb), The Hosteller $16M.
  Consolidation examples include Mindtrip–Thatch and Tern–Lucia.

### Regulatory

- **EU short-term rental data sharing — active lobbying (Sep 2).** CCIA Europe called
  for the EU's new short-term rental data-sharing system to be allowed to generate
  evidence of local-market activity before further restrictions are proposed under the
  planned Affordable Housing Act. Airbnb and Booking.com are both pressing for a
  targeted, data-driven approach.
- **Regulation (EU) 2024/1028 took effect 20 May 2026.** Platforms including Airbnb
  and Booking.com must collect and verify host registration numbers before listing,
  display them prominently, and transmit standardized monthly activity data — nights
  booked, guest counts, addresses — to national Single Digital Entry Points.
  Platforms have publicly questioned its effectiveness given delays standing up the
  cross-border registration system.
- **Google antitrust.** Airbnb, Booking.com and other European travel platforms
  continue to press claims that Google unfairly prioritizes its own travel services.

### Sources

- https://www.phocuswire.com/Latest-News
- https://www.phocuswire.com/news/online/tripadvisor-exec-pepijn-rijvers-joins-airbnb-chief-business-officer
- https://www.phocuswire.com/news/technology/expedia-group-vrbo-sponsored-listings-fall-product-launch-2026
- https://www.phocuswire.com/news/technology/wetravel-acquires-tourwriter
- https://www.phocuswire.com/news/startups/str-cleaning-operations-provider-piney-funding-develop-ai-capabilities
- https://www.phocuswire.com/news/startups/brazil-based-b2b-startup-travel-agencies-passhub-pre-seed-funding
- https://www.phocuswire.com/news/technology/google-ai-mode-hotel-booking-agentic-flights-loyalty
- https://www.phocuswire.com/news/technology/ai-shaping-trip-decisions-phocuswright-research-2026
- https://www.phocuswire.com/interviews/technology/ai-transformation-travel-series-skyscanner-piero-sierra
- https://www.phocuswire.com/interviews/technology/ceo-spotlight-matthijs-welle-mews
- https://www.phocuswire.com/opinion/opinion-airbnb-making-us-rethink-direct-booking-means
- https://www.phocuswire.com/news/startups/startup-funding-mergers-acquisition-q2-2026
- https://www.travelpulse.com/news/technology/tripadvisor-airbnb-to-partner-for-travel-experiences
- https://www.mlex.com/mlex/data-privacy-security/articles/2520656
- https://shorttermrentalz.com/news/eu-short-term-rental-data-rules-europe/
- https://www.expedia.com/newsroom/unpack-26-expedia-hotelscom-vrbo/
- https://www.expedia.com/newsroom/expedia-2026-air-hacks/
- https://www.cloudbeds.com/online-travel-agencies/trends/

---

## Verification

- Blocker 1 confirmed by three independent tool calls (`navigate`,
  `tabs_context_mcp`, `list_connected_browsers`).
- Blocker 2 confirmed by `which kyber airtool` (empty), `dist/` mtimes, the Aug 5
  generation stamp inside `dist/news-data.js`, and the tail of `scripts/refresh.log`.
- Local pipeline health confirmed by reading `public/news-data.js` directly and
  enumerating all 32 articles across the four categories; the relevance findings above
  come from that enumeration, not from inference.
- No write actions were taken against the live site, `dist/`, or any connector. No
  summary, email or Slack message was sent, per the task definition.
