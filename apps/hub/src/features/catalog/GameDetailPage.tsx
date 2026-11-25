import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { GameRecord } from '@game-hub/contract';
import { ArrowLeft, Play, Smartphone } from 'lucide-react';
import { useRepositories } from '../../app/RepositoryContext';
import { GameCategoryBadge, GameGrid } from '../../components/GameCard';
import { useCatalog } from '../../hooks/useCatalog';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
  getConfiguredStoreUrls,
  shouldShowInstallPrompt,
} from '../../services/installPromptPolicy';
import { InstallPromptModal } from '../install-prompt/InstallPromptModal';

export function GameDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { games: gameRepo } = useRepositories();
  const { games: catalogGames } = useCatalog();

  const [game, setGame] = useState<GameRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const catalogEntry = catalogGames.find((g) => g.slug === slug);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    gameRepo
      .getPublicGameBySlug(slug, catalogEntry?.revision)
      .then((res) => setGame(res))
      .finally(() => setLoading(false));
  }, [slug, catalogEntry?.revision, gameRepo]);

  useDocumentTitle(game?.title ?? 'Game Details', game?.shortDescription);

  if (loading) {
    return (
      <div className="brutal-panel p-10 text-center space-y-4">
        <p className="font-numeric text-sm font-bold uppercase">Loading game details...</p>
        <div className="arcade-progress-track mx-auto max-w-md">
          <div className="arcade-loading-bar h-full w-full" />
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="brutal-panel-lg p-10 text-center space-y-4">
        <h1 className="text-2xl font-bold">Game not found</h1>
        <p className="text-sm font-medium hub-text-muted">
          This game may be unpublished or archived.
        </p>
        <Link to="/games" className="arcade-btn arcade-btn-pink px-5 py-2.5 text-xs">
          Back to Games
        </Link>
      </div>
    );
  }

  const storeUrls = getConfiguredStoreUrls(game);
  const related = catalogGames
    .filter((g) => g.id !== game.id && g.categories.some((c) => game.categories.includes(c)))
    .slice(0, 3);

  const handlePlayClick = () => {
    if (shouldShowInstallPrompt(game)) {
      setShowInstallModal(true);
    } else {
      navigate(`/play/${game.slug}`);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <Link to="/games" className="arcade-btn arcade-btn-sm arcade-btn-white px-3 py-1.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5]" />
          Back to Catalog
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="brutal-panel-lg overflow-hidden bg-black p-0">
            <img
              src={game.thumbnail}
              alt={game.title}
              className="aspect-video w-full object-cover"
            />
          </div>

          <div className="brutal-panel p-6 space-y-4">
            <h2 className="border-b-[length:var(--border-w)] hub-divider pb-2 font-numeric text-base font-bold uppercase">
              // About
            </h2>
            <p className="text-sm font-medium leading-relaxed">{game.description}</p>
            {game.howToPlay && (
              <div className="border-t-[length:var(--border-w)] hub-divider pt-4 space-y-2">
                <h3 className="font-numeric text-sm font-bold uppercase hub-text-highlight">
                  // How to Play
                </h3>
                <p className="text-sm font-medium leading-relaxed">{game.howToPlay}</p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="brutal-panel-lg p-6 space-y-5">
            <div className="flex items-center gap-3.5">
              <img
                src={game.icon}
                alt={game.title}
                className="h-16 w-16 border-[length:var(--border-w)] hub-divider rounded-[var(--radius-input)] bg-white object-cover brutal-shadow-sm"
              />
              <div>
                <h1 className="text-2xl font-bold leading-tight">{game.title}</h1>
                <p className="mt-1 font-numeric text-xs font-bold uppercase hub-text-muted">
                  v{game.currentRelease} {game.developer ? `• ${game.developer}` : ''}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {game.categories.map((c) => (
                <GameCategoryBadge key={c} category={c} />
              ))}
            </div>

            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handlePlayClick}
                className="arcade-btn arcade-btn-pink w-full px-4 py-3.5 text-sm"
              >
                <Play className="h-4 w-4 fill-current" />
                Play Now
              </button>

              {storeUrls.android && (
                <a
                  href={storeUrls.android}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="arcade-btn arcade-btn-lime w-full px-4 py-2.5 text-xs"
                >
                  <Smartphone className="h-4 w-4 stroke-[2.5]" />
                  Get on Google Play
                </a>
              )}

              {storeUrls.ios && (
                <a
                  href={storeUrls.ios}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="arcade-btn arcade-btn-cyan w-full px-4 py-2.5 text-xs"
                >
                  <Smartphone className="h-4 w-4 stroke-[2.5]" />
                  Get on App Store
                </a>
              )}
            </div>

            <div className="border-t-[length:var(--border-w)] hub-divider pt-4 font-numeric text-[11px] font-bold uppercase">
              <div className="hub-alert-success p-2.5">
                <div className="text-[10px] opacity-75">ORIENTATION</div>
                <div>{game.web.orientation}</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-4 border-b-[length:var(--border-w)] hub-divider pb-2 text-xl font-bold">
            Related Games
          </h2>
          <GameGrid games={related} />
        </section>
      )}

      {showInstallModal && (
        <InstallPromptModal
          game={game}
          onContinueWeb={() => {
            setShowInstallModal(false);
            navigate(`/play/${game.slug}`);
          }}
          onClose={() => setShowInstallModal(false)}
        />
      )}
    </div>
  );
}
