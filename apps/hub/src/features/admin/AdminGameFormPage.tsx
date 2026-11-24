import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  manifestToGameRecordDraft,
  validateManifest,
  type GameOrientation,
  type GameRecord,
  type GameStatus,
} from '@game-hub/contract';
import { useRepositories } from '../../app/RepositoryContext';
import { useAuth } from '../authentication/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

type ImportMode = 'create' | 'build_only' | 'replace_all';

function emptyForm(): Omit<GameRecord, 'revision' | 'createdAt' | 'updatedAt'> {
  return {
    id: '',
    slug: '',
    title: '',
    shortDescription: '',
    description: '',
    howToPlay: '',
    categories: ['puzzle'],
    tags: [],
    developer: '',
    icon: '',
    thumbnail: '',
    screenshots: [],
    featured: false,
    status: 'draft',
    manifestVersion: '2.0.0',
    currentRelease: '1.0.0',
    web: {
      enabled: true,
      artifactUrl: '',
      buildVersion: '1.0.0',
      orientation: 'portrait',
      aspectRatio: { width: 9, height: 16 },
      fullscreen: true,
      supportsTouch: true,
      supportsKeyboard: false,
      hubBridgeEnabled: true,
    },
    mobile: {
      android: { enabled: false, packageId: null, storeUrl: null, appLink: null },
      ios: { enabled: false, bundleId: null, appStoreId: null, storeUrl: null, universalLink: null },
    },
    distribution: {
      installPromptEnabled: true,
      installPromptCooldownDays: 7,
      allowWebPlay: true,
    },
    features: {
      localStorage: true,
      firebaseContentSync: false,
      nativeAds: false,
      webAds: false,
      playerAuthentication: false,
      hubBridge: true,
    },
  };
}

export function AdminGameFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  useDocumentTitle(isEdit ? `Edit Game ${id}` : 'Add / Import Game');

  const navigate = useNavigate();
  const { adminGames } = useRepositories();
  const { admin } = useAuth();

  const [form, setForm] = useState(emptyForm);
  const [revision, setRevision] = useState<number>(1);
  const [importMode, setImportMode] = useState<ImportMode>(isEdit ? 'build_only' : 'create');
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    adminGames.getGameById(id).then((existing) => {
      if (existing) {
        const { revision: rev, createdAt: _c, updatedAt: _u, ...rest } = existing;
        setForm(rest);
        setRevision(rev);
      }
    });
  }, [id, adminGames]);

  const handleManifestFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportErrors([]);
    setImportSuccess(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const check = validateManifest(parsed);
      if (!check.valid || !check.data) {
        setImportErrors(check.errors);
        return;
      }
      const draft = manifestToGameRecordDraft(check.data);
      if (isEdit && importMode === 'build_only') {
        setForm((prev) => ({
          ...prev,
          manifestVersion: draft.manifestVersion,
          currentRelease: draft.currentRelease,
          web: {
            ...prev.web,
            buildVersion: draft.web.buildVersion,
            artifactUrl: draft.web.artifactUrl || prev.web.artifactUrl,
            orientation: draft.web.orientation,
            aspectRatio: draft.web.aspectRatio,
            hubBridgeEnabled: draft.web.hubBridgeEnabled,
          },
        }));
        setImportSuccess('Imported build metadata only (admin-edited copy preserved).');
      } else {
        const { revision: _r, createdAt: _c, updatedAt: _u, ...rest } = draft;
        setForm((prev) => ({
          ...rest,
          id: isEdit ? prev.id : rest.id,
          status: isEdit ? prev.status : 'draft',
        }));
        setImportSuccess('Manifest validated and loaded into form. Review before saving.');
      }
    } catch (err) {
      setImportErrors([err instanceof Error ? err.message : 'Invalid JSON file.']);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admin) return;
    setSaving(true);
    setError(null);
    try {
      if (isEdit && id) {
        await adminGames.updateGame(id, form, revision, admin.uid);
      } else {
        await adminGames.createGame(form, admin.uid);
      }
      navigate('/admin/games');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save game.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-white">
        {isEdit ? `Edit Game: ${form.title || id}` : 'Add or Import Game'}
      </h1>

      <section className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-indigo-200">
          Import manifest.json (validated locally in browser)
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          {isEdit && (
            <select
              value={importMode}
              onChange={(e) => setImportMode(e.target.value as ImportMode)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white"
            >
              <option value="build_only">Update build metadata only</option>
              <option value="replace_all">Replace all metadata</option>
            </select>
          )}
          <input
            type="file"
            accept="application/json,.json"
            onChange={(e) => void handleManifestFile(e)}
            aria-label="Import manifest JSON"
            className="text-xs text-slate-300"
          />
        </div>
        {importSuccess && <p className="text-xs text-emerald-300">{importSuccess}</p>}
        {importErrors.length > 0 && (
          <ul className="list-disc pl-5 text-xs text-rose-300">
            {importErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}
      </section>

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-950/40 p-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-slate-300">Immutable Game ID</label>
            <input
              required
              disabled={isEdit}
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              placeholder="iq-puzzle"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300">URL Slug</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="iq-puzzle"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-slate-300">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300">Publication Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as GameStatus })}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="disabled">Disabled</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-300">Short Description</label>
          <input
            required
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-300">Full Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-slate-300">Categories (comma-separated)</label>
            <input
              value={form.categories.join(', ')}
              onChange={(e) =>
                setForm({
                  ...form,
                  categories: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300">Orientation</label>
            <select
              value={form.web.orientation}
              onChange={(e) =>
                setForm({
                  ...form,
                  web: { ...form.web, orientation: e.target.value as GameOrientation },
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            >
              <option value="portrait">Portrait (9:16)</option>
              <option value="landscape">Landscape (16:9)</option>
              <option value="any">Any</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-slate-300">Icon URL (static hosting)</label>
            <input
              required
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="/fixtures/iq-puzzle-icon.svg"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300">Thumbnail URL (static hosting)</label>
            <input
              required
              value={form.thumbnail}
              onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
              placeholder="/fixtures/iq-puzzle-thumb.svg"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-slate-300">Web Artifact URL</label>
            <input
              value={form.web.artifactUrl ?? ''}
              onChange={(e) =>
                setForm({ ...form, web: { ...form.web, artifactUrl: e.target.value } })
              }
              placeholder="https://my-game.pages.dev/releases/1.0.0/index.html"
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300">Web Build Version</label>
            <input
              value={form.web.buildVersion}
              onChange={(e) =>
                setForm({
                  ...form,
                  currentRelease: e.target.value,
                  web: { ...form.web, buildVersion: e.target.value },
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-slate-300">Google Play Store URL (optional)</label>
            <input
              value={form.mobile.android.storeUrl ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  mobile: {
                    ...form.mobile,
                    android: {
                      ...form.mobile.android,
                      enabled: Boolean(e.target.value),
                      storeUrl: e.target.value || null,
                    },
                  },
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-300">App Store URL (optional)</label>
            <input
              value={form.mobile.ios.storeUrl ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  mobile: {
                    ...form.mobile,
                    ios: {
                      ...form.mobile.ios,
                      enabled: Boolean(e.target.value),
                      storeUrl: e.target.value || null,
                    },
                  },
                })
              }
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Featured on homepage
        </label>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/games')}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Game'}
          </button>
        </div>
      </form>
    </div>
  );
}
