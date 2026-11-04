// Recommandations de la fondatrice (page /recommandations).
//
// RÈGLE D'AFFILIATION (décision du 6 octobre 2026) :
//   - relation « affilie », « partenariat » ou « produit-offert » → étiquette visible sur la fiche
//     + lien en rel="sponsored nofollow" (exigence Google). Un produit reçu gratuitement compte.
//   - relation « aucune » → simple recommandation : lien normal, sans étiquette.
//   - relation « a-confirmer » → fiche jamais visible en production.
// Une fiche n'apparaît en production que si `lien` ET `relation` (≠ a-confirmer) sont renseignés.
// Textes : ressenti personnel uniquement (« ce que j'aime, quand je l'utilise »), aucune allégation santé.
//
// À REMPLIR PAR LA FONDATRICE : `lien` (URL créée par toi, ex. lien d'affiliation) et `relation`.

export type Relation = 'aucune' | 'affilie' | 'partenariat' | 'produit-offert' | 'a-confirmer';

export type Recommandation = {
  marque: string;
  produit: string;
  categorie: 'epicerie' | 'vetements' | 'barefoot' | 'mouvement' | 'rituels';
  texte: string;
  /** Quand je l'utilise (repère personnel, pas une indication). */
  moment: string;
  coupDeCoeur?: boolean;
  lien: string | null;
  relation: Relation;
};

/** Fiches mises de côté, jamais affichées en production tant que la fondatrice n'a pas tranché. */
export type EnAttente = { marque: string; raison: string };

export const categories: Record<Recommandation['categorie'], { titre: string; intro: string }> = {
  epicerie: { titre: 'Épicerie', intro: 'Ce que j’ai dans mes placards pour cuisiner simple en fin de cycle.' },
  vetements: { titre: 'Vêtements & lingerie', intro: 'Les pièces que je porte quand le corps change et que rien ne doit serrer.' },
  barefoot: { titre: 'Chaussures barefoot', intro: 'Pour la marche, ma pratique préférée des jours où l’énergie baisse.' },
  mouvement: { titre: 'Sport & mouvement', intro: 'Le matériel de ma pratique : yoga, Pilates, marche.' },
  rituels: { titre: 'Maison & rituels', intro: 'Les objets de mes soirées calmes, ceux qui me donnent envie de ralentir.' },
};

export const recommandations: Recommandation[] = [
  // Épicerie
  { marque: 'Amoseeds', produit: 'Graines, cacao cru et superaliments', categorie: 'epicerie', texte: 'Graines de courge, cacao cru : ce que j’ajoute à mes bols et à mes goûters. Je les aime parce qu’ils rendent un repas simple plus gourmand.', moment: 'Toute l’année', lien: null, relation: 'a-confirmer' },
  { marque: 'Kazidomi', produit: 'Épicerie bio en ligne', categorie: 'epicerie', texte: 'Mon épicerie en ligne pour les essentiels : graines, purées d’oléagineux, infusions, huiles. Pratique quand je n’ai pas envie de sortir faire les courses.', moment: 'Toute l’année', lien: null, relation: 'a-confirmer' },
  { marque: 'Protéalpes', produit: 'Protéines en poudre sans additifs', categorie: 'epicerie', texte: 'Une liste d’ingrédients courte, que je comprends. J’en ajoute parfois à mon petit-déjeuner les matins où j’ai besoin de quelque chose qui cale.', moment: 'Petit-déjeuner', lien: null, relation: 'a-confirmer' },

  // Vêtements & lingerie
  { marque: 'Ysé', produit: 'Lingerie, homewear et maillots', categorie: 'vetements', coupDeCoeur: true, texte: 'La lingerie que je porte en fin de cycle : rien ne serre, les matières sont douces. Leur homewear est devenu mon uniforme des soirées calmes.', moment: 'Surtout J20–J28', lien: null, relation: 'a-confirmer' },
  { marque: 'Nénés Paris', produit: 'Lingerie pour le corps réel', categorie: 'vetements', texte: 'Des pièces pensées pour le corps tel qu’il est, qui change d’une semaine à l’autre. Confortables et sans artifice.', moment: 'Toute l’année', lien: null, relation: 'a-confirmer' },
  { marque: 'Widding', produit: 'Laine mérinos et homewear', categorie: 'vetements', texte: 'Le mérinos, doux et chaud sans étouffer. Ce que j’enfile les soirs où j’ai besoin de me sentir enveloppée.', moment: 'Soirées J20–J28', lien: null, relation: 'a-confirmer' },
  { marque: 'Sézane', produit: 'Basiques en matières naturelles', categorie: 'vetements', texte: 'Des basiques intemporels dans des matières agréables. Pour les jours où je veux de la douceur sans renoncer au style.', moment: 'Toute l’année', lien: null, relation: 'a-confirmer' },
  { marque: 'Balzac Paris', produit: 'Mode éco-responsable', categorie: 'vetements', texte: 'Des basiques fabriqués en Europe, que je garde longtemps. Pour m’habiller tous les jours du cycle.', moment: 'Toute l’année', lien: null, relation: 'a-confirmer' },
  { marque: 'Chlore', produit: 'Maillots de bain', categorie: 'vetements', texte: 'Pour la natation douce, une de mes pratiques préférées en fin de cycle. Des maillots qui tiennent et qui durent.', moment: 'Natation douce', lien: null, relation: 'a-confirmer' },

  // Barefoot
  { marque: 'Vivobarefoot', produit: 'Running et lifestyle barefoot', categorie: 'barefoot', coupDeCoeur: true, texte: 'La marque qui m’a fait découvrir le barefoot. Semelle très fine, pied libre : ce que je mets pour mes longues marches.', moment: 'Marche', lien: null, relation: 'a-confirmer' },
  { marque: 'Lejean', produit: 'Barefoot du quotidien', categorie: 'barefoot', coupDeCoeur: true, texte: 'Ma paire de tous les jours : élégante, vraiment barefoot, fabriquée en Europe. Celle que je mets le plus souvent.', moment: 'Quotidien', lien: null, relation: 'a-confirmer' },
  { marque: 'Koops', produit: 'Barefoot casual élégant', categorie: 'barefoot', texte: 'Minimalistes et élégantes, pour les occasions où je veux du style sans enfermer mes pieds.', moment: 'Quotidien', lien: null, relation: 'a-confirmer' },
  { marque: 'Wildling Shoes', produit: 'Barefoot artisanal', categorie: 'barefoot', texte: 'Des matières naturelles et un esprit artisanal que j’adore. Pour mes sorties en nature.', moment: 'Marche nature', lien: null, relation: 'a-confirmer' },
  { marque: 'Muris Brand', produit: 'Barefoot au design contemporain', categorie: 'barefoot', texte: 'Une alternative plus urbaine, au design contemporain, pour celles qui veulent passer au barefoot en ville.', moment: 'Quotidien', lien: null, relation: 'a-confirmer' },

  // Sport & mouvement
  { marque: 'Chin Mudra', produit: 'Tapis de yoga éco-responsable', categorie: 'mouvement', coupDeCoeur: true, texte: 'Mon tapis pour les séances lentes de fin de cycle. J’aime sa texture et sa démarche éco-responsable.', moment: 'Yoga doux J24–J28', lien: null, relation: 'a-confirmer' },
  { marque: 'B Yoga', produit: 'Tapis à très bonne adhérence', categorie: 'mouvement', texte: 'Il ne glisse pas, même quand la séance chauffe. Mon tapis pour le Pilates et le yoga plus dynamique.', moment: 'Pilates, yoga dynamique', lien: null, relation: 'a-confirmer' },
  { marque: 'Oko Living', produit: 'Accessoires de yoga naturels', categorie: 'mouvement', texte: 'Bolsters et blocs en matières naturelles. Ce qui rend mes séances de Yin yoga vraiment confortables.', moment: 'Yin yoga', lien: null, relation: 'a-confirmer' },
  { marque: 'Circle Sportswear', produit: 'Vêtements de sport recyclés', categorie: 'mouvement', texte: 'Éco-conçus, confortables, au design épuré. Ce que je porte pour le yoga et le Pilates.', moment: 'Toute l’année', lien: null, relation: 'a-confirmer' },
  { marque: 'Les Actives Paris', produit: 'Sport éco-responsable français', categorie: 'mouvement', texte: 'Une marque française engagée, en matières bio et recyclées. Pour bouger sans renoncer à mes valeurs.', moment: 'Toute l’année', lien: null, relation: 'a-confirmer' },

  // Maison & rituels
  { marque: 'Yoshien', produit: 'Thés et infusions japonais', categorie: 'rituels', coupDeCoeur: true, texte: 'Des thés d’une qualité rare, en direct du Japon. Préparer mon thé est devenu un vrai moment de pause.', moment: 'Matin', lien: null, relation: 'a-confirmer' },
  { marque: 'Sentara Holistic', produit: 'Gua sha et brosse pour le corps', categorie: 'rituels', texte: 'Le gua sha le soir, la brosse le matin : deux petits rituels qui m’obligent à prendre cinq minutes pour moi.', moment: 'Rituels J20–J28', lien: null, relation: 'a-confirmer' },
  { marque: 'Suzanne Kaufmann', produit: 'Huile de bain naturelle', categorie: 'rituels', texte: 'Mon luxe des soirs de fin de cycle : un bain chaud, quelques gouttes, et le téléphone dans une autre pièce.', moment: 'Bain du soir', lien: null, relation: 'a-confirmer' },
  { marque: 'Cosmic Dealer', produit: 'Encens', categorie: 'rituels', texte: 'Une odeur que j’associe au repos : quand je l’allume, mon cerveau comprend que la journée est finie.', moment: 'Rituel du soir', lien: null, relation: 'a-confirmer' },
  { marque: 'Fellow', produit: 'Bouilloire design', categorie: 'rituels', texte: 'Une bouilloire qui donne envie de se faire une infusion. Le rituel du soir commence là.', moment: 'Infusion du soir', lien: null, relation: 'a-confirmer' },
];

/** Mises de côté (jamais en production) : à trancher par la fondatrice.
 * Écartées (décision du 4 novembre 2026) : Dynveo (définitivement), Aurélie Pole (pas de partenariat pour le moment). */
export const enAttente: EnAttente[] = [
  { marque: 'Aime, Nutri&Co (compléments alimentaires)', raison: 'Règle de marque : aucun complément recommandé (comme dans le livre). La fondatrice vérifie sous quelle forme les présenter, sans conflit avec les marques partenaires ou affiliées.' },
  { marque: 'Les Jardins de Gaïa (plantes médicinales)', raison: 'Les plantes ont été retirées des recommandations (décision du 6 octobre). La fondatrice vérifie la forme : marque d’infusions seulement, sans effet annoncé, sans conflit avec les marques partenaires.' },
  { marque: 'Bolster laine et graines, bouillotte graines de lin', raison: 'Référence exacte à retrouver.' },
];

export const libellesRelation: Record<Exclude<Relation, 'aucune' | 'a-confirmer'>, string> = {
  affilie: 'Lien affilié',
  partenariat: 'Partenariat',
  'produit-offert': 'Produit offert',
};
