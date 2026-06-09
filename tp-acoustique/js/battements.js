window.initBattements = function () {

    console.log("initBattements exécuté");

    /* =========================
       ELEMENTS UI
    ========================= */

    const f1 = document.getElementById("freq1");
    const f2 = document.getElementById("freq2");

    const f1Val = document.getElementById("f1Val");
    const f2Val = document.getElementById("f2Val");

    const fb = document.getElementById("fb");
    const fbMesure = document.getElementById("fbMesure");

    const canvas = document.getElementById("graph");

    const casReel = document.getElementById("casReel");
    const explication = document.getElementById("explication");

    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const showEnvBtn = document.getElementById("showEnv");

    /* =========================
       SECURITE DOM
    ========================= */

    if (!f1 || !f2 || !fb || !canvas) {
        console.error("Elements HTML manquants (freq1, freq2, fb, graph)");
        return;
    }

    const ctx = canvas.getContext("2d");

    /* =========================
       AUDIO (OPTIONNEL)
    ========================= */

    let audioCtx;
    let osc1;
    let osc2;
    let gain;

    let running = false;
    let showEnvelope = false;

    /* =========================
       UPDATE UI
    ========================= */

    function updateValues() {

        if (f1Val) f1Val.textContent = f1.value;
        if (f2Val) f2Val.textContent = f2.value;

    }

    /* =========================
       DRAW GRAPH
    ========================= */

    function draw() {

        const freq1 = Number(f1.value);
        const freq2 = Number(f2.value);

        const diff = Math.abs(freq1 - freq2);

        fb.textContent = diff.toFixed(1) + " Hz";

        if (fbMesure) {
            fbMesure.textContent = diff.toFixed(1);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* axe horizontal */
        ctx.beginPath();
        ctx.strokeStyle = "#ccc";
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        /* signal */
        ctx.beginPath();
        ctx.strokeStyle = "#1f77b4";
        ctx.lineWidth = 2;

        for (let x = 0; x < canvas.width; x++) {

            const t = x / 20;

            const y =
                canvas.height / 2 +
                Math.sin(t * freq1 * 0.01) *
                Math.cos(t * diff * 0.02) *
                80;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        ctx.stroke();

        /* enveloppe (optionnelle) */
        if (showEnvelope) {

            ctx.beginPath();
            ctx.strokeStyle = "rgba(255,0,0,0.5)";

            for (let x = 0; x < canvas.width; x++) {

                const t = x / 20;

                const env =
                    Math.abs(Math.cos(t * diff * 0.02));

                const y =
                    canvas.height / 2 -
                    env * 80;

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.stroke();
        }
    }

    /* =========================
       CONTROLS CURSEURS
    ========================= */

    f1.addEventListener("input", () => {
        updateValues();
        draw();
    });

    f2.addEventListener("input", () => {
        updateValues();
        draw();
    });

    /* =========================
       CAS REELS
    ========================= */

    if (casReel) {

        casReel.addEventListener("change", () => {

            switch (casReel.value) {

                case "ventilo":
                    f1.value = 120;
                    f2.value = 124;
                    explication.textContent =
                        "Deux ventilateurs proches produisent un battement audible (effet wou-wou).";
                    break;

                case "moteur":
                    f1.value = 300;
                    f2.value = 307;
                    explication.textContent =
                        "Deux moteurs proches en vitesse créent des vibrations périodiques utiles au diagnostic.";
                    break;

                case "accordage":
                    f1.value = 440;
                    f2.value = 442;
                    explication.textContent =
                        "En accordage, les battements disparaissent quand les fréquences sont identiques.";
                    break;

                default:
                    explication.textContent = "";
            }

            updateValues();
            draw();
        });
    }

    /* =========================
       BOUTON ENVELOPPE
    ========================= */

    if (showEnvBtn) {
        showEnvBtn.addEventListener("click", () => {
            showEnvelope = !showEnvelope;
            draw();
        });
    }

    /* =========================
       AUDIO (OPTIONNEL)
    ========================= */

    if (startBtn) {

        startBtn.addEventListener("click", () => {

            if (running) return;

            audioCtx = new (window.AudioContext || window.webkitAudioContext)();

            osc1 = audioCtx.createOscillator();
            osc2 = audioCtx.createOscillator();

            gain = audioCtx.createGain();

            osc1.type = "sine";
            osc2.type = "sine";

            osc1.frequency.value = f1.value;
            osc2.frequency.value = f2.value;

            osc1.connect(gain);
            osc2.connect(gain);

            gain.connect(audioCtx.destination);

            gain.gain.value = 0.1;

            osc1.start();
            osc2.start();

            running = true;
        });
    }

    if (stopBtn) {

        stopBtn.addEventListener("click", () => {

            if (!running) return;

            osc1.stop();
            osc2.stop();

            audioCtx.close();

            running = false;
        });
    }

    /* =========================
       INIT
    ========================= */

    updateValues();
    draw();

};
