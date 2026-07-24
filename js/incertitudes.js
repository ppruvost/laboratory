/**
 * js/incertitudes.js
 * Module partagé : outil « Mesures et incertitudes », domaine
 * transversal du référentiel Bac Pro (commun à tous les groupements
 * de spécialités, à intégrer au traitement des autres parties du
 * programme plutôt qu'enseigné à part).
 *
 * Fournit :
 *  - calculerMoyenne / calculerEcartType : traitement d'une série de
 *    mesures indépendantes.
 *  - arrondirResultat : exprime un résultat avec un nombre de
 *    chiffres significatifs cohérent avec son incertitude.
 *  - initSerieMesures : composant complet (saisie, tableau,
 *    histogramme, résultat) branchable sur n'importe quel TP/domaine.
 */

export function calculerMoyenne(valeurs) {
  if (!valeurs || !valeurs.length) return null;
  return valeurs.reduce((s, v) => s + v, 0) / valeurs.length;
}

// Écart-type expérimental (estimateur non biaisé, division par n-1)
export function calculerEcartType(valeurs) {
  if (!valeurs || valeurs.length < 2) return null;
  const m = calculerMoyenne(valeurs);
  const sommeCarres = valeurs.reduce((s, v) => s + (v - m) ** 2, 0);
  return Math.sqrt(sommeCarres / (valeurs.length - 1));
}

/**
 * Exprime un résultat (valeur ± incertitude) avec un nombre de
 * chiffres significatifs cohérent : l'incertitude est arrondie à 1
 * chiffre significatif, et la valeur arrondie à la même décimale.
 */
export function arrondirResultat(valeur, incertitude) {
  if (incertitude === null || Number.isNaN(incertitude) || incertitude === 0) {
    return { valeurTexte: String(valeur), incertitudeTexte: '—', decimales: 2 };
  }

  const exposant = Math.floor(Math.log10(Math.abs(incertitude)));
  const facteur = Math.pow(10, exposant);
  const incertitudeArrondie = Math.round(incertitude / facteur) * facteur;
  const decimales = Math.max(0, -exposant);

  return {
    valeurTexte: valeur.toFixed(decimales),
    incertitudeTexte: incertitudeArrondie.toFixed(decimales),
    decimales,
  };
}

function dessinerHistogramme(conteneurId, valeurs, options = {}) {

  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;

  const { unite = '', nClasses = 5, largeur = 420, hauteur = 200 } = options;

  if (valeurs.length < 2) {
    conteneur.innerHTML = '<p class="info">Ajouter au moins 2 mesures pour afficher l\'histogramme.</p>';
    return;
  }

  const min = Math.min(...valeurs);
  const max = Math.max(...valeurs);
  const etendue = max - min || 1;
  const largeurClasse = etendue / nClasses;

  const classes = Array.from({ length: nClasses }, (_, i) => ({
    debut: min + i * largeurClasse,
    fin: min + (i + 1) * largeurClasse,
    effectif: 0,
  }));

  valeurs.forEach(v => {
    let idx = Math.floor((v - min) / largeurClasse);
    if (idx >= nClasses) idx = nClasses - 1;
    if (idx < 0) idx = 0;
    classes[idx].effectif += 1;
  });

  const effectifMax = Math.max(...classes.map(c => c.effectif), 1);

  const marge = { haut: 14, bas: 34, gauche: 28, droite: 14 };
  const largeurUtile = largeur - marge.gauche - marge.droite;
  const hauteurUtile = hauteur - marge.haut - marge.bas;
  const largeurBarre = largeurUtile / nClasses;

  const barres = classes.map((c, i) => {
    const h = (c.effectif / effectifMax) * hauteurUtile;
    const x = marge.gauche + i * largeurBarre;
    const y = marge.haut + (hauteurUtile - h);
    return `
      <rect class="histogramme-barre" x="${x + 2}" y="${y}" width="${largeurBarre - 4}" height="${h}" />
      <text class="histogramme-effectif" x="${x + largeurBarre / 2}" y="${y - 4}" text-anchor="middle">${c.effectif}</text>
      <text class="histogramme-label" x="${x + largeurBarre / 2}" y="${hauteur - marge.bas + 14}" text-anchor="middle">${c.debut.toFixed(1)}</text>
    `;
  }).join('');

  conteneur.innerHTML = `
    <svg class="histogramme-svg" viewBox="0 0 ${largeur} ${hauteur}" width="100%" style="max-width:${largeur}px;display:block;margin:0 auto;">
      <line class="histogramme-axe" x1="${marge.gauche}" y1="${marge.haut}" x2="${marge.gauche}" y2="${hauteur - marge.bas}" />
      <line class="histogramme-axe" x1="${marge.gauche}" y1="${hauteur - marge.bas}" x2="${largeur - marge.droite}" y2="${hauteur - marge.bas}" />
      ${barres}
      <text class="histogramme-label" x="${largeur / 2}" y="${hauteur - 4}" text-anchor="middle">Mesure (${unite})</text>
    </svg>
  `;
}

/**
 * Composant complet : saisie d'une série de mesures indépendantes
 * d'une même grandeur, calcul de la moyenne et de l'écart-type,
 * histogramme, et résultat exprimé avec un nombre de chiffres
 * significatifs cohérent.
 *
 * @param {Object} params
 * @param {string} params.boutonId       - Bouton "+ Ajouter la mesure"
 * @param {string} params.inputId        - Champ de saisie de la mesure
 * @param {string} params.tbodyId        - Corps du tableau des mesures
 * @param {string} [params.resultatId]   - Zone d'affichage moyenne/écart-type/résultat
 * @param {string} [params.histogrammeId]- Conteneur de l'histogramme
 * @param {string} [params.unite]        - Unité affichée (ex. "°C")
 */
export function initSerieMesures({
  boutonId,
  inputId,
  tbodyId,
  resultatId,
  histogrammeId,
  unite = '',
}) {

  const bouton = document.getElementById(boutonId);
  const input = document.getElementById(inputId);
  const tbody = document.getElementById(tbodyId);
  const resultat = resultatId ? document.getElementById(resultatId) : null;

  if (!bouton || !input || !tbody) return;

  const valeurs = [];

  bouton.addEventListener('click', () => {

    const v = parseFloat(input.value);
    if (Number.isNaN(v)) return;

    valeurs.push(v);
    redessiner();

    input.value = '';
    input.focus();
  });

  function redessiner() {

    tbody.innerHTML = valeurs
      .map((v, i) => `<tr><td>${i + 1}</td><td>${v} ${unite}</td></tr>`)
      .join('');

    if (histogrammeId) {
      dessinerHistogramme(histogrammeId, valeurs, { unite });
    }

    if (!resultat) return;

    if (valeurs.length < 2) {
      resultat.textContent = 'Ajouter au moins deux mesures indépendantes pour calculer la moyenne et l\'écart-type.';
      return;
    }

    const moyenne = calculerMoyenne(valeurs);
    const ecartType = calculerEcartType(valeurs);
    const { valeurTexte, incertitudeTexte } = arrondirResultat(moyenne, ecartType);

    resultat.innerHTML = `
      Moyenne : ${moyenne.toFixed(3)} ${unite} — Écart-type : ${ecartType.toFixed(3)} ${unite}<br>
      <strong>Résultat exprimé : (${valeurTexte} ± ${incertitudeTexte}) ${unite}</strong>
    `;
  }
}
