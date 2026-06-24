// =====================================================
// RÉCUPÉRATION PRODUITS
// =====================================================

console.log("protocole.js chargé");

import products from "../../data/products.js";
import pictogrammes from "../../data/pictogrammes.js";

console.log(
    "Nombre de produits :",
    products.length
);

// =====================================================
// UTILITAIRES
// =====================================================

function getSelect() {
    return document.getElementById("reactif");
}

// =====================================================
// CHARGEMENT PRODUITS
// =====================================================

function chargerProduits() {

    const select = getSelect();

    if (!select) {
        console.error("Sélecteur #reactif introuvable");
        return;
    }

    if (!Array.isArray(products)) {
        console.error("products non valide");
        return;
    }

    select.innerHTML =
        '<option value="">-- Choisir un réactif --</option>';

    products.forEach(produit => {

        const option = document.createElement("option");

        option.value = produit.nom || "";

        option.textContent =
            `${produit.nom || "Sans nom"}${
                produit.formule ? ` (${produit.formule})` : ""
            }`;

        select.appendChild(option);
    });

    console.log(`${products.length} réactifs chargés`);
}

// =====================================================
// CALCUL DILUTION
// =====================================================

window.calculerDilution = function () {

    const c1 = parseFloat(document.getElementById("c1")?.value);
    const c2 = parseFloat(document.getElementById("c2")?.value);
    const v2 = parseFloat(document.getElementById("v2")?.value);

    const result = document.getElementById("resultatDilution");

    if (!result) return;

    if (isNaN(c1) || isNaN(c2) || isNaN(v2)) {
        result.innerHTML = "Compléter tous les champs.";
        return;
    }

    if (c1 <= 0 || c2 <= 0 || v2 <= 0) {
        result.innerHTML = "Valeurs invalides.";
        return;
    }

    const v1 = (c2 * v2) / c1;

    result.innerHTML = `V₁ = <b>${v1.toFixed(2)} mL</b>`;
};

// =====================================================
// PICTOGRAMMES
// =====================================================

function creerPictogrammes(produit) {

    const fichiers = new Set();

    (produit.dangers || []).forEach(code => {

        const picto = pictogrammes[code];

        if (picto) {
            fichiers.add(picto);
        }

    });

    if (fichiers.size === 0) {
        return "<p>Aucun pictogramme renseigné</p>";
    }

    return `
        <div class="pictoZone">

            ${[...fichiers].map(pic => `
                <img
                    src="../../assets/picto/${pic}"
                    alt="${pic}"
                    loading="lazy"
                >
            `).join("")}

        </div>
    `;
}

// =====================================================
// FICHE DE PRÉPARATION
// =====================================================

window.genererFiche = function () {

    const nom = document.getElementById("reactif")?.value;

    const concentration =
        parseFloat(document.getElementById("concentration")?.value);

    const volume =
        parseFloat(document.getElementById("volume")?.value);

    const produit =
        products.find(p => p.nom === nom);

    if (!produit) {
        alert("Choisir un réactif.");
        return;
    }

    const masse =
        (concentration && volume)
            ? (concentration * volume / 1000) * 40
            : 0;

    const pictos = creerPictogrammes(produit);

    const dangers =
    produit.dangers || [];

    const preventions =
        produit.prevention || [];

    const obligations =
        produit.obligation || [];

    document.getElementById("ficheContent").innerHTML = `

        <h3>${produit.nom || ""}</h3>

        <div class="bloc">
            <p><b>Formule :</b> ${produit.formule || "-"}</p>
            <p><b>CAS :</b> ${produit.cas || "-"}</p>
            <p><b>Catégorie :</b> ${produit.categorie || "-"}</p>
        </div>

        <div class="bloc">
            <h4>Pictogrammes SGH</h4>
            ${pictos}
        </div>

<div class="bloc">

    <h4>Équipements de protection</h4>

    ${
        obligations.length
            ? `
            <ul>
                ${obligations.map(o => `
                    <li>${o}</li>
                `).join("")}
            </ul>
            `
            : "<p>Aucune obligation renseignée.</p>"
    }

</div>

<div class="bloc">

    <h4>Mentions de danger (H)</h4>

    ${
        dangers.length
            ? `
            <ul>
                ${dangers.map(h => `
                    <li>${h}</li>
                `).join("")}
            </ul>
            `
            : "<p>Aucune mention H renseignée.</p>"
    }

</div>

<div class="bloc">

    <h4>Conseils de prudence (P)</h4>

    ${
        preventions.length
            ? `
            <ul>
                ${preventions.map(p => `
                    <li>${p}</li>
                `).join("")}
            </ul>
            `
            : "<p>Aucun conseil P renseigné.</p>"
    }

</div>

        <div class="bloc">
            <h4>Préparation</h4>

            <p>Dissoudre <b>${masse.toFixed(2)} g</b> de produit.</p>

            <p>Compléter à <b>${volume || 0} mL</b>.</p>

            <p>Concentration finale : <b>${concentration || 0} mol·L⁻¹</b></p>
        </div>
    `;
};

// =====================================================
// EXPORT PDF
// =====================================================

window.exportPDF = async function () {

    if (typeof html2canvas === "undefined") {
        alert("html2canvas non chargé");
        return;
    }

    if (!window.jspdf) {
        alert("jsPDF non chargé");
        return;
    }

    const element = document.getElementById("fiche");

    const canvas = await html2canvas(element, {
        scale: 2
    });

    const img = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("p", "mm", "a4");

    const largeur = 190;

    const hauteur = (canvas.height * largeur) / canvas.width;

    pdf.addImage(img, "PNG", 10, 10, largeur, hauteur);

    pdf.save("fiche_preparation.pdf");
};

// =====================================================
// INIT
// =====================================================
export function init() {

    console.log("Initialisation protocole");

    chargerProduits();

}
