// Génère le logo de Cycle Awakening en SVG vectorisé (texte converti en tracés, aucune police requise).
// Composition validée : « cycle » manuscrit fuchsia (Sacramento) posé en travers de « AWAKENING » Art déco (Limelight).
// Sorties : public/brand/*.svg, public/favicon.svg, src/components/Logo.astro.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import { loadTokens, flatten } from './tokens-lib.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const t = flatten(loadTokens());
const VERT = t['color-profondeur-vert-bouteille'];
const CREME = t['color-base-creme'];
const FUCHSIA = t['color-accent-fuchsia'];

const load = (pkg, file) => opentype.parse(readFileSync(`${root}node_modules/@fontsource/${pkg}/files/${file}`).buffer);
const deco = load('limelight', 'limelight-latin-400-normal.woff');
const script = load('sacramento', 'sacramento-latin-400-normal.woff');

const f = (n) => n.toFixed(2);
// Sérialisation maison : toPathData() d'opentype.js produit parfois « NaN » à l'arrondi.
function pathData(path) {
  return path.commands.map((c) => {
    if (c.type === 'Z') return 'Z';
    if (c.type === 'Q') return `Q${f(c.x1)} ${f(c.y1)} ${f(c.x)} ${f(c.y)}`;
    if (c.type === 'C') return `C${f(c.x1)} ${f(c.y1)} ${f(c.x2)} ${f(c.y2)} ${f(c.x)} ${f(c.y)}`;
    return `${c.type}${f(c.x)} ${f(c.y)}`;
  }).join('');
}

// Texte posé sur une ligne de base, avec approche (tracking) en unités.
function setText(font, text, size, x0, baseline, tracking = 0) {
  let x = x0;
  const parts = [];
  const starts = [];
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    starts.push(x);
    parts.push(pathData(g.getPath(x, baseline, size)));
    x += (g.advanceWidth / font.unitsPerEm) * size + tracking;
  }
  return { d: parts.join(''), end: x - tracking, starts };
}

// --- Composition (repère arbitraire, recadré ensuite sur la boîte englobante) ----------------
const CAP = 100; // corps de AWAKENING
const capHeight = ((deco.tables.os2.sCapHeight || deco.unitsPerEm * 0.7) / deco.unitsPerEm) * CAP;
const word = setText(deco, 'AWAKENING', CAP, 0, 0, CAP * 0.04);
// « cycle » démarre au-dessus du second A, sa ligne de base coupe le haut des capitales (comme les références).
const SCRIPT = CAP * 1.42;
const cycleX = word.starts[2] + CAP * 0.02;
const cycleBaseline = -capHeight * 0.88;
const cycle = setText(script, 'cycle', SCRIPT, cycleX, cycleBaseline);

// Boîte englobante approchée à partir des points des tracés (paires x y).
function bbox(...ds) {
  let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
  for (const d of ds) {
    const n = d.match(/-?\d+(\.\d+)?/g).map(Number);
    for (let i = 0; i + 1 < n.length; i += 2) {
      x1 = Math.min(x1, n[i]); x2 = Math.max(x2, n[i]);
      y1 = Math.min(y1, n[i + 1]); y2 = Math.max(y2, n[i + 1]);
    }
  }
  return { x1, y1, x2, y2 };
}

const PAD = 6;
const bb = bbox(word.d, cycle.d);
const vb = `${f(bb.x1 - PAD)} ${f(bb.y1 - PAD)} ${f(bb.x2 - bb.x1 + 2 * PAD)} ${f(bb.y2 - bb.y1 + 2 * PAD)}`;

const svg = (wordColor, cycleColor, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="Cycle Awakening"${extra}><title>Cycle Awakening</title>` +
  `<path d="${word.d}" fill="${wordColor}"/><path d="${cycle.d}" fill="${cycleColor}"/></svg>\n`;

const out = `${root}public/brand/`;
mkdirSync(out, { recursive: true });
writeFileSync(`${out}logo.svg`, svg(VERT, FUCHSIA)); // sur fond clair
writeFileSync(`${out}logo-clair.svg`, svg(CREME, FUCHSIA)); // sur fond vert bouteille
writeFileSync(`${out}logo-monochrome-vert.svg`, svg(VERT, VERT));
writeFileSync(`${out}logo-monochrome-creme.svg`, svg(CREME, CREME));

// --- Monogramme (favicon, avatar réseaux) : le « A » Art déco du logo, souligné d'un filet fuchsia --
const A = setText(deco, 'A', 48, 0, 0);
const aBox = bbox(A.d);
const ax = 32 - (aBox.x1 + aBox.x2) / 2;
const ay = 33 - (aBox.y1 + aBox.y2) / 2;
const mono = (bg, fg, radius) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Cycle Awakening"><title>Cycle Awakening</title>` +
  `<rect width="64" height="64" rx="${radius}" fill="${bg}"/>` +
  `<path transform="translate(${f(ax)} ${f(ay)})" d="${A.d}" fill="${fg}"/>` +
  `<rect x="18" y="52" width="28" height="1.6" fill="${FUCHSIA}"/></svg>\n`;
writeFileSync(`${out}monogramme.svg`, mono(VERT, CREME, 0));
writeFileSync(`${out}monogramme-clair.svg`, mono(CREME, VERT, 0));
writeFileSync(`${root}public/favicon.svg`, mono(VERT, CREME, 14));

// --- Composant Astro inline : le mot hérite de currentColor, « cycle » reste fuchsia --------
const inline = svg('currentColor', 'var(--semantic-accent)').replace('<svg ', '<svg class={className} ');
writeFileSync(`${root}src/components/Logo.astro`,
  `---\n// Généré par \`npm run logo\` — ne pas modifier à la main.\ninterface Props { class?: string }\nconst { class: className } = Astro.props;\n---\n${inline}`);

console.log('logo : public/brand/*.svg, public/favicon.svg, src/components/Logo.astro');
