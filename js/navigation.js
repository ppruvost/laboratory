async function loadModule(name, domaine){

    if(isLoading) return;

    isLoading = true;

    cleanupModule();

    try{

        console.log(
            "Chargement module :",
            domaine,
            name
        );

        setActiveButton(name);

        content.innerHTML =
        `<div class="card">Chargement...</div>`;

        const htmlPath =
        `${domaine}/modules/${name}.html`;

        const jsPath =
        `${domaine}/js/${name}.js`;

        const response =
        await fetch(
            `${htmlPath}?v=${Date.now()}`
        );

        if(!response.ok){

            throw new Error(
                `${htmlPath} introuvable`
            );

        }

        content.innerHTML =
        await response.text();

        removeOldScripts();

        const script =
        document.createElement("script");

        script.type = "module";

        script.src =
        `${jsPath}?v=${Date.now()}`;

        script.dataset.moduleScript =
        name;

        script.onload = ()=>{

            console.log(
                `${jsPath} chargé`
            );

        };

        script.onerror = ()=>{

            console.error(
                `${jsPath} introuvable`
            );

        };

        document.body.appendChild(
            script
        );

        saveProgress(
            domaine + "|" + name
        );

        updateProgress();

    }

    catch(err){

        console.error(err);

        content.innerHTML =
        `
        <div class="card">
            <h2>Erreur</h2>
            <p>${err.message}</p>
        </div>
        `;
    }

    finally{

        isLoading = false;

    }

}
