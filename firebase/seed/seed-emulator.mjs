/**
 * Seeds the local Firebase Emulator Suite (Auth + Firestore) with:
 * - An owner admin account (admin@gamehub.local / Admin123456!)
 * - An editor admin account (editor@gamehub.local / Editor123456!)
 * - Default categories
 * - Two explicitly labeled Flutter test fixture games
 * - Compact public_catalog/current projection
 * - Sample immutable game_content pack + content_metadata
 *
 * Usage:
 *   1. Start emulators: pnpm emulators:start
 *   2. Run seed:        pnpm emulators:seed
 *
 * NEVER run this script against production Firebase projects.
 */

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'demo-game-hub';
const AUTH_EMULATOR = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
const FIRESTORE_EMULATOR = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8088';

async function createEmulatorUser(email, password, displayName) {
  const url = `http://${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, displayName, returnSecureToken: true }),
  });
  const data = await res.json();
  if (!res.ok) {
    if (data?.error?.message === 'EMAIL_EXISTS') {
      const signInUrl = `http://${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-api-key`;
      const signInRes = await fetch(signInUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      });
      const signInData = await signInRes.json();
      return signInData.localId;
    }
    throw new Error(`Auth emulator error: ${JSON.stringify(data)}`);
  }
  return data.localId;
}

function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (typeof val === 'string') return { stringValue: val };
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

async function writeDoc(collectionPath, docId, data) {
  const url = `http://${FIRESTORE_EMULATOR}/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collectionPath}/${docId}`;
  const fields = {};
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) fields[k] = toFirestoreValue(v);
  }
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer owner',
    },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) {
    throw new Error(`Failed writing ${collectionPath}/${docId}: ${await res.text()}`);
  }
}

async function main() {
  console.log(`Seeding Firebase Emulators (project: ${PROJECT_ID})...`);

  const ownerUid = await createEmulatorUser('admin@gamehub.local', 'Admin123456!', 'Hub Owner');
  const editorUid = await createEmulatorUser('editor@gamehub.local', 'Editor123456!', 'Hub Editor');

  await writeDoc('admins', ownerUid, {
    uid: ownerUid,
    email: 'admin@gamehub.local',
    role: 'owner',
    enabled: true,
    createdAt: new Date().toISOString(),
  });
  await writeDoc('admins', editorUid, {
    uid: editorUid,
    email: 'editor@gamehub.local',
    role: 'editor',
    enabled: true,
    createdAt: new Date().toISOString(),
  });

  const categories = [
    { id: 'puzzle', name: 'Puzzle', description: 'Logic and brain teasers', order: 1, enabled: true },
    { id: 'brain', name: 'Brain Training', description: 'Memory and IQ challenges', order: 2, enabled: true },
    { id: 'casual', name: 'Casual', description: 'Quick offline sessions', order: 3, enabled: true },
  ];
  for (const cat of categories) {
    await writeDoc('categories', cat.id, cat);
  }

  const now = new Date().toISOString();
  const iqGame = {
    id: 'iq-puzzle-fixture',
    slug: 'iq-puzzle-fixture',
    title: 'IQ Puzzle (Test Fixture)',
    shortDescription: 'Reference offline-first Flutter logic puzzle test fixture.',
    description:
      'Explicitly labeled test fixture validating game_platform, bundled offline puzzles, non-blocking Firebase content sync, native-only ad isolation, and the Game Hub postMessage bridge.',
    howToPlay: 'Select the missing number or pattern in each logic puzzle. All progress is saved locally.',
    categories: ['puzzle', 'brain'],
    tags: ['fixture', 'iq', 'offline', 'logic'],
    developer: 'Game Hub Reference Fixture',
    icon: '/fixtures/iq-puzzle-icon.svg',
    thumbnail: '/fixtures/iq-puzzle-thumb.svg',
    screenshots: [],
    featured: true,
    status: 'published',
    revision: 1,
    manifestVersion: '2.0.0',
    currentRelease: '1.0.0',
    web: {
      enabled: true,
      artifactUrl: 'http://127.0.0.1:8090/iq-puzzle-fixture/releases/1.0.0/index.html',
      buildVersion: '1.0.0',
      orientation: 'portrait',
      aspectRatio: { width: 9, height: 16 },
      fullscreen: true,
      supportsTouch: true,
      supportsKeyboard: true,
      hubBridgeEnabled: true,
    },
    mobile: {
      android: {
        enabled: true,
        packageId: 'org.gamehub.fixture.iqpuzzle',
        storeUrl: 'https://play.google.com/store/apps/details?id=org.gamehub.fixture.iqpuzzle',
      },
      ios: {
        enabled: false,
        bundleId: null,
        storeUrl: null,
      },
    },
    distribution: {
      installPromptEnabled: true,
      installPromptCooldownDays: 7,
      allowWebPlay: true,
    },
    features: {
      localStorage: true,
      firebaseContentSync: true,
      nativeAds: true,
      webAds: false,
      playerAuthentication: false,
      hubBridge: true,
    },
    createdAt: now,
    updatedAt: now,
  };

  await writeDoc('games', iqGame.id, iqGame);
  await writeDoc('slug_reservations', iqGame.slug, { gameId: iqGame.id, reservedAt: now });
  await writeDoc('public_games', iqGame.slug, iqGame);
  await writeDoc('game_releases', 'iq-puzzle-fixture-1.0.0', {
    id: 'iq-puzzle-fixture-1.0.0',
    gameId: iqGame.id,
    version: '1.0.0',
    artifactUrl: iqGame.web.artifactUrl,
    published: true,
    notes: 'Initial fixture release',
    createdAt: now,
  });

  await writeDoc('public_catalog', 'current', {
    schemaVersion: '1.0.0',
    catalogVersion: 1,
    updatedAt: now,
    games: [
      {
        id: iqGame.id,
        slug: iqGame.slug,
        title: iqGame.title,
        shortDescription: iqGame.shortDescription,
        thumbnail: iqGame.thumbnail,
        icon: iqGame.icon,
        categories: iqGame.categories,
        tags: iqGame.tags,
        featured: iqGame.featured,
        revision: iqGame.revision,
        updatedAt: now,
      },
    ],
  });

  await writeDoc('hub_settings', 'public', {
    hubName: 'Game Hub',
    tagline: 'Free, ad-free offline-first Flutter games in your browser',
    defaultLocale: 'en',
    supportedLocales: ['en', 'vi'],
    catalogCacheTtlMinutes: 60,
    updatedAt: now,
  });

  await writeDoc('content_metadata', iqGame.id, {
    gameId: iqGame.id,
    contentVersion: '1.1.0',
    schemaVersion: '1.0.0',
    minimumGameVersion: '1.0.0',
    packIds: ['iq-puzzle-fixture-1.1.0-pack-01'],
    published: true,
    updatedAt: now,
  });

  await writeDoc('game_content', 'iq-puzzle-fixture-1.1.0-pack-01', {
    id: 'iq-puzzle-fixture-1.1.0-pack-01',
    gameId: iqGame.id,
    contentVersion: '1.1.0',
    schemaVersion: '1.0.0',
    published: true,
    items: [
      {
        id: 'remote-q1',
        prompt: 'What comes next: 2, 6, 12, 20, 30, ?',
        options: ['38', '40', '42', '44'],
        answerIndex: 2,
      },
      {
        id: 'remote-q2',
        prompt: 'If 3 cats catch 3 mice in 3 minutes, how many minutes for 1 cat to catch 1 mouse?',
        options: ['1', '3', '6', '9'],
        answerIndex: 1,
      },
    ],
    createdAt: now,
  });

  console.log('Seed complete!');
  console.log(`Owner Admin:  admin@gamehub.local / Admin123456! (uid: ${ownerUid})`);
  console.log(`Editor Admin: editor@gamehub.local / Editor123456! (uid: ${editorUid})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
