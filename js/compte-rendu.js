const GLOBAL_CSS_HREF = new URL('../css/global.css', import.meta.url).href;
const RESET_CSS_HREF  = new URL('../css/reset.css', import.meta.url).href;
const CSS_HREF         = new URL('../css/compte-rendu.css', import.meta.url).href;
const CLE_IDENTITE = 'scilab-identite-eleve';

let _cssChargee = false;
let _config = null;
let _groupesSelectionnes = null;   // Set des ids de groupes à inclure

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

  // Étape 1 : dialogue de sélection des parties (si config.groupes défini)
  if (config.groupes && config.groupes.length) {
    _ouvrirDialogGroupes();
  } else {
    _groupesSelectionnes = null;
    _ouvrirModalIdentification();
  }
}

// ══════════════════════════════════════════════════════════════
// CSS — chargé une seule fois quel que soit le TP appelant
// (nécessaire pour les DEUX modales, qui vivent dans la page principale)
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
// ÉTAPE 1 — DIALOGUE DE SÉLECTION DES PARTIES
// ══════════════════════════════════════════════════════════════
function _ouvrirDialogGroupes() {
  document.getElementById('cr-dialog-groupes')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'cr-dialog-groupes';
  overlay.className = 'cr-modal-overlay-base';

  const cases = _config.groupes.map(g => `
    <label class="cr-groupe-ligne">
      <input type="checkbox" id="cr-grp-${g.id}" ${g.defaut !== false ? 'checked' : ''}>
      <span>${_echapper(g.label)}</span>
      ${g.niveau ? `<span class="cr-niveau-badge">${_echapper(g.niveau)}</span>` : ''}
    </label>`).join('');

  overlay.innerHTML = `
    <div class="cr-modal-box">
      <h2>Parties à imprimer</h2>
      <p class="cr-soustitre">Sélectionner les parties à inclure dans le compte-rendu.</p>
      <div class="cr-groupes-liste">${cases}</div>
      <div class="cr-modal-actions">
        <button id="cr-grp-annuler" type="button">Annuler</button>
        <button id="cr-grp-suivant" type="button">Suivant →</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  document.getElementById('cr-grp-annuler').addEventListener('click', () => overlay.remove());

  document.getElementById('cr-grp-suivant').addEventListener('click', () => {
    _groupesSelectionnes = new Set(
      _config.groupes
        .filter(g => document.getElementById(`cr-grp-${g.id}`)?.checked)
        .map(g => g.id)
    );
    overlay.remove();
    _ouvrirModalIdentification();
  });
}

// ══════════════════════════════════════════════════════════════
// ÉTAPE 2 — MODALE D'IDENTIFICATION
// ══════════════════════════════════════════════════════════════
function _identitePrecedente() {
  try { return JSON.parse(localStorage.getItem(CLE_IDENTITE)) || {}; }
  catch { return {}; }
}

function _ouvrirModalIdentification() {
  document.getElementById('cr-modal-overlay')?.remove();

  const precedent = _identitePrecedente();
  const defaut    = _config.identiteDefaut || {};
  const aujourdHui = new Date().toISOString().slice(0, 10);

  const val     = c => _echapper(defaut[c] || precedent[c] || '');
  const valDate = () => { const d = defaut.date || precedent.date; return d && _dateValide(d) ? d : aujourdHui; };

  const overlay = document.createElement('div');
  overlay.id = 'cr-modal-overlay';
  overlay.className = 'cr-modal-overlay-base';
  overlay.innerHTML = `
    <div class="cr-modal-box">
      <h2>Identification — ${_echapper(_config.titre)}</h2>
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
        <button id="cr-btn-generer" type="button">Générer le PDF</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  document.getElementById('cr-btn-annuler').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  document.getElementById('cr-btn-generer').addEventListener('click', () => {
    const identite = {
      nom:    document.getElementById('cr-nom').value.trim(),
      prenom: document.getElementById('cr-prenom').value.trim(),
      classe: document.getElementById('cr-classe').value.trim(),
      date:   document.getElementById('cr-date').value,
    };
    let ok = true;
    [['nom', identite.nom], ['prenom', identite.prenom], ['classe', identite.classe]].forEach(([c, v]) => {
      const err = document.getElementById(`err-${c}`);
      if (!v) { err.style.display = 'block'; ok = false; } else { err.style.display = 'none'; }
    });
    if (!ok) return;
    localStorage.setItem(CLE_IDENTITE, JSON.stringify(identite));
    overlay.remove();
    _construireEtImprimer(identite);
  });
}

// ══════════════════════════════════════════════════════════════
// ÉTAPE 3 — CONSTRUCTION DE LA TRAME (HTML sous forme de chaîne)
// ══════════════════════════════════════════════════════════════
function _construireTrameHTML(identite) {
  const dateFr = identite.date
    ? new Date(identite.date + 'T00:00:00').toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : '—';

  // Filtrage des sections
  const sections = (_config.sections || []).filter(s => {
    if (!s.groupe) return true;
    if (!_groupesSelectionnes) return true;
    return _groupesSelectionnes.has(s.groupe);
  });

  // Matériel (sélectionné par l'élève dans la page TP)
  const materielHTML = _recupererMaterielDepuisLaPage();

  // Sections
  const sectionsHTML = sections.map(_rendreSection).join('');

  // Graphique (canvas → image)
  const graphiqueHTML = _config.canvas
    ? `<div class="cr-section">
         <h3>Graphique</h3>
         <img class="cr-graphique"
              src="${_config.canvas.toDataURL('image/png')}"
              alt="Graphique du TP">
       </div>`
    : '';

  // Auto-évaluation (version PDF)
  const autoEvalHTML = _construireAutoEvaluation();

  // Barème / note finale
  const nbQuestions = sections.filter(s => s.notation).length;
  const totalPts = nbQuestions * 2;

  const noteFinaleHTML = (_config.noteFinale && nbQuestions > 0)
    ? `
    <div class="cr-note-finale">
      <div class="cr-note-grille">
        <div class="cr-note-bareme">
          <span class="cr-note-label">Barème</span>
          <span class="cr-note-val">${nbQuestions} questions sur ${totalPts} pts</span>
        </div>

        <div class="cr-note-case">
          <span class="cr-note-label">Total</span>
          <span class="cr-note-blanc">......</span>
        </div>

        <div class="cr-note-case cr-note-grande">
          <span class="cr-note-label">NOTE</span>
          <span class="cr-note-blanc cr-note-grande-val">/ 20</span>
        </div>
      </div>
    </div>`
    : '';

  return `
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

    <span class="cr-domaine-badge">
      ${_echapper(_config.domaine || 'Sciences')} — ${_echapper(_config.tp || '')}
    </span>

    <div class="cr-titre-tp">${_echapper(_config.titre)}</div>

    <div class="cr-identification">
      <div><div class="cr-label">Nom</div><div class="cr-valeur">${_echapper(identite.nom)}</div></div>
      <div><div class="cr-label">Prénom</div><div class="cr-valeur">${_echapper(identite.prenom)}</div></div>
      <div><div class="cr-label">Classe</div><div class="cr-valeur">${_echapper(identite.classe)}</div></div>
      <div><div class="cr-label">Date du TP</div><div class="cr-valeur">${dateFr}</div></div>
    </div>

    ${materielHTML}
    ${sectionsHTML}
    ${graphiqueHTML}
    ${autoEvalHTML}
    ${noteFinaleHTML}

    <div class="cr-pied">
      <span>SciLab — Travaux pratiques</span>
      <span>${_echapper(_config.tp || '')} · ${_echapper(_config.domaine || '')}</span>
    </div>
  `;
}

function _construireAutoEvaluation() {
  const lignes = document.querySelectorAll('[data-type="auto-evaluation"] tbody tr');
  if (!lignes.length) return '';

  let html = `
    <div class="cr-auto-eval">
      <h3>Auto-évaluation des compétences</h3>

      <table class="cr-auto-eval-table">
        <thead>
          <tr>
            <th>Domaine</th>
            <th>Sigle</th>
            <th>Compétence</th>
            <th>0</th>
            <th>1</th>
            <th>2</th>
          </tr>
        </thead>
        <tbody>
  `;

  lignes.forEach(tr => {
    const comp = tr.dataset.comp;
    const checked = document.querySelector(`input[name="${comp}"]:checked`);
    const value = checked ? checked.value : null;
    const cell = v => (v === value ? '✔' : '');

    const tds = tr.querySelectorAll('td');

    html += `
      <tr>
        <td>${tds[0].innerText}</td>
        <td>${tds[1].innerText}</td>
        <td>${tds[2].innerText}</td>
        <td class="score">${cell('0')}</td>
        <td class="score">${cell('1')}</td>
        <td class="score">${cell('2')}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  return html;
}

// ══════════════════════════════════════════════════════════════
// ÉTAPE 4 — IMPRESSION VIA IFRAME ISOLÉ
//
// Pourquoi un iframe et pas un simple `document.body.classList.add(...)` ?
// Sur mobile (iOS Safari, Chrome Android), la bascule de classe + @media
// print sur la page principale est peu fiable : l'évènement "afterprint"
// ne se déclenche pas toujours, et le moteur de rendu peut imprimer un
// instantané de la page avant que les styles ne soient appliqués — d'où
// des PDF contenant TOUTE la page web au lieu du seul compte-rendu.
//
// En construisant le compte-rendu dans un iframe jetable qui ne contient
// QUE ce contenu (+ ses propres feuilles de style), il n'y a plus rien à
// masquer : impossible que la page hôte se retrouve dans le PDF.
// ══════════════════════════════════════════════════════════════
function _construireEtImprimer(identite) {
  const contenuHTML = _construireTrameHTML(identite);

  const docHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>${_echapper(_config.titre)}</title>
<link rel="stylesheet" href="${GLOBAL_CSS_HREF}">
<link rel="stylesheet" href="${RESET_CSS_HREF}">
<link rel="stylesheet" href="${CSS_HREF}">
</head>
<body class="cr-printing">
<div id="cr-print-container">${contenuHTML}</div>
</body>
</html>`;

  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.setAttribute('title', 'Impression du compte-rendu');
  // IMPORTANT : ne JAMAIS combiner une taille 0×0 avec visibility:hidden ou
  // display:none sur cet iframe. Ces navigateurs (notamment Chrome/Chromium)
  // excluent purement et simplement un iframe ainsi masqué du pipeline de
  // rendu — y compris lors de l'appel à contentWindow.print() — ce qui
  // produit un PDF entièrement blanc, quel que soit le contenu injecté.
  // L'iframe doit rester "rendable" : on le positionne hors écran avec de
  // vraies dimensions (format A4) plutôt que de le masquer.
  Object.assign(iframe.style, {
    position: 'fixed',
    top: '0',
    left: '-10000px',
    width: '210mm',
    height: '297mm',
    border: '0',
  });

  let dejaImprime = false;
  const declencherImpression = () => {
    if (dejaImprime) return;
    dejaImprime = true;

    const fenetre = iframe.contentWindow;
    if (!fenetre) return;

    // Double requestAnimationFrame : laisse le temps au moteur de rendu
    // mobile de terminer la mise en page avant d'ouvrir la boîte
    // d'impression. Un simple setTimeout court est insuffisant sur
    // certains iOS/Android — c'est la cause la plus fréquente du bug
    // "le PDF contient toute la page".
    requestAnimationFrame(() => requestAnimationFrame(() => {
      try {
        fenetre.focus();
        fenetre.print();
      } catch (e) {
        console.error('SciLab — impression du compte-rendu impossible :', e);
      }
    }));
  };

  let dejaRetire = false;
  const retirerIframe = () => {
    if (dejaRetire) return;
    dejaRetire = true;
    setTimeout(() => iframe.remove(), 1000);
  };

  // ────────────────────────────────────────────────────────────
  // BRANCHEMENT RÉEL DE L'IFRAME
  // (c'est cette partie qui manquait entièrement : sans elle,
  //  l'iframe n'était jamais rempli ni inséré dans le DOM,
  //  d'où les PDF vides / l'impression qui ne se déclenchait pas)
  // ────────────────────────────────────────────────────────────

  iframe.addEventListener('load', () => {

    declencherImpression();

    try {
      iframe.contentWindow.addEventListener('afterprint', retirerIframe);
    } catch (e) {
      // certains navigateurs mobiles ne déclenchent jamais afterprint
    }

    // filet de sécurité : on retire l'iframe après 60s
    // même si afterprint ne s'est jamais déclenché
    setTimeout(retirerIframe, 60000);

  });

  document.body.appendChild(iframe);

  // srcdoc déclenche l'évènement 'load' une fois le document chargé
  iframe.srcdoc = docHTML;

}


// ══════════════════════════════════════════════════════════════
// Matériel sélectionné par l'élève
// ══════════════════════════════════════════════════════════════
function _recupererMaterielDepuisLaPage() {
  const groupes = [
    { titre: 'Verrerie', id: 'materiel-verrerie' },
    { titre: 'Équipements', id: 'materiel-equipements' }
  ];

  let contenu = '';

  for (const groupe of groupes) {
    const bloc = document.getElementById(groupe.id);
    if (!bloc) continue;

    const elements = [...bloc.querySelectorAll('input[type="checkbox"]:checked')]
      .map(c =>
        c.closest('label')?.textContent.trim() ||
        c.parentElement?.textContent.trim() ||
        c.value
      )
      .filter(Boolean);

    if (!elements.length) continue;

    contenu += `
      <h4>${groupe.titre}</h4>
      <ul class="cr-materiel">
        ${elements.map(e => `<li>${_echapper(e)}</li>`).join('')}
      </ul>
    `;
  }

  if (!contenu) return '';

  return `
    <div class="cr-section">
      <h3>Matériel nécessaire</h3>
      ${contenu}
    </div>
  `;
}

// ══════════════════════════════════════════════════════════════
// RENDU D'UNE SECTION
// Types : items (tableau), texte+competence+notation, texte libre
// ══════════════════════════════════════════════════════════════

// Couleurs des compétences Bac Pro
const COMP_COULEURS = {
  'APP':     { bg: '#EAF2F8', txt: '#0D4F8A', bord: '#1B6CA8' },
  'REA':     { bg: '#E8F5E9', txt: '#1B5E20', bord: '#388E3C' },
  'ANA':     { bg: '#FFF3E0', txt: '#E65100', bord: '#F57C00' },
  'RAI':     { bg: '#FFF3E0', txt: '#E65100', bord: '#F57C00' },
  'ANA RAI': { bg: '#FFF3E0', txt: '#E65100', bord: '#F57C00' },
  'VAL':     { bg: '#F3E5F5', txt: '#6A1B9A', bord: '#8E24AA' },
  'COM':     { bg: '#FCE4EC', txt: '#880E4F', bord: '#C2185B' },
};

function _badgeCompetence(comp) {
  if (!comp) return '';
  const c = COMP_COULEURS[comp.toUpperCase()] || { bg: '#f1f5f9', txt: '#475569', bord: '#94a3b8' };
  return `<span class="cr-comp-badge" style="background:${c.bg};color:${c.txt};border-color:${c.bord};">${_echapper(comp)}</span>`;
}

function _boxesNotation() {
  return `<div class="cr-notation">
    <span class="cr-notation-label">Note</span>
    <span class="cr-case"></span>
    <span class="cr-case"></span>
    <span class="cr-case"></span>
  </div>`;
}

function _rendreSection(section) {
  // ── Tableau de résultats (items) ──
  if (section.items && section.items.length) {
    const lignes = section.items
      .map(it => `<tr><td>${_echapper(it.label)}</td><td><strong>${_echapper(String(it.valeur))}</strong></td></tr>`)
      .join('');
    return `
      <div class="cr-section">
        <h3>${_echapper(section.titre)}</h3>
        <table class="cr-items"><tbody>${lignes}</tbody></table>
      </div>`;
  }

  // ── Question avec compétence + notation 0/1/2 ──
  if (section.notation) {
    const reponse = (section.texte || '').trim();
    const lignesReponse = reponse
      ? reponse.split('\n').map(l => `<div>${_echapper(l)}</div>`).join('')
      : `<div class="cr-vide">(pas de réponse saisie)</div>`;

    const nbLignes = Math.max(3, (reponse.match(/\n/g) || []).length + 2);
    const hauteur  = Math.min(nbLignes * 5, 50); // en mm, max 50mm

    return `
      <div class="cr-section cr-section-question">
        <div class="cr-question-entete">
          <h3 class="cr-question-titre">${_echapper(section.titre)}</h3>
          <div class="cr-question-droite">
            ${_badgeCompetence(section.competence)}
            ${_boxesNotation()}
          </div>
        </div>
        <div class="cr-reponse-zone" style="min-height:${hauteur}mm;">
          ${lignesReponse}
        </div>
      </div>`;
  }

  // ── Texte libre ──
  if (section.texte !== undefined) {
    const reponse = (section.texte || '').trim();
    return `
      <div class="cr-section">
        <h3>${_echapper(section.titre)}</h3>
        <div class="cr-texte-libre">${reponse ? _echapper(reponse) : '<span class="cr-vide">(pas de réponse)</span>'}</div>
      </div>`;
  }

  return '';
}

// ══════════════════════════════════════════════════════════════
// UTILITAIRES
// ══════════════════════════════════════════════════════════════
function _dateValide(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s); }

function _echapper(s) {
  const d = document.createElement('div');
  d.textContent = String(s ?? '');
  return d.innerHTML;
}

function _logoSVG() {
  return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6h10v9.5l8.5 16.4c1.6 3.1-.6 6.8-4.1 6.8H14.6c-3.5 0-5.7-3.7-4.1-6.8L19 15.5V6z"
          fill="#1B6CA8" stroke="#0D4F8A" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M16.5 27h15" stroke="#fff" stroke-width="1.6"/>
    <rect x="17.5" y="4.5" width="13" height="3" rx="1.2" fill="#0D4F8A"/>
    <circle cx="22" cy="32" r="1.4" fill="#fff"/>
    <circle cx="26.5" cy="35.5" r="1" fill="#fff"/>
    <circle cx="24" cy="29" r="0.8" fill="#fff"/>
  </svg>`;
}
