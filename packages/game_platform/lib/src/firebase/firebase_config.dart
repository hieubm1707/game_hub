class FirebaseContentConfig {
  const FirebaseContentConfig({
    required this.projectId,
    this.metadataCollection = 'content_metadata',
    this.contentCollection = 'game_content',
    this.emulatorHost,
  });

  final String projectId;
  final String metadataCollection;
  final String contentCollection;
  final String? emulatorHost;
}
