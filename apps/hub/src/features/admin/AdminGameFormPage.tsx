import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  SUPPORTED_LOCALE_CODES,
  isSafeHttpUrl,
  isSafePublicAssetPath,
  manifestToGameRecordDraft,
  sanitizeTranslations,
  validateManifest,
  type GameOrientation,
  type GameRecord,
  type GameStatus,
  type LocalizedGameText,
  type SupportedLocale,
} from '@game-hub/contract';
import { getAllowedGameOrigins } from '../../firebase/client';
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
      backgroundColor: null,
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
        const normalizedTranslations = sanitizeTranslations(rest.translations, {
          excludeLocales: ['en'],
        });
        const { translations: _t, ...withoutTranslations } = rest;
        setForm({
          ...withoutTranslations,
          howToPlay: rest.howToPlay || rest.translations?.en?.howToPlay || '',
          ...(normalizedTranslations ? { translations: normalizedTranslations } : {}),
        });
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
            backgroundColor: draft.web.backgroundColor ?? prev.web.backgroundColor ?? null,
            hubBridgeEnabled: draft.web.hubBridgeEnabled,
          },
        }));
        setImportSuccess('Imported build metadata only (admin-edited copy preserved).');
      } else {
        const { revision: _r, createdAt: _c, updatedAt: _u, translations, ...rest } = draft;
        const normalizedTranslations = sanitizeTranslations(translations, {
          excludeLocales: ['en'],
        });
        setForm((prev) => ({
          ...rest,
          howToPlay: rest.howToPlay || translations?.en?.howToPlay || '',
          ...(normalizedTranslations ? { translations: normalizedTranslations } : {}),
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
    setError(null);

    if (!isSafePublicAssetPath(form.icon)) {
      setError('Icon URL must be a relative asset path or a safe https:// URL.');
      return;
    }
    if (!isSafePublicAssetPath(form.thumbnail)) {
      setError('Thumbnail URL must be a relative asset path or a safe https:// URL.');
      return;
    }
    const artifactUrl = form.web.artifactUrl?.trim() ?? '';
    if (artifactUrl && !isSafeHttpUrl(artifactUrl, getAllowedGameOrigins())) {
      setError('Web Artifact URL is not from an allowed safe origin.');
      return;
    }
    const androidUrl = form.mobile.android.storeUrl?.trim() ?? '';
    if (androidUrl && !isSafeHttpUrl(androidUrl)) {
      setError('Google Play Store URL must be a valid https:// URL.');
      return;
    }
    const iosUrl = form.mobile.ios.storeUrl?.trim() ?? '';
    if (iosUrl && !isSafeHttpUrl(iosUrl)) {
      setError('App Store URL must be a valid https:// URL.');
      return;
    }

    setSaving(true);
    try {
      const cleanedTranslations = sanitizeTranslations(form.translations, {
        excludeLocales: ['en'],
      });
      const { translations: _ignored, ...formWithoutTranslations } = form;
      if (isEdit && id) {
        await adminGames.updateGame(
          id,
          { ...formWithoutTranslations, translations: cleanedTranslations },
          revision,
          admin.uid
        );
      } else {
        await adminGames.createGame(
          {
            ...formWithoutTranslations,
            ...(cleanedTranslations ? { translations: cleanedTranslations } : {}),
          },
          admin.uid
        );
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
      <div className="brutal-panel p-5">
        <p className="font-numeric text-[11px] font-bold uppercase tracking-widest hub-text-highlight">
          // CARTRIDGE CONFIG
        </p>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEdit ? `Edit Game: ${form.title || id}` : 'Add or Import Game'}
        </h1>
      </div>

      <section className="hub-alert-info p-5 space-y-3">
        <h2 className="font-numeric text-xs font-bold uppercase">
          Import manifest.json (validated locally in browser)
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          {isEdit && (
            <select
              value={importMode}
              onChange={(e) => setImportMode(e.target.value as ImportMode)}
              className="arcade-input w-auto text-xs"
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
            className="arcade-input w-auto text-xs cursor-pointer"
          />
        </div>
        {importSuccess && (
          <p className="hub-alert-success px-3 py-1.5 font-numeric text-xs font-bold">
            {importSuccess}
          </p>
        )}
        {importErrors.length > 0 && (
          <ul className="hub-alert-error p-3 pl-7 list-disc font-numeric text-xs font-bold">
            {importErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}
      </section>

      {error && <div className="hub-alert-error p-3 font-numeric text-sm font-bold">{error}</div>}

      <form onSubmit={handleSubmit} className="brutal-panel p-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-numeric text-xs font-bold uppercase">
              Immutable Game ID
            </label>
            <input
              required
              disabled={isEdit}
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              placeholder="iq-puzzle"
              className="arcade-input mt-1"
            />
          </div>
          <div>
            <label className="block font-numeric text-xs font-bold uppercase">URL Slug</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="iq-puzzle"
              className="arcade-input mt-1"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-numeric text-xs font-bold uppercase">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="arcade-input mt-1"
            />
          </div>
          <div>
            <label className="block font-numeric text-xs font-bold uppercase">
              Publication Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as GameStatus })}
              className="arcade-input mt-1"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="disabled">Disabled</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-numeric text-xs font-bold uppercase">
            Short Description
          </label>
          <input
            required
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            className="arcade-input mt-1"
          />
        </div>

        <div>
          <label className="block font-numeric text-xs font-bold uppercase">Full Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="arcade-input mt-1"
          />
        </div>

        <div>
          <label className="block font-numeric text-xs font-bold uppercase">
            How to Play (Default / EN)
          </label>
          <textarea
            rows={2}
            value={form.howToPlay ?? ''}
            onChange={(e) => setForm({ ...form, howToPlay: e.target.value })}
            className="arcade-input mt-1"
          />
        </div>

        {/* Localized Translations (VI & JA) */}
        <div className="border-[length:var(--border-w)] hub-divider rounded-[var(--radius-input)] p-4 space-y-4">
          <p className="font-numeric text-xs font-bold uppercase hub-text-highlight">
            // Localized Copy (VI / JA — auto-filled on manifest import)
          </p>
          {SUPPORTED_LOCALE_CODES.filter((loc): loc is Exclude<SupportedLocale, 'en'> => loc !== 'en').map((loc) => {
            const label = loc === 'vi' ? 'Tiếng Việt (VI)' : '日本語 (JA)';
            const current = form.translations?.[loc] ?? {};
            const updateLocaleField = (
              field: keyof LocalizedGameText,
              value: string
            ) => {
              setForm((prev) => {
                const prevLocale = prev.translations?.[loc] ?? {};
                return {
                  ...prev,
                  translations: {
                    ...prev.translations,
                    [loc]: { ...prevLocale, [field]: value },
                  },
                };
              });
            };
            return (
              <div key={loc} className="space-y-2.5 border-t-[length:var(--border-w)] hub-divider pt-3">
                <p className="font-numeric text-[11px] font-bold uppercase">{label}</p>
                <input
                  value={current.title ?? ''}
                  onChange={(e) => updateLocaleField('title', e.target.value)}
                  placeholder={`Title (${loc.toUpperCase()} — optional)`}
                  className="arcade-input"
                />
                <input
                  value={current.shortDescription ?? ''}
                  onChange={(e) => updateLocaleField('shortDescription', e.target.value)}
                  placeholder={`Short description (${loc.toUpperCase()})`}
                  className="arcade-input"
                />
                <textarea
                  rows={2}
                  value={current.description ?? ''}
                  onChange={(e) => updateLocaleField('description', e.target.value)}
                  placeholder={`Full description (${loc.toUpperCase()})`}
                  className="arcade-input"
                />
                <textarea
                  rows={2}
                  value={current.howToPlay ?? ''}
                  onChange={(e) => updateLocaleField('howToPlay', e.target.value)}
                  placeholder={`How to play (${loc.toUpperCase()})`}
                  className="arcade-input"
                />
              </div>
            );
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-numeric text-xs font-bold uppercase">
              Categories (comma-separated)
            </label>
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
              className="arcade-input mt-1"
            />
          </div>
          <div>
            <label className="block font-numeric text-xs font-bold uppercase">Orientation</label>
            <select
              value={form.web.orientation}
              onChange={(e) =>
                setForm({
                  ...form,
                  web: { ...form.web, orientation: e.target.value as GameOrientation },
                })
              }
              className="arcade-input mt-1"
            >
              <option value="portrait">Portrait (9:16)</option>
              <option value="landscape">Landscape (16:9)</option>
              <option value="any">Any</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-numeric text-xs font-bold uppercase">
              Icon URL (static hosting)
            </label>
            <input
              required
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="/fixtures/iq-puzzle-icon.svg"
              className="arcade-input mt-1"
            />
          </div>
          <div>
            <label className="block font-numeric text-xs font-bold uppercase">
              Thumbnail URL (static hosting)
            </label>
            <input
              required
              value={form.thumbnail}
              onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
              placeholder="/fixtures/iq-puzzle-thumb.svg"
              className="arcade-input mt-1"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-numeric text-xs font-bold uppercase">
              Web Artifact URL
            </label>
            <input
              value={form.web.artifactUrl ?? ''}
              onChange={(e) =>
                setForm({ ...form, web: { ...form.web, artifactUrl: e.target.value } })
              }
              placeholder="https://my-game.pages.dev/releases/1.0.0/index.html"
              className="arcade-input mt-1"
            />
          </div>
          <div>
            <label className="block font-numeric text-xs font-bold uppercase">
              Web Build Version
            </label>
            <input
              value={form.web.buildVersion}
              onChange={(e) =>
                setForm({
                  ...form,
                  currentRelease: e.target.value,
                  web: { ...form.web, buildVersion: e.target.value },
                })
              }
              className="arcade-input mt-1"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-numeric text-xs font-bold uppercase">
              Player Background Color (optional)
            </label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                aria-label="Pick player background color"
                value={
                  form.web.backgroundColor && /^#[0-9a-fA-F]{6}$/.test(form.web.backgroundColor)
                    ? form.web.backgroundColor
                    : '#000000'
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    web: { ...form.web, backgroundColor: e.target.value },
                  })
                }
                className="h-10 w-12 shrink-0 cursor-pointer border-[length:var(--border-w)] hub-divider rounded-[var(--radius-input)] bg-transparent p-0.5"
              />
              <input
                value={form.web.backgroundColor ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    web: { ...form.web, backgroundColor: e.target.value.trim() || null },
                  })
                }
                placeholder="#000000"
                className="arcade-input"
              />
              {form.web.backgroundColor && (
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      web: { ...form.web, backgroundColor: null },
                    })
                  }
                  className="arcade-btn arcade-btn-sm arcade-btn-white shrink-0 px-3 py-2 text-xs"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block font-numeric text-xs font-bold uppercase">
              Google Play Store URL (optional)
            </label>
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
              className="arcade-input mt-1"
            />
          </div>
          <div>
            <label className="block font-numeric text-xs font-bold uppercase">
              App Store URL (optional)
            </label>
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
              className="arcade-input mt-1"
            />
          </div>
        </div>

        <label className="hub-badge-featured inline-flex items-center gap-3 cursor-pointer select-none px-4 py-2.5">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            className="sr-only"
          />
          <span
            className={`relative inline-flex h-7 w-14 items-center border-2 hub-divider rounded-[var(--radius-badge)] transition-colors ${
              form.featured ? 'hub-brand' : 'bg-white'
            }`}
          >
            <span
              className={`inline-block h-4 w-5 border-2 hub-divider rounded-[var(--radius-badge)] bg-black transition-transform ${
                form.featured ? 'translate-x-7' : 'translate-x-0.5'
              }`}
            />
          </span>
          <span className="font-numeric text-xs font-bold uppercase">
            Featured on homepage ({form.featured ? 'ON' : 'OFF'})
          </span>
        </label>

        <div className="flex justify-end gap-3 border-t-[length:var(--border-w)] hub-divider pt-5">
          <button
            type="button"
            onClick={() => navigate('/admin/games')}
            className="arcade-btn arcade-btn-sm arcade-btn-white px-4 py-2 text-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="arcade-btn arcade-btn-sm arcade-btn-pink px-5 py-2 text-xs"
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Game'}
          </button>
        </div>
      </form>
    </div>
  );
}
