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
- Première tâche de la nouvelle session : vérifier que le déploiement de `preview` réussit, puis envoyer le lien à la fondatrice (au lieu de vidéos).

## État des étapes
1. Fondations : fait.
2. Livre PDF : fait, en attente des éléments listés dans `docs/BACKLOG.md` (« À faire juste avant la mise en ligne ») ; `npm run build:book:relecture` pour une édition de relecture.
3. Site : accueil refait (roue du cycle en vue éclatée + volume, verre liquide, animations GSAP/Lenis dans `src/scripts/motion.ts`), newsletter Brevo double opt-in (`functions/api/newsletter.js`, variables `BREVO_*`, en attente du compte Brevo). **Reste : blog (structure, RSS, sitemap, 4 articles), page Recommandations (règle d'affiliation à rappeler avant), mesure d'audience sans cookie.**
4 à 10 : non commencées (attendre le « go »).

## Règles permanentes
Aucune donnée inventée (TODO_PREUVE), aucun secret dans le dépôt, pas d'allégation santé, modules grossesse derrière `FEATURE_PREGNANCY_MODULES=false`, attendre le « go » entre les étapes. Direction artistique : skill `cycle-awakening-da`.
