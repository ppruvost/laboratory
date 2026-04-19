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
const equipmentDiv = document.getElementById("equipment-list");

laboratoryEquipment.forEach(eq => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
        <h3>${eq.nom}</h3>
        <p><b>Domaine :</b> ${eq.domaine}</p>
        <p>${eq.description}</p>
        <a href="${eq.noticeUtilisation}" target="_blank">📄 Notice</a>
    `;

    equipmentDiv.appendChild(div);
});

// ===============================
// 🧪 VERRERIE
// ===============================
const glassDiv = document.getElementById("glassware-list");

glassware.forEach(g => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
        <h3>${g.nom}</h3>
        <p>Contenance : ${g.contenance_ml}</p>
        <img src="${g.image}" width="120">
    `;

    glassDiv.appendChild(div);
});
