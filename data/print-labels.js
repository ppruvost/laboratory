/* ------------------------------------------------------------------ */
/*  print-labels.js  —  Module ES                                      */
/*  Chargé via <script type="module"> dans index.html                  */
/*  Appeler initPrintLabels(dangerDB) depuis app.js (ou index.html)    */
/*  après import de dangerDB.js pour initialiser le module.            */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Codes couleur des pictogrammes GHS                                 */
/* ------------------------------------------------------------------ */
const PIC_LABELS = {
  "SGH01_BombeExplosant.jpg"   : "Explosif",
  "SGH02_Flamme.jpg"           : "Inflammable",
  "SGH03_FlammeSurCercle.jpg"  : "Comburant",
  "SGH04_BouteilleGaz.jpg"     : "Gaz sous pression",
  "SGH05_Corrosion.jpg"        : "Corrosif",
  "SGH06_TeteDeMort.jpg"       : "Toxique",
  "SGH07_PointExclamation.jpg" : "Irritant / Nocif",
  "SGH08_DangerSante.jpg"      : "Danger pour la santé",
  "SGH09_Environnement.jpg"    : "Danger pour l'environnement",
};

const IMG_BASE = "assets/img/";
const PIC_BASE = "assets/picto/";

/* Index code → texte, construit après initPrintLabels() */
let MENTIONS = {};

/* ------------------------------------------------------------------ */
/*  Initialisation — appelée depuis le module principal (app.js)       */
/* ------------------------------------------------------------------ */
export function initPrintLabels(dangerDB) {
  MENTIONS = Object.fromEntries(dangerDB.map(item => [item.code, item.text]));

  /* Exposition sur window pour les onclick inline du HTML */
  window._openLabelModal         = _openLabelModal;
  window._closeLabelModal        = _closeLabelModal;
  window._closeLabelModalOutside = _closeLabelModalOutside;
  window._printLabels            = _printLabels;
  window._toggleSelectAll        = _toggleSelectAll;
}

/* ------------------------------------------------------------------ */
/*  Fonction principale : génère et ouvre la fenêtre d'impression      */
/* ------------------------------------------------------------------ */
export function generateLabelPage(products, options = {}) {
  const { showImage = true, showFds = true } = options;

  const pages = [];
  for (let i = 0; i < products.length; i += 16) {
    pages.push(products.slice(i, i + 16));
  }

  const labelCells = pages.map((page, pi) => {
    while (page.length < 16) page.push(null);
    const cells = page
      .map(p => p ? buildLabel(p, showImage, showFds) : '<div class="label label-empty"></div>')
      .join('\n');
    return `<div class="sheet" data-page="${pi + 1}">${cells}</div>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Étiquettes CLP — Labo LP Mermoz</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: Arial, Helvetica, sans-serif; background: #e8e8e8; }

  @media screen {
    body { padding: 20px; }
    .sheet {
      background: white;
      box-shadow: 0 2px 12px rgba(0,0,0,.25);
      margin: 0 auto 32px;
      position: relative;
    }
    .no-print {
      position: fixed;
      top: 16px; right: 16px;
      display: flex; gap: 10px; z-index: 100;
    }
    .btn-print {
      background: #1a56db; color: #fff; border: none;
      padding: 10px 20px; border-radius: 6px;
      font-size: .875rem; font-weight: 600; cursor: pointer;
    }
    .btn-close {
      background: #fff; color: #374151;
      border: 1px solid #d1d5db;
      padding: 10px 20px; border-radius: 6px;
      font-size: .875rem; cursor: pointer;
    }
  }

  @media print {
    @page { size: A4 portrait; margin: 0; }
    body { background: white; }
    .no-print { display: none !important; }
    .sheet { page-break-after: always; box-shadow: none; }
    .sheet:last-child { page-break-after: auto; }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }

  /* Avery L7121 — 16 étiquettes A4 */
  .sheet {
    width: 210mm; height: 297mm;
    padding-top: 15.1mm; padding-left: 4.6mm;
    display: grid;
    grid-template-columns: repeat(2, 99.1mm);
    grid-template-rows: repeat(8, 33.9mm);
    column-gap: 3.5mm; row-gap: 0mm;
    overflow: hidden;
  }

  .label {
    width: 99.1mm; height: 33.9mm;
    border: 0.3pt solid #bbb;
    display: flex; flex-direction: row;
    overflow: hidden; padding: 1.2mm; gap: 1.5mm;
    background: white; position: relative;
  }
  .label-empty { border-color: transparent; }

  .col-left {
    display: flex; flex-direction: column;
    align-items: center; justify-content: space-between;
    width: 18mm; flex-shrink: 0;
  }
  .product-img {
    width: 14mm; height: 14mm; object-fit: contain;
    border: 0.3pt solid #ccc; border-radius: 1mm; display: block;
  }
  .product-img-placeholder {
    width: 14mm; height: 14mm; background: #f3f4f6;
    border: 0.3pt solid #ccc; border-radius: 1mm;
    display: flex; align-items: center; justify-content: center;
    font-size: 6pt; color: #9ca3af; text-align: center; line-height: 1.2;
  }
  .pictograms { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5mm; }
  .picto { width: 7mm; height: 7mm; object-fit: contain; }

  .col-center {
    flex: 1; display: flex; flex-direction: column;
    justify-content: space-between; min-width: 0; overflow: hidden;
  }
  .product-name {
    font-size: 7.5pt; font-weight: 700; color: #111; line-height: 1.2;
    overflow: hidden; display: -webkit-box;
    -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  }
  .product-formula { font-size: 6.5pt; color: #374151; font-style: italic; margin-top: 0.5mm; }
  .product-cas { font-size: 5.5pt; color: #6b7280; margin-top: 0.3mm; }
  .product-loc {
    font-size: 5.5pt; color: #1a56db; font-weight: 600; margin-top: 0.5mm;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .product-fds {
    font-size: 5pt; color: #6b7280; margin-top: 0.3mm;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .col-right {
    width: 38mm; flex-shrink: 0; display: flex; flex-direction: column;
    justify-content: flex-start; overflow: hidden;
    border-left: 0.5pt solid #e5e7eb; padding-left: 1mm;
  }
  .mentions-title {
    font-size: 5pt; font-weight: 700; color: #dc2626;
    text-transform: uppercase; letter-spacing: 0.02em; margin-bottom: 0.5mm;
  }
  .mention-h { font-size: 5pt; color: #dc2626; line-height: 1.25; margin-bottom: 0.4mm; }
  .mentions-p-title {
    font-size: 5pt; font-weight: 700; color: #0369a1;
    text-transform: uppercase; letter-spacing: 0.02em;
    margin-top: 0.8mm; margin-bottom: 0.3mm;
  }
  .mention-p { font-size: 4.8pt; color: #0369a1; line-height: 1.2; margin-bottom: 0.3mm; }
  .mention-raw { font-size: 4.8pt; color: #374151; line-height: 1.2; margin-bottom: 0.3mm; }

  .cat-bar { position: absolute; top: 0; left: 0; right: 0; height: 1.5mm; }

  .epi-row { display: flex; gap: 1mm; flex-wrap: wrap; margin-top: 1mm; }
  .epi-badge {
    font-size: 4.5pt; padding: 0.2mm 0.8mm; border-radius: 1mm; font-weight: 600;
    background: #fef3c7; color: #92400e; border: 0.3pt solid #fcd34d; white-space: nowrap;
  }
  .danger-banner {
    background: #dc2626; color: #fff; font-size: 5.5pt; font-weight: 700;
    text-align: center; padding: 0.3mm 1mm; border-radius: 0.5mm;
    margin-bottom: 0.5mm; letter-spacing: 0.05em;
  }
</style>
</head>
<body>

<div class="no-print">
  <button class="btn-print" onclick="window.print()">🖨️ Imprimer</button>
  <button class="btn-close" onclick="window.close()">✕ Fermer</button>
</div>

${labelCells}

</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) {
    alert("Impossible d'ouvrir la fenêtre d'impression.\nVérifiez que les pop-ups ne sont pas bloquées.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
}

/* ------------------------------------------------------------------ */
/*  Construction d'une étiquette individuelle                          */
/* ------------------------------------------------------------------ */
function buildLabel(p, showImage, showFds) {
  const catColor = getCatColor(p.categorie || '');

  let imgHtml = '';
  if (showImage) {
    imgHtml = p.image
      ? `<img class="product-img" src="${IMG_BASE}${p.image}" alt="${escHtml(p.nom)}" onerror="this.style.display='none'">`
      : `<div class="product-img-placeholder">pas<br>de<br>photo</div>`;
  }

  const picHtml = (p.pictogramme || []).map(f =>
    `<img class="picto" src="${PIC_BASE}${f}" alt="${escHtml(PIC_LABELS[f] || f)}" title="${escHtml(PIC_LABELS[f] || f)}">`
  ).join('');

  const dangers  = p.dangers || [];
  const hCodes   = dangers.filter(d => /^H|^EUH/.test(d));
  const pCodes   = dangers.filter(d => /^P/.test(d));
  const rawMsgs  = dangers.filter(d => !/^[HP]|^EUH/.test(d));

  const isHighDanger = hCodes.some(h => ['H300','H310','H330','H301','H311','H331'].includes(h));

  const MAX_H = 5, MAX_P = 4;

  const hMentions = hCodes.slice(0, MAX_H).map(h =>
    `<div class="mention-h"><strong>${h}</strong> ${escHtml(MENTIONS[h] || h)}</div>`
  ).join('');

  const pMentions = pCodes.slice(0, MAX_P).map(hp =>
    `<div class="mention-p"><strong>${hp}</strong> ${escHtml(MENTIONS[hp] || hp)}</div>`
  ).join('');

  const rawMentions = rawMsgs.map(r =>
    `<div class="mention-raw">${escHtml(r)}</div>`
  ).join('');

  const dangerBanner = isHighDanger ? '<div class="danger-banner">⚠ DANGER</div>' : '';

  const hBlock   = hCodes.length   ? `<div class="mentions-title">Danger</div>${dangerBanner}${hMentions}` : '';
  const pBlock   = pCodes.length   ? `<div class="mentions-p-title">Précaution</div>${pMentions}` : '';
  const rawBlock = (rawMsgs.length && !hCodes.length) ? `<div class="mentions-title">Note</div>${rawMentions}` : '';

  const epiHtml  = (p.obligation || []).map(o => `<span class="epi-badge">${escHtml(o)}</span>`).join('');
  const fdsHtml  = showFds && p.fds ? `<div class="product-fds">FDS : ${escHtml(p.fds)}</div>` : '';
  const nomDisplay = p.nom.length > 120 ? p.nom.slice(0, 117) + '…' : p.nom;

  return `
<div class="label">
  <div class="cat-bar" style="background:${catColor};"></div>
  <div class="col-left">
    ${imgHtml}
    <div class="pictograms">${picHtml}</div>
  </div>
  <div class="col-center">
    <div>
      <div class="product-name">${escHtml(nomDisplay)}</div>
      <div class="product-formula">${escHtml(p.formule || '')}</div>
      <div class="product-cas">CAS ${escHtml((p.cas || '').trim())}</div>
    </div>
    <div>
      <div class="product-loc">📍 ${escHtml(p.localisation || '')}</div>
      ${fdsHtml}
      <div class="epi-row">${epiHtml}</div>
    </div>
  </div>
  <div class="col-right">
    ${hBlock}
    ${pBlock}
    ${rawBlock}
  </div>
</div>`;
}

/* ------------------------------------------------------------------ */
/*  Couleur barre catégorie                                            */
/* ------------------------------------------------------------------ */
function getCatColor(categorie) {
  const c = categorie.toLowerCase();
  if (c.includes('acide fort'))                      return '#dc2626';
  if (c.includes('acide'))                           return '#f97316';
  if (c.includes('base') || c.includes('hydroxyde')) return '#7c3aed';
  if (c.includes('inflam') || c.includes('solvant')) return '#f59e0b';
  if (c.includes('oxydant') || c.includes('comburant')) return '#eab308';
  if (c.includes('toxique'))                         return '#b91c1c';
  if (c.includes('sal') || c.includes('minéral'))   return '#2563eb';
  if (c.includes('métal'))                           return '#6b7280';
  if (c.includes('environ'))                         return '#16a34a';
  if (c.includes('indicateur'))                      return '#0891b2';
  if (c.includes('colorant'))                        return '#db2777';
  return '#94a3b8';
}

/* ------------------------------------------------------------------ */
/*  Utilitaire : échappement HTML                                      */
/* ------------------------------------------------------------------ */
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ------------------------------------------------------------------ */
/*  Sélection par checkbox dans le tableau                             */
/* ------------------------------------------------------------------ */
function _toggleSelectAll(master) {
  document.querySelectorAll('.row-chk').forEach(chk => chk.checked = master.checked);
}

function _getSelectedCas() {
  return [...document.querySelectorAll('.row-chk:checked')].map(c => c.dataset.cas);
}

/* ------------------------------------------------------------------ */
/*  Fonctions modal                                                    */
/* ------------------------------------------------------------------ */
function _openLabelModal() {
  const sel   = _getSelectedCas();
  const total = (typeof products !== 'undefined') ? products.length : 0;

  document.getElementById('opt-all-count').textContent = total;
  document.getElementById('modal-selection-count').textContent = sel.length > 0
    ? `${sel.length} produit${sel.length > 1 ? 's' : ''} sélectionné${sel.length > 1 ? 's' : ''} dans le tableau.`
    : 'Aucun produit sélectionné — choisissez « Tous les produits » ou cochez des lignes.';

  const optSelected = document.getElementById('opt-selected');
  const optAll      = document.querySelector('input[name="label-scope"][value="all"]');

  optSelected.disabled = false;
  if (sel.length === 0) { optSelected.disabled = true; optAll.checked = true; }
  else                  { optSelected.checked = true; }

  document.getElementById('label-modal').style.display = 'flex';
}

function _closeLabelModal() {
  document.getElementById('label-modal').style.display = 'none';
}

function _closeLabelModalOutside(e) {
  if (e.target === document.getElementById('label-modal')) _closeLabelModal();
}

function _printLabels() {
  const scope     = document.querySelector('input[name="label-scope"]:checked')?.value || 'selected';
  const showImage = document.getElementById('opt-show-image').checked;
  const showFds   = document.getElementById('opt-show-fds').checked;

  let subset = [];
  if (scope === 'selected') {
    const selectedCas = _getSelectedCas();
    subset = products.filter(p => selectedCas.includes((p.cas || '').trim()));
  } else {
    subset = [...products];
  }

  if (!subset.length) { alert('Aucun produit à imprimer.'); return; }

  _closeLabelModal();
  generateLabelPage(subset, { showImage, showFds });
}
