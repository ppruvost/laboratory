/**
 * tp-optique/js/tp03-perception-couleurs.js
 *
 * Contrôleur du TP03 « Perception des couleurs ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-optique/modules/tp03-perception-couleurs.html dans #content.
 *
 * Convention SciLab :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP03()
 */

import { $, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-optique.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';

// Contexte professionnel par filière (clé "niveau-idFiliere")
const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, le contrôle visuel de pièces (repérage de code couleur, contrôle qualité) dépend fortement de la couleur de l'éclairage de l'atelier.",
    problematique: "Pourquoi la couleur perçue d'une pièce peut-elle changer selon l'éclairage de l'atelier, et comment l'éviter lors d'un contrôle qualité ?",
  },

  '2nde-mcc': {
    contexte: "En Métiers de la couture et de la confection, l'assortiment des couleurs de tissus doit être vérifié sous un éclairage neutre, car la couleur perçue d'un tissu dépend de la composition spectrale de la lumière qui l'éclaire.",
    problematique: "Pourquoi deux tissus qui semblent assortis sous un éclairage peuvent-ils sembler différents sous un autre, et comment l'anticiper ?",
  },

};

// Prévisions usuelles de synthèse additive (combinaisons de lumières
// rouge/vert/bleu superposées sur un écran blanc)
function prevoirSyntheseAdditive(rouge, vert, bleu) {

  if (rouge && vert && bleu) return 'Blanc';
  if (rouge && vert) return 'Jaune';
  if (rouge && bleu) return 'Magenta';
  if (vert && bleu) return 'Cyan';
  if (rouge) return 'Rouge';
  if (vert) return 'Vert';
  if (bleu) return 'Bleu';
  return 'Noir (aucune lumière)';
}

// Réponses correctes attendues pour le schéma de l'œil
const REPONSES_OEIL = {
  'oeil-element1': 'cristallin',
  'oeil-element2': 'retine',
};

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {
  initSyntheseAdditive();
  initSyntheseSoustractive();
  initCouleurObjetEclairage();
  initModeleOeil();

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
    titre: 'Perception des couleurs',
    tp: 'TP03',
  });
}

// =================================================================
// Onglet 1 — Synthèse additive
// =================================================================
function initSyntheseAdditive() {

  const checkRouge = $('additive-rouge');
  const checkVert = $('additive-vert');
  const checkBleu = $('additive-bleu');
  const outputPrevision = $('additive-resultat-out');

  const btnAjouter = $('additive-ajouter');
  const inputObservation = $('additive-observation');
  const tbody = $('tbody-synthese-additive');

  if (checkRouge && checkVert && checkBleu && outputPrevision) {

    function calculerPrevision() {
      outputPrevision.textContent = prevoirSyntheseAdditive(
        checkRouge.checked, checkVert.checked, checkBleu.checked
      );
    }

    [checkRouge, checkVert, checkBleu].forEach(c => c.addEventListener('change', calculerPrevision));
    calculerPrevision();
  }

  if (!btnAjouter || !tbody) return;

  btnAjouter.addEventListener('click', () => {

    const observation = (inputObservation.value || '').trim();
    if (!observation) return;

    const prevision = prevoirSyntheseAdditive(
      checkRouge?.checked, checkVert?.checked, checkBleu?.checked
    );

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${checkRouge?.checked ? '✓' : '—'}</td>
      <td>${checkVert?.checked ? '✓' : '—'}</td>
      <td>${checkBleu?.checked ? '✓' : '—'}</td>
      <td>${prevision}</td>
      <td>${observation}</td>
    `;
    tbody.appendChild(tr);

    inputObservation.value = '';
    inputObservation.focus();
  });
}

// =================================================================
// Onglet 2 — Synthèse soustractive
// =================================================================
function initSyntheseSoustractive() {

  const btnAjouter = $('soustractive-ajouter');
  const selectFiltre1 = $('soustractive-filtre1');
  const selectFiltre2 = $('soustractive-filtre2');
  const inputObservation = $('soustractive-observation');
  const tbody = $('tbody-synthese-soustractive');

  if (!btnAjouter || !tbody) return;

  const LABELS_FILTRE = { cyan: 'Cyan', magenta: 'Magenta', jaune: 'Jaune' };

  btnAjouter.addEventListener('click', () => {

    const observation = (inputObservation.value || '').trim();
    if (!observation) return;

    const filtre1 = LABELS_FILTRE[selectFiltre1.value] || '(aucun)';
    const filtre2 = LABELS_FILTRE[selectFiltre2.value] || '(aucun)';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${filtre1}</td>
      <td>${filtre2}</td>
      <td>${observation}</td>
    `;
    tbody.appendChild(tr);

    inputObservation.value = '';
    inputObservation.focus();
  });
}

// =================================================================
// Onglet 3 — Couleur d'un objet selon l'éclairage
// =================================================================
function initCouleurObjetEclairage() {

  const btnAjouter = $('objet-ajouter');
  const inputCouleurObjet = $('objet-couleur');
  const selectEclairage = $('objet-eclairage');
  const inputObservation = $('objet-observation');
  const tbody = $('tbody-couleur-objet');

  if (!btnAjouter || !tbody) return;

  const LABELS_ECLAIRAGE = { blanc: 'Blanc', rouge: 'Rouge', vert: 'Vert', bleu: 'Bleu' };

  btnAjouter.addEventListener('click', () => {

    const objet = (inputCouleurObjet.value || '').trim();
    const observation = (inputObservation.value || '').trim();

    if (!objet || !observation) return;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${objet}</td>
      <td>${LABELS_ECLAIRAGE[selectEclairage.value] || selectEclairage.value}</td>
      <td>${observation}</td>
    `;
    tbody.appendChild(tr);

    inputCouleurObjet.value = '';
    inputObservation.value = '';
    inputCouleurObjet.focus();
  });
}

// =================================================================
// Onglet 4 — Modèle de l'œil : vérification du schéma
// =================================================================
function initModeleOeil() {

  const btnVerifier = $('oeil-verifier');
  const resultat = $('oeil-resultat');

  if (!btnVerifier || !resultat) return;

  btnVerifier.addEventListener('click', () => {

    const reponses = Object.keys(REPONSES_OEIL).map(id => ({
      id,
      valeur: $(id)?.value || '',
      attendu: REPONSES_OEIL[id],
    }));

    resultat.classList.remove('succes', 'erreur');

    if (reponses.some(r => !r.valeur)) {
      resultat.textContent = 'Compléter les deux éléments du schéma avant de vérifier.';
      return;
    }

    const valeurs = reponses.map(r => r.valeur);
    const doublons = new Set(valeurs).size !== valeurs.length;
    const correct = !doublons && reponses.every(r => r.valeur === r.attendu);

    if (correct) {
      resultat.textContent = '✓ Schéma correct : la cornée/le cristallin joue le rôle de lentille convergente, la rétine celui d\'écran.';
      resultat.classList.add('succes');
    } else {
      resultat.textContent = '✗ Schéma incorrect : revoir le rôle de chaque élément de l\'œil.';
      resultat.classList.add('erreur');
    }
  });
}
