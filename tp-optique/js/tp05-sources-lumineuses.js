/**
 * tp-optique/js/tp05-sources-lumineuses.js
 *
 * Contrôleur du TP05 « Sources lumineuses ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-optique/modules/tp05-sources-lumineuses.html dans #content.
 *
 * Convention SciLab :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP05()
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
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, l'éclairage des postes de travail doit être suffisant et durable ; le choix des lampes de l'atelier a un impact direct sur la facture énergétique.",
    problematique: "Comment comparer l'efficacité énergétique de deux sources lumineuses pour choisir l'éclairage d'un poste de travail ?",
  },

  '1ere-mcc': {
    contexte: "En Métiers de la couture et de la confection, un bon éclairage du poste de couture (température de couleur adaptée, efficacité énergétique) facilite le travail de précision et limite la consommation électrique de l'atelier.",
    problematique: "Comment choisir, à partir des indicateurs d'emballage, la lampe la mieux adaptée à l'éclairage d'un poste de couture ?",
  },

};

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {
  initSpectresEmission();
  initEfficaciteEnergetique();
  initProprietesLaser();
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
    titre: 'Sources lumineuses',
    tp: 'TP05',
  });
}

// =================================================================
// Onglet 1 — Associer une source à son spectre d'émission
// =================================================================
function initSpectresEmission() {

  const btnAjouter = $('spectre-ajouter');
  const selectSource = $('spectre-source');
  const selectType = $('spectre-type');
  const tbody = $('tbody-spectres-emission');

  if (!btnAjouter || !tbody) return;

  const LABELS_SOURCE = { soleil: 'Soleil', del: 'Lampe à DEL', incandescence: 'Lampe à incandescence', laser: 'Laser' };
  const LABELS_TYPE = {
    'continu-large': 'Continu, sur tout le domaine visible',
    'continu-chaud': 'Continu, plus intense dans le rouge/IR',
    'bandes': 'Composé de quelques bandes colorées',
    'raie': 'Une seule raie très fine (monochromatique)',
  };

  btnAjouter.addEventListener('click', () => {

    const source = selectSource.value;
    const type = selectType.value;

    if (!source || !type) return;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${LABELS_SOURCE[source] || source}</td>
      <td>${LABELS_TYPE[type] || type}</td>
    `;
    tbody.appendChild(tr);

    selectSource.value = '';
    selectType.value = '';
  });
}

// =================================================================
// Onglet 2 — Efficacité énergétique de deux lampes
// =================================================================
function initEfficaciteEnergetique() {

  const inputPA = $('lampe-a-puissance');
  const inputFA = $('lampe-a-flux');
  const outputEffA = $('lampe-a-efficacite');

  const inputPB = $('lampe-b-puissance');
  const inputFB = $('lampe-b-flux');
  const outputEffB = $('lampe-b-efficacite');

  const comparaison = $('efficacite-comparaison');

  if (!inputPA || !inputFA || !outputEffA || !inputPB || !inputFB || !outputEffB) return;

  function efficacite(puissance, flux) {

    const p = parseFloat(puissance);
    const f = parseFloat(flux);

    if (Number.isNaN(p) || Number.isNaN(f) || p <= 0) return null;

    return f / p;
  }

  function calculer() {

    const effA = efficacite(inputPA.value, inputFA.value);
    const effB = efficacite(inputPB.value, inputFB.value);

    outputEffA.textContent = effA === null ? '—' : `${arrondir(effA, 1)} lm/W`;
    outputEffB.textContent = effB === null ? '—' : `${arrondir(effB, 1)} lm/W`;

    if (comparaison) {

      if (effA === null || effB === null) {
        comparaison.textContent = 'Compléter les puissances et flux lumineux des deux lampes pour afficher la comparaison.';
        return;
      }

      const meilleure = effA >= effB ? 'A' : 'B';
      const rapport = effA >= effB ? effA / effB : effB / effA;

      comparaison.textContent = `La lampe ${meilleure} est la plus efficace, avec une efficacité énergétique environ ${arrondir(rapport, 1)} fois supérieure à l'autre lampe.`;
    }
  }

  [inputPA, inputFA, inputPB, inputFB].forEach(el => el.addEventListener('input', calculer));
}

// =================================================================
// Onglet 3 — Propriétés du laser : divergence du faisceau
// =================================================================
function initProprietesLaser() {

  const inputProche = $('laser-diametre-proche');
  const inputLoin = $('laser-diametre-loin');
  const output = $('laser-conclusion-out');

  if (!inputProche || !inputLoin || !output) return;

  function calculer() {

    const proche = parseFloat(inputProche.value);
    const loin = parseFloat(inputLoin.value);

    if (Number.isNaN(proche) || Number.isNaN(loin) || proche <= 0) {
      output.textContent = '—';
      return;
    }

    const variation = ((loin - proche) / proche) * 100;

    if (Math.abs(variation) < 20) {
      output.textContent = `Variation d'environ ${arrondir(variation, 0)} % : faisceau peu divergent, caractéristique du laser.`;
    } else {
      output.textContent = `Variation d'environ ${arrondir(variation, 0)} % : divergence significative, vérifier le montage.`;
    }
  }

  inputProche.addEventListener('input', calculer);
  inputLoin.addEventListener('input', calculer);
}

// =================================================================
// Tableau de résultats — écart efficacité énergétique lampe LED
// =================================================================
function initTableauEcarts() {

  const inputRef = $('ref-efficacite-led');
  const inputMesuree = $('mesuree-efficacite-led');
  const outputEcart = $('ecart-efficacite-led');

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

    outputEcart.textContent = `${signe}${arrondir(ecart, 1)} lm/W`;
  }

  inputRef.addEventListener('input', calculer);
  inputMesuree.addEventListener('input', calculer);
}
