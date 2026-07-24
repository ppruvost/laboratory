/**
 * tp-thermique/js/tp03-changement-etat.js
 *
 * Contrôleur du TP03 « Changement d'état d'un corps pur ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-thermique/modules/tp03-changement-etat.html dans #content.
 *
 * navigation.js exécute module.init() après l'import : le point
 * d'entrée doit s'appeler init().
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';

// Constantes physiques utilisées dans ce TP (eau)
const C_GLACE = 2100;      // J.kg-1.°C-1 (glace)
const C_EAU = 4185;        // J.kg-1.°C-1 (eau liquide)
const L_FUSION = 334000;   // J/kg
const L_VAPORISATION = 2260000; // J/kg

import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-thermique.js';
import { initMateriel } from '../../js/materiel.js';
import glassware from '../../data/glassware.js';
import laboratoryEquipment from '../../data/equipment.js';
import { dessinerGraphiqueLigne } from '../../js/graphique.js';

const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "Un brasage ou une soudure à l'étain nécessite de faire fondre un alliage d'apport : sa température doit rester constante pendant toute la fusion pour garantir un assemblage homogène, sans surchauffer inutilement les pièces à assembler.",
    problematique: "Quelle énergie faut-il apporter pour faire fondre l'alliage de brasure nécessaire à un assemblage, et pourquoi sa température reste-t-elle constante pendant cette fusion ?",
  },

  '2nde-mcc': {
    contexte: "L'entoilage thermocollant utilisé pour renforcer un tissu contient une colle qui doit atteindre sa température de fusion, et y rester le temps nécessaire, pour adhérer correctement sans endommager la matière.",
    problematique: "Pourquoi la colle thermofusible d'un entoilage doit-elle atteindre une température précise et y rester constante pour bien adhérer au tissu ?",
  },

};

export function init() {
  initPalier();
  initEnergieLatente();
  initBilanComplet();

  initMateriel({
    verreId: 'materiel-verrerie',
    equipementId: 'materiel-equipements',
    glassware,
    equipment: laboratoryEquipment,
    categorie: 'ChangementEtat',
  });

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  initSections();
  initTabs();
  initModesOperatoires();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: "Changement d'état d'un corps pur",
    tp: 'TP03',
  });
}

// =================================================================
// Onglet 1 — Relevé du palier de température
// Détection simple : 3 points consécutifs ou plus dont l'écart de
// température reste inférieur à un seuil (0.5°C) alors que le temps
// avance
// =================================================================
function initPalier() {

  const btnAjouter = $('palier-ajouter');
  const inputTemps = $('palier-temps');
  const inputTemp = $('palier-temp');
  const tbody = $('tbody-palier');
  const zoneDetection = $('palier-detection');

  if (!btnAjouter || !tbody) return;

  const points = [];

  btnAjouter.addEventListener('click', () => {

    const t = parseFloat(inputTemps.value);
    const temp = parseFloat(inputTemp.value);

    if (Number.isNaN(t) || Number.isNaN(temp)) return;

    points.push({ t, temp });
    points.sort((a, b) => a.t - b.t);

    redessinerTableauPalier(tbody, points);
    detecterPalier(zoneDetection, points);

    dessinerGraphiqueLigne(
      'graphique-palier',
      points.map(p => ({ x: p.t, y: p.temp })),
      { xLabel: 'Temps (s)', yLabel: 'Température (°C)' }
    );

    inputTemps.value = '';
    inputTemp.value = '';
    inputTemps.focus();
  });
}

function redessinerTableauPalier(tbody, points) {

  tbody.innerHTML = '';

  points.forEach((pt, i) => {

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${arrondir(pt.t, 0)} s</td>
      <td>${arrondir(pt.temp, 1)} °C</td>
    `;

    tbody.appendChild(tr);
  });
}

const SEUIL_PALIER = 0.5; // °C : écart max entre points considérés en palier

function detecterPalier(zone, points) {

  if (!zone) return;

  if (points.length < 3) {
    zone.textContent = 'Ajouter au moins trois points pour détecter automatiquement un éventuel palier (plusieurs mesures consécutives à température quasi constante).';
    return;
  }

  // recherche de la plus longue séquence de points consécutifs
  // dont l'écart de température au premier point de la séquence
  // reste inférieur au seuil
  let meilleureSequence = [];
  let sequenceCourante = [points[0]];

  for (let i = 1; i < points.length; i++) {

    const ecart = Math.abs(points[i].temp - sequenceCourante[0].temp);

    if (ecart <= SEUIL_PALIER) {
      sequenceCourante.push(points[i]);
    } else {
      if (sequenceCourante.length > meilleureSequence.length) {
        meilleureSequence = sequenceCourante;
      }
      sequenceCourante = [points[i]];
    }
  }

  if (sequenceCourante.length > meilleureSequence.length) {
    meilleureSequence = sequenceCourante;
  }

  if (meilleureSequence.length < 3) {
    zone.textContent = 'Aucun palier net détecté pour l\'instant : les températures varient sur l\'ensemble des points saisis.';
    return;
  }

  const debut = meilleureSequence[0];
  const fin = meilleureSequence[meilleureSequence.length - 1];
  const tempMoyenne = meilleureSequence.reduce((s, p) => s + p.temp, 0) / meilleureSequence.length;

  zone.innerHTML = `
    Palier détecté entre t = ${arrondir(debut.t, 0)} s et
    t = ${arrondir(fin.t, 0)} s (durée : ${arrondir(fin.t - debut.t, 0)} s),
    à une température moyenne de ${arrondir(tempMoyenne, 1)} °C.
  `;
}

// =================================================================
// Onglet 2 — Énergie de changement d'état Q = m × L
// =================================================================
function initEnergieLatente() {

  const selectType = $('el-type');
  const inputMasse = $('el-masse');
  const inputL = $('el-l');
  const outputQ = $('el-q');

  if (!selectType || !inputMasse || !inputL || !outputQ) return;

  function chaleurLatente() {
    return selectType.value === 'vaporisation' ? L_VAPORISATION : L_FUSION;
  }

  function calculer() {

    inputL.value = chaleurLatente();

    const masseKg = parseFloat(inputMasse.value) / 1000;
    const l = chaleurLatente();

    if (Number.isNaN(masseKg)) {
      outputQ.textContent = '—';
      return;
    }

    const q = masseKg * l;

    outputQ.textContent = `${arrondir(q, 0)} J`;
  }

  selectType.addEventListener('change', calculer);
  inputMasse.addEventListener('input', calculer);

  calculer();
}

// =================================================================
// Onglet 3 — Bilan énergétique complet : glace à T_initiale (< 0°C)
// jusqu'à vapeur à 100°C, décomposé en 4 étapes
// =================================================================
function initBilanComplet() {

  const inputMasse = $('bc-masse');
  const inputTempInitiale = $('bc-temp-initiale');
  const tbody = $('tbody-bilan-complet');
  const outputTotal = $('bc-total');

  if (!inputMasse || !inputTempInitiale || !tbody || !outputTotal) return;

  function calculer() {

    const masseG = parseFloat(inputMasse.value);
    const tInitiale = parseFloat(inputTempInitiale.value);

    if (Number.isNaN(masseG) || Number.isNaN(tInitiale) || tInitiale >= 0) {
      tbody.innerHTML = `<tr><td colspan="4">Saisir une masse et une température initiale négative (glace).</td></tr>`;
      outputTotal.innerHTML = '<strong>—</strong>';
      return;
    }

    const masseKg = masseG / 1000;

    // Étape 1 : réchauffement de la glace de T_initiale à 0°C (sensible)
    const deltaT1 = 0 - tInitiale;
    const q1 = masseKg * C_GLACE * deltaT1;

    // Étape 2 : fusion à 0°C (latent)
    const q2 = masseKg * L_FUSION;

    // Étape 3 : réchauffement de l'eau liquide de 0°C à 100°C (sensible)
    const deltaT3 = 100;
    const q3 = masseKg * C_EAU * deltaT3;

    // Étape 4 : vaporisation à 100°C (latent)
    const q4 = masseKg * L_VAPORISATION;

    const total = q1 + q2 + q3 + q4;

    tbody.innerHTML = `
      <tr>
        <td>1</td>
        <td>Réchauffement solide (sensible)</td>
        <td>Q = mc(glace)Δθ = ${arrondir(masseKg, 3)} × ${C_GLACE} × ${arrondir(deltaT1, 1)}</td>
        <td>${arrondir(q1, 0)} J</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Fusion à 0°C (latent)</td>
        <td>Q = mL(fusion) = ${arrondir(masseKg, 3)} × ${L_FUSION}</td>
        <td>${arrondir(q2, 0)} J</td>
      </tr>
      <tr>
        <td>3</td>
        <td>Réchauffement liquide (sensible)</td>
        <td>Q = mc(eau)Δθ = ${arrondir(masseKg, 3)} × ${C_EAU} × ${deltaT3}</td>
        <td>${arrondir(q3, 0)} J</td>
      </tr>
      <tr>
        <td>4</td>
        <td>Vaporisation à 100°C (latent)</td>
        <td>Q = mL(vaporisation) = ${arrondir(masseKg, 3)} × ${L_VAPORISATION}</td>
        <td>${arrondir(q4, 0)} J</td>
      </tr>
    `;

    outputTotal.innerHTML = `<strong>${arrondir(total, 0)} J</strong>`;
  }

  inputMasse.addEventListener('input', calculer);
  inputTempInitiale.addEventListener('input', calculer);

  calculer();
}
