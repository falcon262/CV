#!/usr/bin/env node
/**
 * Content guard for docs/brief.md, section 3. Scans src/ only, so docs/ and
 * CLAUDE.md never trip it.
 *
 * Errors (exit 1):
 *   - em dash (U+2014), arrow (U+2192) or middle dot (U+00B7) in src/
 *   - a blocked term, whole word and case-insensitive
 *   - a hex colour outside src/styles/tokens.css
 *   - the CV PDF missing, in strict mode only (--strict, or CI=true)
 * Report:
 *   - remaining TODO(Joseph) markers, draft case studies, case study word counts
 */
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const srcDir = path.join(root, 'src');
const cvPdf = path.join(root, 'public', 'cv', 'Joseph-Kofi-Asante-CV.pdf');
const strict = process.argv.includes('--strict') || ['true', '1'].includes(String(process.env.CI).toLowerCase());

const textExtensions = new Set(['.astro', '.ts', '.js', '.mjs', '.md', '.mdx', '.css', '.json', '.svg', '.html', '.txt']);

const forbiddenCharacters = [
  { name: 'em dash (U+2014)', pattern: /—|&mdash;|&#8212;|&#x2014;|\\u2014/giu },
  { name: 'arrow (U+2192)', pattern: /→|&rarr;|&#8594;|&#x2192;|\\u2192/giu },
  { name: 'middle dot (U+00B7)', pattern: /·|&middot;|&#183;|&#xb7;|\\u00b7/giu },
];

const blockedTerms = [
  'Kubernetes',
  'AKS',
  'Docker',
  'Service Bus',
  'RabbitMQ',
  'Kafka',
  'AWS',
  'NoSQL',
  'MongoDB',
  'Cosmos DB',
  'Cognitive Services',
  'API Management',
  'Java',
  'Spring Boot',
  'lorem',
];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const blockedPattern = new RegExp(
  `(?<![\\p{L}\\p{N}_])(?:${blockedTerms.map((term) => term.split(/\s+/).map(escapeRegExp).join('\\s+')).join('|')})(?![\\p{L}\\p{N}_])`,
  'giu',
);

const hexColourPattern = /(?<![\w&])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])/giu;
const tokensFile = path.join(srcDir, 'styles', 'tokens.css');

const wordRanges = {
  apl: [350, 600],
  ecobud: [350, 600],
  'ai-reporting-engine': [350, 600],
  'e-vat': [200, 350],
  'ifrs-engines': [200, 350],
};

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (textExtensions.has(path.extname(entry.name).toLowerCase())) files.push(full);
  }
  return files;
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

function frontmatter(text) {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  return match ? { data: match[1], body: text.slice(match[0].length) } : { data: '', body: text };
}

function countWords(body) {
  const prose = body
    .replace(/^import .*$/gm, ' ')
    .replace(/^export const \w+ = `[\s\S]*?`;\s*$/gm, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<CodeBlock[\s\S]*?\/>/g, ' ')
    .replace(/\b(?:KeyDecisions|items|decision|alternative|why)\b\s*[:=]?/g, ' ')
    .replace(/[#*_`{}[\]<>/=]/g, ' ');
  return (prose.match(/[\p{L}\p{N}][\p{L}\p{N}'.,:;()%-]*/gu) ?? []).length;
}

const errors = [];
const warnings = [];
const todos = [];
const drafts = [];
const wordCounts = [];

const files = await walk(srcDir);

for (const file of files) {
  const text = await readFile(file, 'utf8');
  const relative = path.relative(root, file);

  for (const { name, pattern } of forbiddenCharacters) {
    for (const match of text.matchAll(pattern)) {
      errors.push(`${relative}:${lineOf(text, match.index)}  ${name}`);
    }
  }

  for (const match of text.matchAll(blockedPattern)) {
    errors.push(`${relative}:${lineOf(text, match.index)}  blocked term "${match[0]}"`);
  }

  if (file !== tokensFile && /\.(astro|css|ts|mdx?)$/.test(file)) {
    for (const match of text.matchAll(hexColourPattern)) {
      errors.push(`${relative}:${lineOf(text, match.index)}  hex colour ${match[0]} outside tokens.css`);
    }
  }

  for (const match of text.matchAll(/TODO\(Joseph\)[^\n]*/g)) {
    todos.push(`${relative}:${lineOf(text, match.index)}  ${match[0].trim()}`);
  }

  if (relative.startsWith(path.join('src', 'content', 'work')) && /\.mdx?$/.test(file)) {
    const { data, body } = frontmatter(text);
    const slug = /^slug:\s*['"]?([\w-]+)/m.exec(data)?.[1] ?? path.basename(file).replace(/\.mdx?$/, '');
    if (/^draft:\s*true\s*$/m.test(data)) drafts.push(`${relative} (${slug})`);
    const words = countWords(body);
    const range = wordRanges[slug];
    wordCounts.push(`${slug}: ${words} words${range ? ` (target ${range[0]} to ${range[1]})` : ''}`);
    if (range && (words < range[0] || words > range[1])) {
      warnings.push(`${relative}  ${words} words, outside ${range[0]} to ${range[1]}`);
    }
  }
}

if (!existsSync(cvPdf)) {
  const message = 'public/cv/Joseph-Kofi-Asante-CV.pdf is missing (run `npm run cv`, or add your own)';
  if (strict) errors.push(message);
  else warnings.push(message);
}

const print = (title, items) => {
  if (items.length === 0) return;
  console.log(`\n${title}`);
  for (const item of items) console.log(`  ${item}`);
};

console.log(`Content check (${strict ? 'strict' : 'local'}): scanned ${files.length} files in src/`);
print('Errors', errors);
print('Warnings', warnings);
print(`TODO(Joseph) markers: ${todos.length}`, todos);
print(`Draft case studies: ${drafts.length}`, drafts);
print('Case study word counts', wordCounts);

if (errors.length > 0) {
  console.log(`\nFailed with ${errors.length} error${errors.length === 1 ? '' : 's'}.`);
  process.exit(1);
}
console.log('\nPassed.');
