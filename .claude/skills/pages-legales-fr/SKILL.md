---
name: pages-legales-fr
description: Rédiger ou mettre à jour les pages légales françaises de Cycle Awakening (mentions légales, CGV, politique de confidentialité, politique cookies) pour un site qui vend un contenu numérique, des abonnements, traite des données de santé et utilise une IA. À charger dès qu'on touche à une page légale, à un formulaire qui collecte des données, au tunnel de paiement, à la bannière cookies ou à un nouveau sous-traitant (Stripe, Brevo, Supabase, Anthropic…).
---

# Pages légales (droit français) — Cycle Awakening

> **Règle absolue** : ces pages sont des **gabarits**. Ne jamais écrire, dire ou laisser entendre qu'elles sont « conformes » ou « validées juridiquement ». Tant que `legal.validated` vaut `false` dans `src/config/legal.ts`, le bandeau « document en cours de validation » reste affiché. Seule l'éditrice passe ce drapeau à `true`, après relecture par un·e juriste.

## Mode pré-lancement

Tant que `missingForSales()` (`src/config/legal.ts`) renvoie des champs manquants :
- mentions légales en version « site édité à titre non professionnel » (identité communiquée à l'hébergeur, LCEN) ;
- CGV absentes du pied de page, page affichée avec un avertissement « aucune vente ouverte » ;
- **le build échoue** si `PUBLIC_CHECKOUT_URL` contient un lien de paiement réel (les liens Stripe `test_` restent autorisés).
Dès que le site collecte des emails, `controllerName` (prénom et nom) doit être renseigné : le RGPD impose d'identifier le responsable du traitement.
Vendre ou toucher des commissions d'affiliation est une activité professionnelle : l'immatriculation doit précéder la première vente.

## Où sont les choses

- Données de l'éditrice : `src/config/legal.ts` (raison sociale, SIREN, adresse, contact, médiateur, sous-traitants). Toute info manquante = `TODO_LEGAL_…`, jamais inventée.
- Pages : `src/pages/mentions-legales.astro`, `cgv.astro`, `confidentialite.astro`, `cookies.astro`, gabarit `src/layouts/LegalLayout.astro`.
- Chaque page affiche sa date de dernière mise à jour (`legal.updatedAt`).

## Contenu attendu par page (repères, à faire vérifier)

### Mentions légales — LCEN (loi n° 2004-575 du 21 juin 2004)
- Éditrice : nom/prénom ou dénomination, forme juridique, adresse (ou domiciliation), n° SIREN / immatriculation, capital (société), n° TVA intracommunautaire si assujettie, email et téléphone de contact.
- Directeur·rice de la publication.
- Hébergeur : nom, adresse, téléphone (Cloudflare, Inc. pour Cloudflare Pages ; vérifier l'adresse en vigueur sur cloudflare.com).
- Propriété intellectuelle, crédits photos/vidéos (avec licence), mention « ne remplace pas un avis médical ».

### CGV — contenu numérique (le guide, « livre digital » : ne jamais écrire « PDF » dans les textes visibles) et abonnement (Premium)
- Identité du vendeur, caractéristiques essentielles, prix TTC en euros, modalités de paiement (Stripe), livraison (email + lien de téléchargement), durée de validité du lien.
- **Droit de rétractation** (C. consom. L221-18 : 14 jours) et son **exception pour le contenu numérique** fourni sans support matériel (L221-28, 13°) : seulement si la cliente a donné son **accord préalable exprès** à l'exécution immédiate **et** **renoncé expressément** à son droit, avec **confirmation sur support durable** (email de confirmation, L221-13). Sans ces trois éléments, la rétractation reste ouverte 14 jours.
- Abonnement : durée, reconduction, prix, période d'essai, résiliation **en ligne, simple et directe** (fonctionnalité de résiliation, L215-1-1), portail client Stripe, effet de la résiliation.
- Garantie légale de conformité des contenus et services numériques (L224-25-1 et suivants).
- Médiateur de la consommation (L612-1) : **obligatoire** en B2C, nom + site web. Ne plus renvoyer vers la plateforme européenne RLL/ODR (fermée en 2025).
- Responsabilité : contenu éducatif de mode de vie, pas un acte médical, pas de résultat garanti.
- Droit applicable, juridiction.
- TVA : si franchise en base, mention « TVA non applicable, art. 293 B du CGI » ; ventes B2C à d'autres pays de l'UE → règles OSS (Stripe Tax) à valider avec l'expert-comptable.

### Politique de confidentialité — RGPD
- Responsable de traitement, contact (et DPO s'il y en a un).
- Tableau par traitement : finalité, données, **base légale**, durée de conservation, destinataires.
- **Données de santé** (réponses au quiz, journal de cycle, échanges avec l'assistante) : catégorie particulière (RGPD art. 9) → **consentement explicite et séparé**, minimisation, aucune publicité ciblée, jamais revendues ni transmises à des marques ou spécialistes sans consentement.
- **IA** : l'assistante est une IA (transparence), fournisseur et pays, pas d'entraînement sur les conversations (à vérifier dans le contrat du fournisseur), rétention, suppression de l'historique.
- Sous-traitants (liste dans `legal.ts`) et **transferts hors UE** (garanties : Data Privacy Framework ou clauses contractuelles types).
- Droits (accès, rectification, effacement, opposition, limitation, portabilité, retrait du consentement), délai de réponse, réclamation CNIL.
- Sécurité, mineures (âge minimum).
- Points à faire trancher par le·la juriste : besoin d'une **AIPD** (analyse d'impact, probable avec des données de santé), applicabilité de la certification **HDS** (hébergement de données de santé, CSP L1111-8) à un service de bien-être, obligations de transparence du **règlement européen sur l'IA** pour un chatbot (vérifier le calendrier en vigueur).

### Politique cookies — CNIL
- Liste des traceurs : nom, finalité, émetteur, durée.
- Traceurs strictement nécessaires : sans consentement. Mesure d'audience : exemptée seulement si elle remplit les conditions CNIL (sinon consentement). Tout le reste : consentement préalable.
- Refuser doit être aussi simple qu'accepter (bouton « Tout refuser » au même niveau), consentement modifiable à tout moment (lien « Gérer mes cookies » dans le footer), durée de conservation du choix (6 mois recommandés).
- Par défaut, viser **zéro cookie non essentiel** (analytics sans cookie) : la bannière devient alors inutile ; la page cookies le dit.

## Contenus marketing (garde-fous liés)
- Pas de faux avis, faux compteur ni fausse urgence (pratiques commerciales trompeuses, L121-2 et suivants).
- Liens affiliés : mention claire « liens affiliés » à proximité des liens.
- Pas d'allégation thérapeutique ni de promesse de guérison ; prudence sur les allégations nutritionnelles et de santé (règlement (CE) n° 1924/2006).

## Procédure de mise à jour
1. Modifier `src/config/legal.ts` ou la page concernée.
2. Mettre à jour `legal.updatedAt`.
3. Ajouter tout nouveau sous-traitant à la liste **avant** sa mise en service.
4. Noter le changement dans le tableau « historique » en bas de la page.
5. Ne jamais passer `validated: true` soi-même.
