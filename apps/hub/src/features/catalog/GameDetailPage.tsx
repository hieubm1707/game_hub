import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { GameRecord } from '@game-hub/contract';
import { Play, Smartphone } from 'lucide-react';
import { useRepositories } from '../../app/RepositoryContext';
import { GameCategoryBadge, GameGrid } from '../../components/GameCard';
import { useCatalog } from '../../hooks/useCatalog';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
  detectDevicePlatform,
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

  if (loading) return <div className="py-12 text-center text-slate-400">Loading game details...</div>;
  if (!game) {
    return (
      <div className="rounded-xl border border-slate-800 p-10 text-center">
        <h1 className="text-xl font-bold text-white">Game not found</h1>
        <p className="mt-2 text-sm text-slate-400">
          This game may be unpublished or archived.
        </p>
        <Link to="/games" className="mt-4 inline-block text-sm text-indigo-400 hover:underline">
          Back to Games
        </Link>
      </div>
    );
  }

  const device = detectDevicePlatform();
  const related = catalogGames
    .filter((g) => g.id !== game.id && g.categories.some((c) => game.categories.includes(c)))
    .slice(0, 3);

  const handlePlayClick = () => {
    if (shouldShowInstallPrompt(game, device)) {
      setShowInstallModal(true);
    } else {
      navigate(`/play/${game.slug}`);
    }
  };

  return (
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <img
            src={game.thumbnail}
            alt={game.title}
            className="aspect-video w-full rounded-2xl border border-slate-800 object-cover"
          />
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">About</h2>
            <p className="text-sm leading-relaxed text-slate-300">{game.description}</p>
            {game.howToPlay && (
              <>
                <h3 className="text-base font-semibold text-white">How to Play</h3>
                <p className="text-sm leading-relaxed text-slate-300">{game.howToPlay}</p>
              </>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <img src={game.icon} alt={game.title} className="h-14 w-14 rounded-xl" />
              <div>
                <h1 className="text-xl font-bold text-white">{game.title}</h1>
                <p className="text-xs text-slate-400">
                  v{game.currentRelease} {game.developer ? `• ${game.developer}` : ''}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {game.categories.map((c) => (
                <GameCategoryBadge key={c} category={c} />
              ))}
            </div>

            <button
              type="button"
              onClick={handlePlayClick}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              <Play className="h-4 w-4" />
              Play Now (Web — Ad-Free)
            </button>

            {game.mobile.android.enabled && game.mobile.android.storeUrl && (
              <a
                href={game.mobile.android.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800"
              >
                <Smartphone className="h-4 w-4" />
                Get on Google Play
              </a>
            )}

            {game.mobile.ios.enabled && game.mobile.ios.storeUrl && (
              <a
                href={game.mobile.ios.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800"
              >
                <Smartphone className="h-4 w-4" />
                Get on App Store
              </a>
            )}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-white">Related Games</h2>
          <GameGrid games={related} />
        </section>
      )}

      {showInstallModal && (
        <InstallPromptModal
          game={game}
          device={device}
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
