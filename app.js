// ===============================
// /== IMPORT MODULES ==/
// ===============================

import { renderTable, showSection } from "./modules/ui.js";
import { loadProduits, saveProduits } from "./modules/storage.js";
import { applyFilters } from "./modules/filters.js";
import { products as defaultData } from "./data/products.js";
import glassware from "./data/glassware.js";

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
// /== VERRERIE ==/
// ===============================

let verrerieChargee = false;

function afficherVerrerie() {

  const tbody = document.getElementById("verrerie-body");

  if (!tbody) return;

  tbody.innerHTML = "";

  glassware.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.nom}</td>
      <td>${item.contenance_ml}</td>
      <td>${item.lieu || ""}</td>
      <td>
        <img src="${item.image}" alt="${item.nom}" width="50">
      </td>
    `;

    tbody.appendChild(row);
  });
}

// ===============================
// /== NAVIGATION SECTIONS ==/
// ===============================

function showSectionWithVerrerie(sectionId) {

  // affiche la section normale
  showSection(sectionId);

  // charge verrerie uniquement si nécessaire
  if (sectionId === "verrerie" && !verrerieChargee) {
    afficherVerrerie();
    verrerieChargee = true;
  }
}

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
// /== FILTRES ==/
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

  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.remove('active');
  });

  const iframeSection = document.getElementById('iframe-section');
  if (iframeSection) {
    iframeSection.classList.add('active');
  }

  const iframe = document.getElementById('main-iframe');
  if (iframe) {
    iframe.src = url;
  }

  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });

  if (element) {
    element.classList.add('active');
  }
}

// ===============================
// /== EVENTS HTML ==/
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  const search = document.getElementById("search");
  if (search) {
    search.addEventListener("input", (e) => setSearch(e.target.value));
  }

  const cat = document.getElementById("categorie-filter");
  if (cat) {
    cat.addEventListener("change", (e) => setCategorie(e.target.value));
  }

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
// /== EXPORT GLOBAL ==/
// ===============================

window.supprimer = supprimer;

// ⚠️ IMPORTANT : on remplace showSection
window.showSection = showSectionWithVerrerie;

window.setSearch = setSearch;
window.setCategorie = setCategorie;
window.setDanger = setDanger;
window.setLocalisation = setLocalisation;
window.showIframe = showIframe;
