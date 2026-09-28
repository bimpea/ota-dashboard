# OTA Dashboard Refresh — Run Log

**Run date:** 2026-09-05 06:05 PDT
**Task:** `refresh-ota-travel-dashboard`
**Outcome:** ⚠️ BLOCKED — news gathered; live site **not** refreshed. Sixteenth consecutive non-deploying run.

---

## Blockers

### Blocker 1 — no browser (blocks steps 2 and 3)

The Claude in Chrome extension is unreachable.

- `navigate` → "Claude in Chrome is not connected"
- `tabs_context_mcp{createIfEmpty:true}` → same
- `list_connected_browsers` → `[]`

`https://prototypes.sandcastle.musta.ch/ota-dashboard/` was **never reached**, so no
input field or refresh control could be located or used. To be explicit: this is
**not** an SSO failure and **not** a login wall. No workarounds were attempted — no
curl, no Python, no archive mirrors.

**Fix:** install / sign in to the Claude in Chrome extension on the Mac
(https://chromewebstore.google.com/detail/fcoeoabgfenejglbffodgkkbkcdhcgfn), open the
side panel, sign in with the same account as the desktop app, then re-run the task.

### Blocker 2 — `kyber deploy` fails on the Mac cron (VPN / airtool)

The local daily cron (`scripts/refresh-and-deploy.sh`, 5:00 PM PT) is doing its first
two stages correctly and failing on the third. From `scripts/refresh.log`:

```
Fri Sep  4 17:00:01 PDT 2026: Starting news refresh...
✅ 32 MECE articles across 4 categories  (Generated: Sep 4, 2026, 5:00 PM PDT)
✅ News data inlined into public/index.html (224.8 KB total)
airtool is required to run kyber. Connect to VPN and run kyber again so it can be
downloaded and installed.
```

Evidence of the gap:

| File | Last written |
|---|---|
| `public/index.html` (staged, fresh) | Sep 4 17:06 |
| `public/news-data.js` (staged, fresh) | Sep 4 17:00 |
| `dist/index.html` (last successfully built/deployed) | Sep 3 21:13 |

So **a fully refreshed build is already staged locally** — the live site is simply
serving Sep 3 content because the deploy step never runs.

**Fix:** connect to VPN on the Mac and run `kyber deploy` from
`~/Claude Projects/ota-dashboard` once, so airtool installs. After that the cron
should self-heal. Note the deploy step cannot be run from this session — the shell
here is an isolated Linux sandbox with no VPN and no kyber/airtool.

No files were modified this run. No summary, email, or Slack message was sent
(per task spec — background refresh only).

---

## Staged dashboard content (already in `public/`, awaiting deploy)

Generated Sep 4 2026 5:00 PM PDT — 32 articles, 8 per category.

**OTA:** Viral AI bot shows travel what frictionless means · Europe prepares new law
to support cities' Airbnb crackdowns · Qatar arrivals down 30% YTD · Internal memo:
eight execs out at Expedia Group in AI-driven shakeup · Vrbo Q2 2026 — hosts funding
the growth · Airbnb's best hotel strategy sitting in Ennismore's IPO filing

**Hotels:** Blackstone plans $7B IPO of Hotel Investment Partners · Biggest innovators
in travel & hospitality, Summer 2026 · New travel loyalty leaders are banks, not
hotels or airlines · BRICS summit pushes Delhi rates up 4x · Fake AI hotel videos
coming for travel

**Airlines:** Air Canada launches 14 nonstops from Vancouver to Asia-Pacific ·
Frontier's JFK exit · Delta adding Premium Select / Comfort+ on 767-400ERs ·
Southwest adds 11 new nonstops · Air India's $1.1B lifeline comes with conditions ·
UAE flight disruption amid regional tensions

**Tech:** AI transforming travel · Radisson + Accenture on ChatGPT discovery ·
Motel 6 ChatGPT plugin · Omio's conversational travel build

---

## Additional news gathered this run (last ~24h, web search)

### Regulatory — the headline item
- **European Commission housing strategy due 9 September.** Reporting on Sep 4
  indicates the package is being framed as EU-level support for city-level Airbnb
  crackdowns — giving national and local governments more explicit latitude to curb
  short-term rentals and second homes. This lands four days from now and is the most
  consequential near-term item for Airbnb.
- **EU Regulation 2024/1028** (STR transparency) has been in force since 2026-05-20:
  mandatory registration numbers displayed on listings, platform verification, and
  monthly transaction reporting to national single digital entry points.
- DMA gatekeeper obligations on Booking.com remain in effect; price-parity clauses
  unenforceable post-CJEU C-264/23.

### Booking Holdings / Expedia
- Both beat Q2 estimates on domestic strength; cross-border demand still uneven.
- Expedia raised FY2026 gross bookings guidance to ~$130.8B.
- Expedia's CarTrawler acquisition expected to close H2 2026 (B2B one-stop-shop
  positioning); Layla (AI trip planning) already acquired.
- Reported internal memo: eight Expedia Group execs departing in an AI-driven
  reorganisation.

### Airbnb
- Airbnb × Tripadvisor experiences partnership (announced Aug 11) — ~425,000
  Tripadvisor/Viator experiences to appear on Airbnb later in 2026.
- Pepijn Rijvers (ex-Tripadvisor, ex-Booking) started as chief business officer
  Sep 1, replacing Dave Stephenson.
- Delta SkyMiles partnership expanded: 3x miles on qualifying experiences/services,
  1x on stays.

### Agoda
- Partner Portal launched 2026-08-17, replacing the Yield Control System; AI review
  summarisation included.
- Expanded Macao Government Tourism Office partnership promoting boutique and
  independent hotels in the Outer Harbour District, targeting Brazil and Central Asia
  alongside core Asian and Middle East markets.

### Travel tech / distribution
- **HBX Group × Vorsee** (Sep 4): Vorsee's ActionOS platform embedded across HBX's
  hotel technology tools, aimed at spotting demand shifts before they surface in
  booking data.
- Google's agentic hotel booking is live in AI Mode chat in the US with Booking.com,
  Expedia, Priceline, Hotels.com, Trip.com, Hilton, Marriott, IHG, Choice and Wyndham
  as launch partners. Google maintains it has "no intention of becoming an OTA."
- Adoption gap remains the story: ~2% of US consumers say they'd use a fully
  autonomous booking agent vs ~80% of travel executives planning to deploy them at
  scale.

### Funding & M&A
- Q1 2026 travel funding deal volume hit a record low; Q2 stayed slow and skewed to
  seed / Series B. M&A is now the dominant growth mechanism.
- WeRoad's $58M raise (Airbnb-led) is the standout consumer deal, earmarked for US
  expansion.
- Other consolidation: Mindtrip/Thatch, Tern/Lucia, Juniper/Deem,
  Lighthouse/Hotelrank.ai.

### Demand data
- US travel spending reached $122.8B in July, +5.8% YoY, led by hotel demand and
  group travel. Air passenger volume fell 2.1% in July after −1.3% in June.

### Calendar
- FTE Global, Dallas–Fort Worth, Sep 8–10 · GlobeMeets, Istanbul, Sep 10–11 ·
  **Skift Global Forum, NYC, Sep 22–24** (CEOs of Airbnb, Booking Holdings, Expedia,
  Hilton, Uber; OpenAI chairman Bret Taylor expected).

---

## Sources

- [PhocusWire travel tech news briefs — September 4](https://www.phocuswire.com/travel-tech-news-briefs/september-4)
- [Biggest Innovators in Travel and Hospitality: Summer 2026 (Skift)](https://skift.com/2026/09/04/biggest-innovators-in-travel-and-hospitality-summer-2026/)
- [US Travel Insights Dashboard (2026-09-02)](https://www.ustravel.org/research/travel-recovery-insights-dashboard)
- [Domestic travel carries Expedia and Booking Holdings past Q2 estimates](https://www.marketscale.com/industries/hospitality/domestic-travel-carries-expedia-and-booking-holdings-past-q2-estimates-as-cross-border-headwinds-persist)
- [Airbnb partners with Tripadvisor amid plans to scale Experiences (PhocusWire)](https://www.phocuswire.com/news/distribution/airbnb-partners-tripadvisor-scale-experiences)
- [Airbnb partners with Tripadvisor to scale experiences (ShortTermRentalz)](https://shorttermrentalz.com/news/airbnb-tripadvisor-experiences/)
- [The travel startup funding deals and acquisitions that stood out in Q2 (PhocusWire)](https://www.phocuswire.com/news/startups/startup-funding-mergers-acquisition-q2-2026)
- [Travel funding deal volume hits new low in Q1 2026 (PhocusWire)](https://www.phocuswire.com/news/startups/travel-startup-funding-acquisitions-q1-2026)
- [Online Travel Agencies (OTAs) — News & Updates (10 Minutes News for Hoteliers)](https://en.10minhotel.com/top-news-hospitality-summary/online-travel-agencies/)
- [Short-Term Rentals: Weekly Briefing, Aug 31 – Sep 3, 2026](https://writing.strisker.com/short-term-rentals-weekly-briefing-august-31-september-3-2026-35/)
- [Short-term rental regulations 2026 (Avantio)](https://www.avantio.com/blog/short-term-rental-regulations/)
- [State of Travel 2026 (Skift)](https://skift.com/insights/state-of-travel/)
