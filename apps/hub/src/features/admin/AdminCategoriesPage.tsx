import React, { useEffect, useState } from 'react';
import type { CategoryRecord } from '@game-hub/contract';
import { useRepositories } from '../../app/RepositoryContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function AdminCategoriesPage() {
  useDocumentTitle('Manage Categories');
  const { categories } = useRepositories();
  const [list, setList] = useState<CategoryRecord[]>([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [order, setOrder] = useState(1);

  const load = async () => setList(await categories.listAllCategories());

  useEffect(() => {
    void load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await categories.saveCategory({
      id: id.trim().toLowerCase(),
      name: name.trim(),
      order: Number(order),
      enabled: true,
    });
    setId('');
    setName('');
    await load();
  };

  const toggleEnabled = async (c: CategoryRecord) => {
    await categories.saveCategory({ ...c, enabled: !c.enabled });
    await load();
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-white">Categories</h1>

      <form onSubmit={handleSave} className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:grid-cols-4">
        <input
          required
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="slug-id"
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Display Name"
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Add / Update
        </button>
      </form>

      <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-900/50">
        {list.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <span className="font-medium text-white">{c.name}</span>{' '}
              <span className="text-xs text-slate-400">({c.id} • order {c.order})</span>
            </div>
            <button
              type="button"
              onClick={() => void toggleEnabled(c)}
              className="rounded border border-slate-700 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-800"
            >
              {c.enabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminContentPage() {
  useDocumentTitle('Game Content Packs');
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-white">Offline Content Packs</h1>
      <p className="text-sm text-slate-300">
        Games using hybrid/Firebase content sync read immutable packs from{' '}
        <code className="text-indigo-300">content_metadata/{'{gameId}'}</code> and{' '}
        <code className="text-indigo-300">game_content/{'{packId}'}</code>. Content packs are
        immutable once published so cached clients never experience partial mid-level updates.
      </p>
      <p className="text-xs text-slate-400">
        Use <code className="text-slate-200">pnpm emulators:seed</code> in development or publish
        versioned JSON packs via Firestore rules-validated admin tooling.
      </p>
    </div>
  );
}

export function AdminSettingsPage() {
  useDocumentTitle('Hub Settings');
  const { settings } = useRepositories();
  const [hubName, setHubName] = useState('Game Hub');
  const [tagline, setTagline] = useState('');
  const [ttl, setTtl] = useState(60);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settings.getPublicSettings().then((s) => {
      setHubName(s.hubName);
      setTagline(s.tagline);
      setTtl(s.catalogCacheTtlMinutes);
    });
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await settings.updatePublicSettings({
      hubName,
      tagline,
      catalogCacheTtlMinutes: ttl,
    });
    setSaved(true);
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-white">Hub Settings</h1>
      {saved && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-3 text-sm text-emerald-200">
          Public Hub settings saved.
        </div>
      )}
      <form onSubmit={handleSave} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div>
          <label className="block text-xs text-slate-300">Hub Name</label>
          <input
            value={hubName}
            onChange={(e) => setHubName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-300">Tagline</label>
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-300">Catalog Cache TTL (minutes)</label>
          <input
            type="number"
            min={5}
            max={1440}
            value={ttl}
            onChange={(e) => setTtl(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
