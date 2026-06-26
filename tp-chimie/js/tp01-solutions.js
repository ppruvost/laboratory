/* ==========================================================
   TP01 - PREPARATION DE SOLUTIONS
   ========================================================== */

import products from "../../data/products.js";
import dangerDB from "../../data/dangerDB.js";
import pictogrammes from "../../data/pictogrammes.js";
import glassware from "../../data/glassware.js";
import laboratoryEquipment from "../../data/equipment.js";

/* ==========================================================
   VARIABLES
   ========================================================== */

let reactifCourant = null;

/* ==========================================================
   RACCOURCI DOM
   ========================================================== */

function $(id) {
    return document.getElementById(id);
}

/* ==========================================================
   INITIALISATION
   ========================================================== */

export function init() {

    console.log("TP01 Solutions initialisé");

    initSections();

    initTabs();

    initReactifs();

    initMateriel();

    initCalculs();

    initResultats();
}

/* ==========================================================
   ACCORDEONS
   ========================================================== */

function initSections() {

    document
        .querySelectorAll(".section")
        .forEach(section => {

            const titre =
                section.querySelector(".section-titre");

            const corps =
                section.querySelector(".section-corps");

            if (!titre || !corps) return;

            corps.style.display = "block";

            titre.addEventListener("click", () => {

                const ouvert =
                    corps.style.display !== "none";

                corps.style.display =
                    ouvert ? "none" : "block";

                const chevron =
                    titre.querySelector(".chevron");

                if (chevron) {

                    chevron.textContent =
                        ouvert ? "►" : "▼";

                }

            });

        });

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

            const panneaux =
                container.querySelectorAll(".tab-panel");

            boutons.forEach(btn => {

                btn.addEventListener("click", () => {

                    boutons.forEach(b =>
                        b.classList.remove("actif")
                    );

                    panneaux.forEach(p =>
                        p.classList.remove("actif")
                    );

                    btn.classList.add("actif");

                    const cible =
                        container.querySelector(
                            "#" + btn.dataset.tab
                        );

                    if (cible) {

                        cible.classList.add("actif");

                    }

                });

            });

        });

}

/* ==========================================================
   OUTILS
   ========================================================== */

function nombre(v) {

    const n = parseFloat(v);

    return isNaN(n) ? 0 : n;

}

function arrondir(v, d = 2) {

    return Number(v).toFixed(d);

}

function message(id, texte) {

    const zone = $(id);

    if (!zone) return;

    zone.innerHTML =
        `<div class="info">${texte}</div>`;

}

/* ==========================================================
   Les fonctions suivantes seront ajoutées
   dans le bloc 2 :

   initReactifs()
   afficherSecurite()
   initMateriel()

   ========================================================== */
/* ==========================================================
   REACTIFS
========================================================== */

function initReactifs() {

    const selectSec = $("reactif");
    const selectDis = $("reactif-dissolution");

    if (!selectSec || !selectDis) return;

    selectSec.innerHTML =
        '<option value="">-- Sélectionner --</option>';

    selectDis.innerHTML =
        '<option value="">-- Sélectionner un sel --</option>';

    products.forEach(p => {

        /* ---------- liste sécurité ---------- */

        const o1 = document.createElement("option");
        o1.value = p.cas;
        o1.textContent = p.nom;
        selectSec.appendChild(o1);

        /* ---------- liste dissolution ---------- */

        if (p.categorie === "Sel") {

            const o2 = document.createElement("option");

            o2.value = p.cas;
            o2.textContent = p.nom;

            selectDis.appendChild(o2);

        }

    });

    selectSec.addEventListener(
        "change",
        afficherSecurite
    );

    selectDis.addEventListener(
        "change",
        changerReactif
    );

}

/* ==========================================================
   SECURITE
========================================================== */

function afficherSecurite() {

    const select = $("reactif");
    const zone = $("securite-bloc");

    if (!select || !zone) return;

    if (!select.value) {

        message(
            "securite-bloc",
            "Sélectionner un réactif."
        );

        return;

    }

    const produit =
        products.find(
            p => p.cas === select.value
        );

    if (!produit) return;

    reactifCourant = produit;

    let html = "";

    html += `<h3>${produit.nom}</h3>`;

    html += `<p><strong>Formule :</strong> ${produit.formule}</p>`;

    html += `<div class="pictos-clp">`;

    (produit.dangers || []).forEach(code => {

        const picto =
            pictogrammes.find(
                p => p.code === code
            );

        if (picto) {

            html += `
            <img
                class="picto-clp"
                src="../../assets/picto/${picto.image}"
                alt="${code}"
                title="${code}">
            `;

        }

    });

    html += "</div>";

    if (produit.dangers?.length) {

        html += "<h4>Mentions H</h4><ul>";

        produit.dangers.forEach(code => {

            const h =
                dangerDB.find(
                    d => d.code === code
                );

            if (h) {

                html += `<li><strong>${code}</strong> : ${h.texte}</li>`;

            }

        });

        html += "</ul>";

    }

    zone.innerHTML = html;

}

/* ==========================================================
   CHANGEMENT DE REACTIF
========================================================== */

function changerReactif() {

    const cas =
        $("reactif-dissolution").value;

    const produit =
        products.find(
            p => p.cas === cas
        );

    if (!produit) return;

    reactifCourant = produit;

    $("nom-reactif").textContent =
        produit.nom;

    $("formule-dissolution").textContent =
        produit.formule;

    $("masse-dissolution").textContent =
        arrondir(produit.masseMolaire);

    $("m-dissolution").value =
        arrondir(produit.masseMolaire);

    $("nom-sel-table").textContent =
        produit.nom;

    calculDissolution();

}

/* ==========================================================
   MATERIEL
========================================================== */

function initMateriel() {

    const verrerie =
        $("materiel-verrerie");

    const equipements =
        $("materiel-equipements");

    if (!verrerie || !equipements) return;

    verrerie.innerHTML = "";

    equipements.innerHTML = "";

    glassware.forEach(v => {

        verrerie.innerHTML += `
        <div class="carte-materiel">
            <strong>${v.nom}</strong><br>
            ${v.contenance_ml ?? ""} mL
        </div>
        `;

    });

    laboratoryEquipment.forEach(e => {

        equipements.innerHTML += `
        <div class="carte-materiel">
            <strong>${e.nom}</strong><br>
            ${e.description ?? ""}
        </div>
        `;

    });

}

/* ==========================================================
   CALCUL DISSOLUTION
========================================================== */

function initCalculs() {

    [
        "c-dissolution",
        "v-dissolution",
        "m-dissolution"
    ].forEach(id => {

        $(id)?.addEventListener(
            "input",
            calculDissolution
        );

    });

    [
        "c1-hcl",
        "c2-hcl",
        "v2-hcl"
    ].forEach(id => {

        $(id)?.addEventListener(
            "input",
            calculDilution
        );

    });

    calculDissolution();
    calculDilution();

}

/* ==========================================================
   DISSOLUTION
========================================================== */

function calculDissolution() {

    const C = nombre(
        $("c-dissolution")?.value
    );

    const V = nombre(
        $("v-dissolution")?.value
    );

    const M = nombre(
        $("m-dissolution")?.value
    );

    if (
        C <= 0 ||
        V <= 0 ||
        M <= 0
    ) {

        message(
            "res-dissolution",
            "Compléter les données."
        );

        return;

    }

    const masse =
        C *
        (V / 1000) *
        M;

    $("res-dissolution").innerHTML = `

<div class="resultat">

<h3>Masse à peser</h3>

<div class="valeur">

${arrondir(masse)} g

</div>

</div>

`;

    if ($("table-masse-dissolution"))
        $("table-masse-dissolution").textContent =
            arrondir(masse);

    if ($("table-volume-dissolution"))
        $("table-volume-dissolution").textContent =
            V;

    if ($("table-calc-dissolution"))
        $("table-calc-dissolution").textContent =
            arrondir(C);

    if ($("table-theo-dissolution"))
        $("table-theo-dissolution").textContent =
            arrondir(C);

}

/* ==========================================================
   DILUTION
========================================================== */

function calculDilution() {

    const C1 = nombre(
        $("c1-hcl")?.value
    );

    const C2 = nombre(
        $("c2-hcl")?.value
    );

    const V2 = nombre(
        $("v2-hcl")?.value
    );

    if (
        C1 <= 0 ||
        C2 <= 0 ||
        V2 <= 0
    ) {

        $("res-hcl").innerHTML = "";

        return;

    }

    if (C2 >= C1) {

        $("res-hcl").innerHTML =

        `<div class="erreur">

La solution mère doit être plus concentrée.

</div>`;

        return;

    }

    const V1 =
        (C2 * V2) / C1;

    const eau =
        V2 - V1;

    $("res-hcl").innerHTML = `

<div class="resultat">

<p>

<strong>Prélever :</strong>

${arrondir(V1)} mL

de solution mère

</p>

<p>

<strong>Compléter avec :</strong>

${arrondir(eau)} mL

d'eau distillée

</p>

</div>

`;

}

/* ==========================================================
   MISE A JOUR TABLEAU
========================================================== */

function mettreAJourTableau() {

    if (!reactifCourant)
        return;

    $("nom-sel-table").textContent =
        reactifCourant.nom;

    calculDissolution();

}

