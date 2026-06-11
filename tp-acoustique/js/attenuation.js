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

if(!canvas){

    console.error(
        "Canvas attenuation introuvable"
    );

    return;
}

const ctx = canvas.getContext("2d");

const analyseBloc =
document.getElementById(
"analyseAttenuation"
);

const explorationMsg =
document.getElementById(
"explorationAttenuation"
);

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

refectoire: {

base:75,
noise:5

},

classe: {

base:65,
noise:2

},

usine: {

base:95,
noise:15

}

};

/* ==========================
   CALCUL
========================== */

function compute(){

const e =
environments[
env.value
];

const wall =
Number(
wallMat.value
);

const ceiling =
Number(
ceilingMat.value
);

const dist =
Number(
distance.value
);

/* absorption */

const absorption =

(1-wall)*12 +

(1-ceiling)*8;

/* perte distance */

const distanceLoss =

20 *

Math.log10(

Math.max(
1,
dist
)

);

/* niveau final */

return (

e.base

- absorption

- distanceLoss

+ e.noise

);

}

/* ==========================
   ANALYSE PEDAGOGIQUE
========================== */

function updateProgress(){

if(!explorationMsg)
return;

explorationMsg.innerHTML =

`
Environnements :
${envDone.refectoire && envDone.classe && envDone.usine ? "✔" : "✗"}

<br>

Matériaux :
${matDone.soft && matDone.medium && matDone.hard ? "✔" : "✗"}

<br>

Distances proche et éloignée :
${distDone.near && distDone.far ? "✔" : "✗"}
`;

}

function checkAnalyse(){

const done =

envDone.refectoire &&
envDone.classe &&
envDone.usine &&

matDone.soft &&
matDone.medium &&
matDone.hard &&

distDone.near &&
distDone.far;

if(

done &&
analyseBloc &&
!analyseBloc.classList.contains(
"visible"
)

){

analyseBloc.classList.remove(
"hidden"
);

analyseBloc.classList.add(
"visible"
);

analyseBloc.scrollIntoView({

behavior:"smooth"

});

}

updateProgress();

}

/* ==========================
   VISUALISATION
========================== */

function draw(level){

ctx.clearRect(

0,
0,
canvas.width,
canvas.height

);

const grad =

ctx.createLinearGradient(

0,
0,
canvas.width,
0

);

grad.addColorStop(
0,
"green"
);

grad.addColorStop(
0.5,
"orange"
);

grad.addColorStop(
1,
"red"
);

ctx.fillStyle = grad;

ctx.fillRect(

0,
0,
canvas.width,
canvas.height

);

/* curseur */

const x =

(level / 120) *

canvas.width;

ctx.fillStyle = "black";

ctx.fillRect(

x,
0,
6,
canvas.height

);

/* texte */

ctx.fillStyle = "white";

ctx.font =
"20px Arial";

ctx.fillText(

level.toFixed(1)
+
" dB",

20,
40

);

}

/* ==========================
   UPDATE
========================== */

function update(){

distVal.textContent =

distance.value +
" m";

const level =
compute();

/* suivi environnement */

if(
env.value === "refectoire"
)
envDone.refectoire = true;

if(
env.value === "classe"
)
envDone.classe = true;

if(
env.value === "usine"
)
envDone.usine = true;

/* suivi matériaux */

if(

wallMat.value === "0.2" ||

ceilingMat.value === "0.2"

)
matDone.soft = true;

if(

wallMat.value === "0.5" ||

ceilingMat.value === "0.5"

)
matDone.medium = true;

if(

wallMat.value === "0.8" ||

ceilingMat.value === "0.8"

)
matDone.hard = true;

/* suivi distance */

if(
Number(distance.value) <= 5
)
distDone.near = true;

if(
Number(distance.value) >= 15
)
distDone.far = true;

/* affichage résultat */

let msg = "";

if(level < 40){

msg =
"🟢 environnement calme";

}
else if(level < 70){

msg =
"🟡 niveau acceptable";

}
else if(level < 90){

msg =
"🟠 environnement bruyant";

}
else{

msg =
"🔴 niveau potentiellement dangereux";

}

result.innerHTML =

`
Niveau sonore perçu :

<b>
${level.toFixed(1)} dB
</b>

<br>

${msg}
`;

draw(level);

checkAnalyse();

}

/* ==========================
   AUDIO
========================== */

async function play(){

await audioCtx.resume();

stop();

osc =
audioCtx.createOscillator();

gain =
audioCtx.createGain();

osc.type =
"sawtooth";

osc.frequency.value =
200;

gain.gain.value =

Math.max(

0.05,

compute()/120

);

osc.connect(
gain
);

gain.connect(
audioCtx.destination
);

osc.start();

}

/* ==========================
   STOP
========================== */

function stop(){

if(osc){

try{

osc.stop();

}catch(e){}

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

distance.oninput =
update;

env.onchange =
update;

wallMat.onchange =
update;

ceilingMat.onchange =
update;

btn.onclick = () => {

update();

play();

};

/* ==========================
   INIT
========================== */

update();

updateProgress();

console.log(
"initAttenuation exécuté"
);

};
