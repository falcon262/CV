// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Served as a GitHub Pages project site: https://falcon262.github.io/CV/
// Every internal link goes through src/lib/url.ts so the /CV base is never hard-coded.
export default defineConfig({
  site: 'https://falcon262.github.io',
  base: '/CV',
  trailingSlash: 'always',
  output: 'static',
  build: {
    format: 'directory',
  },
  devToolbar: {
    enabled: false,
  },
  markdown: {
    // Token colours only: --astro-code-* variables are mapped to tokens in CodeBlock.
    shikiConfig: {
      theme: 'css-variables',
    },
  },
  integrations: [
    mdx(),
    sitemap({
      // The OG capture page and the 404 page are not content.
      filter: (page) => !/\/og\/$/.test(page) && !/\/404\/?$/.test(page),
    }),
  ],
});
