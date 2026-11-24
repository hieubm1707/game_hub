import 'game_content_pack.dart';

class ContentValidationResult {
  const ContentValidationResult({
    required this.isValid,
    this.errors = const <String>[],
  });

  final bool isValid;
  final List<String> errors;
}

class ContentValidator {
  const ContentValidator({
    this.supportedSchemaVersions = const <String>{'1.0.0'},
    this.expectedGameId,
  });

  final Set<String> supportedSchemaVersions;
  final String? expectedGameId;

  ContentValidationResult validate(GameContentPack pack) {
    final errors = <String>[];
    if (pack.id.isEmpty) errors.add('Content pack id is empty');
    if (pack.gameId.isEmpty) errors.add('Content pack gameId is empty');
    if (expectedGameId != null && pack.gameId != expectedGameId) {
      errors.add('Content pack gameId mismatch: ${pack.gameId} != $expectedGameId');
    }
    if (!supportedSchemaVersions.contains(pack.schemaVersion)) {
      errors.add('Unsupported schemaVersion: ${pack.schemaVersion}');
    }
    if (pack.items.isEmpty) {
      errors.add('Content pack items cannot be empty');
    }
    return ContentValidationResult(isValid: errors.isEmpty, errors: errors);
  }
}
