import 'package:web/web.dart' as web;
import '../../storage/game_storage.dart';

class WebLocalStorageAdapter extends GameStorage {
  @override
  Future<String?> getString(String key) async {
    try {
      return web.window.localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  @override
  Future<void> setString(String key, String value) async {
    try {
      web.window.localStorage.setItem(key, value);
    } catch (_) {
      // Ignore quota or private-browsing storage errors gracefully.
    }
  }

  @override
  Future<void> remove(String key) async {
    try {
      web.window.localStorage.removeItem(key);
    } catch (_) {}
  }

  @override
  Future<void> clear() async {
    // Do not wipe unrelated origin keys; callers should remove namespaced keys.
  }
}

GameStorage createPlatformStorageImpl() => WebLocalStorageAdapter();
