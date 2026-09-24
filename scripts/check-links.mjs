#!/usr/bin/env node
/**
 * npm run check:links
 *
 * Checks every internal link and asset reference in dist/ (href, src, srcset,
 * meta refresh, canonical and Open Graph URLs), including #fragment targets.
 * External links are listed, not fetched. Run `npm run build` first.
 *
 * The CV PDF comes from `npm run cv` (or Joseph's own file): a missing CV is a
 * warning locally and an error in strict mode (--strict, or CI=true).
 */
import { existsSync, statSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const base = '/CV/';
const origin = 'https://falcon262.github.io';
const cvPath = '/CV/cv/Joseph-Kofi-Asante-CV.pdf';
const strict = process.argv.includes('--strict') || ['true', '1'].includes(String(process.env.CI).toLowerCase());

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

/** The URL a built file is served at, for resolving relative references. */
function pageUrl(file) {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  return new URL(base + relative.replace(/(^|\/)index\.html$/, '$1'), origin);
}

/** Map a site URL to a file in dist/, or null when nothing would be served. */
function fileFor(pathname) {
  const inside = decodeURIComponent(pathname.slice(base.length));
  const candidate = path.join(dist, inside);
  if (pathname.endsWith('/')) return existsSync(path.join(candidate, 'index.html')) ? path.join(candidate, 'index.html') : null;
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  if (existsSync(path.join(candidate, 'index.html'))) return path.join(candidate, 'index.html');
  return null;
}

function references(html) {
  const found = [];
  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) found.push(match[1]);
  for (const match of html.matchAll(/\ssrcset="([^"]+)"/g)) {
    for (const candidate of match[1].split(',')) found.push(candidate.trim().split(/\s+/)[0]);
  }
  for (const match of html.matchAll(/<meta[^>]+http-equiv="refresh"[^>]+content="[^"]*url=([^"]+)"/gi)) found.push(match[1]);
  for (const match of html.matchAll(/<meta[^>]+property="og:(?:image|url)"[^>]+content="([^"]+)"/g)) found.push(match[1]);
  return found.map((value) => value.replaceAll('&amp;', '&'));
}

const idCache = new Map();
async function hasId(file, id) {
  if (!idCache.has(file)) {
    const html = await readFile(file, 'utf8');
    idCache.set(file, new Set(Array.from(html.matchAll(/\sid="([^"]+)"/g), (match) => match[1])));
  }
  return idCache.get(file).has(decodeURIComponent(id));
}

const pages = await walk(dist);
const broken = [];
const warnings = [];
const external = new Set();
let checked = 0;

for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const from = pageUrl(file);
  const label = path.relative(dist, file);

  for (const reference of references(html)) {
    if (/^(mailto|tel|data|javascript):/i.test(reference)) continue;
    const target = new URL(reference, from);
    if (target.origin !== origin) {
      external.add(target.href);
      continue;
    }
    if (!target.pathname.startsWith(base)) {
      broken.push(`${label}: ${reference} is outside ${base}`);
      continue;
    }
    checked += 1;
    const resolved = fileFor(target.pathname);
    if (!resolved) {
      if (target.pathname === cvPath) {
        (strict ? broken : warnings).push(`${label}: ${reference} (the CV PDF: run \`npm run cv\`, or add your own)`);
      } else {
        broken.push(`${label}: ${reference} does not resolve`);
      }
      continue;
    }
    if (target.hash && resolved.endsWith('.html') && !(await hasId(resolved, target.hash.slice(1)))) {
      broken.push(`${label}: ${reference} points at a missing #${target.hash.slice(1)}`);
    }
  }
}

// URLs printed on earlier CVs must keep working.
for (const legacy of ['/CV/index.html', '/CV/Hobbies.html', '/CV/ContactMe.html']) {
  checked += 1;
  if (!fileFor(legacy)) broken.push(`legacy URL ${legacy} does not resolve`);
}

console.log(`Link check (${strict ? 'strict' : 'local'}): ${pages.length} pages, ${checked} internal references`);
if (warnings.length > 0) {
  console.log('\nWarnings');
  for (const warning of [...new Set(warnings)]) console.log(`  ${warning}`);
}
console.log(`\nExternal links (not fetched): ${external.size}`);
for (const link of [...external].sort()) console.log(`  ${link}`);
if (broken.length > 0) {
  console.log('\nBroken');
  for (const item of [...new Set(broken)]) console.log(`  ${item}`);
  process.exit(1);
}
console.log('\nNo broken internal links.');
