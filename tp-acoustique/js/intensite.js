/* ==========================
   MODULE INTENSITÉ SONORE (TP LYCÉE)
   - dB SPL simplifié
   - seuil auditif / douleur
   - visualisation
========================== */

window.initIntensite = function () {

    console.log("module intensité chargé");

    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    const audioCtx = new AudioContextClass();

    let oscillator = null;
    let gainNode = null;

    /* ==========================
       CONSTANTES PHYSIOLOGIQUES
    ========================== */

    const SEUIL_AUDITIF = 0.00002;   // 20 µPa
    const SEUIL_DOULEUR = 1;         // intensité relative simplifiée

    /* ==========================
       ELEMENTS DOM
    ========================== */

    const slider = document.getElementById("intensitySlider");
    const intensityValue = document.getElementById("intensityValue");
    const dbInfo = document.getElementById("dbInfo");
    const levelBar = document.getElementById("levelBar");
    const danger = document.getElementById("danger");

    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");

    if (!slider || !dbInfo || !levelBar) {
        console.error("UI intensité incomplète");
        return;
    }

    /* ==========================
       MODELE dB SPL SIMPLIFIE
       dB = 20 log10(I / I0)
    ========================== */

    function computeDb(intensity) {

        const I = Math.max(intensity, 0.000001);

        return 20 * Math.log10(I / SEUIL_AUDITIF);

    }

    /* ==========================
       UI UPDATE
    ========================== */

    function updateUI() {

        const I = Number(slider.value);

        const db = computeDb(I);

        intensityValue.textContent =
            Math.round(I * 100) + " %";

        dbInfo.innerHTML = `
            Intensité relative : ${I.toFixed(2)} <br>
            Niveau sonore : <b>${db.toFixed(1)} dB SPL</b>
        `;

        /* BARRE VISUELLE (non linéaire) */
        const visual = Math.min(100, Math.log10(I + 0.0001) * 50 + 100);
        levelBar.style.width = visual + "%";

        /* ==========================
           SEUILS PHYSIOLOGIQUES
        ========================== */

        if (db < 20) {

            danger.innerHTML =
                "🟢 Sous le seuil auditif (quasi inaudible)";

            danger.style.color = "green";

        }

        else if (db < 80) {

            danger.innerHTML =
                "🟡 Zone auditive confortable";

            danger.style.color = "#d97706";

        }

        else if (db < 120) {

            danger.innerHTML =
                "🟠 Zone forte (risque à long terme)";

            danger.style.color = "orange";

        }

        else {

            danger.innerHTML =
                "🔴 SEUIL DE DOULEUR (danger)";

            danger.style.color = "red";

        }

    }

    updateUI();

    /* ==========================
       AUDIO
    ========================== */

    function startSound() {

        stopSound();

        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = 440;

        gainNode.gain.value = Number(slider.value);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();

    }

    function stopSound() {

        if (oscillator) {
            oscillator.stop();
            oscillator.disconnect();
            oscillator = null;
        }

    }

    /* ==========================
       EVENTS
    ========================== */

    slider.addEventListener("input", () => {

        updateUI();

        if (gainNode) {
            gainNode.gain.value = Number(slider.value);
        }

    });

    startBtn.onclick = startSound;
    stopBtn.onclick = stopSound;

};
