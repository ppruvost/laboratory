console.log("tp01-solutions.js chargé");

/* ==========================================================
   TP01 - SOLUTIONS
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

        const boutons = container.querySelectorAll(".tab-btn");

        boutons.forEach(btn => {

            btn.addEventListener("click", () => {

                const cible = btn.dataset.tab;

                boutons.forEach(b => b.classList.remove("actif"));

                container.querySelectorAll(".tab-panel")
                    .forEach(p => p.classList.remove("actif"));

                btn.classList.add("actif");

                container.querySelector("#" + cible)
                    ?.classList.add("actif");
            });
        });
    });
}

/* ==========================================================
   REACTIFS
   ========================================================== */

function initReactifs() {

    const selectSec = document.getElementById("reactif");
    const selectDis = document.getElementById("reactif-dissolution");

    if (!selectSec || !selectDis) return;

    selectSec.innerHTML = '<option value="">-- Sélectionner --</option>';
    selectDis.innerHTML = '<option value="">-- Sélectionner un sel --</option>';

    products.forEach(p => {

        // sécurité (tous produits)
        const opt1 = document.createElement("option");
        opt1.value = p.cas;
        opt1.textContent = p.nom;
        selectSec.appendChild(opt1);

        // dissolution (sels uniquement)
        if (p.categorie === "Sel") {
            const opt2 = document.createElement("option");
            opt2.value = p.nom;
            opt2.textContent = p.nom;
            selectDis.appendChild(opt2);
        }
    });

    selectSec.addEventListener("change", renderSecurite);
    selectDis.addEventListener("change", handleDissolutionSelect);
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

    const produit = products.find(p => p.cas === cas);

    if (!produit) {
        zone.innerHTML = `<div class="erreur">Produit introuvable.</div>`;
        return;
    }

    let html = `
        <div class="produit-securite">
        <h3>${produit.nom}</h3>
        <p><strong>Formule :</strong> ${produit.formule || "-"}</p>
        <div class="pictos-clp">
    `;

    const deja = new Set();

    (produit.dangers || []).forEach(code => {

        const p = pictogrammes.find(x => x.code === code);

        if (p?.image && !deja.has(p.image)) {
            deja.add(p.image);

            html += `
                <img src="../../assets/picto/${p.image}"
                class="picto-clp"
                alt="${code}">
            `;
        }
    });

    html += `</div>`;

    if (produit.obligation?.length) {
        html += `<div class="epi-bloc">
        <h4>EPI</h4>
        <p>${produit.obligation.join(" • ")}</p>
        </div>`;
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

    const liste = ["Bécher", "Fiole jaugée", "Éprouvette graduée"];

    zone.innerHTML = glassware
        .filter(v => liste.includes(v.nom))
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

async function recupererInfosMolecule(nom) {

    try {

        const url =
            `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(nom)}/property/MolecularFormula,MolecularWeight/JSON`;

        const res = await fetch(url);
        if (!res.ok) throw new Error();

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

    const produit = products.find(p => p.nom === e.target.value);
    if (!produit) return;

    const infos = await recupererInfosMolecule(produit.nom);
    if (!infos) return;

    document.getElementById("nom-reactif").textContent = produit.nom;
    document.getElementById("formule-dissolution").textContent = infos.formule;
    document.getElementById("masse-dissolution").textContent = infos.masse.toFixed(2);
    document.getElementById("m-dissolution").value = infos.masse.toFixed(2);

    calculDissolution();
}

function calculDissolution() {

    const C = parseFloat(document.getElementById("c-dissolution").value) || 0;
    const V = parseFloat(document.getElementById("v-dissolution").value) || 0;
    const M = parseFloat(document.getElementById("m-dissolution").value) || 0;

    const m = C * (V / 1000) * M;

    document.getElementById("res-dissolution").innerHTML =
        `<strong>Masse : ${m.toFixed(2)} g</strong>`;

    document.getElementById("table-masse-dissolution").textContent = m.toFixed(2);
    document.getElementById("table-calc-dissolution").textContent = C.toFixed(2);
    document.getElementById("table-volume-dissolution").textContent = V;
}

/* ==========================================================
   DILUTION
   ========================================================== */

function initCalculs() {

    ["c-dissolution", "v-dissolution", "c1-hcl", "c2-hcl", "v2-hcl"]
        .forEach(id => {

            document.getElementById(id)?.addEventListener("input", () => {
                calculDissolution();
                calculHCl();
            });
        });

    calculDissolution();
    calculHCl();
}

function calculHCl() {

    const c1 = parseFloat(document.getElementById("c1-hcl").value);
    const c2 = parseFloat(document.getElementById("c2-hcl").value);
    const v2 = parseFloat(document.getElementById("v2-hcl").value);

    const v1 = (c2 * v2) / c1;

    document.getElementById("res-hcl").innerHTML =
        `Prélever <strong>${v1.toFixed(2)} mL</strong>`;
}

/* ==========================================================
   ECARTS
   ========================================================== */

function initEcarts() {

    document.querySelectorAll(".c-exp").forEach(input => {
        input.addEventListener("input", majEcarts);
    });
}

function majEcarts() {

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
}
