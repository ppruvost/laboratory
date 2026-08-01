/**
 * tp-optique/js/tp02-spectre-lumiere-blanche.js
 *
 * Contrôleur du TP02 « Spectre de la lumière blanche ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-optique/modules/tp02-spectre-lumiere-blanche.html dans #content.
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
import { initImpressionCompteRendu } from './compte-rendu-optique.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';

// Contexte professionnel par filière (clé "niveau-idFiliere")
const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, certains procédés (marquage laser, contrôle par caméra infrarouge) exploitent des rayonnements situés en dehors du domaine visible.",
    problematique: "Comment situer un rayonnement sur l'échelle des longueurs d'onde, et pourquoi certains rayonnements utilisés en atelier restent-ils invisibles ?",
  },

  '2nde-mcc': {
    contexte: "En Métiers de la couture et de la confection, le contrôle qualité de certains tissus (détection de taches, de fibres) peut utiliser un éclairage UV, invisible mais actif chimiquement sur certains traitements.",
    problematique: "Comment situer un rayonnement UV ou IR sur l'échelle des longueurs d'onde, et quels risques présente-t-il pour la santé ?",
  },

};

// Ordre correct de décomposition de la lumière blanche (violet -> rouge)
const ORDRE_CORRECT = ['violet', 'bleu', 'vert', 'jaune', 'orange', 'rouge'];

const LABELS_COULEUR = {
  violet: 'Violet', bleu: 'Bleu', vert: 'Vert',
  jaune: 'Jaune', orange: 'Orange', rouge: 'Rouge',
};

// Domaines du spectre visible + UV/IR, bornes en nanomètres (échelle
// linéaire, suffisante à l'échelle du Bac Pro — seules les bornes du
// visible sont des valeurs de référence usuelles)
const DOMAINES_VISIBLE = [
  { id: 'uv', label: 'UV', min: 300, max: 400 },
  { id: 'violet', label: 'Violet', min: 400, max: 450 },
  { id: 'bleu', label: 'Bleu', min: 450, max: 490 },
  { id: 'vert', label: 'Vert', min: 490, max: 560 },
  { id: 'jaune', label: 'Jaune', min: 560, max: 590 },
  { id: 'orange', label: 'Orange', min: 590, max: 620 },
  { id: 'rouge', label: 'Rouge', min: 620, max: 700 },
  { id: 'ir', label: 'IR', min: 700, max: 1000 },
];

const NM_MIN = DOMAINES_VISIBLE[0].min;
const NM_MAX = DOMAINES_VISIBLE[DOMAINES_VISIBLE.length - 1].max;

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {
  initDecompositionRecomposition();
  initEchelleLongueursOnde();
  initIrUvSante();
  initTableauResultats();

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
    titre: 'Spectre de la lumière blanche',
    tp: 'TP02',
  });
}

// =================================================================
// Onglet 1 — Décomposition / recomposition : ordre des couleurs
// =================================================================
function initDecompositionRecomposition() {

  const selectCouleur = $('decomp-couleur');
  const btnAjouter = $('decomp-ajouter');
  const btnVerifier = $('decomp-verifier');
  const liste = $('decomp-liste');
  const resultat = $('decomp-resultat');

  if (!selectCouleur || !btnAjouter || !liste) return;

  const ordreReleve = [];

  function rafraichirListe() {

    liste.textContent = ordreReleve.length
      ? `Ordre relevé : ${ordreReleve.map(c => LABELS_COULEUR[c]).join(' → ')}`
      : 'Ordre relevé : (aucune couleur ajoutée)';
  }

  btnAjouter.addEventListener('click', () => {

    const couleur = selectCouleur.value;
    if (!couleur) return;

    ordreReleve.push(couleur);
    rafraichirListe();

    selectCouleur.value = '';
  });

  if (btnVerifier && resultat) {

    btnVerifier.addEventListener('click', () => {

      resultat.classList.remove('succes', 'erreur');

      if (ordreReleve.length < ORDRE_CORRECT.length) {
        resultat.textContent = `Ajouter les ${ORDRE_CORRECT.length} couleurs avant de vérifier.`;
        return;
      }

      const correct = ORDRE_CORRECT.every((c, i) => ordreReleve[i] === c);

      if (correct) {
        resultat.textContent = '✓ Ordre correct : violet → bleu → vert → jaune → orange → rouge.';
        resultat.classList.add('succes');
      } else {
        resultat.textContent = '✗ Ordre incorrect : revoir le sens de déviation du prisme selon la longueur d\'onde.';
        resultat.classList.add('erreur');
      }
    });
  }
}

// =================================================================
// Onglet 2 — Échelle des longueurs d'onde
// =================================================================
function initEchelleLongueursOnde() {

  const inputNm = $('echelle-longueur-onde-nm');
  const outputDomaine = $('echelle-domaine-out');
  const conteneur = $('frise-visible');

  if (conteneur) dessinerFriseVisible(conteneur);

  if (!inputNm || !outputDomaine) return;

  inputNm.addEventListener('input', () => {

    const nm = parseFloat(inputNm.value);

    if (Number.isNaN(nm)) {
      outputDomaine.textContent = '—';
      positionnerCurseurFrise(null);
      return;
    }

    const domaine = identifierDomaineVisible(nm);
    outputDomaine.textContent = domaine ? domaine.label : 'Hors échelle';
    positionnerCurseurFrise(nm);
  });
}

function identifierDomaineVisible(nm) {
  return DOMAINES_VISIBLE.find(d => nm >= d.min && nm < d.max) || null;
}

function dessinerFriseVisible(conteneur) {

  conteneur.innerHTML = '';

  const barre = document.createElement('div');
  barre.className = 'spectre-em-barre';

  DOMAINES_VISIBLE.forEach(domaine => {

    const largeur = domaine.max - domaine.min;

    const segment = document.createElement('div');
    segment.className = 'spectre-em-segment';
    segment.dataset.domaineVisible = domaine.id;
    segment.style.flexGrow = String(largeur);
    segment.style.background = couleurSegment(domaine.id);
    segment.title = `${domaine.label} (${domaine.min}-${domaine.max} nm)`;
    segment.textContent = domaine.label;

    barre.appendChild(segment);
  });

  const curseur = document.createElement('div');
  curseur.id = 'frise-visible-curseur';
  curseur.className = 'spectre-em-curseur';
  curseur.style.display = 'none';

  conteneur.appendChild(barre);
  conteneur.appendChild(curseur);
}

function couleurSegment(id) {
  const couleurs = {
    uv: '#6a3dbd', violet: '#7b2ff7', bleu: '#2196f3', vert: '#4caf50',
    jaune: '#ffeb3b', orange: '#ff9800', rouge: '#e53935', ir: '#b0473b',
  };
  return couleurs[id] || '#888';
}

function positionnerCurseurFrise(nm) {

  const curseur = $('frise-visible-curseur');
  if (!curseur) return;

  if (nm === null || Number.isNaN(nm)) {
    curseur.style.display = 'none';
    return;
  }

  const pourcentage = Math.min(100, Math.max(0, ((nm - NM_MIN) / (NM_MAX - NM_MIN)) * 100));

  curseur.style.display = 'block';
  curseur.style.left = `${pourcentage}%`;
}

// =================================================================
// Onglet 3 — IR, UV et santé : associations domaine / effet
// =================================================================
function initIrUvSante() {

  const btnAjouter = $('sante-ajouter');
  const selectDomaine = $('sante-domaine');
  const selectEffet = $('sante-effet');
  const tbody = $('tbody-sante-associations');

  if (!btnAjouter || !tbody) return;

  const LABELS_DOMAINE = { uv: 'Ultraviolet (UV)', ir: 'Infrarouge (IR)' };

  btnAjouter.addEventListener('click', () => {

    const domaine = selectDomaine.value;
    const effetLabel = selectEffet.options[selectEffet.selectedIndex]?.textContent || '';

    if (!domaine || !selectEffet.value) return;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${LABELS_DOMAINE[domaine] || domaine}</td>
      <td>${effetLabel}</td>
    `;
    tbody.appendChild(tr);

    selectDomaine.value = '';
    selectEffet.value = '';
  });
}

// =================================================================
// Tableau de résultats — domaine identifié pour UV/IR de référence
// =================================================================
function initTableauResultats() {

  const paires = [
    { input: 'ref-longueur-uv', output: 'domaine-uv-ref' },
    { input: 'ref-longueur-ir', output: 'domaine-ir-ref' },
  ];

  paires.forEach(({ input, output }) => {

    const inputEl = $(input);
    const outputEl = $(output);

    if (!inputEl || !outputEl) return;

    function calculer() {

      const nm = parseFloat(inputEl.value);

      if (Number.isNaN(nm)) {
        outputEl.textContent = '—';
        return;
      }

      const domaine = identifierDomaineVisible(nm);
      outputEl.textContent = domaine ? domaine.label : 'Hors échelle';
    }

    inputEl.addEventListener('input', calculer);
    calculer();
  });
}
