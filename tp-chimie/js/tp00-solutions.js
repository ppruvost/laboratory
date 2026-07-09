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
   TABLEAU DE MESURES
   ========================================================== */




/* ==========================================================
   CORRECTION DES ERREURS DE MESURE
   ========================================================== */

function initCorrection() {

    $("btn-correction-erreurs")
        ?.addEventListener("click", () => {

            const panneau =
                $("panneau-correction");

            if (!panneau) return;

            panneau.style.display =
                panneau.style.display === "none" ? "" : "none";

        });

    $("btn-appliquer-offset")
        ?.addEventListener("click", appliquerOffsetPH);

    $("btn-lissage")
        ?.addEventListener("click", () => lisserMesures(3));

    $("btn-savgol")
        ?.addEventListener("click", () => lisserMesures(5));

    $("btn-detecter-aberrants")
        ?.addEventListener("click", detecterPointsAberrants);

}


function appliquerOffsetPH() {

    const offset =
        Number($("offset-ph")?.value) || 0;

    if (offset === 0) return;

    mesures.forEach(m => {
        m.pH = Number((m.pH + offset).toFixed(2));
    });

    rafraichirTableauMesures();
    dessinerCourbe();
    calculerResultatsAutomatiques();

}


function lisserMesures(fenetre) {

    if (mesures.length < fenetre) return;

    const tries =
        [...mesures].sort((a, b) => a.volume - b.volume);

    const demi =
        Math.floor(fenetre / 2);

    const lissees =
        tries.map((m, i) => {

            const debut = Math.max(0, i - demi);
            const fin = Math.min(tries.length, i + demi + 1);

            const fenetreValeurs =
                tries.slice(debut, fin).map(p => p.pH);

            const moyenne =
                fenetreValeurs.reduce((s, v) => s + v, 0) / fenetreValeurs.length;

            return { ...m, pH: Number(moyenne.toFixed(2)) };

        });

    mesures = lissees;

    rafraichirTableauMesures();
    dessinerCourbe();
    calculerResultatsAutomatiques();

}


function detecterPointsAberrants() {

    const zone =
        $("liste-points-suspects");

    if (!zone) return;

    if (mesures.length < 3) {

        zone.innerHTML =
            `<div class="info">Pas assez de mesures pour un diagnostic.</div>`;
        return;

    }

    const valeurs =
        mesures.map(m => m.pH);

    const moyenne =
        valeurs.reduce((s, v) => s + v, 0) / valeurs.length;

    const ecartType =
        Math.sqrt(
            valeurs.reduce((s, v) => s + (v - moyenne) ** 2, 0) / valeurs.length
        );

    const suspects =
        mesures.filter(m =>
            ecartType > 0 && Math.abs(m.pH - moyenne) / ecartType > 3
        );

    if (suspects.length === 0) {

        zone.innerHTML =
            `<div class="info">Aucun point aberrant détecté (seuil 3σ).</div>`;
        return;

    }

    zone.innerHTML =
        `<ul>` +
        suspects.map(m =>
            `<li>V = ${m.volume} mL — pH = ${m.pH} (écart important)</li>`
        ).join("") +
        `</ul>`;

}


function rafraichirTableauMesures() {

    const tbody =
        $("tbody-mesures");

    if (!tbody) return;

    tbody.innerHTML = "";

    mesures.forEach(m => {

        const tr =
            document.createElement("tr");

        tr.dataset.id = m.id;

        tr.innerHTML = `
            <td>
                <input type="number" step="0.01" class="input-volume" value="${m.volume}">
            </td>
            <td>
                <input type="number" step="0.01" class="input-ph" value="${m.pH}">
            </td>
            <td>
                <input type="text" class="input-observation" value="${m.observation || ""}">
            </td>
            <td>
                <button type="button" class="btn btn-danger btn-suppr-mesure">🗑</button>
            </td>
        `;

        tbody.appendChild(tr);

        tr.querySelector(".input-volume")
            .addEventListener("input", e => majMesure(m.id, "volume", Number(e.target.value)));

        tr.querySelector(".input-ph")
            .addEventListener("input", e => majMesure(m.id, "pH", Number(e.target.value)));

        tr.querySelector(".input-observation")
            .addEventListener("input", e => majMesure(m.id, "observation", e.target.value));

        tr.querySelector(".btn-suppr-mesure")
            .addEventListener("click", () => supprimerMesure(m.id, tr));

    });

}

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
