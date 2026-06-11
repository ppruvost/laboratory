window.initBattements = function () {

    console.log("initBattements exécuté");

    const $ = (id) => document.getElementById(id);

    /* =========================
       SAFE DOM CHECK
    ========================= */

    const f1 = $("freq1");
    const f2 = $("freq2");

    const f1Val = $("f1Val");
    const f2Val = $("f2Val");

    const fb = $("fb");
    const fbMesure = $("fbMesure");

    const canvas = $("graph");

    const startBtn = $("startBtn");
    const stopBtn = $("stopBtn");
    const showEnvBtn = $("showEnv");

    const casReel = $("casReel");
    const explication = $("explication");

    /* 🔴 FIX CRASH PRINCIPAL */
    if (!canvas) {
        console.error("battements : canvas introuvable (DOM pas prêt ou mauvais id)");
        return;
    }

    const ctx = canvas.getContext("2d");

    let audioCtx = null;
    let osc1 = null;
    let osc2 = null;
    let gain = null;

    let running = false;
    let showEnvelope = false;

    /* =========================
       UI
    ========================= */

    function updateUI() {
        if (f1Val) f1Val.textContent = f1.value;
        if (f2Val) f2Val.textContent = f2.value;
    }

    function draw() {

        const freq1 = Number(f1.value);
        const freq2 = Number(f2.value);
        const diff = Math.abs(freq1 - freq2);

        if (fb) fb.textContent = diff.toFixed(1) + " Hz";
        if (fbMesure) fbMesure.textContent = diff.toFixed(1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        /* axe */
        ctx.beginPath();
        ctx.strokeStyle = "#ccc";
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();

        /* signal */
        ctx.beginPath();
        ctx.strokeStyle = "#1f3c63";
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

        /* enveloppe */
        if (showEnvelope) {

            ctx.beginPath();
            ctx.strokeStyle = "rgba(255,0,0,0.5)";

            for (let x = 0; x < canvas.width; x++) {

                const t = x / 20;
                const env = Math.abs(Math.cos(t * diff * 0.02));

                const y = canvas.height / 2 - env * 80;

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.stroke();
        }
    }

    /* =========================
       EVENTS
    ========================= */

    f1?.addEventListener("input", () => {
        updateUI();
        draw();
    });

    f2?.addEventListener("input", () => {
        updateUI();
        draw();
    });

    showEnvBtn?.addEventListener("click", () => {
        showEnvelope = !showEnvelope;
        draw();
    });

    startBtn?.addEventListener("click", () => {

        if (running) return;

        audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        osc1 = audioCtx.createOscillator();
        osc2 = audioCtx.createOscillator();
        gain = audioCtx.createGain();

        osc1.type = "sine";
        osc2.type = "sine";

        osc1.frequency.value = Number(f1.value);
        osc2.frequency.value = Number(f2.value);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);

        gain.gain.value = 0.1;

        osc1.start();
        osc2.start();

        running = true;
    });

    stopBtn?.addEventListener("click", () => {

        if (!running) return;

        osc1?.stop();
        osc2?.stop();

        audioCtx?.close();

        running = false;
    });

    casReel?.addEventListener("change", () => {

        switch (casReel.value) {

            case "ventilo":
                f1.value = 120;
                f2.value = 124;
                explication.textContent = "Deux ventilateurs proches créent un effet wou-wou.";
                break;

            case "moteur":
                f1.value = 300;
                f2.value = 307;
                explication.textContent = "Deux moteurs proches produisent des battements.";
                break;

            case "accordage":
                f1.value = 440;
                f2.value = 442;
                explication.textContent = "Accordage : les battements disparaissent.";
                break;
        }

        updateUI();
        draw();
    });

    /* =========================
       INIT SAFE
    ========================= */

    setTimeout(() => {
        updateUI();
        draw();
    }, 0);
};
