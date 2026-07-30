/**
 * tp-acoustique/js/tp05-pression-acoustique.js
 *
 * Contrôleur du TP05 « Pression et niveau acoustiques ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-acoustique/modules/tp05-pression-acoustique.html dans #content.
 *
 * Convention SciLab :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP05()
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-acoustique.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { dessinerGraphiqueLigne } from '../../js/graphique.js';

// Contexte professionnel par filière (clé "niveau-idFiliere")
const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, l'organisation d'un atelier (éloignement des machines bruyantes, écrans acoustiques) s'appuie sur la connaissance de l'atténuation du niveau sonore avec la distance.",
    problematique: "Comment évolue le niveau sonore perçu lorsqu'on s'éloigne d'une machine bruyante, et comment exploiter cette évolution pour organiser un poste de travail ?",
  },

  '2nde-mcc': {
    contexte: "En Métiers de la couture et de la confection, la disposition des postes dans un atelier peut être pensée pour limiter le niveau sonore perçu par chaque opérateur, en s'appuyant sur l'atténuation du son avec la distance.",
    problematique: "Comment le niveau sonore perçu à un poste de couture évolue-t-il avec la distance à la source de bruit ?",
  },

};

// Constantes de référence pour le calcul du niveau d'intensité acoustique
const PRESSION_REFERENCE = 2e-5;   // Pa
const INTENSITE_REFERENCE = 1e-12; // W/m²

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {
  initNiveauDepuisPression();
  initNiveauDepuisIntensite();
  initAttenuationDistance();
  initTableauEcarts();

  initMateriel({
    equipementId: 'materiel-equipements',
    equipment: laboratoryEquipment,
    categorie: 'Acoustique',
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
    titre: 'Pression et niveau acoustiques',
    tp: 'TP05',
  });
}

// =================================================================
// Onglet 1a — Niveau à partir de la pression acoustique
// L = 20 log10(p / p0)
// =================================================================
function initNiveauDepuisPression() {

  const inputPression = $('pression-mesuree');
  const outputNiveau = $('niveau-depuis-pression-out');

  if (!inputPression || !outputNiveau) return;

  inputPression.addEventListener('input', () => {

    const pression = parseFloat(inputPression.value);

    if (Number.isNaN(pression) || pression <= 0) {
      outputNiveau.textContent = '—';
      return;
    }

    const niveau = 20 * Math.log10(pression / PRESSION_REFERENCE);
    outputNiveau.textContent = `${arrondir(niveau, 1)} dB`;
  });
}

// =================================================================
// Onglet 1b — Niveau à partir de l'intensité acoustique
// L = 10 log10(I / I0)
// =================================================================
function initNiveauDepuisIntensite() {

  const inputIntensite = $('intensite-mesuree');
  const outputNiveau = $('niveau-depuis-intensite-out');

  if (!inputIntensite || !outputNiveau) return;

  inputIntensite.addEventListener('input', () => {

    const intensite = parseFloat(inputIntensite.value);

    if (Number.isNaN(intensite) || intensite <= 0) {
      outputNiveau.textContent = '—';
      return;
    }

    const niveau = 10 * Math.log10(intensite / INTENSITE_REFERENCE);
    outputNiveau.textContent = `${arrondir(niveau, 1)} dB`;
  });
}

// =================================================================
// Onglet 2 — Atténuation du niveau sonore avec la distance
// Relevé (distance, niveau) affiché et tracé
// =================================================================
function initAttenuationDistance() {

  const btnAjouter = $('attenuation-ajouter');
  const inputDistance = $('attenuation-distance-valeur');
  const inputNiveau = $('attenuation-niveau-valeur');
  const tbody = $('tbody-attenuation-distance');

  if (!btnAjouter || !tbody) return;

  const points = [];

  btnAjouter.addEventListener('click', () => {

    const distance = parseFloat(inputDistance.value);
    const niveau = parseFloat(inputNiveau.value);

    if (Number.isNaN(distance) || Number.isNaN(niveau)) return;

    points.push({ distance, niveau });
    points.sort((a, b) => a.distance - b.distance);

    redessinerTableauAttenuation(tbody, points);

    dessinerGraphiqueLigne(
      'graphique-attenuation-distance',
      points.map(p => ({ x: p.distance, y: p.niveau })),
      { xLabel: 'Distance (m)', yLabel: 'Niveau sonore (dB)' }
    );

    inputDistance.value = '';
    inputNiveau.value = '';
    inputDistance.focus();
  });
}

function redessinerTableauAttenuation(tbody, points) {

  tbody.innerHTML = '';

  points.forEach((pt, i) => {

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${arrondir(pt.distance, 1)} m</td>
      <td>${arrondir(pt.niveau, 0)} dB</td>
    `;

    tbody.appendChild(tr);
  });
}

// =================================================================
// Tableau de résultats — écart entre niveau attendu et mesuré
// =================================================================
function initTableauEcarts() {

  const inputRef = $('ref-niveau-reference');
  const inputMesuree = $('mesuree-niveau-reference');
  const outputEcart = $('ecart-niveau-reference');

  if (!inputRef || !inputMesuree || !outputEcart) return;

  function calculer() {

    const ref = parseFloat(inputRef.value);
    const mesuree = parseFloat(inputMesuree.value);

    if (Number.isNaN(ref) || Number.isNaN(mesuree)) {
      outputEcart.textContent = '—';
      return;
    }

    const ecart = mesuree - ref;
    const signe = ecart >= 0 ? '+' : '';

    outputEcart.textContent = `${signe}${arrondir(ecart, 1)} dB`;
  }

  inputRef.addEventListener('input', calculer);
  inputMesuree.addEventListener('input', calculer);
}
