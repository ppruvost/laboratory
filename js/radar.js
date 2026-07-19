/**
 * js/radar.js
 * Module partagé : génère un radar SVG à 5 axes (APP, ANA, REA, VAL,
 * COM) à partir des boutons radio de la table d'auto-évaluation
 * (name="APP"|"ANA"|"REA"|"VAL"|"COM", valeurs 0/1/2), au clic sur
 * #btn-radar. Utilisable par n'importe quel TP, de n'importe quel
 * domaine (chimie, thermique, optique, mécanique, électricité,
 * acoustique...).
 *
 * Le SVG généré ne code AUCUNE couleur en dur : il s'appuie sur les
 * classes .radar-graduation / .radar-axe-ligne / .radar-axe-texte /
 * .radar-polygone, définies une fois avec une couleur par défaut dans
 * tp.css (cf. bloc CSS à ajouter, section "RADAR DE COMPÉTENCES"), et
 * recolorées si besoin dans le style.css de chaque domaine — sur le
 * même principe que .tp-header ou .btn-primaire.
 */

const COMPETENCES = ['APP', 'ANA', 'REA', 'VAL', 'COM'];

/**
 * Initialise le bouton de génération du radar.
 * @param {Object} params
 * @param {string} [params.boutonId]
 * @param {string} [params.resultatId]
 */
export function initRadarCompetences({
  boutonId = 'btn-radar',
  resultatId = 'radar-resultat',
} = {}) {

  const bouton = document.getElementById(boutonId);
  const zone = document.getElementById(resultatId);

  if (!bouton || !zone) return;

  bouton.addEventListener('click', () => {

    const valeurs = COMPETENCES.map(comp => {
      const coche = document.querySelector(`input[name="${comp}"]:checked`);
      return coche ? parseInt(coche.value, 10) : null;
    });

    if (valeurs.some(v => v === null)) {
      zone.innerHTML = '<div class="warning">Merci de renseigner votre niveau pour chacune des 5 compétences avant de générer le radar.</div>';
      return;
    }

    zone.innerHTML = construireRadarSVG(valeurs) + construireResume(valeurs);
  });
}

function construireResume(valeurs) {

  const total = valeurs.reduce((s, v) => s + v, 0);
  const max = COMPETENCES.length * 2;
  const detail = COMPETENCES.map((comp, i) => `${comp}&nbsp;: ${valeurs[i]}/2`).join(' — ');

  return `
    <p class="radar-resume" style="margin-top:.6rem;text-align:center;">
      <strong>Score global : ${total}/${max}</strong><br>
      <span style="font-size:.85rem;color:var(--gris-moyen,#666);">${detail}</span>
    </p>
  `;
}

function construireRadarSVG(valeurs) {

  const centre = 110;
  const rayonMax = 85;
  const n = COMPETENCES.length;

  const point = (i, valeur) => {
    const angle = (-Math.PI / 2) + (i * 2 * Math.PI / n);
    const r = (valeur / 2) * rayonMax;
    return [centre + r * Math.cos(angle), centre + r * Math.sin(angle)];
  };

  const polygonValeurs = valeurs
    .map((v, i) => point(i, v).join(','))
    .join(' ');

  const axes = COMPETENCES.map((comp, i) => {
    const [x, y] = point(i, 2);
    const [lx, ly] = point(i, 2.3);
    return `
      <line class="radar-axe-ligne" x1="${centre}" y1="${centre}" x2="${x}" y2="${y}" />
      <text class="radar-axe-texte" x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle">${comp}</text>
    `;
  }).join('');

  const graduations = [1, 2].map(niveau => {
    const pts = COMPETENCES.map((_, i) => point(i, niveau).join(',')).join(' ');
    return `<polygon class="radar-graduation" points="${pts}" />`;
  }).join('');

  return `
    <svg class="radar-svg" viewBox="0 0 220 220" width="220" height="220" style="display:block;margin:0 auto;">
      ${graduations}
      ${axes}
      <polygon class="radar-polygone" points="${polygonValeurs}" />
    </svg>
  `;
}
