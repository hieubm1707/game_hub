# Architecture Overview

The Game Hub platform separates static web delivery, managed Firestore metadata, and independently deployed offline-first Flutter games:

- **Static Game Hub SPA (`apps/hub`)**: React + Vite + TypeScript + Tailwind hosted on Cloudflare Pages Free. Uses modular Firebase Web SDK for direct Firestore reads (public catalog & published game details) and Firebase Auth + Firestore transactions for `/admin/*`.
- **Managed Backend (`firebase/`)**: Cloud Firestore + Firebase Auth + deny-by-default Security Rules on Firebase Spark (`$0/month`).
- **Shared Contract (`packages/game_contract`)**: Canonical JSON Schemas (`game-manifest.schema.json` v2.0.0, `bridge-message.schema.json` v1.0.0), TypeScript types, and AJV validator.
- **Shared Flutter Platform (`packages/game_platform`)**: Reusable Dart/Flutter package providing environment detection, manifest loading, namespaced local storage, 3-tier offline-first content sync, native-only ad isolation, and Web `postMessage` bridge.
- **Independent Game Artifacts**: Each Flutter Web game builds with `--base-href /<game-id>/releases/<version>/` and deploys statically. The Hub loads games lazily inside a sandboxed iframe validated against `VITE_ALLOWED_GAME_ORIGINS`.

## SPA SEO Limitations

Because `apps/hub` is a static SPA without SSR or paid prerendering, per-route `<title>` and `<meta name="description">` are updated client-side via `useDocumentTitle`. Static crawlers that do not execute JavaScript will see the default Open Graph tags in `index.html`. `/admin/*` is excluded via `robots.txt` and `X-Robots-Tag: noindex, nofollow`.
