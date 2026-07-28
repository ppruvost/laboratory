/**
 * tp-mecanique/js/tp05-pression-debit-resonance.js
 *
 * Contrôleur du TP05 « Pression, débit et résonance ».
 * Chargé par navigation.js juste après l'injection du fragment
 * tp-mecanique/modules/tp05-pression-debit-resonance.html dans
 * #content.
 *
 * navigation.js exécute module.init() après l'import : le point
 * d'entrée doit s'appeler init().
 */

import { $, arrondir, initSections, initTabs, initModesOperatoires } from '../../js/utils.js';
import { initContextePro } from '../../js/contexte-pro.js';
import FILIERES_PRO from '../../data/filieres.js';
import { initRadarCompetences } from '../../js/radar.js';
import { initImpressionCompteRendu } from './compte-rendu-mecanique.js';
import { initMateriel } from '../../js/materiel.js';
import laboratoryEquipment from '../../data/equipment.js';
import { dessinerGraphiqueLigne } from '../../js/graphique.js';
import { initOngletsParFiliere } from '../../js/onglets-filiere.js';

const G = 9.81; // N/kg

const CONTEXTES_PRO = {

  'tle-tci': {
    contexte: "Un vérin hydraulique de presse à chaudronner exploite la relation de Pascal pour démultiplier une force, tandis qu'un circuit de refroidissement transporte un fluide dont le débit doit être maîtrisé.",
    problematique: "Comment exploiter la relation de Pascal dans une presse hydraulique et caractériser le débit d'un fluide de refroidissement en circulation ?",
  },

  'tle-trpm': {
    contexte: "Une machine-outil peut être soumise à des vibrations lors de l'usinage ; un phénomène de résonance mal maîtrisé dégrade la précision et peut endommager l'outil ou la pièce.",
    problematique: "Comment caractériser la résonance mécanique d'une machine-outil pour éviter qu'elle ne se produise en cours d'usinage ?",
  },

  'tle-mcc': {
    contexte: "Un système d'aspiration ou de soufflage utilisé pour la manipulation de tissus légers repose sur un débit d'air maîtrisé, et certains supports vibrants doivent éviter tout phénomène de résonance.",
    problematique: "Comment caractériser le débit d'air d'un système d'aspiration et la résonance mécanique d'un support vibrant ?",
  },

};

const TRAINEE_INFO = {
  trainee: "La force de traînée s'oppose au déplacement relatif entre un objet et le fluide qui l'entoure : elle dissipe de l'énergie mécanique et croît avec la vitesse d'écoulement.",
  portance: "La force de portance est perpendiculaire à l'écoulement ; c'est elle qui permet à un profil d'aile de générer une force verticale suffisante pour qu'un avion puisse voler.",
  venturi: "L'effet Venturi correspond à une diminution de la pression du fluide dans les régions où sa vitesse d'écoulement augmente, par exemple dans un rétrécissement de canalisation.",
};

export function init() {

  initPressionFluide();
  initPresseHydraulique();
  initDebit();
  initResonancePeriode();
  initResonanceAmplitude();
  initTraineePortance();

  initMateriel({
    equipementId: 'materiel-equipements',
    equipment: laboratoryEquipment,
    categorie: 'PressionDebitResonance',
  });

  initContextePro({
    filieres: FILIERES_PRO,
    contextes: CONTEXTES_PRO,
  });

  // « Caractériser la pression dans un fluide immobile » : uniquement
  // TCI/TRPM en Tle. « Décrire le transport de masse et de volume »
  // (débit) et les « notions complémentaires » (résonance) : communes
  // à TCI/TRPM et MCC en Tle, mais MCC ne va pas jusqu'à la traînée,
  // la portance et l'effet Venturi.
  initOngletsParFiliere({
    mapping: {
      '2nde-remi': [],
      '2nde-mcc':  [],
      '1ere-tci':  [],
      '1ere-trpm': [],
      '1ere-mcc':  [],
      'tle-tci':   ['pression-fluide', 'debit', 'resonance', 'trainee-portance'],
      'tle-trpm':  ['pression-fluide', 'debit', 'resonance', 'trainee-portance'],
      'tle-mcc':   ['debit', 'resonance'],
    },
    messageId: 'tp05m-message-filiere',
    messageTexte: "Ce TP n'est pas au programme de votre filière à ce niveau : ces notions sont étudiées en Terminale, avec un contenu variable selon la spécialité.",
  });

  initSections();
  initTabs();
  initModesOperatoires();
  initRadarCompetences();

  initImpressionCompteRendu({
    titre: 'Pression, débit et résonance',
    tp: 'TP05',
  });
}

// =================================================================
// Onglet 1a — Relation de Pascal Δp = ρ × g × Δh
// =================================================================
function initPressionFluide() {

  const inputRho = $('pas-rho');
  const inputH = $('pas-h');
  const zoneResultat = $('pas-resultat');

  if (!inputRho || !inputH || !zoneResultat) return;

  function calculer() {

    const rho = parseFloat(inputRho.value);
    const h = parseFloat(inputH.value);

    if (Number.isNaN(rho) || Number.isNaN(h)) {
      zoneResultat.textContent = 'Saisir la masse volumique du fluide et la différence d\'altitude pour calculer la variation de pression.';
      return;
    }

    const dp = rho * G * h;

    zoneResultat.innerHTML = `
      Variation de pression Δp = ρ × g × Δh = <strong>${arrondir(dp, 0)} Pa</strong>
      (soit ${arrondir(dp / 1e5, 4)} bar)
    `;
  }

  inputRho.addEventListener('input', calculer);
  inputH.addEventListener('input', calculer);
}

// =================================================================
// Onglet 1b — Presse hydraulique F2 = F1 × (S2/S1)
// =================================================================
function initPresseHydraulique() {

  const inputS1 = $('presse-s1');
  const inputS2 = $('presse-s2');
  const inputF1 = $('presse-f1');
  const zoneResultat = $('presse-resultat');

  if (!inputS1 || !inputS2 || !inputF1 || !zoneResultat) return;

  function calculer() {

    const s1 = parseFloat(inputS1.value);
    const s2 = parseFloat(inputS2.value);
    const f1 = parseFloat(inputF1.value);

    if (Number.isNaN(s1) || Number.isNaN(s2) || Number.isNaN(f1) || s1 === 0) {
      zoneResultat.textContent = 'Saisir les surfaces des deux pistons et la force appliquée sur le petit piston pour calculer la force transmise au grand piston.';
      return;
    }

    const f2 = f1 * (s2 / s1);
    const rapport = s2 / s1;

    zoneResultat.innerHTML = `
      Rapport des surfaces S₂/S₁ = ${arrondir(rapport, 2)}<br>
      Force transmise F₂ = F₁ × (S₂/S₁) = <strong>${arrondir(f2, 1)} N</strong>
    `;
  }

  inputS1.addEventListener('input', calculer);
  inputS2.addEventListener('input', calculer);
  inputF1.addEventListener('input', calculer);
}

// =================================================================
// Onglet 2 — Débit Qv = V/t, vitesse v = Qv/S
// =================================================================
function initDebit() {

  const inputVolume = $('deb-volume');
  const inputDuree = $('deb-duree');
  const inputSection = $('deb-section');
  const zoneResultat = $('deb-resultat');

  if (!inputVolume || !inputDuree || !zoneResultat) return;

  function calculer() {

    const vL = parseFloat(inputVolume.value);
    const t = parseFloat(inputDuree.value);
    const sCm2 = parseFloat(inputSection.value);

    if (Number.isNaN(vL) || Number.isNaN(t) || t === 0) {
      zoneResultat.textContent = 'Saisir le volume écoulé, la durée d\'écoulement et la section de la canalisation pour calculer le débit et la vitesse moyenne d\'écoulement.';
      return;
    }

    const qvLs = vL / t;
    const qvM3s = (vL * 1e-3) / t;

    let vitesseLigne = '';

    if (!Number.isNaN(sCm2) && sCm2 > 0) {
      const sM2 = sCm2 * 1e-4;
      const v = qvM3s / sM2;
      vitesseLigne = `<br>Vitesse moyenne d'écoulement v = Qᵥ / S = <strong>${arrondir(v, 3)} m/s</strong>`;
    }

    zoneResultat.innerHTML = `
      Débit en volume Qᵥ = V / t = <strong>${arrondir(qvLs, 3)} L/s</strong>
      (soit ${arrondir(qvM3s, 6)} m³/s)${vitesseLigne}
    `;
  }

  inputVolume.addEventListener('input', calculer);
  inputDuree.addEventListener('input', calculer);
  if (inputSection) inputSection.addEventListener('input', calculer);
}

// =================================================================
// Onglet 3a — Période propre T = t/N, fréquence propre f = 1/T
// =================================================================
function initResonancePeriode() {

  const inputN = $('res-oscillations');
  const inputDuree = $('res-duree');
  const zoneResultat = $('res-resultat');

  if (!inputN || !inputDuree || !zoneResultat) return;

  function calculer() {

    const n = parseFloat(inputN.value);
    const t = parseFloat(inputDuree.value);

    if (Number.isNaN(n) || Number.isNaN(t) || n === 0) {
      zoneResultat.textContent = 'Saisir le nombre d\'oscillations comptées et la durée totale correspondante pour calculer la période propre et la fréquence propre du système.';
      return;
    }

    const periode = t / n;
    const frequence = periode > 0 ? 1 / periode : 0;

    zoneResultat.innerHTML = `
      Période propre T = t / N = <strong>${arrondir(periode, 3)} s</strong><br>
      Fréquence propre f = 1 / T = <strong>${arrondir(frequence, 2)} Hz</strong>
    `;
  }

  inputN.addEventListener('input', calculer);
  inputDuree.addEventListener('input', calculer);
}

// =================================================================
// Onglet 3b — Amplitude en fonction de la fréquence d'excitation
// =================================================================
function initResonanceAmplitude() {

  const btnAjouter = $('res-ajouter');
  const inputFreq = $('res-freq-exc');
  const inputAmplitude = $('res-amplitude');
  const tbody = $('tbody-resonance');

  if (!btnAjouter || !inputFreq || !inputAmplitude || !tbody) return;

  const points = [];

  btnAjouter.addEventListener('click', () => {

    const f = parseFloat(inputFreq.value);
    const a = parseFloat(inputAmplitude.value);

    if (Number.isNaN(f) || Number.isNaN(a)) return;

    points.push({ f, a });
    points.sort((p1, p2) => p1.f - p2.f);

    redessinerTableauResonance(tbody, points);

    dessinerGraphiqueLigne(
      'graphique-resonance',
      points.map(p => ({ x: p.f, y: p.a })),
      { xLabel: 'Fréquence d\'excitation (Hz)', yLabel: 'Amplitude (mm)' }
    );

    inputFreq.value = '';
    inputAmplitude.value = '';
    inputFreq.focus();
  });
}

function redessinerTableauResonance(tbody, points) {

  tbody.innerHTML = '';

  points.forEach((p, i) => {

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${arrondir(p.f, 2)} Hz</td>
      <td>${arrondir(p.a, 1)} mm</td>
    `;

    tbody.appendChild(tr);
  });
}

// =================================================================
// Onglet 4 — Traînée, portance, effet Venturi
// =================================================================
function initTraineePortance() {

  const select = $('trainee-select');
  const zoneInfo = $('trainee-info');

  if (!select || !zoneInfo) return;

  select.addEventListener('change', () => {

    const texte = TRAINEE_INFO[select.value];

    zoneInfo.textContent = texte
      || 'Sélectionner un phénomène pour afficher sa définition et un exemple d\'application.';
  });
}
