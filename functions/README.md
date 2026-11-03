# Cloudflare Pages Functions

| Route | Étape | Rôle |
|---|---|---|
| `POST /api/newsletter` | 3 | Inscription newsletter Brevo, double opt-in (`newsletter.js`) |
| `/api/checkout`, `/api/stripe-webhook` | 4 (option B) | Paiement |
| assistante IA | 7 | Appels à l'API Claude côté serveur |

Les secrets sont lus depuis les variables Cloudflare (type Secret), jamais depuis le code. Voir `.env.example`.
Test local : `npx wrangler pages dev dist` après `npm run build` (avec un fichier `.dev.vars` non commité).
