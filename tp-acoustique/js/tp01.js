/* ── OSCILLOSCOPE SIMULÉ ── */
const V_SON = 340; // m/s

function drawScope() {
  // Ton code existant pour drawScope
  const f = +document.getElementById('freqRange').value;
  const d = +document.getElementById('distRange').value / 100;
  const tau = d / V_SON;
  const T = 1 / f;
  const phi = (tau / T) * 2 * Math.PI;

  document.getElementById('fLabel').textContent = f.toLocaleString('fr') + ' Hz';
  document.getElementById('dLabel').textContent = (+document.getElementById('distRange').value).toFixed(1) + ' cm';
  document.getElementById('scopeReadout').textContent = `f = ${f.toLocaleString('fr')} Hz · d = ${(d*100).toFixed(1)} cm`;
  document.getElementById('deltaDisplay').textContent = `Δt = ${(tau*1000).toFixed(2)} ms · λ = ${(V_SON/f*100).toFixed(1)} cm`;

  const svg = document.getElementById('scopeSvg');
  const W = 400, H = 200, cy = H / 2, amp = 70;

  // grille
  let grid = '';
  for (let x = 0; x <= W; x += W/8)
    grid += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="rgba(57,255,143,0.12)" stroke-width="0.5"/>`;
  for (let y = 0; y <= H; y += H/4)
    grid += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(57,255,143,0.12)" stroke-width="0.5"/>`;
  document.getElementById('scopeGrid').innerHTML = grid;

  // 3 périodes visibles
  const pxPerT = W / 3;
  const pxPerSec = pxPerT * f;
  const phiPx = (phi / (2 * Math.PI)) * pxPerT;

  let p1 = '', p2 = '';
  for (let x = 0; x <= W; x++) {
    const t = x / pxPerSec;
    const y1 = cy - amp * Math.sin(2 * Math.PI * f * t);
    const y2 = cy - amp * Math.sin(2 * Math.PI * f * t - phi);
    p1 += (x === 0 ? 'M' : 'L') + `${x},${y1.toFixed(2)}`;
    p2 += (x === 0 ? 'M' : 'L') + `${x},${y2.toFixed(2)}`;
  }
  document.getElementById('wCH1').setAttribute('d', p1);
  document.getElementById('wCH2').setAttribute('d', p2);
}

// Écouteurs pour l'oscilloscope
function setupOscilloscope() {
  document.getElementById('freqRange').addEventListener('input', drawScope);
  document.getElementById('distRange').addEventListener('input', drawScope);
  drawScope();
}

/* ── TABLEAU ── */
let rowCount = 0;

function addRow(f='', d='', tau='') {
  // Ton code existant pour addRow
  rowCount++;
  const tr = document.createElement('tr');
  tr.dataset.id = rowCount;
  tr.innerHTML = `
    <td style="font-family:var(--mono);color:var(--ink-soft)">${rowCount}</td>
    <td><input type="number" placeholder="ex: 1000" value="${f}" min="100" max="20000" step="1" data-col="f"></td>
    <td><input type="number" placeholder="ex: 20" value="${d}" min="1" max="200" step="0.1" data-col="d"></td>
    <td><input type="number" placeholder="ex: 0.59" value="${tau}" min="0.01" max="10" step="0.01" data-col="tau"></td>
    <td class="computed" data-col="v">—</td>
    <td><button class="btn-del" title="Supprimer">✕</button></td>`;
  document.getElementById('dataBody').appendChild(tr);

  tr.querySelectorAll('input').forEach(i => i.addEventListener('input', () => computeRowV(tr)));
  tr.querySelector('.btn-del').addEventListener('click', () => {
    tr.remove();
    document.getElementById('resultsPanel').classList.remove('visible');
  });
  if (f && d && tau) computeRowV(tr);
}

function computeRowV(tr) {
  // Ton code existant pour computeRowV
  const f = parseFloat(tr.querySelector('[data-col=f]').value);
  const d = parseFloat(tr.querySelector('[data-col=d]').value) / 100;
  const tau = parseFloat(tr.querySelector('[data-col=tau]').value) / 1000;
  const cell = tr.querySelector('[data-col=v]');
  if (d > 0 && tau > 0) {
    cell.textContent = (d / tau).toFixed(1);
  } else {
    cell.textContent = '—';
  }
}

// Écouteurs pour le tableau
function setupTable() {
  document.getElementById('btnAdd').addEventListener('click', () => addRow());
  document.getElementById('btnDemo').addEventListener('click', () => {
    [
      [1000, 20, 0.59],
      [1000, 30, 0.88],
      [2000, 15, 0.44],
      [2000, 25, 0.74],
      [1500, 22, 0.65],
    ].forEach(([f,d,t]) => addRow(f,d,t));
  });

  document.getElementById('btnCalc').addEventListener('click', () => {
    const err = document.getElementById('fieldError');
    err.textContent = '';
    const rows = document.getElementById('dataBody').querySelectorAll('tr');
    const vals = [];
    let ok = true;
    rows.forEach(tr => {
      const f = parseFloat(tr.querySelector('[data-col=f]').value);
      const d = parseFloat(tr.querySelector('[data-col=d]').value) / 100;
      const tau = parseFloat(tr.querySelector('[data-col=tau]').value) / 1000;
      if (!d || !tau || d <= 0 || tau <= 0) { ok = false; return; }
      vals.push(d / tau);
    });
    if (!ok || vals.length === 0) {
      err.textContent = 'Veuillez remplir correctement toutes les lignes (d > 0 et τ > 0).';
      return;
    }
    const n = vals.length;
    const mean = vals.reduce((a,b)=>a+b,0)/n;
    const std = n > 1 ? Math.sqrt(vals.reduce((s,v)=>s+(v-mean)**2,0)/(n-1)) : 0;
    const unc = n > 1 ? std/Math.sqrt(n) : 0;
    const ecart = Math.abs(mean-340)/340*100;

    document.getElementById('rMean').innerHTML = `${mean.toFixed(1)}<span class="unit"> m·s⁻¹</span>`;
    document.getElementById('rStd').innerHTML = `${std.toFixed(1)}<span class="unit"> m·s⁻¹</span>`;
    document.getElementById('rUnc').innerHTML = `${unc.toFixed(1)}<span class="unit"> m·s⁻¹</span>`;
    document.getElementById('rFinal').innerHTML = `${mean.toFixed(0)} ± ${unc.toFixed(1)}<span class="unit"> m·s⁻¹</span>`;
    document.getElementById('rEcart').textContent = `${ecart.toFixed(1)} %`;

    const fillPct = Math.min(ecart * 5, 100);
    document.getElementById('rFill').style.width = fillPct + '%';
    document.getElementById('rFill').style.background =
      ecart < 5 ? 'var(--phosphor)' : ecart < 15 ? 'var(--amber)' : 'var(--accent)';

    const interp = ecart < 5
      ? '✓ Excellent — écart inférieur à 5 %. Mesures cohérentes avec la valeur de référence.'
      : ecart < 15
      ? '~ Acceptable — écart entre 5 et 15 %. Vérifiez la précision de la lecture du curseur Δt.'
      : '✗ Écart élevé — revoir le positionnement des micros ou la lecture τ sur l\'oscilloscope.';
    document.getElementById('rInterp').textContent = interp;

    document.getElementById('resultsPanel').classList.add('visible');
    document.getElementById('resultsPanel').scrollIntoView({behavior:'smooth', block:'start'});
  });
}

// Initialisation
function initTp01() {
  setupOscilloscope();
  setupTable();
  addRow(); // Ajoute une ligne par défaut
}
