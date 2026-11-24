class GameContentPack {
  const GameContentPack({
    required this.id,
    required this.gameId,
    required this.contentVersion,
    required this.schemaVersion,
    required this.items,
    this.checksum,
    this.source = 'bundled',
  });

  final String id;
  final String gameId;
  final String contentVersion;
  final String schemaVersion;
  final List<Map<String, dynamic>> items;
  final String? checksum;
  final String source;

  Map<String, dynamic> toJson() => {
        'id': id,
        'gameId': gameId,
        'contentVersion': contentVersion,
        'schemaVersion': schemaVersion,
        'items': items,
        if (checksum != null) 'checksum': checksum,
        'source': source,
      };

  factory GameContentPack.fromJson(
    Map<String, dynamic> json, {
    String? sourceOverride,
  }) {
    final rawItems = (json['items'] as List?) ?? const [];
    return GameContentPack(
      id: (json['id'] as String?) ?? 'default',
      gameId: (json['gameId'] as String?) ?? '',
      contentVersion: (json['contentVersion'] as String?) ?? '1.0.0',
      schemaVersion: (json['schemaVersion'] as String?) ?? '1.0.0',
      items: rawItems
          .whereType<Map>()
          .map((e) => Map<String, dynamic>.from(e))
          .toList(),
      checksum: json['checksum'] as String?,
      source: sourceOverride ?? (json['source'] as String?) ?? 'bundled',
    );
  }
}
