# Offline-First Content Synchronization

All Flutter games using `packages/game_platform` follow a 3-tier content hierarchy:

1. **BundledContentSource** (`assets/content/default.json`): Shipped inside the app binary so first launch works 100% offline.
2. **LocalContentSource** (`StorageLocalContentSource`): Persists validated remote updates locally in namespaced storage.
3. **RemoteContentSource** (`FirebaseContentSource`): Optional read-only Firestore pointer (`content_metadata/{gameId}`) + immutable packs (`game_content/{packId}`).

## Startup & Safe Activation Flow

1. On launch, `OfflineFirstContentRepository.loadContent()` immediately returns valid local content or falls back to bundled content — **never blocking startup on Firebase**.
2. `ContentSyncService.synchronizeIfEligible()` checks the 24-hour interval and exponential backoff window, deduplicating concurrent calls.
3. If a newer `contentVersion` exists, packs are downloaded, validated via `ContentValidator`, and written to a **staged** slot.
4. The game calls `activatePendingContent()` at a safe gameplay boundary (e.g., level menu), preventing mid-level corruption.
5. Offline errors, timeouts, permission errors, invalid payloads, and `quotaExhausted` leave the last known good content untouched.
