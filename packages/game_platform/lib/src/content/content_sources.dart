import 'dart:convert';
import 'package:flutter/services.dart';

import '../storage/game_storage.dart';
import 'game_content_pack.dart';
import 'game_content_version.dart';

abstract class BundledContentSource {
  Future<GameContentPack> loadBundled();
}

class AssetBundledContentSource implements BundledContentSource {
  AssetBundledContentSource({
    required this.assetPath,
    AssetBundle? assetBundle,
  }) : _assetBundle = assetBundle ?? rootBundle;

  final String assetPath;
  final AssetBundle _assetBundle;

  @override
  Future<GameContentPack> loadBundled() async {
    final raw = await _assetBundle.loadString(assetPath);
    final decoded = jsonDecode(raw) as Map<String, dynamic>;
    return GameContentPack.fromJson(decoded, sourceOverride: 'bundled');
  }
}

abstract class LocalContentSource {
  Future<GameContentPack?> loadActive();
  Future<String?> getActiveVersion();
  Future<void> stagePack(GameContentPack pack);
  Future<bool> activateStagedPack();
}

class StorageLocalContentSource implements LocalContentSource {
  StorageLocalContentSource(this._storage);

  final GameStorage _storage;

  static const _activeKey = 'content:active';
  static const _stagedKey = 'content:staged';
  static const _versionKey = 'content:active_version';

  @override
  Future<GameContentPack?> loadActive() async {
    final json = await _storage.getJson(_activeKey);
    if (json == null) return null;
    return GameContentPack.fromJson(json, sourceOverride: 'local');
  }

  @override
  Future<String?> getActiveVersion() => _storage.getString(_versionKey);

  @override
  Future<void> stagePack(GameContentPack pack) async {
    await _storage.setJson(_stagedKey, pack.toJson());
  }

  @override
  Future<bool> activateStagedPack() async {
    final staged = await _storage.getJson(_stagedKey);
    if (staged == null) return false;
    final pack = GameContentPack.fromJson(staged, sourceOverride: 'local');
    await _storage.setJson(_activeKey, pack.toJson());
    await _storage.setString(_versionKey, pack.contentVersion);
    await _storage.remove(_stagedKey);
    return true;
  }
}

enum RemoteContentErrorCode {
  offline,
  timeout,
  permissionDenied,
  quotaExhausted,
  invalidContent,
  unknown,
}

class RemoteContentException implements Exception {
  const RemoteContentException(this.code, this.message);
  final RemoteContentErrorCode code;
  final String message;

  @override
  String toString() => 'RemoteContentException($code): $message';
}

abstract class RemoteContentSource {
  Future<GameContentVersion?> fetchLatestVersion(String gameId);
  Future<GameContentPack> fetchPack(String packId);
}
