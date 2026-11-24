class GameManifestException implements Exception {
  GameManifestException(this.message);
  final String message;

  @override
  String toString() => 'GameManifestException: $message';
}

class GameManifest {
  const GameManifest({
    required this.schemaVersion,
    required this.id,
    required this.slug,
    required this.version,
    required this.title,
    required this.shortDescription,
    required this.description,
    required this.categories,
    required this.webAds,
    required this.nativeAds,
    required this.offlineFirst,
    required this.syncEnabled,
    required this.syncIntervalHours,
    required this.hubBridgeEnabled,
    this.bundledContentAsset,
    this.bundledContentVersion,
    this.remoteMetadataPath,
    this.raw = const <String, dynamic>{},
  });

  final String schemaVersion;
  final String id;
  final String slug;
  final String version;
  final String title;
  final String shortDescription;
  final String description;
  final List<String> categories;
  final bool webAds;
  final bool nativeAds;
  final bool offlineFirst;
  final bool syncEnabled;
  final int syncIntervalHours;
  final bool hubBridgeEnabled;
  final String? bundledContentAsset;
  final String? bundledContentVersion;
  final String? remoteMetadataPath;
  final Map<String, dynamic> raw;

  factory GameManifest.fromJson(Map<String, dynamic> json) {
    final schemaVersion = json['schemaVersion'] as String?;
    if (schemaVersion != '2.0.0') {
      throw GameManifestException(
        'Unsupported manifest schemaVersion: $schemaVersion (expected 2.0.0)',
      );
    }

    final id = json['id'] as String?;
    final slug = json['slug'] as String?;
    final version = json['version'] as String?;
    if (id == null || id.isEmpty || slug == null || slug.isEmpty || version == null) {
      throw GameManifestException('Manifest missing required id, slug, or version');
    }

    final metadata = (json['metadata'] as Map<String, dynamic>?) ?? const {};
    final features = (json['features'] as Map<String, dynamic>?) ?? const {};
    final content = (json['content'] as Map<String, dynamic>?) ?? const {};
    final web = (json['web'] as Map<String, dynamic>?) ?? const {};
    final distribution = (json['distribution'] as Map<String, dynamic>?) ?? const {};

    final webAds = features['webAds'] == true;
    if (webAds) {
      throw GameManifestException('Manifest violates policy: features.webAds must be false');
    }

    if (distribution['allowWebPlay'] == false) {
      throw GameManifestException('Manifest violates policy: distribution.allowWebPlay must be true');
    }

    return GameManifest(
      schemaVersion: schemaVersion!,
      id: id,
      slug: slug,
      version: version,
      title: (metadata['title'] as String?) ?? id,
      shortDescription: (metadata['shortDescription'] as String?) ?? '',
      description: (metadata['description'] as String?) ?? '',
      categories: ((metadata['categories'] as List?) ?? const [])
          .map((e) => e.toString())
          .toList(),
      webAds: false,
      nativeAds: features['nativeAds'] == true,
      offlineFirst: content['offlineFirst'] != false,
      syncEnabled: content['syncEnabled'] == true,
      syncIntervalHours: (content['syncIntervalHours'] as num?)?.toInt() ?? 24,
      hubBridgeEnabled: web['hubBridgeEnabled'] != false && features['hubBridge'] != false,
      bundledContentAsset: content['bundledContentAsset'] as String?,
      bundledContentVersion: content['bundledContentVersion'] as String?,
      remoteMetadataPath: content['remoteMetadataPath'] as String?,
      raw: json,
    );
  }
}
