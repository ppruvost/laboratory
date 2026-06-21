/**
 * tp05.js — Chimie organique
 * Gère : identification de fonctions chimiques, test de Fehling interactif,
 *        calculateur de rendement (estérification), chromatographie sur couche
 *        mince (CCM) simulée, saponification, identification odeurs
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
      { reactif: 'Dichromate K₂Cr₂O₇ / H₂SO₄ (chaud)', positif: 'Orange → vert-bleu', negatif: 'Reste orange' },
      { reactif: 'Na métal', positif: 'Dégagement H₂', negatif: 'Rien' },
    ],
    couleur: '#2E86C1',
    polarite: 'Polaire (liaisons H)',
  },
  {
    nom: 'Acide carboxylique',
    suffix: '-oïque',
    formuleGenerique: 'R–COOH',
    exemples: ['Acide éthanoïque CH₃COOH', 'Acide butanoïque', 'Acide propanoïque'],
    tests: [
      { reactif: 'Carbonate de sodium Na₂CO₃', positif: 'Effervescence CO₂', negatif: 'Rien' },
      { reactif: 'Papier pH-mètre', positif: 'pH < 5', negatif: 'pH > 5' },
      { reactif: 'Bicarbonate NaHCO₃', positif: 'Effervescence', negatif: 'Rien' },
    ],
    couleur: '#C0392B',
    polarite: 'Très polaire (liaisons H fortes)',
  },
  {
    nom: 'Ester',
    suffix: '-anoate de …',
    formuleGenerique: 'R–COO–R\'',
    exemples: ['Acétate d\'isoamyle (banane)', 'Acétate d\'éthyle (colle)', 'Éthanoate de butyle'],
    tests: [
      { reactif: 'Odeur caractéristique', positif: 'Odeur fruitée / aromatique', negatif: '—' },
      { reactif: 'Hydrolyse NaOH (saponification)', positif: 'Carboxylate + alcool', negatif: '—' },
    ],
    couleur: '#F39C12',
    polarite: 'Peu polaire (pas de liaison H)',
  },
  {
    nom: 'Aldéhyde',
    suffix: '-al',
    formuleGenerique: 'R–CHO',
    exemples: ['Éthanal CH₃CHO', 'Benzaldéhyde', 'Glucose (aldéhyde cyclisé)'],
    tests: [
      { reactif: 'Réactif de Fehling (chaud)', positif: 'Précipité rouge brique Cu₂O', negatif: 'Reste bleu' },
      { reactif: 'Réactif de Tollens', positif: 'Miroir d\'argent sur les parois', negatif: 'Rien' },
      { reactif: 'DNPH', positif: 'Précipité jaune-orangé', negatif: 'Rien' },
    ],
    couleur: '#E67E22',
    polarite: 'Polaire (pas de liaison H inter)',
  },
  {
    nom: 'Cétone',
    suffix: '-one',
    formuleGenerique: 'R–CO–R\'',
    exemples: ['Propanone (acétone) CH₃COCH₃', 'Acétophénone C₈H₈O', 'Cyclohexanone'],
    tests: [
      { reactif: 'Réactif de Fehling (chaud)', positif: '— (négatif)', negatif: 'Reste bleu ✓' },
      { reactif: 'DNPH', positif: 'Précipité jaune-orangé', negatif: 'Rien' },
    ],
    couleur: '#8E44AD',
    polarite: 'Polaire',
  },
  {
    nom: 'Amine',
    suffix: '-amine / amino-',
    formuleGenerique: 'R–NH₂',
    exemples: ['Hexaméthylène diamine H₂N(CH₂)₆NH₂'],
    tests: [
      { reactif: 'Papier pH', positif: 'pH basique (> 8)', negatif: '—' },
      { reactif: 'Odeur de poisson', positif: 'Amines aliphatiques', negatif: '—' },
    ],
    couleur: '#27AE60',
    polarite: 'Polaire (base de Lewis)',
  },
];

// ── Esters de B27 (odeurs) ────────────────────────────────────
const ESTERS_ODEURS = [
  { nom: 'Acétate d\'isoamyle', acide: 'acide éthanoïque', alcool: 'alcool isoamylique', odeur: '🍌 banane', couleur: '#F9E79F' },
  { nom: 'Acétate d\'éthyle',   acide: 'acide éthanoïque', alcool: 'éthanol',            odeur: '🧪 colle / vernis', couleur: '#FAD7A0' },
  { nom: 'Acétate de butyle',   acide: 'acide éthanoïque', alcool: 'butanol',             odeur: '🍎 pomme', couleur: '#A9DFBF' },
  { nom: 'Butyrate d\'éthyle',  acide: 'acide butanoïque', alcool: 'éthanol',             odeur: '🍍 ananas', couleur: '#AED6F1' },
  { nom: 'Butyrate d\'isoamyle',acide: 'acide butanoïque', alcool: 'alcool isoamylique', odeur: '🍐 poire', couleur: '#D5F5E3' },
  { nom: 'Propanoate d\'éthyle',acide: 'acide propanoïque',alcool: 'éthanol',             odeur: '🍇 fruit exotique', couleur: '#E8DAEF' },
];

// ══════════════════════════════════════════════════════════════
// INIT PRINCIPALE
// ══════════════════════════════════════════════════════════════
export function init() {
  _initSecurite();
  initSections();
  initTabs();
  _initCartesFonctions();
  _initTestFehling();
  _initCalculateurEster();
  _initRendementEster();
  _initCCM();
  _initQuizFonctions();
  _initEstersOdeurs();
}

// ── Sécurité ──────────────────────────────────────────────────
function _initSecurite() {
  const el = document.getElementById('securite-bloc');
  if (!el) return;
  const CAS = ['64-19-7', '123-51-3', '7758-99-8', '1310-73-2', '1310-73-2b', '67-64-1', '98-86-2'];
  const produits = CAS.map(c => PRODUITS.find(p => p.cas === c)).filter(Boolean);
  el.innerHTML = renderBlocSecurite(produits);
}

// ══════════════════════════════════════════════════════════════
// CARTES DES FONCTIONS ORGANIQUES
// ══════════════════════════════════════════════════════════════
function _initCartesFonctions() {
  const cont = document.getElementById('cartes-fonctions');
  if (!cont) return;

  cont.innerHTML = FONCTIONS.map(f => `
  <div class="section" data-type="protocole" style="border-top:4px solid ${f.couleur}">
    <div class="section-titre" style="cursor:pointer">
      <div class="picto-section" style="background:${f.couleur}22;color:${f.couleur}">⚗️</div>
      <h2>${f.nom} &nbsp;<code style="font-size:.8rem;background:${f.couleur}22;padding:.1rem .4rem;border-radius:4px">${f.formuleGenerique}</code></h2>
      <span class="chevron">▼</span>
    </div>
    <div class="section-corps">
      <p style="margin-bottom:.5rem"><strong>Exemples disponibles en B27 :</strong> ${f.exemples.join(' · ')}</p>
      <p style="margin-bottom:.8rem"><strong>Polarité :</strong> ${f.polarite} · <strong>Nomenclature :</strong> suffixe <em>${f.suffix}</em></p>
      <h4 style="font-family:var(--font-titre);font-size:.85rem;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.5rem">Tests d'identification</h4>
      <table class="tableau-resultats" style="font-size:.83rem">
        <thead><tr><th>Réactif / Test</th><th>✅ Résultat positif</th><th>❌ Résultat négatif</th></tr></thead>
        <tbody>
          ${f.tests.map(t => `<tr><td>${t.reactif}</td><td style="color:var(--vert-acide);font-weight:600">${t.positif}</td><td style="color:var(--gris-moyen)">${t.negatif}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`).join('');

  // Réattacher les listeners de toggle aux nouvelles sections
  cont.querySelectorAll('.section-titre').forEach(titre => {
    titre.addEventListener('click', () => {
      const sec = titre.closest('.section');
      sec.classList.toggle('fermee');
      const chev = titre.querySelector('.chevron');
      if (chev) chev.textContent = sec.classList.contains('fermee') ? '▶' : '▼';
    });
  });
}

// ══════════════════════════════════════════════════════════════
// TEST DE FEHLING INTERACTIF
// ══════════════════════════════════════════════════════════════
const RESULTATS_FEHLING = {
  glucose:      { resultat: true,  observation: 'Précipité rouge brique (Cu₂O) — glucose est un aldéhyde (réducteur)', couleur: '#8B4513' },
  fructose:     { resultat: true,  observation: 'Positif (fructose se réarrange en aldéhyde en milieu basique)', couleur: '#8B4513' },
  saccharose:   { resultat: false, observation: 'Aucun précipité — saccharose n\'est pas réducteur (liaison O-glycosidique)', couleur: '#1B6CA8' },
  ethanal:      { resultat: true,  observation: 'Précipité rouge brique — éthanal est un aldéhyde', couleur: '#8B4513' },
  acetone:      { resultat: false, observation: 'Reste bleu — acétone est une cétone (non réductrice)', couleur: '#1B6CA8' },
  propanone:    { resultat: false, observation: 'Reste bleu — cétone non réductrice', couleur: '#1B6CA8' },
  benzaldehyde: { resultat: true,  observation: 'Positif — benzaldéhyde est un aldéhyde aromatique', couleur: '#8B4513' },
};

function _initTestFehling() {
  const sel  = document.getElementById('sel-fehling');
  const btn  = document.getElementById('btn-fehling');
  const tube = document.getElementById('tube-fehling');
  const res  = document.getElementById('res-fehling');
  if (!sel || !btn) return;

  sel.innerHTML = `<option value="">-- Choisir --</option>` +
    Object.keys(RESULTATS_FEHLING).map(k =>
      `<option value="${k}">${k.charAt(0).toUpperCase() + k.slice(1)}</option>`
    ).join('');

  let phase = 0; // 0=initial, 1=bleu avant chauffe, 2=résultat

  btn.addEventListener('click', () => {
    const mol = sel.value;
    if (!mol) return;
    const data = RESULTATS_FEHLING[mol];

    if (phase === 0) {
      // Phase 1 : mélange Fehling A + B → bleu
      if (tube) { tube.style.background = '#1B6CA8'; tube.title = 'Solution bleue (Cu²⁺ complexé)'; }
      if (res)  res.innerHTML = '<span style="color:var(--bleu-cuivre)">🔵 Mélange Fehling A+B : solution bleue cobalt. Cliquer à nouveau pour chauffer.</span>';
      btn.textContent = '🔥 Chauffer au bain-marie (70°C – 5 min)';
      phase = 1;
    } else {
      // Phase 2 : résultat après chauffe
      if (tube) { tube.style.background = data.couleur; }
      if (res)  {
        res.innerHTML = `
        <div style="padding:var(--gap-sm) var(--gap-md);border-radius:var(--r-md);background:${data.resultat ? '#D5F5E3' : '#D6EAF8'};border-left:4px solid ${data.resultat ? 'var(--vert-acide)' : 'var(--bleu-cuivre)'}">
          <strong>${data.resultat ? '✅ POSITIF' : '❌ NÉGATIF'}</strong><br>
          ${data.observation}
        </div>`;
      }
      btn.textContent = '🔄 Réinitialiser';
      phase = 0;
      if (tube) setTimeout(() => { if (tube) tube.style.background = '#1B6CA8'; }, 4000);
    }
  });
}

// ══════════════════════════════════════════════════════════════
// CALCULATEUR D'ESTÉRIFICATION
// ══════════════════════════════════════════════════════════════
const MASSES_MOLAIRES_ORG = {
  'CH3COOH':       60.05,
  'C3H6O2':        74.08, // acide propanoïque
  'C4H8O2':        88.11, // acide butanoïque
  'C2H5OH':        46.07, // éthanol
  'C5H12O':        88.15, // alcool isoamylique (isoamyle éthanoate formule alcool)
  'C4H10O':        74.12, // butanol
  'ester_acetate_isoamyle': 130.19,
  'ester_acetate_ethyle':    88.11,
  'H2O':            18.02,
};

function _initCalculateurEster() {
  const form = document.getElementById('form-ester-calc');
  if (!form) return;

  form.addEventListener('input', _calcEster);
}

function _calcEster() {
  const vacide  = parseFloat(document.getElementById('v-acide')?.value)  || 10;
  const valcool = parseFloat(document.getElementById('v-alcool')?.value) || 10;
  const dacide  = parseFloat(document.getElementById('d-acide')?.value)  || 1.05; // densité CH3COOH
  const dalcool = parseFloat(document.getElementById('d-alcool')?.value) || 0.81; // densité alcool isoa.
  const Macide  = parseFloat(document.getElementById('m-acide')?.value)  || 60.05;
  const Malcool = parseFloat(document.getElementById('m-alcool')?.value) || 88.15;
  const Mester  = parseFloat(document.getElementById('m-ester')?.value)  || 130.19;

  const macide  = vacide  * dacide;   // g
  const malcool = valcool * dalcool;  // g
  const nacide  = macide  / Macide;   // mol
  const nalcool = malcool / Malcool;  // mol

  // Réactif limitant
  const limitant = nacide < nalcool ? 'acide' : 'alcool';
  const nLimit   = Math.min(nacide, nalcool);
  const nEster   = nLimit; // stœchiométrie 1:1
  const mEster   = nEster * Mester;

  const out = document.getElementById('res-calc-ester');
  if (!out) return;

  out.innerHTML = `
  <div class="formule-bloc">
    n(acide) = ${macide.toFixed(2)} / ${Macide} = <strong>${nacide.toFixed(4)} mol</strong><br>
    n(alcool) = ${malcool.toFixed(2)} / ${Malcool} = <strong>${nalcool.toFixed(4)} mol</strong><br>
    Réactif limitant : <strong>${limitant}</strong> (${nLimit.toFixed(4)} mol)<br>
    Masse ester théorique max = ${nLimit.toFixed(4)} × ${Mester} = <strong>${mEster.toFixed(2)} g</strong>
  </div>`;

  // Stocker la valeur théo pour calcul rendement
  const inTheo = document.getElementById('m-ester-theo');
  if (inTheo) inTheo.value = mEster.toFixed(3);
}

// ══════════════════════════════════════════════════════════════
// CALCUL DE RENDEMENT
// ══════════════════════════════════════════════════════════════
function _initRendementEster() {
  const ids = ['m-ester-theo', 'm-ester-exp'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', _calcRendement);
  });
}

function _calcRendement() {
  const mTheo = parseFloat(document.getElementById('m-ester-theo')?.value);
  const mExp  = parseFloat(document.getElementById('m-ester-exp')?.value);
  const out   = document.getElementById('res-rendement');
  if (!out || isNaN(mTheo) || isNaN(mExp) || mTheo === 0) return;

  const rend = +(mExp / mTheo * 100).toFixed(1);
  const col  = rend > 80 ? 'var(--vert-acide)' : rend > 50 ? 'var(--ambre-fer)' : 'var(--rouge-ph)';
  out.innerHTML = `
  <div class="resultat-calcul" style="color:${col}">
    η = ${mExp} / ${mTheo.toFixed(3)} × 100 = <strong>${rend} %</strong>
  </div>
  <p style="font-size:.82rem;color:var(--gris-moyen);margin-top:.3rem">
    ${rend > 80 ? '✅ Excellent rendement' : rend > 50 ? '⚠️ Rendement moyen (pertes lors de la purification ?)' : '❌ Rendement faible — vérifier la méthode de purification'}
  </p>`;
}

// ══════════════════════════════════════════════════════════════
// CHROMATOGRAPHIE SUR COUCHE MINCE (CCM) — simulateur visuel
// ══════════════════════════════════════════════════════════════
function _initCCM() {
  const canvas = document.getElementById('canvas-ccm');
  const btn    = document.getElementById('btn-eluer');
  if (!canvas || !btn) return;

  const SPOTS = [
    { nom: 'Acide éthanoïque', Rf: 0.25, couleur: '#E74C3C', diam: 10 },
    { nom: 'Alcool isoamylique', Rf: 0.55, couleur: '#3498DB', diam: 10 },
    { nom: 'Ester (produit brut)', Rf: 0.72, couleur: '#F39C12', diam: 14 },
    { nom: 'Ester (purifié)', Rf: 0.73, couleur: '#E67E22', diam: 10 },
  ];

  let _elution = 0;
  let _animId  = null;

  function dessiner(progress) {
    const dpr = window.devicePixelRatio || 1;
    const W   = canvas.offsetWidth || 300;
    const H   = 400;
    canvas.width  = W * dpr; canvas.height = H * dpr;
    canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // Fond
    ctx.fillStyle = '#FAF9F6'; ctx.fillRect(0, 0, W, H);

    // Plaque silice
    ctx.fillStyle = '#EAECEE'; ctx.fillRect(20, 20, W - 40, H - 40);
    ctx.strokeStyle = '#BDC3C7'; ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 20, W - 40, H - 40);

    // Ligne dépôt (bas)
    ctx.strokeStyle = '#E74C3C'; ctx.lineWidth = 1; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(20, H - 50); ctx.lineTo(W - 20, H - 50); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#E74C3C'; ctx.font = '10px sans-serif'; ctx.textAlign = 'left';
    ctx.fillText('Ligne de dépôt', 24, H - 54);

    // Front solvant
    const frontY = H - 50 - progress * (H - 100);
    ctx.strokeStyle = '#1B6CA8'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(20, frontY); ctx.lineTo(W - 20, frontY); ctx.stroke();
    ctx.fillStyle = '#1B6CA8'; ctx.font = '10px sans-serif';
    ctx.fillText('Front solvant', 24, frontY - 4);

    // Distance front
    const Df = H - 50 - frontY;

    // Spots
    const colonnes = [W * 0.25, W * 0.45, W * 0.65, W * 0.82];
    SPOTS.forEach((spot, i) => {
      const x  = colonnes[i] || W / 2;
      const y0 = H - 50; // ligne de dépôt
      const dy = Math.min(spot.Rf * Df, Df); // ne dépasse pas le front
      const cy = y0 - dy;

      // Spot coloré
      ctx.beginPath();
      ctx.arc(x, cy, spot.diam / 2, 0, Math.PI * 2);
      ctx.fillStyle = spot.couleur + 'CC';
      ctx.fill();
      ctx.strokeStyle = spot.couleur;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ligne Rf
      if (progress > 0.1) {
        ctx.strokeStyle = spot.couleur + '66'; ctx.lineWidth = .6; ctx.setLineDash([2, 2]);
        ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, cy); ctx.stroke();
        ctx.setLineDash([]);
      }

      // Étiquette
      ctx.fillStyle = spot.couleur; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(spot.nom.split(' ').slice(-1)[0], x, H - 30);
      if (progress > 0.8) {
        ctx.fillText(`Rf = ${spot.Rf}`, x, cy - 8);
      }
    });

    // Légende Rf
    if (progress > 0.95) {
      ctx.fillStyle = '#333'; ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(`Rf = distance spot / distance front`, W / 2, H - 12);
    }
  }

  dessiner(0);

  btn.addEventListener('click', () => {
    if (_animId) { cancelAnimationFrame(_animId); _elution = 0; }
    _elution = 0;

    function animer() {
      _elution = Math.min(_elution + 0.008, 1);
      dessiner(_elution);
      if (_elution < 1) _animId = requestAnimationFrame(animer);
      else btn.textContent = '🔄 Recommencer';
    }
    btn.textContent = '⏳ Élution en cours…';
    animer();
  });
}

// ══════════════════════════════════════════════════════════════
// QUIZ IDENTIFICATION DE FONCTIONS
// ══════════════════════════════════════════════════════════════
let _qScore = 0, _qTotal = 0;

function _initQuizFonctions() {
  const btn  = document.getElementById('btn-quiz-fonctions');
  const btnR = document.getElementById('btn-quiz-fonctions-reset');
  if (!btn) return;
  btn.addEventListener('click', _nouvelleQFonctions);
  if (btnR) btnR.addEventListener('click', () => {
    _qScore = 0; _qTotal = 0;
    _setText('qf-score', '0'); _setText('qf-total', '0');
    const z = document.getElementById('quiz-fonctions-zone');
    if (z) z.innerHTML = '<p style="color:var(--gris-moyen);text-align:center">Cliquer pour commencer.</p>';
  });
}

function _nouvelleQFonctions() {
  const zone = document.getElementById('quiz-fonctions-zone');
  if (!zone) return;

  // Choisir une molécule au hasard parmi les exemples des fonctions
  const fn = FONCTIONS[Math.floor(Math.random() * FONCTIONS.length)];
  const mol = fn.exemples[Math.floor(Math.random() * fn.exemples.length)];
  const bonneReponse = fn.nom;
  const mauvaises = FONCTIONS.filter(f => f.nom !== bonneReponse)
    .sort(() => Math.random() - 0.5).slice(0, 3).map(f => f.nom);
  const options = [bonneReponse, ...mauvaises].sort(() => Math.random() - 0.5);

  zone.innerHTML = `
  <div style="margin-bottom:var(--gap-md)">
    Quelle est la <strong>fonction chimique</strong> de cette molécule ?<br>
    <span style="font-family:var(--font-code);font-size:1.2rem;color:var(--bleu-cuivre)">${mol}</span>
  </div>
  <div class="quiz-options">
    ${options.map(opt => `<button class="quiz-opt" data-correct="${opt === bonneReponse}">${opt}</button>`).join('')}
  </div>
  <div class="quiz-feedback" id="qf-feedback"></div>`;

  zone.querySelectorAll('.quiz-opt').forEach(b => {
    b.addEventListener('click', function () {
      zone.querySelectorAll('.quiz-opt').forEach(x => x.style.pointerEvents = 'none');
      _qTotal++;
      const ok = this.dataset.correct === 'true';
      if (ok) _qScore++;
      this.classList.add(ok ? 'correct' : 'incorrect');
      _setText('qf-score', _qScore); _setText('qf-total', _qTotal);
      const fb = document.getElementById('qf-feedback');
      if (fb) fb.innerHTML = ok
        ? `<span style="color:var(--vert-acide)">✅ Correct ! ${mol} est un(e) ${bonneReponse}</span>`
        : `<span style="color:var(--rouge-ph)">❌ Raté — c'était : ${bonneReponse} (${fn.formuleGenerique})</span>`;
    });
  });
}

// ══════════════════════════════════════════════════════════════
// GALERIE ESTERS ET ODEURS
// ══════════════════════════════════════════════════════════════
function _initEstersOdeurs() {
  const cont = document.getElementById('galerie-esters');
  if (!cont) return;

  cont.innerHTML = ESTERS_ODEURS.map(e => `
  <div style="border:1px solid var(--gris-clair);border-radius:var(--r-md);padding:var(--gap-sm);background:${e.couleur}44;text-align:center">
    <div style="font-size:2rem;margin-bottom:.3rem">${e.odeur.split(' ')[0]}</div>
    <div style="font-weight:700;font-size:.88rem">${e.nom}</div>
    <div style="font-size:.75rem;color:var(--gris-moyen);margin-top:.3rem">
      ${e.acide} + ${e.alcool}
    </div>
    <div style="font-family:var(--font-code);font-size:.78rem;margin-top:.3rem;color:var(--ambre-fer)">
      ${e.odeur.split(' ').slice(1).join(' ')}
    </div>
  </div>`).join('');
}

// ══════════════════════════════════════════════════════════════
// UTILITAIRES
// ══════════════════════════════════════════════════════════════
function _setText(id, txt) {
  const el = document.getElementById(id);
  if (el) el.textContent = txt;
}
