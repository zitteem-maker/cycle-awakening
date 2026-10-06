// Lecture et résolution des design tokens (design-tokens/tokens.json).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const TOKENS_PATH = fileURLToPath(new URL('../design-tokens/tokens.json', import.meta.url));

export function loadTokens() {
  return JSON.parse(readFileSync(TOKENS_PATH, 'utf8'));
}

// Aplatit l'arbre en { "color-base-creme-sable": "#F4F1EC", ... } en ignorant les clés "$..." et "usage".
export function flatten(tree) {
  const out = {};
  const walk = (node, path) => {
    for (const [key, val] of Object.entries(node)) {
      if (key.startsWith('$') || key === 'contrast-pairs') continue;
      if (val && typeof val === 'object' && 'value' in val) out[[...path, key].join('-')] = val.value;
      else if (val && typeof val === 'object') walk(val, [...path, key]);
      else if (typeof val === 'string') out[[...path, key].join('-')] = val;
    }
  };
  walk(tree, []);
  return resolveRefs(out);
}

// Résout les références "{color.base.creme-sable}".
function resolveRefs(flat) {
  const resolve = (v, seen = new Set()) => {
    const m = typeof v === 'string' && v.match(/^\{(.+)\}$/);
    if (!m) return v;
    const key = m[1].replaceAll('.', '-');
    if (seen.has(key) || !(key in flat)) throw new Error(`Référence de token invalide : ${v}`);
    seen.add(key);
    return resolve(flat[key], seen);
  };
  return Object.fromEntries(Object.entries(flat).map(([k, v]) => [k, resolve(v)]));
}
