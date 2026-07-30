/**
 * tp-acoustique/js/tp03-chaine-transmission-sonore.js
 *
 * Contrôleur du TP03 « Chaîne de transmission sonore ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-acoustique/modules/tp03-chaine-transmission-sonore.html dans #content.
 *
 * Convention SciLab :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP03()
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-acoustique.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { dessinerGraphiqueLigne } from '../../js/graphique.js';

// Contexte professionnel par filière (clé "niveau-idFiliere")
const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, des capteurs à ultrasons (fondés sur le même principe piézoélectrique) sont utilisés pour détecter la présence d'une pièce ou mesurer une distance sans contact.",
    problematique: "Comment fonctionne une chaîne de transmission d'informations par capteur piézoélectrique, et quelles sont ses limites en fonction de la distance ?",
  },

  '2nde-mcc': {
    contexte: "En Métiers de la couture et de la confection, certains équipements de contrôle qualité utilisent des capteurs à ultrasons pour vérifier l'épaisseur ou la présence d'un tissu sur la chaîne de production.",
    problematique: "Comment une information peut-elle être transmise par un signal sonore d'un émetteur à un récepteur, et jusqu'à quelle distance ?",
  },

};

// Réponses correctes attendues pour le schéma de la chaîne de transmission
const REPONSES_CHAINE = {
  'chaine-emetteur': 'emetteur',
  'chaine-milieu': 'milieu',
  'chaine-recepteur': 'recepteur',
};

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {
  initEmetteurPiezo();
  initRecepteurPiezo();
  initSchemaChaine();
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
    titre: 'Chaîne de transmission sonore',
    tp: 'TP03',
  });
}

// =================================================================
// Onglet 1 — Émetteur piézoélectrique
// Relevé qualitatif (tension, observation) dans un tableau cumulatif
// =================================================================
function initEmetteurPiezo() {

  const btnAjouter = $('emetteur-ajouter');
  const inputTension = $('emetteur-tension');
  const inputObservation = $('emetteur-observation');
  const tbody = $('tbody-emetteur-piezo');

  if (!btnAjouter || !tbody) return;

  let compteur = 0;

  btnAjouter.addEventListener('click', () => {

    const tension = parseFloat(inputTension.value);
    const observation = (inputObservation.value || '').trim();

    if (Number.isNaN(tension) || !observation) return;

    compteur += 1;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${compteur}</td>
      <td>${arrondir(tension, 1)} V</td>
      <td>${observation}</td>
    `;
    tbody.appendChild(tr);

    inputTension.value = '';
    inputObservation.value = '';
    inputTension.focus();
  });
}

// =================================================================
// Onglet 2 — Récepteur piézoélectrique
// Relevé (distance, tension reçue) affiché et tracé
// =================================================================
function initRecepteurPiezo() {

  const btnAjouter = $('recepteur-ajouter');
  const inputDistance = $('recepteur-distance');
  const inputTension = $('recepteur-tension');
  const tbody = $('tbody-recepteur-piezo');

  if (!btnAjouter || !tbody) return;

  const points = [];

  btnAjouter.addEventListener('click', () => {

    const distance = parseFloat(inputDistance.value);
    const tension = parseFloat(inputTension.value);

    if (Number.isNaN(distance) || Number.isNaN(tension)) return;

    points.push({ distance, tension });
    points.sort((a, b) => a.distance - b.distance);

    redessinerTableauRecepteur(tbody, points);

    dessinerGraphiqueLigne(
      'graphique-recepteur-piezo',
      points.map(p => ({ x: p.distance, y: p.tension })),
      { xLabel: 'Distance (cm)', yLabel: 'Tension reçue (mV)' }
    );

    inputDistance.value = '';
    inputTension.value = '';
    inputDistance.focus();
  });
}

function redessinerTableauRecepteur(tbody, points) {

  tbody.innerHTML = '';

  points.forEach((pt, i) => {

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${arrondir(pt.distance, 0)} cm</td>
      <td>${arrondir(pt.tension, 0)} mV</td>
    `;

    tbody.appendChild(tr);
  });
}

// =================================================================
// Onglet 3 — Schéma de la chaîne de transmission
// Vérification des trois select par rapport aux réponses attendues
// =================================================================
function initSchemaChaine() {

  const btnVerifier = $('chaine-verifier');
  const resultat = $('chaine-resultat');

  if (!btnVerifier || !resultat) return;

  btnVerifier.addEventListener('click', () => {

    const reponses = Object.keys(REPONSES_CHAINE).map(id => ({
      id,
      valeur: $(id)?.value || '',
      attendu: REPONSES_CHAINE[id],
    }));

    if (reponses.some(r => !r.valeur)) {
      resultat.textContent = 'Compléter les trois éléments du schéma avant de vérifier.';
      resultat.classList.remove('succes', 'erreur');
      return;
    }

    const valeurs = reponses.map(r => r.valeur);
    const doublons = new Set(valeurs).size !== valeurs.length;
    const correct = !doublons && reponses.every(r => r.valeur === r.attendu);

    if (correct) {
      resultat.textContent = '✓ Schéma correct : émetteur → milieu de propagation → récepteur.';
      resultat.classList.add('succes');
      resultat.classList.remove('erreur');
    } else {
      resultat.textContent = '✗ Schéma incorrect : revoir le rôle de chaque élément de la chaîne.';
      resultat.classList.add('erreur');
      resultat.classList.remove('succes');
    }
  });
}

// =================================================================
// Tableau de résultats — écart entre tension attendue et mesurée
// =================================================================
function initTableauEcarts() {

  const inputRef = $('ref-tension-recue');
  const inputMesuree = $('mesuree-tension-recue');
  const outputEcart = $('ecart-tension-recue');

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

    outputEcart.textContent = `${signe}${arrondir(ecart, 0)} mV`;
  }

  inputRef.addEventListener('input', calculer);
  inputMesuree.addEventListener('input', calculer);
}
