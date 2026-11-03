// Animations de la page d'accueil : défilement fluide (Lenis) + scènes au défilement (GSAP ScrollTrigger).
// Principe : tout est décrit par des attributs data-* dans le HTML ; sans JavaScript ou en
// « mouvement réduit », rien n'est caché et la page reste complète et lisible.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pointeurFin = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (!reduit) {
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('motion');

  // --- Défilement fluide, synchronisé avec ScrollTrigger -------------------------------------
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  // Les ancres internes passent aussi par Lenis.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="/#"], a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href')!.replace('/', '');
      const cible = document.querySelector(id);
      if (cible && location.pathname === '/') {
        e.preventDefault();
        lenis.scrollTo(cible as HTMLElement, { offset: -70 });
        history.replaceState(null, '', id);
      }
    });
  });

  // --- Titres : mots qui montent derrière un masque ------------------------------------------
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((titre) => {
    const mots = decouperMots(titre);
    gsap.from(mots, {
      yPercent: 110,
      rotate: 4,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.06,
      scrollTrigger: { trigger: titre, start: 'top 85%' },
    });
  });

  // --- Texte qui s'allume mot à mot (histoire) ------------------------------------------------
  document.querySelectorAll<HTMLElement>('[data-words]').forEach((bloc) => {
    const mots = decouperMots(bloc, false);
    gsap.fromTo(
      mots,
      { opacity: 0.14 },
      { opacity: 1, ease: 'none', stagger: 0.05, scrollTrigger: { trigger: bloc, start: 'top 78%', end: 'bottom 45%', scrub: true } },
    );
  });

  // --- Chiffres qui défilent jusqu'à leur valeur ----------------------------------------------
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const fin = Number(el.dataset.count);
    const etat = { v: 0 };
    el.textContent = '0';
    gsap.to(etat, {
      v: fin,
      duration: 1.6,
      ease: 'power3.out',
      onUpdate: () => (el.textContent = String(Math.round(etat.v))),
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  // --- Cartes empilées (problème) : chaque carte recule quand la suivante arrive ---------------
  const cartes = gsap.utils.toArray<HTMLElement>('[data-stack] > *');
  cartes.forEach((carte, i) => {
    const suivante = cartes[i + 1];
    if (!suivante) return;
    gsap.fromTo(carte, { scale: 1, filter: 'brightness(1)' }, {
      scale: 0.9,
      filter: 'brightness(0.94)',
      ease: 'none',
      scrollTrigger: { trigger: suivante, start: 'top 85%', end: 'top 30%', scrub: true },
    });
  });

  // --- Sections profondes qui s'ouvrent (masque arrondi qui s'élargit) -------------------------
  document.querySelectorAll<HTMLElement>('[data-clip]').forEach((section) => {
    gsap.fromTo(
      section,
      { clipPath: 'inset(7% 5% 0% 5% round 48px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 25%', scrub: true } },
    );
  });

  // --- Cycle épinglé : le défilement fait avancer les jours J1 → J28 ---------------------------
  const cycle = document.querySelector<HTMLElement>('[data-pin-cycle]');
  if (cycle) {
    ScrollTrigger.create({
      trigger: cycle,
      start: 'top top',
      end: '+=160%',
      pin: true,
      scrub: true,
      onUpdate: (st) => {
        const jour = Math.min(28, 1 + Math.floor(st.progress * 28));
        window.dispatchEvent(new CustomEvent('ca:cycle-day', { detail: jour }));
      },
    });
  }

  // --- Parallaxe : profondeur des cartes recettes, couverture du livre ----------------------
  document.querySelectorAll<HTMLElement>('[data-speed]').forEach((el) => {
    gsap.to(el, {
      yPercent: Number(el.dataset.speed) * -100,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
  const livre = document.querySelector<HTMLElement>('[data-book]');
  if (livre) {
    gsap.fromTo(
      livre,
      { rotateY: -42, rotateX: 10, y: 60 },
      { rotateY: -10, rotateX: 0, y: -20, ease: 'none', scrollTrigger: { trigger: livre, start: 'top bottom', end: 'bottom 35%', scrub: true } },
    );
  }

  // --- Bandeau défilant : accélère et s'incline avec la vitesse de défilement ----------------
  const bandeau = document.querySelector<HTMLElement>('[data-marquee]');
  if (bandeau) {
    const incliner = gsap.quickTo(bandeau.querySelectorAll('.marquee__item'), 'skewX', { duration: 0.5, ease: 'power3' });
    ScrollTrigger.create({
      onUpdate: (st) => incliner(gsap.utils.clamp(-8, 8, st.getVelocity() / -250)),
    });
  }

  // --- Interactions au pointeur (souris uniquement) -------------------------------------------
  if (pointeurFin) {
    // Boutons magnétiques
    document.querySelectorAll<HTMLElement>('[data-magnetic] .cta, .cta[data-magnetic]').forEach((btn) => {
      const x = gsap.quickTo(btn, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      const y = gsap.quickTo(btn, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.3);
        y((e.clientY - r.top - r.height / 2) * 0.4);
      });
      btn.addEventListener('pointerleave', () => { x(0); y(0); });
    });
    // Halo lumineux qui suit le pointeur sur les sections profondes
    document.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((zone) => {
      zone.addEventListener('pointermove', (e) => {
        const r = zone.getBoundingClientRect();
        zone.style.setProperty('--mx', `${e.clientX - r.left}px`);
        zone.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
    // Profondeur du hero : la roue et les halos suivent légèrement le pointeur
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    if (hero) {
      const couches = [...hero.querySelectorAll<HTMLElement>('[data-depth]')].map((el) => ({
        k: Number(el.dataset.depth),
        x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3' }),
      }));
      hero.addEventListener('pointermove', (e) => {
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        couches.forEach((c) => { c.x(dx * c.k); c.y(dy * c.k); });
      });
    }
  }

  // Les images chargées tardivement changent les hauteurs : on recalcule les positions.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/** Enveloppe chaque mot dans un <span> (masqué ou non) en gardant les balises internes (em, strong). */
function decouperMots(racine: HTMLElement, masque = true): HTMLElement[] {
  const mots: HTMLElement[] = [];
  const parcourir = (noeud: Node) => {
    for (const enfant of [...noeud.childNodes]) {
      if (enfant.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const morceau of (enfant.textContent ?? '').split(/(\s+)/)) {
          if (!morceau) continue;
          if (/^\s+$/.test(morceau)) { frag.append(morceau); continue; }
          const mot = document.createElement('span');
          mot.className = 'mot';
          mot.textContent = morceau;
          if (masque) {
            const m = document.createElement('span');
            m.className = 'mot-masque';
            m.append(mot);
            frag.append(m);
          } else frag.append(mot);
          mots.push(mot);
        }
        enfant.replaceWith(frag);
      } else if (enfant.nodeType === Node.ELEMENT_NODE && (enfant as Element).tagName !== 'BR') {
        parcourir(enfant);
      }
    }
  };
  parcourir(racine);
  return mots;
}
