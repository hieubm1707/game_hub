import '../content/content_sources.dart';
import '../content/game_content_pack.dart';
import '../content/game_content_version.dart';
import 'firebase_config.dart';

typedef FirestoreDocReader = Future<Map<String, dynamic>?> Function(
  String collection,
  String docId,
);

/// Adapter bridging Firestore document reads into [RemoteContentSource].
/// Keeps `game_platform` decoupled from a specific FlutterFire version so
/// offline-only games don't pay Firebase SDK bundle weight.
class FirebaseContentSource implements RemoteContentSource {
  FirebaseContentSource({
    required this.config,
    required this.readDocument,
  });

  final FirebaseContentConfig config;
  final FirestoreDocReader readDocument;

  @override
  Future<GameContentVersion?> fetchLatestVersion(String gameId) async {
    final doc = await readDocument(config.metadataCollection, gameId);
    if (doc == null) return null;
    if (doc['published'] == false) return null;
    return GameContentVersion.fromJson(doc);
  }

  @override
  Future<GameContentPack> fetchPack(String packId) async {
    final doc = await readDocument(config.contentCollection, packId);
    if (doc == null) {
      throw const RemoteContentException(
        RemoteContentErrorCode.invalidContent,
        'Content pack document not found.',
      );
    }
    return GameContentPack.fromJson(doc, sourceOverride: 'remote');
  }
}
