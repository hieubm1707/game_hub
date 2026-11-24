import '../advertising/adapters/native_ads_adapter.dart';
import '../advertising/adapters/unsupported_ads_adapter.dart';
import '../advertising/adapters/web_ads_unavailable_adapter.dart';
import '../advertising/game_ads.dart';
import '../audio/game_audio.dart';
import '../bridge/game_hub_bridge.dart';
import '../content/content_sources.dart';
import '../content/game_content_repository.dart';
import '../haptics/game_haptics.dart';
import '../lifecycle/game_lifecycle.dart';
import '../manifest/game_manifest.dart';
import '../manifest/manifest_loader.dart';
import '../storage/adapters/platform_storage.dart';
import '../storage/game_storage.dart';
import '../sync/content_sync_service.dart';
import 'environment_detector.dart';
import 'game_capabilities.dart';
import 'game_environment.dart';
import 'game_platform_config.dart';

class GamePlatform {
  GamePlatform._({
    required this.config,
    required this.environment,
    required this.capabilities,
    required this.storage,
    required this.ads,
    required this.bridge,
    required this.lifecycle,
    required this.audio,
    required this.haptics,
    this.manifest,
    this.contentRepository,
    this.syncService,
  });

  static GamePlatform? _instance;

  static GamePlatform get instance {
    final inst = _instance;
    if (inst == null) {
      throw StateError('GamePlatform.initialize() must be called before accessing GamePlatform.instance');
    }
    return inst;
  }

  static bool get isInitialized => _instance != null;

  final GamePlatformConfig config;
  final GameEnvironment environment;
  final GameCapabilities capabilities;
  final GameManifest? manifest;
  final NamespacedGameStorage storage;
  final GameAds ads;
  final GameHubBridge bridge;
  final GameLifecycle lifecycle;
  final GameAudio audio;
  final GameHaptics haptics;
  final GameContentRepository? contentRepository;
  final ContentSyncService? syncService;

  static Future<GamePlatform> initialize(
    GamePlatformConfig config, {
    ManifestLoader? manifestLoader,
    BundledContentSource? bundledContentSource,
  }) async {
    final env = config.environmentOverride ?? detectGameEnvironment();

    GameManifest? loadedManifest;
    try {
      loadedManifest = await (manifestLoader ?? ManifestLoader())
          .loadFromAsset(config.manifestAsset);
    } catch (_) {
      // Allow graceful startup even if manifest asset is absent in unit tests.
    }

    final capabilities = GameCapabilities.forEnvironment(
      env,
      nativeAdsEnabled: config.nativeAdsEnabled,
      firebaseSyncEnabled: config.firebaseSyncEnabled,
      hubBridgeEnabled: config.hubBridgeEnabled,
    );

    final rawStorage = config.storageOverride ?? createDefaultPlatformStorage();
    final namespacedStorage = NamespacedGameStorage(
      delegate: rawStorage,
      gameId: config.gameId,
    );

    final GameAds ads;
    if (env.isWeb) {
      ads = const WebAdsUnavailableAdapter();
    } else if (env.isMobileNative && config.nativeAdsEnabled) {
      ads = NativeAdsAdapter(delegate: config.nativeAdsDelegate);
      // Never block offline startup on ad SDK init.
      await ads.initialize();
    } else {
      ads = const UnsupportedAdsAdapter();
    }

    final lifecycle = GameLifecycle();
    final audio = GameAudio();
    final haptics = GameHaptics(enabled: capabilities.supportsHaptics);
    final bridge = createGameHubBridge();

    if (capabilities.supportsHubBridge) {
      bridge.connect(
        gameId: config.gameId,
        allowedOrigins: config.allowedHubOrigins,
        onCommand: (cmd) {
          switch (cmd.type) {
            case 'PAUSE_GAME':
              lifecycle.notifyPaused();
              break;
            case 'RESUME_GAME':
              lifecycle.notifyResumed();
              break;
            case 'MUTE_AUDIO':
              audio.mute();
              break;
            case 'UNMUTE_AUDIO':
              audio.unmute();
              break;
          }
        },
      );
    }

    GameContentRepository? contentRepo;
    ContentSyncService? syncSvc;

    final bundled = bundledContentSource ??
        (loadedManifest?.bundledContentAsset != null
            ? AssetBundledContentSource(
                assetPath: loadedManifest!.bundledContentAsset!,
              )
            : null);

    if (bundled != null) {
      contentRepo = OfflineFirstContentRepository(
        gameId: config.gameId,
        bundledSource: bundled,
        localSource: StorageLocalContentSource(namespacedStorage),
        remoteSource: config.firebaseSyncEnabled ? config.remoteContentSource : null,
      );
      syncSvc = ContentSyncService(
        repository: contentRepo,
        storage: namespacedStorage,
        policy: config.syncPolicy,
      );
    }

    final instance = GamePlatform._(
      config: config,
      environment: env,
      capabilities: capabilities,
      manifest: loadedManifest,
      storage: namespacedStorage,
      ads: ads,
      bridge: bridge,
      lifecycle: lifecycle,
      audio: audio,
      haptics: haptics,
      contentRepository: contentRepo,
      syncService: syncSvc,
    );

    _instance = instance;
    return instance;
  }

  static void resetForTesting() {
    _instance?.bridge.dispose();
    _instance = null;
  }
}
