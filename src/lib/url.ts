/**
 * Base-aware links. The site is served from /CV/ on GitHub Pages, so every
 * internal link and asset path is built here from import.meta.env.BASE_URL.
 * Never hard-code a leading "/" anywhere else.
 */
const base = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/** Site-relative path, for example url('work/apl/') returns '/CV/work/apl/'. */
export function url(path = ''): string {
  return base + path.replace(/^\/+/, '');
}

/** Absolute URL on the production origin, for canonical links, Open Graph and JSON-LD. */
export function absoluteUrl(path: string, site: URL | undefined): string {
  if (!site) {
    throw new Error('`site` must be set in astro.config.mjs to build absolute URLs.');
  }
  return new URL(url(path), site).href;
}
