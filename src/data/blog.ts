// Accès aux articles. En production, seuls les articles « publie » existent.
// Sur la prévisualisation, PUBLIC_AFFICHER_BROUILLONS=true affiche aussi les brouillons (marqués et non indexés).
// Langues : articles français dans src/content/blog/, traductions anglaises dans src/content/blog/en/
// (champ `traductionDe` = identifiant de l'article français).
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type Article = CollectionEntry<'blog'>;

export const afficherBrouillons = import.meta.env.PUBLIC_AFFICHER_BROUILLONS === 'true';

export const piliers: Record<Lang, Record<Article['data']['pillar'], string>> = {
  fr: {
    'phase-luteale': 'Phase lutéale et SPM',
    alimentation: 'Alimentation et cycle',
    sport: 'Sport et cycle',
    sopk: 'SOPK',
    endometriose: 'Endométriose',
    perimenopause: 'Périménopause',
  },
  en: {
    'phase-luteale': 'Luteal phase and PMS',
    alimentation: 'Food and your cycle',
    sport: 'Exercise and your cycle',
    sopk: 'PCOS',
    endometriose: 'Endometriosis',
    perimenopause: 'Perimenopause',
  },
};

/** Slug public d'un article (sans le dossier de langue). */
export const slugOf = (a: Article) => a.id.replace(/^en\//, '');
export const urlOf = (a: Article) => `${a.data.lang === 'en' ? '/en/blog/' : '/blog/'}${slugOf(a)}`;

const visible = (a: Article) => afficherBrouillons || a.data.statut === 'publie';

export async function articles(lang: Lang = 'fr') {
  const tous = await getCollection('blog', (a) => a.data.lang === lang && visible(a));
  // Piliers d'abord, puis du plus récent au plus ancien.
  return tous.sort((a, b) =>
    (a.data.type === 'pilier' ? 0 : 1) - (b.data.type === 'pilier' ? 0 : 1) || b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

/** URL de la version de l'article dans chaque langue (null si elle n'existe pas ou n'est pas publiée). */
export async function equivalents(a: Article): Promise<Record<Lang, string | null>> {
  const tous = await getCollection('blog', visible);
  const idFr = a.data.lang === 'fr' ? a.id : a.data.traductionDe;
  const fr = tous.find((x) => x.data.lang === 'fr' && x.id === idFr);
  const en = tous.find((x) => x.data.lang === 'en' && x.data.traductionDe === idFr);
  return { fr: fr ? urlOf(fr) : null, en: en ? urlOf(en) : null };
}

/** Nombre de mots → minutes de lecture (220 mots/min). */
export function tempsDeLecture(texte: string) {
  return Math.max(1, Math.round(texte.split(/\s+/).filter(Boolean).length / 220));
}
