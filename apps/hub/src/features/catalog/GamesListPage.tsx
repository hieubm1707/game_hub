import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { GameGrid } from '../../components/GameCard';
import { useCatalog } from '../../hooks/useCatalog';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function GamesListPage() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQ);
  const { games, categories, loading, error } = useCatalog();

  const heading = category ? `Category: ${category}` : initialQ ? `Search: "${initialQ}"` : 'All Games';
  useDocumentTitle(heading);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return games.filter((g) => {
      if (category && !g.categories.includes(category)) return false;
      if (!q) return true;
      return (
        g.title.toLowerCase().includes(q) ||
        g.shortDescription.toLowerCase().includes(q) ||
        g.categories.some((c) => c.toLowerCase().includes(q)) ||
        (g.tags ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [games, category, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">{heading}</h1>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value) setSearchParams({ q: e.target.value });
            else setSearchParams({});
          }}
          placeholder="Filter games locally..."
          aria-label="Filter games locally"
          className="w-full max-w-xs rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs">
          {categories.map((c) => (
            <span
              key={c.id}
              className={`rounded-full px-3 py-1 ${
                category === c.id ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
              }`}
            >
              {c.name}
            </span>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-rose-400">{error}</p>}
      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading games...</div>
      ) : (
        <GameGrid games={filtered} emptyText="No matching games found in cached catalog." />
      )}
    </div>
  );
}
