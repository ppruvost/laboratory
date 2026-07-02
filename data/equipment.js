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
        nom: "Multimètre numérique",
        description: "Mesure de tension, courant, résistance",
        lieu: "Salle B27 / étagère A1",
        image:"",
        noticeUtilisation: "assets/notice/multimetre.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Oscilloscope numérique",
        description: "Visualisation de signaux électriques",
        lieu: "Salle B27 / étagère A1",
        image:"",
        noticeUtilisation: "assets/notice/oscilloscope.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Wattmètre",
        description: "Mesure de puissance électrique",
        lieu: "Salle B27 / étagère A1",
        image:"",
        noticeUtilisation: "assets/notice/wattmetre.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Transformateur (abaisseur/élévateur)",
        description: "Transformation de tension",
        lieu: "Salle B27 / étagère A1",
        image:"",
        noticeUtilisation: "assets/notice/transformateur.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Diode et pont de diodes",
        description: "Redressement de courant",
        lieu: "Salle B27 / étagère A2",
        image:"",
        noticeUtilisation: "assets/notice/diode.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Condensateurs (diverses capacités)",
        description: "Filtrage et stockage d'énergie",
        lieu: "Salle B27 / étagère A2",
        image:"",
        noticeUtilisation: "assets/notice/condensateur.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Moteur électrique (CC et CA)",
        description: "Conversion énergie électrique/mécanique",
        lieu: "Salle B23 / étagère B1",
        image:"",
        noticeUtilisation: "assets/notice/moteur_electrique.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Capteurs (température, lumière, pression)",
        description: "Acquisition de données expérimentales",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/capteurs.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Carte d'acquisition (ExAO)",
        description: "Interface pour expériences assistées par ordinateur",
        lieu: "Salle B25 / étagère A1",
        image:"",
        noticeUtilisation: "assets/notice/exao.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Résistances (diverses valeurs)",
        description: "Composants pour circuits électriques",
        lieu: "Salle B27 / A2",
        image:"",
        noticeUtilisation: "assets/notice/resistances.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Fils de connexion et câbles",
        description: "Connexion de circuits",
        lieu: "Salle B29 B25 / Support de cordons",
        image:"",
        noticeUtilisation: "assets/notice/fils_connexion.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Interrupteurs et boutons poussoirs",
        description: "Contrôle de circuits",
        lieu: "Salle B27 / étagère A2",
        image:"",
        noticeUtilisation: "assets/notice/interrupteurs.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Disjoncteur différentiel",
        description: "Protection des circuits",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/disjoncteur.pdf"
    },

    // Optique
    {
        domaine: "Optique",
        nom: "Lentilles convergentes et divergentes",
        description: "Étude des systèmes optiques",
        lieu: "Salle B23 / étagère A1",
        image:"",
        noticeUtilisation: "assets/notice/lentilles.pdf"
    },
    {
        domaine: "Optique",
        nom: "Banc d'optique",
        description: "Support pour expériences optiques",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/banc_optique.pdf"
    },
    {
        domaine: "Optique",
        nom: "Source lumineuse blanche",
        description: "Éclairage pour expériences optiques",
        lieu: "Salle B23 / étagère A2",
        image:"",
        noticeUtilisation: "assets/notice/source_lumineuse.pdf"
    },
    {
        domaine: "Optique",
        nom: "Laser (classe II)",
        description: "Source de lumière cohérente",
        lieu: "Salle B23 / étagère A2",
        image:"",
        noticeUtilisation: "assets/notice/laser.pdf"
    },
    {
        domaine: "Optique",
        nom: "Écran blanc",
        description: "Visualisation des images",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/ecran_blanc.pdf"
    },
    {
        domaine: "Optique",
        nom: "Prismes",
        description: "Décomposition de la lumière",
        lieu: "Salle B23 / étagère A2",
        image:"",
        noticeUtilisation: "assets/notice/prismes.pdf"
    },
    {
        domaine: "Optique",
        nom: "Fibre optique",
        description: "Transmission de la lumière",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/fibre_optique.pdf"
    },
    {
        domaine: "Optique",
        nom: "Luxmètre",
        description: "Mesure de l'éclairement lumineux",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/luxmetre.pdf"
    },
    {
        domaine: "Optique",
        nom: "Spectroscope",
        description: "Analyse spectrale de la lumière",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/spectroscope.pdf"
    },
    {
        domaine: "Optique",
        nom: "Filtres colorés",
        description: "Sélection de longueurs d'onde",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/filtres_colorés.pdf"
    },

    // Mécanique
    {
        domaine: "Mécanique",
        nom: "Chronomètre numérique",
        description: "Mesure de temps et de vitesses",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/chronometre.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Dynamomètre",
        description: "Mesure de forces",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/dynamometre.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Poulies et masses marquées",
        description: "Étude des forces et mouvements",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/poulies_masses.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Plan incliné",
        description: "Étude des forces et de l'équilibre",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/plan_incline.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Vérin hydraulique",
        description: "Étude de la pression et de la force pressante",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/verin_hydraulique.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Manomètre",
        description: "Mesure de pression",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/manometre.pdf"
    },
    {
        domaine: "Mécanique",
        nom: "Capteur de pression",
        description: "Mesure de pression dans les fluides",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/capteur_pression.pdf"
    },

    // Chimie
    
    {
        domaine: "Chimie",
        nom: "Pipettes",
        description: "Transfert précis de liquides",
        lieu: "Salle B27 / étagère E2",
        image:"",
        categorie: "Dissolution", 
        noticeUtilisation: "assets/notice/pipettes.pdf"
    },
    {
        domaine: "Chimie",
        nom: "Propipettes",
        description: "Transfert précis de liquides",
        lieu: "Salle B27 / étagère D4",
        image:"",
        categorie: "Dissolution", 
        noticeUtilisation: "assets/notice/propipettes.pdf"
    },
    {
        domaine: "Chimie",
        nom: "Burette",
        description: "Titrage et dosage",
        lieu: "Salle B27 / étagère E2",
        image:"",
        categorie: "Dissolution",        
        noticeUtilisation: "assets/notice/burette.pdf"
    },
    {
        domaine: "Chimie",
        nom: "pH-mètre",
        description: "Mesure du pH des solutions",
        lieu: "Salle B27 / étagère D4",
        image:"",
        categorie: "Dissolution", 
        noticeUtilisation: "assets/notice/phmetre.pdf"
    },
    {
        domaine: "Chimie",
        nom: "Conductimètre",
        description: "Mesure de la conductivité",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/conductimetre.pdf"
    },
    {
        domaine: "Chimie",
        nom: "Agitateurs magnétiques",
        description: "Agitation des solutions",
        lieu: "Salle B27 / étagère D4",
        image:"",
        categorie: "Dissolution", 
        noticeUtilisation: "assets/notice/agitateur_magnetique.pdf"
    },
    {
        domaine: "Chimie",
        nom: "Chauffe-ballon",
        description: "Chauffage de solutions",
        lieu: "Salle B27 / étagère C1",
        image:"",
        categorie: "Dissolution", 
        noticeUtilisation: "assets/notice/chauffe_ballon.pdf"
    },
    {
        domaine: "Chimie",
        nom: "Balance Jeulin 701 277",
        description: "capacité 2 000 g max",
        lieu: "Salle B27 / étagère C2",
        image: "assets/img/equipments/balance_jeulin.jpg",
        categorie: "Dissolution",
        description: "Précision ± 1 g",
        noticeUtilisation: "assets/notice/balance_jeulin.pdf"
    },
       {
        domaine: "Chimie",
        nom: "Balance METTLER TOLEDO PB602",
        description: "capacité 610 g max - 0,5 g min",
        lieu: "Salle B27 / pallasse E2",
        image:"",
        categorie: "Dissolution",
        description: "Précision ± 0,1 g",
        noticeUtilisation: "assets/notice/balance_mettler.pdf"
    }, 
    {
        domaine: "Chimie",
        nom: "Indicateurs colorés",
        description: "Repérage des équivalences en titrage",
        lieu: "Salle B27 / étagère D4",
        image:"",
        noticeUtilisation: "assets/notice/indicateurs_colorés.pdf"
    },
    {
        domaine: "Chimie",
        nom: "Spectrophotomètre",
        description: "Analyse spectrale des solutions",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/spectrophotometre.pdf"
    },

    // Thermique
    {
        domaine: "Thermique",
        nom: "Thermomètre numérique",
        description: "Mesure de température",
        lieu: "",
        image:"",
        categorie: "Dissolution", 
        noticeUtilisation: "assets/notice/thermometre.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Thermocouple",
        description: "Mesure de température en temps réel",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/thermocouple.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Calorimètre",
        description: "Mesure des échanges thermiques",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/calorimetre.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Caméra thermique",
        description: "Visualisation des transferts thermiques",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/camera_thermique.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Matériaux isolants (laine de verre, polystyrène)",
        description: "Étude de l'isolation thermique",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/materiaux_isolants.pdf"
    },

    // Signaux
    {
        domaine: "Signaux",
        nom: "Générateur de fonctions",
        description: "Production de signaux sonores et électriques",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/generateur_fonctions.pdf"
    },
    {
        domaine: "Signaux",
        nom: "Microphone et haut-parleur",
        description: "Émission et réception de signaux sonores",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/micro_hautparleur.pdf"
    },
    {
        domaine: "Signaux",
        nom: "Oscilloscope (pour signaux sonores)",
        description: "Visualisation des signaux sonores",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/oscilloscope_son.pdf"
    },
    {
        domaine: "Signaux",
        nom: "Sonomètre",
        description: "Mesure du niveau sonore",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/sonometre.pdf"
    },
    {
        domaine: "Signaux",
        nom: "Fibre optique et émetteur/récepteur",
        description: "Transmission de signaux lumineux",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/fibre_optique_signal.pdf"
    },

    // Sécurité
    {
        domaine: "Sécurité",
        nom: "Blouse de laboratoire",
        description: "Protection des vêtements",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/blouse_laboratoire.pdf"
    },
    {
        domaine: "Sécurité",
        nom: "Lunettes de protection",
        description: "Protection des yeux",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/lunettes_protection.pdf"
    },
    {
        domaine: "Sécurité",
        nom: "Gants de protection",
        description: "Protection des mains",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/gants_protection.pdf"
    },
    {
        domaine: "Sécurité",
        nom: "Extincteur (CO2)",
        description: "Sécurité incendie",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/extincteur.pdf"
    },
    {
        domaine: "Sécurité",
        nom: "Tapis anti-fatigue",
        description: "Confort et sécurité au poste de travail",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/tapis_antifatigue.pdf"
    },
    {
        domaine: "Sécurité",
        nom: "Douche oculaire",
        description: "Urgence en cas de projection",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/douche_oculaire.pdf"
    },
    {
        domaine: "Sécurité",
        nom: "Armoire de sécurité pour produits chimiques",
        description: "Stockage sécurisé des réactifs",
        lieu: "",
        image:"",
        noticeUtilisation: "assets/notice/armoire_securite.pdf"
    }
];

export default laboratoryEquipment;
