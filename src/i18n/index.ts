// Langues du site : français (par défaut, sans préfixe) et anglais (sous /en).
// - langOf(url) : langue d'une page, déduite de son URL (aucun paramètre à faire circuler).
// - path(cle, lang) : URL d'une page dans une langue (les slugs anglais sont traduits).
// - alternates(url) : URL de la même page dans l'autre langue (sélecteur de langue, balises hreflang).
// Les pages dont l'URL n'est pas dans la table (articles de blog) passent leur équivalent explicitement.

export type Lang = 'fr' | 'en';
export const langs: Lang[] = ['fr', 'en'];

export const langOf = (url: URL): Lang => (/^\/en(\/|$|\.html$)/.test(url.pathname) ? 'en' : 'fr');

export const routes = {
  accueil: { fr: '/', en: '/en' },
  apropos: { fr: '/a-propos', en: '/en/about' },
  blog: { fr: '/blog', en: '/en/blog' },
  recommandations: { fr: '/recommandations', en: '/en/recommendations' },
  mentions: { fr: '/mentions-legales', en: '/en/legal-notice' },
  cgv: { fr: '/cgv', en: '/en/terms-of-sale' },
  confidentialite: { fr: '/confidentialite', en: '/en/privacy' },
  cookies: { fr: '/cookies', en: '/en/cookies' },
  merci: { fr: '/merci', en: '/en/thank-you' },
  nlEnvoyee: { fr: '/newsletter-envoyee', en: '/en/newsletter-sent' },
  nlConfirmee: { fr: '/newsletter-confirmee', en: '/en/newsletter-confirmed' },
  nlErreur: { fr: '/newsletter-erreur', en: '/en/newsletter-error' },
} satisfies Record<string, Record<Lang, string>>;

export type Route = keyof typeof routes;

export const path = (cle: Route, lang: Lang) => routes[cle][lang];

/** Ancre sur l'accueil dans la bonne langue, ex. ancre('guide', 'en') → /en#guide. */
export const ancre = (id: string, lang: Lang) => `${lang === 'en' ? '/en' : '/'}#${id}`;

/** Chemin « propre » d'une URL : sans .html ni slash final (/merci.html → /merci). */
export const cleanPath = (url: URL) => url.pathname.replace(/(index)?\.html$/, '').replace(/(.)\/$/, '$1') || '/';

/** Même page dans chaque langue. `override` sert aux pages hors table (articles). null = pas d'équivalent. */
export function alternates(url: URL, override?: Partial<Record<Lang, string | null>>): Record<Lang, string | null> {
  const courant = cleanPath(url);
  const trouve = Object.values(routes).find((r) => r.fr === courant || r.en === courant);
  const base: Record<Lang, string | null> = trouve ? { ...trouve } : { fr: null, en: null };
  base[langOf(url)] = courant;
  return { ...base, ...override };
}

export const htmlLang = { fr: 'fr', en: 'en' } as const;
export const ogLocale = { fr: 'fr_FR', en: 'en_GB' } as const;
export const intlLocale = { fr: 'fr-FR', en: 'en-GB' } as const;

export const formatDate = (d: Date, lang: Lang) => new Intl.DateTimeFormat(intlLocale[lang], { dateStyle: 'long' }).format(d);

/** Textes communs (en-tête, pied de page, formulaires, gabarits). */
export const ui = {
  fr: {
    skip: 'Aller au contenu',
    accueilAria: 'Cycle Awakening, accueil',
    nav: { guide: 'Le guide', blog: 'Blog', recommandations: 'Recommandations', faq: 'Questions', newsletter: 'Newsletter' },
    navAria: 'Navigation principale',
    menu: 'Menu',
    langue: { aria: 'Choisir la langue', fr: 'Français', en: 'English' },
    tagline: 'Redevenir toi. Chaque mois.',
    description:
      "Comprendre ce qui se passe dans ton corps, phase après phase, et savoir quoi faire concrètement : manger, bouger, ralentir.",
    shareAlt: 'Cycle Awakening — Redevenir toi. Chaque mois.',
    footer: {
      signature: 'Tu n’es pas instable. Tu es cyclique.',
      aria: 'Informations légales',
      apropos: 'À propos',
      blog: 'Blog',
      recommandations: 'Recommandations',
      mentions: 'Mentions légales',
      cgv: 'Conditions générales de vente',
      confidentialite: 'Confidentialité',
      cookies: 'Cookies',
      disclaimer:
        'Cycle Awakening propose un accompagnement de mode de vie. Il ne remplace pas un avis médical, un diagnostic ou un traitement. En cas de douleur intense, de saignements très abondants ou de symptômes inhabituels, consulte un·e professionnel·le de santé.',
    },
    cta: {
      obtenir: (prix: string) => `Obtenir le guide — ${prix}`,
      attente: 'Être prévenue de la sortie',
      attenteCourt: 'Être prévenue',
      bientot: 'Le guide arrive bientôt.',
    },
    nl: {
      trap: 'Ne pas remplir',
      emailLabel: 'Ton adresse email',
      placeholder: 'ton@email.com',
      bouton: 'S’inscrire',
      consentement: 'J’accepte de recevoir la newsletter de Cycle Awakening. Désinscription en un clic à tout moment. Voir la',
      politique: 'politique de confidentialité',
      verifie: 'Vérifie ton adresse email.',
      coche: 'Coche la case pour accepter de recevoir la newsletter.',
      envoi: 'Envoi…',
      presque: 'Presque fini : ouvre l’email que je viens de t’envoyer et confirme ton inscription.',
      oups: 'Oups, l’inscription n’a pas fonctionné. Réessaie dans un instant ou écris à hello@cycleawakening.com.',
    },
    hero: { photoAttente: 'Photo à venir', photo: 'Photo :', surUnsplash: ' sur Unsplash' },
    legal: {
      eyebrow: 'Informations légales',
      maj: (d: string) => `Dernière mise à jour : ${d}`,
      brouillon: 'Document en cours de validation : ce texte est un modèle de travail, il n’a pas encore été relu par un·e juriste.',
      traduction: '',
    },
    prix: { gratuit: 'Gratuit' },
  },
  en: {
    skip: 'Skip to content',
    accueilAria: 'Cycle Awakening, home',
    nav: { guide: 'The guide', blog: 'Blog', recommandations: 'Recommendations', faq: 'Questions', newsletter: 'Newsletter' },
    navAria: 'Main navigation',
    menu: 'Menu',
    langue: { aria: 'Choose language', fr: 'Français', en: 'English' },
    tagline: 'Come back to yourself. Every month.',
    description:
      'Understand what happens in your body, phase by phase, and know what to actually do: eat, move, slow down.',
    shareAlt: 'Cycle Awakening — Come back to yourself. Every month.',
    footer: {
      signature: 'You are not unstable. You are cyclical.',
      aria: 'Legal information',
      apropos: 'About',
      blog: 'Blog',
      recommandations: 'Recommendations',
      mentions: 'Legal notice',
      cgv: 'Terms of sale',
      confidentialite: 'Privacy',
      cookies: 'Cookies',
      disclaimer:
        'Cycle Awakening offers lifestyle support. It does not replace medical advice, a diagnosis or treatment. If you have intense pain, very heavy bleeding or unusual symptoms, see a health professional.',
    },
    cta: {
      obtenir: (prix: string) => `Get the guide — ${prix}`,
      attente: 'Tell me when it’s out',
      attenteCourt: 'Notify me',
      bientot: 'The guide is coming soon.',
    },
    nl: {
      trap: 'Do not fill in',
      emailLabel: 'Your email address',
      placeholder: 'you@email.com',
      bouton: 'Subscribe',
      consentement: 'I agree to receive the Cycle Awakening newsletter. Unsubscribe in one click at any time. See the',
      politique: 'privacy policy',
      verifie: 'Please check your email address.',
      coche: 'Tick the box to agree to receive the newsletter.',
      envoi: 'Sending…',
      presque: 'Almost done: open the email I’ve just sent you and confirm your subscription.',
      oups: 'Oops, the sign-up didn’t work. Try again in a moment or write to hello@cycleawakening.com.',
    },
    hero: { photoAttente: 'Photo coming soon', photo: 'Photo:', surUnsplash: ' on Unsplash' },
    legal: {
      eyebrow: 'Legal information',
      maj: (d: string) => `Last updated: ${d}`,
      brouillon: 'Document being finalised: this text is a working draft and has not yet been reviewed by a lawyer.',
      traduction: 'This English version is provided for information only. In case of any difference, the French version prevails.',
    },
    prix: { gratuit: 'Free' },
  },
} as const;

export const t = (lang: Lang) => ui[lang];
