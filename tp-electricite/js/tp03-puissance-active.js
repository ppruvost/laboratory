/**
 * tp-electricite/js/tp03-puissance-active.js
 *
 * Contrôleur du TP03 « Puissance active en régime sinusoïdal ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-electricite/modules/tp03-puissance-active.html dans #content.
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

  'tle-tci': {
    contexte: "Un poste à souder électrique alimenté en régime sinusoïdal consomme une puissance active qui dépend du déphasage introduit par les enroulements du transformateur interne.",
    problematique: "Comment mesurer et calculer la puissance active réellement consommée par un appareil alimenté en régime sinusoïdal ?",
  },

  'tle-trpm': {
    contexte: "Un moteur électrique d'une machine-outil, alimenté en régime sinusoïdal, présente un déphasage entre tension et intensité qui influence la puissance active réellement consommée.",
    problematique: "Comment mesurer et calculer la puissance active réellement consommée par un moteur alimenté en régime sinusoïdal ?",
  },

};

export function init() {

  initDephasage();
  initPuissanceActive();

  initMateriel({
    equipementId: 'materiel-equipements',
    equipment: laboratoryEquipment,
    categorie: 'PuissanceActive',
  });

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  // « Évaluer la puissance consommée » ne concerne que les filières
  // Technicien en chaudronnerie industrielle et Technicien en
  // réalisation de produits mécaniques, en classe de Terminale.
  initOngletsParFiliere({
    mapping: {
      '1ere-tci':  [],
      '1ere-trpm': [],
      '1ere-mcc':  [],
      'tle-tci':   ['dephasage', 'puissance-active'],
      'tle-trpm':  ['dephasage', 'puissance-active'],
      'tle-mcc':   [],
    },
    messageId: 'tp03-message-filiere',
    messageTexte: "Ce TP n'est pas au programme de votre filière : la puissance active en régime sinusoïdal concerne les filières Technicien en chaudronnerie industrielle et Technicien en réalisation de produits mécaniques, en Terminale.",
  });

  initSections();
  initTabs();
  initModesOperatoires();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Puissance active en régime sinusoïdal',
    tp: 'TP03',
  });
}

// =================================================================
// Onglet 1 — Déphasage tension-intensité
// =================================================================
function initDephasage() {

  const inputPeriode = $('dep-periode');
  const inputDecalage = $('dep-decalage');
  const zoneResultat = $('dep-resultat');

  if (!inputPeriode || !inputDecalage || !zoneResultat) return;

  function calculerDephasage() {

    const t = parseFloat(inputPeriode.value);
    const dt = parseFloat(inputDecalage.value);

    if (Number.isNaN(t) || Number.isNaN(dt) || t === 0) {
      zoneResultat.textContent = 'Saisir la période du signal et le décalage temporel mesuré pour calculer le déphasage φ.';
      return;
    }

    const phiDeg = (dt / t) * 360;
    const phiRad = (phiDeg * Math.PI) / 180;
    const cosPhi = Math.cos(phiRad);

    zoneResultat.innerHTML = `
      Déphasage φ = <strong>${arrondir(phiDeg, 1)} °</strong><br>
      Facteur de puissance cos φ = <strong>${arrondir(cosPhi, 3)}</strong>
    `;
  }

  inputPeriode.addEventListener('input', calculerDephasage);
  inputDecalage.addEventListener('input', calculerDephasage);
}

// =================================================================
// Onglet 2 — Puissance active P = U × I × cos φ
// =================================================================
function initPuissanceActive() {

  const inputU = $('pa-tension');
  const inputI = $('pa-intensite');
  const inputCosPhi = $('pa-cosphi');
  const inputWattmetre = $('pa-wattmetre');
  const zoneResultat = $('pa-resultat');

  if (!inputU || !inputI || !inputCosPhi || !zoneResultat) return;

  function calculerPuissance() {

    const u = parseFloat(inputU.value);
    const i = parseFloat(inputI.value);
    const cosPhi = parseFloat(inputCosPhi.value);
    const pWattmetre = parseFloat(inputWattmetre.value);

    if (Number.isNaN(u) || Number.isNaN(i) || Number.isNaN(cosPhi)) {
      zoneResultat.textContent = 'Saisir U, I et cos φ pour calculer la puissance active, ou comparer avec la valeur lue directement au wattmètre.';
      return;
    }

    const pCalculee = u * i * cosPhi;

    let comparaison = '';

    if (!Number.isNaN(pWattmetre)) {
      const ecart = Math.abs(pCalculee - pWattmetre);
      comparaison = `<br>Écart avec la valeur lue au wattmètre (${arrondir(pWattmetre, 1)} W) : ${arrondir(ecart, 1)} W.`;
    }

    zoneResultat.innerHTML = `
      Puissance active calculée : <strong>${arrondir(pCalculee, 1)} W</strong>${comparaison}
    `;
  }

  inputU.addEventListener('input', calculerPuissance);
  inputI.addEventListener('input', calculerPuissance);
  inputCosPhi.addEventListener('input', calculerPuissance);

  if (inputWattmetre) {
    inputWattmetre.addEventListener('input', calculerPuissance);
  }
}
