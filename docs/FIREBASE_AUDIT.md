# Firebase Audit

## Environment

- **Billing Plan**: Firebase Spark (Free tier, `$0/month`).
- **Local Development Mode**: Firebase Emulator Suite (`demo-game-hub`, Firestore port `8080`, Auth port `9099`).
- **Enabled Services**: Cloud Firestore, Firebase Authentication (Email/Password; optional Google Sign-In), Firestore Security Rules.
- **Disabled / Prohibited Services**: Cloud Functions, Cloud Storage (requires Blaze), App Hosting, Realtime Database (not required by Hub), paid SMS Auth.

## Existing Game Firebase Projects

No external Flutter game repositories were supplied in the initial configuration. The platform architecture supports:
- Games with **no Firebase** (bundled offline content only).
- Games sharing the **Hub Firebase project** for optional read-only content packs (`content_metadata/{gameId}`, `game_content/{contentPackId}`).
- Games retaining **independent Firebase projects** via `manifest.content.projectRef`, without forced migration.

## Read/Write Optimization Findings

- Public catalog uses a single compact projection document (`public_catalog/current`) cached in IndexedDB for 60 minutes (`stale-while-revalidate`), avoiding per-game document reads on homepage loads.
- Public game details read a single document (`public_games/{slug}`) cached by `(gameId, revision)`.
- Zero Firestore writes occur during normal public browsing or gameplay.
- Zero realtime listeners (`onSnapshot`) are attached for public users or static game content.
- Admin writes use atomic Firestore transactions updating canonical records, public projections, slug reservations, and audit logs together.
