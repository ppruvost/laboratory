/**
 * tp01-solutions.js
 *
 * TP01 — Préparation de solutions
 *
 * Architecture modulaire :
 *  - utils.js
 *  - securite.js
 *  - materiel.js
 *  - calculs.js
 *  - radar.js
 */


/* ==========================================================
   IMPORTS
   ========================================================== */

import products
    from "../../data/products.js";

import dangerDB
    from "../../data/dangerDB.js";

import pictogrammes
    from "../../data/pictogrammes.js";

import glassware
    from "../../data/glassware.js";

import laboratoryEquipment
    from "../../data/equipment.js";


import {
    initSections,
    initTabs,
    lireTexte,
    appliquerFiltresCategorie,
    appartientCategorie
}
from "../../js/utils.js";


import {
    afficherSecuriteProduit,
    trouverProduit
}
from "../../js/securite.js";


import {
    initMateriel,
    getMaterielSelectionne
}
from "../../js/materiel.js";


import {
    calculDissolution,
    calculDilution,
    calculEcart
}
from "../../js/calculs.js";


import {
    initRadarCompetences
}
from "../../js/radar.js";


import {
    initBalanceErreurs
}
from "../../js/balance-erreurs.js";


import {
    genererCompteRendu
}
from "../../js/compte-rendu.js";

/* ==========================================================
   VARIABLES
   ========================================================== */


let reactifCourant = null;

let dejaInitialise = false;



/* ==========================================================
   RACCOURCI DOM
   ========================================================== */

function $(id) {
    return document.getElementById(id);
}



/* ==========================================================
   INITIALISATION TP01
   ========================================================== */


export function init() {


    if (dejaInitialise)
        return;


    dejaInitialise = true;


    console.log(
        "TP01 Solutions initialisé"
    );



    initSections();

    initTabs();


    initReactifs();


    initMateriel({

        verreId:
            "materiel-verrerie",

        equipementId:
            "materiel-equipements",

        glassware,

        equipment:
            laboratoryEquipment,

        categorie:
            "Dissolution"

    });



    initCalculsTP01();


    initResultats();


    initBalanceErreurs();


    initBoutonImpressionCR();


    initRadarCompetences();


}





if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        init
    );

}
else {

    init();

}




/* ==========================================================
   MODE OPERATOIRE
   ========================================================== */


function afficherModeOperatoire(type) {


    const dissolution =
        $("modeDissolution");


    const dilution =
        $("modeDilution");



    if (!dissolution || !dilution)
        return;



    if(type==="dissolution") {

        dissolution.classList.remove(
            "hidden"
        );

        dilution.classList.add(
            "hidden"
        );

    }
    else {

        dissolution.classList.add(
            "hidden"
        );

        dilution.classList.remove(
            "hidden"
        );

    }

}
/* ==========================================================
   REACTIFS
   ========================================================== */


/* ==========================================================
   REACTIFS (identique TP03)
   ========================================================== */

function initReactifs() {

    const selectSec = $("reactif");
    const selectDis = $("reactif-dissolution");

    /* -----------------------------
       MENU DISSOLUTION
    ----------------------------- */

    if (selectDis) {

        selectDis.innerHTML = `
            <option value="">
                -- Sélectionner un sel --
            </option>
        `;

        products
            .filter(p => appartientCategorie(p, "Sel"))
            .sort((a, b) => a.nom.localeCompare(b.nom, "fr"))
            .forEach(p => {

                const option = document.createElement("option");

                option.value = p.cas;
                option.textContent = p.nom;

                selectDis.appendChild(option);

            });

        selectDis.addEventListener(
            "change",
            changerReactif
        );
    }

    /* -----------------------------
       MENU SECURITE
       (copie conforme TP03)
    ----------------------------- */

    if (!selectSec)
        return;

    function rafraichir() {

        appliquerFiltresCategorie(
            selectSec,
            products,
            "filtre-cat"
        );

        afficherSecurite();

    }

    document
        .querySelectorAll(".filtre-cat")
        .forEach(cb =>
            cb.addEventListener(
                "change",
                rafraichir
            )
        );

    selectSec.addEventListener(
        "change",
        afficherSecurite
    );

    rafraichir();

}


/* ==========================================================
   CONSTRUCTION LISTE SECURITE
   ========================================================== */


function remplirListeReactifs() {


    const select =
        $("reactif");


    if (!select)
        return;



    const categories =
        [
            ...
            document.querySelectorAll(
                ".filtre-cat:checked"
            )
        ]

        .map(
            cb =>
            cb.value
        );



    const ancienneValeur =
        select.value;



    select.innerHTML =
    `
    <option value="">
        -- Sélectionner --
    </option>
    `;



    products

    .filter(
        p => {


            if(categories.length===0)
                return false;



            return categories.some(
                cat =>
                appartientCategorie(
                    p,
                    cat
                )
            );


        }
    )


    .sort(
        (a,b)=>
        a.nom.localeCompare(
            b.nom
        )
    )


    .forEach(
        p=>{


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                p.cas;


            option.textContent =
                p.nom;



            if(
                p.cas===ancienneValeur
            )
                option.selected=true;



            select.appendChild(
                option
            );


        }
    );



    afficherSecurite();

}



/* ==========================================================
   AFFICHAGE SECURITE
   ========================================================== */


function afficherSecurite() {


    const cas =
        $("reactif")?.value;



    const produit =
        trouverProduit(
            products,
            cas
        );



    reactifCourant =
        produit;



    afficherSecuriteProduit({

        produit,

        dangerDB,

        pictogrammes,

        zoneId:
            "securite-bloc"

    });


}





/* ==========================================================
   CHANGEMENT REACTIF DISSOLUTION
   ========================================================== */


function changerReactif() {


    const cas =
        $("reactif-dissolution")
        ?.value;



    const produit =
        trouverProduit(
            products,
            cas
        );



    if(!produit)
        return;



    reactifCourant =
        produit;



    const correspondances = {


        "nom-reactif":
            produit.nom,


        "nom-sel-protocole":
            produit.nom,


        "formule-dissolution":
            produit.formule,


        "nom-sel-table":
            produit.nom


    };



    Object.entries(
        correspondances
    )

    .forEach(
        ([id,val])=>{


            const el =
                $(id);



            if(el)
                el.textContent =
                    val;


        }
    );



    const masse =
        $("m-dissolution");



    if(masse)
        masse.value =
            produit.masseMolaire || "";



    calculDissolution();


}



/* ==========================================================
   CALCULS TP01
   ========================================================== */


function initCalculsTP01() {


    [
        "c-dissolution",
        "v-dissolution",
        "m-dissolution"

    ]

    .forEach(
        id=>{

            $(id)?.addEventListener(
                "input",
                calculDissolution
            );

        }
    );



    [

        "c1-hcl",
        "c2-hcl",
        "v2-hcl"

    ]

    .forEach(
        id=>{

            $(id)?.addEventListener(
                "input",
                calculDilution
            );

        }
    );



    $("masse-exp-pesee")
    ?.addEventListener(
        "input",
        calculEcart
    );



    calculDissolution();

    calculDilution();


}



/* ==========================================================
   RESULTATS
   ========================================================== */


function initResultats() {


    const input =
        $("masse-exp-pesee");


    if(input)
        input.addEventListener(
            "input",
            calculEcart
        );


}
/* ==========================================================
   BOUTON IMPRESSION COMPTE-RENDU
   ========================================================== */


function initBoutonImpressionCR() {


    const navTp =
        document.querySelector(
            ".nav-tp"
        );


    if(!navTp)
        return;



    if(
        navTp.querySelector(
            "#btn-imprimer-cr"
        )
    )
        return;



    const btn =
        document.createElement(
            "button"
        );



    btn.id =
        "btn-imprimer-cr";


    btn.type =
        "button";


    btn.className =
        "btn btn-primaire";


    btn.textContent =
        "📄 Imprimer le compte-rendu";



    btn.addEventListener(
        "click",
        lancerCompteRendu
    );



    navTp.appendChild(
        btn
    );


}



/* ==========================================================
   COLLECTE AUTO-EVALUATION
   ========================================================== */


function recupererAutoEvaluation() {


    const competences = [
        "APP",
        "ANA",
        "REA",
        "VAL",
        "COM"
    ];



    const scores = {};



    competences.forEach(
        c=>{


            const choix =
                document.querySelector(
                    `input[name="${c}"]:checked`
                );



            scores[c] =
                choix
                ?
                Number(
                    choix.value
                )
                :
                null;


        }
    );



    return scores;

}




/* ==========================================================
   LANCEMENT COMPTE-RENDU
   ========================================================== */


function lancerCompteRendu() {



    const identite = {


        nom:
            lireTexte(
                "nom-eleve"
            ),


        prenom:
            lireTexte(
                "prenom-eleve"
            ),


        classe:
            lireTexte(
                "classe-eleve"
            ),


        date:
            $("date-eleve")
            ?.value || ""


    };




    const nomReactif =
        reactifCourant?.nom
        ||
        $("nom-sel-table")
        ?.textContent
        ||
        "—";



    const formule =
        reactifCourant?.formule
        ||
        $("formule-dissolution")
        ?.textContent
        ||
        "—";



    const masseMolaire =
        $("m-dissolution")
        ?.value
        ||
        "—";



    const C =
        $("c-dissolution")
        ?.value
        ||
        "—";



    const V =
        $("v-dissolution")
        ?.value
        ||
        "—";



    const masseTheo =
        $("table-masse-dissolution")
        ?.textContent
        ||
        "—";



    const masseExp =
        $("masse-exp-pesee")
        ?.value
        ||
        "—";



    const ecart =
        $("table-ecart")
        ?.textContent
        ||
        "—";




    const C1 =
        $("c1-hcl")
        ?.value
        ||
        "—";



    const C2 =
        $("c2-hcl")
        ?.value
        ||
        "—";



    const V2 =
        $("v2-hcl")
        ?.value
        ||
        "—";




    const V1 =

        (
            Number(C1)>0
            &&
            Number(C2)>0
        )

        ?

        (
            Number(C2)
            *
            Number(V2)
            /
            Number(C1)
        )
        .toFixed(2)

        :

        "—";





    const autoEval =
        recupererAutoEvaluation();





    const sections = [


        {

            groupe:
                "dissolution",


            titre:
                "Paramètres de la dissolution",


            items:[


                {
                    label:
                    "Réactif",

                    valeur:
                    `${nomReactif} (${formule})`

                },


                {
                    label:
                    "Masse molaire",

                    valeur:
                    `${masseMolaire} g/mol`

                },


                {
                    label:
                    "Concentration",

                    valeur:
                    `${C} mol/L`

                },


                {
                    label:
                    "Volume préparé",

                    valeur:
                    `${V} mL`

                },


                {
                    label:
                    "Masse théorique",

                    valeur:
                    `${masseTheo} g`

                },


                {
                    label:
                    "Masse pesée",

                    valeur:
                    `${masseExp} g`

                },


                {
                    label:
                    "Écart relatif",

                    valeur:
                    `${ecart}`

                }


            ]

        },



        {

            groupe:
                "dissolution",


            titre:
                "Question 1 — Différence dissolution / dilution",


            competence:
                "APP",


            notation:
                true,


            texte:
                lireTexte(
                    "question1"
                )

        },


        {

            groupe:
                "dissolution",


            titre:
                "Question 2 — Sécurité lors d'une dilution acide",


            competence:
                "APP",


            notation:
                true,


            texte:
                lireTexte(
                    "question2"
                )

        },


        {

            groupe:
                "dissolution",


            titre:
                "Question 3 — Conversion du volume",


            competence:
                "REA",


            notation:
                true,


            texte:
                lireTexte(
                    "question3"
                )

        },



        {

            groupe:
                "dissolution",


            titre:
                "Question 4 — Quantité de matière",


            competence:
                "REA",


            notation:
                true,


            texte:
                lireTexte(
                    "question4"
                )

        },


        {

            groupe:
                "dissolution",


            titre:
                "Question 5 — Conversion masse g/mg",


            competence:
                "REA",


            notation:
                true,


            texte:
                lireTexte(
                    "question5"
                )

        },


        {

            groupe:
                "dissolution",


            titre:
                "Question 6 — Concentration massique",


            competence:
                "ANA",


            notation:
                true,


            texte:
                lireTexte(
                    "question6"
                )

        },


        {

            groupe:
                "dissolution",


            titre:
                "Question 7 — Analyse de l'écart",


            competence:
                "ANA",


            notation:
                true,


            texte:
                lireTexte(
                    "question7"
                )

        },


        {

            groupe:
                "dissolution",


            titre:
                "Question 8 — Acceptabilité de l'erreur",


            competence:
                "VAL",


            notation:
                true,


            texte:
                lireTexte(
                    "question8"
                )

        },


        {

            groupe:
                "dissolution",


            titre:
                "Question 9 — Sources d'erreurs et améliorations",


            competence:
                "VAL",


            notation:
                true,


            texte:
                lireTexte(
                    "question9"
                )

        },


        {

            groupe:
                "dissolution",


            titre:
                "Question 10 — Conclusion",


            competence:
                "COM",


            notation:
                true,


            texte:
                lireTexte(
                    "question10"
                )

        }

    ];
   /* ==========================================================
   AJOUT PARTIE DILUTION
   ========================================================== */


sections.push({


    groupe:
        "dilution",


    titre:
        "Paramètres de la dilution C₁V₁ = C₂V₂",


    items:[


        {

            label:
            "Concentration mère C₁",

            valeur:
            `${C1} mol/L`

        },


        {

            label:
            "Concentration fille C₂",

            valeur:
            `${C2} mol/L`

        },


        {

            label:
            "Volume final V₂",

            valeur:
            `${V2} mL`

        },


        {

            label:
            "Volume prélevé V₁",

            valeur:
            `${V1} mL`

        }


    ]

});





/* ==========================================================
   RESUME TP
   ========================================================== */


const resume =
    lireTexte(
        "resume-tp"
    );



if(resume) {


    sections.push({


        titre:
            "Résumé du TP",


        texte:
            resume


    });


}




/* ==========================================================
   AUTO EVALUATION
   ========================================================== */


sections.push({


    titre:
        "Auto-évaluation des compétences",


    competence:
        "AUTO",


    items:[


        {

            label:
            "APP",

            valeur:
            autoEval.APP ?? "—"

        },


        {

            label:
            "ANA",

            valeur:
            autoEval.ANA ?? "—"

        },


        {

            label:
            "REA",

            valeur:
            autoEval.REA ?? "—"

        },


        {

            label:
            "VAL",

            valeur:
            autoEval.VAL ?? "—"

        },


        {

            label:
            "COM",

            valeur:
            autoEval.COM ?? "—"

        }


    ]

});






/* ==========================================================
   MATERIEL UTILISE
   ========================================================== */


const materiel =
    getMaterielSelectionne();



if(materiel.length) {


    sections.push({


        titre:
            "Matériel utilisé",


        texte:
            materiel.join(
                " • "
            )


    });


}




/* ==========================================================
   GENERATION COMPTE RENDU
   ========================================================== */


genererCompteRendu({


    domaine:
        "Chimie",



    tp:
        "TP01",



    titre:
        "Préparation de solutions par dissolution et dilution",



    sections,



    identiteDefaut:
        identite,



    signature:
        false,



    noteFinale:
        true,



    groupes:[


        {

            id:
                "dissolution",


            label:
                "Dissolution — Préparation d'une solution par pesée",


            niveau:
                "2nde et 1ère Bac Pro",


            defaut:
                true

        },



        {

            id:
                "dilution",


            label:
                "Dilution — Préparation d'une solution fille",


            niveau:
                "1ère Bac Pro uniquement",


            defaut:
                false

        }


    ]

});



}
