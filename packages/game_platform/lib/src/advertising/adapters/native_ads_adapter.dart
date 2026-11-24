import '../game_ads.dart';

class NativeAdsAdapter implements GameAds {
  NativeAdsAdapter({this.delegate});

  final NativeAdsDelegate? delegate;
  bool _initialized = false;

  @override
  bool get isAvailable => delegate != null;

  @override
  Future<void> initialize() async {
    if (delegate == null || _initialized) return;
    try {
      await delegate!.initialize();
      _initialized = true;
    } catch (_) {
      // Never block offline gameplay when native ad SDK initialization fails.
    }
  }

  @override
  Future<AdResult> showInterstitial() async {
    if (delegate == null) return AdResult.unavailable;
    try {
      return await delegate!.showInterstitial();
    } catch (e) {
      return AdResult(outcome: AdOutcome.failed, reason: e.toString());
    }
  }

  @override
  Future<AdResult> showRewarded() async {
    if (delegate == null) return AdResult.unavailable;
    try {
      return await delegate!.showRewarded();
    } catch (e) {
      return AdResult(outcome: AdOutcome.failed, reason: e.toString());
    }
  }
}
