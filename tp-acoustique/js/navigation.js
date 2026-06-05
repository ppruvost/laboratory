const content = document.getElementById("content");

// Supprimez tous les scripts des modules au démarrage
document.querySelectorAll('script[data-module-script]').forEach(script => {
    script.remove();
});

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
        const oldScript = document.querySelector(`script[data-module-script="${name}"]`);
        if (oldScript) oldScript.remove();

        // Charge le script du module actuel
        const script = document.createElement('script');
        script.src = `js/${name}.js`;
        script.setAttribute('data-module-script', name);
        document.body.appendChild(script);

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
        progressBar.style.width = '20%'; // Exemple : à adapter
    }
}
