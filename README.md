# Cycle Awakening

*Redevenir toi. Chaque mois.*

Site, livre PDF et (plus tard) espace membre de Cycle Awakening. Déployé sur Cloudflare Pages.

## Démarrer

```bash
npm install
cp .env.example .env   # puis compléter
npm run dev            # http://localhost:4321  (guide de style : /styleguide)
npm run build          # tokens + contrôle des contrastes + build statique dans dist/
```

## Structure

```
design-tokens/tokens.json   Source unique du design (couleurs, typo, espacements, mouvement, print)
design-tokens/dist/         Généré par `npm run tokens` (CSS + JSON), non commité
src/config/site.ts          Config publique lue depuis l'environnement (PUBLIC_SITE_URL, PUBLIC_CHECKOUT_URL, drapeaux)
src/config/offers.ts        Offres, prix, nombre de pages du livre (variables uniques)
src/components/Cta.astro    CTA d'achat unique (piloté par PUBLIC_CHECKOUT_URL)
src/layouts/BaseLayout.astro  SEO, Open Graph, favicon, polices préchargées
src/pages/                  Pages du site
public/                     Fichiers statiques (_headers, _redirects, favicon, image de partage)
scripts/                    Outils : tokens, contrastes, image de partage, liens UTM, captures
book/                       Livre PDF (étape 2)
functions/                  Cloudflare Pages Functions (paiement, webhook, assistante — étapes 4 et 7)
docs/                       Audit, migration, liens UTM, sources
```

## Scripts

| Commande | Rôle |
|---|---|
| `npm run tokens` | Génère les variables CSS depuis `design-tokens/tokens.json` |
| `npm run check:contrast` | Vérifie les contrastes WCAG AA des couples déclarés (bloque le build si échec) |
| `npm run share-image` | Régénère l'image de partage 1200×630, le favicon et les icônes |
| `npm run utm` | Régénère `docs/LIENS-UTM.md` et `public/_redirects` (lit `PUBLIC_SITE_URL`) |

## Règles

- Aucun secret dans le dépôt : variables d'environnement uniquement (voir `.env.example`).
- Aucune donnée inventée : une preuve absente = emplacement `TODO_PREUVE`.
- Prix et nombre de pages : uniquement dans `src/config/offers.ts`.

## Documentation

- [Audit de l'existant](docs/AUDIT.md)
- [Migration : GitHub, Cloudflare, domaine, DNS, email](docs/MIGRATION.md)
- [Liens UTM par réseau](docs/LIENS-UTM.md)
- [Documents sources](docs/SOURCES.md)
