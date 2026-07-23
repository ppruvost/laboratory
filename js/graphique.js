/**
 * js/graphique.js
 * Module partagé : trace un graphique ligne + points en SVG à partir
 * d'une liste de points {x, y}, sans dépendance externe. Utilisable
 * par n'importe quel TP, de n'importe quel domaine.
 *
 * Comme radar.js, le SVG ne code AUCUNE couleur en dur : il pose les
 * classes .graphique-axe / .graphique-courbe / .graphique-point /
 * .graphique-label, à styler dans tp.css (défaut) et à recolorer si
 * besoin dans le style.css de chaque domaine.
 */

export function dessinerGraphiqueLigne(conteneurId, points, options = {}) {

  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;

  const {
    xLabel = 'x',
    yLabel = 'y',
    largeur = 480,
    hauteur = 260,
    minPoints = 2,
  } = options;

  if (!points || points.length < minPoints) {
    conteneur.innerHTML = `<p class="info">Ajouter au moins ${minPoints} points pour afficher le graphique.</p>`;
    return;
  }

  const marge = { haut: 16, droite: 16, bas: 34, gauche: 46 };
  const largeurUtile = largeur - marge.gauche - marge.droite;
  const hauteurUtile = hauteur - marge.haut - marge.bas;

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.min(...ys), yMax = Math.max(...ys);

  const xEchelle = x => marge.gauche + (xMax === xMin
    ? largeurUtile / 2
    : (x - xMin) / (xMax - xMin) * largeurUtile);

  const yEchelle = y => marge.haut + hauteurUtile - (yMax === yMin
    ? hauteurUtile / 2
    : (y - yMin) / (yMax - yMin) * hauteurUtile);

  const chemin = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xEchelle(p.x).toFixed(1)} ${yEchelle(p.y).toFixed(1)}`)
    .join(' ');

  const cercles = points
    .map(p => `<circle class="graphique-point" cx="${xEchelle(p.x).toFixed(1)}" cy="${yEchelle(p.y).toFixed(1)}" r="4" />`)
    .join('');

  conteneur.innerHTML = `
    <svg class="graphique-svg" viewBox="0 0 ${largeur} ${hauteur}" width="100%" style="max-width:${largeur}px;display:block;margin:0 auto;">
      <line class="graphique-axe" x1="${marge.gauche}" y1="${marge.haut}" x2="${marge.gauche}" y2="${hauteur - marge.bas}" />
      <line class="graphique-axe" x1="${marge.gauche}" y1="${hauteur - marge.bas}" x2="${largeur - marge.droite}" y2="${hauteur - marge.bas}" />
      <path class="graphique-courbe" d="${chemin}" fill="none" />
      ${cercles}
      <text class="graphique-label" x="${largeur / 2}" y="${hauteur - 6}" text-anchor="middle">${xLabel}</text>
      <text class="graphique-label" x="12" y="${hauteur / 2}" text-anchor="middle" transform="rotate(-90 12 ${hauteur / 2})">${yLabel}</text>
    </svg>
  `;
}
