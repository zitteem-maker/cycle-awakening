# Brevo : mise en route de la newsletter (double opt-in)

Le site envoie l'inscription à Brevo (`functions/api/newsletter.js`). Brevo envoie l'email de confirmation ; la personne n'est ajoutée à la liste qu'après son clic.

## 1. Dans Brevo
1. **Contacts > Listes** : créer la liste « Newsletter » → noter son numéro (ID).
2. **Contacts > Paramètres > Attributs** : créer (type Texte) `SOURCE`, `LANGUE`, `CONSENTEMENT`.
3. **Modèles d'emails** : créer deux modèles de type **double opt-in** (« Confirmation d'inscription »), l'un en français, l'autre en anglais :
   - coller le HTML de `docs/emails/confirmation-fr.html` (puis `-en.html`) ;
   - expéditeur : hello@cycleawakening.com, nom « Emeline — Cycle Awakening » ;
   - objet FR : « Un dernier clic pour rejoindre Cycle Awakening » / EN : « One last click to join Cycle Awakening » ;
   - le lien de confirmation du modèle est `{{ params.DOIurl }}` ; si l'éditeur de Brevo propose son propre bouton de confirmation, utilise-le à la place (c'est lui qui fait foi) ;
   - noter l'ID de chaque modèle.
4. **Expéditeurs et domaines** : authentifier `cycleawakening.com` (Brevo donne des enregistrements DKIM/DMARC à ajouter dans la zone DNS Cloudflare). Sans cela, les emails risquent le spam.
5. **Paramètres > SMTP & API > Clés API** : créer une clé.

## 2. Dans Cloudflare (Workers & Pages > cycle-awakening > Settings > Variables and secrets)
| Nom | Type | Valeur |
|---|---|---|
| `BREVO_API_KEY` | Secret | la clé API |
| `BREVO_LIST_ID` | Texte | ID de la liste |
| `BREVO_DOI_TEMPLATE_ID` | Texte | ID du modèle français |
| `BREVO_DOI_TEMPLATE_ID_EN` | Texte | ID du modèle anglais |
| `PUBLIC_SITE_URL` | Texte | https://cycleawakening.com |

## 3. Test
S'inscrire avec une adresse personnelle sur le site (FR puis `/en`), vérifier l'email, cliquer, et contrôler que le contact apparaît dans la liste avec `LANGUE` renseigné.
