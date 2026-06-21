/**
 * tp02.js — pH et indicateurs colorés
 * Gère : simulateur pH/indicateurs, pH-mètre virtuel,
 *        quiz indicateurs, tableau résultats, calculs [H₃O⁺]/[HO⁻]
 */

import { PRODUITS } from '../produits.js';
import { renderBlocSecurite, initSections, initTabs } from '../utils.js';

// ── Indicateurs disponibles en salle B27 ─────────────────────
export const INDICATEURS_B27 = [
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
    textAcide: '#999',
    localisation: 'Étagère B2',
  },
];

// Solutions de référence disponibles en B27
const SOLUTIONS_REFERENCES = [
  { nom: 'HCl 0,100 mol/L',       ph: 1.00,  couleur: '#FF1744', type: 'acide fort'  },
  { nom: 'H₂SO₄ 0,050 mol/L',     ph: 1.00,  couleur: '#FF6D00', type: 'acide fort'  },
  { nom: 'CH₃COOH 0,100 mol/L',   ph: 2.87,  couleur: '#FF8F00', type: 'acide faible'},
  { nom: 'Tampon pH 4,01',         ph: 4.01,  couleur: '#FFD740', type: 'tampon'      },
  { nom: 'CH₃COOH 0,010 mol/L',   ph: 3.37,  couleur: '#FFCA28', type: 'acide faible'},
  { nom: 'Na₂CO₃ 0,050 mol/L',    ph: 11.60, couleur: '#3D5AFE', type: 'sel basique' },
  { nom: 'Tampon pH 7,01',         ph: 7.01,  couleur: '#00E676', type: 'tampon'      },
  { nom: 'Tampon pH 9,00',         ph: 9.00,  couleur: '#00BCD4', type: 'tampon'      },
  { nom: 'Tampon pH 10,00',        ph: 10.00, couleur: '#3F51B5', type: 'tampon'      },
  { nom: 'NH₄OH 0,100 mol/L',     ph: 11.12, couleur: '#9C27B0', type: 'base faible' },
  { nom: 'NaOH 0,100 mol/L',      ph: 13.00, couleur: '#6A1B9A', type: 'base forte'  },
  { nom: 'KOH 0,100 mol/L',       ph: 13.00, couleur: '#4A148C', type: 'base forte'  },
  { nom: 'Eau distillée',          ph: 7.00,  couleur: '#B2EBF2', type: 'neutre'      },
];

// ══════════════════════════════════════════════════════════════
// INIT PRINCIPALE
// ══════════════════════════════════════════════════════════════
export function init() {
  _initSecurite();
  initSections();
  initTabs();
  _initSliderPH();
  _initPHmetreVirtuel();
  _initSelecteurSolution();
  _initCalculateurPH();
  _initTableauResultats();
  _initQuizIndicateurs();
}

// ── Sécurité ──────────────────────────────────────────────────
function _initSecurite() {
  const el = document.getElementById('securite-bloc');
  if (!el) return;
  const CAS = ['7647-01-0', '64-19-7', '1336-21-6', '1310-73-2',
               '76-59-5', '77-09-8', '547-58-0', '493-52-7'];
  const produits = CAS.map(c => PRODUITS.find(p => p.cas === c)).filter(Boolean);
  el.innerHTML = renderBlocSecurite(produits);
}

// ══════════════════════════════════════════════════════════════
// SIMULATEUR SLIDER pH + indicateurs
// ══════════════════════════════════════════════════════════════
function _initSliderPH() {
  const slider = document.getElementById('slider-ph');
  if (!slider) return;

  slider.addEventListener('input', () => _majToutSimulateur(parseFloat(slider.value)));
  _majToutSimulateur(7.0);
}

function _majToutSimulateur(ph) {
  // Affichage valeur
  const aff = document.getElementById('affichage-ph');
  if (aff) aff.textContent = ph.toFixed(1);

  // Curseur bande pH
  const curseur = document.getElementById('curseur-ph');
  if (curseur) curseur.style.left = (ph / 14 * 100) + '%';

  // Concentrations
  _majConcentrations(ph);

  // Indicateurs
  _majIndicateurs(ph);

  // Couleur tube virtuel
  _majTubeVirtuel(ph);
}

function _majConcentrations(ph) {
  const h3o = Math.pow(10, -ph);
  const ho  = Math.pow(10, -(14 - ph));

  const elH3O = document.getElementById('concentration-h3o');
  const elHO  = document.getElementById('concentration-ho');
  const elNat = document.getElementById('nature-solution');

  if (elH3O) elH3O.innerHTML = _formatSci(h3o);
  if (elHO)  elHO.innerHTML  = _formatSci(ho);
  if (elNat) {
    const [txt, col] =
      ph < 6.9  ? ['⚡ Acide',   'var(--rouge-ph)'] :
      ph > 7.1  ? ['🔷 Basique', 'var(--bleu-cuivre)'] :
                  ['⚖️ Neutre',  'var(--vert-acide)'];
    elNat.textContent = txt;
    elNat.style.color = col;
  }
}

function _majIndicateurs(ph) {
  const cont = document.getElementById('resultats-indicateurs');
  if (!cont) return;

  cont.innerHTML = INDICATEURS_B27.map(ind => {
    let couleur, nom, textColor;
    if (ph < ind.plageMin) {
      couleur    = ind.couleurAcide;
      nom        = ind.nomAcide;
      textColor  = ind.textAcide || '#fff';
    } else if (ph > ind.plageMax) {
      couleur   = ind.couleurBasique;
      nom       = ind.nomBasique;
      textColor = '#fff';
    } else {
      // Interpolation dans la zone de virage
      const t = (ph - ind.plageMin) / (ind.plageMax - ind.plageMin);
      couleur   = _interpolateHex(ind.couleurAcide, ind.couleurBasique, t);
      nom       = `⇄ virage (pH ${ind.plageMin}–${ind.plageMax})`;
      textColor = '#fff';
    }

    return `
    <div class="carte-indicateur">
      <div class="ind-nom">${ind.nom}</div>
      <div class="ind-couleur" style="background:${couleur};color:${textColor};border:${nom==='incolore'?'1px solid #ddd':'none'}">${nom}</div>
      <div class="ind-plage">pH virage : ${ind.plageMin} – ${ind.plageMax}</div>
      <div class="ind-plage" style="margin-top:.2rem">📍 ${ind.localisation}</div>
    </div>`;
  }).join('');
}

function _majTubeVirtuel(ph) {
  const tube = document.getElementById('tube-virtuel');
  if (!tube) return;
  tube.style.background = _couleurPH(ph);
  tube.title = `pH = ${ph.toFixed(1)}`;
}

// ══════════════════════════════════════════════════════════════
// PH-MÈTRE VIRTUEL (saisie manuelle → mise à jour du simulateur)
// ══════════════════════════════════════════════════════════════
function _initPHmetreVirtuel() {
  const input = document.getElementById('phmetre-input');
  const btn   = document.getElementById('btn-mesurer');
  if (!input || !btn) return;

  btn.addEventListener('click', () => {
    const val = parseFloat(input.value);
    if (isNaN(val) || val < 0 || val > 14) {
      _flashError(input, 'pH entre 0 et 14');
      return;
    }
    const slider = document.getElementById('slider-ph');
    if (slider) {
      slider.value = val;
      _majToutSimulateur(val);
    }
    _logMesure(val, input.dataset.solution || 'solution inconnue');
  });

  // Saisie directe via touche Entrée
  input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
}

// Historique des mesures
const _mesures = [];
function _logMesure(ph, nom) {
  _mesures.push({ ph, nom, ts: new Date().toLocaleTimeString() });
  const log = document.getElementById('historique-mesures');
  if (!log) return;
  log.innerHTML = _mesures.slice(-10).reverse().map(m =>
    `<tr>
      <td>${m.ts}</td>
      <td>${m.nom}</td>
      <td><span class="capsule-concentration" style="background:${_couleurPH(m.ph)}20;color:var(--gris-ardoise)">${m.ph.toFixed(2)}</span></td>
      <td>${m.ph < 7 ? 'Acide' : m.ph > 7 ? 'Basique' : 'Neutre'}</td>
    </tr>`
  ).join('');
}

// ══════════════════════════════════════════════════════════════
// SÉLECTEUR DE SOLUTION (liste déroulante → simulateur)
// ══════════════════════════════════════════════════════════════
function _initSelecteurSolution() {
  const sel = document.getElementById('select-solution');
  if (!sel) return;

  sel.innerHTML = `<option value="">-- Choisir une solution --</option>` +
    SOLUTIONS_REFERENCES.map((s, i) =>
      `<option value="${i}">${s.nom} (pH = ${s.ph})</option>`
    ).join('');

  sel.addEventListener('change', () => {
    const idx = parseInt(sel.value);
    if (isNaN(idx)) return;
    const sol = SOLUTIONS_REFERENCES[idx];
    const slider = document.getElementById('slider-ph');
    if (slider) { slider.value = sol.ph; _majToutSimulateur(sol.ph); }
    const phmetre = document.getElementById('phmetre-input');
    if (phmetre) { phmetre.value = sol.ph; phmetre.dataset.solution = sol.nom; }
    _logMesure(sol.ph, sol.nom);
  });
}

// ══════════════════════════════════════════════════════════════
// CALCULATEUR pH — acide fort, acide faible, base forte, base faible
// ══════════════════════════════════════════════════════════════
function _initCalculateurPH() {
  const form = document.getElementById('calc-ph-form');
  if (!form) return;

  form.addEventListener('input', _calcPH);
  form.addEventListener('submit', e => { e.preventDefault(); _calcPH(); });
}

const PKA = {
  'CH3COOH': 4.76,
  'HF':      3.17,
  'HNO2':    3.37,
  'NH3':     9.25,
  'NH4OH':   9.25,
};

function _calcPH() {
  const type = document.getElementById('type-acide-base')?.value;
  const C    = parseFloat(document.getElementById('conc-calc-ph')?.value);
  const pKa  = parseFloat(document.getElementById('pka-calc-ph')?.value);
  const out  = document.getElementById('resultat-calc-ph');
  if (!out || isNaN(C) || C <= 0) return;

  let ph, formule, detail;

  switch (type) {
    case 'acide-fort':
      ph      = -Math.log10(C);
      formule = '[H₃O⁺] = C (dissociation totale)';
      detail  = `pH = −log(${C}) = ${ph.toFixed(2)}`;
      break;
    case 'base-forte':
      ph      = 14 + Math.log10(C);
      formule = '[HO⁻] = C → pOH = −log(C) → pH = 14 − pOH';
      detail  = `pOH = ${(-Math.log10(C)).toFixed(2)} → pH = ${ph.toFixed(2)}`;
      break;
    case 'acide-faible':
      if (isNaN(pKa)) { out.innerHTML='<span style="color:var(--rouge-ph)">Renseigner pKa.</span>'; return; }
      const Ka = Math.pow(10, -pKa);
      const h  = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * C)) / 2;
      ph       = -Math.log10(h);
      formule  = '[H₃O⁺] = (−Ka + √(Ka²+4KaC)) / 2';
      detail   = `Ka = ${Ka.toExponential(2)} → [H₃O⁺] = ${h.toExponential(3)} → pH = ${ph.toFixed(2)}`;
      break;
    case 'base-faible':
      if (isNaN(pKa)) { out.innerHTML='<span style="color:var(--rouge-ph)">Renseigner pKa (base).</span>'; return; }
      const Kb  = Math.pow(10, -(14 - pKa));
      const oh  = (-Kb + Math.sqrt(Kb * Kb + 4 * Kb * C)) / 2;
      const poh = -Math.log10(oh);
      ph        = 14 - poh;
      formule   = 'Kb calculé depuis pKa(acide conjugué) ; [HO⁻] analogue acide faible';
      detail    = `Kb = ${Kb.toExponential(2)} → [HO⁻] = ${oh.toExponential(3)} → pOH = ${poh.toFixed(2)} → pH = ${ph.toFixed(2)}`;
      break;
    default:
      return;
  }

  const slider = document.getElementById('slider-ph');
  if (slider) { slider.value = Math.min(Math.max(ph, 0), 14); _majToutSimulateur(ph); }

  out.innerHTML = `
  <div class="calcul-guide">
    <h4>📐 Résultat</h4>
    <div class="formule">${formule}</div>
    <p style="margin-top:.5rem;font-size:.88rem">${detail}</p>
    <div class="resultat-calcul">pH = ${ph.toFixed(2)}</div>
  </div>`;
}

// ══════════════════════════════════════════════════════════════
// TABLEAU DE RÉSULTATS — remplissage automatique couleurs
// ══════════════════════════════════════════════════════════════
function _initTableauResultats() {
  const tbody = document.getElementById('tbody-resultats-ph');
  if (!tbody) return;

  tbody.querySelectorAll('input[data-ph]').forEach(input => {
    input.addEventListener('input', () => {
      const ph = parseFloat(input.value);
      if (isNaN(ph)) return;
      const row = input.closest('tr');
      if (!row) return;

      // Remplir les colonnes indicateurs
      INDICATEURS_B27.forEach((ind, i) => {
        const td = row.querySelector(`[data-ind="${i}"]`);
        if (!td) return;
        let nom;
        if (ph < ind.plageMin)       nom = ind.nomAcide;
        else if (ph > ind.plageMax)  nom = ind.nomBasique;
        else                          nom = '⇄ virage';
        td.textContent = nom;
        td.style.background = ph < ind.plageMin ? ind.couleurAcide + '33' : ph > ind.plageMax ? ind.couleurBasique + '33' : '#F3E5F522';
      });

      // Caractère
      const tdCar = row.querySelector('[data-caractere]');
      if (tdCar) tdCar.textContent = ph < 7 ? 'Acide' : ph > 7 ? 'Basique' : 'Neutre';
    });
  });
}

// ══════════════════════════════════════════════════════════════
// QUIZ INDICATEURS — identification couleur → indicateur
// ══════════════════════════════════════════════════════════════
let _quizScore = 0, _quizTotal = 0;

function _initQuizIndicateurs() {
  const btn    = document.getElementById('btn-quiz-nouveau');
  const btnRst = document.getElementById('btn-quiz-reset');
  if (!btn) return;
  btn.addEventListener('click', _nouvelleQuestionQuiz);
  if (btnRst) btnRst.addEventListener('click', _resetQuiz);
}

function _resetQuiz() {
  _quizScore = 0; _quizTotal = 0;
  _majScoreQuiz();
  const zone = document.getElementById('quiz-zone-indicateurs');
  if (zone) zone.innerHTML = '<p style="color:var(--gris-moyen);text-align:center">Cliquer sur "Nouvelle question" pour commencer.</p>';
}

function _majScoreQuiz() {
  const sc = document.getElementById('quiz-score');
  const to = document.getElementById('quiz-total');
  if (sc) sc.textContent = _quizScore;
  if (to) to.textContent = _quizTotal;
}

function _nouvelleQuestionQuiz() {
  const zone = document.getElementById('quiz-zone-indicateurs');
  if (!zone) return;

  // Choisir un indicateur au hasard + un pH au hasard
  const ind   = INDICATEURS_B27[Math.floor(Math.random() * INDICATEURS_B27.length)];
  const phMod = Math.random();
  let ph, bonneReponse;
  if (phMod < 0.35) {
    ph = +(Math.random() * ind.plageMin).toFixed(1);
    bonneReponse = ind.nomAcide;
  } else if (phMod < 0.7) {
    ph = +(ind.plageMax + Math.random() * (14 - ind.plageMax)).toFixed(1);
    bonneReponse = ind.nomBasique;
  } else {
    ph = +(ind.plageMin + Math.random() * (ind.plageMax - ind.plageMin)).toFixed(1);
    bonneReponse = `zone de virage (${ind.plageMin}–${ind.plageMax})`;
  }

  // Options (éviter les doublons)
  const autresNoms = INDICATEURS_B27
    .filter(i => i.nom !== ind.nom)
    .flatMap(i => [i.nomAcide, i.nomBasique])
    .filter(n => n !== bonneReponse);
  const mauvaises = [...new Set(autresNoms)].sort(() => Math.random() - 0.5).slice(0, 3);
  const options   = [bonneReponse, ...mauvaises].sort(() => Math.random() - 0.5);

  zone.innerHTML = `
  <div style="margin-bottom:var(--gap-md)">
    <strong>${ind.nom}</strong> est utilisé comme indicateur.<br>
    Le pH de la solution est <strong>${ph}</strong>.<br>
    Quelle est la couleur de la solution avec cet indicateur ?
  </div>
  <div class="quiz-options">
    ${options.map(opt => `<button class="quiz-opt" data-correct="${opt === bonneReponse}">${opt}</button>`).join('')}
  </div>
  <div class="quiz-feedback" id="quiz-feedback-ind"></div>`;

  zone.querySelectorAll('.quiz-opt').forEach(btn => {
    btn.addEventListener('click', function () {
      zone.querySelectorAll('.quiz-opt').forEach(b => b.style.pointerEvents = 'none');
      _quizTotal++;
      const ok = this.dataset.correct === 'true';
      if (ok) _quizScore++;
      this.classList.add(ok ? 'correct' : 'incorrect');
      _majScoreQuiz();
      const fb = document.getElementById('quiz-feedback-ind');
      if (fb) fb.innerHTML = ok
        ? `<span style="color:var(--vert-acide)">✅ Correct ! ${ind.nom} est ${bonneReponse} à pH ${ph}</span>`
        : `<span style="color:var(--rouge-ph)">❌ Raté — la bonne réponse était : ${bonneReponse}</span>`;
    });
  });
}

// ══════════════════════════════════════════════════════════════
// UTILITAIRES
// ══════════════════════════════════════════════════════════════
function _couleurPH(ph) {
  const stops = [
    [0,'#FF0000'],[1,'#FF4500'],[2,'#FF8C00'],[3,'#FFA500'],[4,'#FFD700'],
    [5,'#ADFF2F'],[6,'#7CFC00'],[7,'#00FF7F'],[8,'#00CED1'],[9,'#1E90FF'],
    [10,'#4169E1'],[11,'#8A2BE2'],[12,'#9400D3'],[13,'#800080'],[14,'#4B0082']
  ];
  const i = Math.min(Math.floor(ph), 13);
  const t = ph - i;
  return _interpolateHex(stops[i][1], stops[i + 1][1], t);
}

function _interpolateHex(c1, c2, t) {
  const p = c => [parseInt(c.slice(1,3),16), parseInt(c.slice(3,5),16), parseInt(c.slice(5,7),16)];
  const [r1,g1,b1] = p(c1), [r2,g2,b2] = p(c2);
  const r = Math.round(r1 + (r2-r1)*t);
  const g = Math.round(g1 + (g2-g1)*t);
  const b = Math.round(b1 + (b2-b1)*t);
  return `rgb(${r},${g},${b})`;
}

function _formatSci(val) {
  if (val <= 0) return '0';
  const exp  = Math.floor(Math.log10(val));
  const mant = (val / Math.pow(10, exp)).toFixed(2);
  return `${mant} × 10<sup>${exp}</sup> mol/L`;
}

function _flashError(el, msg) {
  el.style.border = '2px solid var(--rouge-ph)';
  el.title = msg;
  setTimeout(() => { el.style.border = ''; el.title = ''; }, 2000);
}
