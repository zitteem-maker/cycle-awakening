// Plan du site (sitemap.xml) : toutes les pages indexables, avec les équivalents FR/EN (hreflang)
// et la date de mise à jour réelle des articles. Les pages de service (merci, newsletter…) n'y figurent pas.
// À soumettre dans Google Search Console et Bing Webmaster Tools (voir docs/SEO-GOOGLE.md).
import { SITE_URL } from '../config/site';
import { legal, salesReady } from '../config/legal';
import { routes, htmlLang, type Lang } from '../i18n';
import { articles, equivalents, urlOf } from '../data/blog';

const abs = (chemin: string) => new URL(chemin, SITE_URL).toString();
const iso = (d: Date) => d.toISOString().slice(0, 10);

type Entree = { fr?: string; en?: string; lastmod?: string };

export async function GET() {
  const fr = await articles('fr');
  const en = await articles('en');
  const recent = (liste: typeof fr) => liste.map((a) => a.data.updatedAt.valueOf()).sort((a, b) => b - a)[0];
  const dernierArticle = [...fr, ...en].length ? iso(new Date(Math.max(recent(fr) ?? 0, recent(en) ?? 0))) : undefined;

  const pages: Entree[] = [
    { ...routes.accueil },
    { ...routes.blog, lastmod: dernierArticle },
    { ...routes.recommandations },
    { ...routes.mentions, lastmod: legal.updatedAt },
    { ...routes.confidentialite, lastmod: legal.updatedAt },
    { ...routes.cookies, lastmod: legal.updatedAt },
    ...(salesReady ? [{ ...routes.cgv, lastmod: legal.updatedAt }] : []),
  ];

  for (const a of [...fr, ...en]) {
    if (a.data.statut !== 'publie') continue;
    const eq = await equivalents(a);
    pages.push({ fr: eq.fr ?? undefined, en: eq.en ?? undefined, lastmod: iso(a.data.updatedAt) });
  }

  // Une entrée par URL ; les articles sont rencontrés une fois par langue : on dédoublonne.
  const vues = new Set<string>();
  const lignes: string[] = [];
  for (const p of pages) {
    const langues = (['fr', 'en'] as Lang[]).filter((l) => p[l]);
    for (const l of langues) {
      const loc = abs(p[l]!);
      if (vues.has(loc)) continue;
      vues.add(loc);
      const alternates = langues.length > 1
        ? [...langues.map((x) => `<xhtml:link rel="alternate" hreflang="${htmlLang[x]}" href="${abs(p[x]!)}"/>`), `<xhtml:link rel="alternate" hreflang="x-default" href="${abs(p.fr ?? p.en!)}"/>`].join('')
        : '';
      lignes.push(`<url><loc>${loc}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}${alternates}</url>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${lignes.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
}
