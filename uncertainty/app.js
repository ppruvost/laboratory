/**
 * uncertainty/app.js
 * Page autonome « Mesures et incertitudes », généralisée à toute
 * grandeur et tout domaine — remplace l'ancienne version spécifique
 * à l'électricité (modules/calculs.js, analyse_erreurs.js,
 * histogramme.js, rapport.js) par les modules partagés SciLab.
 *
 * ⚠️ Suppose que uncertainty/ est un sous-dossier du même site que
 * tp-chimie/, tp-thermique/, css/, js/, data/ (chemins relatifs
 * "../css/...", "../js/..."). Si ce projet est en réalité hébergé
 * comme un dépôt séparé (cf. le lien vers ppruvost.github.io/Uncertainty/
 * dans index.html à la racine), ces chemins devront être adaptés en
 * conséquence.
 */

import { initSections } from '../js/utils.js';
import { initSerieMesures, initIncertitudeInstrumentale } from '../js/incertitudes.js';
import { genererCompteRendu } from '../js/compte-rendu.js';

initSections();

function grandeur() {
  return document.getElementById('nom-grandeur')?.value.trim() || 'Grandeur mesurée';
}

function unite() {
  return document.getElementById('unite-grandeur')?.value.trim() || '';
}

initSerieMesures({
  boutonId: 'mesure-ajouter',
  inputId: 'mesure-valeur',
  tbodyId: 'tbody-mesures',
  resultatId: 'resultat-mesures',
  analyseId: 'analyse-mesures',
  histogrammeId: 'histogramme-mesures',
  unite: unite(),
});

initIncertitudeInstrumentale({
  inputValeurId: 'instr-valeur',
  inputPrecisionId: 'instr-precision',
  resultatId: 'resultat-instrumentale',
  unite: unite(),
});

// ── Compte rendu ────────────────────────────────────────────────
document.getElementById('btn-imprimer')?.addEventListener('click', () => {

  const lignesMesures = [...document.querySelectorAll('#tbody-mesures tr')]
    .map((tr, i) => ({
      label: `Essai ${i + 1}`,
      valeur: tr.children[1]?.textContent || '',
    }));

  const resume = document.getElementById('resume-tp')?.value || '';

  const sections = [];

  if (lignesMesures.length) {
    sections.push({
      titre: `Série de mesures — ${grandeur()}`,
      items: lignesMesures,
    });
  }

  const valeurInstr = document.getElementById('instr-valeur')?.value;
  const precisionInstr = document.getElementById('instr-precision')?.value;

  if (valeurInstr && precisionInstr) {
    sections.push({
      titre: 'Incertitude instrumentale',
      items: [
        { label: 'Valeur mesurée', valeur: `${valeurInstr} ${unite()}` },
        { label: 'Précision constructeur', valeur: `± ${precisionInstr} ${unite()}` },
      ],
    });
  }

  if (resume) {
    sections.push({ titre: 'Résumé', texte: resume });
  }

  genererCompteRendu({
    titre: `Mesures et incertitudes — ${grandeur()}`,
    domaine: 'Transversal',
    tp: 'Incertitudes',
    sections,
    noteFinale: false,
  });
});
