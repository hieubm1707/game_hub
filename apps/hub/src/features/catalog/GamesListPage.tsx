import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { matchesGameQuery, useI18n } from '../../app/I18nContext';
import { GameGrid } from '../../components/GameCard';
import { useCatalog } from '../../hooks/useCatalog';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function GamesListPage() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQ);
  const { games, categories, loading, error } = useCatalog();
  const { locale, t } = useI18n();

  const heading = category
    ? t('catalog.categoryHeading', { category })
    : initialQ
      ? t('catalog.searchHeading', { query: initialQ })
      : t('common.allGames');
  useDocumentTitle(heading);

  const filtered = useMemo(() => {
    return games.filter((g) => {
      if (category && !g.categories.includes(category)) return false;
      return matchesGameQuery(g, query, locale);
    });
  }, [games, category, query, locale]);

  return (
    <div className="space-y-6">
      {/* Header & Local Filter Bar */}
      <div className="brutal-panel p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-numeric text-[11px] font-bold uppercase tracking-widest hub-text-highlight">
            {t('catalog.eyebrow')}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{heading}</h1>
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[2.5] opacity-75" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value) setSearchParams({ q: e.target.value });
              else setSearchParams({});
            }}
            placeholder={t('catalog.filterLocalPlaceholder')}
            aria-label={t('catalog.filterLocalAria')}
            className="arcade-input pl-9"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/games"
            className={`arcade-btn arcade-btn-sm px-3 py-1.5 text-xs ${
              !category ? 'arcade-btn-pink' : 'arcade-btn-white'
            }`}
          >
            {t('common.all')} ({games.length})
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/categories/${encodeURIComponent(c.id)}`}
              className={`arcade-btn arcade-btn-sm px-3 py-1.5 text-xs ${
                category === c.id ? 'arcade-btn-pink' : 'arcade-btn-white'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {error && <div className="hub-alert-error p-4 font-numeric text-sm font-bold">{error}</div>}

      {loading ? (
        <div className="brutal-panel p-10 text-center space-y-4">
          <p className="font-numeric text-sm font-bold uppercase">{t('common.loadingGames')}</p>
          <div className="arcade-progress-track mx-auto max-w-md">
            <div className="arcade-loading-bar h-full w-full" />
          </div>
        </div>
      ) : (
        <GameGrid games={filtered} emptyText={t('catalog.emptyCached')} />
      )}
    </div>
  );
}
