import 'bridge_message.dart';
import '../platform/stub/bridge_stub.dart'
    if (dart.library.js_interop) '../platform/web/bridge_web.dart';

typedef HubCommandHandler = void Function(BridgeMessage message);

abstract class GameHubBridge {
  bool get isConnected;
  void connect({
    required String gameId,
    required List<String> allowedOrigins,
    HubCommandHandler? onCommand,
  });
  void sendEvent(String type, {Map<String, dynamic> payload = const {}});
  void dispose();
}

GameHubBridge createGameHubBridge() => createGameHubBridgeImpl();
