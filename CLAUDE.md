# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server
- `npm run build` — type-checks (`vue-tsc -b`) then builds for production; both steps must pass
- `npm run preview` — serve the production build locally

Type checking is the only automated correctness check — no test runner, no ESLint, no Prettier (matches every other project in this portfolio).

## The mockup used no real data at all

Unlike `openf1-dashboard` and `herbario-vivo`, the Claude Design handoff for this project (`Pokedex.dc.html`) never called any API — it hardcoded 24 Pokémon with fabricated stats, moves, and evolution chains directly in the component's `constructor()`. Everything data-related in this codebase (the repository, the entity shapes, the evolution-chain tree parser, the move-detail fetch) was designed from scratch against the real [PokeAPI](https://pokeapi.co) docs and live `curl` verification — it does not port any data-handling logic from the mockup, only its visual structure and styling.

## Architecture: Clean Architecture + feature-first

- **`features/pokemon/`** — the shared species domain, used by both the catalog grid and the detail screen:
  - `domain/` — entities (`Pokemon`, `SpeciesInfo`, `EvolutionChain`, `MoveInfo`), the `PokemonRepository` interface, and pure logic (`type-colors.ts`, `stat-labels.ts`, `gradient.ts`, `generations.ts`).
  - `infrastructure/` — `PokeApiPokemonRepository`, the only place that knows PokeAPI's wire format. Exports a **shared singleton** (`pokemonRepository`), not a class for each store to instantiate — see below for why.
  - `presentation/` — `catalog.store.ts` (grid: filters, infinite scroll, per-card fetch cache) and `detail.store.ts` (single-Pokémon bundle: species + evolution chain + moves, cached by id), plus their components/views.
- **`features/compare/`** — `domain/compare-row.ts` (pure stat-comparison + verdict logic) and a `presentation/` store/view. It has no `infrastructure/` of its own — it imports the same `pokemonRepository` singleton from `features/pokemon/infrastructure`, the one deliberate cross-feature import in this codebase (comparable to the F1 dashboard's `timing` store importing telemetry's `Lap` type: one shared resource, several consuming features).

**Why `pokemonRepository` is a singleton instance, not `new Repository()` per store**: `listAllNames()` fetches all ~1,351 national-dex entries in one request and caches the result on the instance. If `catalog.store.ts`, `detail.store.ts`, and `compare.store.ts` each `new`'d their own repository (the pattern used in `herbario-vivo`/`openf1-dashboard`, where each store's data is independent), that cache wouldn't be shared and the full name index could be fetched three times in one session for no reason. `infrastructure/pokeapi-pokemon.repository.ts` exports both the class (for the interface/DI story) and a ready-made `pokemonRepository` instance — always import the instance, not the class, unless you're writing a test double.

## PokeAPI-specific design decisions

- **No API key, no meaningful rate limit** — `shared/lib/http.ts` is a plain axios instance, no interceptor, no request queue (contrast with `openf1-dashboard`'s throttled client). The only 429s seen during development were from `raw.githubusercontent.com` sprite image bursts, not the PokeAPI JSON endpoints themselves — cosmetic (a card's sprite may briefly 404-then-load-on-retry), not a functional problem, and not worth building retry logic for a sprite `<img>`.
- **The catalog never fetches details for all 1,351 entries.** `listAllNames()` (id + name only, one request) builds the searchable index; `/type/{slug}` and `/generation/{slug}` each return their full member-id list in one request and are cached per filter value (`typeIdCache`/`generationIdCache` in `catalog.store.ts`). Filtering intersects these id sets client-side. Only the current infinite-scroll page's ids ever get a full `/pokemon/{id}` detail fetch (needed for type badges + sprite — there is no lighter "summary" endpoint). Don't "optimize" this by pre-fetching all details; that's the one thing this design specifically avoids.
- **Spanish names/text come from PokeAPI's own `names`/`flavor_text_entries`/`genera` arrays** (`language.name === 'es'`), not a translation layer — confirmed live that Perenual-style paywalled translation isn't a concern here; PokeAPI's Spanish localization is free-tier and complete for species, types, and moves. **Evolution triggers/items are the one exception**: PokeAPI has no localized names for evolution triggers (`level-up`, `trade`, `use-item`, …) or items (`thunder-stone`, `kings-rock`, …), so `pokeapi-pokemon.repository.ts` hand-maintains `ITEM_LABELS`/`TRIGGER_LABELS` translation maps for the common ones and falls back to a title-cased English slug for anything not in them. If an evolution ever renders an English-looking trigger label (e.g. "Ability Change"), that's this fallback working as intended, not a bug — extend the map if a specific one comes up often enough to matter.
- **Pokémon cries are real audio**, not the mockup's synthesized oscillator beep — `pokemon.cries.latest` (falling back to `.legacy` for the handful of Pokémon missing the newer file) is played via a plain `Audio` element in `detail.store.ts`. This is a deliberate upgrade over the mockup, which had no real audio source to work with.
- **Evolution chains can branch** (Eevee → 8 eeveelutions, each with its own trigger). `getEvolutionChain()` parses the chain via breadth-first traversal into `EvolutionStage[]`, where each stage holds every sibling at that depth and **each node carries its own trigger label** (not one trigger per stage) — necessary because siblings can evolve via different methods. `EvolutionChainView.vue` renders one `→` separator per stage (not per node) and the trigger text under each individual member.
- **Featured moves are a client-side pick, not curated data**: `detail.store.ts` dedupes `pokemon.moveNames` and takes the first 4, then fetches each move's real power/type/Spanish name via `/move/{name}`. There's no "best 4 moves" ranking from the API — this is an arbitrary but stable selection, matching the mockup's own "show 4 moves" layout without claiming they're the Pokémon's strongest or most representative moves.

## Design system

Implemented from `Pokedex.dc.html` — treat `src/style.css` as the source of truth for tokens.

- **Colors**: `paper`/`cream`/`line` (warm neutral backgrounds/borders), `ink` (primary text), `sand`/`taupe`/`brown` (muted label text, lightest → darkest), `accent` (#DC3B4B, the brand red), plus one CSS variable per Pokémon type (`--color-type-*`, all 18) — declared under `@theme` (Tailwind v4 CSS-first, no `tailwind.config.js`). Type colors and their Spanish display names both live in `features/pokemon/domain/type-colors.ts` (`TYPE_COLORS`/`TYPE_NAMES_ES`), ported directly from the mockup's own palette — don't invent new hex values for a type that's already defined there.
- **Fonts**: `font-display` (Fredoka — headings, big numbers, buttons) / `font-sans` (Nunito — body text, chips), loaded via a Google Fonts `<link>` in `index.html`.
- **Card tilt effect**: `PokemonCard.vue` tracks pointer position locally (component-scoped refs, not a shared composable — it's only used in one place) to compute a CSS `perspective()`/`rotateX`/`rotateY` transform plus a radial-gradient gloss overlay that follows the cursor, matching the mockup's per-card hover math exactly.
- **Gradients**: every type-colored surface (cards, hero, compare panels) uses `color-mix(in srgb, <type color> X%, #fff|#000)` via `gradientForTypes()` in `domain/gradient.ts`, exactly reproducing the mockup's `grad()` method — this relies on browser support for CSS `color-mix()` (all evergreen browsers; no fallback needed for a portfolio piece).

## Routing

Three routes, statically imported in `src/router/index.ts`: `/` (catalog grid), `/pokemon/:id` (detail), `/compare`. `App.vue` wraps `<RouterView>` in a `<Transition name="fade" mode="out-in">` — every route view has a single root element (required for that transition mode; see `space-explorer/CLAUDE.md` for the failure mode if this is ever violated).
