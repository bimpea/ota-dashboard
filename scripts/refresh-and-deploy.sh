#!/bin/bash
# Daily OTA Dashboard news refresh + deploy
# Installed as a daily cron: runs at 10am PT every day

set -e

# Full paths required — cron runs with a minimal PATH that excludes user bin dirs
NODE="/Users/bimpe_abimbola/.local/bin/node"
KYBER="/Users/bimpe_abimbola/.bun/bin/kyber"

# kyber's own shebang is "#!/usr/bin/env node" — env resolves that via PATH,
# not via the $NODE variable above. Cron's minimal PATH doesn't include node's
# directory, so "kyber deploy" was silently failing with
# "env: node: No such file or directory" on every run since Jun 15.
export PATH="$(dirname "$NODE"):$(dirname "$KYBER"):$PATH"

PROJ="/Users/bimpe_abimbola/Claude Projects/ota-dashboard"
LOG="$PROJ/scripts/refresh.log"

echo "$(date): Starting news refresh..." >> "$LOG"

cd "$PROJ"

# Fetch fresh news from RSS feeds
"$NODE" scripts/fetch-news.cjs >> "$LOG" 2>&1

# Inline news data into dist/index.html (avoids CDN caching the separate file)
"$NODE" scripts/inject-news.cjs >> "$LOG" 2>&1

# Deploy
"$KYBER" deploy >> "$LOG" 2>&1

echo "$(date): Deploy complete." >> "$LOG"
