# OTA Dashboard Refresh Log

## Run: 2026-08-11 06:25 WAT (scheduled task `refresh-ota-travel-dashboard`)

**Status: BLOCKED — refresh not applied to the live site.**

### Blocker 1 — no browser (blocks steps 2 and 3)

The Claude in Chrome extension is not reachable. `tabs_context_mcp` returned
"Claude in Chrome is not connected" on two attempts, and
`list_connected_browsers` returned an empty list `[]`. Without a connected
browser, https://prototypes.sandcastle.musta.ch/ota-dashboard/ could not be
opened, so no input field or refresh control could be found or used.

This is **not** an SSO or login-wall failure — the page was never reached.
This is the third consecutive run with the same blocker (see 2026-08-09 log).

### Blocker 2 — the local cron pipeline builds but cannot deploy (root cause)

Independent of the browser problem, this prototype already has its own refresh
pipeline (`scripts/refresh-and-deploy.sh`, daily cron at 10:00 PT). Reviewing
`scripts/refresh.log`:

- The fetch and inline steps **succeed** every day. `public/index.html` was
  rebuilt 2026-08-10 17:06 with 32 fresh articles (8 each: ota, hotels,
  airlines, tech).
- The final `kyber deploy` step **fails** every day with:
  `airtool is required to run kyber. Connect to VPN and run kyber again so it
  can be downloaded and installed.`
- Result: `dist/index.html` is still dated **2026-08-06 01:18**, so the live
  dashboard is serving content roughly five days stale even though fresh
  content is sitting ready in `public/index.html`.

Also worth noting from the log: the Phocuswire, Travel Weekly and Hospitality
Net RSS feeds are returning 403/404, so those sources are silently dropping out
of every fetch.

### Fix

1. On the Mac, connect to VPN and run `kyber` once so airtool installs.
2. Then run `bash scripts/refresh-and-deploy.sh` — the already-built fresh
   content will deploy.
3. To make step 2 self-healing, add a VPN precheck and a failure alert to
   `refresh-and-deploy.sh`; right now `kyber deploy` fails silently to a log
   nobody reads.
4. For the browser path: install / sign in to the Claude in Chrome extension
   (https://chromewebstore.google.com/detail/fcoeoabgfenejglbffodgkkbkcdhcgfn).
5. Consider retiring this Cowork task in favour of the cron, since the cron
   already does the same work more reliably once airtool is fixed.

No workarounds were attempted. No summary, email or Slack message was sent
(pure background task, per the task definition).

**Step 1 (news gathering) completed successfully.** The content below is ready
to paste into the dashboard on the next run.

---

## Travel / OTA news — as of 2026-08-11

### Airbnb pushes further into hotels
- **Airbnb opened its app to thousands of independent hotels across 20 cities**
  (announced 2026-07-31). Hotel bookings carry up to 15% credit toward a future
  Airbnb home stay — an explicit play to become an all-in-one travel app and
  own the whole trip rather than just the stay.
  https://www.ownerrez.com/blog/expedias-latest-moves-airbnbs-hotel-plans-and-a-new-platform-on-the-rise
- Airbnb's broader positioning continues to lean on "flexible living" — the
  blurring of residency and travel driven by remote work and digital nomads —
  plus AI personalisation.
  https://travel-leisure.news-articles.net/content/2026/08/07/airbnb-the-shift-toward-experiential-living.html

### Sector and market structure
- **Booking Holdings still holds the largest market cap** among listed online
  travel companies as of June 2026, ahead of Airbnb and Expedia.
  https://www.statista.com/statistics/1039616/leading-online-travel-companies-by-market-cap/
- Booking Holdings, Expedia and Airbnb are all drawing increased investor
  interest on the combination of solid Q2 earnings, fast AI deployment and
  sustained global tourism demand.
  https://www.nomadlawyer.org/booking-holdings-expedia-airbnb-travel-booking-sector-stocks-ai-demand-2026
- **Skift's "Travel Industry Power-Struggle Map" (2026-08-02)** frames travel not
  as one market but as parallel fights over who answers the traveller, who gets
  found, who owns the booking, who controls inventory, who holds the wallet and
  who remembers the trip.
  https://skift.com/2026/08/02/the-travel-industry-power-struggle-map/

### Funding and M&A
- **Skift launched a quarterly Capital Allocation Brief (2026-08-09)** tracking
  where travel's money goes — M&A, venture, buybacks, take-privates.
  https://skift.com/2026/08/09/skift-capital-allocation-brief-a-new-quarterly-read-on-where-travels-money-goes/
- **Expedia Group / CarTrawler** is still expected to close in H2 2026.
- **Mews raised $300M** and paired it with acquisitions of Flexkeeping and
  DataChat. **Canary Technologies acquired OpenKey** (February) for digital
  door-lock integrations.
- Q2 2026 was a quiet quarter for travel startup funding, skewed to seed and
  Series B. Hospitality tech startups raised over $1B across 40 companies
  between April 2025 and March 2026, with property management systems taking the
  largest share. Large OTAs are only buying at the hundreds-of-millions level.
  https://www.phocuswire.com/news/startups/startup-funding-mergers-acquisition-q2-2026
  https://www.traveltechtalent.com/insights/travel-tech-news-hotel-tech-crosses-the-billion-dollar-funding-mark-2026-06-30

### Regulatory
- **EU Regulation 2024/1028 is now live.** The 2026-05-20 compliance deadline has
  passed. Airbnb, Booking.com and other short-term rental platforms must now
  transmit monthly activity data to national Single Digital Entry Points across
  all 27 Member States, alongside host registration numbers and platform-side
  verification. Listings are suspended where a permit lapses or PMS-to-OTA data
  parity fails — meaning data quality is now a compliance risk, not just an ops
  one.
  https://single-market-economy.ec.europa.eu/news/new-rules-bring-increased-transparency-short-term-rentals-sector-2026-05-20_en
  https://www.theregreview.org/2026/03/11/schroeter-mukamayanja-the-eus-transformative-short-term-rental-regulation/
  https://www.rentalscaleup.com/short-term-rental-regulations-2026-eu-australia-us/

### Product and AI
- **Agoda shipped a multi-product booking engine** — hotels, flights and
  activities in one transaction, consolidated in My Trips.
- **Booking Holdings launched BKNG Ads**, one advertising identity across
  Booking.com, Priceline and Agoda.
- **Fliggy, Agoda and Trip.com are launch partners** for Ant International's
  AI travel agent.
- **Tripadvisor showed an AI feature with Nvidia, Nebius and Nexla** at Nvidia
  GTC 2026.
  https://www.phocuswire.com/news/technology/agoda-cpo-ittai-chorev-real-time-travel-updates-ai-search

### Operations
- **Low water levels in Europe are disrupting river cruises**, with one Viking
  ship running aground.
  https://skift.com/

### Calendar
- **2026 Skift IDEA Awards** finalists announced 2026-08-07 from 490+ entries;
  winners 2026-08-26.
  https://skift.com/2026/08/07/2026-skift-idea-awards-meet-the-finalists/

### Carried forward from 2026-08-09 (still the dominant storyline)
- AI discovery is reshaping the top of the funnel far faster than the booking
  step. Booking Holdings reported AI referrals at **under 1% of room nights**
  despite rising AI visibility; Expedia is investing in AI that does not convert
  yet; Trivago spent more on AI in the first seven months of 2026 than in all of
  2025.
- Google moved agentic hotel booking into live testing and added hotel discovery
  to Ask Maps — distribution power is shifting toward Google and AI assistants.
