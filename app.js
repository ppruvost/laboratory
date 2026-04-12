// ===============================
// /== IMPORTS ==/
// ===============================

import { products } from "./data/products.js";
import { dangerDB } from "./data/dangerDB.js";
import { pictogrammes } from "./data/pictogrammes.js";

// ===============================
// /== STOCKAGE LOCAL (BASE DE DONNÉES) ==/
// ===============================

let data = JSON.parse(localStorage.getItem("lab_db")) || products;

function saveDB() {
  localStorage.setItem("lab_db", JSON.stringify(data));
}

// ===============================
// /== UTILITAIRES DANGERS ==/
// ===============================

function getDangerLabel(code) {
  const danger = dangerDB.find(d => d.code === code);
  return danger ? `${danger.code} - ${danger.text}` : code;
}

function formatDangers(list) {
  return list.map(getDangerLabel).join("<br>");
}

// ===============================
// /== PICTOGRAMMES AUTOMATIQUES ==/
// ===============================

function getPictos(dangers) {
  return dangers
    .map(code => pictogrammes[code])
    .filter(Boolean)
    .map(img => `<img src="assets/picto/${img}" width="35">`)
    .join(" ");
}

// ===============================
// /== RENDU TABLEAU PRINCIPAL ==/
// ===============================

function renderTable() {
  const tbody = document.getElementById("table");
  tbody.innerHTML = "";

  data.forEach((p, index) => {

    tbody.innerHTML += `
      <tr>

        <td>${p.cas || "-"}</td>
        <td>${p.nom || "-"}</td>
        <td>${p.formule || "-"}</td>
        <td>${p.categorie || "-"}</td>
        <td>${p.localisation || "-"}</td>

        <td>${formatDangers(p.dangers || [])}</td>

        <td>${getPictos(p.dangers || [])}</td>

        <td>
          ${p.fds ? `<a href="assets/fds/${p.fds}" target="_blank">FDS</a>` : "-"}
        </td>

        <td>${p.substitution || "-"}</td>

        <td>
          <button onclick="deleteProduct(${index})">❌</button>
        </td>

      </tr>
    `;
  });
}

// ===============================
// /== AJOUT PRODUIT ==/
// ===============================

function addProduct() {
  const cas = document.getElementById("cas").value;
  const nom = document.getElementById("nom").value;
  const formule = document.getElementById("formule").value;
  const categorie = document.getElementById("categorie").value;
  const localisation = document.getElementById("localisation").value;
  const substitution = document.getElementById("substitution").value;

  const dangers = Array.from(document.getElementById("danger").selectedOptions)
    .map(o => o.value);

  const newProduct = {
    cas,
    nom,
    formule,
    categorie,
    localisation,
    dangers,
    substitution,
    fds: ""
  };

  data.push(newProduct);
  saveDB();
  renderTable();

  clearForm();
}

// ===============================
// /== SUPPRESSION PRODUIT ==/
// ===============================

function deleteProduct(index) {
  data.splice(index, 1);
  saveDB();
  renderTable();
}

// ===============================
// /== FORMULAIRE ==/
// ===============================

function clearForm() {
  document.getElementById("cas").value = "";
  document.getElementById("nom").value = "";
  document.getElementById("formule").value = "";
  document.getElementById("substitution").value = "";
}

function toggleForm() {
  const f = document.getElementById("formulaire");
  f.style.display = f.style.display === "none" ? "block" : "none";
}

// ===============================
// /== INITIALISATION ==/
// ===============================

renderTable();
