/* ════════════════════════════════════════════════════════════════
   balance-erreurs.js
   Calculateur d'erreurs absolue et relative pour deux balances
   Résolution 0,1 g  |  Résolution 1 g

   Usage :
     import { initBalanceErreurs } from "./balance-erreurs.js";
     initBalanceErreurs();          // appelé depuis init() du module TP

   Ou intégration directe dans tp01-solutions.js :
     import { initBalanceErreurs } from "../../js/balance-erreurs.js";
   ════════════════════════════════════════════════════════════════ */

/* ── Configuration des deux instruments ────────────────────── */

const BALANCES = [
  {
    id:          "01",           // suffixe des IDs HTML
    resolution:  0.1,            // g
    incertitude: 0.05,           // demi-résolution
    label:       "Balance 0,1 g"
  },
  {
    id:          "1g",
    resolution:  1,
    incertitude: 0.5,
    label:       "Balance 1 g"
  }
];

/* ── Seuils qualitatifs (erreur relative en %) ──────────────── */

const SEUILS = [
  { max: 2,   classe: "qualite-excellent", texte: "✅ Excellent  (< 2 %)"   },
  { max: 5,   classe: "qualite-correct",   texte: "⚠️ Acceptable (2 – 5 %)" },
  { max: 100, classe: "qualite-erreur",    texte: "❌ Insuffisant (> 5 %)"  }
];

/* ══════════════════════════════════════════════════════════════
   POINT D'ENTRÉE
   ══════════════════════════════════════════════════════════════ */

export function initBalanceErreurs() {

  const inputTheo = document.getElementById("pe-masse-theo");
  if (!inputTheo) return;   // fragment HTML absent de la page courante

  /* ── Listeners ──────────────────────────────────────────── */

  inputTheo.addEventListener("input", recalculerTout);

  BALANCES.forEach(b => {
    const input = document.getElementById(`pe-lue-${b.id}`);
    if (input) input.addEventListener("input", recalculerTout);
  });

  recalculerTout();   // calcul initial (champs vides → état placeholder)
}

/* ══════════════════════════════════════════════════════════════
   RECALCUL GLOBAL
   ══════════════════════════════════════════════════════════════ */

function recalculerTout() {

  const mTheo = lireNombre("pe-masse-theo");

  const resultats = BALANCES.map(b => {

    const mLue = lireNombre(`pe-lue-${b.id}`);
    const res   = calculerErreurs(mTheo, mLue, b);

    afficherResultatBalance(b, mLue, mTheo, res);

    return { b, mLue, res };
  });

  /* ── Synthèse comparative ───────────────────────────────── */

  const toutRempli =
    mTheo > 0 &&
    resultats.every(r => r.mLue > 0);

  const synthese = document.getElementById("synthese-balances");
  if (!synthese) return;

  synthese.style.display = toutRempli ? "block" : "none";

  if (toutRempli) {
    afficherSynthese(mTheo, resultats);
  }
}

/* ══════════════════════════════════════════════════════════════
   CALCUL
   ══════════════════════════════════════════════════════════════ */

function calculerErreurs(mTheo, mLue, balance) {

  if (mTheo <= 0 || mLue <= 0) return null;

  /* Erreur absolue constatée (écart réel) */
  const errAbs = Math.abs(mLue - mTheo);

  /* Erreur relative constatée (%) */
  const errRel = (errAbs / mTheo) * 100;

  /* Erreur relative maximale théorique due à l'instrument seul */
  const errRelMax = (balance.incertitude / mTheo) * 100;

  /* Dépassement : l'erreur réelle dépasse l'incertitude instrumentale ? */
  const depasse = errAbs > balance.incertitude;

  /* Qualité */
  const qualite = classerErreur(errRel);

  return { errAbs, errRel, errRelMax, depasse, qualite };
}

/* ── Classement qualitatif ──────────────────────────────────── */

function classerErreur(errRel) {
  return SEUILS.find(s => errRel <= s.max) ?? SEUILS[SEUILS.length - 1];
}

/* ══════════════════════════════════════════════════════════════
   AFFICHAGE — Carte balance
   ══════════════════════════════════════════════════════════════ */

function afficherResultatBalance(balance, mLue, mTheo, res) {

  const zone = document.getElementById(`res-${balance.id}`);
  if (!zone) return;

  if (!res) {
    zone.innerHTML = `
      <div class="balance-placeholder">
        Saisir les deux masses pour calculer
      </div>`;
    return;
  }

  const { errAbs, errRel, errRelMax, depasse, qualite } = res;

  zone.innerHTML = `

    <div class="balance-metric-grid">

      <!-- Erreur absolue -->
      <div class="balance-metric">
        <div class="balance-metric-label">Erreur absolue</div>
        <div class="balance-metric-value">
          ${fmt(errAbs, 2)} <span class="balance-metric-unit">g</span>
        </div>
        <div class="balance-metric-sub">
          Incertitude instrument : ± ${fmt(balance.incertitude, 2)} g
        </div>
        ${depasse
          ? `<div class="balance-depassement">
               ⚠️ Écart > incertitude instrumentale
             </div>`
          : `<div class="balance-ok">
               ✔ Dans l'incertitude instrumentale
             </div>`
        }
      </div>

      <!-- Erreur relative -->
      <div class="balance-metric">
        <div class="balance-metric-label">Erreur relative</div>
        <div class="balance-metric-value ${qualite.classe}">
          ${fmt(errRel, 2)} <span class="balance-metric-unit">%</span>
        </div>
        <div class="balance-metric-sub">
          Max instrument : ${fmt(errRelMax, 2)} %
        </div>
        <div class="${qualite.classe} balance-qualite-badge">
          ${qualite.texte}
        </div>
      </div>

    </div>

    <!-- Formule détaillée -->
    <div class="balance-detail">
      <div class="balance-detail-ligne">
        <span class="balance-detail-label">Δm</span>
        <span class="balance-detail-calc">
          |${fmt(mLue, 1)} − ${fmt(mTheo, 3)}| = <strong>${fmt(errAbs, 3)} g</strong>
        </span>
      </div>
      <div class="balance-detail-ligne">
        <span class="balance-detail-label">εᵣ</span>
        <span class="balance-detail-calc">
          ${fmt(errAbs, 3)} / ${fmt(mTheo, 3)} × 100 = <strong>${fmt(errRel, 2)} %</strong>
        </span>
      </div>
    </div>

  `;
}

/* ══════════════════════════════════════════════════════════════
   AFFICHAGE — Synthèse comparative
   ══════════════════════════════════════════════════════════════ */

function afficherSynthese(mTheo, resultats) {

  resultats.forEach(({ b, mLue, res }) => {

    const sid = b.id;

    setText(`syn-lue-${sid}`,  `${fmt(mLue, 1)} g`);
    setText(`syn-abs-${sid}`,  `${fmt(res.errAbs, 3)} g`);
    setText(`syn-rel-${sid}`,  `${fmt(res.errRel, 2)} %`);

    const qualEl = document.getElementById(`syn-qual-${sid}`);
    if (qualEl) {
      qualEl.textContent  = res.qualite.texte;
      qualEl.className    = res.qualite.classe;
    }
  });

  /* ── Conclusion ─────────────────────────────────────────── */

  const [r01, r1g] = resultats.map(r => r.res);
  const conclusion  = document.getElementById("synthese-conclusion");
  if (!conclusion) return;

  let texte = "";

  if (r01.errRel < r1g.errRel) {
    const gain = fmt(r1g.errRel - r01.errRel, 2);
    texte = `
      🏆 La balance 0,1 g est <strong>${fmt(r1g.errRel / Math.max(r01.errRel, 0.01), 1)}×
      plus précise</strong> que la balance 1 g
      (gain de ${gain} % d'erreur relative).
      Pour une masse de ${fmt(mTheo, 3)} g, privilégier la balance 0,1 g.
    `;
  } else if (r01.errRel === r1g.errRel) {
    texte = `Les deux instruments donnent la même précision relative pour cette pesée.`;
  } else {
    texte = `
      Résultat inhabituel : vérifier les valeurs saisies.
      L'erreur relative de la balance 1 g est inférieure à celle de la balance 0,1 g.
    `;
  }

  conclusion.innerHTML = texte;
}

/* ══════════════════════════════════════════════════════════════
   UTILITAIRES
   ══════════════════════════════════════════════════════════════ */

function lireNombre(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  const v = parseFloat(el.value);
  return isNaN(v) || v < 0 ? 0 : v;
}

function fmt(v, decimales = 2) {
  return Number(v).toFixed(decimales);
}

function setText(id, texte) {
  const el = document.getElementById(id);
  if (el) el.textContent = texte;
}
