/**
 * tp-mecanique/js/tp04-equilibre-rotation-archimede.js
 *
 * Contrôleur du TP04 « Équilibre en rotation et force d'Archimède ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-mecanique/modules/tp04-equilibre-rotation-archimede.html dans
 * #content.
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
import glassware from '../../data/glassware.js';
import laboratoryEquipment from '../../data/equipment.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const G = 9.81; // N/kg

const CONTEXTES_PRO = {

  '1ere-tci': {
    contexte: "Une trappe de visite métallique montée sur charnière doit rester en équilibre en position ouverte, sous l'effet de son propre poids et éventuellement d'un vérin d'assistance.",
    problematique: "Comment calculer le moment des forces qui s'exercent sur une trappe en rotation et vérifier sa condition d'équilibre ?",
  },

  '1ere-trpm': {
    contexte: "Un bras de levage ou un outillage articulé autour d'un axe doit rester en équilibre lors de son utilisation, sous l'effet de plusieurs forces appliquées à différentes distances de l'axe.",
    problematique: "Comment calculer le moment des forces qui s'exercent sur un outillage en rotation et vérifier sa condition d'équilibre ?",
  },

  'tle-mcc': {
    contexte: "Certains accessoires ou flotteurs utilisés en confection (mannequins flottants de présentation, éléments décoratifs immergés) doivent rester en équilibre à la surface d'un liquide.",
    problematique: "Comment déterminer la force d'Archimède exercée sur un objet immergé et expliquer sa flottabilité ?",
  },

};

export function init() {

  initEquilibreRotation();
  initArchimede();

  initMateriel({
    verreId: 'materiel-verrerie',
    equipementId: 'materiel-equipements',
    glassware,
    equipment: laboratoryEquipment,
    categorie: 'RotationArchimede',
  });

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  // « Obtenir l'équilibre d'un solide en rotation » : uniquement TCI
  // et TRPM, en 1ère (non repris en Tle, non étudié en MCC).
  // « Exploiter la force d'Archimède » : TCI/TRPM en 1ère, MCC en Tle.
  initOngletsParFiliere({
    mapping: {
      '2nde-remi': [],
      '2nde-mcc':  [],
      '1ere-tci':  ['equilibre-rotation', 'archimede'],
      '1ere-trpm': ['equilibre-rotation', 'archimede'],
      '1ere-mcc':  [],
      'tle-tci':   [],
      'tle-trpm':  [],
      'tle-mcc':   ['archimede'],
    },
    messageId: 'tp04m-message-filiere',
    messageTexte: "Ce TP n'est pas au programme de votre filière à ce niveau. L'équilibre en rotation concerne TCI/TRPM en 1ère ; la force d'Archimède concerne TCI/TRPM en 1ère et Métiers de la couture et de la confection en Terminale.",
  });

  initSections();
  initTabs();
  initModesOperatoires();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: "Équilibre en rotation et force d'Archimède",
    tp: 'TP04',
  });
}

// =================================================================
// Onglet 1 — Moment d'une force M = F × d
// =================================================================
function initEquilibreRotation() {

  const inputF1 = $('mom-f1');
  const inputD1 = $('mom-d1');
  const inputF2 = $('mom-f2');
  const inputD2 = $('mom-d2');
  const zoneResultat = $('mom-resultat');

  if (!inputF1 || !inputD1 || !inputF2 || !inputD2 || !zoneResultat) return;

  function calculer() {

    const f1 = parseFloat(inputF1.value);
    const d1 = parseFloat(inputD1.value);
    const f2 = parseFloat(inputF2.value);
    const d2 = parseFloat(inputD2.value);

    if ([f1, d1, f2, d2].some(Number.isNaN)) {
      zoneResultat.textContent = 'Saisir les deux forces et leurs bras de levier respectifs pour comparer leurs moments et vérifier la condition d\'équilibre.';
      return;
    }

    const m1 = f1 * d1;
    const m2 = f2 * d2;
    const ecart = Math.abs(m1 - m2);
    const tolerance = 0.05 * Math.max(m1, m2, 0.01);

    const conclusion = ecart <= tolerance
      ? 'Les deux moments sont pratiquement égaux : le système est cohérent avec une situation d\'équilibre (moments opposés de même valeur).'
      : 'Les deux moments diffèrent nettement : le système n\'est pas à l\'équilibre avec ces valeurs.';

    zoneResultat.innerHTML = `
      M₁ = F₁ × d₁ = <strong>${arrondir(m1, 3)} N·m</strong><br>
      M₂ = F₂ × d₂ = <strong>${arrondir(m2, 3)} N·m</strong><br>
      ${conclusion}
    `;
  }

  [inputF1, inputD1, inputF2, inputD2].forEach(input => input.addEventListener('input', calculer));
}

// =================================================================
// Onglet 2 — Force d'Archimède (mesure et calcul théorique)
// =================================================================
function initArchimede() {

  const inputPoidsAir = $('arc-poids-air');
  const inputPoidsLiquide = $('arc-poids-liquide');
  const zoneMesure = $('arc-resultat-mesure');

  if (inputPoidsAir && inputPoidsLiquide && zoneMesure) {

    function calculerMesure() {

      const pAir = parseFloat(inputPoidsAir.value);
      const pLiquide = parseFloat(inputPoidsLiquide.value);

      if (Number.isNaN(pAir) || Number.isNaN(pLiquide)) {
        zoneMesure.textContent = 'Saisir le poids mesuré dans l\'air puis immergé pour en déduire la valeur expérimentale de la force d\'Archimède.';
        return;
      }

      const fa = pAir - pLiquide;

      zoneMesure.innerHTML = `
        Force d'Archimède expérimentale : Fₐ = P(air) − P(immergé) = <strong>${arrondir(fa, 3)} N</strong>
      `;
    }

    inputPoidsAir.addEventListener('input', calculerMesure);
    inputPoidsLiquide.addEventListener('input', calculerMesure);
  }

  const inputVolume = $('arc-volume');
  const inputRho = $('arc-masse-volumique');
  const zoneCalcul = $('arc-resultat-calcul');

  if (!inputVolume || !inputRho || !zoneCalcul) return;

  function calculerTheorique() {

    const vCm3 = parseFloat(inputVolume.value);
    const rho = parseFloat(inputRho.value);

    if (Number.isNaN(vCm3) || Number.isNaN(rho)) {
      zoneCalcul.textContent = 'Saisir le volume immergé et la masse volumique du fluide pour calculer la force d\'Archimède théorique.';
      return;
    }

    const vM3 = vCm3 * 1e-6;
    const fa = rho * vM3 * G;

    zoneCalcul.innerHTML = `
      Force d'Archimède théorique : Fₐ = ρ × V × g = <strong>${arrondir(fa, 3)} N</strong>
    `;
  }

  inputVolume.addEventListener('input', calculerTheorique);
  inputRho.addEventListener('input', calculerTheorique);
}
