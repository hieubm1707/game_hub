import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import yaml from 'js-yaml';
import { SUPPORTED_LOCALE_CODES, validateManifest, type GameManifest } from '@game-hub/contract';

export interface RepoConfigEntry {
  id: string;
  path: string;
  type?: string;
  notes?: string;
}

export interface InspectReport {
  path: string;
  name: string;
  hasPubspec: boolean;
  hasWebDir: boolean;
  hasManifest: boolean;
  hasGamePlatformDep: boolean;
  usesFvm: boolean;
  fvmFlutterVersion: string | null;
  flutterCommand: string;
  usesAdMob: boolean;
  usesFirebase: boolean;
  dartIoFiles: string[];
  bundledContentExists: boolean;
  warnings: string[];
}

export function detectFvmFlutterVersion(repoPath: string): string | null {
  const abs = path.resolve(repoPath);
  const fvmrcPath = path.join(abs, '.fvmrc');
  if (fs.existsSync(fvmrcPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(fvmrcPath, 'utf8')) as { flutter?: unknown };
      if (typeof parsed?.flutter === 'string' && parsed.flutter.trim().length > 0) {
        return parsed.flutter.trim();
      }
    } catch {
      // Ignore malformed .fvmrc and fall through
    }
  }
  const legacyPath = path.join(abs, '.fvm', 'fvm_config.json');
  if (fs.existsSync(legacyPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(legacyPath, 'utf8')) as {
        flutterSdkVersion?: unknown;
      };
      if (
        typeof parsed?.flutterSdkVersion === 'string' &&
        parsed.flutterSdkVersion.trim().length > 0
      ) {
        return parsed.flutterSdkVersion.trim();
      }
    } catch {
      // Ignore malformed legacy FVM config
    }
  }
  return null;
}

export function resolveFlutterCommand(repoPath: string): {
  command: string;
  usesFvm: boolean;
  fvmVersion: string | null;
} {
  const abs = path.resolve(repoPath);
  const fvmVersion = detectFvmFlutterVersion(abs);
  const usesFvm = fvmVersion !== null || fs.existsSync(path.join(abs, '.fvm'));
  return {
    command: usesFvm ? 'fvm flutter' : 'flutter',
    usesFvm,
    fvmVersion,
  };
}

export function findWorkspaceRoot(startDir = process.cwd()): string {
  let dir = path.resolve(startDir);
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) return dir;
    dir = path.dirname(dir);
  }
  return path.resolve(startDir);
}

export function loadRepositories(
  workspaceRoot: string,
  options?: { ignoreLocal?: boolean }
): RepoConfigEntry[] {
  const localCfg = path.join(workspaceRoot, 'config', 'repositories.local.yaml');
  const exampleCfg = path.join(workspaceRoot, 'config', 'repositories.example.yaml');
  const target = !options?.ignoreLocal && fs.existsSync(localCfg) ? localCfg : exampleCfg;
  if (!fs.existsSync(target)) return [];
  const parsed = yaml.load(fs.readFileSync(target, 'utf8')) as {
    repositories?: RepoConfigEntry[];
  };
  return (parsed?.repositories ?? []).map((r) => ({
    ...r,
    path: path.isAbsolute(r.path) ? r.path : path.resolve(workspaceRoot, r.path),
  }));
}

function walkDartFiles(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'build') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDartFiles(full, out);
    else if (entry.name.endsWith('.dart')) out.push(full);
  }
  return out;
}

export function inspectFlutterRepo(repoPath: string): InspectReport {
  const abs = path.resolve(repoPath);
  const pubspecPath = path.join(abs, 'pubspec.yaml');
  const hasPubspec = fs.existsSync(pubspecPath);
  const pubspecRaw = hasPubspec ? fs.readFileSync(pubspecPath, 'utf8') : '';
  const pubspec = hasPubspec ? (yaml.load(pubspecRaw) as Record<string, unknown>) : {};
  const deps = {
    ...((pubspec?.dependencies as Record<string, unknown>) ?? {}),
    ...((pubspec?.dev_dependencies as Record<string, unknown>) ?? {}),
  };

  const libDir = path.join(abs, 'lib');
  const dartFiles = walkDartFiles(libDir);
  const dartIoFiles: string[] = [];
  for (const file of dartFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes("import 'dart:io'") || content.includes('import "dart:io"')) {
      dartIoFiles.push(path.relative(abs, file));
    }
  }

  const hasWebDir = fs.existsSync(path.join(abs, 'web'));
  const hasManifest = fs.existsSync(path.join(abs, 'assets', 'manifest.json'));
  const hasGamePlatformDep = 'game_platform' in deps;
  const fvm = resolveFlutterCommand(abs);
  const usesAdMob = 'google_mobile_ads' in deps;
  const usesFirebase = 'firebase_core' in deps || 'cloud_firestore' in deps;
  const bundledContentExists = fs.existsSync(path.join(abs, 'assets', 'content', 'default.json'));

  const warnings: string[] = [];
  if (!hasWebDir) {
    warnings.push(`Missing web/ directory (run ${fvm.command} create --platforms=web .)`);
  }
  if (!hasManifest) warnings.push('Missing assets/manifest.json (run pnpm game init)');
  if (!hasGamePlatformDep) warnings.push('Missing game_platform dependency in pubspec.yaml');
  if (dartIoFiles.length > 0) warnings.push(`Found dart:io imports in: ${dartIoFiles.join(', ')}`);
  if (usesAdMob) warnings.push('google_mobile_ads detected: ensure Web build isolates AdMob behind GameAds');
  if (!bundledContentExists) warnings.push('No assets/content/default.json offline fallback detected');

  return {
    path: abs,
    name: String(pubspec?.name ?? path.basename(abs)),
    hasPubspec,
    hasWebDir,
    hasManifest,
    hasGamePlatformDep,
    usesFvm: fvm.usesFvm,
    fvmFlutterVersion: fvm.fvmVersion,
    flutterCommand: fvm.command,
    usesAdMob,
    usesFirebase,
    dartIoFiles,
    bundledContentExists,
    warnings,
  };
}

export function initManifestTemplate(repoPath: string, dryRun = false): { manifestPath: string; created: boolean } {
  const abs = path.resolve(repoPath);
  const report = inspectFlutterRepo(abs);
  const slug = report.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const manifestPath = path.join(abs, 'assets', 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    return { manifestPath, created: false };
  }

  const template: GameManifest = {
    schemaVersion: '2.0.0',
    id: slug,
    slug,
    version: '1.0.0',
    metadata: {
      title: report.name,
      shortDescription: 'Offline-first Flutter game.',
      description: 'Offline-first Flutter game integrated with Game Hub.',
      categories: ['casual'],
      tags: ['offline'],
      developer: '',
      defaultLocale: 'en',
      supportedLocales: [...SUPPORTED_LOCALE_CODES],
      translations: {
        en: {
          shortDescription: 'Offline-first Flutter game.',
          description: 'Offline-first Flutter game integrated with Game Hub.',
          howToPlay: '',
        },
        vi: {
          shortDescription: 'Trò chơi Flutter hỗ trợ chơi offline.',
          description: 'Trò chơi Flutter hỗ trợ chơi offline tích hợp với Game Hub.',
          howToPlay: '',
        },
        ja: {
          shortDescription: 'オフライン対応のFlutterゲーム。',
          description: 'Game Hubと連携するオフライン対応のFlutterゲーム。',
          howToPlay: '',
        },
      },
    },
    assets: {
      icon: 'assets/icon.webp',
      thumbnail: 'assets/thumbnail.webp',
      screenshots: [],
    },
    web: {
      enabled: true,
      artifactUrl: null,
      buildVersion: '1.0.0',
      entrypoint: 'index.html',
      buildStrategy: 'javascript',
      orientation: 'portrait',
      aspectRatio: { width: 9, height: 16 },
      fullscreen: true,
      backgroundColor: null,
      supportsTouch: true,
      supportsKeyboard: false,
      supportsOffline: false,
      hubBridgeEnabled: true,
    },
    mobile: {
      android: { enabled: false, packageId: null, storeUrl: null, appLink: null },
      ios: { enabled: false, bundleId: null, appStoreId: null, storeUrl: null, universalLink: null },
    },
    content: {
      source: 'bundled',
      provider: 'none',
      projectRef: null,
      remoteMetadataPath: null,
      bundledContentAsset: 'assets/content/default.json',
      bundledContentVersion: '1.0.0',
      offlineFirst: true,
      syncEnabled: false,
      syncIntervalHours: 24,
    },
    features: {
      localStorage: true,
      firebaseContentSync: false,
      nativeAds: report.usesAdMob,
      webAds: false,
      playerAuthentication: false,
      hubBridge: true,
    },
    distribution: {
      installPromptEnabled: false,
      installPromptCooldownDays: 7,
      allowWebPlay: true,
    },
    integration: {
      platformPackageVersion: '1.0.0',
      bridgeProtocolVersion: '1.0.0',
    },
  };

  if (!dryRun) {
    fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
    fs.writeFileSync(manifestPath, `${JSON.stringify(template, null, 2)}\n`, 'utf8');
  }
  return { manifestPath, created: true };
}

export function validateRepoManifest(repoPath: string) {
  const manifestPath = path.join(path.resolve(repoPath), 'assets', 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    return { valid: false, errors: [`Manifest not found at ${manifestPath}`] };
  }
  const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  return validateManifest(parsed);
}

export function prepareReleaseBundle(workspaceRoot: string, repoPath: string) {
  const validation = validateRepoManifest(repoPath);
  if (!validation.valid || !validation.data) {
    throw new Error(`Invalid manifest: ${validation.errors.join('; ')}`);
  }
  const manifest = validation.data;
  const buildWebDir = path.join(path.resolve(repoPath), 'build', 'web');
  if (!fs.existsSync(buildWebDir)) {
    throw new Error(`Flutter Web build not found at ${buildWebDir}. Run "pnpm game build --id ${manifest.id}" first.`);
  }

  const outDir = path.join(
    workspaceRoot,
    'dist-releases',
    manifest.id,
    'releases',
    manifest.web.buildVersion
  );
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  fs.cpSync(buildWebDir, outDir, { recursive: true });

  // Compute deterministic SHA-256 over index.html + main.dart.js if present
  const hash = crypto.createHash('sha256');
  for (const rel of ['index.html', 'main.dart.js']) {
    const f = path.join(outDir, rel);
    if (fs.existsSync(f)) hash.update(fs.readFileSync(f));
  }
  const checksum = hash.digest('hex');

  const releaseMeta = {
    gameId: manifest.id,
    version: manifest.web.buildVersion,
    checksum,
    preparedAt: new Date().toISOString(),
    outputDir: path.relative(workspaceRoot, outDir),
    manifest,
  };
  fs.writeFileSync(
    path.join(workspaceRoot, 'registry', 'exports', `${manifest.id}-${manifest.web.buildVersion}.release.json`),
    `${JSON.stringify(releaseMeta, null, 2)}\n`,
    'utf8'
  );
  return releaseMeta;
}

export function resolveBaseHref(manifest: GameManifest, customBaseHref?: string): string {
  const baseHref = customBaseHref ?? `/${manifest.id}/releases/${manifest.web.buildVersion}/`;
  if (!baseHref.startsWith('/') || !baseHref.endsWith('/')) {
    throw new Error(`Invalid --base-href "${baseHref}": must start and end with "/" (e.g. "/" or "/${manifest.id}/releases/${manifest.web.buildVersion}/")`);
  }
  return baseHref;
}

export function buildFlutterWeb(repoPath: string, manifest: GameManifest, customBaseHref?: string) {
  const baseHref = resolveBaseHref(manifest, customBaseHref);
  const { command } = resolveFlutterCommand(repoPath);
  const cmd = `${command} build web --release --base-href ${baseHref}`;
  execSync(cmd, { cwd: path.resolve(repoPath), stdio: 'inherit' });
}
