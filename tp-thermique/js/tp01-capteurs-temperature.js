/**
 * tp-thermique/js/tp01-capteurs-temperature.js
 *
 * Contrôleur du TP01 « Mesurer et caractériser une température ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-thermique/modules/tp01-capteurs-temperature.html dans #content.
 *
 * Convention SciLab :
 *  - le fragment HTML est la référence fixe, ce fichier s'adapte à lui
 *  - aucune donnée en dur qui devrait vivre dans /data/ (aucune ici)
 *  - le radar de compétences (#btn-radar) et l'impression (#btn-imprimer)
 *    sont gérés par les modules mutualisés radar.js / compte-rendu.js,
 *    on ne les ré-implémente pas ici
 */

import { formatNombre } from '../../js/utils.js';

// ---------------------------------------------------------------
// Point d'entrée, appelé par navigation.js après le chargement du
// fragment (cf. le pattern initTP03() déjà en place côté chimie)
// ---------------------------------------------------------------
export function initTP01() {
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

  const inputC = document.getElementById('temp-celsius');
  const inputK = document.getElementById('temp-kelvin');

  if (!inputC || !inputK) return;

  const ZERO_ABSOLU = 273.15;

  let source = null; // évite la boucle de mise à jour croisée

  inputC.addEventListener('input', () => {
    if (source === 'kelvin') return;
    source = 'celsius';

    const c = parseFloat(inputC.value);

    if (Number.isNaN(c)) {
      inputK.value = '';
    } else {
      inputK.value = formatNombre(c + ZERO_ABSOLU, 2);

      if (c < -ZERO_ABSOLU) {
        inputC.classList.add('champ-erreur');
      } else {
        inputC.classList.remove('champ-erreur');
      }
    }

    source = null;
  });

  inputK.addEventListener('input', () => {
    if (source === 'celsius') return;
    source = 'kelvin';

    const k = parseFloat(inputK.value);

    if (Number.isNaN(k)) {
      inputC.value = '';
    } else {
      inputC.value = formatNombre(k - ZERO_ABSOLU, 2);

      if (k < 0) {
        inputK.classList.add('champ-erreur');
      } else {
        inputK.classList.remove('champ-erreur');
      }
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

  const btnAjouter = document.getElementById('thermistance-ajouter');
  const inputTemp = document.getElementById('thermistance-temp');
  const inputRes = document.getElementById('thermistance-resistance');
  const tbody = document.getElementById('tbody-thermistance');

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
      <td>${formatNombre(pt.t, 1)} °C</td>
      <td>${formatNombre(pt.r, 0)} Ω</td>
    `;

    tbody.appendChild(tr);
  });
}

// =================================================================
// Onglet 3 — Sonde à résistance de platine (Pt100)
// Loi linéaire : R(T) = R0 × (1 + α × T)
// =================================================================
function initPt100() {

  const inputR0 = document.getElementById('pt100-r0');
  const inputAlpha = document.getElementById('pt100-alpha');
  const inputRMesuree = document.getElementById('pt100-r-mesuree');
  const outputTemp = document.getElementById('pt100-temp-calculee');

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

    outputTemp.textContent = `${formatNombre(temperature, 1)} °C`;
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

  const selectType = document.getElementById('tc-type');
  const inputTension = document.getElementById('tc-tension');
  const outputTemp = document.getElementById('tc-temp-calculee');

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

    outputTemp.textContent = `${formatNombre(temperature, 1)} °C`;
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

  const inputIR = document.getElementById('ir-mesure');
  const inputContact = document.getElementById('contact-mesure');
  const outputEcart = document.getElementById('ecart-ir-contact');

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

    outputEcart.textContent = `${signe}${formatNombre(ecart, 1)} °C`;
  }

  inputIR.addEventListener('input', calculer);
  inputContact.addEventListener('input', calculer);
}
