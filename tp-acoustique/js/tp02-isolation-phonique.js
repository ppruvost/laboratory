/**
 * tp-acoustique/js/tp02-isolation-phonique.js
 *
 * Contrôleur du TP02 « Isolation phonique ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-acoustique/modules/tp02-isolation-phonique.html dans #content.
 *
 * Convention SciLab :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP02()
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-acoustique.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';

// Contexte professionnel par filière (clé "niveau-idFiliere")
const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, les capots et carters de machines-outils sont parfois doublés de matériaux absorbants pour limiter le bruit transmis à l'atelier.",
    problematique: "Quel matériau isolant choisir pour capoter une machine bruyante, et quelle épaisseur retenir pour une atténuation suffisante ?",
  },

  '2nde-mcc': {
    contexte: "En Métiers de la couture et de la confection, un atelier regroupant plusieurs machines peut nécessiter une cloison ou un panneau absorbant entre les postes de travail pour limiter la gêne sonore.",
    problematique: "Quel matériau interposer entre deux postes de couture pour réduire la gêne sonore perçue ?",
  },

};

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {
  initMesureAttenuation();
  initClassementIsolants();
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
    titre: 'Isolation phonique',
    tp: 'TP02',
  });
}

// =================================================================
// Onglet 1 — Mesure de l'atténuation d'un matériau
// Atténuation (dB) = Niveau sans matériau - Niveau avec matériau
// =================================================================
function initMesureAttenuation() {

  const inputSans = $('niveau-sans-materiau');
  const inputAvec = $('niveau-avec-materiau');
  const outputAttenuation = $('attenuation-calculee');

  if (!inputSans || !inputAvec || !outputAttenuation) return;

  function calculer() {

    const sans = parseFloat(inputSans.value);
    const avec = parseFloat(inputAvec.value);

    if (Number.isNaN(sans) || Number.isNaN(avec)) {
      outputAttenuation.textContent = '—';
      return;
    }

    const attenuation = sans - avec;
    outputAttenuation.textContent = `${arrondir(attenuation, 1)} dB`;
  }

  inputSans.addEventListener('input', calculer);
  inputAvec.addEventListener('input', calculer);
}

// =================================================================
// Onglet 2 — Classement des matériaux isolants
// Relevé (matériau, épaisseur, atténuation) reclassé du plus isolant
// au moins isolant à chaque ajout
// =================================================================
function initClassementIsolants() {

  const btnAjouter = $('isolant-ajouter');
  const inputMateriau = $('isolant-materiau');
  const inputEpaisseur = $('isolant-epaisseur');
  const inputAttenuation = $('isolant-attenuation');
  const tbody = $('tbody-classement-isolants');

  if (!btnAjouter || !tbody) return;

  const isolants = [];

  btnAjouter.addEventListener('click', () => {

    const materiau = (inputMateriau.value || '').trim();
    const epaisseur = parseFloat(inputEpaisseur.value);
    const attenuation = parseFloat(inputAttenuation.value);

    if (!materiau || Number.isNaN(epaisseur) || Number.isNaN(attenuation)) return;

    isolants.push({ materiau, epaisseur, attenuation });
    isolants.sort((a, b) => b.attenuation - a.attenuation); // + isolant -> - isolant

    redessinerTableauIsolants(tbody, isolants);

    inputMateriau.value = '';
    inputEpaisseur.value = '';
    inputAttenuation.value = '';
    inputMateriau.focus();
  });
}

function redessinerTableauIsolants(tbody, isolants) {

  tbody.innerHTML = '';

  isolants.forEach(iso => {

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${iso.materiau}</td>
      <td>${arrondir(iso.epaisseur, 0)} mm</td>
      <td>${arrondir(iso.attenuation, 1)} dB</td>
    `;

    tbody.appendChild(tr);
  });
}

// =================================================================
// Tableau de résultats — écart entre atténuation attendue et mesurée
// =================================================================
function initTableauEcarts() {

  const inputRef = $('ref-attenuation');
  const inputMesuree = $('mesuree-attenuation');
  const outputEcart = $('ecart-attenuation');

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
