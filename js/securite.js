/**
 * securite.js
 * Gestion sécurité chimie :
 * - affichage des produits
 * - pictogrammes CLP
 * - mentions H/P
 * - EPI
 *
 * Dépend uniquement de :
 *   utils.js
 *   products.js
 *   dangerDB.js
 *   pictogrammes.js
 */

/* ==========================================================
   IMPORTS
   ========================================================== */

import {
    GHS_PICTO,
    EPI_CONFIG,
    imgSrc
} from "./utils.js";


/* ==========================================================
   RACCOURCI DOM
   ========================================================== */

function $(id) {
    return document.getElementById(id);
}


/* ==========================================================
   RECHERCHE PRODUIT
   ========================================================== */

export function trouverProduit(products, cas) {

    if (!cas || !products)
        return null;

    return products.find(p => p.cas === cas) || null;
}


/* ==========================================================
   FILTRE CATEGORIE
   ========================================================== */

export function appartientCategorie(produit, categorie) {

    if (!produit?.categorie)
        return false;

    return Array.isArray(produit.categorie)
        ? produit.categorie.includes(categorie)
        : produit.categorie === categorie;
}


/* ==========================================================
   LISTE PRODUITS
   ========================================================== */

export function remplirListeProduits({
    selectId,
    produits,
    categories = []
}) {

    const select = $(selectId);

    if (!select)
        return;


    select.innerHTML =
        `<option value="">
            -- Sélectionner --
        </option>`;


    const liste = produits
        .filter(p => {

            if (categories.length === 0)
                return true;

            return categories.some(
                cat => appartientCategorie(p, cat)
            );

        })
        .sort((a,b)=>
            a.nom.localeCompare(b.nom)
        );


    liste.forEach(p => {

        const option =
            document.createElement("option");

        option.value = p.cas;
        option.textContent = p.nom;

        select.appendChild(option);

    });

}


/* ==========================================================
   AFFICHAGE SECURITE PRODUIT
   ========================================================== */

export function afficherSecuriteProduit({
    produit,
    dangerDB,
    pictogrammes,
    zoneId
}) {

    const zone = $(zoneId);

    if (!zone)
        return;


    if (!produit) {

        zone.innerHTML =
        `<div class="info">
            Sélectionner un réactif.
        </div>`;

        return;
    }


    let html = `

    <div class="carte-securite">

        <h3>${produit.nom}</h3>

        <p>
            <strong>Formule :</strong>
            ${produit.formule || "—"}
        </p>

    `;


    /* ---------- pictogrammes ---------- */

    const dangers =
        produit.dangers ||
        produit.pictogrammes ||
        [];


    const pictos = dangers
        .map(code => {

            const picto =
                pictogrammes.find(
                    p => p.code === code
                );

            if (!picto)
                return "";


            return `
            <img
                class="picto-clp"
                src="${imgSrc(
                    "assets/picto/" + picto.image
                )}"
                alt="${code}"
                title="${code}">
            `;

        })
        .join("");



    if (pictos) {

        html += `

        <div class="pictos-clp">
            ${pictos}
        </div>

        `;

    }



    /* ---------- mentions H ---------- */

    const mentionsH =
        dangers
        .filter(c => /^H\d+/i.test(c))
        .map(code => {

            const h =
                dangerDB.find(
                    d => d.code === code
                );

            if (!h)
                return "";


            return `
            <li>
                <strong>${code}</strong>
                :
                ${h.text || h.texte || ""}
            </li>
            `;

        })
        .join("");



    if (mentionsH) {

        html += `

        <div class="danger-bloc">

            <h4>
                ⚠️ Mentions de danger
            </h4>

            <ul>
                ${mentionsH}
            </ul>

        </div>

        `;

    }



    /* ---------- conseils P ---------- */


    const prevention =
        produit.prevention ||
        [];


    const mentionsP =
        prevention
        .map(code => {

            const p =
                dangerDB.find(
                    d => d.code === code
                );


            if (!p)
                return "";


            return `
            <li>
                <strong>${code}</strong>
                :
                ${p.text || p.texte || ""}
            </li>
            `;

        })
        .join("");



    if (mentionsP) {

        html += `

        <div class="prevention-bloc">

            <h4>
                🛡️ Conseils de prudence
            </h4>

            <ul>
                ${mentionsP}
            </ul>

        </div>

        `;

    }



    html += `</div>`;


    zone.innerHTML = html;

}



/* ==========================================================
   BLOC SECURITE COMPLET
   ========================================================== */

export function genererBlocSecurite({
    produits,
    dangerDB,
    pictogrammes
}) {


    return produits
    .map(p => {


        let html = `

        <div class="produit-carte">

            <h3>${p.nom}</h3>

            <p>
                ${p.formule || ""}
            </p>

        `;


        const dangers =
            p.dangers || [];


        html += dangers
        .map(code => {

            const picto =
                pictogrammes.find(
                    x => x.code === code
                );


            if (!picto)
                return "";


            return `
            <img
            class="picto-clp"
            src="${imgSrc(
                "assets/picto/" + picto.image
            )}">
            `;

        })
        .join("");



        html += `</div>`;


        return html;


    })
    .join("");

}


/* ==========================================================
   EPI
   ========================================================== */

export function afficherEPI(zoneId, listeEPI = []) {

    const zone = $(zoneId);

    if (!zone)
        return;


    zone.innerHTML =
    listeEPI
    .map(e => {


        const epi =
            EPI_CONFIG[e];


        if (!epi)
            return "";


        return `

        <div class="epi-item">

            <img
            src="${imgSrc(epi.img)}"
            alt="${epi.label}">

            <span>
            ${epi.label}
            </span>

        </div>

        `;

    })
    .join("");

}
