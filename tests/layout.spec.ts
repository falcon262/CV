import { expect, test } from '@playwright/test';

// Nothing may scroll sideways at any common width (docs/brief.md, section 14). The record
// block is the only element allowed to overflow, and only inside its own scroll container.
const routes = ['/CV/', '/CV/work/apl/', '/CV/work/ecobud/', '/CV/work/ai-reporting-engine/', '/CV/work/e-vat/', '/CV/work/ifrs-engines/'];
const widths = [1920, 1440, 1366, 1280, 1024, 768, 390];

test.use({ reducedMotion: 'reduce' });

for (const width of widths) {
  test(`no horizontal overflow at ${width}px`, async ({ page, isMobile }) => {
    test.skip(isMobile, 'Widths are set explicitly; the desktop project covers them.');
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      const overflow = await page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth - root.clientWidth;
      });
      expect(overflow, `${route} at ${width}px`).toBeLessThanOrEqual(0);

      // The record block must fit its column wherever it is not a scroll container.
      if (route === '/CV/' && width >= 768) {
        const fits = await page.locator('[data-record]').evaluate((record) => {
          const button = record.querySelector('button');
          return !!button && button.getBoundingClientRect().right <= document.documentElement.clientWidth;
        });
        expect(fits, `record block fits at ${width}px`).toBe(true);
      }
    }
  });
}
