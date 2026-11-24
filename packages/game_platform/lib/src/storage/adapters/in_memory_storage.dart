import '../game_storage.dart';

class InMemoryGameStorage extends GameStorage {
  final Map<String, String> _store = <String, String>{};

  @override
  Future<String?> getString(String key) async => _store[key];

  @override
  Future<void> setString(String key, String value) async {
    _store[key] = value;
  }

  @override
  Future<void> remove(String key) async {
    _store.remove(key);
  }

  @override
  Future<void> clear() async {
    _store.clear();
  }

  Map<String, String> snapshot() => Map<String, String>.unmodifiable(_store);
}
