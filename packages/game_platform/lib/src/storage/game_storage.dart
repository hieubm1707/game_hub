import 'dart:convert';

abstract class GameStorage {
  Future<String?> getString(String key);
  Future<void> setString(String key, String value);
  Future<void> remove(String key);
  Future<void> clear();

  Future<Map<String, dynamic>?> getJson(String key) async {
    final raw = await getString(key);
    if (raw == null || raw.isEmpty) return null;
    try {
      final decoded = jsonDecode(raw);
      return decoded is Map<String, dynamic> ? decoded : null;
    } catch (_) {
      return null;
    }
  }

  Future<void> setJson(String key, Map<String, dynamic> value) {
    return setString(key, jsonEncode(value));
  }
}

/// Wraps any [GameStorage] with a stable, per-game namespace so multiple games
/// sharing an origin or build updates never collide.
class NamespacedGameStorage extends GameStorage {
  NamespacedGameStorage({
    required GameStorage delegate,
    required this.gameId,
  }) : _delegate = delegate;

  final GameStorage _delegate;
  final String gameId;

  String get prefix => 'game_hub:$gameId:';
  String _k(String key) => '$prefix$key';

  @override
  Future<String?> getString(String key) => _delegate.getString(_k(key));

  @override
  Future<void> setString(String key, String value) =>
      _delegate.setString(_k(key), value);

  @override
  Future<void> remove(String key) => _delegate.remove(_k(key));

  @override
  Future<void> clear() => _delegate.clear();
}
