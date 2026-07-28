/**
 * tp-mecanique/js/tp02-actions-mecaniques.js
 *
 * Contrôleur du TP02 « Actions mécaniques et équilibre ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-mecanique/modules/tp02-actions-mecaniques.html dans #content.
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

const G = 9.81; // N/kg

const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "Une pièce métallique suspendue par un palan est soumise à son poids et à la tension du câble de levage : le respect des conditions d'équilibre conditionne la sécurité de la manutention.",
    problematique: "Comment vérifier qu'une pièce suspendue est correctement en équilibre sous l'effet des forces qui s'exercent sur elle ?",
  },

  '2nde-mcc': {
    contexte: "Un tissu tendu sur un métier à broder est soumis à plusieurs forces de tension réparties sur son pourtour, qui doivent s'équilibrer pour éviter toute déformation.",
    problematique: "Comment vérifier que les forces de tension exercées sur un tissu tendu sont à l'équilibre ?",
  },

};

export function init() {

  initInventaireForces();
  initPoids();
  initEquilibre();

  initMateriel({
    equipementId: 'materiel-equipements',
    equipment: laboratoryEquipment,
    categorie: 'ActionsMecaniques',
  });

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  // Domaine transversal « Mécanique : comment décrire le mouvement ? »
  // (volet actions mécaniques / équilibre) commun aux deux filières
  // de 2nde (REMI et MCC), non repris ensuite.
  initOngletsParFiliere({
    mapping: {
      '2nde-remi': ['modeliser-force', 'poids', 'equilibre'],
      '2nde-mcc':  ['modeliser-force', 'poids', 'equilibre'],
      '1ere-tci':  [],
      '1ere-trpm': [],
      '1ere-mcc':  [],
      'tle-tci':   [],
      'tle-trpm':  [],
      'tle-mcc':   [],
    },
    messageId: 'tp02m-message-filiere',
    messageTexte: "Ce TP a déjà été traité en classe de 2nde : les actions mécaniques et l'équilibre ne sont pas repris aux niveaux suivants.",
  });

  initSections();
  initTabs();
  initModesOperatoires();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Actions mécaniques et équilibre',
    tp: 'TP02',
  });
}

// =================================================================
// Onglet 1 — Inventaire des forces
// =================================================================
function initInventaireForces() {

  const btnAjouter = $('force-ajouter');
  const inputNom = $('force-nom');
  const inputDirection = $('force-direction');
  const inputSens = $('force-sens');
  const inputValeur = $('force-valeur');
  const tbody = $('tbody-forces');

  if (!btnAjouter || !tbody) return;

  btnAjouter.addEventListener('click', () => {

    const nom = (inputNom.value || '').trim();
    const direction = (inputDirection.value || '').trim();
    const sens = (inputSens.value || '').trim();
    const valeur = parseFloat(inputValeur.value);

    if (!nom) return;

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${nom}</td>
      <td>${direction || '—'}</td>
      <td>${sens || '—'}</td>
      <td>${Number.isNaN(valeur) ? '—' : arrondir(valeur, 2) + ' N'}</td>
    `;

    tbody.appendChild(tr);

    inputNom.value = '';
    inputDirection.value = '';
    inputSens.value = '';
    inputValeur.value = '';
    inputNom.focus();
  });
}

// =================================================================
// Onglet 2 — Poids P = m × g
// =================================================================
function initPoids() {

  const inputMasse = $('poids-masse');
  const inputMesure = $('poids-mesure');
  const zoneResultat = $('poids-resultat');

  if (!inputMasse || !zoneResultat) return;

  function calculer() {

    const m = parseFloat(inputMasse.value);
    const pMesure = parseFloat(inputMesure.value);

    if (Number.isNaN(m)) {
      zoneResultat.textContent = 'Saisir la masse pour calculer le poids théorique, et éventuellement le poids mesuré pour comparer les deux valeurs.';
      return;
    }

    const pTheorique = m * G;

    let comparaison = '';

    if (!Number.isNaN(pMesure)) {
      const ecart = Math.abs(pTheorique - pMesure);
      comparaison = `<br>Poids mesuré : ${arrondir(pMesure, 2)} N — écart avec le calcul : ${arrondir(ecart, 2)} N.`;
    }

    zoneResultat.innerHTML = `
      Poids théorique P = m × g = <strong>${arrondir(pTheorique, 2)} N</strong>${comparaison}
    `;
  }

  inputMasse.addEventListener('input', calculer);
  if (inputMesure) inputMesure.addEventListener('input', calculer);
}

// =================================================================
// Onglet 3 — Équilibre de forces concourantes
// =================================================================
function initEquilibre() {

  const inputF1 = $('eq-f1');
  const inputF2 = $('eq-f2');
  const inputF3 = $('eq-f3');
  const zoneResultat = $('eq-resultat');

  if (!inputF1 || !inputF2 || !zoneResultat) return;

  function analyser() {

    const f1 = parseFloat(inputF1.value);
    const f2 = parseFloat(inputF2.value);
    const f3 = parseFloat(inputF3.value);

    if (Number.isNaN(f1) || Number.isNaN(f2)) {
      zoneResultat.textContent = 'Saisir les valeurs des forces en présence (deux forces opposées, ou trois forces dont on connaît les valeurs) pour vérifier si l\'équilibre est cohérent.';
      return;
    }

    if (Number.isNaN(f3)) {
      // Cas de deux forces : équilibre si même valeur (droites d'action
      // confondues et sens opposés supposés vérifiés expérimentalement).
      const ecart = Math.abs(f1 - f2);
      const tolerance = 0.05 * Math.max(f1, f2, 1);

      const conclusion = ecart <= tolerance
        ? 'Les deux forces ont des valeurs très proches : l\'équilibre est cohérent (à condition que leurs droites d\'action soient confondues et leurs sens opposés).'
        : 'Les deux forces ont des valeurs nettement différentes : l\'équilibre n\'est pas vérifié.';

      zoneResultat.innerHTML = `
        F₁ = ${arrondir(f1, 2)} N — F₂ = ${arrondir(f2, 2)} N — écart : ${arrondir(ecart, 2)} N.<br>
        ${conclusion}
      `;
      return;
    }

    // Cas de trois forces : on ne dispose que des valeurs (pas des
    // angles), donc on vérifie ici l'inégalité triangulaire comme
    // premier indice de cohérence, à affiner avec les directions
    // relevées expérimentalement.
    const somme = f1 + f2 + f3;
    const maxF = Math.max(f1, f2, f3);
    const coherent = maxF <= (somme - maxF);

    const conclusion = coherent
      ? 'Les trois valeurs sont compatibles avec une somme vectorielle nulle (à confirmer avec les directions mesurées expérimentalement).'
      : 'La plus grande force dépasse la somme des deux autres : l\'équilibre à trois forces concourantes n\'est pas possible avec ces valeurs.';

    zoneResultat.innerHTML = `
      F₁ = ${arrondir(f1, 2)} N — F₂ = ${arrondir(f2, 2)} N — F₃ = ${arrondir(f3, 2)} N.<br>
      ${conclusion}
    `;
  }

  inputF1.addEventListener('input', analyser);
  inputF2.addEventListener('input', analyser);
  if (inputF3) inputF3.addEventListener('input', analyser);
}
