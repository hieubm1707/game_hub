import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { GameRecord, GameStatus } from '@game-hub/contract';
import { useRepositories } from '../../app/RepositoryContext';
import { useAuth } from '../authentication/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function AdminGamesPage() {
  useDocumentTitle('Manage Games');
  const { adminGames } = useRepositories();
  const { admin } = useAuth();

  const [games, setGames] = useState<GameRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setGames(await adminGames.listAllGames());
    } finally {
      setLoading(false);
    }
  }, [adminGames]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return games.filter((g) => {
      if (statusFilter !== 'all' && g.status !== statusFilter) return false;
      if (!q) return true;
      return (
        g.title.toLowerCase().includes(q) ||
        g.id.toLowerCase().includes(q) ||
        g.slug.toLowerCase().includes(q)
      );
    });
  }, [games, search, statusFilter]);

  const changeStatus = async (game: GameRecord, nextStatus: GameStatus) => {
    if (!admin) return;
    setError(null);
    setMessage(null);
    try {
      const updated = await adminGames.setGameStatus(game.id, nextStatus, game.revision, admin.uid);
      setGames((prev) => prev.map((g) => (g.id === game.id ? updated : g)));
      setMessage(`Updated "${game.title}" status to ${nextStatus} (rev ${updated.revision}).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status update failed.');
    }
  };

  const handleDelete = async (game: GameRecord) => {
    if (!admin) return;
    if (!window.confirm(`Permanently delete "${game.title}" from Firestore? Deployed static artifacts will not be deleted.`)) {
      return;
    }
    setError(null);
    try {
      await adminGames.deleteGamePermanently(game.id, admin.uid);
      setGames((prev) => prev.filter((g) => g.id !== game.id));
      setMessage(`Permanently deleted "${game.title}".`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed (owner role required).');
    }
  };

  const exportGame = (game: GameRecord) => {
    const blob = new Blob([JSON.stringify(game, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${game.id}.record.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Games Catalog</h1>
        <Link
          to="/admin/games/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          + Add / Import Game
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, ID, or slug..."
          className="w-full max-w-xs rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="disabled">Disabled</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {message && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-sm text-emerald-200">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-950/40 p-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-400">Loading games...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Game</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Release</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950">
              {filtered.map((g) => (
                <tr key={g.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{g.title}</div>
                    <div className="text-xs text-slate-400">
                      {g.id} • /{g.slug} • rev {g.revision}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs capitalize text-slate-200">
                      {g.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300">v{g.currentRelease}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Link
                        to={`/admin/games/${g.id}/edit`}
                        className="rounded border border-slate-700 px-2 py-1 text-slate-200 hover:bg-slate-800"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/admin/games/${g.id}/releases`}
                        className="rounded border border-slate-700 px-2 py-1 text-slate-200 hover:bg-slate-800"
                      >
                        Releases
                      </Link>
                      {g.status !== 'published' ? (
                        <button
                          type="button"
                          onClick={() => void changeStatus(g, 'published')}
                          className="rounded bg-emerald-600/80 px-2 py-1 text-white hover:bg-emerald-500"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void changeStatus(g, 'draft')}
                          className="rounded bg-amber-600/80 px-2 py-1 text-white hover:bg-amber-500"
                        >
                          Unpublish
                        </button>
                      )}
                      {g.status !== 'archived' ? (
                        <button
                          type="button"
                          onClick={() => void changeStatus(g, 'archived')}
                          className="rounded border border-slate-700 px-2 py-1 text-slate-300 hover:bg-slate-800"
                        >
                          Archive
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void changeStatus(g, 'draft')}
                          className="rounded border border-indigo-600 px-2 py-1 text-indigo-300 hover:bg-indigo-950"
                        >
                          Restore
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => exportGame(g)}
                        className="rounded border border-slate-700 px-2 py-1 text-slate-300 hover:bg-slate-800"
                      >
                        Export
                      </button>
                      {admin?.role === 'owner' && (
                        <button
                          type="button"
                          onClick={() => void handleDelete(g)}
                          className="rounded border border-rose-700 px-2 py-1 text-rose-300 hover:bg-rose-950"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    No games match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
