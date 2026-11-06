// Informations légales de l'éditrice. Source unique pour les pages légales et le pied de page.
// Toute valeur commençant par TODO_LEGAL est à fournir : elle s'affiche telle quelle (jamais inventée).
// Voir le skill .claude/skills/pages-legales-fr.

export const legal = {
  /** Passe à true UNIQUEMENT après relecture par un·e juriste, sur décision de l'éditrice. */
  validated: false,
  updatedAt: '2026-11-04',

  /**
   * Prénom et nom de la personne responsable du site. Requis dès que le site collecte des emails
   * (newsletter), même avant toute vente : le RGPD impose d'indiquer qui traite les données.
   */
  controllerName: 'POLYMA LTD',

  editor: {
    name: 'POLYMA LTD',
    legalForm: 'société à responsabilité limitée de droit chypriote (private company limited by shares)',
    legalFormEn: 'private company limited by shares, incorporated in Cyprus',
    address: 'Onisiforou Center, 2nd & 3rd Floor, Neofytou Nikolaidi & Theodorou Kolokotroni, 8011 Paphos, Chypre',
    addressEn: 'Onisiforou Center, 2nd & 3rd Floor, Neofytou Nikolaidi & Theodorou Kolokotroni, 8011 Paphos, Cyprus',
    registration: 'HE494557 (Registrar of Companies, Chypre)',
    registrationEn: 'HE494557 (Registrar of Companies, Cyprus)',
    capital: null as string | null,
    vatNumber: 'CY60370263Y' as string | null,
    /** Mention TVA des CGV : TVA du pays de résidence de la cliente (guichet OSS). À valider avec l'expert-comptable. */
    vatNote: 'TVA applicable selon le pays de résidence de la cliente',
    vatNoteEn: 'VAT charged at the rate of the customer’s country of residence',
    email: 'hello@cycleawakening.com',
    /** Téléphone : obligatoire avant la première vente (droit européen de la consommation). Numéro professionnel conseillé. */
    phone: 'TODO_LEGAL_TELEPHONE',
    /** Personne physique obligatoire (LCEN) : la représentante légale de POLYMA LTD. */
    publicationDirector: 'Emeline Zitte',
  },

  host: {
    name: 'Cloudflare, Inc. (Cloudflare Workers)',
    address: '101 Townsend St, San Francisco, CA 94107, États-Unis',
    phone: '+1 888 993 5273',
    website: 'https://www.cloudflare.com',
  },

  /** Règlement des litiges : réseau des Centres européens des consommateurs (choix de la fondatrice, à valider par un·e juriste). */
  mediator: {
    name: 'Réseau des Centres européens des consommateurs (ECC-Net)',
    nameEn: 'European Consumer Centres Network (ECC-Net)',
    website: 'https://www.eccnet.eu',
  },

  /** Sous-traitants : à tenir à jour AVANT toute mise en service. status : actif | prévu. */
  processors: [
    { name: 'Cloudflare, Inc.', role: 'Hébergement du site, sécurité, réseau de diffusion', location: 'États-Unis / UE', safeguard: 'Data Privacy Framework UE–États-Unis, clauses contractuelles types', status: 'actif' },
    { name: 'Stripe Payments Europe, Ltd.', role: 'Paiement, facturation, gestion des abonnements', location: 'Irlande (UE), transferts possibles vers les États-Unis', safeguard: 'Data Privacy Framework, clauses contractuelles types', status: 'prévu' },
    { name: 'Brevo (Sendinblue SAS)', role: 'Newsletter (double opt-in), emails de livraison', location: 'France (UE)', safeguard: 'Hébergement dans l’UE', status: 'prévu' },
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

/** La société éditrice est connue (nom, adresse, immatriculation) : mentions légales de professionnel. */
export const editorKnown = !isTodo(legal.editor.name) && !isTodo(legal.editor.address) && !isTodo(legal.editor.registration);
