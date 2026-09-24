import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Axe on every route, in both themes (docs/brief.md, section 14).
// Hard bar: zero serious or critical violations. Everything axe reports is printed.
const routes = [
  { name: 'home', path: '/CV/' },
  { name: 'apl', path: '/CV/work/apl/' },
  { name: 'ecobud', path: '/CV/work/ecobud/' },
  { name: 'ai-reporting-engine', path: '/CV/work/ai-reporting-engine/' },
  { name: 'e-vat', path: '/CV/work/e-vat/' },
  { name: 'ifrs-engines', path: '/CV/work/ifrs-engines/' },
  { name: '404', path: '/CV/this-page-does-not-exist/' },
];

const themes = ['light', 'dark'] as const;

for (const theme of themes) {
  test.describe(`${theme} theme`, () => {
    test.use({ colorScheme: theme, reducedMotion: 'reduce' });

    for (const route of routes) {
      test(`${route.name} has no serious or critical axe violations`, async ({ page }) => {
        await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
        await page.goto(route.path);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze();

        for (const violation of results.violations) {
          console.log(
            `[${theme}] ${route.name}: ${violation.impact} ${violation.id} (${violation.nodes.length}) ${violation.help}`,
          );
        }

        const blocking = results.violations.filter(
          (violation) => violation.impact === 'serious' || violation.impact === 'critical',
        );
        expect(blocking, JSON.stringify(blocking.map((violation) => violation.id))).toEqual([]);
      });
    }
  });
}
