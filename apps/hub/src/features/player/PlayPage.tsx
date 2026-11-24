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

  if (loading) return <div className="py-12 text-center text-slate-400">Preparing game...</div>;
  if (!game) {
    return (
      <div className="rounded-xl border border-slate-800 p-10 text-center">
        <h1 className="text-xl font-bold text-white">Game unavailable</h1>
        <Link to="/games" className="mt-4 inline-block text-sm text-indigo-400 hover:underline">
          Return to Games
        </Link>
      </div>
    );
  }

  return <GamePlayer game={game} onExit={() => navigate(`/games/${game.slug}`)} />;
}
