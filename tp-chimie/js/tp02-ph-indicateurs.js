console.log("tp02-ph-indicateurs.js chargé");

// =====================================================
// PRODUITS
// =====================================================
// Import aligné sur le fragment TP03 (mêmes chemins relatifs
// depuis tp-chimie/js/). Fallback sur les globales si l'import
// échoue, pour ne jamais casser toute la page silencieusement.

let PRODUITS = window.PRODUITS || window.parent?.PRODUITS || [];

try {
  const mod = await import('./produits.js');
  if (mod?.PRODUITS?.length) PRODUITS = mod.PRODUITS;
} catch (e) {
  console.error("tp02: import produits.js impossible, fallback sur PRODUITS global", e);
}

// =====================================================
// INDICATEURS COLORES (données locales complètes)
// =====================================================

const INDICATEURS_B27 = [
  {
    nom: "Hélianthine (orange de méthyle)",
    formule: "C₁₄H₁₄N₃NaO₃S",
    cas: "547-58-0",
    plageMin: 3.1,
    plageMax: 4.4,
    couleurAcide: "#D32F2F",
    nomAcide: "rouge",
    couleurBasique: "#FBC02D",
    nomBasique: "jaune",
    couleurVirage: "#F57C00",
    nomVirage: "orange (zone de virage)",
    localisation: "Étagère D4"
  },
  {
    nom: "Rouge de méthyle",
    formule: "C₁₅H₁₅N₃O₂",
    cas: "493-52-7",
    plageMin: 4.4,
    plageMax: 6.2,
    couleurAcide: "#C62828",
    nomAcide: "rouge",
    couleurBasique: "#FDD835",
    nomBasique: "jaune",
    couleurVirage: "#F57F17",
    nomVirage: "orange (zone de virage)",
    localisation: "Étagère D4"
  },
  {
    nom: "Bleu de bromothymol (BBT)",
    formule: "C₂₇H₂₈Br₂O₅S",
    cas: "76-59-5",
    plageMin: 6.0,
    plageMax: 7.6,
    couleurAcide: "#FDD835",
    nomAcide: "jaune",
    couleurBasique: "#1565C0",
    nomBasique: "bleu",
    couleurVirage: "#43A047",
    nomVirage: "vert (zone de virage)",
    localisation: "Étagère D4"
  },
  {
    nom: "Phénolphtaléine",
    formule: "C₂₀H₁₄O₄",
    cas: "77-09-8",
    plageMin: 8.2,
    plageMax: 10.0,
    couleurAcide: "#ECF0F1",
    nomAcide: "incolore",
    couleurBasique: "#D81B60",
    nomBasique: "rose fuchsia",
    couleurVirage: "#F48FB1",
    nomVirage: "rose pâle (zone de virage)",
    localisation: "Étagère B2"
  }
];

// CAS des réactifs utiles à ce TP (acides, bases, tampons couverts
// par les produits + les 4 indicateurs colorés)
const CAS_TP02 = [
  '7647-01-0', // HCl
  '64-19-7',   // CH3COOH
  '1336-21-6', // NH4OH (ammoniac en solution)
  '1310-73-2', // NaOH
  '76-59-5',   // BBT
  '77-09-8',   // Phénolphtaléine
  '547-58-0',  // Hélianthine
  '493-52-7'   // Rouge de méthyle
];

// =====================================================
// MATERIEL (données locales, en attendant une base
// équipement/verrerie commune à toutes les TP)
// =====================================================

const VERRERIE_TP02 = [
  { icone: '🧪', nom: 'Tubes à essai', qte: '×16' },
  { icone: '🗂️', nom: 'Portoir à tubes', qte: '×2' },
  { icone: '💧', nom: 'Pipettes Pasteur', qte: '×8' },
  { icone: '⚗️', nom: 'Béchers 50 mL', qte: '×4' }
];

const EQUIPEMENTS_TP02 = [
  { icone: '📱', nom: 'pH-mètre', qte: '×1' },
  { icone: '🌡️', nom: 'Solutions tampons pH 4 / 7 / 9', qte: '×3' },
  { icone: '🧻', nom: 'Papier pH universel', qte: '1 rouleau' },
  { icone: '🧻', nom: 'Bandelettes pH 5,0 à 10,0', qte: '1 boîte' },
  { icone: '🧤', nom: 'Gants + lunettes', qte: 'obligatoires' }
];

// =====================================================
// PAPIERS / BANDELETTES INDICATEURS
// (données reprises telles quelles de l'inventaire équipement
// de la salle B27 — catégorie "Indicateur" / "pHmétrie")
// =====================================================

const PAPIERS_PH = [
  {
    nom: "Papier pH universel",
    description: "Bandelette indicatrice permettant de mesurer le pH d'une solution par comparaison avec une échelle colorée.",
    usage: "Mesure approximative du pH sur toute l'échelle (0 à 14).",
    lieu: "Salle B27 / étagère D4",
    horsPH: false
  },
  {
    nom: "Bandelettes pH 5,0 à 10,0",
    description: "Bandelettes indicatrices permettant une mesure précise du pH des solutions entre 5,0 et 10,0.",
    usage: "Mesure plus fine que le papier pH universel, mais limitée à la plage 5,0–10,0.",
    lieu: "Salle B27 / étagère D4",
    horsPH: false
  },
  {
    nom: "Papier tournesol bleu",
    description: "Papier indicateur virant au rouge en présence d'une solution acide.",
    usage: "Test qualitatif rapide : rougit en milieu acide, reste bleu sinon.",
    lieu: "Salle B27 / étagère D4",
    horsPH: false
  },
  {
    nom: "Papier tournesol rouge",
    description: "Papier indicateur virant au bleu en présence d'une solution basique.",
    usage: "Test qualitatif rapide : bleuit en milieu basique, reste rouge sinon.",
    lieu: "Salle B27 / étagère D4",
    horsPH: false
  },
  {
    nom: "Papier tournesol neutre",
    description: "Papier indicateur permettant de distinguer les solutions acides et basiques.",
    usage: "Vire au rouge en milieu acide, au bleu en milieu basique.",
    lieu: "Salle B27 / étagère D4",
    horsPH: false
  },
  {
    nom: "Papier phénolphtaléine",
    description: "Papier imprégné de phénolphtaléine, incolore en milieu acide et rose en milieu basique.",
    usage: "Détecte spécifiquement le caractère basique (virage vers pH 8,2–10,0).",
    lieu: "Salle B27 / étagère D4",
    horsPH: false
  },
  {
    nom: "Papier à l'acétate de plomb",
    description: "Papier détecteur des ions sulfure et du sulfure d'hydrogène (H₂S) par noircissement.",
    usage: "⚠️ Ne mesure pas le pH : détecte la présence d'H₂S / d'ions sulfure (utile pour un TP d'identification d'ions).",
    lieu: "Salle B27 / étagère D4",
    horsPH: true
  }
];

// =====================================================
// INIT (appelé par navigation.js)
// =====================================================

export function init() {
  console.log("tp02 init exécuté");

  _initSecurite();
  _initMateriel();
  _initSimulateurPH();
  _initTabIndicateur();
  _initTabPapierPH();
  _initProtocoleTabs();
}

// =====================================================
// SECURITE — filtres + select #reactif + #securite-bloc
// =====================================================

function _appartientCategorie(produit, categorie) {
  if (!produit || !produit.categorie) return false;
  return Array.isArray(produit.categorie)
    ? produit.categorie.includes(categorie)
    : produit.categorie === categorie;
}

function _produitsTP02() {
  return CAS_TP02
    .map(cas => PRODUITS.find(p => p.cas === cas))
    .filter(Boolean);
}

function _categoriesActives() {
  return Array.from(document.querySelectorAll('.filtre-cat:checked')).map(cb => cb.value);
}

function _peuplerSelectReactif() {
  const select = document.getElementById('reactif');
  if (!select) return;

  const actives = _categoriesActives();
  const valeurActuelle = select.value;

  const produits = _produitsTP02().filter(p =>
    actives.length === 0 || actives.some(cat => _appartientCategorie(p, cat))
  );

  select.innerHTML = '<option value="">-- Sélectionner --</option>' +
    produits.map(p => `<option value="${p.cas}">${p.nom}</option>`).join('');

  if (produits.some(p => p.cas === valeurActuelle)) {
    select.value = valeurActuelle;
  }
}

function _rendrePictogrammes(produit) {
  if (!produit?.pictogrammes) return '';
  const codes = Object.keys(produit.pictogrammes);
  if (!codes.length) return '';
  return `<div class="pictogrammes">${codes.map(code =>
    `<img class="picto-danger" src="../assets/pictogrammes/${produit.pictogrammes[code]}" alt="${code}" title="${code}">`
  ).join('')}</div>`;
}

function _rendreFicheProduit(produit) {
  if (!produit) return '<div class="info">Sélectionner un réactif.</div>';

  const phrasesH = Array.isArray(produit.phrasesH) ? produit.phrasesH : [];
  const phrasesP = Array.isArray(produit.phrasesP) ? produit.phrasesP : [];

  return `
    <div class="fiche-produit">
      <h4>${produit.nom}${produit.formule ? ` <span class="formule-inline">(${produit.formule})</span>` : ''}</h4>
      ${produit.cas ? `<p class="cas">CAS : ${produit.cas}</p>` : ''}
      ${_rendrePictogrammes(produit)}
      ${phrasesH.length ? `<p><strong>Mentions de danger :</strong> ${phrasesH.join(', ')}</p>` : ''}
      ${phrasesP.length ? `<p><strong>Conseils de prudence :</strong> ${phrasesP.join(', ')}</p>` : ''}
      ${produit.localisation ? `<p><strong>Localisation :</strong> ${produit.localisation}</p>` : ''}
    </div>
  `;
}

function _initSecurite() {
  const select = document.getElementById('reactif');
  const bloc = document.getElementById('securite-bloc');
  if (!select || !bloc) return;

  _peuplerSelectReactif();

  document.querySelectorAll('.filtre-cat').forEach(cb => {
    cb.addEventListener('change', _peuplerSelectReactif);
  });

  select.addEventListener('change', () => {
    const produit = PRODUITS.find(p => p.cas === select.value)
      || INDICATEURS_B27.find(i => i.cas === select.value);
    bloc.innerHTML = _rendreFicheProduit(produit);
  });
}

// =====================================================
// MATERIEL
// =====================================================

function _initMateriel() {
  const verrerieEl = document.getElementById('materiel-verrerie');
  const equipEl = document.getElementById('materiel-equipements');

  if (verrerieEl) {
    verrerieEl.innerHTML = VERRERIE_TP02.map(item =>
      `<div class="item-materiel"><span class="icone-materiel">${item.icone}</span> ${item.nom} <span class="qte">${item.qte}</span></div>`
    ).join('');
  }

  if (equipEl) {
    equipEl.innerHTML = EQUIPEMENTS_TP02.map(item =>
      `<div class="item-materiel"><span class="icone-materiel">${item.icone}</span> ${item.nom} <span class="qte">${item.qte}</span></div>`
    ).join('');
  }
}

// =====================================================
// SIMULATEUR pH
// =====================================================

function _interpolerCouleur(c1, c2, t) {
  const parse = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const [r1, g1, b1] = parse(c1), [r2, g2, b2] = parse(c2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${b})`;
}

function _formatSci(val) {
  if (val === 0) return '0';
  const exp = Math.floor(Math.log10(val));
  const mant = (val / Math.pow(10, exp)).toFixed(2);
  return `${mant} × 10<sup>${exp}</sup> mol/L`;
}

function _majSimulateur(ph) {
  const affichage = document.getElementById('affichage-ph');
  const curseur = document.getElementById('curseur-ph');
  const h3oEl = document.getElementById('concentration-h3o');
  const hoEl = document.getElementById('concentration-ho');
  const natureEl = document.getElementById('nature-solution');
  const cont = document.getElementById('resultats-indicateurs');

  if (affichage) affichage.textContent = parseFloat(ph).toFixed(1);
  if (curseur) curseur.style.left = (ph / 14 * 100) + '%';

  const h3o = Math.pow(10, -ph);
  const ho = Math.pow(10, -(14 - ph));
  if (h3oEl) h3oEl.innerHTML = _formatSci(h3o);
  if (hoEl) hoEl.innerHTML = _formatSci(ho);

  if (natureEl) {
    natureEl.textContent = ph < 7 ? '⚡ acide' : ph > 7 ? '🔷 basique' : '⚖️ neutre';
  }

  if (cont) {
    cont.innerHTML = INDICATEURS_B27.map(ind => {
      let couleur, nom;
      if (ph < ind.plageMin) {
        couleur = ind.couleurAcide; nom = ind.nomAcide;
      } else if (ph > ind.plageMax) {
        couleur = ind.couleurBasique; nom = ind.nomBasique;
      } else {
        couleur = ind.couleurVirage || '#9B59B6';
        nom = ind.nomVirage || 'zone de virage';
      }
      const isIncolore = nom === 'incolore';
      return `<div class="carte-indicateur">
        <div class="ind-nom">${ind.nom}</div>
        <div class="ind-couleur" style="background:${couleur};color:${isIncolore ? '#333' : '#fff'};border:${isIncolore ? '1px solid #ccc' : 'none'}">${nom}</div>
        <div class="ind-plage">virage pH ${ind.plageMin}–${ind.plageMax}</div>
      </div>`;
    }).join('');
  }
}

function _initSimulateurPH() {
  const slider = document.getElementById('slider-ph');
  if (!slider) return;

  slider.addEventListener('input', () => _majSimulateur(parseFloat(slider.value)));
  _majSimulateur(parseFloat(slider.value) || 7);
}

// =====================================================
// ONGLET "Indicateur" (tests qualitatifs)
// =====================================================

function _rendreFicheIndicateur(ind) {
  if (!ind) return '<p>Sélectionner un indicateur pour afficher sa fiche.</p>';
  return `
    <p><strong>${ind.nom}</strong>${ind.formule ? ` — <span class="formule-inline">${ind.formule}</span>` : ''}</p>
    ${ind.cas ? `<p class="cas">CAS : ${ind.cas}</p>` : ''}
    <p><strong>Plage de virage :</strong> pH ${ind.plageMin} – ${ind.plageMax}</p>
    <p>
      <span class="pastille-couleur" style="background:${ind.couleurAcide}"></span> ${ind.nomAcide} en milieu acide
      &nbsp;→&nbsp;
      <span class="pastille-couleur" style="background:${ind.couleurBasique}"></span> ${ind.nomBasique} en milieu basique
    </p>
    ${ind.localisation ? `<p><strong>Localisation :</strong> ${ind.localisation}</p>` : ''}
  `;
}

function _initTabIndicateur() {
  const select = document.getElementById('select-indicateur');
  const fiche = document.getElementById('fiche-indicateur');
  if (!select || !fiche) return;

  select.innerHTML = '<option value="">-- Sélectionner --</option>' +
    INDICATEURS_B27.map(ind => `<option value="${ind.cas}">${ind.nom}</option>`).join('');

  select.addEventListener('change', () => {
    const ind = INDICATEURS_B27.find(i => i.cas === select.value);
    fiche.innerHTML = _rendreFicheIndicateur(ind);
  });
}

// =====================================================
// ONGLET "Papier pH" (tests qualitatifs)
// =====================================================

function _rendreFichePapier(papier) {
  if (!papier) return '<p>Sélectionner un papier pour afficher sa fiche.</p>';
  return `
    <p><strong>${papier.nom}</strong></p>
    <p>${papier.description}</p>
    <p><strong>Usage :</strong> ${papier.usage}</p>
    ${papier.lieu ? `<p><strong>Localisation :</strong> ${papier.lieu}</p>` : ''}
    ${papier.horsPH ? `<p class="attention">⚠️ Ce papier ne sert pas à mesurer un pH — réservé à un autre TP (identification d'ions).</p>` : ''}
  `;
}

function _initTabPapierPH() {
  const select = document.getElementById('select-papier');
  const fiche = document.getElementById('fiche-papier');
  if (!select || !fiche) return;

  select.innerHTML = '<option value="">-- Sélectionner --</option>' +
    PAPIERS_PH.map((p, i) => `<option value="${i}">${p.nom}</option>`).join('');

  select.addEventListener('change', () => {
    const papier = PAPIERS_PH[select.value];
    fiche.innerHTML = _rendreFichePapier(papier);
  });
}

// =====================================================
// PROTOCOLE — onglets
// =====================================================

function _initProtocoleTabs() {
  const conteneurs = document.querySelectorAll('.tabs-container');

  conteneurs.forEach(conteneur => {
    const boutons = conteneur.querySelectorAll('.tab-btn');
    const panneaux = conteneur.querySelectorAll('.tab-panel');

    boutons.forEach(btn => {
      btn.addEventListener('click', () => {
        boutons.forEach(b => b.classList.remove('actif'));
        panneaux.forEach(p => p.classList.remove('actif'));

        btn.classList.add('actif');
        const cible = document.getElementById(btn.dataset.tab);
        if (cible) cible.classList.add('actif');
      });
    });
  });
}
