import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { GameRecord } from '@game-hub/contract';
import { Download } from 'lucide-react';
import { useRepositories } from '../../app/RepositoryContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void handleExportAll()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            Export Catalog JSON
          </button>
          <Link
            to="/admin/games/new"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            + Add Game
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading catalog metrics...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Object.entries(counts).map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-base font-semibold text-white">Recently Updated Games</h2>
            <div className="mt-3 divide-y divide-slate-800">
              {games.slice(0, 8).map((g) => (
                <div key={g.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <Link
                      to={`/admin/games/${g.id}/edit`}
                      className="font-medium text-white hover:text-indigo-300"
                    >
                      {g.title}
                    </Link>
                    <p className="text-xs text-slate-400">
                      {g.id} • v{g.currentRelease} • rev {g.revision}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs capitalize text-slate-200">
                    {g.status}
                  </span>
                </div>
              ))}
              {games.length === 0 && (
                <p className="py-4 text-sm text-slate-400">No games registered yet.</p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
