/**
 * utils.js — Fonctions partagées par tous les TP chimie
 *
 * renderBlocSecurite() et renderCarteProduit() reçoivent les données
 * en paramètre — aucune importation globale de PRODUITS n'est nécessaire
 * (l'ancien import mort "./produits.js", renommé en products.js dans la
 * refonte de la base de données, a été supprimé).
 */

// ── Pictogrammes GHS → images ─────────────────────────────────
export const GHS_PICTO = {
  GHS01: { img: 'assets/picto/SGH01_BombeExplosant.jpg',   label: 'Explosif' },
  GHS02: { img: 'assets/picto/SGH02_Flamme.jpg',           label: 'Inflammable' },
  GHS03: { img: 'assets/picto/SGH03_FlammeSurCercle.jpg',  label: 'Comburant' },
  GHS04: { img: 'assets/picto/SGH04_BouteilleGaz.jpg',     label: 'Gaz sous pression' },
  GHS05: { img: 'assets/picto/SGH05_Corrosion.jpg',        label: 'Corrosif' },
  GHS06: { img: 'assets/picto/SGH06_TeteDeMort.jpg',       label: 'Toxique' },
  GHS07: { img: 'assets/picto/SGH07_PointExclamation.jpg', label: 'Irritant / nocif' },
  GHS08: { img: 'assets/picto/SGH08_DangerSante.jpg',      label: 'Danger santé grave' },
  GHS09: { img: 'assets/picto/SGH09_Environnement.jpg',    label: 'Danger environnement' },
};

// ── EPI ───────────────────────────────────────────────────────
export const EPI_CONFIG = {
  LUNETTES:     { img: 'assets/picto/OBLIGATION-lunettes.jpg',                      label: 'Lunettes de protection' },
  GANTS:        { img: 'assets/picto/OBLIGATION-gants.jpg',                         label: 'Gants' },
  BLOUSE:       { img: 'assets/picto/OBLIGATION-blouse.jpg',                        label: 'Blouse' },
  HOTTE:        { img: 'assets/picto/OBLIGATION-hotte.jpeg',                        label: 'Hotte aspirante' },
  CASQUE:       { img: 'assets/picto/OBLIGATION-casque.jpg',                        label: 'Casque' },
  VISIERE:      { img: 'assets/picto/OBLIGATION-visiere.jpg',                       label: 'Visière' },
  CHAUSSURES:   { img: 'assets/picto/OBLIGATION-chaussures.jpg',                    label: 'Chaussures de sécurité' },
  COMBINAISON:  { img: 'assets/picto/OBLIGATION-combinaison.jpg',                   label: 'Combinaison' },
  HARNAIS:      { img: 'assets/picto/OBLIGATION-harnais.jpg',                       label: 'Harnais' },
  RESPIRATOIRE: { img: 'assets/picto/OBLIGATION-protection-voies-espiratoires.jpg', label: 'Protection respiratoire' },
};

// ── Masses molaires (g/mol) ───────────────────────────────────
export const MASSES_MOLAIRES = {
  'C8H8O': 120.15, 'C4H8O2': 88.11, 'HCl': 36.46, 'C10H16N2O8': 292.24,
  'CH3COOH': 60.05, 'HNO3': 63.01, 'C3H6O2': 74.08, 'H2SO4': 98.08,

  'Al': 26.98, 'AlCl3': 133.34, 'Al2(SO4)3·16H2O': 630.40,

  'NH4Cl': 53.49, '(NH4)2Fe(SO4)2·6H2O': 392.14, 'NH4OH': 35.05, '(NH4)2C2O4': 124.10,

  'AgNO3': 169.87, 'BaCl2·2H2O': 244.26,

  'C27H28Br2O5S': 624.38, 'C16H18N3SCl': 319.85,

  'CaCO3': 100.09, 'CaCl2': 110.98, 'Ca': 40.08, 'CaSO4': 136.14,

  'C': 12.01,

  'CuCl2': 134.45, 'CuO': 79.55, 'Cu': 63.55, 'CuSO4': 159.61,

  'CH2Cl2': 84.93, 'C4H10O': 74.12, 'Na2B4O7': 201.22,

  'C20H6Br4NaO5': 691.85, 'C20H12N3NaO7S': 461.38,

  'SnCl2·2H2O': 225.63, 'Sn': 118.71, 'C2H6O': 46.07,

  'FeCl2·4H2O': 198.81, 'FeCl3·6H2O': 270.30, 'Fe': 55.85, 'Fe2O3': 159.69,
  'FeSO4·7H2O': 278.01, 'FeS': 87.91,

  'C20H12O5': 332.31, 'C3H8O3': 92.09, 'C14H14N3NaO3S': 327.33, 'C6H16N2': 116.20,
  'H2O2': 34.02, 'I2': 253.81, 'C5H12O': 88.15, 'MgCl2·6H2O': 203.30,

  'Hg': 200.59,

  'C5H8O2': 100.12, 'C5H10': 70.13, 'C4H6O2': 86.09, 'C10H8': 128.17,

  'NiSO4·6H2O': 262.85,

  'C20H14O4': 318.33,

  'P4': 123.90, 'Ca3(PO4)2': 310.18,

  'Pb': 207.20, 'Pb3O4': 685.60,

  'KAl(SO4)2·12H2O': 474.39, 'KBrO3': 167.00, 'KClO3': 122.55, 'KCl': 74.55,
  'K2CrO4': 194.19, 'K3[Fe(CN)6]': 329.24, 'K4[Fe(CN)6]': 368.35, 'KOH': 56.11,
  'KI': 166.00, 'K': 39.10, 'KNO3': 101.10, 'K2C2O4': 166.22, 'KMnO4': 158.03,
  'K2S2O8': 270.32,

  'C3H6O': 58.08,

  'K2[HgI4]': 786.40, '(NH4)6Mo7O24·4H2O': 1235.86,

  'C15H15N3O2': 269.30,

  'Na2CO3': 105.99, 'NaCl': 58.44, 'CH3COONa': 82.03, 'NaHCO3': 84.01,
  'NaHSO3': 104.06, 'NaOH': 40.00, 'Na3PO4': 163.94, 'Na2SO3': 126.04,
  'Na2B4O7·10H2O': 381.37,

  'ZnCl2': 136.29, 'ZnSO4·7H2O': 287.54,
};

// ── Résolution de chemin d'image ───────────────────────────────
// Les fragments de TP sont injectés par navigation.js dans la page hôte
// (le "shell" SPA à la racine du site) : tous les chemins d'image doivent
// donc être RELATIFS À LA RACINE DU SITE, jamais relatifs au fichier JS
// ni au fichier HTML d'origine du fragment.
export function imgSrc(chemin, dossierParDefaut = 'tp-chimie/assets/images/') {
  if (!chemin) return '';

  // URL absolue ou déjà explicitement relative à la racine (ex: "assets/…",
  // "tp-chimie/…") ou une URL complète : on la laisse telle quelle.
  if (
    chemin.startsWith('http') ||
    chemin.startsWith('assets/') ||
    chemin.startsWith('tp-chimie/') ||
    chemin.startsWith('/')
  ) {
    return chemin;
  }

  // Nom de fichier seul → on préfixe avec le dossier par défaut (relatif
  // à la racine du site).
  return dossierParDefaut + chemin;
}

// ── Carte produit ─────────────────────────────────────────────
export function renderCarteProduit(p, options = {}) {
  const ghsBadges = (p.pictogrammes || p.dangers || [])
    .filter(g => /^GHS/i.test(g))
    .map(g => {
      const info = GHS_PICTO[g];
      if (!info) return `<span title="${g}">⚠️</span>`;
      return `<img src="${info.img}" alt="${g}" title="${info.label}"
                   class="ghs-badge"
                   onerror="this.style.display='none'">`;
    }).join('');

  const hlist = (p.dangers || [])
    .filter(c => /^H/i.test(c))
    .map(c => `<div class="danger-strip"><span class="code-h">${c}</span></div>`)
    .join('');

  return `
    <div class="produit-carte">
      <div><span class="produit-cas">${p.cas || ''}</span></div>
      <div>
        <div class="produit-nom">${p.nom || ''}</div>
        <div class="produit-formule">${p.formule || ''}</div>
        <div class="produit-localisation">📍 ${p.localisation || ''}</div>
        ${options.showGHS && ghsBadges ? `<div class="ghs-pictos">${ghsBadges}</div>` : ''}
        ${options.showH && hlist ? hlist : ''}
      </div>
    </div>`;
}

// ── Bloc sécurité ─────────────────────────────────────────────
export function renderBlocSecurite(produits) {
  const cartes = produits
    .map(p => renderCarteProduit(p, { showGHS: true, showH: true }))
    .join('');
  return `
    <div class="alerte-securite">
      <strong>⚠️ Consignes de sécurité obligatoires</strong>
      Lire les fiches de données de sécurité avant toute manipulation.
      En cas d'accident : rincer abondamment et appeler le responsable.
    </div>
    ${cartes}`;
}

// ── Calculs ───────────────────────────────────────────────────
export function concentrationMolaire(masseG, volumeL, masseMolaire) {
  if (!volumeL || !masseMolaire) return null;
  return (masseG / masseMolaire / volumeL).toFixed(4);
}

export function dilution({ c1, v1, c2, v2 }) {
  if (c1 && v1 && c2) return (c1 * v1 / c2).toFixed(1);
  if (c1 && v1 && v2) return (c1 * v1 / v2).toFixed(4);
  return null;
}

// ── Accordéons ────────────────────────────────────────────────
export function initSections() {
  document.querySelectorAll('.section-titre').forEach(titre => {
    titre.addEventListener('click', () => {
      titre.closest('.section').classList.toggle('fermee');
      const chev = titre.querySelector('.chevron');
      if (chev) chev.textContent = titre.closest('.section').classList.contains('fermee') ? '▶' : '▼';
    });
  });
}

// ── Onglets ───────────────────────────────────────────────────
export function initTabs(callback = null) {

    document.querySelectorAll(".tabs-container").forEach(container => {

        const boutons = container.querySelectorAll(".tab-btn");
        const panneaux = container.querySelectorAll(".tab-panel");

        boutons.forEach(btn => {

            btn.addEventListener("click", () => {

                boutons.forEach(b => b.classList.remove("actif"));
                panneaux.forEach(p => p.classList.remove("actif"));

                btn.classList.add("actif");

                const panel = container.querySelector("#" + btn.dataset.tab);

                if (panel)
                    panel.classList.add("actif");

                if (callback)
                    callback(btn.dataset.tab);

            });

        });

    });

}

// ── Impression simple (window.print) ─────────────────────────
export function initImprimer() {
  const btn = document.getElementById('btn-imprimer');
  if (btn) btn.addEventListener('click', () => window.print());
}

// ── Calcul guidé générique ────────────────────────────────────
export function bindCalcul(id, fn) {
  const el = document.getElementById(id);
  if (!el) return;
  el.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', () => {
      const vals = [...el.querySelectorAll('input')].map(i => parseFloat(i.value));
      const res = el.querySelector('.resultat-calcul');
      if (res) res.textContent = fn(vals) ?? '—';
    });
  });
}
