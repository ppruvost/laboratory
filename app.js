// ===============================
// /== IMPORT UI MODULE ==/
// ===============================

import { renderTable, showSection, toggleForm, resetForm } from "./modules/ui.js";

// ===============================
// /== BASE DE DONNÉES LOCALSTORAGE ==/
// ===============================

let produits = JSON.parse(localStorage.getItem("produits")) || [];

// ===============================
// /== SAUVEGARDE ==/
// ===============================

function sauvegarder() {
  localStorage.setItem("produits", JSON.stringify(produits));
}

// ===============================
// /== AFFICHAGE ==/
// ===============================

function afficher() {
  renderTable(produits, supprimer);
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
// /== SUPPRESSION ==/
// ===============================

function supprimer(index) {
  produits.splice(index, 1);
  sauvegarder();
  afficher();
}

// ===============================
// /== INITIALISATION ==/
// ===============================

afficher();

// ===============================
// /== EXPORT GLOBAL (IMPORTANT POUR HTML onclick) ==/
// ===============================

window.ajouterProduit = ajouterProduit;
window.supprimer = supprimer;
window.toggleForm = toggleForm;
window.showSection = showSection;
window.resetForm = resetForm;
