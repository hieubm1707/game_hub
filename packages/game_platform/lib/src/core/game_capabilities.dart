import 'game_environment.dart';

class GameCapabilities {
  const GameCapabilities({
    required this.supportsNativeAds,
    required this.supportsRewardedAds,
    required this.supportsPersistentStorage,
    required this.supportsOfflineGameplay,
    required this.supportsFirebaseSync,
    required this.supportsFullscreen,
    required this.supportsHaptics,
    required this.supportsHubBridge,
  });

  final bool supportsNativeAds;
  final bool supportsRewardedAds;
  final bool supportsPersistentStorage;
  final bool supportsOfflineGameplay;
  final bool supportsFirebaseSync;
  final bool supportsFullscreen;
  final bool supportsHaptics;
  final bool supportsHubBridge;

  factory GameCapabilities.forEnvironment(
    GameEnvironment env, {
    bool nativeAdsEnabled = true,
    bool firebaseSyncEnabled = true,
    bool hubBridgeEnabled = true,
  }) {
    final allowNativeAds = env.isMobileNative && nativeAdsEnabled;
    return GameCapabilities(
      supportsNativeAds: allowNativeAds,
      supportsRewardedAds: allowNativeAds,
      supportsPersistentStorage: env != GameEnvironment.unsupported,
      supportsOfflineGameplay: true,
      supportsFirebaseSync: firebaseSyncEnabled,
      supportsFullscreen: env.isWeb,
      supportsHaptics: env.isMobileNative,
      supportsHubBridge: env == GameEnvironment.webEmbedded && hubBridgeEnabled,
    );
  }
}
