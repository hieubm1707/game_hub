import '../../bridge/bridge_message.dart';
import '../../bridge/game_hub_bridge.dart';

class StubGameHubBridge implements GameHubBridge {
  @override
  bool get isConnected => false;

  @override
  void connect({
    required String gameId,
    required List<String> allowedOrigins,
    HubCommandHandler? onCommand,
  }) {}

  @override
  void sendEvent(String type, {Map<String, dynamic> payload = const {}}) {}

  @override
  void dispose() {}
}

GameHubBridge createGameHubBridgeImpl() => StubGameHubBridge();
