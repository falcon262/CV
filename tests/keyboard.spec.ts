import { expect, test, type Page } from '@playwright/test';

// Keyboard pass (docs/brief.md, section 14): every interactive element is reachable
// with a visible focus ring, the skip link works, and the mobile sheet traps focus,
// closes on Escape and returns focus to the menu button.
test.use({ reducedMotion: 'reduce' });

interface Stop {
  tag: string;
  text: string;
  ring: boolean;
}

/** Details of the focused element, including whether a 2px focus ring is drawn. */
async function focused(page: Page): Promise<Stop | null> {
  return page.evaluate(() => {
    const element = document.activeElement as HTMLElement | null;
    if (!element || element === document.body) return null;
    const own = getComputedStyle(element);
    // Tile links draw their ring on a pseudo-element stretched over the tile.
    const stretched = getComputedStyle(element, '::after');
    const drawn = (style: CSSStyleDeclaration) => style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) >= 2;
    return {
      tag: element.tagName.toLowerCase(),
      text: (element.getAttribute('aria-label') ?? element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 50),
      ring: drawn(own) || drawn(stretched),
    };
  });
}

/** Everything a keyboard user should be able to reach, in document order. */
async function focusableCount(page: Page): Promise<number> {
  return page.evaluate(() => {
    const candidates = document.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), summary',
    );
    return Array.from(candidates).filter((element) => {
      if (element.closest('dialog:not([open]), [inert]')) return false;
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && (box.width > 0 || box.height > 0);
    }).length;
  });
}

async function tabThrough(page: Page): Promise<Stop[]> {
  const stops: Stop[] = [];
  for (let press = 0; press < 150; press += 1) {
    await page.keyboard.press('Tab');
    const stop = await focused(page);
    if (!stop) break;
    if (stops.length > 0 && stop.tag === 'a' && stop.text === 'Skip to content') break;
    stops.push(stop);
  }
  return stops;
}

test('the skip link is first and moves focus to the main content', async ({ page }) => {
  await page.goto('/CV/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  const box = await skip.boundingBox();
  expect(box && box.y >= 0).toBe(true);
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

for (const path of ['/CV/', '/CV/work/apl/']) {
  test(`every interactive element on ${path} is reachable with a visible focus ring`, async ({ page }) => {
    await page.goto(path);
    const expected = await focusableCount(page);
    const stops = await tabThrough(page);
    console.log(`${path}: ${stops.length} focus stops, first ${stops[0]?.text}, last ${stops.at(-1)?.text}`);
    const missingRing = stops.filter((stop) => !stop.ring);
    expect(missingRing, JSON.stringify(missingRing)).toEqual([]);
    expect(stops.length).toBe(expected);
  });
}

test('the mobile sheet traps focus, closes on Escape and returns focus', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The menu sheet only exists below 768px.');
  await page.goto('/CV/');
  const menu = page.getByRole('button', { name: 'Menu' });
  await menu.focus();
  await page.keyboard.press('Enter');

  const sheet = page.getByRole('dialog', { name: 'Menu' });
  await expect(sheet).toBeVisible();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');

  const insideSheet = () =>
    page.evaluate(() => Boolean(document.activeElement?.closest('dialog[open]')));
  for (let press = 0; press < 12; press += 1) {
    await page.keyboard.press('Tab');
    expect(await insideSheet()).toBe(true);
  }
  for (let press = 0; press < 12; press += 1) {
    await page.keyboard.press('Shift+Tab');
    expect(await insideSheet()).toBe(true);
  }

  await page.keyboard.press('Escape');
  await expect(sheet).toBeHidden();
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
});

test('the header comes back when it receives focus', async ({ page }) => {
  await page.goto('/CV/work/apl/');
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-site-header]')).not.toHaveClass(/is-hidden/);
});
