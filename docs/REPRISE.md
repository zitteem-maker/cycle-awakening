# Reprise de session — où en est le projet (4 novembre 2026)

À lire en premier par toute nouvelle session Claude. Détails des décisions : `docs/BACKLOG.md`.

## Branches
- `preview` : branche de travail et de test (lien de prévisualisation Cloudflare). **Toujours travailler ici.**
- `main` : production. On y pousse seulement après validation écrite de la fondatrice (fusion de `preview`).
- `claude/cycle-awakening-migration-46zexk` : ancienne branche, sauvegarde, ne plus y pousser.

## Déploiement
- Cloudflare **Worker avec fichiers statiques** (pas Pages) : `wrangler.jsonc` + `worker/index.js` (route `/api/newsletter`), site statique dans `dist/` (`npm run build`). Node 22.12 (`.nvmrc`).
- Production = `main`, prévisualisations = autres branches (« Previews » activées dans Cloudflare).
- Accès prévu pour Claude : variables `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID` dans l'environnement, hôtes `api.cloudflare.com` et `*.workers.dev` autorisés. Vérifier : `npx wrangler whoami`, `npx wrangler deployments list`.
- Adresses (Account ID `0ae88d73507c203f6e39c21de527617c`, sous-domaine workers.dev `profile-agent`) :
  - production (`main`, construite automatiquement par Cloudflare) : https://cycle-awakening.profile-agent.workers.dev
  - prévisualisation (`preview`) : https://preview-cycle-awakening.profile-agent.workers.dev
- Mettre à jour la prévisualisation après un push sur `preview` (tant qu'il n'y a pas de déclencheur automatique) :
  `npm run build && CLOUDFLARE_ACCOUNT_ID=0ae88d73507c203f6e39c21de527617c CLOUDFLARE_API_TOKEN=x npx wrangler versions upload --preview-alias preview`
  (la vraie clé est ajoutée par le proxy de l'environnement ; ne jamais la mettre dans le dépôt).
- Ne jamais lancer `wrangler deploy` ni `versions deploy` à la main : la production ne change que par une fusion validée dans `main`.
- Clé Cloudflare : secret « Bearer » de l'environnement pour `api.cloudflare.com`, **limité aux préfixes** `/client/v4/accounts/<ID>/workers/scripts/`, `/workers/services/`, `/workers/subdomain`, `/builds/`, `/client/v4/user`, `/client/v4/memberships`. Raison : le téléversement des fichiers (`/workers/assets/upload`) utilise sa propre autorisation temporaire, que le secret écrasait (erreur 401 « malformed response »). Vérifier que la limitation est active : `curl -s -o /dev/null -w '%{http_code}' https://api.cloudflare.com/client/v4/accounts/<ID>/workers/assets/upload` ne doit PAS recevoir la clé.

## À faire en ouvrant la session suivante
1. Mettre à jour la prévisualisation (commande ci-dessus) avec le dernier commit de `preview` (1943202 ou plus récent).
2. Vérifier `https://preview-cycle-awakening.profile-agent.workers.dev` (accueil : bille rapide puis dernier tour et arrêt sur J17, frise et livre animés sans défilement, rose des titres net), puis envoyer le lien à la fondatrice.
3. Ensuite : suite de l'étape 3 (blog, Recommandations avec rappel de la règle d'affiliation, mesure d'audience sans cookie).

## État des étapes
1. Fondations : fait.
2. Livre PDF : fait, en attente des éléments listés dans `docs/BACKLOG.md` (« À faire juste avant la mise en ligne ») ; `npm run build:book:relecture` pour une édition de relecture.
3. Site : accueil refait (roue du cycle en vue éclatée + volume, verre liquide, animations GSAP/Lenis dans `src/scripts/motion.ts`), newsletter Brevo double opt-in (`functions/api/newsletter.js`, variables `BREVO_*`, en attente du compte Brevo). **Reste : blog (structure, RSS, sitemap, 4 articles), page Recommandations (règle d'affiliation à rappeler avant), mesure d'audience sans cookie.**
4 à 10 : non commencées (attendre le « go »).

## Règles permanentes
Aucune donnée inventée (TODO_PREUVE), aucun secret dans le dépôt, pas d'allégation santé, modules grossesse derrière `FEATURE_PREGNANCY_MODULES=false`, attendre le « go » entre les étapes. Direction artistique : skill `cycle-awakening-da`.
