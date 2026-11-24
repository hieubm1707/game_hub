class BridgeMessage {
  const BridgeMessage({
    required this.type,
    required this.gameId,
    required this.sessionId,
    required this.messageId,
    required this.timestamp,
    this.payload = const <String, dynamic>{},
    this.protocol = 'game-hub',
    this.protocolVersion = '1.0.0',
  });

  final String protocol;
  final String protocolVersion;
  final String type;
  final String gameId;
  final String sessionId;
  final String messageId;
  final int timestamp;
  final Map<String, dynamic> payload;

  Map<String, dynamic> toJson() => {
        'protocol': protocol,
        'protocolVersion': protocolVersion,
        'type': type,
        'gameId': gameId,
        'sessionId': sessionId,
        'messageId': messageId,
        'timestamp': timestamp,
        'payload': payload,
      };

  static BridgeMessage? tryParse(Object? raw) {
    if (raw is! Map) return null;
    if (raw['protocol'] != 'game-hub') return null;
    if (raw['protocolVersion'] != '1.0.0') return null;
    final type = raw['type'];
    final gameId = raw['gameId'];
    final sessionId = raw['sessionId'];
    final messageId = raw['messageId'];
    final timestamp = raw['timestamp'];
    if (type is! String ||
        gameId is! String ||
        sessionId is! String ||
        messageId is! String ||
        timestamp is! num) {
      return null;
    }
    final payloadRaw = raw['payload'];
    final payload = payloadRaw is Map
        ? Map<String, dynamic>.from(payloadRaw)
        : const <String, dynamic>{};
    return BridgeMessage(
      type: type,
      gameId: gameId,
      sessionId: sessionId,
      messageId: messageId,
      timestamp: timestamp.toInt(),
      payload: payload,
    );
  }
}
