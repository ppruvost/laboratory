/**
 * tp-thermique/js/tp02-equilibre-thermique.js
 *
 * Contrôleur du TP02 « Équilibre thermique et énergie échangée ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-thermique/modules/tp02-equilibre-thermique.html dans #content.
 *
 * navigation.js exécute module.init() après l'import : le point
 * d'entrée doit s'appeler init().
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
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
    contexte: "Un traitement thermique de trempe ou de revenu impose de porter un bain (huile ou eau) à une température précise, puis de contrôler l'énergie nécessaire pour l'y maintenir malgré l'introduction de pièces plus froides que le bain.",
    problematique: "Quelle énergie faut-il apporter à un bain de trempe pour compenser le refroidissement causé par l'introduction d'une pièce, et quelle température finale peut-on en attendre ?",
  },

  '2nde-mcc': {
    contexte: "En teinture textile, l'ajout d'eau froide dans un bain de teinture chaud fait évoluer l'ensemble vers une température d'équilibre qu'il faut savoir anticiper pour ne pas compromettre la fixation des couleurs.",
    problematique: "Comment prévoir la température finale d'un bain de teinture après ajout d'eau froide, et quelle énergie faut-il fournir pour le ramener à la bonne température ?",
  },

};

export function init() {
  initMelange();
  initEnergie();
  initSuiviTemporel();

  initMateriel({
    verreId: 'materiel-verrerie',
    equipementId: 'materiel-equipements',
    glassware,
    equipment: laboratoryEquipment,
    categorie: 'Equilibre',
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
    titre: 'Équilibre thermique et énergie échangée',
    tp: 'TP02',
  });
}

// =================================================================
// Onglet 1 — Équilibre thermique (mélange de deux masses d'eau)
// T_f = (m1*T1 + m2*T2) / (m1 + m2)
// =================================================================
function initMelange() {

  const inputM1 = $('melange-m1');
  const inputT1 = $('melange-t1');
  const inputM2 = $('melange-m2');
  const inputT2 = $('melange-t2');
  const outputTfTheo = $('melange-tf-theo');
  const inputTfExp = $('melange-tf-exp');
  const outputEcart = $('melange-ecart');
  const tableTfTheo = $('table-tf-theo');
  const tableTfExp = $('table-tf-exp');
  const tableTfEcart = $('table-tf-ecart');

  if (!inputM1 || !inputT1 || !inputM2 || !inputT2 || !outputTfTheo) return;

  let dernierTfTheo = null;

  function calculerTheo() {

    const m1 = parseFloat(inputM1.value);
    const t1 = parseFloat(inputT1.value);
    const m2 = parseFloat(inputM2.value);
    const t2 = parseFloat(inputT2.value);

    if ([m1, t1, m2, t2].some(Number.isNaN) || (m1 + m2) === 0) {
      outputTfTheo.textContent = '—';
      if (tableTfTheo) tableTfTheo.textContent = '—';
      dernierTfTheo = null;
      calculerEcart();
      calculerEcartTableau();
      return;
    }

    dernierTfTheo = (m1 * t1 + m2 * t2) / (m1 + m2);

    outputTfTheo.textContent = `${arrondir(dernierTfTheo, 1)} °C`;
    if (tableTfTheo) tableTfTheo.textContent = `${arrondir(dernierTfTheo, 1)} °C`;

    calculerEcart();
    calculerEcartTableau();
  }

  function calculerEcart() {

    if (!outputEcart || !inputTfExp) return;

    const tfExp = parseFloat(inputTfExp.value);

    if (dernierTfTheo === null || Number.isNaN(tfExp)) {
      outputEcart.textContent = '—';
      return;
    }

    const ecart = tfExp - dernierTfTheo;
    const signe = ecart >= 0 ? '+' : '';

    outputEcart.textContent = `${signe}${arrondir(ecart, 1)} °C`;
  }

  // Ligne "Température finale du mélange" du Tableau de résultats :
  // champ expérimental indépendant de celui de l'onglet Manipulations.
  function calculerEcartTableau() {

    if (!tableTfEcart || !tableTfExp) return;

    const exp = parseFloat(tableTfExp.value);

    if (dernierTfTheo === null || Number.isNaN(exp)) {
      tableTfEcart.textContent = '—';
      return;
    }

    const ecart = exp - dernierTfTheo;
    const signe = ecart >= 0 ? '+' : '';

    tableTfEcart.textContent = `${signe}${arrondir(ecart, 1)} °C`;
  }

  [inputM1, inputT1, inputM2, inputT2].forEach(el =>
    el.addEventListener('input', calculerTheo)
  );

  if (inputTfExp) inputTfExp.addEventListener('input', calculerEcart);
  if (tableTfExp) tableTfExp.addEventListener('input', calculerEcartTableau);

  calculerTheo();
}

// =================================================================
// Onglet 2 — Énergie échangée Q = m × c × Δθ
// masse saisie en g, c en J.kg-1.°C-1 => conversion en kg
// =================================================================
function initEnergie() {

  const inputMasse = $('energie-masse');
  const inputC = $('energie-c');
  const inputDeltaT = $('energie-delta-t');
  const outputQ = $('energie-q');
  const tableQTheo = $('table-q-theo');

  if (!inputMasse || !inputC || !inputDeltaT || !outputQ) return;

  function calculer() {

    const masseG = parseFloat(inputMasse.value);
    const c = parseFloat(inputC.value);
    const deltaT = parseFloat(inputDeltaT.value);

    if ([masseG, c, deltaT].some(Number.isNaN)) {
      outputQ.textContent = '—';
      if (tableQTheo) tableQTheo.textContent = '—';
      return;
    }

    const masseKg = masseG / 1000;
    const q = masseKg * c * deltaT;

    outputQ.textContent = `${arrondir(q, 0)} J`;
    if (tableQTheo) tableQTheo.textContent = `${arrondir(q, 0)} J`;
  }

  [inputMasse, inputC, inputDeltaT].forEach(el =>
    el.addEventListener('input', calculer)
  );

  calculer();
}

// =================================================================
// Onglet 3 — Suivi temporel : relevé (temps, température) et
// modélisation par régression linéaire (fonction affine θ = a.t + b)
// =================================================================
function initSuiviTemporel() {

  const btnAjouter = $('suivi-ajouter');
  const inputTemps = $('suivi-temps');
  const inputTemp = $('suivi-temp');
  const tbody = $('tbody-suivi-temporel');
  const zoneModelisation = $('suivi-modelisation');

  if (!btnAjouter || !tbody) return;

  const points = [];

  btnAjouter.addEventListener('click', () => {

    const t = parseFloat(inputTemps.value);
    const temp = parseFloat(inputTemp.value);

    if (Number.isNaN(t) || Number.isNaN(temp)) return;

    points.push({ t, temp });
    points.sort((a, b) => a.t - b.t);

    redessinerTableauSuivi(tbody, points);
    mettreAJourModelisation(zoneModelisation, points);

    dessinerGraphiqueLigne(
      'graphique-suivi-temporel',
      points.map(p => ({ x: p.t, y: p.temp })),
      { xLabel: 'Temps (s)', yLabel: 'Température (°C)' }
    );

    inputTemps.value = '';
    inputTemp.value = '';
    inputTemps.focus();
  });
}

function redessinerTableauSuivi(tbody, points) {

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

// Régression linéaire (moindres carrés) : renvoie {a, b}
// tel que temp ≈ a*t + b
function regressionLineaire(points) {

  const n = points.length;

  if (n < 2) return null;

  const sommeT = points.reduce((s, p) => s + p.t, 0);
  const sommeTemp = points.reduce((s, p) => s + p.temp, 0);
  const sommeTT = points.reduce((s, p) => s + p.t * p.t, 0);
  const sommeTTemp = points.reduce((s, p) => s + p.t * p.temp, 0);

  const denominateur = n * sommeTT - sommeT * sommeT;

  if (denominateur === 0) return null;

  const a = (n * sommeTTemp - sommeT * sommeTemp) / denominateur;
  const b = (sommeTemp - a * sommeT) / n;

  return { a, b };
}

function mettreAJourModelisation(zone, points) {

  if (!zone) return;

  const modele = regressionLineaire(points);

  if (!modele) {
    zone.textContent = 'Ajouter au moins deux points pour estimer le coefficient directeur a et l\'ordonnée à l\'origine b de la fonction affine.';
    return;
  }

  const signe = modele.b >= 0 ? '+' : '-';

  zone.innerHTML = `
    Modélisation affine estimée :
    <strong>θ(t) = ${arrondir(modele.a, 4)} × t ${signe} ${arrondir(Math.abs(modele.b), 2)}</strong><br>
    Coefficient directeur a = ${arrondir(modele.a, 4)} °C/s
    (${modele.a >= 0 ? 'échauffement' : 'refroidissement'}) —
    Ordonnée à l'origine b = ${arrondir(modele.b, 2)} °C
  `;
}
