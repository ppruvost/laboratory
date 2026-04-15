// ===============================
// /== IMPORT MODULES ==/
// ===============================

import { renderTable, showSection } from "./modules/ui.js";
import { loadProduits, saveProduits } from "./modules/storage.js";
import { applyFilters } from "./modules/filters.js";
import { products as defaultData } from "./data/products.js";

// ===============================
// /== BASE DE DONNÉES ==/
// ===============================

let produits = loadProduits();

// 🔴 INITIALISATION SI VIDE
if (!produits || produits.length === 0) {
  produits = defaultData;
  saveProduits(produits);
}

console.log("Produits chargés :", produits);

// ===============================
// /== ETAT DES FILTRES ==/
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

  console.log("Produits affichés :", filtered);

  renderTable(filtered, supprimer);
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
// /== FILTRES (CONNECTÉS HTML) ==/
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
// /== IFRAME NAVIGATION ==/
// ===============================

function showIframe(url, element) {

  // cacher toutes les sections
  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.remove('active');
  });

  // afficher iframe
  const iframeSection = document.getElementById('iframe-section');
  if (iframeSection) {
    iframeSection.classList.add('active');
  }

  const iframe = document.getElementById('main-iframe');
  if (iframe) {
    iframe.src = url;
  }

  // gérer menu actif
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });

  if (element) {
    element.classList.add('active');
  }
}

// ===============================
// /== EVENTS HTML (AUTO BIND) ==/
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  // 🔍 recherche
  const search = document.getElementById("search");
  if (search) {
    search.addEventListener("input", (e) => setSearch(e.target.value));
  }

  // 🧪 catégorie
  const cat = document.getElementById("categorie-filter");
  if (cat) {
    cat.addEventListener("change", (e) => setCategorie(e.target.value));
  }

  // ⚠️ danger
  const danger = document.getElementById("danger-filter");
  if (danger) {
    danger.addEventListener("change", (e) => setDanger(e.target.value));
  }

});

// ===============================
// /== INITIALISATION ==/
// ===============================

showSection("equipements");
afficher();

// ===============================
// /== EXPORT GLOBAL (HTML onclick) ==/
// ===============================

window.supprimer = supprimer;
window.showSection = showSection;
window.setSearch = setSearch;
window.setCategorie = setCategorie;
window.setDanger = setDanger;
window.setLocalisation = setLocalisation;
window.showIframe = showIframe;
