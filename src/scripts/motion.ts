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

  // --- Entrée du hero : texte depuis la gauche, roue « éclatée » qui s'assemble ----------------
  const heroEntree = document.querySelector<HTMLElement>('[data-hero]');
  if (heroEntree) {
    const q = (sel: string) => heroEntree.querySelectorAll<Element>(sel);
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo(q('[data-in]'), { x: -110, opacity: 0, filter: 'blur(10px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1.4, stagger: 0.11 }, 0.1);
    // La roue s'assemble quand elle est visible (dès le chargement sur ordinateur, au défilement sur téléphone).
    const roue = gsap.timeline({ defaults: { ease: 'expo.out' }, scrollTrigger: { trigger: heroEntree.querySelector('[data-wheel]'), start: 'top 88%' } });
    // Quatre quartiers de verre qui arrivent de quatre directions et se posent.
    q('[data-wheel-part]').forEach((part, i) => {
      const el = part as SVGGElement;
      const dx = Number(el.dataset.dx);
      const dy = Number(el.dataset.dy);
      // Origine fixée une seule fois (au centre de la roue) : la redéfinir dans le tween décalerait la pièce.
      gsap.set(el, { svgOrigin: '200 200' });
      roue.fromTo(
        el,
        { x: dx * 320, y: dy * 320, rotation: (i % 2 ? -1 : 1) * 38, scale: 0.65, opacity: 0 },
        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 1.8 },
        0.2 + i * 0.14,
      );
    });
    roue.call(() => heroEntree.querySelector('[data-hero-disque]')?.classList.add('is-on'), undefined, 1.0);
    roue.to(q('[data-wheel-orbit]'), { opacity: 1, duration: 1.2, ease: 'power2.out' }, 1.2);
    roue.fromTo(q('[data-wheel-tick]'), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.025, ease: 'power1.out' }, 1.35);
    roue.fromTo(q('[data-wheel-label]'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.14 }, 1.8);
    roue.fromTo(q('[data-wheel-center]'), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'back.out(1.8)' }, 2.0);
    roue.fromTo(q('[data-wheel-dot]'), { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(3)' }, 2.5);
  }

  // --- Haut des autres pages : texte qui arrive depuis la gauche ---------------------------------
  document.querySelectorAll<HTMLElement>('[data-hero-page]').forEach((h) => {
    gsap.fromTo(h.querySelectorAll('[data-in]'), { x: -110, opacity: 0, filter: 'blur(10px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1.4, stagger: 0.11, ease: 'expo.out', delay: 0.1 });
  });

  // --- Frise « Ton cycle en quatre temps » : jours éclatés qui se rangent, onglets de 4 côtés ----
  const frise = document.querySelector<HTMLElement>('[data-phases]');
  if (frise) {
    const aleatoire = gsap.utils.random;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, scrollTrigger: { trigger: frise, start: 'top 82%' } });
    tl.fromTo(
      frise.querySelectorAll('.phases__jour'),
      { x: () => aleatoire(-320, 320), y: () => aleatoire(-220, 220), rotation: () => aleatoire(-120, 120), scale: 0.3, opacity: 0 },
      { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 1.5, stagger: { each: 0.022, from: 'random' }, clearProps: 'transform' },
      0,
    );
    const depuis = [{ x: -260 }, { y: -160 }, { y: 160 }, { x: 260 }];
    frise.querySelectorAll('[role="tab"]').forEach((tab, i) => {
      tl.fromTo(tab, { ...depuis[i], opacity: 0, rotation: i % 2 ? 4 : -4 }, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 1.4, clearProps: 'transform' }, 0.45 + i * 0.1);
    });
    tl.fromTo(frise.querySelectorAll('.phases__panel:not([hidden]), .phases__note'), { x: -90, opacity: 0, filter: 'blur(8px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1.3, stagger: 0.1 }, 0.9);
  }

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
