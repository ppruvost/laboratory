/**
 * tp03.js — Titrages acido-basiques
 * Simulation pH-métrique, dérivée, conductimétrie, CA, export CSV
 */

import products from "../../data/products.js";
import { renderBlocSecurite, initSections, initTabs } from './utils.js';

// ── Constantes ────────────────────────────────────────────────
// ── Constantes ────────────────────────────────────────────────
const Ke = 1e-14;

// pKa à 25 °C
const PKA = {

  // Acides faibles
  "CH3COOH": 4.76,          // acide acétique
  "CH3CH2COOH": 4.87,       // acide propionique
  "CH3CH2CH2COOH": 4.82,    // acide butyrique
  "HF": 3.17,
  "HNO2": 3.37,

  // Ammoniac / ammonium
  "NH4+": 9.25,

  // Acide phosphorique
  "H3PO4": 2.15,
  "H2PO4-": 7.20,
  "HPO4^2-": 12.35,

  // Acide carbonique
  "H2CO3": 6.35,
  "HCO3-": 10.33,

  // Acide borique (borax)
  "H3BO3": 9.24,

  // Acide oxalique
  "H2C2O4": 1.25,
  "HC2O4-": 4.27,

  // EDTA
  "H4EDTA": 2.00,
  "H3EDTA-": 2.67,
  "H2EDTA2-": 6.16,
  "HEDTA3-": 10.26,

  // Sulfure d'hydrogène (utile avec FeS)
  "H2S": 7.02,
  "HS-": 12.90,

  // Eau oxygénée
  "H2O2": 11.7
};

// ══════════════════════════════════════════════════════════════
// ÉTAT GLOBAL
// ══════════════════════════════════════════════════════════════
let _canvas = null;
let _ctx = null;

let _donnees = { vols: [], phs: [], derive: [] };
let _params = {};

// ══════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════
export function init() {
  _initSecurite();
  initSections();
  initTabs();
  _initParametres();
  _initBoutonTracer();
  _initTableauSaisie();
  _initCalculCA();
  _initExportCSV();
  _initConductimetrie();
}

// ── Sécurité ──────────────────────────────────────────────────
function _initSecurite() {
  const el = document.getElementById('securite-bloc');
  if (!el) return;

  const CAS = ['7647-01-0', '1310-73-2', '64-19-7', '77-09-8', '76-59-5'];
  const produits = CAS.map(c => PRODUITS.find(p => p.cas === c)).filter(Boolean);

  el.innerHTML = renderBlocSecurite(produits);
}

// ══════════════════════════════════════════════════════════════
// PARAMÈTRES
// ══════════════════════════════════════════════════════════════
function _initParametres() {
  ['va','ca','cb','sel-acide','sel-base','pas','pka-select']
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', _miseAJourParams);
      el.addEventListener('change', _miseAJourParams);
    });

  _miseAJourParams();
}

function _miseAJourParams() {
  const Va = parseFloat(document.getElementById('va')?.value) || 20;
  const Ca = parseFloat(document.getElementById('ca')?.value) || 0.1;
  const Cb = parseFloat(document.getElementById('cb')?.value) || 0.1;

  _params = {
    Va,
    Ca,
    Cb,
    typeAcide: document.getElementById('sel-acide')?.value || 'fort',
    typeBase: document.getElementById('sel-base')?.value || 'fort',
    pas: parseFloat(document.getElementById('pas')?.value) || 1,
    pKa: PKA[document.getElementById('pka-select')?.value] ?? null,
  };

  _params.Ve = (Ca * Va) / Cb;

  const elVe = document.getElementById('ve-theo');
  if (elVe) elVe.textContent = `${_params.Ve.toFixed(2)} mL`;
}

// ══════════════════════════════════════════════════════════════
// pH
// ══════════════════════════════════════════════════════════════
function _calcPH(Vb, p) {
  const { Va, Ca, Cb, typeAcide, typeBase, pKa } = p;

  const na = Ca * Va / 1000;
  const nb = Cb * Vb / 1000;
  const Vt = (Va + Vb) / 1000;

  const eps = 1e-9;

  // ── fort / fort ───────────────────────────────
  if (typeAcide === 'fort' && typeBase === 'fort') {
    if (nb < na - eps) return -Math.log10((na - nb) / Vt);
    if (nb > na + eps) return 14 + Math.log10((nb - na) / Vt);
    return 7;
  }

  // ── faible / fort ─────────────────────────────
  if (typeAcide === 'faible' && typeBase === 'fort') {
    const Ka = Math.pow(10, -(pKa || PKA['CH3COOH']));

    if (Vb === 0) {
      const h = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * Ca)) / 2;
      return -Math.log10(h);
    }

    if (nb < na - eps) {
      const ratio = (na - nb) / nb;
      return (pKa || 4.76) + Math.log10(1 / ratio);
    }

    if (Math.abs(nb - na) <= eps) {
      const cSel = na / Vt;
      const Kb = Ke / Ka;
      const oh = (-Kb + Math.sqrt(Kb * Kb + 4 * Kb * cSel)) / 2;
      return 14 + Math.log10(oh);
    }

    return 14 + Math.log10((nb - na) / Vt);
  }

  // ── fort / faible ─────────────────────────────
  if (typeAcide === 'fort' && typeBase === 'faible') {
    const Kb = Math.pow(10, -(14 - (pKa || PKA['NH4+'])));
    const Ka = Ke / Kb;

    if (nb < na - eps) return -Math.log10((na - nb) / Vt);

    if (Math.abs(nb - na) <= eps) {
      const cSel = na / Vt;
      const h = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * cSel)) / 2;
      return -Math.log10(h);
    }

    return (14 - (pKa || 9.25)) + Math.log10((nb - na) / Vt);
  }

  return 7;
}

// ══════════════════════════════════════════════════════════════
// DONNÉES + DÉRIVÉE
// ══════════════════════════════════════════════════════════════
function _genererDonnees(p) {
  const vMax = p.Ve * 1.8;

  const vols = [];
  const phs = [];

  for (let v = 0; v <= vMax; v += p.pas) {
    vols.push(+v.toFixed(3));
    phs.push(+_calcPH(v, p).toFixed(3));
  }

  const derive = [0];

  for (let i = 1; i < vols.length - 1; i++) {
    const dpH = phs[i + 1] - phs[i - 1];
    const dV = vols[i + 1] - vols[i - 1];
    derive.push(dV ? +(dpH / dV).toFixed(3) : 0);
  }

  derive.push(0);

  return { vols, phs, derive };
}

// ══════════════════════════════════════════════════════════════
// TRACÉ
// ══════════════════════════════════════════════════════════════
function _initBoutonTracer() {
  const btn = document.getElementById('btn-tracer');
  if (!btn) return;

  btn.addEventListener('click', () => {
    _miseAJourParams();
    _donnees = _genererDonnees(_params);
    _dessinerCourbe();
    _afficherInfoEquiv();
    _majTableauSaisie();
  });
}

// ══════════════════════════════════════════════════════════════
// CONDUCTIMÉTRIE (CORRIGÉE)
// ══════════════════════════════════════════════════════════════
function _dessinerConductimetrie(canvas) {
  const { Va, Ca, Cb } = _params;
  const Ve = (Ca * Va) / Cb;

  const W = canvas.offsetWidth || 700;
  const H = 280;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr;
  canvas.height = H * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const vMax = Ve * 1.8;

  const pts = [];

  for (let v = 0; v <= vMax; v += Ve / 20) {
    let sigma;

    if (v <= Ve) {
      sigma =
        350 * (Ca * Va - Cb * v) / (Va + v) * 1e-3 +
        76.4 * Cb * v / (Va + v) * 1e-3;
    } else {
      sigma = 0.5 + 198 * Cb * (v - Ve) / (Va + v) * 1e-3;
    }

    pts.push({ v, sigma: Math.max(sigma, 0.01) });
  }

  const maxS = Math.max(...pts.map(p => p.sigma));

  const pad = { top: 28, right: 28, bottom: 48, left: 60 };

  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  const xS = v => pad.left + (v / vMax) * cw;
  const yS = s => pad.top + (1 - s / (maxS * 1.1)) * ch;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);

  const avant = pts.filter(p => p.v <= Ve);
  const apres = pts.filter(p => p.v >= Ve);

  const draw = (arr, color) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    arr.forEach((p, i) => {
      const x = xS(p.v);
      const y = yS(p.sigma);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });

    ctx.stroke();
  };

  draw(avant, '#1B6CA8');
  draw(apres, '#27AE60');
}
