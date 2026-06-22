console.log("tp02-ph-indicateurs.js chargé");

// =====================================================
// PRODUITS (fallback global)
// =====================================================

const PRODUITS =
    window.PRODUITS ||
    window.parent?.PRODUITS ||
    [];

// =====================================================
// INDICATEURS
// =====================================================

const INDICATEURS_B27 = [
  {
    nom: 'Hélianthine (orange de méthyle)',
    formule: 'C₁₄H₁₄N₃NaO₃S',
    cas: '547-58-0',
    plageMin: 3.1, plageMax: 4.4,
    couleurAcide: '#D32F2F', nomAcide: 'rouge',
    couleurBasique: '#F57F17', nomBasique: 'jaune-orangé',
    couleurVirage: '#E65100',
    localisation: 'Étagère D4',
  },
  {
    nom: 'Rouge de méthyle',
    formule: 'C₁₅H₁₅N₃O₂',
    cas: '493-52-7',
    plageMin: 4.4, plageMax: 6.2,
    couleurAcide: '#B71C1C', nomAcide: 'rouge',
    couleurBasique: '#F9A825', nomBasique: 'jaune',
    couleurVirage: '#BF360C',
    localisation: 'Étagère D4',
  },
  {
    nom: 'Bleu de bromothymol (BBT)',
    formule: 'C₂₇H₂₈Br₂O₅S',
    cas: '76-59-5',
    plageMin: 6.0, plageMax: 7.6,
    couleurAcide: '#F57F17', nomAcide: 'jaune',
    couleurBasique: '#1565C0', nomBasique: 'bleu',
    couleurVirage: '#388E3C',
    localisation: 'Étagère D4',
  },
  {
    nom: 'Phénolphtaléine',
    formule: 'C₂₀H₁₄O₄',
    cas: '77-09-8',
    plageMin: 8.2, plageMax: 10.0,
    couleurAcide: '#ECEFF1', nomAcide: 'incolore',
    couleurBasique: '#AD1457', nomBasique: 'rose-fuchsia',
    couleurVirage: '#E91E63',
    localisation: 'Étagère B2',
  },
];

// =====================================================
// INIT (OBLIGATOIRE POUR navigation.js)
// =====================================================

export function init() {

  console.log("tp02 init exécuté");

  _initSecurite();
  _initSliderPH();
  _initPHmetreVirtuel();
  _initSelecteurSolution();
  _initCalculateurPH();
  _initTableauResultats();
  _initQuizIndicateurs();
}

// =====================================================
// SECURITE
// =====================================================

function _initSecurite() {

  const el = document.getElementById('securite-bloc');
  if (!el) return;

  const CAS = [
    '7647-01-0',
    '64-19-7',
    '1336-21-6',
    '1310-73-2',
    '76-59-5',
    '77-09-8',
    '547-58-0',
    '493-52-7'
  ];

  const produits = CAS
    .map(c => PRODUITS.find(p => p.cas === c))
    .filter(Boolean);

  el.innerHTML = produits
    .map(p => `<p>${p.nom} — ${p.cas}</p>`)
    .join('');
}

// =====================================================
// SLIDER PH
// =====================================================

function _initSliderPH() {

  const slider = document.getElementById('slider-ph');
  if (!slider) return;

  slider.addEventListener('input', () =>
    _majToutSimulateur(parseFloat(slider.value))
  );

  _majToutSimulateur(7);
}

// =====================================================
// SIMULATION
// =====================================================

function _majToutSimulateur(ph) {

  const aff = document.getElementById('affichage-ph');
  if (aff) aff.textContent = ph.toFixed(1);
}

// =====================================================
// PH-METRE
// =====================================================

function _initPHmetreVirtuel() {

  const input = document.getElementById('phmetre-input');
  const btn   = document.getElementById('btn-mesurer');
  if (!input || !btn) return;

  btn.addEventListener('click', () => {

    const val = parseFloat(input.value);
    if (isNaN(val) || val < 0 || val > 14) return;

    const slider = document.getElementById('slider-ph');
    if (slider) {
      slider.value = val;
      _majToutSimulateur(val);
    }
  });
}

// =====================================================
// SELECTEUR SOLUTION
// =====================================================

function _initSelecteurSolution() {

  const sel = document.getElementById('select-solution');
  if (!sel) return;

  sel.innerHTML = `
    <option value="">-- Choisir une solution --</option>
  `;
}

// =====================================================
// CALCUL PH
// =====================================================

function _initCalculateurPH() {

  const form = document.getElementById('calc-ph-form');
  if (!form) return;

  form.addEventListener('input', _calcPH);
}

function _calcPH() {

  const C = parseFloat(document.getElementById('conc-calc-ph')?.value);
  const out = document.getElementById('resultat-calc-ph');
  if (!out || isNaN(C)) return;

  const ph = -Math.log10(C);

  out.innerHTML = `pH = ${ph.toFixed(2)}`;
}

// =====================================================
// TABLEAU RESULTATS
// =====================================================

function _initTableauResultats() {
  console.log("Tableau pH initialisé");
}

// =====================================================
// QUIZ
// =====================================================

function _initQuizIndicateurs() {
  console.log("Quiz indicateurs initialisé");
}
