# Backlog — décisions à ne pas oublier

Décisions validées en cours de route, à implémenter à l'étape indiquée.

## Compteur de membres (étape 6, affiché dès l'étape 3 si données réelles)

Validé le 6 octobre 2026.

- **Texte** : « Vous êtes déjà {X} femmes à m'avoir fait confiance. » (même texte partout : home, page offre, emails).
- **Qui compte** : toute personne inscrite à Premium, **y compris pendant une période d'essai** (abonnements Stripe en statut `trialing` ou `active`), plus les acheteuses du guide. Une personne = un email, comptée une seule fois.
- **Source** : calcul côté serveur depuis la base (Supabase) ou Stripe, jamais un chiffre saisi à la main. Mis en cache (rafraîchi une fois par jour) pour ne pas interroger Stripe à chaque visite.
- **Arrondi** : à la dizaine inférieure au-delà de 100 (« plus de 120 »), jamais arrondi au-dessus.
- **Seuil d'affichage** : le compteur reste masqué tant que le total est sous un seuil (variable `MEMBER_COUNTER_MIN`, proposition : 30). En dessous, l'emplacement `TODO_PREUVE` reste vide.
- **Interdit** : pas d'avatars inventés, pas de « ce mois-ci » si ce n'est pas le chiffre du mois, pas de chiffre de départ fictif.

## Nombre de pages du livre (étape 2)

- `src/config/book-meta.json` est **écrit par `npm run build:book`**, qui compte les pages du PDF généré. Le site, la FAQ et les emails lisent `guide.pages` : le chiffre se met à jour seul à chaque fabrication du livre.
- Tant que le livre n'est pas généré (`pages: null`), aucun nombre de pages n'est affiché.
- À vérifier à chaque nouvelle version du PDF : les visuels Instagram et les emails déjà envoyés qui mentionnent un nombre de pages.

## Lecture du site actuel

- Bloquée par le réseau de l'environnement. Débloquer via les réglages réseau (domaine `cycleawakening.pages.dev`) ou le connecteur « Parallel Search » (lecture web, sans compte). Ensuite : comparer palette, textes et structure, et compléter `docs/AUDIT.md`.

## Pages légales

- Gabarits en ligne, **non validés juridiquement**. Bandeau « document en cours de validation » visible tant que `legal.validated` est `false` dans `src/config/legal.ts`.
- Informations à fournir : voir les `TODO_LEGAL` de `src/config/legal.ts`.

## Assistante IA : écarts entre le prompt système du brief et `regles-assistante-ia.md` (étape 7)

Les règles font foi. Le prompt devra intégrer ce qui lui manque :

1. **Signaux grossesse manquants** : gonflement brutal du visage ou des mains, contractions régulières avant terme, vomissements incoercibles (§5).
2. **Signaux post-partum manquants** : difficulté à respirer, plaie qui s'aggrave, saignements qui augmentent (§6).
3. **Autres signaux manquants** : saignements inhabituels après la ménopause, règles qui disparaissent chez une sportive (§3).
4. **Règles par profil absentes du prompt** : SOPK (suivi médical, pas de compléments à dose thérapeutique), endométriose (jamais « passer au travers »), sportive (sécurité énergétique d'abord, pas de plan de performance), périménopause (aucun conseil sur les traitements hormonaux) (§4).
5. **Périmètre** : pas d'interprétation d'analyses ou d'imagerie ni de pronostic en dehors de la grossesse aussi (§1).
6. **Grossesse** : pas de liste de sécurité alimentaire « de mémoire », renvoi aux recommandations officielles (§5).
7. **Médecine chinoise, acupuncture, phytothérapie** : explication générale possible, sans preuve affirmée ni remplacement d'un suivi (§7).
8. **Détresse psychique** : numéro de la ligne d'écoute correspondant au pays de la personne, vérifié régulièrement ; ne pas rester seule (§3).
9. **Spécialistes** : aucune transmission d'un échange sans consentement explicite au cas par cas (§8.5).

## Décisions du 6 octobre 2026 (à ne pas oublier)

- **Newsletter** : le formulaire du nouveau site envoie réellement l'inscription à l'outil d'emailing (double opt-in, tags). Étape 3.
- **Recommandations** (étape 3) :
  - les liens sont créés par la fondatrice ; tous ne sont pas affiliés ;
  - chaque produit porte un champ `relation` : `aucune` (simple recommandation), `affilié`, `partenariat`, `produit offert` ;
  - badge visible « lien affilié » / « partenariat » / « produit offert » sur la carte concernée, et `rel="sponsored"` sur ces liens (exigence Google) ; liens sans relation commerciale : lien normal, sans badge ;
  - **toutes les allégations santé retirées**, réécriture en ressenti personnel (« ce que j'aime, quand je l'utilise ») ;
  - HE et plantes retirées des kits ; éléments « À confirmer » masqués ; partenariat Aurélie publié seulement une fois signé.
- **Reformulations de la home** (étape 3) : « Disparaître 10 jours par mois. Plus jamais. » → sans promesse de résultat ; « protocole exact » ; « Accès à vie » → « à télécharger et garder » ; « envoyé immédiatement » seulement une fois l'automatisation testée.
- **Email de contact** : `hello@cycleawakening.com`.
- **Blog** : réécrit à partir des 50 recherches ; 4 articles au lancement puis 2 par semaine ; email « Quoi de neuf » hebdomadaire depuis le flux RSS. Voir `docs/PLAN-EDITORIAL.md` et skill `seo-blog`. Infrastructure (collection, RSS, sitemap, schema.org) à l'étape 3.
- **Favicon** : monogramme « A » Art déco + filet fuchsia (piste A), à valider.

## Rappels à faire à la fondatrice (Claude doit les signaler au bon moment)

- **Avant d'activer les recommandations (étape 3)** : rappeler la règle d'affiliation — badge « lien affilié / partenariat / produit offert » + `rel="sponsored"` ; aucun badge pour une simple recommandation ; tout produit reçu gratuitement compte comme relation commerciale.
- **Avant la première vente et avant tout lien affilié rémunéré** : immatriculation (micro-entreprise ou autre), puis renseigner `src/config/legal.ts` (statut, SIREN, adresse ou domiciliation, TVA, téléphone, médiateur). Le build refuse un lien de paiement réel tant qu'il manque une information (`missingForSales()`).
- **Dès l'ouverture de la newsletter** : `controllerName` (prénom et nom) renseigné dans `src/config/legal.ts`, obligatoire au titre du RGPD.

## Mode pré-lancement (en place depuis le 6 octobre 2026)

Tant que `missingForSales()` n'est pas vide : mentions légales de site non professionnel, CGV retirées du pied de page (page conservée avec un avertissement), paiement réel impossible (liens Stripe de test autorisés).

## Livre (étape 2) — points ouverts

- **Prana Chai** est cité dans la recette du chai latte : préciser la relation (aucune / affiliée / partenariat / produit offert). S'il y a une relation commerciale, la mentionner dans le livre.
- **Infusion** : la demande « infusion pour soutenir la phase lutéale » est devenue « Infusion du soir » sans effet santé annoncé (règle : pas d'allégation santé pour les plantes).
- **Purée de haricots / tofu** : végane seulement avec le sirop d'érable (le miel n'est pas végan) ; le texte le précise.
- **Cookies** : l'« option courageuse » utilise des pois chiches secs **trempés puis cuits** (jamais crus).
- **Photos** : 10 photos de recettes à fournir (voir `docs/PHOTOS-UNSPLASH.md`) ; la version finale du livre refuse de se fabriquer tant qu'une photo manque.
- **Chapitre 5** : l'encart « Et si tu ne veux pas le faire seule » dit « je prépare l'accompagnement ». À passer au présent (avec le lien d'inscription) quand l'offre Premium sera ouverte.
- **Notice pour lui** (bonus) : une page façon notice de montage, dans les outils, la version téléphone et en PDF séparé. À valider.
- **Numéros d'écoute retirés du livre** (décision du 7 octobre) : la fondatrice ne souhaite pas de message de prévention du suicide dans les guides. Le livre et la notice renvoient vers sage-femme, gynécologue, médecin, psychologue ; seul le **15** reste mentionné pour l'urgence. (L'assistante IA garde ses propres règles de détresse, voir `regles-assistante-ia.md`.)
- **« Prochainement sur Cycle Awakening : mise en relation avec une spécialiste et suivi personnalisé »** (chapitre 5 et notice) : à remplacer par le vrai lien quand l'offre existera, ou à retirer si elle est abandonnée.
- **Édito « Un dernier mot, entre nous »** (`book/src/edito.md`, validé le 7 octobre, version classique, signé Emeline) : toute dernière page du guide (après les recettes, les outils et le rappel médical), sans surtitre. Photo d'ambiance en attendant le portrait de la fondatrice : déposer `book/src/images/edito/edito.jpg`, il remplace automatiquement la photo d'ambiance.
- **Photos** (7 octobre) : ch1–ch6, banana bread, cookies, poisson (fichier « breakfast table linen »), infusion du soir, lait d’or, thème végétal et thème boissons en place. Thèmes petit-déjeuner et plats ajoutés. Manquent : bol orange, dattes, poulet soja, purée haricots-tofu, dal. Crédits Unsplash à fournir.
- **Photos des pages d'ouverture de thème** : `theme-petit-dejeuner.jpg`, `theme-plats.jpg`, `theme-vegetal.jpg`, `theme-boissons.jpg` (format paysage, haut de page).

## À faire juste avant la mise en ligne (validé le 3 novembre 2026)

Livre :
- [ ] Photos des 5 recettes manquantes : bol orange-fromage blanc, dattes au beurre de noisette, poulet soja-avocat, purée haricots-carottes-tofu, dal coco.
- [ ] Portrait de la fondatrice pour l'édito (`edito.jpg`, dossier Drive « photos unsplash »).
- [ ] Liens Unsplash de toutes les photos (crédits en fin de livre).
- [ ] Prana Chai : relation avec la marque (aucune / affilié / partenariat / produit offert), mentionnée dans le livre s'il y en a une.
- [ ] Validation écrite des textes (chapitres 1 à 6, recettes, outils, notice) : statuts `valide`.
- [ ] Sources `TODO_SOURCE` vérifiées (liste à préparer, relecture professionnelle).
- [ ] Version finale `npm run build:book` (écrit le nombre de pages pour le site).

Site :
- [ ] Activer Analytics Engine dans Cloudflare (mesure d'audience), avant la première fusion vers `main`.
- [ ] Recommandations : renseigner `lien` et `relation` de chaque fiche (`src/data/recommandations.ts`) ; trancher les fiches mises de côté (compléments, plantes, références à retrouver, partenariat Aurélie).
- [ ] Blog : relire les 4 articles, vérifier les sources, passer en `publie`.

Légal et offres :
- [ ] Avant la page Recommandations publique : règle d'affiliation (badge + `rel="sponsored"`).
- [ ] Ouverture de la newsletter : `controllerName` dans `src/config/legal.ts`.
- [ ] Avant la première vente : immatriculation et informations légales complètes (`missingForSales()` vide).
- [ ] Ouverture de l'abonnement : remplacer « je prépare l'accompagnement » / « Prochainement » (chapitre 5, notice, édito) par le vrai lien.

## Affiliation : pistes à reprendre plus tard (4 novembre 2026)

Mises de côté à la demande de la fondatrice. Chaque lien obtenu → fiche avec badge « Lien affilié » + `rel="sponsored nofollow"`. Immatriculation obligatoire avant toute commission.

- **Cosmic Dealer** : candidature affiliée envoyée (réponses rédigées le 4 nov.). Si acceptée, remplacer le lien de la fiche.
- **Typology** : Awin, en France Instagram ou YouTube exigé. Texte de motivation rédigé le 4 nov. Postuler une fois le compte Instagram actif.
- **Wildling Shoes** (déjà recommandée) : Tapfiliate, https://wildling.tapfiliate.com/
- **Circle Sportswear** (déjà recommandée) : programme ambassadeurs, https://circlesportswear.com/en/pages/ambassadeurs-program
- **Oh My Cream** : Affilae, https://ohmycream.co.uk/pages/affiliation. Ne lier que des produits neutres (pas de compléments ni d'allégation hormonale). Vend aussi Sentara : garder le lien partenaire direct pour Sentara.
- **Respire** : Affilae, https://affi.io/m/respire
- **Vivobarefoot** : impact.com / Awin, pas de programme France trouvé à ce jour.
- **Smoon** (lingerie menstruelle) : pas de programme trouvé, contact direct avec le modèle de premier message.
- Sans programme trouvé : Kazidomi, Holidermie. Palais des Thés : États-Unis seulement.
- **Shopify Collabs** : profil créé par la fondatrice (bio de 270 caractères rédigée le 4 nov.). Chercher d'autres marques via l'onglet Discover.
