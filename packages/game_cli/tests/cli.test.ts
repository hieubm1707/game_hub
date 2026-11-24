import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  detectFvmFlutterVersion,
  findWorkspaceRoot,
  inspectFlutterRepo,
  loadRepositories,
  resolveFlutterCommand,
  validateRepoManifest,
} from '../src/commands.js';

describe('game_cli', () => {
  const root = findWorkspaceRoot(path.resolve(import.meta.dirname, '../../..'));

  it('lists configured repositories and resolves paths', () => {
    const repos = loadRepositories(root, { ignoreLocal: true });
    expect(repos.length).toBeGreaterThan(0);
    for (const repo of repos) {
      expect(repo.id.length).toBeGreaterThan(0);
      expect(path.isAbsolute(repo.path)).toBe(true);
    }
  });

  it('inspects iq_puzzle_fixture cleanly with zero warnings', () => {
    const fixturePath = path.join(root, 'fixtures/games/iq_puzzle_fixture');
    const report = inspectFlutterRepo(fixturePath);
    expect(report.hasPubspec).toBe(true);
    expect(report.hasWebDir).toBe(true);
    expect(report.hasManifest).toBe(true);
    expect(report.hasGamePlatformDep).toBe(true);
    expect(report.usesFvm).toBe(false);
    expect(report.fvmFlutterVersion).toBeNull();
    expect(report.flutterCommand).toBe('flutter');
    expect(report.bundledContentExists).toBe(true);
    expect(report.warnings).toEqual([]);
  });

  it('detects .fvmrc and resolves fvm flutter command', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'game-cli-fvm-'));
    try {
      expect(detectFvmFlutterVersion(tmpDir)).toBeNull();
      expect(resolveFlutterCommand(tmpDir)).toEqual({
        command: 'flutter',
        usesFvm: false,
        fvmVersion: null,
      });

      fs.writeFileSync(path.join(tmpDir, '.fvmrc'), JSON.stringify({ flutter: '3.29.2' }), 'utf8');
      expect(detectFvmFlutterVersion(tmpDir)).toBe('3.29.2');
      expect(resolveFlutterCommand(tmpDir)).toEqual({
        command: 'fvm flutter',
        usesFvm: true,
        fvmVersion: '3.29.2',
      });
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it('validates both fixture manifests against schema v2.0.0', () => {
    const r1 = validateRepoManifest(path.join(root, 'fixtures/games/iq_puzzle_fixture'));
    const r2 = validateRepoManifest(path.join(root, 'fixtures/games/memory_match_fixture'));
    expect(r1.valid).toBe(true);
    expect(r2.valid).toBe(true);
  });
});
