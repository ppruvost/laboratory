/**
 * tp-optique/js/tp04-photocomposants.js
 *
 * Contrôleur du TP04 « Photocomposants ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-optique/modules/tp04-photocomposants.html dans #content.
 *
 * Convention SciLab :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP04()
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-optique.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { dessinerGraphiqueLigne } from '../../js/graphique.js';

const CELERITE = 3.00e8;       // m/s
const PLANCK = 6.63e-34;       // J·s
const ELECTRON_VOLT = 1.60e-19; // J

// Contexte professionnel par filière (clé "niveau-idFiliere")
const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, des photodétecteurs (barrières optiques, capteurs de présence) sécurisent certaines machines en détectant le passage d'une pièce ou d'une main.",
    problematique: "Comment un photocomposant transforme-t-il un signal lumineux en signal électrique exploitable, et quelles grandeurs influencent sa réponse ?",
  },

  '2nde-mcc': {
    contexte: "En Métiers de la couture et de la confection, certains automates de découpe utilisent des capteurs photoélectriques pour détecter le bord d'un tissu ou l'arrêt d'un rouleau.",
    problematique: "Comment un photocomposant réagit-il à l'éclairement et à la couleur de la lumière reçue, et pourquoi ce comportement est-il exploité par des capteurs industriels ?",
  },

};

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {
  initCaracteristiqueEclairement();
  initCaracteristiqueLongueurOnde();
  initEnergiePhoton();
  initTableauEcarts();

  initMateriel({
    equipementId: 'materiel-equipements',
    equipment: laboratoryEquipment,
    categorie: 'Optique',
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
    titre: 'Photocomposants',
    tp: 'TP04',
  });
}

// =================================================================
// Onglet 1 — Caractéristique en fonction de l'éclairement
// =================================================================
function initCaracteristiqueEclairement() {

  const btnAjouter = $('eclairement-ajouter');
  const inputLux = $('eclairement-lux');
  const inputGrandeur = $('eclairement-grandeur');
  const tbody = $('tbody-caracteristique-eclairement');

  if (!btnAjouter || !tbody) return;

  const points = [];

  btnAjouter.addEventListener('click', () => {

    const lux = parseFloat(inputLux.value);
    const grandeur = parseFloat(inputGrandeur.value);

    if (Number.isNaN(lux) || Number.isNaN(grandeur)) return;

    points.push({ lux, grandeur });
    points.sort((a, b) => a.lux - b.lux);

    tbody.innerHTML = '';
    points.forEach((p, i) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${arrondir(p.lux, 0)} lux</td>
        <td>${arrondir(p.grandeur, 3)}</td>
      `;
      tbody.appendChild(tr);
    });

    dessinerGraphiqueLigne(
      'graphique-eclairement',
      points.map(p => ({ x: p.lux, y: p.grandeur })),
      { xLabel: 'Éclairement (lux)', yLabel: 'Grandeur électrique' }
    );

    inputLux.value = '';
    inputGrandeur.value = '';
    inputLux.focus();
  });
}

// =================================================================
// Onglet 2 — Caractéristique en fonction de la longueur d'onde
// =================================================================
function initCaracteristiqueLongueurOnde() {

  const btnAjouter = $('longueur-onde-ajouter');
  const inputSource = $('longueur-onde-source');
  const inputNm = $('longueur-onde-nm');
  const inputGrandeur = $('longueur-onde-grandeur');
  const tbody = $('tbody-caracteristique-longueur-onde');

  if (!btnAjouter || !tbody) return;

  const points = [];

  btnAjouter.addEventListener('click', () => {

    const source = (inputSource.value || '').trim();
    const nm = parseFloat(inputNm.value);
    const grandeur = parseFloat(inputGrandeur.value);

    if (!source || Number.isNaN(nm) || Number.isNaN(grandeur)) return;

    points.push({ source, nm, grandeur });
    points.sort((a, b) => a.nm - b.nm);

    tbody.innerHTML = '';
    points.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.source}</td>
        <td>${arrondir(p.nm, 0)} nm</td>
        <td>${arrondir(p.grandeur, 3)}</td>
      `;
      tbody.appendChild(tr);
    });

    dessinerGraphiqueLigne(
      'graphique-longueur-onde',
      points.map(p => ({ x: p.nm, y: p.grandeur })),
      { xLabel: "Longueur d'onde (nm)", yLabel: 'Grandeur électrique' }
    );

    inputSource.value = '';
    inputNm.value = '';
    inputGrandeur.value = '';
    inputSource.focus();
  });
}

// =================================================================
// Onglet 3 — Énergie du photon : E = h.c / λ
// =================================================================
function initEnergiePhoton() {

  const inputNm = $('photon-longueur-onde');
  const outputJ = $('photon-energie-j');
  const outputEv = $('photon-energie-ev');

  if (!inputNm || !outputJ || !outputEv) return;

  inputNm.addEventListener('input', () => {

    const nm = parseFloat(inputNm.value);

    if (Number.isNaN(nm) || nm <= 0) {
      outputJ.textContent = '—';
      outputEv.textContent = '—';
      return;
    }

    const lambdaM = nm * 1e-9;
    const energieJ = (PLANCK * CELERITE) / lambdaM;
    const energieEv = energieJ / ELECTRON_VOLT;

    outputJ.textContent = `${energieJ.toExponential(3)} J`;
    outputEv.textContent = `${arrondir(energieEv, 3)} eV`;
  });
}

// =================================================================
// Tableau de résultats — écart énergie photon attendue/calculée
// =================================================================
function initTableauEcarts() {

  const inputRef = $('ref-energie-photon');
  const inputMesuree = $('mesuree-energie-photon');
  const outputEcart = $('ecart-energie-photon');

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

    outputEcart.textContent = `${signe}${ecart.toExponential(2)} J`;
  }

  inputRef.addEventListener('input', calculer);
  inputMesuree.addEventListener('input', calculer);
}
