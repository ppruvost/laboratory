/**
 * tp05.js — Chimie organique (corrigé)
 */

import { PRODUITS } from '../produits.js';
import { renderBlocSecurite, initSections, initTabs } from '../utils.js';

// ── Familles de fonctions organiques ─────────────────────────
export const FONCTIONS = [
  {
    nom: 'Alcool',
    suffix: '-ol',
    formuleGenerique: 'R–OH',
    exemples: ['Éthanol C₂H₅OH', 'Alcool isoamylique', 'Glycérol C₃H₈O₃'],
    tests: [
      { reactif: 'Dichromate K₂Cr₂O₇ / H₂SO₄', positif: 'Orange → vert', negatif: 'Reste orange' },
      { reactif: 'Na métal', positif: 'H₂ dégagé', negatif: 'Rien' },
    ],
    couleur: '#2E86C1',
    polarite: 'Polaire (liaisons H)',
  },
  {
    nom: 'Acide carboxylique',
    suffix: '-oïque',
    formuleGenerique: 'R–COOH',
    exemples: ['Acide éthanoïque', 'Acide propanoïque', 'Acide butanoïque'],
    tests: [
      { reactif: 'Na₂CO₃ / NaHCO₃', positif: 'CO₂ effervescence', negatif: 'Rien' },
      { reactif: 'pH', positif: 'pH < 5', negatif: 'pH > 5' },
    ],
    couleur: '#C0392B',
    polarite: 'Très polaire',
  },
  {
    nom: 'Ester',
    suffix: '-anoate',
    formuleGenerique: 'R–COO–R’',
    exemples: ['Acétate d’isoamyle', 'Acétate d’éthyle', 'Butyrate d’éthyle'],
    tests: [
      { reactif: 'Odeur', positif: 'Odeur fruitée', negatif: '—' },
      { reactif: 'Hydrolyse', positif: 'Acide + alcool', negatif: '—' },
    ],
    couleur: '#F39C12',
    polarite: 'Faible polarité',
  },
  {
    nom: 'Aldéhyde',
    suffix: '-al',
    formuleGenerique: 'R–CHO',
    exemples: ['Éthanal', 'Benzaldéhyde'],
    tests: [
      { reactif: 'Fehling', positif: 'Rouge brique', negatif: 'Bleu' },
      { reactif: 'Tollens', positif: 'Miroir argent', negatif: 'Rien' },
    ],
    couleur: '#E67E22',
    polarite: 'Polaire',
  },
  {
    nom: 'Cétone',
    suffix: '-one',
    formuleGenerique: 'R–CO–R’',
    exemples: ['Acétone', 'Cyclohexanone'],
    tests: [
      { reactif: 'Fehling', positif: 'Négatif', negatif: 'Bleu' },
    ],
    couleur: '#8E44AD',
    polarite: 'Polaire',
  },
  {
    nom: 'Amine',
    suffix: '-amine',
    formuleGenerique: 'R–NH₂',
    exemples: ['Éthylamine'],
    tests: [
      { reactif: 'pH', positif: 'Basique', negatif: '—' },
    ],
    couleur: '#27AE60',
    polarite: 'Base',
  },
];

// ── ESTERS ────────────────────────────────────────────────────
const ESTERS_ODEURS = [
  { nom: 'Isoamyle', acide: 'acide éthanoïque', alcool: 'isoamylique', odeur: '🍌 banane', couleur: '#F9E79F' },
  { nom: 'Éthyle', acide: 'acide éthanoïque', alcool: 'éthanol', odeur: '🧪 colle', couleur: '#FAD7A0' },
  { nom: 'Butyle', acide: 'acide éthanoïque', alcool: 'butanol', odeur: '🍎 pomme', couleur: '#A9DFBF' },
];

// ══════════════════════════════════════════════════════════════
export function init() {
  _initSecurite();
  initSections();
  initTabs();
  _initCartesFonctions();
  _initFehling();
  _initEsterCalc();
  _initRendement();
  _initCCM();
  _initQuiz();
  _initOdeurs();
}

// ── sécurité ──────────────────────────────────────────────────
function _initSecurite() {
  const el = document.getElementById('securite-bloc');
  if (!el) return;

  const CAS = ['64-19-7', '67-64-1', '7758-99-8', '1310-73-2'];
  const produits = CAS.map(c => PRODUITS.find(p => p.cas === c)).filter(Boolean);

  el.innerHTML = renderBlocSecurite(produits);
}

// ── cartes fonctions ──────────────────────────────────────────
function _initCartesFonctions() {
  const cont = document.getElementById('cartes-fonctions');
  if (!cont) return;

  cont.innerHTML = FONCTIONS.map(f => `
  <div class="section" style="border-top:4px solid ${f.couleur}">
    <div class="section-titre">
      <h2>${f.nom} <code>${f.formuleGenerique}</code></h2>
    </div>
    <div class="section-corps">
      <p><b>Exemples :</b> ${f.exemples.join(' · ')}</p>
      <p><b>Polarité :</b> ${f.polarite}</p>
      <table>
        <tr><th>Test</th><th>+</th><th>-</th></tr>
        ${f.tests.map(t => `
          <tr><td>${t.reactif}</td><td>${t.positif}</td><td>${t.negatif}</td></tr>
        `).join('')}
      </table>
    </div>
  </div>`).join('');
}

// ── FEHLING ───────────────────────────────────────────────────
const FEHLING = {
  glucose: true,
  fructose: true,
  saccharose: false,
  acetone: false,
  ethanal: true,
};

function _initFehling() {
  const sel = document.getElementById('sel-fehling');
  const btn = document.getElementById('btn-fehling');
  const res = document.getElementById('res-fehling');
  if (!sel || !btn) return;

  sel.innerHTML = Object.keys(FEHLING)
    .map(k => `<option value="${k}">${k}</option>`).join('');

  let phase = 0;

  btn.onclick = () => {
    const mol = sel.value;
    if (!mol) return;

    if (phase === 0) {
      btn.textContent = "🔥 Chauffer";
      res.textContent = "Solution bleue (Cu²⁺)";
      phase = 1;
      return;
    }

    const ok = FEHLING[mol];
    res.innerHTML = ok
      ? "✅ Positif (Cu₂O rouge)"
      : "❌ Négatif (reste bleu)";

    btn.textContent = "Réinitialiser";
    phase = 0;
  };
}

// ── ESTER CALC ────────────────────────────────────────────────
function _initEsterCalc() {
  const form = document.getElementById('form-ester-calc');
  if (!form) return;

  form.oninput = () => {
    const v = +document.getElementById('v-acide').value || 0;
    const d = +document.getElementById('d-acide').value || 1;
    const M = 60;

    const n = (v * d) / M;

    document.getElementById('res-calc-ester').textContent =
      `n(acide) = ${n.toFixed(4)} mol`;
  };
}

// ── rendement ────────────────────────────────────────────────
function _initRendement() {
  document.querySelectorAll('#m-ester-exp').forEach(el => {
    el.oninput = () => {
      const theo = +document.getElementById('m-ester-theo').value || 0;
      const exp = +el.value || 0;
      const r = theo ? (exp / theo) * 100 : 0;

      document.getElementById('res-rendement').textContent =
        `Rendement = ${r.toFixed(1)} %`;
    };
  });
}

// ── CCM simplifiée ───────────────────────────────────────────
function _initCCM() {
  const canvas = document.getElementById('canvas-ccm');
  const btn = document.getElementById('btn-eluer');
  if (!canvas || !btn) return;

  const ctx = canvas.getContext('2d');

  btn.onclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText("CCM simulée", 50, 50);
  };
}

// ── quiz ──────────────────────────────────────────────────────
function _initQuiz() {
  const btn = document.getElementById('btn-quiz-fonctions');
  if (!btn) return;

  btn.onclick = () => {
    alert("Quiz fonctionnel (simplifié)");
  };
}

// ── odeurs ────────────────────────────────────────────────────
function _initOdeurs() {
  const cont = document.getElementById('galerie-esters');
  if (!cont) return;

  cont.innerHTML = ESTERS_ODEURS.map(e =>
    `<div>${e.nom} → ${e.odeur}</div>`
  ).join('');
}
