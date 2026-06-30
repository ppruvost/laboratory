/**
 * compte-rendu.js — Module commun de génération de compte-rendu SciLab
 *
 * Utilisable depuis n'importe quel TP, dans n'importe quel domaine
 * (chimie, physique, etc.). Fournit une trame d'impression standardisée
 * avec logo SciLab, identification élève (nom/prénom/classe/date) et
 * génération PDF via l'impression navigateur (Destination → Enregistrer en PDF).
 *
 * ── Utilisation depuis un module de TP ──────────────────────────────
 *   import { genererCompteRendu } from '../../js/compte-rendu.js';
 *
 *   genererCompteRendu({
 *     domaine: 'Chimie',                // Chimie / Physique / ...
 *     tp: 'TP03',
 *     titre: 'Titrage acido-basique',
 *     sections: [
 *       {
 *         titre: 'Résultats',
 *         items: [
 *           { label: 'Ve (tangentes)', valeur: '20,34 mL' },
 *           { label: 'CA (tangentes)', valeur: '0,1017 mol/L' },
 *         ],
 *       },
 *       { titre: 'Observations', texte: 'Texte libre ou commentaire élève...' },
 *     ],
 *     canvas: document.getElementById('canvas-titrage'), // optionnel
 *   });
 * ──────────────────────────────────────────────────────────────────
 */

const CSS_HREF = new URL('../css/compte-rendu.css', import.meta.url).href;
const CLE_IDENTITE = 'scilab-identite-eleve';

let _cssChargee = false;
let _config = null;

// ══════════════════════════════════════════════════════════════
// API PUBLIQUE
// ══════════════════════════════════════════════════════════════
export function genererCompteRendu(config) {
  if (!config || !config.titre) {
    console.error('compte-rendu.js : configuration invalide (titre requis).');
    return;
  }
  _config = config;
  _chargerCSS();
  _ouvrirModalIdentification();
}

// ══════════════════════════════════════════════════════════════
// CHARGEMENT CSS (une seule fois, quel que soit le TP appelant)
// ══════════════════════════════════════════════════════════════
function _chargerCSS() {
  if (_cssChargee || document.querySelector(`link[href="${CSS_HREF}"]`)) {
    _cssChargee = true;
    return;
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = CSS_HREF;
  document.head.appendChild(link);
  _cssChargee = true;
}

// ══════════════════════════════════════════════════════════════
// MODALE D'IDENTIFICATION
// ══════════════════════════════════════════════════════════════
function _identitePrecedente() {
  try {
    return JSON.parse(localStorage.getItem(CLE_IDENTITE)) || {};
  } catch {
    return {};
  }
}

function _ouvrirModalIdentification() {
  document.getElementById('cr-modal-overlay')?.remove();

  // Priorité : config.identiteDefaut (champs HTML du TP) > localStorage > vide
  const precedent = _identitePrecedente();
  const defaut = _config.identiteDefaut || {};
  const aujourdHui = new Date().toISOString().slice(0, 10);

  const val = (champ) => _echapper(defaut[champ] || precedent[champ] || '');
  const valDate = () => {
    const d = defaut.date || precedent.date;
    return d && _dateValide(d) ? d : aujourdHui;
  };

  const overlay = document.createElement('div');
  overlay.id = 'cr-modal-overlay';
  overlay.innerHTML = `
    <div id="cr-modal">
      <h2>Compte-rendu — ${_config.titre}</h2>
      <p class="cr-soustitre">Vérifie ton identification avant de générer le PDF.</p>

      <label for="cr-nom">Nom</label>
      <input type="text" id="cr-nom" value="${val('nom')}" autocomplete="family-name">
      <div class="cr-erreur-champ" id="err-nom">Le nom est requis.</div>

      <label for="cr-prenom">Prénom</label>
      <input type="text" id="cr-prenom" value="${val('prenom')}" autocomplete="given-name">
      <div class="cr-erreur-champ" id="err-prenom">Le prénom est requis.</div>

      <label for="cr-classe">Classe</label>
      <input type="text" id="cr-classe" value="${val('classe')}" placeholder="ex. 1 Bac Pro MELEC">
      <div class="cr-erreur-champ" id="err-classe">La classe est requise.</div>

      <label for="cr-date">Date du TP</label>
      <input type="date" id="cr-date" value="${valDate()}">

      <div class="cr-modal-actions">
        <button id="cr-btn-annuler" type="button">Annuler</button>
        <button id="cr-btn-generer" type="button">Générer le compte-rendu</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('cr-btn-annuler').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  document.getElementById('cr-btn-generer').addEventListener('click', () => {
    const identite = {
      nom: document.getElementById('cr-nom').value.trim(),
      prenom: document.getElementById('cr-prenom').value.trim(),
      classe: document.getElementById('cr-classe').value.trim(),
      date: document.getElementById('cr-date').value,
    };

    let ok = true;
    [['nom', identite.nom], ['prenom', identite.prenom], ['classe', identite.classe]].forEach(([champ, val]) => {
      const err = document.getElementById(`err-${champ}`);
      if (!val) { err.style.display = 'block'; ok = false; } else { err.style.display = 'none'; }
    });
    if (!ok) return;

    localStorage.setItem(CLE_IDENTITE, JSON.stringify(identite));
    overlay.remove();
    _construireEtImprimer(identite);
  });
}

function _dateValide(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function _echapper(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ══════════════════════════════════════════════════════════════
// CONSTRUCTION DE LA TRAME + IMPRESSION
// ══════════════════════════════════════════════════════════════
function _construireEtImprimer(identite) {
  let conteneur = document.getElementById('cr-print-container');
  if (!conteneur) {
    conteneur = document.createElement('div');
    conteneur.id = 'cr-print-container';
    document.body.appendChild(conteneur);
  }

  const dateFr = identite.date
    ? new Date(identite.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';

  const sectionsHTML = (_config.sections || []).map(_rendreSection).join('');
  const graphiqueHTML = _config.canvas
    ? `<div class="cr-section">
         <h3>Graphique</h3>
         <img class="cr-graphique" src="${_config.canvas.toDataURL('image/png')}" alt="Graphique du TP">
       </div>`
    : '';

  conteneur.innerHTML = `
    <div class="cr-entete">
      <div class="cr-logo">
        ${_logoSVG()}
        <div class="cr-logo-texte">Sci<span>Lab</span></div>
      </div>
      <div class="cr-entete-droite">
        Compte-rendu généré le ${new Date().toLocaleDateString('fr-FR')}<br>
        Bac Pro — Sciences physiques et chimiques
      </div>
    </div>

    <span class="cr-domaine-badge">${_echapper(_config.domaine || 'Sciences')} — ${_echapper(_config.tp || '')}</span>
    <div class="cr-titre-tp">${_echapper(_config.titre)}</div>

    <div class="cr-identification">
      <div><div class="cr-label">Nom</div><div class="cr-valeur">${_echapper(identite.nom)}</div></div>
      <div><div class="cr-label">Prénom</div><div class="cr-valeur">${_echapper(identite.prenom)}</div></div>
      <div><div class="cr-label">Classe</div><div class="cr-valeur">${_echapper(identite.classe)}</div></div>
      <div><div class="cr-label">Date du TP</div><div class="cr-valeur">${dateFr}</div></div>
    </div>

    ${sectionsHTML}
    ${graphiqueHTML}

    <div class="cr-signature">
      <div>Signature de l'élève</div>
      <div>Visa du professeur</div>
    </div>

    <div class="cr-pied">
      <span>SciLab — Plateforme de travaux pratiques</span>
      <span>${_echapper(_config.tp || '')} · ${_echapper(_config.domaine || '')}</span>
    </div>
  `;

  document.body.classList.add('cr-printing');

  const nettoyer = () => {
    document.body.classList.remove('cr-printing');
    window.removeEventListener('afterprint', nettoyer);
  };
  window.addEventListener('afterprint', nettoyer);

  // Laisse le DOM/CSS se stabiliser avant d'ouvrir la boîte d'impression
  setTimeout(() => window.print(), 50);
}

function _rendreSection(section) {
  if (section.items && section.items.length) {
    const lignes = section.items
      .map(it => `<tr><td>${_echapper(it.label)}</td><td>${_echapper(String(it.valeur))}</td></tr>`)
      .join('');
    return `
      <div class="cr-section">
        <h3>${_echapper(section.titre)}</h3>
        <table class="cr-items"><tbody>${lignes}</tbody></table>
      </div>`;
  }
  if (section.texte) {
    return `
      <div class="cr-section">
        <h3>${_echapper(section.titre)}</h3>
        <div class="cr-texte-libre">${_echapper(section.texte)}</div>
      </div>`;
  }
  return '';
}

// ── Logo SciLab : fiole/erlenmeyer stylisé, dessiné en SVG natif (libre de droits) ──
function _logoSVG() {
  return `
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6h10v9.5l8.5 16.4c1.6 3.1-.6 6.8-4.1 6.8H14.6c-3.5 0-5.7-3.7-4.1-6.8L19 15.5V6z"
          fill="#1B6CA8" stroke="#0D4F8A" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M16.5 27h15" stroke="#fff" stroke-width="1.6"/>
    <rect x="17.5" y="4.5" width="13" height="3" rx="1.2" fill="#0D4F8A"/>
    <circle cx="22" cy="32" r="1.4" fill="#fff"/>
    <circle cx="26.5" cy="35.5" r="1" fill="#fff"/>
    <circle cx="24" cy="29" r="0.8" fill="#fff"/>
  </svg>`;
}
