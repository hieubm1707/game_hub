# Free-Tier & Firebase Quota Strategy

## Target Monthly Infrastructure Cost: $0

| Service | Plan | Notes |
| --- | --- | --- |
| Firebase Firestore | Spark (Free) | ~50,000 reads/day, ~20,000 writes/day, 1 GiB storage (check official Firebase docs for current limits). |
| Firebase Authentication | Spark (Free) | Admin accounts only (Email/Password). Zero public user accounts. |
| Cloudflare Pages | Free | Static SPA + independent Flutter Web game artifacts. No Workers/Functions/R2. |

## Read/Write Budget Model

- **Homepage / Search / Category browse**: 1 read of `public_catalog/current` per visitor per 60 minutes (cached in IndexedDB with `stale-while-revalidate` and in-flight request deduplication).
- **Game Detail**: 1 read of `public_games/{slug}`, cached by `(slug, revision)`.
- **Normal Public Gameplay**: **0 Firestore writes** and **0 per-move reads**. All player progress is stored locally.
- **Native Offline Content Sync**: At most 1 metadata read per 24 hours per active device; pack downloads occur only when `contentVersion` changes.

### Example Daily Estimate (2,000 daily visitors, 1.5 game details/visitor)
- Catalog reads: `2,000 * 1 = 2,000`
- Game detail reads: `2,000 * 1.5 = 3,000`
- Admin CRUD reads/writes: `< 200`
- **Total**: ~5,200 reads/day (~10% of Spark baseline) and `< 200` writes/day.

## Quota Exhaustion & Abuse Risks

- Publicly readable Firestore collections can theoretically be scraped. Mitigations: compact projections, client-side IndexedDB caching, no realtime listeners (`onSnapshot`), and optional Firebase App Check (free reCAPTCHA v3) when needed.
- On `resource-exhausted` or network failures, `CatalogCacheService` serves the last known valid cached catalog, and Flutter games continue running offline from bundled/local content without retry storms or billing upgrades.
