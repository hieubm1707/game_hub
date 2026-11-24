# game_platform Dart API Reference

```dart
import 'package:flutter/material.dart';
import 'package:game_platform/game_platform.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await GamePlatform.initialize(
    const GamePlatformConfig(
      gameId: 'my-game',
      manifestAsset: 'assets/manifest.json',
      offlineFirst: true,
      firebaseSyncEnabled: true,
      nativeAdsEnabled: true,
      hubBridgeEnabled: true,
    ),
  );

  runApp(const MyApp());
}
```

## Key Interfaces

- `GamePlatform.instance.environment`: `android`, `ios`, `webStandalone`, `webEmbedded`, `unsupported`.
- `GamePlatform.instance.capabilities`: `supportsNativeAds`, `supportsRewardedAds`, `supportsPersistentStorage`, `supportsOfflineGameplay`, `supportsFirebaseSync`, `supportsFullscreen`, `supportsHaptics`, `supportsHubBridge`.
- `GamePlatform.instance.storage`: `NamespacedGameStorage` (`game_hub:<gameId>:`) for local-only progress.
- `GamePlatform.instance.contentRepository` & `syncService`: 3-tier offline-first content loading and non-blocking sync.
- `GamePlatform.instance.ads`: `NativeAdsAdapter` on Android/iOS; `WebAdsUnavailableAdapter` on Web (never initializes AdMob, never falsely rewards).
- `GamePlatform.instance.bridge`: Versioned `postMessage` bridge (`GAME_READY`, `SCORE_UPDATED`, `LEVEL_COMPLETED`, `REQUEST_EXIT`).
