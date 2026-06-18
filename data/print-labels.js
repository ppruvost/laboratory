/* ------------------------------------------------------------------ */
/*  Textes H/P officiels (FR) — liste partielle, compléter si besoin  */
/* ------------------------------------------------------------------ */
const MENTIONS = {
  /* ---- Mentions de danger (H) ---- */
  H224: "Liquide et vapeurs extrêmement inflammables.",
  H225: "Liquide et vapeurs très inflammables.",
  H226: "Liquide et vapeurs inflammables.",
  H228: "Matière solide inflammable.",
  H260: "Dégage des gaz inflammables au contact de l'eau.",
  H261: "Dégage des gaz inflammables au contact de l'eau.",
  H271: "Peut provoquer un incendie ou une explosion ; comburant puissant.",
  H272: "Peut aggraver un incendie ; comburant.",
  H290: "Peut être corrosif pour les métaux.",
  H300: "Mortel en cas d'ingestion.",
  H301: "Toxique en cas d'ingestion.",
  H302: "Nocif en cas d'ingestion.",
  H310: "Mortel par contact cutané.",
  H311: "Toxique par contact cutané.",
  H312: "Nocif par contact cutané.",
  H314: "Provoque de graves brûlures de la peau et des lésions oculaires.",
  H315: "Provoque une irritation cutanée.",
  H317: "Peut provoquer une allergie cutanée.",
  H318: "Provoque de graves lésions oculaires.",
  H319: "Provoque une sévère irritation des yeux.",
  H330: "Mortel par inhalation.",
  H331: "Toxique par inhalation.",
  H332: "Nocif par inhalation.",
  H334: "Peut provoquer des symptômes allergiques ou d'asthme ou des difficultés respiratoires par inhalation.",
  H335: "Peut irriter les voies respiratoires.",
  H336: "Peut provoquer somnolence ou vertiges.",
  H340: "Peut induire des anomalies génétiques.",
  H341: "Susceptible d'induire des anomalies génétiques.",
  H350: "Peut provoquer le cancer.",
  H351: "Susceptible de provoquer le cancer.",
  H360: "Peut nuire à la fertilité ou au fœtus.",
  H361: "Susceptible de nuire à la fertilité ou au fœtus.",
  H370: "Risque avéré d'effets graves pour les organes.",
  H371: "Risque présumé d'effets graves pour les organes.",
  H372: "Risque avéré d'effets graves pour les organes à la suite d'expositions répétées.",
  H373: "Risque présumé d'effets graves pour les organes à la suite d'expositions répétées.",
  H400: "Très toxique pour les organismes aquatiques.",
  H410: "Très toxique pour les organismes aquatiques, entraîne des effets néfastes à long terme.",
  H411: "Toxique pour les organismes aquatiques, entraîne des effets néfastes à long terme.",
  H412: "Nocif pour les organismes aquatiques, entraîne des effets néfastes à long terme.",
  EUH031: "Au contact d'un acide, dégage un gaz toxique.",
  EUH032: "Au contact d'un acide, dégage un gaz très toxique.",
  /* ---- Mentions de précaution (P) ---- */
  P201: "Se procurer les instructions avant utilisation.",
  P202: "Ne pas manipuler avant d'avoir lu et compris toutes les précautions de sécurité.",
  P210: "Tenir à l'écart de la chaleur, des surfaces chaudes, des étincelles, des flammes nues et de toute autre source d'ignition.",
  P220: "Tenir à l'écart des vêtements et d'autres matériaux combustibles.",
  P221: "Prendre toutes précautions pour éviter les mélanges avec des matières combustibles.",
  P223: "Ne pas laisser entrer en contact avec l'eau.",
  P231: "Manipuler et stocker sous gaz inerte.",
  "P231+P232": "Manipuler sous gaz inerte. Mettre à l'abri de l'humidité.",
  P232: "Mettre à l'abri de l'humidité.",
  P233: "Maintenir le récipient fermé hermétiquement.",
  P240: "Mise à la terre et liaison équipotentielle du récipient et du matériel de réception.",
  P241: "Utiliser du matériel électrique, de ventilation ou d'éclairage antidéflagrant.",
  P243: "Prendre des précautions contre les décharges électrostatiques.",
  P260: "Ne pas respirer les poussières/fumées/gaz/brouillards/vapeurs/aérosols.",
  P261: "Éviter de respirer les poussières/fumées/gaz/brouillards/vapeurs/aérosols.",
  P262: "Éviter tout contact avec les yeux, la peau ou les vêtements.",
  P264: "Se laver soigneusement les mains après manipulation.",
  P270: "Ne pas manger, boire ou fumer en manipulant ce produit.",
  P271: "Utiliser seulement en plein air ou dans un endroit bien ventilé.",
  P272: "Les vêtements de travail contaminés ne devraient pas sortir du lieu de travail.",
  P273: "Éviter le rejet dans l'environnement.",
  P280: "Porter des équipements de protection individuelle.",
  "P301+P310": "EN CAS D'INGESTION : appeler immédiatement un CENTRE ANTIPOISON.",
  "P301+P312": "EN CAS D'INGESTION : appeler un CENTRE ANTIPOISON en cas de malaise.",
  "P301+P330": "EN CAS D'INGESTION : rincer la bouche.",
  "P301+P330+P331": "EN CAS D'INGESTION : rincer la bouche. NE PAS faire vomir.",
  "P302+P352": "EN CAS DE CONTACT AVEC LA PEAU : laver abondamment à l'eau.",
  "P303+P361+P353": "EN CAS DE CONTACT AVEC LA PEAU (ou les cheveux) : enlever immédiatement les vêtements contaminés. Rincer la peau à l'eau.",
  "P304+P340": "EN CAS D'INHALATION : transporter la personne à l'extérieur et la maintenir dans une position où elle peut confortablement respirer.",
  "P305+P351+P338": "EN CAS DE CONTACT AVEC LES YEUX : rincer avec précaution à l'eau pendant plusieurs minutes. Enlever les lentilles de contact si la victime en porte et si elles peuvent être facilement enlevées. Continuer à rincer.",
  "P308+P313": "En cas d'exposition prouvée ou suspectée : consulter un médecin.",
  "P309+P311": "En cas d'exposition ou de malaise : appeler un CENTRE ANTIPOISON.",
  P310: "Appeler immédiatement un CENTRE ANTIPOISON.",
  P312: "Appeler un CENTRE ANTIPOISON en cas de malaise.",
  P330: "Rincer la bouche.",
  P331: "NE PAS faire vomir.",
  P391: "Recueillir le produit répandu.",
  P405: "Mettre sous clef.",
  P422: "Stocker sous gaz inerte.",
  P501: "Éliminer le contenu/récipient conformément à la réglementation locale.",
};

/* ------------------------------------------------------------------ */
/*  Codes couleur des cadres de pictogrammes GHS                       */
/* ------------------------------------------------------------------ */
const PIC_LABELS = {
  "SGH01_BombeExplosant.jpg"    : "Explosif",
  "SGH02_Flamme.jpg"            : "Inflammable",
  "SGH03_FlammeSurCercle.jpg"   : "Comburant",
  "SGH04_BouteilleGaz.jpg"    : "Gaz sous pression",
  "SGH05_Corrosion.jpg"         : "Corrosif",
  "SGH06_TeteDeMort.jpg"        : "Toxique",
  "SGH07_PointExclamation.jpg"  : "Irritant / Nocif",
  "SGH08_DangerSante.jpg"       : "Danger pour la santé",
  "SGH09_Environnement.jpg"     : "Danger pour l'environnement",
};

/* ------------------------------------------------------------------ */
/*  Chemin relatif des ressources (adapter selon votre arborescence)   */
/* ------------------------------------------------------------------ */
const IMG_BASE  = "assets/img/";   // photos produits
const PIC_BASE  = "assets/picto/"; // pictogrammes GHS

/* ------------------------------------------------------------------ */
/*  Fonction principale                                                 */
/* ------------------------------------------------------------------ */

/**
 * Génère et ouvre une fenêtre d'impression avec les étiquettes CLP.
 * @param {Array}  products  — tableau (ou sous-ensemble) de produits
 * @param {Object} options   — { showImage: bool, showFds: bool }
 */
function generateLabelPage(products, options = {}) {
  const { showImage = true, showFds = true } = options;

  /* Découpage en planches de 16 étiquettes */
  const pages = [];
  for (let i = 0; i < products.length; i += 16) {
    pages.push(products.slice(i, i + 16));
  }

  const labelCells = pages.map((page, pi) => {
    /* Compléter la dernière planche avec des cellules vides */
    while (page.length < 16) page.push(null);

    const cells = page.map(p => p ? buildLabel(p, showImage, showFds) : '<div class="label label-empty"></div>').join('\n');

    return `<div class="sheet" data-page="${pi + 1}">${cells}</div>`;
  }).join('\n');

  /* ---- Page HTML autonome ---- */
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Étiquettes CLP — Labo LP Mermoz</title>
<style>
  /* ============================================================
     Mise en page impression : Avery L7121
     16 étiquettes / A4 — 99,1 × 33,9 mm
     Marges feuille : haut 15,1 mm | gauche 4,6 mm
     Pas horizontal : 102,6 mm (99,1 + 3,5 gouttière)
     Pas vertical   : 33,9 mm (pas de gouttière verticale)
  ============================================================ */

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: Arial, Helvetica, sans-serif;
    background: #e8e8e8;
  }

  /* Écran : prévisualisation centrée */
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
      display: flex;
      gap: 10px;
      z-index: 100;
    }
    .btn-print {
      background: #1a56db;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-size: .875rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-close {
      background: #fff;
      color: #374151;
      border: 1px solid #d1d5db;
      padding: 10px 20px;
      border-radius: 6px;
      font-size: .875rem;
      cursor: pointer;
    }
  }

  /* Impression : pas de marges navigateur, couleurs préservées */
  @media print {
    @page {
      size: A4 portrait;
      margin: 0;
    }
    body { background: white; }
    .no-print { display: none !important; }
    .sheet { page-break-after: always; box-shadow: none; }
    .sheet:last-child { page-break-after: auto; }
  }

  /* ---- Planche ---- */
  .sheet {
    width: 210mm;
    height: 297mm;
    /* Marges Avery L7121 */
    padding-top:    15.1mm;
    padding-left:   4.6mm;
    display: grid;
    grid-template-columns: repeat(2, 99.1mm);
    grid-template-rows:    repeat(8, 33.9mm);
    column-gap: 3.5mm;
    row-gap: 0mm;
    overflow: hidden;
  }

  /* ---- Étiquette individuelle ---- */
  .label {
    width: 99.1mm;
    height: 33.9mm;
    border: 0.3pt solid #bbb;    /* repère de découpe — supprimé à l'impression si gênant */
    display: flex;
    flex-direction: row;
    overflow: hidden;
    padding: 1.2mm;
    gap: 1.5mm;
    background: white;
    position: relative;
  }

  @media print {
    /* Retirer les bords si vous n'imprimez pas sur planche prédécoupée */
    /* .label { border: none; } */
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }

  .label-empty { border-color: transparent; }

  /* ---- Colonne gauche : visuel + pictogrammes ---- */
  .col-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 18mm;
    flex-shrink: 0;
  }
  .product-img {
    width: 14mm;
    height: 14mm;
    object-fit: contain;
    border: 0.3pt solid #ccc;
    border-radius: 1mm;
    display: block;
  }
  .product-img-placeholder {
    width: 14mm;
    height: 14mm;
    background: #f3f4f6;
    border: 0.3pt solid #ccc;
    border-radius: 1mm;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 6pt;
    color: #9ca3af;
    text-align: center;
    line-height: 1.2;
  }
  .pictograms {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5mm;
  }
  .picto {
    width: 7mm;
    height: 7mm;
    object-fit: contain;
  }

  /* ---- Colonne centrale : informations produit ---- */
  .col-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
    overflow: hidden;
  }
  .product-name {
    font-size: 7.5pt;
    font-weight: 700;
    color: #111;
    line-height: 1.2;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .product-formula {
    font-size: 6.5pt;
    color: #374151;
    font-style: italic;
    margin-top: 0.5mm;
  }
  .product-cas {
    font-size: 5.5pt;
    color: #6b7280;
    margin-top: 0.3mm;
  }
  .product-loc {
    font-size: 5.5pt;
    color: #1a56db;
    font-weight: 600;
    margin-top: 0.5mm;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .product-fds {
    font-size: 5pt;
    color: #6b7280;
    margin-top: 0.3mm;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ---- Colonne droite : mentions de danger ---- */
  .col-right {
    width: 38mm;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
    border-left: 0.5pt solid #e5e7eb;
    padding-left: 1mm;
  }
  .mentions-title {
    font-size: 5pt;
    font-weight: 700;
    color: #dc2626;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin-bottom: 0.5mm;
  }
  .mention-h {
    font-size: 5pt;
    color: #dc2626;
    line-height: 1.25;
    margin-bottom: 0.4mm;
  }
  .mentions-p-title {
    font-size: 5pt;
    font-weight: 700;
    color: #0369a1;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin-top: 0.8mm;
    margin-bottom: 0.3mm;
  }
  .mention-p {
    font-size: 4.8pt;
    color: #0369a1;
    line-height: 1.2;
    margin-bottom: 0.3mm;
  }
  .mention-raw {
    font-size: 4.8pt;
    color: #374151;
    line-height: 1.2;
    margin-bottom: 0.3mm;
  }

  /* ---- Bande colorée catégorie (trait haut de l'étiquette) ---- */
  .cat-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1.5mm;
  }

  /* ---- Obligations EPI (petits badges) ---- */
  .epi-row {
    display: flex;
    gap: 1mm;
    flex-wrap: wrap;
    margin-top: 1mm;
  }
  .epi-badge {
    font-size: 4.5pt;
    padding: 0.2mm 0.8mm;
    border-radius: 1mm;
    font-weight: 600;
    background: #fef3c7;
    color: #92400e;
    border: 0.3pt solid #fcd34d;
    white-space: nowrap;
  }

  /* ---- Bandeau "DANGER" si H300/H310/H330 ---- */
  .danger-banner {
    background: #dc2626;
    color: #fff;
    font-size: 5.5pt;
    font-weight: 700;
    text-align: center;
    padding: 0.3mm 1mm;
    border-radius: 0.5mm;
    margin-bottom: 0.5mm;
    letter-spacing: 0.05em;
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

  /* Ouvrir dans un nouvel onglet */
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
  /* ---- Couleur de la barre catégorie (selon famille chimique) ---- */
  const catColor = getCatColor(p.categorie || '');

  /* ---- Image produit ---- */
  let imgHtml = '';
  if (showImage) {
    if (p.image) {
      imgHtml = `<img class="product-img" src="${IMG_BASE}${p.image}" alt="${escHtml(p.nom)}" onerror="this.style.display='none'">`;
    } else {
      imgHtml = `<div class="product-img-placeholder">pas<br>de<br>photo</div>`;
    }
  }

  /* ---- Pictogrammes ---- */
  const picHtml = (p.pictogramme || []).map(f =>
    `<img class="picto" src="${PIC_BASE}${f}" alt="${escHtml(PIC_LABELS[f] || f)}" title="${escHtml(PIC_LABELS[f] || f)}">`
  ).join('');

  /* ---- Mentions H / P ---- */
  const dangers = p.dangers || [];
  const hCodes  = dangers.filter(d => /^H|^EUH/.test(d));
  const pCodes  = dangers.filter(d => /^P/.test(d));
  const rawMsgs = dangers.filter(d => !/^[HP]|^EUH/.test(d));

  const isHighDanger = hCodes.some(h => ['H300','H310','H330','H301','H311','H331'].includes(h));

  /* On limite les mentions pour tenir dans 33,9 mm */
  const MAX_H = 5, MAX_P = 4;

  const hMentions = hCodes.slice(0, MAX_H).map(h => {
    const txt = MENTIONS[h] || h;
    return `<div class="mention-h"><strong>${h}</strong> ${escHtml(txt)}</div>`;
  }).join('');

  const pMentions = pCodes.slice(0, MAX_P).map(hp => {
    const txt = MENTIONS[hp] || hp;
    return `<div class="mention-p"><strong>${hp}</strong> ${escHtml(txt)}</div>`;
  }).join('');

  const rawMentions = rawMsgs.map(r =>
    `<div class="mention-raw">${escHtml(r)}</div>`
  ).join('');

  const dangerBanner = isHighDanger
    ? '<div class="danger-banner">⚠ DANGER</div>'
    : '';

  const hBlock = hCodes.length
    ? `<div class="mentions-title">Danger</div>${dangerBanner}${hMentions}`
    : '';

  const pBlock = pCodes.length
    ? `<div class="mentions-p-title">Précaution</div>${pMentions}`
    : '';

  const rawBlock = rawMsgs.length && !hCodes.length
    ? `<div class="mentions-title">Note</div>${rawMentions}`
    : '';

  /* ---- EPI badges ---- */
  const epiHtml = (p.obligation || []).map(o =>
    `<span class="epi-badge">${escHtml(o)}</span>`
  ).join('');

  /* ---- FDS ---- */
  const fdsHtml = showFds && p.fds
    ? `<div class="product-fds">FDS : ${escHtml(p.fds)}</div>`
    : '';

  /* ---- Nom tronqué pour l'affichage (150 car max) ---- */
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
  if (c.includes('acide fort'))         return '#dc2626'; // rouge
  if (c.includes('acide'))              return '#f97316'; // orange
  if (c.includes('base') || c.includes('hydroxyde')) return '#7c3aed'; // violet
  if (c.includes('inflam') || c.includes('solvant')) return '#f59e0b'; // ambre
  if (c.includes('oxydant') || c.includes('comburant')) return '#eab308'; // jaune
  if (c.includes('toxique') || c.includes('toxique')) return '#b91c1c';
  if (c.includes('sal') || c.includes('minéral'))    return '#2563eb'; // bleu
  if (c.includes('métal'))              return '#6b7280'; // gris
  if (c.includes('environ'))            return '#16a34a'; // vert
  if (c.includes('indicateur'))         return '#0891b2'; // cyan
  if (c.includes('colorant'))           return '#db2777'; // rose
  return '#94a3b8'; // gris neutre par défaut
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
/*  Fonctions modal — appelées via les wrappers de index.html          */
/* ------------------------------------------------------------------ */

function _openLabelModal() {

  const sel = _getSelectedCas();
  const total = (typeof products !== 'undefined')
    ? products.length
    : 0;

  document.getElementById('opt-all-count').textContent = total;

  document.getElementById('modal-selection-count').textContent =
    sel.length > 0
      ? `${sel.length} produit${sel.length > 1 ? 's' : ''} sélectionné${sel.length > 1 ? 's' : ''} dans le tableau.`
      : 'Aucun produit sélectionné — choisissez « Tous les produits » ou cochez des lignes.';

  const optSelected = document.getElementById('opt-selected');
  const optAll = document.querySelector(
    'input[name="label-scope"][value="all"]'
  );

  // Réinitialisation complète à chaque ouverture
  optSelected.disabled = false;

  if (sel.length === 0) {
    optSelected.disabled = true;
    optAll.checked = true;
  } else {
    optSelected.checked = true;
  }

  document.getElementById('label-modal').style.display = 'flex';
}

function _closeLabelModal() {
  document.getElementById('label-modal').style.display = 'none';
}

function _closeLabelModalOutside(e) {
  if (e.target === document.getElementById('label-modal')) _closeLabelModal();
}

function _printLabels() {

  const scope =
    document.querySelector(
      'input[name="label-scope"]:checked'
    )?.value || 'selected';

  const showImage =
    document.getElementById('opt-show-image').checked;

  const showFds =
    document.getElementById('opt-show-fds').checked;

  let subset = [];

  if (scope === 'selected') {

    const selectedCas = _getSelectedCas();

    subset = products.filter(p =>
      selectedCas.includes(
        (p.cas || '').trim()
      )
    );

  } else {

    subset = [...products];

  }

  if (!subset.length) {
    alert('Aucun produit à imprimer.');
    return;
  }

  _closeLabelModal();

  generateLabelPage(
    subset,
    {
      showImage,
      showFds
    }
  );
}
