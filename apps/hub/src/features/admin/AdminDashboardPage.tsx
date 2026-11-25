import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { GameRecord } from '@game-hub/contract';
import { Download, Plus } from 'lucide-react';
import { useRepositories } from '../../app/RepositoryContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const METRIC_CLASSES: Record<string, string> = {
  total: 'brutal-panel',
  published: 'hub-alert-success',
  draft: 'hub-badge-featured',
  disabled: 'hub-alert-info',
  archived: 'brutal-panel',
  incomplete: 'hub-alert-error',
};

export function AdminDashboardPage() {
  useDocumentTitle('Admin Overview');
  const { adminGames, categories } = useRepositories();
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGames
      .listAllGames()
      .then(setGames)
      .finally(() => setLoading(false));
  }, [adminGames]);

  const counts = {
    total: games.length,
    published: games.filter((g) => g.status === 'published').length,
    draft: games.filter((g) => g.status === 'draft').length,
    disabled: games.filter((g) => g.status === 'disabled').length,
    archived: games.filter((g) => g.status === 'archived').length,
    incomplete: games.filter((g) => !g.web.artifactUrl || !g.thumbnail).length,
  };

  const publishedRatio = counts.total > 0 ? Math.round((counts.published / counts.total) * 100) : 0;

  const handleExportAll = async () => {
    const cats = await categories.listAllCategories();
    const payload = {
      exportedAt: new Date().toISOString(),
      games,
      categories: cats,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game-hub-catalog-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="brutal-panel p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-numeric text-[11px] font-bold uppercase tracking-widest hub-text-highlight">
            // ADMIN CONSOLE
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => void handleExportAll()}
            className="arcade-btn arcade-btn-sm arcade-btn-cyan px-3.5 py-2 text-xs"
          >
            <Download className="h-4 w-4 stroke-[2.5]" />
            Export Catalog JSON
          </button>
          <Link
            to="/admin/games/new"
            className="arcade-btn arcade-btn-sm arcade-btn-pink px-4 py-2 text-xs"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            Add Game
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="brutal-panel p-8 font-numeric text-sm font-bold uppercase">
          Loading catalog metrics...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Object.entries(counts).map(([label, value]) => (
              <div key={label} className={`p-4 ${METRIC_CLASSES[label] ?? 'brutal-panel'}`}>
                <p className="font-numeric text-[11px] font-bold uppercase tracking-wider opacity-85">
                  {label}
                </p>
                <p className="mt-2 font-numeric text-3xl font-bold">{value}</p>
              </div>
            ))}
          </div>

          <section className="brutal-panel p-5 space-y-3">
            <div className="flex items-center justify-between font-numeric text-xs font-bold uppercase">
              <span>// Live Catalog Ratio</span>
              <span>
                {counts.published}/{counts.total} Published ({publishedRatio}%)
              </span>
            </div>
            <div className="arcade-progress-track">
              <div
                className="arcade-progress-fill transition-all duration-300"
                style={{ width: `${publishedRatio}%` }}
              />
            </div>
          </section>

          <section className="brutal-panel p-5">
            <h2 className="border-b-[length:var(--border-w)] hub-divider pb-2 font-numeric text-sm font-bold uppercase">
              // Recently Updated Games
            </h2>
            <div className="mt-3 divide-y-2 hub-divider">
              {games.slice(0, 8).map((g) => (
                <div key={g.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <Link
                      to={`/admin/games/${g.id}/edit`}
                      className="font-bold hover:underline"
                    >
                      {g.title}
                    </Link>
                    <p className="font-numeric text-xs font-bold hub-text-muted">
                      {g.id} • v{g.currentRelease} • rev {g.revision}
                    </p>
                  </div>
                  <span className="hub-badge-featured px-2.5 py-0.5 text-xs font-bold uppercase">
                    {g.status}
                  </span>
                </div>
              ))}
              {games.length === 0 && (
                <p className="py-4 font-numeric text-sm font-bold hub-text-muted">
                  No games registered yet.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
