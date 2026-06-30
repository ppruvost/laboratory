/* ==========================================================
   TP01 - PREPARATION DE SOLUTIONS
   tp-chimie/js/tp01-solutions.js
   ========================================================== */

import products            from "../../data/products.js";
import dangerDB            from "../../data/dangerDB.js";
import pictogrammes        from "../../data/pictogrammes.js";
import glassware           from "../../data/glassware.js";
import laboratoryEquipment from "../../data/equipment.js";
import { initBalanceErreurs } from "../../js/balance-erreurs.js";
import { imprimerCompteRendu } from "../js/print-tp01.js";

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
   INITIALISATION — exportée pour navigation.js
   ET appelée immédiatement si chargée en standalone
   ========================================================== */

export function init() {

    console.log("TP01 Solutions initialisé");

    initSections();
    initTabs();
    initReactifs();
    initMateriel();
    initCalculs();
    initResultats();
    initBalanceErreurs();
    initBoutonImpressionCR();
}

/* Appel automatique quand le script est chargé directement
   (cas du HTML standalone avec <script type="module">)    */
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

/* ==========================================================
   ACCORDEONS
   ========================================================== */

function initSections() {

    document.querySelectorAll(".section").forEach(section => {

        const titre = section.querySelector(".section-titre");
        const corps = section.querySelector(".section-corps");

        if (!titre || !corps) return;

        corps.style.display = "block";

        titre.addEventListener("click", () => {

            const ouvert = corps.style.display !== "none";
            corps.style.display = ouvert ? "none" : "block";

            const chevron = titre.querySelector(".chevron");
            if (chevron) chevron.textContent = ouvert ? "►" : "▼";
        });
    });
}

/* ==========================================================
   ONGLETS
   ========================================================== */

function initTabs() {

    document.querySelectorAll(".tabs-container").forEach(container => {

        const boutons  = container.querySelectorAll(".tab-btn");
        const panneaux = container.querySelectorAll(".tab-panel");

        boutons.forEach(btn => {

            btn.addEventListener("click", () => {

                boutons.forEach(b  => b.classList.remove("actif"));
                panneaux.forEach(p => p.classList.remove("actif"));

                btn.classList.add("actif");

                const cible = container.querySelector("#" + btn.dataset.tab);
                if (cible) cible.classList.add("actif");
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
    zone.innerHTML = `<div class="info">${texte}</div>`;
}

/* ==========================================================
   CHEMIN IMAGE
   Préfixe le dossier si le champ contient juste un nom de fichier
   ========================================================== */

function imgSrc(chemin, dossier) {

    if (!chemin) return "";

    // chemin déjà complet
    if (
        chemin.startsWith("http") ||
        chemin.startsWith("/") ||
        chemin.startsWith("../") ||
        chemin.startsWith("./") ||
        chemin.startsWith("assets/")
    ) {
        return chemin;
    }

    // uniquement si on reçoit un simple nom de fichier
    return `../assets/img/${dossier}/${chemin}`;
}

/* ==========================================================
   REACTIFS
   ========================================================== */

function initReactifs() {

    const selectSec = $("reactif");
    const selectDis = $("reactif-dissolution");

    if (!selectSec || !selectDis) return;

    selectSec.innerHTML = '<option value="">-- Sélectionner --</option>';
    selectDis.innerHTML = '<option value="">-- Sélectionner un sel --</option>';

    products.forEach(p => {

        /* Liste sécurité — tous les produits */
        const o1 = document.createElement("option");
        o1.value = p.cas;
        o1.textContent = p.nom;
        selectSec.appendChild(o1);

        /* Liste dissolution — sels uniquement */
        if (p.categorie === "Sel") {
            const o2 = document.createElement("option");
            o2.value = p.cas;
            o2.textContent = p.nom;
            selectDis.appendChild(o2);
        }
    });

    selectSec.addEventListener("change", afficherSecurite);
    selectDis.addEventListener("change", changerReactif);
}

/* ==========================================================
   SECURITE
   ========================================================== */

function afficherSecurite() {

    const select = $("reactif");
    const zone   = $("securite-bloc");

    if (!select || !zone) return;

    if (!select.value) {
        message("securite-bloc", "Sélectionner un réactif.");
        return;
    }

    const produit = products.find(p => p.cas === select.value);
    if (!produit) return;

    reactifCourant = produit;

    let html = `<h3 style="margin-bottom:.5rem;">${produit.nom}</h3>`;

    html += `<p style="margin-bottom:.5rem;">
        <strong>Formule :</strong>
        <span style="font-family:var(--font-code);color:var(--bleu-cuivre);">
            ${produit.formule}
        </span>
    </p>`;

    /* ---- Pictogrammes GHS ---- */
    if (produit.dangers?.length) {

        html += `<div class="pictos-clp">`;

        produit.dangers.forEach(code => {
            const picto = pictogrammes.find(p => p.code === code);
            if (picto) {
                html += `<img class="picto-clp"
                    src="../../assets/picto/${picto.image}"
                    alt="${code}" title="${code}">`;
            }
        });

        html += `</div>`;
    }

    /* ---- Mentions H ---- */
    if (produit.dangers?.length) {

        html += `<div class="danger-bloc"><h4>⚠️ Mentions de danger (H)</h4><ul>`;

        produit.dangers.forEach(code => {
            const h = dangerDB.find(d => d.code === code);
            if (h) {
                /* Compatibilité : certaines versions utilisent .text, d'autres .texte */
                html += `<li><strong>${code}</strong> : ${h.text ?? h.texte ?? ""}</li>`;
            }
        });

        html += `</ul></div>`;
    }

    /* ---- Mentions P ---- */
    if (produit.prevention?.length) {

        html += `<div class="prevention-bloc"><h4>🛡️ Conseils de prudence (P)</h4><ul>`;

        produit.prevention.forEach(code => {
            const p = dangerDB.find(d => d.code === code);
            if (p) {
                html += `<li><strong>${code}</strong> : ${p.text ?? p.texte ?? ""}</li>`;
            }
        });

        html += `</ul></div>`;
    }

    zone.innerHTML = html;
}

/* ==========================================================
   CHANGEMENT DE REACTIF (dissolution)
   ========================================================== */

function changerReactif() {

    const cas     = $("reactif-dissolution").value;
    const produit = products.find(p => p.cas === cas);

    if (!produit) return;

    reactifCourant = produit;

    if ($("nom-reactif"))         $("nom-reactif").textContent        = produit.nom;
    if ($("nom-sel-protocole"))   $("nom-sel-protocole").textContent = produit.nom;
    if ($("formule-dissolution")) $("formule-dissolution").textContent = produit.formule;
    if ($("masse-dissolution"))   $("masse-dissolution").textContent   = arrondir(produit.masseMolaire);
    if ($("m-dissolution"))       $("m-dissolution").value            = arrondir(produit.masseMolaire);
    if ($("nom-sel-table"))       $("nom-sel-table").textContent      = produit.nom;

    calculDissolution();
}

/* ==========================================================
   MATERIEL — cases à cocher verrerie + équipements
   ========================================================== */

function initMateriel() {

    const divVerrerie    = $("materiel-verrerie");
    const divEquipements = $("materiel-equipements");

    if (!divVerrerie || !divEquipements) return;

    /* ── Verrerie ───────────────────────────────────────────── */

    /* Si le champ categorie est renseigné, on filtre sur Dissolution ;
       sinon on affiche tout (sécurité si la donnée est absente)       */
    const verresAffiches = glassware.some(v => v.categorie)
        ? glassware.filter(v => v.categorie === "Dissolution")
        : glassware;

    divVerrerie.innerHTML = verresAffiches.map(v => {

        const src = imgSrc(v.image, "glassware");

        return `
        <label class="item-materiel">
          <input type="checkbox" class="materiel-check-input">
          <span class="icone-materiel">
            ${src
                ? `<img src="${src}" alt="${v.nom}"
                        onerror="this.style.display='none'">`
                : `🧪`
            }
          </span>
          <span class="materiel-info">
            <strong>${v.nom}</strong>
            <span class="materiel-detail">
              ${v.contenance_ml ? v.contenance_ml + " mL" : ""}
            </span>
            <span class="materiel-detail lieu">${v.lieu ?? ""}</span>
          </span>
        </label>`;

    }).join("");

    /* ── Équipements ────────────────────────────────────────── */

    const equipsAffiches = laboratoryEquipment.some(e => e.categorie)
        ? laboratoryEquipment.filter(e => e.categorie === "Dissolution")
        : laboratoryEquipment;

    divEquipements.innerHTML = equipsAffiches.map(e => {

        const src = imgSrc(e.image, "equipment");

        return `
        <label class="item-materiel">
          <input type="checkbox" class="materiel-check-input">
          <span class="icone-materiel">
            ${src
                ? `<img src="${src}" alt="${e.nom}"
                        onerror="this.style.display='none'">`
                : `🔬`
            }
          </span>
          <span class="materiel-info">
            <strong>${e.nom}</strong>
            <span class="materiel-detail">${e.description ?? ""}</span>
            <span class="materiel-detail lieu">${e.lieu ?? ""}</span>
          </span>
        </label>`;

    }).join("");
}

/* ==========================================================
   INIT CALCULS — pose les listeners
   ========================================================== */

function initCalculs() {

    ["c-dissolution", "v-dissolution", "m-dissolution"]
        .forEach(id => $(id)?.addEventListener("input", calculDissolution));

    ["c1-hcl", "c2-hcl", "v2-hcl"]
        .forEach(id => $(id)?.addEventListener("input", calculDilution));

    calculDissolution();
    calculDilution();
}

/* ==========================================================
   DISSOLUTION
   ========================================================== */

function calculDissolution() {

    const C =
