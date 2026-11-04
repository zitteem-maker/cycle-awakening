// Point d'entrée Cloudflare Workers (le projet Cloudflare est un Worker avec fichiers statiques).
// - /api/newsletter : même fonction que pour Cloudflare Pages (functions/api/newsletter.js).
// - /api/evenement  : mesure d'audience sans cookie (voir docs/MESURE-AUDIENCE.md).
// - tout le reste   : fichiers du site construits par Astro (dist/), servis par Cloudflare.
import { onRequestPost, onRequest } from '../functions/api/newsletter.js';

// Événements acceptés (aucune donnée personnelle : pas d'email, pas d'identifiant, pas d'IP).
const EVENEMENTS = new Set([
  'page_vue', 'cta_click', 'cta_waitlist_click', 'newsletter_signup', 'reco_click',
  'checkout_start', 'purchase', 'quiz_start', 'quiz_signup',
]);
const court = (v, n = 120) => String(v ?? '').slice(0, n);

async function evenement(request, env) {
  if (request.method !== 'POST') return new Response(null, { status: 405, headers: { allow: 'POST' } });
  let d;
  try {
    const texte = await request.text();
    if (texte.length > 2000) return new Response(null, { status: 413 });
    d = JSON.parse(texte);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!EVENEMENTS.has(d.e)) return new Response(null, { status: 400 });
  // Pays déduit par Cloudflare (pas d'adresse IP conservée).
  const pays = request.cf?.country ?? '';
  env.EVENEMENTS?.writeDataPoint({
    indexes: [d.e],
    blobs: [d.e, court(d.page), court(d.emplacement, 60), court(d.detail, 60), pays, court(d.ref, 120)],
    doubles: [1],
  });
  return new Response(null, { status: 204 });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/newsletter') {
      return request.method === 'POST' ? onRequestPost({ request, env, ctx }) : onRequest();
    }
    if (url.pathname === '/api/evenement') return evenement(request, env);
    return env.ASSETS.fetch(request);
  },
};
