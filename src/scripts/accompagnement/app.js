// Programme « Rythme & Assiette » : interface de l'espace accompagnement.
// Généré à partir du prototype, puis maintenu ici. Les contenus viennent de src/data/accompagnement/programme.json.
import DATA from '../../data/accompagnement/programme.json';

/** @param {{get:(k:string)=>string|null,set:(k:string,v:string)=>void}} store */
export function runApp(store) {



const SESSIONS = {
  crossfit:{name:"CrossFit",when:"Lundi, mercredi, jeudi 6h30 · dimanche en option",short:"Force et puissance, la technique avant la charge.",
    why:"Trois séances en semaine, avec un seul enchaînement (mercredi, jeudi) : le jeudi, la technique passe avant la charge. Le dimanche est une 4e séance pour les semaines où tu as de l'énergie. L'objectif est une force propre et en pleine amplitude, pas le volume des cuisses.",
    blocks:[
      {h:"Pendant la séance",ex:[
        ["Technique avant la charge","Toujours","Tu ne montes la charge que si le mouvement est propre."],
        ["Jambes : charges modérées","2–3 reps en réserve","Squats, thrusters, wall balls : pleine amplitude, sans chercher à monter les kilos ce mois-ci."],
        ["Gymnastique","Ta priorité","Tractions, gainage, handstand, toes-to-bar : c'est là que se construit la ligne de danseuse."],
        ["Fatiguée ou très gonflée","Version allégée","Même séance, charges réduites, rythme plus doux."]]},
      {h:"Juste après",ex:[
        ["Bloc tractions","10 min · lundi et vendredi","Voir la séance Tractions."],
        ["Mobilité ou yin","5 à 15 min","Hanches, ischios, épaules."],
        ["Récupération","Dans l'heure","Banane ferme, café, shaker whey isolate (1 dose), puis un vrai petit-déjeuner."]]}
    ]},
  tractions:{name:"Tractions",when:"Lundi et jeudi · 10 min après le CrossFit",short:"Vers ta première traction et le front support.",
    why:"Deux blocs courts par semaine. Une première traction stricte arrive souvent en 2 à 4 mois.",
    blocks:[{h:"Le bloc",ex:[
      ["Suspension active","3 × 20–30 s","Épaules engagées, loin des oreilles."],
      ["Tirages scapulaires","3 × 6–8","Bras tendus, tu tires seulement avec les omoplates."],
      ["Négatives","3 × 3","Menton au-dessus de la barre avec une box, descente en 3 à 5 s."],
      ["Maintien menton au-dessus de la barre","3 × 10–15 s",""],
      ["Front support","3 × 10–20 s","Monte avec une box, bras verrouillés au-dessus de la barre, corps gainé."]]}],
    tips:["Progression : quand les négatives durent 5 s sans effort, passe à 3 × 4."]},
  pilates:{name:"Pilates au tapis",when:"Mardi et samedi · maison · 45 min",short:"Centre, fessiers, dos, et le bloc taille fine.",
    why:"La séance la plus utile pour une silhouette de danseuse : elle muscle sans volume, affine la taille et redresse la posture. Mouvements lents : 3 secondes pour monter, 3 pour descendre.",
    blocks:[
      {h:"Échauffement",d:"5 min",ex:[
        ["Respiration latérale, allongée","5 respirations","Les côtes s'ouvrent sur les côtés, le ventre reste doux."],
        ["Bascule du bassin","10","Le bas du dos s'imprime au sol, puis relâche."],
        ["Chat-vache","8","Vertèbre par vertèbre."],
        ["Enroulé debout (roll down)","5","Menton vers la poitrine, on déroule lentement."]]},
      {h:"Centre",d:"10 min",ex:[
        ["Hundred, jambes en table","100 battements","Inspire sur 5, expire sur 5. Tête posée si la nuque tire."],
        ["Single leg stretch","10 par côté","Le bas du dos reste au sol."],
        ["Criss-cross","8 par côté","La rotation vient des côtes, pas des coudes."],
        ["Toe taps","10 par côté","Bassin immobile, expire en descendant le pied."],
        ["Dead bug","8 par côté","Bras et jambe opposés, lentement."]]},
      {h:"Fessiers et cuisses en longueur",d:"10 min",ex:[
        ["Pont articulé","10","Monte vertèbre par vertèbre, tiens 2 s en haut."],
        ["Pont sur une jambe","8 par côté","Bassin bien horizontal."],
        ["Couchée sur le côté : clam","15 par côté","Pieds joints, ouvre le genou sans rouler le bassin."],
        ["Couchée sur le côté : jambe tendue","15 par côté","Pied flex, jambe un peu en arrière, monte de 20 cm seulement."],
        ["Couchée sur le côté : petits cercles","10 dans chaque sens","Mouvement petit et contrôlé, jambe longue."],
        ["Extension de hanche à quatre pattes","12 par côté","Talon vers le plafond, sans cambrer."]]},
      {h:"Dos et posture",d:"6 min",ex:[
        ["Swan prep","8","Allonge le sternum vers l'avant avant de monter."],
        ["Swimming","3 × 20 s","Bras et jambes longs, petits battements."],
        ["Planche latérale sur genou","20–30 s par côté","Hanches hautes, épaule loin de l'oreille."],
        ["Planche avec tapes d'épaule","10 par côté","Bassin immobile."]]},
      {h:"Taille fine",d:"10 min",ex:[
        ["Vacuum","3 × 20 s","Rentre le ventre à fond en expirant, tiens. Idéalement à jeun : c'est le transverse qui aplatit le ventre au repos."],
        ["Dead bug","2 × 8 par côté","Bas du dos collé au sol, bras et jambe opposés, lentement."],
        ["Relevés de jambes au sol","2 × 10","Descente lente sur 3 s, sans décoller le bas du dos : bas des abdos."],
        ["Gainage latéral","2 × 30 s par côté","Hanches hautes. Obliques sans volume."],
        ["Pallof press à l'élastique","2 × 10 par côté","Élastique attaché sur le côté, bras tendus devant : tu résistes à la rotation."],
        ["Relevés de genoux suspendue","2 × 8","À la barre, ou à la salle après le CrossFit si tu n'as pas de barre. Bas du ventre et préhension."]]},
      {h:"Retour au calme",d:"4 min",ex:[
        ["Torsion assise","5 par côté",""],
        ["Mermaid","4 par côté","Ouvre tout le flanc."],
        ["Posture de l'enfant","1 min",""],
        ["Figure 4 allongée","45 s par côté",""]]}
    ],
    tips:["Semaines 3 et 4 : 3 séries de swimming, un élastique au-dessus des genoux pour la série couchée, hundred jambes tendues à 45°.",
          "Ventre très gonflé ce jour-là : remplace les blocs Centre et Taille fine par 5 min de respiration et de bascule du bassin."]},
  vinyasa:{name:"Vinyasa",when:"Vendredi · maison · 45 à 60 min",short:"Mobilité active et ligne longue.",
    why:"Une vraie séance le vendredi, à la maison, sans CrossFit avant : tu peux aller plus loin en amplitude et en équilibres. Le samedi doux suit. Studio une fois par mois si tu en as envie.",
    blocks:[{h:"Ce qu'il faut privilégier",ex:[
      ["Slow flow ou niveau intermédiaire","Plutôt que power ou hot","Surtout en fin de cycle, quand la chaleur fatigue et fait gonfler."],
      ["Hanches et ischios","Fentes, lézard, pyramide","Ce que le CrossFit raccourcit."],
      ["Épaules et colonne thoracique","Chiot, dauphin, ouvertures","Prépare tes mouvements au-dessus de la tête et le front support."],
      ["Souplesse active","Engage le muscle étiré","Tu soulèves et tu allonges au lieu de t'affaisser : c'est ce qui donne une ligne longue et tonique."],
      ["Chaturangas","Avec contrôle","Genoux au sol si les épaules sont fatiguées du jeudi."],
      ["Savasana complet","5 min","C'est de la récupération, pas du temps perdu."]]}],
    tips:["Fatiguée : remplace-le par 15 min de yin.","Bois bien après, et mange dans l'heure."]},
  yin:{name:"Yin",when:"Après chaque CrossFit · mardi soir · 30 min le jeudi · dimanche",short:"Relâcher hanches et dos après la séance.",
    why:"Postures tenues, sans effort, à 60–70 % de ton amplitude. Respiration lente par le nez.",
    blocks:[{h:"La séquence",ex:[
      ["Papillon","2 min","Dos arrondi, tête lourde."],
      ["Dragon (fente basse)","1 min par côté","Genou arrière posé."],
      ["Demi-pigeon ou figure 4","1 min par côté",""],
      ["Melting heart (chiot)","1 min","Ouvre les épaules."],
      ["Torsion allongée","1 min par côté",""],
      ["Jambes au mur","3 min","Dégonfle les jambes."]]}]},
  mobilite:{name:"Mobilité",when:"Quand tu te sens raide · 15 min",short:"Si tu te sens raide.",
    why:"Pas obligatoire. Seulement si le corps la demande.",
    blocks:[{h:"La séquence",ex:[
      ["Hanches en 90/90","1 min par côté","Change de côté en gardant le dos long."],
      ["Livre ouvert (thoracique)","8 par côté","Couchée sur le côté, le bras s'ouvre et le regard suit."],
      ["Passages d'épaules au bâton ou à l'élastique","10","Prise large, sans forcer."],
      ["Squat profond assisté","1 min","Tiens-toi à un montant de porte."],
      ["Ischios à la sangle","1 min par côté",""],
      ["Chat-vache","8",""]]}]},
  marche:{name:"Marche du matin",when:"Mardi et vendredi 6h15 → 7h/7h30 · balade le week-end",short:"Puis café avec Grégoire à la plage.",
    why:"Elle aide à perdre de la graisse sans creuser l'appétit ni ajouter d'inflammation, et elle relance la digestion.",
    blocks:[{h:"Comment",ex:[
      ["Rythme","Tu peux parler","Pas besoin d'essouffler."],
      ["Posture","Long et léger","Épaules basses, regard loin, bras qui balancent."],
      ["Si tu as faim au réveil","½ banane ferme ou 1 kiwi",""],
      ["Au retour","Petit-déjeuner","Voir l'onglet Assiette."]]}],
    tips:["Les autres jours : 15 à 20 min de marche après le déjeuner, et 10 min debout après le dîner."]},
  tennis:{name:"Tennis",when:"Lundi · dimanche matin",short:"Technique et plaisir.",
    why:"Au niveau actuel, c'est surtout du jeu technique. On le garde léger.",
    blocks:[{h:"Repères",ex:[
      ["Hydratation","500 ml pendant l'heure",""],
      ["Dimanche","Au max ou chill","Entre le tennis et la suite : eau et ½ banane ferme."],
      ["Après","5 min d'étirements","Épaules, avant-bras, mollets."]]}]},
  epaules:{name:"Épaules fines et dos dessiné",when:"Le soir · 25 min · 2 fois par semaine",short:"Posture de danseuse, mi-engagement, mi-détente.",
    why:"Des épaules fines et un dos dessiné viennent surtout d'une posture ouverte et d'un taux de masse grasse modéré. Ces exercices tonifient le milieu et le bas des trapèzes et les rhomboïdes, sans muscler le haut des épaules. Pas de charge, transitions lentes : on finit au sol pour dormir.",
    blocks:[
      {h:"Réveil de la posture",d:"4 min",ex:[
        ["Chat-vache","8 respirations","Insiste sur l'écart et le rapprochement des omoplates."],
        ["Fil de l'aiguille","5 respirations par côté","Ouvre le haut du dos."]]},
      {h:"Engagement",d:"10 min · 2 tours",ex:[
        ["Swan prep (cobra pilates)","8","Allonge le sternum vers l'avant, les épaules glissent vers le bas du dos. L'exercice clé de la posture."],
        ["T à plat ventre","8","Front posé, bras en croix, pouces vers le plafond : décolle les bras de 5 cm en serrant légèrement les omoplates."],
        ["Y à plat ventre","8","Même chose, bras en Y. Le cou reste long."],
        ["Swimming","20 s","Bras et jambes longs, petits battements."],
        ["Dolphin ou chien tête en bas","5 respirations","Repousse le sol, les épaules loin des oreilles."],
        ["Wall angels contre un mur","8, très lents","Bas du dos, arrière du crâne et bras collés au mur."]]},
      {h:"Détente au sol",d:"10 min",ex:[
        ["Posture de l'enfant bras longs","1 min + 30 s par côté","Décale les mains d'un côté puis de l'autre : étirement des dorsaux."],
        ["Melting heart (chiot)","1 min 30",""],
        ["Torsion allongée","1 min par côté","Bras en croix."],
        ["Ouverture de poitrine sur coussin","2 à 3 min","Coussin ou bloc sous les omoplates, bras en cactus, respiration par le nez."],
        ["Respiration 4-6","1 min","Inspire sur 4 temps, expire sur 6 : prépare le sommeil."]]}
    ],
    tips:["Arrête si une épaule pince.","La régularité compte plus que l'intensité : refais le bloc Engagement deux fois par semaine."]},
  ashtangaA:{name:"Ashtanga · Série A",when:"75 à 90 min · ou version courte 45 min",short:"Première série (Yoga Chikitsa), dans l'ordre traditionnel.",
    why:"La série primaire, toujours dans le même ordre : 5 respirations ujjayi par posture, regard (drishti) fixe, bandhas engagés, demi-vinyasa entre les postures assises. Version courte : salutations, postures debout, puis directement la séquence de fin.",
    blocks:[
      {h:"Salutations",d:"10 min",ex:[
        ["Surya Namaskara A","5 fois","Une respiration par mouvement, 5 respirations en chien tête en bas."],
        ["Surya Namaskara B","3 à 5 fois","Avec Utkatasana et Virabhadrasana I des deux côtés."]]},
      {h:"Postures debout",d:"20 min",ex:[
        ["Padangusthasana · Padahastasana","5 + 5",""],
        ["Utthita et Parivrtta Trikonasana","5 par côté chacune",""],
        ["Utthita et Parivrtta Parsvakonasana","5 par côté chacune",""],
        ["Prasarita Padottanasana A, B, C, D","5 chacune",""],
        ["Parsvottanasana","5 par côté","Mains en prière dans le dos, ou coudes tenus."],
        ["Utthita Hasta Padangusthasana","5 par étape et par côté","Garde la jambe pliée si besoin."],
        ["Ardha Baddha Padmottanasana","5 par côté","Sans lotus si le genou proteste : pied posé sur la cuisse ou au sol."],
        ["Utkatasana · Virabhadrasana I et II","5 chacune","Enchaînées avec le vinyasa."]]},
      {h:"Postures assises",d:"35 min",ex:[
        ["Dandasana · Paschimottanasana A, B, C","5 chacune",""],
        ["Purvottanasana","5",""],
        ["Ardha Baddha Padma Paschimottanasana","5 par côté","Sans demi-lotus si besoin."],
        ["Tiriang Mukha Ekapada Paschimottanasana","5 par côté",""],
        ["Janu Sirsasana A, B, C","5 par côté chacune","C : seulement si le genou est à l'aise."],
        ["Marichyasana A, B, C, D","5 par côté chacune","B et D demandent le demi-lotus : garde la variante jambe croisée."],
        ["Navasana","5 fois 5 respirations","Avec un appui sur les mains entre chaque."],
        ["Bhujapidasana · Kurmasana · Supta Kurmasana","5 chacune","Fais ce qui vient, sans forcer les épaules."],
        ["Garbha Pindasana · Kukkutasana","5","Avec lotus seulement."],
        ["Baddha Konasana · Upavistha Konasana · Supta Konasana","5 chacune",""],
        ["Supta Padangusthasana · Ubhaya Padangusthasana · Urdhva Mukha Paschimottanasana","5 chacune",""],
        ["Setu Bandhasana","5","Douce pour la nuque : appui sur les mains si besoin."]]},
      {h:"Fin de pratique",d:"15 min",ex:[
        ["Urdhva Dhanurasana","3 fois 5 respirations","Ou pont, puis Paschimottanasana 10 respirations."],
        ["Salamba Sarvangasana · Halasana · Karnapidasana","10 · 8 · 8","Couverture pliée sous les épaules."],
        ["Urdhva Padmasana · Pindasana · Matsyasana · Uttana Padasana","8 chacune",""],
        ["Sirsasana","15 respirations","Seulement si tu le pratiques déjà ; sinon chien tête en bas."],
        ["Baddha Padmasana · Yoga Mudra · Padmasana · Utpluthih","10 chacune","Demi-lotus ou tailleur si besoin."],
        ["Savasana","5 à 10 min",""]]}
    ],
    tips:["Après le CrossFit, préfère la version courte.","En fin de cycle ou si tu es très fatiguée : salutations, postures debout et fin de pratique seulement."]},
  ashtangaB:{name:"Ashtanga · Série B",when:"75 à 90 min",short:"Deuxième série (Nadi Shodhana) : flexions arrière et ouverture des hanches.",
    why:"La série intermédiaire s'apprend traditionnellement pas à pas, une fois la série A installée. Fais les postures que tu maîtrises et arrête-toi avant les plus avancées (Kapotasana, jambe derrière la tête, Karandavasana). Mêmes règles : 5 respirations, drishti, bandhas, demi-vinyasa.",
    blocks:[
      {h:"Ouverture",d:"25 min",ex:[
        ["Surya Namaskara A et B","5 et 3 à 5",""],
        ["Postures debout de la série A","5 chacune","Jusqu'à Parsvottanasana, comme le veut la tradition."]]},
      {h:"Flexions arrière et torsions",d:"25 min",ex:[
        ["Pasasana","5 par côté","Talons sur un tapis roulé si besoin."],
        ["Krounchasana","5 par côté",""],
        ["Shalabhasana A et B","5 chacune","Excellent pour le dos dessiné."],
        ["Bhekasana · Dhanurasana · Parsva Dhanurasana","5 chacune",""],
        ["Ustrasana · Laghu Vajrasana","5 chacune","Laghu Vajrasana : seulement si Ustrasana est confortable."],
        ["Kapotasana","5","Avancé : remplace par Ustrasana ou un pont si tu ne le pratiques pas avec un professeur."],
        ["Supta Vajrasana","5","Demi-lotus ou variante sans lotus."],
        ["Bakasana A et B · Bharadvajasana · Ardha Matsyendrasana","5 chacune",""]]},
      {h:"Hanches, bras et tête",d:"20 min",ex:[
        ["Eka Pada Sirsasana · Dwi Pada Sirsasana · Yoga Nidrasana","5 chacune","Jambe derrière la tête : seulement si déjà acquis. Sinon, berceau de la jambe."],
        ["Tittibhasana A, B, C","5 chacune",""],
        ["Pincha Mayurasana","5 à 10","Contre un mur au début. Très bon pour des épaules fines et fortes."],
        ["Karandavasana · Mayurasana · Nakrasana","5","Avancées : garde Pincha Mayurasana et passe."],
        ["Vatayanasana · Parighasana · Gomukhasana A et B","5 par côté chacune",""],
        ["Supta Urdhva Pada Vajrasana","5 par côté",""],
        ["Mukta Hasta et Baddha Hasta Sirsasana","5 chacune","Variantes d'équilibre sur la tête : uniquement si Sirsasana est stable."]]},
      {h:"Fin de pratique",d:"15 min",ex:[
        ["Urdhva Dhanurasana · Paschimottanasana","3 × 5 · 10",""],
        ["Séquence de fin de la série A","comme en A","De Sarvangasana à Savasana."]]}
    ],
    tips:["Ne la fais pas le lendemain d'un CrossFit lourd pour le dos.","Une seule nouvelle posture avancée à la fois, idéalement vue avec un professeur."]},
  repos:{name:"Jour off",when:"Samedi",short:"Vraie récupération.",
    why:"Le jour où le corps intègre le travail de la semaine. Tu ne compenses rien.",
    blocks:[{h:"Si l'envie vient",ex:[
      ["Balade","Sans objectif",""],
      ["Yin ou respiration","20 min",""],
      ["Sieste","20–25 min, avant 15h",""],
      ["Sauna","Relaxation seulement","Bien t'hydrater."]]}]}
};

const DAYS = [
  {k:"Lundi",s:"Lun",kind:"force",tag:"Force",intent:"Force + jeu",
   acts:[["6h30","crossfit","CrossFit",""],["7h30","tractions","Tractions","10 min"],["7h40","yin","Yin","10 min"],["Journée","tennis","Tennis","Technique, tranquille"]],
   bed:"22h00",bedNote:"Marche à 6h15 demain.",extra:["Shaker whey isolate après la séance"]},
  {k:"Mardi",s:"Mar",kind:"doux",tag:"Doux",intent:"Remise à zéro",
   acts:[["6h15","marche","Marche","Puis café avec Grégoire à la plage"],["Journée","pilates","Pilates","À la maison, 45 min avec le bloc taille fine"],["Soir","yin","Yoga doux ou yin","20 à 30 min"]],
   bed:"21h30",bedNote:"CrossFit à 6h30 demain : réveil 5h30."},
  {k:"Mercredi",s:"Mer",kind:"force",tag:"Force",intent:"Force, début du bloc",
   acts:[["6h30","crossfit","CrossFit",""],["7h30","yin","Yin","10 à 15 min"]],
   bed:"21h30",bedNote:"CrossFit à 6h30 demain : réveil 5h30.",extra:["Shaker whey isolate après la séance"]},
  {k:"Jeudi",s:"Jeu",kind:"force",tag:"Force",intent:"Force + long yin, puis plaisir",
   acts:[["6h30","crossfit","CrossFit","2e jour d'affilée : technique d'abord"],["7h30","tractions","Tractions","10 min"],["7h40","yin","Yin","30 min"]],
   bed:"22h00",bedNote:"Marche à 6h15 demain.",extra:["Shaker whey isolate après la séance"]},
  {k:"Vendredi",s:"Ven",kind:"doux",tag:"Yoga",intent:"Marcher, puis s'allonger",
   acts:[["6h15","marche","Marche","Puis café avec Grégoire à la plage"],["Journée","vinyasa","Vinyasa","À la maison, 45 à 60 min"],["Option","epaules","Épaules et dos","25 min, le soir"]],
   bed:"22h30",bedNote:"Pas de réveil imposé demain."},
  {k:"Samedi",s:"Sam",kind:"doux",tag:"Doux",intent:"Chill + gainage",
   acts:[["Matin","pilates","Pilates","À la maison, 45 min, sans forcer"],["Libre","repos","Repos","Balade de 45 min à 1 h, sieste si tu en as envie"]],
   bed:"22h00",bedNote:"Tennis demain matin."},
  {k:"Dimanche",s:"Dim",kind:"choix",tag:"Choix",intent:"Selon ton énergie",
   modes:{
     max:{label:"Au max",acts:[["7h30","tennis","Tennis","Tranquille"],["8h25","","Entre les deux","Eau + ½ banane ferme"],["8h30","crossfit","CrossFit","4e séance, charges modérées"],["9h30","yin","Yin","15 min"],["10h00","","Café",""]],extra:["Shaker whey isolate après la séance"]},
     chill:{label:"Chill morning",acts:[["8h00","tennis","Tennis","Jusqu'à 9h15"],["9h15","","Entre les deux","Eau + ½ banane ferme"],["9h30","yin","Yin","20 min"],["10h00","","Café",""],["Après-midi","marche","Balade","45 min à 1 h"]],extra:[]}
   },
   bed:"21h30",bedNote:"CrossFit à 6h30 demain : réveil 5h30."}
];

const RITUALS = ["8 000 à 10 000 pas","2 kiwis","1,5 à 2 L d'eau","Huile mesurée : 1 c. à soupe par plat","15 à 20 min de marche après le déjeuner","10 min debout après le dîner (rangement, vaisselle)","Repas sans écran, en mâchant lentement"];
const BKF = ["Yaourt sans lactose 150 g + 40 g d'avoine + 75 g de raisin noir ou 1 kiwi","2 œufs + 2 tranches de pain au levain + tomates","Porridge : 40 g d'avoine, lait d'amande, 1 kiwi, 10 amandes, ½ dose de whey isolate","1 macatia ou 1 scone maison (onglet Pâtisseries) + yaourt sans lactose + 1 orange"];
const POST = ["Banane ferme + café + shaker whey isolate (1 dose)","Puis l'un des petits-déjeuners au retour","Dimanche « au max » : ½ banane ferme entre le tennis et le CrossFit"];
const SNK = ["Yaourt sans lactose + 2 kiwis","2 œufs durs + concombre","1 tranche de pain au levain + 30 g de lountza","10 amandes + 1 orange","Plaisir : 30 g de chocolat noir (2 fois par semaine) ; 1 part de pâtisserie maison (1 fois par semaine)"];
const LAB = {ok:"Libre",dose:"À dose",evite:"À éviter"};

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const fmt = (v,u) => u==="pièce" ? (v===1?"1":v+"") : v+" g";

/* ---------- views ---------- */
const VIEWS=["semaine","seances","assiette","matin","courses"];
function showView(v){
  if(!VIEWS.includes(v)) v="semaine";
  document.querySelectorAll("[data-view-panel]").forEach(p=>p.hidden = p.dataset.viewPanel!==v);
  document.querySelectorAll(".tab").forEach(t=>t.setAttribute("aria-selected", t.dataset.view===v));
  store.set("ra-view",v);
}
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>showView(t.dataset.view)));

/* ---------- days ---------- */
const todayIdx = (new Date().getDay()+6)%7;
let cur = todayIdx;
function renderStrip(){
  $("#days").innerHTML = DAYS.map((d,i)=>`<button class="day${i===todayIdx?" today":""}" role="tab" data-i="${i}" data-kind="${d.kind}" aria-selected="${i===cur}" aria-label="${d.k}"><b>${d.s}</b><i></i><span>${d.tag}</span></button>`).join("");
  document.querySelectorAll(".day").forEach(b=>b.addEventListener("click",()=>{cur=+b.dataset.i;renderStrip();renderDay();}));
}
function mealsOf(day){return DATA.meals.map((m,i)=>({...m,i})).filter(m=>m.day===day);}
function mealCard(m){
  const me = m.items.filter(x=>x.toi>0).map(x=>`<span class="chip">${esc(x.item)} · ${fmt(x.toi,x.unit)}</span>`).join("");
  const fish = /daurade|bar /i.test(m.title) ? '<span class="fish">Poisson</span>' : "";
  return `<button class="meal" data-meal="${m.i}"><div class="m">${m.moment}${fish}</div><h3>${esc(m.title)}</h3><div class="portions">${me}</div></button>`;
}
function renderDay(){
  const d0 = DAYS[cur];
  const mode = d0.modes ? (store.get("ra-sun")||"chill") : null;
  const d = d0.modes ? {...d0, acts:d0.modes[mode].acts, extra:d0.modes[mode].extra} : d0;
  const modeBar = d0.modes ? `<div class="filters" role="group" aria-label="Énergie">${Object.entries(d0.modes).map(([k,v])=>`<button class="fbtn" data-mode="${k}" aria-pressed="${k===mode}">${v.label}</button>`).join("")}</div>` : "";
  const acts = d.acts.map(([t,key,n,desc])=>{
    const tag = key ? "button" : "div";
    return `<${tag} class="act${key?"":" static"}" ${key?`data-s="${key}"`:""}><span class="t">${t}</span><span><span class="n">${esc(n)}</span>${desc?`<span class="d">${esc(desc)}</span>`:""}</span>${key?'<span class="go">Voir</span>':"<span></span>"}</${tag}>`;
  }).join("");
  const items = [...(d.extra||[]),...RITUALS];
  const checks = items.map((r,j)=>{
    const id=`ck-${cur}-${norm(r).replace(/[^a-z0-9]/g,"").slice(0,24)}`; const on = store.get(id)==="1";
    return `<label for="${id}"><input type="checkbox" id="${id}" ${on?"checked":""}><span>${esc(r)}</span></label>`;
  }).join("");
  const ms = mealsOf(d0.k).sort((a,b)=>(a.moment==='Midi'?0:1)-(b.moment==='Midi'?0:1));
  const meals = ms.length ? ms.map(mealCard).join("") : `<p class="note">${esc(d.free)}</p>`;
  $("#dayview").innerHTML = `
    <div class="dayhead"><h2>${d.k}</h2><span class="intent">${esc(d.intent)}</span></div>
    <div class="grid2">
      <div class="col">
        <div><div class="label">Mouvement</div>${modeBar}<div class="timeline">${acts}</div></div>
        <div><div class="label">Rituels du jour</div><div class="checks">${checks}</div></div>
        <div class="sleep"><span class="label" style="margin:0">Coucher</span><strong>${d.bed}</strong><span style="color:var(--muted)">${esc(d.bedNote)}</span></div>
      </div>
      <div class="col">
        <div><div class="label">Assiette · tes portions</div><div class="meals">${meals}</div></div>
        <p class="note">Petit-déjeuner et collations : onglet Assiette. Touche un repas pour voir les portions de toute la famille.</p>
      </div>
    </div>`;
  document.querySelectorAll("#dayview [data-s]").forEach(b=>b.addEventListener("click",()=>openSession(b.dataset.s,b)));
  document.querySelectorAll("#dayview [data-meal]").forEach(b=>b.addEventListener("click",()=>openMeal(+b.dataset.meal,b)));
  document.querySelectorAll("#dayview [data-mode]").forEach(b=>b.addEventListener("click",()=>{store.set("ra-sun",b.dataset.mode);renderDay();}));
  document.querySelectorAll("#dayview .checks input").forEach(c=>c.addEventListener("change",()=>store.set(c.id,c.checked?"1":"0")));
}

/* ---------- sheet ---------- */
let lastFocus=null;
function openSheet(title,html,from){
  lastFocus = from||document.activeElement;
  $("#sh-title").textContent=title; $("#sh-body").innerHTML=html;
  const sh=$("#sheet"), sc=$("#scrim");
  sh.hidden=false; sc.hidden=false;
  requestAnimationFrame(()=>{sh.classList.add("on");sc.classList.add("on");});
  sh.scrollTop=0; $("#sh-close").focus();
}
function closeSheet(){
  const sh=$("#sheet"), sc=$("#scrim");
  sh.classList.remove("on"); sc.classList.remove("on");
  setTimeout(()=>{sh.hidden=true;sc.hidden=true;},260);
  if(lastFocus) lastFocus.focus();
}
$("#sh-close").addEventListener("click",closeSheet);
$("#scrim").addEventListener("click",closeSheet);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#sheet").hidden)closeSheet();});

function openSession(key,from){
  const s=SESSIONS[key]; if(!s) return;
  const blocks = s.blocks.map(b=>`<div class="block"><h3>${esc(b.h)}${b.d?`<small>${b.d}</small>`:""}</h3>${b.ex.map(([n,r,c])=>`<div class="ex"><b>${esc(n)}</b><span class="r">${esc(r)}</span>${c?`<span class="c">${esc(c)}</span>`:""}</div>`).join("")}</div>`).join("");
  const tips = s.tips ? `<div class="block"><h3>À savoir</h3><ul class="list">${s.tips.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></div>` : "";
  openSheet(s.name, `<div class="label" style="color:var(--wood)">${esc(s.when)}</div><p class="why">${esc(s.why)}</p>${blocks}${tips}`, from);
}
function openMeal(i,from){
  const m=DATA.meals[i];
  const rows=m.items.map(x=>`<tr><td>${esc(x.item)}</td><td class="me">${x.toi?fmt(x.toi,x.unit):"–"}</td><td>${x.vous?fmt(x.vous,x.unit):"–"}</td><td>${x.fils?fmt(x.fils,x.unit):"–"}</td><td>${fmt(x.toi+x.vous+x.fils+x.plat,x.unit)}</td></tr>`).join("");
  openSheet(m.title, `<div class="label" style="color:var(--wood)">${m.day} ${m.moment.toLowerCase()} · course : ${esc(m.courseLabel)}</div><p class="why">${esc(m.method)}</p>
    <div class="tablewrap"><table class="fam"><thead><tr><th>Ingrédient</th><th>Toi</th><th>Vous</th><th>Fils</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="why" style="margin-top:12px;font-size:13px">Poids crus. Légumes et pommes de terre : 700 g maximum pour la famille. Cuisson à l'huile d'olive ou à l'huile infusée à l'ail.</p>`, from);
}

/* ---------- sessions grid ---------- */
$("#sgrid").innerHTML = ["crossfit","tractions","pilates","epaules","vinyasa","ashtangaA","ashtangaB","yin","marche","tennis","mobilite","repos"].map(k=>{
  const s=SESSIONS[k]; return `<button class="scard" data-s="${k}"><span class="w">${esc(s.when)}</span><h3>${esc(s.name)}</h3><p>${esc(s.short)}</p></button>`;}).join("");
document.querySelectorAll("#sgrid [data-s]").forEach(b=>b.addEventListener("click",()=>openSession(b.dataset.s,b)));

/* ---------- food guide ---------- */
let filt="all";
function rowHTML(item,st,p,n){
  return `<div class="row"><span class="i">${esc(item)}</span><span class="pill ${st}">${LAB[st]}</span><span class="p">${esc(p||"")}</span>${n?`<span class="n">${esc(n)}</span>`:""}</div>`;
}
const openCats=new Set();
function renderGuide(){
  const q=norm($("#q").value.trim());
  const all=[...DATA.guide, ...DATA.fruits.map(f=>["Fruits",f[0],f[1],f[2],f[3]])];
  const cats=[...new Set(all.map(g=>g[0]))];
  let html="", count=0;
  cats.forEach(c=>{
    const rs=all.filter(g=>g[0]===c && (filt==="all"||g[2]===filt) && (!q||norm(g[1]).includes(q)));
    if(!rs.length) return; count+=rs.length;
    const open = q || openCats.has(c);
    html+=`<details class="acc sub" data-cat="${esc(c)}"${open?" open":""}><summary><span class="st">${esc(c)}</span><span class="count">${rs.length}</span></summary><div class="accbody"><div class="rows">${rs.map(g=>rowHTML(g[1],g[2],g[3],g[4])).join("")}</div></div></details>`;
  });
  $("#guide").innerHTML = count?html:`<p class="empty">Aucun aliment trouvé. Essaie un autre mot, ou vérifie dans l'appli Monash.</p>`;
  document.querySelectorAll("#guide details").forEach(d=>d.addEventListener("toggle",()=>{ if(!$("#q").value){ d.open?openCats.add(d.dataset.cat):openCats.delete(d.dataset.cat);} }));
}
document.querySelectorAll(".fbtn[data-f]").forEach(b=>b.addEventListener("click",()=>{
  filt=b.dataset.f; document.querySelectorAll(".fbtn[data-f]").forEach(x=>x.setAttribute("aria-pressed",x===b)); renderGuide();}));
$("#q").addEventListener("input",renderGuide);
$("#fruits").innerHTML = DATA.fruits.map(f=>rowHTML(f[0],f[1],f[2],f[3])).join("");
$("#flours").innerHTML = DATA.flours.map(f=>rowHTML(f[0],f[1],"",f[2])).join("");
const groups=[...new Set(DATA.degonfle.map(d=>d[0]))];
$("#degonfle").innerHTML = groups.map(g=>`<details class="acc sub"><summary><span class="st">${esc(g)}</span><span class="count">${DATA.degonfle.filter(d=>d[0]===g).length}</span></summary><div class="accbody"><div class="rows">${DATA.degonfle.filter(d=>d[0]===g).map(d=>`<div class="row"><span class="i">${esc(d[1])}</span><span class="pill ok">Libre</span><span></span>${d[2]?`<span class="n">${esc(d[2])}</span>`:""}</div>`).join("")}</div></div></details>`).join("");
$("#degonfleDose").innerHTML = DATA.degonfleDose.map(d=>rowHTML(d[0],"dose",d[1],d[2])).join("");
$("#laits").innerHTML = DATA.guide.filter(g=>g[0]==="Laitages et laits" && /^(Lait|Boisson)/.test(g[1])).map(g=>rowHTML(g[1],g[2],g[3],g[4])).join("");
$("#bkf").innerHTML = BKF.map(x=>`<li>${esc(x)}</li>`).join("");
$("#snk").innerHTML = SNK.map(x=>`<li>${esc(x)}</li>`).join("");
$("#post").innerHTML = POST.map(x=>`<li>${esc(x)}</li>`).join("");
document.querySelectorAll("[data-sub]").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll("[data-sub]").forEach(x=>x.setAttribute("aria-pressed",x===b));
  $("#sub-idees").hidden = b.dataset.sub!=="idees"; $("#sub-patisseries").hidden = b.dataset.sub!=="patisseries";
}));
const nf=v=>{const r=Math.round(v*10)/10; return r.toLocaleString("fr-FR");};
function ingAmt(a,u,k){
  if(u==="pincée") return `${Math.max(1,Math.round(a*k))} pincée${Math.round(a*k)>1?"s":""}`;
  if(u==="pièce"){const v=a*k; const r=Math.round(v*2)/2; return r<0.5?"½":(Number.isInteger(r)?`${r}`:`${Math.floor(r)||""}½`);}
  const v=a*k; return `${v>=20?Math.round(v):nf(v)} ${u}`;
}
function renderRecipe(ri){
  const r=DATA.recipes[ri]; const n=+(store.get("rc-"+ri)||r.parts); const k=n/r.parts;
  const el=document.querySelector(`#rc-${ri} .accbody`);
  el.innerHTML=`<p>${esc(r.why)}</p><div class="label" style="color:var(--wood)">${esc(r.bake)}</div>
    <div class="scaler"><button data-d="-1" aria-label="Moins">−</button><output>${n}</output><span>${esc(r.label)}</span><button data-d="1" aria-label="Plus">+</button></div>
    <div class="rows">${r.ings.map(([i,a,u])=>`<div class="irow"><span>${esc(i)}</span><span class="cq">${ingAmt(a,u,k)}</span></div>`).join("")}</div>
    <div class="ctag">Étapes</div><ol class="steps">${r.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>
    <p class="note" style="margin-top:12px">${esc(r.tip)}</p>`;
  el.querySelectorAll("[data-d]").forEach(b=>b.addEventListener("click",()=>{const m=Math.max(1,Math.min(48,n+(+b.dataset.d))); store.set("rc-"+ri,String(m)); renderRecipe(ri);}));
}
$("#recipes").innerHTML = DATA.recipes.map((r,ri)=>`<details class="acc" id="rc-${ri}"><summary><span class="st">${esc(r.title)}</span><span class="sm">${r.parts} ${esc(r.label)}</span></summary><div class="accbody"></div></details>`).join("");
DATA.recipes.forEach((r,ri)=>renderRecipe(ri));

/* ---------- courses ---------- */
const qfmt=(v,u)=>u==="pièce"?`${v}`:(u==="ml"?(v>=1000?`${(v/1000).toLocaleString("fr-FR",{maximumFractionDigits:2})} L`:`${v} ml`):(v>=1000?`${(v/1000).toLocaleString("fr-FR",{maximumFractionDigits:2})} kg`:`${v} g`));
function renderCourses(){
  $("#courses").innerHTML = DATA.courses.map((c,ci)=>{
    const body = c.groups.map((g,gi)=>`<div class="ctag" style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span>${esc(g.name)}</span><span style="display:flex;gap:4px"><button class="fbtn mini" data-all="1" data-scope="${ci}-${gi}">Tout cocher</button><button class="fbtn mini" data-all="0" data-scope="${ci}-${gi}">Décocher</button></span></div>${g.items.map(it=>{
      const id=`cs-${ci}-${norm(it[0]).replace(/[^a-z0-9]/g,"")}`; const on=store.get(id)==="1";
      return `<label class="citem" for="${id}" data-g="${ci}-${gi}"><input type="checkbox" id="${id}" ${on?"checked":""}><span>${esc(it[0])}${it[3]?`<span class="d" style="display:block;font-size:12.5px;color:var(--muted)">${esc(it[3])}</span>`:""}</span><span class="cq">${it[4]||qfmt(it[1],it[2])}</span></label>`;}).join("")}`).join("");
    return `<details class="acc"${ci===0?" open":""}><summary><span class="st">${esc(c.label)}</span><span class="sm">${esc(c.covers)}</span></summary><div class="accbody">
      <div class="filters"><button class="fbtn" data-all="1" data-scope="${ci}">Tout cocher</button><button class="fbtn" data-all="0" data-scope="${ci}">Tout décocher</button></div>
      ${c.note?`<p>${esc(c.note)}</p>`:""}${body}</div></details>`;
  }).join("");
  document.querySelectorAll("#courses input").forEach(i=>i.addEventListener("change",()=>store.set(i.id,i.checked?"1":"0")));
  document.querySelectorAll("#courses [data-all]").forEach(b=>b.addEventListener("click",e=>{
    e.preventDefault(); const sc=b.dataset.scope, v=b.dataset.all==="1";
    document.querySelectorAll("#courses .citem").forEach(l=>{ if(l.dataset.g===sc || l.dataset.g.startsWith(sc+"-")){const i=l.querySelector("input"); i.checked=v; store.set(i.id,v?"1":"0");}});
  }));
}
$("#creset").addEventListener("click",()=>{document.querySelectorAll("#courses input").forEach(i=>{i.checked=false;store.set(i.id,"0");});});
renderCourses();


/* ---------- frigo → recette ---------- */
const FRIDGE = {
  "Protéines":["Poulet","Œufs","Porc","Agneau","Bœuf haché","Bar ou daurade","Lountza","Saucisse","Tofu ferme","Halloumi","Feta","Parmesan","Yaourt sans lactose"],
  "Légumes":["Carottes","Pommes de terre","Patate douce","Courgette","Aubergine","Brocoli","Haricots verts","Épinards","Concombre","Tomates","Laitue","Kale","Vert d'oignon nouveau"],
  "Féculents":["Riz sauvage","Quinoa","Pâtes complètes","Pain au levain","Avoine","Farine de sarrasin","Polenta"],
  "Fruits et extras":["Banane ferme","Kiwi","Orange","Raisin","Citron","Herbes fraîches","Gingembre","Chocolat noir","Amandes","Noix"]
};
let fsel=new Set(); try{ fsel=new Set(JSON.parse(store.get("ra-fridge")||"[]")); }catch(e){}
let fmoment="repas", fwho="famille";
function saveF(){ store.set("ra-fridge",JSON.stringify([...fsel])); }
function renderChips(){
  $("#fchips").innerHTML = Object.entries(FRIDGE).map(([g,arr])=>`<div class="fgroup">${esc(g)}</div>${arr.map(x=>`<button class="fchip" data-f="${esc(x)}" aria-pressed="${fsel.has(x)}">${esc(x)}</button>`).join("")}`).join("");
  document.querySelectorAll(".fchip").forEach(b=>b.addEventListener("click",()=>{const x=b.dataset.f; fsel.has(x)?fsel.delete(x):fsel.add(x); b.setAttribute("aria-pressed",fsel.has(x)); saveF(); $("#fstatus").textContent=`${fsel.size} coché${fsel.size>1?"s":""}`;}));
  $("#fstatus").textContent = fsel.size?`${fsel.size} coché${fsel.size>1?"s":""}`:"";
}
renderChips();
document.querySelectorAll("[data-moment]").forEach(b=>b.addEventListener("click",()=>{fmoment=b.dataset.moment;document.querySelectorAll("[data-moment]").forEach(x=>x.setAttribute("aria-pressed",x===b));}));
document.querySelectorAll("[data-who]").forEach(b=>b.addEventListener("click",()=>{fwho=b.dataset.who;document.querySelectorAll("[data-who]").forEach(x=>x.setAttribute("aria-pressed",x===b));}));
$("#fclear").addEventListener("click",()=>{fsel.clear();saveF();renderChips();});
function fodmapRules(){
  const dose=DATA.guide.filter(g=>g[2]==="dose").map(g=>`${g[1]} : ${g[3]}`).join("; ");
  const avoid=[...DATA.guide.filter(g=>g[2]==="evite").map(g=>g[1]), ...DATA.fruits.filter(f=>f[1]==="evite").map(f=>f[0])].join("; ");
  return {dose,avoid};
}
let sampleNS=null;
$("#fgo").disabled=true; $("#fstatus").textContent="Bientôt : la création de recette arrivera avec l'assistante.";
$("#fgo").addEventListener("click",async()=>{
  if(!fsel.size){$("#fstatus").textContent="Coche au moins un aliment.";return;}
  if(!sampleNS){$("#fstatus").textContent="La création de recette n'est pas disponible ici.";return;}
  const r=fodmapRules();
  const prompt=`Tu es une cheffe nutritionniste. Propose UNE recette en français pour : ${fmoment}, ${fwho==="famille"?"3 personnes (Emeline, Grégoire qui mange plus, et leur fils)":"Emeline seule"}.
Ingrédients disponibles : ${[...fsel].join(", ")}. Utilise surtout ceux-là ; tu peux ajouter seulement des basiques de placard (huile d'olive, huile infusée à l'ail, sel, poivre, épices, herbes, citron, sauce soja, moutarde).
Règles strictes (régime pauvre en FODMAP, phase d'éviction, anti-inflammatoire, cuisine méditerranéenne simple) :
- INTERDIT : ${r.avoid}. Jamais d'oignon ni d'ail (huile infusée à l'ail possible).
- Portions maximales PAR PERSONNE pour : ${r.dose}.
- Portion d'Emeline pour un repas : environ 25 à 30 g de protéines, 40 à 50 g de féculent cru, légumes surtout cuits ; légumes + pommes de terre ≤ 700 g pour la famille.
- Peu de matière grasse, cuisson au four, à la vapeur ou à la poêle.
Réponds UNIQUEMENT en JSON : {"title":string,"time":string,"ingredients":[{"name":string,"qty_total":string,"qty_emeline":string}],"steps":[string],"note":string}. "note" : une phrase sur l'équilibre ou la tolérance FODMAP.`;
  $("#fgo").disabled=true; $("#fstatus").textContent="Claude cuisine…"; $("#fout").innerHTML="";
  try{
    const res=await sampleNS.json(prompt,{modelTier:"default"});
    $("#fout").innerHTML=`<div class="rcard"><h3>${esc(res.title||"Recette")}</h3><div class="label" style="color:var(--wood)">${esc(res.time||"")}</div>
      <div class="rows">${(res.ingredients||[]).map(i=>`<div class="irow"><span>${esc(i.name)}</span><span class="cq">${esc(fwho==="famille"?(i.qty_total||""):(i.qty_emeline||i.qty_total||""))}${fwho==="famille"&&i.qty_emeline?` <span class="count">· toi ${esc(i.qty_emeline)}</span>`:""}</span></div>`).join("")}</div>
      <div class="ctag">Étapes</div><ol class="steps">${(res.steps||[]).map(s=>`<li>${esc(s)}</li>`).join("")}</ol>
      ${res.note?`<p class="note" style="margin-top:12px">${esc(res.note)}</p>`:""}</div>`;
    $("#fstatus").textContent="";
  }catch(e){
    $("#fstatus").textContent = e&&e.code==="not_granted" ? "Autorisation refusée : la création de recette reste désactivée." : (e&&e.code==="rate_limited" ? "Trop de demandes d'un coup : réessaie dans un moment." : "La recette n'a pas pu être créée. Réessaie.");
  }finally{ $("#fgo").disabled=false; }
});

/* ---------- boot ---------- */
renderStrip(); renderDay(); renderGuide();
const h = (location.hash||"").slice(1);

showView(VIEWS.includes(h) ? h : (store.get("ra-view")||"semaine"));

}
