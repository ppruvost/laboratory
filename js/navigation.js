/* ==========================================================
   NAVIGATION.JS V2
   Laboratory
   ========================================================== */
const BASE_PATH = "/laboratory";

const content =
document.getElementById("content");

let isLoading = false;

/* ==========================================================
   BOUTONS DE NAVIGATION
   ========================================================== */

function initNavigation(){

    document
    .querySelectorAll("nav button")
    .forEach(btn=>{

        btn.addEventListener(

            "click",

            ()=>{

                const moduleName =
                btn.dataset.module;

                const domaine =
                btn.dataset.domaine;

                if(
                    !moduleName ||
                    !domaine ||
                    isLoading
                ){
                    return;
                }

                loadModule(
                    domaine,
                    moduleName
                );

            }

        );

    });

}

/* ==========================================================
   BOUTON ACTIF
   ========================================================== */

function setActiveButton(moduleName){

    document
    .querySelectorAll("nav button")
    .forEach(btn=>{

        btn.classList.remove(
            "active"
        );

        if(
            btn.dataset.module
            ===
            moduleName
        ){
            btn.classList.add(
                "active"
            );
        }

    });

}

/* ==========================================================
   NETTOYAGE
   ========================================================== */

function cleanupModule(){

    if(window.currentAnimationFrame){

        cancelAnimationFrame(
            window.currentAnimationFrame
        );

        window.currentAnimationFrame =
        null;

    }

    if(window.currentInterval){

        clearInterval(
            window.currentInterval
        );

        window.currentInterval =
        null;

    }

}

/* ==========================================================
   CHARGEMENT MODULE
   ========================================================== */

async function loadModule(
    domaine,
    moduleName
){

    if(isLoading) return;

    isLoading = true;

    cleanupModule();

    try{

        console.log(
            "Chargement module :",
            domaine,
            moduleName
        );

        setActiveButton(
            moduleName
        );

        content.innerHTML =
        `
        <div class="card">
            Chargement...
        </div>
        `;

        const cleanDomaine = domaine.replace(/^\/|\/$/g, "");

       const htmlPath =
       `${BASE_PATH}/${cleanDomaine}/modules/${moduleName}.html`;

       const jsPath =
       `${BASE_PATH}/${cleanDomaine}/js/${moduleName}.js`;

        /* ======================
           HTML
           ====================== */

        const response =
        await fetch(
            `${htmlPath}?v=${Date.now()}`
        );

        if(!response.ok){

            throw new Error(
                `Module introuvable :
                 ${htmlPath}`
            );

        }

        const html =
        await response.text();

        content.innerHTML =
        html;

        /* ======================
           JS MODULE
           ====================== */

        try{

            const module =
            await import(
                `${jsPath}?v=${Date.now()}`
            );

            if(
                typeof module.init
                ===
                "function"
            ){

                module.init();

                console.log(
                    "init() exécuté"
                );

            }
            else{

                console.warn(
                    `${moduleName}.js :
                     fonction init()
                     absente`
                );

            }

        }

        catch(jsError){

            console.error(
                "Erreur JS :",
                jsError
            );

        }

        saveProgress(
            domaine,
            moduleName
        );

        updateProgress();

        history.pushState(

            {
                domaine,
                moduleName
            },

            "",

            `#${domaine}/${moduleName}`

        );

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

    catch(error){

        console.error(error);

        content.innerHTML =
        `
        <div class="card">

            <h2>Erreur</h2>

            <p>
                ${error.message}
            </p>

        </div>
        `;

    }

    finally{

        isLoading = false;

    }

}

/* ==========================================================
   SAUVEGARDE
   ========================================================== */

function saveProgress(
    domaine,
    moduleName
){

    localStorage.setItem(

        "laboratory_last_module",

        JSON.stringify({

            domaine,
            moduleName

        })

    );

}

/* ==========================================================
   PROGRESSION
   ========================================================== */

function updateProgress(){

    const bar =
    document.getElementById(
        "bar"
    );

    if(!bar) return;

    const buttons =
    document.querySelectorAll(
        "nav button"
    );

    const active =
    document.querySelector(
        "nav button.active"
    );

    if(
        !active ||
        buttons.length===0
    ){
        return;
    }

    let index = 1;

    buttons.forEach(

        (btn,i)=>{

            if(
                btn===active
            ){
                index=i+1;
            }

        }

    );

    const percent =

    (
        index /
        buttons.length
    ) * 100;

    bar.style.width =
    percent + "%";

}

/* ==========================================================
   RETOUR NAVIGATEUR
   ========================================================== */

window.addEventListener(

    "popstate",

    event=>{

        if(
            !event.state
        ){
            return;
        }

        loadModule(

            event.state.domaine,

            event.state.moduleName

        );

    }

);

/* ==========================================================
   CHARGEMENT INITIAL
   ========================================================== */

window.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initNavigation();

        let saved = null;

        try{

            saved = JSON.parse(

                localStorage.getItem(
                    "laboratory_last_module"
                )

            );

        }

        catch(err){

            console.warn(err);

        }

        if(
            saved &&
            saved.domaine &&
            saved.moduleName
        ){

            loadModule(

                saved.domaine,

                saved.moduleName

            );

        }

        else{

            const first =
            document.querySelector(
                "nav button"
            );

            if(first){

                loadModule(

                    first.dataset.domaine,

                    first.dataset.module

                );

            }

        }

    }

);
