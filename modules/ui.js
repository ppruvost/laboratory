/**
 * ui.js
 * Gestion des composants visuels communs des TP Chimie
 *
 * - Affichage dynamique
 * - Boutons
 * - Messages
 * - Cartes résultats
 * - Barres de progression
 * - Modales
 */

/* ============================================================
   AFFICHAGE / MASQUAGE
   ============================================================ */

export function afficher(id) {

    const el = document.getElementById(id);

    if (el)
        el.classList.remove("hidden");

}


export function masquer(id) {

    const el = document.getElementById(id);

    if (el)
        el.classList.add("hidden");

}


export function basculer(id) {

    const el = document.getElementById(id);

    if (!el)
        return;

    el.classList.toggle("hidden");

}



/* ============================================================
   MESSAGES UTILISATEUR
   ============================================================ */


export function afficherMessage(
    id,
    texte,
    type="info"
){

    const zone =
        document.getElementById(id);


    if(!zone)
        return;


    zone.innerHTML =
    `
    <div class="message ${type}">
        ${texte}
    </div>
    `;

}



/* ============================================================
   RESULTAT CALCUL
   ============================================================ */


export function afficherResultat(
    id,
    titre,
    contenu
){

    const zone =
        document.getElementById(id);


    if(!zone)
        return;


    zone.innerHTML =
    `
    <div class="resultat">

        <h3>
            ${titre}
        </h3>

        <div class="resultat-contenu">
            ${contenu}
        </div>

    </div>
    `;


}



/* ============================================================
   CREATION BOUTON
   ============================================================ */


export function creerBouton({

    parent,
    id,
    texte,
    action,
    classe="btn"

}){


    if(!parent)
        return null;


    const bouton =
        document.createElement("button");


    bouton.id =
        id || "";


    bouton.type =
        "button";


    bouton.className =
        classe;


    bouton.textContent =
        texte;



    bouton.addEventListener(
        "click",
        action
    );


    parent.appendChild(
        bouton
    );


    return bouton;

}



/* ============================================================
   BADGES COMPETENCES
   ============================================================ */


export function badgeCompetence(
    competence
){


    const couleurs =
    {
        APP:"app",
        ANA:"ana",
        REA:"rea",
        VAL:"val",
        COM:"com"
    };


    return `

    <span class="
        badge-competence
        ${couleurs[competence] || ""}
    ">
        ${competence}
    </span>

    `;

}



/* ============================================================
   CARTE INFORMATION
   ============================================================ */


export function carteInfo({

    titre,
    lignes=[],
    icone=""

}){


    return `

    <div class="carte-info">


        <h3>

            ${icone}
            ${titre}

        </h3>


        <ul>

        ${
            lignes
            .map(
                ligne=>
                `
                <li>
                    ${ligne}
                </li>
                `
            )
            .join("")
        }

        </ul>


    </div>

    `;


}



/* ============================================================
   TABLEAU DYNAMIQUE
   ============================================================ */


export function genererTableau({

    colonnes,
    lignes

}){


    return `

    <table class="tableau">


    <thead>

        <tr>

        ${
            colonnes
            .map(
                c=>
                `<th>${c}</th>`
            )
            .join("")
        }

        </tr>

    </thead>


    <tbody>

    ${
        lignes
        .map(
            ligne=>
            `

            <tr>

            ${
                ligne
                .map(
                    cellule=>
                    `<td>${cellule}</td>`
                )
                .join("")
            }

            </tr>

            `
        )
        .join("")
    }

    </tbody>


    </table>

    `;


}



/* ============================================================
   BARRE DE PROGRESSION
   ============================================================ */


export function progression(
    id,
    valeur,
    maximum=100
){

    const zone =
        document.getElementById(id);


    if(!zone)
        return;


    const pourcentage =
        Math.min(
            100,
            valeur / maximum * 100
        );


    zone.innerHTML =
    `

    <div class="progression">

        <div
        class="progression-barre"
        style="
        width:${pourcentage}%
        ">
        </div>

    </div>

    `;


}



/* ============================================================
   MODALE SIMPLE
   ============================================================ */


export function ouvrirModale({

    titre,
    contenu

}){


    let modale =
        document.getElementById(
            "modale-ui"
        );


    if(!modale){

        modale =
            document.createElement(
                "div"
            );

        modale.id =
            "modale-ui";

        document.body.appendChild(
            modale
        );

    }



    modale.innerHTML =
    `

    <div class="modale-fond">

        <div class="modale-contenu">

            <button
            class="modale-fermer">
            ✖
            </button>


            <h2>
            ${titre}
            </h2>


            <div>
            ${contenu}
            </div>


        </div>

    </div>

    `;



    modale
    .querySelector(
        ".modale-fermer"
    )
    .onclick =
    () =>
        fermerModale();



}



export function fermerModale(){

    const modale =
        document.getElementById(
            "modale-ui"
        );


    if(modale)
        modale.innerHTML =
            "";

}



/* ============================================================
   INIT UI
   ============================================================ */


export function initUI(){

    document
    .querySelectorAll(
        "[data-toggle]"
    )
    .forEach(
        bouton=>{


            bouton.addEventListener(
                "click",
                ()=>{

                    basculer(
                        bouton.dataset.toggle
                    );

                }
            );

        }
    );

}
