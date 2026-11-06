// Site statique déployé sur Cloudflare Pages (sortie dans dist/).
// Les fonctions serveur (paiement, webhook Stripe, assistante IA) iront dans functions/ (Cloudflare Pages Functions).
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';
import { renameSync, existsSync } from 'node:fs';

// Liens de redirection des fiches commerciales (/go/<marque>) : la page src/pages/redirections-affiliation.txt.ts
// les génère, ce crochet la renomme en dist/_redirects (fichier lu par Cloudflare).
const redirectionsAffiliation = {
  name: 'redirections-affiliation',
  hooks: {
    'astro:build:done': ({ dir }) => {
      const source = new URL('redirections-affiliation.txt', dir);
      if (existsSync(source)) renameSync(source, new URL('_redirects', dir));
    },
  },
};

const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

export default defineConfig({
  site: PUBLIC_SITE_URL || 'https://cycleawakening.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    redirectionsAffiliation,
    sitemap({
      // Pages de service et non indexées hors du plan du site.
      filter: (page) => !/\/(merci|thank-you|styleguide|newsletter-[a-z]+|404|redirections-affiliation\.txt)(\.html)?$/.test(page),
    }),
  ],
  i18n: {
    // Français par défaut (sans préfixe), anglais sous /en (voir src/i18n).
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
