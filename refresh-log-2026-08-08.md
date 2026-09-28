# OTA Dashboard Refresh — Internal Log

**Run:** Scheduled task `refresh-ota-travel-dashboard` — 2026-08-08 (background, no user present)
**Outcome:** ⚠️ Refresh NOT completed. News gathered (step 1) ✅. Steps 2–3 blocked. No summary/email/Slack sent, per task instructions. No workarounds attempted against the internal sandcastle URL.

This is the **third consecutive run** to fail with the same blockers (see 2026-07-28 entry in `scripts/refresh.log` line ~419, and `refresh-log-2026-08-07.md`). The task as currently designed cannot succeed — see "Root cause" below.

---

## Blockers

1. **Claude in Chrome not connected.** `tabs_context_mcp` timed out (180s), then reported the extension unreachable; `list_connected_browsers` returned `[]`. The live URL was never reached — **no login wall or SSO error was encountered**, so this is not an auth problem.

2. **The deployed dashboard has no runtime news-input or refresh UI.** News is baked into `public/index.html` at deploy time by `scripts/inject-news.cjs`. There is nothing on the live page to paste news into, so step 3 as written is architecturally impossible even with a working browser.

3. **This session's shell is an isolated Linux sandbox, not Bimpe's Mac.** No `kyber` CLI, no VPN/SSO, RSS feeds unreachable. Neither `fetch-news.cjs` nor `kyber deploy` can be run from here.

## Root cause — the live dashboard has been stale since Jul 6

The real refresh path is the local cron `scripts/refresh-and-deploy.sh` (10am PT daily). Reading `scripts/refresh.log`:

- The **fetch and inline steps succeed** every run. `public/news-data.js` is current (last generated Aug 7, 2026 5:00 PM, 32 articles across ota/hotels/airlines/tech).
- The **`kyber deploy` step fails every run** with:
  > `airtool is required to run kyber. Connect to VPN and run kyber again so it can be downloaded and installed.`
- **14 consecutive deploy failures.** Last successful deploy: **Mon Jul 6 14:37 PDT 2026**. Every run since (Jul 15 → Aug 7) has failed.

So `https://prototypes.sandcastle.musta.ch/ota-dashboard/` is serving **~1-month-old content**, while the local files are fresh. The problem is not news gathering — it's that the deploy can't authenticate.

## Recommended fixes (need Bimpe, can't be done from a background run)

- **Fix the deploy:** on the Mac, connect to VPN and run `kyber` once so `airtool` installs, then re-run `bash scripts/refresh-and-deploy.sh`. That alone would push the already-fresh Aug 7 news live. The cron will keep failing until `airtool` is present *and* the machine is on VPN at 10am PT — worth adding a VPN check + failure alert to the script.
- **Retire or rewrite this Cowork scheduled task.** Its premise (drive a browser UI to paste news in) doesn't match how the dashboard works. Better: have it verify the cron's deploy succeeded and flag staleness, or drop it in favour of the cron.
- If browser automation is still wanted, install/sign in to the Claude in Chrome extension (same account) with the side panel open.

---

## Travel news gathered (as of 2026-08-08)

### Earnings — Q2 2026 (all reported this week)

| Company | Revenue | Growth | Notes |
|---|---|---|---|
| **Booking Holdings** (Aug 4) | $7.35B | +8% YoY | Adj. EPS $2.54 (+15%); room nights +5%; gross bookings +9% (~8% cc). Record capital return, but growth pace slowing. |
| **Expedia Group** (Aug 5) | $4.32B | +14% YoY | Gross bookings +12%; adj. EBITDA $1.1B; net income $878M (from $330M), diluted EPS $7.16 (+188%). Lodging rev +13% to $3.43B; **B2B +23% to $1.49B**. Cash + ST investments $7.13B. **FY26 guidance raised** to $129.5–130.8B bookings (+8–9%), $16.05–16.22B revenue (+9–10%), margin +150–175bps. Bought back ~880k shares for $200M in Q2 ($1.06B YTD). |
| **Airbnb** (Aug 6) | $3.6B | +17% YoY | GBV $27.2B (+16%); nights & seats +10% (accelerating from Q1). Net income $816M (23% margin); adj. EBITDA $1.3B (35%); FCF $1.25B (+30%). **App nights +23%, now 64% of nights booked. First-time bookers +11% — best in four years.** LatAm ~+20%, APAC high-teens, NA/Europe high-single-digit. Q3 guide $4.69–4.77B (+15–17%); FY adj. EBITDA margin raised to ≥35.5%. |
| **Tripadvisor** (Aug 6) | $441.9M | **−7% YoY** | Big miss vs. ~$506M consensus → **~20% premarket drop**. Hotels & Other −21% to $163.3M. GAAP net income from continuing ops −38% to $22.8M; adj. EBITDA −21% to $76.4M. Viator the lone bright spot. |

**Read-through:** the B2B/supply-side and app-native players (Expedia B2B, Airbnb app + first-time bookers) are compounding, while the search/meta-dependent hotel funnel (Tripadvisor Hotels −21%) is being squeezed hardest.

### M&A / funding

- **Tripadvisor selling TheFork to American Express for $700M** — confirmed alongside Q2 results.
- **Expedia acquiring CarTrawler** — expected to close H2 2026; builds out its B2B "one-stop shop".
- Q2 2026 M&A outpaced funding for buzz: **Juniper acquired Deem**; **Lighthouse acquired Hotelrank.ai**.
- Funding stayed slow and early-stage-weighted: **Smartness €47M Series B**, **The Hosteller $16M Series B**. Q1 2026 was ~$1B across 44 rounds (vs. 66 rounds / ~$1.2B in Q1 2025). APAC tightening as the market matures.
- Investor mood: AI is absorbing the capital, and investors are starting to look past the AI framing to actual traction.

### Regulatory

- **EU Regulation 2024/1028 (short-term rentals) in force since May 20, 2026.** Member states and platforms must run interoperable registration and data-sharing systems. Platforms (Airbnb, Booking.com, Vrbo) must randomly verify host registration numbers against national databases, display them on listings, and file monthly activity reports with national authorities.
- Airbnb (George Mavros, Head of EU Govt Affairs) says it's ready to comply but is **publicly worried not all member states are**.
- Enforcement is live and expensive: **Spain fined Airbnb €64M** for advertising unlicensed tourist rentals; Airbnb pulled **65,000 listings in July**; **Barcelona will end licences for 10,101 tourist apartments by Nov 2028**.

### AI / distribution

- **Booking.com and Expedia hold the commanding lead in OpenAI's ChatGPT app marketplace** — they were the launch travel apps and remain the default.
- **OpenAI walked back in-chat checkout** (Mar 2026), refocusing ChatGPT on discovery and routing the transaction to the OTA. On that news **EXPE +12%, BKNG +8%** — the market read agentic AI as a demand channel for OTAs, not a disintermediation threat. Google's AI Mode is converging on the same "explore in chat, book on the OTA site" split.
- **Airbnb** is testing a toggle-able AI-powered search experience and says AI is speeding up its product release cadence (Chesky: went from middle-of-the-pack to "a leader in AI").
- 97.8% of travel executives expect AI to affect the industry within 1–5 years.

### Market context

- OTA market ~$718.9B in 2026 → ~$1,316.8B by 2033 (~9.0% CAGR). Other estimate: $943B (2025) → $996B (2026).
- **Mobile: 68% of travel searches, 63% of bookings globally** — consistent with Airbnb's 64% app-nights figure.
- European hotel share: **Booking.com ~69.3%, Expedia Group ~11.5%.**
- **Agoda / APAC:** secondary cities growing 15% faster than traditional hubs (Japan: Takamatsu +63%, Matsuyama +44%, Sendai +32%); shorter/more frequent trips (32% of Indonesian travellers plan 11+ trips in 2026); **outbound from China and India above pre-pandemic for the first time**; 76% of business travellers plan bleisure (85%+ in PH/TH/VN); free cancellation and pay-at-hotel among the top search filters.

### Sources

- https://www.stocktitan.net/sec-filings/BKNG/8-k-booking-holdings-inc-reports-material-event-2a76282a0cca.html
- https://www.investing.com/news/company-news/booking-holdings-q2-2026-slides-record-capital-return-growth-slows-93CH-4836178
- https://www.stocktitan.net/news/EXPE/expedia-group-reports-second-quarter-2026-x1rehozp6kdv.html
- https://www.stocktitan.net/sec-filings/EXPE/8-k-expedia-group-inc-reports-material-event-99028e8d3424.html
- https://news.airbnb.com/airbnb-q2-2026-financial-results/
- https://www.cnbc.com/2026/08/06/airbnb-abnb-q2-earningsreport.html
- https://www.stocktitan.net/sec-filings/TRIP/8-k-trip-advisor-inc-reports-material-event-c6b0c6de265b.html
- https://au.investing.com/news/transcripts/earnings-call-transcript-tripadvisor-q2-2026-revenue-miss-sparks-20-premarket-drop-93CH-4581936
- https://www.travelerstoday.com/articles/60777/20260807/tripadvisors-hotel-search-falls-21-percent-while-viator-keeps-growing.htm
- https://www.phocuswire.com/news/startups/startup-funding-mergers-acquisition-q2-2026
- https://airguide.info/travel-startup-funding-slows-in-q2-as-ma-activity-accelerates/
- https://shorttermrentalz.com/news/eu-short-term-rental-data-rules-europe/
- https://www.rentalscaleup.com/short-term-rental-regulations-2026-eu-australia-us/
- https://news.airbnb.com/europes-short-term-rental-rules-are-changing-we-need-to-get-them-right/
- https://www.phocuswire.com/ai-new-gatekeepers-how-booking-expedia-hijacking-future-of-travel
- https://skift.com/2026/03/05/openai-chatgpt-checkout-walkback/
- https://techcrunch.com/2026/08/07/airbnb-says-ai-is-helping-it-ship-features-faster-as-it-tests-a-new-search-function/
- https://skift.com/2026/08/06/airbnb-is-growing-faster-than-rivals-as-ai-speeds-up-product-releases/
- https://www.grandviewresearch.com/industry-analysis/online-travel-agencies-market-report
- https://www.ttgasia.com/2026/05/19/agoda-highlights-shifting-asian-travel-trends-driving-demand/
- https://www.agoda.com/press/agoda-2026-travel-outlook-report-b2b/
