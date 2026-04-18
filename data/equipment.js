const laboratoryEquipment = [
    // Électricité
    {
        domaine: "Électricité",
        nom: "Générateur de tension continue (0-30V)",
        description: "Alimentation stabilisée pour circuits électriques",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/alimentation_continue.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Générateur de tension alternative (0-12V, 50Hz)",
        description: "Alimentation pour circuits alternatifs",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/alimentation_alternative.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Multimètre numérique",
        description: "Mesure de tension, courant, résistance",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/multimetre.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Oscilloscope numérique",
        description: "Visualisation de signaux électriques",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/oscilloscope.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Wattmètre",
        description: "Mesure de puissance électrique",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/wattmetre.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Transformateur (abaisseur/élévateur)",
        description: "Transformation de tension",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/transformateur.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Diode et pont de diodes",
        description: "Redressement de courant",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/diode.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Condensateurs (diverses capacités)",
        description: "Filtrage et stockage d'énergie",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/condensateur.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Moteur électrique (CC et CA)",
        description: "Conversion énergie électrique/mécanique",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/moteur_electrique.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Capteurs (température, lumière, pression)",
        description: "Acquisition de données expérimentales",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/capteurs.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Carte d'acquisition (ExAO)",
        description: "Interface pour expériences assistées par ordinateur",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/exao.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Résistances (diverses valeurs)",
        description: "Composants pour circuits électriques",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/resistances.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Fils de connexion et câbles",
        description: "Connexion de circuits",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/fils_connexion.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Interrupteurs et boutons poussoirs",
        description: "Contrôle de circuits",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/interrupteurs.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Disjoncteur différentiel",
        description: "Protection des circuits",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/disjoncteur.pdf"
    },

    // Optique
    {
        domaine: "Optique",
        nom: "Lentilles convergentes et divergentes",
        description: "Étude des systèmes optiques",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/lentilles.pdf"
    },
    {
        domaine: "Optique",
        nom: "Banc d'optique",
        description: "Support pour expériences optiques",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/banc_optique.pdf"
    },
    {
        domaine: "Optique",
        nom: "Source lumineuse blanche",
        description: "Éclairage pour expériences optiques",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/source_lumineuse.pdf"
    },
    {
        domaine: "Optique",
        nom: "Laser (classe II)",
        description: "Source de lumière cohérente",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/laser.pdf"
    },
    {
        domaine: "Optique",
        nom: "Écran blanc",
        description: "Visualisation des images",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/ecran_blanc.pdf"
    },
    {
        domaine: "Optique",
        nom: "Prismes",
        description: "Décomposition de la lumière",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/prismes.pdf"
    },
    {
        domaine: "Optique",
        nom: "Fibre optique",
        description: "Transmission de la lumière",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/fibre_optique.pdf"
    },
    {
        domaine: "Optique",
        nom: "Luxmètre",
        description: "Mesure de l'éclairement lumineux",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/luxmetre.pdf"
    },
    {
        domaine: "Optique",
        nom: "Spectroscope",
        description: "Analyse spectrale de la lumière",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/spectroscope.pdf"
    },
    {
        domaine: "Optique",
        nom: "Filtres colorés",
        description: "Sélection de longueurs d'onde",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/filtres_colorés.pdf"
    },

    // Mécanique
    {
        domaine: "Mécanique",
        nom: "Chronomètre numérique",
        description: "Mesure de temps et de vitesses",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/chronometre.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Dynamomètre",
        description: "Mesure de forces",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/dynamometre.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Poulies et masses marquées",
        description: "Étude des forces et mouvements",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/poulies_masses.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Plan incliné",
        description: "Étude des forces et de l'équilibre",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/plan_incline.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Vérin hydraulique",
        description: "Étude de la pression et de la force pressante",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/verin_hydraulique.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Manomètre",
        description: "Mesure de pression",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/manometre.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Capteur de pression",
        description: "Mesure de pression dans les fluides",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/capteur_pression.pdf"
    },

    // Chimie
    {
        domaine: "Chimie",
        nom: "Bécher (divers volumes)",
        description: "Conteneur pour solutions",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/becher.pdf"
    },
    {
        domaine: "Chimie",
        nom: "Éprouvettes graduées",
        description: "Mesure de volumes de liquides",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/eprouvette.pdf"
    },
    {
        domaine: "Chimie",
        nom: "Pipettes et propipettes",
        description: "Transfert précis de liquides",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/pipettes.pdf"
    },
    {
        domaine: "Chimie",
        nom: "Burette",
        description: "Titrage et dosage",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/burette.pdf"
    },
    {
        domaine: "Chimie",
        nom: "pH-mètre",
        description: "Mesure du pH des solutions",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/phmetre.pdf"
    },
    {
        domaine: "Chimie",
        nom: "Conductimètre",
        description: "Mesure de la conductivité",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/conductimetre.pdf"
    },
    {
        domaine: "Chimie",
        nom: "Agitateurs magnétiques",
        description: "Agitation des solutions",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/agitateur_magnetique.pdf"
    },
    {
        domaine: "Chimie",
        nom: "Chauffe-ballon",
        description: "Chauffage de solutions",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/chauffe_ballon.pdf"
    },
    {
        domaine: "Chimie",
        nom: "Réactifs chimiques (acides, bases, sels)",
        description: "Pour expériences de chimie",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/reactifs_chimiques.pdf"
    },
    {
        domaine: "Chimie",
        nom: "Indicateurs colorés",
        description: "Repérage des équivalences en titrage",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/indicateurs_colorés.pdf"
    },
    {
        domaine: "Chimie",
        nom: "Spectrophotomètre",
        description: "Analyse spectrale des solutions",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/spectrophotometre.pdf"
    },

    // Thermique
    {
        domaine: "Thermique",
        nom: "Thermomètre numérique",
        description: "Mesure de température",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/thermometre.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Thermocouple",
        description: "Mesure de température en temps réel",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/thermocouple.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Calorimètre",
        description: "Mesure des échanges thermiques",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/calorimetre.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Caméra thermique",
        description: "Visualisation des transferts thermiques",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/camera_thermique.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Matériaux isolants (laine de verre, polystyrène)",
        description: "Étude de l'isolation thermique",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/materiaux_isolants.pdf"
    },

    // Signaux
    {
        domaine: "Signaux",
        nom: "Générateur de fonctions",
        description: "Production de signaux sonores et électriques",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/generateur_fonctions.pdf"
    },
    {
        domaine: "Signaux",
        nom: "Microphone et haut-parleur",
        description: "Émission et réception de signaux sonores",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/micro_hautparleur.pdf"
    },
    {
        domaine: "Signaux",
        nom: "Oscilloscope (pour signaux sonores)",
        description: "Visualisation des signaux sonores",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/oscilloscope_son.pdf"
    },
    {
        domaine: "Signaux",
        nom: "Sonomètre",
        description: "Mesure du niveau sonore",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/sonometre.pdf"
    },
    {
        domaine: "Signaux",
        nom: "Fibre optique et émetteur/récepteur",
        description: "Transmission de signaux lumineux",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/fibre_optique_signal.pdf"
    },

    // Sécurité
    {
        domaine: "Sécurité",
        nom: "Blouse de laboratoire",
        description: "Protection des vêtements",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/blouse_laboratoire.pdf"
    },
    {
        domaine: "Sécurité",
        nom: "Lunettes de protection",
        description: "Protection des yeux",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/lunettes_protection.pdf"
    },
    {
        domaine: "Sécurité",
        nom: "Gants de protection",
        description: "Protection des mains",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/gants_protection.pdf"
    },
    {
        domaine: "Sécurité",
        nom: "Extincteur (CO2)",
        description: "Sécurité incendie",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/extincteur.pdf"
    },
    {
        domaine: "Sécurité",
        nom: "Tapis anti-fatigue",
        description: "Confort et sécurité au poste de travail",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/tapis_antifatigue.pdf"
    },
    {
        domaine: "Sécurité",
        nom: "Douche oculaire",
        description: "Urgence en cas de projection",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/douche_oculaire.pdf"
    },
    {
        domaine: "Sécurité",
        nom: "Armoire de sécurité pour produits chimiques",
        description: "Stockage sécurisé des réactifs",
        lieuStockage: "",
        noticeUtilisation: "assets/notice/armoire_securite.pdf"
    }
];

export default laboratoryEquipment;
