/**
 * Static redirect page for old URLs that are printed on earlier CVs.
 * GitHub Pages cannot send HTTP redirects, so this uses a meta refresh,
 * a canonical link and a plain fallback link.
 */
export function redirectResponse(target: string, absoluteTarget: string, label: string): Response {
  const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Redirecting</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${absoluteTarget}">
<meta http-equiv="refresh" content="0; url=${target}">
</head>
<body>
<p><a href="${target}">${label}</a></p>
</body>
</html>
`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
