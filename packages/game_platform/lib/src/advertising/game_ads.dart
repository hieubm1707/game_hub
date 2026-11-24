enum AdOutcome {
  shown,
  rewarded,
  dismissed,
  unavailable,
  offline,
  failed,
}

class AdResult {
  const AdResult({
    required this.outcome,
    this.rewardEarned = false,
    this.reason,
  });

  final AdOutcome outcome;
  final bool rewardEarned;
  final String? reason;

  static const AdResult unavailable = AdResult(
    outcome: AdOutcome.unavailable,
    rewardEarned: false,
    reason: 'Advertising is unavailable on this platform.',
  );

  static const AdResult offline = AdResult(
    outcome: AdOutcome.offline,
    rewardEarned: false,
    reason: 'Advertising skipped because device is offline.',
  );
}

/// Optional delegate injected by native Android/iOS games to preserve their
/// existing AdMob integration without leaking AdMob imports into Web builds.
abstract class NativeAdsDelegate {
  Future<void> initialize();
  Future<AdResult> showInterstitial();
  Future<AdResult> showRewarded();
}

abstract class GameAds {
  bool get isAvailable;
  Future<void> initialize();
  Future<AdResult> showInterstitial();
  Future<AdResult> showRewarded();
}
