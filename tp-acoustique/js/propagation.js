window.initAttenuation = function () {

console.log("labo acoustique chargé");

const AudioContextClass =
window.AudioContext || window.webkitAudioContext;

const audioCtx = new AudioContextClass();

let osc = null;
let leftGain = null;
let rightGain = null;
let splitter = null;
let merger = null;

/* ==========================
   DOM
========================== */

const room = document.getElementById("room");
const people = document.getElementById("people");
const dist = document.getElementById("dist");
const pan = document.getElementById("pan");

const peopleVal = document.getElementById("peopleVal");
const distVal = document.getElementById("distVal");
const panVal = document.getElementById("panVal");

const info = document.getElementById("info");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/* ==========================
   PARAMÈTRES SALLE
========================== */

const rooms = {

vide: {
    baseRT: 0.3,
    absorption: 0.2
},

classe: {
    baseRT: 0.8,
    absorption: 0.5
},

refectoire: {
    baseRT: 1.5,
    absorption: 0.6
},

usine: {
    baseRT: 2.5,
    absorption: 0.3
}

};

/* ==========================
   RT60 (SABINE SIMPLIFIÉ)
========================== */

function rt60() {

const r = rooms[room.value];

const A = Number(people.value) * 0.8 + r.absorption * 50;

return (0.161 * 100) / Math.max(A, 1);

}

/* ==========================
   DECROISSANCE SONORE
========================== */

function decay(distance, rt) {

const geometricLoss =
20 * Math.log10(distance);

const reverberation =
rt * 5;

return geometricLoss + reverberation;

}

/* ==========================
   ÉCHO MULTIPLE (simplifié)
========================== */

function echoLevel(rt) {

return Math.min(20, rt * 10);

}

/* ==========================
   UI UPDATE
========================== */

function updateUI() {

peopleVal.textContent = people.value + " personnes";
distVal.textContent = dist.value + " m";

let p = Number(pan.value);

if (p < -0.3) panVal.textContent = "gauche";
else if (p > 0.3) panVal.textContent = "droite";
else panVal.textContent = "centre";

const rt = rt60();

const loss =
decay(Number(dist.value), rt);

const echo =
echoLevel(rt);

info.innerHTML = `
RT60 ≈ ${rt.toFixed(2)} s<br>
Perte sonore ≈ ${loss.toFixed(1)} dB<br>
Échos ≈ ${echo.toFixed(1)} %
`;

draw(rt, loss, echo);

}

/* ==========================
   VISUALISATION
========================== */

function draw(rt, loss, echo) {

ctx.clearRect(0, 0, canvas.width, canvas.height);

/* salle */
ctx.fillStyle = "#eef3f8";
ctx.fillRect(0, 0, canvas.width, canvas.height);

/* réverbération */
for (let i = 0; i < echo * 2; i++) {

ctx.beginPath();

ctx.arc(
Math.random() * canvas.width,
Math.random() * canvas.height,
Math.random() * 10,
0,
Math.PI * 2
);

ctx.fillStyle = "rgba(0,0,255,0.1)";
ctx.fill();

}

/* source */
const x = (Number(pan.value) + 1) / 2 * canvas.width;

ctx.fillStyle = "red";
ctx.beginPath();
ctx.arc(x, 200, 10, 0, Math.PI * 2);
ctx.fill();

/* mur */
ctx.strokeStyle = "black";
ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

}

/* ==========================
   AUDIO SPATIAL
========================== */

function start() {

stop();

osc = audioCtx.createOscillator();

splitter = audioCtx.createChannelSplitter(2);
merger = audioCtx.createChannelMerger(2);

leftGain = audioCtx.createGain();
rightGain = audioCtx.createGain();

osc.type = "sine";
osc.frequency.value = 440;

const p = Number(pan.value);

/* stéréo */
leftGain.gain.value = p < 0 ? 1 : 1 - p;
rightGain.gain.value = p > 0 ? 1 : 1 + p;

osc.connect(leftGain);
osc.connect(rightGain);

leftGain.connect(merger, 0, 0);
rightGain.connect(merger, 0, 1);

merger.connect(audioCtx.destination);

osc.start();

}

/* ==========================
   STOP
========================== */

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

room.onchange = updateUI;
people.oninput = updateUI;
dist.oninput = updateUI;
pan.oninput = updateUI;

document.getElementById("startBtn").onclick = start;
document.getElementById("stopBtn").onclick = stop;

updateUI();

};
