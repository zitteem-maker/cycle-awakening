# Cloudflare Pages Functions

| Route | Étape | Rôle |
|---|---|---|
| `POST /api/newsletter` | 3 | Inscription newsletter Brevo, double opt-in (`newsletter.js`) |
| `/api/checkout`, `/api/stripe-webhook` | 4 (option B) | Paiement |
| assistante IA | 7 | Appels à l'API Claude côté serveur |

Les secrets sont lus depuis les variables Cloudflare (type Secret), jamais depuis le code. Voir `.env.example`.
Test local : `npx wrangler pages dev dist` après `npm run build` (avec un fichier `.dev.vars` non commité).

## Déploiement sur Cloudflare Workers

Le projet Cloudflare est un **Worker avec fichiers statiques** (`wrangler.jsonc`) :
- `npm run build` produit `dist/`, servi tel quel ;
- `worker/index.js` ne traite que `/api/newsletter` (il réutilise `functions/api/newsletter.js`) ;
- branche `main` = production, autres branches (`preview`) = liens de prévisualisation.

Test local : `npm run build && npx wrangler dev`.
