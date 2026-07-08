/**
 * tp03-titrages.js
 *
 * TP03 — Titrages acido-basiques (pH-métrie)
 *
 * Architecture modulaire (identique à TP01) :
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
   BASE pKa (couples acide/base faibles)
   ========================================================== */

const PKA_DB = {

    CH3COOH: [4.76],
    HF:      [3.17],
    HNO2:    [3.34],
    "NH4+":  [9.25],
    H2O2:    [11.6],
    H3BO3:   [9.24],

    H2C2O4:  [1.25, 4.14],
    H2CO3:   [6.35, 10.33],
    H2S:     [7.0, 13.0],
    H3PO4:   [2.15, 7.20, 12.35],
    H4EDTA:  [2.0, 2.67, 6.16, 10.26]

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

function phStrongAcidStrongBase({ Ca, Va, Cb, Vb }) {
    const na = Ca * Va;
    const nb = Cb * Vb;
    const Vt = Va + Vb;

    if (Vt <= 0) return 7;
    if (Math.abs(na - nb) < 1e-18) return 7;

    if (na > nb) {
        const h = (na - nb) / Vt;
        return phFromH(h);
    }

    const oh = (nb - na) / Vt;
    return clamp(14 - phFromH(oh), 0, 14);
}

function phWeakAcidStrongBase({ Ca, Va, Cb, Vb, Ka, Kw = 1e-14 }) {
    const na = Ca * Va;
    const nb = Cb * Vb;
    const Vt = Va + Vb;
    const pKa = -log10(Ka);

    if (Vt <= 0) return 7;

    if (Vb <= 0) {
        const C = na / Vt;
        const x = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * C)) / 2;
        return phFromH(x);
    }

    if (nb < na - 1e-15) {
        const nHA = na - nb;
        const nA = nb;

        if (nA <= 0) {
            const C = na / Vt;
            const x = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * C)) / 2;
            return phFromH(x);
        }

        return clamp(pKa + log10(nA / nHA), 0, 14);
    }

    if (Math.abs(nb - na) <= 1e-15) {
        const Cb = na / Vt;
        const Kb = Kw / Ka;
        const x = (-Kb + Math.sqrt(Kb * Kb + 4 * Kb * Cb)) / 2;
        return clamp(14 - phFromH(x), 0, 14);
    }

    const oh = (nb - na) / Vt;
    return clamp(14 - phFromH(oh), 0, 14);
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

function initParametresTitrage() {

    [
        "va",
        "ca",
        "cb",
        "sel-acide",
        "sel-base",
        "pka-select"
    ]
    .forEach(
        id => {

            const el = $(id);

            if (!el) return;

            el.addEventListener(
                "input",
                () => {
                    calculerVeTheorique();
                    dessinerCourbe();
                }
            );

            el.addEventListener(
                "change",
                () => {
                    calculerVeTheorique();
                    dessinerCourbe();
                }
            );

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

    const natureAcide =
        $("sel-acide")?.value || "fort";

    const natureBase =
        $("sel-base")?.value || "fort";

    const coupleId =
        $("pka-select")?.value || null;

    const pkaListe =
        coupleId && PKA_DB[coupleId]
        ? PKA_DB[coupleId]
        : [];

    return {
        va,
        ca,
        cb,
        natureAcide,
        natureBase,
        pkaListe
    };

}



/* ==========================================================
   VOLUME D'EQUIVALENCE THEORIQUE
   ========================================================== */

function calculerVeTheorique() {

    const { va, ca, cb } =
        getParametresTitrage();

    const zone =
        $("ve-theo");

    if (!zone) return;

    if (va <= 0 || ca <= 0 || cb <= 0) {

        zone.textContent = "—";
        return null;

    }

    const veq =
        (ca * va) / cb;

    zone.textContent =
        `${veq.toFixed(2)} mL`;

    return veq;

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
        natureAcide,
        natureBase,
        pkaListe
    } = getParametresTitrage();

    if (va <= 0 || ca <= 0 || cb <= 0)
        return [];

    const veq =
        (ca * va) / cb;

    const vMax =
        veq * 2 || 20;

    const pas =
        Math.max(vMax / 200, 0.05);

    const pka =
        pkaListe.length
        ? pkaListe[0]
        : null;

    const points = [];

    for (let v = 0; v <= vMax; v += pas) {

        let pH = 7;

        if (natureAcide === "fort" && natureBase === "fort") {
            pH = phStrongAcidStrongBase({
                Ca: ca,
                Va: va,
                Cb: cb,
                Vb: v
            });
        }
        else if (natureAcide === "faible" && natureBase === "fort" && pka !== null) {
            pH = phWeakAcidStrongBase({
                Ca: ca,
                Va: va,
                Cb: cb,
                Vb: v,
                Ka: Math.pow(10, -pka)
            });
        }
        else {
            // secours : modèle simplifié
            const nA0 = (ca * va) / 1000;
            const nB = (cb * v) / 1000;
            const volTotalL = (va + v) / 1000;

            if (v < veq) {
                const nRestant = nA0 - nB;
                const concentration = Math.max(nRestant, 1e-12) / volTotalL;
                pH = -Math.log10(concentration);
            }
            else if (Math.abs(v - veq) < pas) {
                pH = 7;
            }
            else {
                const exces = (nB - nA0);
                const concentrationOH = Math.max(exces, 1e-12) / volTotalL;
                pH = 14 + Math.log10(concentrationOH);
            }
        }

        pH = clamp(pH, 0, 14);

        points.push({
            x: Number(v.toFixed(2)),
            y: Number(pH.toFixed(2))
        });

    }

    return points;

}



/* ==========================================================
   DERIVEE (à partir des mesures expérimentales)
   ========================================================== */

function calculerDeriveeMesures() {

    const points =
        [...mesures]
        .sort((a, b) => a.volume - b.volume);

    const derivees = [];

    for (let i = 1; i < points.length; i++) {

        const p0 = points[i - 1];
        const p1 = points[i];

        const dV = p1.volume - p0.volume;
        const dpH = p1.pH - p0.pH;

        if (dV !== 0) {

            derivees.push({
                volume: (p0.volume + p1.volume) / 2,
                valeur: dpH / dV
            });

        }

    }

    return derivees;

}



/* ==========================================================
   RESULTATS AUTOMATIQUES (tangentes / dérivées)
   ========================================================== */

function calculerResultatsAutomatiques() {

    const { ca, va, cb } =
        getParametresTitrage();

    const derivees =
        calculerDeriveeMesures();

    const blocTangentes =
        $("resultat-tangentes");

    const blocDerivee =
        $("resultat-derivee");

    const blocComparaison =
        $("resultat-comparaison");

    if (derivees.length < 2) {

        if (blocTangentes) blocTangentes.style.display = "none";
        if (blocDerivee) blocDerivee.style.display = "none";
        if (blocComparaison) blocComparaison.style.display = "none";

        return;

    }

    const maxDerivee =
        derivees.reduce(
            (max, d) => (Math.abs(d.valeur) > Math.abs(max.valeur) ? d : max)
        );

    const veqExp =
        maxDerivee.volume;

    const caCalcExp =
        (cb * veqExp) / va;


    // Tangentes : approximation via le même point d'inflexion
    // (une construction géométrique complète peut être ajoutée
    //  ultérieurement si un module de courbe dédié existe déjà)

    if (blocTangentes) {

        blocTangentes.style.display = "";

        $("ve-tangentes").textContent =
            veqExp.toFixed(2);

        $("ca-tangentes").textContent =
            caCalcExp.toFixed(4);

    }

    if (blocDerivee) {

        blocDerivee.style.display = "";

        $("ve-derivee").textContent =
            veqExp.toFixed(2);

        $("ca-derivee").textContent =
            caCalcExp.toFixed(4);

    }

    if (blocComparaison) {

        const veqTheo =
            (ca * va) / cb;

        const ecart =
            Math.abs(veqExp - veqTheo);

        const erreurRel =
            veqTheo > 0
            ? (ecart / veqTheo) * 100
            : 0;

        blocComparaison.style.display =
            "";

        $("ecart-ve").textContent =
            ecart.toFixed(2);

        $("erreur-relative").textContent =
            erreurRel.toFixed(1);

    }

}



/* ==========================================================
   CANVAS — COURBE DE TITRAGE
   ========================================================== */

function initCourbe() {

    [
        "chk-experimentale",
        "chk-theorique",
        "chk-tangentes",
        "chk-derivee"
    ]
    .forEach(
        id => {

            $(id)?.addEventListener(
                "change",
                dessinerCourbe
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
        $("chk-tangentes")?.checked ?? false;

    const afficherDeriveeChk =
        $("chk-derivee")?.checked ?? false;


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
            "#888888",
            false
        );

    }

    if (afficherExp && pointsExp.length > 0) {

        tracerCourbe(
            ctx,
            canvas,
            pointsExp.map(p => ({ x: p.volume, y: p.pH })),
            vMin,
            vMax,
            "#c0392b",
            true
        );

    }

    if (
        (afficherTangentes || afficherDeriveeChk)
        && pointsExp.length >= 2
    ) {

        const derivees =
            calculerDeriveeMesures();

        if (derivees.length > 0) {

            const maxDerivee =
                derivees.reduce(
                    (max, d) =>
                        Math.abs(d.valeur) > Math.abs(max.valeur) ? d : max
                );

            const pointEq =
                pointsExp.reduce((prev, curr) =>
                    Math.abs(curr.volume - maxDerivee.volume)
                    < Math.abs(prev.volume - maxDerivee.volume)
                    ? curr : prev
                );

            dessinerPointEquivalence(
                ctx,
                canvas,
                pointEq.volume,
                pointEq.pH,
                vMin,
                vMax
            );

        }

    }


    // panneau dérivée (canvas secondaire)
    const canvasDerivee =
        $("canvas-derivee");

    if (canvasDerivee) {

        canvasDerivee.style.display =
            afficherDeriveeChk ? "" : "none";

        if (afficherDeriveeChk) {

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


function tracerCourbe(ctx, canvas, points, vMin, vMax, couleur, marqueurs) {

    ctx.strokeStyle = couleur;
    ctx.fillStyle = couleur;
    ctx.lineWidth = 2;

    ctx.beginPath();

    points.forEach((p, i) => {

        const { px, py } =
            coordToPixel(canvas, p.x, p.y, vMin, vMax);

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);

    });

    ctx.stroke();


    if (marqueurs) {

        points.forEach(p => {

            const { px, py } =
                coordToPixel(canvas, p.x, p.y, vMin, vMax);

            ctx.beginPath();
            ctx.arc(px, py, 3, 0, Math.PI * 2);
            ctx.fill();

        });

    }

}


function dessinerPointEquivalence(ctx, canvas, x, y, vMin, vMax) {

    const { px, py } =
        coordToPixel(canvas, x, y, vMin, vMax);

    ctx.strokeStyle = "#1B6CA8";
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(px, canvas.height - 40);
    ctx.lineTo(px, py);
    ctx.lineTo(40, py);
    ctx.stroke();

    ctx.setLineDash([]);

    ctx.fillStyle = "#1B6CA8";
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();

}


function dessinerDerivee(canvas, vMin, vMax) {

    redimensionnerCanvas(canvas);

    const ctx =
        canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const derivees =
        calculerDeriveeMesures();

    if (derivees.length === 0) return;

    const maxAbs =
        Math.max(...derivees.map(d => Math.abs(d.valeur)), 1);

    const marge = 40;

    ctx.strokeStyle = "#333";
    ctx.beginPath();
    ctx.moveTo(marge, marge);
    ctx.lineTo(marge, canvas.height - marge);
    ctx.lineTo(canvas.width - marge, canvas.height - marge);
    ctx.stroke();

    ctx.strokeStyle = "#8e44ad";
    ctx.lineWidth = 2;
    ctx.beginPath();

    derivees.forEach((d, i) => {

        const px =
            marge
            + ((d.volume - vMin) / (vMax - vMin || 1))
            * (canvas.width - 2 * marge);

        const py =
            canvas.height - marge
            - (Math.abs(d.valeur) / maxAbs)
            * (canvas.height - 2 * marge);

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);

    });

    ctx.stroke();

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
