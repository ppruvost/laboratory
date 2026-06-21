/**
 * tp01.js — Solutions et concentrations
 * Gère : dissolution NaCl, dissolution CuSO₄, dilution HCl,
 *        tableau de résultats interactif, calcul d'écart, export
 */

import { PRODUITS } from '../produits.js';
import { renderBlocSecurite, initSections, initTabs } from '../utils.js';

// ── Masses molaires utilisées dans ce TP ─────────────────────
const MM = {
  NaCl:          58.44,
  'CuSO4':      159.61,
  'CuSO4.5H2O': 249.69,
  NaOH:          40.00,
  HCl:           36.46,
  'Na2CO3':     105.99,
  KCl:           74.55,
};

// ══════════════════════════════════════════════════════════════
// INIT PRINCIPALE
// ══════════════════════════════════════════════════════════════
export function init() {
  _initSecurite();
  initSections();
  initTabs();
  _initCalcNaCl();
  _initCalcCuSO4();
  _initCalcDilution();
  _initTableauResultats();
  _initExport();
  _initCalculateurLibre();
}

// ── Sécurité ──────────────────────────────────────────────────
function _initSecurite() {
  const el = document.getElementById('securite-bloc');
  if (!el) return;
  const CAS = ['7647-14-5', '7758-98-7', '7647-01-0', '64-19-7'];
  const produits = CAS.map(c => PRODUITS.find(p => p.cas === c)).filter(Boolean);
  el.innerHTML = renderBlocSecurite(produits);
}

// ══════════════════════════════════════════════════════════════
// BLOC A — Dissolution NaCl
// ══════════════════════════════════════════════════════════════
function _initCalcNaCl() {
  const ids = ['c-nacl', 'v-nacl', 'm-nacl'];
  const el_res   = document.getElementById('res-nacl');
  const el_masse = document.getElementById('masse-nacl');
  if (!el_res) return;

  function calc() {
    const C = parseFloat(document.getElementById('c-nacl')?.value) || 0;
    const V = parseFloat(document.getElementById('v-nacl')?.value) || 0; // mL
    const M = parseFloat(document.getElementById('m-nacl')?.value) || MM.NaCl;
    const masse = +(C * (V / 1000) * M).toFixed(4);
    el_res.textContent = `m = ${masse} g`;
    if (el_masse) el_masse.textContent = `${masse} g`;
    _majEtapeNaCl(masse, V);
  }

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calc);
  });
  calc();
}

function _majEtapeNaCl(masse, vol) {
  const el = document.getElementById('etape-masse-nacl');
  if (el) el.textContent = `${masse} g`;
  const elV = document.getElementById('etape-vol-nacl');
  if (elV) elV.textContent = `${vol} mL`;
}

// ══════════════════════════════════════════════════════════════
// BLOC B — Dissolution CuSO₄ (anhydre vs pentahydraté)
// ══════════════════════════════════════════════════════════════
function _initCalcCuSO4() {
  const ids = ['c-cuso4', 'v-cuso4'];
  const el_anh  = document.getElementById('res-cuso4-anhydre');
  const el_pent = document.getElementById('res-cuso4-penta');
  if (!el_anh && !el_pent) return;

  function calc() {
    const C = parseFloat(document.getElementById('c-cuso4')?.value) || 0.05;
    const V = parseFloat(document.getElementById('v-cuso4')?.value) || 100; // mL
    const mAnh  = +(C * (V / 1000) * MM['CuSO4']).toFixed(4);
    const mPent = +(C * (V / 1000) * MM['CuSO4.5H2O']).toFixed(4);
    if (el_anh)  el_anh.innerHTML  = `m = ${C} × ${V / 1000} × ${MM['CuSO4']} = <strong>${mAnh} g</strong>`;
    if (el_pent) el_pent.innerHTML = `m = ${C} × ${V / 1000} × ${MM['CuSO4.5H2O']} = <strong>${mPent} g</strong>`;
    _majResumeCuSO4(mPent, V);
  }

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calc);
  });
  calc();
}

function _majResumeCuSO4(masse, vol) {
  const el = document.getElementById('resume-cuso4');
  if (!el) return;
  el.innerHTML = `Peser <strong>${masse} g</strong> de CuSO₄·5H₂O pour ${vol} mL.`;
}

// ══════════════════════════════════════════════════════════════
// BLOC C — Dilution (C₁V₁ = C₂V₂)
// ══════════════════════════════════════════════════════════════
function _initCalcDilution() {
  const fields = ['c1-dil', 'v2-dil', 'c2-dil'];
  const el_res = document.getElementById('res-dilution');
  const el_fd  = document.getElementById('facteur-dilution');
  if (!el_res) return;

  function calc() {
    const C1 = parseFloat(document.getElementById('c1-dil')?.value) || 0;
    const V2 = parseFloat(document.getElementById('v2-dil')?.value) || 0; // mL
    const C2 = parseFloat(document.getElementById('c2-dil')?.value) || 0;
    if (!C1 || !V2 || !C2) { el_res.textContent = '—'; return; }
    const V1 = +(C2 * V2 / C1).toFixed(2);
    const fd = +(C1 / C2).toFixed(1);
    el_res.textContent = `V₁ = ${V1} mL`;
    if (el_fd) el_fd.textContent = `Facteur de dilution F = C₁/C₂ = ${fd}`;
    _majResumeDilution(C1, V1, C2, V2);
  }

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calc);
  });
  calc();
}

function _majResumeDilution(C1, V1, C2, V2) {
  const el = document.getElementById('resume-dilution');
  if (!el) return;
  el.innerHTML = `Prélever <strong>${V1} mL</strong> de solution mère (${C1} mol/L) → fiole jaugée ${V2} mL → compléter à l'eau distillée → solution fille à ${C2} mol/L.`;
}

// ══════════════════════════════════════════════════════════════
// TABLEAU DE RÉSULTATS interactif
// ══════════════════════════════════════════════════════════════
const LIGNES_TABLEAU = [
  { id: 'nacl',  label: 'NaCl',        M: MM.NaCl,          Cth: 0.100, V: 250 },
  { id: 'cuso4', label: 'CuSO₄·5H₂O', M: MM['CuSO4.5H2O'], Cth: 0.050, V: 100 },
  { id: 'hcl',   label: 'HCl (dilué)', M: null,             Cth: 0.100, V: 100 },
];

function _initTableauResultats() {
  LIGNES_TABLEAU.forEach(ligne => {
    const inMasse = document.getElementById(`masse-exp-${ligne.id}`);
    const inVol   = document.getElementById(`vol-exp-${ligne.id}`);
    const outC    = document.getElementById(`c-calc-${ligne.id}`);
    const outEcart= document.getElementById(`ecart-${ligne.id}`);

    function recalc() {
      if (!outC) return;
      const m = parseFloat(inMasse?.value);
      const v = parseFloat(inVol?.value) / 1000; // en L
      if (!ligne.M) {
        // Dilution — pas de masse
        outC.textContent = '—';
        if (outEcart) outEcart.textContent = '—';
        return;
      }
      if (isNaN(m) || isNaN(v) || v === 0) { outC.textContent = '—'; return; }
      const Cexp = +(m / (ligne.M * v)).toFixed(4);
      outC.textContent = Cexp;
      if (outEcart) {
        const e = +(Math.abs(Cexp - ligne.Cth) / ligne.Cth * 100).toFixed(1);
        outEcart.textContent = `${e} %`;
        outEcart.style.color = e < 2 ? 'var(--vert-acide)' : e < 5 ? 'var(--ambre-fer)' : 'var(--rouge-ph)';
      }
    }

    if (inMasse) inMasse.addEventListener('input', recalc);
    if (inVol)   inVol.addEventListener('input', recalc);
  });

  // Ligne HCl dilution : calcul C depuis VE
  const inVe  = document.getElementById('ve-hcl-exp');
  const inC1  = document.getElementById('c1-hcl-exp');
  const inVa  = document.getElementById('va-hcl-exp');
  const outC  = document.getElementById('c-calc-hcl');
  const outEc = document.getElementById('ecart-hcl');

  function recalcHCl() {
    if (!inVe || !outC) return;
    const Ve = parseFloat(inVe.value);
    const C1 = parseFloat(inC1?.value) || 1.0;
    const Va = parseFloat(inVa?.value) || 100;
    if (isNaN(Ve) || Ve === 0) { outC.textContent = '—'; return; }
    const Cexp = +(C1 * Ve / Va).toFixed(4);
    outC.textContent = Cexp;
    if (outEc) {
      const e = +(Math.abs(Cexp - 0.1) / 0.1 * 100).toFixed(1);
      outEc.textContent = `${e} %`;
      outEc.style.color = e < 2 ? 'var(--vert-acide)' : e < 5 ? 'var(--ambre-fer)' : 'var(--rouge-ph)';
    }
  }
  [inVe, inC1, inVa].forEach(el => { if (el) el.addEventListener('input', recalcHCl); });
}

// ══════════════════════════════════════════════════════════════
// CALCULATEUR LIBRE — mol/L ↔ g/L ↔ dilution
// ══════════════════════════════════════════════════════════════
function _initCalculateurLibre() {
  const el = document.getElementById('calc-libre');
  if (!el) return;

  el.innerHTML = `
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:var(--gap-sm)">
    <div class="param-ligne"><label>Masse (g) :</label><input type="number" id="cl-masse" step="0.001" min="0" placeholder="—"></div>
    <div class="param-ligne"><label>Volume (mL) :</label><input type="number" id="cl-vol" step="1" min="0" placeholder="—"></div>
    <div class="param-ligne"><label>M (g/mol) :</label>
      <select id="cl-mm">
        ${Object.entries(MM).map(([k,v]) => `<option value="${v}">${k} — ${v}</option>`).join('')}
        <option value="custom">Autre</option>
      </select>
    </div>
    <div class="param-ligne"><label>M personnalisé :</label><input type="number" id="cl-mm-custom" step="0.01" placeholder="g/mol"></div>
  </div>
  <div id="cl-resultats" style="margin-top:var(--gap-sm)"></div>`;

  function calcLibre() {
    const m   = parseFloat(document.getElementById('cl-masse')?.value);
    const v   = parseFloat(document.getElementById('cl-vol')?.value) / 1000;
    const sel = document.getElementById('cl-mm')?.value;
    const M   = sel === 'custom'
      ? parseFloat(document.getElementById('cl-mm-custom')?.value)
      : parseFloat(sel);

    const out = document.getElementById('cl-resultats');
    if (!out) return;
    if (isNaN(m) || isNaN(v) || isNaN(M) || v === 0 || M === 0) {
      out.innerHTML = '<span style="color:var(--gris-moyen)">Renseigner masse, volume et masse molaire.</span>';
      return;
    }
    const n    = +(m / M).toFixed(6);
    const Cmol = +(n / v).toFixed(4);
    const Cg   = +(m / v / 1000).toFixed(4); // g/L

    out.innerHTML = `
    <div class="formule-bloc">
      n = m/M = ${m}/${M} = <strong>${n} mol</strong><br>
      C = n/V = ${n}/${v.toFixed(4)} = <strong>${Cmol} mol/L</strong><br>
      Cm = m/V = ${m}/${(v*1000).toFixed(0)} mL = <strong>${(m/v/1000*1000).toFixed(2)} g/L</strong>
    </div>`;
  }

  el.querySelectorAll('input, select').forEach(inp => inp.addEventListener('input', calcLibre));
}

// ══════════════════════════════════════════════════════════════
// EXPORT CSV du tableau de résultats
// ══════════════════════════════════════════════════════════════
function _initExport() {
  const btn = document.getElementById('btn-export-csv');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const lignes = [
      ['Préparation', 'Masse (g)', 'Volume (mL)', 'C exp (mol/L)', 'C théo (mol/L)', 'Écart (%)'],
    ];
    LIGNES_TABLEAU.forEach(l => {
      const m  = document.getElementById(`masse-exp-${l.id}`)?.value || '';
      const v  = document.getElementById(`vol-exp-${l.id}`)?.value  || '';
      const c  = document.getElementById(`c-calc-${l.id}`)?.textContent || '';
      const ec = document.getElementById(`ecart-${l.id}`)?.textContent  || '';
      lignes.push([l.label, m, v, c, l.Cth, ec]);
    });

    const csv = lignes.map(r => r.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'tp01-resultats.csv' });
    a.click();
    URL.revokeObjectURL(url);
  });
}
