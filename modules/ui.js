// ===============================
// /== AFFICHAGE TABLEAU PRODUITS ==/
// ===============================

export function renderTable(produits, supprimerCallback) {
  const tbody = document.getElementById("table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  produits.forEach((p, i) => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.cas || "-"}</td>
      <td>${p.nom || "-"}</td>
      <td>${p.formule || "-"}</td>
      <td>${p.categorie || "-"}</td>
      <td>${p.localisation || "-"}</td>
      <td>${(p.dangers || []).join(", ")}</td>
      <td>${p.substitution || "-"}</td>
      <td>
        <button data-index="${i}" class="delete-btn">❌</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Gestion des boutons suppression (propre, sans onclick HTML)
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      supprimerCallback(index);
    });
  });
}

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
