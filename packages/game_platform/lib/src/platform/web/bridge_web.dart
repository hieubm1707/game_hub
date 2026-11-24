import 'dart:js_interop';
import 'package:web/web.dart' as web;

import '../../bridge/bridge_message.dart';
import '../../bridge/game_hub_bridge.dart';

class WebGameHubBridge implements GameHubBridge {
  String _gameId = '';
  String _sessionId = 'standalone';
  String? _targetOrigin;
  List<String> _allowedOrigins = const [];
  HubCommandHandler? _onCommand;
  JSFunction? _listener;
  int _seq = 0;

  @override
  bool get isConnected => _targetOrigin != null;

  @override
  void connect({
    required String gameId,
    required List<String> allowedOrigins,
    HubCommandHandler? onCommand,
  }) {
    _gameId = gameId;
    _allowedOrigins = allowedOrigins;
    _onCommand = onCommand;

    final params = Uri.base.queryParameters;
    if (params['sessionId'] != null && params['sessionId']!.isNotEmpty) {
      _sessionId = params['sessionId']!;
    }
    final hubOrigin = params['hubOrigin'];
    if (hubOrigin != null &&
        (_allowedOrigins.isEmpty || _allowedOrigins.contains(hubOrigin))) {
      _targetOrigin = hubOrigin;
    }

    _listener = ((web.MessageEvent event) {
      final origin = event.origin;
      if (_allowedOrigins.isNotEmpty && !_allowedOrigins.contains(origin)) {
        return;
      }
      final dartData = event.data.dartify();
      final msg = BridgeMessage.tryParse(dartData);
      if (msg == null || msg.gameId != _gameId) return;

      if (msg.type == 'HUB_INIT') {
        _targetOrigin = origin;
        _sessionId = msg.sessionId;
      }
      _onCommand?.call(msg);
    }).toJS;

    web.window.addEventListener('message', _listener!);
  }

  @override
  void sendEvent(String type, {Map<String, dynamic> payload = const {}}) {
    final parent = web.window.parent;
    if (parent == null || parent == web.window) return;
    final target = _targetOrigin;
    if (target == null || target.isEmpty) return;

    _seq += 1;
    final msg = BridgeMessage(
      type: type,
      gameId: _gameId,
      sessionId: _sessionId,
      messageId: '$_gameId-$_seq-${DateTime.now().millisecondsSinceEpoch}',
      timestamp: DateTime.now().millisecondsSinceEpoch,
      payload: payload,
    );

    parent.postMessage(msg.toJson().jsify(), target.toJS);
  }

  @override
  void dispose() {
    if (_listener != null) {
      web.window.removeEventListener('message', _listener!);
      _listener = null;
    }
  }
}

GameHubBridge createGameHubBridgeImpl() => WebGameHubBridge();
