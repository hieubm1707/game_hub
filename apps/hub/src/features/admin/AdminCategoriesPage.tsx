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
      <div className="brutal-panel p-5">
        <p className="font-numeric text-[11px] font-bold uppercase tracking-widest hub-text-highlight">
          // TAXONOMY
        </p>
        <h1 className="text-2xl font-bold">Categories</h1>
      </div>

      <form onSubmit={handleSave} className="brutal-panel grid gap-3 p-4 sm:grid-cols-4">
        <input
          required
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="slug-id"
          className="arcade-input"
        />
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Display Name"
          className="arcade-input"
        />
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="arcade-input"
        />
        <button type="submit" className="arcade-btn arcade-btn-sm arcade-btn-pink px-4 py-2 text-xs">
          Add / Update
        </button>
      </form>

      <div className="brutal-panel divide-y-2 hub-divider">
        {list.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <span className="font-bold">{c.name}</span>{' '}
              <span className="font-numeric text-xs font-bold hub-text-muted">
                ({c.id} • order {c.order})
              </span>
            </div>
            <button
              type="button"
              onClick={() => void toggleEnabled(c)}
              className={`arcade-btn arcade-btn-sm px-3 py-1 text-xs ${
                c.enabled ? 'arcade-btn-yellow' : 'arcade-btn-lime'
              }`}
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
    <div className="brutal-panel-lg max-w-2xl p-6 space-y-4">
      <div className="hub-badge px-2.5 py-0.5 text-xs uppercase">// IMMUTABLE PACKS</div>
      <h1 className="text-2xl font-bold">Offline Content Packs</h1>
      <p className="text-sm font-medium leading-relaxed">
        Games using hybrid/Firebase content sync read immutable packs from{' '}
        <code className="hub-badge-featured px-1.5 py-0.5 text-xs font-bold">
          content_metadata/{'{gameId}'}
        </code>{' '}
        and{' '}
        <code className="hub-badge-featured px-1.5 py-0.5 text-xs font-bold">
          game_content/{'{packId}'}
        </code>
        . Content packs are immutable once published so cached clients never experience partial mid-level updates.
      </p>
      <p className="font-numeric text-xs font-bold hub-text-muted">
        Use <code className="hub-topbar px-1.5 py-0.5">pnpm emulators:seed</code> in development or
        publish versioned JSON packs via Firestore rules-validated admin tooling.
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
      <div className="brutal-panel p-5">
        <p className="font-numeric text-[11px] font-bold uppercase tracking-widest hub-text-highlight">
          // SYSTEM CONFIG
        </p>
        <h1 className="text-2xl font-bold">Hub Settings</h1>
      </div>

      {saved && (
        <div className="hub-alert-success p-3 font-numeric text-xs font-bold">
          Public Hub settings saved.
        </div>
      )}

      <form onSubmit={handleSave} className="brutal-panel p-6 space-y-5">
        <div>
          <label className="block font-numeric text-xs font-bold uppercase">Hub Name</label>
          <input
            value={hubName}
            onChange={(e) => setHubName(e.target.value)}
            className="arcade-input mt-1"
          />
        </div>
        <div>
          <label className="block font-numeric text-xs font-bold uppercase">Tagline</label>
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="arcade-input mt-1"
          />
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block font-numeric text-xs font-bold uppercase">
              Catalog Cache TTL (minutes)
            </label>
            <span className="hub-badge-featured px-2 py-0.5 text-xs font-bold">{ttl} MIN</span>
          </div>
          <input
            type="range"
            min={5}
            max={1440}
            step={5}
            value={ttl}
            onChange={(e) => setTtl(Number(e.target.value))}
            aria-label="Catalog Cache TTL slider"
            className="arcade-slider"
          />
          <input
            type="number"
            min={5}
            max={1440}
            value={ttl}
            onChange={(e) => setTtl(Number(e.target.value))}
            className="arcade-input"
          />
        </div>
        <button type="submit" className="arcade-btn arcade-btn-sm arcade-btn-pink px-5 py-2.5 text-xs">
          Save Settings
        </button>
      </form>
    </div>
  );
}
