/**
 * tp-thermique/js/materiel-thermique.js
 *
 * Rend dynamiquement la section « Matériel nécessaire » de chaque TP
 * thermique à partir des catalogues partagés data/equipment.js et
 * data/glassware.js, plutôt que d'un contenu codé en dur. Chaque TP
 * fournit seulement la liste des NOMS d'objets qu'il utilise ; ce
 * module va chercher lieu/description dans le catalogue.
 *
 * Le HTML de chaque TP n'a plus qu'un conteneur vide :
 *   <div id="materiel-equipements"></div>
 * rempli ici avec les cases à cocher attendues par
 * js/compte-rendu.js (_recupererMaterielDepuisLaPage).
 */

import laboratoryEquipment from '../../data/equipment.js';
import glassware from '../../data/glassware.js';

function trouverEquipement(nom) {
  return laboratoryEquipment.find(e => e.nom === nom) || null;
}

function trouverVerrerie(nom) {
  return glassware.find(v => v.nom === nom) || null;
}

function rendreItem(nom, item) {

  if (!item) {
    // Objet pas encore présent dans le catalogue partagé : on
    // l'affiche quand même pour ne pas perdre d'information, avec
    // un signalement visuel plutôt qu'un plantage silencieux.
    return `
      <label class="item-materiel">
        <input type="checkbox" class="materiel-check-input" checked>
        ${nom} <em>(à ajouter au catalogue)</em>
      </label>`;
  }

  const lieu = item.lieu ? ` — ${item.lieu}` : '';

  return `
    <label class="item-materiel" title="${item.description || ''}">
      <input type="checkbox" class="materiel-check-input" checked>
      ${item.nom}${lieu}
    </label>`;
}

/**
 * @param {Object} params
 * @param {string[]} [params.equipements] - Noms exacts issus de data/equipment.js (domaine "Thermique")
 * @param {string[]} [params.verrerie]    - Noms exacts issus de data/glassware.js
 * @param {string}   [params.conteneurId]
 */
export function initMateriel({
  equipements = [],
  verrerie = [],
  conteneurId = 'materiel-equipements',
} = {}) {

  const conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;

  let html = '';

  if (verrerie.length) {
    html += `<h3>Verrerie</h3><div class="grille-materiel">`;
    html += verrerie.map(nom => rendreItem(nom, trouverVerrerie(nom))).join('');
    html += `</div>`;
  }

  if (verrerie.length && equipements.length) {
    html += `<hr>`;
  }

  if (equipements.length) {
    html += `<h3>Équipements</h3><div class="grille-materiel">`;
    html += equipements.map(nom => rendreItem(nom, trouverEquipement(nom))).join('');
    html += `</div>`;
  }

  conteneur.innerHTML = html;
}
