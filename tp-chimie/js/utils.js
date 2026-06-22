/**
 * utils.js — Fonctions partagées par tous les TP
 */

import { PRODUITS } from './produits.js';

// ── Pictogrammes GHS → images + labels ───────────────────────
export const GHS_PICTO = {
  GHS01: { img: 'assets/picto/SGH01_BombeExplosant.jpg', label: 'Explosif' },
  GHS02: { img: 'assets/picto/SGH02_Flamme.jpg', label: 'Inflammable' },
  GHS03: { img: 'assets/picto/SGH03_FlammeSurCercle.jpg', label: 'Comburant' },
  GHS04: { img: 'assets/picto/SGH04_BouteilleGaz.jpg', label: 'Gaz sous pression' },
  GHS05: { img: 'assets/picto/SGH05_Corrosion.jpg', label: 'Corrosif' },
  GHS06: { img: 'assets/picto/SGH06_TeteDeMort.jpg', label: 'Toxique' },
  GHS07: { img: 'assets/picto/SGH07_PointExclamation.jpg', label: 'Irritant / nocif' },
  GHS08: { img: 'assets/picto/SGH08_DangerSante.jpg', label: 'Danger santé grave' },
  GHS09: { img: 'assets/picto/SGH09_Environnement.jpg', label: 'Danger environnement' },
};

// ── EPI → libellé + icône image ───────────────────────────────
export const EPI_CONFIG = {
  LUNETTES: {
    img: 'assets/picto/OBLIGATION-lunettes.jpg',
    label: 'Lunettes de protection'
  },
  GANTS: {
    img: 'assets/picto/OBLIGATION-gants.jpg',
    label: 'Gants'
  },
  BLOUSE: {
    img: 'assets/picto/OBLIGATION-blouse.jpg',
    label: 'Blouse'
  },
  HOTTE: {
    img: 'assets/picto/OBLIGATION-hotte.jpeg',
    label: 'Hotte aspirante'
  },
  CASQUE: {
    img: 'assets/picto/OBLIGATION-casque.jpg',
    label: 'Casque'
  },
  VISIERE: {
    img: 'assets/picto/OBLIGATION-visiere.jpg',
    label: 'Visière'
  },
  CHAUSSURES: {
    img: 'assets/picto/OBLIGATION-chaussures.jpg',
    label: 'Chaussures de sécurité'
  },
  COMBINAISON: {
    img: 'assets/picto/OBLIGATION-combinaison.jpg',
    label: 'Combinaison'
  },
  HARNAIS: {
    img: 'assets/picto/OBLIGATION-harnais.jpg',
    label: 'Harnais'
  },
  RESPIRATOIRE: {
    img: 'assets/picto/OBLIGATION-protection-voies-espiratoires.jpg',
    label: 'Protection respiratoire'
  },
};

// ── Masses molaires (g/mol) ───────────────────────────────────
export const MASSES_MOLAIRES = {
  'NaOH':  40.00,
  'HCl':   36.46,
  'H2SO4': 98.08,
  'HNO3':  63.01,
  'CH3COOH': 60.05,
  'Na2CO3': 105.99,
  'CuSO4':  159.61,
  'CuSO4.5H2O': 249.69,
  'KMnO4': 158.03,
  'K2Cr2O7': 294.18,
  'NaCl':   58.44,
  'KCl':    74.55,
  'NH4Cl':  53.49,
  'AgNO3':  169.87,
  'FeSO4.7H2O': 278.01,
  'Na2S2O3': 158.11,
  'EDTA':   292.24,
};

// ── Génération HTML carte produit ─────────────────────────────
export function renderCarteProduit(p, options = {}) {
  const ghsBadges = (p.pictogrammes || []).map(g => {
    const info = GHS_EMOJI[g] || { emoji: '⚠️', label: g };
    return `<span class="ghs-badge" title="${info.label}" data-tooltip="${info.label}">${info.emoji}</span>`;
  }).join('');

  const epiBadges = (p.epi || []).map(e => {
    const conf = EPI_CONFIG[e];
    if (!conf) return '';
    return `<span class="epi-badge ${conf.classe}">${conf.label}</span>`;
  }).join('');

  const hlist = Object.entries(p.hphrases || {}).map(([code, txt]) =>
    `<div class="danger-strip"><span class="code-h">${code}</span><span>${txt}</span></div>`
  ).join('');

  return `
    <div class="produit-carte">
      <div>
        <span class="produit-cas">${p.cas}</span>
      </div>
      <div>
        <div class="produit-nom">${p.nom}</div>
        <div class="produit-formule">${p.formule}</div>
        <div class="produit-localisation">📍 ${p.localisation}</div>
        ${options.showGHS && ghsBadges ? `<div class="ghs-pictos">${ghsBadges}</div>` : ''}
        ${options.showEPI ? `<div class="produit-epi">${epiBadges}</div>` : ''}
        ${options.showH && hlist ? hlist : ''}
      </div>
    </div>`;
}

// ── Génération bloc sécurité complet ──────────────────────────
export function renderBlocSecurite(produits) {
  const cartes = produits.map(p => renderCarteProduit(p, { showGHS:true, showEPI:true, showH:true })).join('');
  return `
    <div class="alerte-securite">
      <strong>⚠️ Consignes de sécurité obligatoires</strong>
      Lire les fiches de données de sécurité avant toute manipulation.
      En cas d'accident : rincer abondamment et appeler le responsable.
    </div>
    ${cartes}`;
}

// ── Calcul concentration molaire ──────────────────────────────
export function concentrationMolaire(masseG, volumeL, masseMolaire) {
  if (!volumeL || !masseMolaire) return null;
  return (masseG / masseMolaire / volumeL).toFixed(4);
}

// ── Calcul dilution (C₁V₁ = C₂V₂) ───────────────────────────
export function dilution({ c1, v1, c2, v2 }) {
  if (c1 && v1 && c2) return (c1 * v1 / c2).toFixed(1);
  if (c1 && v1 && v2) return (c1 * v1 / v2).toFixed(4);
  return null;
}

// ── Toggle section ────────────────────────────────────────────
export function initSections() {
  document.querySelectorAll('.section-titre').forEach(titre => {
    titre.addEventListener('click', () => {
      titre.closest('.section').classList.toggle('fermee');
      const chev = titre.querySelector('.chevron');
      if (chev) chev.textContent = titre.closest('.section').classList.contains('fermee') ? '▶' : '▼';
    });
  });
}

// ── Tabs ──────────────────────────────────────────────────────
export function initTabs() {
  document.querySelectorAll('.tabs-header').forEach(header => {
    header.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const container = header.closest('.tabs-container') || header.parentElement;
        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('actif'));
        container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('actif'));
        btn.classList.add('actif');
        const panel = container.querySelector(`#${btn.dataset.tab}`);
        if (panel) panel.classList.add('actif');
      });
    });
  });
}

// ── Impression ────────────────────────────────────────────────
export function initImprimer() {
  const btn = document.getElementById('btn-imprimer');
  if (btn) btn.addEventListener('click', () => window.print());
}

// ── Calcul guidé générique ────────────────────────────────────
export function bindCalcul(id, fn) {
  const el = document.getElementById(id);
  if (!el) return;
  el.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', () => {
      const inputs = [...el.querySelectorAll('input')];
      const vals = inputs.map(i => parseFloat(i.value));
      const res = el.querySelector('.resultat-calcul');
      if (res) res.textContent = fn(vals) ?? '—';
    });
  });
}
