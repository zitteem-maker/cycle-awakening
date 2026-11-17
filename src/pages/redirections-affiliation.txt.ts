// Redirections Cloudflare (fichier _redirects) : liens d'affiliation /go/<marque> + liens courts des réseaux (public/_redirects).
// Généré au build ; astro.config.mjs le renomme en dist/_redirects (Astro ignore les pages commençant par « _ »,
// et public/_redirects est exclu ici pour être fusionné, pas écrasé).
import { readFileSync, existsSync } from 'node:fs';
import { redirections } from '../data/recommandations';

export function GET() {
  const affiliation = redirections().map((r) => `${r.de} ${r.vers} 302`);
  const courts = existsSync('public/liens-courts.txt') ? readFileSync('public/liens-courts.txt', 'utf8').trim().split('\n') : [];
  const anciens = ['/sitemap-index.xml /sitemap.xml 301', '/sitemap-0.xml /sitemap.xml 301'];
  const corps = ['# Anciens plans du site', ...anciens, '', '# Liens courts des réseaux (public/liens-courts.txt)', ...courts, '', '# Liens d\'affiliation (src/data/recommandations.ts)', ...affiliation];
  return new Response(corps.join('\n') + '\n', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
