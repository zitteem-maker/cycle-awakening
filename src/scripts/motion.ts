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

  // --- Entrée du hero : texte depuis la gauche, roue en vue éclatée qui s'assemble seule ---------
  const heroEntree = document.querySelector<HTMLElement>('[data-hero]');
  if (heroEntree) {
    const q = (sel: string) => heroEntree.querySelectorAll<Element>(sel);
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.fromTo(q('[data-in]'), { x: -110, opacity: 0 }, { x: 0, opacity: 1, duration: 1.4, stagger: 0.11 }, 0.1);
    // --- Roue en VUE ÉCLATÉE (façon dessin d'horloger) : quatre plateaux inclinés, séparés en hauteur. ------------
    const roueEl = heroEntree.querySelector<HTMLElement>('[data-wheel]');
    if (roueEl) {
      const pile = roueEl.querySelector<HTMLElement>('[data-wheel-stack]')!;
      const plateaux = [...roueEl.querySelectorAll<HTMLElement>('[data-layer]')];
      const pieces = [...roueEl.querySelectorAll<HTMLElement>('[data-piece]')];
      const ecart = () => Math.min(90, roueEl.offsetWidth * 0.19); // hauteur entre deux plateaux
      const eclate = { rotationX: 56, rotationZ: -26, scale: 0.66, y: () => roueEl.offsetWidth * 0.1 };
      const axes = roueEl.querySelectorAll<HTMLElement>('[data-axe]');
      roueEl.style.setProperty('--hauteur-axes', `${3 * ecart()}px`);
      gsap.set(pile, { ...eclate });
      // La sphère et la bille restent face à nous : on annule l'inclinaison de la pile (ordre inverse).
      const majFace = () => {
        const rx = Number(gsap.getProperty(pile, 'rotationX'));
        const rz = Number(gsap.getProperty(pile, 'rotationZ'));
        roueEl.style.setProperty('--face', `rotateX(${-rx}deg) rotateZ(${-rz}deg)`);
      };
      majFace();
      plateaux.forEach((p, i) => gsap.set(p, { z: () => i * ecart() }));
      roueEl.classList.add('is-eclatee');

      // 1. Les plateaux tombent un à un à leur place dans la vue éclatée (des 28 jours au repère du jour).
      const pose = gsap.timeline({ defaults: { ease: 'expo.out' }, scrollTrigger: { trigger: roueEl, start: 'top 88%' } });
      pieces.forEach((piece, i) => {
        // Fondu sur les enfants seulement : une opacité sur un conteneur 3D l'aplatirait.
        pose.fromTo(piece, { z: 420, scale: 0.85 }, { z: 0, scale: 1, duration: 1.6 }, 0.3 + i * 0.26);
        pose.fromTo(piece.children, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' }, 0.3 + i * 0.26);
      });
      // Sphère et bille (premier plan) : apparaissent avec le dernier plateau.
      pose.fromTo(roueEl.querySelector('[data-avant]'), { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0.3 + 3 * 0.26 + 0.3);
      // Les quatre phases de verre arrivent en plus de quatre directions sur leur plateau.
      roueEl.querySelectorAll<SVGGElement>('[data-wheel-part]').forEach((el, i) => {
        gsap.set(el, { svgOrigin: '200 200' });
        pose.fromTo(el, { x: Number(el.dataset.dx) * 240, y: Number(el.dataset.dy) * 240, rotation: (i % 2 ? -1 : 1) * 30, opacity: 0 }, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 1.7 }, 0.6 + i * 0.12);
      });
      pose.fromTo(roueEl.querySelectorAll('[data-legende]'), { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 1.1, stagger: 0.14 }, 1.4);

      // 2. Courte pause en vue éclatée, puis assemblage rapide et automatique (sans attendre le défilement).
      const debut = 3.6;
      // Fin de l'assemblage : la bille passe à son dernier tour (voir CycleWheel.astro).
      pose.call(() => { roueEl.classList.remove('is-eclatee'); roueEl.dataset.assemblee = '1'; }, undefined, debut + 1.8);
      pose.to(pile, { rotationX: 0, rotationZ: 0, scale: 1, y: 0, duration: 1.8, ease: 'power3.inOut', onUpdate: majFace }, debut);
      plateaux.forEach((p, i) => pose.to(p, { z: i * 0.5, duration: 1.8, ease: 'power3.inOut' }, debut));
      pose.to(axes, { scaleY: 0.01, opacity: 0, duration: 1.2, ease: 'power3.in' }, debut);
    }
  }

  // --- Haut des autres pages : texte qui arrive depuis la gauche ---------------------------------
  document.querySelectorAll<HTMLElement>('[data-hero-page]').forEach((h) => {
    gsap.fromTo(h.querySelectorAll('[data-in]'), { x: -110, opacity: 0 }, { x: 0, opacity: 1, duration: 1.4, stagger: 0.11, ease: 'expo.out', delay: 0.1 });
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
    tl.fromTo(frise.querySelectorAll('.phases__panel:not([hidden]), .phases__note'), { x: -90, opacity: 0 }, { x: 0, opacity: 1, duration: 1.3, stagger: 0.1 }, 0.9);
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

  // --- Cycle : les jours J1 → J28 défilent tout seuls tant que la section est à l'écran ---------
  // (sans dépendre du défilement). Un clic sur une phase met la lecture en pause quelques secondes.
  const cycle = document.querySelector<HTMLElement>('[data-pin-cycle]');
  if (cycle) {
    let jour = 1;
    let minuteur = 0;
    let pauseJusqua = 0;
    const tic = () => {
      if (performance.now() >= pauseJusqua) {
        window.dispatchEvent(new CustomEvent('ca:cycle-day', { detail: jour }));
        jour = (jour % 28) + 1;
      }
      minuteur = window.setTimeout(tic, jour >= 17 ? 380 : 280);
    };
    ScrollTrigger.create({
      trigger: cycle,
      start: 'top 75%',
      end: 'bottom 25%',
      onToggle: (st) => {
        clearTimeout(minuteur);
        if (st.isActive) minuteur = window.setTimeout(tic, 1200); // après l'entrée de la frise
      },
    });
    cycle.addEventListener('click', (e) => {
      if ((e.target as Element).closest('[role="tab"]')) pauseJusqua = performance.now() + 8000;
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
  // Livre : entrée en pivotant, puis il flotte et tourne doucement en continu (sans défilement).
  const livre = document.querySelector<HTMLElement>('[data-book]');
  if (livre) {
    gsap.fromTo(
      livre,
      { rotateY: -48, rotateX: 12, y: 80, opacity: 0 },
      {
        rotateY: -22, rotateX: 4, y: 0, opacity: 1, duration: 1.8, ease: 'expo.out',
        scrollTrigger: { trigger: livre, start: 'top 85%' },
        onComplete: () => {
          gsap.to(livre, { rotateY: -4, rotateX: -3, y: -16, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        },
      },
    );
  }

  // --- Questions : chaque carte pivote en 3D jusqu'à se poser, comme la couverture du guide -----
  document.querySelectorAll<HTMLElement>('[data-faq-card]').forEach((carte, i) => {
    gsap.fromTo(
      carte,
      { rotationY: i % 2 ? 34 : -34, rotationX: 12, y: 90, z: -120, opacity: 0, transformPerspective: 1400 },
      { rotationY: 0, rotationX: 0, y: 0, z: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: carte, start: 'top 98%', end: 'top 62%', scrub: 0.5 } },
    );
  });

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
