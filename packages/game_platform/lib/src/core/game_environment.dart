enum GameEnvironment {
  android,
  ios,
  webStandalone,
  webEmbedded,
  unsupported,
}

extension GameEnvironmentX on GameEnvironment {
  bool get isWeb =>
      this == GameEnvironment.webStandalone ||
      this == GameEnvironment.webEmbedded;

  bool get isMobileNative =>
      this == GameEnvironment.android || this == GameEnvironment.ios;
}
