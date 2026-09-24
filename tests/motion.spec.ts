import { expect, test, type Page } from '@playwright/test';

// Motion behaviour from docs/brief.md, section 11. Runs against `astro preview`.
const home = '/CV/';
const caseStudy = '/CV/work/apl/';

async function heroParsing(page: Page) {
  return page.locator('.hero').evaluate((hero) => hero.classList.contains('is-parsing'));
}

test.describe('hero parse sequence', () => {
  test('plays once per session and can be replayed', async ({ page, isMobile }) => {
    await page.goto(home);
    expect(await heroParsing(page)).toBe(true);
    expect(await page.evaluate(() => sessionStorage.getItem('heroPlayed'))).toBe('1');

    // A second visit in the same session starts from the final state.
    await page.goto(caseStudy);
    await page.goto(home);
    expect(await heroParsing(page)).toBe(false);

    // Activating the record block replays it.
    const record = page.getByRole('button', { name: 'Replay the record animation' });
    await record.click();
    expect(await heroParsing(page)).toBe(true);
    const running = await page.evaluate(
      () => document.getAnimations().filter((animation) => animation.playState === 'running').length,
    );
    expect(running).toBeGreaterThan(isMobile ? 4 : 8);
  });

  test('never plays under reduced motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(home);
    expect(await heroParsing(page)).toBe(false);
    await page.getByRole('button', { name: 'Replay the record animation' }).click();
    expect(await heroParsing(page)).toBe(false);
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    await context.close();
  });
});

test('header hides on scroll down past 120px and returns on scroll up', async ({ page }) => {
  await page.goto(home);
  const header = page.locator('[data-site-header]');
  await page.mouse.wheel(0, 900);
  await expect(header).toHaveClass(/is-hidden/);
  await page.mouse.wheel(0, -200);
  await expect(header).not.toHaveClass(/is-hidden/);
});

test('theme toggle switches theme, label and stored choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto(home);
  const toggle = page.locator('[data-theme-toggle]');
  await expect(toggle).toHaveAccessibleName('Switch to dark theme');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(toggle).toHaveAccessibleName('Switch to light theme');
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');

  // Applied before first paint on the next load: no flash of the light theme.
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('copy email shows "Copied" for 1.6s and announces it', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'Clipboard permissions are Chromium-only here.');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(home);
  const button = page.getByRole('button', { name: 'Copy email' });
  await button.click();
  await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible();
  await expect(page.locator('#contact-status')).toHaveText('Email copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('thommpson19@gmail.com');
  await expect(page.getByRole('button', { name: 'Copy email' })).toBeVisible({ timeout: 3000 });
});

test('case tiles: hover lifts the media 4px and draws the title underline', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Hover effects are scoped to devices that hover.');
  await page.goto(home);
  const tile = page.locator('.tile--feature');
  await tile.scrollIntoViewIfNeeded();
  // The title link is stretched over the whole tile, so hovering anywhere on it hovers the link.
  await tile.hover({ position: { x: 24, y: 24 } });
  await page.waitForTimeout(400);
  const media = await tile.locator('.tile__media').evaluate((node) => getComputedStyle(node).transform);
  expect(media).toBe('matrix(1, 0, 0, 1, 0, -4)');
  const underline = await tile
    .locator('.tile__title-text')
    .evaluate((node) => getComputedStyle(node).backgroundSize);
  expect(underline).toMatch(/^100%/);
});

test('view transitions: tile and case study share names', async ({ page }) => {
  await page.goto(home);
  const tileNames = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>('.tile [style*="view-transition-name"]')).map(
      (node) => node.style.viewTransitionName,
    ),
  );
  expect(tileNames).toContain('work-apl-title');
  expect(tileNames).toContain('work-apl-media');
  expect(new Set(tileNames).size).toBe(tileNames.length);

  await page.goto(caseStudy);
  const pageNames = await page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>('[style*="view-transition-name"]')).map(
      (node) => node.style.viewTransitionName,
    ),
  );
  expect(pageNames.sort()).toEqual(['work-apl-media', 'work-apl-title']);
});

test('timeline and reading progress are scroll-driven', async ({ page }) => {
  await page.goto(home);
  const timelineAnimations = await page.evaluate(() =>
    document
      .getAnimations()
      .filter((animation) => (animation as CSSAnimation).animationName?.startsWith('timeline-')).length,
  );
  expect(timelineAnimations).toBe(5); // the rail and four dots

  await page.goto(caseStudy);
  const progressAt = async () =>
    page.locator('[data-progress]').evaluate((bar) => new DOMMatrix(getComputedStyle(bar).transform).a);
  expect(await progressAt()).toBeLessThan(0.05);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(progressAt).toBeGreaterThan(0.95);
});
