#!/usr/bin/env node
// Produce a reviewable package snapshot without touching a consumer checkout.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = process.argv[2];
if (!output || process.argv.length !== 3) {
  console.error('Usage: npm run snapshot -- /absolute/path/to/new-snapshot-directory');
  process.exit(1);
}
const run = (command, args) => execFileSync(command, args, { cwd: root, encoding: 'utf8' }).trim();
// Never overwrite an earlier snapshot. Build and validate before running this.
const destination = resolve(output);
mkdirSync(destination, { recursive: false });
const revision = run('git', ['rev-parse', 'HEAD']);
const status = run('git', ['status', '--porcelain']);
const [packed] = JSON.parse(run('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', destination]));
const archive = readFileSync(resolve(destination, packed.filename));
writeFileSync(resolve(destination, 'SOURCE.json'), JSON.stringify({
  package: packed.name,
  version: packed.version,
  repository: JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).repository.url,
  revision,
  dirty: status.length > 0,
  archive: packed.filename,
  sha256: createHash('sha256').update(archive).digest('hex'),
}, null, 2) + '\n');
console.log(`Snapshot: ${destination}/${packed.filename}`);
console.log(`Source: ${revision}${status ? ' (contains uncommitted changes; do not label as a clean release)' : ''}`);
