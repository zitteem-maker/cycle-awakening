---
name: cycle-awakening-da
description: Direction artistique et design system de Cycle Awakening (palette hybride vert bouteille / crème / fuchsia, logo « cycle » manuscrit + « AWAKENING » Art déco, typo, photo, mouvement, ton visuel). À charger AVANT toute création ou modification visuelle — page du site, composant, espace membre, livre PDF, visuel réseau social, image de partage, email — et pour toute question « quelle couleur / quelle police / quel style / quel logo ».
---

# Direction artistique Cycle Awakening

**Décision du 6 octobre 2026 : palette « hybride »**, reprise de l'ancien site (`legacy/index.html`) : base crème et vert bouteille, **fuchsia réservé au logo et aux italiques des grands titres**. Effet recherché : *dynamique, frais, élégant* — une marque qui apaise sans endormir et qui ose une signature vive.

## Source de vérité

- `design-tokens/tokens.json` est la **seule** source. Jamais de couleur, taille ou durée en dur : toujours `var(--semantic-…)`, `var(--space-…)`, etc. (exception : voiles `rgb(26 48 40 / x)` = vert bouteille transparent).
- Après modification : `npm run tokens && npm run check:contrast` (le build échoue sous WCAG AA). Tout nouveau couple texte/fond est ajouté à `contrast-pairs`.
- Vérifier sur `/styleguide` en 390 px et 1280 px (`node scripts/screenshot.mjs`).

## Palette

| Rôle | Couleurs | Part |
|---|---|---|
| Base claire | crème `#F7F4EF`, beige `#EDE8E0`, beige ombré `#E3DDD4`, gris `#5C5C5C` (texte secondaire), sauge `#9FC0B0` | ~70 % |
| Profondeur | vert bouteille `#1A3028`, vert mousse `#2D4A3E`, vert nuit `#122219` (bas de dégradé) | ~20 % |
| Accent | fuchsia `#E0257A` (grands textes), fuchsia profond `#C4206A` (petits textes, survol) | ≤ 10 % |

Règles :
- **Fuchsia** : logo, et mots en *italique* Cormorant dans les **grands titres** (classe `.accent`, ≥ 24 px). Jamais sur un bouton, un fond, un paragraphe. Petit texte fuchsia indispensable → `--semantic-accent-text` (`#C4206A`).
- **Boutons** : vert bouteille + texte crème sur fond clair ; crème + texte vert sur fond profond. Capitales espacées (0,1 em), forme pilule.
- **Texte** : vert bouteille sur clair, crème sur profond, gris pour le secondaire, sauge pour le secondaire sur profond. Jamais de sauge en texte sur fond clair.
- **Interdits** : noir pur (l'ancien `#0A1510` n'est pas repris), blanc froid `#FFF`, mauve `#8B7BA8`, rose pâle, dégradés saturés, fuchsia en aplat.

## Ambiances

| Classe | Fond | Usage |
|---|---|---|
| (défaut) | crème | contenu éducatif, FAQ, légal |
| `.sage` | beige | sections secondaires, newsletter |
| `.dawn` | crème → beige | offre, merci |
| `.deep` | vert bouteille → vert nuit | hero, problème, histoire, pied de page |
| `.deep-green` | vert mousse → vert bouteille | variante profonde |
| `.grain` | texture papier discrète | grandes surfaces uniquement |

## Logo

- Fichiers : `public/brand/logo.svg` (fond clair), `logo-clair.svg` (fond vert), `logo-monochrome-*.svg`, `monogramme.svg` (avatar réseaux, favicon). Généré par `npm run logo` (`scripts/build-logo.mjs`), texte vectorisé.
- Composition : « cycle » en **Sacramento** fuchsia, posé en travers du haut de « AWAKENING » en **Limelight** (Art déco plein/délié), départ au-dessus du second A.
- Dans le site : composant `Logo.astro` (le mot prend `currentColor`, « cycle » reste fuchsia).
- Zone de protection : la hauteur d'une capitale tout autour. Taille minimale : 120 px de large (en dessous : monogramme).
- Ne pas : recolorer « cycle » autrement qu'en fuchsia ou monochrome, déformer, ajouter une ombre, poser sur une photo chargée sans voile.

## Typographie

- Titres : **Cormorant Garamond** 500 ; italique pour les mots signature (`.accent` en fuchsia dans les grands titres, `.signature` sans couleur ailleurs).
- Texte : **Inter** 400/500/600. Sur-titres : capitales espacées (`.eyebrow`).
- Limelight et Sacramento : **logo uniquement** (vectorisés, jamais chargés comme polices web).
- Polices auto-hébergées (@fontsource), préchargées. Jamais de Google Fonts.

## Photo et illustration

À faire : faceless ou semi-faceless, mains, dos, nuque, mer, horizon, lin, céramique, vapeur, herbes, lumière naturelle, grain léger. Teintes compatibles : verts profonds, crèmes, une touche rose/fuchsia naturelle possible (fleur, tissu).
À refuser : fitness agressif, « clean girl », stock générique, lumière blanche froide, objectifs esthétiques.
Sans photo réelle : illustration de marque (`src/components/art/`) ou emplacement `.todo`. **Jamais** de photo simulée, faux témoignage, faux avatar ou faux logo presse.

## Mouvement

- **Un seul** moment marquant par page (entrée du hero). L'ancien site animait chaque bloc : on ne le reprend pas.
- Survols courts (`--motion-duration-fast`, léger soulèvement des boutons).
- `prefers-reduced-motion` : tout est coupé, la vidéo hero est remplacée par son poster.

## Accessibilité (non négociable)

Mobile d'abord, texte courant ≥ 15 px (l'ancien site descendait à 8 px), contrastes AA, focus visible (fuchsia profond sur clair, crème sur profond), cibles ≥ 44 px, FAQ et menu utilisables au clavier, vidéo avec pause.

## Ton des textes affichés

Direct, incarné, apaisant, sensoriel, intelligent, concret. Tutoiement. Jamais infantilisant, pseudo-médical, mystique ou girlboss. Pas de promesse de résultat (« Plus jamais » de l'ancien hero est à reformuler). Phrases signature : « Tu n'es pas instable. Tu es cyclique. » · « Ralentir est une stratégie hormonale. » · « Redevenir toi. Chaque mois. »

## Checklist avant de livrer un écran

1. Tokens sémantiques uniquement ; `npm run check:contrast` vert.
2. Fuchsia limité au logo et à un mot en italique par grand titre.
3. Une seule animation marquante, coupée en mouvement réduit.
4. Captures 390 px et 1280 px relues, aucun débordement horizontal.
5. Aucun contenu inventé : les manques sont en `TODO_PREUVE` / `TODO_ASSET`.
