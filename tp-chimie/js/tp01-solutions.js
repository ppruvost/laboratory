console.log("tp01-solutions.js chargé");

/* ==========================================================
   TP01 - SOLUTIONS
   ========================================================== */

import products from "../../data/products.js";
import dangerDB from "../../data/dangerDB.js";
import pictogrammes from "../../data/pictogrammes.js";
import glassware from "../../data/glassware.js";
import laboratoryEquipment from "../../data/equipment.js";

/* ==========================================================
   INITIALISATION
   ========================================================== */

export function init() {

    console.log("Initialisation TP01");

   initTabs();
   initReactifs();
   renderSecurite();
   renderVerrerie();
   renderEquipements();

   initCalculs();

   initEcarts();

}

/* ==========================================================
   ONGLETS
   ========================================================== */

function initTabs() {

    document
        .querySelectorAll(".tabs-container")
        .forEach(container => {

            const boutons =
                container.querySelectorAll(".tab-btn");

            boutons.forEach(btn => {

                btn.addEventListener("click", () => {

                    const cible =
                        btn.dataset.tab;

                    boutons.forEach(b =>
                        b.classList.remove("actif")
                    );

                    container
                        .querySelectorAll(".tab-panel")
                        .forEach(panel =>
                            panel.classList.remove("actif")
                        );

                    btn.classList.add("actif");

                    container
                        .querySelector("#" + cible)
                        ?.classList.add("actif");

                });

            });

        });

}

function initReactifs() {

    const select =
        document.getElementById("reactif");

    if (!select) return;

    select.innerHTML =
        '<option value="">Choisir un réactif</option>';

    products.forEach(produit => {

        const option =
            document.createElement("option");

        option.value =
            produit.cas;

        option.textContent =
            produit.nom;

        select.appendChild(option);

    });

    select.addEventListener(
        "change",
        renderSecurite
    );

}
                                    
/* ==========================================================
   SECURITE
   ========================================================== */

function renderSecurite() {

    const select =
        document.getElementById("reactif");

    const zone =
        document.getElementById("securite-bloc");

    if (!select || !zone) return;

    const cas =
        select.value;

    zone.innerHTML = "";

    if (!cas) {

        zone.innerHTML = `
            <div class="info">
                Sélectionner un réactif.
            </div>
        `;

        return;
    }

    const produit =
        products.find(
            p => p.cas === cas
        );

    if (!produit) {

        zone.innerHTML = `
            <div class="erreur">
                Produit introuvable.
            </div>
        `;

        return;
    }

    let html = `
        <div class="produit-securite">

            <h3>${produit.nom}</h3>

            <p>
                <strong>Formule :</strong>
                ${produit.formule || "-"}
            </p>
    `;

/* =====================================
   PICTOGRAMMES CLP
   ===================================== */

html += `
    <div class="pictos-clp">
`;

const dejaAjoutes = new Set();

(produit.dangers || []).forEach(code => {

    const entree =
        pictogrammes.find(
            p => p.code === code
        );

    const picto =
        entree?.image;

    if (
        picto &&
        !dejaAjoutes.has(picto)
    ) {

        dejaAjoutes.add(picto);

        html += `
            <img
                src="../../assets/picto/${picto}"
                alt="${code}"
                title="${code}"
                class="picto-clp">
        `;
    }

});

html += `
    </div>
`;

    /* =====================================
       EPI
       ===================================== */

    if (
        produit.obligation &&
        produit.obligation.length
    ) {

        html += `
            <div class="epi-bloc">

                <h4>EPI obligatoires</h4>

                <p>
                    ${produit.obligation.join(" • ")}
                </p>

            </div>
        `;
    }

/* =====================================
   MENTIONS H
   ===================================== */

if (
    produit.dangers &&
    produit.dangers.length
) {

    html += `
        <div class="danger-bloc">

            <h4>⚠️ Mentions de danger (H)</h4>

            <ul>
    `;

    produit.dangers.forEach(code => {

        const danger =
            dangerDB.find(
                d => d.code === code
            );

        if (danger) {

            html += `
                <li>
                    <strong>${code}</strong> :
                    ${danger.text}
                </li>
            `;
        }

    });

    html += `
            </ul>

        </div>
    `;
}

/* =====================================
   MENTIONS P
   ===================================== */

if (
    produit.prevention &&
    produit.prevention.length
) {

    html += `
        <div class="prevention-bloc">

            <h4>🛡️ Conseils de prudence (P)</h4>

            <ul>
    `;

    produit.prevention.forEach(code => {

        const prevention =
            dangerDB.find(
                d => d.code === code
            );

        if (prevention) {

            html += `
                <li>
                    <strong>${code}</strong> :
                    ${prevention.text}
                </li>
            `;
        }

    });

    html += `
            </ul>

        </div>
    `;
}

    html += `
        </div>
    `;

    zone.innerHTML = html;

}
/* ==========================================================
   VERRERIE
   ========================================================== */

function renderVerrerie() {

    const zone =
        document.getElementById(
            "materiel-verrerie"
        );

    if (!zone) return;

    const liste = [
        "Bécher",
        "Fiole jaugée",
        "Éprouvette graduée"
    ];

    const selection =
        glassware.filter(v =>
            liste.includes(v.nom)
        );

    zone.innerHTML =
        selection.map(v => `

        <div class="item-materiel">

            <div>

                <strong>${v.nom}</strong>

                <br>

                ${v.contenance_ml} mL

            </div>

        </div>

    `).join("");

}

/* ==========================================================
   EQUIPEMENTS
   ========================================================== */

function renderEquipements() {

    const zone =
        document.getElementById(
            "materiel-equipements"
        );

    if (!zone) return;

    const selection =
        laboratoryEquipment.filter(
            e => e.domaine === "Chimie"
        );

    zone.innerHTML =
        selection.map(eq => `

        <div class="item-materiel">

            <div>

                <strong>${eq.nom}</strong>

                <br>

                ${eq.description}

            </div>

        </div>

    `).join("");

}

/* ==========================================================
   CALCULS
   ========================================================== */

function initCalculs() {

    [
        "c-nacl",
        "v-nacl",
        "m-nacl",

        "c-cuso4",
        "v-cuso4",
        "m-cuso4",

        "c1-hcl",
        "c2-hcl",
        "v2-hcl"

    ].forEach(id => {

        document
            .getElementById(id)
            ?.addEventListener(
                "input",
                recalculer
            );

    });

    recalculer();

}

function recalculer() {

    calculNaCl();

    calculCuSO4();

    calculHCl();

}

/* ==========================================================
   NACL
   ========================================================== */

function calculNaCl() {

    const c =
        parseFloat(
            document.getElementById(
                "c-nacl"
            ).value
        );

    const v =
        parseFloat(
            document.getElementById(
                "v-nacl"
            ).value
        ) / 1000;

    const M =
        parseFloat(
            document.getElementById(
                "m-nacl"
            ).value
        );

    const masse =
        c * v * M;

    document.getElementById(
        "res-nacl"
    ).innerHTML = `
        Masse à peser :
        <strong>
        ${masse.toFixed(3)} g
        </strong>
    `;

    document.getElementById(
        "table-masse-nacl"
    ).textContent =
        masse.toFixed(3);

    document.getElementById(
        "table-calc-nacl"
    ).textContent =
        c.toFixed(3);

}

/* ==========================================================
   CUSO4
   ========================================================== */

function calculCuSO4() {

    const c =
        parseFloat(
            document.getElementById(
                "c-cuso4"
            ).value
        );

    const v =
        parseFloat(
            document.getElementById(
                "v-cuso4"
            ).value
        ) / 1000;

    const M =
        parseFloat(
            document.getElementById(
                "m-cuso4"
            ).value
        );

    const masse =
        c * v * M;

    document.getElementById(
        "res-cuso4"
    ).innerHTML = `
        Masse à peser :
        <strong>
        ${masse.toFixed(3)} g
        </strong>
    `;

    document.getElementById(
        "table-masse-cuso4"
    ).textContent =
        masse.toFixed(3);

    document.getElementById(
        "table-calc-cuso4"
    ).textContent =
        c.toFixed(3);

}

/* ==========================================================
   HCL
   ========================================================== */

function calculHCl() {

    const c1 =
        parseFloat(
            document.getElementById(
                "c1-hcl"
            ).value
        );

    const c2 =
        parseFloat(
            document.getElementById(
                "c2-hcl"
            ).value
        );

    const v2 =
        parseFloat(
            document.getElementById(
                "v2-hcl"
            ).value
        );

    const v1 =
        (c2 * v2) / c1;

    document.getElementById(
        "res-hcl"
    ).innerHTML = `
        Prélever
        <strong>
        ${v1.toFixed(2)} mL
        </strong>
        de solution mère.
    `;

    document.getElementById(
        "table-calc-hcl"
    ).textContent =
        c2.toFixed(3);

}

/* ==========================================================
   ECARTS %
   ========================================================== */

function initEcarts() {

    document
        .querySelectorAll(".c-exp")
        .forEach(input => {

            input.addEventListener(
                "input",
                majEcarts
            );

        });

}

function majEcarts() {

    document
        .querySelectorAll(
            ".tableau-resultats tbody tr"
        )
        .forEach(ligne => {

            const theo =
                parseFloat(
                    ligne.dataset.theo
                );

            const cExp =
                parseFloat(
                    ligne.querySelector(
                        ".c-exp"
                    ).value
                );

            const cellule =
                ligne.querySelector(
                    ".ecart"
                );

            if (
                isNaN(theo) ||
                isNaN(cExp)
            ) {

                cellule.textContent = "";

                return;
            }

            const ecart =

                Math.abs(
                    (cExp - theo)
                    / theo
                ) * 100;

            cellule.textContent =
                ecart.toFixed(2)
                + " %";

        });

}
