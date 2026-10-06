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
