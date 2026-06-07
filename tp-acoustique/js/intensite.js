window.initIntensite = function(){

console.log(
"module intensité avancé chargé"
);

const AudioContextClass =

window.AudioContext ||

window.webkitAudioContext;

const audioCtx =

new AudioContextClass();

let osc = null;

let gainNode = null;

/* ================= */

const freqSlider =
document.getElementById(
"freqSlider"
);

const intensitySlider =
document.getElementById(
"intensitySlider"
);

const ageSelect =
document.getElementById(
"ageSelect"
);

const freqValue =
document.getElementById(
"freqValue"
);

const intensityValue =
document.getElementById(
"intensityValue"
);

const dbInfo =
document.getElementById(
"dbInfo"
);

const danger =
document.getElementById(
"danger"
);

const canvas =
document.getElementById(
"canvas"
);

const ctx =
canvas.getContext("2d");

/* ================= */

function earSensitivity(freq){

const f = Math.log10(freq);

const center =

Math.log10(3500);

const dist =

Math.abs(

f-center

);

return Math.exp(

-Math.pow(

dist*3,

2

)

);

}

/* ================= */

function ageLoss(freq,age){

const cutoff =

age===20 ?

18000 :

age===40 ?

14000 :

8000;

if(

freq < cutoff

)

return 1;

return Math.exp(

-(

Math.log10(freq)

-

Math.log10(cutoff)

)

*4

);

}

/* ================= */

function dbSPL(I,f,age){

const safeI =

Math.max(

I,

0.00001

);

const base =

20 *

Math.log10(

safeI /

0.00002

);

const corr =

20 *

Math.log10(

Math.max(

0.01,

earSensitivity(f)

*

ageLoss(f,age)

)

);

return base + corr;

}

/* ================= */

function draw(freq,intensity,age){

ctx.clearRect(

0,
0,
canvas.width,
canvas.height

);

const W=
canvas.width;

const H=
canvas.height;

/* grille */

ctx.strokeStyle="#ddd";

for(

let i=0;

i<=120;

i+=20

){

const y=

H -

(i/120)*H;

ctx.beginPath();

ctx.moveTo(0,y);

ctx.lineTo(W,y);

ctx.stroke();

}

/* courbe */

ctx.strokeStyle=

"#1f3c63";

ctx.lineWidth=3;

ctx.beginPath();

for(

let f=20;

f<=20000;

f*=1.02

){

const db=

dbSPL(

intensity,

f,

age

);

const x=

(

Math.log10(f)

-

Math.log10(20)

)

/

(

Math.log10(20000)

-

Math.log10(20)

)

*W;

const y=

H -

(db/120)*H;

if(f<21)

ctx.moveTo(x,y);

else

ctx.lineTo(x,y);

}

ctx.stroke();

/* point */

const x =

(

Math.log10(freq)

-

Math.log10(20)

)

/

(

Math.log10(20000)

-

Math.log10(20)

)

*W;

const y =

H -

(

dbSPL(

intensity,

freq,

age

)

/120

)

*H;

ctx.fillStyle=

"red";

ctx.beginPath();

ctx.arc(

x,

y,

7,

0,

Math.PI*2

);

ctx.fill();

}

/* ================= */

function update(){

const freq=

Number(
freqSlider.value
);

const intensity=

Number(
intensitySlider.value
);

const age=

Number(
ageSelect.value
);

freqValue.innerHTML=

freq+" Hz";

intensityValue.innerHTML=

intensity.toFixed(3);

const db=

dbSPL(

intensity,

freq,

age

);

dbInfo.innerHTML=

`
Fréquence :

${freq} Hz

<br>

Intensité :

${intensity.toFixed(3)}

<br><br>

<b>

${db.toFixed(1)} dB SPL

</b>
`;

if(db<20){

danger.className=

"result success";

danger.innerHTML=

"🟢 quasi inaudible";

}

else if(db<80){

danger.className=

"result warning";

danger.innerHTML=

"🟡 zone normale";

}

else if(db<120){

danger.className=

"result warning";

danger.innerHTML=

"🟠 exposition forte";

}

else{

danger.className=

"result danger";

danger.innerHTML=

"🔴 danger auditif";

}

draw(

freq,

intensity,

age

);

if(osc){

osc.frequency.value=freq;

gainNode.gain.value=

Math.min(

0.3,

intensity

);

}

}

/* ================= */

async function start(){

await audioCtx.resume();

stop();

osc=

audioCtx.createOscillator();

gainNode=

audioCtx.createGain();

osc.type="sine";

osc.frequency.value=

freqSlider.value;

gainNode.gain.value=

Math.min(

0.3,

intensitySlider.value

);

osc.connect(gainNode);

gainNode.connect(

audioCtx.destination

);

osc.start();

}

function stop(){

if(osc){

try{

osc.stop();

}catch(e){}

osc.disconnect();

osc=null;

}

}

/* ================= */

freqSlider.oninput=update;

intensitySlider.oninput=update;

ageSelect.onchange=update;

startBtn.onclick=start;

stopBtn.onclick=stop;

update();

};
