# Pokédex Viva

A Vue 3 + TypeScript portfolio project — a playful, animated Pokédex covering the full national dex (1,351 entries) via [PokeAPI](https://pokeapi.co), with type/generation filters, a detailed species profile (stats, evolution chain, moves, cries), and a head-to-head stat comparator. Visual design implemented from a Claude Design handoff.

## Features

- **Catálogo** — browse or search the entire national dex, filter by any of the 18 types or by generation (I–IX), with infinite scroll and a 3D pointer-tilt hover on every card.
- **Ficha de Pokémon** — a parallax hero card (official artwork, shiny toggle, real cry playback), base stats, height/weight/generation, a branching evolution chain (handles multi-path chains like Eevee's eeveelutions), and a sample of learnable moves with their real power and type.
- **Comparador** — pick any two Pokémon and see their base stats compared side by side, with a verdict on which one leads overall.
- All content — species names, flavor text, type names, move names, evolution triggers — is shown in Spanish wherever PokeAPI provides it (it does, natively, no premium tier required unlike some other public APIs).

## Stack

Vue 3 (Composition API, `<script setup>`) + TypeScript + Tailwind CSS v4 + Vue Router + Pinia + Axios, organized as **Clean Architecture + feature-first**: `features/pokemon/` holds the shared species domain (`domain/`, `infrastructure/`, `presentation/`) used by both the catalog and detail screens; `features/compare/` layers a comparator on top of it. See [CLAUDE.md](CLAUDE.md) for the full architectural rationale, including how the catalog avoids fetching all 1,351 entries' details up front.

Data comes entirely from the free, keyless [PokeAPI](https://pokeapi.co) — no API key, no rate limit hit in practice.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — type-check (`vue-tsc -b`) then build for production
- `npm run preview` — serve the production build locally

## Project structure

```
src/
  app entry: main.ts, App.vue
  router/               # one route per screen
  shared/
    config/               # env (PokeAPI base URL)
    lib/                   # axios instance, format helpers, infinite-scroll composable
    ui/                      # Spinner, ParticlesBackground
    layout/                   # AppHeader (logo, search, compare button)
  features/
    pokemon/                    # domain/infrastructure/presentation: catalog + detail
    compare/                      # comparator (reuses pokemon's repository/domain)
```

See [CLAUDE.md](CLAUDE.md) for a deeper architectural walkthrough and PokeAPI-specific notes.
