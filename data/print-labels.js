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
</head>
<body>
${labelCells}
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

  const pBlock = pCodes.map(p =>
    `<div>${p} ${MENTIONS[p] || ""}</div>`
  ).join('');

  return `
<div class="label">
  <div>
    <strong>${p.nom}</strong><br>
    ${p.formule || ""}<br>
    ${picHtml}
  </div>

  <div>
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
