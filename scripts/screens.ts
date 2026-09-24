/**
 * npm run screens
 *
 * Full-page screenshots of every built route at 1440, 768 and 390, in light and
 * dark, with reduced motion on (so every page shows its final state), plus hero
 * keyframes at 0, 300, 700, 1100 and 1700ms with motion on, at 1440 light.
 * Output goes to .screens/ (gitignored). Run `npm run build` first.
 *
 * Options: --only=home,work-apl  --widths=1440,390  --themes=light  --no-hero  --hero-only
 * Set CHROMIUM_PATH to use a locally installed Chromium instead of Playwright's download.
 */
import { chromium, type Browser, type Page } from '@playwright/test';
import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

type Theme = 'light' | 'dark';
interface Route {
  name: string;
  path: string;
}

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const outDir = path.join(root, '.screens');
const port = Number(process.env.SCREENS_PORT ?? 4401);
const origin = `http://localhost:${port}`;
const base = '/CV/';

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = 'true'] = arg.replace(/^--/, '').split('=');
    return [key, value] as const;
  }),
);
const list = (key: string, fallback: string[]) => (args.get(key)?.split(',').filter(Boolean) ?? fallback);

const widths = list('widths', ['1440', '768', '390']).map(Number);
const themes = list('themes', ['light', 'dark']) as Theme[];
const only = args.get('only')?.split(',');
const heroFrames = [0, 300, 700, 1100, 1700];

async function discoverRoutes(): Promise<Route[]> {
  const routes: Route[] = [{ name: 'home', path: '' }];
  const workDir = path.join(dist, 'work');
  if (existsSync(workDir)) {
    const order = ['apl', 'ecobud', 'ai-reporting-engine', 'e-vat', 'ifrs-engines'];
    const slugs = (await readdir(workDir)).sort((a, b) => order.indexOf(a) - order.indexOf(b));
    for (const slug of slugs) routes.push({ name: `work-${slug}`, path: `work/${slug}/` });
  }
  routes.push({ name: '404', path: 'this-page-does-not-exist/' });
  return only ? routes.filter((route) => only.includes(route.name)) : routes;
}

async function startPreview(): Promise<ChildProcess> {
  const astro = path.join(root, 'node_modules', '.bin', 'astro');
  // --ignore-lock keeps the server in the foreground so it stops with this script.
  const server = spawn(astro, ['preview', '--port', String(port), '--ignore-lock'], { cwd: root, stdio: 'ignore' });
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(origin + base);
      if (response.ok) return server;
    } catch {
      // not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  server.kill();
  throw new Error(`astro preview did not start on port ${port}`);
}

/** Scroll through the page so lazy images load, then return to the top. */
async function settle(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await document.fonts.ready;
    const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
    await Promise.all(
      Array.from(document.images)
        .filter((image) => !image.complete)
        .map((image) => new Promise((resolve) => image.addEventListener('load', resolve, { once: true }))),
    );
  });
  await page.waitForTimeout(150);
}

async function captureRoutes(browser: Browser, routes: Route[]): Promise<string[]> {
  const written: string[] = [];
  for (const theme of themes) {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: 'reduce',
        colorScheme: theme,
      });
      await context.addInitScript((value) => localStorage.setItem('theme', value), theme);
      const page = await context.newPage();
      for (const route of routes) {
        await page.goto(origin + base + route.path, { waitUntil: 'networkidle' });
        await settle(page);
        const file = path.join(outDir, `${route.name}-${width}-${theme}.png`);
        await page.screenshot({ path: file, fullPage: true });
        written.push(file);
      }
      await context.close();
    }
  }
  return written;
}

async function captureHero(browser: Browser): Promise<string[]> {
  const written: string[] = [];
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'no-preference',
    colorScheme: 'light',
  });
  await context.addInitScript(() => localStorage.setItem('theme', 'light'));
  const page = await context.newPage();
  await page.goto(origin + base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  for (const time of heroFrames) {
    // Freeze every running animation at the same moment of the sequence.
    await page.evaluate((ms) => {
      for (const animation of document.getAnimations()) {
        animation.pause();
        animation.currentTime = ms;
      }
    }, time);
    const file = path.join(outDir, `hero-${String(time).padStart(4, '0')}ms.png`);
    await page.screenshot({ path: file });
    written.push(file);
  }
  await context.close();
  return written;
}

if (!existsSync(path.join(dist, 'index.html'))) {
  console.error('No build found. Run `npm run build` first.');
  process.exit(1);
}

await mkdir(outDir, { recursive: true });
const server = await startPreview();
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });

try {
  const written: string[] = [];
  if (!args.has('hero-only')) written.push(...(await captureRoutes(browser, await discoverRoutes())));
  if (!args.has('no-hero') && (!only || only.includes('home'))) written.push(...(await captureHero(browser)));
  console.log(`Saved ${written.length} screenshots to .screens/`);
} finally {
  await browser.close();
  server.kill();
}
