// Fabrication du livre PDF Cycle Awakening.
//   npm run build:book            → version finale (refuse tout chapitre non validé ou toute source non vérifiée)
//   npm run build:book:brouillon  → version de travail, filigrane « brouillon », n'écrit pas book-meta.json
// Sorties : book/dist/cycle-awakening-guide.pdf (version écran, outils en annexe)
//           book/dist/cycle-awakening-guide-telephone.pdf (format téléphone / liseuse, sans les outils)
//           book/dist/cycle-awakening-outils-imprimables.pdf (outils seuls, pour l'impression)
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { marked } from 'marked';
import { chromium } from 'playwright-core';
import { PDFDocument } from 'pdf-lib';

const root = fileURLToPath(new URL('../', import.meta.url));
const book = `${root}book/`;
const dist = `${book}dist/`;
// --relecture : rendu identique à la version finale (sans étiquettes « brouillon »), mais sans les contrôles
// de publication et sans toucher au nombre de pages du site. Pour relire le livre « comme imprimé ».
const relecture = process.argv.includes('--relecture');
const draft = process.argv.includes('--brouillon') || relecture;

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
  return { fichier: f, ordre: Number(data.ordre), titre: typo(data.titre), accroche: typo(data.accroche), statut: data.statut, body: typo(body), photo: imageUrl(`ch${Number(data.ordre)}.jpg`, 'chapitres') };
});
const recettes = readdirSync(`${book}src/recettes`).filter((f) => f.endsWith('.md')).sort().map((f) => {
  const { data, body } = frontmatter(readFileSync(`${book}src/recettes/${f}`, 'utf8'));
  // Sections « ## Ingrédients », « ## Préparation », puis une section libre (astuce, variante…).
  const sections = typo(body).split(/^## /m).filter((x) => x.trim()).map((bloc) => {
    const [titre, ...reste] = bloc.split('\n');
    return { titre: titre.trim(), html: marked.parse(reste.join('\n')) };
  });
  return {
    id: f.replace(/^\d+-|\.md$/g, ''),
    ordre: Number(data.ordre),
    titre: typo(data.titre),
    nom: typo(data.nom ?? data.titre),
    theme: data.theme ?? 'Recettes',
    categorie: data.categorie,
    temps: data.temps,
    portions: data.portions,
    intro: typo(data.intro),
    statut: data.statut,
    photo: imageUrl(data.photo),
    photoNom: data.photo,
    sections,
  };
});
function imageUrl(nom, dossier = 'recettes') {
  const chemin = `${book}src/images/${dossier}/${nom}`;
  return existsSync(chemin) ? pathToFileURL(chemin).href : null;
}
const themesRecettes = JSON.parse(readFileSync(`${book}src/recettes/themes.json`, 'utf8')).map((t) => ({ ...t, url: imageUrl(t.photo) }));
const outils = JSON.parse(readFileSync(`${book}src/outils/outils.json`, 'utf8')).map((o) => ({
  ...o,
  titre: typo(o.titre),
  html: typo(readFileSync(`${book}src/outils/${o.fichier}`, 'utf8')),
}));

// Édito « Un dernier mot, entre nous » (toute dernière page du guide). Deux mises en page : classique ou manuscrite.
const editoSrc = frontmatter(readFileSync(`${book}src/edito.md`, 'utf8'));
const edito = {
  ...Object.fromEntries(Object.entries(editoSrc.data).map(([k, v]) => [k, typo(v)])),
  // « <!-- colonne --> » sépare la colonne de gauche (sous le chapeau) de celle de droite (sous la photo).
  colonnes: typo(editoSrc.body).split('<!-- colonne -->').map((x) => marked.parse(x)),
};
function editoPhoto() {
  const vraie = `${book}src/images/edito/${edito.photo}`;
  if (existsSync(vraie)) return { url: pathToFileURL(vraie).href, provisoire: false };
  // En attendant le portrait de la fondatrice : photo d'ambiance, sans mention.
  return { url: pathToFileURL(`${book}src/images/${edito.photoAmbiance}`).href, provisoire: true };
}

// --- Contrôles de la version finale ---------------------------------------------------------
const problemes = [
  ...chapitres.filter((c) => c.statut !== 'valide').map((c) => `chapitre ${c.ordre} « ${c.titre} » : statut ${c.statut}`),
  ...recettes.filter((r) => r.statut !== 'valide').map((r) => `recette « ${r.titre} » : statut ${r.statut}`),
  ...recettes.filter((r) => !r.photo).map((r) => `recette « ${r.titre} » : photo manquante (book/src/images/recettes/${r.photoNom})`),
  ...outils.filter((o) => o.statut !== 'valide').map((o) => `outil « ${o.titre} » : statut ${o.statut}`),
  ...(edito.statut === 'valide' ? [] : [`édito : statut ${edito.statut}`]),
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
  ['Cormorant Garamond', 600, 'italic', 'cormorant-garamond/files/cormorant-garamond-latin-600-italic.woff2'],
  ['Cormorant Garamond', 700, 'normal', 'cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff2'],
  ['Cormorant Garamond', 700, 'italic', 'cormorant-garamond/files/cormorant-garamond-latin-700-italic.woff2'],
  ['Inter', 400, 'normal', 'inter/files/inter-latin-400-normal.woff2'],
  ['Inter', 500, 'normal', 'inter/files/inter-latin-500-normal.woff2'],
  ['Inter', 600, 'normal', 'inter/files/inter-latin-600-normal.woff2'],
  ['Inter', 700, 'normal', 'inter/files/inter-latin-700-normal.woff2'],
  // Polices du logo : titres des recettes (Limelight) et intertitres manuscrits (Sacramento).
  ['Limelight', 400, 'normal', 'limelight/files/limelight-latin-400-normal.woff2'],
  ['Sacramento', 400, 'normal', 'sacramento/files/sacramento-latin-400-normal.woff2'],
].map(([family, weight, style, file]) =>
  `@font-face{font-family:'${family}';font-weight:${weight};font-style:${style};src:url(${fontFile(file)}) format('woff2');}`).join('\n');

// Format téléphone / liseuse : page étroite (proportions d'un écran), marges courtes.
const MOBILE = { size: '105mm 170mm', margin: '11mm 9mm 13mm 9mm' };

function pageRules({ impression, mobile }) {
  const t = tokens;
  const marge = mobile
    ? MOBILE.margin
    : `${t['print-margin-top']} ${t['print-margin-outer']} ${t['print-margin-bottom']} ${t['print-margin-inner']}`;
  const pied = `font-family: Inter, sans-serif; font-size: ${mobile ? '6.5pt' : '7.5pt'}; color: ${t['semantic-text-muted']};`;
  // En-tête courant : « Cycle Awakening · 01 · Titre du chapitre » (pages nommées, une par chapitre).
  const entete = (texte) => `@top-center { content: "${texte.replace(/"/g, '\\"')}"; ${pied} color: ${t['semantic-accent-text']}; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }`;
  const parties = impression ? '' : chapitres.map((c) => `
@page partie-${c.ordre} { ${entete(`Cycle Awakening · ${num(c.ordre)} · ${c.titre}`)} }
#chapitre-${c.ordre}.chapitre:not(.chapitre--photo), #chapitre-${c.ordre} .ch-corps { page: partie-${c.ordre}; }`).join('') + (impression ? '' : `
@page outils { ${entete('Cycle Awakening · Outils à imprimer')} }
.outil { page: outils; }`);
  return `
@page {
  size: ${mobile ? MOBILE.size : 'A4'};
  margin: ${marge};
  ${impression ? '' : `background: ${t['semantic-bg']};`}
  @bottom-center { content: counter(page); ${pied} }
  ${entete(`Cycle Awakening · ${impression ? 'Outils imprimables' : livre.titre}`)}
}
${parties}
@page recette {
  margin: 0 0 ${mobile ? '13mm' : '14mm'} 0;
  @top-center { content: none; }
}
@page couverture {
  margin: 0;
  @bottom-center { content: none; }
  @bottom-left { content: none; }
  @top-center { content: none; }
}`;
}

// Page d'ouverture : photo pleine largeur (book/src/images/chapitres/chN.jpg) + titre.
// Photo facultative : sans photo, la version finale garde l'en-tête simple ; le brouillon montre l'emplacement.
function chapitreHtml(c) {
  const statut = c.statut === 'valide' ? '' : `<p class="chapitre-statut">${c.statut === 'plan' ? 'Plan proposé · à rédiger' : 'Brouillon · à valider'}</p>`;
  const entete = `<header class="chapitre-entete">
    <p class="chapitre-num">${num(c.ordre)}</p>
    <h1>${c.titre}</h1>
    <p class="chapitre-accroche">${c.accroche}</p>
  </header>`;
  if (!c.photo && !draft) {
    return `<section class="chapitre" id="chapitre-${c.ordre}">
  ${statut}
  ${entete}
  ${marked.parse(c.body)}
</section>`;
  }
  return `<section class="chapitre chapitre--photo" id="chapitre-${c.ordre}">
  <div class="ch-ouverture">
    ${photoHtml(c.photo, `chapitres/ch${c.ordre}.jpg`, 'ch-photo')}
    <div class="ch-bloc">${statut}${entete}</div>
  </div>
  <div class="ch-corps">${marked.parse(c.body)}</div>
</section>`;
}

// Trait décoratif organique (inspiré des livres de cuisine) : posé sur la photo, couleur crème.
const trait = `<svg class="r-trait" viewBox="0 0 120 160" aria-hidden="true"><path d="M8 150c18-30 4-58 26-78s46-6 52-30-20-40 4-34 30 30 14 52-44 14-48 40 22 34 44 28" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/><path d="M20 148c22-26 10-48 30-64" fill="none" stroke="currentColor" stroke-width="0.8" stroke-linecap="round"/></svg>`;
const soleil = `<svg class="t-soleil" viewBox="0 0 100 100" aria-hidden="true">${Array.from({ length: 18 }, (_, i) => {
  const a = (i * 20 * Math.PI) / 180;
  const r1 = i % 2 ? 14 : 8;
  const r2 = i % 2 ? 40 : 48;
  return `<line x1="${50 + r1 * Math.cos(a)}" y1="${50 + r1 * Math.sin(a)}" x2="${50 + r2 * Math.cos(a)}" y2="${50 + r2 * Math.sin(a)}" stroke="currentColor" stroke-width="0.9" stroke-linecap="round"/>`;
}).join('')}</svg>`;

function photoHtml(url, nom, classe) {
  return url
    ? `<figure class="${classe}"><img src="${url}" alt=""></figure>`
    : `<figure class="${classe} ${classe}--attente"><span>Photo à venir</span><small>${nom}</small></figure>`;
}

function themeHtml(t) {
  return `<section class="theme-page">
  ${photoHtml(t.url, t.photo, 't-photo')}
  ${soleil}
  <div class="t-bloc">
    <p class="t-script">${t.script}</p>
    <h2 class="t-titre">${t.nom}</h2>
  </div>
</section>`;
}

function recetteHtml(r) {
  const [ingredients, preparation, ...autres] = r.sections;
  return `<section class="recette" id="recette-${r.id}">
  <header class="r-entete">
    <p class="r-meta">${r.categorie}<span>${r.temps}</span><span>${r.portions}</span>${r.statut === 'valide' ? '' : '<span class="statut">brouillon</span>'}</p>
    <h2 class="recette-nom">${r.nom}</h2>
  </header>
  <div class="r-gauche">
    <p class="r-sous-titre">${r.titre}</p>
    <p class="r-intro">${r.intro}</p>
  </div>
  ${photoHtml(r.photo, r.photoNom, 'r-photo')}
  ${trait}
  <div class="r-carte"><h3>${ingredients.titre}</h3>${ingredients.html}</div>
  <div class="r-droite">
    <h3>${preparation.titre}</h3>${preparation.html}
    ${autres.map((a) => `<div class="recette-astuce"><p class="recette-astuce-titre">${a.titre}</p>${a.html}</div>`).join('')}
  </div>
</section>`;
}

function recettesHtml() {
  return themesRecettes.map((t) => [themeHtml(t), ...recettes.filter((r) => r.theme === t.nom).map(recetteHtml)].join('\n')).join('\n');
}

function outilHtml(o, i) {
  return `<section class="outil" id="outil-${o.id}">
  <p class="outil-etiquette">${o.bonus ? 'Bonus · à imprimer ou à transmettre' : `Outil ${i + 1} / ${outils.filter((x) => !x.bonus).length} · à imprimer`}${o.statut === 'valide' ? '' : ' · brouillon'}</p>
  <h1>${o.titre}</h1>
  ${o.html}
</section>`;
}

// Trait manuscrit : boucle libre, à cheval sur le bord de la photo (comme un trait de crayon).
const boucle = `<svg class="e-boucle" viewBox="0 0 90 150" aria-hidden="true"><path d="M86 6C52 2 40 22 54 40s30 10 22-6S30 18 26 52s40 34 36 58S10 140 4 120s30-30 48-10" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`;

function editoHtml(variante = livre.edito ?? 'classique') {
  const photo = editoPhoto();
  return `<section class="edito edito--${variante}" id="edito">
  <header class="e-tete">
    <div class="e-logo">${logo}</div>
  </header>
  <h2 class="e-titre">${edito.titre} <em>${edito.titreAccent}</em></h2>
  <figure class="e-photo"><img src="${photo.url}" alt=""></figure>
  ${boucle}
  <div class="e-gauche">
    <p class="e-chapeau">${edito.chapeau}</p>
    ${edito.colonnes[0]}
  </div>
  <div class="e-droite">
    ${edito.colonnes[1] ?? ''}
    <p class="e-citation">${edito.citation}</p>
    <p class="e-salut">${edito.salut}</p>
    <p class="e-signature">${edito.signature}</p>
  </div>
  <footer class="e-pied"><span></span><a href="${livre.site}">cycleawakening.com</a></footer>
</section>`;
}

const avertissement = `<div class="encadre encadre-alerte">
  <p class="encadre-titre">Ce guide ne remplace pas un avis médical</p>
  <p>Il propose des repères de mode de vie. Il ne pose aucun diagnostic, ne remplace aucun traitement et ne promet aucun résultat. En cas de douleur intense, de saignements très abondants, de symptômes nouveaux ou qui s'aggravent, ou si tu traverses une détresse importante, consulte un·e professionnel·le de santé. Si tu es enceinte, allaites ou suis un traitement, demande conseil avant tout changement.</p>
</div>`;

function document({ impression, mobile = false, seul = null }) {
  const themes = themesRecettes.map((t) => t.nom);
  const corps = impression
    ? outils.filter((o) => !seul || o.id === seul).map(outilHtml).join('\n')
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
  <p>Ce guide est construit pour être utilisé, pas seulement lu. Commence par la partie qui te parle le plus. ${mobile ? 'Cette version est mise en page pour le téléphone et la liseuse ; les outils à imprimer sont dans un fichier séparé.' : 'Les outils à imprimer sont à la fin, et aussi dans un fichier séparé.'}</p>
  <p class="petit">${livre.titre} · ${livre.edition} · ${date}<br>
  © ${new Date().getFullYear()} Cycle Awakening. Tous droits réservés. Ce guide est réservé à ton usage personnel : merci de ne pas le partager ni le revendre.<br>
  <a href="${livre.site}">${livre.site.replace('https://', '')}</a> · <a href="mailto:${livre.email}">${livre.email}</a></p>
</section>

<section class="liminaire">
  <h2>Sommaire</h2>
  <p class="bandeau">Le guide</p>
  <ol class="sommaire">
    ${chapitres.map((c) => `<li><a href="#chapitre-${c.ordre}"><span class="num">${num(c.ordre)}</span><span class="t">${c.titre}</span><span class="sous">${c.accroche}</span></a></li>`).join('\n    ')}
  </ol>
  ${themes.map((th) => `<p class="bandeau">Recettes · <span class="accent-theme">${th}</span></p>
  <ul class="sommaire-colonnes">${recettes.filter((r) => r.theme === th).map((r) => `<li><a href="#recette-${r.id}">${r.nom}</a></li>`).join('')}</ul>`).join('\n  ')}
  <p class="bandeau">${mobile ? 'Bonus' : 'Outils à imprimer'}</p>
  <ul class="sommaire-colonnes">${(mobile ? outils.filter((o) => o.bonus) : outils).map((o) => `<li><a href="#outil-${o.id}">${o.titre}</a></li>`).join('')}</ul>
</section>

${chapitres.map(chapitreHtml).join('\n')}
${recettesHtml()}
${(mobile ? outils.filter((o) => o.bonus) : outils).map(outilHtml).join('\n')}

<section class="fin">
  <div class="logo">${logo}</div>
  <h1 class="fin-titre">Avant de refermer ce guide</h1>
  <p>Ton cycle n'est pas un problème à résoudre. C'est un rythme à apprendre. Prends ce qui t'aide, laisse le reste, et reviens à ce guide quand tu en as besoin.</p>
  ${avertissement}
  <p>Une question, un retour ? Écris-moi : <a href="mailto:${livre.email}">${livre.email}</a><br>
  <a href="${livre.site}">${livre.site.replace('https://', '')}</a> · ${livre.instagram}</p>
</section>

${editoHtml()}`;

  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<title>Cycle Awakening — ${impression ? 'Outils imprimables' : livre.titre}</title>
<style>
${fonts}
${tokensCss}
${css}
${pageRules({ impression, mobile })}
</style></head>
<body class="${[draft && 'brouillon', relecture && 'relecture', mobile && 'mobile'].filter(Boolean).join(' ')}">${corps}</body></html>`;
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

// Aperçu de l'édito seul, dans ses deux variantes : npm run build:book:edito
if (process.argv.includes('--apercu-edito')) {
  for (const v of ['classique', 'manuscrit']) {
    const complet = document({ impression: false });
    const debut = complet.indexOf('<body', complet.indexOf('</head>'));
    const html = `${complet.slice(0, complet.indexOf('>', debut) + 1)}${editoHtml(v)}</body></html>`;
    await rendre(`apercu-edito-${v}`, html, { titre: `Aperçu édito (${v})` });
  }
  await browser.close();
  process.exit(0);
}

const pagesGuide = await rendre('cycle-awakening-guide', document({ impression: false }), { titre: `Cycle Awakening — ${livre.titre}` });
await rendre('cycle-awakening-guide-telephone', document({ impression: false, mobile: true }), { titre: `Cycle Awakening — ${livre.titre} (téléphone et liseuse)` });
await rendre('cycle-awakening-notice-pour-lui', document({ impression: true, seul: 'notice-pour-lui' }), { titre: 'Cycle Awakening — La notice pour lui' });
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
