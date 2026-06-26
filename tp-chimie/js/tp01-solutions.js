console.log("tp01-solutions.js chargé");

/* ==========================================================
   IMPORTS DATA
   ========================================================== */

import products from "../../data/products.js";
import dangerDB from "../../data/dangerDB.js";
import pictogrammes from "../../data/pictogrammes.js";
import glassware from "../../data/glassware.js";
import laboratoryEquipment from "../../data/equipment.js";

/* ==========================================================
   VARIABLES GLOBALES
   ========================================================== */

const VERSION = "TP01 - Dissolution";

let produitSelectionne = null;

/* ==========================================================
   INITIALISATION GENERALE
   ========================================================== */

export function init() {

    console.log("=================================");
    console.log(VERSION);
    console.log("Initialisation...");
    console.log("=================================");

    // Navigation
    initTabs();

    // Réactifs
    initReactifs();

    // Sécurité
    renderSecurite();

    // Matériel dynamique
    initMateriel();

    // Calculs
    initCalculs();

    // Tableau de résultats
    initEcarts();

    console.log("TP01 prêt.");
}

/* ==========================================================
   GESTION DES ONGLETS
   ========================================================== */

function initTabs() {

    document.querySelectorAll(".tabs-container").forEach(container => {

        const boutons = container.querySelectorAll(".tab-btn");
        const panneaux = container.querySelectorAll(".tab-panel");

        boutons.forEach(btn => {

            btn.addEventListener("click", () => {

                const cible = btn.dataset.tab;

                boutons.forEach(b =>
                    b.classList.remove("actif")
                );

                panneaux.forEach(p =>
                    p.classList.remove("actif")
                );

                btn.classList.add("actif");

                const panel =
                    container.querySelector("#" + cible);

                if(panel){
                    panel.classList.add("actif");
                }

            });

        });

    });

}

/* ==========================================================
   OUTILS
   ========================================================== */

function $(id){

    return document.getElementById(id);

}

function vider(id){

    const el = $(id);

    if(el){
        el.innerHTML = "";
    }

}

function afficherMessage(id,message){

    const el = $(id);

    if(el){

        el.innerHTML =
        `<div class="info">${message}</div>`;

    }

}


/* ==========================================================
   REACTIFS
   ========================================================== */

function initReactifs(){

    const selectSecurite = $("reactif");
    const selectDissolution = $("reactif-dissolution");

    if(!selectSecurite || !selectDissolution)
        return;

    selectSecurite.innerHTML =
        `<option value="">-- Sélectionner --</option>`;

    selectDissolution.innerHTML =
        `<option value="">-- Sélectionner un réactif --</option>`;

    products.forEach(produit=>{

        /* menu sécurité */

        const option=document.createElement("option");

        option.value=produit.cas;
        option.textContent=produit.nom;

        selectSecurite.appendChild(option);

        /* menu dissolution */

        if(
            produit.categorie==="Sel" ||
            produit.categorie==="Acide" ||
            produit.categorie==="Base"
        ){

            const option2=document.createElement("option");

            option2.value=produit.nom;
            option2.textContent=produit.nom;

            selectDissolution.appendChild(option2);

        }

    });

    selectSecurite.addEventListener(
        "change",
        renderSecurite
    );

    selectDissolution.addEventListener(
        "change",
        handleDissolutionSelect
    );

}

/* ==========================================================
   SECURITE
   ========================================================== */

function renderSecurite(){

    const select=$("reactif");
    const zone=$("securite-bloc");

    if(!select || !zone)
        return;

    if(!select.value){

        afficherMessage(
            "securite-bloc",
            "Sélectionner un réactif."
        );

        return;

    }

    const produit=
    products.find(
        p=>p.cas===select.value
    );

    if(!produit)
        return;

    produitSelectionne=produit;

    let html=`

<div class="produit-securite">

<h3>

${produit.nom}

</h3>

<p>

<strong>Formule :</strong>

${produit.formule || "-"}

</p>

<div class="pictos-clp">

`;

    const deja=new Set();

    (produit.dangers || []).forEach(code=>{

        const picto=
        pictogrammes.find(
            p=>p.code===code
        );

        if(
            picto &&
            !deja.has(picto.image)
        ){

            deja.add(picto.image);

            html+=`

<img
class="picto-clp"
src="../../assets/picto/${picto.image}"
alt="${code}"
title="${code}">

`;

        }

    });

    html+=`

</div>

`;

    if(
        produit.obligation &&
        produit.obligation.length
    ){

        html+=`

<div class="epi-bloc">

<h4>

EPI obligatoires

</h4>

<p>

${produit.obligation.join(" • ")}

</p>

</div>

`;

    }

    html+="</div>";

    zone.innerHTML=html;

}

/* ==========================================================
   MATERIEL
   ========================================================== */

function initMateriel(){

    const liste=[
        ...glassware.filter(
            x=>x.categorie==="Dissolution"
        ),

        ...laboratoryEquipment.filter(
            x=>x.categorie==="Dissolution"
        )
    ];

    const zone=$("listeMateriel");

    if(!zone)
        return;

    zone.innerHTML="";

    liste.forEach(item=>{

        zone.innerHTML+=`

<label class="materiel-check">

<input
type="checkbox"
value="${item.id}"
>

${item.nom}

</label>

`;

    });

    zone
    .querySelectorAll("input")
    .forEach(cb=>{

        cb.addEventListener(
            "change",
            afficherMateriel
        );

    });

}

function afficherMateriel(){

    const zone=$("materielSelectionne");

    if(!zone)
        return;

    zone.innerHTML="";

    const liste=[
        ...glassware,
        ...laboratoryEquipment
    ];

    document
    .querySelectorAll(
        "#listeMateriel input:checked"
    )
    .forEach(cb=>{

        const item=
        liste.find(
            x=>x.id===cb.value
        );

        if(!item)
            return;

        zone.innerHTML+=`

<div class="fiche-materiel">

<img

src="${item.photo}"

alt="${item.nom}"

>

<div>

<h3>

${item.nom}

</h3>

<p>

📍 Lieu :

${item.lieu}

</p>


${item.description ?
`<p>${item.description}</p>`
:
""}

</div>

</div>

`;

    });

}

/* ==========================================================
   PUBCHEM, CHEMSPIDER, CHEMIDPLUS
   ========================================================== */

async function getMoleculeInfo(nom) {
    // 1. Essayer PubChem
    try {
        const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(nom)}/property/MolecularFormula,MolecularWeight/JSON`;
        const reponse = await fetch(url);

        if (reponse.ok) {
            const json = await reponse.json();
            if (json.PropertyTable?.Properties?.length) {
                const molecule = json.PropertyTable.Properties[0];
                return {
                    formule: molecule.MolecularFormula,
                    masseMolaire: Number(molecule.MolecularWeight),
                    source: "PubChem"
                };
            }
        }
    } catch (erreur) {
        console.error("Erreur PubChem :", erreur);
    }

    // 2. Essayer ChemSpider
    try {
        const url = `https://api.rsc.org/compounds/name/${encodeURIComponent(nom)}`;
        const reponse = await fetch(url, {
            headers: {
                "Accept": "application/json"
            }
        });

        if (reponse.ok) {
            const json = await reponse.json();
            if (json.compounds && json.compounds.length > 0) {
                const molecule = json.compounds[0];
                return {
                    formule: molecule.molecularFormula,
                    masseMolaire: Number(molecule.molecularWeight),
                    source: "ChemSpider"
                };
            }
        }
    } catch (erreur) {
        console.error("Erreur ChemSpider :", erreur);
    }

    // 3. Essayer ChemIDplus (NIH)
    try {
        const url = `https://chem.nlm.nih.gov/chemidplus/rest/name/${encodeURIComponent(nom)}/json`;
        const reponse = await fetch(url);

        if (reponse.ok) {
            const json = await reponse.json();
            if (json.result && json.result.length > 0) {
                const molecule = json.result[0];
                return {
                    formule: molecule.MolecularFormula,
                    masseMolaire: Number(molecule.MolecularWeight),
                    source: "ChemIDplus"
                };
            }
        }
    } catch (erreur) {
        console.error("Erreur ChemIDplus :", erreur);
    }

    return null;
}
/* ==========================================================
   CHANGEMENT DE REACTIF
   ========================================================== */

async function handleDissolutionSelect(event){

    const reactif=
    products.find(
        p=>p.nom===event.target.value
    );

    if(!reactif)
        return;

    produitSelectionne=reactif;

    const info=
    await getMoleculeInfo(
        reactif.nom
    );

    if(!info){

        console.warn(
            "PubChem indisponible."
        );

        return;

    }

    $("nom-reactif").textContent=
        reactif.nom;

    $("formule-dissolution").textContent=
        info.formule;

    $("masse-dissolution").textContent=
        info.masseMolaire.toFixed(2);

    $("m-dissolution").value=
        info.masseMolaire.toFixed(2);

    calculDissolution();

}

/* Calcul automatique dès qu'on change le réactif */
document
.getElementById(
"reactif-dissolution"
)
?.addEventListener(
"change",
handleDissolutionSelect
);

/* ==========================================================
   CALCUL MASSE
   ========================================================== */

function calculDissolution(){

    const C=
    parseFloat(
        $("c-dissolution").value
    ) || 0;

    const V=
    parseFloat(
        $("v-dissolution").value
    ) || 0;

    const M=
    parseFloat(
        $("m-dissolution").value
    ) || 0;

    if(
        C<=0 ||
        V<=0 ||
        M<=0
    ){

        $("res-dissolution").innerHTML=
        `
        <div class="info">

        Saisir les données.

        </div>
        `;

        return;

    }

    const masse=
    C*(V/1000)*M;

    $("res-dissolution").innerHTML=

    `

    <div class="resultat">

    <h3>

    Masse à peser

    </h3>

    <div class="valeur">

    ${masse.toFixed(2)} g

    </div>

    </div>

    `;

    $("table-masse-dissolution").textContent=
    masse.toFixed(2);

    $("table-calc-dissolution").textContent=
    C.toFixed(2);

}

/* ==========================================================
   INITIALISATION CALCULS
   ========================================================== */

function initCalculs(){

    [

        "c-dissolution",

        "v-dissolution",

        "m-dissolution"

    ]

    .forEach(id=>{

        $(id)?.addEventListener(

            "input",

            calculDissolution

        );

    });

    calculDissolution();

}

/* ==========================================================
   TABLEAU DES RESULTATS
   ========================================================== */

function initEcarts(){

    const lignes=document.querySelectorAll(
        ".tableau-resultats tbody tr"
    );

    if(!lignes.length)
        return;

    lignes.forEach(ligne=>{

        const champ=
        ligne.querySelector(".c-exp");

        if(!champ)
            return;

        champ.addEventListener(
            "input",
            ()=>calculEcart(ligne)
        );

        calculEcart(ligne);

    });

}

/* ==========================================================
   CALCUL ECART
   ========================================================== */

function calculEcart(ligne){

    const theorique=
    parseFloat(
        ligne.dataset.theo
    );

    const champ=
    ligne.querySelector(".c-exp");

    const cellule=
    ligne.querySelector(".ecart");

    if(
        !champ ||
        !cellule
    )
        return;

    const experimental=
    parseFloat(champ.value);

    if(
        isNaN(theorique) ||
        isNaN(experimental)
    ){

        cellule.textContent="";

        cellule.className="ecart";

        return;

    }

    const ecart=
    Math.abs(
        (experimental-theorique)
        /theorique
    )*100;

    cellule.textContent=
    ecart.toFixed(2)+" %";

    cellule.className="ecart";

    if(ecart<2){

        cellule.classList.add("excellent");

    }

    else if(ecart<5){

        cellule.classList.add("correct");

    }

    else{

        cellule.classList.add("erreur");

    }

}

/* ==========================================================
   OUTILS
   ========================================================== */

function nombre(valeur){

    const n=parseFloat(valeur);

    return isNaN(n)
        ?0
        :n;

}

/* ---------------------------------------------------------- */

function arrondir(valeur,decimales=2){

    return Number(valeur)
    .toFixed(decimales);

}

/* ---------------------------------------------------------- */

function viderElement(id){

    const element=$(id);

    if(element){

        element.innerHTML="";

    }

}

/* ---------------------------------------------------------- */

function afficherInfo(id,message){

    const element=$(id);

    if(!element)
        return;

    element.innerHTML=

    `<div class="info">

    ${message}

    </div>`;

}

/* ---------------------------------------------------------- */

function afficherErreur(id,message){

    const element=$(id);

    if(!element)
        return;

    element.innerHTML=

    `<div class="erreur">

    ${message}

    </div>`;

}

/* ---------------------------------------------------------- */

function creerOption(valeur,texte){

    const option=
    document.createElement("option");

    option.value=valeur;

    option.textContent=texte;

    return option;

}

/* ---------------------------------------------------------- */

function chargerImage(image){

    if(!image){

        return
        "../../assets/images/no-image.png";

    }

    return image;

}

/* ---------------------------------------------------------- */

function formatVolume(volume){

    return volume+" mL";

}

/* ---------------------------------------------------------- */

function formatMasse(masse){

    return masse+" g";

}

/* ---------------------------------------------------------- */

function formatConcentration(c){

    return c+" mol·L⁻¹";

}
