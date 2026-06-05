// Initialisation de l'AudioContext
const AudioContextClass = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContextClass();

// Variables globales
let oscillator;
let gainNode;
let isPlaying = false;

// Récupère les éléments du DOM
function initFrequence() {
    const freqSlider = document.getElementById("freq");
    const freqText = document.getElementById("freqText");
    const periodText = document.getElementById("periodText");
    const playBtn = document.getElementById("playBtn"); // À ajouter dans le HTML
    const stopBtn = document.getElementById("stopBtn"); // À ajouter dans le HTML

    if (!freqSlider || !freqText || !periodText) {
        console.error("Éléments manquants dans le module Fréquence !");
        return;
    }

    // Met à jour les infos (fréquence et période)
    function updateInfos() {
        const freq = Number(freqSlider.value);
        freqText.textContent = `${freq} Hz`;
        const period = 1000 / freq; // Période en ms
        periodText.textContent = `Période : ${period.toFixed(2)} ms`;
    }

    // Démarre le son
    function startSound() {
        if (isPlaying) return;

        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = freqSlider.value;
        gainNode.gain.value = 0.5; // Volume à 50%

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        isPlaying = true;
    }

    // Arrête le son
    function stopSound() {
        if (!isPlaying) return;

        oscillator.stop();
        oscillator = null;
        isPlaying = false;
    }

    // Écouteurs
    freqSlider.addEventListener("input", () => {
        updateInfos();
        if (isPlaying) {
            oscillator.frequency.value = freqSlider.value;
        }
    });

    // Boutons Jouer/Stop (à ajouter dans le HTML)
    if (playBtn) playBtn.addEventListener("click", startSound);
    if (stopBtn) stopBtn.addEventListener("click", stopSound);

    // Initialise les infos
    updateInfos();
}

// Appel de l'initialisation
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initFrequence();
} else {
    document.addEventListener('DOMContentLoaded', initFrequence);
}
