/**
 * js/onglets-filiere.js
 * Module partagé : certains TP couvrent des capacités différentes
 * selon la filière ET le niveau de l'élève (ex. thermique TP05 :
 * TCI/TRPM voient "3 modes" en 1ère puis "rayonnement/GES" en Tle,
 * MCC voit tout en Tle et rien en 1ère). Ce module affiche/masque les
 * onglets de manipulation en fonction de la sélection faite dans le
 * menu déroulant "Contexte professionnel" (js/contexte-pro.js), dont
 * la valeur encode déjà "<niveau>-<idFiliere>" (ex. "1ere-tci").
 *
 * Générique : utilisable par n'importe quel TP, de n'importe quel
 * domaine (chimie, thermique, optique, mécanique, acoustique,
 * électricité), tant que ses onglets suivent la convention
 * .tabs-header .tab-btn[data-tab="..."] / .tab-panel#... de tp.css.
 */

/**
 * @param {Object} params
 * @param {Object} params.mapping
 *   Dictionnaire { "<niveau>-<idFiliere>": ["idOnglet1", "idOnglet2", ...] }.
 *   - Clé absente du dictionnaire → tous les onglets restent visibles
 *     (aucune restriction connue pour cette combinaison).
 *   - Valeur = tableau vide [] → ce TP n'est pas au programme de cette
 *     filière à ce niveau : tous les onglets sont masqués et un
 *     message est affiché à la place.
 * @param {string} [params.selectId]
 * @param {string} [params.messageId] - Conteneur du message "hors programme"
 * @param {string} [params.messageTexte]
 */
export function initOngletsParFiliere({
  mapping = {},
  selectId = 'select-filiere-pro',
  messageId,
  messageTexte = "Ce TP n'est pas au programme de votre filière à ce niveau.",
} = {}) {

  const select = document.getElementById(selectId);
  const zoneMessage = messageId ? document.getElementById(messageId) : null;

  if (!select) return;

  function appliquer() {

    const cle = select.value;
    const config = mapping[cle];

    const boutons = [...document.querySelectorAll('.tabs-header .tab-btn')];
    const panneaux = [...document.querySelectorAll('.tab-panel')];

    // TP explicitement hors-programme pour cette filière à ce niveau
    if (Array.isArray(config) && config.length === 0) {
      boutons.forEach(btn => { btn.style.display = 'none'; });
      panneaux.forEach(p => p.classList.remove('actif'));

      if (zoneMessage) {
        zoneMessage.style.display = 'block';
        zoneMessage.textContent = messageTexte;
      }
      return;
    }

    if (zoneMessage) zoneMessage.style.display = 'none';

    // Pas de règle connue pour cette clé (ou aucune filière sélectionnée
    // pour l'instant) : on affiche tout, par défaut.
    const visibles = config || null;

    boutons.forEach(btn => {
      const id = btn.dataset.tab;
      const doitEtreVisible = !visibles || visibles.includes(id);
      btn.style.display = doitEtreVisible ? '' : 'none';
    });

    // Si l'onglet actuellement actif vient d'être masqué, basculer
    // automatiquement sur le premier onglet resté visible.
    const actif = document.querySelector('.tabs-header .tab-btn.actif');
    if (actif && actif.style.display === 'none') {
      const premierVisible = boutons.find(b => b.style.display !== 'none');
      premierVisible?.click();
    }
  }

  select.addEventListener('change', appliquer);
  appliquer();
}
