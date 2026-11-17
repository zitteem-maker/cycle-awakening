// Images du blog :
//   npm run images
// 1. Variantes légères des photos (srcset des en-têtes) : public/images/blog/<nom>-640.webp et -960.webp
// 2. Cartes de partage 1200×630 (og:image, Pinterest, WhatsApp…) : public/images/share/blog/<id>.jpg
//    Titre de l'article en typographie de la marque + photo, rendues par Chromium.
// À relancer quand une photo ou un titre d'article change, puis à committer les fichiers produits.
import sharp from 'sharp';
import YAML from 'js-yaml';
import { chromium } from 'playwright-core';
import { readdirSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const racine = fileURLToPath(new URL('../', import.meta.url));
const blog = `${racine}public/images/blog/`;
const partage = `${racine}public/images/share/blog/`;
mkdirSync(partage, { recursive: true });

// 1. Variantes de largeur
const bases = readdirSync(blog).filter((f) => /^[a-z0-9-]+\.webp$/.test(f) && !/-(640|960)\.webp$/.test(f));
for (const f of bases) {
  for (const largeur of [640, 960]) {
    await sharp(`${blog}${f}`).resize({ width: largeur, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`${blog}${f.replace('.webp', `-${largeur}.webp`)}`);
  }
}
console.log(`${bases.length} photos : variantes 640 et 960 px`);

// 2. Cartes de partage
const lire = (chemin) => {
  const m = readFileSync(chemin, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  return YAML.load(m[1]);
};
const articles = [];
for (const [dossier, prefixe] of [['src/content/blog', ''], ['src/content/blog/en', 'en-']]) {
  for (const f of readdirSync(`${racine}${dossier}`).filter((x) => x.endsWith('.md'))) {
    const d = lire(`${racine}${dossier}/${f}`);
    if (d.photo) articles.push({ id: `${prefixe}${f.replace('.md', '')}`, titre: d.seoTitle ?? d.title, photo: d.photo, lang: d.lang ?? 'fr', pilier: d.pillar });
  }
}
const piliers = {
  fr: { 'phase-luteale': 'Phase lutéale et SPM', alimentation: 'Alimentation et cycle', sport: 'Sport et cycle', sopk: 'SOPK', endometriose: 'Endométriose', perimenopause: 'Périménopause' },
  en: { 'phase-luteale': 'Luteal phase and PMS', alimentation: 'Food and your cycle', sport: 'Exercise and your cycle', sopk: 'PCOS', endometriose: 'Endometriosis', perimenopause: 'Perimenopause' },
};
const police = (p) => pathToFileURL(`${racine}node_modules/@fontsource/${p}`).href;
const logo = readFileSync(`${racine}public/brand/logo-clair.svg`, 'utf8');
const tailles = (titre) => (titre.length > 52 ? 50 : titre.length > 38 ? 58 : 66);

const cache = `${racine}node_modules/.cache/og/`;
mkdirSync(cache, { recursive: true });
const navigateur = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
const page = await navigateur.newPage({ viewport: { width: 1200, height: 630 } });
for (const a of articles) {
  const photo = pathToFileURL(`${blog}${a.photo}`).href;
  const html = `<!doctype html><meta charset="utf-8"><style>
    @font-face{font-family:'Cormorant';font-weight:500;src:url(${police('cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2')})}
    @font-face{font-family:'Inter';font-weight:500;src:url(${police('inter/files/inter-latin-500-normal.woff2')})}
    *{margin:0;box-sizing:border-box} body{width:1200px;height:630px;position:relative;overflow:hidden;background:linear-gradient(160deg,#1f3a2e,#122219);color:#f7f4ef}
    .photo{position:absolute;right:0;top:0;width:640px;height:630px;background:url(${photo}) center/cover;
      -webkit-mask-image:linear-gradient(90deg,transparent 0,rgba(0,0,0,.6) 28%,#000 58%)}
    .logo{position:absolute;left:64px;top:52px;width:250px}.logo svg{width:100%;height:auto}
    .texte{position:absolute;left:64px;top:170px;width:540px}
    .pilier{font:500 20px Inter;letter-spacing:.16em;text-transform:uppercase;color:#b9cdc2;margin-bottom:22px}
    h1{font:500 ${tailles(a.titre)}px/1.08 Cormorant;letter-spacing:-.01em}
    .site{position:absolute;left:64px;bottom:48px;font:500 20px Inter;letter-spacing:.12em;color:#e0457d}
  </style><div class="photo"></div><div class="logo">${logo}</div>
  <div class="texte"><p class="pilier">${piliers[a.lang][a.pilier] ?? ''}</p><h1>${a.lang === 'fr' ? a.titre.replace(/ ([:;!?»])/g, '&nbsp;$1') : a.titre}</h1></div><p class="site">cycleawakening.com</p>`;
  // Fichier temporaire : Chromium ne charge photo et polices locales que depuis une page file://.
  const temp = `${cache}${a.id}.html`;
  writeFileSync(temp, html);
  await page.goto(pathToFileURL(temp).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${partage}${a.id}.jpg`, type: 'jpeg', quality: 84 });
}
await navigateur.close();
console.log(`${articles.length} cartes de partage`);
