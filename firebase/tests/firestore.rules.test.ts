import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  runTransaction,
} from 'firebase/firestore';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

const PROJECT_ID = 'demo-game-hub';
const RULES_PATH = resolve(import.meta.dirname, '../firestore.rules');

let testEnv: RulesTestEnvironment;

function makeGameDoc(overrides: Record<string, unknown> = {}) {
  return {
    id: 'iq-puzzle',
    slug: 'iq-puzzle',
    title: 'IQ Puzzle',
    shortDescription: 'Brain training puzzle',
    status: 'draft',
    revision: 1,
    categories: ['puzzle'],
    features: {
      localStorage: true,
      firebaseContentSync: true,
      nativeAds: true,
      webAds: false,
      playerAuthentication: false,
      hubBridge: true,
    },
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('Firestore Security Rules', () => {
  beforeAll(async () => {
    const hostPort = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
    const [host, portStr] = hostPort.split(':');
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        host,
        port: Number(portStr),
        rules: readFileSync(RULES_PATH, 'utf8'),
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await setDoc(doc(db, 'admins', 'owner-1'), { role: 'owner', enabled: true });
      await setDoc(doc(db, 'admins', 'editor-1'), { role: 'editor', enabled: true });
      await setDoc(doc(db, 'admins', 'disabled-admin'), { role: 'owner', enabled: false });

      await setDoc(doc(db, 'public_catalog', 'current'), {
        schemaVersion: '1.0.0',
        catalogVersion: 1,
        games: [{ id: 'iq-puzzle', slug: 'iq-puzzle', title: 'IQ Puzzle' }],
      });

      await setDoc(doc(db, 'public_games', 'iq-puzzle'), {
        ...makeGameDoc({ status: 'published' }),
      });

      await setDoc(doc(db, 'games', 'draft-game'), makeGameDoc({ id: 'draft-game', slug: 'draft-game', status: 'draft' }));

      await setDoc(doc(db, 'content_metadata', 'iq-puzzle'), {
        gameId: 'iq-puzzle',
        contentVersion: '1.0.0',
        schemaVersion: '1.0.0',
        packIds: ['pack-1'],
        published: true,
      });

      await setDoc(doc(db, 'game_content', 'pack-1'), {
        id: 'pack-1',
        gameId: 'iq-puzzle',
        contentVersion: '1.0.0',
        published: true,
        items: [],
      });
    });
  });

  it('allows anonymous public reads of public_catalog, published public_games, and published content', async () => {
    const anonDb = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(getDoc(doc(anonDb, 'public_catalog', 'current')));
    await assertSucceeds(getDoc(doc(anonDb, 'public_games', 'iq-puzzle')));
    await assertSucceeds(getDoc(doc(anonDb, 'content_metadata', 'iq-puzzle')));
    await assertSucceeds(getDoc(doc(anonDb, 'game_content', 'pack-1')));
  });

  it('blocks anonymous reads of canonical games (including drafts) and admin records', async () => {
    const anonDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(anonDb, 'games', 'draft-game')));
    await assertFails(getDoc(doc(anonDb, 'admins', 'owner-1')));
    await assertFails(getDoc(doc(anonDb, 'admin_audit', 'op-1')));
  });

  it('rejects all anonymous and non-admin authenticated writes', async () => {
    const anonDb = testEnv.unauthenticatedContext().firestore();
    const userDb = testEnv.authenticatedContext('regular-user').firestore();

    await assertFails(setDoc(doc(anonDb, 'games', 'hacked'), makeGameDoc({ id: 'hacked', slug: 'hacked' })));
    await assertFails(setDoc(doc(userDb, 'games', 'hacked'), makeGameDoc({ id: 'hacked', slug: 'hacked' })));
    await assertFails(
      setDoc(doc(userDb, 'public_catalog', 'current'), { schemaVersion: '1.0.0', catalogVersion: 99, games: [] })
    );
  });

  it('prevents admin self-escalation and blocks disabled admins', async () => {
    const userDb = testEnv.authenticatedContext('attacker').firestore();
    const disabledDb = testEnv.authenticatedContext('disabled-admin').firestore();
    const ownerDb = testEnv.authenticatedContext('owner-1').firestore();

    await assertFails(setDoc(doc(userDb, 'admins', 'attacker'), { role: 'owner', enabled: true }));
    await assertFails(setDoc(doc(ownerDb, 'admins', 'new-admin'), { role: 'editor', enabled: true }));
    await assertFails(setDoc(doc(disabledDb, 'games', 'new-game'), makeGameDoc({ id: 'new-game', slug: 'new-game' })));
  });

  it('allows authorized admins to create/update games and rejects webAds=true or immutable field changes', async () => {
    const editorDb = testEnv.authenticatedContext('editor-1').firestore();

    // Valid create
    await assertSucceeds(
      setDoc(doc(editorDb, 'games', 'memory-match'), makeGameDoc({ id: 'memory-match', slug: 'memory-match' }))
    );

    // Reject webAds = true
    await assertFails(
      setDoc(
        doc(editorDb, 'games', 'bad-ads'),
        makeGameDoc({
          id: 'bad-ads',
          slug: 'bad-ads',
          features: { webAds: true, nativeAds: true },
        })
      )
    );

    // Valid update with revision + 1
    await assertSucceeds(
      updateDoc(doc(editorDb, 'games', 'memory-match'), {
        title: 'Memory Match Updated',
        revision: 2,
        updatedAt: '2026-01-02T00:00:00.000Z',
      })
    );

    // Reject update without revision increment
    await assertFails(
      updateDoc(doc(editorDb, 'games', 'memory-match'), {
        title: 'Stale Revision',
        revision: 2,
      })
    );

    // Editor cannot permanently delete canonical game; owner can
    await assertFails(deleteDoc(doc(editorDb, 'games', 'memory-match')));
    const ownerDb = testEnv.authenticatedContext('owner-1').firestore();
    await assertSucceeds(deleteDoc(doc(ownerDb, 'games', 'memory-match')));
  });

  it('enforces immutable game_content packs and append-only admin_audit', async () => {
    const editorDb = testEnv.authenticatedContext('editor-1').firestore();

    // Immutable content pack update fails
    await assertFails(updateDoc(doc(editorDb, 'game_content', 'pack-1'), { items: ['tampered'] }));

    // Append-only audit log
    await assertSucceeds(
      setDoc(doc(editorDb, 'admin_audit', 'op-1'), {
        actorUid: 'editor-1',
        action: 'publish_game',
        targetId: 'iq-puzzle',
        timestamp: '2026-01-01T00:00:00.000Z',
      })
    );
    await assertFails(updateDoc(doc(editorDb, 'admin_audit', 'op-1'), { action: 'tampered' }));
    await assertFails(deleteDoc(doc(editorDb, 'admin_audit', 'op-1')));
  });

  it('denies unknown collections by default', async () => {
    const ownerDb = testEnv.authenticatedContext('owner-1').firestore();
    await assertFails(setDoc(doc(ownerDb, 'unknown_collection', 'doc-1'), { foo: 'bar' }));
    await assertFails(getDoc(doc(ownerDb, 'unknown_collection', 'doc-1')));
  });

  it('supports atomic transactional publish updating games, slug_reservations, public_games, and public_catalog', async () => {
    const editorDb = testEnv.authenticatedContext('editor-1').firestore();

    await assertSucceeds(
      runTransaction(editorDb, async (tx) => {
        const catalogRef = doc(editorDb, 'public_catalog', 'current');
        const catalogSnap = await tx.get(catalogRef);
        const currentVersion = (catalogSnap.data()?.catalogVersion as number) ?? 0;

        const newGame = makeGameDoc({
          id: 'word-craft',
          slug: 'word-craft',
          title: 'Word Craft',
          status: 'published',
        });

        tx.set(doc(editorDb, 'games', 'word-craft'), newGame);
        tx.set(doc(editorDb, 'slug_reservations', 'word-craft'), { gameId: 'word-craft' });
        tx.set(doc(editorDb, 'public_games', 'word-craft'), newGame);
        tx.set(catalogRef, {
          schemaVersion: '1.0.0',
          catalogVersion: currentVersion + 1,
          games: [
            ...((catalogSnap.data()?.games as unknown[]) ?? []),
            { id: 'word-craft', slug: 'word-craft', title: 'Word Craft' },
          ],
        });
      })
    );

    const anonDb = testEnv.unauthenticatedContext().firestore();
    const publishedSnap = await getDoc(doc(anonDb, 'public_games', 'word-craft'));
    expect(publishedSnap.exists()).toBe(true);
    expect(publishedSnap.data()?.title).toBe('Word Craft');
  });

  it('rejects unsafe javascript: or non-https artifactUrl and storeUrl even for admins', async () => {
    const editorDb = testEnv.authenticatedContext('editor-1').firestore();

    await assertFails(
      setDoc(
        doc(editorDb, 'games', 'evil-artifact'),
        makeGameDoc({
          id: 'evil-artifact',
          slug: 'evil-artifact',
          web: { artifactUrl: 'javascript:alert(1)' },
        })
      )
    );

    await assertFails(
      setDoc(
        doc(editorDb, 'games', 'evil-store'),
        makeGameDoc({
          id: 'evil-store',
          slug: 'evil-store',
          mobile: {
            android: { storeUrl: 'javascript:alert(1)' },
            ios: { storeUrl: null },
          },
        })
      )
    );

    await assertFails(
      setDoc(doc(editorDb, 'game_releases', 'iq-puzzle-1.0.1'), {
        id: 'iq-puzzle-1.0.1',
        gameId: 'iq-puzzle',
        version: '1.0.1',
        artifactUrl: 'http://evil.example.com/index.html',
        published: true,
      })
    );
  });
});
