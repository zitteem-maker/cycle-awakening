// Contenu du guide lu directement dans les sources du livre (book/src) au moment du build :
// les chiffres et titres affichés sur le site sont toujours ceux du vrai livre, jamais saisis à la main.
import outilsJson from '../../book/src/outils/outils.json';

type Meta = Record<string, string>;

function frontmatter(src: string): Meta {
  const m = src.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  return Object.fromEntries(
    m[1].split('\n').map((l) => {
      const i = l.indexOf(':');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
  );
}

const lire = (fichiers: Record<string, string>) =>
  Object.entries(fichiers)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, src]) => frontmatter(src));

const chapitresSrc = import.meta.glob('../../book/src/chapitres/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const recettesSrc = import.meta.glob('../../book/src/recettes/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const chapitres = lire(chapitresSrc).map((c) => ({
  ordre: Number(c.ordre),
  titre: c.titre,
  accroche: c.accroche,
  titre_en: c.titre_en ?? c.titre,
  accroche_en: c.accroche_en ?? c.accroche,
}));

export const recettes = lire(recettesSrc).map((r) => ({
  nom: r.nom ?? r.titre,
  titre: r.titre,
  theme: r.theme,
  temps: r.temps,
  photo: r.photo,
  nom_en: r.nom_en ?? r.nom ?? r.titre,
  titre_en: r.titre_en ?? r.titre,
  temps_en: r.temps_en ?? r.temps,
}));

export const outils = (outilsJson as { titre: string; titre_en?: string; bonus?: boolean }[]).map((o) => ({
  titre: o.titre.replace(/^Bonus · /, ''),
  titre_en: (o.titre_en ?? o.titre).replace(/^Bonus · /, ''),
  bonus: Boolean(o.bonus),
}));
