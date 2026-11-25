import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { GameRecord } from '@game-hub/contract';
import { useRepositories } from '../../app/RepositoryContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { GamePlayer } from './GamePlayer';

export function PlayPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { games } = useRepositories();
  const [game, setGame] = useState<GameRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    games
      .getPublicGameBySlug(slug)
      .then((res) => setGame(res))
      .finally(() => setLoading(false));
  }, [slug, games]);

  useDocumentTitle(game ? `Play ${game.title}` : 'Play Game');

  if (loading) {
    return (
      <div className="brutal-panel p-10 text-center space-y-4">
        <p className="font-mono text-sm font-bold uppercase">Preparing game...</p>
        <div className="arcade-progress-track mx-auto max-w-md">
          <div className="arcade-loading-bar h-full w-full" />
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="brutal-panel-lg p-10 text-center space-y-4">
        <h1 className="text-2xl font-bold uppercase text-black">Game unavailable</h1>
        <Link to="/games" className="arcade-btn arcade-btn-pink px-5 py-2.5 text-xs">
          Return to Games
        </Link>
      </div>
    );
  }

  return <GamePlayer game={game} onExit={() => navigate(`/games/${game.slug}`)} />;
}
