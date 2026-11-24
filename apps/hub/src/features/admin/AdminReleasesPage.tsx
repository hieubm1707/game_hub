import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { GameRecord, GameReleaseRecord } from '@game-hub/contract';
import { useRepositories } from '../../app/RepositoryContext';
import { useAuth } from '../authentication/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function AdminReleasesPage() {
  const { id } = useParams();
  useDocumentTitle(`Releases — ${id}`);
  const { adminGames, releases } = useRepositories();
  const { admin } = useAuth();

  const [game, setGame] = useState<GameRecord | null>(null);
  const [list, setList] = useState<GameReleaseRecord[]>([]);
  const [version, setVersion] = useState('');
  const [artifactUrl, setArtifactUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    const [g, rels] = await Promise.all([
      adminGames.getGameById(id),
      releases.listReleasesForGame(id),
    ]);
    setGame(g);
    setList(rels);
  }, [id, adminGames, releases]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !admin) return;
    setError(null);
    setStatusMsg(null);
    try {
      await releases.registerRelease(
        {
          id: `${id}-${version.trim()}`,
          gameId: id,
          version: version.trim(),
          artifactUrl: artifactUrl.trim(),
          published: true,
          notes: notes.trim(),
        },
        admin.uid
      );
      setVersion('');
      setArtifactUrl('');
      setNotes('');
      setStatusMsg('Registered deployed release artifact.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register release.');
    }
  };

  const handleActivate = async (release: GameReleaseRecord) => {
    if (!game || !admin) return;
    setError(null);
    try {
      const updated = await releases.activateRelease(game.id, release.id, game.revision, admin.uid);
      setGame(updated);
      setStatusMsg(`Activated release v${release.version} (rev ${updated.revision}).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Activation failed.');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-white">
        Releases: {game?.title ?? id}
      </h1>
      <p className="text-xs text-slate-400">
        Active version: <strong className="text-white">v{game?.currentRelease}</strong>. Register
        static Web builds already deployed via CLI/Cloudflare Pages, then activate or roll back.
      </p>

      {statusMsg && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-sm text-emerald-200">
          {statusMsg}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-950/40 p-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="text-sm font-semibold text-white">Register Deployed Build</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.1.0"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
          <input
            required
            value={artifactUrl}
            onChange={(e) => setArtifactUrl(e.target.value)}
            placeholder="https://my-game.pages.dev/releases/1.1.0/index.html"
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </div>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Release notes (optional)"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Register Release
        </button>
      </form>

      <div className="space-y-2">
        {list.map((rel) => {
          const isActive = game?.currentRelease === rel.version;
          return (
            <div
              key={rel.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm"
            >
              <div>
                <div className="font-semibold text-white">
                  v{rel.version}{' '}
                  {isActive && (
                    <span className="ml-2 rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 break-all">{rel.artifactUrl}</p>
              </div>
              {!isActive && (
                <button
                  type="button"
                  onClick={() => void handleActivate(rel)}
                  className="rounded-lg border border-indigo-500 px-3 py-1.5 text-xs text-indigo-300 hover:bg-indigo-950"
                >
                  Activate / Rollback
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
