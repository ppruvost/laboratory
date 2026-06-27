/* ==========================================================
   TP01 - PREPARATION DE SOLUTIONS
   tp-chimie/js/tp01-solutions.js
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

    html += `<h3 style="margin-bottom:.5rem;">${produit.nom}</h3>`;

    html += `<p style="margin-bottom:.5rem;">
        <strong>Formule :</strong>
        <span style="font-family:var(--font-code);color:var(--bleu-cuivre);">${produit.formule}</span>
    </p>`;

    /* ---- Pictogrammes ---- */

    if (produit.dangers?.length) {

        html += `<div class="pictos-clp">`;

        produit.dangers.forEach(code => {

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

        html += `</div>`;

    }

    /* ---- Mentions H ---- */

    if (produit.dangers?.length) {

        html += `<div class="danger-bloc"><h4>⚠️ Mentions de danger (H)</h4><ul>`;

        produit.dangers.forEach(code => {

            const h =
                dangerDB.find(
                    d => d.code === code
                );

            if (h) {

                html += `<li><strong>${code}</strong> : ${h.text}</li>`;

            }

        });

        html += `</ul></div>`;

    }

    /* ---- Mentions P ---- */

    if (produit.prevention?.length) {

        html += `<div class="prevention-bloc"><h4>🛡️ Conseils de prudence (P)</h4><ul>`;

        produit.prevention.forEach(code => {

            const p =
                dangerDB.find(
                    d => d.code === code
                );

            if (p) {

                html += `<li><strong>${code}</strong> : ${p.text}</li>`;

            }

        });

        html += `</ul></div>`;

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

    /* ---- afficher le bloc info si un sel est sélectionné ---- */

    const infoBloc = $("info-dissolution");
    if (infoBloc) {
        infoBloc.style.display = produit ? "block" : "none";
    }

    if (!produit) return;

    reactifCourant = produit;

    if ($("nom-reactif"))
        $("nom-reactif").textContent = produit.nom;

    if ($("formule-dissolution"))
        $("formule-dissolution").textContent = produit.formule;

    if ($("masse-dissolution"))
        $("masse-dissolution").textContent = arrondir(produit.masseMolaire);

    if ($("m-dissolution"))
        $("m-dissolution").value = arrondir(produit.masseMolaire);

    if ($("nom-sel-table"))
        $("nom-sel-table").textContent = produit.nom;

    calculDissolution();

}

/* ==========================================================
   MATERIEL
   ========================================================== */

function initMateriel() {

    const verrerie   = $("materiel-verrerie");
    const equipements = $("materiel-equipements");

    if (!verrerie || !equipements) return;

    // ── Verrerie filtrée "Dissolution" ───────────────────────
    const verresDissolution =
        glassware.filter(v => v.categorie === "Dissolution");

    verrerie.innerHTML = verresDissolution.map(v => `
        <label class="item-materiel">
            <input type="checkbox" class="materiel-check-input">
            <span class="icone-materiel">
                ${v.image
                    ? `<img src="${v.image}" alt="${v.nom}"
                            style="width:48px;height:48px;object-fit:contain;border-radius:4px;">`
                    : "🧪"}
            </span>
            <span class="materiel-info">
                <strong>${v.nom}</strong>
                <span class="materiel-detail">${v.contenance_ml ? v.contenance_ml + " mL" : ""}</span>
                <span class="materiel-detail lieu">${v.lieu ?? ""}</span>
            </span>
        </label>
    `).join("");

    // ── Équipements filtrés "Dissolution" ────────────────────
    const equipsDissolution =
        laboratoryEquipment.filter(e => e.categorie === "Dissolution");

    equipements.innerHTML = equipsDissolution.map(e => `
        <label class="item-materiel">
            <input type="checkbox" class="materiel-check-input">
            <span class="icone-materiel">
                ${e.image
    ? `<img src="/${e.image}" alt="${e.nom}"
            style="width:48px;height:48px;object-fit:contain;border-radius:4px;">`
    : "🔬"}
            </span>
            <span class="materiel-info">
                <strong>${e.nom}</strong>
                <span class="materiel-detail">${e.description ?? ""}</span>
                <span class="materiel-detail lieu">${e.lieu ?? ""}</span>
            </span>
        </label>
    `).join("");

}

/* ==========================================================
   INIT CALCULS (listeners)
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

    if (C <= 0 || V <= 0 || M <= 0) {

        message(
            "res-dissolution",
            "Compléter les données (C, V et M)."
        );

        return;

    }

    const masse = C * (V / 1000) * M;

    // Arrondi à 0,1 g (balance de précision courante)
const masseArrondie01 = Math.round(masse * 10) / 10;
// Arrondi à 1 g (balance grossière)
const masseArrondie1  = Math.round(masse);

$("res-dissolution").innerHTML = `
<div class="resultat" style="display:flex; gap:1.5rem; align-items:flex-start; flex-wrap:wrap;">

    <div>
        <h3>Masse à peser</h3>
        <div class="valeur">${arrondir(masse, 3)} g</div>
        <p style="font-size:.85rem;color:var(--gris-moyen);margin-top:.4rem;">
            m = C × V × M = ${C} × ${V / 1000} × ${M}
        </p>
    </div>

    <div style="display:flex; flex-direction:column; gap:.5rem; justify-content:center; padding-top:.3rem;">
        <div class="capsule-arrondi">
            <span class="arrondi-label">Balance ± 0,1 g</span>
            <span class="arrondi-val">${masseArrondie01.toFixed(1)} g</span>
        </div>
        <div class="capsule-arrondi">
            <span class="arrondi-label">Balance ± 1 g</span>
            <span class="arrondi-val">${masseArrondie1} g</span>
        </div>
    </div>

</div>
`;

    /* ---- Mise à jour protocole ---- */

    if ($("proto-masse"))
        $("proto-masse").textContent = `${arrondir(masse, 3)} g`;

    if ($("proto-sel") && reactifCourant)
        $("proto-sel").textContent = reactifCourant.nom;

    if ($("proto-volume"))
        $("proto-volume").textContent = `${V} mL`;

    /* ---- Mise à jour tableau résultats ---- */

    if ($("table-masse-dissolution"))
        $("table-masse-dissolution").textContent = arrondir(masse, 3);

    if ($("table-volume-dissolution"))
        $("table-volume-dissolution").textContent = V;

    if ($("table-calc-dissolution"))
        $("table-calc-dissolution").textContent = arrondir(C);

    if ($("table-theo-dissolution"))
        $("table-theo-dissolution").textContent = arrondir(C);

    /* ---- Recalculer l'écart si masse expérimentale saisie ---- */

    calculEcart();

}

/* ==========================================================
   DILUTION
   ========================================================== */

function calculDilution() {

    const C1 = nombre($("c1-hcl")?.value);
    const C2 = nombre($("c2-hcl")?.value);
    const V2 = nombre($("v2-hcl")?.value);

    if (C1 <= 0 || C2 <= 0 || V2 <= 0) {

        if ($("res-hcl")) $("res-hcl").innerHTML = "";

        return;

    }

    if (C2 >= C1) {

        $("res-hcl").innerHTML = `
        <div class="erreur">
            La concentration de la solution fille (C₂ = ${C2} mol·L⁻¹)
            doit être inférieure à celle de la solution mère (C₁ = ${C1} mol·L⁻¹).
        </div>`;

        return;

    }

    const V1 = (C2 * V2) / C1;
    const eau = V2 - V1;
    const facteur = arrondir(C1 / C2, 0);

    $("res-hcl").innerHTML = `
    <div class="resultat">
        <h3>Volumes à utiliser</h3>
        <p style="font-family:var(--font-code);font-size:1.1rem;margin-bottom:.4rem;">
            Prélever <strong>${arrondir(V1, 2)} mL</strong> de solution mère
        </p>
        <p style="font-family:var(--font-code);font-size:1.1rem;">
            Compléter avec <strong>${arrondir(eau, 2)} mL</strong> d'eau distillée
        </p>
        <p style="font-size:.82rem;color:var(--gris-moyen);margin-top:.5rem;">
            Facteur de dilution F = C₁/C₂ = ${facteur}
        </p>
    </div>
    `;

}

/* ==========================================================
   RESULTATS — Calcul d'écart relatif
   ========================================================== */

function initResultats() {

    /* Listener sur la saisie de la masse expérimentale */

    const input = $("masse-exp");

    if (!input) return;

    input.addEventListener("input", calculEcart);

}

/* ==========================================================
   ECART RELATIF
   ========================================================== */

function calculEcart() {

    const input = $("masse-exp");
    const zoneEcart = $("table-ecart");
    const zoneRes = $("res-ecart");

    if (!input || !zoneEcart) return;

    const masseExp = nombre(input.value);

    /* ---- Masse théorique depuis les champs dissolution ---- */

    const C = nombre($("c-dissolution")?.value);
    const V = nombre($("v-dissolution")?.value);
    const M = nombre($("m-dissolution")?.value);

    if (
        masseExp <= 0 ||
        C <= 0 ||
        V <= 0 ||
        M <= 0
    ) {

        zoneEcart.textContent = "—";

        if (zoneRes) zoneRes.innerHTML = "";

        return;

    }

    const masseTheo = C * (V / 1000) * M;

    const ecart =
        Math.abs((masseExp - masseTheo) / masseTheo) * 100;

    const ecartSigne =
        ((masseExp - masseTheo) / masseTheo * 100);

    /* ---- Classification qualitative ---- */

    let classe = "";
    let appreciation = "";

    if (ecart < 2) {

        classe = "ecart excellent";
        appreciation = "✅ Excellent — écart < 2 %";

    } else if (ecart < 5) {

        classe = "ecart correct";
        appreciation = "⚠️ Acceptable — écart entre 2 % et 5 %";

    } else {

        classe = "ecart erreur";
        appreciation = "❌ Écart trop important (> 5 %) — vérifier la pesée ou le calcul";

    }

    zoneEcart.innerHTML =
        `<span class="${classe}">${arrondir(ecart, 2)} %</span>`;

    if (zoneRes) {

        zoneRes.innerHTML = `
        <div class="resultat">
            <h3>Analyse de l'écart</h3>
            <p>
                Masse théorique : <strong>${arrondir(masseTheo, 3)} g</strong> |
                Masse expérimentale : <strong>${arrondir(masseExp, 3)} g</strong>
            </p>
            <p>
                Écart relatif = <strong>${arrondir(ecartSigne, 2)} %</strong>
            </p>
            <p style="margin-top:.5rem;">${appreciation}</p>
            ${ecartSigne > 0
                ? `<p style="font-size:.85rem;color:var(--gris-moyen);">
                    La concentration réelle est <strong>supérieure</strong>
                    à la concentration nominale.
                   </p>`
                : ecartSigne < 0
                ? `<p style="font-size:.85rem;color:var(--gris-moyen);">
                    La concentration réelle est <strong>inférieure</strong>
                    à la concentration nominale.
                   </p>`
                : ""
            }
        </div>
        `;

    }

}
