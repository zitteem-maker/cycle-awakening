// Configuration publique du site, lue depuis les variables d'environnement (voir .env.example).
// Seules les variables préfixées PUBLIC_ sont exposées au navigateur ; les autres ne sont lues qu'au build.
// Aucun secret ici.

const env = import.meta.env;

/** URL canonique du site, sans slash final. Sert aux balises Open Graph, au sitemap et aux liens UTM. */
export const SITE_URL: string = (env.PUBLIC_SITE_URL || 'https://cycleawakening.com').replace(/\/$/, '');

/**
 * Lien de paiement du guide (Stripe Payment Link, option A).
 * Vide = paiement non branché : le CTA affiche « bientôt disponible » et renvoie vers la newsletter,
 * au lieu d'un lien mort vers « # ».
 */
export const CHECKOUT_URL: string | null = validCheckoutUrl(env.PUBLIC_CHECKOUT_URL);

export const site = {
  name: 'Cycle Awakening',
  tagline: 'Redevenir toi. Chaque mois.',
  description:
    "Comprendre ce qui se passe dans ton corps, phase après phase, et savoir quoi faire concrètement : manger, bouger, ralentir.",
  locale: 'fr_FR',
  shareImage: '/images/share/og-default.png',
  shareImageAlt: 'Cycle Awakening — Redevenir toi. Chaque mois.',
};

export const features = {
  /** Modules grossesse, pré-conception et post-partum : jamais en production sans feu vert écrit après relecture professionnelle. */
  pregnancyModules: env.FEATURE_PREGNANCY_MODULES === 'true',
};

function validCheckoutUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') throw new Error('doit être en https');
    return url.toString();
  } catch (err) {
    throw new Error(`PUBLIC_CHECKOUT_URL invalide (${value}) : ${(err as Error).message}`);
  }
}
