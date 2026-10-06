# Liens UTM par réseau

> Fichier généré par `npm run utm` — ne pas modifier à la main.
> Domaine : `https://todo-domaine.fr` · Campagne : `lancement-guide`

> ⚠️ Domaine non défini : renseigner `PUBLIC_SITE_URL` dans `.env` puis relancer `npm run utm`.

## Convention

| Paramètre | Valeur | Exemple |
|---|---|---|
| `utm_source` | le réseau | `instagram` |
| `utm_medium` | le type de canal : `social`, `email`, `messaging`, `paid-social` (pub payante) | `social` |
| `utm_campaign` | l'opération, stable pendant toute sa durée | `lancement-guide` |
| `utm_content` | l'emplacement précis | `bio`, `story`, `reel` |

Règles : minuscules, tirets, pas d'accents ni d'espaces. Une nouvelle opération = `npm run utm -- --campaign=nom`.
Les UTM ne contiennent jamais de donnée personnelle (pas d'email, pas de nom).

## Liens

| Réseau | Emplacement | Lien |
|---|---|---|
| instagram | bio | `https://todo-domaine.fr/?utm_source=instagram&utm_medium=social&utm_campaign=lancement-guide&utm_content=bio` |
| instagram | story | `https://todo-domaine.fr/?utm_source=instagram&utm_medium=social&utm_campaign=lancement-guide&utm_content=story` |
| instagram | post | `https://todo-domaine.fr/?utm_source=instagram&utm_medium=social&utm_campaign=lancement-guide&utm_content=post` |
| instagram | reel | `https://todo-domaine.fr/?utm_source=instagram&utm_medium=social&utm_campaign=lancement-guide&utm_content=reel` |
| tiktok | bio | `https://todo-domaine.fr/?utm_source=tiktok&utm_medium=social&utm_campaign=lancement-guide&utm_content=bio` |
| tiktok | video | `https://todo-domaine.fr/?utm_source=tiktok&utm_medium=social&utm_campaign=lancement-guide&utm_content=video` |
| pinterest | epingle | `https://todo-domaine.fr/?utm_source=pinterest&utm_medium=social&utm_campaign=lancement-guide&utm_content=epingle` |
| facebook | post | `https://todo-domaine.fr/?utm_source=facebook&utm_medium=social&utm_campaign=lancement-guide&utm_content=post` |
| facebook | groupe | `https://todo-domaine.fr/?utm_source=facebook&utm_medium=social&utm_campaign=lancement-guide&utm_content=groupe` |
| linkedin | post | `https://todo-domaine.fr/?utm_source=linkedin&utm_medium=social&utm_campaign=lancement-guide&utm_content=post` |
| linkedin | profil | `https://todo-domaine.fr/?utm_source=linkedin&utm_medium=social&utm_campaign=lancement-guide&utm_content=profil` |
| youtube | description | `https://todo-domaine.fr/?utm_source=youtube&utm_medium=social&utm_campaign=lancement-guide&utm_content=description` |
| whatsapp | partage | `https://todo-domaine.fr/?utm_source=whatsapp&utm_medium=messaging&utm_campaign=lancement-guide&utm_content=partage` |
| newsletter | bouton | `https://todo-domaine.fr/?utm_source=newsletter&utm_medium=email&utm_campaign=lancement-guide&utm_content=bouton` |
| newsletter | signature | `https://todo-domaine.fr/?utm_source=newsletter&utm_medium=email&utm_campaign=lancement-guide&utm_content=signature` |

## Liens courts pour les bios

Les liens UTM sont longs. Des redirections courtes, indépendantes du domaine, sont déclarées dans `public/_redirects` :

| Lien court | Redirige vers |
|---|---|
| `https://todo-domaine.fr/ig` | `https://todo-domaine.fr/?utm_source=instagram&utm_medium=social&utm_campaign=lancement-guide&utm_content=bio` |
| `https://todo-domaine.fr/tt` | `https://todo-domaine.fr/?utm_source=tiktok&utm_medium=social&utm_campaign=lancement-guide&utm_content=bio` |
| `https://todo-domaine.fr/pin` | `https://todo-domaine.fr/?utm_source=pinterest&utm_medium=social&utm_campaign=lancement-guide&utm_content=epingle` |
| `https://todo-domaine.fr/in` | `https://todo-domaine.fr/?utm_source=linkedin&utm_medium=social&utm_campaign=lancement-guide&utm_content=profil` |
