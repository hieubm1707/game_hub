#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {
  buildFlutterWeb,
  findWorkspaceRoot,
  initManifestTemplate,
  inspectFlutterRepo,
  loadRepositories,
  prepareReleaseBundle,
  validateRepoManifest,
} from './commands.js';

function parseArgs(argv: string[]) {
  const cleaned = argv[0] === '--' ? argv.slice(1) : argv;
  const [command = 'help', ...rest] = cleaned;
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = rest[i + 1];
      if (!next || next.startsWith('--')) {
        flags[key] = true;
      } else {
        flags[key] = next;
        i += 1;
      }
    }
  }
  return { command, flags };
}

function resolveTargetRepo(workspaceRoot: string, flags: Record<string, string | boolean>): string {
  if (typeof flags.path === 'string') return path.resolve(flags.path);
  if (typeof flags.id === 'string') {
    const repos = loadRepositories(workspaceRoot);
    const match = repos.find((r) => r.id === flags.id);
    if (!match) throw new Error(`Repository id "${flags.id}" not found in config/repositories.*.yaml`);
    return match.path;
  }
  throw new Error('Provide --id <game-id> or --path <repo-path>');
}

function main() {
  const workspaceRoot = findWorkspaceRoot();
  const { command, flags } = parseArgs(process.argv.slice(2));

  switch (command) {
    case 'list': {
      const repos = loadRepositories(workspaceRoot);
      console.log(JSON.stringify(repos, null, 2));
      break;
    }
    case 'inspect': {
      const target = resolveTargetRepo(workspaceRoot, flags);
      const report = inspectFlutterRepo(target);
      console.log(JSON.stringify(report, null, 2));
      break;
    }
    case 'init': {
      const target = resolveTargetRepo(workspaceRoot, flags);
      const res = initManifestTemplate(target, Boolean(flags['dry-run']));
      console.log(
        res.created
          ? `Manifest template ${flags['dry-run'] ? '(dry-run) would be ' : ''}created at ${res.manifestPath}`
          : `Manifest already exists at ${res.manifestPath}`
      );
      break;
    }
    case 'validate': {
      const target = resolveTargetRepo(workspaceRoot, flags);
      const res = validateRepoManifest(target);
      console.log(JSON.stringify(res, null, 2));
      if (!res.valid) process.exit(1);
      break;
    }
    case 'doctor': {
      const target = resolveTargetRepo(workspaceRoot, flags);
      const report = inspectFlutterRepo(target);
      const validation = validateRepoManifest(target);
      const ok = report.hasPubspec && report.hasWebDir && report.hasGamePlatformDep && validation.valid;
      console.log(JSON.stringify({ ok, report, manifestValidation: validation }, null, 2));
      if (!ok) process.exit(1);
      break;
    }
    case 'build': {
      const target = resolveTargetRepo(workspaceRoot, flags);
      const validation = validateRepoManifest(target);
      if (!validation.valid || !validation.data) {
        console.error('Manifest invalid:', validation.errors);
        process.exit(1);
      }
      buildFlutterWeb(target, validation.data);
      break;
    }
    case 'export-manifest': {
      const target = resolveTargetRepo(workspaceRoot, flags);
      const validation = validateRepoManifest(target);
      if (!validation.valid || !validation.data) {
        console.error('Manifest invalid:', validation.errors);
        process.exit(1);
      }
      const outPath = path.join(workspaceRoot, 'registry', 'manifests', `${validation.data.id}.manifest.json`);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, `${JSON.stringify(validation.data, null, 2)}\n`, 'utf8');
      console.log(`Exported validated manifest to ${outPath}`);
      break;
    }
    case 'prepare-release': {
      const target = resolveTargetRepo(workspaceRoot, flags);
      const meta = prepareReleaseBundle(workspaceRoot, target);
      console.log(JSON.stringify(meta, null, 2));
      break;
    }
    case 'serve': {
      const port = Number(flags.port || 8090);
      const rootDir = path.join(workspaceRoot, 'dist-releases');
      fs.mkdirSync(rootDir, { recursive: true });
      const mimeTypes: Record<string, string> = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.mjs': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.wasm': 'application/wasm',
        '.png': 'image/png',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.otf': 'font/otf',
        '.ttf': 'font/ttf',
      };
      const server = http.createServer((req, res) => {
        const reqPath = (req.url || '/').split('?')[0];
        let filePath = path.join(rootDir, reqPath);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }
        if (!fs.existsSync(filePath)) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        const ext = path.extname(filePath);
        res.writeHead(200, {
          'Content-Type': mimeTypes[ext] || 'application/octet-stream',
          'Access-Control-Allow-Origin': '*',
        });
        fs.createReadStream(filePath).pipe(res);
      });
      server.listen(port, '127.0.0.1', () => {
        console.log(`Serving static game releases from ${rootDir} at http://127.0.0.1:${port}`);
      });
      break;
    }
    case 'deploy': {
      const target = resolveTargetRepo(workspaceRoot, flags);
      const validation = validateRepoManifest(target);
      if (!validation.valid || !validation.data) {
        console.error('Manifest invalid:', validation.errors);
        process.exit(1);
      }
      const dryRun = Boolean(flags['dry-run']);
      console.log(
        JSON.stringify(
          {
            gameId: validation.data.id,
            version: validation.data.web.buildVersion,
            dryRun,
            command: `wrangler pages deploy dist-releases/${validation.data.id} --project-name=${validation.data.id}`,
            note: dryRun
              ? 'Dry-run only. No remote resources created or modified.'
              : 'Run wrangler pages deploy in an authenticated local session or CI workflow.',
          },
          null,
          2
        )
      );
      break;
    }
    default: {
      console.log(`Game Hub CLI
Usage:
  pnpm game list
  pnpm game inspect --path <repo> | --id <id>
  pnpm game init --path <repo> [--dry-run]
  pnpm game doctor --id <id>
  pnpm game validate --id <id>
  pnpm game build --id <id>
  pnpm game prepare-release --id <id>
  pnpm game export-manifest --id <id>
  pnpm game serve [--port 8090]
  pnpm game deploy --id <id> --dry-run`);
    }
  }
}

try {
  main();
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
