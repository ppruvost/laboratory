console.log("protocole.js chargé");
console.log(products);

import { products } from "../data/products.js";

// ======================
// INITIALISATION
// ======================

const select = document.getElementById("reactif");

function chargerProduits() {

    if (!products || !Array.isArray(products)) {
        console.error("products.js non chargé");
        return;
    }

    select.innerHTML = '<option value="">-- Choisir un réactif --</option>';

    products.forEach(produit => {

        const option = document.createElement("option");

        option.value = produit.nom || "";

        option.textContent =
            `${produit.nom || "Sans nom"} ${
                produit.formule ? `(${produit.formule})` : ""
            }`;

        select.appendChild(option);
    });

    console.log(`${products.length} réactifs chargés`);
}

window.initProtocole = function () {
    chargerProduits();

};

// ======================
// CALCUL DILUTION
// ======================

window.calculerDilution = function () {

    const c1 = parseFloat(document.getElementById("c1").value);
    const c2 = parseFloat(document.getElementById("c2").value);
    const v2 = parseFloat(document.getElementById("v2").value);

    if (isNaN(c1) || isNaN(c2) || isNaN(v2)) {

        document.getElementById("resultatDilution").innerHTML =
            "Compléter tous les champs.";

        return;
    }

    if (c1 <= 0 || c2 <= 0 || v2 <= 0) {

        document.getElementById("resultatDilution").innerHTML =
            "Valeurs invalides.";

        return;
    }

    const v1 = (c2 * v2) / c1;

    document.getElementById("resultatDilution").innerHTML =
        `V₁ = <b>${v1.toFixed(2)} mL</b>`;
};

// ======================
// PICTOGRAMMES
// ======================

function creerPictogrammes(produit) {

    const liste =
        produit.pictogramme ||
        produit.pictogrammes ||
        [];

    if (!Array.isArray(liste) || liste.length === 0) {

        return "<p>Aucun pictogramme renseigné</p>";
    }

    return `
        <div class="pictoZone">
            ${liste.map(pic => `
                <img
                    src="../assets/img/picto/${pic}"
                    alt="${pic}"
                    loading="lazy"
                >
            `).join("")}
        </div>
    `;
}

// ======================
// FICHE DE PREPARATION
// ======================

window.genererFiche = function () {

    const nom = document.getElementById("reactif").value;

    const concentration =
        parseFloat(document.getElementById("concentration").value);

    const volume =
        parseFloat(document.getElementById("volume").value);

    const produit =
        products.find(p => p.nom === nom);

    if (!produit) {

        alert("Choisir un réactif.");

        return;
    }

    const masse =
        concentration && volume
            ? (concentration * volume / 1000) * 40
            : 0;

    const pictos =
        creerPictogrammes(produit);

    const securite =
        produit.securite ||
        produit.danger ||
        produit.hazard ||
        {};

    const hotte =
        securite.hotte === true
            ? "OUI"
            : "NON";

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
            <h4>Sécurité</h4>

            <p>
                <b>Préparation sous hotte :</b>
                ${hotte}
            </p>

            ${
                securite.avertissement
                ? `<p><b>Mention :</b> ${securite.avertissement}</p>`
                : ""
            }

            ${
                securite.h
                ? `
                <p><b>Mentions H :</b></p>
                <ul>
                    ${securite.h.map(
                        h => `<li>${h}</li>`
                    ).join("")}
                </ul>
                `
                : ""
            }

            ${
                securite.p
                ? `
                <p><b>Conseils P :</b></p>
                <ul>
                    ${securite.p.map(
                        p => `<li>${p}</li>`
                    ).join("")}
                </ul>
                `
                : ""
            }
        </div>

        <div class="bloc">
            <h4>Préparation</h4>

            <p>
                Dissoudre
                <b>${masse.toFixed(2)} g</b>
                de produit.
            </p>

            <p>
                Compléter à
                <b>${volume || 0} mL</b>.
            </p>

            <p>
                Concentration finale :
                <b>${concentration || 0} mol·L⁻¹</b>
            </p>
        </div>
    `;
};

// ======================
// EXPORT PDF
// ======================

window.exportPDF = async function () {

    if (typeof html2canvas === "undefined") {

        alert("html2canvas non chargé");

        return;
    }

    if (!window.jspdf) {

        alert("jsPDF non chargé");

        return;
    }

    const element =
        document.getElementById("fiche");

    const canvas =
        await html2canvas(element, {
            scale: 2
        });

    const img =
        canvas.toDataURL("image/png");

    const { jsPDF } =
        window.jspdf;

    const pdf =
        new jsPDF("p", "mm", "a4");

    const largeur = 190;

    const hauteur =
        (canvas.height * largeur) /
        canvas.width;

    pdf.addImage(
        img,
        "PNG",
        10,
        10,
        largeur,
        hauteur
    );

    pdf.save("fiche_preparation.pdf");
};
