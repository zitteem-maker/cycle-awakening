# Mesure d'audience sans cookie

Décidée à l'étape 3 (brief : « analytics sans cookie par défaut »). Aucun outil tiers, aucun cookie, aucun identifiant.

## Comment ça marche
- `src/scripts/mesure.ts` (chargé sur toutes les pages) envoie un petit message à `/api/evenement` :
  - `page_vue` à chaque page (avec le site d'origine, jamais l'adresse complète) ;
  - un clic sur tout élément `data-event` (boutons d'achat `cta_click`, liste d'attente `cta_waitlist_click`, recommandations `reco_click`) ;
  - `newsletter_signup` après une inscription réussie, `purchase` sur la page Merci ; plus tard `checkout_start`, `quiz_start`, `quiz_signup`.
- Rien n'est envoyé si le navigateur indique « Do Not Track » ou « Global Privacy Control ».
- `worker/index.js` vérifie le nom de l'événement (liste fermée) et l'écrit dans **Workers Analytics Engine** (jeu de données `cycle_awakening_evenements`, liaison `EVENEMENTS` dans `wrangler.jsonc`). Conservation : 3 mois (Cloudflare).
- Enregistré : action, page, emplacement, détail (offre ou marque), pays, site d'origine. Jamais : IP, email, identifiant.

## Prérequis (une fois)
Activer Analytics Engine dans Cloudflare : Workers & Pages → **Analytics Engine** → Enable
(`https://dash.cloudflare.com/<ACCOUNT_ID>/workers/analytics-engine`). **Sans cette activation, le déploiement de `main` échoue** dès que `wrangler.jsonc` contient la liaison : à faire avant toute fusion vers `main`.

## Lire les chiffres
API SQL d'Analytics Engine (POST `https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/analytics_engine/sql`), par exemple :

```sql
SELECT blob1 AS evenement, blob2 AS page, SUM(_sample_interval) AS total
FROM cycle_awakening_evenements
WHERE timestamp > NOW() - INTERVAL '7' DAY
GROUP BY evenement, page
ORDER BY total DESC
```

Un tableau de bord lisible pour la fondatrice pourra être ajouté plus tard (page privée ou rapport hebdomadaire).
