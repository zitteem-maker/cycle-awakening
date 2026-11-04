// Flux RSS du blog anglais.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { articles, urlOf } from '../../../data/blog';

export async function GET(context: APIContext) {
  const liste = (await articles('en')).filter((a) => a.data.statut === 'publie');
  return rss({
    title: 'Cycle Awakening — the blog',
    description: 'Understand your cycle, phase by phase: practical markers for eating, moving and slowing down.',
    site: context.site!,
    customData: '<language>en-GB</language>',
    items: liste.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.publishedAt,
      link: urlOf(a),
      author: a.data.author,
    })),
  });
}
