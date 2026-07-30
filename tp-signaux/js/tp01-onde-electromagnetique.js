/**
 * tp-signaux/js/tp01-onde-electromagnetique.js
 *
 * Contrôleur du TP01 « Caractériser une onde électromagnétique ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-signaux/modules/tp01-onde-electromagnetique.html dans #content.
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
import { initImpressionCompteRendu } from './compte-rendu-signaux.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';

const CELERITE = 3.00e8; // m/s, vitesse de la lumière dans le vide

// Contexte professionnel par filière (clé "niveau-idFiliere")
const CONTEXTES_PRO = {

  '1ere-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, le suivi de pièces en production s'appuie de plus en plus sur des badges ou étiquettes RFID, lus par des ondes électromagnétiques.",
    problematique: "À quel domaine du spectre électromagnétique appartiennent les ondes utilisées par un badge RFID, et comment transmettent-elles une information ?",
  },

  '1ere-mcc': {
    contexte: "En Métiers de la couture et de la confection, les postes connectés (wifi, tablettes de suivi de production) utilisent des ondes électromagnétiques pour échanger des données en temps réel.",
    problematique: "Quel domaine du spectre électromagnétique est utilisé par un réseau wifi, et pourquoi ce choix ?",
  },

};

// Domaines du spectre électromagnétique, définis par leurs bornes en
// log10(longueur d'onde en mètres). Frontières approximatives, à
// l'échelle du Bac Pro (seule la borne du visible est une valeur de
// référence usuelle : 400 nm - 700 nm).
const DOMAINES_SPECTRE = [
  { id: 'gamma', label: 'Gamma', min: -14, max: -11 },
  { id: 'x', label: 'X', min: -11, max: -8 },
  { id: 'uv', label: 'UV', min: -8, max: Math.log10(4e-7) },
  { id: 'visible', label: 'Visible', min: Math.log10(4e-7), max: Math.log10(7e-7) },
  { id: 'ir', label: 'IR', min: Math.log10(7e-7), max: -3 },
  { id: 'micro-ondes', label: 'Micro-ondes', min: -3, max: -1 },
  { id: 'hertziennes', label: 'Ondes hertziennes', min: -1, max: 4 },
];

const LOG_MIN = DOMAINES_SPECTRE[0].min;
const LOG_MAX = DOMAINES_SPECTRE[DOMAINES_SPECTRE.length - 1].max;

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {
  initRelationLambdaCF();
  initDomaineSpectral();
  initSourcesVieCourante();
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
    titre: 'Caractériser une onde électromagnétique',
    tp: 'TP01',
  });
}

// =================================================================
// Onglet 1 — Relation λ = c / f, conversion bidirectionnelle
// =================================================================
function initRelationLambdaCF() {

  const inputFrequence = $('onde-frequence-em');
  const inputLongueur = $('onde-longueur-em');

  if (!inputFrequence || !inputLongueur) return;

  let source = null; // évite la boucle de mise à jour croisée

  inputFrequence.addEventListener('input', () => {
    if (source === 'longueur') return;
    source = 'frequence';

    const f = parseFloat(inputFrequence.value);

    if (Number.isNaN(f) || f <= 0) {
      inputLongueur.value = '';
    } else {
      inputLongueur.value = CELERITE / f;
    }

    source = null;
  });

  inputLongueur.addEventListener('input', () => {
    if (source === 'frequence') return;
    source = 'longueur';

    const lambda = parseFloat(inputLongueur.value);

    if (Number.isNaN(lambda) || lambda <= 0) {
      inputFrequence.value = '';
    } else {
      inputFrequence.value = CELERITE / lambda;
    }

    source = null;
  });
}

// =================================================================
// Onglet 2 — Identifier le domaine spectral à partir de λ
// =================================================================
function initDomaineSpectral() {

  const inputLongueur = $('spectre-longueur-onde');
  const outputDomaine = $('spectre-domaine-out');
  const conteneur = $('spectre-em');

  if (conteneur) {
    dessinerSpectreEm(conteneur);
  }

  if (!inputLongueur || !outputDomaine) return;

  inputLongueur.addEventListener('input', () => {

    const lambda = parseFloat(inputLongueur.value);

    if (Number.isNaN(lambda) || lambda <= 0) {
      outputDomaine.textContent = '—';
      positionnerCurseurSpectre(null);
      return;
    }

    const domaine = identifierDomaine(lambda);
    outputDomaine.textContent = domaine ? domaine.label : 'Hors échelle';
    positionnerCurseurSpectre(lambda);
  });
}

function identifierDomaine(lambda) {

  const logLambda = Math.log10(lambda);
  return DOMAINES_SPECTRE.find(d => logLambda >= d.min && logLambda < d.max) || null;
}

function dessinerSpectreEm(conteneur) {

  conteneur.innerHTML = '';

  const barre = document.createElement('div');
  barre.className = 'spectre-em-barre';

  DOMAINES_SPECTRE.forEach(domaine => {

    const largeur = domaine.max - domaine.min;

    const segment = document.createElement('div');
    segment.className = 'spectre-em-segment';
    segment.dataset.domaine = domaine.id;
    segment.style.flexGrow = String(largeur);
    segment.title = domaine.label;
    segment.textContent = domaine.label;

    barre.appendChild(segment);
  });

  const curseur = document.createElement('div');
  curseur.id = 'spectre-em-curseur';
  curseur.className = 'spectre-em-curseur';
  curseur.style.display = 'none';

  conteneur.appendChild(barre);
  conteneur.appendChild(curseur);
}

function positionnerCurseurSpectre(lambda) {

  const curseur = $('spectre-em-curseur');
  if (!curseur) return;

  if (lambda === null || Number.isNaN(lambda) || lambda <= 0) {
    curseur.style.display = 'none';
    return;
  }

  const logLambda = Math.log10(lambda);
  const pourcentage = Math.min(100, Math.max(0, ((logLambda - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100));

  curseur.style.display = 'block';
  curseur.style.left = `${pourcentage}%`;
}

// =================================================================
// Onglet 3 — Sources et détecteurs de la vie courante
// Relevé cumulatif (objet, domaine, rôle) dans un tableau
// =================================================================
function initSourcesVieCourante() {

  const btnAjouter = $('source-ajouter');
  const inputObjet = $('source-objet');
  const selectDomaine = $('source-domaine');
  const selectRole = $('source-role');
  const tbody = $('tbody-sources-vie-courante');

  if (!btnAjouter || !tbody) return;

  const LABELS_DOMAINE = Object.fromEntries(DOMAINES_SPECTRE.map(d => [d.id, d.label]));
  const LABELS_ROLE = { emetteur: 'Émetteur', detecteur: 'Détecteur', 'les-deux': 'Émetteur et détecteur' };

  btnAjouter.addEventListener('click', () => {

    const objet = (inputObjet.value || '').trim();
    const domaine = selectDomaine.value;
    const role = selectRole.value;

    if (!objet || !domaine || !role) return;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${objet}</td>
      <td>${LABELS_DOMAINE[domaine] || domaine}</td>
      <td>${LABELS_ROLE[role] || role}</td>
    `;
    tbody.appendChild(tr);

    inputObjet.value = '';
    selectDomaine.value = '';
    selectRole.value = '';
    inputObjet.focus();
  });
}

// =================================================================
// Tableau de résultats — longueur d'onde et domaine pour wifi/téléphonie
// =================================================================
const DISPOSITIFS_TABLEAU = ['wifi', 'tel'];

function initTableauEcarts() {

  DISPOSITIFS_TABLEAU.forEach(dispositif => {

    const inputFrequence = $(`ref-frequence-${dispositif}`);
    const inputLongueur = $(`mesuree-longueur-${dispositif}`);
    const outputDomaine = $(`domaine-${dispositif}`);

    if (!inputFrequence || !inputLongueur || !outputDomaine) return;

    function calculer() {

      const frequence = parseFloat(inputFrequence.value);

      if (Number.isNaN(frequence) || frequence <= 0) {
        outputDomaine.textContent = '—';
        return;
      }

      const longueurOnde = CELERITE / frequence;
      inputLongueur.value = longueurOnde;

      const domaine = identifierDomaine(longueurOnde);
      outputDomaine.textContent = domaine ? domaine.label : 'Hors échelle';
    }

    inputFrequence.addEventListener('input', calculer);
    calculer();
  });
}
