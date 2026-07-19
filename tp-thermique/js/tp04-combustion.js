/**
 * tp-thermique/js/tp04-combustion.js
 *
 * Contrôleur du TP04 « Combustion et effet de serre ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-thermique/modules/tp04-combustion.html dans #content.
 *
 * navigation.js exécute module.init() après l'import : le point
 * d'entrée doit s'appeler init().
 */

import { $, arrondir, initCommun } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';

const CONTEXTES_PRO = {

  '1ere-tci': {
    contexte: "En chaudronnerie industrielle, l'oxycoupage et le soudo-brasage reposent sur la combustion contrôlée d'un gaz (acétylène, propane) dans le dioxygène. Une combustion incomplète, en espace mal ventilé, dégage du monoxyde de carbone, dangereux pour l'opérateur.",
    problematique: "Comment la maîtrise de la combustion du gaz de coupe garantit-elle à la fois une découpe efficace et la sécurité de l'atelier de chaudronnerie ?",
  },

  '1ere-trpm': {
    contexte: "Le traitement thermique des pièces mécaniques (trempe, revenu) est souvent réalisé dans un four chauffé par la combustion d'un gaz. L'efficacité de cette combustion conditionne à la fois le coût énergétique du traitement et la quantité de CO₂ rejetée.",
    problematique: "Quelle énergie et quelle masse de CO₂ sont associées à la combustion du gaz alimentant le four de traitement thermique, et comment limiter cet impact ?",
  },

  '1ere-mcc': {
    contexte: "Les presses à repasser industrielles et les centrales vapeur d'un atelier de confection sont souvent alimentées par une chaudière au gaz. La combustion de ce gaz représente une part importante de la consommation énergétique et des émissions de CO₂ de l'atelier.",
    problematique: "Quelle énergie et quelle masse de CO₂ sont associées à la production de vapeur nécessaire au repassage industriel, et comment limiter cet impact environnemental ?",
  },

};

// Données des hydrocarbures étudiés : x et y de CxHy, nom affiché,
// PCI approximatif (MJ/kg)
const HYDROCARBURES = {
  CH4:   { x: 1, y: 4,  nom: 'Méthane',            pci: 50.0 },
  C3H8:  { x: 3, y: 8,  nom: 'Propane',             pci: 46.0 },
  C4H10: { x: 4, y: 10, nom: 'Butane',              pci: 45.7 },
  C8H18: { x: 8, y: 18, nom: 'Octane (essence)',    pci: 44.4 },
};

const M_C = 12;   // g/mol
const M_H = 1;    // g/mol
const M_CO2 = 44; // g/mol

export function init() {
  initEquation();
  initEnergie();
  initMasseCO2();

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  initCommun();
  initRadarCompetences();
}

// =================================================================
// Outils communs
// =================================================================
function pgcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function pgcdListe(nombres) {
  return nombres.reduce((acc, n) => pgcd(acc, n));
}

function formuleAffichee(cle) {
  // CH4 -> CH₄, C3H8 -> C₃H₈, ...
  const indices = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  return cle.replace(/\d/g, d => indices[d]);
}

function coefficientAffiche(n) {
  return n === 1 ? '' : `${n} `;
}

// Renvoie les coefficients entiers [hydrocarbure, O2, CO2, H2O]
// pour x CxHy + ... -> ... (équation équilibrée, réduite au PGCD)
function coefficientsCombustion(x, y) {

  // Multiplication par 4 pour éliminer le dénominateur de x + y/4
  let coeffs = [4, 4 * x + y, 4 * x, 2 * y];

  const diviseur = pgcdListe(coeffs);

  return coeffs.map(c => c / diviseur);
}

function masseMolaire(x, y) {
  return x * M_C + y * M_H;
}

// =================================================================
// Onglet 1 — Équation de combustion équilibrée
// =================================================================
function initEquation() {

  const select = $('comb-hydrocarbure');
  const zone = $('comb-equation');

  if (!select || !zone) return;

  function afficher() {

    const data = HYDROCARBURES[select.value];

    if (!data) {
      zone.innerHTML = '';
      return;
    }

    const [cHc, cO2, cCO2, cH2O] = coefficientsCombustion(data.x, data.y);
    const formule = formuleAffichee(select.value);

    zone.innerHTML = `
      <strong>Équation équilibrée :</strong><br>
      ${coefficientAffiche(cHc)}${formule}
      + ${coefficientAffiche(cO2)}O₂
      → ${coefficientAffiche(cCO2)}CO₂
      + ${coefficientAffiche(cH2O)}H₂O
    `;
  }

  select.addEventListener('change', afficher);

  afficher();
}

// =================================================================
// Onglet 2 — Énergie libérée Q = m × PCI
// =================================================================
function initEnergie() {

  const select = $('energie-hydrocarbure');
  const inputPCI = $('energie-pci');
  const inputMasse = $('energie-masse-hc');
  const outputQ = $('energie-q-liberee');

  if (!select || !inputPCI || !inputMasse || !outputQ) return;

  function calculer() {

    const data = HYDROCARBURES[select.value];

    if (!data) {
      outputQ.textContent = '—';
      return;
    }

    inputPCI.value = data.pci;

    const masseKg = parseFloat(inputMasse.value) / 1000;

    if (Number.isNaN(masseKg)) {
      outputQ.textContent = '—';
      return;
    }

    // Q = m(kg) × PCI(MJ/kg) => résultat en MJ
    const q = masseKg * data.pci;

    outputQ.textContent = `${arrondir(q, 2)} MJ`;
  }

  select.addEventListener('change', calculer);
  inputMasse.addEventListener('input', calculer);

  calculer();
}

// =================================================================
// Onglet 3 — Masse de CO2 dégagée (stœchiométrie)
// masse CO2 = masse hydrocarbure × (x × M_CO2) / M_hydrocarbure
// =================================================================
function initMasseCO2() {

  const select = $('co2-hydrocarbure');
  const inputMasse = $('co2-masse-hc');
  const zoneDetail = $('co2-detail');

  if (!select || !inputMasse || !zoneDetail) return;

  function calculer() {

    const data = HYDROCARBURES[select.value];
    const masse = parseFloat(inputMasse.value);

    if (!data || Number.isNaN(masse)) {
      zoneDetail.textContent = '—';
      return;
    }

    const mMolaireHc = masseMolaire(data.x, data.y);
    const masseCO2 = masse * (data.x * M_CO2) / mMolaireHc;

    zoneDetail.innerHTML = `
      Masse molaire de ${data.nom} : M = ${arrondir(mMolaireHc, 1)} g/mol<br>
      m(CO₂) = m(hydrocarbure) × (${data.x} × M(CO₂)) / M(hydrocarbure)
      = ${masse} × (${data.x} × ${M_CO2}) / ${arrondir(mMolaireHc, 1)}<br>
      <strong>m(CO₂) = ${arrondir(masseCO2, 1)} g</strong>
    `;
  }

  select.addEventListener('change', calculer);
  inputMasse.addEventListener('input', calculer);

  calculer();
}
