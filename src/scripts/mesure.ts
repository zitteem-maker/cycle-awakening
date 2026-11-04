// Mesure d'audience sans cookie ni identifiant (docs/MESURE-AUDIENCE.md).
// Envoie seulement : nom de l'événement, page, emplacement du bouton, détail (ex. offre ou marque), site d'origine.
// Respecte « Do Not Track » / « Global Privacy Control ».
const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
const refus = nav.doNotTrack === '1' || nav.globalPrivacyControl === true;

function envoyer(e: string, champs: Record<string, string | undefined> = {}) {
  if (refus) return;
  const corps = JSON.stringify({ e, page: location.pathname, ...champs });
  try {
    if (!navigator.sendBeacon?.('/api/evenement', new Blob([corps], { type: 'application/json' }))) {
      fetch('/api/evenement', { method: 'POST', body: corps, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(() => {});
    }
  } catch {
    /* la mesure ne doit jamais gêner la navigation */
  }
}

// Page vue (avec le site d'origine seulement, jamais l'adresse complète).
let ref: string | undefined;
try { ref = document.referrer ? new URL(document.referrer).hostname : undefined; } catch { ref = undefined; }
envoyer('page_vue', { ref: ref && ref !== location.hostname ? ref : undefined });

// Clics sur les éléments marqués data-event (boutons d'achat, liste d'attente, recommandations…).
document.addEventListener('click', (ev) => {
  const el = (ev.target as Element).closest<HTMLElement>('[data-event]');
  if (!el) return;
  envoyer(el.dataset.event!, { emplacement: el.dataset.ctaLocation, detail: el.dataset.offer ?? el.dataset.reco });
});

// Événements émis par le code (inscription newsletter, achat, quiz).
addEventListener('ca:event', (ev) => {
  const d = (ev as CustomEvent<{ name: string; source?: string }>).detail;
  envoyer(d.name, { emplacement: d.source });
});
addEventListener('ca:track', (ev) => {
  const d = (ev as CustomEvent<{ event: string; offer?: string }>).detail;
  envoyer(d.event, { detail: d.offer });
});
