// Collections de contenu. Blog : voir le skill seo-blog (structure, sources, relecture).
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(80),
    description: z.string().min(80).max(170),
    pillar: z.enum(['phase-luteale', 'alimentation', 'sport', 'sopk', 'endometriose', 'perimenopause']),
    /** Article pilier (page longue) ou satellite. */
    type: z.enum(['pilier', 'satellite']).default('satellite'),
    keywords: z.array(z.string()).default([]),
    author: z.string().default('Emeline'),
    /** Nom et profession quand une relecture professionnelle existe. Sinon null. */
    reviewedBy: z.string().nullable().default(null),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    /** brouillon → relu → publie. Seuls les articles « publie » sont en production. */
    statut: z.enum(['brouillon', 'relu', 'publie']).default('brouillon'),
    /** Points « Quand consulter », adaptés au sujet (obligatoire). */
    consulter: z.array(z.string()).min(2),
    sources: z
      .array(z.object({ label: z.string(), url: z.string().url().optional(), verifie: z.boolean().default(false) }))
      .default([]),
    /** Photo de l'article (fichier dans public/images/blog/), affichée sous l'introduction. */
    photo: z.string().optional(),
    photoAlt: z.string().optional(),
    /** Crédit obligatoire : photographe et lien de la page Unsplash (ou autre banque d'images). */
    photoCredit: z.object({ nom: z.string(), lien: z.string().url() }).optional(),
    /** Image de partage 1200×630 (dans /public). Par défaut l'image du site. */
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

export const collections = { blog };
