import { products } from "./data/products.js";
import laboratoryEquipment from "./data/equipment.js";
import glassware from "./data/glassware.js";

import { renderTable, showSection } from "./modules/ui.js";

// rendre accessible globalement (menu onclick)
window.showSection = showSection;
// rendre accessible globalement (menu HTML onclick)
window.openURL = function(url) {
    window.open(url, "_blank");
};

window.setActive = function(el) {
    document.querySelectorAll(".menu-item")
        .forEach(i => i.classList.remove("active"));
    el.classList.add("active");
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
