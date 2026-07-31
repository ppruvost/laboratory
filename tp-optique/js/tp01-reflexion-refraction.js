/**
 * tp-optique/js/tp01-reflexion-refraction.js
 *
 * Contrôleur du TP01 « Réflexion et réfraction ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-optique/modules/tp01-reflexion-refraction.html dans #content.
 *
 * Convention SciLab :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP01()
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

  '2nde-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, le contrôle de surfaces polies ou réfléchissantes (pièces usinées, miroirs de guidage laser) s'appuie sur la maîtrise des lois de la réflexion et de la réfraction.",
    problematique: "Comment vérifier expérimentalement les lois de la réflexion et de la réfraction, et pourquoi une pièce très polie dévie-t-elle un faisceau lumineux de façon prévisible ?",
  },

  '2nde-mcc': {
    contexte: "En Métiers de la couture et de la confection, certains contrôles optiques (vérification de la transparence ou du brillant d'un tissu, éclairage d'un poste de travail) reposent sur la façon dont la lumière se réfléchit ou se réfracte à la surface d'un matériau.",
    problematique: "Comment la lumière se comporte-t-elle lorsqu'elle rencontre la surface d'un matériau, et comment le prévoir à l'aide des lois de l'optique géométrique ?",
  },

};

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {
  initLoiReflexion();
  initLoiRefraction();
  initAngleLimite();
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
    titre: 'Réflexion et réfraction',
    tp: 'TP01',
  });
}

// =================================================================
// Onglet 1 — Loi de la réflexion : i1 = i2
// =================================================================
function initLoiReflexion() {

  const inputI1 = $('reflexion-i1');
  const inputI2 = $('reflexion-i2-mesure');
  const outputEcart = $('reflexion-ecart');

  if (!inputI1 || !inputI2 || !outputEcart) return;

  function calculer() {

    const i1 = parseFloat(inputI1.value);
    const i2 = parseFloat(inputI2.value);

    if (Number.isNaN(i1) || Number.isNaN(i2)) {
      outputEcart.textContent = '—';
      return;
    }

    const ecart = i2 - i1;
    const signe = ecart >= 0 ? '+' : '';

    outputEcart.textContent = `${signe}${arrondir(ecart, 1)} °`;
  }

  inputI1.addEventListener('input', calculer);
  inputI2.addEventListener('input', calculer);
}

// =================================================================
// Onglet 2 — Loi de la réfraction : n1 sin(i1) = n2 sin(i2)
// =================================================================
function initLoiRefraction() {

  const inputN1 = $('refraction-n1');
  const inputI1 = $('refraction-i1');
  const inputN2 = $('refraction-n2');
  const outputI2 = $('refraction-i2-out');

  const inputI2Mesure = $('refraction-i2-mesure');
  const outputN2Calcule = $('refraction-n2-calcule');

  if (inputN1 && inputI1 && inputN2 && outputI2) {

    function calculerI2() {

      const n1 = parseFloat(inputN1.value);
      const i1 = parseFloat(inputI1.value);
      const n2 = parseFloat(inputN2.value);

      if (Number.isNaN(n1) || Number.isNaN(i1) || Number.isNaN(n2) || n2 <= 0) {
        outputI2.textContent = '—';
        return;
      }

      const sinI2 = (n1 * Math.sin(i1 * Math.PI / 180)) / n2;

      if (sinI2 > 1 || sinI2 < -1) {
        outputI2.textContent = 'Réflexion totale (pas de rayon réfracté)';
        return;
      }

      const i2 = Math.asin(sinI2) * 180 / Math.PI;
      outputI2.textContent = `${arrondir(i2, 1)} °`;
    }

    inputN1.addEventListener('input', calculerI2);
    inputI1.addEventListener('input', calculerI2);
    inputN2.addEventListener('input', calculerI2);
  }

  if (inputN1 && inputI1 && inputI2Mesure && outputN2Calcule) {

    function calculerN2() {

      const n1 = parseFloat(inputN1.value);
      const i1 = parseFloat(inputI1.value);
      const i2Mesure = parseFloat(inputI2Mesure.value);

      if (Number.isNaN(n1) || Number.isNaN(i1) || Number.isNaN(i2Mesure)) {
        outputN2Calcule.textContent = '—';
        return;
      }

      const sinI2 = Math.sin(i2Mesure * Math.PI / 180);

      if (sinI2 === 0) {
        outputN2Calcule.textContent = '—';
        return;
      }

      const n2 = (n1 * Math.sin(i1 * Math.PI / 180)) / sinI2;
      outputN2Calcule.textContent = arrondir(n2, 3);
    }

    inputN1.addEventListener('input', calculerN2);
    inputI1.addEventListener('input', calculerN2);
    inputI2Mesure.addEventListener('input', calculerN2);
  }
}

// =================================================================
// Onglet 3 — Angle limite et réflexion totale
// sin(theta_lim) = n2 / n1, condition n2 < n1
// =================================================================
function initAngleLimite() {

  const inputN1 = $('limite-n1');
  const inputN2 = $('limite-n2');
  const outputAngle = $('limite-angle-out');

  const inputAngleTeste = $('limite-angle-teste');
  const btnVerifier = $('limite-verifier');
  const resultat = $('limite-resultat');

  if (!inputN1 || !inputN2 || !outputAngle) return;

  function angleLimiteDeg() {

    const n1 = parseFloat(inputN1.value);
    const n2 = parseFloat(inputN2.value);

    if (Number.isNaN(n1) || Number.isNaN(n2) || n1 <= 0 || n2 <= 0 || n2 >= n1) {
      return null;
    }

    return Math.asin(n2 / n1) * 180 / Math.PI;
  }

  function calculerAngleLimite() {

    const thetaLim = angleLimiteDeg();

    if (thetaLim === null) {
      outputAngle.textContent = 'Non défini (n₂ doit être < n₁)';
    } else {
      outputAngle.textContent = `${arrondir(thetaLim, 2)} °`;
    }
  }

  inputN1.addEventListener('input', calculerAngleLimite);
  inputN2.addEventListener('input', calculerAngleLimite);
  calculerAngleLimite();

  if (btnVerifier && resultat && inputAngleTeste) {

    btnVerifier.addEventListener('click', () => {

      const thetaLim = angleLimiteDeg();
      const angleTeste = parseFloat(inputAngleTeste.value);

      resultat.classList.remove('succes', 'erreur');

      if (thetaLim === null || Number.isNaN(angleTeste)) {
        resultat.textContent = 'Compléter les indices et l\'angle testé avant de vérifier.';
        return;
      }

      if (angleTeste >= thetaLim) {
        resultat.textContent = `✓ angle ≥ θ_lim (${arrondir(thetaLim, 1)}°) : réflexion totale, aucun rayon ne sort dans l'air.`;
        resultat.classList.add('succes');
      } else {
        resultat.textContent = `angle < θ_lim (${arrondir(thetaLim, 1)}°) : une partie de la lumière sort par réfraction dans l'air.`;
        resultat.classList.add('erreur');
      }
    });
  }
}

// =================================================================
// Tableau de résultats — écarts indice n2 et angle limite
// =================================================================
function initTableauEcarts() {

  const paires = [
    { ref: 'ref-indice-n2', mesuree: 'mesuree-indice-n2', ecart: 'ecart-indice-n2', decimales: 3, unite: '' },
    { ref: 'ref-angle-limite', mesuree: 'mesuree-angle-limite', ecart: 'ecart-angle-limite', decimales: 1, unite: ' °' },
  ];

  paires.forEach(({ ref, mesuree, ecart, decimales, unite }) => {

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

      outputEcart.textContent = `${signe}${arrondir(delta, decimales)}${unite}`;
    }

    inputRef.addEventListener('input', calculer);
    inputMesuree.addEventListener('input', calculer);
  });
}
