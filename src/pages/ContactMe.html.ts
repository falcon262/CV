import type { APIRoute } from 'astro';
import { redirectResponse } from '../lib/redirect';
import { absoluteUrl, url } from '../lib/url';

// Old page from the first version of the site. It now goes to the contact section.
export const GET: APIRoute = ({ site }) =>
  redirectResponse(url('#contact'), absoluteUrl('#contact', site), 'Go to the contact section');
