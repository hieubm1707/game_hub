import '../advertising/game_ads.dart';
import '../content/content_sources.dart';
import '../storage/game_storage.dart';
import '../sync/sync_policy.dart';
import 'game_environment.dart';

class GamePlatformConfig {
  const GamePlatformConfig({
    required this.gameId,
    this.manifestAsset = 'assets/manifest.json',
    this.offlineFirst = true,
    this.firebaseSyncEnabled = true,
    this.nativeAdsEnabled = true,
    this.hubBridgeEnabled = true,
    this.allowedHubOrigins = const <String>[],
    this.syncPolicy = const SyncPolicy(),
    this.environmentOverride,
    this.storageOverride,
    this.nativeAdsDelegate,
    this.remoteContentSource,
  });

  final String gameId;
  final String manifestAsset;
  final bool offlineFirst;
  final bool firebaseSyncEnabled;
  final bool nativeAdsEnabled;
  final bool hubBridgeEnabled;
  final List<String> allowedHubOrigins;
  final SyncPolicy syncPolicy;
  final GameEnvironment? environmentOverride;
  final GameStorage? storageOverride;
  final NativeAdsDelegate? nativeAdsDelegate;
  final RemoteContentSource? remoteContentSource;
}
