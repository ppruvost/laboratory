/**
 * tp-electricite/js/tp05-stockage-electrochimique.js
 *
 * Contrôleur du TP05 « Stockage de l'énergie par un système
 * électrochimique ». Chargé par navigation.js juste après l'injection
 * du fragment
 * tp-electricite/modules/tp05-stockage-electrochimique.html dans
 * #content.
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
import glassware from '../../data/glassware.js';
import laboratoryEquipment from '../../data/equipment.js';
import { dessinerGraphiqueLigne } from '../../js/graphique.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_PRO = {

  'tle-mcc': {
    contexte: "Les outils de couture sur batterie (ciseaux électriques, machines portatives) fonctionnent grâce à un accumulateur rechargeable dont l'autonomie dépend de sa capacité et de son énergie massique.",
    problematique: "Comment un accumulateur stocke-t-il de l'énergie électrique sous forme chimique, et comment évaluer l'énergie qu'il est capable de restituer ?",
  },

};

const DEMI_REACTIONS = {
  'cu-zn': "À l'électrode de zinc (oxydation) : Zn → Zn²⁺ + 2e⁻. À l'électrode de cuivre (réduction) : Cu²⁺ + 2e⁻ → Cu.",
  'cu-fe': "À l'électrode de fer (oxydation) : Fe → Fe²⁺ + 2e⁻. À l'électrode de cuivre (réduction) : Cu²⁺ + 2e⁻ → Cu.",
  'zn-fe': "À l'électrode de zinc (oxydation) : Zn → Zn²⁺ + 2e⁻. À l'électrode de fer (réduction) : Fe²⁺ + 2e⁻ → Fe.",
};

export function init() {

  initPile();
  initAccumulateur();

  initMateriel({
    verreId: 'materiel-verrerie',
    equipementId: 'materiel-equipements',
    glassware,
    equipment: laboratoryEquipment,
    categorie: 'Stockage',
  });

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  // « Stocker l'énergie à l'aide d'un système électrochimique » ne
  // concerne que la filière Métiers de la couture et de la
  // confection, en Terminale.
  initOngletsParFiliere({
    mapping: {
      '1ere-tci':  [],
      '1ere-trpm': [],
      '1ere-mcc':  [],
      'tle-tci':   [],
      'tle-trpm':  [],
      'tle-mcc':   ['pile', 'accumulateur'],
    },
    messageId: 'tp05e-message-filiere',
    messageTexte: "Ce TP n'est pas au programme de votre filière : le stockage électrochimique de l'énergie concerne la filière Métiers de la couture et de la confection, en Terminale.",
  });

  initSections();
  initTabs();
  initModesOperatoires();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: "Stockage de l'énergie par un système électrochimique",
    tp: 'TP05',
  });
}

// =================================================================
// Onglet 1 — Pile et demi-réactions d'oxydoréduction
// =================================================================
function initPile() {

  const select = $('pile-select');
  const zoneInfo = $('pile-demi-reactions');

  if (!select || !zoneInfo) return;

  select.addEventListener('change', () => {

    const texte = DEMI_REACTIONS[select.value];

    zoneInfo.textContent = texte
      || 'Sélectionner un couple d\'électrodes pour afficher les demi-réactions attendues à chaque électrode.';
  });
}

// =================================================================
// Onglet 2 — Énergie stockée et suivi de la décharge
// =================================================================
function initAccumulateur() {

  const inputCapacite = $('acc-capacite');
  const inputTension = $('acc-tension');
  const inputMasse = $('acc-masse');
  const zoneResultat = $('acc-resultat');

  if (inputCapacite && inputTension && zoneResultat) {

    function calculerEnergie() {

      const c = parseFloat(inputCapacite.value);
      const u = parseFloat(inputTension.value);
      const masse = parseFloat(inputMasse.value);

      if (Number.isNaN(c) || Number.isNaN(u)) {
        zoneResultat.textContent = 'Saisir la capacité, la tension et la masse de l\'accumulateur pour calculer l\'énergie stockée et l\'énergie massique.';
        return;
      }

      const energieWh = c * u;

      let massique = '';

      if (!Number.isNaN(masse) && masse > 0) {
        const energieMassique = (energieWh * 1000) / masse;
        massique = `<br>Énergie massique : <strong>${arrondir(energieMassique, 1)} Wh/kg</strong>`;
      }

      zoneResultat.innerHTML = `
        Énergie stockée : <strong>${arrondir(energieWh, 2)} Wh</strong>${massique}
      `;
    }

    inputCapacite.addEventListener('input', calculerEnergie);
    inputTension.addEventListener('input', calculerEnergie);
    if (inputMasse) inputMasse.addEventListener('input', calculerEnergie);
  }

  const btnAjouter = $('dech-ajouter');
  const inputTemps = $('dech-temps');
  const inputTensionDech = $('dech-tension');
  const tbody = $('tbody-decharge');

  if (!btnAjouter || !inputTemps || !inputTensionDech || !tbody) return;

  const points = [];

  btnAjouter.addEventListener('click', () => {

    const t = parseFloat(inputTemps.value);
    const u = parseFloat(inputTensionDech.value);

    if (Number.isNaN(t) || Number.isNaN(u)) return;

    points.push({ t, u });
    points.sort((a, b) => a.t - b.t);

    redessinerTableauDecharge(tbody, points);

    dessinerGraphiqueLigne(
      'graphique-decharge',
      points.map(p => ({ x: p.t, y: p.u })),
      { xLabel: 'Temps (min)', yLabel: 'Tension (V)' }
    );

    inputTemps.value = '';
    inputTensionDech.value = '';
    inputTemps.focus();
  });
}

function redessinerTableauDecharge(tbody, points) {

  tbody.innerHTML = '';

  points.forEach((pt, i) => {

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${arrondir(pt.t, 0)} min</td>
      <td>${arrondir(pt.u, 2)} V</td>
    `;

    tbody.appendChild(tr);
  });
}
