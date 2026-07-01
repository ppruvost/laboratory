import products            from "../data/products.js";
import laboratoryEquipment from "../data/equipment.js";
import glassware           from "../data/glassware.js";
import dangerDB            from "../data/dangerDB.js";
import pictogrammes        from "../data/pictogrammes.js";

import { initPrintLabels } from "../data/print-labels.js";
import { showSection }     from "../modules/ui.js";

// =====================================================
// GLOBAL ACCESS (UI uniquement)
// =====================================================
window.products   = products;
window.showSection = showSection;

// =====================================================
// ÉTIQUETTES
// =====================================================
initPrintLabels(dangerDB, products);

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
// PRODUITS — rendu correct colonne par colonne
// CAS | Nom | Formule | Localisation | Pictogrammes
//     | Dangers | Prévention | Visuel
// =====================================================
function renderProductTable(data) {

    const tbody = document.getElementById("table-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    data.forEach(p => {

        const tr = document.createElement("tr");

        // ── Pictogrammes GHS : images depuis pictogrammes.js ──
        const pictoHTML = (p.pictogramme || p.pictogrammes || [])
  .map(file => {
    const picto = pictogrammes.find(px => px.image === file || px.code === file);

    const src = picto
      ? `assets/picto/${picto.image}`
      : `assets/picto/${file}`;

    return `<img src="${src}"
                 alt=""
                 title="${file}"
                 style="width:32px;height:32px;object-fit:contain;"
                 onerror="this.style.display='none'">`;
  })
  .join(" ");

        // ── Codes H (dangers) ──
        const dangersHTML = (p.dangers || [])
            .filter(code => /^H/i.test(code))
            .map(code => {
                const info = dangerDB.find(d => d.code === code);
                const label = info ? (info.text ?? info.texte ?? "") : "";
                return `<span class="badge-h" title="${label}"
                              style="color:#c0392b;font-weight:600;display:block;">
                            ${code}
                        </span>`;
            })
            .join("");

        // ── Codes P (prévention) ──
        const preventionHTML = (p.prevention || [])
            .filter(code => /^P/i.test(code))
            .map(code => {
                const info = dangerDB.find(d => d.code === code);
                const label = info ? (info.text ?? info.texte ?? "") : "";
                return `<span class="badge-p" title="${label}"
                              style="color:#1B6CA8;font-weight:600;display:block;">
                            ${code}
                        </span>`;
            })
            .join("");

        // ── Visuel produit ──
        // p.image = nom de fichier nu (soude.jpg) → préfixer le dossier assets
        const srcProduit = !p.image ? ""
            : (p.image.startsWith('http') || p.image.startsWith('/') || p.image.includes('/')
                ? p.image
                : `assets/img/products/${p.image}`);
        const visuelHTML = srcProduit
            ? `<img src="${srcProduit}" alt="${p.nom}"
                    style="width:48px;height:48px;object-fit:contain;border-radius:4px;"
                    onerror="this.style.display='none'">`
            : "";

        // ── Localisation (emplacement en salle) ──
        const localisation = p.localisation || "—";

        tr.innerHTML = `
            <td style="white-space:nowrap;">${p.cas || "—"}</td>
            <td>${p.nom || "—"}</td>
            <td style="font-family:monospace;">${p.formule || "—"}</td>
            <td>${localisation}</td>
            <td style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;">
                ${pictoHTML || "—"}
            </td>
            <td>${dangersHTML || "—"}</td>
            <td>${preventionHTML || "—"}</td>
            <td style="text-align:center;">${visuelHTML}</td>
        `;

        tbody.appendChild(tr);
    });
}

// =====================================================
// ÉQUIPEMENTS
// =====================================================
function renderEquipmentTable(data) {

    const tbody = document.getElementById("equipment-body");
    if (!tbody) return;

    tbody.innerHTML = "";

    data.forEach(eq => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${eq.domaine || "—"}</td>
            <td>${eq.nom || "—"}</td>
            <td>${eq.description || "—"}</td>
            <td>${eq.lieu || "—"}</td>
            <td>
                ${eq.noticeUtilisation
                    ? `<a href="${eq.noticeUtilisation}" target="_blank">📄</a>`
                    : "—"}
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
            <td>${g.nom || "—"}</td>
            <td>${g.contenance_ml ? g.contenance_ml + " mL" : "—"}</td>
            <td>${g.lieu || "—"}</td>
            <td>
                <img src="${!g.image ? '' : g.image.includes('/') ? g.image : `assets/img/glassware/${g.image}`}"
                     alt="${g.nom || 'verrerie'}"
                     style="height:48px;object-fit:contain;"
                     onerror="this.style.display='none'">
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// =====================================================
// INIT TABLES
// =====================================================
renderProductTable(products);
renderEquipmentTable(laboratoryEquipment);
renderGlasswareTable(glassware);

// =====================================================
// TP VIEWER
// =====================================================
const tpViewer    = document.getElementById("tpViewer");
const tpFrame     = document.getElementById("tpFrame");
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

document.getElementById("openChimie")    ?.addEventListener("click", () => openTP("tp-chimie/index.html"));
document.getElementById("openAcoustique") ?.addEventListener("click", () => openTP("tp-acoustique/index.html"));
document.getElementById("openOptique")    ?.addEventListener("click", () => openTP("tp-lumiere/index.html"));
document.getElementById("openElectricite")?.addEventListener("click", () => openTP("tp-electricite/index.html"));
document.getElementById("openMecanique")  ?.addEventListener("click", () => openTP("tp-mecanique/index.html"));
document.getElementById("openThermique")  ?.addEventListener("click", () => openTP("tp-thermique/index.html"));

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

console.log("Laboratory chargé avec succès");
