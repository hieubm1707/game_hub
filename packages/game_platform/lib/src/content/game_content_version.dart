class GameContentVersion {
  const GameContentVersion({
    required this.gameId,
    required this.contentVersion,
    required this.schemaVersion,
    required this.packIds,
    this.minimumGameVersion,
  });

  final String gameId;
  final String contentVersion;
  final String schemaVersion;
  final List<String> packIds;
  final String? minimumGameVersion;

  factory GameContentVersion.fromJson(Map<String, dynamic> json) {
    return GameContentVersion(
      gameId: (json['gameId'] as String?) ?? '',
      contentVersion: (json['contentVersion'] as String?) ?? '1.0.0',
      schemaVersion: (json['schemaVersion'] as String?) ?? '1.0.0',
      packIds: ((json['packIds'] as List?) ?? const [])
          .map((e) => e.toString())
          .toList(),
      minimumGameVersion: json['minimumGameVersion'] as String?,
    );
  }
}
