# OTA Dashboard Refresh Log — 2026-09-18

**Run type:** scheduled background refresh (`refresh-ota-travel-dashboard`)
**Outcome:** ⚠️ **Live site NOT refreshed** (4th consecutive blocked run) — but the root cause is
now pinned down, and it is **not** what the previous three logs concluded. No writes were made
to the dashboard or its data files.

---

## 🔑 Root cause found: one broken step, stale since July 6

Previous logs assumed the nightly cron was failing or missing runs. It isn't. The cron runs, and
**two of its three steps succeed every time.** Only the last step fails:

```
scripts/refresh-and-deploy.sh   (cron, daily @ 17:00 PT)
  ├─ node scripts/fetch-news.cjs    ✅ works — 32 articles fetched Sep 17, 5:00 PM PDT
  ├─ node scripts/inject-news.cjs   ✅ works — inlined into public/index.html (225.5 KB)
  └─ kyber deploy                   ❌ FAILS → "airtool is required to run kyber.
                                       Connect to VPN and run kyber again so it can be
                                       downloaded and installed."
```

Evidence from `scripts/refresh.log`:

| Fact | Value |
|---|---|
| Last successful deploy | **Mon Jul 6, 2026, 14:37 PDT** |
| First `airtool` failure | Tue Jul 7, 2026, 17:00 PDT (the very next run) |
| Consecutive `airtool` failures since | **39** |
| `Deploy complete` lines in entire log | 3 (all Jun 15 / Jul 6) |
| Local `public/news-data.js` timestamp | Sep 17, 2026, 5:00 PM PDT — **fresh** |
| Live site content | **~10 weeks stale** |

So the local working copy has been dutifully updated every night for ten weeks and none of it has
ever shipped. The dashboard the team sees is frozen at July 6.

### ✅ The fix (one-time, ~2 minutes, needs Bimpe on VPN)

```bash
# 1. Connect to VPN, then:
cd "/Users/bimpe_abimbola/Claude Projects/ota-dashboard"
kyber                 # lets airtool download + install itself
kyber deploy          # ships the already-fresh local content

# 2. Confirm, then let tonight's 17:00 cron take over again.
```

Once `airtool` is installed, the existing cron should resume working unattended — no script
changes needed. The cron itself is healthy (it already exports the right PATH, per the Jun 15 fix
noted in `refresh-and-deploy.sh`).

⚠️ One caveat: cron runs at 17:00 PT whether or not the laptop is on VPN at that moment. If
deploys start failing again intermittently, that's the reason — worth considering a retry or a
VPN check in the script.

---

## Why this session couldn't route around it

Per the task file, no workarounds were attempted. For the record, all four routes are closed:

| Route | Result |
|---|---|
| Claude in Chrome (route the task specifies) | `Claude in Chrome is not connected` — extension unreachable / not signed in (retried 2×) |
| Built-in browser pane | `prototypes.sandcastle.musta.ch is blocked by your organization's policy` |
| In-page refresh control | **Does not exist** — re-confirmed below |
| Run the pipeline from this session | Linux sandbox has no network route to the RSS feeds (`curl` → `000`), and `kyber` is not installed there. Deploy needs VPN + SSO on Bimpe's Mac regardless. |

Note: neither browser failure is an SSO/login wall — no request got far enough to authenticate.

### The "refresh button" is a phantom

`grep` turns up `news-refresh-btn` in `public/index.html`, which looks like an in-page refresh
control. It is **CSS only** — two rules at lines 526–527 with no matching element anywhere in the
markup:

```css
.news-refresh-btn { padding: 5px 12px; ... cursor: pointer; }
.news-refresh-btn:hover { background: #F3F4F6; }
```

`template: "html"` in `.kyber/manifest.json` — this is a static prototype. There is no input
field, paste area, or update button. Feeding news in via the page (task step 3) is not possible
by design. Either the button was removed and its styles orphaned, or it was styled and never
built. Worth deleting the dead CSS, or building the button if an on-demand refresh is actually
wanted.

---

## News gathered — 24–48h to Fri Sep 18, 2026

Recorded here since it could not be delivered to the page. Sourced from Skift and PhocusWire.

### Headline story

**U.S. tourism slide deepens — 12% drop in August.** The U.S. travel industry had expected a
banner summer for visitor numbers and did not get one. The single most consequential demand-side
datapoint of the last 24 hours. ([Skift](https://skift.com/2026/09/17/u-s-tourism-slide-deepens-with-12-drop-in-august/))

### OTA / online travel

- **Trip.com's TripGenie gains booking via Mastercard.** Agentic-shopping partnership moves
  TripGenie from recommend to transact — the same "booking layer" race Booking and Agoda are in.
  ([PhocusWire](https://www.phocuswire.com/news/online/mastercard-agentic-shopping-trip-com))
- **Trip.com Group's antitrust reset** could change how hotels compete on its platform.
  ([Skift](https://skift.com/2026/09/16/trip-com-groups-antitrust-reset-could-change-how-hotels-compete-on-its-platform/))
- **European hotels hold their direct-booking lead over OTAs** — latest HOTREC distribution data.
  ([PhocusWire](https://www.phocuswire.com/news/distribution/hotel-direct-ota-distribution-europe-hotrec))
- **Cleartrip launches Elite loyalty**, pitched around reducing "travel anxiety" rather than big
  perks — the data on travelers may be the real prize.
  ([Skift](https://skift.com/2026/09/16/cleartrips-new-loyalty-program-is-about-reducing-travel-anxiety/))
- **Sam's Club Travel relaunches** with cruises and a deal with Rocket Travel's founders.
  ([Skift](https://skift.com/2026/09/16/sams-club-travel-relaunches-with-cruises-and-deal-with-rocket-travels-founders/))
- **OTA marketing spend rose again in Q2.**
  ([PhocusWire](https://www.phocuswire.com/news/finance/ota-marketing-spend-q2-2026))
- **Booking's Etraveli block upheld** by Europe's General Court (€1.63B), endorsing the theory that
  a dominant firm expanding into an adjacent business can harm competition — leaving Expedia with
  the freer hand in M&A.
  ([Skift](https://skift.com/2026/09/10/with-bookings-etraveli-deal-still-blocked-expedia-has-the-edge-in-ma/))

### Airbnb / short-term rental 🏠

- **Guesty acquires Smily** to expand in the French STR market.
  ([PhocusWire](https://www.phocuswire.com/news/online/guesty-acquires-smily-expand-french-str-market))
- **Hospitable launches Split Payouts** for Vrbo and direct bookings — automatic
  manager/owner revenue splits at check-in, closing a gap where Airbnb already had native
  support. ([PhocusWire](https://www.phocuswire.com/travel-tech-news-briefs/2026/september-18))
- **Airbnb–Tripadvisor Experiences partnership** (Aug): a selection of Tripadvisor tours and
  attractions become bookable on Airbnb later in 2026, replacing the build-your-own strategy.
  ([Skift](https://skift.com/2026/08/11/airbnb-partners-with-tripadvisor-experiences-drops-build-your-own-strategy/))
- **EU STR data rules** (Reg. 2024/1028) in force since May 20, 2026 — host registration numbers
  must appear on listings across Airbnb, Booking.com and others.

### AI & agentic booking — the dominant theme

- **Meta launches an AI agent with travel booking capabilities** (via Duffel) — currently
  PhocusWire's most-read story. A new distribution entrant, after TikTok GO's May launch with
  Booking/Expedia/Viator/GetYourGuide/Trip.com APIs.
  ([PhocusWire](https://www.phocuswire.com/news/technology/meta-launches-ai-agent-travel-booking))
- **Booking has 5 AI experiments running; Agoda's is next.**
  ([Skift](https://skift.com/2026/09/14/bookings-5-ai-experiments-and-why-agodas-is-next/))
- **What it takes to make AI booking work at scale.**
  ([Skift](https://skift.com/2026/09/17/reservations-ai-travel-booking-technology/))
- **Expedia CEO Ariane Gorin** on AI's growing role in planning and booking.
  ([PhocusWire](https://www.phocuswire.com/news/technology/expedia-ceo-ariane-gorin-ai-growing-role-travel-planning-booking))
- Adoption context: ~56% of U.S. leisure travelers now use AI for trip planning; "extensive" use
  reached 30%, up 17pp in a year. Discovery is shifting from *search-scroll-compare* to
  *ask-shortlist-decide*.

### Supply, distribution & hotel tech

- **Amadeus** adds Leisure Connect Plus (private hotel agreements across 150+ channel managers)
  and 15,000 independent properties to Value Hotels via HyperGuest.
- **Cloudbeds launches an RMS** with an autopilot mode for routine rate changes.
- **GetYourGuide** ships operator tools — AI listing checks, bulk traveler messaging, Adyen-backed
  local payments in Asian markets.
- **Fliggy × Eastar Jet** partner on China–South Korea "Flight+" bundles using Alibaba's Qwen.
- **Banyan Group buys Newmark**, adding 26 asset-light hotels in Africa.
  ([Skift](https://skift.com/2026/09/17/singapores-banyan-group-buys-newmark-to-add-26-hotels-in-africa/))
- **Travelport** names Naomi Hahn (ex-Skyscanner) chief marketing & commercial operations officer.

### Airlines

- **Ultra-low-cost carriers squeezed by jet fuel** with little room to raise fares; expect capacity
  cuts. ([Skift](https://skift.com/2026/09/17/ultra-low-cost-airlines-renew-push-for-tax-break-to-offset-soaring-jet-fuel-costs/))
- **Europe issued €430M in SAF permits** last year — 4× the 2024 figure.
  ([Skift](https://skift.com/2026/09/17/europe-handed-out-e430-million-in-saf-permits-last-year-see-which-airlines-got-the-most/))
- **Frontier adds cancel-for-any-reason** via Hopper Technology Solutions.

### Diary

**Skift Global Forum, New York, Sep 22–24** — next week. CEOs of Airbnb, Booking Holdings, Expedia,
Hilton and Uber, plus OpenAI chairman Bret Taylor. Chesky has said he is "not happy" with Airbnb's
growth rate and is pitching a rebuild around experiences, hotels and international expansion.
**If the dashboard is going to be fixed, before Monday is the moment.**

---

## Note on scope

Per the task file this is a background refresh with no delivery step, so nothing was sent. I also
did not hand-edit `public/news-data.js`: the cron regenerates it from RSS every night at 17:00 PT
and would overwrite anything written here, and without a working `kyber deploy` it would not reach
the live site either way. The fix is the `airtool` install above, not new content.
