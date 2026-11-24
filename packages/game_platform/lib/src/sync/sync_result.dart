enum SyncStatus {
  idle,
  skipped,
  upToDate,
  staged,
  activated,
  quotaExhausted,
  failed,
}

class ContentSyncResult {
  const ContentSyncResult({
    required this.status,
    this.version,
    this.reason,
  });

  final SyncStatus status;
  final String? version;
  final String? reason;
}
