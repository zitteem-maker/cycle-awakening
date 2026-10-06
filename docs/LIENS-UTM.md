# Liens UTM par réseau

> Fichier généré par `npm run utm` — ne pas modifier à la main.
> Domaine : `https://cycleawakening.com` · Campagne : `lancement-guide`

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
| instagram | bio | `https://cycleawakening.com/?utm_source=instagram&utm_medium=social&utm_campaign=lancement-guide&utm_content=bio` |
| instagram | story | `https://cycleawakening.com/?utm_source=instagram&utm_medium=social&utm_campaign=lancement-guide&utm_content=story` |
| instagram | post | `https://cycleawakening.com/?utm_source=instagram&utm_medium=social&utm_campaign=lancement-guide&utm_content=post` |
| instagram | reel | `https://cycleawakening.com/?utm_source=instagram&utm_medium=social&utm_campaign=lancement-guide&utm_content=reel` |
| tiktok | bio | `https://cycleawakening.com/?utm_source=tiktok&utm_medium=social&utm_campaign=lancement-guide&utm_content=bio` |
| tiktok | video | `https://cycleawakening.com/?utm_source=tiktok&utm_medium=social&utm_campaign=lancement-guide&utm_content=video` |
| pinterest | epingle | `https://cycleawakening.com/?utm_source=pinterest&utm_medium=social&utm_campaign=lancement-guide&utm_content=epingle` |
| facebook | post | `https://cycleawakening.com/?utm_source=facebook&utm_medium=social&utm_campaign=lancement-guide&utm_content=post` |
| facebook | groupe | `https://cycleawakening.com/?utm_source=facebook&utm_medium=social&utm_campaign=lancement-guide&utm_content=groupe` |
| linkedin | post | `https://cycleawakening.com/?utm_source=linkedin&utm_medium=social&utm_campaign=lancement-guide&utm_content=post` |
| linkedin | profil | `https://cycleawakening.com/?utm_source=linkedin&utm_medium=social&utm_campaign=lancement-guide&utm_content=profil` |
| youtube | description | `https://cycleawakening.com/?utm_source=youtube&utm_medium=social&utm_campaign=lancement-guide&utm_content=description` |
| whatsapp | partage | `https://cycleawakening.com/?utm_source=whatsapp&utm_medium=messaging&utm_campaign=lancement-guide&utm_content=partage` |
| newsletter | bouton | `https://cycleawakening.com/?utm_source=newsletter&utm_medium=email&utm_campaign=lancement-guide&utm_content=bouton` |
| newsletter | signature | `https://cycleawakening.com/?utm_source=newsletter&utm_medium=email&utm_campaign=lancement-guide&utm_content=signature` |

## Liens courts pour les bios

Les liens UTM sont longs. Des redirections courtes, indépendantes du domaine, sont déclarées dans `public/_redirects` :

| Lien court | Redirige vers |
|---|---|
| `https://cycleawakening.com/ig` | `https://cycleawakening.com/?utm_source=instagram&utm_medium=social&utm_campaign=lancement-guide&utm_content=bio` |
| `https://cycleawakening.com/tt` | `https://cycleawakening.com/?utm_source=tiktok&utm_medium=social&utm_campaign=lancement-guide&utm_content=bio` |
| `https://cycleawakening.com/pin` | `https://cycleawakening.com/?utm_source=pinterest&utm_medium=social&utm_campaign=lancement-guide&utm_content=epingle` |
| `https://cycleawakening.com/in` | `https://cycleawakening.com/?utm_source=linkedin&utm_medium=social&utm_campaign=lancement-guide&utm_content=profil` |
