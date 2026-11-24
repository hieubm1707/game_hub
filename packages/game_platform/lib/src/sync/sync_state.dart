import 'sync_result.dart';

class SyncState {
  const SyncState({
    this.isSyncing = false,
    this.lastCheckedAt,
    this.consecutiveFailures = 0,
    this.lastResult,
  });

  final bool isSyncing;
  final DateTime? lastCheckedAt;
  final int consecutiveFailures;
  final ContentSyncResult? lastResult;
}
