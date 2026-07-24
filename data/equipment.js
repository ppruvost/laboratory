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
        image:"assets/img/equipments/cordon.jpg",
        noticeUtilisation: "assets/notice/fils_connexion.pdf"
    },
    {
        domaine: "Électricité",
        nom: "Pinces crocodile",
        categorie: ["Redox"],
        description: "Connexion de circuits",
        lieu: "Salle B7 / étagère A1",
        image:"assets/img/equipments/pince-crocodile.jpg",
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
     categorie: ["Dissolution", "pHmétrie", "Organique"],
     description: "Agitation des solutions",
     lieu: "Salle B27 / étagère D4",
     image:"assets/img/equipments/agitateur_magnetique.png",         
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
    image:"assets/img/equipments/balance_mettler.jpg",
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
    categorie: ["Dissolution", "pHmétrie", "Organique"],
    description: "Chauffage de solutions, montage à reflux",
    lieu: "Salle B27 / étagère C1",
    image:"assets/img/equipments/chauffe_ballon.jpg",         
    noticeUtilisation: "assets/notice/chauffe_ballon.pdf"
    },
    {domaine: "Chimie",
    nom: "Lames métalliques (Zn, Cu, Fe, Pb, Al)",
    categorie: ["Redox"],
    description: "Électrodes des demi-piles, à décaper avant chaque usage",
    lieu: "Salle B27 / étagère D1",
    image: "assets/img/equipments/lame_metal.png",
    noticeUtilisation: ""
    },
    {
    domaine: "Chimie",
    nom: "Papier à l'acétate de plomb",
    categorie: ["Indicateur"],
    description: "Papier détecteur des ions sulfure et du sulfure d'hydrogène (H₂S) par noircissement.",
    lieu: "Salle B27 / étagère D4",
    image: "assets/img/equipments/papier_acetate_plomb.jpg",
    noticeUtilisation: "assets/notice/papier_acetate_plomb.pdf"
    },
    {
    domaine: "Chimie",
    nom: "Papier phénolphtaléine",
    categorie: ["Indicateur", "pHmétrie"],
    description: "Papier imprégné de phénolphtaléine, incolore en milieu acide et rose en milieu basique.",
    lieu: "Salle B27 / étagère D4",
    image: "assets/img/equipments/papier_phenolphtaleine.jpeg",
    noticeUtilisation: "assets/notice/papier_phenolphtaleine.pdf"
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
    nom: "Papier tournesol bleu",
    categorie: ["Indicateur", "pHmétrie"],
    description: "Papier indicateur virant au rouge en présence d'une solution acide.",
    lieu: "Salle B27 / étagère D4",
    image: "assets/img/equipments/papier_tournesol_bleu.jpg",
    noticeUtilisation: "assets/notice/papier_tournesol_bleu.pdf"
    },
    {
    domaine: "Chimie",
    nom: "Papier tournesol neutre",
    categorie: ["Indicateur", "pHmétrie"],
    description: "Papier indicateur permettant de distinguer les solutions acides et basiques.",
    lieu: "Salle B27 / étagère D4",
    image: "assets/img/equipments/papier_tournesol_neutre.jpg",
    noticeUtilisation: "assets/notice/papier_tournesol_neutre.pdf"
    },
    {
    domaine: "Chimie",
    nom: "Papier tournesol rouge",
    categorie: ["Indicateur", "pHmétrie"],
    description: "Papier indicateur virant au bleu en présence d'une solution basique.",
    lieu: "Salle B27 / étagère D4",
    image: "assets/img/equipments/papier_tournesol_rouge.jpg",
    noticeUtilisation: "assets/notice/papier_tournesol_rouge.pdf"
    },    
    {
    domaine: "Chimie",
    nom: "pH-mètre",
    categorie: ["Dissolution", "pHmétrie"],
    description: "Mesure du pH des solutions",
     lieu: "Salle B27 / étagère D4",
     image:"assets/img/equipments/pHmetre.jpg",
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
    image: "assets/img/equipments/potence.png",
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
    categorie: ["Dissolution", "pHmétrie", "Organique"],
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
    image: "assets/img/equipments/toile-emeri.png",
    noticeUtilisation: ""
    },
   

    // Thermique
    {
        domaine: "Thermique",
        nom: "Thermomètre numérique",
        categorie: ["Température", "Capteurs", "Equilibre", "ChangementEtat", "Transferts"],
        description: "Mesure de température de référence, par contact",
        lieu: "Salle B27 - ***",
        image:"",        
        noticeUtilisation: "assets/notice/thermometre.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Thermistance",
        categorie: ["Température", "Capteurs"],
        description: "Capteur de température à résistance non linéaire, à associer à un multimètre",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: ""
    },
    {
        domaine: "Thermique",
        nom: "Sonde à résistance de platine (Pt100)",
        categorie: ["Température", "Capteurs"],
        description: "Capteur de température à résistance linéaire (R₀ = 100 Ω, α = 0,00385 °C⁻¹)",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: ""
    },
    {
        domaine: "Thermique",
        nom: "Thermocouple",
        categorie: ["Température", "Capteurs"],
        description: "Mesure de température en temps réel par tension thermoélectrique",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: "assets/notice/thermocouple.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Thermomètre à infrarouge",
        categorie: ["Température", "Capteurs"],
        description: "Mesure de température sans contact, par rayonnement infrarouge (visée laser)",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: ""
    },
    {
        domaine: "Thermique",
        nom: "Bandelette à cristaux liquides",
        categorie: ["Température", "Capteurs"],
        description: "Indicateur visuel de température par contact, changement de couleur selon la plage indiquée",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: ""
    },
    {
        domaine: "Thermique",
        nom: "Multimètre",
        categorie: ["Température", "Capteurs"],
        description: "Mesure de résistance associée à la thermistance ou à la sonde Pt100",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: "assets/notice/multimetre.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Millivoltmètre",
        categorie: ["Température", "Capteurs"],
        description: "Mesure de la tension délivrée par un thermocouple",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: ""
    },
    {
        domaine: "Thermique",
        nom: "Calorimètre",
        categorie: ["Température", "Equilibre"],
        description: "Mesure des échanges thermiques (enceinte isolée + agitateur)",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: "assets/notice/calorimetre.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Bain thermostaté",
        categorie: ["Température", "Capteurs"],
        description: "Chauffage régulé d'un liquide à une température de consigne",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: ""
    },
    {
        domaine: "Thermique",
        nom: "Plaque chauffante",
        categorie: ["Température", "Equilibre", "ChangementEtat"],
        description: "Chauffage d'un liquide ou d'un solide",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: ""
    },
    {
        domaine: "Thermique",
        nom: "Support et pince pour capteurs",
        categorie: ["Température", "Capteurs"],
        description: "Maintien d'un capteur de température en position de mesure",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: ""
    },
    {
        domaine: "Thermique",
        nom: "Agitateur",
        categorie: ["Température", "Equilibre", "ChangementEtat"],
        description: "Homogénéisation d'un mélange ou d'un bain (calorimètre, bain thermostaté)",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: ""
    },
    {
        domaine: "Thermique",
        nom: "Bec bunsen",
        categorie: ["Température", "Combustion", "Transferts"],
        description: "Source de chaleur par combustion, réglage flamme complète/incomplète",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: ""
    },
    {
        domaine: "Thermique",
        nom: "Hotte aspirante",
        categorie: ["Température", "Combustion"],
        description: "Évacuation sécurisée des gaz de combustion",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: ""
    },
    {
        domaine: "Thermique",
        nom: "Lampe halogène / infrarouge sur support",
        categorie: ["Température", "Transferts"],
        description: "Source de rayonnement thermique pour l'étude de l'échauffement à distance",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: ""
    },
    {
        domaine: "Thermique",
        nom: "Tiges de conduction thermique (métal, bois, plastique, verre)",
        categorie: ["Température", "Transferts"],
        description: "Comparaison qualitative de la conduction thermique de plusieurs matériaux",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: ""
    },
    {
        domaine: "Thermique",
        nom: "Caméra thermique",
        categorie: ["Température", "Optique", "Transferts"],
        description: "Visualisation des transferts thermiques",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: "assets/notice/camera_thermique.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Matériaux isolants (laine de verre, polystyrène)",
        categorie: ["Température", "Transferts"],
        description: "Étude de l'isolation thermique",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: "assets/notice/materiaux_isolants.pdf"
    },
    {
        domaine: "Thermique",
        nom: "Chronomètre",
        categorie: ["Température", "Equilibre", "ChangementEtat", "Transferts"],
        description: "Mesure du temps lors des relevés de température (paliers, suivi temporel)",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: ""
    },
    {
        domaine: "Thermique",
        nom: "Balance",
        categorie: ["Température", "Equilibre", "ChangementEtat", "Combustion"],
        description: "Pesée des masses d'eau ou de glace utilisées lors des manipulations",
        lieu: "Salle B27 - ***",
        image:"",
        noticeUtilisation: ""
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
        categorie: ["Dilution", "Dissolution", "pHmétrie", "Organique"],
        lieu: "Salle B27 - Paillasse E2",
        image:"assets/img/equipments/blouse.jpg",
        noticeUtilisation: "assets/notice/blouse_laboratoire.pdf"
    },
    {
        domaine: "Sécurité",
        nom: "Lunettes de protection",
        categorie: ["Dilution", "Dissolution", "pHmétrie", "Organique"],
        description: "Protection des yeux",
        lieu: "Salle B27 - Etagère D2",
        image:"assets/img/equipments/lunette.jpg",
        noticeUtilisation: "assets/notice/lunettes_protection.pdf"
    },
    {
        domaine: "Sécurité",
        nom: "Gants de protection",
        categorie: ["Dilution", "Dissolution", "pHmétrie", "Organique"],
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
