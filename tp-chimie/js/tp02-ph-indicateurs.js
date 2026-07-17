/**
 * tp02-ph-indicateurs.js
 * TP02 — pH et indicateurs colorés
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
   CONTEXTE PROFESSIONNEL — TP02 (pH et indicateurs colorés)
   Propre à ce TP : niveaux 2nde et 1ère uniquement (cf. cadre bleu).
   ========================================================== */
const CONTEXTES_PRO_TP02 = {
    "2nde-remi": {
        contexte: "L'efficacité d'un bain de décapage acide ou d'un bain de dégraissage alcalin dépend fortement de son pH. Un contrôle régulier permet de savoir quand le bain doit être renouvelé ou rééquilibré, avant qu'il ne perde son efficacité sur les pièces métalliques.",
        problematique: "Comment vérifier, à l'aide d'un indicateur coloré ou d'un papier pH, si un bain de traitement de surface est encore dans sa plage de pH d'utilisation efficace ?"
    },
    "2nde-mcc": {
        contexte: "La fixation d'un colorant sur une fibre textile dépend étroitement du pH du bain de teinture : certains colorants nécessitent un milieu acide, d'autres un milieu basique. Un mauvais réglage du pH conduit à une teinte irrégulière ou peu tenace.",
        problematique: "Comment contrôler le pH d'un bain de teinture et l'ajuster pour qu'il corresponde à la plage optimale de fixation du colorant utilisé ?"
    },
    "1ere-tci": {
        contexte: "Un bain de phosphatation utilisé avant peinture doit être maintenu dans une plage de pH précise : un pH trop élevé ralentit la réaction de conversion, un pH trop faible attaque excessivement le métal. Le suivi du pH fait partie du contrôle qualité de l'atelier.",
        problematique: "Comment suivre l'évolution du pH d'un bain de phosphatation au cours de son utilisation et anticiper le moment de son renouvellement ?"
    },
    "1ere-trpm": {
        contexte: "Un liquide de coupe utilisé en usinage voit son pH évoluer avec le temps : une dérive vers l'acidité favorise la prolifération bactérienne et la corrosion des pièces et de la machine. Le suivi du pH permet d'anticiper la vidange ou le rééquilibrage du bain.",
        problematique: "Comment mesurer et interpréter l'évolution du pH d'un liquide de coupe pour décider du moment opportun de son remplacement ?"
    },
    "1ere-mcc": {
        contexte: "Le blanchiment ou l'apprêt d'un tissu se réalise dans un bain dont le pH conditionne la vitesse et la qualité du traitement. Les indicateurs colorés permettent un contrôle rapide en atelier, sans attendre les résultats d'une analyse en laboratoire externe.",
        problematique: "Comment choisir l'indicateur coloré le plus adapté pour contrôler rapidement le pH d'un bain de traitement textile en atelier ?"
    }
};

/* ==========================================================
   DONNÉES LOCALES AU TP02 (chimie du pH, pas de la sécurité)
   ========================================================== */

// Plages de virage — information pédagogique propre au TP02,
// distincte des fiches de sécurité (dangerDB) gérées par securite.js.
const INDICATEURS_B27 = [
    {
        nom: "Hélianthine (orange de méthyle)",
        formule: "C₁₄H₁₄N₃NaO₃S",
        cas: "547-58-0",
        plageMin: 3.1,
        plageMax: 4.4,
        couleurAcide: "#D32F2F",
        nomAcide: "rouge",
        couleurBasique: "#FBC02D",
        nomBasique: "jaune"
    },
    {
        nom: "Rouge de méthyle",
        formule: "C₁₅H₁₅N₃O₂",
        cas: "493-52-7",
        plageMin: 4.4,
        plageMax: 6.2,
        couleurAcide: "#C62828",
        nomAcide: "rouge",
        couleurBasique: "#FDD835",
        nomBasique: "jaune"
    },
    {
        nom: "Bleu de bromothymol (BBT)",
        formule: "C₂₇H₂₈Br₂O₅S",
        cas: "76-59-5",
        plageMin: 6.0,
        plageMax: 7.6,
        couleurAcide: "#FDD835",
        nomAcide: "jaune",
        couleurBasique: "#1565C0",
        nomBasique: "bleu"
    },
    {
        nom: "Phénolphtaléine",
        formule: "C₂₀H₁₄O₄",
        cas: "77-09-8",
        plageMin: 8.2,
        plageMax: 10.0,
        couleurAcide: "#ECF0F1",
        nomAcide: "incolore",
        couleurBasique: "#D81B60",
        nomBasique: "rose fuchsia"
    }
];

// Papiers / bandelettes pH — extraits de data/equipment.js (catégorie
// "Indicateur"), pour ne pas dupliquer l'inventaire réel de la salle B27.
const PAPIERS_PH = (laboratoryEquipment || []).filter(item =>
    Array.isArray(item.categorie) &&
    item.categorie.includes("Indicateur") &&
    /papier|bandelette/i.test(item.nom || "")
);

/* ==========================================================
   VARIABLES
   ========================================================== */
let reactifCourant = null;
let dejaInitialise = false;

/* ==========================================================
   INITIALISATION TP02
   ========================================================== */
export function init() {
    if (dejaInitialise) return;
    dejaInitialise = true;

    console.log("TP02 — Initialisation pH et indicateurs colorés.");

    initSections();
    initTabs();
    initContextePro({
        filieres: FILIERES_PRO,
        contextes: CONTEXTES_PRO_TP02
    });
    initReactifSelect();
    initMateriel({
        verreId: "materiel-verrerie",
        equipementId: "materiel-equipements",
        glassware,
        equipment: laboratoryEquipment,
        categorie: "pHmétrie"
    });
    initSimulateurPH();
    initTabIndicateur();
    initTabPapierPH();
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
   SIMULATEUR pH
   ========================================================== */
function interpolerCouleur(c1, c2, t) {
    const parse = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
    const [r1, g1, b1] = parse(c1), [r2, g2, b2] = parse(c2);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r},${g},${b})`;
}

function formatSci(val) {
    if (val === 0) return "0";
    const exp = Math.floor(Math.log10(val));
    const mant = (val / Math.pow(10, exp)).toFixed(2);
    return `${mant} × 10<sup>${exp}</sup> mol/L`;
}

function majSimulateur(ph) {
    const affichage = $("affichage-ph");
    const curseur = $("curseur-ph");
    const h3oEl = $("concentration-h3o");
    const hoEl = $("concentration-ho");
    const natureEl = $("nature-solution");
    const cont = $("resultats-indicateurs");

    if (affichage) affichage.textContent = parseFloat(ph).toFixed(1);
    if (curseur) curseur.style.left = (ph / 14 * 100) + "%";

    const h3o = Math.pow(10, -ph);
    const ho = Math.pow(10, -(14 - ph));
    if (h3oEl) h3oEl.innerHTML = formatSci(h3o);
    if (hoEl) hoEl.innerHTML = formatSci(ho);

    if (natureEl) {
        natureEl.textContent = ph < 7 ? "⚡ acide" : ph > 7 ? "🔷 basique" : "⚖️ neutre";
    }

    if (cont) {
        cont.innerHTML = INDICATEURS_B27.map(ind => {
            let couleur, nom;
            if (ph < ind.plageMin) {
                couleur = ind.couleurAcide; nom = ind.nomAcide;
            } else if (ph > ind.plageMax) {
                couleur = ind.couleurBasique; nom = ind.nomBasique;
            } else {
                couleur = interpolerCouleur(ind.couleurAcide, ind.couleurBasique, .5);
                nom = "zone de virage";
            }
            const isIncolore = nom === "incolore";
            return `<div class="carte-indicateur">
        <div class="ind-nom">${ind.nom}</div>
        <div class="ind-couleur" style="background:${couleur};color:${isIncolore ? "#333" : "#fff"};border:${isIncolore ? "1px solid #ccc" : "none"}">${nom}</div>
        <div class="ind-plage">virage pH ${ind.plageMin}–${ind.plageMax}</div>
      </div>`;
        }).join("");
    }
}

function initSimulateurPH() {
    const slider = $("slider-ph");
    if (!slider) return;

    slider.addEventListener("input", () => majSimulateur(parseFloat(slider.value)));
    majSimulateur(parseFloat(slider.value) || 7);
}

/* ==========================================================
   ONGLET "Indicateur"  (tests qualitatifs)
   ========================================================== */
function rendreFicheIndicateur(ind) {
    if (!ind) return "<p>Sélectionner un indicateur pour afficher sa fiche.</p>";
    return `
    <p><strong>${ind.nom}</strong>${ind.formule ? ` — <span class="produit-formule">${ind.formule}</span>` : ""}</p>
    ${ind.cas ? `<p class="produit-cas" style="display:inline-block">${ind.cas}</p>` : ""}
    <div class="virage-indicateur">
      <div class="couleur-acide" style="background:${ind.couleurAcide}">${ind.nomAcide}</div>
      <div class="fleche-virage">→</div>
      <div class="couleur-basique" style="background:${ind.couleurBasique}">${ind.nomBasique}</div>
      <div class="plage">pH ${ind.plageMin} – ${ind.plageMax}</div>
    </div>
  `;
}

function initTabIndicateur() {
    const select = $("select-indicateur");
    const fiche = $("fiche-indicateur");
    if (!select || !fiche) return;

    select.innerHTML = '<option value="">-- Sélectionner --</option>' +
        INDICATEURS_B27.map(ind => `<option value="${ind.cas}">${ind.nom}</option>`).join("");

    select.addEventListener("change", () => {
        const ind = INDICATEURS_B27.find(i => i.cas === select.value);
        fiche.innerHTML = rendreFicheIndicateur(ind);
    });
}

/* ==========================================================
   ONGLET "Papier pH"  (tests qualitatifs)
   ========================================================== */
function rendreFichePapier(papier) {
    if (!papier) return "<p>Sélectionner un papier pour afficher sa fiche.</p>";
    const horsPH = /acétate de plomb/i.test(papier.nom || "");
    return `
    <p><strong>${papier.nom}</strong></p>
    ${papier.description ? `<p>${papier.description}</p>` : ""}
    ${papier.lieu ? `<p class="produit-localisation">${papier.lieu}</p>` : ""}
    ${horsPH ? `<p class="warning">⚠️ Ce papier ne sert pas à mesurer un pH — réservé à un autre TP (identification d'ions).</p>` : ""}
  `;
}

function initTabPapierPH() {
    const select = $("select-papier");
    const fiche = $("fiche-papier");
    if (!select || !fiche) return;

    select.innerHTML = '<option value="">-- Sélectionner --</option>' +
        PAPIERS_PH.map((p, i) => `<option value="${i}">${p.nom}</option>`).join("");

    select.addEventListener("change", () => {
        const papier = PAPIERS_PH[select.value];
        fiche.innerHTML = rendreFichePapier(papier);
    });
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

    genererCompteRendu({
        domaine: "Chimie",
        tp: "TP02",
        titre: "pH et indicateurs colorés",
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
