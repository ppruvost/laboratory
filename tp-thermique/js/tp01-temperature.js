/**
 * tp01-temperature.js
 * TP01 — Mesurer des températures - Choisir et utiliser un capteur de température
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
   CONTEXTE PROFESSIONNEL — TP01 (Dissolution / Dilution /
   Identification d'ions)
   Propre à ce TP : niveaux 2nde et 1ère uniquement (cf. cadre bleu).
   Une problématique par activité (onglet de manipulation) : le
   rappel affiché en fin de chaque bloc de questions est sélectionné
   automatiquement selon l'attribut data-activite du rappel
   (cf. js/contexte-pro.js).
   ========================================================== */
const CONTEXTES_PRO_TP01 = {
    "2nde-remi": {
        contexte: "Avant l'assemblage de tôles par soudage, les ateliers de réalisation d'ensembles mécaniques utilisent des bains de dégraissage et de décapage pour préparer les surfaces métalliques. Ces bains sont livrés sous forme de concentrés qu'il faut diluer avec précision selon les préconisations du fabricant pour garantir leur efficacité sans gaspillage de produit. Après traitement, l'eau de rinçage doit elle aussi être contrôlée avant d'être évacuée, afin de vérifier qu'elle ne contient plus d'ions métalliques issus du bain.",
        problematiques: {
            "dissolution-dilution": "Comment préparer, à partir d'un concentré de dégraissant industriel, un bain de traitement de surface à la concentration exacte préconisée par le fabricant ?",
            "identification-ions": "Comment vérifier, par des tests de précipitation, qu'une eau de rinçage ne contient plus d'ions métalliques (fer, cuivre) issus du bain de traitement de surface avant son évacuation ?"
        }
    },
    "2nde-mcc": {
        contexte: "Dans un atelier de confection, la teinture d'un tissu nécessite de préparer un bain à partir d'une solution mère de colorant et de sels auxiliaires. La qualité de la teinte (uniformité, tenue) dépend directement du respect de la concentration prescrite par la fiche technique du fournisseur. Une fois la teinture terminée, le bain usé doit être contrôlé avant son traitement, notamment pour vérifier la présence d'ions métalliques utilisés comme fixateurs de colorant.",
        problematiques: {
            "dissolution-dilution": "Comment déterminer la masse de colorant à peser et le volume d'eau à utiliser pour obtenir un bain de teinture à la concentration voulue ?",
            "identification-ions": "Comment identifier, par des tests de précipitation, la présence d'ions métalliques dans un bain de teinture usagé avant son évacuation ?"
        }
    },
    "1ere-tci": {
        contexte: "En chaudronnerie industrielle, certaines pièces métalliques subissent un traitement de conversion chimique (phosphatation, passivation) avant peinture, afin d'améliorer l'adhérence du revêtement et la résistance à la corrosion. Ces bains doivent être préparés à une concentration précise en quantité de matière, et l'eau de rinçage qui suit le traitement doit être contrôlée avant rejet dans le réseau d'assainissement.",
        problematiques: {
            "dissolution-dilution": "Comment préparer, par dissolution ou dilution, un bain de traitement de surface dont la concentration en quantité de matière est imposée par le référentiel qualité de l'entreprise ?",
            "identification-ions": "Comment vérifier, par des tests de précipitation, la présence d'ions métalliques (fer, zinc) dans l'eau de rinçage d'un bain de phosphatation avant son rejet ?"
        }
    },
    "1ere-trpm": {
        contexte: "Sur un centre d'usinage, le liquide de coupe utilisé pour refroidir et lubrifier l'outil est un concentré dilué dans l'eau. Une concentration trop faible favorise la corrosion des outillages et de la pièce ; une concentration trop forte gaspille le produit et peut irriter la peau de l'opérateur. La qualité de l'eau utilisée pour préparer le liquide de coupe (présence d'ions indésirables) influence elle aussi sa stabilité et sa durée de vie.",
        problematiques: {
            "dissolution-dilution": "Comment vérifier et ajuster, par dilution, la concentration du liquide de coupe utilisé sur le centre d'usinage afin de respecter la plage préconisée par le fabricant ?",
            "identification-ions": "Comment identifier, par des tests de précipitation, les ions présents dans l'eau utilisée pour préparer le liquide de coupe, afin de vérifier sa compatibilité avec le concentré ?"
        }
    },
    "1ere-mcc": {
        contexte: "Lors du traitement d'un tissu technique (apprêt, imperméabilisation), l'atelier prépare un bain à partir d'un concentré dont la fiche technique donne la concentration en quantité de matière à respecter pour garantir la tenue du traitement dans le temps. L'eau de rinçage issue de cette étape doit ensuite être contrôlée avant son évacuation.",
        problematiques: {
            "dissolution-dilution": "Comment calculer le volume de concentré à prélever et le compléter avec de l'eau pour obtenir un bain d'apprêt à la concentration en quantité de matière prescrite ?",
            "identification-ions": "Comment vérifier, par des tests de précipitation, qu'une eau de rinçage textile ne contient plus les ions métalliques utilisés lors du traitement avant son évacuation ?"
        }
    }
};

/* ==========================================================
   DONNEES LOCALES — identification d'ions par précipitation
   (tests préliminaires puis analyse d'échantillons inconnus,
   dans un contexte de contrôle d'eaux de rinçage industrielles)
   ========================================================== */

const REACTIFS_IONS = [
    { id: "ag", nom: "nitrate d'argent", formule: "Ag⁺ + NO₃⁻" },
    { id: "ba", nom: "chlorure de baryum", formule: "Ba²⁺ + 2 Cl⁻" },
    { id: "oh", nom: "soude (hydroxyde de sodium)", formule: "Na⁺ + HO⁻" },
    { id: "ox", nom: "oxalate d'ammonium", formule: "2 NH₄⁺ + C₂O₄²⁻" }
];

const IONS = [
    { id: "cl",  nom: "ion chlorure",     symbole: "Cl⁻",  reactif: "ag", couleur: "blanc",  formule: "AgCl" },
    { id: "so4", nom: "ion sulfate",      symbole: "SO₄²⁻", reactif: "ba", couleur: "blanc",  formule: "BaSO₄" },
    { id: "cu2", nom: "ion cuivre (II)",  symbole: "Cu²⁺", reactif: "oh", couleur: "bleu",   formule: "Cu(OH)₂" },
    { id: "fe2", nom: "ion fer (II)",     symbole: "Fe²⁺", reactif: "oh", couleur: "vert",   formule: "Fe(OH)₂" },
    { id: "fe3", nom: "ion fer (III)",    symbole: "Fe³⁺", reactif: "oh", couleur: "orange", formule: "Fe(OH)₃" },
    { id: "ca2", nom: "ion calcium (II)", symbole: "Ca²⁺", reactif: "ox", couleur: "blanc",  formule: "CaC₂O₄" }
];

const ECHANTILLONS_IONS = [
    { id: "s1", nom: "S₁ — sulfate de fer (II)",           ions: ["fe2", "so4"] },
    { id: "s2", nom: "S₂ — chlorure de fer (III)",         ions: ["fe3", "cl"] },
    { id: "s3", nom: "S₃ — chlorure de sodium",            ions: ["cl"] },
    { id: "s4", nom: "S₄ — sulfate de zinc",                ions: ["so4"] },
    { id: "s5", nom: "S₅ — sulfate de cuivre",              ions: ["cu2", "so4"] },
    { id: "s6", nom: "S₆ — chlorure de calcium",            ions: ["ca2", "cl"] },
    { id: "eau-a",  nom: "Échantillon A — eau de rinçage en sortie de bain de traitement", ions: ["cl"] },
    { id: "eau-b",  nom: "Échantillon B — eau prélevée en sortie d'un autre poste de traitement", ions: ["so4", "fe2"] },
    { id: "eau-c",  nom: "Échantillon C — eau utilisée pour préparer le liquide de coupe", ions: ["ca2", "cl"] }
];

/* ==========================================================
   VARIABLES
   ========================================================== */
let reactifCourant = null;
let dejaInitialise = false;

/* ==========================================================
   INITIALISATION TP01
   ========================================================== */
export function init() {
    if (dejaInitialise) return;
    dejaInitialise = true;

    console.log("TP01 — Initialisation des calculs de dissolution et dilution.");

    initSections();
    initTabs();
    initContextePro({
        filieres: FILIERES_PRO,
        contextes: CONTEXTES_PRO_TP01
    });
    initReactifSelect();
    initCalculsDissolution();
    initCalculsDilution();
    initTabIdentificationIons();
    initMateriel({
        verreId: "materiel-verrerie",
        equipementId: "materiel-equipements",
        glassware,
        equipment: laboratoryEquipment,
        categorie: "Dissolution"
    });
    initQuestionsParOnglet();
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
   ONGLET "Identification d'ions" (contrôle qualité d'une eau)
   ========================================================== */

function initTableauRecapIons() {
    const tbody = $("tbody-recap-ions");
    if (!tbody) return;

    tbody.innerHTML = IONS.map(ion => {
        const reactif = REACTIFS_IONS.find(r => r.id === ion.reactif);
        return `<tr><td>${ion.nom} (${ion.symbole})</td><td>${reactif.nom}</td><td>${ion.couleur}</td></tr>`;
    }).join("");
}

function calculerTestIon(idEchantillon, idReactif) {
    const echantillon = ECHANTILLONS_IONS.find(e => e.id === idEchantillon);
    const reactif = REACTIFS_IONS.find(r => r.id === idReactif);
    if (!echantillon || !reactif) return null;

    const ionRevele = echantillon.ions
        .map(id => IONS.find(i => i.id === id))
        .find(ion => ion.reactif === idReactif);

    return { echantillon, reactif, ionRevele };
}

function rendreTestIon(resultat) {
    if (!resultat) return "Sélectionner un échantillon et un réactif pour prédire le résultat du test.";

    const { echantillon, reactif, ionRevele } = resultat;

    if (ionRevele) {
        return `
            <p><strong>${echantillon.nom}</strong> + réactif <strong>${reactif.nom}</strong> (${reactif.formule})</p>
            <p>Il se forme un précipité <strong>${ionRevele.couleur}</strong> de ${ionRevele.formule}.</p>
            <p>Ce précipité met en évidence la présence de l'ion <strong>${ionRevele.nom} (${ionRevele.symbole})</strong> dans l'échantillon.</p>
        `;
    }

    return `
        <p><strong>${echantillon.nom}</strong> + réactif <strong>${reactif.nom}</strong> (${reactif.formule})</p>
        <p>Aucun précipité ne se forme.</p>
        <p>L'échantillon ne contient donc pas l'ion normalement révélé par ce réactif.</p>
    `;
}

function initTabIdentificationIons() {
    initTableauRecapIons();

    const selectEchantillon = $("select-echantillon-ions");
    const selectReactif = $("select-reactif-ions");
    const zone = $("resultat-test-ion");
    if (!selectEchantillon || !selectReactif || !zone) return;

    selectEchantillon.innerHTML = '<option value="">-- Sélectionner --</option>' +
        ECHANTILLONS_IONS.map(e => `<option value="${e.id}">${e.nom}</option>`).join("");
    selectReactif.innerHTML = '<option value="">-- Sélectionner --</option>' +
        REACTIFS_IONS.map(r => `<option value="${r.id}">${r.nom} (${r.formule})</option>`).join("");

    const rafraichir = () => {
        const resultat = calculerTestIon(selectEchantillon.value, selectReactif.value);
        zone.innerHTML = rendreTestIon(resultat);
    };

    selectEchantillon.addEventListener("change", rafraichir);
    selectReactif.addEventListener("change", rafraichir);
}

/* ==========================================================
   QUESTIONS DU COMPTE-RENDU
   Un bloc de 5 questions pour l'activité dissolution/dilution,
   un second bloc pour l'onglet identification d'ions ; seul le
   bloc correspondant à l'onglet actif est visible et imprimé.
   ========================================================== */

function afficherQuestionsTP(idOnglet) {
    document.querySelectorAll(".questions-bloc").forEach(bloc => {
        const onglets = (bloc.dataset.tp || "").split(",").map(s => s.trim());
        bloc.hidden = !onglets.includes(idOnglet);
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

    const nomReactif = reactifCourant?.nom || "—";
    const masseMolaire = $("masse-molaire-reactif-selectionne")?.textContent || "—";
    const cDissolution = $("c-dissolution")?.value || "—";
    const vDissolution = $("v-dissolution")?.value || "—";
    const masseTheo = $("pe-masse-theo")?.value || "—";
    const masseExp = $("masse-exp-pesee")?.value || "—";
    const ecartRelatif = $("table-ecart")?.textContent?.trim() || "—";
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

    sections.push(
        {
            titre: "Paramètres de la dissolution",
            groupe: "dissolution",
            items: [
                { label: "Réactif", valeur: nomReactif },
                { label: "Masse molaire M", valeur: `${masseMolaire} g/mol` },
                { label: "Concentration C", valeur: `${cDissolution} mol/L` },
                { label: "Volume V", valeur: `${vDissolution} mL` },
                { label: "Masse théorique m", valeur: `${masseTheo} g` },
                { label: "Masse pesée", valeur: `${masseExp} g` },
                { label: "Écart relatif", valeur: ecartRelatif }
            ]
        },
        {
            titre: "Paramètres de la dilution (C₁V₁ = C₂V₂)",
            groupe: "dilution",
            items: [
                { label: "Concentration mère C₁", valeur: `${$("c1-hcl")?.value || "—"} mol/L` },
                { label: "Concentration fille C₂", valeur: `${$("c2-hcl")?.value || "—"} mol/L` },
                { label: "Volume final V₂", valeur: `${$("v2-hcl")?.value || "—"} mL` },
                { label: "Volume à prélever V₁", valeur: `${$("res-hcl")?.textContent?.replace("Volume à prélever : ", "") || "—"}` }
            ]
        },
        {
            titre: "Test d'identification d'ion",
            groupe: "identification-ions",
            items: [
                { label: "Échantillon testé", valeur: $("select-echantillon-ions")?.selectedOptions?.[0]?.textContent || "—" },
                { label: "Réactif ajouté", valeur: $("select-reactif-ions")?.selectedOptions?.[0]?.textContent || "—" }
            ]
        }
    );

    // Seules les questions du bloc actuellement visible (onglet de
    // manipulation actif) sont incluses dans le compte-rendu.
    const blocActif = document.querySelector(".questions-bloc:not([hidden])");
    const ongletsBlocActif = (blocActif?.dataset.tp || "").split(",").map(s => s.trim());

    const liste = blocActif
        ? blocActif.querySelectorAll(".questions-tp > li")
        : document.querySelectorAll(".questions-tp > li");

    liste.forEach((li, index) => {
        const zone = li.querySelector("textarea.cr-reponse, textarea[id^='question']")
                     || li.querySelector("textarea");
        if (!zone) return;

        const titreQuestion = li.querySelector(".question-entete strong")
            ?.textContent.replace(/\s+/g, " ").trim() || `Question ${index + 1}`;
        const competence = li.querySelector(".cartouche")?.dataset.comp || "";
        const groupe = ongletsBlocActif.includes("identification-ions")
            ? "identification-ions"
            : (/dilution/i.test(titreQuestion) ? "dilution" : "dissolution");

        sections.push({
            titre: titreQuestion,
            competence,
            notation: true,
            groupe,
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
        tp: "TP01",
        titre: "Préparation de solutions par dissolution et dilution",
        sections,
        groupes: [
            { id: "dissolution", label: "Partie Dissolution", defaut: true },
            { id: "dilution",    label: "Partie Dilution",    defaut: true },
            { id: "identification-ions", label: "Partie Identification d'ions", defaut: true }
        ],
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
