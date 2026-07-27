/**
 * tp-electricite/js/tp01-puissance-energie.js
 *
 * Contrôleur du TP01 « Puissance et énergie électrique ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-electricite/modules/tp01-puissance-energie.html dans #content.
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
    contexte: "Avant de mettre sous tension un poste à souder ou un touret à meuler, il faut connaître la puissance appelée par l'appareil afin de vérifier la compatibilité avec l'installation électrique de l'atelier.",
    problematique: "Comment déterminer la puissance électrique consommée par un équipement d'atelier et l'énergie qu'il consomme sur une durée donnée ?",
  },

  '1ere-trpm': {
    contexte: "Une machine-outil (perceuse, fraiseuse) consomme une puissance électrique qui dépend de son utilisation. Connaître cette puissance permet de dimensionner correctement l'installation électrique qui l'alimente.",
    problematique: "Comment déterminer la puissance électrique consommée par une machine-outil et l'énergie qu'elle consomme sur une durée donnée ?",
  },

  '1ere-mcc': {
    contexte: "Une machine à coudre industrielle ou un fer à repasser professionnel consomme une puissance électrique indiquée sur sa plaque signalétique. Cette information conditionne le nombre d'appareils pouvant être utilisés simultanément sur une même installation.",
    problematique: "Comment déterminer la puissance électrique consommée par un équipement de couture et l'énergie qu'il consomme au cours d'une journée de travail ?",
  },

};

export function init() {

  initPuissance();
  initEnergie();

  initMateriel({
    equipementId: 'materiel-equipements',
    equipment: laboratoryEquipment,
    categorie: 'Puissance',
  });

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  // Ce TP correspond à « Distinguer énergie et puissance électrique »,
  // commun aux trois filières en 1ère et déjà acquis en Tle.
  initOngletsParFiliere({
    mapping: {
      '1ere-tci':  ['mesure-puissance', 'energie-consommee'],
      '1ere-trpm': ['mesure-puissance', 'energie-consommee'],
      '1ere-mcc':  ['mesure-puissance', 'energie-consommee'],
      'tle-tci':   [],
      'tle-trpm':  [],
      'tle-mcc':   [],
    },
    messageId: 'tp01-message-filiere',
    messageTexte: "Ce TP a déjà été traité en classe de 1ère : la puissance et l'énergie électriques ne sont pas reprises en Terminale.",
  });

  initSections();
  initTabs();
  initModesOperatoires();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Puissance et énergie électrique',
    tp: 'TP01',
  });
}

// =================================================================
// Onglet 1 — Mesure et calcul de la puissance P = U × I
// =================================================================
function initPuissance() {

  const btnAjouter = $('pui-ajouter');
  const inputTension = $('pui-tension');
  const inputIntensite = $('pui-intensite');
  const tbody = $('tbody-puissance');

  if (!btnAjouter || !tbody) return;

  const mesures = [];

  btnAjouter.addEventListener('click', () => {

    const u = parseFloat(inputTension.value);
    const i = parseFloat(inputIntensite.value);

    if (Number.isNaN(u) || Number.isNaN(i)) return;

    mesures.push({ u, i });

    redessinerTableauPuissance(tbody, mesures);

    inputTension.value = '';
    inputIntensite.value = '';
    inputTension.focus();
  });
}

function redessinerTableauPuissance(tbody, mesures) {

  tbody.innerHTML = '';

  mesures.forEach((m, idx) => {

    const p = m.u * m.i;

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${arrondir(m.u, 2)} V</td>
      <td>${arrondir(m.i, 2)} A</td>
      <td>${arrondir(p, 2)} W</td>
    `;

    tbody.appendChild(tr);
  });
}

// =================================================================
// Onglet 2 — Énergie consommée E = P × t
// =================================================================
function initEnergie() {

  const inputPuissance = $('ener-puissance');
  const inputDuree = $('ener-duree');
  const zoneResultat = $('ener-resultat');

  if (!inputPuissance || !inputDuree || !zoneResultat) return;

  function calculerEnergie() {

    const p = parseFloat(inputPuissance.value);
    const t = parseFloat(inputDuree.value);

    if (Number.isNaN(p) || Number.isNaN(t)) {
      zoneResultat.textContent = 'Saisir la puissance et la durée pour calculer l\'énergie consommée.';
      return;
    }

    const energieWh = p * t;
    const energieKwh = energieWh / 1000;
    const energieJ = energieWh * 3600;

    zoneResultat.innerHTML = `
      Énergie consommée :
      <strong>${arrondir(energieJ, 0)} J</strong>
      soit <strong>${arrondir(energieKwh, 3)} kWh</strong>.
    `;
  }

  inputPuissance.addEventListener('input', calculerEnergie);
  inputDuree.addEventListener('input', calculerEnergie);
}
