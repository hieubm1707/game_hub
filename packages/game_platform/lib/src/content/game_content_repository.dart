import '../sync/sync_result.dart';
import 'content_sources.dart';
import 'content_validator.dart';
import 'game_content_pack.dart';

abstract class GameContentRepository {
  Future<GameContentPack> loadContent();
  Future<String?> getLocalContentVersion();
  Future<bool> activatePendingContent();
  Future<ContentSyncResult> synchronize({bool force = false});
}

class OfflineFirstContentRepository implements GameContentRepository {
  OfflineFirstContentRepository({
    required this.gameId,
    required this.bundledSource,
    required this.localSource,
    this.remoteSource,
    ContentValidator? validator,
  }) : validator = validator ?? ContentValidator(expectedGameId: gameId);

  final String gameId;
  final BundledContentSource bundledSource;
  final LocalContentSource localSource;
  final RemoteContentSource? remoteSource;
  final ContentValidator validator;

  @override
  Future<GameContentPack> loadContent() async {
    // 1. Load last known valid local content first (never waits on network).
    try {
      final local = await localSource.loadActive();
      if (local != null && validator.validate(local).isValid) {
        return local;
      }
    } catch (_) {
      // Fall back to bundled content if local storage is corrupted/unavailable.
    }

    // 2. Fall back to bundled offline content.
    final bundled = await bundledSource.loadBundled();
    return bundled;
  }

  @override
  Future<String?> getLocalContentVersion() async {
    final localVer = await localSource.getActiveVersion();
    if (localVer != null) return localVer;
    final bundled = await bundledSource.loadBundled();
    return bundled.contentVersion;
  }

  @override
  Future<bool> activatePendingContent() => localSource.activateStagedPack();

  @override
  Future<ContentSyncResult> synchronize({bool force = false}) async {
    if (remoteSource == null) {
      return const ContentSyncResult(
        status: SyncStatus.skipped,
        reason: 'No remote content source configured.',
      );
    }

    try {
      final currentVersion = await getLocalContentVersion();
      final remoteVersion = await remoteSource!.fetchLatestVersion(gameId);
      if (remoteVersion == null) {
        return const ContentSyncResult(
          status: SyncStatus.upToDate,
          reason: 'No remote content metadata published.',
        );
      }
      if (!force && remoteVersion.contentVersion == currentVersion) {
        return ContentSyncResult(
          status: SyncStatus.upToDate,
          version: currentVersion,
          reason: 'Local content is already up to date.',
        );
      }
      if (remoteVersion.packIds.isEmpty) {
        return const ContentSyncResult(
          status: SyncStatus.failed,
          reason: 'Remote version listed no packIds.',
        );
      }

      // Download and merge required packs into a staged version.
      final mergedItems = <Map<String, dynamic>>[];
      for (final packId in remoteVersion.packIds) {
        final pack = await remoteSource!.fetchPack(packId);
        final check = validator.validate(pack);
        if (!check.isValid) {
          return ContentSyncResult(
            status: SyncStatus.failed,
            reason: 'Invalid remote content pack: ${check.errors.join(', ')}',
          );
        }
        mergedItems.addAll(pack.items);
      }

      final stagedPack = GameContentPack(
        id: '${gameId}_${remoteVersion.contentVersion}',
        gameId: gameId,
        contentVersion: remoteVersion.contentVersion,
        schemaVersion: remoteVersion.schemaVersion,
        items: mergedItems,
        source: 'local',
      );

      final mergedCheck = validator.validate(stagedPack);
      if (!mergedCheck.isValid) {
        return ContentSyncResult(
          status: SyncStatus.failed,
          reason: 'Merged content failed validation.',
        );
      }

      await localSource.stagePack(stagedPack);
      return ContentSyncResult(
        status: SyncStatus.staged,
        version: remoteVersion.contentVersion,
        reason: 'New content staged; activate at next safe gameplay boundary.',
      );
    } on RemoteContentException catch (e) {
      return ContentSyncResult(
        status: e.code == RemoteContentErrorCode.quotaExhausted
            ? SyncStatus.quotaExhausted
            : SyncStatus.failed,
        reason: e.message,
      );
    } catch (e) {
      return ContentSyncResult(
        status: SyncStatus.failed,
        reason: e.toString(),
      );
    }
  }
}
