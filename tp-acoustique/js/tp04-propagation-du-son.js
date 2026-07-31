/**
 * tp-acoustique/js/tp04-propagation-du-son.js
 *
 * Contrôleur du TP04 « Propagation du son ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-acoustique/modules/tp04-propagation-du-son.html dans #content.
 *
 * Convention SciLab :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - navigation.js exécute module.init() après l'import : le point
 *    d'entrée DOIT donc s'appeler init(), pas initTP04()
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-acoustique.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { initExaoAcquisition } from './exao01.js';

// Contexte professionnel par filière (clé "niveau-idFiliere")
const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, le contrôle non destructif par ultrasons exploite la propagation du son dans les métaux pour détecter des défauts internes, invisibles à l'œil nu.",
    problematique: "Comment déterminer expérimentalement la vitesse de propagation du son dans un milieu donné, et pourquoi cette vitesse varie-t-elle d'un milieu à l'autre ?",
  },

  '2nde-mcc': {
    contexte: "En Métiers de la couture et de la confection, certains capteurs de proximité utilisés sur les lignes de production reposent sur la mesure du temps de propagation d'une onde sonore réfléchie.",
    problematique: "Comment un capteur peut-il déterminer une distance à partir de la vitesse de propagation du son, et cette méthode fonctionne-t-elle dans tous les milieux ?",
  },

};

// Vitesses de référence usuelles (ordres de grandeur, en m/s)
const VITESSE_REFERENCE = {
  air: 340,
  eau: 1500,
};

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {
  initMilieuMateriel();
  initVitessePropagation();
  initLongueurOnde();
  initTableauEcarts();
  initExaoAcquisition();

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
    titre: 'Propagation du son',
    tp: 'TP04',
  });
}

// =================================================================
// Onglet 1 — Nécessité d'un milieu matériel (cloche à vide)
// Conclusion générée à partir des deux observations qualitatives
// =================================================================
function initMilieuMateriel() {

  const selectNormal = $('son-air-normal');
  const selectVide = $('son-vide-partiel');
  const conclusion = $('milieu-materiel-conclusion');

  if (!selectNormal || !selectVide || !conclusion) return;

  function mettreAJour() {

    const normal = selectNormal.value;
    const vide = selectVide.value;

    if (!normal || !vide) {
      conclusion.textContent = 'Compléter les deux observations ci-dessus pour afficher la conclusion.';
      return;
    }

    if (vide === 'non' || vide === 'attenue') {
      conclusion.textContent = 'Conclusion : le son est perçu normalement à pression atmosphérique mais s\'atténue voire disparaît lorsque l\'air est extrait. La propagation du son nécessite donc un milieu matériel.';
    } else {
      conclusion.textContent = 'Résultat inattendu : si le son reste perçu à l\'identique sous vide partiel, vérifier l\'étanchéité de la cloche ou refaire l\'essai.';
    }
  }

  selectNormal.addEventListener('change', mettreAJour);
  selectVide.addEventListener('change', mettreAJour);
}

// =================================================================
// Onglet 2 — Vitesse de propagation par méthode du retard
// v = d / Δt, comparaison à la valeur de référence du milieu choisi
// =================================================================
function initVitessePropagation() {

  const selectMilieu = $('propagation-milieu');
  const inputDistance = $('propagation-distance');
  const inputRetard = $('propagation-retard');
  const outputVitesse = $('propagation-vitesse');
  const comparaison = $('propagation-comparaison');

  if (!selectMilieu || !inputDistance || !inputRetard || !outputVitesse) return;

  function calculer() {

    const distance = parseFloat(inputDistance.value);
    const retardMs = parseFloat(inputRetard.value);

    if (Number.isNaN(distance) || Number.isNaN(retardMs) || retardMs <= 0) {
      outputVitesse.textContent = '—';
      if (comparaison) comparaison.textContent = '—';
      return;
    }

    const retardS = retardMs / 1000;
    const vitesse = distance / retardS;

    outputVitesse.textContent = `${arrondir(vitesse, 0)} m/s`;

    if (comparaison) {
      const reference = VITESSE_REFERENCE[selectMilieu.value] ?? VITESSE_REFERENCE.air;
      const ecartPourcent = ((vitesse - reference) / reference) * 100;
      comparaison.textContent = `Valeur de référence dans ${selectMilieu.value === 'eau' ? "l'eau" : "l'air"} : ${reference} m/s (écart de ${arrondir(ecartPourcent, 1)} %).`;
    }
  }

  selectMilieu.addEventListener('change', calculer);
  inputDistance.addEventListener('input', calculer);
  inputRetard.addEventListener('input', calculer);
}

// =================================================================
// Onglet 3 — Longueur d'onde : λ = v / f
// =================================================================
function initLongueurOnde() {

  const inputVitesse = $('onde-vitesse');
  const inputFrequence = $('onde-frequence');
  const outputLongueur = $('onde-longueur');

  if (!inputVitesse || !inputFrequence || !outputLongueur) return;

  function calculer() {

    const vitesse = parseFloat(inputVitesse.value);
    const frequence = parseFloat(inputFrequence.value);

    if (Number.isNaN(vitesse) || Number.isNaN(frequence) || frequence <= 0) {
      outputLongueur.textContent = '—';
      return;
    }

    const longueurOnde = vitesse / frequence;
    outputLongueur.textContent = `${arrondir(longueurOnde, 3)} m`;
  }

  inputVitesse.addEventListener('input', calculer);
  inputFrequence.addEventListener('input', calculer);
}

// =================================================================
// Tableau de résultats — écarts vitesse air / eau
// =================================================================
const MILIEUX_TABLEAU = ['air', 'eau'];

function initTableauEcarts() {

  MILIEUX_TABLEAU.forEach(milieu => {

    const inputRef = $(`ref-vitesse-${milieu}`);
    const inputMesuree = $(`mesuree-vitesse-${milieu}`);
    const outputEcart = $(`ecart-vitesse-${milieu}`);

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

      outputEcart.textContent = `${signe}${arrondir(ecart, 0)} m/s`;
    }

    inputRef.addEventListener('input', calculer);
    inputMesuree.addEventListener('input', calculer);
  });
}
