function initFFT(){

const rpm=document.getElementById("rpm");
const rpmValue=document.getElementById("rpmValue");

const defaut=document.getElementById("defaut");

const freqRot=document.getElementById("freqRot");

const diag=document.getElementById("diag");

const analyseFFT =
document.getElementById("analyseFFT");

const explorationFFT =
document.getElementById("explorationFFT");

const signalCanvas =
document.getElementById("signalCanvas");

const fftCanvas =
document.getElementById("fftCanvas");

/* =========================
   SAFE DOM CHECK
========================= */

if(!rpm || !defaut || !signalCanvas || !fftCanvas){
    console.error("FFT : éléments DOM manquants");
    return;
}

const sctx = signalCanvas.getContext("2d");
const fctx = fftCanvas.getContext("2d");

signalCanvas.width=600;
signalCanvas.height=220;

fftCanvas.width=600;
fftCanvas.height=220;

/* =========================
   SUIVI PEDAGOGIQUE
========================= */

let testsFFT = {
    balourd:false,
    desalignement:false,
    jeu:false,
    roulement:false
};

/* =========================
   FUNCTIONS (AVANT USAGE)
========================= */

function updateProgressFFT(){

if(!explorationFFT) return;

const total =
Object.values(testsFFT).filter(Boolean).length;

explorationFFT.innerHTML = `
Défauts explorés : ${total}/3<br><br>

Balourd ${testsFFT.balourd ? "✓" : "✗"} |
Désalignement ${testsFFT.desalignement ? "✓" : "✗"} |
Jeu ${testsFFT.jeu ? "✓" : "✗"} |
Roulement ${testsFFT.roulement ? "✓" : "✗"}
`;
}

function checkAnalyseFFT(){

const total =
Object.values(testsFFT).filter(Boolean).length;

if(total >= 3 && analyseFFT){

analyseFFT.classList.remove("hidden");
analyseFFT.classList.add("visible");

}

updateProgressFFT();
}

/* =========================
   UPDATE
========================= */

function update(){

rpmValue.textContent=rpm.value;

const freq=rpm.value/60;

freqRot.textContent=freq.toFixed(1);

/* tracking défaut */
testsFFT[defaut.value] = true;

checkAnalyseFFT();

drawSignal(freq);
drawFFT(freq);
majDiagnostic();
}

/* =========================
   EVENTS
========================= */

rpm.addEventListener("input",update);
defaut.addEventListener("change",update);

document
.getElementById("corrigerBtn")
?.addEventListener("click",corrigerQuiz);

/* =========================
   DRAW SIGNAL
========================= */

function drawSignal(freq){

sctx.clearRect(0,0,600,220);

sctx.beginPath();

for(let x=0;x<600;x++){

let y=110 + Math.sin(x*0.02*freq)*40;

if(x===0) sctx.moveTo(x,y);
else sctx.lineTo(x,y);
}

sctx.stroke();
}

/* =========================
   FFT
========================= */

function drawFFT(freq){

fctx.clearRect(0,0,600,220);

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

fctx.font = "12px Arial";

pics.forEach((p,i)=>{

const x=p*8;
const h=50+(i*30);

fctx.fillRect(x,200-h,18,h);
fctx.fillText(p.toFixed(1)+" Hz",x,195-h);
});
}

/* =========================
   DIAGNOSTIC
========================= */

function majDiagnostic(){

const txt={
balourd:"Balourd probable",
desalignement:"Désalignement probable",
jeu:"Jeu mécanique",
roulement:"Défaut roulement"
};

diag.textContent=txt[defaut.value];
}

/* =========================
   QUIZ
========================= */

function corrigerQuiz(){

const rep=document.getElementById("quizRep");
const zone=document.getElementById("quizResult");

zone.textContent =
rep?.value==="Balourd"
? "Correct"
: "Incorrect";
}

/* =========================
   INIT
========================= */

update();

}

window.initFFT = initFFT;
