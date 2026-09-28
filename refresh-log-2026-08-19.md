# OTA Dashboard Refresh Log

## Run: 2026-08-19 (scheduled task `refresh-ota-travel-dashboard`)

**Status: BLOCKED — live site not refreshed. Seventh consecutive non-deploying
run. One blocker that was marked resolved last run has regressed.**

Step 1 (news gathering) succeeded. Steps 2 and 3 (browser) were impossible
again — no browser. Step 4 (delivery) intentionally skipped per the task
definition.

---

### ❌ Blocker 1 — still no browser (blocks steps 2 and 3)

The Claude in Chrome extension is unreachable. `tabs_context_mcp` returned
"Claude in Chrome is not connected" on two attempts with a 15s wait between,
and `list_connected_browsers` returned `[]`.

https://prototypes.sandcastle.musta.ch/ota-dashboard/ was never opened in a
browser, so no input field or refresh control could be located or used. This is
**not** an SSO or login-wall failure. No workarounds were attempted.

A read-only `web_fetch` of the URL returned an empty body (the page is
client-rendered, so this is expected and tells us nothing about freshness).

### ❌ Blocker 2 — `kyber deploy` still fails (unchanged since 2026-08-06)

The last cron run still ends with:

    airtool is required to run kyber. Connect to VPN and run kyber again so it
    can be downloaded and installed.

`dist/index.html` is still dated **2026-08-05 17:18**. The live dashboard is
serving content roughly **14 days stale**, even though a good build sits in
`public/` (index.html 2026-08-17 17:06, 230 KB). `dist/` was left untouched —
staging locally would not change the live site, and deploying is outside this
task's scope.

**This remains the single thing standing between the live site and current
content.**

### ⚠️ Blocker 4 — REGRESSED: the cron did not fire on 2026-08-18

Marked resolved last run, but it has skipped a slot. `scripts/refresh.log` is
last modified **2026-08-17 17:06 PDT** and its final entry is the 2026-08-17
17:00 PDT run. There is **no 2026-08-18 17:00 entry at all** — the job did not
run, rather than running and failing (a failed fetch would still have written
log lines, as the 08-14 entry shows).

Combined with the WAT → PDT timezone flip noted last run, the schedule on the
host looks unstable. Worth checking `launchd`/`crontab` and whether the machine
was asleep at 17:00 on 08-18.

### ✅ Empty-result guard confirmed working

`scripts/fetch-news.cjs` was invoked from this sandbox as a check. DNS for
`news.google.com`, `skift.com` and `techcrunch.com` all return `EAI_AGAIN` here
(the sandbox only has allowlisted egress), so the fetch has no feeds available.
The guard added last run means this is now safe — the script cannot overwrite
`public/news-data.js` with an empty set. Nothing was written this run.

This also means the sandbox **cannot** substitute for the cron: the RSS refresh
has to happen on the Mac.

---

### Remaining fix (requires a human on the Mac, ~2 minutes)

1. Connect to VPN, run `kyber` once so airtool installs, then:
   `cd "~/Claude Projects/ota-dashboard" && bash scripts/refresh-and-deploy.sh`
   That fetches current news and publishes a real build.
2. Check why the 2026-08-18 17:00 slot never fired (asleep host? TZ change?).
3. Add a failure alert — `kyber deploy` has now failed silently for two weeks
   into a log nobody reads. Even
   `|| osascript -e 'display notification ...'` would do.
4. For the browser path: install / sign in to the Claude in Chrome extension
   (https://chromewebstore.google.com/detail/fcoeoabgfenejglbffodgkkbkcdhcgfn).
5. **Recommendation, unchanged and now stronger:** retire this Cowork task and
   keep the cron. This task cannot deploy by design and has produced seven
   consecutive non-deploying runs. The cron only needs the VPN/airtool fix.

No summary, email or Slack message was sent (pure background task, per the task
definition).

---

## Travel / OTA news gathered 2026-08-19 (ready to paste if a manual refresh is done)

Gathered via web search. Note: little genuinely new appeared in the last 24
hours — the Airbnb × Tripadvisor experiences deal and the Q2 earnings cycle from
the 08-18 log are still the live stories. New or updated items are marked
**[new]**.

### Major players

- **Booking Holdings** — Q2 2026 (reported 3 Aug) revenue **$7.35bn, +8% YoY**,
  ahead of the $7.19bn consensus. Beat driven by domestic travel; cross-border
  headwinds persist.
- **Expedia Group** — beat its own guidance for the **fifth straight quarter**
  and raised 2026 gross bookings guidance to **$130.8bn**. The **CarTrawler**
  acquisition is still expected to close in H2 2026, building out its B2B
  "one-stop shop."
- **Airbnb** — earnings and revenue beat with strong Q3 guidance; leadership
  signalled materially higher AI spend. **[new]** Separately, on 31 July Airbnb
  opened the app to **thousands of independent hotels across 20 cities**, with
  hotel bookings earning guests up to **15% credit** toward a future Airbnb home
  stay. The Tripadvisor experiences tie-up (~425,000 tours and activities)
  launches later in 2026.
- **Agoda** — **[new]** late-summer demand release for the Indian market: metros
  dominate solo-traveller searches (flexibility, urban experiences); **Goa** is
  the top interest for both solo and group travellers. Follows the Agoda Partner
  Portal launch and continuing APAC tourism-board campaigns.
- **Tripadvisor** — no new corporate news in the window beyond the Airbnb
  partnership. SeatGuru relaunched 20 May 2026 after its Oct 2025 shutdown.
- **Shared headwind** — all three of Booking, Expedia and Airbnb flagged the
  **ongoing Middle East conflict** pressuring long-haul international travel,
  lifting airfares and squeezing capacity on affected routes.

### Trends

- **AI is the sector's centre of gravity.** **97.8%** of travel executives now
  expect AI to affect the industry within 1–5 years, and **28%** of global
  travellers have already used tools like ChatGPT to plan a trip. The constraint
  is trust and data quality, not capability.
- **OTAs remain the research layer even when they lose the booking** — **80%** of
  online bookers visit an OTA at some point before booking, including those who
  ultimately book elsewhere.
- **Tours & activities is outpacing travel overall** but distribution lags —
  **$253bn** market in 2024, projected **$342bn by 2029**.
- **[new] Summer demand holding up in the US** — **71%** of consumers plan to
  spend the same or more than last summer, at **>$2,800 per adult**. The weeks of
  **17 and 31 August** are currently the cheapest to book.
- **[new] PATA Travel Mart 2026** opened in Sarawak, Malaysia — APAC destination
  and partnership dealmaking.

### Funding / M&A

- Q2 2026 startup funding **slowed** (fewer large rounds Apr–Jun) while **M&A
  became the dominant mode**; Q1 2026 deal volume had already hit a record low.
- **[new] Smartness** (hotel tech) raised **€47m Series B** — one of the quarter's
  largest.
- **[new] WeRoad** (group travel) raised a **$58m Series C led by Airbnb**.
- **[new] The Hosteller** (Indian hostel operator) raised **$16m Series B**.
- **[new] Juniper → Deem** (corporate travel tech) and **Lighthouse →
  Hotelrank.ai** (AI hotel operating platform) both closed.
- **Expedia → CarTrawler** remains the standout strategic deal (H2 2026 close).
- Incumbents (Expedia, Booking, Amadeus) are steering M&A toward **"agent-ready"
  B2B services**. Analysts do not expect 2026 to be a large M&A year overall, but
  do expect more **pre-emptive approaches** in the CarTrawler mould.

### Regulatory

- **EU STR data-sharing regulation (EU) 2024/1028 — the Single Digital Entry
  Point rule — hit its compliance deadline on 20 May 2026 and is now in full
  force.** Airbnb, Booking.com and Vrbo must randomly verify host registration
  numbers against national databases, display those numbers on listings, and send
  **monthly activity reports** (nights booked, guest counts) to national
  authorities. Platforms move from passive intermediaries to **jointly
  responsible actors**.
- **Enforcement has teeth** — authorities can order a platform to remove or
  disable a non-compliant listing **within days**, and SDEP enables cross-border
  flagging between member states. The regulation does not set night caps, permit
  rules or tourist-tax rates; those stay local.
- **EU AI Act** obligations remain a live compliance question for travel.
- **Booking.com** is still the reference case for DMA enforcement on parity
  clauses and ranking transparency; the Spanish CNMC fine remains suspended
  pending appeal, reduced ~€75m by DMA-driven parity changes.
- **Mews Financial Services** holds a Dutch central bank e-money licence,
  bringing payments in-house under safeguarding, fraud-monitoring, sanctions and
  AML obligations.

### Sources

- https://www.webintravel.com/travel-just-wont-quit-what-booking-expedia-and-airbnbs-q2-results-tell-us/
- https://www.marketscale.com/industries/hospitality/domestic-travel-carries-expedia-and-booking-holdings-past-q2-estimates-as-cross-border-headwinds-persist
- https://www.nomadlawyer.org/booking-holdings-expedia-airbnb-travel-booking-sector-stocks-ai-demand-2026
- https://www.prnewswire.com/apac/news-releases/from-solo-escapes-to-group-getaways-agoda-reveals-where-indian-travelers-are-considering-next-302839714.html
- https://www.phocuswire.com/news/startups/startup-funding-mergers-acquisition-q2-2026
- https://airguide.info/travel-startup-funding-slows-in-q2-as-ma-activity-accelerates/
- https://www.phocuswire.com/news/distribution/tours-activities-distribution-phocuswright-research-2026
- https://www.minut.com/blog/eu-short-term-rental-regulations
- https://www.rentalscaleup.com/short-term-rental-regulations-2026-eu-australia-us/
- https://eur-lex.europa.eu/EN/legal-content/summary/online-short-term-accommodation-rental-services-data-collection-and-sharing.html
- https://www.ustravel.org/research/monthly-travel-data-report
- https://www.perk.com/blog/online-travel-booking-statistics/
- https://www.travelagewest.com/Industry-Insight/Business-Features/summer-2026-travel-trends
