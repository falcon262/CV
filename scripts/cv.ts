/**
 * npm run cv
 *
 * Prints the hidden /cv-print page to public/cv/Joseph-Kofi-Asante-CV.pdf: A4,
 * real text with embedded fonts, clickable links, tagged for screen readers,
 * with bookmarks from the headings. The wording comes from src/data/cv.ts and
 * the site's other data files, so the CV never says more than the site.
 * Run `npm run build` first, then rebuild so the new PDF is copied into dist/.
 * To use a CV you wrote yourself instead, replace the PDF at the same path.
 * Set CHROMIUM_PATH to use a locally installed Chromium instead of Playwright's download.
 */
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'public', 'cv', 'Joseph-Kofi-Asante-CV.pdf');
const port = Number(process.env.CV_PORT ?? 4405);
const origin = `http://localhost:${port}`;

if (!existsSync(path.join(root, 'dist', 'cv-print', 'index.html'))) {
  throw new Error('No build of the /cv-print page found. Run `npm run build` first.');
}

const astro = path.join(root, 'node_modules', '.bin', 'astro');
// --ignore-lock keeps the server in the foreground so it stops with this script.
const server = spawn(astro, ['preview', '--port', String(port), '--ignore-lock'], { cwd: root, stdio: 'ignore' });
try {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(`${origin}/CV/`)).ok) break;
    } catch {
      // not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const page = await browser.newPage();
  await page.goto(`${origin}/CV/cv-print/`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  await mkdir(path.dirname(output), { recursive: true });
  await page.pdf({
    path: output,
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
    outline: true,
  });
  await browser.close();
} finally {
  server.kill();
}

console.log(`Wrote ${path.relative(root, output)}`);
