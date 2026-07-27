/**
 * tp-electricite/js/tp02-transport-energie.js
 *
 * Contrôleur du TP02 « Transport de l'énergie électrique ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-electricite/modules/tp02-transport-energie.html dans #content.
 *
 * navigation.js exécute module.init() après l'import : le point
 * d'entrée doit s'appeler init().
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-electricite.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_PRO = {

  '1ere-tci': {
    contexte: "Un atelier de chaudronnerie est alimenté à partir du réseau basse tension du bâtiment, lui-même issu d'un poste de transformation qui abaisse la haute tension du réseau de distribution.",
    problematique: "Pourquoi l'énergie électrique est-elle transportée sous haute tension avant d'être abaissée par un transformateur jusqu'à la tension utilisée dans l'atelier ?",
  },

  '1ere-trpm': {
    contexte: "Les machines-outils d'un atelier de production mécanique sont alimentées en basse tension, obtenue après plusieurs abaissements successifs de tension depuis le réseau de transport.",
    problematique: "Pourquoi l'énergie électrique est-elle transportée sous haute tension avant d'être abaissée par un transformateur jusqu'à la tension utilisée dans l'atelier ?",
  },

  'tle-mcc': {
    contexte: "Un atelier de confection est raccordé au réseau basse tension, issu d'un transformateur de distribution qui abaisse la tension transportée depuis les lignes à haute tension.",
    problematique: "Pourquoi l'énergie électrique est-elle transportée sous haute tension avant d'être abaissée par un transformateur jusqu'à la tension utilisée dans l'atelier ?",
  },

};

const RESEAU_INFO = {
  centrale: { nom: 'Centrale de production', tension: 'quelques kV à quelques dizaines de kV' },
  tht: { nom: 'Réseau très haute tension (transport)', tension: 'de 225 kV à 400 kV' },
  ht: { nom: 'Réseau haute tension (répartition régionale)', tension: 'de 20 kV à 90 kV' },
  bt: { nom: 'Réseau basse tension (distribution finale)', tension: '230 V / 400 V' },
};

export function init() {

  initReseau();
  initEffetJoule();
  initTransformateur();

  initMateriel({
    equipementId: 'materiel-equipements',
    equipment: laboratoryEquipment,
    categorie: 'Transport',
  });

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  // « Transporter l'énergie sous forme électrique » figure au
  // programme de 1ère pour TCI/TRPM, mais seulement de Terminale
  // pour MCC (non exigible en 1ère MCC, non repris en Tle TCI/TRPM).
  initOngletsParFiliere({
    mapping: {
      '1ere-tci':  ['reseau-distribution', 'effet-joule', 'transformateur'],
      '1ere-trpm': ['reseau-distribution', 'effet-joule', 'transformateur'],
      '1ere-mcc':  [],
      'tle-tci':   [],
      'tle-trpm':  [],
      'tle-mcc':   ['reseau-distribution', 'effet-joule', 'transformateur'],
    },
    messageId: 'tp02-message-filiere',
    messageTexte: "Ce TP n'est pas au programme de votre filière à ce niveau. Reportez-vous au niveau où le transport de l'énergie électrique est étudié dans votre spécialité.",
  });

  initSections();
  initTabs();
  initModesOperatoires();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: "Transport de l'énergie électrique",
    tp: 'TP02',
  });
}

// =================================================================
// Onglet 1 — Réseau de distribution
// =================================================================
function initReseau() {

  const select = $('reseau-select');
  const zoneInfo = $('reseau-info');

  if (!select || !zoneInfo) return;

  select.addEventListener('change', () => {

    const info = RESEAU_INFO[select.value];

    if (!info) {
      zoneInfo.textContent = 'Sélectionner une étape pour afficher l\'ordre de grandeur de tension associé.';
      return;
    }

    zoneInfo.innerHTML = `
      <strong>${info.nom}</strong><br>
      Ordre de grandeur de tension : ${info.tension}
    `;
  });
}

// =================================================================
// Onglet 2 — Effet Joule et comparaison des pertes en ligne
// =================================================================
function initEffetJoule() {

  const inputR = $('joule-resistance');
  const inputIbt = $('joule-intensite-bt');
  const inputIht = $('joule-intensite-ht');
  const zoneResultat = $('joule-resultat');

  if (!inputR || !inputIbt || !inputIht || !zoneResultat) return;

  function calculerPertes() {

    const r = parseFloat(inputR.value);
    const iBt = parseFloat(inputIbt.value);
    const iHt = parseFloat(inputIht.value);

    if (Number.isNaN(r) || Number.isNaN(iBt) || Number.isNaN(iHt)) {
      zoneResultat.textContent = 'Saisir la résistance de ligne et les deux intensités pour comparer les pertes par effet Joule en basse et en haute tension, à puissance transportée égale.';
      return;
    }

    const pBt = r * iBt * iBt;
    const pHt = r * iHt * iHt;

    let comparaison = '';

    if (pBt > 0) {
      const rapport = pBt / pHt;
      comparaison = `Les pertes sont environ ${arrondir(rapport, 0)} fois plus faibles en haute tension qu'en basse tension, à puissance transportée identique.`;
    }

    zoneResultat.innerHTML = `
      Puissance dissipée par effet Joule :<br>
      &bull; en basse tension : <strong>${arrondir(pBt, 1)} W</strong><br>
      &bull; en haute tension : <strong>${arrondir(pHt, 1)} W</strong><br>
      ${comparaison}
    `;
  }

  inputR.addEventListener('input', calculerPertes);
  inputIbt.addEventListener('input', calculerPertes);
  inputIht.addEventListener('input', calculerPertes);
}

// =================================================================
// Onglet 3 — Rôle du transformateur (élévateur / abaisseur)
// =================================================================
function initTransformateur() {

  const inputU1 = $('transfo-u1');
  const inputU2 = $('transfo-u2');
  const zoneResultat = $('transfo-resultat');

  if (!inputU1 || !inputU2 || !zoneResultat) return;

  function analyserTransformateur() {

    const u1 = parseFloat(inputU1.value);
    const u2 = parseFloat(inputU2.value);

    if (Number.isNaN(u1) || Number.isNaN(u2) || u1 === 0) {
      zoneResultat.textContent = 'Saisir les deux tensions mesurées pour déterminer si le transformateur est élévateur ou abaisseur.';
      return;
    }

    const rapport = u2 / u1;
    const role = rapport > 1 ? 'élévateur' : (rapport < 1 ? 'abaisseur' : 'ni élévateur ni abaisseur (rapport 1:1)');

    zoneResultat.innerHTML = `
      Rapport de transformation U₂ / U₁ = <strong>${arrondir(rapport, 2)}</strong><br>
      Ce transformateur est donc <strong>${role}</strong> de tension.
    `;
  }

  inputU1.addEventListener('input', analyserTransformateur);
  inputU2.addEventListener('input', analyserTransformateur);
}
