// Génère le logo de Cycle Awakening en SVG vectorisé (texte converti en tracés, aucune police requise).
// Marque : un cercle (le cycle) qui s'ouvre, et un point or doux qui s'en dégage (l'éveil).
// Sorties dans public/brand/ ; le favicon (public/favicon.svg) est aussi régénéré.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import { loadTokens, flatten } from './tokens-lib.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const t = flatten(loadTokens());
const NUIT = t['color-nuit-bleu-nuit'];
const CREME = t['color-base-creme-sable'];
const OR = t['color-accent-or-doux'];

const font = opentype.parse(readFileSync(`${root}node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff`).buffer);

// --- Marque (repère 64×64) ---------------------------------------------------
const C = 32, R = 18, GAP_CENTER = -45, GAP_HALF = 32; // degrés
const pt = (deg, r = R) => [C + r * Math.cos((deg * Math.PI) / 180), C + r * Math.sin((deg * Math.PI) / 180)];
const [sx, sy] = pt(GAP_CENTER + GAP_HALF);
const [ex, ey] = pt(GAP_CENTER - GAP_HALF);
const [dx, dy] = pt(GAP_CENTER, R + 3); // le point sort légèrement du cercle : l'éveil
const f = (n) => n.toFixed(2);
const ring = `M${f(sx)} ${f(sy)}A${R} ${R} 0 1 1 ${f(ex)} ${f(ey)}`;

function mark(ringColor, { stroke = 2.6, dot = 5.2 } = {}) {
  return `<path d="${ring}" fill="none" stroke="${ringColor}" stroke-width="${stroke}" stroke-linecap="round"/>` +
    `<circle cx="${f(dx)}" cy="${f(dy)}" r="${dot}" fill="${OR}"/>`;
}

// --- Nom (tracés) --------------------------------------------------------------
// Sérialisation maison : toPathData() d'opentype.js produit parfois « NaN » à l'arrondi.
function pathData(path) {
  return path.commands.map((c) => {
    if (c.type === 'Z') return 'Z';
    if (c.type === 'Q') return `Q${f(c.x1)} ${f(c.y1)} ${f(c.x)} ${f(c.y)}`;
    if (c.type === 'C') return `C${f(c.x1)} ${f(c.y1)} ${f(c.x2)} ${f(c.y2)} ${f(c.x)} ${f(c.y)}`;
    return `${c.type}${f(c.x)} ${f(c.y)}`;
  }).join('');
}
function word(text, size, tracking) {
  // Lettres capitales espacées : élégant et lisible en petit.
  let x = 0;
  const parts = [];
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    const p = glyph.getPath(x, 0, size);
    parts.push(pathData(p));
    x += (glyph.advanceWidth / font.unitsPerEm) * size + (ch === ' ' ? tracking * 1.6 : tracking);
  }
  const bb = font.getPath(text, 0, 0, size).getBoundingBox();
  return { d: parts.join(''), width: x - tracking, ascent: -bb.y1, descent: bb.y2 };
}

const NAME = 'CYCLE AWAKENING';
const svg = (w, h, body, title = 'Cycle Awakening') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(w)} ${f(h)}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

function horizontal(textColor, ringColor) {
  const size = 30, tracking = 5.4;
  const w = word(NAME, size, tracking);
  const markSize = 64, gap = 18;
  const textY = markSize / 2 + w.ascent / 2;
  const width = markSize + gap + w.width;
  return svg(width, markSize,
    `<g>${mark(ringColor)}</g><path transform="translate(${markSize + gap} ${f(textY)})" d="${w.d}" fill="${textColor}"/>`);
}

function stacked(textColor, ringColor) {
  const size = 26, tracking = 4.6;
  const w = word(NAME, size, tracking);
  const width = Math.max(w.width, 96) + 8;
  const scale = 1.5;
  const markW = 64 * scale;
  const textTop = markW + 14;
  const height = textTop + w.ascent + 6;
  return svg(width, height,
    `<g transform="translate(${f((width - markW) / 2)} 0) scale(${scale})">${mark(ringColor)}</g>` +
    `<path transform="translate(${f((width - w.width) / 2)} ${f(textTop + w.ascent)})" d="${w.d}" fill="${textColor}"/>`);
}

const out = `${root}public/brand/`;
mkdirSync(out, { recursive: true });
writeFileSync(`${out}logo-horizontal.svg`, horizontal(NUIT, NUIT));
writeFileSync(`${out}logo-horizontal-clair.svg`, horizontal(CREME, CREME));
writeFileSync(`${out}logo-vertical.svg`, stacked(NUIT, NUIT));
writeFileSync(`${out}logo-vertical-clair.svg`, stacked(CREME, CREME));
writeFileSync(`${out}marque.svg`, svg(64, 64, mark(NUIT)));
writeFileSync(`${out}marque-clair.svg`, svg(64, 64, mark(CREME)));

// Favicon : marque claire sur pastille bleu nuit, trait épaissi pour rester lisible à 16 px.
writeFileSync(`${root}public/favicon.svg`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${NUIT}"/>` +
  `${mark(CREME, { stroke: 4, dot: 6.5 })}</svg>\n`);

// Composant Astro du logo (inline, hérite de currentColor pour le texte et l'anneau).
const inline = horizontal('currentColor', 'currentColor').replace('<svg ', '<svg class={className} ');
writeFileSync(`${root}src/components/Logo.astro`,
  `---\n// Généré par \`npm run logo\` — ne pas modifier à la main.\ninterface Props { class?: string }\nconst { class: className } = Astro.props;\n---\n${inline}`);

console.log('logo : public/brand/*.svg, public/favicon.svg, src/components/Logo.astro');
