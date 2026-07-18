/**
 * tp05-chimie-organique.js
 * TP05 — Chimie organique (estérification, hydrolyse, oxydation des alcools,
 * identification de groupes caractéristiques)
 */

import products from "../../data/products.js";
import dangerDB from "../../data/dangerDB.js";
import pictogrammes from "../../data/pictogrammes.js";
import glassware from "../../data/glassware.js";
import laboratoryEquipment from "../../data/equipment.js";
import FILIERES_PRO from "../../data/filieres.js";

import {
    initSections,
    initTabs,
    lireTexte,
    appliquerFiltresCategorie,
    $
} from "../../js/utils.js";

import {
    afficherSecuriteProduit,
    trouverProduit
} from "../../js/securite.js";

import {
    initMateriel,
    getMaterielSelectionne
} from "../../js/materiel.js";

import {
    initRadarCompetences
} from "../../js/radar.js";

import {
    genererCompteRendu
} from "../../js/compte-rendu.js";

import {
    initContextePro,
    getFiliereSelectionnee
} from "../../js/contexte-pro.js";

/* ==========================================================
   CONTEXTE PROFESSIONNEL — TP05 (Chimie organique)
   Propre à ce TP : niveau Tle uniquement (cf. cadre bleu).
   ========================================================== */
const CONTEXTES_PRO_TP05 = {
    "tle-tci": {
        contexte: "Les ateliers de chaudronnerie utilisent des solvants organiques, des dégraissants et des vernis de protection contenant des esters, appréciés pour leur pouvoir solvant et leur odeur peu agressive comparée à d'autres solvants industriels.",
        problematique: "Comment expliquer, à partir de la réaction d'estérification, la formation des esters utilisés comme solvants ou composants de vernis en milieu industriel ?"
    },
    "tle-trpm": {
        contexte: "Les huiles de coupe et lubrifiants utilisés en usinage contiennent de plus en plus d'esters de synthèse, appréciés pour leur biodégradabilité par rapport aux lubrifiants d'origine pétrolière.",
        problematique: "Comment synthétiser en laboratoire un ester pouvant entrer dans la composition d'un lubrifiant biodégradable, et vérifier expérimentalement sa formation ?"
    },
    "tle-mcc": {
        contexte: "Le vinaigre (solution d'acide éthanoïque) est utilisé en teinture textile pour fixer certains colorants sur les fibres, et des esters parfumés sont ajoutés lors de la finition de certains textiles pour leur conférer une odeur agréable et durable.",
        problematique: "Comment expliquer, à partir de la réaction d'estérification, la formation des esters parfumés utilisés dans le traitement et la finition des textiles ?"
    }
};

/* ==========================================================
   DONNEES LOCALES — acides carboxyliques et alcools
   (chapitre "estérification / hydrolyse basique")
   ========================================================== */

const ACIDES = [
    { id: "methanoique",  nom: "acide méthanoïque (formique)",  formule: "HCOOH",          radical: "méthanoate" },
    { id: "ethanoique",   nom: "acide éthanoïque (acétique)",   formule: "CH₃COOH",        radical: "éthanoate" },
    { id: "propanoique",  nom: "acide propanoïque (propionique)", formule: "CH₃CH₂COOH",   radical: "propanoate" },
    { id: "butanoique",   nom: "acide butanoïque (butyrique)",  formule: "CH₃CH₂CH₂COOH",  radical: "butanoate" }
];

const ALCOOLS = [
    { id: "methanol",     nom: "méthanol",                          formule: "CH₃OH",     radical: "méthyle" },
    { id: "ethanol",      nom: "éthanol",                           formule: "C₂H₅OH",    radical: "éthyle" },
    { id: "propanol",     nom: "propan-1-ol",                       formule: "C₃H₇OH",    radical: "propyle" },
    { id: "isoamylique",  nom: "alcool isoamylique (3-méthylbutan-1-ol)", formule: "C₅H₁₁OH", radical: "isoamyle" }
];

// Odeurs caractéristiques de quelques esters bien connus (repère pour l'élève).
const ODEURS_ESTERS = {
    "ethanoique-isoamylique": "banane",
    "ethanoique-ethanol": "solvant (type dissolvant à ongles)",
    "ethanoique-propanol": "poire",
    "butanoique-methanol": "pomme",
    "butanoique-ethanol": "ananas",
    "propanoique-isoamylique": "pomme verte",
    "methanoique-ethanol": "rhum"
};

/* ==========================================================
   DONNEES LOCALES — oxydation ménagée des alcools
   (chapitre "test d'oxydation d'un alcool")
   ========================================================== */

const ALCOOLS_OXYDATION = [
    {
        id: "ethanol",
        nom: "éthanol",
        formule: "CH₃CH₂OH",
        classe: "primaire",
        produitDefaut: { nom: "éthanal", formule: "CH₃CHO", famille: "aldéhyde" },
        produitExces: { nom: "acide éthanoïque", formule: "CH₃COOH", famille: "acide carboxylique" }
    },
    {
        id: "propan-1-ol",
        nom: "propan-1-ol",
        formule: "CH₃CH₂CH₂OH",
        classe: "primaire",
        produitDefaut: { nom: "propanal", formule: "CH₃CH₂CHO", famille: "aldéhyde" },
        produitExces: { nom: "acide propanoïque", formule: "CH₃CH₂COOH", famille: "acide carboxylique" }
    },
    {
        id: "propan-2-ol",
        nom: "propan-2-ol",
        formule: "CH₃CHOHCH₃",
        classe: "secondaire",
        produitDefaut: { nom: "propanone (acétone)", formule: "CH₃COCH₃", famille: "cétone" },
        produitExces: { nom: "propanone (acétone)", formule: "CH₃COCH₃", famille: "cétone" }
    },
    {
        id: "methylpropan-2-ol",
        nom: "2-méthylpropan-2-ol (alcool tertiobutylique)",
        classe: "tertiaire",
        formule: "(CH₃)₃COH",
        produitDefaut: null,
        produitExces: null
    }
];

/* ==========================================================
   DONNEES LOCALES — test caractéristique du réactif de Fehling
   (chapitre "identification des groupes caractéristiques")
   ========================================================== */

const COMPOSES_FEHLING = [
    { id: "ethanal",    nom: "éthanal",              famille: "aldéhyde", positif: true },
    { id: "propanal",   nom: "propanal",              famille: "aldéhyde", positif: true },
    { id: "propanone",  nom: "propanone (acétone)",   famille: "cétone",   positif: false },
    { id: "butanone",   nom: "butanone",              famille: "cétone",   positif: false }
];

/* ==========================================================
   DONNEES LOCALES — groupes caractéristiques (tableau de repère)
   ========================================================== */

const GROUPES_CARACTERISTIQUES = [
    { famille: "Alcool",             groupe: "− OH",        exemple: "éthanol (CH₃CH₂OH)" },
    { famille: "Aldéhyde",           groupe: "− CHO",       exemple: "éthanal (CH₃CHO)" },
    { famille: "Cétone",             groupe: "C=O (interne)", exemple: "propanone (CH₃COCH₃)" },
    { famille: "Acide carboxylique", groupe: "− COOH",      exemple: "acide éthanoïque (CH₃COOH)" },
    { famille: "Ester",              groupe: "− COO −",     exemple: "éthanoate d'éthyle (CH₃COOC₂H₅)" }
];

/* ==========================================================
   VARIABLES
   ========================================================== */
let reactifCourant = null;
let dejaInitialise = false;

/* ==========================================================
   INITIALISATION TP05
   ========================================================== */
export function init() {
    if (dejaInitialise) return;
    dejaInitialise = true;

    console.log("TP05 — Initialisation Chimie organique.");

    initSections();
    initTabs();
    initContextePro({
        filieres: FILIERES_PRO,
        contextes: CONTEXTES_PRO_TP05
    });
    initReactifSelect();
    initMateriel({
        verreId: "materiel-verrerie",
        equipementId: "materiel-equipements",
        glassware,
        equipment: laboratoryEquipment,
        categorie: "Organique"
    });
    initTabEsterification();
    initTabHydrolyseBasique();
    initTabOxydationAlcool();
    initTabTestFehling();
    initTabGroupesCaracteristiques();
    initQuestionsParOnglet();
    initBoutonImpressionCR();
    initRadarCompetences();
}

/* ==========================================================
   REACTIF + FILTRE SECURITE  (identique au pattern TP04)
   ========================================================== */
function initReactifSelect() {
    const select = $("reactif");
    if (!select) {
        console.warn("Select #reactif introuvable dans le DOM.");
        return;
    }

    function rafraichir() {
        appliquerFiltresCategorie(select, products, "filtre-cat");
        afficherSecurite();
    }

    document.querySelectorAll(".filtre-cat").forEach(cb => {
        cb.addEventListener("change", rafraichir);
    });

    select.addEventListener("change", afficherSecurite);

    rafraichir();
}

function afficherSecurite() {
    const cas = $("reactif")?.value;
    const produit = trouverProduit(products, cas);
    reactifCourant = produit;

    afficherSecuriteProduit({
        produit,
        dangerDB,
        pictogrammes,
        zoneId: "securite-bloc"
    });
}

/* ==========================================================
   OUTILS — construction du nom et de la formule d'un ester
   ========================================================== */

function formuleEster(acide, alcool) {
    const acyle = acide.formule.replace(/OH$/, "");
    const alkyle = alcool.formule.replace(/OH$/, "");
    return `${acyle}O${alkyle}`;
}

function nomEster(acide, alcool) {
    return `${acide.radical} de ${alcool.radical}`;
}

function odeurEster(acide, alcool) {
    return ODEURS_ESTERS[`${acide.id}-${alcool.id}`] || null;
}

/* ==========================================================
   ONGLET "Estérification" (synthèse d'un ester)
   ========================================================== */

function calculerEsterification(idAcide, idAlcool) {
    const acide = ACIDES.find(a => a.id === idAcide);
    const alcool = ALCOOLS.find(a => a.id === idAlcool);
    if (!acide || !alcool) return null;
    return { acide, alcool };
}

function rendreEsterification(resultat) {
    if (!resultat) return "Sélectionner un acide carboxylique et un alcool pour prédire l'ester formé.";

    const { acide, alcool } = resultat;
    const ester = formuleEster(acide, alcool);
    const nom = nomEster(acide, alcool);
    const odeur = odeurEster(acide, alcool);

    return `
        <p><strong>Équation de la réaction d'estérification :</strong></p>
        <p>${acide.formule} + ${alcool.formule} ⇌ ${ester} + H₂O</p>
        <p><strong>Ester formé :</strong> ${nom} (${ester})</p>
        ${odeur ? `<p><strong>Odeur caractéristique :</strong> ${odeur}</p>` : ""}
        <p>Réaction lente, limitée et athermique : elle est accélérée par un catalyseur (quelques gouttes d'acide sulfurique concentré) et par le chauffage à reflux, sans en déplacer l'équilibre.</p>
    `;
}

function initTabEsterification() {
    const selectAcide = $("select-acide-esterification");
    const selectAlcool = $("select-alcool-esterification");
    const zone = $("resultat-esterification");
    if (!selectAcide || !selectAlcool || !zone) return;

    selectAcide.innerHTML = '<option value="">-- Sélectionner --</option>' +
        ACIDES.map(a => `<option value="${a.id}">${a.nom}</option>`).join("");
    selectAlcool.innerHTML = '<option value="">-- Sélectionner --</option>' +
        ALCOOLS.map(a => `<option value="${a.id}">${a.nom}</option>`).join("");

    const rafraichir = () => {
        const resultat = calculerEsterification(selectAcide.value, selectAlcool.value);
        zone.innerHTML = rendreEsterification(resultat);
    };

    selectAcide.addEventListener("change", rafraichir);
    selectAlcool.addEventListener("change", rafraichir);
}

/* ==========================================================
   ONGLET "Hydrolyse basique" (saponification d'un ester)
   ========================================================== */

function rendreHydrolyseBasique(resultat) {
    if (!resultat) return "Sélectionner un acide et un alcool pour reconstituer l'ester puis prédire les produits de son hydrolyse basique.";

    const { acide, alcool } = resultat;
    const ester = formuleEster(acide, alcool);
    const nomDeLester = nomEster(acide, alcool);
    const carboxylate = `${acide.formule.replace(/OH$/, "O⁻")} , Na⁺`;

    return `
        <p><strong>Ester hydrolysé :</strong> ${nomDeLester} (${ester})</p>
        <p><strong>Équation de l'hydrolyse basique (saponification) :</strong></p>
        <p>${ester} + Na⁺ + HO⁻ → ${carboxylate} + ${alcool.formule}</p>
        <p>Contrairement à l'estérification, l'hydrolyse basique est une réaction totale (non limitée) et exothermique : elle régénère l'alcool et forme le carboxylate de sodium correspondant (la « savonification » lorsque l'acide est une longue chaîne carbonée).</p>
    `;
}

function initTabHydrolyseBasique() {
    const selectAcide = $("select-acide-hydrolyse");
    const selectAlcool = $("select-alcool-hydrolyse");
    const zone = $("resultat-hydrolyse");
    if (!selectAcide || !selectAlcool || !zone) return;

    selectAcide.innerHTML = '<option value="">-- Sélectionner --</option>' +
        ACIDES.map(a => `<option value="${a.id}">${a.nom}</option>`).join("");
    selectAlcool.innerHTML = '<option value="">-- Sélectionner --</option>' +
        ALCOOLS.map(a => `<option value="${a.id}">${a.nom}</option>`).join("");

    const rafraichir = () => {
        const resultat = calculerEsterification(selectAcide.value, selectAlcool.value);
        zone.innerHTML = rendreHydrolyseBasique(resultat);
    };

    selectAcide.addEventListener("change", rafraichir);
    selectAlcool.addEventListener("change", rafraichir);
}

/* ==========================================================
   ONGLET "Oxydation ménagée d'un alcool"
   ========================================================== */

function rendreOxydationAlcool(alcool, exces) {
    if (!alcool) return "Sélectionner un alcool pour prédire le produit de son oxydation ménagée.";

    if (alcool.classe === "tertiaire") {
        return `
            <p><strong>${alcool.nom}</strong> (${alcool.formule}) est un alcool <strong>tertiaire</strong>.</p>
            <p>Aucune réaction : un alcool tertiaire ne possède pas d'atome d'hydrogène sur le carbone fonctionnel, il ne peut donc pas être oxydé par les oxydants usuels (permanganate, dichromate). La solution de permanganate de potassium reste violette.</p>
        `;
    }

    const produit = exces ? alcool.produitExces : alcool.produitDefaut;
    const classe = alcool.classe === "primaire" ? "primaire" : "secondaire";

    if (alcool.classe === "secondaire") {
        return `
            <p><strong>${alcool.nom}</strong> (${alcool.formule}) est un alcool <strong>secondaire</strong>.</p>
            <p>Oxydation ménagée en <strong>${produit.famille}</strong> : ${produit.nom} (${produit.formule}), quelle que soit la quantité d'oxydant utilisée (l'oxydation s'arrête à ce stade).</p>
            <p>La solution de permanganate de potassium, violette, se décolore (ou vire au brun en milieu neutre) au fur et à mesure de la réaction.</p>
        `;
    }

    return `
        <p><strong>${alcool.nom}</strong> (${alcool.formule}) est un alcool <strong>${classe}</strong>.</p>
        <p><strong>Avec un oxydant en défaut</strong> (ajout lent, distillation immédiate du produit formé) : oxydation limitée en <strong>${alcool.produitDefaut.famille}</strong>, ${alcool.produitDefaut.nom} (${alcool.produitDefaut.formule}).</p>
        <p><strong>Avec un oxydant en excès</strong> (chauffage à reflux prolongé) : oxydation complète en <strong>${alcool.produitExces.famille}</strong>, ${alcool.produitExces.nom} (${alcool.produitExces.formule}).</p>
        <p>La solution de permanganate de potassium, violette, se décolore au cours de la réaction.</p>
    `;
}

function initTabOxydationAlcool() {
    const selectAlcool = $("select-alcool-oxydation");
    const selectExces = $("select-quantite-oxydant");
    const zone = $("resultat-oxydation");
    if (!selectAlcool || !selectExces || !zone) return;

    selectAlcool.innerHTML = '<option value="">-- Sélectionner --</option>' +
        ALCOOLS_OXYDATION.map(a => `<option value="${a.id}">${a.nom} (${a.classe})</option>`).join("");

    const rafraichir = () => {
        const alcool = ALCOOLS_OXYDATION.find(a => a.id === selectAlcool.value);
        const exces = selectExces.value === "exces";
        zone.innerHTML = rendreOxydationAlcool(alcool, exces);
    };

    selectAlcool.addEventListener("change", rafraichir);
    selectExces.addEventListener("change", rafraichir);
}

/* ==========================================================
   ONGLET "Test du réactif de Fehling"
   ========================================================== */

function rendreTestFehling(compose) {
    if (!compose) return "Sélectionner un composé à tester au réactif de Fehling.";

    if (compose.positif) {
        return `
            <p><strong>${compose.nom}</strong> appartient à la famille des <strong>${compose.famille}s</strong>.</p>
            <p><strong>Test positif :</strong> un précipité rouge brique d'oxyde de cuivre (I), Cu₂O, se forme après chauffage au bain-marie avec la liqueur de Fehling (bleue).</p>
            <p>Ce test permet d'identifier spécifiquement le groupe caractéristique − CHO des aldéhydes.</p>
        `;
    }

    return `
        <p><strong>${compose.nom}</strong> appartient à la famille des <strong>${compose.famille}s</strong>.</p>
        <p><strong>Test négatif :</strong> aucun précipité ne se forme, la solution reste bleue.</p>
        <p>Une cétone ne réagit pas avec la liqueur de Fehling : ce test permet donc de distinguer un aldéhyde d'une cétone.</p>
    `;
}

function initTabTestFehling() {
    const select = $("select-compose-fehling");
    const zone = $("resultat-fehling");
    if (!select || !zone) return;

    select.innerHTML = '<option value="">-- Sélectionner --</option>' +
        COMPOSES_FEHLING.map(c => `<option value="${c.id}">${c.nom}</option>`).join("");

    select.addEventListener("change", () => {
        const compose = COMPOSES_FEHLING.find(c => c.id === select.value);
        zone.innerHTML = rendreTestFehling(compose);
    });
}

/* ==========================================================
   ONGLET "Groupes caractéristiques" (tableau de repère)
   ========================================================== */

function initTabGroupesCaracteristiques() {
    const tbody = $("tbody-groupes-caracteristiques");
    if (!tbody) return;

    tbody.innerHTML = GROUPES_CARACTERISTIQUES.map(g =>
        `<tr><td>${g.famille}</td><td>${g.groupe}</td><td>${g.exemple}</td></tr>`
    ).join("");
}

/* ==========================================================
   QUESTIONS DU COMPTE-RENDU
   Un bloc de 5 questions par onglet de manipulation ; seul le
   bloc correspondant à l'onglet actif est visible et imprimé.
   ========================================================== */

function afficherQuestionsTP(idOnglet) {

    document
        .querySelectorAll(".questions-bloc")
        .forEach(bloc => {

            bloc.hidden =
                bloc.dataset.tp !== idOnglet;

        });

}

function initQuestionsParOnglet() {

    const boutons =
        document.querySelectorAll(".tabs-container .tab-btn");

    if (!boutons.length) return;

    boutons.forEach(btn => {
        btn.addEventListener("click", () => afficherQuestionsTP(btn.dataset.tab));
    });

    const actif =
        document.querySelector(".tabs-container .tab-btn.actif") || boutons[0];

    afficherQuestionsTP(actif.dataset.tab);

}

/* ==========================================================
   BOUTON IMPRESSION COMPTE-RENDU
   ========================================================== */

function initBoutonImpressionCR() {
    const btn = $("btn-imprimer");
    if (!btn) return;
    btn.addEventListener("click", lancerCompteRendu);
}

function lancerCompteRendu() {
    const identite = {
        nom: lireTexte("nom-eleve"),
        prenom: lireTexte("prenom-eleve"),
        classe: lireTexte("classe-eleve"),
        date: $("date-eleve")?.value || ""
    };

    const filiereChoisie = getFiliereSelectionnee();

    const sections = [
        {
            titre: "Réactif de sécurité consulté",
            items: [
                { label: "Réactif", valeur: reactifCourant?.nom || "—" }
            ]
        }
    ];

    if (filiereChoisie) {
        sections.unshift({
            titre: "Contexte professionnel",
            items: [
                { label: "Filière", valeur: `${filiereChoisie.niveau} — ${filiereChoisie.filiere}` }
            ]
        });
    }

    // Seules les questions du bloc actuellement visible (onglet de
    // manipulation actif) sont incluses dans le compte-rendu.
    const blocActif = document.querySelector(".questions-bloc:not([hidden])");

    const liste = blocActif
        ? blocActif.querySelectorAll(".questions-tp > li")
        : document.querySelectorAll(".questions-tp > li");

    liste.forEach((li, index) => {
        const zone = li.querySelector("textarea");
        if (!zone) return;

        const titreQuestion = li.querySelector(".question-entete strong")
            ?.textContent.replace(/\s+/g, " ").trim() || `Question ${index + 1}`;
        const competence = li.querySelector(".cartouche")?.dataset.comp || "";
        const rappelProblematique = li.querySelector(".problematique-rappel")
            ?.textContent.replace(/\s+/g, " ").trim() || "";

        sections.push({
            titre: rappelProblematique ? `${titreQuestion} ${rappelProblematique}` : titreQuestion,
            competence,
            notation: true,
            texte: (zone.value || "").trim()
        });
    });

    const resume = lireTexte("resume-tp");
    if (resume) {
        sections.push({
            titre: "Résumé du TP",
            texte: resume
        });
    }

    const materiel = getMaterielSelectionne();
    if (materiel.length) {
        sections.push({
            titre: "Matériel utilisé",
            texte: materiel.join(" • ")
        });
    }

    genererCompteRendu({
        domaine: "Chimie",
        tp: "TP05",
        titre: "Chimie organique — Estérification, hydrolyse et groupes caractéristiques",
        sections,
        identiteDefaut: identite,
        signature: false,
        noteFinale: true
    });
}

/* ==========================================================
   INITIALISATION AU CHARGEMENT
   ========================================================== */
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
