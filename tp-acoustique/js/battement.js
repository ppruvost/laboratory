console.log("module battement chargé");

function initBattement(){

const freq1 =
document.getElementById("freq1");

const freq2 =
document.getElementById("freq2");

const f1Val =
document.getElementById("f1Val");

const f2Val =
document.getElementById("f2Val");

const fb =
document.getElementById("fb");

const fbMesure =
document.getElementById("fbMesure");

const graph =
document.getElementById("graph");

const ctx =
graph.getContext("2d");

const cas =
document.getElementById("casReel");

const explication =
document.getElementById("explication");

let audioCtx;

let osc1;
let osc2;

let gain;

let running=false;

let showEnvelope=false;

let compteur=0;

let lastSign=0;


function maj(){

f1Val.textContent=
freq1.value;

f2Val.textContent=
freq2.value;

const battement =
Math.abs(
freq2.value - freq1.value
);

fb.textContent=
battement.toFixed(1)
+" Hz";

if(osc1){

osc1.frequency.value=
freq1.value;

osc2.frequency.value=
freq2.value;

}

}


freq1.oninput=maj;
freq2.oninput=maj;


document
.getElementById("showEnv")
.onclick=()=>{

showEnvelope=
!showEnvelope;

};


document
.getElementById("startBtn")
.onclick=()=>{

if(running) return;

audioCtx=
new AudioContext();

osc1=
audioCtx.createOscillator();

osc2=
audioCtx.createOscillator();

gain=
audioCtx.createGain();

osc1.type="sine";
osc2.type="sine";

osc1.frequency.value=
freq1.value;

osc2.frequency.value=
freq2.value;

osc1.connect(gain);
osc2.connect(gain);

gain.connect(
audioCtx.destination
);

gain.gain.value=0.15;

osc1.start();
osc2.start();

running=true;

animate();

};


document
.getElementById("stopBtn")
.onclick=()=>{

if(!running) return;

osc1.stop();
osc2.stop();

audioCtx.close();

running=false;

};


cas.onchange=()=>{

switch(cas.value){

case "ventilo":

freq1.value=120;
freq2.value=124;

explication.textContent=
"Deux ventilateurs proches produisent un effet wou-wou périodique.";

break;

case "moteur":

freq1.value=300;
freq2.value=307;

explication.textContent=
"Deux moteurs presque synchrones créent des vibrations modulées utilisées pour détecter certains défauts.";

break;

case "accordage":

freq1.value=440;
freq2.value=442;

explication.textContent=
"Les musiciens réduisent les battements jusqu'à leur disparition pour accorder.";

break;

default:

explication.textContent="";

}

maj();

};


function animate(){

if(!running) return;

ctx.clearRect(
0,
0,
graph.width,
graph.height
);

ctx.beginPath();

let prev=0;

const f1=
Number(freq1.value);

const f2=
Number(freq2.value);

for(
let x=0;
x<graph.width;
x++
){

const t=
x/180;

const y1=
Math.sin(
2*Math.PI*
f1*
t*
0.005
);

const y2=
Math.sin(
2*Math.PI*
f2*
t*
0.005
);

const y=
y1+y2;

const py=
150-y*60;

if(x===0){

ctx.moveTo(
x,
py
);

}else{

ctx.lineTo(
x,
py
);

}

if(
prev<0 &&
y>=0
){

compteur++;

}

prev=y;

}

ctx.stroke();

fbMesure.textContent=
Math.round(
Math.abs(f2-f1)
);

if(showEnvelope){

ctx.beginPath();

for(
let x=0;
x<graph.width;
x++
){

const t=x/180;

const env=
Math.abs(
2*Math.cos(
Math.PI*
(f2-f1)*
t*
0.005
)
);

const py=
150-env*70;

if(x===0){

ctx.moveTo(
x,
py
);

}else{

ctx.lineTo(
x,
py
);

}

}

ctx.stroke();

}

requestAnimationFrame(
animate
);

}

maj();

}

initBattement();
