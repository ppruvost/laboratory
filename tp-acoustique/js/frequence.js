console.log("frequence.js chargé OK");

document.addEventListener("DOMContentLoaded", () => {

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContextClass();

    let osc = null;
    let gain = null;
    let isPlaying = false;

    let lowLimit = null;
    let highLimit = null;

    const freq = document.getElementById("freq");
    const freqText = document.getElementById("freqText");

    const playBtn = document.getElementById("playBtn");
    const stopBtn = document.getElementById("stopBtn");
    const hearBtn = document.getElementById("hearBtn");
    const noHearBtn = document.getElementById("noHearBtn");
    const diagnoseBtn = document.getElementById("diagnoseBtn");
    const exportBtn = document.getElementById("exportPdf");

    const canvas = document.getElementById("audiogram");
    const ctx = canvas.getContext("2d");

    const result = document.getElementById("result");

    // -----------------------------
    // DEBUG EVENT BINDING
    // -----------------------------
    console.log("Elements OK ?", {
        freq,
        playBtn,
        stopBtn
    });

    // -----------------------------
    // AUDIO
    // -----------------------------
    async function start() {
        console.log("start()");
        await audioCtx.resume();

        if (isPlaying) return;

        osc = audioCtx.createOscillator();
        gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.value = Number(freq.value);
        gain.gain.value = 0.3;

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        isPlaying = true;
    }

    function stop() {
        console.log("stop()");

        if (!isPlaying) return;

        osc.stop();
        osc.disconnect();
        gain.disconnect();

        osc = null;
        isPlaying = false;
    }

    function updateFreq() {
        const f = Number(freq.value);

        freqText.textContent = `${f} Hz`;

        if (osc) {
            osc.frequency.setValueAtTime(f, audioCtx.currentTime);
        }
    }

    // -----------------------------
    // MESURE
    // -----------------------------
    function hear() {
        const f = Number(freq.value);

        if (lowLimit === null) lowLimit = f;
        else highLimit = f;

        draw();
    }

    function noHear() {
        const f = Number(freq.value);

        if (lowLimit !== null && highLimit === null) {
            highLimit = f;
        } else {
            lowLimit = f;
        }

        draw();
    }

    // -----------------------------
    // DIAGNOSTIC
    // -----------------------------
    function diagnose() {

        if (lowLimit === null || highLimit === null) {
            result.textContent = "⚠️ Mesure incomplète";
            return;
        }

        const min = Math.min(lowLimit, highLimit);
        const max = Math.max(lowLimit, highLimit);
        const range = max - min;

        let diag = "";

        if (range >= 18000) diag = "🟢 Audition normale";
        else if (range >= 12000) diag = "🟠 Légère fatigue auditive";
        else diag = "🔴 Perte auditive possible";

        result.innerHTML =
            `Plage : ${min} Hz → ${max} Hz<br>` +
            `Amplitude : ${range} Hz<br>` +
            `<strong>${diag}</strong>`;
    }

    // -----------------------------
    // CANVAS
    // -----------------------------
    function draw() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(60, 350);
        ctx.lineTo(760, 350);
        ctx.moveTo(60, 350);
        ctx.lineTo(60, 20);
        ctx.stroke();

        if (lowLimit !== null) drawPoint(lowLimit, "green");
        if (highLimit !== null) drawPoint(highLimit, "red");
    }

    function drawPoint(f, color) {

        const x = map(f);

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, 200, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillText(`${f} Hz`, x - 20, 220);
    }

    function map(f) {
        return 60 + (Math.log10(f) - Math.log10(20)) /
            (Math.log10(20000) - Math.log10(20)) * 700;
    }

    // -----------------------------
    // EXPORT
    // -----------------------------
    function exportPDF() {

        const img = canvas.toDataURL("image/png");

        const w = window.open("");
        w.document.write(`
            <h2>TP Plage auditive</h2>
            <img src="${img}" style="width:100%">
        `);

        w.print();
    }

    // -----------------------------
    // EVENTS
    // -----------------------------
    freq.addEventListener("input", updateFreq);

    playBtn.addEventListener("click", start);
    stopBtn.addEventListener("click", stop);

    hearBtn.addEventListener("click", hear);
    noHearBtn.addEventListener("click", noHear);

    diagnoseBtn.addEventListener("click", diagnose);
    exportBtn.addEventListener("click", exportPDF);

    updateFreq();
    draw();
});
