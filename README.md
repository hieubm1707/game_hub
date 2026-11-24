# Game Hub Platform

A nonprofit, zero-cost, serverless browser Game Hub aggregating offline-first Flutter games.

## Core Principles

- **Serverless only**: Zero custom backend servers, zero Cloud Functions, zero Workers/Pages Functions.
- **Zero infrastructure cost**: Firebase Spark (Firestore + Auth + Security Rules) + Cloudflare Pages Free static hosting.
- **Offline-first Flutter games**: Bundled baseline content, local-only player progress, non-blocking versioned content sync.
- **Native-only advertising**: 100% ad-free Hub and Flutter Web builds; existing native Android/iOS ads isolated behind `GameAds`.
- **Manifest-driven**: Adding a new compatible game requires zero Hub source edits or Hub redeployments.

## Workspace Layout

- [apps/hub](apps/hub) — Static React + Vite + TypeScript + Tailwind SPA (Public Hub + Admin Dashboard + Game Player).
- [packages/game_contract](packages/game_contract) — Manifest v2.0.0 & Bridge v1.0.0 JSON Schemas, TypeScript types, and validators.
- [packages/game_platform](packages/game_platform) — Reusable Flutter package for offline-first games.
- [packages/game_cli](packages/game_cli) — Local CLI for inspecting, validating, building, and preparing game releases.
- [firebase](firebase) — Firestore Security Rules, indexes, emulator config, seed script, and Security Rules tests.
- [fixtures/games](fixtures/games) — Explicitly labeled Flutter test fixtures (`iq_puzzle_fixture`, `memory_match_fixture`).
- [docs](docs) — Architecture, Firebase setup, Firestore schema, free-tier budget, admin guide, offline sync, and onboarding docs.

## Quick Start (Local Emulators)

```bash
# 1. Install dependencies & build packages
pnpm install
pnpm build

# 2. Start Firebase Emulator Suite (Auth + Firestore)
pnpm emulators:start

# 3. In another terminal, seed emulator with owner/editor admins + fixture catalog
pnpm emulators:seed

# 4. Prepare & serve local Flutter Web fixture build
pnpm game prepare-release --id iq-puzzle-fixture
pnpm game serve --port 8090

# 5. Start the Game Hub dev server
pnpm dev:hub
```

Default emulator admin credentials (local emulator only):
- Owner: `admin@gamehub.local` / `Admin123456!`
- Editor: `editor@gamehub.local` / `Editor123456!`

## Running Tests

```bash
pnpm test              # Contract, CLI, Hub, and Flutter game_platform tests
pnpm test:firebase     # Firestore Security Rules tests via Firebase Emulator Suite
pnpm validate:all      # Workspace integrity check
```

## Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [FIREBASE_SETUP.md](docs/FIREBASE_SETUP.md)
- [FIRESTORE_SCHEMA.md](docs/FIRESTORE_SCHEMA.md)
- [FREE_TIER_STRATEGY.md](docs/FREE_TIER_STRATEGY.md)
- [ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md)
- [OFFLINE_SYNC.md](docs/OFFLINE_SYNC.md)
- [ADD_NEW_GAME.md](docs/ADD_NEW_GAME.md)
- [GAME_PLATFORM_API.md](docs/GAME_PLATFORM_API.md)
- [BRIDGE_PROTOCOL.md](docs/BRIDGE_PROTOCOL.md)
- [AGENTS.md](AGENTS.md)
