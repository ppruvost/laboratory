console.log("module battement chargé");

function initBattement() {

    const graph = document.getElementById("graph");

    if (!graph) {
        console.warn("battement : canvas introuvable (DOM pas prêt ou mauvais id)");
        return;
    }

    const ctx = graph.getContext("2d");

    const freq1 = document.getElementById("freq1");
    const freq2 = document.getElementById("freq2");

    const f1Val = document.getElementById("f1Val");
    const f2Val = document.getElementById("f2Val");

    const fb = document.getElementById("fb");
    const fbMesure = document.getElementById("fbMesure");

    const cas = document.getElementById("casReel");
    const explication = document.getElementById("explication");

    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const showEnvBtn = document.getElementById("showEnv");

    const observation = document.getElementById("observation");

    if (!freq1 || !freq2 || !startBtn || !stopBtn) {
        console.warn("battement : UI incomplet");
        return;
    }

    let audioCtx;
    let osc1;
    let osc2;
    let gain;

    let running = false;
    let showEnvelope = false;

    let interactionCount = 0;
    let observationShown = false;

    /* =========================
       MISE À JOUR UI
    ========================= */

    function maj() {

        const f1 = Number(freq1.value);
        const f2 = Number(freq2.value);

        f1Val.textContent = f1;
        f2Val.textContent = f2;

        const battement = Math.abs(f2 - f1);

        fb.textContent = battement.toFixed(1) + " Hz";

        if (osc1) osc1.frequency.value = f1;
        if (osc2) osc2.frequency.value = f2;
    }

    /* =========================
       DÉTECTION INTERACTION
    ========================= */

    function checkObservation() {

        interactionCount++;

        if (
            interactionCount >= 2 &&
            !observationShown &&
            observation
        ) {
            observation.style.display = "block";
            observationShown = true;
        }
    }

    freq1.oninput = () => {
        maj();
        checkObservation();
    };

    freq2.oninput = () => {
        maj();
        checkObservation();
    };

    /* =========================
       ENVELOPPE
    ========================= */

    if (showEnvBtn) {
        showEnvBtn.onclick = () => {
            showEnvelope = !showEnvelope;
        };
    }

    /* =========================
       AUDIO
    ========================= */

    startBtn.onclick = () => {

        if (running) return;

        audioCtx = new AudioContext();

        osc1 = audioCtx.createOscillator();
        osc2 = audioCtx.createOscillator();
        gain = audioCtx.createGain();

        osc1.type = "sine";
        osc2.type = "sine";

        osc1.frequency.value = Number(freq1.value);
        osc2.frequency.value = Number(freq2.value);

        gain.gain.value = 0.15;

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);

        osc1.start();
        osc2.start();

        running = true;

        animate();
    };

    stopBtn.onclick = () => {

        if (!running) return;

        try {
            osc1.stop();
            osc2.stop();
        } catch (e) {}

        audioCtx.close();
        running = false;
    };

    /* =========================
       CAS RÉELS
    ========================= */

    cas.onchange = () => {

        switch (cas.value) {

            case "ventilo":
                freq1.value = 120;
                freq2.value = 124;
                explication.textContent =
                    "Deux ventilateurs proches produisent un effet wou-wou périodique.";
                break;

            case "moteur":
                freq1.value = 300;
                freq2.value = 307;
                explication.textContent =
                    "Deux moteurs presque synchrones créent des vibrations modulées.";
                break;

            case "accordage":
                freq1.value = 440;
                freq2.value = 442;
                explication.textContent =
                    "Les musiciens réduisent les battements jusqu'à disparition.";
                break;

            default:
                explication.textContent = "";
        }

        maj();
    };

    /* =========================
       ANIMATION
    ========================= */

    function animate() {

        if (!running) return;

        ctx.clearRect(0, 0, graph.width, graph.height);

        ctx.beginPath();

        const f1 = Number(freq1.value);
        const f2 = Number(freq2.value);

        let prev = 0;

        for (let x = 0; x < graph.width; x++) {

            const t = x / 180;

            const y =
                Math.sin(2 * Math.PI * f1 * t * 0.005) +
                Math.sin(2 * Math.PI * f2 * t * 0.005);

            const py = 150 - y * 60;

            if (x === 0) ctx.moveTo(x, py);
            else ctx.lineTo(x, py);

            prev = y;
        }

        ctx.stroke();

        fbMesure.textContent = Math.round(Math.abs(f2 - f1));

        if (showEnvelope) {

            ctx.beginPath();

            for (let x = 0; x < graph.width; x++) {

                const t = x / 180;

                const env =
                    Math.abs(2 * Math.cos(
                        Math.PI * (f2 - f1) * t * 0.005
                    ));

                const py = 150 - env * 70;

                if (x === 0) ctx.moveTo(x, py);
                else ctx.lineTo(x, py);
            }

            ctx.stroke();
        }

        requestAnimationFrame(animate);
    }

    /* init */
    maj();
}

/* IMPORTANT : ne pas forcer init ici */
