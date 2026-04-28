// ===============================
// /== IMPORTS ==/
// ===============================

import { pictogrammes } from "../data/pictogrammes.js";
import { dangerDB } from "../data/dangerDB.js";


// ===============================
// /== AFFICHAGE TABLEAU PRODUITS ==/
// ===============================

export function renderTable(produits) {

  const tbody = document.getElementById("table-body");
  if (!tbody) return;

  // 🔴 RESET TABLE
  tbody.innerHTML = "";

  // 🔴 SI VIDE
  if (!produits || produits.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8">Aucun produit</td></tr>`;
    return;
  }

  produits.forEach((p) => {

    // ===============================
    // 🧪 PICTOGRAMMES
    // ===============================
    const pictos = (p.dangers || []).map(code => {
      const img = pictogrammes[code];
      if (!img) return "";

      return `
        <div class="picto-container">
          <img 
            src="assets/picto/${img}" 
            class="picto"
            alt="${code}"
          >
        </div>
      `;
    }).join("");


    // ===============================
    // ⚠️ TEXTE DANGERS
    // ===============================
    const dangerText = (p.dangers || []).map(code => {
      const d = dangerDB.find(d => d.code === code);
      return d ? `${code} - ${d.text}` : code;
    }).join("<br>");


    // ===============================
    // 🖼️ IMAGE VISUEL + EFFET LOUPE
    // ===============================
    const image = p.image
      ? `
        <div class="image-container">
          <img
            src="assets/img/${p.image}"
            alt="${p.nom}"
            class="table-image"
          >
        </div>
      `
      : "—";


    // ===============================
    // 🧱 LIGNE TABLEAU
    // ===============================
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.cas || "-"}</td>
      <td>${p.nom || "-"}</td>
      <td>${p.formule || "-"}</td>
      <td>${p.categorie || "-"}</td>
      <td>${p.localisation || "-"}</td>
      <td>${pictos}</td>
      <td>${dangerText}</td>
      <td>${image}</td>
    `;

    tbody.appendChild(tr);

  });

}


// ===============================
// /== AFFICHAGE SECTIONS (MENU) ==/
// ===============================

export function showSection(id, element = null) {

  // 🔴 MASQUER TOUTES LES SECTIONS
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });

  // 🔴 AFFICHER LA BONNE
  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");
  }

  // 🔴 GESTION MENU ACTIF
  document.querySelectorAll(".menu-item").forEach(item => {
    item.classList.remove("active");
  });

  if (element) {
    element.classList.add("active");
  }
}


// ===============================
// /== FORMULAIRE : OUVRIR / FERMER ==/
// ===============================

export function toggleForm() {

  const f = document.getElementById("formulaire");
  if (!f) return;

  f.classList.toggle("active");

  if (!f.classList.contains("active")) {
    f.style.display = "none";
  } else {
    f.style.display = "block";
  }
}


// ===============================
// /== RESET FORMULAIRE ==/
// ===============================

export function resetForm() {

  // 🔴 champs texte
  ["cas", "nom", "formule", "visuel"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  // 🔴 select danger
  const danger = document.getElementById("danger");
  if (danger) {
    danger.selectedIndex = -1;
  }
}
