import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredPaths = [
  'apps/hub/package.json',
  'packages/game_contract/schemas/game-manifest.schema.json',
  'packages/game_platform/pubspec.yaml',
  'packages/game_cli/package.json',
  'firebase/firestore.rules',
  'firebase/firestore.indexes.json',
  'firebase/firebase.json',
  'registry/manifests/iq-puzzle-fixture.manifest.json',
  'registry/manifests/memory-match-fixture.manifest.json',
  'AGENTS.md',
  'README.md',
];

const missing = requiredPaths.filter((p) => !fs.existsSync(path.join(root, p)));
if (missing.length > 0) {
  console.error('Missing required workspace files:', missing);
  process.exit(1);
}
console.log('Workspace structure validation PASSED.');
