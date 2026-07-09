/**
 * tp00-titrages.js
 *
 * TP00 — Dissolution - dilution
 *
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

import products
    from "../../data/products.js";

import dangerDB
    from "../../data/dangerDB.js";

import pictogrammes
    from "../../data/pictogrammes.js";

import glassware
    from "../../data/glassware.js";

import laboratoryEquipment
    from "../../data/equipment.js";


import {
    initSections,
    initTabs,
    lireTexte,
    appliquerFiltresCategorie,
    appartientCategorie
}
from "../../js/utils.js";


import {
    afficherSecuriteProduit,
    trouverProduit
}
from "../../js/securite.js";


import {
    initMateriel,
    getMaterielSelectionne
}
from "../../js/materiel.js";


import {
    initRadarCompetences
}
from "../../js/radar.js";


import {
    initBalanceErreurs
}
from "../../js/balance-erreurs.js";


import {
    genererCompteRendu
}
from "../../js/compte-rendu.js";






/* ==========================================================
   VARIABLES
   ========================================================== */

let reactifCourant = null;

let dejaInitialise = false;

let mesures = [];

let zoomRange = null; // { vMin, vMax } ou null = auto



/* ==========================================================
   RACCOURCI DOM
   ========================================================== */

document.addEventListener('DOMContentLoaded', function() {
  // === Éléments de la section "Préparation des solutions" ===
  const nomReactifSpan = document.getElementById('nom-reactif-selectionne');
  const formuleReactifSpan = document.getElementById('formule-reactif-selectionne');
  const masseMolaireSpan = document.getElementById('masse-molaire-reactif-selectionne');
  const cDissolutionInput = document.getElementById('c-dissolution');
  const vDissolutionInput = document.getElementById('v-dissolution');
  const resDissolutionDiv = document.getElementById('res-dissolution');

  // === Éléments de la section "Sécurité" ===
  const reactifSelect = document.getElementById('reactif');

  // === Fonction pour mettre à jour les informations du produit sélectionné ===
  function updateProductInfo() {
    const selectedOption = reactifSelect.options[reactifSelect.selectedIndex];

    if (!selectedOption.value) {
      // Aucun produit sélectionné
      nomReactifSpan.textContent = '-';
      formuleReactifSpan.textContent = '-';
      masseMolaireSpan.textContent = '-';
      resDissolutionDiv.textContent = 'Sélectionner un réactif.';
      return;
    }

    // Récupérer les attributs personnalisés
    const nom = selectedOption.getAttribute('data-nom') || selectedOption.textContent;
    const formule = selectedOption.getAttribute('data-formule') || '-';
    const masseMolaire = parseFloat(selectedOption.getAttribute('data-masse-molaire')) || 0;

    // Mettre à jour les informations dans la section "Préparation des solutions"
    nomReactifSpan.textContent = nom;
    formuleReactifSpan.textContent = formule;
    masseMolaireSpan.textContent = masseMolaire.toFixed(2);

    // Recalculer la masse à peser
    calculateMasse();
  }

  // === Fonction pour calculer la masse à peser (m = C × V × M) ===
  function calculateMasse() {
    const c = parseFloat(cDissolutionInput.value) || 0;
    const v = parseFloat(vDissolutionInput.value) || 0;
    const m = parseFloat(masseMolaireSpan.textContent) || 0;

    if (!reactifSelect.value || c <= 0 || v <= 0 || m <= 0) {
      resDissolutionDiv.textContent = 'Veuillez sélectionner un réactif et remplir tous les champs.';
      return;
    }

    // Convertir le volume de mL en L
    const vL = v / 1000;
    const masse = c * vL * m;

    resDissolutionDiv.textContent = `Masse à peser : ${masse.toFixed(4)} g`;
  }

  // === Écouter les changements ===
  // 1. Changement de produit sélectionné
  reactifSelect.addEventListener('change', updateProductInfo);

  // 2. Changement de concentration ou de volume
  cDissolutionInput.addEventListener('input', calculateMasse);
  vDissolutionInput.addEventListener('input', calculateMasse);

  // === Initialisation au chargement ===
  updateProductInfo();
});

/* ==========================================================
   INITIALISATION TP00
   ========================================================== */

export function init() {

    if (dejaInitialise)
        return;

    dejaInitialise = true;

    console.log("TP00 Dissolution- Dilution");


    initSections();

    initTabs();


    initReactifSelect();


    initMateriel({

        verreId:
            "materiel-verrerie",

        equipementId:
            "materiel-equipements",

        glassware,

        equipment:
            laboratoryEquipment,

        categorie:
            "Sels"

    });


    initParametresTitrage();

    initMesures();

    initCourbe();

    initCorrection();

    initBalanceErreurs();

    initBoutonImpressionCR();

    initRadarCompetences();    

}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        init
    );

}
else {

    init();

}

/* ==========================================================
   REACTIF + FILTRE SECURITE
   ========================================================== */

function initReactifSelect() {

    const select =
        $("reactif");

    if (!select) {
        console.warn(
            "Select #reactif introuvable dans le DOM TP00"
        );
        return;
    }

    function rafraichir() {

        appliquerFiltresCategorie(
            select,
            products,
            "filtre-cat"
        );

        afficherSecurite();

    }

    document
        .querySelectorAll(".filtre-cat")
        .forEach(
            cb =>
            cb.addEventListener(
                "change",
                rafraichir
            )
        );

    select.addEventListener(
        "change",
        afficherSecurite
    );

    rafraichir();

}


function afficherSecurite() {

    const cas =
        $("reactif")?.value;

    const produit =
        trouverProduit(products, cas);

    reactifCourant =
        produit;

    afficherSecuriteProduit({

        produit,

        dangerDB,

        pictogrammes,

        zoneId:
            "securite-bloc"

    });

}
/* ==========================================================
   CŒUR DU TP01 — SELECT REACTIF (DISSOLUTION)
   ========================================================== */

function initReactifDissolution() {
    // On n'a plus besoin de #reactif-dissolution, car on utilise #reactif (section Sécurité)
    // On écoute simplement les changements sur #reactif
    const reactifSelect = document.getElementById('reactif');
    if (!reactifSelect) {
        console.warn("Select #reactif introuvable dans le DOM.");
        return;
    }

    // Écouter les changements de sélection
    reactifSelect.addEventListener('change', updateDissolutionInfo);
}

/* ==========================================================
   MISE À JOUR DES INFORMATIONS DE DISSOLUTION
   ========================================================== */

function updateDissolutionInfo() {
    const cas = document.getElementById('reactif')?.value;
    const produit = trouverProduit(products, cas);

    if (!produit) {
        // Réinitialiser les champs si aucun produit n'est sélectionné
        document.getElementById('nom-reactif-selectionne')?.textContent = '-';
        document.getElementById('formule-reactif-selectionne')?.textContent = '-';
        document.getElementById('masse-molaire-reactif-selectionne')?.textContent = '-';
        document.getElementById('res-dissolution')?.textContent = 'Sélectionner un réactif.';
        return;
    }

    // Mettre à jour les informations du produit
    document.getElementById('nom-reactif-selectionne')?.textContent = produit.nom || '-';
    document.getElementById('formule-reactif-selectionne')?.textContent = produit.formule || '-';
    document.getElementById('masse-molaire-reactif-selectionne')?.textContent = (produit.masseMolaire || 0).toFixed(2);

    // Recalculer la masse à peser
    calculDissolution();
}

/* ==========================================================
   CALCUL DE LA MASSE À PESER (DISSOLUTION)
   ========================================================== */

function calculDissolution() {
    const c = parseFloat(document.getElementById('c-dissolution')?.value) || 0;
    const v = parseFloat(document.getElementById('v-dissolution')?.value) || 0;
    const m = parseFloat(document.getElementById('masse-molaire-reactif-selectionne')?.textContent) || 0;

    const resDissolutionDiv = document.getElementById('res-dissolution');
    if (!resDissolutionDiv) return;

    if (!document.getElementById('reactif')?.value || c <= 0 || v <= 0 || m <= 0) {
        resDissolutionDiv.textContent = 'Veuillez sélectionner un réactif et remplir tous les champs.';
        return;
    }

    // Convertir le volume de mL en L
    const vL = v / 1000;
    const masse = c * vL * m;

    resDissolutionDiv.textContent = `Masse à peser : ${masse.toFixed(4)} g`;
}

/* ==========================================================
   INITIALISATION DES ÉCOUTEURS POUR LES CALCULS
   ========================================================== */

function initCalculsDissolution() {
    // Écouter les changements dans les champs de concentration et volume
    document.getElementById('c-dissolution')?.addEventListener('input', calculDissolution);
    document.getElementById('v-dissolution')?.addEventListener('input', calculDissolution);
}

/* ==========================================================
   INITIALISATION COMPLÈTE
   ========================================================== */

export function init() {
    if (dejaInitialise) return;
    dejaInitialise = true;

    console.log("TP01 — Initialisation des calculs de dissolution.");

    // Initialiser les sections et onglets
    initSections();
    initTabs();

    // Initialiser la liste des réactifs (section Sécurité)
    initReactifSelect();

    // Initialiser les calculs de dissolution
    initReactifDissolution();
    initCalculsDissolution();

    // Initialiser le matériel
    initMateriel({
        verreId: "materiel-verrerie",
        equipementId: "materiel-equipements",
        glassware,
        equipment: laboratoryEquipment,
        categorie: "Sels"
    });

    // Autres initialisations (à conserver si nécessaire)
    initParametresTitrage();
    initMesures();
    initCourbe();
    initCorrection();
    initBalanceErreurs();
    initBoutonImpressionCR();
    initRadarCompetences();
}

// Appel de l'initialisation
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

/* ==========================================================
   TABLEAU DE MESURES
   ========================================================== */




/* ==========================================================
   CORRECTION DES ERREURS DE MESURE
   ========================================================== */


/* ==========================================================
   BOUTON IMPRESSION COMPTE-RENDU
   ========================================================== */

function initBoutonImpressionCR() {

    const btn =
        $("btn-imprimer");

    if (!btn) return;

    btn.addEventListener("click", lancerCompteRendu);

}


function recupererAutoEvaluation() {

    const competences =
        ["APP", "ANA", "REA", "VAL", "COM"];

    const scores = {};

    competences.forEach(c => {

        const choix =
            document.querySelector(`input[name="${c}"]:checked`);

        scores[c] =
            choix ? Number(choix.value) : null;

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


    const { va, ca, cb } =
        getParametresTitrage();

    const veTheo =
        $("ve-theo")?.textContent || "—";

    const veExp =
        $("ve-derivee")?.textContent || "—";

    const caExp =
        $("ca-derivee")?.textContent || "—";

    const ecart =
        $("ecart-ve")?.textContent || "—";

    const erreurRel =
        $("erreur-relative")?.textContent || "—";


    const nomReactif =
        reactifCourant?.nom || "—";


    const autoEval =
        recupererAutoEvaluation();


    const sections = [

        {

            titre: "Paramètres du titrage",

            items: [

                { label: "Réactif", valeur: nomReactif },
                { label: "Volume Va", valeur: `${va} mL` },
                { label: "Concentration Ca estimée", valeur: `${ca} mol/L` },
                { label: "Concentration Cb titrante", valeur: `${cb} mol/L` },
                { label: "Volume équivalent théorique", valeur: veTheo }

            ]

        },

        {

            titre: "Résultats expérimentaux",

            items: [

                { label: "Volume équivalent (dérivée)", valeur: `${veExp} mL` },
                { label: "Concentration calculée", valeur: `${caExp} mol/L` },
                { label: "Écart sur Ve", valeur: `${ecart} mL` },
                { label: "Erreur relative", valeur: `${erreurRel} %` }

            ]

        }

    ];


    for (let i = 1; i <= 10; i++) {

        const texte =
            lireTexte(`question${i}`);

        sections.push({

            titre: `Question ${i}`,

            texte

        });

    }


    const resume =
        lireTexte("resume-tp");

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


    const materiel =
        getMaterielSelectionne();

    if (materiel.length) {

        sections.push({
            titre: "Matériel utilisé",
            texte: materiel.join(" • ")
        });

    }


    genererCompteRendu({

        domaine: "Chimie",
        tp: "TP03",
        titre: "Titrages acido-basiques (pH-métrie)",
        sections,
        identiteDefaut: identite,
        signature: false,
        noteFinale: true

    });

}
