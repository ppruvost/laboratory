// Initialisation de l'AudioContext
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContextClass();

// Variables globales pour l'oscillateur et le gain
let oscillator = null;
let gainNode = null;
let isPlaying = false;

// Fonction d'initialisation
function initFrequence() {
    // Récupère les éléments du DOM
    const freqSlider = document.getElementById("freq");
    const freqText = document.getElementById("freqText");
    const periodText = document.getElementById("periodText");
    const playBtn = document.getElementById("playBtn");
    const stopBtn = document.getElementById("stopBtn");
    const oscilloCanvas = document.getElementById("oscillo");

    // Vérifie que tous les éléments existent
    if (!freqSlider || !freqText || !periodText || !playBtn || !stopBtn || !oscilloCanvas) {
        console.error("Un ou plusieurs éléments du module Fréquence sont introuvables !");
        return;
    }

    // Met à jour les infos (fréquence et période)
    function updateInfos() {
        const freq = Number(freqSlider.value);
        freqText.textContent = `${freq} Hz`;
        const period = 1000 / freq; // Période en ms
        periodText.textContent = `Période : ${period.toFixed(2)} ms`;

        // Si un son est en cours de lecture, met à jour la fréquence
        if (isPlaying && oscillator) {
            oscillator.frequency.value = freq;
        }
    }

    // Démarre le son
    function startSound() {
        if (isPlaying) return;

        // Crée les nœuds audio
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        // Configure l'oscillateur
        oscillator.type = "sine";
        oscillator.frequency.value = freqSlider.value;

        // Configure le gain (volume)
        gainNode.gain.value = 0.5; // Volume à 50%

        // Connecte les nœuds
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Démarre l'oscillateur
        oscillator.start();
        isPlaying = true;
    }

    // Arrête le son
    function stopSound() {
        if (!isPlaying || !oscillator) return;

        oscillator.stop();
        oscillator = null;
        isPlaying = false;
    }

    // Écouteurs pour les curseurs et boutons
    freqSlider.addEventListener("input", updateInfos);
    playBtn.addEventListener("click", startSound);
    stopBtn.addEventListener("click", stopSound);

    // Initialise les infos au démarrage
    updateInfos();
}

// Appel de l'initialisation quand le DOM est prêt
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initFrequence();
} else {
    document.addEventListener('DOMContentLoaded', initFrequence);
}
