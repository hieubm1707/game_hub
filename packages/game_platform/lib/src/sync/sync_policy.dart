class SyncPolicy {
  const SyncPolicy({
    this.enabled = true,
    this.blockingStartup = false,
    this.versionCheckIntervalHours = 24,
    this.networkTimeoutSeconds = 8,
    this.maxBackoffMinutes = 60,
    this.preserveLastKnownGoodContent = true,
    this.fallbackToBundledContent = true,
  });

  final bool enabled;
  final bool blockingStartup;
  final int versionCheckIntervalHours;
  final int networkTimeoutSeconds;
  final int maxBackoffMinutes;
  final bool preserveLastKnownGoodContent;
  final bool fallbackToBundledContent;
}
