console.log("module fréquence chargé");

export function initFrequence(){

const AudioContextClass =
window.AudioContext ||
window.webkitAudioContext;

const audioCtx =
new AudioContextClass();

let osc=null;
let gain=null;

let interval=null;

let heardFreq=null;
let lostFreq=null;

let elapsed=0;

const DURATION=40;

const timer =
document.getElementById(
"timer"
);

const currentFreq =
document.getElementById(
"currentFreq"
);

const report =
document.getElementById(
"report"
);

const canvas =
document.getElementById(
"audiogram"
);

const ctx =
canvas.getContext("2d");


/* ------------------ */

function freqAt(t){

const ratio =

t / DURATION;

return Math.round(

20 *

Math.pow(

20000/20,

ratio

)

);

}

/* ------------------ */

async function startTest(){

await audioCtx.resume();

stopTest();

heardFreq=null;

lostFreq=null;

elapsed=0;

osc =
audioCtx.createOscillator();

gain =
audioCtx.createGain();

osc.type="sine";

gain.gain.value=0.2;

osc.connect(gain);

gain.connect(
audioCtx.destination
);

osc.start();

interval=setInterval(()=>{

elapsed+=0.1;

timer.innerHTML=

elapsed.toFixed(1);

const f=

freqAt(elapsed);

currentFreq.innerHTML=

f+" Hz";

osc.frequency.value=f;

draw();

if(

elapsed>=DURATION

){

stopTest();

}

},100);

}

/* ------------------ */

function stopTest(){

clearInterval(interval);

if(osc){

try{

osc.stop();

}catch(e){}

osc.disconnect();

osc=null;

}

}

/* ------------------ */

function heard(){

heardFreq=

freqAt(elapsed);

draw();

}

/* ------------------ */

function lost(){

lostFreq=

freqAt(elapsed);

draw();

analyse();

}

/* ------------------ */

function analyse(){

if(

heardFreq===null ||

lostFreq===null

){

return;

}

const range=

lostFreq-heardFreq;

let msg="";

if(

heardFreq<40 &&

lostFreq>16000

){

msg=

"🟢 Audition dans la plage attendue.";

}

else if(

lostFreq>12000

){

msg=

"🟠 Fatigue auditive possible.";

}

else{

msg=

"🔴 Plage réduite. Pensez à consulter pour confirmer cet essai.";

}

report.innerHTML=

`
<h3>Compte rendu</h3>

Début perception :
${heardFreq} Hz

<br>

Fin perception :
${lostFreq} Hz

<br>

Plage :
${range} Hz

<br><br>

<b>${msg}</b>

`;

}

/* ------------------ */

function draw(){

ctx.clearRect(

0,
0,
canvas.width,
canvas.height

);

ctx.beginPath();

ctx.moveTo(
60,
300
);

ctx.lineTo(
850,
300
);

ctx.moveTo(
60,
300
);

ctx.lineTo(
60,
40
);

ctx.stroke();

if(

heardFreq

){

point(

heardFreq,

"green"

);

}

if(

lostFreq

){

point(

lostFreq,

"red"

);

}

}

/* ------------------ */

function point(

f,

color

){

const x=

60+

(

Math.log10(f)-

Math.log10(20)

)

/

(

Math.log10(20000)-

Math.log10(20)

)

*760;

ctx.fillStyle=color;

ctx.beginPath();

ctx.arc(

x,

170,

8,

0,

Math.PI*2

);

ctx.fill();

ctx.fillText(

f+" Hz",

x-20,

200

);

}

/* ------------------ */

function exportPDF(){

const img=

canvas.toDataURL();

const w=

window.open("");

w.document.write(

`
<h2>

Résultat test auditif

</h2>

${report.innerHTML}

<img src="${img}" width="100%">

`

);

w.print();

}

/* ------------------ */

document
.getElementById(
"startTest"
)
.onclick=startTest;

document
.getElementById(
"stopTest"
)
.onclick=stopTest;

document
.getElementById(
"hearBtn"
)
.onclick=heard;

document
.getElementById(
"lostBtn"
)
.onclick=lost;

document
.getElementById(
"exportPdf"
)
.onclick=exportPDF;

draw();

}
