# Firestore Schema

| Collection | Access | Purpose |
| --- | --- | --- |
| `admins/{uid}` | Read: self or owner. Write: **DENIED** | Administrator RBAC (`role: owner\|editor`, `enabled: bool`). |
| `games/{gameId}` | Admin-only read/write (delete: owner) | Canonical admin game record with monotonic `revision` and immutable `id`/`createdAt`. |
| `slug_reservations/{slug}` | Admin-only | Transactional slug uniqueness lock (`{ gameId }`). |
| `public_catalog/current` | Public read; Admin write | Single compact catalog projection for homepage, search, and category discovery. |
| `catalog_pages/{pageId}` | Public read; Admin write | Optional sharded catalog pages as catalog grows. |
| `public_games/{slug}` | Public read (`status == 'published'`); Admin write | Published-only detail read model keyed by slug. |
| `categories/{categoryId}` | Public read (`enabled == true`); Admin write | Discovery categories and sort order. |
| `game_releases/{releaseId}` | Public read (`published == true`); Admin write | Deployed static Web artifact version history & rollback targets. |
| `hub_settings/public` | Public read; Owner write | Hub branding and default catalog cache TTL. |
| `content_metadata/{gameId}` | Public read (`published == true`); Admin write | Latest offline content version pointer (`contentVersion`, `packIds`). |
| `game_content/{packId}` | Public read (`published == true`); Admin create only (**immutable**) | Versioned puzzle/level JSON content packs. |
| `admin_audit/{opId}` | Admin read; Admin create only (**append-only**) | Audit log of administrative mutations. |

## Transactional Consistency

All create/update/publish/unpublish/archive/delete operations in `firestoreRepositories.ts` execute inside a single Firestore `runTransaction` that atomically updates `games/{id}`, `slug_reservations/{slug}`, `public_games/{slug}`, `public_catalog/current`, and `admin_audit/{opId}` with optimistic `revision` checks.
