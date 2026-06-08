const content =
document.getElementById(
    "content"
);

let isLoading = false;


/* ==========================
   NAVIGATION BOUTONS
========================== */

document
.querySelectorAll(
    "nav button"
)
.forEach(btn=>{

    btn.addEventListener(

        "click",

        ()=>{

            const moduleName =

            btn.dataset.module;

            if(

                !moduleName ||

                isLoading

            ) return;

            loadModule(
                moduleName
            );

        }

    );

});


/* ==========================
   BOUTON ACTIF
========================== */

function setActiveButton(name){

    document
    .querySelectorAll(
        "nav button"
    )
    .forEach(btn=>{

        btn.classList.remove(
            "active"
        );

        if(

            btn.dataset.module
            ===
            name

        ){

            btn.classList.add(
                "active"
            );

        }

    });

}


/* ==========================
   SUPPRIME ANCIENS SCRIPTS
========================== */

function removeOldScripts(){

    document
    .querySelectorAll(
        "script[data-module-script]"
    )
    .forEach(script=>{

        script.remove();

    });

}


/* ==========================
   DETRUIT ANCIEN ETAT
========================== */

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


/* ==========================
   CHARGEMENT MODULE
========================== */

async function loadModule(name){

    if(isLoading) return;

    isLoading = true;

    cleanupModule();

    try{

        console.log(

            "Chargement module :",

            name

        );

        setActiveButton(
            name
        );

        content.innerHTML =

        `
        <div class="card">

        Chargement...

        </div>
        `;


        /* ========= HTML ========= */

        const response =

        await fetch(

            `modules/${name}.html?v=${Date.now()}`

        );

        if(

            !response.ok

        ){

            throw new Error(

                `Module ${name} introuvable`

            );

        }

        const html =

        await response.text();

        content.innerHTML =
        html;


        /* ========= CLEAN ========= */

        removeOldScripts();


        /* ========= JS ========= */

        const script =

        document.createElement(
            "script"
        );

        script.src =

        `js/${name}.js?v=${Date.now()}`;

        script.dataset.moduleScript =
        name;

        script.defer = true;


        script.onload = ()=>{

            console.log(

                `${name}.js chargé`

            );

            let initName =

            "init"

            +

            name.charAt(0)
            .toUpperCase()

            +

            name.slice(1);

            /*
             Cas particulier A12 FFT
             fft.js expose initFFT()
            */

            if(name==="fft"){

                initName =
                "initFFT";

            }

            if(

                typeof
                window[initName]

                ===

                "function"

            ){

                try{

                    window[
                        initName
                    ]();

                    console.log(

                        initName,

                        "executé"

                    );

                }

                catch(err){

                    console.error(

                        "Erreur init :",

                        err

                    );

                }

            }

            else{

                console.warn(

                    initName,

                    "introuvable"

                );

            }

        };


        script.onerror = ()=>{

            console.error(

                `Erreur chargement js/${name}.js`

            );

            content.innerHTML =

            `
            <div class="card">

            <h2>

            Erreur JS

            </h2>

            <p>

            Impossible charger :

            js/${name}.js

            </p>

            </div>
            `;

        };

        document.body.appendChild(
            script
        );


        saveProgress(
            name
        );

        updateProgress();

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

    catch(error){

        console.error(
            error
        );

        content.innerHTML =

        `
        <div class="card">

        <h2>

        Erreur

        </h2>

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


/* ==========================
   SAUVEGARDE
========================== */

function saveProgress(name){

    localStorage.setItem(

        "lastModule",

        name

    );

}


/* ==========================
   PROGRESSION
========================== */

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

    const current =

    localStorage.getItem(
        "lastModule"
    );

    let index = 1;

    buttons.forEach(

        (btn,i)=>{

            if(

                btn.dataset.module

                ===

                current

            ){

                index =

                i+1;

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


/* ==========================
   INITIALISATION
========================== */

window.addEventListener(

    "DOMContentLoaded",

    ()=>{

        const last =

        localStorage.getItem(
            "lastModule"
        )

        ||

        "introduction";

        updateProgress();

        loadModule(
            last
        );

    }

);
