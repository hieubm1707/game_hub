import '../game_storage.dart';
import '../../platform/stub/storage_stub.dart'
    if (dart.library.js_interop) '../../platform/web/storage_web.dart';

GameStorage createDefaultPlatformStorage() => createPlatformStorageImpl();
