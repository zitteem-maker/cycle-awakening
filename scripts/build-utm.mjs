// Génère docs/LIENS-UTM.md : un lien tracké par réseau et par emplacement.
// Usage : npm run utm  (lit PUBLIC_SITE_URL dans .env ; option --campaign=nom)
// Convention : utm_source = réseau, utm_medium = type de canal, utm_campaign = opération, utm_content = emplacement.
// Tout en minuscules, mots séparés par des tirets, pas d'accents.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const site = (process.env.PUBLIC_SITE_URL || 'https://cycleawakening.com').replace(/\/$/, '');
const campaign = process.argv.find((a) => a.startsWith('--campaign='))?.split('=')[1] || 'lancement-guide';

// Pages de destination : la home pour la découverte, le quiz arrivera à l'étape 5.
const networks = [
  { source: 'instagram', medium: 'social', placements: ['bio', 'story', 'post', 'reel'] },
  { source: 'tiktok', medium: 'social', placements: ['bio', 'video'] },
  { source: 'pinterest', medium: 'social', placements: ['epingle'] },
  { source: 'facebook', medium: 'social', placements: ['post', 'groupe'] },
  { source: 'linkedin', medium: 'social', placements: ['post', 'profil'] },
  { source: 'youtube', medium: 'social', placements: ['description'] },
  { source: 'whatsapp', medium: 'messaging', placements: ['partage'] },
  { source: 'newsletter', medium: 'email', placements: ['bouton', 'signature'] },
];

const link = (source, medium, content, path = '/') => {
  const url = new URL(path, site);
  url.search = new URLSearchParams({ utm_source: source, utm_medium: medium, utm_campaign: campaign, utm_content: content }).toString();
  return url.toString();
};

// Liens courts (bios) : gardés synchronisés avec public/liens-courts.txt.
const shortLinks = [
  ['/ig', 'instagram', 'social', 'bio'],
  ['/tt', 'tiktok', 'social', 'bio'],
  ['/pin', 'pinterest', 'social', 'epingle'],
  ['/in', 'linkedin', 'social', 'profil'],
];
writeFileSync(
  fileURLToPath(new URL('../public/liens-courts.txt', import.meta.url)),
  '# Généré par `npm run utm` — liens courts pour les bios des réseaux.\n' +
    shortLinks.map(([path, s, m, c]) => { const u = new URL(link(s, m, c)); return `${path}  /${u.search}  302`; }).join('\n') + '\n',
);

const rows = networks.flatMap(({ source, medium, placements }) =>
  placements.map((p) => `| ${source} | ${p} | \`${link(source, medium, p)}\` |`),
);

const md = `# Liens UTM par réseau

> Fichier généré par \`npm run utm\` — ne pas modifier à la main.
> Domaine : \`${site}\` · Campagne : \`${campaign}\`

## Convention

| Paramètre | Valeur | Exemple |
|---|---|---|
| \`utm_source\` | le réseau | \`instagram\` |
| \`utm_medium\` | le type de canal : \`social\`, \`email\`, \`messaging\`, \`paid-social\` (pub payante) | \`social\` |
| \`utm_campaign\` | l'opération, stable pendant toute sa durée | \`lancement-guide\` |
| \`utm_content\` | l'emplacement précis | \`bio\`, \`story\`, \`reel\` |

Règles : minuscules, tirets, pas d'accents ni d'espaces. Une nouvelle opération = \`npm run utm -- --campaign=nom\`.
Les UTM ne contiennent jamais de donnée personnelle (pas d'email, pas de nom).

## Liens

| Réseau | Emplacement | Lien |
|---|---|---|
${rows.join('\n')}

## Liens courts pour les bios

Les liens UTM sont longs. Des redirections courtes, indépendantes du domaine, sont déclarées dans \`public/liens-courts.txt\` :

| Lien court | Redirige vers |
|---|---|
${shortLinks.map(([path, source, medium, content]) => `| \`${site}${path}\` | \`${link(source, medium, content)}\` |`).join('\n')}
`;

writeFileSync(fileURLToPath(new URL('../docs/LIENS-UTM.md', import.meta.url)), md);
console.log(`docs/LIENS-UTM.md : ${rows.length} liens (${site}, campagne ${campaign})`);
