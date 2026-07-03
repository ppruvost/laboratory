import products            from "../../data/products.js";
import dangerDB            from "../../data/dangerDB.js";
import pictogrammes        from "../../data/pictogrammes.js";
import glassware           from "../../data/glassware.js";
import laboratoryEquipment from "../../data/equipment.js";
import { initBalanceErreurs } from "../../js/balance-erreurs.js";
import { genererCompteRendu } from "../../js/compte-rendu.js";

/* ==========================================================
   VARIABLES
   ========================================================== */
let reactifCourant = null;

/* ==========================================================
   RACCOURCI DOM
   ========================================================== */
function $(id) { return document.getElementById(id); }

/* ==========================================================
   INITIALISATION
   ========================================================== */
let dejaInitialise = false;

export function init() {
    if (dejaInitialise) { console.log("TP01 déjà initialisé, appel ignoré"); return; }
    dejaInitialise = true;
    console.log("TP01 Solutions initialisé");
    initSections();
    initTabs();
    afficherModeOperatoire("dissolution");
    initReactifs();
    initMateriel();
    initCalculs();
    initResultats();
    initBalanceErreurs();
    initBoutonImpressionCR();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else { init(); }

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

        const boutons = container.querySelectorAll(".tab-btn");
        const panneaux = container.querySelectorAll(".tab-panel");

        boutons.forEach(btn => {

            btn.addEventListener("click", () => {

                boutons.forEach(b => b.classList.remove("actif"));
                panneaux.forEach(p => p.classList.remove("actif"));

                btn.classList.add("actif");

                const cible = container.querySelector("#" + btn.dataset.tab);

                if (cible)
                    cible.classList.add("actif");

                afficherModeOperatoire(btn.dataset.tab);

            });

        });

    });

}
/* ==========================================================
   MODE OPERATOIRE
========================================================== */

function afficherModeOperatoire(type) {

    const dissolution = document.getElementById("modeDissolution");
    const dilution    = document.getElementById("modeDilution");

    if (!dissolution || !dilution) return;

    if (type === "dissolution") {

        dissolution.classList.remove("hidden");
        dilution.classList.add("hidden");

    } else {

        dissolution.classList.add("hidden");
        dilution.classList.remove("hidden");

    }

}

/* ==========================================================
   OUTILS
   ========================================================== */
function nombre(v)        { const n = parseFloat(v); return isNaN(n) ? 0 : n; }
function arrondir(v, d=2) { return Number(v).toFixed(d); }
function lireTexte(id)    { return ($( id)?.value || '').trim(); }

function message(id, texte) {
    const zone = $(id);
    if (!zone) return;
    zone.innerHTML = `<div class="info">${texte}</div>`;
}

function imgSrc(chemin) {

    if (!chemin) return "";

    if (
        chemin.startsWith("http") ||
        chemin.startsWith("/") ||
        chemin.startsWith("../") ||
        chemin.startsWith("./")
    ) {
        return chemin;
    }

    // Les données contiennent déjà "assets/..."
    if (chemin.startsWith("assets/")) {
        return "../" + chemin;
    }

    return "../tp-chimie/assets/images/" + chemin;
}

/* ==========================================================
   REACTIFS
   ========================================================== */
function initReactifs() {

    const selectSec = $("reactif");
    const selectDis = $("reactif-dissolution");

    if (!selectSec || !selectDis) return;

    // Menu Dissolution : uniquement les sels
    selectDis.innerHTML = '<option value="">-- Sélectionner un sel --</option>';

    products
        .filter(p => p.categorie === "Sel")
        .sort((a,b)=>a.nom.localeCompare(b.nom))
        .forEach(p => {

            const opt = document.createElement("option");
            opt.value = p.cas;
            opt.textContent = p.nom;

            selectDis.appendChild(opt);

        });

    // Construction du menu Sécurité
    remplirListeReactifs();

    // Evènements
    selectSec.addEventListener("change", afficherSecurite);
    selectDis.addEventListener("change", changerReactif);

    document.querySelectorAll(".filtre-cat").forEach(cb => {
        cb.addEventListener("change", remplirListeReactifs);
    });

}

function remplirListeReactifs() {

    const select = $("reactif");

    if (!select) return;

    // catégories cochées
    const categories = [...document.querySelectorAll(".filtre-cat:checked")]
        .map(cb => cb.value);

    // Si rien n'est coché, la liste est vide
    if (categories.length === 0) {

        select.innerHTML =
            '<option value="">-- Aucun filtre sélectionné --</option>';

        return;
    }

    const valeur = select.value;

    select.innerHTML =
        '<option value="">-- Sélectionner --</option>';

    products

        .filter(p => categories.includes(p.categorie))

        .sort((a,b)=>a.nom.localeCompare(b.nom))

        .forEach(p => {

            const option = document.createElement("option");

            option.value = p.cas;
            option.textContent = p.nom;

            if (p.cas === valeur)
                option.selected = true;

            select.appendChild(option);

        });

}
/* ==========================================================
   SECURITE
   ========================================================== */
function afficherSecurite() {
    const select = $("reactif");
    const zone   = $("securite-bloc");
    if (!select || !zone) return;
    if (!select.value) { message("securite-bloc", "Sélectionner un réactif."); return; }
    const produit = products.find(p => p.cas === select.value);
    if (!produit) return;
    reactifCourant = produit;

    let html = `<h3 style="margin-bottom:.5rem;">${produit.nom}</h3>
    <p><strong>Formule :</strong>
       <span style="font-family:var(--font-code);color:var(--bleu-cuivre);">${produit.formule}</span>
    </p>`;

    if (produit.dangers?.length) {
        html += `<div class="pictos-clp">`;
        produit.dangers.forEach(code => {
            const picto = pictogrammes.find(p => p.code === code);
            if (picto) html += `<img class="picto-clp" src="../../assets/picto/${picto.image}" alt="${code}" title="${code}">`;
        });
        html += `</div>`;
        html += `<div class="danger-bloc"><h4>⚠️ Mentions de danger (H)</h4><ul>`;
        produit.dangers.forEach(code => {
            const h = dangerDB.find(d => d.code === code);
            if (h) html += `<li><strong>${code}</strong> : ${h.text ?? h.texte ?? ""}</li>`;
        });
        html += `</ul></div>`;
    }
    if (produit.prevention?.length) {
        html += `<div class="prevention-bloc"><h4>🛡️ Conseils de prudence (P)</h4><ul>`;
        produit.prevention.forEach(code => {
            const p = dangerDB.find(d => d.code === code);
            if (p) html += `<li><strong>${code}</strong> : ${p.text ?? p.texte ?? ""}</li>`;
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
    if ($("nom-reactif"))         $("nom-reactif").textContent         = produit.nom;
    if ($("nom-sel-protocole"))   $("nom-sel-protocole").textContent   = produit.nom;
    if ($("formule-dissolution")) $("formule-dissolution").textContent  = produit.formule;
    if ($("masse-dissolution"))   $("masse-dissolution").textContent    = arrondir(produit.masseMolaire);
    if ($("m-dissolution"))       $("m-dissolution").value             = arrondir(produit.masseMolaire);
    if ($("nom-sel-table"))       $("nom-sel-table").textContent       = produit.nom;
    calculDissolution();
}

/* ==========================================================
   MATERIEL
   ========================================================== */
function initMateriel() {
    const divV = $("materiel-verrerie");
    const divE = $("materiel-equipements");
    if (!divV || !divE) return;

    const verres = glassware.some(v => v.categorie)
        ? glassware.filter(v => v.categorie === "Dissolution") : glassware;

    divV.innerHTML = verres.map(v => {
        const src = imgSrc(v.image, "glassware");
        return `<label class="item-materiel">
          <input type="checkbox" class="materiel-check-input">
          <span class="icone-materiel">${src ? `<img src="${src}" alt="${v.nom}" onerror="this.style.display='none'">` : `🧪`}</span>
          <span class="materiel-info">
            <strong>${v.nom}</strong>
            <span class="materiel-detail">${v.contenance_ml ? v.contenance_ml + " mL" : ""}</span>
            <span class="materiel-detail lieu">${v.lieu ?? ""}</span>
          </span></label>`;
    }).join("");

    const equips = laboratoryEquipment.some(e => e.categorie)
        ? laboratoryEquipment.filter(e => e.categorie === "Dissolution") : laboratoryEquipment;

    divE.innerHTML = equips.map(e => {
        const src = imgSrc(e.image, "equipment");
        return `<label class="item-materiel">
          <input type="checkbox" class="materiel-check-input">
          <span class="icone-materiel">${src ? `<img src="${src}" alt="${e.nom}" onerror="this.style.display='none'">` : `🔬`}</span>
          <span class="materiel-info">
            <strong>${e.nom}</strong>
            <span class="materiel-detail">${e.description ?? ""}</span>
            <span class="materiel-detail lieu">${e.lieu ?? ""}</span>
          </span></label>`;
    }).join("");
}

/* ==========================================================
   CALCULS
   ========================================================== */
function initCalculs() {
    ["c-dissolution","v-dissolution","m-dissolution"].forEach(id => $(id)?.addEventListener("input", calculDissolution));
    ["c1-hcl","c2-hcl","v2-hcl"].forEach(id => $(id)?.addEventListener("input", calculDilution));
    calculDissolution();
    calculDilution();
}

function calculDissolution() {
    const C = nombre($("c-dissolution")?.value);
    const V = nombre($("v-dissolution")?.value);
    const M = nombre($("m-dissolution")?.value);
    if (C <= 0 || V <= 0 || M <= 0) { message("res-dissolution", "Compléter les données (C, V et M)."); return; }

    const masse           = C * (V / 1000) * M;
    const masseArrondie01 = Math.round(masse * 10) / 10;
    const masseArrondie1  = Math.round(masse);

    $("res-dissolution").innerHTML = `
    <div class="resultat" style="display:flex;gap:1.5rem;align-items:flex-start;flex-wrap:wrap;">
      <div>
        <h3>Masse à peser</h3>
        <div class="valeur">${arrondir(masse, 3)} g</div>
        <p style="font-size:.85rem;color:var(--gris-moyen);margin-top:.4rem;">
          m = C × V × M = ${C} × ${V/1000} × ${M}</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:.5rem;justify-content:center;padding-top:.3rem;">
        <div class="capsule-arrondi">
          <span class="arrondi-label">Balance ± 0,1 g</span>
          <span class="arrondi-val">${masseArrondie01.toFixed(1)} g</span>
        </div>
        <div class="capsule-arrondi">
          <span class="arrondi-label">Balance ± 1 g</span>
          <span class="arrondi-val">${masseArrondie1} g</span>
        </div>
      </div>
    </div>`;

    if ($("table-masse-dissolution"))  $("table-masse-dissolution").textContent  = arrondir(masse, 3);
    if ($("table-volume-dissolution")) $("table-volume-dissolution").textContent = V;
    if ($("table-calc-dissolution"))   $("table-calc-dissolution").textContent   = arrondir(C);
    if ($("table-theo-dissolution"))   $("table-theo-dissolution").textContent   = arrondir(C);

    const peTheo = $("pe-masse-theo");
    if (peTheo && !peTheo.value) {
        peTheo.value = arrondir(masse, 3);
        peTheo.dispatchEvent(new Event("input"));
    }
}

function calculDilution() {
    const C1 = nombre($("c1-hcl")?.value);
    const C2 = nombre($("c2-hcl")?.value);
    const V2 = nombre($("v2-hcl")?.value);
    if (C1 <= 0 || C2 <= 0 || V2 <= 0) { if ($("res-hcl")) $("res-hcl").innerHTML = ""; return; }
    if (C2 >= C1) {
        $("res-hcl").innerHTML = `<div class="erreur">C₂ = ${C2} mol·L⁻¹ doit être inférieure à C₁ = ${C1} mol·L⁻¹.</div>`;
        return;
    }
    const V1  = (C2 * V2) / C1;
    const eau = V2 - V1;
    $("res-hcl").innerHTML = `
    <div class="resultat">
      <h3>Volumes à utiliser</h3>
      <p style="font-family:var(--font-code);font-size:1.1rem;margin-bottom:.4rem;">
        Prélever <strong>${arrondir(V1, 2)} mL</strong> de solution mère</p>
      <p style="font-family:var(--font-code);font-size:1.1rem;">
        Compléter avec <strong>${arrondir(eau, 2)} mL</strong> d'eau distillée</p>
      <p style="font-size:.82rem;color:var(--gris-moyen);margin-top:.5rem;">
        Facteur de dilution F = C₁/C₂ = ${arrondir(C1/C2, 0)}</p>
    </div>`;
}

/* ==========================================================
   RÉSULTATS / ÉCART
   ========================================================== */
function initResultats() {
    const inp = $("masse-exp-pesee");
    if (inp) inp.addEventListener("input", calculEcart);
}

function calculEcart() {
    const zoneEcart = $("table-ecart");
    const zoneRes   = $("res-ecart");
    const masseExp  = nombre($("masse-exp-pesee")?.value);
    const C = nombre($("c-dissolution")?.value);
    const V = nombre($("v-dissolution")?.value);
    const M = nombre($("m-dissolution")?.value);
    if (masseExp <= 0 || C <= 0 || V <= 0 || M <= 0) { if (zoneEcart) zoneEcart.textContent = "—"; if (zoneRes) zoneRes.innerHTML = ""; return; }

    const masseTheo  = C * (V / 1000) * M;
    const ecart      = Math.abs((masseExp - masseTheo) / masseTheo) * 100;
    const ecartSigne = ((masseExp - masseTheo) / masseTheo) * 100;

    let classe = "", appr = "";
    if      (ecart < 2) { classe = "ecart excellent"; appr = "✅ Excellent — écart < 2 %"; }
    else if (ecart < 5) { classe = "ecart correct";   appr = "⚠️ Acceptable — entre 2 % et 5 %"; }
    else                { classe = "ecart erreur";    appr = "❌ Écart > 5 % — vérifier la pesée"; }

    if (zoneEcart) zoneEcart.innerHTML = `<span class="${classe}">${arrondir(ecart, 2)} %</span>`;
    if (zoneRes) zoneRes.innerHTML = `
      <div class="resultat">
        <h3>Analyse de l'écart</h3>
        <p>Masse théorique : <strong>${arrondir(masseTheo, 3)} g</strong> |
           Masse pesée : <strong>${arrondir(masseExp, 3)} g</strong></p>
        <p>Écart relatif = <strong>${arrondir(ecartSigne, 2)} %</strong></p>
        <p style="margin-top:.5rem;">${appr}</p>
        ${Math.abs(ecartSigne) > 0.01
          ? `<p style="font-size:.85rem;color:var(--gris-moyen);">
             La concentration réelle est <strong>${ecartSigne > 0 ? "supérieure" : "inférieure"}</strong> à la valeur nominale.</p>`
          : ""}
      </div>`;
}

/* ==========================================================
   BOUTON IMPRESSION
   ========================================================== */
function initBoutonImpressionCR() {
    const navTp = document.querySelector(".nav-tp");
    if (!navTp) return;
    if (navTp.querySelector("#btn-imprimer-cr")) return;

    const btn = document.createElement("button");
    btn.id = "btn-imprimer-cr";
    btn.type = "button";
    btn.className = "btn btn-primaire";
    btn.textContent = "📄 Imprimer le compte-rendu";
    btn.addEventListener("click", _lancerCompteRendu);

    const btnExistant = navTp.querySelector("a.btn-primaire");
    if (btnExistant) navTp.insertBefore(btn, btnExistant);
    else navTp.appendChild(btn);
}

/* ==========================================================
   COLLECTE ET APPEL genererCompteRendu
   ========================================================== */
function _lancerCompteRendu() {

    /* ── Identité pré-remplie depuis les champs HTML ── */
    const identiteDefaut = {
        nom:    lireTexte("nom-eleve"),
        prenom: lireTexte("prenom-eleve"),
        classe: lireTexte("classe-eleve"),
        date:   $("date-eleve")?.value || "",
    };

    /* ── Données de dissolution ── */
    const nomReactif = reactifCourant?.nom || $("nom-sel-table")?.textContent || "—";
    const formule    = reactifCourant?.formule || $("formule-dissolution")?.textContent || "—";
    const masseMol   = $("m-dissolution")?.value  || "—";
    const C          = $("c-dissolution")?.value  || "—";
    const V          = $("v-dissolution")?.value  || "—";
    const masseTheo  = $("table-masse-dissolution")?.textContent || "—";
    const masseExp   = $("masse-exp-pesee")?.value || "—";
    const ecartAff   = $("table-ecart")?.textContent?.replace(/\s/g, "") || "—";

    /* ── Données de dilution ── */
    const C1  = $("c1-hcl")?.value || "—";
    const C2  = $("c2-hcl")?.value || "—";
    const V2v = $("v2-hcl")?.value || "—";
    const V1calc = (nombre(C2) > 0 && nombre(C1) > 0)
        ? arrondir((nombre(C2) * nombre(V2v)) / nombre(C1), 2) : "—";

    /* ── Résumé ── */
    const resume = lireTexte("resume-tp");

    /* ══════════════════════════════════════════════════════
       SECTIONS DU COMPTE-RENDU
       Chaque question porte :
         groupe      → filtre "dissolution" ou "dilution"
         competence  → badge coloré APP / REA / ANA RAI / VAL / COM
         notation    → true → cases 0/1/2 à droite
       ══════════════════════════════════════════════════════ */
    const sections = [

        /* ─── Partie Dissolution ─────────────────────────── */
        {
            groupe: "dissolution",
            titre: "Paramètres de la dissolution",
            items: [
                { label: "Réactif",          valeur: `${nomReactif} (${formule})` },
                { label: "Masse molaire M",   valeur: `${masseMol} g/mol` },
                { label: "Concentration C",   valeur: `${C} mol/L` },
                { label: "Volume V",          valeur: `${V} mL` },
                { label: "Masse théorique m", valeur: `${masseTheo} g` },
                { label: "Masse pesée",       valeur: masseExp !== "—" ? `${masseExp} g` : "non renseignée" },
                { label: "Écart relatif",     valeur: ecartAff },
            ],
        },
        {
            groupe: "dissolution",
            titre: "1A — Qu'est-ce qu'une dissolution ? Qu'est-ce qu'une dilution ? Expliquer la différence.",
            competence: "APP",
            notation: true,
            texte: lireTexte("question1"),
        },
        {
            groupe: "dissolution",
            titre: "2A — Pourquoi faut-il toujours verser l'acide dans l'eau et jamais l'inverse ?",
            competence: "APP",
            notation: true,
            texte: lireTexte("question2"),
        },
        {
            groupe: "dissolution",
            titre: "3A — Convertir le volume V utilisé de mL en L.",
            competence: "REA",
            notation: true,
            texte: lireTexte("question3"),
        },
        {
            groupe: "dissolution",
            titre: "4A — Calculer la quantité de matière n du réactif à partir de la masse théorique et de M.",
            competence: "REA",
            notation: true,
            texte: lireTexte("question4"),
        },
        {
            groupe: "dissolution",
            titre: "5A — Convertir la masse théorique calculée de g en mg.",
            competence: "REA",
            notation: true,
            texte: lireTexte("question5"),
        },
        {
            groupe: "dissolution",
            titre: "6A — Calculer la concentration massique Cm (g/L) de la solution préparée.",
            competence: "REA",
            notation: true,
            texte: lireTexte("question6"),
        },
        {
            groupe: "dissolution",
            titre: "7A — Calculer l'erreur absolue Δm entre la masse théorique et la masse pesée.",
            competence: "ANA RAI",
            notation: true,
            texte: lireTexte("question7"),
        },
        {
            groupe: "dissolution",
            titre: "8A — Calculer l'erreur relative (%). Cette erreur est-elle acceptable (seuil 2 %) ?",
            competence: "ANA RAI",
            notation: true,
            texte: lireTexte("question8"),
        },
        {
            groupe: "dissolution",
            titre: "9A — Identifier les sources d'erreurs expérimentales et proposer des améliorations.",
            competence: "VAL",
            notation: true,
            texte: lireTexte("question9"),
        },
        {
            groupe: "dissolution",
            titre: "10A — Rédiger une conclusion synthétique (nature, concentration molaire, qualité de la pesée).",
            competence: "COM",
            notation: true,
            texte: lireTexte("question10"),
        },

        /* ─── Partie Dilution (1ère Bac Pro seulement) ───── */
        {
            groupe: "dilution",
            titre: "Paramètres de la dilution (C₁V₁ = C₂V₂)",
            items: [
                { label: "Concentration mère C₁",  valeur: `${C1} mol/L` },
                { label: "Concentration fille C₂", valeur: `${C2} mol/L` },
                { label: "Volume final V₂",         valeur: `${V2v} mL` },
                { label: "Volume à prélever V₁",    valeur: `${V1calc} mL` },
            ],
        },
        ...(resume ? [{
            titre: "Résumé du TP",
            texte: resume,
        }] : []),
    ];

    /* ── Appel du module commun ── */
    genererCompteRendu({
        domaine:       "Chimie",
        tp:            "TP01",
        titre:         "Préparation de solutions par dissolution et dilution",
        sections,
        identiteDefaut,
        signature:     false,    // pas de bloc signature élève/professeur
        noteFinale:    true,     // encadré note /20 calculé sur les questions notées

        /* Dialogue "Parties à imprimer" affiché en premier */
        groupes: [
            {
                id:     "dissolution",
                label:  "Dissolution — Préparation d'une solution par pesée",
                niveau: "2nde et 1ère Bac Pro",
                defaut: true,
            },
            {
                id:     "dilution",
                label:  "Dilution — Préparation d'une solution par dilution",
                niveau: "1ère Bac Pro uniquement",
                defaut: false,   // décochée par défaut (2nde ne fait pas la dilution)
            },
        ],
    });
}
