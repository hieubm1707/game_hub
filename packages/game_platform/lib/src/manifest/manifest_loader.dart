import 'dart:convert';
import 'package:flutter/services.dart';

import 'game_manifest.dart';

class ManifestLoader {
  ManifestLoader({AssetBundle? assetBundle})
      : _assetBundle = assetBundle ?? rootBundle;

  final AssetBundle _assetBundle;

  Future<GameManifest> loadFromAsset(String assetPath) async {
    final content = await _assetBundle.loadString(assetPath);
    return parseJson(content);
  }

  GameManifest parseJson(String rawJson) {
    final decoded = jsonDecode(rawJson);
    if (decoded is! Map<String, dynamic>) {
      throw GameManifestException('Manifest JSON root must be an object');
    }
    return GameManifest.fromJson(decoded);
  }
}
