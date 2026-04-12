// ===============================
// /== IMPORT MODULES ==/
// ===============================

import { renderTable, showSection, toggleForm, resetForm } from "./modules/ui.js";
import { loadProduits, saveProduits } from "./modules/storage.js";
import { applyFilters } from "./modules/filters.js";

// ===============================
// /== BASE DE DONNÉES ==/
// ===============================

let produits = loadProduits();

// ===============================
// /== ETAT DES FILTRES (GLOBAL) ==/
// ===============================

let filters = {
  query: "",
  categorie: "all",
  danger: "all",
  localisation: "all"
};

// ===============================
// /== SAUVEGARDE ==/
// ===============================

function sauvegarder() {
  saveProduits(produits);
}

// ===============================
// /== RENDU PRINCIPAL ==/
// ===============================

function afficher() {
  const filtered = applyFilters(produits, filters);
  renderTable(filtered, supprimer);
}

// ===============================
// /== AJOUT PRODUIT ==/
// ===============================

function ajouterProduit() {

  const dangers = Array.from(
    document.getElementById("danger").selectedOptions || []
  ).map(o => o.value);

  const produit = {
    cas: document.getElementById("cas").value,
    nom: document.getElementById("nom").value,
    formule: document.getElementById("formule").value,
    categorie: document.getElementById("categorie").value,
    localisation: document.getElementById("localisation").value,
    dangers: dangers,
    substitution: document.getElementById("substitution").value
  };

  produits.push(produit);

  sauvegarder();
  afficher();
  resetForm();
}

// ===============================
// /== SUPPRESSION PRODUIT ==/
// ===============================

function supprimer(index) {
  produits.splice(index, 1);

  sauvegarder();
  afficher();
}

// ===============================
// /== FILTRES (OPTIONNEL UI FUTUR) ==/
// ===============================

function setSearch(value) {
  filters.query = value;
  afficher();
}

function setCategorie(value) {
  filters.categorie = value;
  afficher();
}

function setDanger(value) {
  filters.danger = value;
  afficher();
}

function setLocalisation(value) {
  filters.localisation = value;
  afficher();
}

// ===============================
// /== INITIALISATION ==/
// ===============================

afficher();

// ===============================
// /== EXPORT VERS HTML (onclick) ==/
// ===============================

window.ajouterProduit = ajouterProduit;
window.supprimer = supprimer;
window.toggleForm = toggleForm;
window.showSection = showSection;
window.resetForm = resetForm;

// (préparation future UI filtres)
window.setSearch = setSearch;
window.setCategorie = setCategorie;
window.setDanger = setDanger;
window.setLocalisation = setLocalisation;
