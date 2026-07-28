/**
 * tp-mecanique/js/tp03-cinematique-pression.js
 *
 * Contrôleur du TP03 « Cinématique et pression ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-mecanique/modules/tp03-cinematique-pression.html dans #content.
 *
 * navigation.js exécute module.init() après l'import : le point
 * d'entrée doit s'appeler init().
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-mecanique.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_PRO = {

  '1ere-tci': {
    contexte: "Un vérin pneumatique utilisé en chaudronnerie doit exercer une force pressante suffisante sur une pièce, tout en respectant la pression maximale admissible du circuit d'air comprimé.",
    problematique: "Comment calculer la pression exercée par un vérin et vérifier son évolution lorsque le volume d'air comprimé varie ?",
  },

  '1ere-trpm': {
    contexte: "Le déplacement rapide d'un chariot automatisé sur une machine-outil doit être maîtrisé en accélération pour éviter tout à-coup préjudiciable à la précision de l'usinage.",
    problematique: "Comment caractériser l'accélération d'un chariot automatisé et la pression exercée par un vérin de serrage ?",
  },

  '1ere-mcc': {
    contexte: "Le déplacement du tissu sous le pied-de-biche d'une machine à coudre doit être régulier, tandis que la pression exercée par ce pied-de-biche conditionne la qualité de l'entraînement du tissu.",
    problematique: "Comment caractériser l'accélération du tissu entraîné et la pression exercée par le pied-de-biche ?",
  },

};

export function init() {

  initVitesseAcceleration();
  initPressionForce();
  initBoyleMariotte();

  initMateriel({
    equipementId: 'materiel-equipements',
    equipment: laboratoryEquipment,
    categorie: 'CinematiquePression',
  });

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  // « Caractériser l'accélération et la vitesse » et « Distinguer
  // pression et force pressante » sont communs aux trois filières en
  // 1ère (TCI, TRPM, MCC), non repris ensuite.
  initOngletsParFiliere({
    mapping: {
      '2nde-remi': [],
      '2nde-mcc':  [],
      '1ere-tci':  ['vitesse-acceleration', 'pression-force'],
      '1ere-trpm': ['vitesse-acceleration', 'pression-force'],
      '1ere-mcc':  ['vitesse-acceleration', 'pression-force'],
      'tle-tci':   [],
      'tle-trpm':  [],
      'tle-mcc':   [],
    },
    messageId: 'tp03m-message-filiere',
    messageTexte: "Ce TP n'est pas au programme de votre niveau : l'accélération et la pression sont étudiées en classe de 1ère.",
  });

  initSections();
  initTabs();
  initModesOperatoires();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Cinématique et pression',
    tp: 'TP03',
  });
}

// =================================================================
// Onglet 1 — Accélération moyenne a = (v2 - v1) / (t2 - t1)
// =================================================================
function initVitesseAcceleration() {

  const inputT1 = $('acc-t1');
  const inputV1 = $('acc-v1');
  const inputT2 = $('acc-t2');
  const inputV2 = $('acc-v2');
  const zoneResultat = $('acc-resultat');

  if (!inputT1 || !inputV1 || !inputT2 || !inputV2 || !zoneResultat) return;

  function calculer() {

    const t1 = parseFloat(inputT1.value);
    const v1 = parseFloat(inputV1.value);
    const t2 = parseFloat(inputT2.value);
    const v2 = parseFloat(inputV2.value);

    if ([t1, v1, t2, v2].some(Number.isNaN) || t2 === t1) {
      zoneResultat.textContent = 'Saisir deux instants et les vitesses correspondantes pour calculer l\'accélération moyenne entre ces deux instants.';
      return;
    }

    const a = (v2 - v1) / (t2 - t1);
    const nature = a > 0.05 ? 'le mouvement accélère' : (a < -0.05 ? 'le mouvement ralentit' : 'la vitesse reste globalement constante (mouvement uniforme)');

    zoneResultat.innerHTML = `
      Accélération moyenne a = <strong>${arrondir(a, 3)} m/s²</strong><br>
      Entre ces deux instants, ${nature}.
    `;
  }

  [inputT1, inputV1, inputT2, inputV2].forEach(input => input.addEventListener('input', calculer));
}

// =================================================================
// Onglet 2 — Pression et force pressante P = F / S
// =================================================================
function initPressionForce() {

  const inputForce = $('pf-force');
  const inputSurface = $('pf-surface');
  const zoneResultat = $('pf-resultat');

  if (!inputForce || !inputSurface || !zoneResultat) return;

  function calculer() {

    const f = parseFloat(inputForce.value);
    const sCm2 = parseFloat(inputSurface.value);

    if (Number.isNaN(f) || Number.isNaN(sCm2) || sCm2 === 0) {
      zoneResultat.textContent = 'Saisir la force pressante et la surface pressée pour calculer la pression correspondante.';
      return;
    }

    const sM2 = sCm2 * 1e-4;
    const p = f / sM2;

    zoneResultat.innerHTML = `
      Pression P = F / S = <strong>${arrondir(p, 0)} Pa</strong>
      (soit ${arrondir(p / 1e5, 3)} bar)
    `;
  }

  inputForce.addEventListener('input', calculer);
  inputSurface.addEventListener('input', calculer);
}

// =================================================================
// Onglet 2 (suite) — Loi de Boyle-Mariotte P1×V1 = P2×V2
// =================================================================
function initBoyleMariotte() {

  const inputP1 = $('bm-p1');
  const inputV1 = $('bm-v1');
  const inputV2 = $('bm-v2');
  const zoneResultat = $('bm-resultat');

  if (!inputP1 || !inputV1 || !inputV2 || !zoneResultat) return;

  function calculer() {

    const p1 = parseFloat(inputP1.value);
    const v1 = parseFloat(inputV1.value);
    const v2 = parseFloat(inputV2.value);

    if (Number.isNaN(p1) || Number.isNaN(v1) || Number.isNaN(v2) || v2 === 0) {
      zoneResultat.textContent = 'Saisir la pression et le volume initiaux, puis le volume final, pour calculer la pression finale attendue par la loi de Boyle-Mariotte.';
      return;
    }

    const p2 = (p1 * v1) / v2;

    zoneResultat.innerHTML = `
      D'après P₁×V₁ = P₂×V₂, pression finale attendue :
      <strong>${arrondir(p2, 3)} bar</strong>
    `;
  }

  inputP1.addEventListener('input', calculer);
  inputV1.addEventListener('input', calculer);
  inputV2.addEventListener('input', calculer);
}
