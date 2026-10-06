// Fabrication du livre PDF Cycle Awakening.
//   npm run build:book            → version finale (refuse tout chapitre non validé ou toute source non vérifiée)
//   npm run build:book:brouillon  → version de travail, filigrane « brouillon », n'écrit pas book-meta.json
// Sorties : book/dist/cycle-awakening-guide.pdf (version écran, outils en annexe)
//           book/dist/cycle-awakening-outils-imprimables.pdf (outils seuls, pour l'impression)
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { marked } from 'marked';
import { chromium } from 'playwright-core';
import { PDFDocument } from 'pdf-lib';

const root = fileURLToPath(new URL('../', import.meta.url));
const book = `${root}book/`;
const dist = `${book}dist/`;
const draft = process.argv.includes('--brouillon');

const livre = JSON.parse(readFileSync(`${book}livre.json`, 'utf8'));
const tokens = JSON.parse(readFileSync(`${root}design-tokens/dist/tokens.json`, 'utf8'));
const tokensCss = readFileSync(`${root}design-tokens/dist/tokens.css`, 'utf8');
const css = readFileSync(`${book}styles/livre.css`, 'utf8');
const logoClair = readFileSync(`${root}public/brand/logo-clair.svg`, 'utf8');
const logo = readFileSync(`${root}public/brand/logo.svg`, 'utf8');
const legalTs = readFileSync(`${root}src/config/legal.ts`, 'utf8');
const controller = legalTs.match(/controllerName:\s*'([^']+)'/)?.[1] ?? '';
const auteure = controller.startsWith('TODO') ? 'Cycle Awakening' : controller;

// --- Contenu -------------------------------------------------------------------------------
// Apostrophes typographiques dans le texte (les attributs HTML utilisent des guillemets doubles).
const typo = (t) => t.replace(/(\p{L})'(\p{L})/gu, '$1’$2');
function frontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) throw new Error('Frontmatter manquant');
  const data = Object.fromEntries(m[1].split('\n').map((l) => {
    const i = l.indexOf(':');
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  }));
  return { data, body: src.slice(m[0].length) };
}

const chapitres = readdirSync(`${book}src/chapitres`).filter((f) => f.endsWith('.md')).sort().map((f) => {
  const { data, body } = frontmatter(readFileSync(`${book}src/chapitres/${f}`, 'utf8'));
  return { fichier: f, ordre: Number(data.ordre), titre: typo(data.titre), accroche: typo(data.accroche), statut: data.statut, body: typo(body) };
});
const outils = JSON.parse(readFileSync(`${book}src/outils/outils.json`, 'utf8')).map((o) => ({
  ...o,
  titre: typo(o.titre),
  html: typo(readFileSync(`${book}src/outils/${o.fichier}`, 'utf8')),
}));

// --- Contrôles de la version finale ---------------------------------------------------------
const problemes = [
  ...chapitres.filter((c) => c.statut !== 'valide').map((c) => `chapitre ${c.ordre} « ${c.titre} » : statut ${c.statut}`),
  ...outils.filter((o) => o.statut !== 'valide').map((o) => `outil « ${o.titre} » : statut ${o.statut}`),
  ...chapitres.filter((c) => /TODO_SOURCE/.test(c.body)).map((c) => `chapitre ${c.ordre} : sources non vérifiées (TODO_SOURCE)`),
];
if (!draft && problemes.length) {
  console.error('Version finale refusée. À régler avant publication :\n- ' + problemes.join('\n- '));
  console.error('Pour une version de travail : npm run build:book:brouillon');
  process.exit(1);
}

// --- Gabarit HTML ----------------------------------------------------------------------------
const num = (n) => String(n).padStart(2, '0');
const date = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date());
const fontFile = (p) => pathToFileURL(`${root}node_modules/@fontsource/${p}`).href;
const fonts = [
  ['Cormorant Garamond', 500, 'normal', 'cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2'],
  ['Cormorant Garamond', 500, 'italic', 'cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2'],
  ['Cormorant Garamond', 600, 'normal', 'cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2'],
  ['Inter', 400, 'normal', 'inter/files/inter-latin-400-normal.woff2'],
  ['Inter', 500, 'normal', 'inter/files/inter-latin-500-normal.woff2'],
  ['Inter', 600, 'normal', 'inter/files/inter-latin-600-normal.woff2'],
].map(([family, weight, style, file]) =>
  `@font-face{font-family:'${family}';font-weight:${weight};font-style:${style};src:url(${fontFile(file)}) format('woff2');}`).join('\n');

function pageRules({ impression }) {
  const t = tokens;
  const marge = `${t['print-margin-top']} ${t['print-margin-outer']} ${t['print-margin-bottom']} ${t['print-margin-inner']}`;
  const pied = `font-family: Inter, sans-serif; font-size: 7.5pt; color: ${t['semantic-text-muted']};`;
  const filigrane = draft
    ? `@top-center { content: "BROUILLON · À VALIDER · NE PAS DIFFUSER"; ${pied} color: ${t['semantic-accent-text']}; letter-spacing: 0.12em; }`
    : '';
  return `
@page {
  size: A4;
  margin: ${marge};
  ${impression ? '' : `background: ${t['semantic-bg']};`}
  @bottom-center { content: counter(page); ${pied} }
  @bottom-left { content: "Cycle Awakening · ${impression ? 'Outils imprimables' : livre.titre}"; ${pied} }
  ${filigrane}
}
@page couverture {
  margin: 0;
  @bottom-center { content: none; }
  @bottom-left { content: none; }
  @top-center { content: none; }
}`;
}

function chapitreHtml(c) {
  const statut = c.statut === 'valide' ? '' : `<p class="chapitre-statut">${c.statut === 'plan' ? 'Plan proposé · à rédiger' : 'Brouillon · à valider'}</p>`;
  return `<section class="chapitre" id="chapitre-${c.ordre}">
  ${statut}
  <header class="chapitre-entete">
    <p class="chapitre-num">${num(c.ordre)}</p>
    <h1>${c.titre}</h1>
    <p class="chapitre-accroche">${c.accroche}</p>
  </header>
  ${marked.parse(c.body)}
</section>`;
}

function outilHtml(o, i) {
  return `<section class="outil" id="outil-${o.id}">
  <p class="outil-etiquette">Outil ${i + 1} / ${outils.length} · à imprimer${o.statut === 'valide' ? '' : ' · brouillon'}</p>
  <h1>${o.titre}</h1>
  ${o.html}
</section>`;
}

const avertissement = `<div class="avertissement">
  <p><strong>Ce guide ne remplace pas un avis médical.</strong> Il propose des repères de mode de vie. Il ne pose aucun diagnostic, ne remplace aucun traitement et ne promet aucun résultat. En cas de douleur intense, de saignements très abondants, de symptômes nouveaux ou qui s'aggravent, ou si tu traverses une détresse importante, consulte un·e professionnel·le de santé. Si tu es enceinte, allaites ou suis un traitement, demande conseil avant tout changement.</p>
</div>`;

function document({ impression }) {
  const corps = impression
    ? outils.map(outilHtml).join('\n')
    : `
<section class="couverture">
  <div class="logo">${logoClair}</div>
  <div>
    <h1>${livre.titre}</h1>
    <p class="sous-titre">${livre.sousTitre}</p>
    <div class="filet"></div>
    <p class="signature">${livre.signature}</p>
  </div>
</section>

<section class="liminaire">
  <h2>Avant de commencer</h2>
  ${avertissement}
  <p>Ce guide est construit pour être utilisé, pas seulement lu. Commence par la partie qui te parle le plus. Les outils à imprimer sont à la fin, et aussi dans un fichier séparé.</p>
  <p class="petit">${livre.titre} · ${livre.edition} · ${date}<br>
  © ${new Date().getFullYear()} Cycle Awakening. Tous droits réservés. Ce guide est réservé à ton usage personnel : merci de ne pas le partager ni le revendre.<br>
  <a href="${livre.site}">${livre.site.replace('https://', '')}</a> · <a href="mailto:${livre.email}">${livre.email}</a></p>
</section>

<section class="liminaire">
  <h2>Sommaire</h2>
  <ol class="sommaire">
    ${chapitres.map((c) => `<li><a href="#chapitre-${c.ordre}"><span class="num">${num(c.ordre)}</span><span class="t">${c.titre}</span><span class="sous">${c.accroche}</span></a></li>`).join('\n    ')}
    <li class="partie">Outils à imprimer</li>
    ${outils.map((o, i) => `<li><a href="#outil-${o.id}"><span class="num">${i + 1}</span><span class="t">${o.titre}</span></a></li>`).join('\n    ')}
  </ol>
</section>

${chapitres.map(chapitreHtml).join('\n')}
${outils.map(outilHtml).join('\n')}

<section class="fin">
  <div class="logo">${logo}</div>
  <h1 class="fin-titre">Un dernier mot</h1>
  <p>Ton cycle n'est pas un problème à résoudre. C'est un rythme à apprendre. Prends ce qui t'aide, laisse le reste, et reviens à ce guide quand tu en as besoin.</p>
  ${avertissement}
  <p>Une question, un retour ? Écris-moi : <a href="mailto:${livre.email}">${livre.email}</a><br>
  <a href="${livre.site}">${livre.site.replace('https://', '')}</a> · ${livre.instagram}</p>
</section>`;

  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<title>Cycle Awakening — ${impression ? 'Outils imprimables' : livre.titre}</title>
<style>
${fonts}
${tokensCss}
${css}
${pageRules({ impression })}
</style></head>
<body${draft ? ' class="brouillon"' : ''}>${corps}</body></html>`;
}

// --- Rendu PDF -------------------------------------------------------------------------------
mkdirSync(`${dist}.html`, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});

async function rendre(nom, html, meta) {
  const htmlPath = `${dist}.html/${nom}.html`;
  writeFileSync(htmlPath, html);
  const page = await browser.newPage();
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const brut = await page.pdf({ preferCSSPageSize: true, printBackground: true, outline: true, tagged: true });
  await page.close();

  const pdf = await PDFDocument.load(brut, { updateMetadata: false });
  pdf.setTitle(meta.titre, { showInWindowTitleBar: true });
  pdf.setAuthor(auteure);
  pdf.setSubject(livre.sujet);
  pdf.setKeywords(livre.motsCles);
  pdf.setCreator('Cycle Awakening');
  pdf.setProducer('Cycle Awakening (book/build.mjs)');
  pdf.setLanguage('fr-FR');
  pdf.setCreationDate(new Date());
  pdf.setModificationDate(new Date());
  const out = `${dist}${nom}.pdf`;
  writeFileSync(out, await pdf.save());
  const mo = statSync(out).size / 1e6;
  if (mo > 15) throw new Error(`${nom}.pdf pèse ${mo.toFixed(1)} Mo (limite 15 Mo)`);
  console.log(`${nom}.pdf : ${pdf.getPageCount()} pages, ${mo.toFixed(2)} Mo`);
  return pdf.getPageCount();
}

const pagesGuide = await rendre('cycle-awakening-guide', document({ impression: false }), { titre: `Cycle Awakening — ${livre.titre}` });
await rendre('cycle-awakening-outils-imprimables', document({ impression: true }), { titre: 'Cycle Awakening — Outils imprimables' });
await browser.close();

// --- Nombre de pages : source unique pour le site --------------------------------------------
if (draft) {
  console.log(`Brouillon : book-meta.json non modifié (${problemes.length} point(s) à valider).`);
} else {
  writeFileSync(`${root}src/config/book-meta.json`, JSON.stringify({
    $comment: 'Écrit automatiquement par `npm run build:book` à partir du PDF généré. Ne pas modifier à la main.',
    pages: pagesGuide,
    builtAt: new Date().toISOString(),
  }, null, 2) + '\n');
  console.log(`book-meta.json : ${pagesGuide} pages.`);
}
