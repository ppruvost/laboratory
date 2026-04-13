// ===============================
// /== AFFICHAGE TABLEAU PRODUITS ==/
// ===============================

import { pictogrammes } from "../data/pictogrammes.js";
import { dangerDB } from "../data/dangerDB.js";

export function renderTable(produits, supprimerCallback) {
  const tbody = document.getElementById("table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  produits.forEach((p, i) => {

    // 🔴 PICTOGRAMMES
    const pictos = (p.dangers || []).map(code => {
      const img = pictogrammes[code];
      if (!img) return "";
      return `<img src="assets/picto/${img}" class="picto">`;
    }).join("");

    // 📜 TEXTE DANGERS
    const dangerText = (p.dangers || []).map(code => {
      const d = dangerDB.find(d => d.code === code);
      return d ? `${code} - ${d.text}` : code;
    }).join("<br>");

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.cas || "-"}</td>
      <td>${p.nom || "-"}</td>
      <td>${p.formule || "-"}</td>
      <td>${p.categorie || "-"}</td>
      <td>${p.localisation || "-"}</td>

      <td>
        ${pictos}
      </td>

      <td>
        ${dangerText}
      </td>

      <td>${p.substitution || "-"}</td>

    `;

    tbody.appendChild(tr);
  });

// ===============================
// /== AFFICHAGE SECTIONS DASHBOARD ==/
// ===============================

export function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.style.display = "none";
  });

  const target = document.getElementById(id);
  if (target) target.style.display = "block";
}

// ===============================
// /== FORMULAIRE TOGGLE ==/
// ===============================

export function toggleForm() {
  const f = document.getElementById("formulaire");
  if (!f) return;

  if (f.style.display === "none" || f.style.display === "") {
    f.style.display = "block";
  } else {
    f.style.display = "none";
  }
}

// ===============================
// /== RESET FORMULAIRE ==/
// ===============================

export function resetForm() {
  ["cas", "nom", "formule", "substitution"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  const danger = document.getElementById("danger");
  if (danger) danger.selectedIndex = -1;
}
