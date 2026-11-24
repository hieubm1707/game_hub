import '../game_ads.dart';

/// Strict Web adapter:
/// - Never initializes AdMob or any advertising SDK.
/// - Never issues network requests.
/// - Never reports a rewarded ad as completed.
class WebAdsUnavailableAdapter implements GameAds {
  const WebAdsUnavailableAdapter();

  @override
  bool get isAvailable => false;

  @override
  Future<void> initialize() async {
    // Intentionally a no-op on Web.
  }

  @override
  Future<AdResult> showInterstitial() async => AdResult.unavailable;

  @override
  Future<AdResult> showRewarded() async => AdResult.unavailable;
}
