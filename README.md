# Cycle Awakening

*Redevenir toi. Chaque mois.*

Site, livre PDF et (plus tard) espace membre de Cycle Awakening. Déployé sur Cloudflare Pages.

## Démarrer

```bash
npm install
cp .env.example .env   # puis compléter
npm run dev            # http://localhost:4321  (guide de style : /styleguide)
# Images de marque : npm run logo && npm run share-image
npm run build          # tokens + contrôle des contrastes + build statique dans dist/
```

## Structure

```
design-tokens/tokens.json   Source unique du design (couleurs, typo, espacements, mouvement, print)
design-tokens/dist/         Généré par `npm run tokens` (CSS + JSON), non commité
src/config/site.ts          Config publique lue depuis l'environnement (PUBLIC_SITE_URL, PUBLIC_CHECKOUT_URL, drapeaux)
src/config/offers.ts        Offres, prix, nombre de pages du livre (variables uniques)
src/config/legal.ts         Informations légales (TODO_LEGAL à compléter), sous-traitants
src/config/book-meta.json   Nombre de pages du livre, écrit par le build du livre
src/components/Cta.astro    CTA d'achat unique (piloté par PUBLIC_CHECKOUT_URL)
src/components/HeroVideo.astro  Fond de hero vidéo accessible (ou illustration horizon)
src/components/Logo.astro   Logo inline (généré par `npm run logo`)
src/layouts/                BaseLayout (SEO, Open Graph, favicon, polices), PageLayout, LegalLayout
src/pages/                  Pages du site
public/                     Fichiers statiques (_headers, _redirects, favicon, image de partage)
scripts/                    Outils : tokens, contrastes, image de partage, liens UTM, captures
book/                       Livre PDF (étape 2)
functions/                  Cloudflare Pages Functions (paiement, webhook, assistante — étapes 4 et 7)
legacy/                     HTML de l'ancien site (référence de contenu, non publié)
docs/                       Audit, migration, liens UTM, assets, backlog, règles IA, sources
.claude/skills/             Skills projet : DA, pages légales FR, vidéo hero, SEO et blog
```

## Scripts

| Commande | Rôle |
|---|---|
| `npm run tokens` | Génère les variables CSS depuis `design-tokens/tokens.json` |
| `npm run check:contrast` | Vérifie les contrastes WCAG AA des couples déclarés (bloque le build si échec) |
| `npm run share-image` | Régénère l'image de partage 1200×630, le favicon et les icônes |
| `npm run utm` | Régénère `docs/LIENS-UTM.md` et `public/_redirects` (lit `PUBLIC_SITE_URL`) |
| `npm run logo` | Régénère le logo vectorisé, le favicon et le composant `Logo.astro` |
| `npm run hero-video -- <fichier> [début] [durée]` | Compresse une vidéo hero (MP4, WebM, posters) |

## Règles

- Aucun secret dans le dépôt : variables d'environnement uniquement (voir `.env.example`).
- Aucune donnée inventée : une preuve absente = emplacement `TODO_PREUVE`.
- Prix et nombre de pages : uniquement dans `src/config/offers.ts`.

## Documentation

- [Audit de l'existant](docs/AUDIT.md)
- [Migration : GitHub, Cloudflare, domaine, DNS, email](docs/MIGRATION.md)
- [Liens UTM par réseau](docs/LIENS-UTM.md)
- [Assets : état, sites recommandés, crédits](docs/ASSETS.md)
- [Backlog des décisions](docs/BACKLOG.md)
- [Plan éditorial du blog](docs/PLAN-EDITORIAL.md)
- [Règles de l'assistante IA](docs/regles-assistante-ia.md)
- [Espace accompagnement (test)](docs/ACCOMPAGNEMENT.md)
- [Documents sources](docs/SOURCES.md)
