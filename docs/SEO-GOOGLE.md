# Google, Bing : faire apparaître Cycle Awakening dans les résultats de recherche

Ce guide se fait **une seule fois**, avec ton compte Google (celui qui a acheté le domaine ou ton compte principal). Je ne peux pas le faire à ta place : il faut te connecter à tes comptes.
Compte environ 25 minutes. Ensuite, Google trouve tout seul les nouveaux articles grâce au plan du site.

Adresse du plan du site : **https://cycleawakening.com/sitemap.xml**

## 1. Google Search Console (indispensable)

C'est l'outil gratuit de Google : il te dit quelles pages sont indexées, sur quelles recherches tu apparais, et signale les problèmes.

1. Va sur https://search.google.com/search-console et connecte-toi.
2. Clique sur **Ajouter une propriété**.
3. Choisis le type **Domaine** (colonne de gauche), tape `cycleawakening.com`, puis **Continuer**.
4. Google affiche une ligne **TXT** à ajouter au DNS : `google-site-verification=…`
   - **Cas le plus probable : la vérification est immédiate.** Ton domaine contient déjà une ligne de ce type (celle de Google Workspace, créée avec le même compte). Clique sur **Valider**.
   - Sinon : dans **Cloudflare → cycleawakening.com → DNS → Records → Add record**, crée `Type TXT`, `Name @`, `Content` = la ligne copiée depuis Google, puis **Save**. Reviens dans Search Console et clique sur **Valider** (compte jusqu'à quelques minutes).
5. Dans le menu de gauche, ouvre **Sitemaps**. Dans « Ajouter un sitemap », tape `sitemap.xml` et clique sur **Envoyer**. L'état doit passer à **Réussite** avec **20 pages détectées** (quand tous les articles publiés sont inclus).
6. Dans le menu de gauche, ouvre **Inspection de l'URL**. Colle l'adresse de chacune de ces pages, puis clique sur **Demander une indexation** :
   - `https://cycleawakening.com/`
   - `https://cycleawakening.com/en`
   - `https://cycleawakening.com/blog`
   - les 4 articles publiés (français) et leurs 4 versions anglaises.
   (Google limite le nombre de demandes par jour : si un message le dit, continue le lendemain.)
7. Ajoute ton adresse email aux notifications : **Paramètres → Utilisateurs et autorisations**.

**Ce que tu verras, et quand :** les premières pages apparaissent dans « Indexation des pages » sous quelques jours. Les premières requêtes et clics dans « Performances » arrivent en 1 à 3 semaines. Un site neuf met en général 2 à 4 mois à se classer sur des requêtes concurrentielles : c'est normal, la régularité des articles compte plus que tout.

## 2. Bing Webmaster Tools (10 minutes, bonus utile)

Bing alimente aussi DuckDuckGo, Ecosia, et certains assistants IA.
1. Va sur https://www.bing.com/webmasters et connecte-toi (compte Google possible).
2. Choisis **Importer depuis Google Search Console** : tout est repris (site et plan du site) sans rien retaper.

## 3. Cloudflare : prévenir les moteurs à chaque mise en ligne (2 minutes)

Dans **Cloudflare → cycleawakening.com → Caching → Configuration → Crawler Hints → Activer**. Cloudflare prévient alors Bing et Yandex (protocole IndexNow) quand le site change.

## 4. Les contrôles automatiques, de mon côté

Après chaque modification, je lance `npm run build` puis `npm run seo`. Ça vérifie sur toutes les pages : titres (≤ 60 caractères), descriptions, une seule balise H1, URL canonique, versions français/anglais reliées (hreflang), images de partage, données structurées, textes alternatifs, liens internes, plan du site et robots.txt.
Pour tester ce qui est réellement en ligne :
- **Rich Results Test** (Google) : https://search.google.com/test/rich-results — colle l'adresse d'un article, il doit détecter « Article » et « Fil d'Ariane ».
- **Schema Markup Validator** : https://validator.schema.org
- **PageSpeed Insights** : https://pagespeed.web.dev
- **Aperçu de partage** : colle un lien dans une conversation WhatsApp ou Instagram pour voir la carte (titre + photo).

## 5. Ce que tu fais ensuite, chaque mois (15 minutes)

1. Search Console → **Performances** : quelles recherches amènent des affichages sans clic ? (position entre 5 et 20 = l'article peut monter en l'enrichissant.)
2. Search Console → **Indexation des pages** : une page « Détectée, actuellement non indexée » demande plus de liens internes depuis d'autres articles.
3. Dis-moi les requêtes et les pages qui montent : j'écris les articles suivants autour d'elles, et je mets à jour les anciens (sans toucher à la date de mise à jour si rien de réel n'a changé).

## 6. À faire de ton côté pour aider le classement

- **Publier régulièrement** (2 articles par semaine, validés par toi) : c'est le premier critère.
- **Obtenir des liens depuis d'autres sites** : tes comptes Instagram et Pinterest (adresse du site dans la bio, via `/ig`, `/pin`), les marques partenaires qui te citent (Cosmic Dealer, Sentara, etc. : demande-leur un lien vers ton article sur le thème qui les concerne), des invitations sur des blogs ou des podcasts bien-être.
- **Une page « À propos »** dédiée (ton parcours, ce qui t'a menée à créer Cycle Awakening, tes formations ou expériences réelles) : c'est un signal fort de confiance pour un site santé. Envoie-moi tes éléments et je l'écris et la mets en ligne.
- **Faire relire** un article par une sage-femme ou un·e gynécologue : le champ « relu par » apparaît alors sur la page et dans les données structurées.
