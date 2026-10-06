# Assets — état, sources recommandées, crédits

## État

| Asset | État | Fichier |
|---|---|---|
| Logo « cycle » manuscrit + « AWAKENING » Art déco (clair, foncé, monochromes, monogramme) | ✅ créé d'après tes références, vectorisé | `public/brand/*.svg` (source : `npm run logo`) |
| Favicon, icônes, image de partage 1200×630 | ✅ créés | `public/favicon.*`, `public/icon-*.png`, `public/images/share/og-default.png` |
| Illustration « horizon » (hero en attendant la vidéo, 404) | ✅ recolorée vert bouteille / crème | `src/components/art/Horizon.astro` |
| Pages de l'ancien site (contenu à reprendre) | ✅ reçues | `legacy/index.html`, `legacy/recommandations.html` |
| Pages du blog | ⏳ à demander à l'ancien propriétaire | — |
| Photos produits (recommandations) | ⏳ kits presse des marques ou photos perso | — |
| Vidéo hero | ⏳ à choisir (toi) | `public/videos/` via `npm run hero-video` |
| Photos de marque | ⏳ à choisir ou tourner (toi) | `public/images/` |
| Texte du livre | ⏳ étape 2 : je propose une rédaction chapitre par chapitre, tu valides | `book/` |
| Nombre de pages | ✅ automatique | écrit par `npm run build:book` |

Je ne peux pas télécharger de photos ou de vidéos depuis l'environnement de travail (banques d'images bloquées par le réseau), et je ne fabrique pas de fausses photos. Tant qu'il n'y a pas de visuel réel, le site utilise les illustrations de marque.

## Vidéo hero : quoi chercher

Plan lent, 8 à 20 s, bouclable, faceless, lumière naturelle chaude ou bleue d'aube, zone calme à gauche pour le texte.

Mots-clés à taper (en anglais, les banques sont mieux indexées) :
`calm sea horizon dawn` · `waves receding sand slow motion` · `linen curtain wind sunlight` · `steam ceramic cup morning light` · `hands in water slow` · `woman back sea faceless` · `tall grass wind golden hour`

### Sites recommandés

| Site | Coût | Pourquoi | Attention |
|---|---|---|---|
| [Pexels Videos](https://www.pexels.com/videos/) | gratuit | Large choix mer / lin / mains, licence commerciale sans attribution | Beaucoup de déjà-vu ; éviter les visages |
| [Coverr](https://coverr.co/) | gratuit | Pensé pour les hero de site, boucles prêtes | Choix plus restreint |
| [Mixkit](https://mixkit.co/free-stock-video/) | gratuit | Bonne qualité, licence simple | Vérifier la licence du clip |
| [Pixabay](https://pixabay.com/videos/) | gratuit | Volume | Qualité inégale |
| [Stocksy](https://www.stocksy.com/) | payant (à l'unité) | **Le plus proche de la DA** : authentique, sensible, faceless, lumière naturelle | Prix par clip |
| [Artgrid](https://artgrid.io/) | abonnement | Rendu cinéma, étalonnage soigné | Abonnement annuel |
| [Envato Elements](https://elements.envato.com/) | abonnement | Vidéos + photos + polices | Enregistrer chaque projet pour la licence |

Ma recommandation : chercher d'abord sur **Coverr** et **Pexels** (gratuit) avec les mots-clés ci-dessus ; si rien ne te touche, **Stocksy** pour 1 vidéo + 6 à 8 photos cohérentes entre elles. À terme : un tournage de 30 minutes au smartphone (mer, lin, tasse, mains) donne un rendu plus authentique et règle la question des licences.

Une fois le fichier choisi : le déposer dans `assets-src/video/` puis `npm run hero-video -- assets-src/video/fichier.mp4 [début] [durée]` (détails dans le skill `hero-video`).

## Photos : liste de prises de vue

Pour la landing (étape 3) et le livre (étape 2). Faceless ou semi-faceless, lumière naturelle, aucun stock générique.

| # | Usage | Sujet |
|---|---|---|
| 1 | Histoire | Mains autour d'une tasse en céramique, vapeur, lumière de fenêtre |
| 2 | Problème (ambiance nuit) | Dos dans un pull, fenêtre bleutée en fin de journée |
| 3 | Méthode : nourrir | Bol simple, herbes, mains qui coupent, plan de travail en bois |
| 4 | Méthode : bouger | Pieds nus sur un tapis, étirement lent, lin |
| 5 | Méthode : lire les signaux | Carnet ouvert, stylo, main qui écrit |
| 6 | Pour qui | Silhouette de dos face à la mer |
| 7 | Offre / livre | Guide (mockup) posé sur du lin, lumière rasante — à faire quand le PDF existe |
| 8 | Portrait de la fondatrice (optionnel) | Semi-faceless, profil ou de dos, dans la même lumière |

Format à livrer : JPEG ou HEIC en pleine résolution ; l'optimisation (AVIF/WebP, tailles responsives) est faite au build.

## Crédits et licences

À remplir pour chaque visuel externe (obligatoire avant publication) :

| Fichier | Source (URL) | Auteur·e | Licence | Date | Capture de la licence |
|---|---|---|---|---|---|
| | | | | | |
