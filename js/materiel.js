/**
 * materiel.js
 * Gestion du matériel de laboratoire
 *
 * Fonctionnalités :
 * - affichage verrerie
 * - affichage équipements
 * - filtrage par catégorie
 * - génération HTML uniforme
 *
 * Dépend :
 *   utils.js
 */


/* ==========================================================
   IMPORTS
   ========================================================== */

import {
    imgSrc
} from "./utils.js";


/* ==========================================================
   RACCOURCI DOM
   ========================================================== */

function $(id) {
    return document.getElementById(id);
}


/* ==========================================================
   CATEGORIE
   ========================================================== */

function appartientCategorie(objet, categorie) {

    if (!objet?.categorie)
        return false;


    return Array.isArray(objet.categorie)
        ? objet.categorie.includes(categorie)
        : objet.categorie === categorie;

}


/* ==========================================================
   CREATION ITEM MATERIEL
   ========================================================== */

function creerItemMateriel(item) {


    const image =
        item.image
        ? imgSrc(item.image)
        : "";


    return `

    <label class="item-materiel">


        <input
            type="checkbox"
            class="materiel-check-input"
            data-nom="${item.nom}"
        >


        <span class="icone-materiel">

            ${
                image
                ?
                `
                <img
                    src="${image}"
                    alt="${item.nom}"
                    onerror="
                    this.style.display='none'
                    ">
                `
                :
                "🧪"
            }

        </span>



        <span class="materiel-info">


            <strong>
                ${item.nom}
            </strong>


            ${
                item.contenance_ml
                ?
                `
                <span class="materiel-detail">
                    ${item.contenance_ml} mL
                </span>
                `
                :
                ""
            }



            ${
                item.description
                ?
                `
                <span class="materiel-detail">
                    ${item.description}
                </span>
                `
                :
                ""
            }



            ${
                item.lieu
                ?
                `
                <span class="materiel-detail lieu">
                    ${item.lieu}
                </span>
                `
                :
                ""
            }



        </span>


    </label>

    `;

}


/* ==========================================================
   RENDER VERRERIE
   ========================================================== */

export function afficherVerrerie({

    containerId,
    glassware,
    categorie = null

}) {


    const zone = $(containerId);


    if (!zone)
        return;



    const liste =
        categorie
        ?
        glassware.filter(
            v =>
            appartientCategorie(
                v,
                categorie
            )
        )
        :
        glassware;



    zone.innerHTML =
        liste
        .map(creerItemMateriel)
        .join("");

}


/* ==========================================================
   RENDER EQUIPEMENTS
   ========================================================== */

export function afficherEquipements({

    containerId,
    equipment,
    categorie = null

}) {


    const zone = $(containerId);


    if (!zone)
        return;



    const liste =
        categorie
        ?
        equipment.filter(
            e =>
            appartientCategorie(
                e,
                categorie
            )
        )
        :
        equipment;



    zone.innerHTML =
        liste
        .map(creerItemMateriel)
        .join("");

}


/* ==========================================================
   INITIALISATION COMPLETE MATERIEL
   ========================================================== */

export function initMateriel({

    verreId,
    equipementId,

    glassware,
    equipment,

    categorie

}) {


    if (verreId) {

        afficherVerrerie({

            containerId: verreId,
            glassware,
            categorie

        });

    }



    if (equipementId) {

        afficherEquipements({

            containerId: equipementId,
            equipment,
            categorie

        });

    }

}


/* ==========================================================
   RECUPERATION MATERIEL SELECTIONNE
   ========================================================== */

export function getMaterielSelectionne() {


    return [
        ...document.querySelectorAll(
            ".materiel-check-input:checked"
        )
    ]
    .map(cb =>
        cb.dataset.nom
    );

}


/* ==========================================================
   RESTAURATION SELECTION
   ========================================================== */

export function restaurerMaterielSelectionne(liste = []) {


    document
    .querySelectorAll(
        ".materiel-check-input"
    )
    .forEach(cb => {


        cb.checked =
            liste.includes(
                cb.dataset.nom
            );


    });

}
