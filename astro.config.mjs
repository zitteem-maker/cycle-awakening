// Site statique déployé sur Cloudflare Pages (sortie dans dist/).
// Les fonctions serveur (paiement, webhook Stripe, assistante IA) iront dans functions/ (Cloudflare Pages Functions).
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

export default defineConfig({
  site: PUBLIC_SITE_URL || 'https://cycleawakening.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    sitemap({
      // Pages de service et non indexées hors du plan du site.
      filter: (page) => !/\/(merci|thank-you|styleguide|newsletter-[a-z]+|404)(\.html)?$/.test(page),
    }),
  ],
  i18n: {
    // Français par défaut (sans préfixe), anglais sous /en (voir src/i18n).
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
