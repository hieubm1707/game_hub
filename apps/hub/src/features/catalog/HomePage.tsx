import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { GameGrid } from '../../components/GameCard';
import { useCatalog } from '../../hooks/useCatalog';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function HomePage() {
  useDocumentTitle('Discover Games', 'Play free, ad-free, offline-first Flutter games directly in your browser.');
  const { games, categories, loading, stale, error, refresh } = useCatalog();

  const featured = games.filter((g) => g.featured);
  const recent = [...games].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 p-8">
        <span className="inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
          Nonprofit • Zero Web Ads • Offline-First
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Play Offline-First Flutter Games Instantly
        </h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Browse and play directly in your browser with no account required, or install the native Android/iOS app for full offline play.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/games"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Browse All Games
          </Link>
          <button
            type="button"
            onClick={() => void refresh()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-800"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Catalog
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/40 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      {stale && !error && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 px-4 py-2 text-xs text-amber-200">
          Showing cached catalog while checking for updates...
        </div>
      )}

      {categories.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-white">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/categories/${encodeURIComponent(c.id)}`}
                className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-200 hover:border-indigo-500 hover:text-white"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-400">Loading catalog...</div>
      ) : (
        <>
          {featured.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-white">Featured Games</h2>
              <GameGrid games={featured} />
            </section>
          )}

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Recently Updated</h2>
              <Link to="/games" className="text-sm text-indigo-400 hover:text-indigo-300">
                View all →
              </Link>
            </div>
            <GameGrid
              games={recent}
              emptyText="No published games yet. Sign in to /admin to import and publish your first game."
            />
          </section>
        </>
      )}
    </div>
  );
}
