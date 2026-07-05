const PIC_LABELS = {
  "SGH01_BombeExplosant.jpg": "Explosif",
  "SGH02_Flamme.jpg": "Inflammable",
  "SGH03_FlammeSurCercle.jpg": "Comburant",
  "SGH04_BouteilleGaz.jpg": "Gaz sous pression",
  "SGH05_Corrosion.jpg": "Corrosif",
  "SGH06_TeteDeMort.jpg": "Toxique",
  "SGH07_PointExclamation.jpg": "Irritant / Nocif",
  "SGH08_DangerSante.jpg": "Danger pour la santé",
  "SGH09_Environnement.jpg": "Danger pour l'environnement",
};
const IMG_BASE = "assets/img/";
const PIC_BASE = "assets/picto/";
let MENTIONS = {};
let PRODUCTS = [];   // ✅ IMPORTANT

// =====================================================
// CSS D'IMPRESSION — Avery L7163 (99,1 × 33,9 mm, 16/A4)
// =====================================================
const LABEL_CSS = `
  @page {
    size: A4;
    margin: 12.7mm 5.9mm;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: Arial, sans-serif;
  }
  .sheet {
    display: grid;
    grid-template-columns: repeat(2, 99.1mm);
    grid-template-rows: repeat(8, 33.9mm);
    gap: 0;
    page-break-after: always;
  }
  .sheet:last-child {
    page-break-after: auto;
  }
  .label {
    width: 99.1mm;
    height: 33.9mm;
    padding: 2mm 3mm;
    overflow: hidden;
    border: 1px dotted #ccc;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 7pt;
    line-height: 1.15;
  }
  .label-empty {
    border: 1px dotted #eee;
  }
  .label strong {
    font-size: 8.5pt;
  }
  .label-top {
    display: flex;
    align-items: flex-start;
    gap: 2mm;
  }
  .label-top-text {
    flex: 1;
    min-width: 0;
  }
  .label-pictos {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5mm;
    flex-shrink: 0;
  }
  .picto {
    width: 8mm;
    height: 8mm;
    object-fit: contain;
    flex-shrink: 0;
  }
  .label-bottom {
    font-size: 5.5pt;
    overflow: hidden;
  }
  .label-bottom div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media print {
    .sheet { break-inside: avoid; }
  }
`;

// =====================================================
// INIT MODULE
// =====================================================
export function initPrintLabels(dangerDB, productsRef) {
  PRODUCTS = productsRef || [];
  MENTIONS = Object.fromEntries(
    dangerDB.map(item => [item.code, item.text])
  );
  window._openLabelModal         = _openLabelModal;
  window._closeLabelModal        = _closeLabelModal;
  window._closeLabelModalOutside = _closeLabelModalOutside;
  window._printLabels            = _printLabels;
  window._toggleSelectAll        = _toggleSelectAll;
}

// =====================================================
// LABEL PAGE
// =====================================================
export function generateLabelPage(products, options = {}) {
  const { showImage = true, showFds = true } = options;

  const pages = [];
  for (let i = 0; i < products.length; i += 16) {
    pages.push(products.slice(i, i + 16));
  }

  const labelCells = pages.map((page, pi) => {
    while (page.length < 16) page.push(null);
    const cells = page.map(p =>
      p
        ? buildLabel(p, showImage, showFds)
        : '<div class="label label-empty"></div>'
    ).join('\n');
    return `<div class="sheet" data-page="${pi + 1}">${cells}</div>`;
  }).join('\n');

  const win = window.open('', '_blank');
  win.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Étiquettes</title>
<style>${LABEL_CSS}</style>
</head>
<body>
${labelCells}
<script>
  window.onload = () => { window.focus(); window.print(); };
</script>
</body>
</html>
  `);
  win.document.close();
}

// =====================================================
// BUILD LABEL
// =====================================================
function buildLabel(p, showImage, showFds) {
  const picHtml = (p.pictogramme || []).map(f =>
    `<img src="${PIC_BASE}${f}" title="${PIC_LABELS[f] || f}" class="picto">`
  ).join('');

  const dangers = p.dangers || [];
  const hCodes = dangers.filter(d => d.startsWith("H"));
  const pCodes = dangers.filter(d => d.startsWith("P"));

  const hBlock = hCodes.map(h =>
    `<div>${h} ${MENTIONS[h] || ""}</div>`
  ).join('');
  const pBlock = pCodes.map(code =>
    `<div>${code} ${MENTIONS[code] || ""}</div>`
  ).join('');

  return `
<div class="label">
  <div class="label-top">
    <div class="label-top-text">
      <strong>${p.nom}</strong><br>
      ${p.formule || ""}
    </div>
    <div class="label-pictos">${picHtml}</div>
  </div>
  <div class="label-bottom">
    ${hBlock}
    ${pBlock}
  </div>
</div>`;
}

// =====================================================
// MODAL FUNCTIONS
// =====================================================
function _openLabelModal() {
  document.getElementById("label-modal").style.display = "flex";
}
function _closeLabelModal() {
  document.getElementById("label-modal").style.display = "none";
}
function _closeLabelModalOutside(e) {
  if (e.target.id === "label-modal") {
    _closeLabelModal();
  }
}
function _toggleSelectAll(master) {
  document.querySelectorAll(".row-chk")
    .forEach(c => c.checked = master.checked);
}
function _printLabels() {
  const subset = PRODUCTS.length ? PRODUCTS : [];
  if (!subset.length) {
    alert("Aucun produit");
    return;
  }
  _closeLabelModal();
  generateLabelPage(subset);
}
