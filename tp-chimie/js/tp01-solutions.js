console.log("tp01-solutions.js chargé");

/* ==========================================================
   IMPORTS DATA
   ========================================================== */

import products from "../data/products.js";
import dangerDB from "../data/dangerDB.js";
import pictogrammes from "../data/pictogrammes.js";
import glassware from "../data/glassware.js";
import laboratoryEquipment from "../data/equipment.js";

/* ==========================================================
   INIT
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
   TABS
   ========================================================== */

function initTabs() {

    document.querySelectorAll(".tabs-container").forEach(container => {

        const buttons = container.querySelectorAll(".tab-btn");

        buttons.forEach(btn => {

            btn.addEventListener("click", () => {

                const target = btn.dataset.tab;

                buttons.forEach(b => b.classList.remove("actif"));

                container.querySelectorAll(".tab-panel")
                    .forEach(p => p.classList.remove("actif"));

                btn.classList.add("actif");

                container.querySelector("#" + target)
                    ?.classList.add("actif");
            });
        });
    });
}

/* ==========================================================
   REACTIFS
   ========================================================== */

function initReactifs() {

    const select = document.getElementById("reactif");
    const selectDiss = document.getElementById("reactif-dissolution");

    if (!select || !selectDiss) return;

    select.innerHTML = `<option value="">-- Sélectionner --</option>`;
    selectDiss.innerHTML = `<option value="">-- Sélectionner un sel --</option>`;

    products.forEach(p => {

        // sécurité
        const opt = document.createElement("option");
        opt.value = p.cas;
        opt.textContent = p.nom;
        select.appendChild(opt);

        // dissolution (sels uniquement)
        if (p.categorie === "Sel") {

            const opt2 = document.createElement("option");
            opt2.value = p.nom;
            opt2.textContent = p.nom;
            selectDiss.appendChild(opt2);
        }
    });

    select.addEventListener("change", renderSecurite);
    selectDiss.addEventListener("change", handleDissolutionSelect);
}

/* ==========================================================
   SECURITE
   ========================================================== */

function renderSecurite() {

    const select = document.getElementById("reactif");
    const zone = document.getElementById("securite-bloc");

    if (!select || !zone) return;

    const cas = select.value;

    if (!cas) {
        zone.innerHTML = `<div class="info">Sélectionner un réactif.</div>`;
        return;
    }

    const p = products.find(x => x.cas === cas);

    if (!p) return;

    let html = `
        <div class="produit-securite">
        <h3>${p.nom}</h3>
        <p><strong>Formule :</strong> ${p.formule || "-"}</p>
        <div class="pictos-clp">
    `;

    const used = new Set();

    (p.dangers || []).forEach(code => {

        const picto = pictogrammes.find(x => x.code === code);

        if (picto?.image && !used.has(picto.image)) {
            used.add(picto.image);

            html += `
                <img src="../../assets/picto/${picto.image}"
                     class="picto-clp"
                     alt="${code}">
            `;
        }
    });

    html += `</div>`;

    if (p.obligation?.length) {

        html += `
            <div class="epi-bloc">
                <h4>EPI</h4>
                <p>${p.obligation.join(" • ")}</p>
            </div>
        `;
    }

    html += `</div>`;

    zone.innerHTML = html;
}

/* ==========================================================
   VERRERIE
   ========================================================== */

function renderVerrerie() {

    const zone = document.getElementById("materiel-verrerie");
    if (!zone) return;

    const list = ["Bécher", "Fiole jaugée", "Éprouvette graduée"];

    zone.innerHTML = glassware
        .filter(v => list.includes(v.nom))
        .map(v => `
            <div class="item-materiel">
                <strong>${v.nom}</strong><br>
                ${v.contenance_ml} mL
            </div>
        `).join("");
}

/* ==========================================================
   EQUIPEMENTS
   ========================================================== */

function renderEquipements() {

    const zone = document.getElementById("materiel-equipements");
    if (!zone) return;

    zone.innerHTML = laboratoryEquipment
        .filter(e => e.domaine === "Chimie")
        .map(e => `
            <div class="item-materiel">
                <strong>${e.nom}</strong><br>
                ${e.description}
            </div>
        `).join("");
}

/* ==========================================================
   PUBCHEM
   ========================================================== */

async function getMoleculeInfo(name) {

    try {

        const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/property/MolecularFormula,MolecularWeight/JSON`;

        const res = await fetch(url);
        if (!res.ok) return null;

        const data = await res.json();
        const p = data.PropertyTable.Properties[0];

        return {
            formule: p.MolecularFormula,
            masse: Number(p.MolecularWeight)
        };

    } catch {
        return null;
    }
}

/* ==========================================================
   DISSOLUTION
   ========================================================== */

async function handleDissolutionSelect(e) {

    const p = products.find(x => x.nom === e.target.value);
    if (!p) return;

    const info = await getMoleculeInfo(p.nom);
    if (!info) return;

    document.getElementById("nom-reactif").textContent = p.nom;
    document.getElementById("formule-dissolution").textContent = info.formule;

    document.getElementById("masse-dissolution").textContent =
        info.masse.toFixed(2);

    document.getElementById("m-dissolution").value =
        info.masse.toFixed(2);

    calculDissolution();
}

/* ==========================================================
   CALCUL DISSOLUTION
   ========================================================== */

function calculDissolution() {

    const C = parseFloat(document.getElementById("c-dissolution").value) || 0;
    const V = parseFloat(document.getElementById("v-dissolution").value) || 0;
    const M = parseFloat(document.getElementById("m-dissolution").value) || 0;

    const m = C * (V / 1000) * M;

    document.getElementById("res-dissolution").innerHTML =
        `<strong>Masse : ${m.toFixed(2)} g</strong>`;

    document.getElementById("table-masse-dissolution").textContent =
        m.toFixed(2);

    document.getElementById("table-calc-dissolution").textContent =
        C.toFixed(2);
}

/* ==========================================================
   INIT CALCULS
   ========================================================== */

function initCalculs() {

    [
        "c-dissolution",
        "v-dissolution"
    ].forEach(id => {

        document.getElementById(id)?.addEventListener("input", calculDissolution);
    });

    calculDissolution();
}

/* ==========================================================
   ECARTS
   ========================================================== */

function initEcarts() {

    document.querySelectorAll(".c-exp").forEach(input => {

        input.addEventListener("input", () => {

            document.querySelectorAll(".tableau-resultats tbody tr")
                .forEach(tr => {

                    const theo = parseFloat(tr.dataset.theo);
                    const exp = parseFloat(tr.querySelector(".c-exp").value);
                    const cell = tr.querySelector(".ecart");

                    if (isNaN(theo) || isNaN(exp)) {
                        cell.textContent = "";
                        return;
                    }

                    const ecart = Math.abs((exp - theo) / theo) * 100;
                    cell.textContent = ecart.toFixed(2) + " %";
                });
        });
    });
}
