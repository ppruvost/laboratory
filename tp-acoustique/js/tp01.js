/* ===================================================================
   TP Vitesse du son — logique
   =================================================================== */

/* ---------------------------------------------------------------
   1. Oscilloscope de démonstration (hero)
   v est fixé à 340 m/s pour l'illustration ; on fait varier f et d
   pour montrer le déphasage entre les deux signaux.
   ----------------------------------------------------------------*/
(function scopeDemo() {
  const V_DEMO = 340; // m/s, valeur de référence pour l'animation
  const freqRange = document.getElementById('freqRange');
  const distRange = document.getElementById('distRange');
  const readout = document.getElementById('scopeReadout');
  const waveMic1 = document.getElementById('waveMic1');
  const waveMic2 = document.getElementById('waveMic2');
  const grid = document.getElementById('scopeGrid');

  const W = 400, H = 200, MID = 100, AMP = 70;

  // background grid
  for (let x = 0; x <= W; x += 40) {
    const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    l.setAttribute('x1', x); l.setAttribute('y1', 0);
    l.setAttribute('x2', x); l.setAttribute('y2', H);
    l.setAttribute('class', 'scope-grid-line');
    grid.appendChild(l);
  }

  function buildPath(freqHz, phaseShift) {
    // On affiche une fenêtre temporelle fixe de 5 ms
    const windowMs = 5;
    let d = '';
    for (let px = 0; px <= W; px++) {
      const tMs = (px / W) * windowMs;
      const omega = 2 * Math.PI * freqHz; // rad/s
      const y = MID - AMP * Math.sin(omega * (tMs / 1000) - phaseShift);
      d += (px === 0 ? 'M' : 'L') + px + ' ' + y.toFixed(2) + ' ';
    }
    return d;
  }

  function update() {
    const f = parseFloat(freqRange.value);     // Hz
    const dCm = parseFloat(distRange.value);   // cm
    const dM = dCm / 100;

    const tauS = dM / V_DEMO;       // retard temporel réel (s)
    const phase = 2 * Math.PI * f * tauS; // déphasage en radians

    waveMic1.setAttribute('d', buildPath(f, 0));
    waveMic2.setAttribute('d', buildPath(f, phase));

    const lambda = V_DEMO / f; // m
    readout.innerHTML =
      `f = ${f.toFixed(0)} Hz · d = ${dCm.toFixed(1)} cm · ` +
      `λ = ${(lambda * 100).toFixed(1)} cm · ` +
      `<span class="amber">τ = ${(tauS * 1000).toFixed(3)} ms</span>`;
  }

  freqRange.addEventListener('input', update);
  distRange.addEventListener('input', update);
  update();
})();

/* ---------------------------------------------------------------
   2. Chargement du matériel depuis equipement.json
   ----------------------------------------------------------------*/
(function loadEquipement() {
  const list = document.getElementById('equipement-liste');

  fetch('equipement.json')
    .then(r => {
      if (!r.ok) throw new Error('Fichier non trouvé (' + r.status + ')');
      return r.json();
    })
    .then(data => {
      const items = data.liste || [];
      list.innerHTML = '';
      items.forEach(item => {
        const li = document.createElement('li');
        const ref = item.reference
          ? `<span class="eq-ref">${escapeHtml(item.reference)}</span>`
          : '';
        li.innerHTML =
          `<div class="eq-nom">${escapeHtml(item.nom)}</div>` +
          ref +
          `<p class="eq-desc">${escapeHtml(item.description || '')}</p>`;
        list.appendChild(li);
      });
    })
    .catch(err => {
      list.innerHTML =
        `<li class="eq-error" style="grid-column: 1 / -1;">
           Impossible de charger <code>equipement.json</code> (${escapeHtml(err.message)}).
           Vérifiez le chemin du fichier.
         </li>`;
    });

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();

/* ---------------------------------------------------------------
   3. Tableau de mesures
   ----------------------------------------------------------------*/
const dataBody = document.getElementById('dataBody');
let rowCount = 0;

function addRow(values) {
  rowCount++;
  const tr = document.createElement('tr');
  const v = values || {};

  tr.innerHTML = `
    <td>${rowCount}</td>
    <td><input type="number" step="any" inputmode="decimal" class="cell-f" value="${v.f ?? ''}" aria-label="Fréquence essai ${rowCount} en hertz"></td>
    <td><input type="number" step="any" inputmode="decimal" class="cell-d" value="${v.d ?? ''}" aria-label="Distance essai ${rowCount} en centimètres"></td>
    <td><input type="number" step="any" inputmode="decimal" class="cell-tau" value="${v.tau ?? ''}" aria-label="Retard essai ${rowCount} en millisecondes"></td>
    <td class="cell-v">—</td>
    <td><button class="row-remove" type="button" aria-label="Supprimer l'essai ${rowCount}">✕</button></td>
  `;

  tr.querySelector('.row-remove').addEventListener('click', () => {
    tr.remove();
    renumberRows();
  });

  // live preview of v as the student types
  tr.querySelectorAll('.cell-d, .cell-tau').forEach(inp =>
    inp.addEventListener('input', () => updateRowSpeed(tr))
  );

  dataBody.appendChild(tr);
}

function updateRowSpeed(tr) {
  const dCm = parseFloat(tr.querySelector('.cell-d').value);
  const tauMs = parseFloat(tr.querySelector('.cell-tau').value);
  const cell = tr.querySelector('.cell-v');
  if (isFinite(dCm) && isFinite(tauMs) && tauMs > 0) {
    const v = (dCm / 100) / (tauMs / 1000);
    cell.textContent = v.toFixed(1);
  } else {
    cell.textContent = '—';
  }
}

function renumberRows() {
  rowCount = 0;
  [...dataBody.querySelectorAll('tr')].forEach(tr => {
    rowCount++;
    tr.firstElementChild.textContent = rowCount;
  });
}

document.getElementById('btnAddRow').addEventListener('click', () => addRow());

document.getElementById('btnFillDemo').addEventListener('click', () => {
  dataBody.innerHTML = '';
  rowCount = 0;
  const demo = [
    { f: 500, d: 68.0, tau: 2.00 },
    { f: 850, d: 40.2, tau: 1.18 },
    { f: 1000, d: 34.3, tau: 1.01 },
    { f: 1200, d: 28.5, tau: 0.84 },
    { f: 1500, d: 22.9, tau: 0.67 },
  ];
  demo.forEach(addRow);
  [...dataBody.querySelectorAll('tr')].forEach(updateRowSpeed);
});

// start with three empty rows
addRow(); addRow(); addRow();

/* ---------------------------------------------------------------
   4. Validation, statistiques et incertitude
   ----------------------------------------------------------------*/
document.getElementById('btnValidate').addEventListener('click', () => {
  const errorBox = document.getElementById('fieldError');
  const panel = document.getElementById('resultsPanel');
  errorBox.textContent = '';

  const rows = [...dataBody.querySelectorAll('tr')];
  const speeds = [];

  for (const tr of rows) {
    const fVal = tr.querySelector('.cell-f').value.trim();
    const dVal = parseFloat(tr.querySelector('.cell-d').value);
    const tauVal = parseFloat(tr.querySelector('.cell-tau').value);

    // ignore fully empty rows
    if (fVal === '' && tr.querySelector('.cell-d').value.trim() === '' &&
        tr.querySelector('.cell-tau').value.trim() === '') {
      continue;
    }

    if (!isFinite(dVal) || !isFinite(tauVal) || dVal <= 0 || tauVal <= 0) {
      errorBox.textContent =
        'Vérifiez les valeurs : chaque essai doit avoir une distance d > 0 ' +
        'et un retard τ > 0 (en millisecondes).';
      panel.classList.remove('visible');
      return;
    }

    speeds.push((dVal / 100) / (tauVal / 1000));
  }

  if (speeds.length < 2) {
    errorBox.textContent =
      'Il faut au moins deux essais valides pour calculer une moyenne et une incertitude.';
    panel.classList.remove('visible');
    return;
  }

  // --- statistiques ---
  const n = speeds.length;
  const mean = speeds.reduce((a, b) => a + b, 0) / n;
  const variance = speeds.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
  const std = Math.sqrt(variance);

  // incertitude-type de la moyenne (type A) : u = sigma / sqrt(n)
  // facteur d'élargissement k=2 -> intervalle de confiance ~95%
  const uMean = std / Math.sqrt(n);
  const k = 2;
  const U = k * uMean;

  document.getElementById('resMean').innerHTML =
    mean.toFixed(1) + '<span class="unit"> m·s⁻¹</span>';
  document.getElementById('resStd').innerHTML =
    std.toFixed(1) + '<span class="unit"> m·s⁻¹</span>';
  document.getElementById('resUncertainty').innerHTML =
    U.toFixed(1) + '<span class="unit"> m·s⁻¹ (k=2)</span>';
  document.getElementById('resFinal').innerHTML =
    `v = (${mean.toFixed(0)} ± ${U.toFixed(0)})`;

  // --- comparaison avec la valeur de référence ---
  const REF = 340; // m/s
  const ecartRel = Math.abs(mean - REF) / REF * 100;
  document.getElementById('resEcart').textContent = ecartRel.toFixed(1) + ' %';
  document.getElementById('resFill').style.width = Math.min(ecartRel * 4, 100) + '%';

  const interp = document.getElementById('resInterpretation');
  const refInInterval = Math.abs(mean - REF) <= U;
  if (refInInterval) {
    interp.textContent =
      `La valeur de référence (340 m·s⁻¹) est comprise dans l'intervalle ` +
      `[${(mean - U).toFixed(0)} ; ${(mean + U).toFixed(0)}] m·s⁻¹ : ` +
      `le résultat est compatible avec la théorie.`;
  } else {
    interp.textContent =
      `La valeur de référence (340 m·s⁻¹) n'est PAS comprise dans l'intervalle ` +
      `[${(mean - U).toFixed(0)} ; ${(mean + U).toFixed(0)}] m·s⁻¹. ` +
      `Vérifiez vos mesures de τ et de d, ou augmentez le nombre d'essais.`;
  }

  panel.classList.add('visible');
});
