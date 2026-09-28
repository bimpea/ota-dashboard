# Kyber Prototype

This folder is a Kyber prototype — a React app sandboxed with Airbnb's DLS and the `@irbnb/kyber-client` SDK. When the user asks for changes, they mean edits to this React app. 

## Rules

**Use `@irbnb/kyber-client` for all data and service access.** When you need a listing, an LLM, data warehouse, Google Sheets, Redis, S3, or an internal microservice, reach for a kyber-client function. Do not use raw `fetch`, GraphQL, or Viaduct clients. Do not build a Kyber Custom API to wrap anything kyber-client already provides — Custom APIs are only for genuinely novel backend logic. See `/kyber:kyber-client`.

**Don't copy patterns from Pineapple or other Airbnb production code.** What you find will involve auth layers, GraphQL clients, context providers, and middleware that won't work here and will make the prototype harder to maintain.

**Never modify `~/.kyber/pineapple/`.** Don't add components to it. Don't grep it for example implementations — use the `/kyber:dls*` skills for docs instead. That folder exists only for TypeScript definitions and component resolution.

**Don't modify `.kyber/` config files by hand.** The CLI owns `manifest.json`, `tsconfig.json`, etc.

**Keep it small.** Don't add tests, CI, linters, state-management libraries, or folder hierarchies. The prototype lives in `src/App.tsx` and sibling components.

**Surface VPN/auth errors to the user.** If you detect they aren't on VPN, tell them. Don't try to work around it.

**Scaffold with the CLI.** `kyber create`, `kyber create-api` — never by hand.

## CLI commands (run from the prototype directory)

| Command | Purpose |
|---|---|
| `kyber dev` | Start dev server at `http://localhost:5173/<slug>`. Requires VPN. Flags: `--killport`, `--no-button`, `--skip-checks`. Injector prototypes default to `:6173`. |
| `kyber deploy` | Build and publish to `prototypes.sandcastle.musta.ch/<slug>`. `--snapshot <name>` publishes without overwriting prod. |
| `kyber update-prototype` | Run this if `kyber dev` errors on missing commands/deps/files — migrates to the current structure. |
| `kyber update` | Update the CLI itself. |
| `kyber pineapple` | Re-clone the DLS repo if imports stop resolving. |
| `kyber create-api` / `kyber dev-api` / `kyber deploy-api` / `kyber test-api` | Custom API workflow — see `/kyber:kyber-api`. |

Injector prototypes overlay onto a live airbnb.com page via `injector.sandcastle.musta.ch` — see `/kyber:injector`.

## Project structure

```
my-prototype/
  .kyber/
    manifest.json       ← prototype metadata (auto-managed)
    tsconfig.json
    tsconfig.node.json
  src/
    App.tsx             ← your entry point
  index.html
  package.json
  tsconfig.json         ← thin file that extends .kyber/tsconfig.json
```

No `vite.config.ts` — the CLI builds the Vite config programmatically. Plain HTML prototypes can put `.html` files in `public/`; the dev toolbar is injected automatically.

### manifest.json

Auto-generated and auto-updated. Key fields:

- `name`, `slug` — display name and URL slug
- `template` — `"kyber"`, `"injector"`, `"html"`, `"cms"`, or `"api"`
- `platform` — `"prototypes"` or `"injector"`
- `isMobile` — mobile viewport
- `authors` — LDAP usernames (auto-updated)
- `meta.tags` — dashboard discovery tags
- `access` — restrict to users, a Trebuchet flag, or a Gandalf entity
- `injectorDefaultUrl` — airbnb.com URL to open (injector only)

## Building the prototype

`App.tsx` is a standard React component. Import DLS, call kyber-client, build your UI.

```tsx
import { useState, useEffect } from 'react';
import { getListing } from '@irbnb/kyber-client';

export default function App() {
  const [listing, setListing] = useState(null);
  useEffect(() => {
    getListing({ listingId: '12345', options: { useCache: true } }).then(setListing);
  }, []);
  return <div>{listing?.title}</div>;
}
```

For routing, use `@irbnb/kyber-client`'s router wrappers instead of raw `react-router-dom`.

## Available skills

Reach for these before writing anything from scratch or looking in internal code bases:

- `/kyber:dls` — DLS components (buttons, forms, modals, navigation, …)
- `/kyber:dls-base` — foundational primitives (only if nothing in dls-current fits)
- `/kyber:dls-tokens` — colors, spacing, radii, elevation, typography (the look of airbnb)
- `/kyber:dls-icons` — icon library and naming conventions
- `/kyber:kyber-client` — SDK reference (listings, LLMs, data warehouse, storage, microservices)
- `/kyber:listing-card` — production listing cards + mock data
- `/kyber:maps` — `UniversalMap`, markers, overlays
- `/kyber:injector` — injecting React into live airbnb.com pages
- `/kyber:kyber-api` — Custom API workflow (only when kyber-client can't cover it)
- `/kyber:kyber-api-docs` — regenerate `api-manifest.json` to power the `/docs` playground (Custom API only)
- `/kyber:debug` — diagnose and fix common kyber installation issues

---

## User instructions

<!-- IMPORTANT: Do not modify anything above this section. The content above is managed by the Kyber CLI. Only append your own notes below this line.

     Claude reads this file on every conversation.
     Good things to capture here:
       - What this prototype is for and who it's for
       - Data sources, listing IDs, or API endpoints being used
       - Design decisions worth remembering
       - Things Claude should avoid or always do in this project
     Keep entries short — one or two sentences each. -->
