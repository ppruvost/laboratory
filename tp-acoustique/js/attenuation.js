window.initAttenuation = function () {

console.log("module atténuation chargé");

/* ==========================
   AUDIO
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

const analyseBloc = document.getElementById("analyseAttenuation");
const explorationMsg = document.getElementById("explorationAttenuation");

/* ==========================
   SUIVI PEDAGOGIQUE
========================== */

let envDone = {
refectoire:false,
classe:false,
usine:false
};

let matDone = {
soft:false,
medium:false,
hard:false
};

let distDone = {
near:false,
far:false
};

/* ==========================
   ENVIRONNEMENTS
========================== */

const environments = {

refectoire: { base: 75, noise: 5 },
classe: { base: 65, noise: 2 },
usine: { base: 95, noise: 15 }

};

/* ==========================
   CALCUL
========================== */

function compute() {

const e = environments[env.value];

const wall = Number(wallMat.value);
const ceiling = Number(ceilingMat.value);
const dist = Number(distance.value);

/* matériaux */
const absorption =
(1 - wall) * 12 +
(1 - ceiling) * 8;

/* distance */
const distanceLoss =
20 * Math.log10(dist);

/* niveau final */
return e.base - absorption - distanceLoss + e.noise;

}

/* ==========================
   UPDATE UI
========================== */

function update() {

distVal.textContent = distance.value + " m";

const level = compute();

/* suivi */
if(env.value === "refectoire") envDone.refectoire = true;
if(env.value === "classe") envDone.classe = true;
if(env.value === "usine") envDone.usine = true;

if(wallMat.value === "0.2" || ceilingMat.value === "0.2") matDone.soft = true;
if(wallMat.value === "0.5" || ceilingMat.value === "0.5") matDone.medium = true;
if(wallMat.value === "0.8" || ceilingMat.value === "0.8") matDone.hard = true;

if(distance.value < 5) distDone.near = true;
if(distance.value > 15) distDone.far = true;

/* affichage */
let msg = "";

if(level < 40) msg = "🟢 calme";
else if(level < 70) msg = "🟡 acceptable";
else if(level < 90) msg = "🟠 bruyant";
else msg = "🔴 dangereux";

result.innerHTML =
`Niveau sonore : <b>${level.toFixed(1)} dB</b><br>${msg}`;

/* dessin */
draw(level);

/* analyse */
checkAnalyse();

}

/* ==========================
   VISUALISATION
========================== */

function draw(level) {

ctx.clearRect(0,0,canvas.width,canvas.height);

const x = (level / 120) * canvas.width;

ctx.fillStyle = "green";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle = "red";
ctx.fillRect(x,0,5,canvas.height);

ctx.fillStyle = "white";
ctx.font = "20px Arial";
ctx.fillText(level.toFixed(1) + " dB", 20, 40);

}

/* ==========================
   ANALYSE
========================== */

function updateProgress() {

if(!explorationMsg) return;

explorationMsg.innerHTML =

`Environnements ${envDone.refectoire && envDone.classe && envDone.usine ? "✓" : "✗"}<br>
Matériaux ${matDone.soft && matDone.medium && matDone.hard ? "✓" : "✗"}<br>
Distance proche/loin ${distDone.near && distDone.far ? "✓" : "✗"}`;

}

function checkAnalyse() {

const done =
envDone.refectoire &&
envDone.classe &&
envDone.usine &&
matDone.soft &&
matDone.medium &&
matDone.hard &&
distDone.near &&
distDone.far;

if(done && analyseBloc){

analyseBloc.classList.remove("hidden");
analyseBloc.classList.add("visible");

analyseBloc.scrollIntoView({behavior:"smooth"});

}

updateProgress();

}

/* ==========================
   AUDIO
========================== */

function play() {

stop();

osc = audioCtx.createOscillator();
gain = audioCtx.createGain();

osc.type = "sawtooth";
osc.frequency.value = 200;

gain.gain.value = Math.max(0.05, compute()/120);

osc.connect(gain);
gain.connect(audioCtx.destination);

osc.start();

}

/* ==========================
   STOP
========================== */

function stop() {

if(osc){

osc.stop();
osc.disconnect();
osc = null;

}

if(gain){
gain.disconnect();
gain = null;
}

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
