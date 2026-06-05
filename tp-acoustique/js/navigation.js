const content = document.getElementById("content");

document.querySelectorAll("nav button").forEach(btn => {
    btn.onclick = () => {
        loadModule(btn.dataset.module);
    };
});

async function loadModule(name) {
    try {
        // Charge le HTML du module
        const response = await fetch(`modules/${name}.html`);
        if (!response.ok) throw new Error("Module non trouvé");
        content.innerHTML = await response.text();

        // Supprime l'ancien script du module (si existe)
        const oldScript = document.querySelector(`script[data-module-script]`);
        if (oldScript) oldScript.remove();

        // Liste des modules qui nécessitent un script JS
        const modulesWithScripts = ["generateur", "quiz", "attenuation", "piezo", "transmission", "securite"];

        // Charge le script uniquement si le module en a besoin
        if (modulesWithScripts.includes(name)) {
            const script = document.createElement('script');
            script.src = `js/${name}.js`;
            script.setAttribute('data-module-script', name);
            document.body.appendChild(script);
        }

        // Met à jour la progression
        saveProgress(name);
        updateProgress();
    } catch (error) {
        content.innerHTML = `<p>Erreur : ${error.message}</p>`;
    }
}

// Définissez saveProgress et updateProgress
function saveProgress(name) {
    localStorage.setItem('lastModule', name);
}

function updateProgress() {
    const progressBar = document.getElementById('bar');
    if (progressBar) {
        progressBar.style.width = '20%'; // À adapter selon votre logique
    }
}
