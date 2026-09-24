import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/url';

// Note: crawlers only read robots.txt at the host root, so on a project site
// this file is informational. The sitemap is also linked from every page head.
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('sitemap-index.xml', site)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
