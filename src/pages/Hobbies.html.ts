import type { APIRoute } from 'astro';
import { redirectResponse } from '../lib/redirect';
import { absoluteUrl, url } from '../lib/url';

// Old page from the first version of the site. It now goes to the home page.
export const GET: APIRoute = ({ site }) =>
  redirectResponse(url(''), absoluteUrl('', site), 'Go to the home page');
