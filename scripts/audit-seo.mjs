// Audit SEO du site construit (dist/). À lancer après `npm run build` : npm run seo
// Contrôle chaque page : titre, description, canonical, H1, hreflang, Open Graph, données structurées,
// images (alt), liens internes, plan du site, robots.txt. Sort en erreur (code 1) s'il y a un ÉCHEC.
// Pour auditer ce qui est réellement en ligne (et pas seulement le build) : npm run seo -- --live
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const racine = new URL('../', import.meta.url).pathname;
const dist = join(racine, 'dist');
const SITE = 'https://cycleawakening.com';
const LIMITES = { titre: 60, descMin: 70, descMax: 160, motsArticle: 500 };

const echecs = [];
const alertes = [];
const ko = (page, msg) => echecs.push(`${page} : ${msg}`);
const warn = (page, msg) => alertes.push(`${page} : ${msg}`);

// --- Collecte des pages -------------------------------------------------------------------------
function fichiers(dossier) {
  return readdirSync(dossier).flatMap((f) => {
    const chemin = join(dossier, f);
    return statSync(chemin).isDirectory() ? fichiers(chemin) : [chemin];
  });
}
const toutes = fichiers(dist);
const pagesHtml = toutes.filter((f) => f.endsWith('.html'));
const urlDe = (f) => {
  const rel = '/' + relative(dist, f).replace(/\.html$/, '');
  return rel === '/index' ? '/' : rel;
};
const pages = pagesHtml.map((f) => {
  const html = readFileSync(f, 'utf8');
  const sansScripts = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '');
  const meta = (re) => html.match(re)?.[1];
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
  return {
    f, url: urlDe(f), html, noindex,
    titre: meta(/<title>([^<]*)<\/title>/),
    description: meta(/<meta name="description" content="([^"]*)"/),
    canonical: meta(/<link rel="canonical" href="([^"]*)"/),
    h1: (sansScripts.match(/<h1[\s>]/g) || []).length,
    lang: meta(/<html lang="([^"]*)"/),
    og: (p) => meta(new RegExp(`<meta property="${p}" content="([^"]*)"`)),
    tw: (n) => meta(new RegExp(`<meta name="${n}" content="([^"]*)"`)),
    hreflang: [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]),
    ld: [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]),
    imgs: html.match(/<img\b[^>]*>/g) || [],
    liens: [...sansScripts.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)].map((m) => m[1]),
    mots: sansScripts.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length,
  };
});
const ignorees = new Set(['/404', '/styleguide']);
const aAuditer = pages.filter((p) => !ignorees.has(p.url));
const indexables = aAuditer.filter((p) => !p.noindex);

// --- Redirections (liens courts, /go/…) pour valider les liens internes -----------------------
const redirections = new Set(
  existsSync(join(dist, '_redirects'))
    ? readFileSync(join(dist, '_redirects'), 'utf8').split('\n').filter((l) => l.startsWith('/')).map((l) => l.split(/\s+/)[0])
    : [],
);
const existe = (chemin) => {
  const c = chemin.replace(/\/$/, '') || '/';
  if (c === '/') return true;
  return existsSync(join(dist, c + '.html')) || existsSync(join(dist, c, 'index.html')) || existsSync(join(dist, c)) || redirections.has(c);
};

// --- Contrôles par page -------------------------------------------------------------------------
const titres = new Map();
const descriptions = new Map();
for (const p of aAuditer) {
  const id = p.url;
  if (!p.titre) ko(id, 'balise <title> absente');
  if (!p.description) ko(id, 'meta description absente');
  if (!p.canonical) ko(id, 'canonical absente');
  if (p.h1 !== 1) ko(id, `${p.h1} balise(s) <h1) (une seule attendue)`.replace('<h1)', '<h1>'));
  const attendue = p.url.startsWith('/en') ? 'en' : 'fr';
  if (p.lang !== attendue) ko(id, `lang="${p.lang}" au lieu de "${attendue}"`);
  for (const img of p.imgs) if (!/\salt=/.test(img)) ko(id, `image sans attribut alt : ${img.slice(0, 80)}`);
  for (const l of p.liens) {
    if (!l.startsWith('/') || l.startsWith('//')) continue;
    const chemin = l.split('#')[0].split('?')[0];
    if (chemin && !existe(chemin)) ko(id, `lien interne cassé : ${l}`);
  }
  if (p.noindex) continue; // les pages non indexées ne sont pas jugées sur le reste

  if (p.titre) {
    const t = p.titre.replace(/&amp;/g, '&');
    if (t.length > LIMITES.titre) warn(id, `titre trop long (${t.length} > ${LIMITES.titre}) : « ${t} »`);
    if (titres.has(t)) ko(id, `titre en double avec ${titres.get(t)}`); else titres.set(t, id);
  }
  if (p.description) {
    const n = p.description.length;
    if (n < LIMITES.descMin) warn(id, `description courte (${n} < ${LIMITES.descMin})`);
    if (n > LIMITES.descMax) warn(id, `description trop longue (${n} > ${LIMITES.descMax})`);
    if (descriptions.has(p.description)) ko(id, `description en double avec ${descriptions.get(p.description)}`); else descriptions.set(p.description, id);
  }
  if (p.canonical && !p.canonical.startsWith(SITE)) ko(id, `canonical hors domaine : ${p.canonical}`);
  if (p.canonical && p.canonical !== SITE + (p.url === '/' ? '/' : p.url)) ko(id, `canonical ≠ URL de la page : ${p.canonical}`);
  for (const k of ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:locale']) if (!p.og(k)) ko(id, `${k} absent`);
  if (!p.tw('twitter:card')) ko(id, 'twitter:card absent');
  if (p.og('og:url') && p.og('og:url') !== p.canonical) ko(id, 'og:url ≠ canonical');
  const img = p.og('og:image');
  if (img && img.startsWith(SITE) && !existsSync(join(dist, img.replace(SITE, '')))) ko(id, `og:image introuvable : ${img}`);
  if (!/max-image-preview:large/.test(p.html)) warn(id, 'meta robots sans max-image-preview:large');

  // hreflang : réciproque, avec x-default, vers des pages existantes
  if (p.hreflang.length) {
    const langues = new Map(p.hreflang);
    if (!langues.has('x-default')) ko(id, 'hreflang x-default absent');
    for (const [l, href] of p.hreflang) {
      if (!href.startsWith(SITE)) { ko(id, `hreflang ${l} hors domaine`); continue; }
      const chemin = href.replace(SITE, '') || '/';
      const cible = aAuditer.find((x) => x.url === chemin);
      if (!cible) { ko(id, `hreflang ${l} → page inexistante ${chemin}`); continue; }
      if (cible.noindex) ko(id, `hreflang ${l} → page non indexée ${chemin}`);
      if (cible !== p && !cible.hreflang.some(([, h]) => h === p.canonical)) ko(id, `hreflang non réciproque avec ${chemin}`);
    }
  }

  // Données structurées
  const types = [];
  for (const brut of p.ld) {
    try {
      const d = JSON.parse(brut);
      const noeuds = d['@graph'] ?? [d];
      for (const n of noeuds) types.push(n['@type']);
      for (const n of noeuds) {
        if (n['@type'] === 'BlogPosting') {
          for (const k of ['headline', 'image', 'datePublished', 'dateModified', 'author', 'publisher', 'description']) if (!n[k]) ko(id, `BlogPosting sans ${k}`);
          if (typeof n.author === 'object' && !n.author.name) ko(id, 'BlogPosting : auteure sans nom');
        }
      }
    } catch (e) { ko(id, `JSON-LD invalide : ${e.message}`); }
  }
  if (p.url.match(/^(\/en)?\/blog\/[^/]+$/)) {
    if (!types.includes('BlogPosting')) ko(id, 'article sans données structurées BlogPosting');
    if (!types.includes('BreadcrumbList')) ko(id, 'article sans fil d’Ariane structuré');
    if (p.mots < LIMITES.motsArticle) warn(id, `article court (${p.mots} mots < ${LIMITES.motsArticle})`);
    if (p.og('og:type') !== 'article') ko(id, 'og:type devrait être « article »');
  }
  if (p.url === '/' || p.url === '/en') for (const t of ['Organization', 'WebSite', 'Person']) if (!types.includes(t)) ko(id, `accueil sans données structurées ${t}`);
}

// --- Plan du site -------------------------------------------------------------------------------
const sitemapChemin = join(dist, 'sitemap.xml');
if (!existsSync(sitemapChemin)) ko('sitemap.xml', 'absent');
else {
  const xml = readFileSync(sitemapChemin, 'utf8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const set = new Set(urls);
  if (set.size !== urls.length) ko('sitemap.xml', 'URL en double');
  for (const u of urls) {
    const chemin = u.replace(SITE, '') || '/';
    const page = aAuditer.find((x) => x.url === chemin);
    if (!page) ko('sitemap.xml', `URL sans page : ${u}`);
    else if (page.noindex) ko('sitemap.xml', `URL non indexée dans le plan : ${u}`);
  }
  for (const p of indexables) if (!set.has(p.canonical)) ko('sitemap.xml', `page indexable absente du plan : ${p.canonical}`);
}

// --- robots.txt ---------------------------------------------------------------------------------
const robots = existsSync(join(dist, 'robots.txt')) ? readFileSync(join(dist, 'robots.txt'), 'utf8') : '';
if (!/Sitemap:\s*https:\/\/cycleawakening\.com\/sitemap\.xml/.test(robots)) ko('robots.txt', 'ligne Sitemap absente ou incorrecte');
if (/Disallow:\s*\/\s*$/m.test(robots)) ko('robots.txt', 'tout le site est bloqué');
for (const p of aAuditer.filter((x) => x.noindex)) if (robots.includes(`Disallow: ${p.url}`)) warn('robots.txt', `${p.url} est à la fois noindex et bloquée : Google ne verra jamais le noindex`);

// --- Rapport ------------------------------------------------------------------------------------
console.log(`\nAudit SEO · ${aAuditer.length} pages (${indexables.length} indexables, ${aAuditer.length - indexables.length} non indexées)\n`);
if (alertes.length) console.log(`⚠️  ${alertes.length} alerte(s)\n  - ${alertes.join('\n  - ')}\n`);
if (echecs.length) console.log(`❌ ${echecs.length} échec(s)\n  - ${echecs.join('\n  - ')}\n`);
else console.log('✅ Aucun échec.\n');
process.exit(echecs.length ? 1 : 0);
