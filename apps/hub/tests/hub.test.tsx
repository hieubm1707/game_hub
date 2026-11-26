import { describe, expect, it, beforeEach, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
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
    expect(screen.queryByRole('link', { name: /admin/i })).not.toBeInTheDocument();
  });

  it('supports client-side search and dynamic game detail routes with configured store links', async () => {
    renderApp(['/games/iq-puzzle-fixture'], [makeFixtureGame()], null);
    expect(await screen.findByText('Play Now')).toBeInTheDocument();
    expect(screen.getByText('Get on Google Play')).toBeInTheDocument();
    expect(screen.queryByText('Get on App Store')).not.toBeInTheDocument();
  });

  it('switches UI and game metadata localization between EN, VI, and JA', async () => {
    const localizedGame = makeFixtureGame({
      howToPlay: 'Tap tiles to solve the logic puzzle.',
      translations: {
        en: {
          shortDescription: 'Offline logic puzzle fixture.',
          description: 'Full offline logic puzzle fixture description.',
          howToPlay: 'Tap tiles to solve the logic puzzle.',
        },
        vi: {
          shortDescription: 'Trò chơi giải đố logic offline.',
          description: 'Mô tả chi tiết trò chơi giải đố logic offline.',
          howToPlay: 'Chạm vào các ô để giải câu đố logic.',
        },
        ja: {
          shortDescription: 'オフライン対応ロジックパズル。',
          description: 'オフライン対応ロジックパズルの詳細説明。',
          howToPlay: 'タイルをタップしてパズルを解きます。',
        },
      },
    });

    renderApp(['/games/iq-puzzle-fixture'], [localizedGame], null);
    expect(await screen.findByText('Play Now')).toBeInTheDocument();
    expect(screen.getByText('Tap tiles to solve the logic puzzle.')).toBeInTheDocument();

    const langSelect = screen.getByRole('combobox', { name: /select language/i });
    fireEvent.change(langSelect, { target: { value: 'vi' } });
    expect(screen.getByText('Chơi ngay')).toBeInTheDocument();
    expect(screen.getByText('Mô tả chi tiết trò chơi giải đố logic offline.')).toBeInTheDocument();
    expect(screen.getByText('Chạm vào các ô để giải câu đố logic.')).toBeInTheDocument();

    fireEvent.change(langSelect, { target: { value: 'ja' } });
    expect(screen.getByText('今すぐプレイ')).toBeInTheDocument();
    expect(screen.getByText('オフライン対応ロジックパズルの詳細説明。')).toBeInTheDocument();
    expect(screen.getByText('タイルをタップしてパズルを解きます。')).toBeInTheDocument();
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

  it('toggles fullscreen minimize button, applies game backgroundColor, and auto-hides control bar after 3 seconds in fullscreen', async () => {
    const themedGame = makeFixtureGame({
      web: {
        ...makeFixtureGame().web,
        backgroundColor: '#1a2b3c',
      },
    });
    renderApp(['/play/iq-puzzle-fixture'], [themedGame], null);
    const fsBtn = await screen.findByRole('button', { name: 'Fullscreen' });
    const controlBar = screen.getByTestId('game-control-bar');
    const container = controlBar.parentElement as HTMLElement;

    let currentFsEl: Element | null = null;
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => currentFsEl,
    });
    const requestFullscreen = vi.fn().mockImplementation(async () => {
      currentFsEl = container;
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    const exitFullscreen = vi.fn().mockImplementation(async () => {
      currentFsEl = null;
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    container.requestFullscreen = requestFullscreen;
    document.exitFullscreen = exitFullscreen;

    vi.useFakeTimers();
    try {
      fireEvent.click(fsBtn);
      expect(requestFullscreen).toHaveBeenCalledTimes(1);

      // Button switches to Exit fullscreen, backgroundColor is applied, and control bar is initially visible
      const exitFsBtn = screen.getByRole('button', { name: 'Exit fullscreen' });
      expect(container).toHaveStyle({ backgroundColor: 'rgb(26, 43, 60)' });
      expect(controlBar).toHaveAttribute('data-controls-visible', 'true');

      // After 3 seconds, control bar auto-hides
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(controlBar).toHaveAttribute('data-controls-visible', 'false');

      // Moving mouse on container does NOT auto-reveal the control bar
      fireEvent.mouseMove(container);
      expect(controlBar).toHaveAttribute('data-controls-visible', 'false');

      // Clicking the top-right action button explicitly opens the control bar
      const revealBtn = screen.getByRole('button', { name: 'Show controls' });
      fireEvent.click(revealBtn);
      expect(controlBar).toHaveAttribute('data-controls-visible', 'true');

      // Clicking Exit fullscreen restores normal mode
      fireEvent.click(exitFsBtn);
      expect(exitFullscreen).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('button', { name: 'Fullscreen' })).toBeInTheDocument();
      expect(controlBar).toHaveAttribute('data-controls-visible', 'true');
    } finally {
      vi.useRealTimers();
    }
  });

  it('shows install prompt whenever store URLs are configured regardless of device and enforces local cooldown', () => {
    const game = makeFixtureGame();
    const noStoreGame = makeFixtureGame({
      mobile: {
        android: { enabled: false, packageId: null, storeUrl: null },
        ios: { enabled: false, bundleId: null, storeUrl: null },
      },
    });
    expect(shouldShowInstallPrompt(noStoreGame)).toBe(false);
    expect(shouldShowInstallPrompt(game)).toBe(true);

    dismissInstallPrompt(game.id, 1_000_000);
    expect(shouldShowInstallPrompt(game, 1_000_000 + 1000)).toBe(false);
    // Eligible again after 7 days
    expect(
      shouldShowInstallPrompt(game, 1_000_000 + 8 * 24 * 60 * 60 * 1000)
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

  it('prevents stale translations.en from shadowing admin edits and projects compact translations cleanly', async () => {
    const owner: AdminProfile = {
      uid: 'owner-1',
      email: 'admin@gamehub.local',
      role: 'owner',
      enabled: true,
    };
    const gameWithEnTranslation = makeFixtureGame({
      translations: {
        en: {
          shortDescription: 'Stale EN summary from manifest.',
          description: 'Stale EN description from manifest.',
          howToPlay: 'Stale EN how to play.',
        },
        vi: {
          shortDescription: 'Mô tả VI',
          description: 'Chi tiết VI',
        },
      },
    });

    const { repos } = renderApp(
      ['/admin/games/iq-puzzle-fixture/edit'],
      [gameWithEnTranslation],
      owner
    );

    const shortDescInput = await screen.findByDisplayValue('Offline logic puzzle fixture.');
    fireEvent.change(shortDescInput, { target: { value: 'Updated EN summary by admin.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    await waitFor(async () => {
      const saved = await repos.adminGames.getGameById('iq-puzzle-fixture');
      expect(saved?.shortDescription).toBe('Updated EN summary by admin.');
      expect(saved?.translations?.en).toBeUndefined();
      expect(saved?.translations?.vi?.shortDescription).toBe('Mô tả VI');
    });

    const catalog = await repos.catalog.getPublicCatalog();
    expect(catalog.catalog.games[0]?.translations?.vi).toEqual({
      shortDescription: 'Mô tả VI',
    });

    // Re-open edit form and clear remaining VI fields to ensure translations are removed on update
    const updatedStored = await repos.adminGames.getGameById('iq-puzzle-fixture');
    const { repos: repos2 } = renderApp(
      ['/admin/games/iq-puzzle-fixture/edit'],
      updatedStored ? [updatedStored] : [],
      owner
    );
    const viShortInput = await screen.findByDisplayValue('Mô tả VI');
    fireEvent.change(viShortInput, { target: { value: '' } });
    fireEvent.change(screen.getByDisplayValue('Chi tiết VI'), { target: { value: '' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Save Changes' }).at(-1)!);

    await waitFor(async () => {
      const cleared = await repos2.adminGames.getGameById('iq-puzzle-fixture');
      expect(cleared?.translations).toBeUndefined();
    });
  });

  it('safely interpolates $ tokens in translated search headings and updates GamePlayer error on locale switch', async () => {
    renderApp(['/games?q=%24%26'], [makeFixtureGame()], null);
    expect(await screen.findByRole('heading', { name: 'Search: "$&"' })).toBeInTheDocument();

    const evilGame = makeFixtureGame({
      web: {
        ...makeFixtureGame().web,
        artifactUrl: 'https://untrusted-evil.example/game/index.html',
      },
    });
    renderApp(['/play/iq-puzzle-fixture'], [evilGame], null);
    expect(await screen.findByText(/missing or not from a trusted origin/i)).toBeInTheDocument();

    const langSelects = screen.getAllByRole('combobox', { name: /select language/i });
    fireEvent.change(langSelects[langSelects.length - 1]!, { target: { value: 'vi' } });
    expect(
      await screen.findByText('Đường dẫn game bị thiếu hoặc không thuộc nguồn đáng tin cậy.')
    ).toBeInTheDocument();
  });

  it('does not duplicate Recently Updated cards when the strip does not overflow', async () => {
    const games = [
      makeFixtureGame({ id: 'g1', slug: 'g1', title: 'Alpha Puzzle' }),
      makeFixtureGame({ id: 'g2', slug: 'g2', title: 'Beta Puzzle' }),
    ];
    renderApp(['/'], games, null);
    expect(await screen.findAllByText('Alpha Puzzle')).not.toHaveLength(0);
    // Hero banner + ShowcaseCard + 1x Recently Updated (not duplicated for marquee)
    expect(screen.getAllByText('Alpha Puzzle')).toHaveLength(3);
    // ShowcaseCard + 1x Recently Updated
    expect(screen.getAllByText('Beta Puzzle')).toHaveLength(2);
  });
});
