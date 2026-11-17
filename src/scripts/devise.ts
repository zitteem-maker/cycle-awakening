// Choix de la devise sur le site anglais (euro, dollar, livre sterling).
// Éléments pilotés :
//   [data-devise-choix] > [data-devise="USD"]   boutons (role=radio)
//   [data-prix]                                 texte du prix : JSON { EUR: "€27", USD: "$29", … }
//   [data-devise-urls]                          lien de paiement : JSON { EUR: "https://…", USD: "https://…" }
//   [data-devise-labels]                        libellé du bouton d'achat : JSON { EUR: "Get the guide — €27", … }
// Le choix est mémorisé dans le navigateur (localStorage, aucun cookie) ; sinon déduit de la langue du navigateur.
const CLE = 'ca-devise';
const groupes = document.querySelectorAll<HTMLElement>('[data-devise-choix]');

if (groupes.length) {
  const disponibles = new Set([...groupes[0].querySelectorAll<HTMLElement>('[data-devise]')].map((b) => b.dataset.devise!));
  const lire = () => { try { return localStorage.getItem(CLE); } catch { return null; } };
  const ecrire = (v: string) => { try { localStorage.setItem(CLE, v); } catch { /* stockage indisponible */ } };
  const devinee = () => {
    const l = (navigator.language || '').toLowerCase();
    if (l.startsWith('en-gb')) return 'GBP';
    if (l.startsWith('en-us') || l.startsWith('en-ca') || l.startsWith('en-au')) return 'USD';
    return 'EUR';
  };

  const appliquer = (devise: string) => {
    for (const g of groupes) {
      for (const b of g.querySelectorAll<HTMLButtonElement>('[data-devise]')) {
        const actif = b.dataset.devise === devise;
        b.setAttribute('aria-checked', String(actif));
        b.tabIndex = actif ? 0 : -1;
      }
    }
    for (const el of document.querySelectorAll<HTMLElement>('[data-prix]')) {
      const prix = JSON.parse(el.dataset.prix || '{}');
      if (prix[devise]) el.textContent = prix[devise];
    }
    for (const a of document.querySelectorAll<HTMLAnchorElement>('[data-devise-urls]')) {
      const urls = JSON.parse(a.dataset.deviseUrls || '{}');
      if (urls[devise]) a.href = urls[devise];
      const labels = JSON.parse(a.dataset.deviseLabels || '{}');
      if (labels[devise]) a.textContent = labels[devise];
    }
  };

  const depart = [lire(), devinee()].find((v) => v && disponibles.has(v)) ?? 'EUR';
  if (depart !== 'EUR') appliquer(depart);

  for (const g of groupes) {
    g.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-devise]');
      if (!b) return;
      ecrire(b.dataset.devise!);
      appliquer(b.dataset.devise!);
    });
    // Flèches gauche/droite : navigation clavier d'un groupe de boutons radio.
    g.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const boutons = [...g.querySelectorAll<HTMLButtonElement>('[data-devise]')];
      const i = boutons.findIndex((b) => b.getAttribute('aria-checked') === 'true');
      const suivant = boutons[(i + (e.key === 'ArrowRight' ? 1 : -1) + boutons.length) % boutons.length];
      suivant.focus();
      suivant.click();
    });
  }
}
