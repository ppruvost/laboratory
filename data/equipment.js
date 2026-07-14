const laboratoryEquipment = [
    // Électricité
    {
        domaine: "Électricité",
        nom: "Générateur de tension continue (0-30V)",
        description: "Alimentation stabilisée pour circuits électriques",
        lieu: "Salle B27 / étagère A1",
        image:"",
        noticeUtilisation: "assets/notice/alimentation_continue.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Générateur de tension alternative (0-12V, 50Hz)",
        description: "Alimentation pour circuits alternatifs",
        lieu: "Salle B27 / étagère A1",
        image:"",
        noticeUtilisation: "assets/notice/alimentation_alternative.pdf"
    },
    {
        domaine: "Électricité",
        nom: "LCR Meter Lutron LCFR-9063",
        categorie: ["Résistance", "Capacité", "Inductance"],
        description: "Appareil de mesure des résistances, des capacités et des inductances (R, C, L).",
        lieu: "Salle B27 / paillasse A1",
        image: "assets/img/equipments/lcr_meter.jpg",
        noticeUtilisation: "assets/notice/lcr_meter_lutron_lcfr9063.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Multimètre numérique",
        categorie: ["Résistance", "Capacité", "Inductance", "Redox"],
        description: "Mesure de tension, courant, résistance",
        lieu: "Salle B27 / étagère A1",
        image:"assets/img/equipments/multimetre.jpg",
        noticeUtilisation: "assets/notice/multimetre.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Oscilloscope numérique",
        categorie: "",
        description: "Visualisation de signaux électriques",
        lieu: "Salle B27 / étagère A1",
        image:"",
        noticeUtilisation: "assets/notice/oscilloscope.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Wattmètre",
        categorie: "",
        description: "Mesure de puissance électrique",
        lieu: "Salle B27 / étagère A1",
        image:"assets/img/equipments/wattmetre.jpg",
        noticeUtilisation: "assets/notice/wattmetre.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Transformateur (abaisseur/élévateur)",
        categorie: "",
        description: "Transformation de tension",
        lieu: "Salle B27 / étagère A1",
        image:"",
        noticeUtilisation: "assets/notice/transformateur.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Diode et pont de diodes",
        categorie: "",
        description: "Redressement de courant",
        lieu: "Salle B27 / étagère A2",
        image:"",
        noticeUtilisation: "assets/notice/diode.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Condensateurs (diverses capacités)",
        categorie: "",
        description: "Filtrage et stockage d'énergie",
        lieu: "Salle B27 / étagère A2",
        image:"",
        noticeUtilisation: "assets/notice/condensateur.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Moteur électrique (CC et CA)",
        categorie: "",
        description: "Conversion énergie électrique/mécanique",
        lieu: "Salle B23 / étagère B1",
        image:"",
        noticeUtilisation: "assets/notice/moteur_electrique.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Capteurs (température, lumière, pression)",
        categorie: "",
        description: "Acquisition de données expérimentales",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/capteurs.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Carte d'acquisition (ExAO)",
        categorie: "",
        description: "Interface pour expériences assistées par ordinateur",
        lieu: "Salle B25 / étagère A1",
        image:"",
        noticeUtilisation: "assets/notice/exao.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Résistances (diverses valeurs)",
        categorie: "",
        description: "Composants pour circuits électriques",
        lieu: "Salle B27 / étagère A2",
        image:"",
        noticeUtilisation: "assets/notice/resistances.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Fils de connexion et câbles",
        categorie: ["Redox"],
        description: "Connexion de circuits",
        lieu: "Salles B29 B25 / Support de cordons",
        image:"",
        noticeUtilisation: "assets/notice/fils_connexion.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Pinces crocodile",
        categorie: ["Redox"],
        description: "Connexion de circuits",
        lieu: "Salle B7 / étagère A1",
        image:"",
        noticeUtilisation: "assets/notice/pinces_crocodile.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Interrupteurs et boutons poussoirs",
        categorie: "",
        description: "Contrôle de circuits",
        lieu: "Salle B27 / étagère A2",
        image:"",
        noticeUtilisation: "assets/notice/interrupteurs.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Disjoncteur différentiel",
        categorie: "",
        description: "Protection des circuits",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/disjoncteur.pdf"
    },

    // Optique
    {
        domaine: "Optique",
        nom: "Lentilles convergentes et divergentes",
        categorie: "",
        description: "Étude des systèmes optiques",
        lieu: "Salle B23 / étagère A1",
        image:"",
        noticeUtilisation: "assets/notice/lentilles.pdf"
    },
    {
        domaine: "Optique",
        nom: "Banc d'optique",
        categorie: "",
        description: "Support pour expériences optiques",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/banc_optique.pdf"
    },
    {
        domaine: "Optique",
        nom: "Source lumineuse blanche",
        categorie: "",
        description: "Éclairage pour expériences optiques",
        lieu: "Salle B23 / étagère A2",
        image:"",
        noticeUtilisation: "assets/notice/source_lumineuse.pdf"
    },
    {
        domaine: "Optique",
        nom: "Laser (classe II)",
        categorie: "",
        description: "Source de lumière cohérente",
        lieu: "Salle B23 / étagère A2",
        image:"",
        noticeUtilisation: "assets/notice/laser.pdf"
    },
    {
        domaine: "Optique",
        nom: "Écran blanc",
        categorie: "",
        description: "Visualisation des images",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/ecran_blanc.pdf"
    },
    {
        domaine: "Optique",
        nom: "Prismes",
        categorie: "",
        description: "Décomposition de la lumière",
        lieu: "Salle B23 / étagère A2",
        image:"",
        noticeUtilisation: "assets/notice/prismes.pdf"
    },
    {
        domaine: "Optique",
        nom: "Fibre optique",
        categorie: "",
        description: "Transmission de la lumière",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/fibre_optique.pdf"
    },
    {
        domaine: "Optique",
        nom: "Luxmètre",
        categorie: "",
        description: "Mesure de l'éclairement lumineux",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/luxmetre.pdf"
    },
    {
        domaine: "Optique",
        nom: "Spectroscope",
        categorie: "",
        description: "Analyse spectrale de la lumière",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/spectroscope.pdf"
    },
    {
        domaine: "Optique",
        nom: "Filtres colorés",
        categorie: "",
        description: "Sélection de longueurs d'onde",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/filtres_colorés.pdf"
    },

    // Mécanique
    {
        domaine: "Mécanique",
        nom: "Chronomètre numérique",
        categorie: "",
        description: "Mesure de temps et de vitesses",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/chronometre.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Dynamomètre",
        categorie: "",
        description: "Mesure de forces",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/dynamometre.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Poulies et masses marquées",
        categorie: "",
        description: "Étude des forces et mouvements",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/poulies_masses.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Plan incliné",
        categorie: "",
        description: "Étude des forces et de l'équilibre",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/plan_incline.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Vérin hydraulique",
        categorie: "",
        description: "Étude de la pression et de la force pressante",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/verin_hydraulique.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Manomètre",
        categorie: "",
        description: "Mesure de pression",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/manometre.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Capteur de pression",
        categorie: "",
        description: "Mesure de pression dans les fluides",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/capteur_pression.pdf"
    },

    // Chimie

    {
     domaine: "Chimie",
     nom: "Agitateurs magnétiques",
     categorie: ["Dissolution", "pHmétrie"],
     description: "Agitation des solutions",
     lieu: "Salle B27 / étagère D4",
     image:"",         
     noticeUtilisation: "assets/notice/agitateur_magnetique.pdf"
    },
    {
    domaine: "Chimie",
    nom: "Balance Jeulin 701 277",
    categorie: ["Dissolution", "pHmétrie"],
    description: "Capacité 2 000 g max — Précision ± 1 g",
    lieu: "Salle B27 / étagère C2",
    image: "assets/img/equipments/balance_jeulin.jpg",
    noticeUtilisation: "assets/notice/balance_jeulin.pdf"
    },
    {
    domaine: "Chimie",
    nom: "Balance METTLER TOLEDO PB602",
    categorie: ["Dissolution", "pHmétrie"],
    description: "Capacité 610 g max - 0,5 g min — Précision ± 0,1 g",
    lieu: "Salle B27 / pallasse E2",
    image:"",
    noticeUtilisation: "assets/notice/balance_mettler.pdf"
    },
    {
    domaine: "Chimie",
    nom: "Bandelettes pH 5,0 à 10,0",
    categorie: ["Indicateur", "pHmétrie"],
    description: "Bandelettes indicatrices permettant une mesure précise du pH des solutions entre 5,0 et 10,0.",
    lieu: "Salle B27 / étagère D4",
    image: "assets/img/equipments/bandelettes_pH.jpg",
    noticeUtilisation: "assets/notice/bandelettes_ph_5_10.pdf"
    },
    {
    domaine: "Chimie",
    nom: "Chauffe-ballon",
    categorie: ["Dissolution", "pHmétrie"],
    description: "Chauffage de solutions",
    lieu: "Salle B27 / étagère C1",
    image:"assets/img/equipments/chauffe_ballon.jpg",         
    noticeUtilisation: "assets/notice/chauffe_ballon.pdf"
    },
    {domaine: "Chimie",
    nom: "Lames métalliques (Zn, Cu, Fe, Pb, Al)",
    categorie: ["Redox"],
    description: "Électrodes des demi-piles, à décaper avant chaque usage",
    lieu: "Salle B27 / étagère D1",
    image: "",
    noticeUtilisation: ""
    },
    {
    domaine: "Chimie",
    nom: "Papier tournesol bleu",
    categorie: ["Indicateur", "pHmétrie"],
    description: "Papier indicateur virant au rouge en présence d'une solution acide.",
    lieu: "Salle B27 / étagère D4",
    image: "assets/img/equipments/papier_pH.jpg",
    noticeUtilisation: "assets/notice/papier_tournesol_bleu.pdf"
    },
    {
    domaine: "Chimie",
    nom: "Papier tournesol neutre",
    categorie: ["Indicateur", "pHmétrie"],
    description: "Papier indicateur permettant de distinguer les solutions acides et basiques.",
    lieu: "Salle B27 / étagère D4",
    image: "assets/img/equipments/papier_pH.jpg",
    noticeUtilisation: "assets/notice/papier_tournesol_neutre.pdf"
    },
    {
    domaine: "Chimie",
    nom: "Papier tournesol rouge",
    categorie: ["Indicateur", "pHmétrie"],
    description: "Papier indicateur virant au bleu en présence d'une solution basique.",
    lieu: "Salle B27 / étagère D4",
    image: "assets/img/equipments/papier_pH.jpg",
    noticeUtilisation: "assets/notice/papier_tournesol_rouge.pdf"
    },
    {
    domaine: "Chimie",
    nom: "Papier phénolphtaléine",
    categorie: ["Indicateur", "pHmétrie"],
    description: "Papier imprégné de phénolphtaléine, incolore en milieu acide et rose en milieu basique.",
    lieu: "Salle B27 / étagère D4",
    image: "assets/img/equipments/papier_pH.jpg",
    noticeUtilisation: "assets/notice/papier_phenolphtaleine.pdf"
    },
    {
    domaine: "Chimie",
    nom: "Papier à l'acétate de plomb",
    categorie: ["Indicateur", "pHmétrie"],
    description: "Papier détecteur des ions sulfure et du sulfure d'hydrogène (H₂S) par noircissement.",
    lieu: "Salle B27 / étagère D4",
    image: "assets/img/equipments/papier_pH.jpg",
    noticeUtilisation: "assets/notice/papier_acetate_plomb.pdf"
    },
    {
    domaine: "Chimie",
    nom: "Papier pH universel",
    categorie: ["Indicateur", "pHmétrie"],
    description: "Bandelette indicatrice permettant de mesurer le pH d'une solution par comparaison avec une échelle colorée.",
    lieu: "Salle B27 / étagère D4",
    image: "assets/img/equipments/papier_ph_universel.jpg",
    noticeUtilisation: "assets/notice/papier_ph_universel.pdf"
    },    
    {
    domaine: "Chimie",
    nom: "pH-mètre",
    categorie: ["Dissolution", "pHmétrie"],
    description: "Mesure du pH des solutions",
     lieu: "Salle B27 / étagère D4",
     image:"",
     noticeUtilisation: "assets/notice/phmetre.pdf"
    },   
    {
     domaine: "Chimie",
     nom: "Poire",
     categorie: ["Dilution", "pHmétrie"],
     description: "Transfert précis de liquides",
     lieu: "Salle B27 / étagère D4",
     image:"assets/img/equipments/poire.jpg",         
     noticeUtilisation: "assets/notice/poire.pdf"
    },
     {
    domaine: "Chimie",
    nom: "Potence, noix et pince",
    categorie: ["Redox"],
    description: "Support de la demi-pile à hydrogène simplifiée",
    lieu: "Salle B27 / paillasse E2",
    image: "",
    noticeUtilisation: ""
    },
    {
    domaine: "Chimie",
    nom: "Propipettes",
    categorie: ["Dilution", "pHmétrie"],
    description: "Transfert précis de liquides",
    lieu: "Salle B27 / étagère D4",
    image:"assets/img/equipments/pro_pipette.jpg",        
    noticeUtilisation: "assets/notice/propipettes.pdf"
    }, 
    {
    domaine: "Chimie",
    nom: "Sorbonne d'aspiration",
    categorie: ["Dissolution", "pHmétrie"],
    description: "Élimination sécurisée des vapeurs toxiques ou corrosives",
    lieu: "Salle B29",
    image: "",
    noticeUtilisation: ""
    },
    {
    domaine: "Chimie",
    nom: "Toile émeri",
    categorie: ["Redox"],
    description: "Décapage des lames métalliques avant utilisation comme électrodes",
    lieu: "Salle B27 / étagère D1",
    image: "",
    noticeUtilisation: ""
    },
   

    // Thermique
    {
        domaine: "Thermique",
        nom: "Thermomètre numérique",
        categorie: ["Température", "pHmétrie"],
        description: "Mesure de température",
        lieu: "",
        image:"",        
        noticeUtilisation: "assets/notice/thermometre.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Thermocouple",
        categorie: "Température",
        description: "Mesure de température en temps réel",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/thermocouple.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Calorimètre",
        categorie: "Température",
        description: "Mesure des échanges thermiques",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/calorimetre.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Caméra thermique",
        categorie: ["Température", "Optique"],
        description: "Visualisation des transferts thermiques",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/camera_thermique.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Matériaux isolants (laine de verre, polystyrène)",
        categorie: "Température",
        description: "Étude de l'isolation thermique",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/materiaux_isolants.pdf"
    },

    // Signaux
    {
        domaine: "Signaux",
        nom: "Générateur de fonctions",
        categorie: ["Température", "Acoustique"],
        description: "Production de signaux sonores et électriques",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/generateur_fonctions.pdf"
    },
    {
        domaine: "Signaux",
        nom: "Microphone avec prise Jack 3,5mm",
        categorie: "Acoustique",
        description: "Émission et réception de signaux sonores",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/micro_35.pdf"
    },
    {
        domaine: "Signaux",
        nom: "Microphone avec prise Jack 6,5mm",
        categorie: "Acoustique",
        description: "Émission et réception de signaux sonores",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/micro_65.pdf"
    },
    {
        domaine: "Signaux",
        nom: "Microphone avec prise USB",
        categorie: "Acoustique",
        description: "Émission et réception de signaux sonores",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/micro_usb.pdf"
    },
        {
        domaine: "Signaux",
        nom: "haut-parleur",
        categorie: "Acoustique",
        description: "Émission et réception de signaux sonores",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/micro_hautparleur.pdf"
    },
    {
        domaine: "Signaux",
        nom: "Oscilloscope (pour signaux sonores)",
        description: "Visualisation des signaux sonores",
        categorie: ["Circuit", "Acoustique"],
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/oscilloscope_son.pdf"
    },
    {
        domaine: "Signaux",
        nom: "Sonomètre",
        categorie: "Acoustique",
        description: "Mesure du niveau sonore",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/sonometre.pdf"
    },    

    // Sécurité
    {
        domaine: "Sécurité",
        nom: "Blouse de laboratoire",
        description: "Protection des vêtements",
        categorie: ["Dilution", "Dissolution", "pHmétrie"],
        lieu: "Salle B27 - Paillasse E2",
        image:"assets/img/equipments/blouse.jpg",
        noticeUtilisation: "assets/notice/blouse_laboratoire.pdf"
    },
    {
        domaine: "Sécurité",
        nom: "Lunettes de protection",
        categorie: ["Dilution", "Dissolution", "pHmétrie"],
        description: "Protection des yeux",
        lieu: "Salle B27 - Etagère D2",
        image:"assets/img/equipments/lunette.jpg",
        noticeUtilisation: "assets/notice/lunettes_protection.pdf"
    },
    {
        domaine: "Sécurité",
        nom: "Gants de protection",
        categorie: ["Dilution", "Dissolution", "pHmétrie"],
        description: "Protection des mains",
        lieu: "Salle B27 - paillasse E1",
        image:"assets/img/equipments/gant.jpg",
        noticeUtilisation: "assets/notice/gants_protection.pdf"
    },    
    {
        domaine: "Sécurité",
        nom: "Armoire de sécurité pour produits chimiques",
        description: "Stockage sécurisé des réactifs",
        lieu: "Salle B27 - Etagères B1 / B2",
        image:"assets/img/equipments/armoir.jpg",
        noticeUtilisation: "assets/notice/armoire_securite.pdf"
    }
];

export default laboratoryEquipment;
