/* ════════════════════════════════════════════════════════════════
   balance-erreurs.css
   Styles du module calculateur d'erreurs de pesée
   Dépend de : global.css (tokens CSS)
   ════════════════════════════════════════════════════════════════ */

/* ── Introduction ───────────────────────────────────────────── */

.balance-intro {
  background: #eff6ff;
  border-left: 4px solid var(--bleu-cuivre);
  border-radius: 0 var(--r-md) var(--r-md) 0;
  padding: var(--gap-sm) var(--gap-md);
  margin-bottom: var(--gap-md);
  font-size: .92rem;
  color: var(--gris-ardoise);
}

/* ── Saisie masse théorique ─────────────────────────────────── */

.balance-params {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-md);
  margin-bottom: var(--gap-md);
  padding: var(--gap-md);
  background: var(--blanc-paillasse);
  border: 1px solid var(--gris-clair);
  border-radius: var(--r-md);
}

.balance-param-group {
  display: flex;
  flex-direction: column;
  gap: .4rem;
}

.balance-param-group label {
  font-family: var(--font-titre);
  font-size: .82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: var(--gris-moyen);
}

.balance-param-group label em {
  font-weight: 400;
  font-style: normal;
  color: var(--gris-moyen);
}

.balance-input-row {
  display: flex;
  align-items: center;
  gap: .5rem;
}

.balance-input-row input[type="number"] {
  width: 160px;
  max-width: 100%;
  font-family: var(--font-code);
  font-size: 1.1rem;
  font-weight: 600;
  padding: .5rem .8rem;
  border: 2px solid var(--gris-clair);
  border-radius: var(--r-sm);
  transition: border-color .2s;
  background: #fff;
}

.balance-input-row input[type="number"]:focus {
  outline: none;
  border-color: var(--bleu-cuivre);
  box-shadow: 0 0 0 3px rgba(27, 108, 168, .12);
}

.balance-unit {
  font-family: var(--font-code);
  font-size: .95rem;
  color: var(--gris-moyen);
  font-weight: 600;
}

/* ── Grille deux balances ───────────────────────────────────── */

.balances-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gap-md);
  margin-bottom: var(--gap-md);
}

@media (max-width: 760px) {
  .balances-grid {
    grid-template-columns: 1fr;
  }
}

/* ── Carte balance ──────────────────────────────────────────── */

.balance-card {
  border: 1px solid var(--gris-clair);
  border-radius: var(--r-lg);
  overflow: hidden;
  background: #fff;
  box-shadow: var(--ombre-carte);
  display: flex;
  flex-direction: column;
}

/* En-têtes colorés différenciés */

.balance-card-header {
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
  padding: var(--gap-sm) var(--gap-md);
  color: #fff;
}

.balance-header-01 {
  background: linear-gradient(135deg, var(--bleu-cuivre) 0%, #0D4F8A 100%);
}

.balance-header-1g {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
}

.balance-icon {
  font-size: 1.6rem;
  flex-shrink: 0;
}

.balance-card-title {
  font-family: var(--font-titre);
  font-weight: 700;
  font-size: .95rem;
  line-height: 1.2;
}

.balance-resolution {
  font-size: .78rem;
  opacity: .85;
  margin-top: .1rem;
}

.balance-incert-badge {
  margin-left: auto;
  background: rgba(255, 255, 255, .2);
  border: 1px solid rgba(255, 255, 255, .35);
  border-radius: 20px;
  padding: .2rem .7rem;
  font-family: var(--font-code);
  font-size: .78rem;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Corps carte */

.balance-card-body {
  padding: var(--gap-md);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);
}

.balance-field {
  display: flex;
  flex-direction: column;
  gap: .35rem;
}

.balance-field label {
  font-family: var(--font-titre);
  font-size: .82rem;
  font-weight: 600;
  color: var(--gris-ardoise);
}

.balance-field label em {
  font-style: normal;
  color: var(--gris-moyen);
  font-weight: 400;
}

.balance-hint {
  font-size: .75rem;
  color: var(--gris-moyen);
  font-style: italic;
}

/* Placeholder état vide */

.balance-placeholder {
  text-align: center;
  padding: var(--gap-md);
  color: var(--gris-moyen);
  font-size: .85rem;
  font-style: italic;
  border: 2px dashed var(--gris-clair);
  border-radius: var(--r-md);
  margin-top: var(--gap-sm);
}

/* ── Grille de métriques dans chaque carte ──────────────────── */

.balance-metric-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--gap-sm);
  margin-top: var(--gap-sm);
}

@media (max-width: 500px) {
  .balance-metric-grid {
    grid-template-columns: 1fr;
  }
}

.balance-metric {
  background: var(--blanc-paillasse);
  border: 1px solid var(--gris-clair);
  border-radius: var(--r-md);
  padding: var(--gap-sm);
  display: flex;
  flex-direction: column;
  gap: .3rem;
}

.balance-metric-label {
  font-family: var(--font-titre);
  font-size: .72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .07em;
  color: var(--gris-moyen);
}

.balance-metric-value {
  font-family: var(--font-code);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gris-ardoise);
  line-height: 1.1;
}

.balance-metric-unit {
  font-size: .9rem;
  color: var(--gris-moyen);
  font-weight: 400;
}

.balance-metric-sub {
  font-size: .72rem;
  color: var(--gris-moyen);
  font-family: var(--font-code);
}

/* Badges qualitatifs */

.balance-qualite-badge {
  font-size: .75rem;
  font-weight: 600;
  padding: .2rem .5rem;
  border-radius: var(--r-sm);
  margin-top: .2rem;
  display: inline-block;
}

.qualite-excellent {
  color: #065f46;
  background: #d1fae5;
}

.qualite-correct {
  color: #92400e;
  background: #fef3c7;
}

.qualite-erreur {
  color: #991b1b;
  background: #fee2e2;
}

/* Messages dépassement / OK */

.balance-depassement {
  font-size: .73rem;
  color: #b45309;
  background: #fef3c7;
  padding: .2rem .5rem;
  border-radius: var(--r-sm);
  margin-top: .2rem;
}

.balance-ok {
  font-size: .73rem;
  color: #065f46;
  background: #d1fae5;
  padding: .2rem .5rem;
  border-radius: var(--r-sm);
  margin-top: .2rem;
}

/* ── Détail formule ─────────────────────────────────────────── */

.balance-detail {
  margin-top: var(--gap-sm);
  padding: var(--gap-sm);
  background: #f8fafc;
  border-radius: var(--r-sm);
  border: 1px solid var(--gris-clair);
  display: flex;
  flex-direction: column;
  gap: .3rem;
}

.balance-detail-ligne {
  display: flex;
  align-items: baseline;
  gap: .6rem;
  font-size: .82rem;
  font-family: var(--font-code);
}

.balance-detail-label {
  width: 1.8rem;
  font-weight: 700;
  color: var(--bleu-cuivre);
  flex-shrink: 0;
}

.balance-detail-calc {
  color: var(--gris-ardoise);
}

/* ── Synthèse comparative ───────────────────────────────────── */

.balance-synthese {
  background: #fff;
  border: 1px solid var(--gris-clair);
  border-radius: var(--r-md);
  overflow: hidden;
  margin-bottom: var(--gap-md);
  box-shadow: var(--ombre-carte);
}

.synthese-titre {
  display: flex;
  align-items: center;
  gap: var(--gap-sm);
  padding: var(--gap-sm) var(--gap-md);
  background: var(--gris-ardoise);
  color: #fff;
  font-family: var(--font-titre);
  font-weight: 700;
  font-size: .92rem;
}

.tableau-comparaison {
  width: 100%;
  border-collapse: collapse;
  font-size: .88rem;
}

.tableau-comparaison th {
  background: var(--blanc-paillasse);
  font-family: var(--font-titre);
  font-size: .78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: var(--gris-moyen);
  padding: .6rem var(--gap-md);
  border-bottom: 2px solid var(--gris-clair);
  text-align: left;
}

.tableau-comparaison td {
  padding: .55rem var(--gap-md);
  border-bottom: 1px solid var(--gris-clair);
  font-family: var(--font-code);
  font-size: .85rem;
}

.tableau-comparaison tr:last-child td {
  border-bottom: none;
}

.tableau-comparaison td:first-child {
  font-family: var(--font-corps);
  font-weight: 600;
  color: var(--gris-ardoise);
}

.synthese-conclusion-row td {
  padding: var(--gap-sm) var(--gap-md) !important;
  background: #eff6ff;
  font-family: var(--font-corps) !important;
  font-size: .88rem !important;
  color: var(--gris-ardoise);
  line-height: 1.5;
  border-top: 2px solid #bfdbfe !important;
}

/* ── Théorie dépliable ──────────────────────────────────────── */

.balance-theorie {
  border: 1px solid var(--gris-clair);
  border-radius: var(--r-md);
  overflow: hidden;
  background: #fff;
}

.balance-theorie summary {
  padding: var(--gap-sm) var(--gap-md);
  font-family: var(--font-titre);
  font-weight: 600;
  font-size: .88rem;
  cursor: pointer;
  user-select: none;
  color: var(--gris-ardoise);
  background: var(--blanc-paillasse);
  border-bottom: 1px solid transparent;
  transition: background .2s;
  list-style: none;
  display: flex;
  align-items: center;
  gap: .5rem;
}

.balance-theorie[open] summary {
  border-bottom-color: var(--gris-clair);
}

.balance-theorie summary:hover {
  background: #e8f0fb;
}

.balance-theorie-corps {
  padding: var(--gap-md);
  display: flex;
  flex-direction: column;
  gap: var(--gap-sm);
  font-size: .88rem;
  line-height: 1.6;
  color: var(--gris-ardoise);
}
