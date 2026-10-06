# Migration vers ton compte Cloudflare et ton domaine

Le site actuel (`cycleawakening.pages.dev`) est sur un compte Cloudflare **qui n'est pas le tien**. Le nouveau site sera servi sur **`cycleawakening.com`**, ton domaine. On ne le migre pas : on **reconstruit** dans ce dépôt, tu déploies sur **ton** compte, puis l'ancien propriétaire supprime l'ancien projet. Aucune redirection depuis l'ancien site n'est prévue (il n'a pas de trafic).

Ordre conseillé : **1. GitHub → 2. Cloudflare Pages → 3. Domaine → 4. DNS du site → 5. Email → 6. Vérifications → 7. Suppression de l'ancien site.**

> Légende : ☐ = à faire par toi · ✅ = déjà fait dans le dépôt.

---

## 1. GitHub

Le dépôt `zitteem-maker/cycle-awakening` existe et contient le code.

- ☐ Vérifier qu'il est **privé** (*Settings → General → Danger Zone → Change visibility*) : il contiendra le livre et la logique du produit.
- ☐ Activer la **double authentification** sur ton compte GitHub.
- ☐ Protéger la branche `main` (*Settings → Branches → Add rule*) : pull request obligatoire avant fusion. La branche `main` = production.
- ☐ Activer *Settings → Code security* : **Secret scanning** et **Push protection** (bloque un push qui contiendrait une clé Stripe ou API par erreur), **Dependabot alerts**.
- ✅ `.env` et `.dev.vars` sont ignorés par Git ; seul `.env.example` (sans valeur secrète) est commité.

## 2. Cloudflare Pages (ton compte)

1. ☐ Créer un compte sur https://dash.cloudflare.com avec **ton** email, activer la double authentification.
2. ☐ *Workers & Pages → Create → Pages → Connect to Git* → autoriser l'application GitHub Cloudflare **uniquement sur le dépôt `cycle-awakening`** (pas « All repositories »).
3. ☐ Réglages de build :

   | Champ | Valeur |
   |---|---|
   | Project name | `cycle-awakening` (devient `cycle-awakening.pages.dev`) |
   | Production branch | `main` |
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Variable `NODE_VERSION` | `22` |

4. ☐ *Settings → Variables and Secrets* : ajouter les variables de `.env.example`, **séparément** pour *Production* et *Preview* :

   | Variable | Production | Preview |
   |---|---|---|
   | `PUBLIC_SITE_URL` | `https://cycleawakening.com` | `https://cycle-awakening.pages.dev` |
   | `PUBLIC_CHECKOUT_URL` | lien Stripe **live** | lien Stripe **test** |
   | `FEATURE_PREGNANCY_MODULES` | `false` | `false` (ou `true` pour relecture) |

   Plus tard, les clés secrètes (Stripe, Anthropic, Supabase service role, Brevo) en type **Secret** (chiffré), jamais avec le préfixe `PUBLIC_`.
5. ☐ Lancer le premier déploiement, vérifier `https://cycle-awakening.pages.dev`.
6. ☐ Les *preview deployments* (une URL par branche) sont publics par défaut : *Settings → General → Access policy* pour les protéger par **Cloudflare Access** (gratuit jusqu'à 50 utilisateurs).

> Option : en connectant le connecteur **Cloudflare Developer Platform** à Claude (claude.ai → Paramètres → Connecteurs), je peux vérifier la configuration de ton compte avec toi. Tu restes seule à valider les actions.

> Note : Cloudflare propose aussi « Workers avec assets statiques ». Pages reste supporté et suffit ici ; le projet peut basculer plus tard sans changer le code du site.

## 3. Domaine `cycleawakening.com` (déjà acheté)

Tu as déjà le domaine et un compte Cloudflare. Il faut vérifier que le domaine est **actif sur ton compte Cloudflare** :

- ☐ *Dashboard Cloudflare → Websites* : `cycleawakening.com` apparaît-il avec le statut **Active** ?
  - **Oui** → passer à l'étape 4.
  - **Non, il est chez un autre registrar** (OVH, Gandi, GoDaddy…) → *Add a domain* → `cycleawakening.com` → plan Free → Cloudflare importe les DNS existants (les vérifier) → remplacer chez le registrar les **serveurs de noms** par les deux fournis par Cloudflare. Propagation : de quelques minutes à 24 h ; Cloudflare envoie un email quand c'est actif.
  - **Il est sur le compte Cloudflare de quelqu'un d'autre** → le faire transférer vers ton compte avant toute chose.
- ☐ Le titulaire du domaine est **toi** (ou ta société), avec ton email : vérifier la fiche titulaire chez le registrar.
- ☐ **Renouvellement automatique** et **verrouillage de transfert** activés.
- ☐ **DNSSEC** activé (*DNS → Settings → DNSSEC*) ; si registrar externe, copier l'enregistrement DS chez lui.
- ☐ Si des enregistrements existent déjà (ancien site, ancienne boîte mail), me les lister avant de les supprimer.

## 4. DNS du site

1. ☐ *Workers & Pages → cycle-awakening → Custom domains → Set up a custom domain* → `cycleawakening.com`. Cloudflare crée l'enregistrement et le certificat HTTPS automatiquement.
2. ☐ Ajouter aussi `www.cycleawakening.com` en domaine personnalisé.
3. ☐ Choisir une seule version (recommandé : **sans www**) et rediriger l'autre : *Rules → Redirect Rules → Create rule → modèle « Redirect from WWW to root »* (301, conserver le chemin et la query string, donc les UTM).
4. ☐ *SSL/TLS* : mode **Full (strict)**, *Edge Certificates* → **Always Use HTTPS** activé, **HSTS** activé une fois que tout fonctionne en HTTPS (commencer avec `max-age` court).
5. ✅ Le domaine `https://cycleawakening.com` est déjà la valeur par défaut du code et des liens UTM (`docs/LIENS-UTM.md`). En Preview, mettre `PUBLIC_SITE_URL` sur l'URL `pages.dev` pour que les aperçus ne se déclarent pas comme le site officiel.
6. ☐ Optionnel : rediriger `cycle-awakening.pages.dev` vers le domaine (*Bulk Redirects*), sinon la balise `canonical` suffit à éviter le contenu dupliqué.

## 5. Email : réception, envoi et authentification (SPF, DKIM, DMARC)

Adresses à créer : `hello@cycleawakening.com` (affichée sur le site et dans les pages légales) et `dmarc@cycleawakening.com` (rapports DMARC). Le plus simple au départ : **Cloudflare Email Routing** (gratuit) qui les transfère vers ta boîte actuelle.

Le domaine servira à **trois** usages, chacun avec ses enregistrements :

| Usage | Exemple | Outil possible |
|---|---|---|
| Recevoir (`hello@`) | réponses clientes | **Cloudflare Email Routing** (gratuit, transfère vers ta boîte actuelle) ou une vraie boîte (Google Workspace, Zoho, OVH…) |
| Envoyer en marketing | newsletter, séquences | Brevo ou Kit |
| Envoyer en transactionnel | lien de téléchargement, lien magique | Brevo, Resend ou Postmark |

> Les valeurs ci-dessous sont des **modèles**. Les valeurs exactes sont affichées dans l'interface de chaque fournisseur : c'est elle qui fait foi.
> Dans Cloudflare, tous les enregistrements email (TXT, MX, et les CNAME DKIM) doivent être en **DNS only** (nuage gris).

### MX (réception)

- Avec Cloudflare Email Routing : *Email → Email Routing → Get started* ; Cloudflare ajoute les MX et le SPF tout seul. Créer l'adresse `hello@cycleawakening.com` → transfert vers ton email personnel.
- Avec une boîte hébergée : les MX donnés par le fournisseur.

### SPF — **un seul** enregistrement TXT à la racine

Un domaine ne peut avoir **qu'un seul** SPF : on regroupe tous les expéditeurs.

```
Type : TXT   Nom : @
v=spf1 include:<expéditeur 1> include:<expéditeur 2> ~all
```

Exemples d'`include` (à vérifier dans chaque interface) : Cloudflare Email Routing `_spf.mx.cloudflare.net` · Google Workspace `_spf.google.com` · Brevo `spf.brevo.com`. Limite : 10 recherches DNS au total.

Resend et certains outils utilisent un **sous-domaine d'envoi** (ex. `send.cycleawakening.com`) avec leur propre MX et SPF : ne pas les fusionner dans le SPF racine.

### DKIM — un ou plusieurs enregistrements par outil d'envoi

Chaque outil donne ses enregistrements (TXT ou CNAME), par exemple :

```
Type : CNAME  Nom : brevo1._domainkey   Cible : (fournie par Brevo)
Type : CNAME  Nom : brevo2._domainkey   Cible : (fournie par Brevo)
Type : TXT    Nom : google._domainkey   Valeur : v=DKIM1; k=rsa; p=… (fournie par Google)
```

Puis cliquer sur « Vérifier / Authenticate » dans l'outil.

### DMARC — progressif

```
Type : TXT   Nom : _dmarc
v=DMARC1; p=none; rua=mailto:dmarc@cycleawakening.com; adkim=r; aspf=r; pct=100
```

1. ☐ Démarrer en `p=none` (observation). Créer l'adresse `dmarc@` (ou utiliser *Email → DMARC Management* de Cloudflare, gratuit, qui lit les rapports pour toi).
2. ☐ Après 2 à 4 semaines sans échec légitime dans les rapports : `p=quarantine`.
3. ☐ Puis `p=reject`.

Gmail et Yahoo exigent SPF + DKIM + DMARC alignés et un **désabonnement en un clic** pour les envois en volume : Brevo/Kit le gèrent si le domaine est authentifié.

### Si le domaine n'envoie aucun email (temporairement)

Protéger contre l'usurpation :

```
TXT  @       v=spf1 -all
TXT  _dmarc  v=DMARC1; p=reject;
```

### Test

☐ Envoyer un email de test de chaque outil vers https://www.mail-tester.com (objectif ≥ 9/10) et vers une adresse Gmail : *Afficher l'original* → `SPF: PASS`, `DKIM: PASS`, `DMARC: PASS`.

## 6. Vérifications avant de demander la suppression de l'ancien site

Ne demande la suppression que lorsque **toutes** les cases sont cochées.

**Récupération**
- ☐ Fichiers source, vidéo, images, articles de blog et page recommandations reçus de l'ancien propriétaire (voir `docs/AUDIT.md` §5).
- ☐ Provenance et licence de chaque visuel connues ; visuels sans licence claire **remplacés**.
- ☐ Identifiants d'affiliation de la page recommandations : comptes à ton nom (sinon recréés).
- ☐ Données collectées par l'ancien site (emails, formulaires, statistiques) : exportées vers ton outil **avec preuve de consentement**, ou supprimées. Tu ne réimportes pas d'emails sans consentement documenté.

**Nouveau site**
- ☐ Nouveau site en production sur ton domaine, HTTPS valide, `www` redirigé.
- ☐ Tous les contenus utiles reconstruits et relus.
- ☐ Paiement testé de bout en bout (étape 4), email de livraison reçu, pas en spam.
- ☐ SPF, DKIM, DMARC en `PASS`.
- ☐ Domaine ajouté à **Google Search Console** (vérification par enregistrement DNS TXT) et sitemap envoyé.

**Plus aucune référence à l'ancienne adresse**
- ☐ Dans le code : `grep -ri "cycleawakening.pages.dev" .` ne renvoie rien (hors ce document).
- ☐ Bios Instagram / TikTok / Pinterest / LinkedIn, Linktree éventuel, posts épinglés.
- ☐ Stripe : URL de succès, Payment Links, nom de domaine des reçus.
- ☐ Outil d'emailing : modèles, séquences automatiques, pied de page, double opt-in.
- ☐ Livre PDF, QR codes, signatures email, supports imprimés.

**Indexation**
- ☐ Rechercher `site:cycleawakening.pages.dev` sur Google. Si des pages sont indexées : demander à l'ancien propriétaire d'ajouter `noindex` avant suppression, ou simplement supprimer (les pages sortiront de l'index en quelques semaines).

**Suppression**
- ☐ Envoyer la demande de suppression avec une date.
- ☐ Obtenir une **confirmation écrite**.
- ☐ Vérifier que `https://cycleawakening.pages.dev` ne répond plus (erreur ou page Cloudflare).
- ☐ Revérifier `site:cycleawakening.pages.dev` deux semaines plus tard.
- ☐ Optionnel : une fois libéré, tenter de créer un projet Pages nommé `cycleawakening` sur ton compte pour récupérer ce sous-domaine (disponibilité non garantie) et le rediriger vers ton domaine.
