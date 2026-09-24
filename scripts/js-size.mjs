#!/usr/bin/env node
/**
 * npm run size
 *
 * Client JavaScript budget (docs/brief.md, section 14): under 10 KB gzipped in
 * total. Counts every inline and external script shipped in dist/ (JSON-LD is
 * data, not script, and is excluded), each unique script once.
 * Run `npm run build` first.
 */
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const budget = 10 * 1024;

if (!existsSync(path.join(dist, 'index.html'))) {
  console.error('No build found. Run `npm run build` first.');
  process.exit(1);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

const gzip = (code) => gzipSync(code, { level: 9 }).length;
const unique = new Map();

const pages = await walk(dist);
const perPage = [];
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  let pageTotal = 0;
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    const attributes = match[1];
    if (/type="application\/ld\+json"/.test(attributes)) continue;
    const source = /\ssrc="([^"]+)"/.exec(attributes)?.[1];
    const code = source ? await readFile(path.join(dist, source.replace(/^\/CV\//, '')), 'utf8') : match[2];
    const key = createHash('sha256').update(code).digest('hex');
    if (!unique.has(key)) unique.set(key, { bytes: gzip(code), label: source ?? `inline in ${path.relative(dist, file)}` });
    pageTotal += unique.get(key).bytes;
  }
  perPage.push([path.relative(dist, file), pageTotal]);
}

const total = [...unique.values()].reduce((sum, script) => sum + script.bytes, 0);
const kb = (bytes) => `${(bytes / 1024).toFixed(2)} KB`;

console.log('Client JavaScript, gzipped');
for (const [page, bytes] of perPage.sort()) console.log(`  ${page.padEnd(36)} ${kb(bytes)}`);
console.log(`\nUnique scripts: ${unique.size}. Site total: ${kb(total)} (budget ${kb(budget)}).`);
if (total >= budget) {
  console.error('Over budget.');
  process.exit(1);
}
