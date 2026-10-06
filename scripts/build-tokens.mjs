// Génère design-tokens/dist/tokens.css (variables CSS) et tokens.json aplati.
// Consommé par le site (src/styles), le livre (book/) et plus tard l'espace membre.
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadTokens, flatten } from './tokens-lib.mjs';

const dist = fileURLToPath(new URL('../design-tokens/dist/', import.meta.url));
const flat = flatten(loadTokens());

const css = [
  '/* Fichier généré par `npm run tokens` depuis design-tokens/tokens.json — ne pas modifier. */',
  ':root {',
  ...Object.entries(flat).map(([k, v]) => `  --${k}: ${v};`),
  '}',
  '',
].join('\n');

mkdirSync(dist, { recursive: true });
writeFileSync(`${dist}tokens.css`, css);
writeFileSync(`${dist}tokens.json`, JSON.stringify(flat, null, 2) + '\n');
console.log(`tokens : ${Object.keys(flat).length} variables → design-tokens/dist/`);
