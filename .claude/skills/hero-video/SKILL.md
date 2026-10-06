---
name: hero-video
description: Choisir, licencier, compresser et intégrer une vidéo d'ambiance (hero) pour Cycle Awakening — critères de sélection selon la DA, sites recommandés, contrôle de licence, pipeline ffmpeg (MP4 H.264 + WebM + poster), composant HeroVideo accessible. À charger dès qu'une vidéo ou une image hero est ajoutée, remplacée ou optimisée.
---

# Vidéo hero

## 1. Choisir le plan

Critères (DA) : plan **lent**, fixe ou travelling doux, 8 à 20 s, **bouclable** sans saut visible, lumière naturelle chaude ou bleue d'aube, **faceless**. Sujets : mer et horizon, vagues qui se retirent sur le sable, rideau de lin dans le vent, herbes hautes, vapeur d'une tasse en céramique, mains dans l'eau, dos ou nuque dans la lumière.

Refuser : visages face caméra, sport intense, lumière blanche froide, couleurs saturées, rose/fuchsia, texte incrusté, logos, drones rapides.

Le texte du hero doit rester lisible : zone calme (ciel, mer, sable) là où le titre se pose. Un voile bleu nuit (`--semantic-bg-deep`, opacité 35–55 %) est ajouté par le composant.

## 2. Où chercher (vérifier la licence de **chaque** clip)

| Site | Coût | À savoir |
|---|---|---|
| Pexels Videos | gratuit | Licence Pexels : usage commercial, pas d'attribution obligatoire. Vérifier qu'aucune personne identifiable n'apparaît. |
| Pixabay | gratuit | Licence Pixabay, usage commercial. Qualité inégale. |
| Coverr | gratuit | Conçu pour les hero de sites, boucles prêtes. |
| Mixkit | gratuit | Licence Mixkit Stock Video Free. |
| Stocksy | payant (à l'unité) | Esthétique authentique et sensible, très proche de la DA. Photos et vidéos. |
| Artgrid / Envato Elements / Adobe Stock | abonnement | Grand choix cinématographique ; licence par projet (Envato : enregistrer le projet). |

Garder dans `docs/CREDITS.md` : URL du clip, auteur, licence, date de téléchargement, capture de la page de licence.

Meilleure option à terme : un tournage maison de 30 minutes (mer, lin, tasse, mains) au smartphone en 4K/30 i/s, stabilisé, lumière de fin de journée : authentique et sans question de licence.

## 3. Compresser

Déposer l'original dans `assets-src/video/` (non publié), puis :

```bash
npm run hero-video -- assets-src/video/original.mp4 [début_en_s] [durée_en_s]
```

Le script (`scripts/process-hero-video.mjs`) produit dans `public/videos/` :
- `hero-720.mp4` (H.264, 1280×720, CRF 28, sans son, `faststart`) — budget ≤ 2,5 Mo
- `hero-720.webm` (VP9, CRF 38, sans son) — budget ≤ 2 Mo
- `hero-480.mp4` pour mobile (854×480) — budget ≤ 1,2 Mo
- `hero-poster.webp` et `hero-poster.jpg` (première image, 1600 px) — budget ≤ 150 Ko

Toujours supprimer la piste audio. Si un budget est dépassé : raccourcir le clip ou augmenter le CRF de 2.

## 4. Intégrer

```astro
<HeroVideo poster="/videos/hero-poster.jpg" sources={[...]} />
```

Le composant `src/components/HeroVideo.astro` gère : `muted playsinline loop autoplay`, poster affiché immédiatement, **pas de vidéo** si `prefers-reduced-motion: reduce` ou si l'économie de données est activée (`navigator.connection.saveData`), bouton **Pause / Lecture** visible au clavier (WCAG 2.2.2 : tout contenu animé de plus de 5 s doit pouvoir être mis en pause), fallback image si la vidéo ne charge pas, `aria-hidden` sur la vidéo décorative.

Sans vidéo (en attendant) : le composant affiche l'illustration de marque « horizon ».
