/**
 * tp-thermique/js/tp01-capteurs-temperature.js
 *
 * Contrôleur du TP01 « Mesurer et caractériser une température ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-thermique/modules/tp01-capteurs-temperature.html dans #content.
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
import { initImpressionCompteRendu } from './compte-rendu-thermique.js';
import { initMateriel } from './materiel-thermique.js';
import { dessinerGraphiqueLigne } from '../../js/graphique.js';

// Contexte professionnel par filière (clé "niveau-idFiliere")
const CONTEXTES_PRO = {

  '2nde-remi': {
    contexte: "En Réalisation d'Ensembles Mécaniques et Industriels, vous devez régulièrement contrôler la température d'une pièce avant assemblage (dilatation, retrait), surveiller le refroidissement d'un bain de trempe ou vérifier qu'un moteur ne surchauffe pas, à l'aide de capteurs adaptés à chaque situation (contact, sans contact, plage de température).",
    problematique: "Quel capteur de température choisir, en fonction de la situation, pour contrôler une pièce mécanique avec la précision et la sécurité requises ?",
  },

  '2nde-mcc': {
    contexte: "En Métiers de la couture et de la confection, la température des fers à repasser et des presses à thermocollage doit être précisément contrôlée : trop faible, la colle thermofusible n'adhère pas ; trop élevée, elle brûle ou déforme le tissu.",
    problematique: "Comment choisir et utiliser un capteur de température adapté au réglage d'une presse à thermocollage, sans détériorer le tissu ?",
  },

};

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {
  initEchelles();
  initThermistance();
  initPt100();
  initThermocouple();
  initIRCristaux();
  initTableauEcarts();

  initMateriel({
    verrerie: ['Bécher', 'Pissette'],
    equipements: [
      'Thermomètre numérique',
      'Thermistance',
      'Sonde à résistance de platine (Pt100)',
      'Thermocouple',
      'Thermomètre à infrarouge',
      'Bandelette à cristaux liquides',
      'Multimètre',
      'Voltmètre',
      'Bain thermostaté',
      'Support et pince pour capteurs',
    ],
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
    titre: 'Mesurer et caractériser une température',
    tp: 'TP01',
  });
}

// =================================================================
// Onglet 1 — Échelles Celsius / Kelvin
// Conversion bidirectionnelle en direct
// =================================================================
function initEchelles() {

  const inputC = $('temp-celsius');
  const inputK = $('temp-kelvin');

  if (!inputC || !inputK) return;

  const ZERO_ABSOLU = 273.15;

  let source = null; // évite la boucle de mise à jour croisée

  inputC.addEventListener('input', () => {
    if (source === 'kelvin') return;
    source = 'celsius';

    const c = parseFloat(inputC.value);

    if (Number.isNaN(c)) {
      inputK.value = '';
      inputC.classList.remove('champ-erreur');
    } else {
      inputK.value = arrondir(c + ZERO_ABSOLU, 2);
      inputC.classList.toggle('champ-erreur', c < -ZERO_ABSOLU);
    }

    source = null;
  });

  inputK.addEventListener('input', () => {
    if (source === 'celsius') return;
    source = 'kelvin';

    const k = parseFloat(inputK.value);

    if (Number.isNaN(k)) {
      inputC.value = '';
      inputK.classList.remove('champ-erreur');
    } else {
      inputC.value = arrondir(k - ZERO_ABSOLU, 2);
      inputK.classList.toggle('champ-erreur', k < 0);
    }

    source = null;
  });
}

// =================================================================
// Onglet 2 — Thermistance
// Relevé de points (température, résistance) saisis par l'élève,
// affichés dans un tableau cumulatif (pas de loi imposée : la
// thermistance n'est pas linéaire, on se limite au relevé expérimental)
// =================================================================
function initThermistance() {

  const btnAjouter = $('thermistance-ajouter');
  const inputTemp = $('thermistance-temp');
  const inputRes = $('thermistance-resistance');
  const tbody = $('tbody-thermistance');

  if (!btnAjouter || !tbody) return;

  const points = [];

  btnAjouter.addEventListener('click', () => {

    const t = parseFloat(inputTemp.value);
    const r = parseFloat(inputRes.value);

    if (Number.isNaN(t) || Number.isNaN(r)) return;

    points.push({ t, r });
    points.sort((a, b) => a.t - b.t);

    redessinerTableauThermistance(tbody, points);

    dessinerGraphiqueLigne(
      'graphique-thermistance',
      points.map(p => ({ x: p.t, y: p.r })),
      { xLabel: 'Température (°C)', yLabel: 'Résistance (Ω)' }
    );

    inputTemp.value = '';
    inputRes.value = '';
    inputTemp.focus();
  });
}

function redessinerTableauThermistance(tbody, points) {

  tbody.innerHTML = '';

  points.forEach((pt, i) => {

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${arrondir(pt.t, 1)} °C</td>
      <td>${arrondir(pt.r, 0)} Ω</td>
    `;

    tbody.appendChild(tr);
  });
}

// =================================================================
// Onglet 3 — Sonde à résistance de platine (Pt100)
// Loi linéaire : R(T) = R0 × (1 + α × T)
// =================================================================
function initPt100() {

  const inputR0 = $('pt100-r0');
  const inputAlpha = $('pt100-alpha');
  const inputRMesuree = $('pt100-r-mesuree');
  const outputTemp = $('pt100-temp-calculee');

  if (!inputR0 || !inputAlpha || !inputRMesuree || !outputTemp) return;

  // Valeurs usuelles d'une Pt100 par défaut
  if (!inputR0.value) inputR0.value = 100;
  if (!inputAlpha.value) inputAlpha.value = 0.00385;

  function calculer() {

    const r0 = parseFloat(inputR0.value);
    const alpha = parseFloat(inputAlpha.value);
    const rMesuree = parseFloat(inputRMesuree.value);

    if (Number.isNaN(r0) || Number.isNaN(alpha) || Number.isNaN(rMesuree) || r0 === 0) {
      outputTemp.textContent = '—';
      return;
    }

    // R = R0(1 + αT)  =>  T = (R/R0 - 1) / α
    const temperature = (rMesuree / r0 - 1) / alpha;

    outputTemp.textContent = `${arrondir(temperature, 1)} °C`;
  }

  [inputR0, inputAlpha, inputRMesuree].forEach(el =>
    el.addEventListener('input', calculer)
  );

  calculer();
}

// =================================================================
// Onglet 4 — Thermocouple
// Approximation linéaire par type (coefficient de Seebeck moyen,
// suffisant au niveau Bac Pro ; pas de table de référence complète)
// =================================================================
const COEFFICIENTS_THERMOCOUPLE = {
  K: 0.041,  // mV / °C, chromel-alumel
  J: 0.052,  // mV / °C, fer-constantan
  T: 0.043,  // mV / °C, cuivre-constantan
};

function initThermocouple() {

  const selectType = $('tc-type');
  const inputTension = $('tc-tension');
  const outputTemp = $('tc-temp-calculee');

  if (!selectType || !inputTension || !outputTemp) return;

  function calculer() {

    const coeff = COEFFICIENTS_THERMOCOUPLE[selectType.value];
    const tension = parseFloat(inputTension.value);

    if (!coeff || Number.isNaN(tension)) {
      outputTemp.textContent = '—';
      return;
    }

    // Température ambiante de référence (soudure froide) prise à 20°C
    const TEMP_REFERENCE = 20;
    const temperature = TEMP_REFERENCE + tension / coeff;

    outputTemp.textContent = `${arrondir(temperature, 1)} °C`;
  }

  selectType.addEventListener('change', calculer);
  inputTension.addEventListener('input', calculer);

  calculer();
}

// =================================================================
// Onglet 5 — Thermomètre IR / cristaux liquides
// Comparaison qualitative : mesure sans contact (IR) vs mesure de
// référence par contact, calcul de l'écart
// =================================================================
function initIRCristaux() {

  const inputIR = $('ir-mesure');
  const inputContact = $('contact-mesure');
  const outputEcart = $('ecart-ir-contact');

  if (!inputIR || !inputContact || !outputEcart) return;

  function calculer() {

    const tIR = parseFloat(inputIR.value);
    const tContact = parseFloat(inputContact.value);

    if (Number.isNaN(tIR) || Number.isNaN(tContact)) {
      outputEcart.textContent = '—';
      return;
    }

    const ecart = tIR - tContact;
    const signe = ecart >= 0 ? '+' : '';

    outputEcart.textContent = `${signe}${arrondir(ecart, 1)} °C`;
  }

  inputIR.addEventListener('input', calculer);
  inputContact.addEventListener('input', calculer);
}

// =================================================================
// Tableau de résultats — calcul automatique de l'écart
// (référence vs mesurée) pour les 4 capteurs comparés
// =================================================================
const CAPTEURS_TABLEAU = ['thermistance', 'pt100', 'thermocouple', 'infrarouge'];

function initTableauEcarts() {

  CAPTEURS_TABLEAU.forEach(capteur => {

    const inputRef = $(`ref-${capteur}`);
    const inputMesuree = $(`mesuree-${capteur}`);
    const outputEcart = $(`ecart-${capteur}`);

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

      outputEcart.textContent = `${signe}${arrondir(ecart, 2)} °C`;
    }

    inputRef.addEventListener('input', calculer);
    inputMesuree.addEventListener('input', calculer);
  });
}
