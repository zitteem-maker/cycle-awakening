---
name: cycle-awakening-da
description: Direction artistique et design system de Cycle Awakening (palette 70/20/10, ambiances jour/aube/nuit, typo, photo, mouvement, ton visuel). À charger AVANT toute création ou modification visuelle — page du site, composant, espace membre, livre PDF, visuel réseau social, image de partage, email — et pour toute question « quelle couleur / quelle police / quel style ».
---

# Direction artistique Cycle Awakening

**Effet recherché** : une marque qui *apaise sans endormir, éclaire sans agresser, guide sans imposer*. Ressenti cible : sécurité, clarté, profondeur, intelligence, douceur maîtrisée. Le contenu respire comme le message.

## Source de vérité

- `design-tokens/tokens.json` est la **seule** source. Jamais de couleur, taille ou durée en dur dans un composant : toujours `var(--semantic-…)`, `var(--space-…)`, etc.
- Après modification : `npm run tokens && npm run check:contrast`. Le build échoue si un couple texte/fond passe sous WCAG AA. Tout nouveau couple texte/fond utilisé doit être ajouté à `contrast-pairs`.
- Vérifier visuellement sur `/styleguide` (mobile 390 px et desktop 1280 px : `node scripts/screenshot.mjs`).

## Palette et règle 70 / 20 / 10

| Rôle | Couleurs | Part de surface |
|---|---|---|
| Base minéral doux | crème sable `#F4F1EC`, beige doux `#EDE7DF`, vert sauge `#A8B5A2`, brun lin `#6B5E53` | ~70 % |
| Profondeur nuit douce | bleu nuit `#2E3A44`, vert profond `#3F5A54`, gris brume `#A5B1B5` | ~20 % |
| Accent or doux | `#D6B38A` | ≤ 10 % |

Teintes dérivées (mélanges des couleurs validées, aucune nouvelle teinte) : `sauge-voile` `#E1E2DA`, `or-voile` `#ECE2D4`, `nuit-intense` `#26313A`.

Règles d'usage :
- **Texte** : bleu nuit sur fond clair, crème sur fond sombre. Brun lin pour le secondaire. Jamais de sauge, de brume ou d'or en texte sur fond clair (contraste insuffisant). Gris brume sur vert profond : grands textes uniquement (3,4:1).
- **Or doux** : boutons principaux (texte bleu nuit), filets, puces, un détail par écran. Trop d'or = cheap.
- **Sauge** : aplats, filets, pictos, fonds de cartes en teinte claire (`sauge-voile`).
- **Interdits** : rose et fuchsia (l'ancien `#E0257A` est banni), noir pur `#000`, blanc froid `#FFF`, dégradés saturés, néons.
- Trop sombre = anxiogène, trop clair = fade : alterner les ambiances.

## Ambiances (système par type de contenu)

| Ambiance | Fond | Usage |
|---|---|---|
| **Jour** (éducatif, rassurant) | crème / beige, texte bleu nuit, touches sauge | sections explicatives, FAQ, bibliothèque |
| **Aube** (premium, désir) | crème + dégradé très léger vers or voile, accents or | offre, CTA, page merci |
| **Nuit** (émotionnel, SPM, introspection) | bleu nuit ou vert profond, texte crème | problème, histoire, citations, phase lutéale |

Classes utilitaires : `.deep` (nuit), `.dawn` (aube), `.grain` (texture papier/lin, à utiliser sur de grandes surfaces seulement).

## Typographie

- Titres : **Cormorant Garamond** 500 (italique pour les phrases signature). Fallback Playfair Display, Georgia.
- Texte : **Inter** 400/500/600.
- Accent manuscrit : réservé à « signature / journal » (classe `.signature`), jamais dans un bouton ou un titre de section.
- Longueur de ligne ≤ 68 caractères. Titres en `text-wrap: balance`.
- Polices auto-hébergées (@fontsource), préchargées dans `BaseLayout`. Jamais d'appel à Google Fonts.

## Photo et illustration

À faire : faceless ou semi-faceless, mains, dos, nuque, corps en mouvement lent, mer, horizon, vent, herbes, lin, céramique, vapeur (thé, matcha), lumière naturelle et rasante, grain léger.

À refuser : fitness agressif, « clean girl TikTok », esthétique stérile, lumière blanche froide, stock générique (sourires face caméra, bureaux), corps comparés, objectifs esthétiques.

Tant qu'une photo réelle manque : illustration SVG de marque (`src/components/art/`) ou emplacement `.todo` explicite. **Jamais de photo simulée présentée comme réelle**, jamais de faux témoignage, faux avatar ou faux logo presse.

## Mouvement

- **Un seul** moment d'animation marquant : l'entrée du hero (vidéo ou lever du cercle). Pas de fade-in sur chaque bloc.
- Transitions d'état courtes (`--motion-duration-fast`).
- `prefers-reduced-motion` : tout est coupé, la vidéo hero est remplacée par son poster.

## Accessibilité (non négociable)

Mobile d'abord, contrastes AA, focus visible (`--semantic-focus`, or sur fond nuit), cibles tactiles ≥ 44 px, lien d'évitement, vidéo avec bouton pause, aucune information portée par la couleur seule.

## Ton des textes affichés

Direct, incarné, apaisant, sensoriel, intelligent, concret. Tutoiement. Jamais infantilisant, pseudo-médical, mystique ou girlboss. Pas de promesse miracle ni de chiffre de résultat. Phrases signature : « Tu n'es pas instable. Tu es cyclique. » · « Ralentir est une stratégie hormonale. » · « Ton corps n'est pas le problème. Le flou, si. »

## Checklist avant de livrer un écran

1. Uniquement des tokens sémantiques, nouveaux couples ajoutés à `contrast-pairs`, `npm run check:contrast` vert.
2. Répartition 70/20/10 respectée à l'échelle de la page.
3. Une seule animation marquante, coupée en mouvement réduit.
4. Capture 390 px et 1280 px relue.
5. Aucun contenu inventé : les manques sont en `TODO_PREUVE` / `TODO_ASSET`.
