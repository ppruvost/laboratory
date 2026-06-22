/**
 * tp04.js — Réactions d'oxydoréduction
 * Gère : équilibreur de demi-équations, simulateur dosage KMnO₄/Fe²⁺,
 *        dosage H₂O₂, simulateur pile Daniell, calcul Ve, tableau résultats
 */

import { PRODUITS } from '../produits.js';
import { renderBlocSecurite, initSections, initTabs } from '../utils.js';

// ── Couples rédox disponibles ────────────────────────────────
export const COUPLES_REDOX = [
  {
    id: 'mnO4-mn2',
    ox: 'MnO₄⁻', red: 'Mn²⁺',
    demiEqRed: 'MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O',
    neRed: 5,
    E0: 1.51,
    couleurOx: '#6C3483',
    couleurRed: '#D5F5E3',
    nomOx: 'KMnO₄',
    nomRed: 'Mn²⁺',
    cas: '7722-64-7',
  },
  {
    id: 'fe3-fe2',
    ox: 'Fe³⁺', red: 'Fe²⁺',
    demiEqOx: 'Fe²⁺ → Fe³⁺ + e⁻',
    demiEqRed: 'Fe³⁺ + e⁻ → Fe²⁺',
    neOx: 1,
    neRed: 1,
    E0: 0.77,
    couleurOx: '#E67E22',
    couleurRed: '#A9CCE3',
    nomOx: 'Fe³⁺',
    nomRed: 'Fe²⁺',
    cas: '7783-85-9',
  },
  {
    id: 'i2-i',
    ox: 'I₂', red: 'I⁻',
    demiEqOx: '2I⁻ → I₂ + 2e⁻',
    demiEqRed: 'I₂ + 2e⁻ → 2I⁻',
    neOx: 2,
    neRed: 2,
    E0: 0.54,
    couleurOx: '#F39C12',
    couleurRed: '#FDFEFE',
    nomOx: 'I₂',
    nomRed: 'I⁻',
    cas: '7553-56-2',
  },
  {
    id: 'h2o2-h2o',
    ox: 'H₂O₂', red: 'H₂O',
    demiEqOx: 'H₂O₂ → O₂ + 2H⁺ + 2e⁻',
    demiEqRed: 'H₂O₂ + 2H⁺ + 2e⁻ → 2H₂O',
    neOx: 2,
    neRed: 2,
    E0: 1.77,
    couleurOx: '#AED6F1',
    couleurRed: '#D6EAF8',
    nomOx: 'H₂O₂',
    nomRed: 'H₂O',
    cas: '7722-84-1',
  },
  {
    id: 'cu2-cu',
    ox: 'Cu²⁺', red: 'Cu',
    demiEqOx: 'Cu → Cu²⁺ + 2e⁻',
    demiEqRed: 'Cu²⁺ + 2e⁻ → Cu',
    neOx: 2,
    neRed: 2,
    E0: 0.34,
    couleurOx: '#2E86C1',
    couleurRed: '#CA6F1E',
    nomOx: 'Cu²⁺',
    nomRed: 'Cu',
    cas: '7758-98-7',
  },
  {
    id: 'zn2-zn',
    ox: 'Zn²⁺', red: 'Zn',
    demiEqOx: 'Zn → Zn²⁺ + 2e⁻',
    demiEqRed: 'Zn²⁺ + 2e⁻ → Zn',
    neOx: 2,
    neRed: 2,
    E0: -0.76,
    couleurOx: '#EAECEE',
    couleurRed: '#BDC3C7',
    nomOx: 'Zn²⁺',
    nomRed: 'Zn',
    cas: '7446-20-0',
  },
];

export function init() {
  _initSecurite();
  initSections();
  initTabs();
  _initEquilibreur();
  _initSimulateurDosage();
  _initPileDaniell();
  _initTableauResultats();
  _initPotentielRedox();
}

// ── Sécurité ────────────────────────────────────────────────
function _initSecurite() {
  const el = document.getElementById('securite-bloc');
  if (!el) return;

  const CAS = ['7722-64-7', '7783-85-9', '7722-84-1', '7664-93-9', '7446-20-0', '7758-98-7'];
  const produits = CAS.map(c => PRODUITS.find(p => p.cas === c)).filter(Boolean);

  el.innerHTML = renderBlocSecurite(produits);
}

// ════════════════════════════════════════════════════════════
// ÉQUILIBREUR RÉDOX
// ════════════════════════════════════════════════════════════
function _initEquilibreur() {
  const selOx = document.getElementById('sel-couple-ox');
  const selRed = document.getElementById('sel-couple-red');
  const btn = document.getElementById('btn-equilibrer');
  const out = document.getElementById('eq-redox-result');

  if (!selOx || !selRed || !btn || !out) return;

  selOx.innerHTML = COUPLES_REDOX.map(c =>
    `<option value="${c.id}">${c.ox}/${c.red} (E°=${c.E0} V)</option>`
  ).join('');

  selRed.innerHTML = selOx.innerHTML;
  selRed.selectedIndex = 1;

  btn.addEventListener('click', () => {
    const ox = COUPLES_REDOX.find(c => c.id === selOx.value);
    const red = COUPLES_REDOX.find(c => c.id === selRed.value);

    if (!ox || !red || ox.id === red.id) {
      out.innerHTML = '<span style="color:red">Choisir deux couples différents.</span>';
      return;
    }

    const spont = ox.E0 > red.E0;
    const fem = +(ox.E0 - red.E0).toFixed(3);

    const txt = `
      <div>
        <strong>Oxydant :</strong> ${ox.demiEqRed || ''}<br>
        <strong>Réducteur :</strong> ${red.demiEqOx || ''}<br><br>
        <strong>f.é.m :</strong> ${fem} V<br>
        <strong>${spont ? 'Réaction spontanée' : 'Non spontanée'}</strong>
      </div>
    `;

    out.innerHTML = txt;
  });
}

// ════════════════════════════════════════════════════════════
// DOSAGE KMnO4 / Fe2+
// ════════════════════════════════════════════════════════════
function _initSimulateurDosage() {
  const btn = document.getElementById('btn-tracer-dosage');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const va = +document.getElementById('va-dosage')?.value || 20;
    const ca = +document.getElementById('ca-dosage')?.value || 0.1;
    const cb = +document.getElementById('cb-dosage')?.value || 0.02;

    const Ve = (ca * va) / (5 * cb);

    _setText('ve-dosage', Ve.toFixed(2));
    _dessinerDosage(va, ca, cb, Ve);
  });
}

function _dessinerDosage(va, ca, cb, Ve) {
  const canvas = document.getElementById('courbe-dosage');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = 300;

  const vMax = Ve * 1.8;

  ctx.clearRect(0, 0, W, H);
  ctx.beginPath();

  for (let v = 0; v <= vMax; v += Ve / 30) {
    const y = v <= Ve ? 0 : (v - Ve) / Ve;
    const x = (v / vMax) * W;
    const yy = H - y * H;

    ctx.lineTo(x, yy);
  }

  ctx.strokeStyle = 'purple';
  ctx.stroke();
}

// ════════════════════════════════════════════════════════════
// PILE DANIELL
// ════════════════════════════════════════════════════════════
let _interval = null;

function _initPileDaniell() {
  const btn = document.getElementById('btn-start-pile');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (_interval) clearInterval(_interval);

    let t = 0;
    const fem0 = 1.1;

    _interval = setInterval(() => {
      t += 1;
      const fem = +(fem0 * Math.exp(-t / 3000)).toFixed(3);
      _setText('fem-mesure', fem);
      if (fem < 0.01) clearInterval(_interval);
    }, 500);
  });
}

// ════════════════════════════════════════════════════════════
// NERNST
// ════════════════════════════════════════════════════════════
function _initPotentielRedox() {
  const form = document.getElementById('form-nernst');
  if (!form) return;

  form.addEventListener('input', () => {
    const E0 = +document.getElementById('e0-nernst')?.value || 0;
    const n = +document.getElementById('n-nernst')?.value || 1;
    const ox = +document.getElementById('cox-nernst')?.value || 1;
    const red = +document.getElementById('cred-nernst')?.value || 1;

    const E = +(E0 + 0.059 / n * Math.log10(ox / red)).toFixed(4);

    _setText('resultat-nernst', E);
  });
}

// ════════════════════════════════════════════════════════════
// UTIL
// ════════════════════════════════════════════════════════════
function _setText(id, v) {
  const el = document.getElementById(id);
  if (el) el.textContent = v;
}
