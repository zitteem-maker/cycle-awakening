// Liens de redirection des fiches commerciales (/go/<marque>), au format Cloudflare _redirects.
// Généré au build ; astro.config.mjs le renomme en dist/_redirects (Astro ignore les pages commençant par « _ »).
import { redirections } from '../data/recommandations';

export function GET() {
  const lignes = redirections().map((r) => `${r.de} ${r.vers} 302`);
  return new Response(lignes.join('\n') + '\n', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
