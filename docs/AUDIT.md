# Audit de l'existant — étape 1

*Date : 6 octobre 2026. Auteur : lead dev / design. Statut : home et recommandations auditées à partir du HTML fourni (`legacy/`) ; blog non fourni.*

## 1. Ce qui a pu être vérifié

| Source | État | Constat |
|---|---|---|
| Dépôt `zitteem-maker/cycle-awakening` | ✅ lu | **Vide** : aucun commit, aucun fichier, pas de dossier `/docs`. Le site en ligne a donc vraisemblablement été **déployé par glisser-déposer** (Cloudflare Pages « Direct Upload »), sans dépôt Git. |
| Site en ligne `https://cycleawakening.pages.dev/` | ❌ non lu | L'environnement de travail bloque ce domaine (politique réseau). La Wayback Machine (`web.archive.org`) est bloquée aussi. **Aucun contenu du site n'a été récupéré.** |
| Dossier Google Drive « 🌙 Cycle Awakening — Vision du projet » | ✅ lu | 7 documents : brief marketing/produit/IA, identité visuelle (palette validée), DA v1 (.docx), DA v2 fuchsia (.docx), 50 recherches, data marché, 5 posts Instagram de lancement. Voir [`SOURCES.md`](SOURCES.md). |
| `/docs/regles-assistante-ia.md` | ✅ reçu | Fourni le 6 octobre 2026 → [`regles-assistante-ia.md`](regles-assistante-ia.md). |
| `/docs/50-recherches.md` | ✅ importé | Copié depuis le Drive dans [`50-recherches.md`](50-recherches.md). |
| `sections_en.html` (ancienne version anglaise, fuchsia `#E0257A`) | ❌ non lu | Connu uniquement par ta description. |

### Pour débloquer la lecture du site en ligne (au choix)

0. **Connecteur MCP** (sur claude.ai → Paramètres → Connecteurs, puis activé dans la session) : **Parallel Search** (lecture web, gratuit, sans compte) ou **TinyFish** (navigateur cloud). Je ne peux pas les connecter moi-même.
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
| 2 | « +320 femmes ont rejoint ce mois-ci » et avatars à initiales : preuve sociale non réelle. Risque de pratique commerciale trompeuse et perte de confiance. | Supprimés. Remplacés plus tard par un compteur **réel** (membres y compris en essai, texte « Vous êtes déjà X femmes à m'avoir fait confiance »), voir `BACKLOG.md`. | ✅ retiré — compteur réel en backlog |
| 3 | Nombre de pages incohérent (75 sur le site et dans le post Instagram n°5, 25 dans une maquette). | Variable unique `guide.pages`, **alimentée automatiquement** par le build du livre (`src/config/book-meta.json`). | ✅ automatisé (étape 2) |
| 4 | Pages légales absentes ou non vérifiées (mentions légales obligatoires dès qu'on vend). | Gabarits mentions légales, CGV, confidentialité, cookies, avec bandeau « en cours de validation » et champs `TODO_LEGAL` surlignés. Skill `pages-legales-fr`. | ✅ gabarits en ligne — **informations éditrice + relecture juriste à faire** |
| 5 | Pas de mention « ce contenu ne remplace pas un avis médical » visible. | Mention dans le pied de page de toutes les pages ; PDF, espace membre, assistante ensuite. | ✅ site — ⏳ PDF / espace membre |

### P1 — qualité et conversion

| # | Problème | Correction | État |
|---|---|---|---|
| 6 | Vidéo hero `videos/ocean.mp4` : existence, poids et licence inconnus ; pas de poster ni de fallback connus. | Composant `HeroVideo` (poster, pause, mouvement réduit, économie de données), script `npm run hero-video`, skill `hero-video`, sites recommandés dans `ASSETS.md`. Illustration « horizon » en attendant. | ✅ prêt — **vidéo à choisir** |
| 7 | Palette fuchsia de `sections_en.html` hors charte. | Non reprise. Anglais : structure i18n prête, aucune traduction tant que tu ne la demandes pas. | ✅ i18n configuré (`astro.config.mjs`) |
| 8 | Balises Open Graph, favicon, image de partage : absents ou non vérifiés. | Balises OG/Twitter dans le gabarit, favicon SVG + ICO + Apple, image 1200×630. | ✅ fait (marque provisoire en attendant le logo) |
| 9 | Pas de liens trackés par réseau. | Liens UTM par réseau + liens courts `/ig`, `/tt`, `/pin`, `/in`. | ✅ fait ([`LIENS-UTM.md`](LIENS-UTM.md)) |
| 10 | Pas de page `/merci` ni de 404. | Créées. | ✅ fait |
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
| Logo | Créé (`public/brand/`) | ✅ à valider |

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
| Palette | Doc « Identité visuelle » (minéral doux), `DA_Cycle_Awakening.docx`, `DA_V2` (fuchsia), ancien site (vert bouteille + fuchsia). | **Tranché le 6 octobre 2026 : palette hybride de l'ancien site** (voir §7). |
| Prix Premium | Brief Drive : Essential 15 €/mois, Premium 29 €/mois ou 249 €/an. Ton brief actuel : Premium 19 €/mois ou 149 €/an, pas d'offre Essential. | Ton brief actuel (`src/config/offers.ts`). |
| Outils | Brief Drive : Framer/Webflow, Memberstack, Voiceflow. Ton brief actuel : Cloudflare Pages + Supabase. | Ton brief actuel. |
| Posts Instagram | Annoncent « 75 pages », « 27 € », fond fuchsia, « Stop au HIIT en phase lutéale ». | 75 pages non repris (à confirmer). Visuels fuchsia à refaire. La formulation « stop au HIIT » est trop absolue pour le ton « pas de promesse, pas de règle rigide » : à revoir. |

## 7. Constats sur le site réel (HTML fourni le 6 octobre 2026, copié dans `legacy/`)

### Page d'accueil (`legacy/index.html`)

| Priorité | Constat | Décision |
|---|---|---|
| P0 | Le lien d'achat final pointe vers `#` (commentaire « Remplacer le href par ton lien Stripe »). Les 8 autres boutons « Obtenir le livre digital — 27€ » ne font que défiler vers l'offre. | Corrigé par le CTA unique (`PUBLIC_CHECKOUT_URL`). |
| P0 | **Le formulaire newsletter n'envoie rien** : `cmSub()` affiche « Bienvenue dans la communauté » sans transmettre l'email. Les inscriptions éventuelles sont perdues. | Vrai formulaire Brevo/Kit à l'étape 3. Prévenir l'ancien propriétaire qu'aucune liste n'existe. |
| P0 | « +320 » apparaît deux fois (bandeau du hero et bloc communauté) avec 4 faux avatars (ML, SA, JB, CR). | Retiré ; compteur réel plus tard (`BACKLOG.md`). |
| P0 | Aucune page légale, aucune mention « ne remplace pas un avis médical ». | Corrigé. |
| P1 | Promesse de résultat : « Disparaître 10 jours par mois. **Plus jamais.** », « le protocole exact ». | À reformuler à l'étape 3 (pas de promesse, cf. ton de marque). |
| P1 | « 75 pages » ×3, « Accès à vie », « envoyé immédiatement ». | Pages : variable automatique. « Accès à vie » → « à télécharger et garder ». « Immédiatement » seulement une fois l'automatisation testée. |
| P1 | Animations sur chaque bloc (fondus, mots un par un, faisceau en boucle infinie), aucune prise en compte de `prefers-reduced-motion`. | Une seule animation marquante, mouvement réduit respecté. |
| P1 | Accessibilité : textes de 8 à 12 px, gris à 40 % d'opacité (contraste insuffisant), FAQ et menu non utilisables au clavier, vidéo sans poster ni pause. | Corrigé par le socle (tokens AA, composants accessibles). |
| P2 | Polices chargées depuis Google Fonts (transfert d'IP hors UE). | Polices auto-hébergées. |
| P2 | Menu : Accueil, **Blog** (`/blog/index.html`), Recommandations. | Blog non fourni : à demander à l'ancien propriétaire (ou à réécrire à partir des 50 recherches). |

Contenu réutilisable (à reprendre à l'étape 3, en réécrivant les promesses) : les 5 phrases « Tu te reconnais ? », le texte « Mon histoire », les 5 parties du guide, « pour qui / pas pour qui », les 4 bénéfices newsletter, les 4 questions de FAQ.

### Page recommandations (`legacy/recommandations.html`)

| Priorité | Constat | Décision |
|---|---|---|
| P0 | **Aucun lien produit actif** : les 36 boutons « Découvrir → » pointent vers `#`. Aucun identifiant d'affiliation n'est en place, donc rien à récupérer chez l'ancien propriétaire de ce côté. | Liens affiliés à créer sur tes propres comptes. |
| P0 | **Allégations santé** sur des compléments et des produits : « efficacité prouvée », « magnésium pour le cortisol », « tryptophane pour la sérotonine », « oméga-3 pour réduire l'inflammation », gua sha qui « réduit la rétention d'eau et active le système lymphatique », bouillotte qui « stimule le nerf vague », « impact hormonal mesurable ». Les allégations de santé sur les compléments alimentaires sont strictement encadrées (règlement (CE) n° 1924/2006). | Réécrire en ressenti personnel (« ce que j'utilise et pourquoi je l'aime »), sans effet sur la santé. À faire relire. |
| P0 | Huile essentielle de lavande et infusion de framboisier dans le « Kit phase lutéale », sans précaution (grossesse, allaitement, traitements). Contradiction avec les règles de l'assistante (§7). | Retirer les HE et plantes des kits, ou ajouter un encadré de précautions validé. |
| P1 | Badges « Le plus efficace » / « Le plus sérieux du marché » : comparatifs non démontrés. | Remplacer par « mon préféré », « pour débuter », « le plus naturel ». |
| P1 | Partenariat « Aurélie Pole » avec code -15 % « en cours de finalisation » publié. | Ne publier qu'une fois signé, avec la mention « partenariat commercial ». |
| P1 | Éléments « À confirmer » / « Référence en cours » visibles publiquement. | Masqués tant que la référence n'existe pas. |
| P1 | Aucune photo (emplacements « [ Photo … ] »). | Photos produits à obtenir auprès des marques (kits presse affiliés) ou à prendre toi-même. |
| ✅ | Mention d'affiliation claire, en haut et en bas de page. | À conserver. |

Contacts relevés : `hello@cycleawakening.com`, Instagram `@cycleawakening`. Le site utilisera `hello@` (au lieu de `bonjour@`).

### Design system de l'ancien site → décision « hybride » (6 octobre 2026)

Palette conservée : crème `#F7F4EF`, beiges `#EDE8E0` / `#E3DDD4`, vert bouteille `#1A3028` / `#2D4A3E`, sauge `#9FC0B0`, gris `#5C5C5C`. Le **fuchsia `#E0257A`** est réservé au logo et aux italiques des grands titres (≤ 10 %) ; les boutons passent en vert bouteille / crème. Le quasi-noir `#0A1510` et le mauve `#8B7BA8` ne sont pas repris. Cormorant Garamond + Inter conservées. Logo : « cycle » manuscrit (Sacramento) sur « AWAKENING » Art déco (Limelight), vectorisé.
