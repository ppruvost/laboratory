/**
 * tp03.js — Titrages acido-basiques
 * Gère : simulation pH-métrique, courbe dérivée, méthode tangentes,
 *        titrage conductimétrique, calcul CA, export données
 */

import { PRODUITS } from '../produits.js';
import { renderBlocSecurite, initSections, initTabs } from '../utils.js';

// ── Constantes physicochimiques ──────────────────────────────
const Ke = 1e-14;
const PKA = {
  'CH3COOH':  4.76,
  'NH4+':     9.25,
  'H3PO4':    2.12,
  'H2PO4-':   7.21,
  'HPO42-':  12.67,
  'HF':       3.17,
  'HNO2':     3.37,
};

// ══════════════════════════════════════════════════════════════
// ÉTAT DU MODULE
// ══════════════════════════════════════════════════════════════
let _canvas    = null;
let _ctx       = null;
let _donnees   = { vols: [], phs: [], derive: [] }; // données courbe
let _params    = {};

// ══════════════════════════════════════════════════════════════
// INIT PRINCIPALE
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
// PARAMÈTRES TIRÉS DU DOM
// ══════════════════════════════════════════════════════════════
function _initParametres() {
  const ids = ['va','ca','cb','sel-acide','sel-base','pas'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', _miseAJourParams);
    if (el) el.addEventListener('input',  _miseAJourParams);
  });
  _miseAJourParams();
}

function _miseAJourParams() {
  _params = {
    Va:        parseFloat(document.getElementById('va')?.value)        || 20,
    Ca:        parseFloat(document.getElementById('ca')?.value)        || 0.100,
    Cb:        parseFloat(document.getElementById('cb')?.value)        || 0.100,
    typeAcide: document.getElementById('sel-acide')?.value             || 'fort',
    typeBase:  document.getElementById('sel-base')?.value              || 'fort',
    pas:       parseFloat(document.getElementById('pas')?.value)       || 1,
    pKa:       PKA[document.getElementById('pka-select')?.value]       || null,
  };

  // Volume équivalent théorique
  _params.Ve = _params.Ca * _params.Va / _params.Cb;

  // Mise à jour affichage Ve théo
  const elVe = document.getElementById('ve-theo');
  if (elVe) elVe.textContent = _params.Ve.toFixed(2) + ' mL';
}

// ══════════════════════════════════════════════════════════════
// MOTEUR DE CALCUL pH
// ══════════════════════════════════════════════════════════════
function _calcPH(Vb, p) {
  const { Va, Ca, Cb, typeAcide, typeBase, pKa } = p;
  const na = Ca * Va / 1000;  // mol acide initial
  const nb = Cb * Vb / 1000;  // mol base ajoutée
  const Vt = (Va + Vb) / 1000; // L total

  // ── Acide fort + Base forte ───────────────────────────────
  if (typeAcide === 'fort' && typeBase === 'fort') {
    if (nb < na - 1e-9) {
      return -Math.log10((na - nb) / Vt);
    } else if (nb > na + 1e-9) {
      return 14 + Math.log10((nb - na) / Vt);
    } else {
      return 7.00;
    }
  }

  // ── Acide faible + Base forte ─────────────────────────────
  if (typeAcide === 'faible' && typeBase === 'fort') {
    const Ka = Math.pow(10, -(pKa || PKA['CH3COOH']));

    if (Vb === 0) {
      // Avant tout ajout
      const h = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * Ca)) / 2;
      return -Math.log10(h);
    }
    if (nb < na - 1e-9) {
      // Zone tampon — Henderson-Hasselbalch
      const cAcide = (na - nb) / Vt;
      const cSel   = nb / Vt;
      return (pKa || 4.76) + Math.log10(cSel / cAcide);
    }
    if (Math.abs(nb - na) < 1e-9) {
      // Point d'équivalence — sel d'acide faible / base forte
      const cSel  = na / Vt;
      const Kb    = Ke / Ka;
      const oh    = (-Kb + Math.sqrt(Kb * Kb + 4 * Kb * cSel)) / 2;
      return 14 + Math.log10(oh);
    }
    if (nb > na + 1e-9) {
      // Excès de base forte
      return 14 + Math.log10((nb - na) / Vt);
    }
  }

  // ── Acide fort + Base faible ──────────────────────────────
  if (typeAcide === 'fort' && typeBase === 'faible') {
    const Kb = Math.pow(10, -(14 - (pKa || PKA['NH4+'])));
    const Ka_conj = Ke / Kb;

    if (nb < na - 1e-9) {
      return -Math.log10((na - nb) / Vt);
    }
    if (Math.abs(nb - na) < 1e-9) {
      const cSel = na / Vt;
      const h    = (-Ka_conj + Math.sqrt(Ka_conj * Ka_conj + 4 * Ka_conj * cSel)) / 2;
      return -Math.log10(h);
    }
    if (nb > na + 1e-9) {
      const cBase = (nb - na) / Vt;
      return (14 - (pKa || 9.25)) + Math.log10(cBase / ((na) / Vt));
    }
  }

  return 7;
}

// ══════════════════════════════════════════════════════════════
// GÉNÉRATION DES DONNÉES + DÉRIVÉE
// ══════════════════════════════════════════════════════════════
function _genererDonnees(p) {
  const { Ve, pas } = p;
  const vMax = Ve * 1.85;
  const vols = [], phs = [];

  // Points serrés autour de l'équivalence
  for (let v = 0; v <= vMax; v = +(v + pas).toFixed(3)) {
    vols.push(v);
    phs.push(+(_calcPH(v, p)).toFixed(3));
  }

  // Dérivée ΔpH/ΔV
  const derive = [0];
  for (let i = 1; i < vols.length - 1; i++) {
    const dpH = phs[i + 1] - phs[i - 1];
    const dV  = vols[i + 1] - vols[i - 1];
    derive.push(dV !== 0 ? +(dpH / dV).toFixed(3) : 0);
  }
  derive.push(0);

  return { vols, phs, derive };
}

// ══════════════════════════════════════════════════════════════
// BOUTON TRACER
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
// DESSIN CANVAS — courbe pH + dérivée (onglets)
// ══════════════════════════════════════════════════════════════
function _dessinerCourbe() {
  _canvas = document.getElementById('courbe');
  if (!_canvas) return;

  const mode = document.getElementById('mode-courbe')?.value || 'ph';
  const dpr  = window.devicePixelRatio || 1;
  const W    = _canvas.offsetWidth || 700;
  const H    = 360;
  _canvas.width  = W * dpr;
  _canvas.height = H * dpr;
  _canvas.style.height = H + 'px';

  _ctx = _canvas.getContext('2d');
  _ctx.scale(dpr, dpr);

  if (mode === 'derive') {
    _dessinerDerivee(W, H);
  } else {
    _dessinerPH(W, H);
  }
}

function _dessinerPH(W, H) {
  const ctx  = _ctx;
  const pad  = { top: 32, right: 32, bottom: 52, left: 58 };
  const cw   = W - pad.left - pad.right;
  const ch   = H - pad.top  - pad.bottom;
  const { vols, phs } = _donnees;
  if (!vols.length) return;

  const maxV = Math.max(...vols);
  const xS   = v => pad.left + (v / maxV) * cw;
  const yS   = p => pad.top  + (1 - p / 14) * ch;

  // Fond
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  // Grille
  ctx.strokeStyle = '#eee'; ctx.lineWidth = .8;
  for (let i = 0; i <= 14; i += 2) {
    ctx.beginPath(); ctx.moveTo(pad.left, yS(i)); ctx.lineTo(pad.left + cw, yS(i)); ctx.stroke();
    ctx.fillStyle = '#888'; ctx.font = '10px monospace'; ctx.textAlign = 'right';
    ctx.fillText(i, pad.left - 6, yS(i) + 4);
  }
  for (let v = 0; v <= maxV; v += 5) {
    ctx.beginPath(); ctx.moveTo(xS(v), pad.top); ctx.lineTo(xS(v), pad.top + ch); ctx.stroke();
    ctx.fillStyle = '#888'; ctx.textAlign = 'center';
    ctx.fillText(v, xS(v), H - pad.bottom + 16);
  }

  // Axes
  ctx.strokeStyle = '#333'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(pad.left, pad.top); ctx.lineTo(pad.left, pad.top + ch); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(pad.left, pad.top + ch); ctx.lineTo(pad.left + cw, pad.top + ch); ctx.stroke();

  // Label axes
  ctx.fillStyle = '#333'; ctx.font = '12px sans-serif';
  ctx.save(); ctx.translate(14, H / 2); ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center'; ctx.fillText('pH', 0, 0); ctx.restore();
  ctx.textAlign = 'center';
  ctx.fillText('Volume NaOH ajouté (mL)', pad.left + cw / 2, H - 6);

  // Ligne pH = 7
  ctx.strokeStyle = '#aaa'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(pad.left, yS(7)); ctx.lineTo(pad.left + cw, yS(7)); ctx.stroke();
  ctx.setLineDash([]);

  // Ve — ligne verticale
  const { Ve } = _params;
  if (Ve <= maxV) {
    ctx.strokeStyle = '#E74C3C'; ctx.lineWidth = 1.2; ctx.setLineDash([6, 3]);
    ctx.beginPath(); ctx.moveTo(xS(Ve), pad.top); ctx.lineTo(xS(Ve), pad.top + ch); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#E74C3C'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`VE = ${Ve.toFixed(1)} mL`, xS(Ve), pad.top - 8);

    // Point équivalence
    const phE = _calcPH(Ve, _params);
    ctx.fillStyle = '#E74C3C';
    ctx.beginPath(); ctx.arc(xS(Ve), yS(phE), 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(xS(Ve), yS(phE), 3, 0, Math.PI * 2); ctx.fill();
  }

  // Courbe pH
  ctx.beginPath(); ctx.strokeStyle = '#1B6CA8'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  vols.forEach((v, i) => {
    const x = xS(v), y = yS(Math.min(Math.max(phs[i], 0), 14));
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Légende
  ctx.fillStyle = '#1B6CA8'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('pH = f(V)', pad.left + 8, pad.top + 16);
  ctx.fillStyle = '#E74C3C';
  ctx.fillText('▲ Point équivalence', pad.left + 8, pad.top + 30);
}

function _dessinerDerivee(W, H) {
  const ctx   = _ctx;
  const pad   = { top: 32, right: 32, bottom: 52, left: 58 };
  const cw    = W - pad.left - pad.right;
  const ch    = H - pad.top  - pad.bottom;
  const { vols, derive } = _donnees;
  if (!vols.length) return;

  const maxV  = Math.max(...vols);
  const maxD  = Math.max(...derive.map(Math.abs)) * 1.15 || 5;
  const xS    = v => pad.left + (v / maxV) * cw;
  const yS    = d => pad.top  + (1 - (d / maxD + 0.5) * 0.8) * ch;

  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);

  // Grille + axes
  ctx.strokeStyle = '#eee'; ctx.lineWidth = .7;
  [0, maxD / 2, maxD].forEach(d => {
    ctx.beginPath(); ctx.moveTo(pad.left, yS(d)); ctx.lineTo(pad.left + cw, yS(d)); ctx.stroke();
  });

  // Courbe dérivée
  ctx.beginPath(); ctx.strokeStyle = '#6C3483'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
  vols.forEach((v, i) => {
    const x = xS(v);
    const y = pad.top + (1 - derive[i] / maxD) * ch;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Pic maximum → Ve
  const iMax = derive.indexOf(Math.max(...derive));
  if (iMax >= 0) {
    const ve = vols[iMax];
    ctx.strokeStyle = '#E74C3C'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 3]);
    ctx.beginPath(); ctx.moveTo(xS(ve), pad.top); ctx.lineTo(xS(ve), pad.top + ch); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#E74C3C'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(`VE ≈ ${ve.toFixed(1)} mL`, xS(ve), pad.top - 8);
  }

  // Labels
  ctx.fillStyle = '#6C3483'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('ΔpH/ΔV = f(V)', pad.left + 8, pad.top + 16);
  ctx.fillStyle = '#555'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Volume NaOH ajouté (mL)', pad.left + cw / 2, H - 6);
}

// Switcher pH / dérivée
document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('mode-courbe');
  if (sel) sel.addEventListener('change', _dessinerCourbe);
});

// ══════════════════════════════════════════════════════════════
// INFOS ÉQUIVALENCE
// ══════════════════════════════════════════════════════════════
function _afficherInfoEquiv() {
  const { Ve, Ca, Va, Cb } = _params;
  const phE = _calcPH(Ve, _params);

  const indicateur =
    phE > 9  ? 'Phénolphtaléine (rose en milieu basique)' :
    phE > 7  ? 'BBT (bleu en milieu basique)'              :
    phE > 5  ? 'Rouge de méthyle'                          :
               'Hélianthine';

  const elDiv = document.getElementById('info-equiv');
  if (elDiv) elDiv.style.display = 'flex';

  _setText('ve-val',   `${Ve.toFixed(2)} mL`);
  _setText('phe-val',  phE.toFixed(2));
  _setText('cinc-val', `${Ca.toFixed(4)} mol/L`);
  _setText('ind-val',  indicateur);

  // Formule complète
  const elFormule = document.getElementById('formule-equiv');
  if (elFormule) {
    elFormule.innerHTML = `
    C<sub>A</sub> = C<sub>B</sub> × V<sub>E</sub> / V<sub>A</sub>
    = ${Cb} × ${Ve.toFixed(2)} / ${Va}
    = <strong>${(Cb * Ve / Va).toFixed(4)} mol/L</strong>`;
  }
}

// ══════════════════════════════════════════════════════════════
// TABLEAU DE SAISIE — pré-remplissage théorique
// ══════════════════════════════════════════════════════════════
function _initTableauSaisie() {
  // Vide — géré via _majTableauSaisie après calcul
}

function _majTableauSaisie() {
  const { vols, phs } = _donnees;
  if (!vols.length) return;

  // Points clés à afficher dans le tableau
  const pointsCles = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 19, 19.5,
    _params.Ve,
    _params.Ve + 0.5, _params.Ve + 1, _params.Ve + 2, _params.Ve + 5, _params.Ve * 1.5];

  const tbody = document.getElementById('tbody-titrage-theo');
  if (!tbody) return;

  tbody.innerHTML = pointsCles
    .filter(v => v >= 0 && v <= Math.max(...vols))
    .sort((a, b) => a - b)
    .map(v => {
      // Interpoler pH
      let ph = _calcPH(v, _params);
      return `<tr>
        <td style="font-family:var(--font-code)">${v.toFixed(1)}</td>
        <td style="font-family:var(--font-code);color:${_couleurPH(ph)}">${ph.toFixed(2)}</td>
        <td class="saisie" contenteditable="true"></td>
      </tr>`;
    }).join('');
}

// ══════════════════════════════════════════════════════════════
// CALCUL CA DEPUIS RÉSULTATS EXPÉRIMENTAUX
// ══════════════════════════════════════════════════════════════
function _initCalculCA() {
  const ids = ['ve-exp', 'phe-exp', 'cb-exp', 'va-exp'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', _calcCA);
  });
}

function _calcCA() {
  const Ve = parseFloat(document.getElementById('ve-exp')?.value);
  const Cb = parseFloat(document.getElementById('cb-exp')?.value) || _params.Cb;
  const Va = parseFloat(document.getElementById('va-exp')?.value) || _params.Va;
  const out = document.getElementById('calcul-ca-exp');
  if (!out || isNaN(Ve) || Ve <= 0) return;

  const Ca = +(Cb * Ve / Va).toFixed(4);
  const ecart = _params.Ca ? +(Math.abs(Ca - _params.Ca) / _params.Ca * 100).toFixed(1) : '—';

  out.innerHTML = `
  <div class="formule-bloc">
    C<sub>A</sub> = C<sub>B</sub> × V<sub>E</sub> / V<sub>A</sub>
    = ${Cb} × ${Ve} / ${Va} = <strong>${Ca} mol/L</strong>
    ${ecart !== '—' ? `<br>Écart / valeur théo : ${ecart} %` : ''}
  </div>`;
}

// ══════════════════════════════════════════════════════════════
// TITRAGE CONDUCTIMÉTRIQUE — courbe simplifiée
// ══════════════════════════════════════════════════════════════
function _initConductimetrie() {
  const btn = document.getElementById('btn-tracer-cond');
  if (!btn) return;

  btn.addEventListener('click', () => {
    _miseAJourParams();
    const canvas = document.getElementById('courbe-cond');
    if (!canvas) return;
    _dessinerConductimetrie(canvas);
  });
}

function _dessinerConductimetrie(canvas) {
  const { Va, Ca, Cb } = _params;
  const Ve    = Ca * Va / Cb;
  const dpr   = window.devicePixelRatio || 1;
  const W     = canvas.offsetWidth || 700;
  const H     = 280;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // Conductivités molaires ioniques (mS·m²/mol) approximées
  // HCl + NaOH : Cl⁻ remplace OH⁻, Na⁺ s'ajoute
  const vMax = Ve * 1.8;
  const pts  = [];
  for (let v = 0; v <= vMax; v += Ve / 20) {
    let sigma;
    if (v <= Ve) {
      // Avant équivalence : remplacement H⁺ (forte conductivité) par Na⁺ (moins)
      sigma = 350 * (Ca * Va - Cb * v) / (Va + v) * 1e-3
            + 76.4 * Cb * v / (Va + v) * 1e-3
            + 76.4 * Cb * v / (Va + v) * 1e-3; // Cl⁻
      sigma = Math.max(sigma, 0.5);
    } else {
      // Après équivalence : excès NaOH → augmentation
      sigma = 0.5 + 198 * Cb * (v - Ve) / (Va + v) * 1e-3;
    }
    pts.push({ v, sigma });
  }

  const maxS = Math.max(...pts.map(p => p.sigma));
  const pad  = { top: 28, right: 28, bottom: 48, left: 60 };
  const cw   = W - pad.left - pad.right;
  const ch   = H - pad.top  - pad.bottom;

  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#eee'; ctx.lineWidth = .7;

  const xS = v => pad.left + (v / vMax) * cw;
  const yS = s => pad.top  + (1 - s / (maxS * 1.1)) * ch;

  // Grille
  for (let i = 0; i <= 4; i++) {
    const s = maxS * i / 4;
    ctx.beginPath(); ctx.moveTo(pad.left, yS(s)); ctx.lineTo(pad.left + cw, yS(s)); ctx.stroke();
    ctx.fillStyle = '#888'; ctx.font = '10px monospace'; ctx.textAlign = 'right';
    ctx.fillText(s.toFixed(1), pad.left - 4, yS(s) + 4);
  }
  for (let v = 0; v <= vMax; v += Ve / 4) {
    ctx.beginPath(); ctx.moveTo(xS(v), pad.top); ctx.lineTo(xS(v), pad.top + ch); ctx.stroke();
    ctx.fillStyle = '#888'; ctx.textAlign = 'center';
    ctx.fillText(v.toFixed(1), xS(v), H - pad.bottom + 15);
  }

  // Ligne Ve
  ctx.strokeStyle = '#E74C3C'; ctx.lineWidth = 1.2; ctx.setLineDash([5, 3]);
  ctx.beginPath(); ctx.moveTo(xS(Ve), pad.top); ctx.lineTo(xS(Ve), pad.top + ch); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#E74C3C'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(`VE = ${Ve.toFixed(1)} mL`, xS(Ve), pad.top - 6);

  // Courbe conductimétrique (deux droites)
  const avantE = pts.filter(p => p.v <= Ve);
  const apresE = pts.filter(p => p.v >= Ve);

  function dessinerDroite(serie, couleur) {
    if (serie.length < 2) return;
    ctx.beginPath(); ctx.strokeStyle = couleur; ctx.lineWidth = 2.5;
    serie.forEach((p, i) => i === 0 ? ctx.moveTo(xS(p.v), yS(p.sigma)) : ctx.lineTo(xS(p.v), yS(p.sigma)));
    ctx.stroke();
  }

  dessinerDroite(avantE, '#1B6CA8');
  dessinerDroite(apresE, '#27AE60');

  // Labels
  ctx.fillStyle = '#555'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText('Volume NaOH ajouté (mL)', pad.left + cw / 2, H - 4);
  ctx.save(); ctx.translate(14, H / 2); ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center'; ctx.fillText('σ (mS/cm)', 0, 0); ctx.restore();

  ctx.fillStyle = '#1B6CA8'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'left';
  ctx.fillText('Avant VE : H⁺ → Na⁺', pad.left + 6, pad.top + 14);
  ctx.fillStyle = '#27AE60';
  ctx.fillText('Après VE : excès NaOH', pad.left + 6, pad.top + 27);
}

// ══════════════════════════════════════════════════════════════
// EXPORT CSV
// ══════════════════════════════════════════════════════════════
function _initExportCSV() {
  const btn = document.getElementById('btn-export-tp03');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const { vols, phs, derive } = _donnees;
    if (!vols.length) { alert('Tracer d\'abord la courbe.'); return; }

    const lignes = [['V_NaOH (mL)', 'pH théo', 'ΔpH/ΔV']];
    vols.forEach((v, i) => lignes.push([v, phs[i], derive[i]]));

    const csv = lignes.map(r => r.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'tp03-titrage.csv' });
    a.click();
    URL.revokeObjectURL(url);
  });
}

// ══════════════════════════════════════════════════════════════
// UTILITAIRES
// ══════════════════════════════════════════════════════════════
function _setText(id, txt) {
  const el = document.getElementById(id);
  if (el) el.textContent = txt;
}

function _couleurPH(ph) {
  const table = [
    [0,'#FF0000'],[1,'#FF4500'],[2,'#FF8C00'],[3,'#FFA500'],[4,'#FFD700'],
    [5,'#ADFF2F'],[6,'#7CFC00'],[7,'#00FF7F'],[8,'#00CED1'],[9,'#1E90FF'],
    [10,'#4169E1'],[11,'#8A2BE2'],[12,'#9400D3'],[13,'#800080'],[14,'#4B0082']
  ];
  const i  = Math.min(Math.floor(ph), 13);
  const t  = ph - i;
  const p  = c => [parseInt(c.slice(1,3),16), parseInt(c.slice(3,5),16), parseInt(c.slice(5,7),16)];
  const [r1,g1,b1] = p(table[i][1]);
  const [r2,g2,b2] = p(table[i+1][1]);
  return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
}
