// Offres et prix : seule source pour les montants affichés (jamais de prix en dur dans les pages).
// Les montants facturés restent ceux configurés dans Stripe : garder les deux alignés.

export type Offer = {
  id: string;
  name: string;
  /** Prix en centimes d'euro, TTC. `null` = gratuit. */
  priceCents: number | null;
  billing: 'one-time' | 'monthly' | 'yearly' | 'free';
};

export const guide = {
  id: 'guide',
  name: 'Cycle Awakening — Le Guide',
  priceCents: 2700,
  billing: 'one-time',
  /**
   * Nombre de pages du livre : VARIABLE UNIQUE, utilisée partout (site, FAQ, emails).
   * TODO_ASSET : chiffre réel à confirmer (75 annoncé sur le site, 25 dans une ancienne maquette).
   * Tant que la valeur est `null`, aucun nombre de pages n'est affiché.
   */
  pages: null as number | null,
} satisfies Offer & { pages: number | null };

export const premium = {
  monthly: { id: 'premium-monthly', name: 'Premium', priceCents: 1900, billing: 'monthly' },
  yearly: { id: 'premium-yearly', name: 'Premium', priceCents: 14900, billing: 'yearly' },
} satisfies Record<string, Offer>;

export const starter = { id: 'starter', name: 'Cycle Starter', priceCents: null, billing: 'free' } satisfies Offer;

export function formatPrice(cents: number | null, locale = 'fr-FR'): string {
  if (cents === null) return 'Gratuit';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
