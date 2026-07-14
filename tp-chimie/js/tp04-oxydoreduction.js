/**
 * tp04-oxydoreduction.js
 * TP04 — Oxydoréduction (piles et potentiels électrochimiques)
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
   DONNEES LOCALES — potentiels normaux d'oxydoréduction
   (couples métal / ion métallique, chapitre "classification
   quantitative des couples oxydant-réducteur")
   ========================================================== */

const METAUX = [
    { id: "Mg", symbole: "Mg", charge: 2, e0: -2.37 },
    { id: "Al", symbole: "Al", charge: 3, e0: -1.66 },
    { id: "Zn", symbole: "Zn", charge: 2, e0: -0.76 },
    { id: "Fe", symbole: "Fe", charge: 2, e0: -0.44 },
    { id: "Ni", symbole: "Ni", charge: 2, e0: -0.257 },
    { id: "Sn", symbole: "Sn", charge: 2, e0: -0.14 },
    { id: "Pb", symbole: "Pb", charge: 2, e0: -0.13 },
    { id: "Cu", symbole: "Cu", charge: 2, e0: 0.34 },
    { id: "Ag", symbole: "Ag", charge: 1, e0: 0.80 },
    { id: "Au", symbole: "Au", charge: 3, e0: 1.50 }
];

// Couple de référence (non inclus dans METAUX : ce n'est pas un couple
// métal / ion métallique, il a sa propre logique dans l'onglet "acide").
const COUPLE_H2 = { id: "H2", nom: "H⁺ / H₂", e0: 0.00 };

const EXPOSANTS = { 1: "", 2: "²", 3: "³" };

/* ==========================================================
   VARIABLES
   ========================================================== */
let reactifCourant = null;
let dejaInitialise = false;

/* ==========================================================
   INITIALISATION TP04
   ========================================================== */
export function init() {
    if (dejaInitialise) return;
    dejaInitialise = true;

    console.log("TP04 — Initialisation Oxydoréduction.");

    initSections();
    initTabs();
    initReactifSelect();
    initMateriel({
        verreId: "materiel-verrerie",
        equipementId: "materiel-equipements",
        glassware,
        equipment: laboratoryEquipment,
        categorie: "Redox"
    });
    initTabReactionAcide();
    initTabPileElectrochimique();
    initTabClassification();
    initBoutonImpressionCR();
    initRadarCompetences();
}

/* ==========================================================
   REACTIF + FILTRE SECURITE  (identique au pattern TP01)
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
   OUTILS NUMERIQUES (pgcd / ppcm)
   ========================================================== */

function pgcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a || 1;
}

function ppcm(a, b) {
    return Math.abs(a * b) / pgcd(a, b);
}

function ion(metal) {
    const exp = EXPOSANTS[metal.charge] || metal.charge;
    return `${metal.symbole}${exp}⁺`;
}

/* ==========================================================
   ONGLET "Réaction avec un acide"
   ========================================================== */

function initTabReactionAcide() {
    const select = $("select-metal-acide");
    const zone = $("resultat-acide");
    if (!select || !zone) return;

    select.innerHTML = '<option value="">-- Sélectionner --</option>' +
        METAUX.map(m => `<option value="${m.id}">${m.symbole} (${ion(m)} / ${m.symbole})</option>`).join("");

    select.addEventListener("change", () => {
        const metal = METAUX.find(m => m.id === select.value);
        zone.innerHTML = rendreReactionAcide(metal);
    });
}

function rendreReactionAcide(metal) {
    if (!metal) return "Sélectionner un métal pour prédire la réaction avec une solution acide.";

    if (metal.e0 >= COUPLE_H2.e0) {
        return `
            <p><strong>${metal.symbole}</strong> (E° = ${metal.e0.toFixed(2)} V) est un réducteur plus faible que H₂ (E° = 0,00 V).</p>
            <p>Aucune réaction observée : ${metal.symbole} ne réagit pas avec les ions H⁺ d'une solution acide diluée.</p>
        `;
    }

    const n = metal.charge;
    const g = pgcd(2, n);
    const coeffMetal = 2 / g;
    const coeffH = (2 * n) / g;
    const coeffH2 = n / g;

    const eqMetal = coeffMetal > 1 ? `${coeffMetal} ${metal.symbole}` : metal.symbole;
    const eqIon = coeffMetal > 1 ? `${coeffMetal} ${ion(metal)}` : ion(metal);
    const eqH = `${coeffH} H⁺`;
    const eqH2 = coeffH2 > 1 ? `${coeffH2} H₂` : "H₂";

    return `
        <p><strong>${metal.symbole}</strong> (E° = ${metal.e0.toFixed(2)} V) est un réducteur plus fort que H₂ (E° = 0,00 V).</p>
        <p>Réaction observée : dégagement de dihydrogène, mis en évidence à la flamme.</p>
        <p><strong>Équation-bilan :</strong> ${eqMetal} + ${eqH} → ${eqIon} + ${eqH2}</p>
    `;
}

/* ==========================================================
   ONGLET "Pile électrochimique"
   ========================================================== */

function calculerPile(idA, idB) {
    const a = METAUX.find(m => m.id === idA);
    const b = METAUX.find(m => m.id === idB);
    if (!a || !b || a.id === b.id) return null;

    const oxydant = a.e0 >= b.e0 ? a : b;   // potentiel le plus élevé → réduit à la cathode (borne +)
    const reducteur = a.e0 >= b.e0 ? b : a; // potentiel le plus bas → oxydé à l'anode (borne -)

    const fem = Math.abs(a.e0 - b.e0);
    const n = ppcm(oxydant.charge, reducteur.charge);
    const kOx = n / oxydant.charge;
    const kRed = n / reducteur.charge;

    return { oxydant, reducteur, fem, n, kOx, kRed };
}

function rendreResultatPile(resultat) {
    if (!resultat) return "Sélectionner deux couples différents pour construire la pile.";

    const { oxydant, reducteur, fem, n, kOx, kRed } = resultat;

    const prefixe = (k) => (k > 1 ? `${k} ` : "");

    const demiCathode = `${prefixe(kOx)}${ion(oxydant)} + ${n} e⁻ → ${prefixe(kOx)}${oxydant.symbole}`;
    const demiAnode = `${prefixe(kRed)}${reducteur.symbole} → ${prefixe(kRed)}${ion(reducteur)} + ${n} e⁻`;
    const bilan = `${prefixe(kOx)}${ion(oxydant)} + ${prefixe(kRed)}${reducteur.symbole} → ${prefixe(kOx)}${oxydant.symbole} + ${prefixe(kRed)}${ion(reducteur)}`;
    const notation = `− ${reducteur.symbole} ∣ ${ion(reducteur)} ∥ ${ion(oxydant)} ∣ ${oxydant.symbole} +`;

    return `
        <p><strong>f.é.m. théorique :</strong> E = |${oxydant.e0.toFixed(2)} − (${reducteur.e0.toFixed(2)})| = <strong>${fem.toFixed(2)} V</strong></p>
        <p><strong>Borne positive (cathode, réduction) :</strong> ${oxydant.symbole} / ${ion(oxydant)}</p>
        <p><strong>Borne négative (anode, oxydation) :</strong> ${reducteur.symbole} / ${ion(reducteur)}</p>
        <p><strong>Demi-équation à la cathode :</strong> ${demiCathode}</p>
        <p><strong>Demi-équation à l'anode :</strong> ${demiAnode}</p>
        <p><strong>Équation de fonctionnement :</strong> ${bilan}</p>
        <p><strong>Notation conventionnelle :</strong> ${notation}</p>
    `;
}

function initTabPileElectrochimique() {
    const selectA = $("select-couple-a");
    const selectB = $("select-couple-b");
    const zone = $("resultat-pile");
    if (!selectA || !selectB || !zone) return;

    const options = '<option value="">-- Sélectionner --</option>' +
        METAUX.map(m => `<option value="${m.id}">${ion(m)} / ${m.symbole} (E° = ${m.e0.toFixed(2)} V)</option>`).join("");

    selectA.innerHTML = options;
    selectB.innerHTML = options;

    const rafraichir = () => {
        const resultat = calculerPile(selectA.value, selectB.value);
        zone.innerHTML = rendreResultatPile(resultat);
    };

    selectA.addEventListener("change", rafraichir);
    selectB.addEventListener("change", rafraichir);
}

/* ==========================================================
   ONGLET "Classification"
   ========================================================== */

function initTabClassification() {
    const tbody = $("tbody-classification");
    if (!tbody) return;

    const tous = [...METAUX, COUPLE_H2].sort((a, b) => a.e0 - b.e0);

    tbody.innerHTML = tous.map(item => {
        const nom = item.nom || `${ion(item)} / ${item.symbole}`;
        return `<tr><td>${nom}</td><td>${item.e0.toFixed(2)}</td></tr>`;
    }).join("");
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

    const sections = [
        {
            titre: "Réactif de sécurité consulté",
            items: [
                { label: "Réactif", valeur: reactifCourant?.nom || "—" }
            ]
        }
    ];

    document.querySelectorAll(".questions-tp > li").forEach((li, index) => {
        const zone = li.querySelector("textarea");
        if (!zone) return;

        const titreQuestion = li.querySelector(".question-entete strong")
            ?.textContent.replace(/\s+/g, " ").trim() || `Question ${index + 1}`;
        const competence = li.querySelector(".cartouche")?.dataset.comp || "";

        sections.push({
            titre: titreQuestion,
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
        tp: "TP04",
        titre: "Oxydoréduction — Piles et potentiels électrochimiques",
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
