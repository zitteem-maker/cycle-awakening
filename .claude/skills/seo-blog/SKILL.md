---
name: seo-blog
description: Référencement naturel (SEO) et blog de Cycle Awakening — choix des sujets à partir des 50 recherches, structure d'un article qui se classe sur Google, règles spécifiques aux contenus santé (E-E-A-T, sources, relecture), maillage interne, données structurées, rythme de publication, email « Quoi de neuf » vers les abonnées. À charger dès qu'on planifie, rédige, relit, met à jour ou publie un article, une page pilier, ou qu'on travaille sitemap, balises, Search Console ou la newsletter liée au blog.
---

# SEO et blog — Cycle Awakening

## 1. Ce que Google attend d'un site comme celui-ci

Les contenus sur la santé sont classés par Google parmi les sujets « Your Money or Your Life » : il y applique ses exigences les plus fortes de fiabilité (E-E-A-T : expérience, expertise, autorité, confiance). Conséquences concrètes :

- **Expérience vécue** : la fondatrice écrit à la première personne quand c'est pertinent (« ce que j'ai vécu, ce que j'ai testé »). C'est l'atout principal face aux sites médicaux.
- **Expertise** : chaque article affiche son auteure, la date de publication et de mise à jour, et à terme « relu par [nom, profession] ». Sans relecture professionnelle, rester sur le mode de vie, jamais sur le soin.
- **Sources** : toute affirmation physiologique renvoie à une source fiable et vérifiée (HAS, Inserm, OMS, Ameli, CNGOF, Collège national des sages-femmes, revues scientifiques). **Ne jamais inventer une source, une étude ou un chiffre.** Si une source n'est pas vérifiée, on retire l'affirmation.
- **Contenu à grande échelle interdit** : Google pénalise la production massive d'articles pour se classer, qu'ils soient écrits par une IA ou non. Pas d'article quotidien généré en série. Chaque article apporte une vraie réponse, relue par la fondatrice.

## 2. Choisir le sujet

1. Partir de `docs/50-recherches.md` (langage réel des lectrices).
2. **Une intention de recherche = un article.** Regrouper les requêtes qui veulent la même réponse (ex. « fatigue avant règles que faire » + « cycle menstruel fatigue »).
3. Rattacher chaque article à une **page pilier** :

| Pilier (page longue, mise à jour régulièrement) | Articles satellites (exemples) |
|---|---|
| Phase lutéale et SPM | fatigue, pleurs, envie de sucre, irritabilité, seins douloureux, ballonnements |
| Alimentation et cycle | que manger pendant les règles, ovulation, menus, recettes |
| Sport et cycle | sport pendant les règles, musculation, yoga, Pilates, course |
| SOPK | symptômes, alimentation, sport |
| Endométriose | douleur, fatigue, sport |
| Périménopause | fatigue, sommeil, libido |

4. Vérifier la page de résultats Google pour la requête : si les 10 premiers résultats sont des sites médicaux institutionnels, viser un angle complémentaire (vécu, concret, quotidien) plutôt que la définition.

## 3. Structure d'un article

Frontmatter (collection `src/content/blog/`) :

```yaml
title: "Fatigue avant les règles : pourquoi, et quoi faire concrètement"   # ≤ 60 caractères si possible
description: "…"            # 140–155 caractères, donne envie, contient la requête
slug: fatigue-avant-regles  # court, sans date, sans mots vides
pillar: phase-luteale
keywords: [fatigue avant règles que faire, cycle menstruel fatigue]
author: fondatrice
reviewedBy: null             # nom et profession quand une relecture pro existe
publishedAt: 2026-10-20
updatedAt: 2026-10-20
sources: [{ label: "…", url: "…" }]
```

Corps :
1. **H1** = le titre (un seul H1).
2. **Réponse immédiate** dans les 2–3 premières phrases (ce que la lectrice cherche), puis le développement.
3. Intertitres H2 formulés comme les questions réelles (« Pourquoi je suis épuisée avant mes règles ? »).
4. Partie concrète : 3 à 5 actions simples (manger, bouger, ralentir, s'organiser). Pas de dosage, pas de complément, pas de calories.
5. **Encadré « Quand consulter »** obligatoire (signaux d'alerte de `docs/regles-assistante-ia.md` §3, adaptés au sujet).
6. Mention « ce contenu ne remplace pas un avis médical » (composant d'article, pas répétée dans le texte).
7. **Maillage interne** : 1 lien vers la page pilier, 2 à 4 liens vers des articles voisins, avec des ancres descriptives (jamais « cliquez ici »).
8. Appel à l'action doux : quiz (étape 5) ou newsletter ; le guide seulement quand c'est pertinent.
9. Sources en fin d'article.

Longueur : celle qu'il faut pour répondre complètement (souvent 900 à 1 600 mots), jamais du remplissage.

## 4. Technique (déjà prévu dans le site)

- Balises `title`, `description`, `canonical`, Open Graph : `BaseLayout`.
- Données structurées : `Article` (auteure, dates, image) et `BreadcrumbList`. Ne pas compter sur le balisage FAQ : Google ne l'affiche plus en résultat enrichi pour ce type de site.
- `sitemap.xml` et flux **RSS** (`/blog/rss.xml`) générés au build.
- Image de partage par article (1200×630), texte alternatif sur chaque image.
- Performance : pas d'image non optimisée, pas de script tiers.
- Google Search Console : domaine vérifié, sitemap envoyé.

## 5. Rythme de publication

- **Lancement : 4 articles** (1 page pilier + 3 satellites du même pilier), pour que le maillage existe dès le premier jour.
- **Ensuite : 2 articles par semaine**, à jour fixe. La régularité compte plus que le volume ; un article quotidien n'améliore pas le classement s'il baisse la qualité, et il épuise la relecture.
- **Mise à jour** : relire chaque article après 8 à 12 semaines avec les données Search Console (requêtes réelles, position) et enrichir. Mettre à jour `updatedAt` seulement en cas de vraie modification.
- Calendrier : `docs/PLAN-EDITORIAL.md`.

## 6. Email « Quoi de neuf »

- Source : le flux RSS du blog. Brevo et Kit savent envoyer automatiquement une campagne à partir d'un flux RSS.
- **Recommandation : 1 email par semaine** qui regroupe les nouveaux articles (2 au maximum). Au-delà, le taux de désabonnement et le classement en spam augmentent, surtout pour une liste jeune.
- Envoyé uniquement aux abonnées qui ont confirmé (double opt-in), avec lien de désabonnement en un clic.
- Objet clair, pas d'urgence artificielle ; un seul appel à l'action principal.

## 7. Checklist avant publication

1. Intention unique, pilier rattaché, requête dans le titre, la description et le premier paragraphe.
2. Réponse dans les premières lignes ; actions concrètes ; encadré « Quand consulter ».
3. Aucune promesse de résultat, aucun diagnostic, aucun dosage, aucun complément recommandé, aucun chiffre calorique (règles de marque et `regles-assistante-ia.md`).
4. Sources vérifiées et cliquables ; aucune source inventée.
5. 3 à 5 liens internes, ancres descriptives ; lien depuis la page pilier vers le nouvel article.
6. Image de partage et texte alternatif.
7. Relu et validé par la fondatrice (statut `relu` puis `publié`, cf. section 10 du brief).
