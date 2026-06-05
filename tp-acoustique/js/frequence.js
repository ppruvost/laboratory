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
    const exportBtn = document.getElementById("exportPdf");

    const canvas = document.getElementById("audiogram");
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

    function hear() {
        const f = Number(freq.value);

        if (lowLimit === null) {
            lowLimit = f;
        } else {
            highLimit = f;
        }

        drawAudiogram();
    }

    function noHear() {
        const f = Number(freq.value);

        if (lowLimit !== null && highLimit === null) {
            highLimit = f;
        } else {
            lowLimit = f;
        }

        drawAudiogram();
    }

    // 📊 AUDIOGRAMME TYPE MÉDICAL
    function drawAudiogram() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // fond
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // axes
        ctx.strokeStyle = "#000";
        ctx.beginPath();
        ctx.moveTo(60, 300);
        ctx.lineTo(580, 300); // freq
        ctx.moveTo(60, 300);
        ctx.lineTo(60, 20); // intensité
        ctx.stroke();

        // grille fréquence (log)
        const freqs = [20, 50, 100, 250, 500, 1000, 2000, 4000, 8000, 16000];

        freqs.forEach((f, i) => {
            const x = mapFreq(f);
            ctx.fillText(f + "Hz", x - 15, 320);
        });

        // seuil bas / haut
        if (lowLimit) drawPoint(lowLimit, "green");
        if (highLimit) drawPoint(highLimit, "red");

        // zone auditive
        if (lowLimit && highLimit) {
            ctx.beginPath();
            ctx.fillStyle = "rgba(0, 120, 255, 0.2)";

            const x1 = mapFreq(lowLimit);
            const x2 = mapFreq(highLimit);

            ctx.fillRect(x1, 60, x2 - x1, 240);
        }

        // courbe simulée audiogramme (forme réaliste)
        drawHearingCurve();
    }

    function drawHearingCurve() {
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;

        let first = true;

        for (let f = 20; f <= 16000; f *= 1.15) {
            const x = mapFreq(f);

            // simulation physiologique simple :
            // meilleure sensibilité autour de 1000-4000 Hz
            let y =
                200 +
                40 * Math.sin(Math.log10(f) * 2) +
                (f < 100 ? 60 : 0) +
                (f > 8000 ? 80 : 0);

            if (first) {
                ctx.moveTo(x, y);
                first = false;
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();
    }

    function drawPoint(f, color) {
        const x = mapFreq(f);

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, 200, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillText(f + " Hz", x - 20, 220);
    }

    function mapFreq(f) {
        const min = Math.log10(20);
        const max = Math.log10(20000);

        return 60 + ((Math.log10(f) - min) / (max - min)) * 500;
    }

    // 📄 EXPORT PDF
    function exportPDF() {
        const img = canvas.toDataURL("image/png");

        const win = window.open("");
        win.document.write(`
            <html>
            <head><title>TP Audiogramme</title></head>
            <body>
                <h2>Rapport TP - Plage auditive</h2>
                <p>Résultats de l'élève :</p>
                <ul>
                    <li>Seuil bas : ${lowLimit ?? "non défini"} Hz</li>
                    <li>Seuil haut : ${highLimit ?? "non défini"} Hz</li>
                </ul>
                <h3>Courbe audiogramme :</h3>
                <img src="${img}" style="width:100%">
            </body>
            </html>
        `);

        win.print();
    }

    freq.addEventListener("input", updateUI);
    playBtn.addEventListener("click", start);
    stopBtn.addEventListener("click", stop);
    hearBtn.addEventListener("click", hear);
    noHearBtn.addEventListener("click", noHear);
    exportBtn.addEventListener("click", exportPDF);

    updateUI();
    drawAudiogram();
});
