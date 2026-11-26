import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { GameRecord } from '@game-hub/contract';
import { getLocalizedGameText, useI18n } from '../../app/I18nContext';
import { useRepositories } from '../../app/RepositoryContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { GamePlayer } from './GamePlayer';

export function PlayPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { games } = useRepositories();
  const { locale, t } = useI18n();
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

  const localizedTitle = game ? getLocalizedGameText(game, locale).title : null;
  useDocumentTitle(localizedTitle ? `${t('common.playNow')} — ${localizedTitle}` : t('common.playNow'));

  if (loading) {
    return (
      <div className="brutal-panel p-10 text-center space-y-4">
        <p className="font-mono text-sm font-bold uppercase">{t('common.preparingGame')}</p>
        <div className="arcade-progress-track mx-auto max-w-md">
          <div className="arcade-loading-bar h-full w-full" />
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="brutal-panel-lg p-10 text-center space-y-4">
        <h1 className="text-2xl font-bold uppercase">{t('player.gameUnavailable')}</h1>
        <Link to="/games" className="arcade-btn arcade-btn-pink px-5 py-2.5 text-xs">
          {t('common.returnToGames')}
        </Link>
      </div>
    );
  }

  return <GamePlayer game={game} onExit={() => navigate(`/games/${game.slug}`)} />;
}
