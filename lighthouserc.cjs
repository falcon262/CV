// Lighthouse CI (docs/brief.md, section 14): the home page and one case study,
// with Lighthouse's default mobile configuration (emulated phone, throttled network and CPU).
// Hard bar: 95 or more for Performance, Accessibility, Best Practices and SEO.
// Set CHROME_PATH to use a locally installed Chrome or Chromium.
const port = 4403;

module.exports = {
  ci: {
    collect: {
      // --ignore-lock keeps `astro preview` in the foreground so LHCI can stop it.
      startServerCommand: `npm run preview -- --port ${port} --ignore-lock`,
      startServerReadyPattern: `localhost:${port}`,
      startServerReadyTimeout: 60000,
      url: [`http://localhost:${port}/CV/`, `http://localhost:${port}/CV/work/apl/`],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95, aggregationMethod: 'median-run' }],
        'categories:accessibility': ['error', { minScore: 0.95, aggregationMethod: 'median-run' }],
        'categories:best-practices': ['error', { minScore: 0.95, aggregationMethod: 'median-run' }],
        'categories:seo': ['error', { minScore: 0.95, aggregationMethod: 'median-run' }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
