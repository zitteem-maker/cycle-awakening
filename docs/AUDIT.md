# Audit de l'existant — étape 1

*Date : 6 octobre 2026. Auteur : lead dev / design. Statut : audit partiel, à compléter dès que le site en ligne est accessible.*

## 1. Ce qui a pu être vérifié

| Source | État | Constat |
|---|---|---|
| Dépôt `zitteem-maker/cycle-awakening` | ✅ lu | **Vide** : aucun commit, aucun fichier, pas de dossier `/docs`. Le site en ligne a donc vraisemblablement été **déployé par glisser-déposer** (Cloudflare Pages « Direct Upload »), sans dépôt Git. |
| Site en ligne `https://cycleawakening.pages.dev/` | ❌ non lu | L'environnement de travail bloque ce domaine (politique réseau). La Wayback Machine (`web.archive.org`) est bloquée aussi. **Aucun contenu du site n'a été récupéré.** |
| Dossier Google Drive « 🌙 Cycle Awakening — Vision du projet » | ✅ lu | 7 documents : brief marketing/produit/IA, identité visuelle (palette validée), DA v1 (.docx), DA v2 fuchsia (.docx), 50 recherches, data marché, 5 posts Instagram de lancement. Voir [`SOURCES.md`](SOURCES.md). |
| `/docs/regles-assistante-ia.md` | ❌ introuvable | Ni dans le dépôt ni dans le Drive. **Indispensable avant l'étape 7.** |
| `/docs/50-recherches.md` | ✅ importé | Copié depuis le Drive dans [`50-recherches.md`](50-recherches.md). |
| `sections_en.html` (ancienne version anglaise, fuchsia `#E0257A`) | ❌ non lu | Connu uniquement par ta description. |

### Pour débloquer la lecture du site en ligne (au choix)

1. **Autoriser le domaine** : dans les réglages de l'environnement cloud (menu de l'environnement dans la barre de titre de la session → *Edit* → *Network access*), passer en *Custom* et ajouter `cycleawakening.pages.dev` aux domaines autorisés (en gardant la liste par défaut des gestionnaires de paquets). Doc : https://code.claude.com/docs/en/cloud-environments#network-access
2. **Ou** enregistrer chaque page depuis ton navigateur (*Fichier → Enregistrer sous → Page web complète*) et déposer les fichiers dans `legacy/` du dépôt.
3. **Ou, le mieux** : obtenir les fichiers source de l'ancien propriétaire (voir §4). C'est le seul moyen de récupérer la vidéo et les images en qualité d'origine.

## 2. Structure connue du site actuel

D'après ton brief (non vérifié en ligne) :

1. Navigation
2. Hero avec vidéo `videos/ocean.mp4`
3. Bandeau de preuves (contient « +320 femmes ont rejoint ce mois-ci » + avatars à initiales)
4. Problème
5. Histoire
6. Contenu du livre (5 parties : ce qui se passe vraiment / pourquoi rien n'a marché / méthode en 3 piliers / semaine type J17–J28 / et maintenant)
7. Pour qui / pas pour qui
8. Offre — « Obtenir le livre digital — 27 € » (lien `#`)
9. FAQ
10. Newsletter
11. Footer
12. Pages annexes : **blog** (articles, URLs inconnues) et **/recommandations** (liens possiblement affiliés)
13. `sections_en.html` : version anglaise partielle, palette fuchsia abandonnée

## 3. Liste priorisée des corrections

### P0 — bloquant pour vendre ou pour la confiance

| # | Problème | Correction | État |
|---|---|---|---|
| 1 | Les CTA « Obtenir le livre digital — 27 € » pointent vers `#` : aucun paiement possible. | Composant CTA unique piloté par `PUBLIC_CHECKOUT_URL`. Tant qu'il est vide, le bouton devient « Être prévenue de la sortie » → newsletter. Plus jamais de lien mort. | ✅ fait (`src/components/Cta.astro`) — reste : créer le Payment Link Stripe (étape 4) |
| 2 | « +320 femmes ont rejoint ce mois-ci » et avatars à initiales : preuve sociale non réelle. Risque de pratique commerciale trompeuse et perte de confiance. | Supprimés. Le bandeau de preuves n'affichera que des faits vrais ; sinon emplacement `TODO_PREUVE`. | ✅ non repris dans la reconstruction |
| 3 | Nombre de pages incohérent (75 sur le site et dans le post Instagram n°5, 25 dans une maquette). | Variable unique `guide.pages` (`src/config/offers.ts`). Valeur `null` tant que tu ne confirmes pas : aucun nombre n'est affiché. | ✅ variable créée — **chiffre réel à me donner** |
| 4 | Pages légales absentes ou non vérifiées (mentions légales obligatoires dès qu'on vend). | Gabarits mentions légales, CGV, confidentialité, cookies, **à faire valider** (je ne les présenterai pas comme validées). | ⏳ suite de l'étape 1 |
| 5 | Pas de mention « ce contenu ne remplace pas un avis médical » visible. | Mention dans le footer, le PDF, l'espace membre, l'assistante. | ⏳ étape 3 |

### P1 — qualité et conversion

| # | Problème | Correction | État |
|---|---|---|---|
| 6 | Vidéo hero `videos/ocean.mp4` : existence, poids et licence inconnus ; pas de poster ni de fallback connus. | Récupérer l'original, compresser (H.264 + WebM, ≤ 2–3 Mo, 720p, sans son), image poster, fallback image, pas de lecture auto si `prefers-reduced-motion` ou économie de données. | ⏳ en attente du fichier |
| 7 | Palette fuchsia de `sections_en.html` hors charte. | Non reprise. Anglais : structure i18n prête, aucune traduction tant que tu ne la demandes pas. | ✅ i18n configuré (`astro.config.mjs`) |
| 8 | Balises Open Graph, favicon, image de partage : absents ou non vérifiés. | Balises OG/Twitter dans le gabarit, favicon SVG + ICO + Apple, image 1200×630. | ✅ fait (marque provisoire en attendant le logo) |
| 9 | Pas de liens trackés par réseau. | Liens UTM par réseau + liens courts `/ig`, `/tt`, `/pin`, `/in`. | ✅ fait ([`LIENS-UTM.md`](LIENS-UTM.md)) |
| 10 | Pas de page `/merci` ni de 404. | À créer. | ⏳ suite de l'étape 1 |
| 11 | Newsletter : branchement inconnu (formulaire probablement inactif). | Brevo ou Kit, double opt-in, tags. | ⏳ étape 3 |

### P2 — fondations techniques

| # | Problème | Correction | État |
|---|---|---|---|
| 12 | Pas de dépôt Git, pas de build reproductible. | Projet Astro statique, déployable sur Cloudflare Pages depuis GitHub. | ✅ fait |
| 13 | Pas de design system. | Tokens en source unique, contrastes AA vérifiés automatiquement à chaque build. | ✅ fait |
| 14 | Polices chargées depuis Google Fonts (probable). | Polices auto-hébergées (pas d'appel à Google, meilleur pour le RGPD et la performance), préchargées. | ✅ fait |
| 15 | Accessibilité : focus, lien d'évitement, mouvement réduit. | Intégrés au socle CSS. | ✅ fait |

## 4. Ce qui manque pour reconstruire le site

| Élément | Où le trouver | Statut |
|---|---|---|
| Texte intégral des sections de la home | Site en ligne ou ancien propriétaire | ❌ manquant |
| Vidéo hero `videos/ocean.mp4` (original non compressé si possible) | Ancien propriétaire | ❌ manquant |
| Toutes les images (hero, histoire, aperçu du livre, avatars à supprimer) | Ancien propriétaire | ❌ manquant |
| Pages blog : liste des URLs, textes, images, dates | Ancien propriétaire | ❌ manquant |
| Page recommandations : liste des produits, liens, identifiants d'affiliation | Ancien propriétaire | ❌ manquant |
| `sections_en.html` | Ancien propriétaire | ❌ manquant (non prioritaire) |
| Logo | Toi | ❌ manquant (favicon provisoire en place) |

## 5. Ce que tu dois demander à l'ancien propriétaire

Message prêt à envoyer (à adapter) :

> Bonjour,
> Je reprends Cycle Awakening sur mon propre compte et mon propre domaine. Pour la transition, pourrais-tu m'envoyer :
>
> 1. **L'export complet des fichiers du site** tel que déployé sur Cloudflare Pages (le dossier envoyé par glisser-déposer, ou un zip) : tous les `.html`, `.css`, `.js`, `sections_en.html`, le dossier `videos/` et toutes les images.
> 2. **La vidéo `ocean.mp4` en qualité d'origine**, et sa **source / licence** (banque d'images ? laquelle ? tournée par qui ?). Même chose pour chaque photo : provenance et droit d'utilisation.
> 3. **Les articles du blog** : liste des URLs et textes (si tu les as dans un autre format, Notion/Google Docs, c'est encore mieux).
> 4. **La page recommandations** : la liste des produits et, pour chaque lien affilié, le programme concerné et **à quel compte appartient l'identifiant d'affiliation**.
> 5. **Les données collectées** par le site s'il y en a (inscriptions newsletter, formulaires, statistiques) : quel outil, qui y a accès, et un export ou une confirmation de suppression.
> 6. **Les comptes ou services reliés** au site (outil d'emailing, analytics, Stripe, formulaire) pour que je sache quoi recréer de mon côté.
> 7. En attendant la suppression : ajouter si possible un `noindex` (ou une protection par mot de passe *Cloudflare Access*) sur `cycleawakening.pages.dev`.
> 8. **Une date de suppression** du projet Pages, à fixer une fois que je t'aurai confirmé que mon site est en ligne (voir checklist dans `docs/MIGRATION.md`), puis une confirmation écrite quand c'est fait.
>
> Merci !

## 6. Divergences relevées dans les documents sources

| Sujet | Documents | Décision appliquée |
|---|---|---|
| Palette | Doc « Identité visuelle » (validée) = ta palette. `DA_Cycle_Awakening.docx` a une autre palette (ivoire chaud `#F2EDE4`, lin doré `#E8DCC8`…). `DA_V2` est fuchsia. | Palette de ton brief (= doc « Identité visuelle »). DA v1 .docx et v2 ignorées. **À confirmer.** |
| Prix Premium | Brief Drive : Essential 15 €/mois, Premium 29 €/mois ou 249 €/an. Ton brief actuel : Premium 19 €/mois ou 149 €/an, pas d'offre Essential. | Ton brief actuel (`src/config/offers.ts`). |
| Outils | Brief Drive : Framer/Webflow, Memberstack, Voiceflow. Ton brief actuel : Cloudflare Pages + Supabase. | Ton brief actuel. |
| Posts Instagram | Annoncent « 75 pages », « 27 € », fond fuchsia, « Stop au HIIT en phase lutéale ». | 75 pages non repris (à confirmer). Visuels fuchsia à refaire. La formulation « stop au HIIT » est trop absolue pour le ton « pas de promesse, pas de règle rigide » : à revoir. |
