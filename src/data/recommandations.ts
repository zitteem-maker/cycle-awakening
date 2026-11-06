// Recommandations de la fondatrice (page /recommandations).
//
// RÈGLE D'AFFILIATION (décision du 6 octobre 2026) :
//   - relation « affilie », « parrainage », « partenariat » ou « produit-offert » → étiquette visible sur la fiche
//     + lien en rel="sponsored nofollow" (exigence Google). Un produit reçu gratuitement compte.
//   - relation « aucune » → simple recommandation : lien normal, sans étiquette.
//   - relation « a-confirmer » → fiche jamais visible en production.
// Une fiche n'apparaît en production que si `lien` ET `relation` (≠ a-confirmer) sont renseignés.
// Textes : ressenti personnel uniquement (« ce que j'aime, quand je l'utilise »), aucune allégation santé.
//
// Mise à jour du 4 novembre 2026 : liens vers les sites officiels. Aucune relation commerciale, sauf Sentara Holistic
// (partenariat, code AWAKENING15) et Susanne Kaufmann (lien de parrainage). « Widding » était une erreur de saisie pour Wildling (déjà présente).
// Restent sans lien : B Yoga (b, halfmoon), Oko Living, Les Actives Paris.

export type Relation = 'aucune' | 'affilie' | 'parrainage' | 'partenariat' | 'produit-offert' | 'a-confirmer';

export type Recommandation = {
  marque: string;
  produit: string;
  categorie: 'epicerie' | 'vetements' | 'barefoot' | 'mouvement' | 'rituels';
  texte: string;
  /** Quand je l'utilise (repère personnel, pas une indication). */
  moment: string;
  coupDeCoeur?: boolean;
  /** Version anglaise (page /en/recommendations) : à tenir à jour avec le texte français. */
  en?: { produit: string; texte: string; moment: string };
  lien: string | null;
  relation: Relation;
  /** Code promo personnel (partenariat), affiché sur la fiche. */
  code?: string;
  /** Avantage associé au code, ex. « -15 % ». */
  remise?: string;
};

/** Fiches mises de côté, jamais affichées en production tant que la fondatrice n'a pas tranché. */
export type EnAttente = { marque: string; raison: string };

export const categoriesEn: Record<Recommandation['categorie'], { titre: string; intro: string }> = {
  epicerie: { titre: 'Pantry', intro: 'What’s in my cupboards to cook simply at the end of my cycle.' },
  vetements: { titre: 'Clothing & lingerie', intro: 'The pieces I wear when my body changes and nothing should squeeze.' },
  barefoot: { titre: 'Barefoot shoes', intro: 'For walking, my favourite activity on days when energy drops.' },
  mouvement: { titre: 'Sport & movement', intro: 'The gear for my practice: yoga, Pilates, walking.' },
  rituels: { titre: 'Body & rituals', intro: 'What takes care of my body and my quiet evenings, the things that make me want to slow down.' },
};

export const categories: Record<Recommandation['categorie'], { titre: string; intro: string }> = {
  epicerie: { titre: 'Épicerie', intro: 'Ce que j’ai dans mes placards pour cuisiner simple en fin de cycle.' },
  vetements: { titre: 'Vêtements & lingerie', intro: 'Les pièces que je porte quand le corps change et que rien ne doit serrer.' },
  barefoot: { titre: 'Chaussures barefoot', intro: 'Pour la marche, ma pratique préférée des jours où l’énergie baisse.' },
  mouvement: { titre: 'Sport & mouvement', intro: 'Le matériel de ma pratique : yoga, Pilates, marche.' },
  rituels: { titre: 'Corps & rituels', intro: 'Ce qui prend soin de mon corps et de mes soirées calmes, ce qui me donne envie de ralentir.' },
};

export const recommandations: Recommandation[] = [
  // Épicerie
  { marque: 'Amoseeds', produit: 'Graines, cacao cru et superaliments', categorie: 'epicerie', texte: 'Graines de courge, cacao cru : ce que j’ajoute à mes bols et à mes goûters. Je les aime parce qu’ils rendent un repas simple plus gourmand.', moment: 'Toute l’année', lien: 'https://www.amoseeds.com/', relation: 'aucune', en: { produit: 'Seeds, raw cacao and superfoods', texte: 'Pumpkin seeds, raw cacao: what I add to my bowls and snacks. I love them because they make a simple meal more indulgent.', moment: 'All year round' } },
  { marque: 'Kazidomi', produit: 'Épicerie bio en ligne', categorie: 'epicerie', texte: 'Mon épicerie en ligne pour les essentiels : graines, purées d’oléagineux, infusions, huiles. Pratique quand je n’ai pas envie de sortir faire les courses.', moment: 'Toute l’année', lien: 'https://www.kazidomi.com/fr', relation: 'aucune', en: { produit: 'Organic online grocery', texte: 'My online grocery store for the essentials: seeds, nut butters, infusions, oils. Handy when I don’t feel like going out shopping.', moment: 'All year round' } },
  { marque: 'Protéalpes', produit: 'Protéines en poudre sans additifs', categorie: 'epicerie', texte: 'Une liste d’ingrédients courte, que je comprends. J’en ajoute parfois à mon petit-déjeuner les matins où j’ai besoin de quelque chose qui cale.', moment: 'Petit-déjeuner', lien: 'https://protealpes.com/', relation: 'aucune', en: { produit: 'Additive-free protein powder', texte: 'A short ingredient list that I understand. I sometimes add it to my breakfast on mornings when I need something filling.', moment: 'Breakfast' } },

  // Vêtements & lingerie
  { marque: 'Ysé', produit: 'Lingerie, homewear et maillots', categorie: 'vetements', coupDeCoeur: true, texte: 'La lingerie que je porte en fin de cycle : rien ne serre, les matières sont douces. Leur homewear est devenu mon uniforme des soirées calmes.', moment: 'Surtout J20–J28', lien: 'https://yse-paris.com/', relation: 'aucune', en: { produit: 'Lingerie, loungewear and swimwear', texte: 'The lingerie I wear at the end of my cycle: nothing squeezes, the fabrics are soft. Their loungewear has become my uniform for quiet evenings.', moment: 'Especially D20–D28' } },
  { marque: 'Nénés Paris', produit: 'Lingerie pour le corps réel', categorie: 'vetements', texte: 'Des pièces pensées pour le corps tel qu’il est, qui change d’une semaine à l’autre. Confortables et sans artifice.', moment: 'Toute l’année', lien: 'https://nenes-paris.com/', relation: 'aucune', en: { produit: 'Lingerie for real bodies', texte: 'Pieces designed for the body as it is, changing from one week to the next. Comfortable and unpretentious.', moment: 'All year round' } },
  { marque: 'Sézane', produit: 'Basiques en matières naturelles', categorie: 'vetements', texte: 'Des basiques intemporels dans des matières agréables. Pour les jours où je veux de la douceur sans renoncer au style.', moment: 'Toute l’année', lien: 'https://www.sezane.com/fr', relation: 'aucune', en: { produit: 'Basics in natural fabrics', texte: 'Timeless basics in lovely fabrics. For days when I want softness without giving up on style.', moment: 'All year round' } },
  { marque: 'Balzac Paris', produit: 'Mode éco-responsable', categorie: 'vetements', texte: 'Des basiques fabriqués en Europe, que je garde longtemps. Pour m’habiller tous les jours du cycle.', moment: 'Toute l’année', lien: 'https://www.balzac-paris.com/', relation: 'aucune', en: { produit: 'Eco-conscious fashion', texte: 'Basics made in Europe that I keep for a long time. To get dressed every day of the cycle.', moment: 'All year round' } },
  { marque: 'Chlore', produit: 'Maillots de bain', categorie: 'vetements', texte: 'Pour la natation douce, une de mes pratiques préférées en fin de cycle. Des maillots qui tiennent et qui durent.', moment: 'Natation douce', lien: 'https://www.chlore-swimwear.fr/', relation: 'aucune', en: { produit: 'Swimwear', texte: 'For gentle swimming, one of my favourite activities at the end of my cycle. Swimsuits that hold up and last.', moment: 'Gentle swimming' } },

  // Barefoot
  { marque: 'Vivobarefoot', produit: 'Running et lifestyle barefoot', categorie: 'barefoot', coupDeCoeur: true, texte: 'La marque qui m’a fait découvrir le barefoot. Semelle très fine, pied libre : ce que je mets pour mes longues marches.', moment: 'Marche', lien: 'https://www.vivobarefoot.com/fr', relation: 'aucune', en: { produit: 'Barefoot running and lifestyle', texte: 'The brand that introduced me to barefoot shoes. A very thin sole, free feet: what I wear for long walks.', moment: 'Walking' } },
  { marque: 'Lejan', produit: 'Barefoot du quotidien', categorie: 'barefoot', coupDeCoeur: true, texte: 'Ma paire de tous les jours : élégante, vraiment barefoot, fabriquée en Europe. Celle que je mets le plus souvent.', moment: 'Quotidien', lien: 'https://lejanbrand.com/', relation: 'aucune', en: { produit: 'Everyday barefoot shoes', texte: 'My everyday pair: elegant, truly barefoot, made in Europe. The one I wear most often.', moment: 'Every day' } },
  { marque: 'Koops', produit: 'Barefoot casual élégant', categorie: 'barefoot', texte: 'Minimalistes et élégantes, pour les occasions où je veux du style sans enfermer mes pieds.', moment: 'Quotidien', lien: 'https://koopsbrand.com/', relation: 'aucune', en: { produit: 'Elegant casual barefoot', texte: 'Minimalist and elegant, for occasions when I want style without boxing in my feet.', moment: 'Every day' } },
  { marque: 'Wildling Shoes', produit: 'Barefoot artisanal', categorie: 'barefoot', texte: 'Des matières naturelles et un esprit artisanal que j’adore. Pour mes sorties en nature.', moment: 'Marche nature', lien: 'https://www.wildling.shoes/en/collections/all', relation: 'aucune', en: { produit: 'Handcrafted barefoot shoes', texte: 'Natural materials and a handcrafted spirit that I love. For my outings in nature.', moment: 'Nature walks' } },
  { marque: 'Muris Brand', produit: 'Barefoot au design contemporain', categorie: 'barefoot', texte: 'Une alternative plus urbaine, au design contemporain, pour celles qui veulent passer au barefoot en ville.', moment: 'Quotidien', lien: 'https://murisbrand.com/', relation: 'aucune', en: { produit: 'Contemporary barefoot design', texte: 'A more urban alternative, with a contemporary design, for anyone who wants to go barefoot in the city.', moment: 'Every day' } },

  // Sport & mouvement
  { marque: 'Chin Mudra', produit: 'Tapis de yoga éco-responsable', categorie: 'mouvement', coupDeCoeur: true, texte: 'Mon tapis pour les séances lentes de fin de cycle. J’aime sa texture et sa démarche éco-responsable.', moment: 'Yoga doux J24–J28', lien: 'https://chin-mudra.yoga/', relation: 'aucune', en: { produit: 'Eco-conscious yoga mat', texte: 'My mat for slow end-of-cycle sessions. I love its texture and its eco-conscious approach.', moment: 'Gentle yoga D24–D28' } },
  { marque: 'B Yoga', produit: 'Tapis à très bonne adhérence', categorie: 'mouvement', texte: 'Il ne glisse pas, même quand la séance chauffe. Mon tapis pour le Pilates et le yoga plus dynamique.', moment: 'Pilates, yoga dynamique', lien: null, relation: 'aucune', en: { produit: 'Mat with excellent grip', texte: 'It doesn’t slip, even when the session heats up. My mat for Pilates and more dynamic yoga.', moment: 'Pilates, dynamic yoga' } },
  { marque: 'Oko Living', produit: 'Accessoires de yoga naturels', categorie: 'mouvement', texte: 'Bolsters et blocs en matières naturelles. Ce qui rend mes séances de Yin yoga vraiment confortables.', moment: 'Yin yoga', lien: null, relation: 'aucune', en: { produit: 'Natural yoga props', texte: 'Bolsters and blocks in natural materials. What makes my Yin yoga sessions truly comfortable.', moment: 'Yin yoga' } },
  { marque: 'Circle Sportswear', produit: 'Vêtements de sport recyclés', categorie: 'mouvement', texte: 'Éco-conçus, confortables, au design épuré. Je les porte pour le yoga, le Pilates et le CrossFit, et même en ville : un top, une chemise oversized par-dessus, et je file prendre un café entre deux rendez-vous les journées bien remplies.', moment: 'Sport et quotidien', lien: 'https://circlesportswear.com/', relation: 'aucune', en: { produit: 'Recycled sportswear', texte: 'Eco-designed, comfortable, with a clean design. I wear them for yoga, Pilates and CrossFit, and even around town: a top, an oversized shirt on top, and I head off for a coffee between two meetings on busy days.', moment: 'Sport and everyday' } },
  { marque: 'Les Actives Paris', produit: 'Sport éco-responsable français', categorie: 'mouvement', texte: 'Une marque française engagée, en matières bio et recyclées. Pour bouger sans renoncer à mes valeurs.', moment: 'Toute l’année', lien: null, relation: 'aucune', en: { produit: 'French eco-conscious sportswear', texte: 'A committed French brand, in organic and recycled materials. To move without giving up on my values.', moment: 'All year round' } },

  // Maison & rituels
  { marque: 'Yoshien', produit: 'Thés et infusions japonais', categorie: 'rituels', coupDeCoeur: true, texte: 'Des thés d’une qualité rare, en direct du Japon. Préparer mon thé est devenu un vrai moment de pause.', moment: 'Matin', lien: 'https://www.yoshien.com/fr/', relation: 'aucune', en: { produit: 'Japanese teas and infusions', texte: 'Teas of rare quality, straight from Japan. Preparing my tea has become a real moment of pause.', moment: 'Morning' } },
  { marque: 'Sentara Holistic', produit: 'Gua sha et brosse pour le corps', categorie: 'rituels', texte: 'Le gua sha le soir, la brosse le matin : deux petits rituels qui m’obligent à prendre cinq minutes pour moi.', moment: 'Rituels J20–J28', lien: 'https://sentaraholistic.com/', relation: 'partenariat', code: 'AWAKENING15', remise: '-15 %', en: { produit: 'Gua sha and body brush', texte: 'Gua sha in the evening, the brush in the morning: two small rituals that make me take five minutes for myself.', moment: 'Rituals D20–D28' } },
  { marque: 'Susanne Kaufmann', produit: 'Huile de bain naturelle', categorie: 'rituels', texte: 'Mon luxe des soirs de fin de cycle : un bain chaud, quelques gouttes, et le téléphone dans une autre pièce.', moment: 'Bain du soir', lien: 'https://prz.io/3pmm9Z2Hy', relation: 'parrainage', en: { produit: 'Natural bath oil', texte: 'My end-of-cycle evening luxury: a hot bath, a few drops, and my phone in another room.', moment: 'Evening bath' } },
  { marque: 'Cosmic Dealer', produit: 'Encens, thés et infusions', categorie: 'rituels', coupDeCoeur: true, texte: 'L’après-midi, leur thé blanc au chaï. Le soir, l’infusion aux trois menthes et un bâton d’encens, Summer Pine ou le cérémonial à la cannelle : quand je l’allume, je sais que la journée est finie. Et de temps en temps, un petit coffret de chocolats panachés.', moment: 'Après-midi et soirée', lien: 'https://getcosmicdealer.com/', relation: 'aucune', en: { produit: 'Incense, teas and infusions', texte: 'In the afternoon, their white chai tea. In the evening, the three-mint infusion and an incense stick, Summer Pine or the ceremonial cinnamon one: when I light it, I know the day is over. And every now and then, a little box of assorted chocolates.', moment: 'Afternoon and evening' } },
  // Goop : candidature affiliée en cours (4 nov.) ; simple recommandation en attendant (passer en « affilie » si acceptée).
  { marque: 'Goop', produit: 'Rituels du corps et récupération', categorie: 'rituels', texte: 'La brosse Ultimate Dry Brush avant le sauna, ou avant une douche bien chaude quand je suis pressée. Le Theragun de Therabody pour mes jambes et mes bras après le sport, et le bonnet de sauna. Des objets qui transforment dix minutes en vrai rituel.', moment: 'Sauna, douche, récupération', lien: 'https://goop.com/', relation: 'aucune', en: { produit: 'Body rituals and recovery', texte: 'The Ultimate Dry Brush before the sauna, or before a really hot shower when I’m in a hurry. The Therabody Theragun for my legs and arms after exercise, and the sauna hat. Objects that turn ten minutes into a real ritual.', moment: 'Sauna, shower, recovery' } },
  { marque: 'Fellow', produit: 'Bouilloire design', categorie: 'rituels', texte: 'Une bouilloire qui donne envie de se faire une infusion. Le rituel du soir commence là, et la version connectée le rend encore plus simple : l’eau est prête à la bonne température, sans y penser.', moment: 'Infusion du soir', lien: 'https://fellowproducts.com/', relation: 'aucune', en: { produit: 'Design kettle', texte: 'A kettle that makes you want to make an infusion. The evening ritual starts there, and the connected version makes it even simpler: the water is ready at the right temperature, without thinking about it.', moment: 'Evening infusion' } },
];

/** Mises de côté (jamais en production) : à trancher par la fondatrice.
 * Écartées (décision du 4 novembre 2026) : Dynveo (définitivement), Aurélie Pole (pas de partenariat pour le moment). */
export const enAttente: EnAttente[] = [
  { marque: 'Aime, Nutri&Co (compléments alimentaires)', raison: 'Règle de marque : aucun complément recommandé (comme dans le livre). La fondatrice vérifie sous quelle forme les présenter, sans conflit avec les marques partenaires ou affiliées.' },
  { marque: 'Les Jardins de Gaïa (plantes médicinales)', raison: 'Les plantes ont été retirées des recommandations (décision du 6 octobre). La fondatrice vérifie la forme : marque d’infusions seulement, sans effet annoncé, sans conflit avec les marques partenaires.' },
  { marque: 'Bolster laine et graines, bouillotte graines de lin', raison: 'Référence exacte à retrouver.' },
];

/** Identifiant court d'une marque pour son lien de redirection : « Sentara Holistic » → « sentara-holistic ». */
export const slugMarque = (m: string) => m.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, 'et').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Fiche commerciale (affiliation, parrainage, partenariat, produit offert) : lien affiché via /go/<marque>. */
export const estCommerciale = (r: Recommandation) => r.relation !== 'aucune' && r.relation !== 'a-confirmer';

/**
 * Liens de redirection des fiches commerciales : https://cycleawakening.com/go/<marque> → lien d'affiliation.
 * Écrits dans dist/_redirects au build (astro.config.mjs). Un seul endroit à changer si un lien d'affiliation change.
 */
export const redirections = () =>
  recommandations.filter((r) => r.lien && estCommerciale(r)).map((r) => ({ de: `/go/${slugMarque(r.marque)}`, vers: r.lien as string }));

export const libellesRelationEn: Record<Exclude<Relation, 'aucune' | 'a-confirmer'>, string> = {
  affilie: 'Affiliate link',
  parrainage: 'Referral link',
  partenariat: 'Partnership',
  'produit-offert': 'Gifted product',
};

export const libellesRelation: Record<Exclude<Relation, 'aucune' | 'a-confirmer'>, string> = {
  affilie: 'Lien affilié',
  parrainage: 'Lien de parrainage',
  partenariat: 'Partenariat',
  'produit-offert': 'Produit offert',
};
