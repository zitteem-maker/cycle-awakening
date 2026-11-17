// Offres et prix : seule source pour les montants affichés (jamais de prix en dur dans les pages).
// Les montants facturés restent ceux configurés dans Stripe : garder les deux alignés.
import bookMeta from './book-meta.json';

export type Offer = {
  id: string;
  name: string;
  /** Prix en centimes d'euro, TTC. `null` = gratuit. */
  priceCents: number | null;
  billing: 'one-time' | 'monthly' | 'yearly' | 'free';
};

/** Devises proposées sur le site anglais. Le site français reste en euros. */
export type Currency = 'EUR' | 'USD' | 'GBP';
export const currencies: Currency[] = ['EUR', 'USD', 'GBP'];
export const currencyNames: Record<Currency, string> = { EUR: 'Euro', USD: 'US dollar', GBP: 'Pound sterling' };
/** Langue de mise en forme du prix : « €27 », « $29 », « £24 ». */
const currencyLocale: Record<Currency, string> = { EUR: 'en-IE', USD: 'en-US', GBP: 'en-GB' };

/**
 * Prix du guide par devise, en centimes, TTC. SEULS les montants confirmés par la fondatrice sont ici.
 * Une devise absente n'est pas proposée au public. Ajouter une devise : son montant ici, puis son lien de paiement
 * (PUBLIC_CHECKOUT_URL_USD, PUBLIC_CHECKOUT_URL_GBP) : voir .env.example.
 */
export const guidePrices: Partial<Record<Currency, number>> = { EUR: 2700, USD: 2900, GBP: 2400 }; // USD et GBP confirmés par la fondatrice le 17 novembre 2026
/** Montants PROPOSÉS, non confirmés : affichés uniquement sur la prévisualisation, avec la mention « à confirmer ». Vide : tout est confirmé. */
export const guidePricesProposed: Partial<Record<Currency, number>> = {};

export const guide = {
  id: 'guide',
  name: 'Cycle Awakening — Le Guide',
  priceCents: 2700,
  billing: 'one-time',
  /**
   * Nombre de pages du livre : VARIABLE UNIQUE, utilisée partout (site, FAQ, emails).
   * Jamais saisi à la main : `npm run build:book` compte les pages du PDF réel et met à jour book-meta.json.
   * Tant que la valeur est `null` (livre pas encore généré), aucun nombre de pages n'est affiché.
   */
  pages: bookMeta.pages as number | null,
  /** Nombre de pages de l'édition anglaise (écrit par `npm run build:book:en`). */
  pagesEn: ((bookMeta as { pagesEn?: number }).pagesEn ?? null) as number | null,
} satisfies Offer & { pages: number | null };

export const premium = {
  monthly: { id: 'premium-monthly', name: 'Premium', priceCents: 1900, billing: 'monthly' },
  yearly: { id: 'premium-yearly', name: 'Premium', priceCents: 14900, billing: 'yearly' },
} satisfies Record<string, Offer>;

export const starter = { id: 'starter', name: 'Cycle Starter', priceCents: null, billing: 'free' } satisfies Offer;

export function formatPrice(cents: number | null, locale = 'fr-FR', currency: Currency = 'EUR'): string {
  if (cents === null) return locale.startsWith('en') ? 'Free' : 'Gratuit';
  return new Intl.NumberFormat(currency === 'EUR' ? locale : currencyLocale[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

/** Prix du guide dans chaque devise disponible (confirmées, plus les propositions si `avecPropositions`). */
export function pricesFor(locale: string, avecPropositions = false): Partial<Record<Currency, { cents: number; texte: string; propose: boolean }>> {
  const tout: Partial<Record<Currency, { cents: number; texte: string; propose: boolean }>> = {};
  for (const c of currencies) {
    const confirme = guidePrices[c];
    const propose = avecPropositions ? guidePricesProposed[c] : undefined;
    const cents = confirme ?? propose;
    if (cents !== undefined) tout[c] = { cents, texte: formatPrice(cents, locale, c), propose: confirme === undefined };
  }
  return tout;
}
