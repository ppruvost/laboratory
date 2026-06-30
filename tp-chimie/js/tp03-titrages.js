/**
 * tp03-titrages.js — Titrages acido-basiques
 * Tableau de mesures dynamique + tracé temps réel + zoom + curseur
 * Méthode des tangentes + Méthode des dérivées
 * (Bloc 5 : correction des erreurs, Bloc 6 : export — viendront ensuite)
 */
import products from "../../data/products.js";
import { renderBlocSecurite, initSections, initTabs, initImprimer } from './utils.js';

// ── Constantes chimiques ────────────────────────────────────────
const Ke = 1e-14;
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
  "H2O2": 11.7,
};

// ══════════════════════════════════════════════════════════════
// ÉTAT GLOBAL
// ══════════════════════════════════════════════════════════════
let _params = {};
let _mesures = [];           // [{ v, ph }] saisies par l'élève
let _theorique = { vols: [], phs: [] }; // courbe simulée (bouton "Générer")
let _zoom = null;            // { vmin, vmax } ou null
let _chartScale = null;      // infos d'échelle du dernier tracé (pour curseur/zoom)
let _drag = null;            // { xStart } pendant un drag de zoom
let _resultatTangentes = null; // { Ve, Ce, m1,b1,m2,b2 }
let _resultatDerivee = null;   // { Ve, Ce, peakIdx }

// ══════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════
export function init() {
  _initSecurite();
  initSections();
  initTabs();
  initImprimer();

  _initParametres();
  _initTableauMesures();
  _initCheckboxes();
  _initCanvasInteractions();
  _initBoutonGenererTheorique();

  _dessinerGraphe();
}

// ── Sécurité ─────────────────────────────────────────────────
function _initSecurite() {
  const el = document.getElementById('securite-bloc');
  if (!el) return;
  const CAS = ['7647-01-0', '1310-73-2', '64-19-7', '77-09-8', '76-59-5'];
  const liste = CAS.map(c => products.find(p => p.cas === c)).filter(Boolean);
  el.innerHTML = renderBlocSecurite(liste);
}

// ══════════════════════════════════════════════════════════════
// PARAMÈTRES
// ══════════════════════════════════════════════════════════════
function _initParametres() {
  ['va', 'ca', 'cb', 'sel-acide', 'sel-base', 'pka-select'].forEach(id => {
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
    Va, Ca, Cb,
    typeAcide: document.getElementById('sel-acide')?.value || 'fort',
    typeBase: document.getElementById('sel-base')?.value || 'fort',
    pKa: PKA[document.getElementById('pka-select')?.value] ?? null,
  };
  _params.Ve = (Ca * Va) / Cb;

  const elVe = document.getElementById('ve-theo');
  if (elVe) elVe.textContent = `${_params.Ve.toFixed(2)} mL`;

  _dessinerGraphe();
}

// ══════════════════════════════════════════════════════════════
// pH THÉORIQUE (pour la courbe simulée)
// ══════════════════════════════════════════════════════════════
function _calcPH(Vb, p) {
  const { Va, Ca, Cb, typeAcide, typeBase, pKa } = p;
  const na = Ca * Va / 1000;
  const nb = Cb * Vb / 1000;
  const Vt = (Va + Vb) / 1000;
  const eps = 1e-9;

  if (typeAcide === 'fort' && typeBase === 'fort') {
    if (nb < na - eps) return -Math.log10((na - nb) / Vt);
    if (nb > na + eps) return 14 + Math.log10((nb - na) / Vt);
    return 7;
  }
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

function _genererDonneesTheoriques(p) {
  const vMax = p.Ve * 1.8;
  const pas = Math.max(p.Ve / 80, 0.05);
  const vols = [], phs = [];
  for (let v = 0; v <= vMax; v += pas) {
    vols.push(+v.toFixed(3));
    phs.push(+_calcPH(v, p).toFixed(3));
  }
  return { vols, phs };
}

function _initBoutonGenererTheorique() {
  const btn = document.getElementById('btn-generer-theorique');
  if (!btn) return;
  btn.addEventListener('click', () => {
    _theorique = _genererDonneesTheoriques(_params);
    _dessinerGraphe();
  });
}

// ══════════════════════════════════════════════════════════════
// TABLEAU DE MESURES DYNAMIQUE
// ══════════════════════════════════════════════════════════════
function _initTableauMesures() {
  // ligne de départ
  if (_mesures.length === 0) _mesures.push({ v: 0, ph: null });

  document.getElementById('btn-ajouter-mesure')?.addEventListener('click', () => {
    const pas = parseFloat(document.getElementById('pas-rapide')?.value) || 0.5;
    const dernier = _mesures[_mesures.length - 1];
    const v = dernier ? +(dernier.v + pas).toFixed(2) : 0;
    _mesures.push({ v, ph: null });
    _majTableau();
  });

  document.getElementById('btn-vider-mesures')?.addEventListener('click', () => {
    _mesures = [{ v: 0, ph: null }];
    _resultatTangentes = null;
    _resultatDerivee = null;
    _majTableau();
    _dessinerGraphe();
  });

  _majTableau();
}

function _majTableau() {
  const tbody = document.getElementById('tbody-mesures');
  if (!tbody) return;
  tbody.innerHTML = '';

  _mesures.forEach((m, i) => {
    const tr = document.createElement('tr');

    const tdV = document.createElement('td');
    tdV.className = 'saisie';
    const inpV = document.createElement('input');
    inpV.type = 'number';
    inpV.step = '0.05';
    inpV.value = m.v;
    inpV.addEventListener('input', () => {
      m.v = parseFloat(inpV.value) || 0;
      _dessinerGraphe();
    });
    tdV.appendChild(inpV);

    const tdPh = document.createElement('td');
    tdPh.className = 'saisie';
    const inpPh = document.createElement('input');
    inpPh.type = 'number';
    inpPh.step = '0.01';
    inpPh.value = m.ph ?? '';
    inpPh.placeholder = '—';
    inpPh.addEventListener('input', () => {
      m.ph = inpPh.value === '' ? null : parseFloat(inpPh.value);
      _dessinerGraphe();
    });
    tdPh.appendChild(inpPh);

    const tdDel = document.createElement('td');
    const btnDel = document.createElement('button');
    btnDel.textContent = '🗑';
    btnDel.style.padding = '4px 10px';
    btnDel.addEventListener('click', () => {
      _mesures.splice(i, 1);
      if (_mesures.length === 0) _mesures.push({ v: 0, ph: null });
      _majTableau();
      _dessinerGraphe();
    });
    tdDel.appendChild(btnDel);

    tr.append(tdV, tdPh, tdDel);
    tbody.appendChild(tr);
  });
}

// ── Points expérimentaux valides, triés par volume ─────────────
function _pointsExperimentaux() {
  return _mesures
    .filter(m => m.ph !== null && !isNaN(m.ph) && !isNaN(m.v))
    .map(m => ({ v: m.v, ph: m.ph }))
    .sort((a, b) => a.v - b.v);
}

function _pointsTheoriques() {
  return _theorique.vols.map((v, i) => ({ v, ph: _theorique.phs[i] }));
}

// Courbe utilisée pour les calculs (tangentes / dérivée) :
// priorité aux mesures expérimentales si suffisamment de points, sinon théorique.
function _courbeActive() {
  const exp = _pointsExperimentaux();
  if (exp.length >= 4) return exp;
  const theo = _pointsTheoriques();
  return theo.length >= 4 ? theo : [];
}

// ══════════════════════════════════════════════════════════════
// CASES À COCHER
// ══════════════════════════════════════════════════════════════
function _initCheckboxes() {
  ['chk-experimentale', 'chk-theorique', 'chk-conductimetrie', 'chk-tangentes', 'chk-derivee']
    .forEach(id => document.getElementById(id)?.addEventListener('change', _dessinerGraphe));
}

// ══════════════════════════════════════════════════════════════
// TRACÉ PRINCIPAL
// ══════════════════════════════════════════════════════════════
function _dessinerGraphe() {
  const canvas = document.getElementById('canvas-titrage');
  if (!canvas) return;

  const W = canvas.offsetWidth || 700;
  const H = 400;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const exp = _pointsExperimentaux();
  const theo = _pointsTheoriques();
  const afficherExp = document.getElementById('chk-experimentale')?.checked;
  const afficherTheo = document.getElementById('chk-theorique')?.checked;
  const afficherCond = document.getElementById('chk-conductimetrie')?.checked;
  const afficherTangentes = document.getElementById('chk-tangentes')?.checked;
  const afficherDerivee = document.getElementById('chk-derivee')?.checked;

  // ── Étendue des axes ──
  let vMin = 0, vMax = _params.Ve ? _params.Ve * 1.8 : 40;
  if (_zoom) { vMin = _zoom.vmin; vMax = _zoom.vmax; }

  const tousPoints = [...(afficherExp ? exp : []), ...(afficherTheo ? theo : [])];
  let phMin = 0, phMax = 14;
  if (tousPoints.length) {
    phMin = Math.max(0, Math.min(...tousPoints.map(p => p.ph)) - 1);
    phMax = Math.min(14, Math.max(...tousPoints.map(p => p.ph)) + 1);
  }

  const pad = { top: 24, right: 56, bottom: 48, left: 56 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;
  const xScale = v => pad.left + ((v - vMin) / (vMax - vMin)) * cw;
  const yScale = ph => pad.top + (1 - (ph - phMin) / (phMax - phMin)) * ch;

  _chartScale = { pad, cw, ch, vMin, vMax, phMin, phMax, xScale, yScale, W, H };

  // ── Fond + grille ──
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#6b7280';
  for (let ph = Math.ceil(phMin); ph <= Math.floor(phMax); ph++) {
    const y = yScale(ph);
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
    ctx.fillText(ph, 8, y + 4);
  }
  const pasV = _joliPas(vMax - vMin);
  for (let v = Math.ceil(vMin / pasV) * pasV; v <= vMax; v += pasV) {
    const x = xScale(v);
    ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, H - pad.bottom); ctx.stroke();
    ctx.fillText(v.toFixed(1), x - 10, H - pad.bottom + 16);
  }
  ctx.fillText('V (mL)', W - pad.right - 10, H - 10);
  ctx.save(); ctx.translate(14, pad.top + 10); ctx.fillText('pH', 0, 0); ctx.restore();

  // ── Courbe théorique ──
  if (afficherTheo && theo.length) _tracerLigne(ctx, theo, xScale, yScale, '#94a3b8', false);

  // ── Courbe expérimentale (points + ligne) ──
  if (afficherExp && exp.length) _tracerLigne(ctx, exp, xScale, yScale, '#1B6CA8', true);

  // ── Conductimétrie (axe secondaire) ──
  if (afficherCond) _dessinerConductimetrie(ctx, xScale, vMin, vMax, pad, ch, H);

  // ── Méthode des tangentes ──
  const resTan = document.getElementById('resultat-tangentes');
  if (afficherTangentes) {
    const courbe = _courbeActive();
    if (courbe.length >= 4) {
      _resultatTangentes = _calculerTangentes(courbe);
      if (_resultatTangentes) _dessinerTangentes(ctx, _resultatTangentes, xScale, yScale, vMin, vMax);
      if (resTan) resTan.style.display = _resultatTangentes ? 'block' : 'none';
      if (_resultatTangentes) {
        document.getElementById('ve-tangentes').textContent = _resultatTangentes.Ve.toFixed(2);
        document.getElementById('ca-tangentes').textContent = _resultatTangentes.Ce.toFixed(4);
      }
    } else if (resTan) resTan.style.display = 'none';
  } else if (resTan) { resTan.style.display = 'none'; _resultatTangentes = null; }

  // ── Méthode des dérivées ──
  const canvasDer = document.getElementById('canvas-derivee');
  const resDer = document.getElementById('resultat-derivee');
  if (afficherDerivee) {
    canvasDer.style.display = 'block';
    const courbe = _courbeActive();
    if (courbe.length >= 4) {
      _resultatDerivee = _calculerDerivee(courbe);
      _dessinerCourbeDerivee(courbe, _resultatDerivee);
      if (resDer) resDer.style.display = 'block';
      if (_resultatDerivee) {
        document.getElementById('ve-derivee').textContent = _resultatDerivee.Ve.toFixed(2);
        document.getElementById('ca-derivee').textContent = _resultatDerivee.Ce.toFixed(4);
      }
    } else if (resDer) resDer.style.display = 'none';
  } else {
    canvasDer.style.display = 'none';
    if (resDer) resDer.style.display = 'none';
    _resultatDerivee = null;
  }

  _majComparaison();
}

function _joliPas(etendue) {
  const brut = etendue / 8;
  const ordre = Math.pow(10, Math.floor(Math.log10(brut)));
  const n = brut / ordre;
  const pas = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10;
  return pas * ordre;
}

function _tracerLigne(ctx, points, xScale, yScale, couleur, avecPoints) {
  ctx.beginPath();
  ctx.strokeStyle = couleur;
  ctx.lineWidth = 2;
  points.forEach((p, i) => {
    const x = xScale(p.v), y = yScale(p.ph);
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();
  if (avecPoints) {
    ctx.fillStyle = couleur;
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(xScale(p.v), yScale(p.ph), 3.5, 0, 2 * Math.PI);
      ctx.fill();
    });
  }
}

function _dessinerConductimetrie(ctx, xScale, vMin, vMax, pad, ch, H) {
  const { Va, Ca, Cb } = _params;
  const Ve = (Ca * Va) / Cb;
  const pts = [];
  for (let v = vMin; v <= vMax; v += (vMax - vMin) / 60) {
    let sigma;
    if (v <= Ve) {
      sigma = 350 * (Ca * Va - Cb * v) / (Va + v) * 1e-3 + 76.4 * Cb * v / (Va + v) * 1e-3;
    } else {
      sigma = 0.5 + 198 * Cb * (v - Ve) / (Va + v) * 1e-3;
    }
    pts.push({ v, sigma: Math.max(sigma, 0.01) });
  }
  const maxS = Math.max(...pts.map(p => p.sigma)) * 1.1;
  const yS = s => pad.top + (1 - s / maxS) * ch;
  ctx.beginPath();
  ctx.strokeStyle = '#27AE60';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 3]);
  pts.forEach((p, i) => {
    const x = xScale(p.v), y = yS(p.sigma);
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#27AE60';
  ctx.font = '11px sans-serif';
  ctx.fillText('σ (mS/cm)', H ? ctx.canvas.width / (window.devicePixelRatio || 1) - pad.right + 4 : 0, pad.top + 10);
}

// ══════════════════════════════════════════════════════════════
// BLOC 3 — MÉTHODE DES TANGENTES
// ══════════════════════════════════════════════════════════════
function _regressionLineaire(points) {
  const n = points.length;
  if (n < 2) return null;
  let sx = 0, sy = 0, sxy = 0, sxx = 0;
  points.forEach(p => { sx += p.v; sy += p.ph; sxy += p.v * p.ph; sxx += p.v * p.v; });
  const denom = n * sxx - sx * sx;
  if (Math.abs(denom) < 1e-12) return null;
  const m = (n * sxy - sx * sy) / denom;
  const b = (sy - m * sx) / n;
  return { m, b };
}

function _distancePointDroite(p, droite) {
  const { m, b } = droite;
  return Math.abs(m * p.v - p.ph + b) / Math.sqrt(m * m + 1);
}

function _calculerTangentes(courbe) {
  // 1) localiser le point d'inflexion (plus forte pente locale)
  let idxInflex = 1, maxPente = -Infinity;
  for (let i = 1; i < courbe.length - 1; i++) {
    const pente = Math.abs((courbe[i + 1].ph - courbe[i - 1].ph) / (courbe[i + 1].v - courbe[i - 1].v));
    if (pente > maxPente) { maxPente = pente; idxInflex = i; }
  }

  // 2) zones "avant" et "après" l'équivalence, en excluant une marge autour
  const marge = Math.max(2, Math.round(courbe.length * 0.12));
  const avant = courbe.slice(0, Math.max(2, idxInflex - marge));
  const apres = courbe.slice(Math.min(courbe.length - 2, idxInflex + marge));

  if (avant.length < 2 || apres.length < 2) return null;

  const droite1 = _regressionLineaire(avant);
  const droite2 = _regressionLineaire(apres);
  if (!droite1 || !droite2) return null;

  // 3) Ve = point de la courbe équidistant des deux tangentes
  //    (construction équivalente à la médiatrice perpendiculaire des deux tangentes parallèles)
  let meilleurV = courbe[idxInflex].v, meilleurEcart = Infinity;
  courbe.forEach(p => {
    const d1 = _distancePointDroite(p, droite1);
    const d2 = _distancePointDroite(p, droite2);
    const ecart = Math.abs(d1 - d2);
    if (ecart < meilleurEcart) { meilleurEcart = ecart; meilleurV = p.v; }
  });

  const { Va, Cb } = _params;
  const Ce = (Cb * meilleurV) / Va;

  return { Ve: meilleurV, Ce, droite1, droite2, avant, apres };
}

function _dessinerTangentes(ctx, res, xScale, yScale, vMin, vMax) {
  const tracerDroite = (droite, vDebut, vFin, couleur) => {
    ctx.beginPath();
    ctx.strokeStyle = couleur;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.moveTo(xScale(vDebut), yScale(droite.m * vDebut + droite.b));
    ctx.lineTo(xScale(vFin), yScale(droite.m * vFin + droite.b));
    ctx.stroke();
    ctx.setLineDash([]);
  };
  // tangentes prolongées sur toute la largeur visible pour bien voir l'intersection
  tracerDroite(res.droite1, vMin, vMax, '#D97706');
  tracerDroite(res.droite2, vMin, vMax, '#D97706');

  // marqueur Ve
  const x = xScale(res.Ve);
  ctx.beginPath();
  ctx.strokeStyle = '#DC2626';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([2, 3]);
  ctx.moveTo(x, ctx.canvas.height / (window.devicePixelRatio || 1) - 1);
  ctx.lineTo(x, 0);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#DC2626';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText(`Ve = ${res.Ve.toFixed(2)} mL`, x + 4, 14);
}

// ══════════════════════════════════════════════════════════════
// BLOC 4 — MÉTHODE DES DÉRIVÉES
// ══════════════════════════════════════════════════════════════
function _calculerDerivee(courbe) {
  const deriv = [{ v: courbe[0].v, d: 0 }];
  for (let i = 1; i < courbe.length - 1; i++) {
    const dV = courbe[i + 1].v - courbe[i - 1].v;
    const dPh = courbe[i + 1].ph - courbe[i - 1].ph;
    deriv.push({ v: courbe[i].v, d: dV ? dPh / dV : 0 });
  }
  deriv.push({ v: courbe[courbe.length - 1].v, d: 0 });

  // recherche du maximum
  let idx = 0, maxVal = -Infinity;
  deriv.forEach((p, i) => { if (p.d > maxVal) { maxVal = p.d; idx = i; } });

  // interpolation parabolique pour affiner Ve (sous-résolution)
  let Ve = deriv[idx].v;
  if (idx > 0 && idx < deriv.length - 1) {
    const y0 = deriv[idx - 1].d, y1 = deriv[idx].d, y2 = deriv[idx + 1].d;
    const denom = (y0 - 2 * y1 + y2);
    if (Math.abs(denom) > 1e-9) {
      const offset = 0.5 * (y0 - y2) / denom;
      const h = (deriv[idx + 1].v - deriv[idx - 1].v) / 2;
      Ve = deriv[idx].v + offset * h;
    }
  }

  const { Va, Cb } = _params;
  const Ce = (Cb * Ve) / Va;
  return { Ve, Ce, courbeDerivee: deriv, idxPic: idx };
}

function _dessinerCourbeDerivee(courbe, res) {
  const canvas = document.getElementById('canvas-derivee');
  if (!canvas || !res) return;
  const W = canvas.offsetWidth || 700;
  const H = 180;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);

  const pad = { top: 16, right: 20, bottom: 30, left: 50 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;
  const vMin = courbe[0].v, vMax = courbe[courbe.length - 1].v;
  const dVals = res.courbeDerivee.map(p => p.d);
  const dMax = Math.max(...dVals, 0.01) * 1.15;

  const xScale = v => pad.left + ((v - vMin) / (vMax - vMin)) * cw;
  const yScale = d => pad.top + (1 - d / dMax) * ch;

  ctx.strokeStyle = '#e5e7eb';
  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.beginPath(); ctx.moveTo(pad.left, pad.top); ctx.lineTo(pad.left, H - pad.bottom); ctx.lineTo(W - pad.right, H - pad.bottom); ctx.stroke();
  ctx.fillText('ΔpH/ΔV', 4, pad.top + 8);
  ctx.fillText('V (mL)', W - pad.right - 30, H - 8);

  ctx.beginPath();
  ctx.strokeStyle = '#7C3AED';
  ctx.lineWidth = 2;
  res.courbeDerivee.forEach((p, i) => {
    const x = xScale(p.v), y = yScale(Math.max(p.d, 0));
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();

  // marqueur du pic
  const xPic = xScale(res.Ve);
  ctx.beginPath();
  ctx.strokeStyle = '#DC2626';
  ctx.setLineDash([2, 3]);
  ctx.moveTo(xPic, H - pad.bottom);
  ctx.lineTo(xPic, pad.top);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#DC2626';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText(`Ve = ${res.Ve.toFixed(2)} mL`, xPic + 4, pad.top + 12);
}

// ── Comparaison tangentes / dérivée ─────────────────────────────
function _majComparaison() {
  const el = document.getElementById('resultat-comparaison');
  if (!el) return;
  if (_resultatTangentes && _resultatDerivee) {
    const ecart = Math.abs(_resultatTangentes.Ve - _resultatDerivee.Ve);
    const moyenne = (_resultatTangentes.Ve + _resultatDerivee.Ve) / 2;
    const erreurRel = moyenne ? (ecart / moyenne) * 100 : 0;
    document.getElementById('ecart-ve').textContent = ecart.toFixed(2);
    document.getElementById('erreur-relative').textContent = erreurRel.toFixed(2);
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}

// ══════════════════════════════════════════════════════════════
// CURSEUR INTERACTIF + ZOOM (drag horizontal)
// ══════════════════════════════════════════════════════════════
function _initCanvasInteractions() {
  const canvas = document.getElementById('canvas-titrage');
  const info = document.getElementById('curseur-info');
  if (!canvas) return;

  canvas.addEventListener('mousemove', (e) => {
    if (!_chartScale) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (_drag) {
      _dessinerGraphe();
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(27,108,168,0.15)';
      ctx.fillRect(Math.min(_drag.xStart, x), _chartScale.pad.top, Math.abs(x - _drag.xStart), _chartScale.ch);
      return;
    }

    const { pad, cw, vMin, vMax } = _chartScale;
    if (x < pad.left || x > pad.left + cw) { info.style.display = 'none'; return; }
    const v = vMin + ((x - pad.left) / cw) * (vMax - vMin);

    const courbe = _pointsExperimentaux().length ? _pointsExperimentaux() : _pointsTheoriques();
    const ph = _interpoler(courbe, v);

    info.style.display = ph === null ? 'none' : 'block';
    if (ph !== null) {
      info.style.left = `${x + 12}px`;
      info.style.top = `${y - 10}px`;
      info.textContent = `V = ${v.toFixed(2)} mL  •  pH = ${ph.toFixed(2)}`;
    }
  });

  canvas.addEventListener('mouseleave', () => {
    info.style.display = 'none';
    _drag = null;
  });

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    _drag = { xStart: e.clientX - rect.left };
  });

  canvas.addEventListener('mouseup', (e) => {
    if (!_drag || !_chartScale) { _drag = null; return; }
    const rect = canvas.getBoundingClientRect();
    const xEnd = e.clientX - rect.left;
    const { pad, cw, vMin, vMax } = _chartScale;
    const v1 = vMin + ((_drag.xStart - pad.left) / cw) * (vMax - vMin);
    const v2 = vMin + ((xEnd - pad.left) / cw) * (vMax - vMin);
    _drag = null;
    if (Math.abs(v2 - v1) > (vMax - vMin) * 0.02) {
      _zoom = { vmin: Math.min(v1, v2), vmax: Math.max(v1, v2) };
    }
    _dessinerGraphe();
  });

  document.getElementById('btn-zoom-reset')?.addEventListener('click', () => {
    _zoom = null;
    _dessinerGraphe();
  });
}

function _interpoler(courbe, v) {
  if (!courbe.length) return null;
  if (v <= courbe[0].v) return courbe[0].ph;
  if (v >= courbe[courbe.length - 1].v) return courbe[courbe.length - 1].ph;
  for (let i = 0; i < courbe.length - 1; i++) {
    if (v >= courbe[i].v && v <= courbe[i + 1].v) {
      const t = (v - courbe[i].v) / (courbe[i + 1].v - courbe[i].v || 1);
      return courbe[i].ph + t * (courbe[i + 1].ph - courbe[i].ph);
    }
  }
  return null;
}

// init() appelée par navigation.js au chargement du module
if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
