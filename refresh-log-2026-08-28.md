# OTA Dashboard Refresh Log

## Run: 2026-08-28 (scheduled task `refresh-ota-travel-dashboard`)

**Status: BLOCKED — live site not refreshed. Eleventh consecutive non-deploying run.**
**One improvement vs. yesterday: the Mac-side news pipeline fired again, so the local
build is current (Aug 27, 5:00 PM PDT). Only the publish step and the browser step
remain broken.**

Step 1 (news gathering) succeeded. Steps 2 and 3 (browser) were impossible again —
no browser. Step 4 (delivery) intentionally skipped per the task definition.

---

### Blocker 1 — no browser (blocks steps 2 and 3)

The Claude in Chrome extension is unreachable.

- `tabs_context_mcp{createIfEmpty:true}` returned "Claude in Chrome is not connected"
  on two attempts.
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
- On the Mac, `scripts/refresh.log` shows the deploy attempt still failing with:

      airtool is required to run kyber. Connect to VPN and run kyber again so it
      can be downloaded and installed.

`dist/` is still dated **2026-08-05 17:18** and `dist/news-data.js` still carries the
Aug 5 generation stamp. The live dashboard is serving content **23 days stale**.

`dist/` was again deliberately left untouched. Overwriting it by hand publishes
nothing — `kyber deploy` is what publishes — and it would destroy the only local
record of what the live site actually serves.

**Fix:** on the Mac, connect to VPN and run `kyber deploy` once (or just `kyber` once
so `airtool` self-installs). One successful manual deploy on VPN should unblock the
cron, which already does everything else correctly.

### Improvement since yesterday — local pipeline is healthy again

`public/news-data.js` is now stamped **Aug 27, 2026, 5:00 PM PDT**, and
`scripts/refresh.log` confirms "News data inlined into public/index.html (224.8 KB
total)". So the Aug 24–26 cron gap has closed: fetch → inject works, and fresh
content is staged locally and waiting for a deploy.

The sandbox still has **no outbound DNS** (`getaddrinfo EAI_AGAIN skift.com`), so
`scripts/fetch-news.cjs` cannot be run from here as a fallback. That only matters if
the Mac cron stops again.

---

## Step 1 output — travel / OTA news gathered (for the record)

Collected via web search on 2026-08-28. Not injected anywhere; recorded here so the
run is not a total loss and so the content is available if someone refreshes by hand.

### Major players

- **Airbnb × Tripadvisor.** Tripadvisor Group and Airbnb announced a partnership that
  will make Tripadvisor's 425,000+ tours, activities and attractions bookable directly
  on Airbnb, with integration expected later this year. No launch date, city list,
  listing count, or booking/cancellation terms published yet. Most significant OTA
  story of the cycle for Airbnb specifically.
- **Expedia Group.** At Explore 2026: new AI experiences, ecosystem expansion, and a
  philanthropy program. Partnerships with CLEAR and Uber position Expedia as a
  one-stop shop beyond booking; AllTrails partnership adds lodging discounts for
  premium members. Acquired **Layla**, an AI-native trip-planning platform. Raised
  2026 gross bookings guidance to **$130.8B**. **CarTrawler** acquisition expected to
  close in H2 2026, aimed at a B2B one-stop shop.
- **Booking Holdings.** Consolidating B2B operations (Booking.com, Agoda, Priceline
  partner businesses) into a single global unit under Agoda CEO Omri Morgenshtern,
  replacing the "Rocket Travel by Agoda" structure. Also unifying advertising across
  Booking.com, Priceline and Agoda. Scaling wholesale room supply, explicitly
  including supply to AI agents booking on a traveler's behalf.
- **Agoda.** Launched the **Partner Portal** on Aug 17, 2026, replacing the Yield
  Control System; uses AI to process guest reviews. CEO says AI agents are being
  deployed across the business bottom-up — security, compliance, and consumer
  experience.
- **Q2 results.** Both Expedia and Booking Holdings beat Q2 estimates on strong
  domestic travel; cross-border demand remains a headwind.

### Trends

- **AI referral traffic is now material.** Eurostar reports a 400% rise in AI-driven
  traffic since Jan 2025, with ChatGPT at 85% of that in June 2026, and has shipped a
  natural-language search app. ChatGPT ads are live for hotels at roughly $3.00–3.50
  CPC. Reviews rather than star ratings appear to drive AI recommendations.
- **Tours & activities outpacing travel overall**, with distribution lagging demand
  (Phocuswright) — the structural backdrop to the Airbnb/Tripadvisor deal.
- **Demand flat.** Skift Travel Health Index held at 100 in June 2026 (flat YoY); the
  World Cup did not produce a broad lift in global travel metrics.
- **Cheapest day to fly shifted to Friday** (Expedia Air Hacks 2026), attributed to
  reduced end-of-week business travel.

### Funding / M&A

- **Mews Financial Services B.V.** received an **EMI licence** from De Nederlandsche
  Bank — the first held by a hospitality operating system in the EEA. Will accelerate
  Mews Payments and fintech/AI investment. Follows its acquisition of **DataChat**, a
  generative-AI analytics platform.
- **Super.com** raised **$65M Series D** (membership program + AI).
- **Pricepoint** closed a **$6.6M seed** (AI-native hotel pricing/revenue).
- Overall travel funding deal *volume* hit a new low in Q1 2026 and remains soft —
  fewer, larger, more AI-weighted deals.

### Regulatory

- **EU AI transparency rule** took effect **Aug 2, 2026**: major AI providers must
  embed invisible watermarks in AI-generated or AI-processed text. Practical effect
  for the industry — hotel and OTA marketing copy that passed through any AI tool is
  now watermarked under EU law, globally, regardless of hosting or readership.
- **Indonesia** short-term-rental crackdown: the Tourism Ministry is working with nine
  OTA partners including Airbnb, Booking.com and Traveloka, demanding merchant
  verification, licensing compliance and business registration standards.
- **UK** travel regulation reform expected to accelerate through 2026.
- **Global STR regulation and taxation** continues to tighten, a deceleration factor
  for vacation-rental supply growth into 2026.

**Sources:** Skift, PhocusWire, Hospitality Net, Expedia Newsroom, TTG Asia,
The Paypers, Travel And Tour World, 10 Minutes News for Hoteliers.

---

## Bottom line

Two independent blockers, both requiring action on the Mac and both outside this
task's reach:

1. Connect the Claude in Chrome extension → unblocks steps 2 and 3.
2. Run `kyber deploy` once on VPN → unblocks publishing, and the already-healthy
   cron pipeline takes it from there.

Until at least one is resolved, this scheduled task can gather news but cannot
refresh the live dashboard.
