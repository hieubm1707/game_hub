import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { GameRecord, GameStatus } from '@game-hub/contract';
import { useRepositories } from '../../app/RepositoryContext';
import { useAuth } from '../authentication/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const STATUS_BADGE: Record<GameStatus, string> = {
  published: 'hub-alert-success',
  draft: 'hub-badge-featured',
  disabled: 'hub-alert-info',
  archived: 'hub-badge',
};

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
    if (
      !window.confirm(
        `Permanently delete "${game.title}" from Firestore? Deployed static artifacts will not be deleted.`
      )
    ) {
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
      <div className="brutal-panel p-5 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Games Catalog</h1>
        <Link to="/admin/games/new" className="arcade-btn arcade-btn-sm arcade-btn-pink px-4 py-2 text-xs">
          + Add / Import Game
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, ID, or slug..."
          className="arcade-input max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          className="arcade-input w-auto min-w-[160px]"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="disabled">Disabled</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {message && <div className="hub-alert-success p-3 font-numeric text-xs font-bold">{message}</div>}
      {error && <div className="hub-alert-error p-3 font-numeric text-xs font-bold">{error}</div>}

      {loading ? (
        <div className="brutal-panel p-8 font-numeric text-sm font-bold uppercase">
          Loading games...
        </div>
      ) : (
        <div className="brutal-panel overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="hub-table-head text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Game</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Release</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 hub-divider">
              {filtered.map((g) => (
                <tr key={g.id}>
                  <td className="px-4 py-3">
                    <div className="font-bold">{g.title}</div>
                    <div className="font-numeric text-xs font-bold hub-text-muted">
                      {g.id} • /{g.slug} • rev {g.revision}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 font-numeric text-xs font-bold uppercase ${
                        STATUS_BADGE[g.status]
                      }`}
                    >
                      {g.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-numeric text-xs font-bold">v{g.currentRelease}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Link
                        to={`/admin/games/${g.id}/edit`}
                        className="arcade-btn arcade-btn-sm arcade-btn-white px-2.5 py-1 text-[11px]"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/admin/games/${g.id}/releases`}
                        className="arcade-btn arcade-btn-sm arcade-btn-cyan px-2.5 py-1 text-[11px]"
                      >
                        Releases
                      </Link>
                      {g.status !== 'published' ? (
                        <button
                          type="button"
                          onClick={() => void changeStatus(g, 'published')}
                          className="arcade-btn arcade-btn-sm arcade-btn-lime px-2.5 py-1 text-[11px]"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void changeStatus(g, 'draft')}
                          className="arcade-btn arcade-btn-sm arcade-btn-yellow px-2.5 py-1 text-[11px]"
                        >
                          Unpublish
                        </button>
                      )}
                      {g.status !== 'archived' ? (
                        <button
                          type="button"
                          onClick={() => void changeStatus(g, 'archived')}
                          className="arcade-btn arcade-btn-sm arcade-btn-white px-2.5 py-1 text-[11px]"
                        >
                          Archive
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void changeStatus(g, 'draft')}
                          className="arcade-btn arcade-btn-sm arcade-btn-cyan px-2.5 py-1 text-[11px]"
                        >
                          Restore
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => exportGame(g)}
                        className="arcade-btn arcade-btn-sm arcade-btn-white px-2.5 py-1 text-[11px]"
                      >
                        Export
                      </button>
                      {admin?.role === 'owner' && (
                        <button
                          type="button"
                          onClick={() => void handleDelete(g)}
                          className="arcade-btn arcade-btn-sm arcade-btn-pink px-2.5 py-1 text-[11px]"
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
                  <td colSpan={4} className="px-4 py-8 text-center font-numeric text-sm font-bold hub-text-muted">
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
