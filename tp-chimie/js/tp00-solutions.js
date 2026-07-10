/**
 * tp00-solutions.js
 * TP00 — Dissolution - Dilution
 */

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

/* ==========================================================
   VARIABLES
   ========================================================== */
let reactifCourant = null;
let dejaInitialise = false;

/* ==========================================================
   INITIALISATION TP00
   ========================================================== */
export function init() {
    if (dejaInitialise) return;
    dejaInitialise = true;

    console.log("TP00 — Initialisation des calculs de dissolution et dilution.");

    initSections();
    initTabs();
    initReactifSelect();
    initCalculsDissolution();
    initCalculsDilution();
    initMateriel({
        verreId: "materiel-verrerie",
        equipementId: "materiel-equipements",
        glassware,
        equipment: laboratoryEquipment,
        categorie: "Dissolution"
    });
    initBoutonImpressionCR();
    initRadarCompetences();
    initBalanceErreurs();
}

/* ==========================================================
   REACTIF + FILTRE SECURITE
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

    select.addEventListener("change", () => {
        afficherSecurite();
        updateDissolutionInfo();
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
    const mDissolutionInput = $("m-dissolution");
    const resDissolutionDiv = $("res-dissolution");

    if (!produit) {
        if (nomReactifSpan) nomReactifSpan.textContent = '-';
        if (formuleReactifSpan) formuleReactifSpan.textContent = '-';
        if (masseMolaireSpan) masseMolaireSpan.textContent = '-';
        if (mDissolutionInput) mDissolutionInput.value = '';
        if (resDissolutionDiv) resDissolutionDiv.textContent = 'Sélectionner un réactif.';
        return;
    }

    // Mettre à jour les informations du produit
    if (nomReactifSpan) nomReactifSpan.textContent = produit.nom || '-';
    if (formuleReactifSpan) formuleReactifSpan.textContent = produit.formule || '-';
    if (masseMolaireSpan) masseMolaireSpan.textContent = (produit.masseMolaire || 0).toFixed(2);
    if (mDissolutionInput) mDissolutionInput.value = (produit.masseMolaire || 0).toFixed(2);

    // Mettre à jour le nom dans le tableau des résultats
    const nomSelTable = $("nom-sel-table");
    if (nomSelTable) nomSelTable.textContent = produit.nom || '-';

    // Recalculer la masse à peser
    calculDissolution();
}

/* ==========================================================
   DISSOLUTION : CALCUL DE LA MASSE À PESER
   ========================================================== */
function calculDissolution() {
    const c = parseFloat($("c-dissolution")?.value) || 0;
    const v = parseFloat($("v-dissolution")?.value) || 0;
    const m = parseFloat($("m-dissolution")?.value) || 0;
    const resDissolution = $("res-dissolution");

    if (!resDissolution) return;

    if (!$("reactif")?.value || c <= 0 || v <= 0 || m <= 0) {
        resDissolution.value = "";
        return;
    }

    const vL = v / 1000;
    const masse = c * vL * m;

    resDissolution.value = masse.toFixed(4);

    const tableMasseDissolution = $("table-masse-dissolution");
    if (tableMasseDissolution) {
        tableMasseDissolution.textContent = `${masse.toFixed(4)} g`;
    }
}

/* ==========================================================
   INITIALISATION DES ÉCOUTEURS POUR LA DISSOLUTION
   ========================================================== */
function initCalculsDissolution() {
    $("c-dissolution")?.addEventListener("input", calculDissolution);
    $("v-dissolution")?.addEventListener("input", calculDissolution);
    // Écouter aussi les changements de masse molaire (au cas où)
    $("m-dissolution")?.addEventListener("input", calculDissolution);
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
    $("c1-hcl")?.addEventListener("input", calculDilution);
    $("c2-hcl")?.addEventListener("input", calculDilution);
    $("v2-hcl")?.addEventListener("input", calculDilution);
}

/* ==========================================================
   ANALYSE DES ERREURS DE PESÉE
   ========================================================== */
function initBalanceErreurs() {
    // Écouter les changements dans les champs de pesée
    const inputs = [
        "pe-masse-theo",
        "pe-lue-01",
        "pe-lue-1g",
        "masse-exp-pesee",
        "c-exp-saisie"
    ];

    inputs.forEach(id => {
        $(id)?.addEventListener("input", () => {
            calculerErreursPesee();
            calculerEcart();
        });
    });

    // Initialiser les calculs
    calculerErreursPesee();
    calculerEcart();
}

function evaluerQualitePesee(erreurRelative) {
    if (erreurRelative === null || Number.isNaN(erreurRelative)) return "—";
    if (erreurRelative <= 2) return "Excellente précision";
    if (erreurRelative <= 5) return "Bonne précision";
    if (erreurRelative <= 10) return "Précision acceptable";
    return "Précision insuffisante";
}

function calculerErreursPesee() {
    const theo = Number($("pe-masse-theo")?.value) || 0;
    const lue01 = Number($("pe-lue-01")?.value) || 0;
    const lue1g = Number($("pe-lue-1g")?.value) || 0;

    const res01 = $("res-01");
    const res1g = $("res-1g");
    const synth = $("synthese-balances");

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
        if (res01) res01.textContent = `Écart : ${abs01.toFixed(3)} g (${rel01.toFixed(1)} %) — ${evaluerQualitePesee(rel01)}`;
    } else if (res01) {
        res01.textContent = "Saisir la masse mesurée.";
    }

    if (lue1g > 0) {
        abs1g = Math.abs(lue1g - theo);
        rel1g = (abs1g / theo) * 100;
        if (res1g) res1g.textContent = `Écart : ${abs1g.toFixed(3)} g (${rel1g.toFixed(1)} %) — ${evaluerQualitePesee(rel1g)}`;
    } else if (res1g) {
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
    } else if (synth) {
        synth.classList.add("hidden");
    }
}

function calculerEcart() {
    const masseTheo = Number($("pe-masse-theo")?.value) || 0;
    const masseExp = Number($("masse-exp-pesee")?.value) || 0;
    const cExp = Number($("c-exp-saisie")?.value) || 0;
    const resEcartDiv = $("res-ecart");
    const tableEcart = $("table-ecart");

    if (!resEcartDiv || masseTheo <= 0) {
        if (resEcartDiv) resEcartDiv.textContent = "Saisir la masse mesurée.";
        if (tableEcart) tableEcart.textContent = "—";
        return;
    }

    const ecartAbsolu = Math.abs(masseExp - masseTheo);
    const ecartRelatif = (ecartAbsolu / masseTheo) * 100;

    if (resEcartDiv) {
        resEcartDiv.textContent = `Écart absolu : ${ecartAbsolu.toFixed(4)} g | Écart relatif : ${ecartRelatif.toFixed(2)} %`;
    }
    if (tableEcart) {
        tableEcart.textContent = `${ecartRelatif.toFixed(2)} %`;
    }
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
    const cDissolution = $("c-dissolution")?.value || "—";
    const vDissolution = $("v-dissolution")?.value || "—";
    const masseTheo = $("pe-masse-theo")?.value || "—";
    const masseExp = $("masse-exp-pesee")?.value || "—";
    const cExp = $("c-exp-saisie")?.value || "—";

    const autoEval = recupererAutoEvaluation();

    const sections = [
        {
            titre: "Paramètres de la dissolution",
            items: [
                { label: "Réactif", valeur: nomReactif },
                { label: "Concentration visée (C)", valeur: `${cDissolution} mol/L` },
                { label: "Volume (V)", valeur: `${vDissolution} mL` },
                { label: "Masse théorique", valeur: `${masseTheo} g` },
                { label: "Masse pesée", valeur: `${masseExp} g` },
                { label: "Concentration expérimentale", valeur: `${cExp} mol/L` }
            ]
        },
        {
            titre: "Paramètres de la dilution",
            items: [
                { label: "Concentration mère (C₁)", valeur: `${$("c1-hcl")?.value || "—"} mol/L` },
                { label: "Concentration fille (C₂)", valeur: `${$("c2-hcl")?.value || "—"} mol/L` },
                { label: "Volume final (V₂)", valeur: `${$("v2-hcl")?.value || "—"} mL` },
                { label: "Volume à prélever (V₁)", valeur: `${$("res-hcl")?.textContent?.replace("Volume à prélever : ", "") || "—"}` }
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

/* ==========================================================
   INITIALISATION AU CHARGEMENT
   ========================================================== */
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
