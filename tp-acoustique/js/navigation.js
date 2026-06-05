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

function saveProgress(name) {
    localStorage.setItem('lastModule', name);
}

function updateProgress() {
    const progressBar = document.getElementById('bar');
    if (progressBar) {
        progressBar.style.width = '20%';
    }
}
