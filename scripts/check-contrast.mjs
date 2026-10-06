// Vérifie les contrastes WCAG des couples déclarés dans tokens.json. Échoue le build si un couple est sous le seuil.
import { loadTokens, flatten } from './tokens-lib.mjs';

const tokens = loadTokens();
const flat = flatten(tokens);

const luminance = (hex) => {
  const [r, g, b] = hex.replace('#', '').match(/../g).map((h) => {
    const c = parseInt(h, 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

let failed = 0;
for (const { fg, bg, min } of tokens['contrast-pairs'].pairs) {
  const r = ratio(flat[`semantic-${fg}`], flat[`semantic-${bg}`]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? 'OK  ' : 'ÉCHEC'} ${fg} sur ${bg} : ${r.toFixed(2)} (min ${min})`);
}
if (failed) {
  console.error(`${failed} couple(s) sous le seuil WCAG AA.`);
  process.exit(1);
}
