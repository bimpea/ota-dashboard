# OTA Dashboard Refresh Log

## Run: 2026-08-12 07:04 WAT (scheduled task `refresh-ota-travel-dashboard`)

**Status: BLOCKED — refresh not applied to the live site.** Fourth consecutive
run with the same two blockers. Step 1 (news gathering) succeeded; the content is
below, ready to paste.

### Blocker 1 — no browser (blocks steps 2 and 3)

The Claude in Chrome extension is not reachable. `tabs_context_mcp` returned
"Claude in Chrome is not connected" on two attempts and
`list_connected_browsers` returned an empty list `[]`. Without a connected
browser, https://prototypes.sandcastle.musta.ch/ota-dashboard/ could not be
opened, so no input field or refresh control could be found or used.

This is **not** an SSO or login-wall failure — the page was never reached. No
workarounds were attempted.

### Blocker 2 — the local cron pipeline builds but cannot deploy (root cause)

Unchanged from 2026-08-11. The prototype's own pipeline
(`scripts/refresh-and-deploy.sh`, daily cron at 17:00 WAT) still fetches and
inlines successfully, then fails at the final step:

- `public/index.html` — rebuilt **2026-08-11 17:06** with 32 fresh articles
  (8 each: ota, hotels, airlines, tech).
- `kyber deploy` fails every day with:
  `airtool is required to run kyber. Connect to VPN and run kyber again so it
  can be downloaded and installed.`
- `dist/index.html` is still dated **2026-08-06 01:18**. The live dashboard is
  now serving content roughly **six days stale** while fresh content sits ready
  in `public/`.

Also still true: the Phocuswire (403/404), Travel Weekly (403) and Hospitality
Net (403) RSS feeds fail on every fetch, so those sources drop out silently.

### Fix (unchanged, requires a human on the Mac)

1. Connect to VPN and run `kyber` once so airtool installs.
2. Run `bash scripts/refresh-and-deploy.sh` — the already-built fresh content
   will deploy.
3. Add a VPN precheck and a failure alert to `refresh-and-deploy.sh`. Right now
   `kyber deploy` fails silently into a log nobody reads.
4. Fix or drop the three 403/404 feeds.
5. For the browser path: install / sign in to the Claude in Chrome extension
   (https://chromewebstore.google.com/detail/fcoeoabgfenejglbffodgkkbkcdhcgfn).
6. Consider retiring this Cowork task in favour of the cron — the cron does the
   same work more reliably once airtool is fixed.

No summary, email or Slack message was sent (pure background task, per the task
definition).

---

## Travel / OTA news — as of 2026-08-12

### Headline story: Airbnb abandons build-your-own Experiences, partners with Tripadvisor

- **Airbnb and Tripadvisor Group announced a partnership on 2026-08-11**: select
  Tripadvisor Group experiences become bookable inside Airbnb. Airbnb is
  effectively dropping its build-your-own strategy for Experiences in favour of
  plugging in third-party supply to scale faster.
  https://skift.com/2026/08/11/airbnb-partners-with-tripadvisor-experiences-drops-build-your-own-strategy/
  https://www.phocuswire.com/news/distribution/airbnb-partners-tripadvisor-scale-experiences
  https://www.travelpulse.com/news/technology/tripadvisor-airbnb-to-partner-for-travel-experiences
- Read alongside Airbnb's July move to open its app to independent hotels in 20
  cities, this is a consistent pattern: aggregate other people's supply rather
  than build it, and own the whole trip.

### Booking Holdings consolidates B2B under Agoda's CEO

- **Booking Holdings has begun merging the B2B units of Agoda, Booking.com and
  Priceline** into a single business (reported 2026-08-06).
  https://skift.com/2026/08/06/booking-holdings-has-begun-merging-agoda-booking-com-and-pricelines-b2b-units-scoop/
- **Agoda's CEO will lead the new B2B unit**; leadership appointments confirmed
  2026-08-10 as partners are onboarded onto the new tech stack.
  https://skift.com/2026/08/10/booking-holdings-makes-leadership-appointments-tied-to-new-b2b-unit-as-partners-get-onboarded-scoop/
- **Expedia is countering** by broadening its B2B product beyond hotels toward a
  one-stop shop (2026-08-05). B2B is now an open front between the two.
  https://skift.com/2026/08/05/expedia-is-investing-in-its-leading-b2b-product-as-competition-heats-up/

### Agentic booking goes live at Google

- **Google confirmed a limited US test of agentic hotel booking inside Search's
  AI Mode** (2026-08-07), with Booking Holdings as one of the first partners.
  CEO Glenn Fogel referenced it on the Q2 earnings call.
  https://skift.com/2026/08/07/google-confirms-hotel-agentic-booking-is-now-in-testing/
  https://www.travelextra.ie/google-confirms-agentic-hotel-booking-testing-as-booking-holdings-consolidates-b2b-units/
- **AI-referred bookings are still under 1%.** Booking Holdings processed 325M
  room nights in Q2 2026; fewer than 3.25M came via an AI referral.
  https://www.travelerstoday.com/articles/60754/20260805/hotel-bookings-via-ai-chatbots-stay-below-1-booking-holdings-confirms.htm
- **Fogel also flagged that Google's AI Overviews are squeezing SEO** — the
  distribution risk is at the discovery layer, not the transaction layer.
  https://skift.com/2026/08/04/booking-holdings-saw-pressure-from-googles-ai-overviews/
- The framing worth carrying: AI can plan the trip, but the OTAs intend to keep
  the transaction — and so far the profits are still coming from the old machine,
  not the AI story sold to Wall Street.
  https://www.pymnts.com/earnings/2026/ai-can-plan-the-trip-but-booking-holdings-wants-the-transaction/
  https://www.hospitality.today/article/booking-expedia-and-airbnb-sold-wall-street-an-ai-story-the-profits-came-from-the-old-machine

### Funding and M&A

- Travel-tech funding reached **$1.7B by end of May 2026**, up from $1.1B in the
  same period of 2025, but remains tight and highly selective. Q2 skewed to seed
  and Series B with one notable Series C.
  https://www.phocuswire.com/news/startups/startup-funding-mergers-acquisition-q2-2026
  https://airguide.info/travel-startup-funding-slows-in-q2-as-ma-activity-accelerates/
- **M&A is outpacing funding for attention.** Standouts: Expedia Group /
  CarTrawler (closing H2 2026), Juniper / Deem, Lighthouse / Hotelrank.ai.
  Earlier in the year: Mews' $300M round, Kindred's $125M.
- **Expedia acquired Layla**, an AI-native trip-planning platform founded 2023,
  folding its personalisation into Expedia's supply and tech.
- **Fora Travel is now valued around $1B** and being framed as a challenger to
  Expedia and Booking.com via the advisor channel.
  https://www.forbes.com/sites/jacquesledbetter/2026/07/17/can-1-billion-fora-travel-challenge-expedia-and-bookingcom/

### Regulatory

- **EU Regulation 2024/1028 has been in force since 2026-05-20.** Platforms must
  transmit monthly booking data to each Member State's Single Digital Entry
  Point, verify and display host registration numbers, and can be ordered to
  disable non-compliant listings. National portals are expected to stabilise
  through late 2026, with enforcement intensity ramping into 2027 — data quality
  is now a compliance exposure, not just an ops one.
  https://eur-lex.europa.eu/EN/legal-content/summary/online-short-term-accommodation-rental-services-data-collection-and-sharing.html
  https://www.rentalscaleup.com/short-term-rental-regulations-2026-eu-australia-us/
  https://www.minut.com/blog/eu-short-term-rental-regulations

### Demand and market conditions

- **Booking Holdings and Expedia both grew room nights 6% in Q1 2026.** The
  agency channel outgrew the OTAs, delivering ~12% more nights at marginally
  higher cost.
- Global **business travel spend is projected at $1.71T for 2026** on only a 1.3%
  trip-volume increase; 69% of travellers say they trust AI for booking.
  https://www.statista.com/topics/2704/online-travel-market/
- Expedia remains the #2 OTA by bookings; lodging was ~80% of 2025 sales, with
  advertising at 8% and growing.

### Adjacent / operations

- **Brisbane Airport passed 25M passengers** — its busiest year ever — on
  strengthening Asia-Pacific international traffic.
- **ANA launched "The Room FX"** business-class suite on its first 787-9.
- Cruise: **Mitsui Ocean Cruises' first Australia call** set for Feb 2027 (47-day
  South Pacific programme); **Azamara Quest** is first through the Azamara
  Forward refit; **TUI Cruises** is expanding liquefied biomethane use.
  https://eturbonews.com/travel-tourism-news-live-updates-august-2026/
  https://www.businesstravelnews.com/Transportation/Air/New-Airline-Routes-August-2026-Updates

### Calendar

- **2026 Skift IDEA Awards** winners announced **2026-08-26** (finalists named
  2026-08-07 from 490+ entries).
