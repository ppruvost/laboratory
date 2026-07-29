/**
 * tp04-oxydoreduction.js
 * TP04 — Oxydoréduction : classification, piles, corrosion, protection
 * (+ notions complémentaires "Accumulateur", TCI/TRPM uniquement)
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

import {
    initOngletsParFiliere
} from "../../js/onglets-filiere.js";


/* ==========================================================
   CONTEXTE PROFESSIONNEL — TP04 (Oxydoréduction)
   Commun aux 3 filières en Terminale (cf. référentiel).
   ========================================================== */
const CONTEXTES_PRO_TP04 = {
    "tle-tci": {
        contexte: "Les structures métalliques d'un atelier de chaudronnerie (charpentes, cuves, tuyauteries) sont exposées à la corrosion. Un choix de matériaux mal informé, ou l'absence de protection adaptée (revêtement, anode sacrificielle), peut conduire à des défaillances coûteuses et dangereuses.",
        problematique: "Comment prévoir et limiter la corrosion d'une structure métallique en fonction des couples oxydant/réducteur en présence ?"
    },
    "tle-trpm": {
        contexte: "Les pièces mécaniques usinées puis stockées ou exposées à l'humidité peuvent se corroder avant même leur mise en service. Comprendre les mécanismes de corrosion permet de choisir un traitement de surface ou un métal adapté dès la conception.",
        problematique: "Comment le classement des couples oxydant/réducteur permet-il de choisir un métal ou un revêtement limitant la corrosion d'une pièce mécanique ?"
    },
    "tle-mcc": {
        contexte: "Certains accessoires métalliques utilisés en confection (boutons-pression, fermetures, mors de machine) peuvent se corroder au contact de produits d'entretien ou d'humidité, tachant les tissus ou se bloquant. Comprendre l'oxydoréduction aide à anticiper et limiter ce phénomène.",
        problematique: "Comment expliquer la corrosion d'un accessoire métallique utilisé en confection, et quelles solutions permettent de la limiter ?"
    }
};

/* ==========================================================
   DONNEES CHIMIE — couples et métaux
   ========================================================== */

// Classement de réactivité usuel (du plus fort réducteur au plus
// faible), pour les métaux couramment disponibles en salle B27.
const METAUX_DB = {

    Al: { nom: "Aluminium (Al)", couple: "Al³⁺/Al", reactifAcide: true },
    Zn: { nom: "Zinc (Zn)",      couple: "Zn²⁺/Zn", reactifAcide: true },
    Fe: { nom: "Fer (Fe)",       couple: "Fe²⁺/Fe", reactifAcide: true },
    Pb: { nom: "Plomb (Pb)",     couple: "Pb²⁺/Pb", reactifAcide: false },
    Cu: { nom: "Cuivre (Cu)",    couple: "Cu²⁺/Cu", reactifAcide: false }

};

const COUPLES_DB = {
    "Al3+/Al": { nom: "Al³⁺ / Al", rang: 1 },
    "Zn2+/Zn": { nom: "Zn²⁺ / Zn", rang: 2 },
    "Fe2+/Fe": { nom: "Fe²⁺ / Fe", rang: 3 },
    "Pb2+/Pb": { nom: "Pb²⁺ / Pb", rang: 4 },
    "Cu2+/Cu": { nom: "Cu²⁺ / Cu", rang: 5 }
};

const ACCUMULATEURS_DB = {

    plomb: {
        nom: "Accumulateur au plomb",
        decharge: "Décharge : Pb + SO₄²⁻ → PbSO₄ + 2e⁻ (oxydation à l'électrode négative) ; PbO₂ + SO₄²⁻ + 4H⁺ + 2e⁻ → PbSO₄ + 2H₂O (réduction à l'électrode positive)",
        charge: "Charge (sens inverse imposé) : PbSO₄ + 2e⁻ → Pb + SO₄²⁻ à l'électrode négative ; PbSO₄ + 2H₂O → PbO₂ + SO₄²⁻ + 4H⁺ + 2e⁻ à l'électrode positive",
        tensionNominale: 2.1
    },

    nicd: {
        nom: "Accumulateur Nickel-Cadmium (Ni-Cd)",
        decharge: "Décharge : Cd + 2HO⁻ → Cd(OH)₂ + 2e⁻ (oxydation) ; 2NiO(OH) + 2H₂O + 2e⁻ → 2Ni(OH)₂ + 2HO⁻ (réduction)",
        charge: "Charge (sens inverse imposé) : Cd(OH)₂ + 2e⁻ → Cd + 2HO⁻ ; 2Ni(OH)₂ + 2HO⁻ → 2NiO(OH) + 2H₂O + 2e⁻",
        tensionNominale: 1.2
    },

    liion: {
        nom: "Accumulateur Lithium-ion (Li-ion)",
        decharge: "Décharge : les ions Li⁺ migrent de l'électrode négative (graphite) vers l'électrode positive (oxyde métallique lithié), avec transfert d'électrons dans le circuit externe",
        charge: "Charge (sens inverse imposé) : les ions Li⁺ migrent de l'électrode positive vers l'électrode négative, où ils s'insèrent dans le graphite",
        tensionNominale: 3.7
    }

};

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

    initContextePro({
        filieres: FILIERES_PRO,
        contextes: CONTEXTES_PRO_TP04
    });

    initReactifSelect();

    initMateriel({
        verreId: "materiel-verrerie",
        equipementId: "materiel-equipements",
        glassware,
        equipment: laboratoryEquipment,
        categorie: "Redox"
    });

    initTabReactionAcide();
    initTabClassificationQualitative();
    initTabPileElectrochimique();
    initTabClassification();
    initTabCorrosionPassivation();
    initTabAnodeSacrificielle();
    initTabAccumulateur();

    initQuestionsParOnglet();

    // Onglet "Accumulateur" réservé à TCI/TRPM (notions complémentaires
    // de préparation à la poursuite d'études, cf. référentiel) ;
    // absent pour MCC, dont le programme Tle s'arrête à
    // l'oxydoréduction "cœur de cible".
    initOngletsParFiliere({
        mapping: {
            "tle-tci": [
                "reaction-acide", "classification-qualitative", "pile-electrochimique",
                "classification", "corrosion-passivation", "anode-sacrificielle",
                "accumulateur"
            ],
            "tle-trpm": [
                "reaction-acide", "classification-qualitative", "pile-electrochimique",
                "classification", "corrosion-passivation", "anode-sacrificielle",
                "accumulateur"
            ],
            "tle-mcc": [
                "reaction-acide", "classification-qualitative", "pile-electrochimique",
                "classification", "corrosion-passivation", "anode-sacrificielle"
            ]
        },
        messageId: "tp04-message-filiere"
    });

    initBoutonImpressionCR();
    initRadarCompetences();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

/* ==========================================================
   REACTIF + FILTRE SECURITE
   ========================================================== */
function initReactifSelect() {
    const select = $("reactif");
    if (!select) return;

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
   ONGLET "Réaction métal / acide"
   ========================================================== */
function initTabReactionAcide() {
    const select = $("select-metal-acide");
    const fiche = $("fiche-metal-acide");
    if (!select || !fiche) return;

    select.innerHTML = '<option value="">-- Sélectionner --</option>' +
        Object.entries(METAUX_DB).map(([id, m]) => `<option value="${id}">${m.nom}</option>`).join("");

    select.addEventListener("change", () => {
        const m = METAUX_DB[select.value];
        fiche.innerHTML = m
            ? `<p><strong>${m.nom}</strong> — couple ${m.couple}</p>
               <p>${m.reactifAcide
                   ? "Réagit avec une solution acide diluée : dégagement de dihydrogène observable."
                   : "Ne réagit pas (ou très lentement) avec une solution acide diluée dans les conditions usuelles de TP."}</p>`
            : "<p>Sélectionner un métal pour afficher sa fiche.</p>";
    });
}

/* ==========================================================
   ONGLET "Classification qualitative"
   ========================================================== */
function initTabClassificationQualitative() {
    // Tableau saisi librement par l'élève (contenu expérimental variable
    // selon les combinaisons métal/solution réellement testées) : pas
    // de logique de calcul, uniquement l'accordéon/onglet générique.
    const tbody = $("tbody-classification-qualitative");
    if (!tbody || tbody.children.length) return;

    tbody.innerHTML = Object.values(METAUX_DB).map(m => `
        <tr>
            <td>${m.nom}</td>
            <td><input type="text" placeholder="ex. ions Cu²⁺"></td>
            <td><input type="text" placeholder="Observation"></td>
            <td><input type="text" placeholder="Oui / Non"></td>
        </tr>
    `).join("");
}

/* ==========================================================
   ONGLET "Pile électrochimique"
   ========================================================== */
function initTabPileElectrochimique() {
    const select1 = $("select-couple-1");
    const select2 = $("select-couple-2");
    const resultat = $("resultat-pile");

    if (select1 && select2) {
        const options = '<option value="">-- Sélectionner --</option>' +
            Object.entries(COUPLES_DB).map(([id, c]) => `<option value="${id}">${c.nom}</option>`).join("");

        select1.innerHTML = options;
        select2.innerHTML = options;
    }

    function calculerPolarite() {
        if (!select1 || !select2 || !resultat) return;

        const c1 = COUPLES_DB[select1.value];
        const c2 = COUPLES_DB[select2.value];

        if (!c1 || !c2) {
            resultat.textContent = "Sélectionner deux couples différents pour afficher la polarité prévisible de la pile.";
            return;
        }

        if (select1.value === select2.value) {
            resultat.textContent = "Sélectionner deux couples différents.";
            return;
        }

        // le couple de plus petit rang est le plus réducteur => électrode négative
        const [reducteur, oxydant] = c1.rang < c2.rang ? [c1, c2] : [c2, c1];

        resultat.innerHTML = `
            <strong>Électrode négative (oxydation) :</strong> ${reducteur.nom} (le plus réducteur des deux)<br>
            <strong>Électrode positive (réduction) :</strong> ${oxydant.nom}
        `;
    }

    select1?.addEventListener("change", calculerPolarite);
    select2?.addEventListener("change", calculerPolarite);
}

/* ==========================================================
   ONGLET "Classification" (synthèse)
   ========================================================== */
function initTabClassification() {
    const tbody = $("tbody-classification");
    if (!tbody || tbody.children.length) return;

    const tries = Object.values(COUPLES_DB).sort((a, b) => a.rang - b.rang);

    tbody.innerHTML = tries.map((c, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${c.nom}</td>
            <td>${i === 0 ? "Le plus fort réducteur" : i === tries.length - 1 ? "Le plus fort oxydant (du couple métallique)" : "—"}</td>
        </tr>
    `).join("");
}

/* ==========================================================
   ONGLET "Corrosion et passivation"
   ========================================================== */
function initTabCorrosionPassivation() {
    const tbody = $("tbody-corrosion");
    if (!tbody || tbody.children.length) return;

    tbody.innerHTML = Object.values(METAUX_DB).map(m => `
        <tr>
            <td>${m.nom}</td>
            <td><input type="text" placeholder="ex. eau salée"></td>
            <td><input type="text" placeholder="Observation"></td>
            <td><input type="text" placeholder="Oui / Non"></td>
        </tr>
    `).join("");
}

/* ==========================================================
   ONGLET "Anode sacrificielle"
   ========================================================== */
function initTabAnodeSacrificielle() {
    const select = $("select-anode");
    const fiche = $("fiche-anode");
    if (!select || !fiche) return;

    select.innerHTML = '<option value="">-- Sélectionner --</option>' +
        Object.entries(METAUX_DB).map(([id, m]) => `<option value="${id}">${m.nom}</option>`).join("");

    select.addEventListener("change", () => {
        const m = METAUX_DB[select.value];
        if (!m) {
            fiche.innerHTML = "<p>Sélectionner un métal pour vérifier s'il est adapté comme anode sacrificielle du métal à protéger.</p>";
            return;
        }

        const rang = COUPLES_DB[m.couple.replace("²⁺", "2+").replace("³⁺", "3+")]?.rang
            ?? Object.values(COUPLES_DB).find(c => c.nom.startsWith(m.nom[0]))?.rang;

        fiche.innerHTML = `
            <p><strong>${m.nom}</strong> — couple ${m.couple}</p>
            <p>Pour protéger un métal donné par anode sacrificielle, le métal choisi ici doit être
            <strong>plus réducteur</strong> (rang plus faible dans le classement) que le métal à protéger :
            c'est alors lui qui s'oxydera en priorité.</p>
        `;
    });
}

/* ==========================================================
   ONGLET "Accumulateur" (TCI / TRPM)
   ========================================================== */
function initTabAccumulateur() {

    const select = $("select-accumulateur");
    const fiche = $("fiche-accumulateur");

    if (select && fiche) {
        select.addEventListener("change", () => {
            const accu = ACCUMULATEURS_DB[select.value];
            fiche.innerHTML = accu
                ? `<p><strong>${accu.nom}</strong> — tension nominale ≈ ${accu.tensionNominale} V/élément</p>
                   <p>${accu.decharge}</p>
                   <p>${accu.charge}</p>`
                : "<p>Sélectionner un type d'accumulateur pour afficher ses réactions aux électrodes.</p>";
        });
    }

    const inputCharge = $("accu-tension-charge");
    const inputDecharge = $("accu-tension-decharge");
    const resultat = $("resultat-accumulateur");

    if (!inputCharge || !inputDecharge || !resultat) return;

    function calculer() {
        const uCharge = parseFloat(inputCharge.value);
        const uDecharge = parseFloat(inputDecharge.value);

        if (Number.isNaN(uCharge) || Number.isNaN(uDecharge)) {
            resultat.textContent = "Saisir les deux tensions mesurées pour comparer charge et décharge.";
            return;
        }

        const ecart = uCharge - uDecharge;
        resultat.innerHTML = `
            Tension en charge : ${uCharge.toFixed(2)} V — Tension en décharge : ${uDecharge.toFixed(2)} V<br>
            <strong>Écart : ${ecart >= 0 ? "+" : ""}${ecart.toFixed(2)} V</strong>
            (la tension de charge est normalement supérieure à la tension de décharge)
        `;
    }

    inputCharge.addEventListener("input", calculer);
    inputDecharge.addEventListener("input", calculer);
}

/* ==========================================================
   QUESTIONS DU COMPTE-RENDU (basculent avec l'onglet actif)
   ========================================================== */
function afficherQuestionsTP(idOnglet) {
    document.querySelectorAll(".questions-bloc").forEach(bloc => {
        bloc.hidden = bloc.dataset.tp !== idOnglet;
    });
}

function initQuestionsParOnglet() {
    const boutons = document.querySelectorAll(".tabs-container .tab-btn");
    if (!boutons.length) return;

    boutons.forEach(btn => {
        btn.addEventListener("click", () => afficherQuestionsTP(btn.dataset.tab));
    });

    const actif = document.querySelector(".tabs-container .tab-btn.actif") || boutons[0];
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

    const sections = [];

    if (filiereChoisie) {
        sections.push({
            titre: "Contexte professionnel",
            items: [
                { label: "Filière", valeur: `${filiereChoisie.niveau} — ${filiereChoisie.filiere}` }
            ]
        });
    }

    sections.push({
        titre: "Réactif de sécurité consulté",
        items: [
            { label: "Réactif", valeur: reactifCourant?.nom || "—" }
        ]
    });

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

        sections.push({
            titre: titreQuestion,
            competence,
            notation: true,
            texte: (zone.value || "").trim()
        });
    });

    const resume = lireTexte("resume-tp");
    if (resume) {
        sections.push({ titre: "Résumé du TP", texte: resume });
    }

    const materiel = getMaterielSelectionne();
    if (materiel.length) {
        sections.push({ titre: "Matériel utilisé", texte: materiel.join(" • ") });
    }

    genererCompteRendu({
        domaine: "Chimie",
        tp: "TP04",
        titre: "Oxydoréduction — corrosion et protection des métaux",
        sections,
        identiteDefaut: identite,
        signature: false,
        noteFinale: true
    });
}
