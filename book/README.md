# Livre PDF — Cycle Awakening, Le Guide

Source HTML/CSS reproductible, rendue en PDF A4 par Chromium (Playwright). Mêmes design tokens que le site.

## Commandes

| Commande | Résultat |
|---|---|
| `npm run build:book:brouillon` | Version de travail avec filigrane « Brouillon », quel que soit l'état des textes. Ne touche pas au nombre de pages du site. |
| `npm run build:book` | Version finale. **Refuse** de se fabriquer tant qu'un chapitre ou un outil n'est pas `valide`, ou qu'il reste un `TODO_SOURCE`. Écrit le nombre réel de pages dans `src/config/book-meta.json` (utilisé par le site). |

Sorties dans `book/dist/` (non versionné, reproductible) :
- `cycle-awakening-guide.pdf` — version écran : couverture, avertissement médical en page 2, sommaire cliquable, chapitres, outils en annexe, rappel final ;
- `cycle-awakening-guide-telephone.pdf` — même contenu au format téléphone / liseuse (page étroite, une colonne), avec la notice bonus ;
- `cycle-awakening-outils-imprimables.pdf` — les outils seuls (journal, planner, protocole J24–J28, courses, notice bonus), une page A4 chacun ;
- `cycle-awakening-notice-pour-lui.pdf` — la notice bonus seule, à transmettre.

Recettes : `src/recettes/*.md` (frontmatter `nom`, `theme`, `titre`, `categorie`, `temps`, `portions`, `photo`, `intro`) et `src/recettes/themes.json` (pages d'ouverture). Photos dans `src/images/recettes/` (nom de fichier = champ `photo`).

## Contenu

- `livre.json` — titre, sous-titre, édition, métadonnées.
- `src/chapitres/NN-*.md` — un fichier par chapitre (Markdown + encadrés HTML `<aside class="encadre">`). Frontmatter :
  - `statut: plan` (plan proposé), `brouillon` (rédigé, à valider), `valide` (validé par la fondatrice).
- `src/outils/*.html` + `outils.json` — outils imprimables, même logique de statut.
- `styles/livre.css` — mise en page (les règles `@page` sont générées par `build.mjs` à partir des tokens).

## Circuit de validation

1. Claude propose un chapitre (`brouillon`) dans le ton de marque.
2. La fondatrice relit, annote, valide ; Claude intègre les retours.
3. Les sources sont vérifiées une à une ; chaque `TODO_SOURCE` est remplacé par une source réelle ou l'affirmation est retirée.
4. Statut passé à `valide`. Quand tout est `valide` : `npm run build:book`.

## Règles de contenu

Pas de diagnostic, pas de dosage, pas de complément recommandé, pas de régime ni de chiffre calorique, pas de promesse de résultat. Encadré « Quand consulter » dans chaque chapitre concerné. Mention « ne remplace pas un avis médical » en page 2 et en fin de livre (automatique).

## Contrôles automatiques

Signets PDF (structure des titres), PDF balisé, langue `fr-FR`, liens actifs, polices incorporées, métadonnées (titre, auteure, sujet, mots-clés), poids < 15 Mo (le build échoue au-delà).
