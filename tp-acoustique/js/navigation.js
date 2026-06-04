const content = document.getElementById("content");

document.querySelectorAll("nav button").forEach(btn => {
    btn.onclick = () => {
        loadModule(btn.dataset.module);
    };
});

async function loadModule(name) {
    try {
        const response = await fetch(`modules/${name}.html`);
        if (!response.ok) throw new Error("Module non trouvé");
        content.innerHTML = await response.text();
        saveProgress(name);
        updateProgress();
    } catch (error) {
        content.innerHTML = `<p>Erreur : ${error.message}</p>`;
    }
}

// Fonctions supplémentaires (à définir si nécessaire)
function saveProgress(name) {
    // Logique pour sauvegarder la progression (ex: localStorage)
    console.log(`Progression sauvegardée : ${name}`);
}

function updateProgress() {
    // Logique pour mettre à jour la barre de progression
    console.log("Progression mise à jour");
}
