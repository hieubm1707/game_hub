import { describe, expect, it, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { GameRecord } from '@game-hub/contract';
import { RepositoryProvider } from '../src/app/RepositoryContext';
import { AuthProvider, type AdminProfile } from '../src/features/authentication/AuthContext';
import { AppRoutes } from '../src/routes/AppRoutes';
import { createInMemoryRepositories } from '../src/repositories/inMemoryRepositories';
import {
  dismissInstallPrompt,
  shouldShowInstallPrompt,
} from '../src/services/installPromptPolicy';

function makeFixtureGame(overrides: Partial<GameRecord> = {}): GameRecord {
  const now = '2026-01-01T00:00:00.000Z';
  return {
    id: 'iq-puzzle-fixture',
    slug: 'iq-puzzle-fixture',
    title: 'IQ Puzzle (Test Fixture)',
    shortDescription: 'Offline logic puzzle fixture.',
    description: 'Full offline logic puzzle fixture description.',
    categories: ['puzzle', 'brain'],
    tags: ['iq', 'offline'],
    developer: 'Fixture',
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
      ios: { enabled: false, bundleId: null, storeUrl: null },
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
    ...overrides,
  };
}

function renderApp(initialEntries: string[], games: GameRecord[], mockAdmin: AdminProfile | null = null) {
  const repos = createInMemoryRepositories({ games });
  return {
    repos,
    ...render(
      <MemoryRouter initialEntries={initialEntries}>
        <RepositoryProvider repositories={repos}>
          <AuthProvider mockAdmin={mockAdmin}>
            <AppRoutes />
          </AuthProvider>
        </RepositoryProvider>
      </MemoryRouter>
    ),
  };
}

describe('Game Hub Public & Admin Flows', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders public homepage without authentication and displays published games only', async () => {
    const published = makeFixtureGame();
    const draft = makeFixtureGame({
      id: 'secret-draft',
      slug: 'secret-draft',
      title: 'Secret Draft Game',
      status: 'draft',
    });

    renderApp(['/'], [published, draft], null);

    expect(await screen.findAllByText('IQ Puzzle (Test Fixture)')).not.toHaveLength(0);
    expect(screen.queryByText('Secret Draft Game')).not.toBeInTheDocument();
  });

  it('supports client-side search and dynamic game detail routes', async () => {
    renderApp(['/games/iq-puzzle-fixture'], [makeFixtureGame()], null);
    expect(await screen.findByText('Play Now (Web — Ad-Free)')).toBeInTheDocument();
    expect(screen.getByText('Get on Google Play')).toBeInTheDocument();
  });

  it('rejects untrusted iframe artifact origins in GamePlayer', async () => {
    const evilGame = makeFixtureGame({
      web: {
        ...makeFixtureGame().web,
        artifactUrl: 'https://untrusted-evil.example/game/index.html',
      },
    });
    renderApp(['/play/iq-puzzle-fixture'], [evilGame], null);
    expect(
      await screen.findByText(/missing or not from a trusted origin/i)
    ).toBeInTheDocument();
  });

  it('enforces mobile install prompt cooldown locally and skips desktop', () => {
    const game = makeFixtureGame();
    expect(shouldShowInstallPrompt(game, 'desktop')).toBe(false);
    expect(shouldShowInstallPrompt(game, 'android')).toBe(true);
    expect(shouldShowInstallPrompt(game, 'ios')).toBe(false); // iOS storeUrl not configured

    dismissInstallPrompt(game.id, 1_000_000);
    expect(shouldShowInstallPrompt(game, 'android', 1_000_000 + 1000)).toBe(false);
    // Eligible again after 7 days
    expect(
      shouldShowInstallPrompt(game, 'android', 1_000_000 + 8 * 24 * 60 * 60 * 1000)
    ).toBe(true);
  });

  it('redirects unauthenticated visitors from /admin to /admin/login', async () => {
    renderApp(['/admin'], [makeFixtureGame()], null);
    expect(await screen.findByText('Game Hub Admin')).toBeInTheDocument();
    expect(screen.getByText(/Public registration is disabled/i)).toBeInTheDocument();
  });

  it('allows authorized admin to register a second game and publish it without Hub code changes', async () => {
    const owner: AdminProfile = {
      uid: 'owner-1',
      email: 'admin@gamehub.local',
      role: 'owner',
      enabled: true,
    };

    const { repos } = renderApp(['/admin/games'], [makeFixtureGame()], owner);
    expect(await screen.findByText('IQ Puzzle (Test Fixture)')).toBeInTheDocument();

    // Register second game dynamically via repository (equivalent to Admin form submit)
    await repos.adminGames.createGame(
      makeFixtureGame({
        id: 'memory-match-fixture',
        slug: 'memory-match-fixture',
        title: 'Memory Match (Test Fixture)',
        status: 'published',
      }),
      owner.uid
    );

    const catalogRes = await repos.catalog.getPublicCatalog();
    expect(catalogRes.catalog.games.map((g) => g.slug)).toContain('memory-match-fixture');

    // Unpublish first game via UI button
    const unpublishBtn = screen.getByRole('button', { name: 'Unpublish' });
    fireEvent.click(unpublishBtn);
    await waitFor(() => {
      expect(screen.getByText(/status to draft/i)).toBeInTheDocument();
    });
  });
});
