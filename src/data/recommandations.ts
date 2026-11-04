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
// Mise à jour du 4 novembre 2026 : liens vers les sites officiels. Aucune relation commerciale, sauf Sentara Holistic
// (partenariat, code AWAKENING15). « Widding » était une erreur de saisie pour Wildling (déjà présente).
// Restent sans lien : B Yoga (b, halfmoon), Oko Living, Les Actives Paris.

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
  /** Code promo personnel (partenariat), affiché sur la fiche. */
  code?: string;
  /** Avantage associé au code, ex. « -15 % ». */
  remise?: string;
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
  { marque: 'Amoseeds', produit: 'Graines, cacao cru et superaliments', categorie: 'epicerie', texte: 'Graines de courge, cacao cru : ce que j’ajoute à mes bols et à mes goûters. Je les aime parce qu’ils rendent un repas simple plus gourmand.', moment: 'Toute l’année', lien: 'https://www.amoseeds.com/', relation: 'aucune' },
  { marque: 'Kazidomi', produit: 'Épicerie bio en ligne', categorie: 'epicerie', texte: 'Mon épicerie en ligne pour les essentiels : graines, purées d’oléagineux, infusions, huiles. Pratique quand je n’ai pas envie de sortir faire les courses.', moment: 'Toute l’année', lien: 'https://www.kazidomi.com/fr', relation: 'aucune' },
  { marque: 'Protéalpes', produit: 'Protéines en poudre sans additifs', categorie: 'epicerie', texte: 'Une liste d’ingrédients courte, que je comprends. J’en ajoute parfois à mon petit-déjeuner les matins où j’ai besoin de quelque chose qui cale.', moment: 'Petit-déjeuner', lien: 'https://protealpes.com/', relation: 'aucune' },

  // Vêtements & lingerie
  { marque: 'Ysé', produit: 'Lingerie, homewear et maillots', categorie: 'vetements', coupDeCoeur: true, texte: 'La lingerie que je porte en fin de cycle : rien ne serre, les matières sont douces. Leur homewear est devenu mon uniforme des soirées calmes.', moment: 'Surtout J20–J28', lien: 'https://yse-paris.com/', relation: 'aucune' },
  { marque: 'Nénés Paris', produit: 'Lingerie pour le corps réel', categorie: 'vetements', texte: 'Des pièces pensées pour le corps tel qu’il est, qui change d’une semaine à l’autre. Confortables et sans artifice.', moment: 'Toute l’année', lien: 'https://nenes-paris.com/', relation: 'aucune' },
  { marque: 'Sézane', produit: 'Basiques en matières naturelles', categorie: 'vetements', texte: 'Des basiques intemporels dans des matières agréables. Pour les jours où je veux de la douceur sans renoncer au style.', moment: 'Toute l’année', lien: 'https://www.sezane.com/fr', relation: 'aucune' },
  { marque: 'Balzac Paris', produit: 'Mode éco-responsable', categorie: 'vetements', texte: 'Des basiques fabriqués en Europe, que je garde longtemps. Pour m’habiller tous les jours du cycle.', moment: 'Toute l’année', lien: 'https://www.balzac-paris.com/', relation: 'aucune' },
  { marque: 'Chlore', produit: 'Maillots de bain', categorie: 'vetements', texte: 'Pour la natation douce, une de mes pratiques préférées en fin de cycle. Des maillots qui tiennent et qui durent.', moment: 'Natation douce', lien: 'https://www.chlore-swimwear.fr/', relation: 'aucune' },

  // Barefoot
  { marque: 'Vivobarefoot', produit: 'Running et lifestyle barefoot', categorie: 'barefoot', coupDeCoeur: true, texte: 'La marque qui m’a fait découvrir le barefoot. Semelle très fine, pied libre : ce que je mets pour mes longues marches.', moment: 'Marche', lien: 'https://www.vivobarefoot.com/fr', relation: 'aucune' },
  { marque: 'Lejan', produit: 'Barefoot du quotidien', categorie: 'barefoot', coupDeCoeur: true, texte: 'Ma paire de tous les jours : élégante, vraiment barefoot, fabriquée en Europe. Celle que je mets le plus souvent.', moment: 'Quotidien', lien: 'https://lejanbrand.com/', relation: 'aucune' },
  { marque: 'Koops', produit: 'Barefoot casual élégant', categorie: 'barefoot', texte: 'Minimalistes et élégantes, pour les occasions où je veux du style sans enfermer mes pieds.', moment: 'Quotidien', lien: 'https://koopsbrand.com/', relation: 'aucune' },
  { marque: 'Wildling Shoes', produit: 'Barefoot artisanal', categorie: 'barefoot', texte: 'Des matières naturelles et un esprit artisanal que j’adore. Pour mes sorties en nature.', moment: 'Marche nature', lien: 'https://www.wildling.shoes/en/collections/all', relation: 'aucune' },
  { marque: 'Muris Brand', produit: 'Barefoot au design contemporain', categorie: 'barefoot', texte: 'Une alternative plus urbaine, au design contemporain, pour celles qui veulent passer au barefoot en ville.', moment: 'Quotidien', lien: 'https://murisbrand.com/', relation: 'aucune' },

  // Sport & mouvement
  { marque: 'Chin Mudra', produit: 'Tapis de yoga éco-responsable', categorie: 'mouvement', coupDeCoeur: true, texte: 'Mon tapis pour les séances lentes de fin de cycle. J’aime sa texture et sa démarche éco-responsable.', moment: 'Yoga doux J24–J28', lien: 'https://chin-mudra.yoga/', relation: 'aucune' },
  { marque: 'B Yoga', produit: 'Tapis à très bonne adhérence', categorie: 'mouvement', texte: 'Il ne glisse pas, même quand la séance chauffe. Mon tapis pour le Pilates et le yoga plus dynamique.', moment: 'Pilates, yoga dynamique', lien: null, relation: 'aucune' },
  { marque: 'Oko Living', produit: 'Accessoires de yoga naturels', categorie: 'mouvement', texte: 'Bolsters et blocs en matières naturelles. Ce qui rend mes séances de Yin yoga vraiment confortables.', moment: 'Yin yoga', lien: null, relation: 'aucune' },
  { marque: 'Circle Sportswear', produit: 'Vêtements de sport recyclés', categorie: 'mouvement', texte: 'Éco-conçus, confortables, au design épuré. Je les porte pour le yoga, le Pilates et le CrossFit, et même en ville : un top, une chemise oversized par-dessus, et je file prendre un café entre deux rendez-vous les journées bien remplies.', moment: 'Sport et quotidien', lien: 'https://circlesportswear.com/', relation: 'aucune' },
  { marque: 'Les Actives Paris', produit: 'Sport éco-responsable français', categorie: 'mouvement', texte: 'Une marque française engagée, en matières bio et recyclées. Pour bouger sans renoncer à mes valeurs.', moment: 'Toute l’année', lien: null, relation: 'aucune' },

  // Maison & rituels
  { marque: 'Yoshien', produit: 'Thés et infusions japonais', categorie: 'rituels', coupDeCoeur: true, texte: 'Des thés d’une qualité rare, en direct du Japon. Préparer mon thé est devenu un vrai moment de pause.', moment: 'Matin', lien: 'https://www.yoshien.com/fr/', relation: 'aucune' },
  { marque: 'Sentara Holistic', produit: 'Gua sha et brosse pour le corps', categorie: 'rituels', texte: 'Le gua sha le soir, la brosse le matin : deux petits rituels qui m’obligent à prendre cinq minutes pour moi.', moment: 'Rituels J20–J28', lien: 'https://sentaraholistic.com/', relation: 'partenariat', code: 'AWAKENING15', remise: '-15 %' },
  { marque: 'Susanne Kaufmann', produit: 'Huile de bain naturelle', categorie: 'rituels', texte: 'Mon luxe des soirs de fin de cycle : un bain chaud, quelques gouttes, et le téléphone dans une autre pièce.', moment: 'Bain du soir', lien: 'https://www.susannekaufmann.com/fr-fr', relation: 'aucune' },
  { marque: 'Cosmic Dealer', produit: 'Encens, thés et infusions', categorie: 'rituels', coupDeCoeur: true, texte: 'L’après-midi, leur thé blanc au chaï. Le soir, l’infusion aux trois menthes et un bâton d’encens, Summer Pine ou le cérémonial à la cannelle : quand je l’allume, je sais que la journée est finie. Et de temps en temps, un petit coffret de chocolats panachés.', moment: 'Après-midi et soirée', lien: 'https://getcosmicdealer.com/', relation: 'aucune' },
  { marque: 'Fellow', produit: 'Bouilloire design', categorie: 'rituels', texte: 'Une bouilloire qui donne envie de se faire une infusion. Le rituel du soir commence là, et la version connectée le rend encore plus simple : l’eau est prête à la bonne température, sans y penser.', moment: 'Infusion du soir', lien: 'https://fellowproducts.com/', relation: 'aucune' },
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
