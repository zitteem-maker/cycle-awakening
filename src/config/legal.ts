// Informations légales de l'éditrice. Source unique pour les pages légales et le pied de page.
// Toute valeur commençant par TODO_LEGAL est à fournir : elle s'affiche telle quelle (jamais inventée).
// Voir le skill .claude/skills/pages-legales-fr.

export const legal = {
  /** Passe à true UNIQUEMENT après relecture par un·e juriste, sur décision de l'éditrice. */
  validated: false,
  updatedAt: '2026-10-06',

  /**
   * Prénom et nom de la personne responsable du site. Requis dès que le site collecte des emails
   * (newsletter), même avant toute vente : le RGPD impose d'indiquer qui traite les données.
   */
  controllerName: 'TODO_LEGAL_PRENOM_NOM',

  editor: {
    name: 'TODO_LEGAL_NOM_OU_RAISON_SOCIALE',
    legalForm: 'TODO_LEGAL_FORME (ex. entreprise individuelle / micro-entreprise, SASU…)',
    address: 'TODO_LEGAL_ADRESSE (ou adresse de domiciliation)',
    registration: 'TODO_LEGAL_SIREN',
    capital: null as string | null,
    vatNumber: null as string | null,
    /** Mention TVA si franchise en base (à confirmer avec l'expert-comptable). */
    vatNote: 'TODO_LEGAL_TVA (ex. « TVA non applicable, art. 293 B du CGI »)',
    email: 'hello@cycleawakening.com',
    phone: 'TODO_LEGAL_TELEPHONE',
    publicationDirector: 'TODO_LEGAL_DIRECTRICE_DE_PUBLICATION',
  },

  host: {
    name: 'Cloudflare, Inc. (service Cloudflare Pages)',
    address: '101 Townsend St, San Francisco, CA 94107, États-Unis',
    phone: 'TODO_LEGAL_VERIFIER_TELEPHONE_HEBERGEUR',
    website: 'https://www.cloudflare.com',
  },

  mediator: {
    name: 'TODO_LEGAL_MEDIATEUR_CONSOMMATION',
    website: 'TODO_LEGAL_SITE_MEDIATEUR',
  },

  /** Sous-traitants : à tenir à jour AVANT toute mise en service. status : actif | prévu. */
  processors: [
    { name: 'Cloudflare, Inc.', role: 'Hébergement du site, sécurité, réseau de diffusion', location: 'États-Unis / UE', safeguard: 'Data Privacy Framework UE–États-Unis, clauses contractuelles types', status: 'actif' },
    { name: 'Stripe Payments Europe, Ltd.', role: 'Paiement, facturation, gestion des abonnements', location: 'Irlande (UE), transferts possibles vers les États-Unis', safeguard: 'Data Privacy Framework, clauses contractuelles types', status: 'prévu' },
    { name: 'TODO_LEGAL_OUTIL_EMAILING (Brevo ou Kit)', role: 'Newsletter, emails de livraison', location: 'TODO', safeguard: 'TODO', status: 'prévu' },
    { name: 'Supabase', role: 'Comptes et données de l\'espace membre', location: 'Région UE à choisir', safeguard: 'TODO', status: 'prévu' },
    { name: 'Anthropic', role: 'Modèle d\'IA de l\'assistante (espace Premium)', location: 'États-Unis', safeguard: 'TODO', status: 'prévu' },
  ],

  /** Âge minimum pour créer un compte ou s'inscrire au quiz. À confirmer. */
  minimumAge: 18,
};

export const isTodo = (value: string | null | undefined) => !value || value.startsWith('TODO_LEGAL');

/**
 * Informations obligatoires AVANT la première vente (et avant d'activer des liens affiliés).
 * Tant qu'il en manque une, le site reste en « pré-lancement » : pas de vente, mentions légales
 * de site non professionnel, CGV non publiées.
 */
export function missingForSales(): string[] {
  const e = legal.editor;
  const required: Record<string, string | null> = {
    'nom ou raison sociale': e.name,
    'statut juridique': e.legalForm,
    adresse: e.address,
    SIREN: e.registration,
    TVA: e.vatNumber ?? e.vatNote,
    téléphone: e.phone,
    'directrice de publication': e.publicationDirector,
    'médiateur de la consommation': legal.mediator.name,
    'site du médiateur': legal.mediator.website,
  };
  return Object.entries(required).filter(([, v]) => isTodo(v)).map(([k]) => k);
}

export const salesReady = missingForSales().length === 0;
