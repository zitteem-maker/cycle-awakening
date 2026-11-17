// Données structurées (schema.org, JSON-LD) et constantes SEO partagées par toutes les pages.
// Règle : on ne déclare que ce qui est visible sur la page et vrai (jamais d'avis, de note ou de prix inventé).
// Voir le skill .claude/skills/seo-site.
import { SITE_URL } from './site';
import { legal } from './legal';
import type { Lang } from '../i18n';

export const ids = {
  organisation: `${SITE_URL}/#organisation`,
  site: `${SITE_URL}/#site`,
  auteure: `${SITE_URL}/#emeline`,
};

/** Compte Instagram de la marque (src de vérité : book/livre.json). Retirer si le compte n'existe pas. */
export const reseaux = ['https://www.instagram.com/cycleawakening/'];

/** Longueurs recommandées (Google tronque au-delà). Utilisées par l'audit `npm run seo`. */
export const limites = { titre: 60, descriptionMin: 70, descriptionMax: 160 };

// Nom affiché publiquement : prénom seul (choix de la fondatrice). Le nom complet reste dans les mentions légales.
const nomAuteure = () => 'Emeline';

export const organisation = () => ({
  '@type': 'Organization',
  '@id': ids.organisation,
  name: 'Cycle Awakening',
  legalName: legal.editor.name,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 },
  email: legal.editor.email,
  founder: { '@type': 'Person', name: nomAuteure() },
  ...(reseaux.length ? { sameAs: reseaux } : {}),
});

export const auteure = (lang: Lang = 'fr') => ({
  '@type': 'Person',
  '@id': ids.auteure,
  name: nomAuteure(),
  jobTitle: lang === 'en' ? 'Founder of Cycle Awakening' : 'Fondatrice de Cycle Awakening',
  image: `${SITE_URL}/images/site/emeline.webp`,
  worksFor: { '@type': 'Organization', name: 'Cycle Awakening', url: SITE_URL },
  url: `${SITE_URL}${lang === 'en' ? '/en/about' : '/a-propos'}`,
});

export const siteWeb = () => ({
  '@type': 'WebSite',
  '@id': ids.site,
  url: SITE_URL,
  name: 'Cycle Awakening',
  inLanguage: ['fr-FR', 'en-GB'],
  publisher: { '@id': ids.organisation },
});

/** Accueil : organisation, auteure et site. Les autres pages les référencent par @id. */
export const graphe = (...elements: object[]) => ({ '@context': 'https://schema.org', '@graph': elements });

export const fil = (elements: { nom: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: elements.map((e, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: e.nom,
    item: e.url.startsWith('http') ? e.url : `${SITE_URL}${e.url === '/' ? '' : e.url}`,
  })),
});

export const collection = (opts: { nom: string; description: string; url: string; lang: Lang; elements?: { nom: string; url: string }[] }) => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: opts.nom,
  description: opts.description,
  url: `${SITE_URL}${opts.url}`,
  inLanguage: opts.lang === 'en' ? 'en-GB' : 'fr-FR',
  isPartOf: { '@type': 'WebSite', '@id': ids.site, url: SITE_URL, name: 'Cycle Awakening' },
  ...(opts.elements?.length
    ? {
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: opts.elements.map((e, i) => ({ '@type': 'ListItem', position: i + 1, name: e.nom, url: e.url.startsWith('http') ? e.url : `${SITE_URL}${e.url}` })),
        },
      }
    : {}),
});

export const article = (o: {
  url: string;
  titre: string;
  description: string;
  images: string[];
  publie: string;
  modifie: string;
  lang: Lang;
  motsCles: string[];
  rubrique: string;
  mots: number;
  relu?: string | null;
  sources: { nom: string; url?: string }[];
}) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  '@id': `${o.url}#article`,
  mainEntityOfPage: { '@type': 'WebPage', '@id': o.url },
  headline: o.titre,
  description: o.description,
  image: o.images,
  datePublished: o.publie,
  dateModified: o.modifie,
  author: auteure(o.lang),
  publisher: organisation(),
  inLanguage: o.lang === 'en' ? 'en-GB' : 'fr-FR',
  keywords: o.motsCles.join(', '),
  articleSection: o.rubrique,
  wordCount: o.mots,
  isAccessibleForFree: true,
  isPartOf: { '@type': 'WebSite', '@id': ids.site, url: SITE_URL, name: 'Cycle Awakening' },
  ...(o.relu ? { reviewedBy: { '@type': 'Person', name: o.relu } } : {}),
  ...(o.sources.some((s) => s.url)
    ? { citation: o.sources.filter((s) => s.url).map((s) => ({ '@type': 'CreativeWork', name: s.nom, url: s.url })) }
    : {}),
});
