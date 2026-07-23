/**
 * tp-thermique/js/tp05-transferts-thermiques.js
 *
 * Contrôleur du TP05 « Transferts thermiques et rayonnement ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-thermique/modules/tp05-transferts-thermiques.html dans #content.
 *
 * navigation.js exécute module.init() après l'import : le point
 * d'entrée doit s'appeler init().
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-thermique.js';
import { initMateriel } from './materiel-thermique.js';
import { dessinerGraphiqueLigne } from '../../js/graphique.js';

const CONTEXTES_PRO = {

  '1ere-tci': {
    contexte: "Lors d'une soudure, la chaleur se propage par conduction dans la pièce métallique, ce qui peut la déformer si l'on ne maîtrise pas l'apport thermique. Une caméra thermique permet de visualiser cette propagation et de repérer les zones les plus chaudes.",
    problematique: "Comment expliquer, à l'aide des trois modes de transfert thermique, la propagation de la chaleur dans une pièce soudée, et quel est l'intérêt d'un contrôle par caméra thermique ?",
  },

  '1ere-trpm': {
    contexte: "L'usinage d'une pièce échauffe fortement l'outil de coupe par frottement. Cette chaleur se propage par conduction dans l'outil et la pièce, tandis qu'un fluide de coupe assure un refroidissement par convection pour préserver la précision de l'usinage.",
    problematique: "Comment les trois modes de transfert thermique interviennent-ils dans l'échauffement et le refroidissement d'un outil de coupe lors de l'usinage ?",
  },

  '1ere-mcc': {
    contexte: "Un vêtement de protection thermique (contre le froid ou la chaleur) doit limiter les transferts thermiques entre le corps et l'extérieur. Le choix des matières et de leur agencement en couches joue directement sur la conduction et le rayonnement.",
    problematique: "Comment le choix des matériaux et leur agencement en couches permettent-ils de limiter les transferts thermiques dans un vêtement de protection ?",
  },

  'tle-tci': {
    contexte: "La couleur d'une pièce métallique chauffée à la forge ou en cours de soudage renseigne sur sa température, par le rayonnement thermique qu'elle émet. Réduire les pertes thermiques radiatives d'un atelier de chaudronnerie limite aussi sa consommation d'énergie et ses émissions de gaz à effet de serre.",
    problematique: "Comment le rayonnement thermique émis par une pièce métallique renseigne-t-il sur sa température, et en quoi limiter les pertes thermiques d'un atelier contribue-t-il à réduire son empreinte carbone ?",
  },

  'tle-trpm': {
    contexte: "Un atelier de production mécanique consomme une énergie importante pour chauffer, usiner ou traiter thermiquement les pièces. Une partie de cette énergie est perdue par rayonnement et conduction vers l'extérieur, ce qui accroît indirectement les émissions de gaz à effet de serre liées à la production d'électricité ou de gaz.",
    problematique: "En quoi la maîtrise des pertes thermiques d'un atelier de production contribue-t-elle à limiter son empreinte carbone ?",
  },

  'tle-mcc': {
    contexte: "La couleur et la matière d'un vêtement d'extérieur influencent l'absorption du rayonnement solaire, donc le confort thermique de la personne qui le porte. Ce même principe d'absorption du rayonnement infrarouge est à l'œuvre, à plus grande échelle, dans l'effet de serre atmosphérique.",
    problematique: "Comment le choix de la couleur et de la matière d'un vêtement influence-t-il l'absorption du rayonnement solaire, et quel est le lien avec le principe de l'effet de serre atmosphérique ?",
  },

};

const NOMS_MODES = {
  conduction: 'conduction',
  convection: 'convection',
  rayonnement: 'rayonnement',
};

const GES_INFO = {
  h2o: {
    nom: 'Vapeur d\'eau',
    origine: 'Essentiellement naturelle (cycle de l\'eau, évaporation des océans) ; le principal GES en quantité dans l\'atmosphère.',
  },
  co2: {
    nom: 'Dioxyde de carbone',
    origine: 'Naturelle (respiration, volcanisme) et très largement amplifiée par l\'activité humaine (combustion d\'hydrocarbures et de charbon, cf. TP04).',
  },
  ch4: {
    nom: 'Méthane',
    origine: 'Naturelle (zones humides) et liée à l\'activité humaine (élevage, décharges, exploitation de gaz naturel).',
  },
  n2o: {
    nom: 'Protoxyde d\'azote',
    origine: 'Naturelle (sols, océans) et liée à l\'activité humaine, notamment aux engrais azotés utilisés en agriculture.',
  },
};

export function init() {
  initQuizModes();
  initConduction();
  initRayonnement();
  initEffetDeSerre();

  initMateriel({
    equipements: [
      'Thermomètre numérique',
      'Chronomètre',
      'Caméra thermique',
      'Bec bunsen',
      'Lampe halogène / infrarouge sur support',
      'Matériaux isolants (laine de verre, polystyrène)',
      'Tiges de conduction thermique (métal, bois, plastique, verre)',
    ],
  });

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  initSections();
  initTabs();
  initModesOperatoires();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Transferts thermiques et rayonnement',
    tp: 'TP05',
  });
}

// =================================================================
// Onglet 1 — Quiz de reconnaissance des trois modes de transfert
// =================================================================
function initQuizModes() {

  document.querySelectorAll('.quiz-select').forEach(select => {

    select.addEventListener('change', () => {

      const bloc = select.closest('.quiz-situation');
      const feedback = bloc?.querySelector('.quiz-feedback');

      if (!bloc || !feedback) return;

      const bonneReponse = bloc.dataset.reponse;

      if (!select.value) {
        feedback.textContent = '';
        feedback.className = 'quiz-feedback';
        return;
      }

      if (select.value === bonneReponse) {
        feedback.textContent = '✔ Correct';
        feedback.className = 'quiz-feedback quiz-correct';
      } else {
        feedback.textContent = `✘ Réponse attendue : ${NOMS_MODES[bonneReponse]}`;
        feedback.className = 'quiz-feedback quiz-incorrect';
      }
    });
  });
}

// =================================================================
// Onglet 2 — Conduction : classement des matériaux à partir des
// temps de chute de bille (le plus rapide = meilleur conducteur)
// =================================================================
function initConduction() {

  const btnClasser = $('cond-classer');
  const zoneClassement = $('cond-classement');

  if (!btnClasser || !zoneClassement) return;

  const materiaux = [
    { id: 'cond-temps-metal', nom: 'Métal' },
    { id: 'cond-temps-bois', nom: 'Bois' },
    { id: 'cond-temps-plastique', nom: 'Plastique' },
    { id: 'cond-temps-verre', nom: 'Verre' },
  ];

  btnClasser.addEventListener('click', () => {

    const resultats = materiaux
      .map(m => ({ nom: m.nom, temps: parseFloat($(m.id)?.value) }))
      .filter(r => !Number.isNaN(r.temps));

    if (resultats.length < 2) {
      zoneClassement.textContent = 'Saisir le temps mesuré pour au moins deux matériaux.';
      return;
    }

    resultats.sort((a, b) => a.temps - b.temps);

    const liste = resultats
      .map((r, i) => `${i + 1}. ${r.nom} — ${arrondir(r.temps, 0)} s`)
      .join('<br>');

    zoneClassement.innerHTML = `
      <strong>Classement du meilleur au moins bon conducteur thermique :</strong><br>
      ${liste}<br><br>
      Le matériau où la bille tombe le plus vite (<strong>${resultats[0].nom}</strong>)
      est le meilleur conducteur ; celui où elle tombe le plus lentement
      (<strong>${resultats[resultats.length - 1].nom}</strong>) est le
      meilleur isolant parmi les matériaux testés.
    `;
  });
}

// =================================================================
// Onglet 3 — Rayonnement : suivi temporel (régression linéaire) et
// comparaison d'absorption noir / blanc
// =================================================================
function initRayonnement() {

  const btnAjouter = $('ray-ajouter');
  const inputTemps = $('ray-temps');
  const inputTemp = $('ray-temp');
  const tbody = $('tbody-rayonnement');
  const zoneModelisation = $('ray-modelisation');

  if (btnAjouter && tbody) {

    const points = [];

    btnAjouter.addEventListener('click', () => {

      const t = parseFloat(inputTemps.value);
      const temp = parseFloat(inputTemp.value);

      if (Number.isNaN(t) || Number.isNaN(temp)) return;

      points.push({ t, temp });
      points.sort((a, b) => a.t - b.t);

      redessinerTableauRayonnement(tbody, points);
      mettreAJourModelisation(zoneModelisation, points);

      dessinerGraphiqueLigne(
        'graphique-rayonnement',
        points.map(p => ({ x: p.t, y: p.temp })),
        { xLabel: 'Temps (s)', yLabel: 'Température (°C)' }
      );

      inputTemps.value = '';
      inputTemp.value = '';
      inputTemps.focus();
    });
  }

  const inputNoir = $('ray-temp-noir');
  const inputBlanc = $('ray-temp-blanc');
  const outputEcart = $('ray-ecart-couleur');

  if (inputNoir && inputBlanc && outputEcart) {

    function calculerEcart() {

      const tNoir = parseFloat(inputNoir.value);
      const tBlanc = parseFloat(inputBlanc.value);

      if (Number.isNaN(tNoir) || Number.isNaN(tBlanc)) {
        outputEcart.textContent = '—';
        return;
      }

      const ecart = tNoir - tBlanc;
      const signe = ecart >= 0 ? '+' : '';

      outputEcart.textContent = `${signe}${arrondir(ecart, 1)} °C`;
    }

    inputNoir.addEventListener('input', calculerEcart);
    inputBlanc.addEventListener('input', calculerEcart);
  }
}

function redessinerTableauRayonnement(tbody, points) {

  tbody.innerHTML = '';

  points.forEach((pt, i) => {

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${arrondir(pt.t, 0)} s</td>
      <td>${arrondir(pt.temp, 1)} °C</td>
    `;

    tbody.appendChild(tr);
  });
}

// Régression linéaire (moindres carrés) : renvoie {a, b}
function regressionLineaire(points) {

  const n = points.length;

  if (n < 2) return null;

  const sommeT = points.reduce((s, p) => s + p.t, 0);
  const sommeTemp = points.reduce((s, p) => s + p.temp, 0);
  const sommeTT = points.reduce((s, p) => s + p.t * p.t, 0);
  const sommeTTemp = points.reduce((s, p) => s + p.t * p.temp, 0);

  const denominateur = n * sommeTT - sommeT * sommeT;

  if (denominateur === 0) return null;

  const a = (n * sommeTTemp - sommeT * sommeTemp) / denominateur;
  const b = (sommeTemp - a * sommeT) / n;

  return { a, b };
}

function mettreAJourModelisation(zone, points) {

  if (!zone) return;

  const modele = regressionLineaire(points);

  if (!modele) {
    zone.textContent = 'Ajouter au moins deux points pour estimer la vitesse d\'échauffement (coefficient directeur a de la fonction affine θ(t) = a×t + b).';
    return;
  }

  const signe = modele.b >= 0 ? '+' : '-';

  zone.innerHTML = `
    Modélisation affine estimée :
    <strong>θ(t) = ${arrondir(modele.a, 4)} × t ${signe} ${arrondir(Math.abs(modele.b), 2)}</strong><br>
    Vitesse d'échauffement a = ${arrondir(modele.a, 4)} °C/s.
  `;
}

// =================================================================
// Onglet 4 — Effet de serre : information sur le gaz sélectionné
// =================================================================
function initEffetDeSerre() {

  const select = $('ges-select');
  const zoneInfo = $('ges-info');

  if (!select || !zoneInfo) return;

  select.addEventListener('change', () => {

    const info = GES_INFO[select.value];

    if (!info) {
      zoneInfo.textContent = 'Sélectionner un gaz pour afficher son origine principale.';
      return;
    }

    zoneInfo.innerHTML = `
      <strong>${info.nom}</strong><br>
      Origine principale : ${info.origine}
    `;
  });
}
