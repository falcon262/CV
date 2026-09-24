/**
 * npm run og
 *
 * Builds the social and icon images from the site itself:
 *   - public/og.png (1200 by 630): a screenshot of the hidden /og page
 *   - public/favicon.png (32 by 32) and public/apple-touch-icon.png (180 by 180),
 *     rendered from public/favicon.svg, with the paper colour from tokens.css
 * Run `npm run build` first, then rebuild so the new images are copied into dist/.
 * Set CHROMIUM_PATH to use a locally installed Chromium instead of Playwright's download.
 */
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const publicDir = path.join(root, 'public');
const port = Number(process.env.OG_PORT ?? 4404);
const origin = `http://localhost:${port}`;

async function token(name: string): Promise<string> {
  const css = await readFile(path.join(root, 'src', 'styles', 'tokens.css'), 'utf8');
  const match = new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6})`).exec(css);
  if (!match?.[1]) throw new Error(`Token ${name} not found in tokens.css`);
  return match[1];
}

async function icons(): Promise<void> {
  const svg = path.join(publicDir, 'favicon.svg');
  await sharp(svg, { density: 384 }).resize(32, 32).png().toFile(path.join(publicDir, 'favicon.png'));

  // Apple touch icons cannot be transparent, so the monogram sits on the paper colour.
  const monogram = await sharp(svg, { density: 1536 }).resize(132, 132).png().toBuffer();
  await sharp({ create: { width: 180, height: 180, channels: 4, background: await token('--color-paper') } })
    .composite([{ input: monogram, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
}

async function openGraph(): Promise<void> {
  if (!existsSync(path.join(root, 'dist', 'og', 'index.html'))) {
    throw new Error('No build of the /og page found. Run `npm run build` first.');
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
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
    await page.goto(`${origin}/CV/og/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(publicDir, 'og.png') });
    await browser.close();
  } finally {
    server.kill();
  }
}

await icons();
await openGraph();
console.log('Wrote public/og.png, public/favicon.png and public/apple-touch-icon.png');
