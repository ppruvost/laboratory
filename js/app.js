import products from "../data/products.js";
import laboratoryEquipment from "../data/equipment.js";
import glassware from "../data/glassware.js";
import dangerDB from "../data/dangerDB.js";

import { initPrintLabels } from "../data/print-labels.js";
import { renderTable, showSection } from "../modules/ui.js";


// =====================================================
// GLOBAL
// =====================================================
window.products = products;
window.showSection = showSection;


// =====================================================
// ETIQUETTES
// =====================================================
initPrintLabels(dangerDB);


// =====================================================
// NAVIGATION
// =====================================================
window.setActive = function (el) {

    document.querySelectorAll(".menu-item")
        .forEach(i => i.classList.remove("active"));

    if (el) el.classList.add("active");
};

window.loadInFrame = function (url, element = null) {

    document.querySelectorAll(".section")
        .forEach(sec => sec.classList.remove("active"));

    document.getElementById("external-content")?.classList.add("active");

    const frame = document.getElementById("external-frame");
    if (frame) frame.src = url;

    if (element) window.setActive(element);
};


// =====================================================
// PRODUITS
// =====================================================
renderTable(products, () => {});


// =====================================================
// EQUIPEMENTS
// =====================================================
function renderEquipmentTable(data) {

    const tbody = document.getElementById("equipment-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    data.forEach(eq => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${eq.domaine || "-"}</td>
            <td>${eq.nom || "-"}</td>
            <td>${eq.description || "-"}</td>
            <td>${eq.lieuStockage || "-"}</td>
            <td>
                ${eq.noticeUtilisation
                    ? `<a href="${eq.noticeUtilisation}" target="_blank">📄</a>`
                    : "-"}
            </td>
        `;

        tbody.appendChild(tr);
    });
}


// =====================================================
// VERRERIE
// =====================================================
function renderGlasswareTable(data) {

    const tbody = document.getElementById("glassware-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    data.forEach(g => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${g.nom || "-"}</td>
            <td>${g.contenance_ml || "-"}</td>
            <td>${g.lieu || "-"}</td>
            <td>
                <img src="${g.image}" alt="${g.nom || "verrerie"}" class="table-image">
            </td>
        `;

        tbody.appendChild(tr);
    });
}


// =====================================================
// INIT TABLES
// =====================================================
renderEquipmentTable(laboratoryEquipment);
renderGlasswareTable(glassware);


// =====================================================
// TP VIEWER
// =====================================================
const tpViewer = document.getElementById("tpViewer");
const tpFrame = document.getElementById("tpFrame");
const closeViewer = document.getElementById("closeViewer");

function openTP(url) {

    if (!tpViewer || !tpFrame) return;

    tpViewer.classList.remove("hidden");
    tpFrame.src = url;
}

closeViewer?.addEventListener("click", () => {

    tpViewer.classList.add("hidden");
    tpFrame.src = "";
});


// =====================================================
// TP BUTTONS
// =====================================================
document.getElementById("openChimie")
?.addEventListener("click", () => openTP("tp-chimie/index.html"));

document.getElementById("openAcoustique")
?.addEventListener("click", () => openTP("tp-acoustique/index.html"));

document.getElementById("openOptique")
?.addEventListener("click", () => openTP("tp-lumiere/index.html"));

document.getElementById("openElectricite")
?.addEventListener("click", () => openTP("tp-electricite/index.html"));

document.getElementById("openMecanique")
?.addEventListener("click", () => openTP("tp-mecanique/index.html"));

document.getElementById("openThermique")
?.addEventListener("click", () => openTP("tp-thermique/index.html"));


// =====================================================
// PROGRESS BAR
// =====================================================
let progress = 10;

window.updateProgress = function () {

    progress += 10;
    if (progress > 100) progress = 100;

    const bar = document.getElementById("bar");
    if (bar) bar.style.width = progress + "%";
};


// =====================================================
// DEBUG
// =====================================================
console.log("Laboratory chargé avec succès");
