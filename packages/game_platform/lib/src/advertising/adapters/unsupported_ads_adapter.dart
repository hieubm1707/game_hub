import '../game_ads.dart';

class UnsupportedAdsAdapter implements GameAds {
  const UnsupportedAdsAdapter();

  @override
  bool get isAvailable => false;

  @override
  Future<void> initialize() async {}

  @override
  Future<AdResult> showInterstitial() async => AdResult.unavailable;

  @override
  Future<AdResult> showRewarded() async => AdResult.unavailable;
}
