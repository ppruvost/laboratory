/**
 * tp-mecanique/js/tp01-decrire-mouvement.js
 *
 * Contrôleur du TP01 « Décrire un mouvement ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-mecanique/modules/tp01-decrire-mouvement.html dans #content.
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

  '2nde-remi': {
    contexte: "Sur une ligne de production, un chariot automatisé se déplace entre deux postes de travail, tandis qu'une meule ou un disque tourne à grande vitesse sur une machine-outil.",
    problematique: "Comment décrire le mouvement d'un chariot ou la rotation d'un disque, et comment déterminer leur vitesse ?",
  },

  '2nde-mcc': {
    contexte: "Sur une machine à coudre, une bobine ou un galet d'entraînement tourne à vitesse variable pour entraîner le tissu à une vitesse régulière.",
    problematique: "Comment décrire la rotation d'un galet d'entraînement et la relier à la vitesse d'avancement du tissu ?",
  },

};

export function init() {

  initQuizTrajectoire();
  initVitesseMoyenne();
  initFrequenceRotation();

  initMateriel({
    equipementId: 'materiel-equipements',
    equipment: laboratoryEquipment,
    categorie: 'Cinematique',
  });

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  // Domaine transversal « Mécanique : comment décrire le mouvement ? »
  // commun aux deux filières de 2nde (REMI et MCC), non repris ensuite.
  initOngletsParFiliere({
    mapping: {
      '2nde-remi': ['trajectoire', 'vitesse-moyenne', 'frequence-rotation'],
      '2nde-mcc':  ['trajectoire', 'vitesse-moyenne', 'frequence-rotation'],
      '1ere-tci':  [],
      '1ere-trpm': [],
      '1ere-mcc':  [],
      'tle-tci':   [],
      'tle-trpm':  [],
      'tle-mcc':   [],
    },
    messageId: 'tp01m-message-filiere',
    messageTexte: "Ce TP a déjà été traité en classe de 2nde : la description du mouvement n'est pas reprise aux niveaux suivants.",
  });

  initSections();
  initTabs();
  initModesOperatoires();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Décrire un mouvement',
    tp: 'TP01',
  });
}

// =================================================================
// Onglet 1 — Quiz de reconnaissance de trajectoire
// =================================================================
const NOMS_TRAJECTOIRE = {
  rectiligne: 'rectiligne',
  circulaire: 'circulaire',
  quelconque: 'quelconque',
};

function initQuizTrajectoire() {

  document.querySelectorAll('.quiz-select').forEach(select => {

    select.addEventListener('change', () => {

      const bloc = select.closest('.quiz-situation');
      const feedback = bloc?.querySelector('.quiz-feedback');

      if (!bloc || !feedback) return;

      const bonneReponse = bloc.dataset.reponse;

      if (!select.value) {
        feedback.textContent = '';
        feedback.className = 'quiz-feedback';
        return;
      }

      if (select.value === bonneReponse) {
        feedback.textContent = '✔ Correct';
        feedback.className = 'quiz-feedback quiz-correct';
      } else {
        feedback.textContent = `✘ Réponse attendue : ${NOMS_TRAJECTOIRE[bonneReponse]}`;
        feedback.className = 'quiz-feedback quiz-incorrect';
      }
    });
  });
}

// =================================================================
// Onglet 2 — Vitesse moyenne v = d / t
// =================================================================
function initVitesseMoyenne() {

  const btnAjouter = $('vm-ajouter');
  const inputDistance = $('vm-distance');
  const inputDuree = $('vm-duree');
  const tbody = $('tbody-vitesse');
  const zoneNature = $('vm-nature');

  if (!btnAjouter || !tbody) return;

  const mesures = [];

  btnAjouter.addEventListener('click', () => {

    const d = parseFloat(inputDistance.value);
    const t = parseFloat(inputDuree.value);

    if (Number.isNaN(d) || Number.isNaN(t) || t === 0) return;

    mesures.push({ d, t, v: d / t });

    redessinerTableauVitesse(tbody, mesures);
    mettreAJourNature(zoneNature, mesures);

    inputDistance.value = '';
    inputDuree.value = '';
    inputDistance.focus();
  });
}

function redessinerTableauVitesse(tbody, mesures) {

  tbody.innerHTML = '';

  mesures.forEach((m, idx) => {

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${arrondir(m.d, 2)} m</td>
      <td>${arrondir(m.t, 2)} s</td>
      <td>${arrondir(m.v, 2)} m/s</td>
    `;

    tbody.appendChild(tr);
  });
}

function mettreAJourNature(zone, mesures) {

  if (!zone) return;

  if (mesures.length < 2) {
    zone.textContent = 'Ajouter au moins deux mesures pour observer si le mouvement semble uniforme (vitesses proches) ou varié (vitesses différentes).';
    return;
  }

  const vitesses = mesures.map(m => m.v);
  const vMin = Math.min(...vitesses);
  const vMax = Math.max(...vitesses);
  const ecartRelatif = vMin > 0 ? (vMax - vMin) / vMin : 0;

  const nature = ecartRelatif < 0.1
    ? 'Les vitesses moyennes restent proches d\'un intervalle à l\'autre : le mouvement semble <strong>uniforme</strong>.'
    : 'Les vitesses moyennes varient nettement d\'un intervalle à l\'autre : le mouvement semble <strong>uniformément varié</strong> (accéléré ou ralenti).';

  zone.innerHTML = `
    Vitesse minimale : ${arrondir(vMin, 2)} m/s — vitesse maximale : ${arrondir(vMax, 2)} m/s.<br>
    ${nature}
  `;
}

// =================================================================
// Onglet 3 — Fréquence de rotation f = N / t, T = 1/f, v = π×D×f
// =================================================================
function initFrequenceRotation() {

  const inputTours = $('fr-tours');
  const inputDuree = $('fr-duree');
  const inputDiametre = $('fr-diametre');
  const zoneResultat = $('fr-resultat');

  if (!inputTours || !inputDuree || !zoneResultat) return;

  function calculer() {

    const n = parseFloat(inputTours.value);
    const t = parseFloat(inputDuree.value);
    const d = parseFloat(inputDiametre.value);

    if (Number.isNaN(n) || Number.isNaN(t) || t === 0) {
      zoneResultat.textContent = 'Saisir le nombre de tours, la durée et le diamètre pour calculer la fréquence de rotation, la période et la vitesse périphérique.';
      return;
    }

    const f = n / t;
    const periode = f > 0 ? 1 / f : 0;

    let vitesseLigne = '';

    if (!Number.isNaN(d)) {
      const v = Math.PI * d * f;
      vitesseLigne = `<br>Vitesse périphérique v = ${arrondir(v, 3)} m/s`;
    }

    zoneResultat.innerHTML = `
      Fréquence de rotation f = <strong>${arrondir(f, 2)} Hz</strong><br>
      Période T = <strong>${arrondir(periode, 3)} s</strong>${vitesseLigne}
    `;
  }

  inputTours.addEventListener('input', calculer);
  inputDuree.addEventListener('input', calculer);
  if (inputDiametre) inputDiametre.addEventListener('input', calculer);
}
