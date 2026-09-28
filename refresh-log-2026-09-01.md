# OTA Dashboard Refresh Log

## Run: 2026-09-01 06:05 PDT (scheduled task `refresh-ota-travel-dashboard`)

**Status: BLOCKED — live site not refreshed. Thirteenth consecutive non-deploying run.**

Step 1 (news gathering) succeeded. Steps 2 and 3 (browser) were impossible again —
no browser. Step 4 (delivery) intentionally skipped per the task definition.

Both blockers are unchanged from 2026-08-31 and both need action on the Mac.

---

### Blocker 1 — no browser (blocks steps 2 and 3)

The Claude in Chrome extension is unreachable.

- `navigate` returned "Claude in Chrome is not connected".
- `tabs_context_mcp{createIfEmpty:true}` returned the same on two attempts.
- `list_connected_browsers` returned `[]`.

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
- `scripts/refresh.log` shows the Aug 31 17:00 deploy attempt still ending with:

      airtool is required to run kyber. Connect to VPN and run kyber again so it
      can be downloaded and installed.

`dist/` is still dated **2026-08-05 17:18** and `dist/news-data.js` still carries the
Aug 5 generation stamp. The live dashboard is serving content **27 days stale**.

`dist/` was again deliberately left untouched. Overwriting it by hand publishes
nothing — `kyber deploy` is what publishes — and it would destroy the only local
record of what the live site actually serves.

**Fix:** on the Mac, connect to VPN and run `kyber deploy` once (or just `kyber` once
so `airtool` self-installs). One successful manual deploy on VPN should unblock the
cron, which already does everything else correctly.

### Local pipeline — healthy

- `public/news-data.js` is stamped **Aug 31, 2026, 5:00 PM PDT**; `public/index.html`
  was rewritten at Aug 31 17:06 (225.3 KB, 32 MECE articles across ota / hotels /
  airlines / tech, 8 each). The Monday-evening cron slot fired on schedule. Fetch →
  inject is working; only the deploy step fails.
- Minor, pre-existing: the fetcher logs 403/404s from Travel Weekly, Phocuswire and
  Hospitality Net. It still clears its per-category quota from other sources, so this
  stays cosmetic, but those three feeds contribute nothing.
- **New this run (relevance, not a failure):** the `ota` category's top slot is
  "Polymarket reportedly raises $300 million from Donald Trump Jr.'s investment fund"
  (TechCrunch) — not travel. The `tech` category likewise carries two general-AI
  items from blog.google and one Statista topic page. The categorizer in
  `scripts/fetch-news.cjs` is admitting off-topic tech-press items into travel
  buckets. Worth a keyword-filter tightening pass when someone next touches the
  script; it does not block anything.
- The sandbox still has **no outbound DNS** (`dns.lookup('skift.com')` →
  `EAI_AGAIN`), so `scripts/fetch-news.cjs` cannot be run from here as a fallback.
  That only matters if the Mac cron stops again.

---

## Step 1 output — travel / OTA news gathered (for the record)

Collected via web search on 2026-09-01. Not injected anywhere; recorded here so the
run is not a total loss and so the content is available if someone refreshes by hand.
Note: search coverage this cycle skewed toward the last two to three weeks rather
than a clean 24-hour window — dated items are labelled below.

### Major players

- **Airbnb × Tripadvisor** (announced Aug 11; still the defining story of the cycle).
  Tripadvisor Group tours, activities and attractions become bookable directly on
  Airbnb, integration expected later this year. Airbnb drops its build-your-own
  experiences strategy; its 2025 relaunch had scaled to roughly 3,000 landmark
  experiences across about 100 cities before narrowing focus to Paris.
- **Airbnb × Delta.** Partnership expanded — SkyMiles members now earn 3 miles per $1
  on qualifying Airbnb experiences and services, 1 mile per $1 on stays.
- **Booking Holdings.** Merging the hotel room-sales arms of Booking.com, Agoda and
  Priceline into a single operation running on Agoda's engine. Agoda launched its
  Partner Portal on Aug 17, replacing the Yield Control System, using AI over guest
  reviews. Separately, a widely-circulated third-party estimate puts Booking ahead of
  Expedia in B2B room nights.
- **Expedia Group.** Acquired Layla (AI-native trip planning, founded 2023).
  CarTrawler acquisition expected to close H2 2026, framed as a "one-stop shop for
  B2B travel." New CLEAR and Uber partnerships announced at Explore 2026.
- **Agoda.** Expanded its partnership with the Macao Government Tourism Office to
  promote boutique and independent hotels in the Outer Harbour District.

### Trends

- **Social commerce.** TikTok GO brings in-app travel booking to ~200M U.S. users,
  with API integrations to Booking.com, Expedia, Viator, GetYourGuide and Trip.com,
  booking real rooms at real properties. Compresses video discovery → reservation.
- **AI in planning.** 56% of U.S. leisure travelers now report using AI for travel
  planning. Google AI Mode added flight price tracking, miles rates and hotel
  booking; Google has confirmed agentic hotel booking is in testing.
- **Market size.** Global online travel market projected at $1.13 trillion by 2030.
- **Air demand.** IATA reported global air passenger demand up just 0.2% in July 2026.

### Funding / M&A

- Travel startup funding reached ~$1.7B in the first five months of 2026, versus
  ~$1.1B in the same period of 2025 — but Q2 deal volume was thin and skewed to seed
  and Series B.
- Notable rounds: Smartness (hotel tech) €47M; The Hosteller $16M; WeRoad $58M
  Series C led by Airbnb.
- Amadeus acquired SkyLink (Q1). Fosun has filed for a Club Med IPO in Hong Kong.
- Analysts do not expect 2026 to be a large M&A year overall, but anticipate more
  preemptive approaches in the style of Expedia–CarTrawler. AI is absorbing most
  available capital.

### Regulatory

- **EU Regulation (EU) 2024/1028 on short-term rentals took effect 20 May 2026.**
  Platforms including Airbnb and Booking.com must collect and verify host
  registration numbers before listing, display them prominently, and transmit
  standardized monthly activity data — nights booked, guest counts, property
  addresses — to national Single Digital Entry Points. Intent is supervision and
  data transparency rather than outright restriction.

---

## Verification

- Blocker 1 confirmed by three independent tool calls (`navigate`,
  `tabs_context_mcp`, `list_connected_browsers`).
- Blocker 2 confirmed by `which kyber airtool` (empty), the `dist/` mtimes and
  generation stamp, and the tail of `scripts/refresh.log`.
- Local pipeline health confirmed by reading `public/news-data.js` directly and
  enumerating all 32 articles per category.
- No write actions were taken against the live site, `dist/`, or any connector. No
  summary, email or Slack message was sent, per the task definition.
