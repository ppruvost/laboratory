window.initAttenuation = function () {

console.log("module atténuation chargé");

/* ==========================
   AUDIO SIMULATION
========================== */

const AudioContextClass =
window.AudioContext || window.webkitAudioContext;

const audioCtx = new AudioContextClass();

let osc = null;
let gain = null;

/* ==========================
   DOM
========================== */

const env = document.getElementById("env");
const wallMat = document.getElementById("wallMat");
const ceilingMat = document.getElementById("ceilingMat");
const distance = document.getElementById("distance");
const distVal = document.getElementById("distVal");

const result = document.getElementById("result");
const btn = document.getElementById("testBtn");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/* ==========================
   ENVIRONNEMENTS
========================== */

const environments = {

refectoire: {
    base: 75,
    noise: 5
},

classe: {
    base: 65,
    noise: 2
},

usine: {
    base: 95,
    noise: 15
}

};

/* ==========================
   CALCUL ATTENUATION
========================== */

function compute() {

const e = environments[env.value];

const wall = Number(wallMat.value);
const ceiling = Number(ceilingMat.value);

const dist = Number(distance.value);

/* absorption matériaux */
const absorption =
(1 - wall) * 12 +
(1 - ceiling) * 8;

/* perte distance (loi simplifiée) */
const distanceLoss =
20 * Math.log10(dist);

/* bruit ambiant */
const noise = e.noise;

/* niveau final */
const level =
e.base
- absorption
- distanceLoss
+ noise;

return level;

}

/* ==========================
   UI UPDATE
========================== */

function update() {

distVal.textContent = distance.value + " m";

const level = compute();

let msg = "";

if (level < 40) msg = "🟢 environnement calme";
else if (level < 70) msg = "🟡 acceptable";
else if (level < 90) msg = "🟠 bruyant";
else msg = "🔴 dangereux / usine forte intensité";

result.innerHTML = `
Niveau sonore perçu : <b>${level.toFixed(1)} dB</b><br>
${msg}
`;

draw(level);

}

/* ==========================
   VISUALISATION
========================== */

function draw(level) {

ctx.clearRect(0, 0, canvas.width, canvas.height);

/* gradient */
const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);

grad.addColorStop(0, "green");
grad.addColorStop(0.5, "orange");
grad.addColorStop(1, "red");

ctx.fillStyle = grad;
ctx.fillRect(0, 0, canvas.width, canvas.height);

/* barre niveau */
const x = (level / 120) * canvas.width;

ctx.fillStyle = "black";
ctx.fillRect(x, 0, 5, canvas.height);

/* texte */
ctx.fillStyle = "white";
ctx.font = "20px Arial";
ctx.fillText(level.toFixed(1) + " dB", 20, 40);

}

/* ==========================
   AUDIO SIMULATION
========================== */

function play() {

stop();

osc = audioCtx.createOscillator();
gain = audioCtx.createGain();

osc.type = "sawtooth";
osc.frequency.value = 200;

gain.gain.value = Math.max(0.05, compute() / 120);

osc.connect(gain);
gain.connect(audioCtx.destination);

osc.start();

}

/* ==========================
   EVENTS
========================== */

distance.oninput = update;
env.onchange = update;
wallMat.onchange = update;
ceilingMat.onchange = update;

btn.onclick = () => {

update();
play();

};

update();

};
