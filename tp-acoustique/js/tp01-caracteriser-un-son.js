/**
 * tp-acoustique/js/tp01-caracteriser-un-son.js
 *
 * Contrôleur du TP01 « Caractériser un son ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-acoustique/modules/tp01-caracteriser-un-son.html dans #content.
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
import { initImpressionCompteRendu } from './compte-rendu-acoustique.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';

// Contexte professionnel par filière (clé "niveau-idFiliere")
const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, les postes de meulage, perçage et découpe génèrent des niveaux sonores élevés et prolongés, exposant les opérateurs à un risque auditif.",
    problematique: "Comment caractériser le niveau sonore d'un poste de travail et choisir la protection auditive adaptée ?",
  },

  '2nde-mcc': {
    contexte: "En Métiers de la couture et de la confection, les ateliers regroupant plusieurs machines à coudre et surjeteuses en fonctionnement simultané peuvent atteindre des niveaux sonores gênants sur la durée d'une journée de travail.",
    problematique: "Comment évaluer le niveau sonore d'un atelier de confection et limiter son impact sur l'audition ?",
  },

};

// Échelle de niveau d'intensité acoustique (repères usuels, en dB)
// utilisée pour situer une mesure et pour colorer la barre graduée.
const ECHELLE_DB = [
  { seuil: 0, label: 'Silence' },
  { seuil: 30, label: 'Chuchotement' },
  { seuil: 60, label: 'Conversation normale' },
  { seuil: 85, label: 'Seuil de dangerosité' },
  { seuil: 100, label: 'Atelier bruyant' },
  { seuil: 120, label: 'Seuil de douleur' },
  { seuil: 140, label: 'Danger immédiat' },
];

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {
  initPeriodeFrequence();
  initNiveauIntensite();
  initClassementSons();
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

  // Onglets et accordéons de section : sans cet appel, ces éléments
  // restent inertes malgré leur CSS.
  initSections();
  initTabs();
  initModesOperatoires();

  // Génération du radar au clic sur #btn-radar
  initRadarCompetences();

  // Vrai système d'impression (modales identité + génération PDF),
  // au lieu d'un simple window.print() de la page vivante.
  initImpressionCompteRendu({
    titre: 'Caractériser un son',
    tp: 'TP01',
  });
}

// =================================================================
// Onglet 1 — Période / fréquence
// Relation f = 1/T, période saisie en millisecondes
// =================================================================
function initPeriodeFrequence() {

  const inputPeriode = $('periode-mesuree');
  const outputFrequence = $('frequence-calculee');

  if (!inputPeriode || !outputFrequence) return;

  inputPeriode.addEventListener('input', () => {

    const periodeMs = parseFloat(inputPeriode.value);

    if (Number.isNaN(periodeMs) || periodeMs <= 0) {
      outputFrequence.textContent = '—';
      return;
    }

    const frequence = 1000 / periodeMs; // T en ms -> f en Hz
    outputFrequence.textContent = `${arrondir(frequence, 1)} Hz`;
  });
}

// =================================================================
// Onglet 2 — Niveau d'intensité acoustique
// Appréciation qualitative + barre graduée colorée
// =================================================================
function initNiveauIntensite() {

  const inputNiveau = $('niveau-mesure');
  const outputAppreciation = $('niveau-appreciation');
  const conteneurEchelle = $('echelle-db');

  if (conteneurEchelle) {
    dessinerEchelleDb(conteneurEchelle);
  }

  if (!inputNiveau || !outputAppreciation) return;

  inputNiveau.addEventListener('input', () => {

    const niveau = parseFloat(inputNiveau.value);

    if (Number.isNaN(niveau)) {
      outputAppreciation.textContent = '—';
      positionnerCurseurEchelle(null);
      return;
    }

    outputAppreciation.textContent = apprecierNiveau(niveau);
    positionnerCurseurEchelle(niveau);
  });
}

function apprecierNiveau(niveau) {

  if (niveau < 85) return 'En dessous du seuil de dangerosité';
  if (niveau < 120) return 'Au-delà du seuil de dangerosité — protection requise';
  return 'Au-delà du seuil de douleur — danger immédiat';
}

function dessinerEchelleDb(conteneur) {

  conteneur.innerHTML = '';

  const barre = document.createElement('div');
  barre.className = 'echelle-db-barre';

  ECHELLE_DB.forEach((repere, i) => {

    const suivant = ECHELLE_DB[i + 1];
    const largeur = suivant ? suivant.seuil - repere.seuil : 20;

    const segment = document.createElement('div');
    segment.className = 'echelle-db-segment';
    segment.style.flexGrow = String(largeur);
    segment.title = `${repere.label} (à partir de ${repere.seuil} dB)`;
    segment.textContent = repere.label;

    barre.appendChild(segment);
  });

  const curseur = document.createElement('div');
  curseur.id = 'echelle-db-curseur';
  curseur.className = 'echelle-db-curseur';
  curseur.style.display = 'none';

  conteneur.appendChild(barre);
  conteneur.appendChild(curseur);
}

function positionnerCurseurEchelle(niveau) {

  const curseur = $('echelle-db-curseur');
  if (!curseur) return;

  if (niveau === null || Number.isNaN(niveau)) {
    curseur.style.display = 'none';
    return;
  }

  const NIVEAU_MAX_ECHELLE = 140;
  const pourcentage = Math.min(100, Math.max(0, (niveau / NIVEAU_MAX_ECHELLE) * 100));

  curseur.style.display = 'block';
  curseur.style.left = `${pourcentage}%`;
}

// =================================================================
// Onglet 3 — Classement des sons du plus grave au plus aigu
// Relevé (source, fréquence) saisi par l'élève, reclassé en direct
// =================================================================
function initClassementSons() {

  const btnAjouter = $('classement-ajouter');
  const inputSource = $('classement-source');
  const inputFrequence = $('classement-frequence');
  const tbody = $('tbody-classement-sons');

  if (!btnAjouter || !tbody) return;

  const sons = [];

  btnAjouter.addEventListener('click', () => {

    const source = (inputSource.value || '').trim();
    const frequence = parseFloat(inputFrequence.value);

    if (!source || Number.isNaN(frequence)) return;

    sons.push({ source, frequence });
    sons.sort((a, b) => a.frequence - b.frequence); // grave -> aigu

    redessinerTableauClassement(tbody, sons);

    inputSource.value = '';
    inputFrequence.value = '';
    inputSource.focus();
  });
}

function redessinerTableauClassement(tbody, sons) {

  tbody.innerHTML = '';

  sons.forEach(son => {

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${son.source}</td>
      <td>${arrondir(son.frequence, 0)} Hz</td>
    `;

    tbody.appendChild(tr);
  });
}

// =================================================================
// Tableau de résultats — calcul automatique de l'écart
// (référence vs calculée) pour la fréquence et le niveau sonore
// =================================================================
const MESURES_TABLEAU = ['frequence', 'niveau'];

function initTableauEcarts() {

  MESURES_TABLEAU.forEach(mesure => {

    const inputRef = $(`ref-${mesure}`);
    const inputMesuree = $(`mesuree-${mesure}`);
    const outputEcart = $(`ecart-${mesure}`);

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

      outputEcart.textContent = `${signe}${arrondir(ecart, 1)}`;
    }

    inputRef.addEventListener('input', calculer);
    inputMesuree.addEventListener('input', calculer);
  });
}
