import { products } from "./data/products.js";
import laboratoryEquipment from "./data/equipment.js";
import glassware from "./data/glassware.js";

import { renderTable, showSection } from "./modules/ui.js";


// ===============================
// 🔗 RENDRE ACCESSIBLE AU HTML
// ===============================

window.showSection = showSection;

window.setActive = function(el) {
    document.querySelectorAll(".menu-item")
        .forEach(i => i.classList.remove("active"));
    el.classList.add("active");
};

window.loadInFrame = function(url) {

    // masquer sections classiques
    document.querySelectorAll(".section")
        .forEach(sec => sec.classList.remove("active"));

    // afficher iframe container
    const container = document.getElementById("external-content");
    if (container) container.classList.add("active");

    // charger URL
    const frame = document.getElementById("external-frame");
    if (frame) frame.src = url;
};

// ===============================
// 🧪 INIT PRODUITS
// ===============================
renderTable(products, () => {});

// ===============================
// ⚡ ÉQUIPEMENTS
// ===============================
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
                <a href="${eq.noticeUtilisation}" target="_blank">📄</a>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// ===============================
// 🧪 VERRERIE
// ===============================
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
                <img src="${g.image}" width="60">
            </td>
        `;

        tbody.appendChild(tr);
    });
}
// ===============================
// All Section
// ===============================
function hideAllSections() {
    document.querySelectorAll(".section").forEach(s => {
        s.classList.remove("active");
    });
}
