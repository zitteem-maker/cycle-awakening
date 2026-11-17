---
name: seo-site
description: SEO technique et suivi Google de Cycle Awakening — balises title et description, URL canoniques, hreflang FR/EN, Open Graph et cartes de partage, données structurées JSON-LD (organisation, auteure, article, fil d'Ariane), plan du site, robots.txt, performance (Core Web Vitals), Google Search Console et Bing, audit automatique (npm run seo). À charger dès qu'on crée ou modifie une page, un gabarit, un article, une image, une redirection, le sitemap ou le robots.txt, qu'on branche un outil de suivi, ou qu'on pose une question « est-ce que Google va trouver / afficher / classer ça ».
---

# SEO du site — Cycle Awakening

Complète le skill `seo-blog` (rédaction, sujets, E-E-A-T, rythme). Ici : tout ce qui est **technique et mesurable**.
Domaine : https://cycleawakening.com · Langues : français (racine) et anglais (`/en`).

## 1. Où vit le SEO dans le code

| Quoi | Où |
|---|---|
| Balises `<head>` (title, description, canonical, robots, hreflang, Open Graph, Twitter, RSS, JSON-LD, préchargement LCP) | `src/layouts/BaseLayout.astro` |
| Données structurées (organisation, auteure, site, article, fil d'Ariane, collection) | `src/config/seo.ts` |
| Table des pages FR/EN et slugs traduits (alimente hreflang et sélecteur de langue) | `src/i18n/index.ts` |
| Plan du site (lastmod réels, alternates) | `src/pages/sitemap.xml.ts` |
| Robots | `public/robots.txt` |
| En-têtes HTTP (cache images, noindex des `/go/`) | `public/_headers` |
| Redirections (liens courts, `/go/<marque>`, anciens sitemaps) | `public/liens-courts.txt` + `src/pages/redirections-affiliation.txt.ts` → `dist/_redirects` |
| Variantes de photos et cartes de partage 1200×630 | `scripts/build-images.mjs` (`npm run images`) |
| Audit automatique | `scripts/audit-seo.mjs` (`npm run seo`) |

## 2. Règles par élément

**Titre (`<title>`)** : 60 caractères maximum (Google coupe au-delà). Mot-clé principal au début, marque à la fin (« … · Cycle Awakening », ajoutée seulement si ça tient dans 60). Un titre unique par page. Articles : champ `seoTitle` du frontmatter (≤ 60, sans la marque) ; le H1 peut être plus long.

**Description** : 110 à 160 caractères pour les articles (schéma), 70 à 160 pour les autres. Contient la requête principale et une raison de cliquer. Jamais de promesse de résultat, jamais d'allégation santé. Unique par page.

**H1** : un seul par page. Intertitres H2 formulés comme les questions réelles.

**URL** : courtes, en minuscules, sans date, sans accents, mots-clés. Slugs anglais traduits (`/en/blog/tiredness-before-period`). **Changer une URL publiée exige une redirection 301** (ligne dans `public/liens-courts.txt` ou `redirections-affiliation.txt.ts`) : sinon on perd le classement.

**Canonical** : toujours auto-référente, sans `.html` ni slash final (le layout s'en charge).

**hreflang** : `fr`, `en`, `x-default` (= français), réciproques. Un article n'a un équivalent que si sa traduction est **publiée** (`traductionDe` dans `src/content/blog/en/`). Une page sans traduction n'émet pas de hreflang.

**Open Graph / Twitter** : `og:image` 1200×630. Articles : carte dédiée générée par `npm run images` (titre + photo). Autres pages : `public/images/share/og-default.png`.

**Pages à ne pas indexer** (`noindex`) : merci, pages newsletter, brouillons, CGV tant que `salesReady` est faux, styleguide. Règle d'or : **une page noindex n'est ni dans le sitemap ni bloquée par robots.txt** (sinon Google ne voit jamais le noindex).

**Liens d'affiliation** : toujours via `/go/<marque>`, `rel="sponsored nofollow noopener"`, badge visible. `/go/` est bloqué dans robots.txt et en `X-Robots-Tag: noindex`.

## 3. Données structurées (JSON-LD)

On ne déclare que ce qui est **visible sur la page et vrai**.

| Page | Types |
|---|---|
| Accueil FR et EN | `Organization` (+ `legalName` POLYMA LTD, logo, `sameAs`), `Person` (Emeline Zitte), `WebSite` |
| Article | `BlogPosting` (auteure et éditeur en objets complets, images, dates, `keywords`, `articleSection`, `wordCount`, `citation` = sources avec URL, `reviewedBy` si relecture pro) + `BreadcrumbList` |
| Blog, Recommandations | `CollectionPage` (+ `ItemList` pour le blog) + `BreadcrumbList` |

À **ne pas faire** : `AggregateRating` / `Review` inventés ; `FAQPage` (Google ne l'affiche plus pour ce type de site) ; `MedicalWebPage` ou `MedicalCondition` sans relecture par un·e professionnel·le de santé ; `Product`/`Offer` avant l'ouverture réelle des ventes.

**À l'ouverture des ventes** : ajouter sur l'accueil un `Product` (le livre digital) avec `Offer` (prix et devise issus de `src/config/offers.ts`, `availability` réelle, `url` du paiement). Pas de note ni d'avis tant qu'il n'y en a pas de vrais.

## 4. Performance (Core Web Vitals, mesurés avec Lighthouse mobile)

Objectifs : LCP ≤ 2,5 s, CLS ≤ 0,1, TBT bas. Mesure du 17 novembre 2026 : accueil 96/100, article 86/100 avant optimisation, SEO 100, accessibilité 100.
- Photo d'en-tête d'article : `srcset` 640/960/original + `<link rel="preload" as="image">` (fait dans `BlogArticle.astro` et `BaseLayout.astro`).
- Toute nouvelle photo de blog : la déposer dans `public/images/blog/<slug>.webp` (≤ 1600 px), lancer `npm run images`, committer les variantes.
- Cache navigateur 1 semaine sur `/images/*` et `/brand/*`, immuable sur `/_astro/*` (`public/_headers`).
- Ne pas ajouter de script tiers (analytics, chat, pixels) sans en mesurer l'effet : la mesure d'audience est sans cookie et maison.
- Mesurer : `npx lighthouse https://cycleawakening.com/<page> --form-factor=mobile` (Chromium : `CHROME_PATH=/opt/pw-browsers/chromium`).

## 5. Avant de publier une page ou un article (liste de contrôle)

1. Titre ≤ 60, description 110–160 (articles), un H1, une requête principale par page (voir `docs/50-recherches.md`).
2. Article : `seoTitle`, photo + `photoAlt` + crédit, `consulter`, sources vérifiées, au moins 3 liens internes (pilier + voisins).
3. **Traduction anglaise** créée avant publication (`src/content/blog/en/`, `traductionDe`).
4. `npm run images` si photo ou titre nouveau.
5. `npm run build && npm run seo` : doit afficher « ✅ Aucun échec ». Corriger aussi les alertes quand c'est raisonnable.
6. Après mise en ligne : dans Search Console, « Inspection de l'URL » → « Demander une indexation » pour les nouveaux articles ; vérifier l'URL dans le sitemap.
7. Aucun lien interne vers un brouillon ; aucune page noindex dans le sitemap (l'audit le vérifie).

## 6. Google Search Console, Bing, suivi

Procédure complète, pas à pas : `docs/SEO-GOOGLE.md`. Résumé :
- Propriété **Domaine** `cycleawakening.com` (vérification par DNS TXT dans Cloudflare), puis envoi de `https://cycleawakening.com/sitemap.xml`.
- Bing Webmaster Tools : import depuis Search Console.
- Cloudflare : « Crawler Hints » (IndexNow) activé pour Bing et Yandex.
- Rituel mensuel : requêtes qui apparaissent sans clic (position 5–20) → renforcer l'article concerné ; pages « Détectées, actuellement non indexées » → liens internes ; couverture et ergonomie mobile.
- Mise à jour d'un article après 8 à 12 semaines avec les vraies requêtes ; `updatedAt` modifié **seulement** pour une vraie modification.

## 7. Pièges déjà rencontrés

- `public/_redirects` écrasé par le fichier généré des `/go/` : les liens courts sont désormais dans `public/liens-courts.txt` et fusionnés au build.
- Titres d'articles de 80 à 95 caractères tronqués par Google : d'où `seoTitle`.
- Données structurées par simple `@id` : Google ne résout pas les renvois d'une page à l'autre ; chaque page porte ses objets complets (sauf le graphe de l'accueil).
- Un sitemap généré automatiquement ne sait pas associer `/recommandations` ↔ `/en/recommendations` : le plan du site est écrit sur mesure.
