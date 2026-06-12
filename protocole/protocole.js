import { products } from "../data/products.js";

// --------------------
// INIT LISTE PRODUITS
// --------------------
const select = document.getElementById("reactif");

products.forEach(p => {
  const option = document.createElement("option");
  option.value = p.nom;
  option.textContent = `${p.nom} (${p.formule})`;
  select.appendChild(option);
});

// --------------------
// DILUTION C1V1 = C2V2
// --------------------
window.calculerDilution = function () {

  const c1 = parseFloat(document.getElementById("c1").value);
  const c2 = parseFloat(document.getElementById("c2").value);
  const v2 = parseFloat(document.getElementById("v2").value);

  if (!c1 || !c2 || !v2) return;

  const v1 = (c2 * v2) / c1;

  document.getElementById("resultatDilution").innerHTML =
    `V₁ = <b>${v1.toFixed(2)} mL</b>`;
};

// --------------------
// FICHE DE PRÉPARATION
// --------------------
window.genererFiche = function () {

  const nom = document.getElementById("reactif").value;
  const c = parseFloat(document.getElementById("concentration").value);
  const v = parseFloat(document.getElementById("volume").value);

  const produit = products.find(p => p.nom === nom);
  if (!produit) return;

  const masse = (c * v / 1000) * 40; 
  // ⚠ simplification volontaire (solution scolaire)

  const pictos = (produit.pictogramme || [])
    .map(img => `<img src="../assets/img/pictogrammes/${img}">`)
    .join("");

  document.getElementById("ficheContent").innerHTML = `
    <h3>${produit.nom}</h3>

    <p><b>CAS :</b> ${produit.cas}</p>
    <p><b>Formule :</b> ${produit.formule}</p>
    <p><b>Catégorie :</b> ${produit.categorie}</p>

    <div class="pictos">${pictos}</div>

    <hr>

    <p><b>Préparation :</b></p>
    <p>
      Dissoudre <b>${masse.toFixed(2)} g</b> de ${produit.nom}<br>
      Compléter à <b>${v} mL</b>
    </p>

    <p><b>Concentration cible :</b> ${c} mol·L⁻¹</p>
  `;
};

// --------------------
// EXPORT PDF
// --------------------
window.exportPDF = async function () {

  const element = document.getElementById("fiche");

  const canvas = await html2canvas(element);
  const img = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  pdf.addImage(img, "PNG", 10, 10, 180, 0);
  pdf.save("fiche_tp.pdf");
};
