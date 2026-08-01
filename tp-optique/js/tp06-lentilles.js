/**
 * tp-optique/js/tp06-lentilles.js
 *
 * Contrôleur du TP06 « Lentilles convergentes et divergentes ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-optique/modules/tp06-lentilles.html dans #content.
 *
 * Convention SciLab :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP06()
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-optique.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';

// Contexte professionnel par filière (clé "niveau-idFiliere")
const CONTEXTES_PRO = {

  '1ere-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, les loupes et viseurs optiques utilisés pour le contrôle de pièces reposent sur des lentilles convergentes dont la distance focale détermine le grossissement.",
    problematique: "Comment déterminer la distance focale d'une lentille convergente et prévoir la position de l'image qu'elle forme ?",
  },

  '1ere-mcc': {
    contexte: "En Métiers de la couture et de la confection, les loupes d'établi utilisées pour les travaux de précision (couture fine, contrôle qualité) sont des lentilles convergentes choisies pour leur distance focale.",
    problematique: "Comment choisir une lentille convergente adaptée à un usage de loupe d'établi, à partir de sa distance focale ?",
  },

};

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {
  initDifferencierLentilles();
  initDistanceFocale();
  initConjugaisonGrandissement();
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
    titre: 'Lentilles convergentes et divergentes',
    tp: 'TP06',
  });
}

// =================================================================
// Onglet 1 — Différencier convergente / divergente
// =================================================================
function initDifferencierLentilles() {

  const selectForme = $('lentille-forme');
  const selectFaisceau = $('lentille-faisceau');
  const output = $('lentille-nature-out');

  if (!selectForme || !selectFaisceau || !output) return;

  function calculer() {

    const forme = selectForme.value;
    const faisceau = selectFaisceau.value;

    if (!forme || !faisceau) {
      output.textContent = '—';
      return;
    }

    const coherent = (forme === 'epaisse-centre' && faisceau === 'converge')
      || (forme === 'mince-centre' && faisceau === 'diverge');

    if (forme === 'epaisse-centre' && faisceau === 'converge') {
      output.textContent = 'Lentille convergente';
    } else if (forme === 'mince-centre' && faisceau === 'diverge') {
      output.textContent = 'Lentille divergente';
    } else {
      output.textContent = 'Observation incohérente : revoir la manipulation.';
    }
  }

  selectForme.addEventListener('change', calculer);
  selectFaisceau.addEventListener('change', calculer);
}

// =================================================================
// Onglet 2 — Distance focale expérimentale (moyenne des essais)
// =================================================================
function initDistanceFocale() {

  const btnAjouter = $('focale-ajouter');
  const inputDistance = $('focale-distance-mesuree');
  const tbody = $('tbody-distance-focale');
  const moyenne = $('focale-moyenne');

  if (!btnAjouter || !tbody) return;

  const mesures = [];

  btnAjouter.addEventListener('click', () => {

    const distance = parseFloat(inputDistance.value);
    if (Number.isNaN(distance) || distance <= 0) return;

    mesures.push(distance);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${mesures.length}</td>
      <td>${arrondir(distance, 1)} cm</td>
    `;
    tbody.appendChild(tr);

    if (moyenne) {
      const m = mesures.reduce((a, b) => a + b, 0) / mesures.length;
      moyenne.textContent = `Distance focale moyenne f' ≈ ${arrondir(m, 1)} cm (sur ${mesures.length} mesure${mesures.length > 1 ? 's' : ''}).`;
    }

    inputDistance.value = '';
    inputDistance.focus();
  });
}

// =================================================================
// Onglet 3 — Conjugaison et grandissement
// 1/OA' - 1/OA = 1/f' ; γ = OA'/OA
// =================================================================
function initConjugaisonGrandissement() {

  const inputOA = $('conjugaison-oa');
  const inputF = $('conjugaison-f');
  const outputOAPrime = $('conjugaison-oa-prime-out');
  const outputGamma = $('conjugaison-grandissement-out');
  const nature = $('conjugaison-nature');

  if (!inputOA || !inputF || !outputOAPrime || !outputGamma) return;

  function calculer() {

    const OA = parseFloat(inputOA.value);
    const f = parseFloat(inputF.value);

    if (Number.isNaN(OA) || Number.isNaN(f) || OA === 0 || f === 0) {
      outputOAPrime.textContent = '—';
      outputGamma.textContent = '—';
      if (nature) nature.textContent = 'Compléter OA et f\' pour afficher la nature de l\'image.';
      return;
    }

    // 1/OA' = 1/f' + 1/OA
    const invOAPrime = (1 / f) + (1 / OA);

    if (invOAPrime === 0) {
      outputOAPrime.textContent = 'Image à l\'infini';
      outputGamma.textContent = '—';
      if (nature) nature.textContent = 'L\'objet est situé dans le plan focal objet : l\'image se forme à l\'infini.';
      return;
    }

    const OAPrime = 1 / invOAPrime;
    const gamma = OAPrime / OA;

    outputOAPrime.textContent = `${arrondir(OAPrime, 1)} cm`;
    outputGamma.textContent = arrondir(gamma, 2);

    if (nature) {

      const typeImage = OAPrime > 0 ? 'réelle (peut être projetée sur un écran)' : 'virtuelle (ne peut pas être projetée sur un écran)';
      const sens = gamma < 0 ? 'renversée' : 'droite';
      const taille = Math.abs(gamma) > 1 ? 'agrandie' : (Math.abs(gamma) < 1 ? 'réduite' : 'de même taille que l\'objet');

      nature.textContent = `Image ${typeImage}, ${sens}, ${taille} (γ = ${arrondir(gamma, 2)}).`;
    }
  }

  inputOA.addEventListener('input', calculer);
  inputF.addEventListener('input', calculer);
}

// =================================================================
// Tableau de résultats — écarts distance focale et position OA'
// =================================================================
function initTableauEcarts() {

  const paires = [
    { ref: 'ref-focale', mesuree: 'mesuree-focale', ecart: 'ecart-focale' },
    { ref: 'ref-oa-prime', mesuree: 'mesuree-oa-prime', ecart: 'ecart-oa-prime' },
  ];

  paires.forEach(({ ref, mesuree, ecart }) => {

    const inputRef = $(ref);
    const inputMesuree = $(mesuree);
    const outputEcart = $(ecart);

    if (!inputRef || !inputMesuree || !outputEcart) return;

    function calculer() {

      const valeurRef = parseFloat(inputRef.value);
      const valeurMesuree = parseFloat(inputMesuree.value);

      if (Number.isNaN(valeurRef) || Number.isNaN(valeurMesuree)) {
        outputEcart.textContent = '—';
        return;
      }

      const delta = valeurMesuree - valeurRef;
      const signe = delta >= 0 ? '+' : '';

      outputEcart.textContent = `${signe}${arrondir(delta, 1)} cm`;
    }

    inputRef.addEventListener('input', calculer);
    inputMesuree.addEventListener('input', calculer);
  });
}
