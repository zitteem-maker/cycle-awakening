// Flux RSS du blog : sert aussi à l'email hebdomadaire « Quoi de neuf » (Brevo, voir skill seo-blog §6).
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { articles } from '../../data/blog';

export async function GET(context: APIContext) {
  const liste = (await articles()).filter((a) => a.data.statut === 'publie');
  return rss({
    title: 'Cycle Awakening — le blog',
    description: 'Comprendre ton cycle, phase après phase : repères concrets pour manger, bouger et ralentir.',
    site: context.site!,
    customData: '<language>fr-FR</language>',
    items: liste.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.publishedAt,
      link: `/blog/${a.id}`,
      author: a.data.author,
    })),
  });
}
