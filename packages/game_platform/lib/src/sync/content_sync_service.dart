import 'dart:async';
import 'dart:math';

import '../content/game_content_repository.dart';
import '../storage/game_storage.dart';
import 'sync_policy.dart';
import 'sync_result.dart';
import 'sync_state.dart';

class ContentSyncService {
  ContentSyncService({
    required this.repository,
    required this.storage,
    this.policy = const SyncPolicy(),
    DateTime Function()? clock,
  }) : _clock = clock ?? DateTime.now;

  final GameContentRepository repository;
  final GameStorage storage;
  final SyncPolicy policy;
  final DateTime Function() _clock;

  static const _lastCheckKey = 'sync:last_check_ms';
  static const _failureCountKey = 'sync:failures';
  static const _nextAllowedKey = 'sync:next_allowed_ms';

  Future<ContentSyncResult>? _inFlight;
  SyncState _state = const SyncState();

  SyncState get state => _state;

  Future<bool> isSyncEligible() async {
    if (!policy.enabled) return false;
    final nowMs = _clock().millisecondsSinceEpoch;

    final nextAllowedRaw = await storage.getString(_nextAllowedKey);
    if (nextAllowedRaw != null) {
      final nextAllowed = int.tryParse(nextAllowedRaw) ?? 0;
      if (nowMs < nextAllowed) return false;
    }

    final lastCheckRaw = await storage.getString(_lastCheckKey);
    if (lastCheckRaw == null) return true;
    final lastCheck = int.tryParse(lastCheckRaw) ?? 0;
    final intervalMs = policy.versionCheckIntervalHours * 3600 * 1000;
    return (nowMs - lastCheck) >= intervalMs;
  }

  /// Non-blocking, deduplicated synchronization with timeout & exponential backoff.
  Future<ContentSyncResult> synchronizeIfEligible({bool force = false}) {
    if (_inFlight != null) return _inFlight!;
    final future = _runSync(force: force);
    _inFlight = future;
    future.whenComplete(() {
      if (identical(_inFlight, future)) {
        _inFlight = null;
      }
    });
    return future;
  }

  Future<ContentSyncResult> _runSync({required bool force}) async {
    if (!force && !await isSyncEligible()) {
      const skipped = ContentSyncResult(
        status: SyncStatus.skipped,
        reason: 'Sync interval or backoff window not elapsed.',
      );
      _state = SyncState(
        isSyncing: false,
        lastCheckedAt: _state.lastCheckedAt,
        consecutiveFailures: _state.consecutiveFailures,
        lastResult: skipped,
      );
      return skipped;
    }

    _state = SyncState(
      isSyncing: true,
      lastCheckedAt: _state.lastCheckedAt,
      consecutiveFailures: _state.consecutiveFailures,
      lastResult: _state.lastResult,
    );

    final now = _clock();
    ContentSyncResult result;
    try {
      result = await repository
          .synchronize(force: force)
          .timeout(Duration(seconds: policy.networkTimeoutSeconds));
    } on TimeoutException {
      result = const ContentSyncResult(
        status: SyncStatus.failed,
        reason: 'Content sync timed out.',
      );
    }

    if (result.status == SyncStatus.upToDate ||
        result.status == SyncStatus.staged ||
        result.status == SyncStatus.activated) {
      await storage.setString(_lastCheckKey, now.millisecondsSinceEpoch.toString());
      await storage.setString(_failureCountKey, '0');
      await storage.remove(_nextAllowedKey);
      _state = SyncState(
        isSyncing: false,
        lastCheckedAt: now,
        consecutiveFailures: 0,
        lastResult: result,
      );
    } else if (result.status == SyncStatus.failed ||
        result.status == SyncStatus.quotaExhausted) {
      final prevFailures =
          int.tryParse((await storage.getString(_failureCountKey)) ?? '0') ?? 0;
      final failures = prevFailures + 1;
      final backoffMinutes = min(
        policy.maxBackoffMinutes,
        pow(2, min(failures, 6)).toInt(),
      );
      final nextAllowed = now.add(Duration(minutes: backoffMinutes));
      await storage.setString(_failureCountKey, failures.toString());
      await storage.setString(
        _nextAllowedKey,
        nextAllowed.millisecondsSinceEpoch.toString(),
      );
      _state = SyncState(
        isSyncing: false,
        lastCheckedAt: now,
        consecutiveFailures: failures,
        lastResult: result,
      );
    } else {
      _state = SyncState(
        isSyncing: false,
        lastCheckedAt: now,
        consecutiveFailures: _state.consecutiveFailures,
        lastResult: result,
      );
    }

    return result;
  }
}
