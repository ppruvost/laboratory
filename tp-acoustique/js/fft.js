function initfft(){

const rpm=document.getElementById("rpm");
const rpmValue=document.getElementById("rpmValue");

const defaut=document.getElementById("defaut");

const freqRot=document.getElementById("freqRot");

const diag=document.getElementById("diag");

const signalCanvas=
document.getElementById("signalCanvas");

const fftCanvas=
document.getElementById("fftCanvas");

const sctx=
signalCanvas.getContext("2d");

const fctx=
fftCanvas.getContext("2d");

signalCanvas.width=600;
signalCanvas.height=220;

fftCanvas.width=600;
fftCanvas.height=220;

rpm.addEventListener("input",update);

defaut.addEventListener("change",update);

document
.getElementById("corrigerBtn")
.addEventListener(
"click",
corrigerQuiz
);

update();

function update(){

rpmValue.textContent=rpm.value;

const freq=rpm.value/60;

freqRot.textContent=
freq.toFixed(1);

drawSignal(freq);

drawFFT(freq);

majDiagnostic();

}

function drawSignal(freq){

sctx.clearRect(
0,
0,
signalCanvas.width,
signalCanvas.height
);

sctx.beginPath();

for(let x=0;x<600;x++){

let y=
110+
Math.sin(
x*0.02*freq
)*40;

sctx.lineTo(x,y);

}

sctx.stroke();

}

function drawFFT(freq){

fctx.clearRect(
0,
0,
600,
220
);

let pics=[];

switch(defaut.value){

case "balourd":

pics=[freq];

break;

case "desalignement":

pics=[freq,freq*2];

break;

case "jeu":

pics=[freq,freq*2,freq*3];

break;

case "roulement":

pics=[freq*5,freq*6];

break;

}

pics.forEach((p,i)=>{

const x=p*8;

const h=50+(i*30);

fctx.fillRect(
x,
200-h,
18,
h
);

fctx.fillText(
p.toFixed(1)+"Hz",
x,
195-h
);

});

}

function majDiagnostic(){

const txt={
balourd:"Balourd probable",
desalignement:"Désalignement probable",
jeu:"Jeu mécanique",
roulement:"Défaut roulement"
};

diag.textContent=
txt[defaut.value];

}

function corrigerQuiz(){

const rep=
document.getElementById(
"quizRep"
).value;

const zone=
document.getElementById(
"quizResult"
);

zone.textContent=

rep==="Balourd"

? "Correct"

: "Incorrect";

}

}

window.initFFT=initFFT;
