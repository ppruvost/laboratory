/**
 * tp-signaux/js/tp02-transmettre-information.js
 *
 * Contrôleur du TP02 « Transmettre l'information ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-signaux/modules/tp02-transmettre-information.html dans #content.
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
import { initImpressionCompteRendu } from './compte-rendu-signaux.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';

// Contexte professionnel par filière (clé "niveau-idFiliere")
const CONTEXTES_PRO = {

  'tle-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, les liaisons entre automates et capteurs sur une ligne de production combinent parfois des câbles (propagation guidée) et des liaisons sans fil (propagation libre).",
    problematique: "Quel mode de propagation (libre ou guidée) choisir pour relier deux équipements d'une ligne de production, et pourquoi ?",
  },

  'tle-mcc': {
    contexte: "En Métiers de la couture et de la confection, un atelier connecté peut combiner un réseau wifi pour le suivi de production et des liaisons filaires ou par fibre optique pour les échanges de données volumineux.",
    problematique: "Quels systèmes de transmission d'informations coexistent dans un atelier connecté, et selon quel principe fonctionnent-ils ?",
  },

};

// Réponses correctes attendues pour le schéma de la chaîne générale
// (indépendantes du système choisi : la structure émetteur / canal /
// récepteur est la même quel que soit le type d'onde utilisé)
const REPONSES_CHAINE_GENERALE = {
  'chaine-generale-emetteur': 'emetteur',
  'chaine-generale-canal': 'canal',
  'chaine-generale-recepteur': 'recepteur',
};

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {
  initPropagationLibreGuidee();
  initChaineGenerale();
  initFibreOptique();
  initTableauEcarts();

  initMateriel({
    equipementId: 'materiel-equipements',
    equipment: laboratoryEquipment,
    categorie: 'Signaux',
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
    titre: 'Transmettre l\'information',
    tp: 'TP02',
  });
}

// =================================================================
// Onglet 1 — Propagation libre ou guidée
// Relevé cumulatif (système, type d'onde, mode de propagation)
// =================================================================
function initPropagationLibreGuidee() {

  const btnAjouter = $('propagation-ajouter');
  const inputSysteme = $('propagation-systeme');
  const selectOnde = $('propagation-type-onde');
  const selectMode = $('propagation-mode');
  const tbody = $('tbody-propagation-type');

  if (!btnAjouter || !tbody) return;

  const LABELS_ONDE = { sonore: 'Sonore', lumineuse: 'Lumineuse', electromagnetique: 'Électromagnétique' };
  const LABELS_MODE = { libre: 'Libre', guidee: 'Guidée' };

  btnAjouter.addEventListener('click', () => {

    const systeme = (inputSysteme.value || '').trim();
    const onde = selectOnde.value;
    const mode = selectMode.value;

    if (!systeme || !onde || !mode) return;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${systeme}</td>
      <td>${LABELS_ONDE[onde] || onde}</td>
      <td>${LABELS_MODE[mode] || mode}</td>
    `;
    tbody.appendChild(tr);

    inputSysteme.value = '';
    selectOnde.value = '';
    selectMode.value = '';
    inputSysteme.focus();
  });
}

// =================================================================
// Onglet 2 — Chaîne de transmission générale
// Vérification des trois select par rapport aux réponses attendues
// =================================================================
function initChaineGenerale() {

  const btnVerifier = $('chaine-generale-verifier');
  const resultat = $('chaine-generale-resultat');
  const selectSysteme = $('chaine-generale-systeme');

  if (!btnVerifier || !resultat) return;

  const LABELS_SYSTEME = {
    wifi: 'le réseau wifi',
    telecommande: 'la télécommande infrarouge',
    fibre: 'la liaison par fibre optique',
  };

  btnVerifier.addEventListener('click', () => {

    const reponses = Object.keys(REPONSES_CHAINE_GENERALE).map(id => ({
      id,
      valeur: $(id)?.value || '',
      attendu: REPONSES_CHAINE_GENERALE[id],
    }));

    if (reponses.some(r => !r.valeur)) {
      resultat.textContent = 'Compléter les trois éléments du schéma avant de vérifier.';
      resultat.classList.remove('feedback-verification', 'succes', 'erreur');
      return;
    }

    const valeurs = reponses.map(r => r.valeur);
    const doublons = new Set(valeurs).size !== valeurs.length;
    const correct = !doublons && reponses.every(r => r.valeur === r.attendu);

    const systemeLabel = LABELS_SYSTEME[selectSysteme?.value] || 'ce système';

    resultat.classList.add('feedback-verification');

    if (correct) {
      resultat.textContent = `✓ Schéma correct pour ${systemeLabel} : émetteur → canal de propagation → récepteur.`;
      resultat.classList.add('succes');
      resultat.classList.remove('erreur');
    } else {
      resultat.textContent = `✗ Schéma incorrect pour ${systemeLabel} : revoir le rôle de chaque élément.`;
      resultat.classList.add('erreur');
      resultat.classList.remove('succes');
    }
  });
}

// =================================================================
// Onglet 3 — Fibre optique et réflexion totale
// θc = arcsin(n2/n1) ; comparaison de l'angle testé à θc
// =================================================================
function initFibreOptique() {

  const inputN1 = $('fibre-n1');
  const inputN2 = $('fibre-n2');
  const outputAngleCritique = $('fibre-angle-critique');
  const inputAngleTeste = $('fibre-angle-teste');
  const outputConclusion = $('fibre-conclusion');

  if (!inputN1 || !inputN2 || !outputAngleCritique) return;

  function angleCritiqueDeg() {

    const n1 = parseFloat(inputN1.value);
    const n2 = parseFloat(inputN2.value);

    if (Number.isNaN(n1) || Number.isNaN(n2) || n1 <= 0 || n2 <= 0 || n2 >= n1) {
      return null;
    }

    const thetaCRad = Math.asin(n2 / n1);
    return thetaCRad * (180 / Math.PI);
  }

  function calculerAngleCritique() {

    const thetaC = angleCritiqueDeg();

    if (thetaC === null) {
      outputAngleCritique.textContent = '—';
    } else {
      outputAngleCritique.textContent = `${arrondir(thetaC, 2)} °`;
    }

    calculerConclusion();
  }

  function calculerConclusion() {

    if (!inputAngleTeste || !outputConclusion) return;

    const thetaC = angleCritiqueDeg();
    const angleTeste = parseFloat(inputAngleTeste.value);

    if (thetaC === null || Number.isNaN(angleTeste)) {
      outputConclusion.textContent = '—';
      return;
    }

    if (angleTeste >= thetaC) {
      outputConclusion.textContent = `Oui — angle ≥ θc (${arrondir(thetaC, 1)}°) : réflexion totale, le rayon reste guidé.`;
    } else {
      outputConclusion.textContent = `Non — angle < θc (${arrondir(thetaC, 1)}°) : une partie de la lumière sort par réfraction.`;
    }
  }

  inputN1.addEventListener('input', calculerAngleCritique);
  inputN2.addEventListener('input', calculerAngleCritique);
  if (inputAngleTeste) inputAngleTeste.addEventListener('input', calculerConclusion);

  calculerAngleCritique();
}

// =================================================================
// Tableau de résultats — écart entre angle critique attendu et calculé
// =================================================================
function initTableauEcarts() {

  const inputRef = $('ref-angle-critique');
  const inputMesuree = $('mesuree-angle-critique');
  const outputEcart = $('ecart-angle-critique');

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

    outputEcart.textContent = `${signe}${arrondir(ecart, 2)} °`;
  }

  inputRef.addEventListener('input', calculer);
  inputMesuree.addEventListener('input', calculer);
}
