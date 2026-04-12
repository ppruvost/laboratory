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
// /== FORMULAIRE ==/
// ===============================

function toggleForm() {
  const f = document.getElementById("formulaire");

  if (!f) return;

  if (f.style.display === "none" || f.style.display === "") {
    f.style.display = "block";
  } else {
    f.style.display = "none";
  }
}

// ===============================
// /== AFFICHAGE TABLEAU ==/
// ===============================

function afficher() {
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
        <button onclick="supprimer(${i})">❌</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
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
// /== RESET FORMULAIRE ==/
// ===============================

function resetForm() {
  ["cas", "nom", "formule", "substitution"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

// ===============================
// /== INITIALISATION ==/
// ===============================

afficher();

// ===============================
// /== EXPORT GLOBAL (IMPORTANT MODULE) ==/
// ===============================

window.ajouterProduit = ajouterProduit;
window.toggleForm = toggleForm;
window.supprimer = supprimer;
