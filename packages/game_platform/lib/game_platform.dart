library game_platform;

export 'src/core/game_environment.dart';
export 'src/core/game_capabilities.dart';
export 'src/core/game_platform_config.dart';
export 'src/core/game_platform.dart';

export 'src/manifest/game_manifest.dart';
export 'src/manifest/manifest_loader.dart';

export 'src/storage/game_storage.dart';
export 'src/storage/adapters/in_memory_storage.dart';
export 'src/storage/adapters/platform_storage.dart';

export 'src/content/game_content_pack.dart';
export 'src/content/game_content_version.dart';
export 'src/content/content_validator.dart';
export 'src/content/content_sources.dart';
export 'src/content/game_content_repository.dart';

export 'src/sync/sync_policy.dart';
export 'src/sync/sync_result.dart';
export 'src/sync/sync_state.dart';
export 'src/sync/content_sync_service.dart';

export 'src/firebase/firebase_config.dart';
export 'src/firebase/firebase_content_source.dart';

export 'src/advertising/game_ads.dart';
export 'src/advertising/adapters/native_ads_adapter.dart';
export 'src/advertising/adapters/web_ads_unavailable_adapter.dart';
export 'src/advertising/adapters/unsupported_ads_adapter.dart';

export 'src/bridge/bridge_message.dart';
export 'src/bridge/game_hub_bridge.dart';

export 'src/lifecycle/game_lifecycle.dart';
export 'src/audio/game_audio.dart';
export 'src/haptics/game_haptics.dart';
