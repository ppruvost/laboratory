import { products } from "./data/products.js";
import laboratoryEquipment from "./data/equipment.js";
import glassware from "./data/glassware.js";

import { dangerDB } from "./data/dangerDB.js";
import { initPrintLabels } from "./data/print-labels.js";
import { renderTable, showSection } from "./modules/ui.js";


// ====================================
// INITIALISATION IMPRESSION ETIQUETTES
// ====================================

initPrintLabels(dangerDB);


// ====================================
// RENDRE ACCESSIBLE AU HTML
// ====================================

window.showSection = showSection;

window.setActive = function (el) {

    document
        .querySelectorAll(".menu-item")
        .forEach(i => i.classList.remove("active"));

    if (el) {
        el.classList.add("active");
    }
};

window.loadInFrame = function (url) {

    document
        .querySelectorAll(".section")
        .forEach(sec => sec.classList.remove("active"));

    const container = document.getElementById("external-content");

    if (container) {
        container.classList.add("active");
    }

    const frame = document.getElementById("external-frame");

    if (frame) {
        frame.src = url;
    }
};


// ====================================
// REACTIFS
// ====================================

renderTable(products, () => {});


// ====================================
// EQUIPEMENTS
// ====================================

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


// ====================================
// VERRERIE
// ====================================

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
                <div class="image-container">
                    <img
                        src="${g.image}"
                        alt="${g.nom || "image"}"
                        class="table-image"
                    >
                </div>
            </td>
        `;

        tbody.appendChild(tr);
    });
}


// ====================================
// MASQUER TOUTES LES SECTIONS
// ====================================

function hideAllSections() {

    document
        .querySelectorAll(".section")
        .forEach(section => section.classList.remove("active"));
}


// ====================================
// INITIALISATION TABLEAUX
// ====================================

renderEquipmentTable(laboratoryEquipment);
renderGlasswareTable(glassware);


// ====================================
// VIEWER TP
// ====================================

const tpViewer = document.getElementById("tpViewer");
const tpFrame = document.getElementById("tpFrame");
const closeViewer = document.getElementById("closeViewer");


// ====================================
// OUVRIR UN TP
// ====================================

function openTP(url) {

    if (!tpViewer || !tpFrame) return;

    tpViewer.classList.remove("hidden");

    tpFrame.src = url;
}


// ====================================
// FERMER LE VIEWER
// ====================================

closeViewer?.addEventListener("click", () => {

    tpViewer.classList.add("hidden");

    tpFrame.src = "";
});


// ====================================
// TP CHIMIE
// ====================================

document
    .getElementById("openChimie")
    ?.addEventListener("click", () => {

        openTP("tp-chimie/index.html");

    });


// ====================================
// TP ACOUSTIQUE
// ====================================

document
    .getElementById("openAcoustique")
    ?.addEventListener("click", () => {

        openTP("tp-acoustique/index.html");

    });


// ====================================
// TP OPTIQUE
// ====================================

document
    .getElementById("openOptique")
    ?.addEventListener("click", () => {

        openTP("tp-lumiere/index.html");

    });


// ====================================
// TP ELECTRICITE
// ====================================

document
    .getElementById("openElectricite")
    ?.addEventListener("click", () => {

        openTP("tp-electricite/index.html");

    });


// ====================================
// TP MECANIQUE
// ====================================

document
    .getElementById("openMecanique")
    ?.addEventListener("click", () => {

        openTP("tp-mecanique/index.html");

    });


// ====================================
// TP THERMIQUE
// ====================================

document
    .getElementById("openThermique")
    ?.addEventListener("click", () => {

        openTP("tp-thermique/index.html");

    });


// ====================================
// DEBUG
// ====================================

console.log("Laboratory chargé avec succès");
