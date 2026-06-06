/* ==========================
   MODULE INTENSITÉ SONORE
========================== */

window.initIntensite = function () {

    console.log("module intensité chargé");

    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    const audioCtx = new AudioContextClass();

    let oscillator = null;
    let gainNode = null;

    /* ==========================
       ELEMENTS DOM
    ========================== */

    const intensitySlider =
        document.getElementById("intensitySlider");

    const intensityValue =
        document.getElementById("intensityValue");

    const startBtn =
        document.getElementById("startBtn");

    const stopBtn =
        document.getElementById("stopBtn");

    const levelBar =
        document.getElementById("levelBar");

    const dbInfo =
        document.getElementById("dbInfo");

    /* ==========================
       CHECK DOM
    ========================== */

    if (
        !intensitySlider ||
        !intensityValue ||
        !startBtn ||
        !stopBtn ||
        !levelBar ||
        !dbInfo
    ) {
        console.error("UI Intensité incomplète");
        return;
    }

    /* ==========================
       INIT AFFICHAGE
    ========================== */

    function updateUI() {

        const value = Number(intensitySlider.value);

        intensityValue.textContent =
            Math.round(value * 100) + " %";

        const db = Math.round(20 * Math.log10(value + 0.0001));

        dbInfo.textContent =
            "Niveau estimé : " + db + " dB";

        levelBar.style.width =
            Math.min(100, value * 100) + "%";

    }

    updateUI();

    /* ==========================
       CREATION SON
    ========================== */

    function startSound() {

        stopSound();

        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = 440;

        gainNode.gain.value =
            Number(intensitySlider.value);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();

        console.log("son intensité démarré");

    }

    function stopSound() {

        if (oscillator) {

            try {
                oscillator.stop();
            } catch (e) {}

            oscillator.disconnect();
            oscillator = null;

        }

    }

    /* ==========================
       EVENTS
    ========================== */

    intensitySlider.addEventListener("input", () => {

        updateUI();

        if (gainNode) {
            gainNode.gain.value =
                Number(intensitySlider.value);
        }

    });

    startBtn.onclick = startSound;
    stopBtn.onclick = stopSound;

};
