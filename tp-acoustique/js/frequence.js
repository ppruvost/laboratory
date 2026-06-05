document.addEventListener("DOMContentLoaded", () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContextClass();

    let osc = null;
    let gain = null;
    let isPlaying = false;

    // seuils utilisateur
    let lowLimit = null;
    let highLimit = null;

    const freq = document.getElementById("freq");
    const freqText = document.getElementById("freqText");

    const playBtn = document.getElementById("playBtn");
    const stopBtn = document.getElementById("stopBtn");
    const hearBtn = document.getElementById("hearBtn");
    const noHearBtn = document.getElementById("noHearBtn");

    const canvas = document.getElementById("curve");
    const ctx = canvas.getContext("2d");

    const result = document.getElementById("result");

    function updateUI() {
        freqText.textContent = `${freq.value} Hz`;

        if (osc) {
            osc.frequency.setValueAtTime(freq.value, audioCtx.currentTime);
        }
    }

    async function start() {
        await audioCtx.resume();

        if (isPlaying) return;

        osc = audioCtx.createOscillator();
        gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.value = freq.value;

        gain.gain.value = 0.3;

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        isPlaying = true;
    }

    function stop() {
        if (!isPlaying) return;

        osc.stop();
        osc.disconnect();
        gain.disconnect();

        osc = null;
        isPlaying = false;
    }

    // 🎧 seuil BAS ou HAUT
    function hear() {
        const f = Number(freq.value);

        if (lowLimit === null) {
            lowLimit = f;
            result.textContent = `Seuil bas enregistré : ${lowLimit} Hz`;
        } else {
            highLimit = f;
            result.textContent = `Seuil haut enregistré : ${highLimit} Hz`;
        }

        drawCurve();
    }

    function noHear() {
        const f = Number(freq.value);

        if (lowLimit !== null && highLimit === null) {
            highLimit = f;
            result.textContent = `Seuil haut enregistré : ${highLimit} Hz`;
        } else {
            lowLimit = f;
            result.textContent = `Seuil bas ajusté : ${lowLimit} Hz`;
        }

        drawCurve();
    }

    // 📊 courbe de plage auditive
    function drawCurve() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.lineWidth = 3;

        // axe
        ctx.moveTo(50, 250);
        ctx.lineTo(450, 250);

        ctx.moveTo(50, 50);
        ctx.lineTo(50, 250);

        ctx.stroke();

        if (lowLimit !== null) {
            drawPoint(lowLimit, "blue");
        }

        if (highLimit !== null) {
            drawPoint(highLimit, "red");
        }

        if (lowLimit && highLimit) {
            ctx.beginPath();
            ctx.fillStyle = "rgba(0,150,255,0.2)";

            const x1 = mapFreq(lowLimit);
            const x2 = mapFreq(highLimit);

            ctx.fillRect(x1, 80, x2 - x1, 120);
        }
    }

    function drawPoint(f, color) {
        const x = mapFreq(f);

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, 150, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillText(`${f} Hz`, x - 10, 170);
    }

    // mapping log pour perception humaine
    function mapFreq(f) {
        const minLog = Math.log10(20);
        const maxLog = Math.log10(20000);
        const logF = Math.log10(f);

        return 50 + ((logF - minLog) / (maxLog - minLog)) * 400;
    }

    // events
    freq.addEventListener("input", updateUI);
    playBtn.addEventListener("click", start);
    stopBtn.addEventListener("click", stop);
    hearBtn.addEventListener("click", hear);
    noHearBtn.addEventListener("click", noHear);

    updateUI();
});
