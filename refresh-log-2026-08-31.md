# OTA Dashboard Refresh Log

## Run: 2026-08-31 06:05 PDT (scheduled task `refresh-ota-travel-dashboard`)

**Status: BLOCKED — live site not refreshed. Twelfth consecutive non-deploying run.**

Step 1 (news gathering) succeeded. Steps 2 and 3 (browser) were impossible again —
no browser. Step 4 (delivery) intentionally skipped per the task definition.

Both blockers are unchanged from 2026-08-28 and both need action on the Mac.

---

### Blocker 1 — no browser (blocks steps 2 and 3)

The Claude in Chrome extension is unreachable.

- `navigate` returned "Claude in Chrome is not connected".
- `tabs_context_mcp{createIfEmpty:true}` returned the same on two attempts, 20 s apart.
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
- `scripts/refresh.log` shows the Aug 28 deploy attempt still ending with:

      airtool is required to run kyber. Connect to VPN and run kyber again so it
      can be downloaded and installed.

`dist/` is still dated **2026-08-05 17:18** and `dist/news-data.js` still carries the
Aug 5 generation stamp. The live dashboard is serving content **26 days stale**.

`dist/` was again deliberately left untouched. Overwriting it by hand publishes
nothing — `kyber deploy` is what publishes — and it would destroy the only local
record of what the live site actually serves.

**Fix:** on the Mac, connect to VPN and run `kyber deploy` once (or just `kyber` once
so `airtool` self-installs). One successful manual deploy on VPN should unblock the
cron, which already does everything else correctly.

### Local pipeline — healthy, no new gap

- `public/news-data.js` is stamped **Aug 28, 2026, 5:00 PM PDT**; `public/index.html`
  was rewritten at Aug 28 17:06 (225.1 KB, 32 MECE articles across ota / hotels /
  airlines / tech, 8 each).
- Aug 29–30 were Saturday and Sunday, and this run is at 06:05 Monday, ahead of the
  17:00 cron slot. So the Aug 28 stamp is the **expected** latest state, not a repeat
  of the Aug 24–26 gap. Fetch → inject is working.
- Minor, pre-existing: the fetcher logs 403s from Phocuswire, Travel Weekly and
  Hospitality Net. It still clears its per-category quota from other sources, so this
  is cosmetic for now, but those three feeds contribute nothing.
- The sandbox still has **no outbound DNS** (`dns.lookup('skift.com')` →
  `EAI_AGAIN`), so `scripts/fetch-news.cjs` cannot be run from here as a fallback.
  That only matters if the Mac cron stops again.

---

## Step 1 output — travel / OTA news gathered (for the record)

Collected via web search on 2026-08-31. Not injected anywhere; recorded here so the
run is not a total loss and so the content is available if someone refreshes by hand.

### Major players

- **Airbnb × Tripadvisor** (announced Aug 11, still the defining story of the cycle).
  Tripadvisor Group's 425,000+ tours, activities and attractions become bookable
  directly on Airbnb, integration expected later this year. Reported as the largest
  single inventory expansion in travel-experiences commerce; Airbnb drops its
  build-your-own experiences strategy in favour of distribution. Still no launch date,
  city list, listing count, or booking/cancellation terms.
- **Expedia Group.** Explore 2026 brought new AI experiences, ecosystem expansion and
  a philanthropy program. CLEAR and Uber partnerships push Expedia past booking into a
  one-stop shop. 2026 gross-bookings guidance raised to **$130.8B**. Signed a 12-month
  exclusive making Expedia the first authorized OTA to distribute **Allegiant** flights.
  CarTrawler acquisition still expected to close in H2 2026.
- **Booking Holdings.** Beat Q2 estimates alongside Expedia on strong domestic travel;
  cross-border demand remains a headwind for both. B2B consolidation under Agoda CEO
  Omri Morgenshtern continues.
- **Agoda.** Partner Portal launched Aug 17, replacing the Yield Control System; uses
  AI to process guest reviews.
- **TikTok** formalized in-app travel bookings, with Booking.com, Expedia and Trip.com
  among the launch partners — a new distribution surface worth watching.
- **MakeMyTrip × Fly91** launched curated Lakshadweep packages on direct
  Bengaluru–Agatti flights from Nov 12, 2026.

### Trends

- **AI distribution keeps moving from pilot to line item.** ChatGPT ads are live for
  hotels at roughly $3.00–3.50 CPC; both Expedia and Agoda are framing AI as
  infrastructure rather than feature.
- **Tours & activities outpacing travel overall**, with distribution lagging demand —
  the structural backdrop to the Airbnb/Tripadvisor deal.
- **Trip-shape shifts.** Global Rescue's 2026 survey: 67% of travelers kept their
  international plans, ~1/3 changed destination, postponed or cancelled. US summer is
  stretching past Labor Day — post-Labor-Day trips up from 12% (2022) to 20% (2026).
  Skyscanner flags the weeks of Aug 17 and Aug 31 as the cheapest to book.
- **France** entered summer strong on hotels, coastal destinations, domestic demand and
  recovering US arrivals. **Goa** logged 61.38 lakh visitors Jan–Jul 2026.

### Funding / M&A

- Travel startup funding stayed soft — deal *volume* hit a new low in Q1 2026 and Q2
  was not active either, skewed to seed and Series B with one notable Series C.
  Fewer, larger, more AI-weighted deals.
- **WeRoad** raised a **$58M Series C** led by **Airbnb**.
- **Super.com** raised **$65M Series D** (membership + AI).
- **Amadeus** acquired **SkyLink** (Q1).
- Commentators expect 2026 to favour "preemptive approaches" of the Expedia–CarTrawler
  kind over large-scale M&A.

### Regulatory

- **EU AI transparency rule** in force since **Aug 2, 2026**: major AI providers must
  embed invisible watermarks in AI-generated or AI-processed text. Practical effect —
  hotel and OTA marketing copy that passed through any AI tool is watermarked under EU
  law regardless of hosting or readership.
- **EU precedent still binding on consolidation:** regulators blocked Booking Holdings'
  eTraveli takeover on OTA-market-harm grounds, and the tight regulatory environment is
  cited as a live constraint on travel acquisitions generally.
- **Indonesia** short-term-rental crackdown continues with nine OTA partners including
  Airbnb, Booking.com and Traveloka — merchant verification, licensing compliance,
  business registration.
- **UK** travel regulation reform expected to accelerate through 2026; global STR
  regulation and taxation keeps tightening, a drag on vacation-rental supply growth.

**Sources:** Skift, PhocusWire, Hospitality Net, Expedia Newsroom, Tripadvisor IR,
TravelPulse, Travel Weekly, TravelMole, MarketScale, TravelAge West, eTurboNews,
Travel And Tour World, BOTT India, 10 Minutes News for Hoteliers.

---

## Bottom line

Unchanged from the last eleven runs. Two independent blockers, both requiring action
on the Mac and both outside this task's reach:

1. Connect the Claude in Chrome extension → unblocks steps 2 and 3.
2. Run `kyber deploy` once on VPN → unblocks publishing, and the already-healthy cron
   pipeline takes it from there.

The local build is current as of the last weekday cron run (Aug 28) and is staged and
waiting. Only the publish step is missing. Until at least one blocker is resolved,
this scheduled task can gather news but cannot refresh the live dashboard.
