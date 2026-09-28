# OTA Dashboard Refresh Log — 2026-09-15

**Run type:** scheduled background refresh (`refresh-ota-travel-dashboard`)
**Outcome:** ⚠️ **Live site NOT refreshed.** Blocked at two independent points. No writes were made to the dashboard or its data files.

---

## Summary

The live dashboard at `https://prototypes.sandcastle.musta.ch/ota-dashboard/` could not be
reached or updated. Separately, investigation of the local refresh pipeline surfaced a
pre-existing problem that matters more than today's run: **the live site has not received a
successful deploy since 2026-07-06.** The nightly cron has been fetching fresh news
correctly every day, but the deploy step has failed 38 consecutive times.

---

## Blocker 1 — Could not open the live page

The task called for driving the page with the Claude in Chrome tools. Neither browser worked:

| Browser | Result |
|---|---|
| Claude in Chrome | `Claude in Chrome is not connected` — extension unreachable / not signed in |
| Built-in browser pane | `prototypes.sandcastle.musta.ch is blocked by your organization's policy` |

Per the task instructions, no workarounds were attempted. Note this is **not** an SSO/login
wall — the request never got far enough to authenticate. It is a client-side availability
problem in both cases.

## Blocker 2 — The dashboard has no in-page refresh control

Worth recording for future runs so this isn't re-investigated: there is no input field,
paste area, or "update" button on the page to feed news into. The dashboard is a static
Kyber HTML prototype. Refresh happens entirely outside the browser, via a local cron:

```
scripts/refresh-and-deploy.sh   # daily @ 17:00 PT
  ├─ node scripts/fetch-news.cjs    → writes public/news-data.js from RSS feeds
  ├─ node scripts/inject-news.cjs   → inlines that data into public/index.html
  └─ kyber deploy                   → publishes to sandcastle
```

Steps 3–4 of the task file (find an input, feed news in) do not apply to this dashboard and
should be rewritten to reference this pipeline instead.

## Blocker 3 — `kyber deploy` has been failing since July 6 ⚠️

This is the finding that needs attention. From `scripts/refresh.log`:

- **Last successful deploy:** `Mon Jul 6 14:37:00 PDT 2026`
- **Failed deploys since:** 38 consecutive runs
- **Error, every time:**
  `airtool is required to run kyber. Connect to VPN and run kyber again so it can be downloaded and installed.`

The cron runs at 17:00 PT, when the machine is typically not on VPN. `fetch-news.cjs` and
`inject-news.cjs` both succeed (they only need public RSS + local disk), so the *local*
files look perfectly healthy — which is why this has gone unnoticed. Only the publish step
fails, silently, into the log.

**Current state of the data:**

| File | Data as of |
|---|---|
| `public/news-data.js` | Sep 14, 2026, 5:00 PM PDT ✅ current |
| `public/index.html` | Sep 14, 2026, 5:06 PM PDT ✅ current |
| `dist/news-data.js` | Sep 2, 2026 ❌ stale |
| `dist/index.html` | Sep 3, 2026 ❌ stale |
| **Live site** | ~Jul 6, 2026 ❌ **~10 weeks stale** |

Per `CLAUDE.md` ("Surface VPN/auth errors to the user"), this is being surfaced rather than
worked around. A deploy cannot be performed from this session — `kyber` runs on the Mac and
needs VPN + `airtool`; this session only has an isolated Linux sandbox.

### Secondary issue spotted while reading the scripts

`refresh-and-deploy.sh` runs `inject-news.cjs` (which writes `public/index.html`) and then
`kyber deploy` — but never copies `public/` → `dist/`. The `npm run refresh-news` script
*does* include that copy. If `dist/` is what gets published, a fixed deploy could still ship
stale content. Recommend reconciling the two paths before the next deploy.

### Suggested fix

Run manually while on VPN to clear the backlog:

```bash
cd "/Users/bimpe_abimbola/Claude Projects/ota-dashboard"
npm run refresh-news     # fetch + copy to dist + deploy
```

Longer term, either move the cron to a time when VPN is reliably up, or have
`refresh-and-deploy.sh` detect the `airtool`/VPN failure and alert instead of exiting
quietly into the log.

---

## News gathered today (not yet published)

Collected in step 1 before the blockers were hit. Recorded here so it isn't lost; the
`fetch-news.cjs` RSS pipeline remains the source of truth for the dashboard itself.

### OTAs & marketplaces

- **EU General Court upholds the block on Booking's €1.63B Etraveli acquisition.** The
  ruling endorses the theory that a dominant firm expanding into an adjacent business
  (flights feeding hotels) can harm competition. Leaves Expedia with the clearer runway on
  European M&A. (Skift, Sep 10)
- **Booking running five consumer-facing AI experiments**, with Agoda's next in line. Both
  Booking and Expedia are attacking AI from several angles at once — chatbots, specialized
  agents, and startup investments. (Skift, Sep 14)
- **Expedia Explore 2026:** new AI experiences, an expanded travel ecosystem, and a
  philanthropy program. Separately, Expedia research points to traveler demand for
  full-trip planning rather than single-component booking.
- **2025 global OTA rankings:** Booking.com, Expedia and Airbnb hold the top three;
  Despegar moved up and Tiket.com entered the global top 10 for the first time.

### Airbnb

- **$250M housing initiative announced Sep 14**, structured to unlock ~$5B in financing
  over the next decade. Stock rose on the news.
- **Chesky at Goldman Sachs Communacopia (Sep 8):** the AI assistant now resolves ~45% of
  issues without a human agent; customer support cost per booking down ~16% YoY.
- **Q2 2026:** revenue $3.608B (+16.5%), net income $816M (+27.1%), FCF +31.6%,
  EPS $1.37 vs. $1.26 consensus. Rosenblatt initiated Buy / $220; JPMorgan raised
  its target $140 → $170. Shares closed $170.19 on Sep 11.

### Regulatory

- Booking.com remains a designated DMA **gatekeeper** (designated May 2024, compliant since
  late 2024). The Commission's first DMA review landed Apr 27, 2026. Non-compliance
  exposure: up to 10% of worldwide turnover, 20% for repeat infringements.

### Trends & tech

- **Skift State of Travel 2026:** discovery is shifting from *search–scroll–compare* to
  *ask–shortlist–decide*; 62% of global travelers are now familiar with AI trip-planning
  tools.
- **Barbell demand:** affluent travelers are carrying the industry (Delta premium revenue
  +7% in 2025 vs. main cabin −5%), while 62% of travelers say they'll adjust or cancel
  plans on cost.
- Travelxp launched an agentic AI trip concierge (Sep 11). Traxo–Everbridge partnership
  feeds live booking data into critical-event management.
- **Q2 2026 travel startup funding was soft**, skewed toward seed and Series B.
- Agoda signed a three-year AI-innovation MOU with the Singapore Tourism Board (Aug 16);
  WiT Singapore 2026 runs Sep 30–Oct 2.
- **Skift Global Forum** (Sep 22, New York) will feature the CEOs of Airbnb, Booking
  Holdings, Hilton, Expedia and Uber, plus OpenAI chairman Bret Taylor. Inaugural Creator
  Summit runs alongside it.

---

## Actions taken

- No deploy performed.
- No dashboard or data files modified.
- No messages, emails or Slack sent (per task instructions — pure background refresh).
- This log written to the project folder, following the existing `refresh-log-YYYY-MM-DD.md`
  convention.

## Sources

- [With Booking's Etraveli Deal Still Blocked, Expedia Has the Edge in M&A — Skift](https://skift.com/2026/09/10/with-bookings-etraveli-deal-still-blocked-expedia-has-the-edge-in-ma/)
- [Booking's 5 AI Experiments — and Why Agoda's Is Next — Skift](https://skift.com/2026/09/14/bookings-5-ai-experiments-and-why-agodas-is-next/)
- [Expedia Group Unveils New AI Experiences at Explore 2026](https://www.expedia.com/newsroom/expedia-group-unveils-new-ai-experiences-expands-travel-ecosystem-and-launches-philanthropy-program-at-explore-2026/)
- [Expedia Group global research on full-trip planning](https://ir.expediagroup.com/news-and-events/news/news-details/2026/EXPEDIA-GROUP-UNVEILS-NEW-GLOBAL-RESEARCH-SHOWING-TRAVELER-DEMAND-FOR-FULL-TRIP-PLANNING/default.aspx)
- [Airbnb stock gains on a $250 million housing push](https://www.ad-hoc-news.de/boerse/news/corporate-news/airbnb-stock-gains-on-a-250-million-housing-push/70101664)
- [Airbnb's CEO Says AI Is the Best Thing That Ever Happened to His Company — 24/7 Wall St.](https://247wallst.com/investing/2026/09/13/airbnbs-ceo-says-ai-is-the-best-thing-that-ever-happened-to-his-company-heres-why/)
- [Airbnb to Participate in Goldman Sachs Communacopia + Technology Conference 2026](https://www.morningstar.com/news/pr-newswire/20260825sf31055/airbnb-to-participate-in-the-goldman-sachs-communacopia-technology-conference-2026)
- [EU Designates Booking.com as 'Gatekeeper' Under Digital Markets Act — PYMNTS](https://www.pymnts.com/cpi-posts/eu-designates-booking-com-as-gatekeeper-under-digital-markets-act/)
- [EU says Booking must comply with Digital Markets Act — Reuters via Investing.com](https://www.investing.com/news/stock-market-news/eu-says-booking-must-now-comply-with-digital-markets-act-3722450)
- [State of Travel 2026 — Skift Research](https://research.skift.com/reports/state-of-travel-2026/)
- [Skift Global Forum 2026: Five Decisions in the Room](https://skift.com/2026/09/09/skift-global-forum-2026-five-decisions-in-the-room/)
- [PhocusWire travel tech news briefs — September 11](https://www.phocuswire.com/travel-tech-news-briefs/2026/september-11)
- [Travel startup funding deals and acquisitions in Q2 2026 — PhocusWire](https://www.phocuswire.com/news/startups/startup-funding-mergers-acquisition-q2-2026)
- [STB and Agoda Expand Tech Partnership to Power Singapore Tourism](https://www.nomadlawyer.org/singapore-digital-tourism-growth-ai-agoda-2026)
- [The 10 Best Online Travel Agencies in 2026 for Hotels — Cloudbeds](https://www.cloudbeds.com/online-travel-agencies/best/)
