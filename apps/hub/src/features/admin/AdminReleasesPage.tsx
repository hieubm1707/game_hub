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
    try {
      const [g, rels] = await Promise.all([
        adminGames.getGameById(id),
        releases.listReleasesForGame(id),
      ]);
      setGame(g);
      setList(rels);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load releases.');
    }
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
      <div className="brutal-panel p-5 space-y-1.5">
        <p className="font-numeric text-[11px] font-bold uppercase tracking-widest hub-text-highlight">
          // RELEASE PIPELINE
        </p>
        <h1 className="text-2xl font-bold">Releases: {game?.title ?? id}</h1>
        <p className="font-numeric text-xs font-bold hub-text-muted">
          Active version:{' '}
          <strong className="hub-alert-success px-1.5 py-0.5">v{game?.currentRelease}</strong>.
          Register static Web builds already deployed via CLI/Cloudflare Pages, then activate or roll back.
        </p>
      </div>

      {statusMsg && <div className="hub-alert-success p-3 font-numeric text-xs font-bold">{statusMsg}</div>}
      {error && <div className="hub-alert-error p-3 font-numeric text-xs font-bold">{error}</div>}

      <form onSubmit={handleRegister} className="brutal-panel p-5 space-y-4">
        <h2 className="font-numeric text-xs font-bold uppercase">// Register Deployed Build</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.1.0"
            className="arcade-input"
          />
          <input
            required
            value={artifactUrl}
            onChange={(e) => setArtifactUrl(e.target.value)}
            placeholder="https://my-game.pages.dev/releases/1.1.0/index.html"
            className="arcade-input"
          />
        </div>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Release notes (optional)"
          className="arcade-input"
        />
        <button type="submit" className="arcade-btn arcade-btn-sm arcade-btn-pink px-4 py-2 text-xs">
          Register Release
        </button>
      </form>

      <div className="space-y-3">
        {list.map((rel) => {
          const isActive = game?.currentRelease === rel.version;
          return (
            <div
              key={rel.id}
              className="brutal-panel flex flex-wrap items-center justify-between gap-3 p-4 text-sm"
            >
              <div>
                <div className="font-numeric font-bold">
                  v{rel.version}{' '}
                  {isActive && (
                    <span className="hub-alert-success ml-2 px-2 py-0.5 text-xs uppercase">
                      Active
                    </span>
                  )}
                </div>
                <p className="mt-1 font-numeric text-xs font-medium hub-text-muted break-all">
                  {rel.artifactUrl}
                </p>
              </div>
              {!isActive && (
                <button
                  type="button"
                  onClick={() => void handleActivate(rel)}
                  className="arcade-btn arcade-btn-sm arcade-btn-cyan px-3 py-1.5 text-xs"
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
