/**
 * tp04.js — Réactions d'oxydoréduction
 * Gère : équilibreur de demi-équations, simulateur dosage KMnO₄/Fe²⁺,
 *        dosage H₂O₂, simulateur pile Daniell, calcul Ve, tableau résultats
 */

import { PRODUITS } from '../produits.js';
import { renderBlocSecurite, initSections, initTabs } from '../utils.js';

// ── Couples rédox disponibles en salle B27 ───────────────────
export const COUPLES_REDOX = [
  {
    id: 'mnO4-mn2',
    ox: 'MnO₄⁻', red: 'Mn²⁺',
    demiEqOx: null,
    demiEqRed: 'MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O',
    neRed: 5, neOx: null,
    E0: +1.51,
    couleurOx: '#6C3483',   // violet KMnO₄
    couleurRed: '#D5F5E3',  // quasi-incolore Mn²⁺
    nomOx: 'KMnO₄ (violet)',
    nomRed: 'Mn²⁺ (quasi-incolore)',
    produit: 'KMnO₄', cas: '7722-64-7',
  },
  {
    id: 'fe3-fe2',
    ox: 'Fe³⁺', red: 'Fe²⁺',
    demiEqOx: 'Fe²⁺ → Fe³⁺ + 1e⁻',
    demiEqRed: 'Fe³⁺ + 1e⁻ → Fe²⁺',
    neOx: 1, neRed: 1,
    E0: +0.77,
    couleurOx: '#E67E22',
    couleurRed: '#A9CCE3',
    nomOx: 'Fe³⁺ (jaune-brun)', nomRed: 'Fe²⁺ (vert pâle)',
    produit: 'Sel de Mohr', cas: '7783-85-9',
  },
  {
    id: 'i2-i',
    ox: 'I₂', red: 'I⁻',
    demiEqOx: '2I⁻ → I₂ + 2e⁻',
    demiEqRed: 'I₂ + 2e⁻ → 2I⁻',
    neOx: 2, neRed: 2,
    E0: +0.54,
    couleurOx: '#F39C12',
    couleurRed: '#FDFEFE',
    nomOx: 'I₂ (brun-orange)', nomRed: 'I⁻ (incolore)',
    produit: 'Iode', cas: '7553-56-2',
  },
  {
    id: 'h2o2-h2o',
    ox: 'H₂O₂', red: 'H₂O',
    demiEqOx: 'H₂O₂ → O₂ + 2H⁺ + 2e⁻',
    demiEqRed: 'H₂O₂ + 2H⁺ + 2e⁻ → 2H₂O',
    neOx: 2, neRed: 2,
    E0: +1.77,
    couleurOx: '#AED6F1',
    couleurRed: '#D6EAF8',
    nomOx: 'H₂O₂', nomRed: 'H₂O',
    produit: 'Eau oxygénée', cas: '7722-84-1',
  },
  {
    id: 'cu2-cu',
    ox: 'Cu²⁺', red: 'Cu',
    demiEqOx: 'Cu → Cu²⁺ + 2e⁻',
    demiEqRed: 'Cu²⁺ + 2e⁻ → Cu',
    neOx: 2, neRed: 2,
    E0: +0.34,
    couleurOx: '#2E86C1',
    couleurRed: '#CA6F1E',
    nomOx: 'Cu²⁺ (bleu)', nomRed: 'Cu (rouge cuivré)',
    produit: 'CuSO₄', cas: '7758-98-7',
  },
  {
    id: 'zn2-zn',
    ox: 'Zn²⁺', red: 'Zn',
    demiEqOx: 'Zn → Zn²⁺ + 2e⁻',
    demiEqRed: 'Zn²⁺ + 2e⁻ → Zn',
    neOx: 2, neRed: 2,
    E0: -0.76,
    couleurOx: '#EAECEE',
    couleurRed: '#BDC3C7',
    nomOx: 'Zn²⁺ (incolore)', nomRed: 'Zn (métal gris)',
    produit: 'ZnSO₄', cas: '7446-20-0',
  },
];

// ══════════════════════════════════════════════════════════════
// INIT PRINCIPALE
// ══════════════════════════════════════════════════════════════
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

// ── Sécurité ──────────────────────────────────────────────────
function _initSecurite() {
  const el = document.getElementById('securite-bloc');
  if (!el) return;
  const CAS = ['7722-64-7', '7783-85-9', '7722-84-1', '7664-93-9', '7446-20-0', '7758-98-7'];
  const produits = CAS.map(c => PRODUITS.find(p => p.cas === c)).filter(Boolean);
  el.innerHTML = renderBlocSecurite(produits);
}

// ══════════════════════════════════════════════════════════════
// ÉQUILIBREUR DE RÉACTIONS RÉDOX
// ══════════════════════════════════════════════════════════════
function _initEquilibreur() {
  const selOx  = document.getElementById('sel-couple-ox');
  const selRed = document.getElementById('sel-couple-red');
  const btn    = document.getElementById('btn-equilibrer');
  const out    = document.getElementById('eq-redox-result');
  if (!selOx || !selRed || !btn || !out) return;

  // Peupler les selects
  [selOx, selRed].forEach(sel => {
    sel.innerHTML = COUPLES_REDOX.map(c =>
      `<option value="${c.id}">${c.ox}/${c.red} (E° = ${c.E0} V)</option>`
    ).join('');
  });
  selRed.selectedIndex = 1; // défaut : Fe³⁺/Fe²⁺

  btn.addEventListener('click', () => {
    const cOx  = COUPLES_REDOX.find(c => c.id === selOx.value);  // sera réduit (oxydant)
    const cRed = COUPLES_REDOX.find(c => c.id === selRed.value); // sera oxydé (réducteur)
    if (!cOx || !cRed || cOx.id === cRed.id) {
      out.innerHTML = '<span style="color:var(--rouge-ph)">Choisir deux couples différents.</span>';
      return;
    }

    // Vérification spontanéité : E°(ox) > E°(red) → spontané
    const spontane = cOx.E0 > cRed.E0;
    const fem      = +(cOx.E0 - cRed.E0).toFixed(3);
    const neOx     = cOx.neRed;   // e⁻ dans la demi-éq réduction
    const neRed    = cRed.neOx || cRed.neRed; // e⁻ dans la demi-éq oxydation
    const ppcm     = _ppcm(neOx, neRed);
    const coeffOx  = ppcm / neOx;
    const coeffRed = ppcm / neRed;

    out.innerHTML = `
    <div class="bilan-redox">
      <div class="demi-eq-reduction">
        <div class="label-type">Réduction (oxydant → gagne e⁻)</div>
        <code>${coeffOx > 1 ? coeffOx + ' × ' : ''}${cOx.demiEqRed || `${cOx.ox} + ne⁻ → ${cOx.red}`}</code>
        <div style="font-size:.78rem;margin-top:.3rem;opacity:.7">${cOx.nomOx} → ${cOx.nomRed}</div>
      </div>
      <div class="separateur">+ (×${coeffRed})</div>
      <div class="demi-eq-oxydation">
        <div class="label-type">Oxydation (réducteur → perd e⁻)</div>
        <code>${coeffRed > 1 ? coeffRed + ' × ' : ''}${cRed.demiEqOx || `${cRed.red} → ${cRed.ox} + ne⁻`}</code>
        <div style="font-size:.78rem;margin-top:.3rem;opacity:.7">${cRed.nomRed} → ${cRed.nomOx}</div>
      </div>
    </div>
    <div style="margin-top:var(--gap-sm);padding:var(--gap-sm) var(--gap-md);border-radius:var(--r-md);
      background:${spontane ? '#D5F5E3' : '#FDEDEC'};border-left:4px solid ${spontane ? 'var(--vert-acide)' : 'var(--rouge-ph)'}">
      <strong>${spontane ? '✅ Réaction spontanée' : '❌ Réaction non spontanée dans ce sens'}</strong><br>
      f.é.m. = E°(ox) − E°(red) = ${cOx.E0} − ${cRed.E0} = <code>${fem} V</code>
      ${!spontane ? '<br>Inverser les rôles oxydant/réducteur.' : ''}
    </div>`;
  });
}

// ══════════════════════════════════════════════════════════════
// SIMULATEUR DOSAGE KMnO₄ / Fe²⁺ (sel de Mohr)
// ══════════════════════════════════════════════════════════════
let _dosageCanvas = null;

function _initSimulateurDosage() {
  const btn = document.getElementById('btn-tracer-dosage');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const va  = parseFloat(document.getElementById('va-dosage')?.value) || 20;
    const ca  = parseFloat(document.getElementById('ca-dosage')?.value) || 0.100;
    const cb  = parseFloat(document.getElementById('cb-dosage')?.value) || 0.020;
    const stp = parseFloat(document.getElementById('pas-dosage')?.value)  || 0.5;

    // Stœchiométrie KMnO₄/Fe²⁺ : 1 MnO₄⁻ réagit avec 5 Fe²⁺
    const Ve   = ca * va / (5 * cb);
    const nFe2 = ca * va / 1000;

    _setText('ve-dosage', `${Ve.toFixed(2)} mL`);
    _setText('c-fe2-calc', `${ca.toFixed(4)} mol/L`);
    _setText('n-fe2-calc', `${(nFe2 * 1000).toFixed(3)} mmol`);

    _dessinerDosage(va, ca, cb, Ve, stp);
    _majInfoDosage(Ve, cb, va, ca);
  });
}

function _dessinerDosage(va, ca, cb, Ve, pas) {
  const canvas = document.getElementById('courbe-dosage');
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const W   = canvas.offsetWidth || 700;
  const H   = 300;
  canvas.width  = W * dpr; canvas.height = H * dpr;
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // Couleur de la solution en fonction du volume de KMnO₄ versé
  // Avant VE : violet disparaît (KMnO₄ consommé par Fe²⁺)
  // Après VE : violet persiste (KMnO₄ en excès)
  const vMax = Ve * 1.8;
  const pts  = [];
  for (let v = 0; v <= vMax; v = +(v + pas).toFixed(2)) {
    const nKMnO4 = cb * v / 1000;
    const nFe2   = ca * va / 1000;
    const nFe2restant = Math.max(0, nFe2 - 5 * nKMnO4);
    const nKMnO4exc   = Math.max(0, 5 * nKMnO4 - nFe2);
    // Absorbance simulée : proportionnelle à KMnO₄ en solution
    // Avant VE : 0 (KMnO₄ consommé)
    // Après VE  : croît linéairement
    const absorbance = v <= Ve ? 0 : +(cb * (v - Ve) / (va + v) * 1000 / cb).toFixed(3);
    pts.push({ v, absorbance, avantE: v <= Ve });
  }

  const pad = { top: 28, right: 28, bottom: 50, left: 60 };
  const cw  = W - pad.left - pad.right;
  const ch  = H - pad.top  - pad.bottom;
  const maxA = Math.max(...pts.map(p => p.absorbance)) * 1.2 || 1;

  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  // Grille
  ctx.strokeStyle = '#eee'; ctx.lineWidth = .7;
  for (let i = 0; i <= 4; i++) {
    const a = maxA * i / 4;
    const y = pad.top + (1 - a / maxA) * ch;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + cw, y); ctx.stroke();
    ctx.fillStyle = '#888'; ctx.font = '10px monospace'; ctx.textAlign = 'right';
    ctx.fillText(a.toFixed(2), pad.left - 4, y + 4);
  }

  const xS = v => pad.left + (v / vMax) * cw;
  const yS = a => pad.top  + (1 - a / maxA) * ch;

  // Ligne VE
  ctx.strokeStyle = '#E74C3C'; ctx.lineWidth = 1.2; ctx.setLineDash([5, 3]);
  ctx.beginPath(); ctx.moveTo(xS(Ve), pad.top); ctx.lineTo(xS(Ve), pad.top + ch); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#E74C3C'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(`VE = ${Ve.toFixed(1)} mL`, xS(Ve), pad.top - 6);

  // Ligne horizontale avant VE (absorbance ≈ 0)
  ctx.strokeStyle = '#1B6CA8'; ctx.lineWidth = 2.5;
  ctx.beginPath();
  const avantE = pts.filter(p => p.avantE);
  avantE.forEach((p, i) => i === 0 ? ctx.moveTo(xS(p.v), yS(0)) : ctx.lineTo(xS(p.v), yS(0)));
  ctx.stroke();

  // Ligne après VE (croissante)
  ctx.strokeStyle = '#6C3483';
  ctx.beginPath();
  const apresE = pts.filter(p => !p.avantE);
  apresE.forEach((p, i) => i === 0 ? ctx.moveTo(xS(p.v), yS(p.absorbance)) : ctx.lineTo(xS(p.v), yS(p.absorbance)));
  ctx.stroke();

  // Labels
  ctx.fillStyle = '#555'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Volume KMnO₄ versé (mL)', pad.left + cw / 2, H - 4);
  ctx.save(); ctx.translate(14, H / 2); ctx.rotate(-Math.PI / 2);
  ctx.fillText('[KMnO₄] persistant (u.a.)', 0, 0); ctx.restore();

  // Annotation couleur
  ctx.fillStyle = '#1B6CA8'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Violet décoloré (KMnO₄ consommé)', pad.left + 6, pad.top + 14);
  ctx.fillStyle = '#6C3483';
  ctx.fillText('Violet persistant (excès)', pad.left + 6, pad.top + 27);
}

function _majInfoDosage(Ve, cb, va, ca) {
  const nKMnO4 = cb * Ve / 1000;
  const nFe2   = 5 * nKMnO4;
  const cFe2   = nFe2 / (va / 1000);

  _setText('bilan-n-kmno4', `${(nKMnO4 * 1000).toFixed(3)} mmol`);
  _setText('bilan-n-fe2',   `${(nFe2 * 1000).toFixed(3)} mmol`);
  _setText('bilan-c-fe2',   `${cFe2.toFixed(4)} mol/L`);

  const elFormule = document.getElementById('formule-dosage');
  if (elFormule) {
    elFormule.innerHTML = `
    n(Fe²⁺) = 5 × n(KMnO₄) = 5 × C<sub>B</sub> × V<sub>E</sub><br>
    C(Fe²⁺) = 5 × ${cb} × ${Ve.toFixed(2)} / ${va} = <strong>${cFe2.toFixed(4)} mol/L</strong>`;
  }
}

// ══════════════════════════════════════════════════════════════
// PILE DANIELL — simulateur interactif
// ══════════════════════════════════════════════════════════════
let _pileInterval = null;
let _pileTemps    = 0;
let _pileFEM      = 0;

function _initPileDaniell() {
  const btn      = document.getElementById('btn-start-pile');
  const btnStop  = document.getElementById('btn-stop-pile');
  const selAnode = document.getElementById('sel-anode');
  const selCath  = document.getElementById('sel-cathode');
  if (!btn) return;

  // Couples disponibles pour la pile
  const couplesPile = COUPLES_REDOX.filter(c => ['zn2-zn','cu2-cu','fe3-fe2'].includes(c.id));
  [selAnode, selCath].forEach((sel, i) => {
    if (!sel) return;
    sel.innerHTML = couplesPile.map(c =>
      `<option value="${c.id}">${c.red}/${c.ox} (E° = ${c.E0} V)</option>`
    ).join('');
    sel.selectedIndex = i;
  });

  btn.addEventListener('click', () => {
    if (_pileInterval) clearInterval(_pileInterval);
    _pileTemps = 0;
    const cAnode = couplesPile.find(c => c.id === selAnode?.value);
    const cCath  = couplesPile.find(c => c.id === selCath?.value);
    if (!cAnode || !cCath || cAnode.id === cCath.id) return;

    _pileFEM = +(cCath.E0 - cAnode.E0).toFixed(3);
    _setText('fem-theo', `${_pileFEM} V`);
    _setText('anode-label',   `${cAnode.red} → ${cAnode.ox} + ne⁻  (E° = ${cAnode.E0} V)`);
    _setText('cathode-label', `${cCath.ox} + ne⁻ → ${cCath.red}   (E° = ${cCath.E0} V)`);

    _pileInterval = setInterval(() => {
      _pileTemps += 0.5;
      // Décroissance très lente de la FEM (simulation)
      const fem = +(_pileFEM * Math.exp(-_pileTemps / 3600)).toFixed(3);
      _setText('fem-mesure', `${fem} V`);
      _setText('pile-temps',  `${Math.floor(_pileTemps)} s`);
      if (fem < 0.01) { clearInterval(_pileInterval); _setText('fem-mesure', '~0 V (pile déchargée)'); }
    }, 500);
  });

  if (btnStop) btnStop.addEventListener('click', () => { if (_pileInterval) clearInterval(_pileInterval); });
}

// ══════════════════════════════════════════════════════════════
// POTENTIEL RÉDOX — calculateur Nernst
// ══════════════════════════════════════════════════════════════
function _initPotentielRedox() {
  const form = document.getElementById('form-nernst');
  if (!form) return;

  form.addEventListener('input', () => {
    const E0  = parseFloat(document.getElementById('e0-nernst')?.value)  || 0;
    const n   = parseFloat(document.getElementById('n-nernst')?.value)   || 1;
    const cox = parseFloat(document.getElementById('cox-nernst')?.value) || 1;
    const cred= parseFloat(document.getElementById('cred-nernst')?.value)|| 1;

    const E = +(E0 + 0.0592 / n * Math.log10(cox / cred)).toFixed(4);
    const out = document.getElementById('resultat-nernst');
    if (out) {
      out.innerHTML = `
      <div class="formule-bloc">
        E = E° + (0,0592/n) × log([Ox]/[Red])<br>
        E = ${E0} + (0,0592/${n}) × log(${cox}/${cred})<br>
        <strong>E = ${E} V</strong>
      </div>`;
    }
  });
}

// ══════════════════════════════════════════════════════════════
// TABLEAU RÉSULTATS
// ══════════════════════════════════════════════════════════════
function _initTableauResultats() {
  // Calcul automatique n(KMnO4) → n(réducteur) → C
  const inputs = document.querySelectorAll('[data-ve-dosage]');
  inputs.forEach(inp => {
    inp.addEventListener('input', () => {
      const Ve  = parseFloat(inp.value);
      const cb  = parseFloat(inp.dataset.cb) || 0.020;
      const va  = parseFloat(inp.dataset.va) || 20;
      const sto = parseFloat(inp.dataset.stochiometrie) || 5; // 5 Fe²⁺ pour 1 KMnO₄
      const row = inp.closest('tr');
      if (!row || isNaN(Ve)) return;

      const nKMnO4 = cb * Ve / 1000;
      const nRed   = sto * nKMnO4;
      const cRed   = nRed / (va / 1000);

      const tdN1  = row.querySelector('[data-type="n-kmno4"]');
      const tdN2  = row.querySelector('[data-type="n-red"]');
      const tdC   = row.querySelector('[data-type="c-red"]');
      if (tdN1) tdN1.textContent = `${(nKMnO4 * 1000).toFixed(3)} mmol`;
      if (tdN2) tdN2.textContent = `${(nRed * 1000).toFixed(3)} mmol`;
      if (tdC)  tdC.textContent  = `${cRed.toFixed(4)} mol/L`;
    });
  });
}

// ══════════════════════════════════════════════════════════════
// UTILITAIRES
// ══════════════════════════════════════════════════════════════
function _ppcm(a, b) {
  const pgcd = (x, y) => y === 0 ? x : pgcd(y, x % y);
  return (a * b) / pgcd(a, b);
}

function _setText(id, txt) {
  const el = document.getElementById(id);
  if (el) el.textContent = txt;
}
