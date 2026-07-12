/**
 * tp03-titrages.js
 *
 * TP03 — Titrages acido-basiques (pH-métrie)
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
   BASES pKa (couples acide/base faibles)
   — Chapitre II Partie C : Titrages / Courbes de neutralisation
   ========================================================== */

// Acides faibles (mono ou polyacides), pKa croissants
const ACIDES_DB = {

    CH3COOH: { nom: "CH₃COOH / CH₃COO⁻ (acide acétique)",   pka: [4.76] },
    HCOOH:   { nom: "HCOOH / HCOO⁻ (acide méthanoïque)",     pka: [3.75] },
    HF:      { nom: "HF / F⁻ (acide fluorhydrique)",          pka: [3.17] },
    HNO2:    { nom: "HNO₂ / NO₂⁻ (acide nitreux)",            pka: [3.34] },
    H2O2:    { nom: "H₂O₂ / HO₂⁻ (eau oxygénée)",             pka: [11.6] },
    H3BO3:   { nom: "H₃BO₃ / H₂BO₃⁻ (acide borique)",         pka: [9.24] },

    H2C2O4:  { nom: "H₂C₂O₄ — acide oxalique (diacide)",      pka: [1.25, 4.14] },
    H2CO3:   { nom: "H₂CO₃ — acide carbonique (diacide)",     pka: [6.35, 10.33] },
    H2S:     { nom: "H₂S — sulfure d'hydrogène (diacide)",    pka: [7.0, 13.0] },
    H3PO4:   { nom: "H₃PO₄ — acide phosphorique (triacide)",  pka: [2.15, 7.20, 12.35] },
    H4EDTA:  { nom: "H₄EDTA — EDTA (tétraacide)",             pka: [2.0, 2.67, 6.16, 10.26] }

};

// Bases faibles monoacides : pKa donné = pKa du couple (BH+/B), conjugué
const BASES_DB = {

    NH3:     { nom: "NH₄⁺ / NH₃ (ammonium / ammoniac)",              pka: [9.25] },
    CH3NH2:  { nom: "CH₃NH₃⁺ / CH₃NH₂ (méthylamine)",                pka: [10.62] },
    C2H5NH2: { nom: "CH₃CH₂NH₃⁺ / CH₃CH₂NH₂ (éthylamine)",           pka: [10.8] },
    C6H5NH2: { nom: "C₆H₅NH₃⁺ / C₆H₅NH₂ (aniline)",                  pka: [4.6] }

};



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

function $(id) {
    return document.getElementById(id);
}

function clamp(x, a, b) {
    return Math.max(a, Math.min(b, x));
}

function log10(x) {
    return Math.log(x) / Math.LN10;
}

function phFromH(h) {
    h = Math.max(h, 1e-14);
    return clamp(-log10(h), 0, 14);
}

/**
 * Charge négative moyenne portée par un (poly)acide faible HnA à pH donné
 * (h = [H3O+]), pour une liste de pKa croissants [pKa1..pKan].
 * Retourne z ∈ [0, n] : nombre moyen de protons cédés.
 */
function chargeAcideFaible(h, pkaListe) {

    const n = pkaListe.length;
    if (n === 0) return 0;

    const Ka = pkaListe.map(p => Math.pow(10, -p));

    // beta[i] = Ka1*Ka2*...*Ka_i  (beta[0] = 1)
    const beta = [1];
    for (let i = 0; i < n; i++) {
        beta.push(beta[i] * Ka[i]);
    }

    let D = 0;
    const termes = [];

    for (let i = 0; i <= n; i++) {
        const t = beta[i] * Math.pow(h, n - i);
        termes.push(t);
        D += t;
    }

    if (D <= 0) return 0;

    let z = 0;
    for (let i = 0; i <= n; i++) {
        z += i * (termes[i] / D);
    }

    return z;

}

/**
 * Fraction protonée (BH+) d'une base faible monoacide, à pH donné,
 * pour un pKa (du couple BH+/B) donné.
 */
function fractionBaseProtonee(h, pkaBase) {
    const Ka = Math.pow(10, -pkaBase);
    return h / (h + Ka);
}

/**
 * Solveur général du pH d'un mélange titré/titrant par bissection
 * sur le bilan électrique (électroneutralité), valable pour les
 * 8 cas du chapitre (fort/fort, faible/fort, fort/faible, faible/faible,
 * polyacide/base forte...), quelle que soit l'espèce placée dans le bécher.
 *
 * @param {"acide"|"base"} natureTitre - espèce placée dans le bécher
 * @param {"fort"|"faible"} forceAcide - nature du réactif acide (bécher ou burette)
 * @param {"fort"|"faible"} forceBase  - nature du réactif basique (bécher ou burette)
 * @param {number[]} pkaAcide - liste des pKa du couple acide (si faible)
 * @param {number} pkaBase - pKa du couple base/acide conjugué (si faible)
 */
function phGeneral({ Va, Ca, natureTitre, forceAcide, forceBase, pkaAcide, pkaBase, Vb, Cb, Kw = 1e-14 }) {

    const Vt = Va + Vb;
    if (Vt <= 0 || Ca <= 0) return 7;

    const Ctitre   = (Ca * Va) / Vt;
    const Ctitrant = Vb > 0 ? (Cb * Vb) / Vt : 0;

    let CAcideFort = 0, CAcideFaible = 0;
    let CBaseForte = 0, CBaseFaible = 0;

    if (natureTitre === "acide") {

        if (forceAcide === "fort") CAcideFort = Ctitre;
        else                       CAcideFaible = Ctitre;

        if (forceBase === "fort")  CBaseForte = Ctitrant;
        else                       CBaseFaible = Ctitrant;

    } else {

        if (forceBase === "fort")  CBaseForte = Ctitre;
        else                       CBaseFaible = Ctitre;

        if (forceAcide === "fort") CAcideFort = Ctitrant;
        else                       CAcideFaible = Ctitrant;

    }

    // bilan de charges : [H+] + CBaseForte + Qbase(h) = [OH-] + CAcideFort + Qacide(h)
    function residu(h) {

        const oh = Kw / h;

        const qAcide =
            CAcideFaible > 0
            ? CAcideFaible * chargeAcideFaible(h, pkaAcide)
            : 0;

        const qBase =
            CBaseFaible > 0
            ? CBaseFaible * fractionBaseProtonee(h, pkaBase)
            : 0;

        return (h + CBaseForte + qBase) - (oh + CAcideFort + qAcide);

    }

    // bissection sur h dans [1e-14, 1] (pH 0 à 14)
    let hLo = 1e-14, hHi = 1;
    let rLo = residu(hLo), rHi = residu(hHi);

    // sécurité : si même signe (cas limite), on renvoie l'extrémité la plus probable
    if (rLo > 0 && rHi > 0) return 14;
    if (rLo < 0 && rHi < 0) return 0;

    for (let i = 0; i < 80; i++) {

        const hMid = Math.sqrt(hLo * hHi); // bissection en échelle log (stable)
        const rMid = residu(hMid);

        if (rMid === 0) { hLo = hHi = hMid; break; }

        if ((rMid > 0) === (rLo > 0)) {
            hLo = hMid; rLo = rMid;
        } else {
            hHi = hMid; rHi = rMid;
        }

    }

    const h = Math.sqrt(hLo * hHi);
    return phFromH(h);

}



/* ==========================================================
   INITIALISATION TP03
   ========================================================== */

export function init() {

    if (dejaInitialise)
        return;

    dejaInitialise = true;

    console.log("TP03 Titrage initialisé");


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
            "pHmétrie"

    });


    initParametresTitrage();

    initMesures();

    initCourbe();

    initCorrection();

    initBalanceErreurs();

    initBoutonImpressionCR();

    initRadarCompetences();


    // premier calcul / premier rendu
    calculerVeTheorique();
    dessinerCourbe();

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
   REACTIF + FILTRE SECURITE (identique TP01)
   ========================================================== */

function initReactifSelect() {

    const select =
        $("reactif");

    if (!select) {
        console.warn(
            "Select #reactif introuvable dans le DOM TP03"
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
   PARAMETRES DU TITRAGE (va, ca, cb, sel-acide, sel-base, pka)
   ========================================================== */

function peuplerSelectCouples(selectId, base) {

    const select = $(selectId);
    if (!select) return;

    select.innerHTML = "";

    Object.entries(base).forEach(([id, def]) => {

        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = def.nom;
        select.appendChild(opt);

    });

}


function majVisibiliteCouples() {

    const forceAcide = $("sel-acide")?.value || "fort";
    const forceBase  = $("sel-base")?.value || "fort";
    const titre      = $("sel-titre")?.value || "acide";

    const groupeAcide = $("groupe-pka-acide");
    const groupeBase  = $("groupe-pka-base");

    if (groupeAcide) groupeAcide.style.display = (forceAcide === "faible") ? "" : "none";
    if (groupeBase)  groupeBase.style.display  = (forceBase  === "faible") ? "" : "none";

    // libellés dynamiques bécher / burette
    const labelVa = document.querySelector('label[for="va"]');
    const labelCa = document.querySelector('label[for="ca"]');
    const labelCb = document.querySelector('label[for="cb"]');

    if (labelVa) labelVa.textContent =
        `Volume de la solution titrée — ${titre === "acide" ? "acide" : "base"} (bécher), mL`;

    if (labelCa) labelCa.textContent =
        `Concentration estimée de la solution titrée (bécher), mol/L`;

    if (labelCb) labelCb.textContent =
        `Concentration de la solution titrante — ${titre === "acide" ? "base" : "acide"} (burette), mol/L`;

}


function initParametresTitrage() {

    peuplerSelectCouples("pka-select-acide", ACIDES_DB);
    peuplerSelectCouples("pka-select-base", BASES_DB);

    majVisibiliteCouples();

    [
        "va",
        "ca",
        "cb",
        "sel-titre",
        "sel-acide",
        "sel-base",
        "pka-select-acide",
        "pka-select-base"
    ]
    .forEach(
        id => {

            const el = $(id);

            if (!el) return;

            const rafraichir = () => {
                majVisibiliteCouples();
                calculerVeTheorique();
                dessinerCourbe();
            };

            el.addEventListener("input", rafraichir);
            el.addEventListener("change", rafraichir);

        }
    );

}


function getParametresTitrage() {

    const va =
        Number($("va")?.value) || 0;

    const ca =
        Number($("ca")?.value) || 0;

    const cb =
        Number($("cb")?.value) || 0;

    const natureTitre =
        $("sel-titre")?.value || "acide";

    const forceAcide =
        $("sel-acide")?.value || "fort";

    const forceBase =
        $("sel-base")?.value || "fort";

    const coupleAcideId =
        $("pka-select-acide")?.value || null;

    const coupleBaseId =
        $("pka-select-base")?.value || null;

    const pkaAcide =
        (forceAcide === "faible" && coupleAcideId && ACIDES_DB[coupleAcideId])
        ? ACIDES_DB[coupleAcideId].pka
        : [];

    const pkaBase =
        (forceBase === "faible" && coupleBaseId && BASES_DB[coupleBaseId])
        ? BASES_DB[coupleBaseId].pka[0]
        : null;

    // nombre d'équivalences (protons échangeables côté acide si polyacide,
    // sinon toujours 1 — les bases de ce chapitre sont monoacides)
    const nEquivalences =
        (natureTitre === "acide" && forceAcide === "faible" && pkaAcide.length > 0)
        ? pkaAcide.length
        : 1;

    return {
        va,
        ca,
        cb,
        natureTitre,
        natureAcide: forceAcide,
        natureBase: forceBase,
        pkaAcide,
        pkaBase,
        nEquivalences
    };

}

/* ==========================================================
   VOLUME(S) D'EQUIVALENCE THEORIQUE(S)
   ========================================================== */

function calculerVeTheorique() {

    const { va, ca, cb, nEquivalences } =
        getParametresTitrage();

    const zone =
        $("ve-theo");

    if (!zone) return null;

    if (va <= 0 || ca <= 0 || cb <= 0) {

        zone.textContent = "—";
        return null;

    }

    const veqUnitaire =
        (ca * va) / cb;

    if (nEquivalences <= 1) {

        zone.textContent =
            `${veqUnitaire.toFixed(2)} mL`;

        return [veqUnitaire];

    }

    const liste = [];
    for (let i = 1; i <= nEquivalences; i++) {
        liste.push(i * veqUnitaire);
    }

    zone.textContent =
        liste.map((v, i) => `Veq${i + 1} = ${v.toFixed(2)} mL`).join("  ·  ");

    return liste;

}

/* ==========================================================
   TABLEAU DE MESURES
   ========================================================== */

function initMesures() {

    $("btn-ajouter-mesure")
        ?.addEventListener(
            "click",
            ajouterLigneMesure
        );

    $("btn-vider-mesures")
        ?.addEventListener(
            "click",
            viderMesures
        );

    $("btn-generer-theorique")
        ?.addEventListener(
            "click",
            () => {
                dessinerCourbe();
                calculerResultatsAutomatiques();
            }
        );

}


function ajouterLigneMesure() {

    const tbody =
        $("tbody-mesures");

    if (!tbody) return;

    const pas =
        Number($("pas-rapide")?.value) || 0.5;

    const derniereLigne =
        mesures[mesures.length - 1];

    const volumeSuggere =
        derniereLigne
        ? Number((derniereLigne.volume + pas).toFixed(2))
        : 0;

    const id =
        `m${Date.now()}${Math.random().toString(16).slice(2, 6)}`;

    const mesure = {
        id,
        volume: volumeSuggere,
        pH: 7,
        observation: ""
    };

    mesures.push(mesure);

    const tr =
        document.createElement("tr");

    tr.dataset.id = id;

    tr.innerHTML = `
        <td>
            <input type="number" step="0.01"
                   class="input-volume"
                   value="${mesure.volume}">
        </td>
        <td>
            <input type="number" step="0.01"
                   class="input-ph"
                   value="${mesure.pH}">
        </td>
        <td>
            <input type="text"
                   class="input-observation"
                   value="">
        </td>
        <td>
            <button type="button" class="btn btn-danger btn-suppr-mesure">
                🗑
            </button>
        </td>
    `;

    tbody.appendChild(tr);


    tr.querySelector(".input-volume")
        .addEventListener("input", (e) => {
            majMesure(id, "volume", Number(e.target.value));
        });

    tr.querySelector(".input-ph")
        .addEventListener("input", (e) => {
            majMesure(id, "pH", Number(e.target.value));
        });

    tr.querySelector(".input-observation")
        .addEventListener("input", (e) => {
            majMesure(id, "observation", e.target.value);
        });

    tr.querySelector(".btn-suppr-mesure")
        .addEventListener("click", () => {
            supprimerMesure(id, tr);
        });


    dessinerCourbe();
    calculerResultatsAutomatiques();

}


function majMesure(id, champ, valeur) {

    const mesure =
        mesures.find(m => m.id === id);

    if (!mesure) return;

    mesure[champ] = valeur;

    dessinerCourbe();
    calculerResultatsAutomatiques();

}


function supprimerMesure(id, tr) {

    mesures =
        mesures.filter(m => m.id !== id);

    tr.remove();

    dessinerCourbe();
    calculerResultatsAutomatiques();

}


function viderMesures() {

    mesures = [];

    const tbody =
        $("tbody-mesures");

    if (tbody)
        tbody.innerHTML = "";

    dessinerCourbe();
    calculerResultatsAutomatiques();

}

/* ==========================================================
   COURBE THEORIQUE (simulation pH = f(V))
   ========================================================== */

function genererCourbeTheorique() {

    const {
        va,
        ca,
        cb,
        natureTitre,
        natureAcide,
        natureBase,
        pkaAcide,
        pkaBase,
        nEquivalences
    } = getParametresTitrage();

    if (va <= 0 || ca <= 0 || cb <= 0)
        return [];

    const veqUnitaire =
        (ca * va) / cb;

    const veqTotal =
        veqUnitaire * nEquivalences;

    const vMax =
        (veqTotal * 1.6) || 20;

    const nPas = 400; // résolution fine pour des tracés lisses (spline / dérivée)
    const pas =
        Math.max(vMax / nPas, 0.01);

    const points = [];

    for (let v = 0; v <= vMax; v += pas) {

        const pH = phGeneral({
            Va: va,
            Ca: ca,
            natureTitre,
            forceAcide: natureAcide,
            forceBase: natureBase,
            pkaAcide,
            pkaBase,
            Vb: v,
            Cb: cb
        });

        points.push({
            x: Number(v.toFixed(3)),
            y: Number(clamp(pH, 0, 14).toFixed(3))
        });

    }

    return points;

}

/* ==========================================================
   DERIVEE (à partir des mesures expérimentales)
   ========================================================== */

function calculerDeriveeMesures() {
    return calculerDeriveePoints(
        [...mesures]
        .sort((a, b) => a.volume - b.volume)
        .map(m => ({ x: m.volume, y: m.pH }))
    );
}

/**
 * Dérivée numérique (différences centrées) d'une série de points {x,y}
 * triés par x croissant. Retourne [{ volume, valeur }].
 */
function calculerDeriveePoints(points) {

    const derivees = [];

    for (let i = 1; i < points.length; i++) {

        const p0 = points[i - 1];
        const p1 = points[i];

        const dV = p1.x - p0.x;
        const dpH = p1.y - p0.y;

        if (dV !== 0) {

            derivees.push({
                volume: (p0.x + p1.x) / 2,
                valeur: dpH / dV
            });

        }

    }

    return derivees;

}


/**
 * Renvoie le jeu de points actuellement le plus pertinent à analyser :
 * les mesures expérimentales si assez nombreuses, sinon la courbe théorique.
 */
function obtenirPointsAnalyse() {

    const exp =
        [...mesures]
        .sort((a, b) => a.volume - b.volume)
        .map(m => ({ x: m.volume, y: m.pH }));

    if (exp.length >= 5) return { points: exp, source: "experimentale" };

    const theo = genererCourbeTheorique();

    return { points: theo, source: "theorique" };

}


/**
 * Détecte les points d'équivalence (un ou plusieurs, cas des polyacides)
 * comme les maxima locaux de |dpH/dV|, suffisamment espacés.
 */
function detecterEquivalences(points, nAttendues = 1) {

    if (points.length < 5) return [];

    const derivees =
        calculerDeriveePoints(points);

    if (derivees.length < 3) return [];

    const vMin = points[0].x;
    const vMax = points[points.length - 1].x;
    const ecartMin = (vMax - vMin) * 0.08; // sépare les équivalences voisines

    // maxima locaux de |dérivée|
    const pics = [];

    for (let i = 1; i < derivees.length - 1; i++) {

        const a = Math.abs(derivees[i - 1].valeur);
        const b = Math.abs(derivees[i].valeur);
        const c = Math.abs(derivees[i + 1].valeur);

        if (b >= a && b >= c && b > 1e-6) {
            pics.push(derivees[i]);
        }

    }

    if (pics.length === 0) return [];

    pics.sort((p1, p2) => Math.abs(p2.valeur) - Math.abs(p1.valeur));

    const retenus = [];

    for (const pic of pics) {

        const tropProche =
            retenus.some(r => Math.abs(r.volume - pic.volume) < ecartMin);

        if (!tropProche) retenus.push(pic);

        if (retenus.length >= nAttendues) break;

    }

    retenus.sort((a, b) => a.volume - b.volume);

    return retenus.map(pic => {

        // pH au point d'équivalence : interpolation sur la courbe de points
        const proche =
            points.reduce((prev, curr) =>
                Math.abs(curr.x - pic.volume) < Math.abs(prev.x - pic.volume)
                ? curr : prev
            );

        return { x: pic.volume, y: proche.y, pente: pic.valeur };

    });

}

/* ==========================================================
   RESULTATS AUTOMATIQUES (tangentes / dérivées)
   ========================================================== */

function calculerResultatsAutomatiques() {

    const { ca, va, cb, nEquivalences } =
        getParametresTitrage();

    const { points } =
        obtenirPointsAnalyse();

    const blocTangentes =
        $("resultat-tangentes");

    const blocDerivee =
        $("resultat-derivee");

    const blocComparaison =
        $("resultat-comparaison");

    const equivalences =
        detecterEquivalences(points, nEquivalences);

    if (equivalences.length === 0) {

        if (blocTangentes) blocTangentes.style.display = "none";
        if (blocDerivee) blocDerivee.style.display = "none";
        if (blocComparaison) blocComparaison.style.display = "none";

        return;

    }

    const texteVeq =
        equivalences
        .map((e, i) => equivalences.length > 1
            ? `Veq${i + 1} = ${e.x.toFixed(2)}`
            : e.x.toFixed(2)
        )
        .join("  ·  ");

    const veqPrincipal =
        equivalences[0].x;

    const caCalc =
        va > 0 ? (cb * veqPrincipal) / va : 0;

    if (blocTangentes) {

        blocTangentes.style.display = "";

        $("ve-tangentes").textContent = texteVeq;
        $("ca-tangentes").textContent = caCalc.toFixed(4);

    }

    if (blocDerivee) {

        blocDerivee.style.display = "";

        $("ve-derivee").textContent = texteVeq;
        $("ca-derivee").textContent = caCalc.toFixed(4);

    }

    if (blocComparaison) {

        const veqTheo =
            (ca * va) / cb;

        const ecart =
            Math.abs(veqPrincipal - veqTheo);

        const erreurRel =
            veqTheo > 0
            ? (ecart / veqTheo) * 100
            : 0;

        blocComparaison.style.display = "";

        $("ecart-ve").textContent = ecart.toFixed(2);
        $("erreur-relative").textContent = erreurRel.toFixed(1);

    }

}

/* ==========================================================
   CANVAS — COURBE DE TITRAGE
   ========================================================== */

function initCourbe() {

    [
        "chk-experimentale",
        "chk-theorique"
    ]
    .forEach(
        id => {

            $(id)?.addEventListener(
                "change",
                dessinerCourbe
            );

        }
    );

    [
        "btn-tangentes",
        "btn-derivee"
    ]
    .forEach(
        id => {

            const btn = $(id);
            if (!btn) return;

            btn.addEventListener(
                "click",
                () => {

                    const actif =
                        btn.classList.toggle("actif");

                    btn.setAttribute(
                        "aria-pressed",
                        actif ? "true" : "false"
                    );

                    calculerResultatsAutomatiques();
                    dessinerCourbe();

                }
            );

        }
    );

    $("btn-zoom-reset")
        ?.addEventListener(
            "click",
            () => {
                zoomRange = null;
                dessinerCourbe();
            }
        );

    window.addEventListener(
        "resize",
        dessinerCourbe
    );

}


function redimensionnerCanvas(canvas) {

    const parent =
        canvas.parentElement;

    if (!parent) return;

    const largeurCss =
        parent.clientWidth || 600;

    canvas.width =
        largeurCss;

    canvas.height =
        canvas.height || 400;

}


function dessinerCourbe() {

    const canvas =
        $("canvas-titrage");

    if (!canvas) return;

    redimensionnerCanvas(canvas);

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const afficherExp =
        $("chk-experimentale")?.checked ?? true;

    const afficherTheo =
        $("chk-theorique")?.checked ?? true;

    const afficherTangentes =
        $("btn-tangentes")?.classList.contains("actif") ?? false;

    const afficherDeriveeBtn =
        $("btn-derivee")?.classList.contains("actif") ?? false;


    const pointsTheo =
        afficherTheo ? genererCourbeTheorique() : [];

    const pointsExp =
        afficherExp
        ? [...mesures].sort((a, b) => a.volume - b.volume)
        : [];

    const tousLesPoints =
        [
            ...pointsTheo.map(p => p.x),
            ...pointsExp.map(p => p.volume)
        ];

    if (tousLesPoints.length === 0) {

        dessinerAxes(ctx, canvas, 0, 20);
        return;

    }

    let vMin =
        zoomRange ? zoomRange.vMin : 0;

    let vMax =
        zoomRange ? zoomRange.vMax : Math.max(...tousLesPoints, 1);


    dessinerAxes(ctx, canvas, vMin, vMax);


    if (afficherTheo && pointsTheo.length > 0) {

        tracerCourbe(
            ctx,
            canvas,
            pointsTheo.map(p => ({ x: p.x, y: p.y })),
            vMin,
            vMax,
            { couleur: "#8a8a8a", epaisseur: 2, marqueurs: false }
        );

    }

    if (afficherExp && pointsExp.length > 0) {

        tracerCourbe(
            ctx,
            canvas,
            pointsExp.map(p => ({ x: p.volume, y: p.pH })),
            vMin,
            vMax,
            { couleur: "#c0392b", epaisseur: 2, marqueurs: true, tirets: [6, 4] }
        );

    }


    if (afficherTangentes || afficherDeriveeBtn) {

        const { points: pointsAnalyse } =
            obtenirPointsAnalyse();

        const { nEquivalences } =
            getParametresTitrage();

        const equivalences =
            detecterEquivalences(pointsAnalyse, nEquivalences);

        equivalences.forEach((eq, i) => {

            if (afficherTangentes) {

                dessinerTangentesParalleles(
                    ctx, canvas, pointsAnalyse, eq, vMin, vMax
                );

            }

            dessinerPointEquivalence(
                ctx, canvas, eq.x, eq.y, vMin, vMax,
                equivalences.length > 1 ? `Veq${i + 1}` : "Veq"
            );

        });

    }


    // panneau dérivée (canvas secondaire)
    const canvasDerivee =
        $("canvas-derivee");

    if (canvasDerivee) {

        canvasDerivee.style.display =
            afficherDeriveeBtn ? "" : "none";

        if (afficherDeriveeBtn) {

            dessinerDerivee(canvasDerivee, vMin, vMax);

        }

    }

}


function dessinerAxes(ctx, canvas, vMin, vMax) {

    const marge = 40;

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(marge, marge);
    ctx.lineTo(marge, canvas.height - marge);
    ctx.lineTo(canvas.width - marge, canvas.height - marge);
    ctx.stroke();

    ctx.fillStyle = "#333";
    ctx.font = "12px sans-serif";
    ctx.fillText("pH", 8, marge);
    ctx.fillText(
        `V (mL)`,
        canvas.width - marge - 10,
        canvas.height - marge + 20
    );
    ctx.fillText(vMin.toFixed(1), marge, canvas.height - marge + 20);
    ctx.fillText(vMax.toFixed(1), canvas.width - marge - 20, canvas.height - marge + 20);

}


function coordToPixel(canvas, x, y, vMin, vMax, marge = 40, yMin = 0, yMax = 14) {

    const largeur =
        canvas.width - 2 * marge;

    const hauteur =
        canvas.height - 2 * marge;

    const px =
        marge + ((x - vMin) / (vMax - vMin || 1)) * largeur;

    const py =
        canvas.height - marge - ((y - yMin) / (yMax - yMin)) * hauteur;

    return { px, py };

}


function tracerCourbe(ctx, canvas, points, vMin, vMax, options = {}) {

    const {
        couleur = "#333",
        epaisseur = 2,
        marqueurs = false,
        tirets = null
    } = options;

    ctx.strokeStyle = couleur;
    ctx.fillStyle = couleur;
    ctx.lineWidth = epaisseur;
    ctx.setLineDash(tirets || []);

    ctx.beginPath();

    points.forEach((p, i) => {

        const { px, py } =
            coordToPixel(canvas, p.x, p.y, vMin, vMax);

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);

    });

    ctx.stroke();
    ctx.setLineDash([]);


    if (marqueurs) {

        // marqueurs "+" façon papier d'examen, plus légers que des points pleins
        ctx.lineWidth = 1.4;

        points.forEach(p => {

            const { px, py } =
                coordToPixel(canvas, p.x, p.y, vMin, vMax);

            ctx.beginPath();
            ctx.moveTo(px - 4, py);
            ctx.lineTo(px + 4, py);
            ctx.moveTo(px, py - 4);
            ctx.lineTo(px, py + 4);
            ctx.stroke();

        });

    }

}


function dessinerPointEquivalence(ctx, canvas, x, y, vMin, vMax, etiquette = "Veq") {

    const { px, py } =
        coordToPixel(canvas, x, y, vMin, vMax);

    const marge = 40;

    ctx.strokeStyle = "#1B6CA8";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(px, canvas.height - marge);
    ctx.lineTo(px, py);
    ctx.lineTo(marge, py);
    ctx.stroke();

    ctx.setLineDash([]);

    ctx.fillStyle = "#1B6CA8";
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = "11px sans-serif";
    ctx.fillText(
        `${etiquette} = ${x.toFixed(2)} mL`,
        px + 8,
        py - 8
    );

}


/**
 * Pente locale d'une courbe {x,y} autour d'un index donné, par
 * régression linéaire simple sur une petite fenêtre de points.
 */
function penteLocale(points, index, fenetre = 4) {

    const i0 = clamp(index - fenetre, 0, points.length - 1);
    const i1 = clamp(index + fenetre, 0, points.length - 1);

    const sous = points.slice(i0, i1 + 1);

    if (sous.length < 2) return { pente: 0, x0: points[index].x, y0: points[index].y };

    const n = sous.length;
    const sx = sous.reduce((s, p) => s + p.x, 0);
    const sy = sous.reduce((s, p) => s + p.y, 0);
    const sxy = sous.reduce((s, p) => s + p.x * p.y, 0);
    const sxx = sous.reduce((s, p) => s + p.x * p.x, 0);

    const denom = (n * sxx - sx * sx) || 1e-9;
    const pente = (n * sxy - sx * sy) / denom;

    return {
        pente,
        x0: sx / n,
        y0: sy / n
    };

}


/**
 * Méthode des tangentes parallèles (protocole Bac Pro) :
 * deux tangentes parallèles de part et d'autre du point d'inflexion,
 * puis la droite équidistante des deux, qui coupe la courbe au
 * point d'équivalence.
 */
function dessinerTangentesParalleles(ctx, canvas, points, equivalence, vMin, vMax) {

    if (points.length < 8) return;

    const idxEq =
        points.reduce(
            (best, p, i) =>
                Math.abs(p.x - equivalence.x) < Math.abs(points[best].x - equivalence.x)
                ? i : best,
            0
        );

    const portee =
        (vMax - vMin) * 0.32;

    const trouverIndexProche = (v) =>
        points.reduce(
            (best, p, i) =>
                Math.abs(p.x - v) < Math.abs(points[best].x - v) ? i : best,
            0
        );

    const idxAvant =
        trouverIndexProche(equivalence.x - portee);

    const idxApres =
        trouverIndexProche(equivalence.x + portee);

    if (idxAvant === idxEq || idxApres === idxEq) return;

    const armAvant = penteLocale(points, idxAvant);
    const armApres = penteLocale(points, idxApres);

    // pente commune = moyenne des deux pentes locales (loin de l'inflexion,
    // la courbe y est quasi plate, donc les deux pentes sont proches)
    const penteCommune =
        (armAvant.pente + armApres.pente) / 2;

    const bAvant = armAvant.y0 - penteCommune * armAvant.x0;
    const bApres = armApres.y0 - penteCommune * armApres.x0;
    const bMilieu = (bAvant + bApres) / 2;

    const demiLongueur =
        (vMax - vMin) * 0.16;

    function tracerDroite(b, x0, style) {

        const xA = x0 - demiLongueur;
        const xB = x0 + demiLongueur;

        const pA = coordToPixel(canvas, xA, clamp(penteCommune * xA + b, -2, 16), vMin, vMax);
        const pB = coordToPixel(canvas, xB, clamp(penteCommune * xB + b, -2, 16), vMin, vMax);

        ctx.strokeStyle = style.couleur;
        ctx.lineWidth = style.epaisseur;
        ctx.setLineDash(style.tirets || []);

        ctx.beginPath();
        ctx.moveTo(pA.px, pA.py);
        ctx.lineTo(pB.px, pB.py);
        ctx.stroke();

        ctx.setLineDash([]);

    }

    // deux tangentes parallèles (noir, tiretées)
    tracerDroite(bAvant, armAvant.x0, { couleur: "#111", epaisseur: 1.5, tirets: [5, 4] });
    tracerDroite(bApres, armApres.x0, { couleur: "#111", epaisseur: 1.5, tirets: [5, 4] });

    // droite médiane (équidistante), plus longue, solide
    const xMilieu = equivalence.x;
    const xA = xMilieu - demiLongueur * 1.3;
    const xB = xMilieu + demiLongueur * 1.3;

    const pA = coordToPixel(canvas, xA, clamp(penteCommune * xA + bMilieu, -2, 16), vMin, vMax);
    const pB = coordToPixel(canvas, xB, clamp(penteCommune * xB + bMilieu, -2, 16), vMin, vMax);

    ctx.strokeStyle = "#111";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pA.px, pA.py);
    ctx.lineTo(pB.px, pB.py);
    ctx.stroke();

    // petit indicateur d'angle droit à l'intersection avec la courbe
    const pEq = coordToPixel(canvas, equivalence.x, equivalence.y, vMin, vMax);

    // vecteur directeur de la médiane, normalisé
    const dx = pB.px - pA.px;
    const dy = pB.py - pA.py;
    const norme = Math.hypot(dx, dy) || 1;
    const ux = dx / norme, uy = dy / norme;
    const nx = -uy, ny = ux; // perpendiculaire

    const taille = 9;

    ctx.strokeStyle = "#111";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pEq.px + nx * taille, pEq.py + ny * taille);
    ctx.lineTo(pEq.px + nx * taille + ux * taille, pEq.py + ny * taille + uy * taille);
    ctx.lineTo(pEq.px + ux * taille, pEq.py + uy * taille);
    ctx.stroke();

}


function dessinerDerivee(canvas, vMin, vMax) {

    redimensionnerCanvas(canvas);

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { points } =
        obtenirPointsAnalyse();

    const { nEquivalences } =
        getParametresTitrage();

    const derivees =
        calculerDeriveePoints(points);

    if (derivees.length === 0) return;

    const maxAbs =
        Math.max(...derivees.map(d => Math.abs(d.valeur)), 1);

    const marge = 40;

    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(marge, marge);
    ctx.lineTo(marge, canvas.height - marge);
    ctx.lineTo(canvas.width - marge, canvas.height - marge);
    ctx.stroke();

    ctx.fillStyle = "#333";
    ctx.font = "12px sans-serif";
    ctx.fillText("|dpH/dV|", 4, marge - 6);
    ctx.fillText("V (mL)", canvas.width - marge - 40, canvas.height - marge + 20);

    const xPix = (v) =>
        marge + ((v - vMin) / (vMax - vMin || 1)) * (canvas.width - 2 * marge);

    const yPix = (val) =>
        canvas.height - marge - (Math.abs(val) / maxAbs) * (canvas.height - 2 * marge);

    ctx.strokeStyle = "#8e44ad";
    ctx.lineWidth = 2;
    ctx.beginPath();

    derivees.forEach((d, i) => {

        const px = xPix(d.volume);
        const py = yPix(d.valeur);

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);

    });

    ctx.stroke();

    // pics (points d'équivalence) en rouge
    const equivalences =
        detecterEquivalences(points, nEquivalences);

    ctx.fillStyle = "#c0392b";

    equivalences.forEach(eq => {

        const px = xPix(eq.x);
        const py = yPix(eq.pente);

        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();

    });

}

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
