/**
 * tp01-solutions.js
 *
 * TP01 — Préparation de solutions (dissolution / dilution)
 *
 *  - utils.js
 *  - securite.js
 *  - materiel.js
 *  - balance-erreurs.js
 *  - compte-rendu.js

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
    calculDissolution,
    calculDilution,
    calculEcart
}
from "../../js/calculs.js";


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



/* ==========================================================
   RACCOURCI DOM
   ========================================================== */

function $(id) {
    return document.getElementById(id);
}



/* ==========================================================
   INITIALISATION TP01
   ========================================================== */

export function init() {

    if (dejaInitialise)
        return;

    dejaInitialise = true;

    console.log("TP01 Solutions initialisé");


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
            "Dissolution"

    });


    initModeOperatoireToggle();

    initCalculsTP01();

    initErreursPesee();

    initResultatsTableau();

    initBalanceErreurs();

    initBoutonImpressionCR();

    initRadarCompetences();


    // premier calcul
    calculDissolution();
    calculDilution();

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
            "Select #reactif introuvable dans le DOM TP01"
        );
        return;
    }

    function rafraichir() {

        try {

            appliquerFiltresCategorie(
                select,
                products,
                "filtre-cat"
            );

        }
        catch (err) {

            console.error(
                "TP01 — échec du filtrage du réactif (#reactif) :",
                err
            );

        }

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

    // Le même réactif alimente le calculateur de dissolution
    mettreAJourChampsDissolution(produit);

}


/* ==========================================================
   MISE A JOUR DES CHAMPS DE DISSOLUTION
   (déclenchée par le select unique #reactif)
   ========================================================== */

function mettreAJourChampsDissolution(produit) {

    const correspondances = {

        "nom-reactif":
            produit?.nom || "-",

        "formule-dissolution":
            produit?.formule || "-",

        "nom-sel-table":
            produit?.nom || "Réactif sélectionné"

    };

    Object.entries(correspondances)
        .forEach(([id, val]) => {

            const el = $(id);

            if (el)
                el.textContent = val;

        });

    const masse =
        $("m-dissolution");

    if (masse)
        masse.value =
            produit?.masseMolaire || "";

    calculDissolution();

}

/* ==========================================================
   BASCULE DES MODES OPERATOIRES (onglets Dissolution/Dilution)
   ========================================================== */

function initModeOperatoireToggle() {

    document
        .querySelectorAll(".tabs-header .tab-btn")
        .forEach(btn => {

            btn.addEventListener("click", () => {
                afficherModeOperatoire(btn.dataset.tab);
            });

        });

}


function afficherModeOperatoire(type) {

    const dissolution =
        $("modeDissolution");

    const dilution =
        $("modeDilution");

    if (!dissolution || !dilution)
        return;

    if (type === "dissolution") {

        dissolution.classList.remove("hidden");
        dilution.classList.add("hidden");

    }
    else {

        dissolution.classList.add("hidden");
        dilution.classList.remove("hidden");

    }

}

/* ==========================================================
   CALCULS TP01 (dissolution / dilution)
   ========================================================== */

function initCalculsTP01() {

    [
        "c-dissolution",
        "v-dissolution",
        "m-dissolution"
    ]
    .forEach(
        id => {

            $(id)?.addEventListener(
                "input",
                calculDissolution
            );

        }
    );


    [
        "c1-hcl",
        "c2-hcl",
        "v2-hcl"
    ]
    .forEach(
        id => {

            $(id)?.addEventListener(
                "input",
                calculDilution
            );

        }
    );

}

/* ==========================================================
   ANALYSE DES ERREURS DE PESEE (balances 0,1 g / 1 g)
   ========================================================== */

function initErreursPesee() {

    [
        "pe-masse-theo",
        "pe-lue-01",
        "pe-lue-1g"
    ]
    .forEach(
        id => {

            $(id)?.addEventListener(
                "input",
                calculerErreursPesee
            );

        }
    );

    calculerErreursPesee();

}


function evaluerQualitePesee(erreurRelative) {

    if (erreurRelative === null || Number.isNaN(erreurRelative))
        return "—";

    if (erreurRelative <= 2)
        return "Excellente précision";

    if (erreurRelative <= 5)
        return "Bonne précision";

    if (erreurRelative <= 10)
        return "Précision acceptable";

    return "Précision insuffisante";

}


function calculerErreursPesee() {

    const theo =
        Number($("pe-masse-theo")?.value) || 0;

    const lue01 =
        Number($("pe-lue-01")?.value) || 0;

    const lue1g =
        Number($("pe-lue-1g")?.value) || 0;

    const res01 =
        $("res-01");

    const res1g =
        $("res-1g");

    const synth =
        $("synthese-balances");

    if (theo <= 0) {

        if (res01) res01.textContent = "Saisir la masse théorique attendue.";
        if (res1g) res1g.textContent = "Saisir la masse théorique attendue.";
        if (synth) synth.classList.add("hidden");

        return;

    }

    let abs01 = null, rel01 = null;
    let abs1g = null, rel1g = null;

    if (lue01 > 0) {

        abs01 = Math.abs(lue01 - theo);
        rel01 = (abs01 / theo) * 100;

        if (res01)
            res01.textContent =
                `Écart : ${abs01.toFixed(3)} g (${rel01.toFixed(1)} %) — ${evaluerQualitePesee(rel01)}`;

    }
    else if (res01) {

        res01.textContent = "Saisir la masse mesurée.";

    }

    if (lue1g > 0) {

        abs1g = Math.abs(lue1g - theo);
        rel1g = (abs1g / theo) * 100;

        if (res1g)
            res1g.textContent =
                `Écart : ${abs1g.toFixed(3)} g (${rel1g.toFixed(1)} %) — ${evaluerQualitePesee(rel1g)}`;

    }
    else if (res1g) {

        res1g.textContent = "Saisir la masse mesurée.";

    }

    if (synth && (lue01 > 0 || lue1g > 0)) {

        synth.classList.remove("hidden");

        if ($("syn-lue-01")) $("syn-lue-01").textContent = lue01 > 0 ? `${lue01.toFixed(1)} g` : "—";
        if ($("syn-lue-1g")) $("syn-lue-1g").textContent = lue1g > 0 ? `${lue1g.toFixed(0)} g` : "—";

        if ($("syn-abs-01")) $("syn-abs-01").textContent = abs01 !== null ? `${abs01.toFixed(3)} g` : "—";
        if ($("syn-abs-1g")) $("syn-abs-1g").textContent = abs1g !== null ? `${abs1g.toFixed(3)} g` : "—";

        if ($("syn-rel-01")) $("syn-rel-01").textContent = rel01 !== null ? `${rel01.toFixed(1)} %` : "—";
        if ($("syn-rel-1g")) $("syn-rel-1g").textContent = rel1g !== null ? `${rel1g.toFixed(1)} %` : "—";

        if ($("syn-qual-01")) $("syn-qual-01").textContent = evaluerQualitePesee(rel01);
        if ($("syn-qual-1g")) $("syn-qual-1g").textContent = evaluerQualitePesee(rel1g);

    }
    else if (synth) {

        synth.classList.add("hidden");

    }

}

/* ==========================================================
   TABLEAU DE RESULTATS
   ========================================================== */

function initResultatsTableau() {

    $("masse-exp-pesee")
        ?.addEventListener("input", calculEcart);

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


    const nomReactif =
        reactifCourant?.nom || "—";

    const formule =
        reactifCourant?.formule || "—";

    const masseMolaire =
        $("m-dissolution")?.value || "—";

    const C =
        $("c-dissolution")?.value || "—";

    const V =
        $("v-dissolution")?.value || "—";

    const masseTheo =
        $("table-masse-dissolution")?.textContent || "—";

    const masseExp =
        $("masse-exp-pesee")?.value || "—";

    const ecart =
        $("table-ecart")?.textContent || "—";


    const C1 =
        $("c1-hcl")?.value || "—";

    const C2 =
        $("c2-hcl")?.value || "—";

    const V2 =
        $("v2-hcl")?.value || "—";

    const V1 =
        (Number(C1) > 0 && Number(C2) > 0)
        ? (Number(C2) * Number(V2) / Number(C1)).toFixed(2)
        : "—";


    const autoEval =
        recupererAutoEvaluation();


    const sections = [

        {

            titre: "Paramètres de la dissolution",

            items: [

                { label: "Réactif", valeur: `${nomReactif} (${formule})` },
                { label: "Masse molaire", valeur: `${masseMolaire} g/mol` },
                { label: "Concentration visée", valeur: `${C} mol/L` },
                { label: "Volume préparé", valeur: `${V} mL` },
                { label: "Masse théorique", valeur: `${masseTheo} g` },
                { label: "Masse pesée", valeur: `${masseExp} g` },
                { label: "Écart relatif", valeur: `${ecart}` }

            ]

        },

        {

            titre: "Paramètres de la dilution",

            items: [

                { label: "Concentration mère C₁", valeur: `${C1} mol/L` },
                { label: "Concentration fille C₂", valeur: `${C2} mol/L` },
                { label: "Volume final V₂", valeur: `${V2} mL` },
                { label: "Volume prélevé V₁", valeur: `${V1} mL` }

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
        tp: "TP01",
        titre: "Préparation de solutions par dissolution et dilution",
        sections,
        identiteDefaut: identite,
        signature: false,
        noteFinale: true

    });

}
