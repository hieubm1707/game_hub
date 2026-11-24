# game_platform

Reusable Flutter package shared across independent offline-first Flutter games integrated with the Game Hub.

## Features

- Platform & capability detection (`GameEnvironment`, `GameCapabilities`)
- Manifest v2.0.0 parsing & validation (`GameManifest`, `ManifestLoader`)
- Namespaced local progress storage (`GameStorage`, Web `localStorage` + in-memory/custom adapters)
- 3-tier offline-first content architecture (`BundledContentSource`, `LocalContentSource`, `RemoteContentSource`)
- Non-blocking background sync (`ContentSyncService`, 24h interval, exponential backoff, atomic activation)
- Native-only advertising isolation (`GameAds`, `NativeAdsAdapter`, `WebAdsUnavailableAdapter`)
- Versioned `postMessage` Hub bridge (`GameHubBridge`, protocol `game-hub` v1.0.0)
- Platform-safe conditional imports (zero native/AdMob code compiled into Flutter Web)
