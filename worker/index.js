// Point d'entrée Cloudflare Workers (le projet Cloudflare est un Worker avec fichiers statiques).
// - /api/newsletter : même fonction que pour Cloudflare Pages (functions/api/newsletter.js).
// - tout le reste : fichiers du site construits par Astro (dist/), servis par Cloudflare.
import { onRequestPost, onRequest } from '../functions/api/newsletter.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/newsletter') {
      return request.method === 'POST' ? onRequestPost({ request, env, ctx }) : onRequest();
    }
    return env.ASSETS.fetch(request);
  },
};
