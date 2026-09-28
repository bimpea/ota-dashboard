# OTA Dashboard Refresh Log

## Run: 2026-08-17 (scheduled task `refresh-ota-travel-dashboard`)

**Status: BLOCKED — refresh not applied to the live site.** Fifth consecutive
run with the same blockers, plus a new regression that makes this urgent. Step 1
(news gathering) succeeded; the content is below, ready to paste.

### Blocker 1 — no browser (blocks steps 2 and 3)

The Claude in Chrome extension is not reachable. `tabs_context_mcp` returned
"Claude in Chrome is not connected" on two attempts and
`list_connected_browsers` returned an empty list `[]`. Without a connected
browser, https://prototypes.sandcastle.musta.ch/ota-dashboard/ could not be
opened, so no input field or refresh control could be found or used.

This is **not** an SSO or login-wall failure — the page was never reached. No
workarounds were attempted.

### Blocker 2 — `kyber deploy` still fails (unchanged since 2026-08-06)

`scripts/refresh-and-deploy.sh` (daily cron, 17:00 WAT) still ends with:

    airtool is required to run kyber. Connect to VPN and run kyber again so it
    can be downloaded and installed.

`dist/index.html` is still dated **2026-08-05 17:18**. The live dashboard is now
serving content roughly **12 days stale**.

### Blocker 3 — NEW: the cron has started publishing empty content

Since **2026-08-13** every cron run fetches **0 articles** — all feeds fail with
`getaddrinfo ENOTFOUND` (news.google.com, skift.com, www.phocuswire.com,
www.travelweekly.com, www.hospitalitynet.org, simpleflying.com, techcrunch.com).
This looks like a DNS / network failure on the host, not per-site blocking; the
earlier 403/404 pattern on three feeds has been replaced by total resolution
failure.

The script does not guard against an empty result, so it inlines the empty set
anyway:

- `public/news-data.js` (2026-08-14 17:07) now contains
  `{"ota": [], "hotels": [], "airlines": [], "tech": []}`.
- `public/index.html` shrank from 225 KB to 207.6 KB as the articles were
  stripped out.

**Consequence:** the last known-good staged build (2026-08-11, 32 articles) has
been **overwritten**. Deploying `public/` as it stands today would replace a
stale dashboard with an empty one. The stale `dist/` is currently the better of
the two. Nothing in `public/` was modified by this run.

### Fix (requires a human on the Mac)

1. **Add an empty-result guard to `scripts/fetch-news.cjs` / `refresh-and-deploy.sh`
   before anything else** — abort and keep the previous build if the article
   count is 0. This is what turned a stale-content problem into a data-loss one.
2. Diagnose the host DNS failure (VPN split-tunnel or resolver change around
   2026-08-13 is the likely cause).
3. Connect to VPN and run `kyber` once so airtool installs, then run
   `bash scripts/refresh-and-deploy.sh` to deploy a real build.
4. Add a failure alert — `kyber deploy` has now failed silently for 12 days into
   a log nobody reads.
5. For the browser path: install / sign in to the Claude in Chrome extension
   (https://chromewebstore.google.com/detail/fcoeoabgfenejglbffodgkkbkcdhcgfn).
6. **Recommendation: retire this Cowork task.** It has produced five consecutive
   blocked runs and cannot deploy by design. The cron is the right mechanism once
   items 1–4 are done.

No summary, email or Slack message was sent (pure background task, per the task
definition).

### Re-check at 2026-08-17 20:22 WAT — Blocker 4: the cron has stopped running

A second pass later the same day found the state unchanged (browser still
unreachable, `list_connected_browsers` → `[]`; `dist/index.html` still
2026-08-05) — plus one new finding that the 09:04 pass could not yet see:

**Today's 17:00 WAT cron slot has passed with no run.** The last entry in
`scripts/refresh.log` is still **Fri 2026-08-14 17:07**, and `public/index.html`
and `public/news-data.js` are both still dated 2026-08-14 17:07. That means
**2026-08-15, 08-16 and 08-17 produced no run at all** — not even a failing one.

So the pipeline has degraded in three stages: deploy broke (08-06), then the
fetch started returning 0 articles (08-13), and now the job itself has stopped
firing (after 08-14). Item 2 below (host DNS/network) and this may share a root
cause — worth checking whether the machine was asleep or off over the weekend
and whether the cron entry still exists (`crontab -l`). Nothing in `public/` or
`dist/` was modified by this run.

---

## Travel / OTA news — as of 2026-08-17

### Headline story: Airbnb plugs in Tripadvisor's supply instead of building its own

- **Airbnb and Tripadvisor Group announced a partnership on 2026-08-11.**
  Tripadvisor Group's **425,000+** tours, activities and attractions become
  bookable directly inside Airbnb, with the integration expected to launch later
  this year. Airbnb is dropping its build-your-own strategy for Experiences.
  https://skift.com/2026/08/11/airbnb-partners-with-tripadvisor-experiences-drops-build-your-own-strategy/
  https://www.phocuswire.com/news/distribution/airbnb-partners-tripadvisor-scale-experiences
  https://ir.tripadvisor.com/news-releases/news-release-details/tripadvisor-group-and-airbnb-announce-experiences-partnership
- For Tripadvisor (Viator + Tripadvisor Experiences) this sits alongside existing
  distribution deals with Booking.com and Expedia — it is becoming the
  experiences supply layer for all three majors.
- Read with Airbnb's July move to open its app to independent hotels in 20
  cities, the pattern is consistent: aggregate other people's supply, own the
  whole trip.

### Q2 2026 earnings: domestic demand carried both majors

- **Expedia Group Q2 revenue $4.32B, +14% YoY**; full-year 2026 gross bookings
  guidance raised to **$129.5B–$130.8B**. Shares rose ~9% after hours.
- Both Expedia and Booking Holdings beat Q2 estimates, with **US domestic travel
  offsetting cross-border softness and Middle East disruption**.
  https://www.marketscale.com/industries/hospitality/domestic-travel-carries-expedia-and-booking-holdings-past-q2-estimates-as-cross-border-headwinds-persist
- Expedia remains #2 OTA by bookings; lodging was ~80% of 2025 sales, advertising
  ~8% and growing.

### B2B is the open front between Booking and Expedia

- **Booking Holdings is consolidating the B2B units of Agoda, Booking.com and
  Priceline** into one business, led by Agoda's CEO — still widely seen as a
  distant second to Expedia.
- **Expedia is broadening B2B beyond hotels** toward a one-stop shop (2026-08-05),
  with the **CarTrawler acquisition** (closing H2 2026) as the anchor move.
  https://skift.com/2026/08/05/expedia-is-investing-in-its-leading-b2b-product-as-competition-heats-up/
  https://www.phocuswire.com/news/startups/startup-funding-mergers-acquisition-q2-2026

### Agentic AI: live, but still <1% of bookings

- **Google's limited US test of agentic hotel booking inside Search AI Mode** is
  running, with Booking Holdings among the first partners. **IHG** is also in a
  Google agentic booking pilot.
  https://www.phocuswire.com/news/online/ihg-google-agentic-ai-booking-pilot
- **AI-referred bookings remain under 1%** — Booking Holdings processed 325M room
  nights in Q2 2026; fewer than 3.25M came via an AI referral.
- **ChatGPT ads are now live for hotels at roughly $3.00–$3.50 CPC.**
  https://www.hospitalitynet.org/editorial/4133922/tripadvisor-and-airbnb-merge-experiences-inventory-chatgpt-ads-are-live-for-hotels-at-3-350-cpc-your-ai-edited-copy-is-now-watermarked-by-law
- **Fliggy** announced a new agentic AI travel assistant.
  https://www.phocuswire.com/news/technology/fliggy-announces-latest-agentic-ai-travel-assistant
- Counter-current worth tracking: **AI tooling is becoming a single point of
  failure for hotels**, and AI-generated review summaries are proving hard to keep
  accurate and objective. **Agoda's Tim Hughes** is publicly sceptical about
  online travel's "broken promise" and AI's Reddit-sourcing dilemma.
  https://www.phocuswire.com/opinion/technology/ai-tools-becoming-single-point-failure-hotels-reduce-risk
  https://www.phocuswire.com/news/online/agoda-tim-hughes-online-travel-broken-promise-ai-reddit-dilemma

### Product and partner news (week of 2026-08-14)

- **Agoda launched the Agoda Partner Portal** — a rebuilt yield control system
  with AI review summaries, nearby-property benchmarking and 90-day forward
  suggestions via Agoda Intelligence.
- **Mews Financial Services won an e-money licence** from the Dutch central bank,
  giving it regulated EEA status and letting it bring payments in-house.
- **AirDNA launched Rentalizer Agent**, turning Rentalizer from a revenue
  estimator into a full US short-term-rental underwriting tool across six areas
  including applicable regulation and zoning.
- **Stay22 launched an API** for embedded hotel and rental search; partner count
  doubled in four weeks.
- **Navan Edge + OpenTable** embeds restaurant reservations into corporate trip
  booking. **Spotnana** launched a direct NDC integration with Singapore Airlines.
  **TourRadar** launched TourRadar+ loyalty (up to 7% off across operators).
  **Ryanair signed a five-year Google Cloud deal** including Gemini Enterprise
  for 35,000 employees.
  https://www.phocuswire.com/travel-tech-news-briefs/2026/aug-14

### Monetisation pressure on supply

- As of 2026-08-03, both **Expedia (Accelerator)** and **Booking.com (Visibility
  Booster)** let property owners pay higher commission to lift search ranking —
  pay-to-rank is now standard on both platforms.

### Funding and M&A

- Travel-tech funding reached **~$1.7B in the first five months of 2026** (vs
  $1.1B in the same period of 2025), but **Q2 slowed** and M&A became the
  dominant story.
- Q2 rounds: **Smartness €47M Series B**, **WeRoad $58M Series C** (led by
  Airbnb), **The Hosteller $16M Series B**. Deals: **Expedia/CarTrawler**,
  **Juniper/Deem**, **Lighthouse/Hotelrank.ai**. Earlier in 2026: Mews $300M,
  Kindred $125M. **Expedia acquired Layla** (AI trip planning). **Fora Travel** is
  valued around $1B.
  https://airguide.info/travel-startup-funding-slows-in-q2-as-ma-activity-accelerates/

### Regulatory

- **EU Regulation 2024/1028 in force since 2026-05-20.** Platforms must transmit
  monthly booking data to each Member State's Single Digital Entry Point, verify
  and display host registration numbers, and can be ordered to disable
  non-compliant listings. Enforcement intensity ramps into 2027 — listing data
  quality is now a compliance exposure.
- **The EU AI Act** now has direct implications for travel operators; separately,
  **AI-edited copy must be watermarked by law** in some jurisdictions.
  https://www.phocuswire.com/news/technology/what-eu-ai-act-means-for-travel-industry
- **China SAMR anti-monopoly investigation** opened January 2026 against a major
  OTA (potential fines ~$900M+), alongside regional pricing-conduct
  rectifications and a US securities class action.
- Urban short-term-rental regulation continues to push institutional capital
  toward luxury and mid-term rental models.

### Demand and market conditions

- **Skift Research's State of Travel 2026** (fifth edition) reframes the $11T
  industry around a four-layer "Travel Stack": Consumers, Commerce, Operations,
  Experiences.
- **52% of travellers say they will adjust plans rather than cancel** because of
  rising prices — cost-cutting, not demand destruction.
  https://travelmole.com/news/skift-state-of-travel-report-2026
- **Global business travel spend projected at $1.71T for 2026** on only a 1.3%
  trip-volume increase; 69% of travellers say they trust AI for booking.
- **Thailand's online travel boom** is drawing an AI surge into an already
  crowded digital landscape.
  https://www.phocuswire.com/news/technology/ai-surge-meets-crowded-digital-landscape-thailand-online-travel-boom

### Calendar

- **Skift IDEA Awards** winners: **2026-08-26**.
- **Travel Marketing AI Summit London**: 2026-09-08.
- **Skift Global Forum 2026** — theme "Travel's Great Recalibration"; second round
  of speakers announced 2026-08-11, including CEOs/chairs from Expedia, Airbnb,
  Hilton, Uber, Booking Holdings, Accor, Wyndham, Carnival, Qatar Airways.
  https://skift.com/2026/08/11/skift-global-forum-2026-second-round-speakers/
- **The Phocuswright Conference 2026**: 2026-11-17 to 11-19, Ft. Lauderdale.
