/**
 * tp-electricite/js/tp04-conversion-moteurs.js
 *
 * Contrôleur du TP04 « Conversion alternatif-continu et moteurs
 * électriques ». Chargé par navigation.js juste après l'injection du
 * fragment tp-electricite/modules/tp04-conversion-moteurs.html dans
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
import laboratoryEquipment from '../../data/equipment.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const CONTEXTES_PRO = {

  'tle-tci': {
    contexte: "Certains outils de chaudronnerie (perceuse, meuleuse) sont équipés de moteurs à courant continu ou asynchrones alimentés à partir du secteur, via un module de conversion alternatif-continu pour les modèles sur batterie.",
    problematique: "Comment convertir un courant alternatif en courant continu et comment un moteur électrique convertit-il l'énergie électrique en énergie mécanique ?",
  },

  'tle-trpm': {
    contexte: "Les moteurs des machines-outils d'un atelier de production mécanique peuvent être des moteurs à courant continu ou des moteurs asynchrones, pilotés par variateur pour ajuster leur fréquence de rotation.",
    problematique: "Comment convertir un courant alternatif en courant continu et comment un moteur électrique convertit-il l'énergie électrique en énergie mécanique ?",
  },

};

const REDRESSEMENT_INFO = {
  alternatif: "Le signal alterne périodiquement entre valeurs positives et négatives : c'est le signal d'entrée, non exploitable directement par un appareil fonctionnant en courant continu.",
  redresse: "Le signal ne prend plus que des valeurs positives (ou nulles), mais reste très ondulé : le pont de diodes a redressé le courant sans encore le rendre continu.",
  filtre: "Le signal est nettement moins ondulé, proche d'une valeur constante : le condensateur a filtré le courant redressé pour se rapprocher d'un courant continu.",
};

const MOTEUR_INFO = {
  cc: {
    texte: "Pour un moteur à courant continu, c'est la <strong>tension d'alimentation</strong> qu'il faut faire varier : la fréquence de rotation lui est globalement proportionnelle.",
    colonne: 'Tension (V)',
  },
  asynchrone: {
    texte: "Pour un moteur asynchrone, c'est la <strong>fréquence de la tension d'alimentation</strong> qu'il faut faire varier : la fréquence de rotation en dépend directement.",
    colonne: 'Fréquence (Hz)',
  },
};

export function init() {

  initRedressement();
  initMoteurs();

  initMateriel({
    equipementId: 'materiel-equipements',
    equipment: laboratoryEquipment,
    categorie: 'Conversion',
  });

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  // « Obtenir un courant continu à partir d'un courant alternatif et
  // inversement » et « Obtenir de l'énergie mécanique à l'aide d'un
  // moteur électrique » ne concernent que TCI et TRPM, en Terminale.
  initOngletsParFiliere({
    mapping: {
      '1ere-tci':  [],
      '1ere-trpm': [],
      '1ere-mcc':  [],
      'tle-tci':   ['redressement', 'moteurs'],
      'tle-trpm':  ['redressement', 'moteurs'],
      'tle-mcc':   [],
    },
    messageId: 'tp04-message-filiere',
    messageTexte: "Ce TP n'est pas au programme de votre filière : la conversion alternatif-continu et les moteurs électriques concernent les filières Technicien en chaudronnerie industrielle et Technicien en réalisation de produits mécaniques, en Terminale.",
  });

  initSections();
  initTabs();
  initModesOperatoires();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Conversion alternatif-continu et moteurs électriques',
    tp: 'TP04',
  });
}

// =================================================================
// Onglet 1 — Redressement et filtrage
// =================================================================
function initRedressement() {

  const select = $('redr-etape');
  const zoneInfo = $('redr-info');

  if (!select || !zoneInfo) return;

  select.addEventListener('change', () => {

    const texte = REDRESSEMENT_INFO[select.value];

    zoneInfo.textContent = texte
      || 'Sélectionner une étape pour afficher la description de l\'allure du signal observé.';
  });
}

// =================================================================
// Onglet 2 — Étude de la fréquence de rotation d'un moteur
// =================================================================
function initMoteurs() {

  const selectType = $('moteur-type');
  const zoneInfo = $('moteur-info');
  const thParametre = $('moteur-th-parametre');
  const btnAjouter = $('moteur-ajouter');
  const inputParametre = $('moteur-parametre');
  const inputFreqRotation = $('moteur-freq-rotation');
  const tbody = $('tbody-moteur');

  if (!selectType || !zoneInfo) return;

  let typeChoisi = '';
  const mesures = [];

  selectType.addEventListener('change', () => {

    const info = MOTEUR_INFO[selectType.value];

    typeChoisi = selectType.value;

    if (!info) {
      zoneInfo.textContent = 'Sélectionner un type de moteur pour afficher le paramètre à faire varier lors de l\'essai.';
      if (thParametre) thParametre.textContent = 'Tension (V) ou fréquence (Hz)';
      return;
    }

    zoneInfo.innerHTML = info.texte;
    if (thParametre) thParametre.textContent = info.colonne;
  });

  if (!btnAjouter || !inputParametre || !inputFreqRotation || !tbody) return;

  btnAjouter.addEventListener('click', () => {

    const parametre = parseFloat(inputParametre.value);
    const freq = parseFloat(inputFreqRotation.value);

    if (Number.isNaN(parametre) || Number.isNaN(freq)) return;

    mesures.push({ parametre, freq });

    redessinerTableauMoteur(tbody, mesures, typeChoisi);

    inputParametre.value = '';
    inputFreqRotation.value = '';
    inputParametre.focus();
  });
}

function redessinerTableauMoteur(tbody, mesures, type) {

  tbody.innerHTML = '';

  const unite = type === 'asynchrone' ? 'Hz' : 'V';

  mesures.forEach((m, idx) => {

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${arrondir(m.parametre, 1)} ${unite}</td>
      <td>${arrondir(m.freq, 0)} tr/min</td>
    `;

    tbody.appendChild(tr);
  });
}
