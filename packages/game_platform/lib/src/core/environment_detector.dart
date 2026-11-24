import 'package:flutter/foundation.dart';

import 'game_environment.dart';
import '../platform/stub/env_detector_stub.dart'
    if (dart.library.js_interop) '../platform/web/env_detector_web.dart';

GameEnvironment detectGameEnvironment() {
  if (kIsWeb) {
    return isRunningInIframe()
        ? GameEnvironment.webEmbedded
        : GameEnvironment.webStandalone;
  }
  switch (defaultTargetPlatform) {
    case TargetPlatform.android:
      return GameEnvironment.android;
    case TargetPlatform.iOS:
      return GameEnvironment.ios;
    default:
      return GameEnvironment.unsupported;
  }
}
