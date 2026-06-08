function initFFT(){

const rpm=document.getElementById("rpm");
const rpmValue=document.getElementById("rpmValue");
const defaut=document.getElementById("defaut");

rpm.addEventListener("input",maj);
defaut.addEventListener("change",maj);

maj();

function maj(){

rpmValue.textContent=rpm.value;

const freq=rpm.value/60;

let pics=[];

if(defaut.value==="balourd"){

pics=[freq];

}

if(defaut.value==="desalignement"){

pics=[freq,freq*2,freq*3];

}

if(defaut.value==="roulement"){

pics=[freq*5,freq*6];

}

dessinerFFT(pics);

}

}

function dessinerFFT(pics){

const c=document.getElementById("spectre");

const ctx=c.getContext("2d");

ctx.clearRect(0,0,c.width,c.height);

pics.forEach((p,i)=>{

ctx.fillRect(
p*3,
150,
10,
-(50+i*20)
);

});

}

window.initFFT=initFFT;
