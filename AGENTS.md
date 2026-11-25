# AGENTS.md — Permanent Engineering Constraints

All future AI coding agents and contributors working in this repository MUST obey these non-negotiable rules:

1. **Serverless Only**: Never introduce Express, NestJS, custom Node APIs, GraphQL servers, Cloud Functions, Cloud Run, Cloudflare Workers, Pages Functions, or Firebase App Hosting.
2. **Zero Infrastructure Cost**: Keep Firebase on the Spark plan. Never enable Firebase Cloud Storage (requires Blaze), paid analytics, paid search (Algolia/Elasticsearch), or paid SMS auth.
3. **Native-Only Advertising**: The Game Hub and Flutter Web builds MUST be 100% ad-free (`features.webAds: true`). Never import AdMob or native ad SDKs into Web compilation paths; always isolate behind `GameAds` (`WebAdsUnavailableAdapter` on Web).
4. **Offline-First Games**: Every supported Flutter game must launch offline with bundled content (`assets/content/default.json`). Never block startup on Firebase. Keep player progress local; normal public gameplay MUST produce zero Firestore writes.
5. **Firebase Security Rules**: Never relax deny-by-default rules in `firebase/firestore.rules`. Never make `admins/{uid}` writable from client SDKs. Always run `pnpm test:firebase` after editing rules.
6. **No Game-Specific Hub Logic**: Never hardcode individual games, routes, components, or install modals into `apps/hub`. All game metadata and capabilities must flow from validated `manifest.json` v2.0.0 and Firestore documents.
7. **Independent Game Deployment**: Each Flutter Web game builds and deploys independently to static hosting under versioned paths (`/releases/<version>/`).
8. **No Secrets in Code**: Never commit service accounts, private keys, API tokens, or machine-specific absolute paths. Use `config/repositories.local.yaml` (gitignored) and `.env.local` (gitignored).
9. **Verification**: Run `pnpm build`, `pnpm test`, and `pnpm test:firebase` before concluding changes.
