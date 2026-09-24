/**
 * Self-hosted variable fonts from npm, latin subset only, font-display: swap.
 * The ?url imports give hashed asset URLs, so the preload and the @font-face
 * source always point at the same file.
 */
import schibstedGrotesk from '@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2?url';
import sourceSerif4 from '@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2?url';
import jetbrainsMono from '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2?url';
import schibstedGrotesk500 from '@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-500-normal.woff2?url';
import schibstedGrotesk700 from '@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-700-normal.woff2?url';

const latinRange =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

const faces = [
  { family: 'Schibsted Grotesk Variable', weight: '400 900', src: schibstedGrotesk },
  { family: 'Source Serif 4 Variable', weight: '200 900', src: sourceSerif4 },
  { family: 'JetBrains Mono Variable', weight: '100 800', src: jetbrainsMono },
];

/** The only preloaded font: the Schibsted Grotesk file used by the hero headline. */
export const preloadFont = schibstedGrotesk;

export const fontFaceCss = faces
  .map(
    (face) =>
      `@font-face{font-family:"${face.family}";font-style:normal;font-display:swap;font-weight:${face.weight};src:url("${face.src}") format("woff2-variations");unicode-range:${latinRange}}`,
  )
  .join('');

/**
 * The printable CV only. Chromium's PDF output draws variable fonts as Type 3
 * glyph shapes, which some applicant tracking systems read poorly, so the CV
 * uses the static 500 and 700 cuts. They take the display family's name, so
 * the page still sets its type through the tokens.
 */
export const printFontFaceCss = [
  { weight: 500, src: schibstedGrotesk500 },
  { weight: 700, src: schibstedGrotesk700 },
]
  .map(
    (face) =>
      `@font-face{font-family:"Schibsted Grotesk Variable";font-style:normal;font-display:block;font-weight:${face.weight};src:url("${face.src}") format("woff2");unicode-range:${latinRange}}`,
  )
  .join('');
