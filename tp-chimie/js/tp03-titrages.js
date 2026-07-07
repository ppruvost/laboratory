// tp03-titrages.js — Titrages acido-basiques

import products from "../../data/products.js";
import dangerDB from "../../data/dangerDB.js";
import pictogrammes from "../../data/pictogrammes.js";
import glassware from "../../data/glassware.js";
import laboratoryEquipment from "../../data/equipment.js";
import { initSections, initTabs, imgSrc } from '../../js/utils.js';
import { genererCompteRendu } from '../../js/compte-rendu.js';

// ── Constantes chimiques ────────────────────────────────────────
const Ke = 1e-14;

// Chaque entrée = { label, pKa: [Ka1, Ka2, ...] } dans l'ordre croissant
// (pKa1 = première acidité, la plus forte, donc le pKa le plus bas)
const PKA_SETS = {
  // Monoacides / monobases faibles
  CH3COOH: { label: "CH₃COOH / CH₃COO⁻ (acide acétique)",  pKa: [4.76] },
  HF:      { label: "HF / F⁻ (acide fluorhydrique)",        pKa: [3.17] },
  HNO2:    { label: "HNO₂ / NO₂⁻ (acide nitreux)",          pKa: [3.37] },
  "NH4+":  { label: "NH₄⁺ / NH₃ (ammonium / ammoniac)",     pKa: [9.25] },
  H2O2:    { label: "H₂O₂ / HO₂⁻ (eau oxygénée)",           pKa: [11.7] },
  H3BO3:   { label: "H₃BO₃ / H₂BO₃⁻ (acide borique)",       pKa: [9.24] },

  // Polyacides — plusieurs sauts de pH
  H2C2O4:  { label: "H₂C₂O₄ — acide oxalique (diacide)",         pKa: [1.25, 4.27] },
  H2CO3:   { label: "H₂CO₃ — acide carbonique (diacide)",        pKa: [6.35, 10.33] },
  H2S:     { label: "H₂S — sulfure d'hydrogène (diacide)",       pKa: [7.02, 12.90] },
  H3PO4:   { label: "H₃PO₄ — acide phosphorique (triacide)",     pKa: [2.15, 7.20, 12.35] },
  H4EDTA:  { label: "H₄EDTA — EDTA (tétraacide)",                pKa: [2.00, 2.67, 6.16, 10.26] },
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
let _resultatTangentes = null; // { Ve, Ce, pHE, droite1, droite2, mCommun, ... }
let _resultatDerivee = null;   // { Ve, Ce, peakIdx }
let _reactifCourant = null;

// ══════════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════════
export function init() {
  initSections();
  initTabs();
  initMateriel();
  
  _initReactifs();
  _initParametres();
  _initTableauMesures();
  _initCheckboxes();
  _initCanvasInteractions();
  _initBoutonGenererTheorique();
  _initCorrectionErreurs();
  _initExportEtCompteRendu();
  _dessinerGraphe();
}

// ==========================================================
//  OUTILS
//  ==========================================================
function imgSrc(chemin) {
  if (!chemin) return "";
  if (
    chemin.startsWith("http") ||
    chemin.startsWith("/") ||
    chemin.startsWith("../") ||
    chemin.startsWith("./")
  ) {
    return chemin;
  }
  if (chemin.startsWith("assets/")) {
    return "../" + chemin;
  }
  return "../tp-chimie/assets/images/" + chemin;
}
// ══════════════════════════════════════════════════════════════
// SÉCURITÉ — SÉLECTION DU RÉACTIF (aligné sur tp01-solutions.js)
// ══════════════════════════════════════════════════════════════

// Gestion multi-catégories, identique à TP01
function _appartientCategorie(produit, categorie) {
  if (!produit.categorie) return false;
  return Array.isArray(produit.categorie)
    ? produit.categorie.includes(categorie)
    : produit.categorie === categorie;
}

function _initReactifs() {
  const select = document.getElementById('reactif');
  if (!select) return;

  _remplirListeReactifs();

  select.addEventListener('change', _afficherSecurite);

  document.querySelectorAll('.filtre-cat').forEach(cb => {
    cb.addEventListener('change', _remplirListeReactifs);
  });
}

function _remplirListeReactifs() {
  const select = document.getElementById('reactif');
  if (!select) return;

  // catégories cochées
  const categories = [...document.querySelectorAll('.filtre-cat:checked')]
    .map(cb => cb.value);

  if (categories.length === 0) {
    select.innerHTML = '<option value="">-- Aucun filtre sélectionné --</option>';
    return;
  }

  const valeur = select.value;

  select.innerHTML = '<option value="">-- Sélectionner --</option>';

  products
    .filter(p => categories.some(cat => _appartientCategorie(p, cat)))
    .sort((a, b) => a.nom.localeCompare(b.nom))
    .forEach(p => {
      const option = document.createElement('option');
      option.value = p.cas;
      option.textContent = p.nom;
      if (p.cas === valeur) option.selected = true;
      select.appendChild(option);
    });

  // si sélection invalide → on repart sur "-- Sélectionner --" (pas de choix forcé)
  if (select.selectedIndex === -1) select.selectedIndex = 0;

  _afficherSecurite();
}

function _afficherSecurite() {
  const select = document.getElementById('reactif');
  const zone = document.getElementById('securite-bloc');
  if (!select || !zone) return;

  if (!select.value) {
    zone.innerHTML = '<div class="info">Sélectionner un réactif.</div>';
    return;
  }

  const produit = products.find(p => p.cas === select.value);
  if (!produit) return;
  _reactifCourant = produit;

  let html = `<h3 style="margin-bottom:.5rem;">${produit.nom}</h3>
  <p><strong>Formule :</strong>
     <span style="font-family:var(--font-code);color:var(--bleu-cuivre);">${produit.formule || ''}</span>
  </p>`;

  if (produit.dangers?.length) {
    html += `<div class="pictos-clp">`;
    produit.dangers.forEach(code => {
      const picto = pictogrammes.find(p => p.code === code);
      if (picto) html += `<img class="picto-clp" src="../../assets/picto/${picto.image}" alt="${code}" title="${code}">`;
    });
    html += `</div>`;
    html += `<div class="danger-bloc"><h4>⚠️ Mentions de danger (H)</h4><ul>`;
    produit.dangers.forEach(code => {
      const h = dangerDB.find(d => d.code === code);
      if (h) html += `<li><strong>${code}</strong> : ${h.text ?? h.texte ?? ''}</li>`;
    });
    html += `</ul></div>`;
  }

  if (produit.prevention?.length) {
    html += `<div class="prevention-bloc"><h4>🛡️ Conseils de prudence (P)</h4><ul>`;
    produit.prevention.forEach(code => {
      const p = dangerDB.find(d => d.code === code);
      if (p) html += `<li><strong>${code}</strong> : ${p.text ?? p.texte ?? ''}</li>`;
    });
    html += `</ul></div>`;
  }

  zone.innerHTML = html;
}
/* ==========================================================
   MATERIEL
   ========================================================== */
function initMateriel() {

    const divV = document.getElementById("materiel-verrerie");
    const divE = document.getElementById("materiel-equipements");

    if (!divV || !divE) return;

    const verres = glassware.filter(v => _appartientCategorie(v, "pHmétrie"));

    divV.innerHTML = verres.map(v => {
        const src = imgSrc(v.image, "glassware");
        return `<label class="item-materiel">
          <input type="checkbox" class="materiel-check-input">
          <span class="icone-materiel">${src ? `<img src="${src}" alt="${v.nom}" onerror="this.style.display='none'">` : `🧪`}</span>
          <span class="materiel-info">
            <strong>${v.nom}</strong>
            <span class="materiel-detail">${v.contenance_ml ? v.contenance_ml + " mL" : ""}</span>
            <span class="materiel-detail lieu">${v.lieu ?? ""}</span>
          </span>
        </label>`;
    }).join("");

    const equips = laboratoryEquipment.filter(e => _appartientCategorie(e, "pHmétrie"));

    divE.innerHTML = equips.map(e => {
        const src = imgSrc(e.image, "equipment");
        return `<label class="item-materiel">
          <input type="checkbox" class="materiel-check-input">
          <span class="icone-materiel">${src ? `<img src="${src}" alt="${e.nom}" onerror="this.style.display='none'">` : `🔬`}</span>
          <span class="materiel-info">
            <strong>${e.nom}</strong>
            <span class="materiel-detail">${e.description ?? ""}</span>
            <span class="materiel-detail lieu">${e.lieu ?? ""}</span>
          </span>
        </label>`;
    }).join("");
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

  const cle = document.getElementById('pka-select')?.value || 'CH3COOH';
  const jeu = PKA_SETS[cle] || PKA_SETS['CH3COOH'];

  _params = {
    Va, Ca, Cb,
    typeAcide: document.getElementById('sel-acide')?.value || 'fort',
    typeBase:  document.getElementById('sel-base')?.value  || 'fort',
    pKaArray:  jeu.pKa,
    n:         jeu.pKa.length,
  };
  _params.Ve = (Ca * Va) / Cb; // volume par équivalence (1 proton)

  const elVe = document.getElementById('ve-theo');
  if (elVe) {
    if (_params.typeAcide === 'faible' && _params.n > 1) {
      const points = Array.from({ length: _params.n }, (_, i) => (_params.Ve * (i + 1)).toFixed(2));
      elVe.textContent = `${points.join(' mL, ')} mL  (${_params.n} équivalences)`;
    } else {
      elVe.textContent = `${_params.Ve.toFixed(2)} mL`;
    }
  }

  _dessinerGraphe();
}

// ══════════════════════════════════════════════════════════════
// pH THÉORIQUE (pour la courbe simulée)
// ══════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════
// pH d'un polyacide faible (n protons acides, pKa croissants)
// titré par une base forte, à un volume Vb donné.
// Résolution numérique du bilan de charge par bissection
// (dichotomie géométrique sur [H+], robuste sur 14 décades).
// ══════════════════════════════════════════════════════════════
function _pHPolyacideFaibleBaseForte(Vb, Va, Ca, Cb, pKaArray) {
  const n  = pKaArray.length;
  const Ka = pKaArray.map(pk => Math.pow(10, -pk));
  const V  = (Va + Vb) / 1000;
  const C      = (Ca * Va) / 1000 / V;   // concentration analytique totale de l'acide
  const Cbase  = (Cb * Vb) / 1000 / V;   // [Na+] apporté par la burette

  function f(h) {
    // termes[i] = produit des i premiers Ka × h^(n-i), pour i = 0..n
    const termes = [Math.pow(h, n)];
    let cumKa = 1;
    for (let i = 0; i < n; i++) {
      cumKa *= Ka[i];
      termes.push(cumKa * Math.pow(h, n - 1 - i));
    }
    const D = termes.reduce((a, b) => a + b, 0);

    let sommeCharges = 0; // Σ i·[espèce i- fois chargée] / C
    for (let i = 1; i <= n; i++) sommeCharges += i * termes[i] / D;

    return Cbase + h - (Ke / h) - C * sommeCharges;
  }

  let lo = 1e-14, hi = 1;      // bornes en [H+], soit pH ∈ [0, 14]
  let flo = f(lo);
  for (let iter = 0; iter < 80; iter++) {
    const mid  = Math.sqrt(lo * hi); // moyenne géométrique = dichotomie en pH
    const fmid = f(mid);
    if (Math.abs(fmid) < 1e-15) return -Math.log10(mid);
    if ((fmid > 0) === (flo > 0)) { lo = mid; flo = fmid; }
    else { hi = mid; }
  }
  return -Math.log10(Math.sqrt(lo * hi));
}

function _calcPH(Vb, p) {
  const { Va, Ca, Cb, typeAcide, typeBase, pKaArray } = p;
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
    const jeu = (pKaArray && pKaArray.length) ? pKaArray : PKA_SETS['CH3COOH'].pKa;
    return _pHPolyacideFaibleBaseForte(Vb, Va, Ca, Cb, jeu);
  }

  if (typeAcide === 'fort' && typeBase === 'faible') {
    const pKa1 = (pKaArray && pKaArray[0]) || PKA_SETS['NH4+'].pKa[0];
    const Kb = Math.pow(10, -(14 - pKa1));
    const Ka = Ke / Kb;
    if (nb < na - eps) return -Math.log10((na - nb) / Vt);
    if (Math.abs(nb - na) <= eps) {
      const cSel = na / Vt;
      const h = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * cSel)) / 2;
      return -Math.log10(h);
    }
    return (14 - pKa1) + Math.log10((nb - na) / Vt);
  }
  return 7;
}

function _genererDonneesTheoriques(p) {
  const facteur = (p.typeAcide === 'faible') ? Math.max(1, p.n || 1) : 1;
  const vMax = p.Ve * facteur * 1.8;
  const pas = Math.max(vMax / 200, 0.05); // un peu plus de résolution pour les polyacides
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
// INTERPOLATION SPLINE DE CATMULL-ROM
// ══════════════════════════════════════════════════════════════
// Génère une courbe lisse passant exactement par tous les points fournis
// (contrairement à une régression, la spline interpole — elle ne modifie
// aucune valeur mesurée). `segments` = nombre de points générés entre
// chaque paire de points consécutifs (⇒ plusieurs centaines de points
// au total pour un jeu de mesures typique).
function _catmullRomSpline(points, segments = 24) {
  const n = points.length;
  if (n < 3) return points.slice();

  const result = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const nbPas = i === n - 2 ? segments : segments; // uniforme
    for (let t = 0; t < nbPas; t++) {
      const s = t / nbPas;
      const s2 = s * s;
      const s3 = s2 * s;

      const v = 0.5 * (
        (2 * p1.v) +
        (-p0.v + p2.v) * s +
        (2 * p0.v - 5 * p1.v + 4 * p2.v - p3.v) * s2 +
        (-p0.v + 3 * p1.v - 3 * p2.v + p3.v) * s3
      );
      const ph = 0.5 * (
        (2 * p1.ph) +
        (-p0.ph + p2.ph) * s +
        (2 * p0.ph - 5 * p1.ph + 4 * p2.ph - p3.ph) * s2 +
        (-p0.ph + 3 * p1.ph - 3 * p2.ph + p3.ph) * s3
      );
      result.push({ v, ph });
    }
  }
  result.push(points[n - 1]);
  return result;
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

  // ── Fond + grille (style "manuel") ──
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);

  // quadrillage gris clair
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  for (let ph = Math.ceil(phMin); ph <= Math.floor(phMax); ph++) {
    const y = yScale(ph);
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
  }
  const pasV = _joliPas(vMax - vMin);
  for (let v = Math.ceil(vMin / pasV) * pasV; v <= vMax; v += pasV) {
    const x = xScale(v);
    ctx.beginPath(); ctx.moveTo(x, pad.top); ctx.lineTo(x, H - pad.bottom); ctx.stroke();
  }

  // axes noirs (cadre gauche + bas)
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, H - pad.bottom);
  ctx.lineTo(W - pad.right, H - pad.bottom);
  ctx.stroke();

  // graduations épaisses + libellés (police Arial, aucune légende)
  ctx.font = '12px Arial';
  ctx.fillStyle = '#000';
  ctx.lineWidth = 2;
  for (let ph = Math.ceil(phMin); ph <= Math.floor(phMax); ph++) {
    const y = yScale(ph);
    ctx.beginPath(); ctx.moveTo(pad.left - 5, y); ctx.lineTo(pad.left, y); ctx.stroke();
    ctx.fillText(ph, pad.left - 24, y + 4);
  }
  for (let v = Math.ceil(vMin / pasV) * pasV; v <= vMax; v += pasV) {
    const x = xScale(v);
    ctx.beginPath(); ctx.moveTo(x, H - pad.bottom); ctx.lineTo(x, H - pad.bottom + 5); ctx.stroke();
    ctx.fillText(v.toFixed(1), x - 10, H - pad.bottom + 18);
  }

  // titres d'axes : uniquement "pH" et "VB (mL)"
  ctx.font = 'bold 13px Arial';
  ctx.fillText('VB (mL)', W - pad.right - 40, H - 8);
  ctx.save();
  ctx.translate(16, pad.top + 12);
  ctx.fillText('pH', 0, 0);
  ctx.restore();

  // ── Courbe théorique (gris clair, trait plein fin) ──
  if (afficherTheo && theo.length) _tracerCourbeTheorique(ctx, theo, xScale, yScale);

  // ── Courbe expérimentale (rouge pointillé + marqueurs "+", spline Catmull-Rom) ──
  if (afficherExp && exp.length) _tracerCourbeExperimentale(ctx, exp, xScale, yScale);

  // ── Conductimétrie (axe secondaire) ──
  if (afficherCond) _dessinerConductimetrie(ctx, xScale, vMin, vMax, pad, ch, H);

  // ── Méthode des tangentes parallèles ──
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

  // ── Point d'équivalence E (bleu) sur le graphe principal ──
  const veAffiche = _resultatTangentes?.Ve ?? _resultatDerivee?.Ve ?? null;
  if (veAffiche !== null) {
    let phE = null;
    if (_resultatTangentes && _resultatTangentes.Ve === veAffiche) {
      phE = _resultatTangentes.pHE;
    } else {
      const courbePourPHE = _courbeActive();
      phE = _interpoler(courbePourPHE, veAffiche);
    }
    if (phE !== null && phE !== undefined) _dessinerPointEquivalence(ctx, veAffiche, phE, xScale, yScale, pad, H);
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

// ── Courbe théorique : gris clair, trait plein fin, sans marqueurs ──
function _tracerCourbeTheorique(ctx, points, xScale, yScale) {
  ctx.beginPath();
  ctx.strokeStyle = '#c9c9c9';
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  points.forEach((p, i) => {
    const x = xScale(p.v), y = yScale(p.ph);
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();
}

// ── Courbe expérimentale : rouge pointillé, interpolée par spline de
//    Catmull-Rom (courbe continue lisse, sans "droites brisées"),
//    + marqueurs "+" placés exactement sur les points réellement mesurés ──
function _tracerCourbeExperimentale(ctx, points, xScale, yScale) {
  const dense = points.length >= 3 ? _catmullRomSpline(points, 24) : points;

  ctx.beginPath();
  ctx.strokeStyle = '#d60000';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.lineJoin = 'round';
  dense.forEach((p, i) => {
    const x = xScale(p.v), y = yScale(p.ph);
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  // marqueurs "+" sur les points réellement mesurés (données non modifiées)
  ctx.strokeStyle = '#d60000';
  ctx.lineWidth = 2;
  points.forEach(p => {
    const x = xScale(p.v), y = yScale(p.ph);
    ctx.beginPath();
    ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y);
    ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4);
    ctx.stroke();
  });
}

// ── Point d'équivalence E : point bleu + lignes pointillées bleues + libellés Ve / pHE ──
function _dessinerPointEquivalence(ctx, Ve, pHE, xScale, yScale, pad, H) {
  const x = xScale(Ve);
  const y = yScale(pHE);

  ctx.strokeStyle = '#1565C0';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);

  // ligne verticale (axe des V jusqu'au point)
  ctx.beginPath();
  ctx.moveTo(x, H - pad.bottom);
  ctx.lineTo(x, y);
  ctx.stroke();

  // ligne horizontale (axe des pH jusqu'au point)
  ctx.beginPath();
  ctx.moveTo(pad.left, y);
  ctx.lineTo(x, y);
  ctx.stroke();

  ctx.setLineDash([]);

  // point E
  ctx.fillStyle = '#1565C0';
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();

  ctx.font = 'bold 12px Arial';
  ctx.fillStyle = '#000';
  ctx.fillText('E', x + 8, y - 10);

  // libellés Ve et pHE
  ctx.font = 'bold 12px Arial';
  ctx.fillStyle = '#1565C0';
  ctx.fillText(`Ve = ${Ve.toFixed(2)} mL`, x + 8, H - pad.bottom - 6);
  ctx.fillText(`pHE = ${pHE.toFixed(2)}`, pad.left + 6, y - 6);
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
  ctx.font = '11px Arial';
  ctx.fillText('σ (mS/cm)', H ? ctx.canvas.width / (window.devicePixelRatio || 1) - pad.right + 4 : 0, pad.top + 10);
}

// ══════════════════════════════════════════════════════════════
// BLOC 3 — MÉTHODE DES TANGENTES PARALLÈLES
// ══════════════════════════════════════════════════════════════
// Protocole conforme au TP de chimie :
//   1) on repère le point d'inflexion (pente maximale) sur une version
//      lissée (spline) de la courbe ;
//   2) on ajuste une droite avant et une droite après l'équivalence,
//      en leur imposant EXACTEMENT la même pente (vraies parallèles) ;
//   3) le point d'équivalence E est le point de la courbe équidistant
//      des deux tangentes, c'est-à-dire l'intersection de la courbe
//      avec la droite médiane (parallèle aux deux tangentes, à mi-distance) ;
//   4) à l'affichage, un segment perpendiculaire aux deux tangentes est
//      tracé passant par E, avec les symboles d'angle droit habituels.
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

function _calculerTangentes(courbe) {
  if (courbe.length < 6) return null;

  // 1) point d'inflexion = pente maximale, repéré directement sur les
  //    points bruts (différences centrées) : c'est LUI qui doit servir
  //    de référence pour placer les deux zones de régression, pas un
  //    pourcentage fixe de l'étendue totale du volume versé (qui échoue
  //    dès que le saut de pH n'est pas centré sur le domaine mesuré).
  let idxInflex = 1, maxPente = -Infinity;
  for (let i = 1; i < courbe.length - 1; i++) {
    const dV = courbe[i + 1].v - courbe[i - 1].v || 1e-9;
    const pente = Math.abs((courbe[i + 1].ph - courbe[i - 1].ph) / dV);
    if (pente > maxPente) { maxPente = pente; idxInflex = i; }
  }

  // 2) fenêtres LOCALES avant/après le saut : on exclut seulement quelques
  //    points de part et d'autre de l'inflexion (marge), puis on prend une
  //    petite fenêtre de points pour chaque régression — comme lorsqu'on
  //    pose une règle localement sur chaque palier, tout près du coude de
  //    la courbe, plutôt qu'une régression sur tout le palier (biaisée par
  //    la courbure) ou pire, une marge qui peut sortir du domaine mesuré.
  const margeIdx = Math.max(1, Math.round(courbe.length * 0.04));
  const fenetre = Math.max(3, Math.round(courbe.length * 0.16));

  let avant = courbe.slice(Math.max(0, idxInflex - margeIdx - fenetre), Math.max(2, idxInflex - margeIdx));
  let apres = courbe.slice(Math.min(courbe.length - 2, idxInflex + margeIdx), Math.min(courbe.length, idxInflex + margeIdx + fenetre + 1));

  // repli si les mesures sont trop clairsemées pour cette fenêtre
  if (avant.length < 3) avant = courbe.slice(0, Math.max(3, idxInflex));
  if (apres.length < 3) apres = courbe.slice(Math.min(courbe.length - 3, idxInflex + 1));
  if (avant.length < 2 || apres.length < 2) return null;

  const reg1 = _regressionLineaire(avant);
  const reg2 = _regressionLineaire(apres);
  if (!reg1 || !reg2) return null;

  // 3) parallélisme imposé : pente commune = moyenne pondérée par le nb de points,
  //    puis recalcul des ordonnées à l'origine à pente fixée (moindres carrés)
  const mCommun = (reg1.m * avant.length + reg2.m * apres.length) / (avant.length + apres.length);
  const b1 = avant.reduce((s, p) => s + (p.ph - mCommun * p.v), 0) / avant.length;
  const b2 = apres.reduce((s, p) => s + (p.ph - mCommun * p.v), 0) / apres.length;
  const droite1 = { m: mCommun, b: b1 };
  const droite2 = { m: mCommun, b: b2 };

  // 4) droite médiane (parallèle aux deux tangentes, à mi-distance) → E = intersection avec la courbe
  //    Recherche sur la spline dense pour une précision sub-mesure (E tombe
  //    ainsi très près du pic de la méthode des dérivées, écart minimisé).
  const dense = _catmullRomSpline(courbe, 30);
  const bMedian = (b1 + b2) / 2;
  let meilleurIdx = 0, meilleurEcart = Infinity;
  dense.forEach((p, i) => {
    const ecart = Math.abs(p.ph - (mCommun * p.v + bMedian));
    if (ecart < meilleurEcart) { meilleurEcart = ecart; meilleurIdx = i; }
  });
  const Ve = dense[meilleurIdx].v;
  const pHE = dense[meilleurIdx].ph;

  const { Va, Cb } = _params;
  const Ce = (Cb * Ve) / Va;

  return { Ve, Ce, pHE, droite1, droite2, mCommun, avant, apres };
}

// ── Tracé : deux tangentes parallèles + segment perpendiculaire passant
//    par E + symboles d'angle droit (méthode "double équerre") ──
function _dessinerTangentes(ctx, res, xScale, yScale, vMin, vMax) {
  const tracerDroite = (droite) => {
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([]);
    ctx.moveTo(xScale(vMin), yScale(droite.m * vMin + droite.b));
    ctx.lineTo(xScale(vMax), yScale(droite.m * vMax + droite.b));
    ctx.stroke();
  };
  tracerDroite(res.droite1);
  tracerDroite(res.droite2);

  // Direction écran commune aux deux parallèles (calculée en espace écran
  // pour que la perpendiculaire soit visuellement correcte malgré les
  // échelles différentes des axes V et pH)
  const dv = (vMax - vMin) * 0.02 || 0.1;
  const Ex = xScale(res.Ve), Ey = yScale(res.pHE);
  const dirX = xScale(res.Ve + dv) - xScale(res.Ve - dv);
  const dirY = yScale(res.pHE + res.mCommun * dv) - yScale(res.pHE - res.mCommun * dv);
  const norm = Math.hypot(dirX, dirY) || 1;
  const ux = dirX / norm, uy = dirY / norm;
  const px = -uy, py = ux; // direction perpendiculaire, en espace écran

  function intersectionEcran(droite) {
    const anchorX = xScale(vMin);
    const anchorY = yScale(droite.m * vMin + droite.b);
    const denom = dirX * py - dirY * px;
    if (Math.abs(denom) < 1e-9) return { x: Ex, y: Ey };
    const t = ((Ex - anchorX) * py - (Ey - anchorY) * px) / denom;
    return { x: anchorX + t * dirX, y: anchorY + t * dirY };
  }

  const P1 = intersectionEcran(res.droite1);
  const P2 = intersectionEcran(res.droite2);

  // Segment perpendiculaire reliant les deux tangentes, passant par E
  ctx.beginPath();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1.3;
  ctx.setLineDash([4, 3]);
  ctx.moveTo(P1.x, P1.y);
  ctx.lineTo(P2.x, P2.y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Symboles d'angle droit aux deux points d'intersection
  _dessinerAngleDroit(ctx, P1, P2, ux, uy, px, py);
  _dessinerAngleDroit(ctx, P2, P1, ux, uy, px, py);
}

// Petit carré d'angle droit dessiné au point P, orienté vers `other`
// (le long de la tangente et de la perpendiculaire, en espace écran).
function _dessinerAngleDroit(ctx, P, other, ux, uy, px, py, taille = 9) {
  const dx = other.x - P.x, dy = other.y - P.y;
  const signU = (dx * ux + dy * uy) >= 0 ? 1 : -1;
  const signP = (dx * px + dy * py) >= 0 ? 1 : -1;

  const A = { x: P.x + ux * taille * signU, y: P.y + uy * taille * signU };
  const C = { x: P.x + px * taille * signP, y: P.y + py * taille * signP };
  const B = { x: A.x + px * taille * signP, y: A.y + py * taille * signP };

  ctx.beginPath();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.stroke();
}

// ══════════════════════════════════════════════════════════════
// BLOC 4 — MÉTHODE DES DÉRIVÉES (calculée sur spline dense)
// ══════════════════════════════════════════════════════════════
function _calculerDerivee(courbe) {
  // Interpolation par spline avant dérivation : plusieurs centaines de
  // points ⇒ pic net et précis, sans avoir besoin d'interpolation
  // parabolique supplémentaire pour affiner Ve.
  const dense = _catmullRomSpline(courbe, 25);

  const deriv = [{ v: dense[0].v, d: 0 }];
  for (let i = 1; i < dense.length - 1; i++) {
    const dV = dense[i + 1].v - dense[i - 1].v;
    const dPh = dense[i + 1].ph - dense[i - 1].ph;
    deriv.push({ v: dense[i].v, d: dV ? dPh / dV : 0 });
  }
  deriv.push({ v: dense[dense.length - 1].v, d: 0 });

  // recherche du maximum (pic)
  let idx = 0, maxVal = -Infinity;
  deriv.forEach((p, i) => { if (p.d > maxVal) { maxVal = p.d; idx = i; } });
  const Ve = deriv[idx].v;

  const { Va, Cb } = _params;
  const Ce = (Cb * Ve) / Va;
  return { Ve, Ce, courbeDerivee: deriv, idxPic: idx };
}

// ── Courbe dérivée : violette, pic rouge (ligne + point) ──
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

  ctx.strokeStyle = '#e0e0e0';
  ctx.font = '10px Arial';
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.moveTo(pad.left, pad.top); ctx.lineTo(pad.left, H - pad.bottom); ctx.lineTo(W - pad.right, H - pad.bottom); ctx.stroke();
  ctx.fillText('ΔpH/ΔV', 4, pad.top + 8);
  ctx.fillText('VB (mL)', W - pad.right - 34, H - 8);

  // courbe dérivée : violet, lisse (issue de la spline)
  ctx.beginPath();
  ctx.strokeStyle = '#5E35B1';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([]);
  ctx.lineJoin = 'round';
  res.courbeDerivee.forEach((p, i) => {
    const x = xScale(p.v), y = yScale(Math.max(p.d, 0));
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  });
  ctx.stroke();

  // pic : ligne verticale rouge + point rouge
  const xPic = xScale(res.Ve);
  const yPic = yScale(Math.max(dVals[res.idxPic] ?? 0, 0));

  ctx.beginPath();
  ctx.strokeStyle = '#d60000';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([2, 3]);
  ctx.moveTo(xPic, H - pad.bottom);
  ctx.lineTo(xPic, pad.top);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#d60000';
  ctx.beginPath();
  ctx.arc(xPic, yPic, 5, 0, 2 * Math.PI);
  ctx.fill();

  ctx.font = 'bold 11px Arial';
  ctx.fillText(`Ve = ${res.Ve.toFixed(2)} mL`, xPic + 8, pad.top + 12);
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

// ══════════════════════════════════════════════════════════════
// BLOC 5 — CORRECTION DES ERREURS DE MESURE
// ══════════════════════════════════════════════════════════════
let _pointsSuspects = []; // indices dans _mesures actuellement signalés

function _initCorrectionErreurs() {
  const btnToggle = document.getElementById('btn-correction-erreurs');
  const panneau = document.getElementById('panneau-correction');
  if (btnToggle && panneau) {
    btnToggle.addEventListener('click', () => {
      panneau.style.display = panneau.style.display === 'none' ? 'block' : 'none';
    });
  }

  document.getElementById('btn-appliquer-offset')?.addEventListener('click', () => {
    const offset = parseFloat(document.getElementById('offset-ph')?.value) || 0;
    if (!offset) return;
    _mesures.forEach(m => { if (m.ph !== null && !isNaN(m.ph)) m.ph = +(m.ph + offset).toFixed(3); });
    document.getElementById('offset-ph').value = 0;
    _majTableau();
    _dessinerGraphe();
  });

  document.getElementById('btn-lissage')?.addEventListener('click', () => {
    _lisserMoyenneGlissante();
    _majTableau();
    _dessinerGraphe();
  });

  document.getElementById('btn-savgol')?.addEventListener('click', () => {
    _lisserSavitzkyGolay();
    _majTableau();
    _dessinerGraphe();
  });

  document.getElementById('btn-detecter-aberrants')?.addEventListener('click', () => {
    _detecterPointsAberrants();
  });
}

// ── Décalage de calibration : déjà géré ci-dessus (offset global) ──

// ── Lissage par moyenne glissante (fenêtre 3) ──────────────────
function _lisserMoyenneGlissante() {
  const valides = _mesures
    .map((m, i) => ({ ...m, i }))
    .filter(m => m.ph !== null && !isNaN(m.ph))
    .sort((a, b) => a.v - b.v);
  if (valides.length < 3) return;

  const lisses = valides.map((p, idx) => {
    if (idx === 0 || idx === valides.length - 1) return p.ph;
    return +((valides[idx - 1].ph + p.ph + valides[idx + 1].ph) / 3).toFixed(3);
  });

  valides.forEach((p, idx) => { _mesures[p.i].ph = lisses[idx]; });
}

// ── Lissage Savitzky-Golay (fenêtre 5, polynôme degré 2) ───────
// Coefficients classiques pour fenêtre 5 : [-3, 12, 17, 12, -3] / 35
function _lisserSavitzkyGolay() {
  const coeffs = [-3, 12, 17, 12, -3];
  const norm = 35;
  const valides = _mesures
    .map((m, i) => ({ ...m, i }))
    .filter(m => m.ph !== null && !isNaN(m.ph))
    .sort((a, b) => a.v - b.v);
  if (valides.length < 5) {
    // dataset trop court : on retombe sur la moyenne glissante simple
    _lisserMoyenneGlissante();
    return;
  }

  const phs = valides.map(p => p.ph);
  const lisses = phs.map((ph, idx) => {
    if (idx < 2 || idx > phs.length - 3) return ph; // bords non lissés
    let somme = 0;
    for (let k = -2; k <= 2; k++) somme += coeffs[k + 2] * phs[idx + k];
    return +(somme / norm).toFixed(3);
  });

  valides.forEach((p, idx) => { _mesures[p.i].ph = lisses[idx]; });
}

// ── Détection des points aberrants (écart > 3σ au résidu local) ─
function _detecterPointsAberrants() {
  const valides = _mesures
    .map((m, i) => ({ ...m, i }))
    .filter(m => m.ph !== null && !isNaN(m.ph))
    .sort((a, b) => a.v - b.v);

  if (valides.length < 4) {
    document.getElementById('liste-points-suspects').innerHTML =
      '<p class="info">Pas assez de mesures pour détecter des points aberrants.</p>';
    return;
  }

  // résidu = écart entre le point et la moyenne glissante locale (fenêtre 3)
  const residus = valides.map((p, idx) => {
    if (idx === 0 || idx === valides.length - 1) return 0;
    const moyenneLocale = (valides[idx - 1].ph + valides[idx + 1].ph) / 2;
    return p.ph - moyenneLocale;
  });

  const moyenneResidu = residus.reduce((a, b) => a + b, 0) / residus.length;
  const variance = residus.reduce((a, b) => a + (b - moyenneResidu) ** 2, 0) / residus.length;
  const sigma = Math.sqrt(variance) || 0.01;

  _pointsSuspects = [];
  valides.forEach((p, idx) => {
    if (Math.abs(residus[idx] - moyenneResidu) > 3 * sigma) _pointsSuspects.push(p);
  });

  const conteneur = document.getElementById('liste-points-suspects');
  if (!_pointsSuspects.length) {
    conteneur.innerHTML = '<p class="info">Aucun point suspect détecté (seuil 3σ).</p>';
    return;
  }

  conteneur.innerHTML = '';
  _pointsSuspects.forEach(p => {
    const div = document.createElement('div');
    div.className = 'erreur';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.gap = '10px';
    div.innerHTML = `<span>Point suspect : V = ${p.v} mL, pH = ${p.ph} — le conserver ?</span>`;

    const btnOui = document.createElement('button');
    btnOui.textContent = 'Conserver';
    btnOui.addEventListener('click', () => { div.remove(); });

    const btnNon = document.createElement('button');
    btnNon.textContent = 'Supprimer';
    btnNon.style.background = 'var(--clp-rouge, #c0392b)';
    btnNon.addEventListener('click', () => {
      const idx = _mesures.findIndex(m => m === _mesures[p.i]);
      if (idx !== -1) _mesures.splice(idx, 1);
      div.remove();
      _majTableau();
      _dessinerGraphe();
    });

    div.append(btnOui, btnNon);
    conteneur.appendChild(div);
  });
}

// ══════════════════════════════════════════════════════════════
// BLOC 6 — EXPORT CSV / PNG / PDF + COMPTE-RENDU
// ══════════════════════════════════════════════════════════════
function _initExportEtCompteRendu() {
  document.getElementById('btn-export-csv')?.addEventListener('click', _exporterCSV);
  document.getElementById('btn-export-png')?.addEventListener('click', _exporterPNG);
  document.getElementById('btn-export-pdf')?.addEventListener('click', _exporterPDF);
  document.getElementById('btn-inserer-cr')?.addEventListener('click', _insererCompteRendu);
  document.getElementById('btn-imprimer')?.addEventListener('click', _insererCompteRendu); // ← ajouté
}

function _telecharger(blob, nomFichier) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nomFichier;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function _exporterCSV() {
  const lignes = ['Volume ajouté (mL);pH mesuré'];
  _pointsExperimentaux().forEach(p => lignes.push(`${p.v};${p.ph}`));

  if (_resultatTangentes || _resultatDerivee) {
    lignes.push('');
    lignes.push('Résultats;');
    if (_resultatTangentes) lignes.push(`Ve (tangentes);${_resultatTangentes.Ve.toFixed(2)}`);
    if (_resultatTangentes) lignes.push(`CA (tangentes);${_resultatTangentes.Ce.toFixed(4)}`);
    if (_resultatDerivee) lignes.push(`Ve (dérivée);${_resultatDerivee.Ve.toFixed(2)}`);
    if (_resultatDerivee) lignes.push(`CA (dérivée);${_resultatDerivee.Ce.toFixed(4)}`);
  }

  const csv = '\uFEFF' + lignes.join('\n'); // BOM pour Excel/accents
  _telecharger(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), 'tp03-titrage-mesures.csv');
}

function _exporterPNG() {
  const canvas = document.getElementById('canvas-titrage');
  if (!canvas) return;
  canvas.toBlob(blob => {
    if (blob) _telecharger(blob, 'tp03-titrage-courbe.png');
  }, 'image/png');
}

function _exporterPDF() {
  // Réutilise la trame standardisée du compte-rendu (logo + identification)
  // plutôt qu'une impression brute de la page : le PDF obtenu est ainsi cohérent
  // avec celui généré par "Insérer dans le compte-rendu".
  _insererCompteRendu();
}

function _resumeResultats() {
  const exp = _pointsExperimentaux();
  const meilleurVe = _resultatTangentes?.Ve ?? _resultatDerivee?.Ve ?? null;
  const meilleurCe = _resultatTangentes?.Ce ?? _resultatDerivee?.Ce ?? null;
  const erreurPct = (meilleurCe !== null && _params.Ca)
    ? Math.abs((meilleurCe - _params.Ca) / _params.Ca * 100)
    : null;

  return {
    nbMesures: exp.length,
    veTangentes: _resultatTangentes?.Ve ?? null,
    ceTangentes: _resultatTangentes?.Ce ?? null,
    veDerivee: _resultatDerivee?.Ve ?? null,
    ceDerivee: _resultatDerivee?.Ce ?? null,
    methode: _resultatTangentes ? 'Tangentes' : (_resultatDerivee ? 'Dérivée' : '—'),
    Ve: meilleurVe,
    Ce: meilleurCe,
    erreurPct,
  };
}

function _insererCompteRendu() {
  const resume = _resumeResultats();

  if (resume.Ve === null) {
    alert('Aucun résultat disponible : activez la méthode des tangentes ou des dérivées avant de générer le compte-rendu.');
    return;
  }

  const sections = [
    {
      titre: 'Paramètres du titrage',
      items: [
        { label: 'Volume initial Va', valeur: `${_params.Va} mL` },
        { label: 'Concentration Cb (burette)', valeur: `${_params.Cb} mol/L` },
        { label: 'Nature acide / base', valeur: `${_params.typeAcide} / ${_params.typeBase}` },
        { label: 'Ve théorique', valeur: `${_params.Ve.toFixed(2)} mL` },
      ],
    },
    {
      titre: 'Mesures expérimentales',
      items: [
        { label: 'Nombre de points mesurés', valeur: resume.nbMesures },
      ],
    },
  ];

  if (resume.veTangentes !== null) {
    sections.push({
      titre: 'Méthode des tangentes',
      items: [
        { label: 'Ve', valeur: `${resume.veTangentes.toFixed(2)} mL` },
        { label: 'CA calculée', valeur: `${resume.ceTangentes.toFixed(4)} mol/L` },
      ],
    });
  }

  if (resume.veDerivee !== null) {
    sections.push({
      titre: 'Méthode des dérivées',
      items: [
        { label: 'Ve', valeur: `${resume.veDerivee.toFixed(2)} mL` },
        { label: 'CA calculée', valeur: `${resume.ceDerivee.toFixed(4)} mol/L` },
      ],
    });
  }

  sections.push({
    titre: 'Conclusion',
    items: [
      { label: 'Méthode retenue', valeur: resume.methode },
      { label: 'CA retenue', valeur: resume.Ce !== null ? `${resume.Ce.toFixed(4)} mol/L` : '—' },
      { label: 'Erreur relative / valeur attendue', valeur: resume.erreurPct !== null ? `${resume.erreurPct.toFixed(2)} %` : '—' },
    ],
  });

  genererCompteRendu({
    domaine: 'Chimie',
    tp: 'TP03',
    titre: 'Titrage acido-basique (pH-métrie)',
    sections,
    canvas: document.getElementById('canvas-titrage'),
  });
}

// init() appelée par navigation.js au chargement du module
if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
