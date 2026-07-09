/**
 * tp00-titrages.js
 * TP00 — Dissolution - Dilution
 * Architecture modulaire :
 *  - utils.js
 *  - securite.js
 *  - materiel.js
 *  - radar.js
 *  - balance-erreurs.js
 *  - compte-rendu.js
 */

 /* ==========================================================
    IMPORTS
    ========================================================== */
import products from "../../data/products.js";
import dangerDB from "../../data/dangerDB.js";
import pictogrammes from "../../data/pictogrammes.js";
import glassware from "../../data/glassware.js";
import laboratoryEquipment from "../../data/equipment.js";

import {
    initSections,
    initTabs,
    lireTexte,
    appliquerFiltresCategorie,
    appartientCategorie,
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
    initBalanceErreurs
} from "../../js/balance-erreurs.js";

import {
    genererCompteRendu
} from "../../js/compte-rendu.js";

/* ==========================================================
   VARIABLES
   ========================================================== */
let reactifCourant = null;
let dejaInitialise = false;
let mesures = [];
let zoomRange = null;

/* ==========================================================
   INITIALISATION TP00
   ========================================================== */
export function init() {
    if (dejaInitialise) return;
    dejaInitialise = true;

    console.log("TP00 — Initialisation des calculs de dissolution et dilution.");

    // Initialiser les sections et onglets
    initSections();
    initTabs();

    // Initialiser la liste des réactifs (section Sécurité)
    initReactifSelect();

    // Initialiser les calculs de dissolution
    initCalculsDissolution();

    // Initialiser les calculs de dilution
    initCalculsDilution();

    // Initialiser le matériel
    initMateriel({
        verreId: "materiel-verrerie",
        equipementId: "materiel-equipements",
        glassware,
        equipment: laboratoryEquipment,
        categorie: "Sels"
    });

    // Autres initialisations
    initParametresTitrage();
    initMesures();
    initCourbe();
    initCorrection();
    initBalanceErreurs();
    initBoutonImpressionCR();
    initRadarCompetences();
}

/* ==========================================================
   REACTIF + FILTRE SECURITE
   ========================================================== */
function initReactifSelect() {
    const select = $("reactif");
    if (!select) {
        console.warn("Select #reactif introuvable dans le DOM TP00");
        return;
    }

    function rafraichir() {
        appliquerFiltresCategorie(select, products, "filtre-cat");
        afficherSecurite();
    }

    document.querySelectorAll(".filtre-cat").forEach(cb => {
        cb.addEventListener("change", rafraichir);
    });

    select.addEventListener("change", () => {
        afficherSecurite();
        updateDissolutionInfo(); // Met à jour les infos de dissolution
    });

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
   DISSOLUTION : MISE À JOUR DES INFORMATIONS
   ========================================================== */
function updateDissolutionInfo() {
    const cas = $("reactif")?.value;
    const produit = trouverProduit(products, cas);

    const nomReactifSpan = $("nom-reactif-selectionne");
    const formuleReactifSpan = $("formule-reactif-selectionne");
    const masseMolaireSpan = $("masse-molaire-reactif-selectionne");
    const resDissolutionDiv = $("res-dissolution");

    if (!produit || !nomReactifSpan || !formuleReactifSpan || !masseMolaireSpan || !resDissolutionDiv) {
        return;
    }

    // Mettre à jour les informations du produit
    nomReactifSpan.textContent = produit.nom || '-';
    formuleReactifSpan.textContent = produit.formule || '-';
    masseMolaireSpan.textContent = (produit.masseMolaire || 0).toFixed(2);

    // Recalculer la masse à peser
    calculDissolution();
}

/* ==========================================================
   DISSOLUTION : CALCUL DE LA MASSE À PESER
   ========================================================== */
function calculDissolution() {
    const c = parseFloat($("c-dissolution")?.value) || 0;
    const v = parseFloat($("v-dissolution")?.value) || 0;
    const m = parseFloat($("masse-molaire-reactif-selectionne")?.textContent) || 0;
    const resDissolutionDiv = $("res-dissolution");

    if (!resDissolutionDiv) return;

    if (!$("reactif")?.value || c <= 0 || v <= 0 || m <= 0) {
        resDissolutionDiv.textContent = 'Veuillez sélectionner un réactif et remplir tous les champs.';
        return;
    }

    // Convertir le volume de mL en L
    const vL = v / 1000;
    const masse = c * vL * m;

    resDissolutionDiv.textContent = `Masse à peser : ${masse.toFixed(4)} g`;
}

/* ==========================================================
   INITIALISATION DES ÉCOUTEURS POUR LA DISSOLUTION
   ========================================================== */
function initCalculsDissolution() {
    // Écouter les changements dans les champs de concentration et volume
    $("c-dissolution")?.addEventListener("input", calculDissolution);
    $("v-dissolution")?.addEventListener("input", calculDissolution);
}

/* ==========================================================
   DILUTION : CALCUL DU VOLUME À PRÉLEVER
   ========================================================== */
function calculDilution() {
    const c1 = parseFloat($("c1-hcl")?.value) || 0;
    const c2 = parseFloat($("c2-hcl")?.value) || 0;
    const v2 = parseFloat($("v2-hcl")?.value) || 0;
    const resDilutionDiv = $("res-hcl");

    if (!resDilutionDiv) return;

    if (c1 <= 0 || c2 <= 0 || v2 <= 0) {
        resDilutionDiv.textContent = 'Veuillez remplir tous les champs.';
        return;
    }

    // Calculer V1 = (C2 × V2) / C1
    const v1 = (c2 * v2) / c1;
    resDilutionDiv.textContent = `Volume à prélever : ${v1.toFixed(2)} mL`;
}

/* ==========================================================
   INITIALISATION DES ÉCOUTEURS POUR LA DILUTION
   ========================================================== */
function initCalculsDilution() {
    // Écouter les changements dans les champs de dilution
    $("c1-hcl")?.addEventListener("input", calculDilution);
    $("c2-hcl")?.addEventListener("input", calculDilution);
    $("v2-hcl")?.addEventListener("input", calculDilution);
}

/* ==========================================================
   INITIALISATION AU CHARGEMENT
   ========================================================== */
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

/* ==========================================================
   TABLEAU DE MESURES
   ========================================================== */
function initMesures() {
    // Logique pour le tableau de mesures (à compléter si nécessaire)
}

/* ==========================================================
   COURBE DE TITRAGE
   ========================================================== */
function initCourbe() {
    // Logique pour la courbe de titrage (à compléter si nécessaire)
}

/* ==========================================================
   PARAMÈTRES DE TITRAGE
   ========================================================== */
function initParametresTitrage() {
    // Logique pour les paramètres de titrage (à compléter si nécessaire)
}

/* ==========================================================
   CORRECTION DES ERREURS DE MESURE
   ========================================================== */
function initCorrection() {
    // Logique pour la correction des erreurs (à compléter si nécessaire)
}

/* ==========================================================
   BOUTON IMPRESSION COMPTE-RENDU
   ========================================================== */
function initBoutonImpressionCR() {
    const btn = $("btn-imprimer");
    if (!btn) return;
    btn.addEventListener("click", lancerCompteRendu);
}

function recupererAutoEvaluation() {
    const competences = ["APP", "ANA", "REA", "VAL", "COM"];
    const scores = {};
    competences.forEach(c => {
        const choix = document.querySelector(`input[name="${c}"]:checked`);
        scores[c] = choix ? Number(choix.value) : null;
    });
    return scores;
}

function lancerCompteRendu() {
    const identite = {
        nom: lireTexte("nom-eleve"),
        prenom: lireTexte("prenom-eleve"),
        classe: lireTexte("classe-eleve"),
        date: $("date-eleve")?.value || ""
    };

    const nomReactif = reactifCourant?.nom || "—";
    const autoEval = recupererAutoEvaluation();

    const sections = [
        {
            titre: "Paramètres du titrage",
            items: [
                { label: "Réactif", valeur: nomReactif },
                { label: "Volume Va", valeur: "—" },
                { label: "Concentration Ca estimée", valeur: "—" },
                { label: "Concentration Cb titrante", valeur: "—" },
                { label: "Volume équivalent théorique", valeur: "—" }
            ]
        },
        {
            titre: "Résultats expérimentaux",
            items: [
                { label: "Volume équivalent (dérivée)", valeur: "—" },
                { label: "Concentration calculée", valeur: "—" },
                { label: "Écart sur Ve", valeur: "—" },
                { label: "Erreur relative", valeur: "—" }
            ]
        }
    ];

    for (let i = 1; i <= 10; i++) {
        const texte = lireTexte(`question${i}`);
        if (texte) {
            sections.push({
                titre: `Question ${i}`,
                texte
            });
        }
    }

    const resume = lireTexte("resume-tp");
    if (resume) {
        sections.push({
            titre: "Résumé du TP",
            texte: resume
        });
    }

    sections.push({
        titre: "Auto-évaluation des compétences",
        items: [
            { label: "APP", valeur: autoEval.APP ?? "—" },
            { label: "ANA", valeur: autoEval.ANA ?? "—" },
            { label: "REA", valeur: autoEval.REA ?? "—" },
            { label: "VAL", valeur: autoEval.VAL ?? "—" },
            { label: "COM", valeur: autoEval.COM ?? "—" }
        ]
    });

    const materiel = getMaterielSelectionne();
    if (materiel.length) {
        sections.push({
            titre: "Matériel utilisé",
            texte: materiel.join(" • ")
        });
    }

    genererCompteRendu({
        domaine: "Chimie",
        tp: "TP01",
        titre: "Préparation de solutions par dissolution et dilution",
        sections,
        identiteDefaut: identite,
        signature: false,
        noteFinale: true
    });
}
