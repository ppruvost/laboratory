/**
 * utils.js
 * Bibliothèque commune des TP de Chimie
 * ------------------------------------------------------------

/* ============================================================
   HELPERS DOM
   ============================================================ */

export const $ = (id) => document.getElementById(id);

export function lireTexte(id) {
    return ($(id)?.value || "").trim();
}

/* ============================================================
   NOMBRES
   ============================================================ */

export function nombre(v) {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
}

export function arrondir(v, decimales = 2) {
    return Number(v).toFixed(decimales);
}

export function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

/* ============================================================
   AFFICHAGE DE MESSAGE
   ============================================================ */

export function message(id, texte, classe = "info") {
    const zone = $(id);
    if (!zone) return;
    zone.innerHTML = `
        <div class="${classe}">
            ${texte}
        </div>
    `;
}

/* ============================================================
   RESOLUTION DES CHEMINS D'IMAGES   
   ============================================================ */

const BASE =
    window.location.hostname === "ppruvost.github.io"
        ? "/laboratory/"
        : "/";

export function imgSrc(
    chemin,
    dossierParDefaut = ""
) {

    if (!chemin) return "";
    // URL complète
    if (
        chemin.startsWith("http://") ||
        chemin.startsWith("https://")
    ) {
        return chemin;
    }
    // Déjà préfixé par la base
    if (chemin.startsWith(BASE)) {
        return chemin;
    }
    // Chemin absolu du projet
    if (
        chemin.startsWith("assets/") ||
        chemin.startsWith("tp-chimie/") ||
        chemin.startsWith("tp-lumiere/") ||
        chemin.startsWith("tp-acoustique/") ||
        chemin.startsWith("tp-electricite/") ||
        chemin.startsWith("tp-mecanique/") ||
       chemin.startsWith("tp-thermique/") ||
        chemin.startsWith("tp-optique/")
    ) {
        return BASE + chemin;
    }

    // Ajoute le dossier par défaut si le nom de fichier est seul
    if (dossierParDefaut) {
        dossierParDefaut = dossierParDefaut.replace(/^\/+|\/+$/g, "");
        chemin = `${dossierParDefaut}/${chemin}`;
    }
    return BASE + chemin.replace(/^\/+/, "");
}

/* ============================================================
   TEST DE CATEGORIE
   ============================================================ */

export function appartientCategorie(element, categorie) {
    if (!element?.categorie)
        return false;
    if (Array.isArray(element.categorie))
        return element.categorie.includes(categorie);
    return element.categorie === categorie;
}

/* ============================================================
   PICTOGRAMMES GHS
   ============================================================ */

export const GHS_PICTO = {
    GHS01: {
        img: "assets/picto/SGH01_BombeExplosant.jpg",
        label: "Explosif"
    },
    GHS02: {
        img: "assets/picto/SGH02_Flamme.jpg",
        label: "Inflammable"
    },
    GHS03: {
        img: "assets/picto/SGH03_FlammeSurCercle.jpg",
        label: "Comburant"
    },
    GHS04: {
        img: "assets/picto/SGH04_BouteilleGaz.jpg",
        label: "Gaz sous pression"
    },
    GHS05: {
        img: "assets/picto/SGH05_Corrosion.jpg",
        label: "Corrosif"
    },
    GHS06: {
        img: "assets/picto/SGH06_TeteDeMort.jpg",
        label: "Toxique"
    },
    GHS07: {
        img: "assets/picto/SGH07_PointExclamation.jpg",
        label: "Irritant / nocif"
    },
    GHS08: {
        img: "assets/picto/SGH08_DangerSante.jpg",
        label: "Danger santé"
    },
    GHS09: {
        img: "assets/picto/SGH09_Environnement.jpg",
        label: "Environnement"
    }
};

/* ============================================================
   EQUIPEMENTS DE PROTECTION
   ============================================================ */

export const EPI_CONFIG = {
    LUNETTES: {
        img: "assets/picto/OBLIGATION-lunettes.jpg",
        label: "Lunettes"
    },
    GANTS: {
        img: "assets/picto/OBLIGATION-gants.jpg",
        label: "Gants"
    },
    BLOUSE: {
        img: "assets/picto/OBLIGATION-blouse.jpg",
        label: "Blouse"
    },
    HOTTE: {
        img: "assets/picto/OBLIGATION-hotte.jpeg",
        label: "Hotte"
    },
    VISIERE: {
        img: "assets/picto/OBLIGATION-visiere.jpg",
        label: "Visière"
    },
    CHAUSSURES: {
        img: "assets/picto/OBLIGATION-chaussures.jpg",
        label: "Chaussures de sécurité"
    },
    RESPIRATOIRE: {
        img: "assets/picto/OBLIGATION-protection-voies-espiratoires.jpg",
        label: "Protection respiratoire"
    }
};

/* ============================================================
   MASSES MOLAIRES   
   ============================================================ */

export const MASSES_MOLAIRES = {
    'NaOH':40.00,
    'HCl':36.46,
    'H2SO4':98.08,
    'HNO3':63.01,
    'CH3COOH':60.05,
    'Na2CO3':105.99,
    'CuSO4':159.61,
    'KMnO4':158.03,
    'NaCl':58.44,
    'KCl':74.55,
    'CaCO3':100.09,
    'AgNO3':169.87,
    'KI':166.00,
    'KOH':56.11,
    'NH4Cl':53.49,
    'Fe':55.85,
    'Cu':63.55,
    'ZnCl2':136.29,
    'ZnSO4·7H2O':287.54,
    'FeSO4·7H2O':278.01,
    'FeCl3·6H2O':270.30,
    'CuCl2':134.45,
    'CaCl2':110.98,
    'KNO3':101.10,
    'KBrO3':167.00,
    'NaHCO3':84.01,
    'Na3PO4':163.94,
    'Na2SO3':126.04,
    'CH2Cl2':84.93,
    'C2H6O':46.07,
    'C3H8O3':92.09,
    'C3H6O':58.08,
    'C4H10O':74.12,
    'C5H12O':88.15,
    'C8H8O':120.15

};

/* ============================================================
   CARTE PRODUIT
   ============================================================ */

export function renderCarteProduit(produit, options = {}) {
    const ghsListe =
        (produit.pictogrammes || produit.dangers || [])
        .filter(code => /^GHS/i.test(code));
    const pictos = ghsListe
        .map(code => {
            const info = GHS_PICTO[code];
            if (!info) {
                return `
                <span class="ghs-inconnu"
                      title="${code}">
                    ⚠️
                </span>`;
            }

            return `
            <img
                src="${info.img}"
                alt="${code}"
                title="${info.label}"
                class="ghs-badge"
                onerror="this.style.display='none'"
            >`;
        })
        .join("");

    const dangersH =
        (produit.dangers || [])
        .filter(code => /^H\d+/i.test(code))
        .map(code =>
            `
            <span class="danger-code">
                ${code}
            </span>
            `
        )
        .join("");
    return `

    <article class="produit-carte">
        <div class="produit-entete">
            <span class="produit-cas">
                ${produit.cas || ""}
            </span>
        </div>


        <div class="produit-corps">
            <h4>
                ${produit.nom || ""}
            </h4>
            <div class="produit-formule">
                ${produit.formule || ""}
            </div>

            ${
                produit.localisation
                ?
                `
                <div class="produit-localisation">
                    📍 ${produit.localisation}
                </div>
                `
                :
                ""
            }

            ${
                options.showGHS && pictos
                ?
                `
                <div class="ghs-pictos">
                    ${pictos}
                </div>
                `
                :
                ""
            }

            ${
                options.showH && dangersH
                ?
                `
                <div class="danger-liste">
                    ${dangersH}
                </div>
                `
                :
                ""
            }
        </div>
    </article>
    `;
}

/* ============================================================
   BLOC SECURITE GLOBAL
   ============================================================ */

export function renderBlocSecurite(produits = []) {
    const cartes = produits
        .map(produit =>
            renderCarteProduit(
                produit,
                {
                    showGHS:true,
                    showH:true
                }
            )
        )
        .join("");
    return `

    <section class="alerte-securite">
        <h3>
            ⚠️ Sécurité chimique
        </h3>
        <p>
            Lire les fiches de données de sécurité avant toute
            manipulation.
        </p>

        <p>
            Porter obligatoirement les équipements de protection
            adaptés.
        </p>

        <p>
            En cas de projection :
            rincer abondamment à l'eau et prévenir le responsable.
        </p>
    </section>

    <section class="liste-produits-securite">
        ${cartes}
    </section>
    `;
}

/* ============================================================
   RENDU D'UN PRODUIT UNIQUE
   ============================================================ */

export function renderProduitSecurite(produit) {
    if (!produit)
        return "";
    return renderCarteProduit(
        produit,
        {
            showGHS:true,
            showH:true
        }
    );
}

/* ============================================================
   RECHERCHE PRODUIT
   ============================================================ */

export function trouverProduit(liste, cle) {
    if (!Array.isArray(liste))
        return null;

    return liste.find(
        produit =>
            produit.cas === cle
            ||
            produit.id === cle
    )
    || null;
}

/* ============================================================
   CONSTRUCTION LISTE SELECT PRODUITS
   ============================================================ */

export function remplirSelectProduits(
    select,
    produits,
    options={}
) {

    if (!select)
        return;

    const {

        placeholder="-- Sélectionner --",

        categorie=null

    } = options;

    select.innerHTML =
        `
        <option value="">
            ${placeholder}
        </option>
        `;

    produits
    .filter(p =>
        !categorie
        ||
        appartientCategorie(p,categorie)
    )
    .sort(
        (a,b)=>
            a.nom.localeCompare(
                b.nom,
                "fr"
            )
    )
    .forEach(p=>{


        const option =
            document.createElement("option");

        option.value =
            p.cas;

        option.textContent =
            p.nom;

        select.appendChild(option);
    });
}

/* ============================================================
   FILTRAGE DYNAMIQUE PAR CHECKBOX
   ============================================================ */

export function appliquerFiltresCategorie(
    select,
    produits,
    classeCheckbox="filtre-cat"
) {

    if (!select)
        return;

    const categories =
        [
            ...document.querySelectorAll(
                "." + classeCheckbox + ":checked"
            )
        ]
        .map(cb=>cb.value);

    const ancienneValeur =
        select.value;

    select.innerHTML =
        `
        <option value="">
        -- Sélectionner --
        </option>
        `;
    if(categories.length===0)
        return;

    produits
    .filter(
        produit =>
            categories.some(
                cat =>
                    appartientCategorie(
                        produit,
                        cat
                    )
            )
    )

    .sort(
        (a,b)=>
        a.nom.localeCompare(
            b.nom,
            "fr"
        )
    )

    .forEach(
        produit=>{
            const option =
                document.createElement("option");
            option.value =
                produit.cas;
            option.textContent =
                produit.nom;
            if(option.value===ancienneValeur)
                option.selected=true;
            select.appendChild(option);
        }
    );
}

/* ============================================================
   ACCORDEONS
   ============================================================ */

export function initSections() {
    document
    .querySelectorAll(".section-titre")
    .forEach(titre=>{
        const section =
            titre.closest(".section");
        if(!section)
            return;
        const corps =
            section.querySelector(".section-corps");
        const chevron =
            titre.querySelector(".chevron");
        if(!corps)
            return;
        // état initial
        corps.style.display =
            section.classList.contains("fermee")
            ?
            "none"
            :
            "block";
        if(chevron){
            chevron.textContent =
                section.classList.contains("fermee")
                ?
                "▶"
                :
                "▼";
        }

        titre.addEventListener(
            "click",
            ()=>{


                const fermee =
                    section.classList.toggle(
                        "fermee"
                    );



                corps.style.display =
                    fermee
                    ?
                    "none"
                    :
                    "block";



                if(chevron){

                    chevron.textContent =
                        fermee
                        ?
                        "▶"
                        :
                        "▼";

                }


            }
        );


    });


}



/* ============================================================
   ONGLET GENERIQUE
   ============================================================ */


export function initTabs() {


    document
    .querySelectorAll(".tabs-container")
    .forEach(container=>{


        const boutons =
            container.querySelectorAll(
                ".tab-btn"
            );


        const panneaux =
            container.querySelectorAll(
                ".tab-panel"
            );



        boutons.forEach(btn=>{


            btn.addEventListener(
                "click",
                ()=>{


                    boutons.forEach(
                        b=>
                        b.classList.remove(
                            "actif"
                        )
                    );


                    panneaux.forEach(
                        p=>
                        p.classList.remove(
                            "actif"
                        )
                    );



                    btn.classList.add(
                        "actif"
                    );



                    const cible =
                        container.querySelector(
                            "#"+btn.dataset.tab
                        );



                    if(cible)
                        cible.classList.add(
                            "actif"
                        );



                    // événement personnalisé
                    container.dispatchEvent(
                        new CustomEvent(
                            "ongletChange",
                            {
                                detail:
                                {
                                    tab:
                                    btn.dataset.tab
                                }
                            }
                        )
                    );


                }
            );


        });


    });


}



/* ============================================================
   MODE OPERATOIRE
   ============================================================ */


export function afficherModeOperatoire(type) {


    const modes =
    {

        dissolution:
            "modeDissolution",

        dilution:
            "modeDilution"

    };



    Object
    .entries(modes)
    .forEach(
        ([nom,id])=>{


            const bloc =
                document.getElementById(id);



            if(!bloc)
                return;



            bloc.classList.toggle(
                "hidden",
                nom!==type
            );


        }
    );


}



/* ============================================================
   INITIALISATION DES MODES OPERATOIRES
   ============================================================ */


export function initModesOperatoires() {


    document
    .querySelectorAll(
        "[data-mode-operatoire]"
    )
    .forEach(btn=>{


        btn.addEventListener(
            "click",
            ()=>{


                afficherModeOperatoire(
                    btn.dataset.modeOperatoire
                );


            }
        );


    });


}



/* ============================================================
   IMPRESSION SIMPLE
   ============================================================ */


export function initImprimer() {


    const btn =
        document.getElementById(
            "btn-imprimer"
        );



    if(!btn)
        return;



    btn.addEventListener(
        "click",
        ()=>window.print()
    );


}



/* ============================================================
   AJOUT D'UN BOUTON DANS UNE NAVIGATION TP
   ============================================================ */


export function ajouterBouton(
    conteneur,
    id,
    texte,
    callback,
    classe="btn btn-primaire"
){


    if(!conteneur)
        return null;



    if(
        document.getElementById(id)
    )
        return document.getElementById(id);



    const bouton =
        document.createElement(
            "button"
        );


    bouton.id =
        id;


    bouton.type =
        "button";


    bouton.className =
        classe;


    bouton.textContent =
        texte;



    bouton.addEventListener(
        "click",
        callback
    );



    conteneur.appendChild(
        bouton
    );



    return bouton;

}



/* ============================================================
   INITIALISATION COMPLETE COMMUNE
   ============================================================ */


export function initInterfaceTP(){


    initSections();


    initTabs();


    initModesOperatoires();


    initImprimer();


}

/* ============================================================
   CONCENTRATION MOLAIRE
   ============================================================ */


export function concentrationMolaire(
    masseG,
    volumeL,
    masseMolaire
){

    if(
        masseG<=0 ||
        volumeL<=0 ||
        masseMolaire<=0
    )
        return null;


    return (
        masseG /
        masseMolaire /
        volumeL
    );

}



/* ============================================================
   CONCENTRATION MASSIQUE
   ============================================================ */


export function concentrationMassique(
    masseG,
    volumeL
){

    if(
        masseG<=0 ||
        volumeL<=0
    )
        return null;


    return masseG / volumeL;

}



/* ============================================================
   QUANTITE DE MATIERE
   ============================================================ */


export function quantiteMatiere(
    masseG,
    masseMolaire
){

    if(
        masseG<=0 ||
        masseMolaire<=0
    )
        return null;


    return masseG / masseMolaire;

}



/* ============================================================
   DILUTION C1V1=C2V2
   ============================================================ */


export function dilution({
    c1,
    v1,
    c2,
    v2
}){


    c1 = nombre(c1);
    v1 = nombre(v1);
    c2 = nombre(c2);
    v2 = nombre(v2);



    if(
        c1>0 &&
        v1>0 &&
        c2>0
    ){

        return (
            c1*v1/c2
        );

    }



    if(
        c1>0 &&
        v1>0 &&
        v2>0
    ){

        return (
            c1*v1/v2
        );

    }



    return null;

}



/* ============================================================
   CALCUL D'ERREUR RELATIVE
   ============================================================ */


export function erreurRelative(
    experimental,
    theorique
){

    experimental =
        nombre(experimental);

    theorique =
        nombre(theorique);



    if(theorique===0)
        return null;



    return Math.abs(
        (experimental-theorique)
        /
        theorique
    )*100;

}



/* ============================================================
   ECART SIGNE
   ============================================================ */


export function ecartSigne(
    experimental,
    theorique
){

    experimental =
        nombre(experimental);

    theorique =
        nombre(theorique);



    if(theorique===0)
        return null;



    return (
        (experimental-theorique)
        /
        theorique
    )*100;

}



/* ============================================================
   CALCUL GUIDÉ GENERIQUE
   ============================================================ */


export function bindCalcul(
    id,
    fonction
){


    const bloc =
        document.getElementById(id);



    if(!bloc)
        return;



    const inputs =
        bloc.querySelectorAll(
            "input"
        );


    const resultat =
        bloc.querySelector(
            ".resultat-calcul"
        );



    inputs.forEach(
        input=>{


            input.addEventListener(
                "input",
                ()=>{


                    const valeurs =
                    [
                        ...inputs
                    ]
                    .map(
                        i=>nombre(i.value)
                    );



                    const res =
                        fonction(valeurs);



                    if(resultat)
                        resultat.textContent =
                            res ?? "—";


                }
            );


        }
    );


}



/* ============================================================
   CREATION D'UNE LISTE CHECKBOX
   ============================================================ */


export function creerListeCheckbox(
    conteneur,
    elements,
    classe="choix"
){


    if(!conteneur)
        return;



    conteneur.innerHTML =
        "";



    elements.forEach(
        element=>{


            const label =
                document.createElement(
                    "label"
                );


            label.className =
                classe;



            label.innerHTML =
            `

            <input
                type="checkbox"
                value="${element.id || element}"
            >

            <span>
                ${element.nom || element}
            </span>

            `;



            conteneur.appendChild(
                label
            );


        }
    );


}



/* ============================================================
   EXPORT DONNEES FORMULAIRE
   ============================================================ */


export function lireFormulaire(
    selecteur
){

    const zone =
        document.querySelector(
            selecteur
        );


    if(!zone)
        return {};



    const donnees =
        {};



    zone
    .querySelectorAll(
        "input,select,textarea"
    )
    .forEach(
        champ=>{


            if(
                champ.name ||
                champ.id
            ){

                donnees[
                    champ.name || champ.id
                ]
                =
                champ.value;


            }


        }
    );



    return donnees;

}



/* ============================================================
   RESET ZONE
   ============================================================ */


export function viderZone(id){

    const zone =
        $(id);


    if(zone)
        zone.innerHTML =
            "";

}



/* ============================================================
   INITIALISATION DOM COMPLETE
   ============================================================ */


export function initCommun(){

    initInterfaceTP();

}
