# Espace accompagnement « Rythme & Assiette » (version test)

Page privée : `/accompagnement` (non liée depuis le site, `noindex`). Prototype de la future offre d'accompagnement (Premium).

## Ce qu'elle contient

- **Semaine** : séances du jour, rituels à cocher, coucher, repas avec les portions ; dimanche « Au max » ou « Chill morning ».
- **Séances** : CrossFit, tractions, Pilates (avec le bloc taille fine), vinyasa, yin, mobilité, marche, tennis.
- **Assiette** : guide FODMAP filtrable, « Cuisiner avec mon frigo » (bouton désactivé tant que l'assistante n'est pas branchée), ventre léger, laits, fruits, repas plaisir.
- **Encas** : petit-déjeuner, après le CrossFit, collations ; pâtisseries avec réglage du nombre de parts.
- **Courses** : lundi après-midi, jeudi, samedi (optionnel) et commande « Autres », tout cocher / décocher.

| Fichier | Rôle |
|---|---|
| `src/pages/accompagnement.astro` | Page, connexion, synchronisation |
| `src/scripts/accompagnement/app.js` | Interface ; textes des séances et de la semaine en tête (`SESSIONS`, `DAYS`, `BKF`, `SNK`…) |
| `src/scripts/accompagnement/store.js` | Copie locale + synchronisation Supabase |
| `src/data/accompagnement/programme.json` | Repas, guide des aliments, fruits, farines, courses, recettes |
| `src/styles/accompagnement.css` | Styles (tokens de la DA) |
| `supabase/migrations/20261026120000_accompagnement_state.sql` | Table et règles d'accès (RLS) |

## Mise en route (une fois)

Sans Supabase, la page marche déjà en **mode local** : tout reste sur l'appareil.

### 1. Supabase

1. ☐ https://supabase.com → *New project* (région Europe, par exemple Frankfurt).
2. ☐ *SQL Editor* → coller le contenu de `supabase/migrations/20261026120000_accompagnement_state.sql` → *Run*.
3. ☐ *Authentication → URL Configuration* :
   - **Site URL** : `https://cycleawakening.com`
   - **Redirect URLs** : l'URL de prévisualisation de la branche suivie de `/accompagnement` (voir étape 2), et `http://localhost:4321/accompagnement`.
4. ☐ *Project Settings → API* : copier **Project URL** et la clé **anon public**. La clé `service_role` ne va jamais dans le site.

### 2. Cloudflare Pages

1. ☐ *Workers & Pages → cycle-awakening → Settings → Variables and Secrets*, environnement **Preview** :
   - `PUBLIC_SUPABASE_URL` = Project URL
   - `PUBLIC_SUPABASE_ANON_KEY` = clé anon public
2. ☐ *Deployments* → relancer le déploiement de la branche `claude/accompagnement` : les variables `PUBLIC_` sont lues au build.
3. ☐ L'URL de la branche ressemble à `https://claude-accompagnement.cycle-awakening.pages.dev/accompagnement`.

### 3. Première connexion

1. ☐ Ouvrir `/accompagnement`, entrer ton email, ouvrir le lien reçu **sur le même appareil**.
2. ☐ Une fois ton compte créé : Supabase → *Authentication → Sign In / Providers* → désactiver **Allow new users to sign up**. Personne d'autre ne peut alors créer de compte pendant le test.

## Avant d'ouvrir à d'autres personnes

- Contenus aujourd'hui personnels à la fondatrice (programme, objectifs, repas) : prévoir un profil par membre.
- Données de santé (digestion, cycle, alimentation) : mettre à jour la politique de confidentialité (Supabase comme sous-traitant, hébergement UE, base légale, durée de conservation) avec le skill `pages-legales-fr`.
- Accès payant : contrôle côté serveur (abonnement Stripe actif), pas seulement dans le navigateur.
- « Cuisiner avec mon frigo » : à brancher sur l'assistante (étape 7, `ANTHROPIC_API_KEY` en secret Cloudflare, Pages Function), en respectant `docs/regles-assistante-ia.md`.
- Styles : remplacer les dernières tailles en pixels de `accompagnement.css` par les tokens.
