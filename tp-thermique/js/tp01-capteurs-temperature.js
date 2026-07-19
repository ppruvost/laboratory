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

import { $, arrondir } from '../../js/utils.js';

// ---------------------------------------------------------------
// Point d'entrée, appelé automatiquement par navigation.js
// ---------------------------------------------------------------
export function init() {
  initEchelles();
  initThermistance();
  initPt100();
  initThermocouple();
  initIRCristaux();
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
