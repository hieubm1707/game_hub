# Porting Matrix

This matrix tracks Flutter game compatibility with the Game Hub platform. Currently populated with the two explicitly labeled verification fixtures; append real games after running `pnpm game inspect`.

| Game ID | Type | Flutter SDK | Web Ready | Offline First | Bundled Content | Native Ads Isolated | Hub Bridge | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `iq-puzzle-fixture` | Test Fixture (Reference) | `>=3.10.0` (Dart 3.10.1) | Yes | Yes | `assets/content/default.json` | Yes (`WebAdsUnavailableAdapter`) | Yes (`v1.0.0`) | Reference fixture demonstrating full `game_platform` lifecycle |
| `memory-match-fixture` | Test Fixture (Secondary) | `>=3.10.0` (Dart 3.10.1) | Yes | Yes | `assets/content/default.json` | Yes (`WebAdsUnavailableAdapter`) | Yes (`v1.0.0`) | Validates manifest-only onboarding with zero Hub code edits |

## Porting Checklist for Real Flutter Games

1. Run `pnpm game inspect --path <repo>` to detect `dart:io`, FFI, AdMob, and platform channels.
2. Replace direct `dart:io` calls on Web paths with conditional imports or `game_platform` abstractions.
3. Wrap AdMob calls behind `GameAds` (`NativeAdsAdapter` on Android/iOS, `WebAdsUnavailableAdapter` on Web).
4. Bundle baseline offline level/puzzle content under `assets/content/default.json`.
5. Keep player progress local using `GameStorage` (never write per-move progress to Firestore).
6. Generate `assets/manifest.json` via `pnpm game init` and verify with `pnpm game doctor`.
7. Build independently with `pnpm game build --id <id>` and prepare release with `pnpm game prepare-release --id <id>`.
