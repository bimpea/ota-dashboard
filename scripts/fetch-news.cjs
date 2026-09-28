#!/usr/bin/env node
/**
 * fetch-news.cjs
 * Run before `kyber deploy` to bake fresh travel news into the dashboard.
 *
 *   node scripts/fetch-news.cjs && cp public/index.html dist/index.html && kyber deploy
 *   — or just: npm run refresh-news
 *
 * Articles are MECE: each article is assigned to exactly one category
 * (the best keyword match). No article appears in more than one section.
 */

const Parser = require('rss-parser');
const fs     = require('fs');
const path   = require('path');

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'Mozilla/5.0 OTA-Dashboard/1.0 (Airbnb internal)' },
});

const CATEGORIES = ['ota', 'hotels', 'airlines', 'tech'];

// Feeds per category — general feeds (Skift, TPG) appear in multiple lists;
// MECE assignment happens after fetching, not here.
// Google News queries are tuned for exec-level strategic signals, not operational news.
const FEEDS_BY_CAT = {
  ota: [
    { url: 'https://news.google.com/rss/search?q=airbnb+booking+expedia+trip.com+OTA+revenue+strategy+competition+market+2026&hl=en-US&gl=US&ceid=US:en', name: 'News' },
    { url: 'https://skift.com/feed/',               name: 'Skift' },
    { url: 'https://www.phocuswire.com/rss',        name: 'Phocuswire' },
    { url: 'https://www.travelweekly.com/RSS/',     name: 'Travel Weekly' },
  ],
  hotels: [
    { url: 'https://news.google.com/rss/search?q=hotel+industry+revpar+adr+demand+revenue+competition+AI+short-term+rental+after:2026-05-01&hl=en-US&gl=US&ceid=US:en', name: 'News' },
    { url: 'https://skift.com/feed/',               name: 'Skift' },
    { url: 'https://www.hospitalitynet.org/rss/',   name: 'Hospitality Net' },
    { url: 'https://www.travelweekly.com/RSS/',     name: 'Travel Weekly' },
  ],
  airlines: [
    { url: 'https://news.google.com/rss/search?q=airline+demand+capacity+pricing+revenue+international+consumer+strategy+after:2026-05-01&hl=en-US&gl=US&ceid=US:en', name: 'News' },
    { url: 'https://skift.com/feed/',               name: 'Skift' },
    { url: 'https://simpleflying.com/feed/',        name: 'Simple Flying' },
    { url: 'https://www.travelweekly.com/RSS/',     name: 'Travel Weekly' },
  ],
  tech: [
    { url: 'https://news.google.com/rss/search?q=tiktok+OR+openai+OR+chatgpt+OR+gemini+OR+perplexity+travel+booking+technology+2026&hl=en-US&gl=US&ceid=US:en', name: 'News' },
    { url: 'https://skift.com/feed/',               name: 'Skift' },
    { url: 'https://www.phocuswire.com/rss',        name: 'Phocuswire' },
    { url: 'https://techcrunch.com/feed/',          name: 'TechCrunch' },
    { url: 'https://www.travelweekly.com/RSS/',     name: 'Travel Weekly' },
  ],
};

// Keywords used for scoring — more specific = higher score
const CAT_KEYWORDS = {
  ota:      ['airbnb','booking.com','booking holdings','expedia','trip.com','skyscanner','vrbo','ota','online travel agent'],
  hotels:   ['hotel','marriott','hilton','hyatt','ihg','wyndham','accor','lodging','revpar','hospitality','resort','hotelier'],
  airlines: [
    'airline','aviation','flight','iata','airport','aircraft',
    // Major carriers whose brand names don't contain "airline/aviation"
    'delta','united airlines','american airlines','southwest',
    'ryanair','easyjet','wizz air','spirit airlines','frontier airlines',
    'emirates','lufthansa','air france','british airways','klm',
    'cathay pacific','qantas','air canada','air india','indigo',
    'riyadh air','flyadeal','jazeera airways','turkish airlines',
    'singapore airlines','thai airways','japan airlines','ana ',
    'international airlines group','iag ',
  ],
  // Tech keywords: big-tech company names + AI/ML terms in travel context.
  // These are intentionally distinct from OTA/hotel/airline terms so they don't
  // compete on score — articles about OpenAI, TikTok, Google AI, etc. win tech cleanly.
  tech:     [
    'openai','chatgpt','gemini','perplexity','tiktok',
    'google flights','google hotels','google travel',
    'apple maps','apple intelligence',
    'generative ai','artificial intelligence','travel tech','operator agent',
    'large language model','ai trip','ai booking','ai search',
    'machine learning','travel platform','travel innovation',
  ],
};

// Feed-source tiebreakers: when keyword scores tie, bias toward the natural home category
const FEED_HOME_CAT = {
  'Simple Flying':   'airlines',
  'Hospitality Net': 'hotels',
  'TechCrunch':      'tech',
  'Phocuswire':      'ota',
};

// Publications that require a positive travel/exec signal to be included.
// TechCrunch: must score ≥1 AND have a specific travel-industry term.
// Simple Flying: aviation enthusiast pub — must have at least one exec-signal keyword
//   (business metrics, strategy, market news) to filter out ops/engineering content.
const REQUIRE_MIN_SCORE = new Set(['TechCrunch', 'Simple Flying']);
// Specific travel-industry terms (used to gate TechCrunch articles).
// Deliberately excludes bare 'travel' and 'trip' — too many false positives
// (e.g. "travel vlogging cameras", "CEO's business trip").
const TRAVEL_CONTEXT_KWS = [
  'hotel','flight booking','airline','airbnb','expedia','booking.com','vrbo',
  'ota','tourism','hospitality','vacation rental','accommodation','resort',
  'cruise','travel booking','travel platform','travel company','travel app',
  'travel industry','travel technology','travel tech','travel agent',
  'flights','hotels','airport','check-in','lodging','itinerary',
];

// When keyword scores tie between tech and another category, these signals force
// the article into tech — they uniquely identify big-tech-in-travel stories.
const TECH_STRONG_SIGNALS = [
  'openai','chatgpt','gemini','perplexity','tiktok','google flights',
  'google hotels','apple maps','apple intelligence','generative ai',
  'large language model','operator agent',
];

// The Points Guy publishes mostly consumer credit card / points guides.
// Only let through exec-relevant items: major structural loyalty changes or OTA strategy news.
// Deliberately excludes 'transfer partner', 'redemption rate', 'earning rate' etc. which
// describe every monthly roundup and guide article, not structural industry news.
const TPG_LOYALTY_KWS = [
  'devalue','devaluation','program overhaul','program restructure','program launch',
  'new loyalty program','elite status overhaul','benefit cut','benefit reduction',
  'points program change','miles program change','program acquisition','program merger',
];
const TPG_OTA_KWS = [
  'airbnb','booking.com','expedia','vrbo','trip.com','hotels.com','kayak','trivago',
  'skyscanner','online travel','ota',
];

function isTPGAllowed(item) {
  const text = (item.title + ' ' + item.description).toLowerCase();
  return TPG_LOYALTY_KWS.some(kw => text.includes(kw)) || TPG_OTA_KWS.some(kw => text.includes(kw));
}

// Simple Flying publishes a mix of business news and aviation enthusiast content.
// Require at least one exec signal to pass — this blocks crew/ops/engineering articles.
const SIMPLE_FLYING_EXEC_KWS = [
  'revenue','profit','loss','demand','capacity','growth','decline','expansion',
  'route launch','launches route','enters','acquires','acquisition','merger','partnership',
  'deal','bankruptcy','collapse','strike','labor','fuel cost','pricing','fare',
  'passenger numbers','load factor','yield','strategy','competition','market share',
  'fleet order','orders aircraft','crisis','cuts','layoffs','restructure',
  'earnings','investor','outlook','guidance',
];

function isSimpleFlyingExecRelevant(item) {
  const text = (item.title + ' ' + item.description).toLowerCase();
  return SIMPLE_FLYING_EXEC_KWS.some(kw => text.includes(kw));
}

// Global blocklist — applied to ALL sources before assignment.
// Matches tactical/operational/consumer content that no exec will care about.
const EXEC_BLOCKLIST = [
  // Aviation ops/enthusiast (Simple Flying specialty)
  'cabin crew','forward galley','air tanker retardant','how the yoke',
  'senior cabin crew','control tower','retardant drop','shove the yoke',
  'scorched cabin','mid-air phone fire','air tanker pilot',
  'how airbus','how boeing','how the a3','how the b7','engineering failure',
  // Consumer rewards guides (not industry news)
  'transfer partner list','transfer bonus offer','how to redeem','best ways to use',
  'ultimate rewards partner','best credit card for','award chart guide',
  'points guide','miles guide','how to earn','which credit card',
  // Airline credit card promotions (not strategic)
  'mastercard monday','mastercard tuesday','card monday','card tuesday',
  'credit card promo','miles promo','airline credit card',
  // Hotel property openings (not industry trends)
  'softly opens','soft opens','grand opening','nears debut','opens its doors',
  'welcoming guests','ribbon cutting',
  // Listicles and travel tips not about industry
  'best airports','best airlines ranked','worst airlines','tips for flying',
  'travel hacks','packing tips','seat selection guide',
  // Non-travel AI/tech (catches false positives via travel-adjacent words like "trip")
  'mobileye','robotaxi','autonomous vehicle','self-driving car',
  'stargate project','data center project','infrastructure fund',
  // Stock analysis / financial wire articles (not travel industry strategy)
  ') stock (','(adr) stock','nasdaq:','spotting winners','stocks in q',
  'sector focus as','debt profile','earnings trends and traffic','adx listed',
  'us-listed adr in focus','- ad hoc news',
  // Geopolitics with no travel-industry angle
  'hormuz','strait of hormuz','oil shipping',
];

function scoreItem(item, keywords) {
  const text = (item.title + ' ' + item.description).toLowerCase();
  return keywords.reduce((n, kw) => n + (text.includes(kw) ? 1 : 0), 0);
}

function bestCat(item) {
  // Score against every category
  const scores = {};
  for (const cat of CATEGORIES) {
    scores[cat] = scoreItem(item, CAT_KEYWORDS[cat]);
  }
  const maxScore = Math.max(...Object.values(scores));

  // If all scores are 0: non-travel publications are dropped (null = discard);
  // travel-native sources fall back to the category their feed was fetched under,
  // then to the feed's static home, then to 'ota' as a last resort.
  if (maxScore === 0) {
    if (REQUIRE_MIN_SCORE.has(item._feedName)) return null;
    return item._feedCat || FEED_HOME_CAT[item._feedName] || 'ota';
  }

  // Among tied winners:
  // 1. If tech is in the tie and the article has a big-tech strong signal, prefer tech.
  // 2. Otherwise prefer feed source home category, then CATEGORIES order.
  const tied = CATEGORIES.filter(c => scores[c] === maxScore);
  if (tied.length === 1) return tied[0];
  if (tied.includes('tech')) {
    const text = (item.title + ' ' + item.description).toLowerCase();
    if (TECH_STRONG_SIGNALS.some(s => text.includes(s))) return 'tech';
  }
  const homeCat = FEED_HOME_CAT[item._feedName];
  return (homeCat && tied.includes(homeCat)) ? homeCat : tied[0];
}

async function fetchFeed(url, name) {
  try {
    const feed = await parser.parseURL(url);
    return (feed.items || []).map(item => ({
      title:       item.title || '',
      link:        item.link  || '',
      pubDate:     item.pubDate || item.isoDate || '',
      description: item.contentSnippet || item.summary || '',
      _feedName:   name,
    }));
  } catch (e) {
    process.stdout.write(`⚠  ${name}: ${e.message}  `);
    return [];
  }
}

async function main() {
  console.log('📰 Fetching travel news (MECE assignment)...\n');

  // ── Step 1: fetch all feeds for all categories ───────────────────
  const rawByFeedUrl = new Map(); // cache fetched feeds to avoid re-fetching shared feeds
  const allItems     = [];        // every article, tagged with which category fetched it

  for (const cat of CATEGORIES) {
    process.stdout.write(`  Fetching ${cat}... `);
    const feeds = FEEDS_BY_CAT[cat];
    const results = await Promise.allSettled(
      feeds.map(async f => {
        if (rawByFeedUrl.has(f.url)) return rawByFeedUrl.get(f.url);
        const items = await fetchFeed(f.url, f.name);
        rawByFeedUrl.set(f.url, items);
        return items;
      })
    );
    // Tag each item with the category it was fetched for so zero-score articles
    // fall back to the right section (e.g. Skift airline stories → airlines, not ota)
    const catItems = results.flatMap(r =>
      r.status === 'fulfilled' ? r.value.map(item => ({ ...item, _feedCat: cat })) : []
    );
    allItems.push(...catItems);
    console.log(`${catItems.length} raw articles`);
  }

  // ── Step 2: global dedup by normalised title ─────────────────────
  // Keep the best occurrence of each article: the one whose _feedCat has the
  // highest keyword score. This ensures a Skift article about "Riyadh Air"
  // keeps its airlines tag rather than the first-seen ota tag.
  const bestByKey = new Map(); // key → best item so far
  for (const item of allItems) {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
    if (!key) continue;
    if (!bestByKey.has(key)) {
      bestByKey.set(key, item);
    } else {
      const prev    = bestByKey.get(key);
      const prevScore = prev._feedCat    ? scoreItem(prev, CAT_KEYWORDS[prev._feedCat] || []) : 0;
      const thisScore = item._feedCat    ? scoreItem(item, CAT_KEYWORDS[item._feedCat] || []) : 0;
      if (thisScore > prevScore) bestByKey.set(key, item);
    }
  }

  const seen   = new Set();
  const unique = [];
  for (const item of bestByKey.values()) {
    const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 40);
    if (!key || seen.has(key)) continue;

    const text = (item.title + ' ' + item.description).toLowerCase();

    // Global exec blocklist — drops operational/consumer/listicle content from any source
    if (EXEC_BLOCKLIST.some(kw => text.includes(kw))) continue;

    // The Points Guy: only major loyalty program structural changes or OTA strategy news
    if (item._feedName === 'The Points Guy' && !isTPGAllowed(item)) continue;

    // TechCrunch: must have a category keyword AND a specific travel-industry term
    if (item._feedName === 'TechCrunch') {
      const hasCatKw     = Object.values(CAT_KEYWORDS).flat().some(kw => text.includes(kw));
      const hasTravelCtx = TRAVEL_CONTEXT_KWS.some(kw => text.includes(kw));
      if (!hasCatKw || !hasTravelCtx) continue;
    }

    // Simple Flying: must contain at least one exec-signal keyword (business metrics/strategy)
    if (item._feedName === 'Simple Flying' && !isSimpleFlyingExecRelevant(item)) continue;

    seen.add(key);
    unique.push(item);
  }

  // ── Step 3: assign each article to its single best category ──────
  const buckets = { ota: [], hotels: [], airlines: [], tech: [] };
  let dropped = 0;
  for (const item of unique) {
    const cat = bestCat(item);
    if (cat === null) { dropped++; continue; } // discard non-travel irrelevant articles
    buckets[cat].push(item);
  }
  if (dropped > 0) console.log(`  (dropped ${dropped} off-topic articles from non-travel sources)`);

  // ── Step 4: sort newest-first, cap at 8 per category ─────────────
  const result = {};
  for (const cat of CATEGORIES) {
    buckets[cat].sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));
    result[cat] = buckets[cat].slice(0, 8);
  }

  // ── Step 5: write output ──────────────────────────────────────────
  const generated = new Date().toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  });

  const total  = Object.values(result).reduce((s, arr) => s + arr.length, 0);

  // ── Empty-result guard ────────────────────────────────────────────
  // If every feed failed (e.g. DNS/network outage, as on 2026-08-13/14),
  // do NOT overwrite the last known-good news-data.js with an empty set.
  // Exit non-zero so refresh-and-deploy.sh (set -e) stops before inlining
  // and deploying an empty dashboard.
  if (total === 0) {
    console.error('\n❌ 0 articles fetched across all categories — every feed failed.');
    console.error('   Keeping the previous public/news-data.js untouched and aborting.');
    console.error('   Check host DNS / network reachability for the RSS sources.');
    process.exit(1);
  }

  const output = `// Auto-generated by scripts/fetch-news.cjs — ${generated}\n`
               + `// Re-run: node scripts/fetch-news.cjs  |  or: npm run refresh-news\n`
               + `window.OTA_NEWS_DATA = ${JSON.stringify(result, null, 2)};\n`
               + `window.OTA_NEWS_GENERATED = "${generated}";\n`;

  const outPath = path.join(__dirname, '../public/news-data.js');
  fs.writeFileSync(outPath, output, 'utf8');

  console.log(`\n✅ ${total} MECE articles across ${CATEGORIES.length} categories`);
  for (const cat of CATEGORIES) console.log(`   ${cat}: ${result[cat].length}`);
  console.log(`   Generated: ${generated}`);
  console.log('\nNext: npm run refresh-news  (or cp public/index.html dist/index.html && kyber deploy)');
}

main().catch(e => { console.error(e); process.exit(1); });
