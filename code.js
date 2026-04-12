function toggleForm() {
  const f = document.getElementById("formulaire");
  f.style.display = f.style.display === "none" ? "block" : "none";
}

let produits = JSON.parse(localStorage.getItem("produits")) || [];

function sauvegarder() {
  localStorage.setItem("produits", JSON.stringify(produits));
}

function afficher() {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = "";

  produits.forEach((p, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.cas}</td>
      <td>${p.nom}</td>
      <td>${p.formule}</td>
      <td>${p.categorie}</td>
      <td>${p.localisation}</td>
      <td>${p.dangers.join(', ')}</td>
      <td>${p.substitution}</td>
      <td><button onclick="supprimer(${i})">❌</button></td>
    `;

    tbody.appendChild(tr);
  });
}

function ajouterProduit() {
  const dangers = Array.from(document.getElementById("danger").selectedOptions)
    .map(o => o.value);

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
}

function supprimer(i) {
  produits.splice(i, 1);
  sauvegarder();
  afficher();
}

afficher();
