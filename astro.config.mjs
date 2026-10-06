// Site statique déployé sur Cloudflare Pages (sortie dans dist/).
// Les fonctions serveur (paiement, webhook Stripe, assistante IA) iront dans functions/ (Cloudflare Pages Functions).
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

export default defineConfig({
  site: PUBLIC_SITE_URL || 'https://cycleawakening.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  i18n: {
    // Français par défaut, anglais prêt mais non traduit tant que ce n'est pas demandé.
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
