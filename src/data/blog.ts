// Accès aux articles. En production, seuls les articles « publie » existent.
// Sur la prévisualisation, PUBLIC_AFFICHER_BROUILLONS=true affiche aussi les brouillons (marqués et non indexés).
import { getCollection, type CollectionEntry } from 'astro:content';

export const afficherBrouillons = import.meta.env.PUBLIC_AFFICHER_BROUILLONS === 'true';

export const piliers: Record<CollectionEntry<'blog'>['data']['pillar'], string> = {
  'phase-luteale': 'Phase lutéale et SPM',
  alimentation: 'Alimentation et cycle',
  sport: 'Sport et cycle',
  sopk: 'SOPK',
  endometriose: 'Endométriose',
  perimenopause: 'Périménopause',
};

export async function articles() {
  const tous = await getCollection('blog', ({ data }) => afficherBrouillons || data.statut === 'publie');
  // Piliers d'abord, puis du plus récent au plus ancien.
  return tous.sort((a, b) =>
    (a.data.type === 'pilier' ? 0 : 1) - (b.data.type === 'pilier' ? 0 : 1) || b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

/** Nombre de mots → minutes de lecture (220 mots/min). */
export function tempsDeLecture(texte: string) {
  return Math.max(1, Math.round(texte.split(/\s+/).filter(Boolean).length / 220));
}
