window.initIntensite = function () {

console.log("module intensité avancé chargé");

const AudioContextClass =
window.AudioContext || window.webkitAudioContext;

const audioCtx = new AudioContextClass();

let osc = null;
let gainNode = null;

/* ==========================
   ELEMENTS
========================== */

const freqSlider = document.getElementById("freqSlider");
const intensitySlider = document.getElementById("intensitySlider");
const ageSelect = document.getElementById("ageSelect");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dbInfo = document.getElementById("dbInfo");
const danger = document.getElementById("danger");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

/* ==========================
   FLETCHER-MUNSON (approx)
========================== */

function earSensitivity(freq) {

    const f = Math.log10(freq);

    // creux 3-4 kHz (zone la plus sensible)
    const center = Math.log10(3500);

    const dist = Math.abs(f - center);

    return Math.exp(-Math.pow(dist * 3, 2));

}

/* ==========================
   PRESBYACOUSIE (âge)
========================== */

function ageLoss(freq, age) {

    const f = Math.log10(freq);

    const cutoff = age === 20 ? 18000 :
                   age === 40 ? 14000 :
                                8000;

    if (freq < cutoff) return 1;

    return Math.exp(-(f - Math.log10(cutoff)) * 4);

}

/* ==========================
   dB SPL simplifié
========================== */

function dbSPL(intensity, freq, age) {

    const base = 20 * Math.log10(intensity / 0.00002);

    const correction =
        20 * Math.log10(
            earSensitivity(freq) *
            ageLoss(freq, age)
        );

    return base + correction;

}

/* ==========================
   UPDATE UI
========================== */

function update() {

    const f = Number(freqSlider.value);
    const I = Number(intensitySlider.value);
    const age = Number(ageSelect.value);

    const db = dbSPL(I, f, age);

    dbInfo.innerHTML =
        `Fréquence: ${f} Hz<br>` +
        `Intensité: ${I.toFixed(3)}<br>` +
        `<b>Niveau perçu: ${db.toFixed(1)} dB SPL</b>`;

    if (db < 20) danger.innerHTML = "🟢 quasi inaudible";
    else if (db < 80) danger.innerHTML = "🟡 zone normale";
    else if (db < 120) danger.innerHTML = "🟠 fort";
    else danger.innerHTML = "🔴 danger";

    draw(f, I, age);

}

/* ==========================
   FLETCHER CURVE VISUALISATION
========================== */

function draw(freq, intensity, age) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;

    function x(f) {
        return (Math.log10(f) - Math.log10(20)) /
               (Math.log10(20000) - Math.log10(20)) * width;
    }

    function y(db) {
        return height - (db / 120) * height;
    }

    /* axe audible */
    ctx.strokeStyle = "#ccc";
    ctx.beginPath();
    ctx.moveTo(x(20), y(0));
    ctx.lineTo(x(20000), y(0));
    ctx.stroke();

    /* courbe sensibilité */
    ctx.strokeStyle = "blue";
    ctx.beginPath();

    for (let f = 20; f <= 20000; f *= 1.02) {

        const db = dbSPL(intensity, f, age);

        const X = x(f);
        const Y = y(db);

        if (f === 20) ctx.moveTo(X, Y);
        else ctx.lineTo(X, Y);

    }

    ctx.stroke();

    /* point courant */
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x(freq), y(dbSPL(intensity, freq, age)), 6, 0, Math.PI * 2);
    ctx.fill();

}

/* ==========================
   AUDIO
========================== */

function start() {

    stop();

    osc = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();

    osc.type = "sine";

    osc.frequency.value =
        Number(freqSlider.value);

    gainNode.gain.value =
        Number(intensitySlider.value);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();

}

function stop() {

    if (osc) {
        osc.stop();
        osc.disconnect();
        osc = null;
    }

}

/* ==========================
   EVENTS
========================== */

freqSlider.oninput = update;
intensitySlider.oninput = update;
ageSelect.onchange = update;

startBtn.onclick = start;
stopBtn.onclick = stop;

update();

};
