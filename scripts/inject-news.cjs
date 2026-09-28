#!/usr/bin/env node
/**
 * inject-news.cjs
 * Inlines public/news-data.js directly into public/index.html before deploy.
 * Kyber HTML templates deploy from public/, so this is what ends up on the CDN.
 *
 * Idempotent: uses OTA_NEWS_INLINE_START/END markers so re-runs replace the
 * previous inline block rather than accumulating them.
 *
 * Run automatically by refresh-and-deploy.sh — do not run standalone.
 */

const fs   = require('fs');
const path = require('path');

const root      = path.join(__dirname, '..');
const newsPath  = path.join(root, 'public', 'news-data.js');
const indexPath = path.join(root, 'public', 'index.html');

if (!fs.existsSync(newsPath)) {
  console.log('⚠  news-data.js not found — skipping inline injection');
  process.exit(0);
}

const newsJs = fs.readFileSync(newsPath, 'utf8');
let   html   = fs.readFileSync(indexPath, 'utf8');

// Pattern A: previously-injected block (re-injection on subsequent runs)
const INJECTED_RE = /<!-- OTA_NEWS_INLINE_START -->[\s\S]*?<!-- OTA_NEWS_INLINE_END -->/;

// Pattern B: original dynamic loader (first injection)
const LOADER_RE   = /<script>\s*\(function\s*\(\)\s*\{[\s\S]*?news-data\.js[\s\S]*?\}\)\(\);?\s*<\/script>/;

const re = INJECTED_RE.test(html) ? INJECTED_RE : LOADER_RE;

if (!re.test(html)) {
  console.log('⚠  No loader or inject marker found in index.html — skipping');
  process.exit(0);
}

// Replace loader with inline data wrapped in idempotency markers.
// DOMContentLoaded ensures initNews() is defined before we call it.
const inline = [
  '<!-- OTA_NEWS_INLINE_START -->',
  '<script>',
  '// Inlined at deploy time by inject-news.cjs — do not edit manually',
  newsJs.trim(),
  "document.addEventListener('DOMContentLoaded', function() {",
  "  if (typeof initNews === 'function') initNews();",
  '});',
  '</script>',
  '<!-- OTA_NEWS_INLINE_END -->',
].join('\n');

html = html.replace(re, inline);

fs.writeFileSync(indexPath, html, 'utf8');

const kb = (fs.statSync(indexPath).size / 1024).toFixed(1);
console.log(`✅ News data inlined into public/index.html (${kb} KB total)`);
