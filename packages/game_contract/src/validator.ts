import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import manifestSchema from '../schemas/game-manifest.schema.json' with { type: 'json' };
import bridgeSchema from '../schemas/bridge-message.schema.json' with { type: 'json' };
import type { BridgeMessage, GameManifest } from './types.js';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const validateManifestSchema = ajv.compile(manifestSchema);
const validateBridgeSchema = ajv.compile(bridgeSchema);

export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  errors: string[];
}

const FORBIDDEN_SECRET_PATTERNS = [
  /-----BEGIN (?:RSA )?PRIVATE KEY-----/i,
  /firebase-adminsdk/i,
  /AIza[0-9A-Za-z_-]{35}/,
  /ghp_[0-9A-Za-z]{36}/,
];

const LOCAL_ABSOLUTE_PATH_PATTERN = /^(?:\/Users\/|\/home\/|[A-Za-z]:\\|file:\/\/)/;

function matchesAllowedOrigin(parsed: URL, pattern: string): boolean {
  const trimmed = pattern.trim();
  if (!trimmed) return false;
  if (!trimmed.includes('*')) {
    return parsed.origin === trimmed;
  }
  // Only allow wildcard hostname patterns on HTTPS origins (e.g. https://*.vercel.app)
  if (!trimmed.startsWith('https://') || parsed.protocol !== 'https:' || parsed.port !== '') {
    return false;
  }
  const hostPattern = trimmed.slice('https://'.length);
  if (
    !hostPattern ||
    hostPattern.includes('/') ||
    hostPattern.includes('@') ||
    hostPattern.includes(':') ||
    !hostPattern.includes('.')
  ) {
    return false;
  }
  const escaped = hostPattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '[a-z0-9-]+');
  const regex = new RegExp(`^${escaped}$`, 'i');
  return regex.test(parsed.hostname);
}

export function isSafeHttpUrl(url: string, allowedOrigins?: string[]): boolean {
  try {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === 'https:';
    const isLocalHttp =
      parsed.protocol === 'http:' &&
      (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1');
    if (!isHttps && !isLocalHttp) return false;
    if (allowedOrigins && allowedOrigins.length > 0) {
      return allowedOrigins.some((origin) => matchesAllowedOrigin(parsed, origin));
    }
    return true;
  } catch {
    return false;
  }
}

export function validateManifest(
  input: unknown,
  options?: { allowedArtifactOrigins?: string[] }
): ValidationResult<GameManifest> {
  const errors: string[] = [];

  if (typeof input !== 'object' || input === null) {
    return { valid: false, errors: ['Manifest must be a JSON object'] };
  }

  const rawJson = JSON.stringify(input);
  for (const pattern of FORBIDDEN_SECRET_PATTERNS) {
    if (pattern.test(rawJson)) {
      errors.push('Manifest contains forbidden credential or secret pattern');
    }
  }

  const ok = validateManifestSchema(input);
  if (!ok && validateManifestSchema.errors) {
    for (const err of validateManifestSchema.errors) {
      errors.push(`${err.instancePath || '/'} ${err.message ?? 'invalid'}`.trim());
    }
  }

  const m = input as Partial<GameManifest>;

  if (m.features?.webAds !== false) {
    errors.push('features.webAds must be false (web advertising is prohibited)');
  }

  if (m.distribution?.allowWebPlay !== true) {
    errors.push('distribution.allowWebPlay must be true');
  }

  // Check for local absolute paths in public fields
  const publicPaths = [
    m.assets?.icon,
    m.assets?.thumbnail,
    ...(m.assets?.screenshots ?? []),
    m.web?.artifactUrl ?? '',
    m.mobile?.android?.storeUrl ?? '',
    m.mobile?.ios?.storeUrl ?? '',
  ].filter(Boolean) as string[];

  for (const p of publicPaths) {
    if (LOCAL_ABSOLUTE_PATH_PATTERN.test(p)) {
      errors.push(`Public field contains forbidden local absolute path: ${p}`);
    }
  }

  if (m.web?.artifactUrl) {
    if (!isSafeHttpUrl(m.web.artifactUrl, options?.allowedArtifactOrigins)) {
      errors.push(`web.artifactUrl is not an allowed safe URL: ${m.web.artifactUrl}`);
    }
  }

  if (m.mobile?.android?.storeUrl && !isSafeHttpUrl(m.mobile.android.storeUrl)) {
    errors.push(`mobile.android.storeUrl must be a valid https URL`);
  }

  if (m.mobile?.ios?.storeUrl && !isSafeHttpUrl(m.mobile.ios.storeUrl)) {
    errors.push(`mobile.ios.storeUrl must be a valid https URL`);
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: input as unknown as GameManifest, errors: [] };
}

export function validateBridgeMessage(input: unknown): ValidationResult<BridgeMessage> {
  const ok = validateBridgeSchema(input);
  if (!ok) {
    const errors = (validateBridgeSchema.errors ?? []).map(
      (e) => `${e.instancePath || '/'} ${e.message ?? 'invalid'}`.trim()
    );
    return { valid: false, errors };
  }
  return { valid: true, data: input as unknown as BridgeMessage, errors: [] };
}

export function manifestToGameRecordDraft(manifest: GameManifest, nowIso = new Date().toISOString()) {
  return {
    id: manifest.id,
    slug: manifest.slug,
    title: manifest.metadata.title,
    shortDescription: manifest.metadata.shortDescription,
    description: manifest.metadata.description,
    howToPlay: manifest.metadata.howToPlay ?? '',
    categories: manifest.metadata.categories,
    tags: manifest.metadata.tags ?? [],
    developer: manifest.metadata.developer ?? '',
    icon: manifest.assets.icon,
    thumbnail: manifest.assets.thumbnail,
    screenshots: manifest.assets.screenshots ?? [],
    featured: false,
    status: 'draft' as const,
    revision: 1,
    manifestVersion: manifest.schemaVersion,
    currentRelease: manifest.web.buildVersion,
    web: {
      enabled: manifest.web.enabled,
      artifactUrl: manifest.web.artifactUrl,
      buildVersion: manifest.web.buildVersion,
      orientation: manifest.web.orientation,
      aspectRatio: manifest.web.aspectRatio,
      fullscreen: manifest.web.fullscreen ?? true,
      supportsTouch: manifest.web.supportsTouch ?? true,
      supportsKeyboard: manifest.web.supportsKeyboard ?? false,
      hubBridgeEnabled: manifest.web.hubBridgeEnabled ?? true,
    },
    mobile: manifest.mobile,
    distribution: manifest.distribution,
    features: manifest.features,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}
