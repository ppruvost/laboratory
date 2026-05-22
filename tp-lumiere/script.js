// ======================================
// NAVIGATION
// ======================================

const navButtons = document.querySelectorAll("nav button");
const sections = document.querySelectorAll(".section");

navButtons.forEach(button=>{

button.addEventListener("click",()=>{

sections.forEach(section=>{
section.classList.remove("active");
});

document
.getElementById(button.dataset.target)
.classList.add("active");

});

});

// ======================================
// RVB
// ======================================

const red = document.getElementById("red");
const green = document.getElementById("green");
const blue = document.getElementById("blue");

const rgbCanvas = document.getElementById("rgbCanvas");
const rgbCtx = rgbCanvas.getContext("2d");

function updateRGB(){

const r = parseInt(red.value);
const g = parseInt(green.value);
const b = parseInt(blue.value);

document.getElementById("rVal").textContent=r;
document.getElementById("gVal").textContent=g;
document.getElementById("bVal").textContent=b;

const color=`rgb(${r},${g},${b})`;

document.getElementById("rgbPreview")
.style.background=color;

document.getElementById("rgbResult")
.innerHTML=`HEX : ${rgbToHex(r,g,b)}`;

drawRGB(r,g,b);

}

function drawRGB(r,g,b){

rgbCtx.clearRect(0,0,350,250);

rgbCtx.fillStyle="black";
rgbCtx.fillRect(0,0,350,250);

rgbCtx.globalCompositeOperation="lighter";

rgbCtx.fillStyle=`rgba(${r},0,0,0.8)`;
rgbCtx.beginPath();
rgbCtx.arc(130,140,70,0,Math.PI*2);
rgbCtx.fill();

rgbCtx.fillStyle=`rgba(0,${g},0,0.8)`;
rgbCtx.beginPath();
rgbCtx.arc(220,140,70,0,Math.PI*2);
rgbCtx.fill();

rgbCtx.fillStyle=`rgba(0,0,${b},0.8)`;
rgbCtx.beginPath();
rgbCtx.arc(175,80,70,0,Math.PI*2);
rgbCtx.fill();

rgbCtx.globalCompositeOperation="source-over";

}

function rgbToHex(r,g,b){

return "#" + [r,g,b]
.map(x=>x.toString(16).padStart(2,"0"))
.join("")
.toUpperCase();

}

[red,green,blue].forEach(el=>{
el.addEventListener("input",updateRGB);
});

updateRGB();

// ======================================
// CMJ
// ======================================

const cyan=document.getElementById("cyan");
const magenta=document.getElementById("magenta");
const yellow=document.getElementById("yellow");

const cmyCanvas=document.getElementById("cmyCanvas");
const cmyCtx=cmyCanvas.getContext("2d");

function updateCMY(){

const c=parseInt(cyan.value);
const m=parseInt(magenta.value);
const y=parseInt(yellow.value);

document.getElementById("cVal").textContent=c+"%";
document.getElementById("mVal").textContent=m+"%";
document.getElementById("yVal").textContent=y+"%";

const r=Math.round(255*(1-c/100));
const g=Math.round(255*(1-m/100));
const b=Math.round(255*(1-y/100));

const color=`rgb(${r},${g},${b})`;

document.getElementById("cmyPreview")
.style.background=color;

document.getElementById("cmyResult")
.innerHTML=`HEX : ${rgbToHex(r,g,b)}`;

drawCMY(c,m,y,r,g,b);

}

function drawCMY(c,m,y,r,g,b){

cmyCtx.clearRect(0,0,350,250);

cmyCtx.fillStyle="white";
cmyCtx.fillRect(0,0,350,250);

cmyCtx.fillStyle=`rgba(0,255,255,${c/100})`;
cmyCtx.fillRect(40,40,120,160);

cmyCtx.fillStyle=`rgba(255,0,255,${m/100})`;
cmyCtx.fillRect(115,40,120,160);

cmyCtx.fillStyle=`rgba(255,255,0,${y/100})`;
cmyCtx.fillRect(190,40,120,160);

cmyCtx.fillStyle=`rgb(${r},${g},${b})`;
cmyCtx.fillRect(135,90,80,60);

}

[cyan,magenta,yellow].forEach(el=>{
el.addEventListener("input",updateCMY);
});

updateCMY();

// ======================================
// FILTRES
// ======================================

const filterCanvas=document.getElementById("filterCanvas");
const filterCtx=filterCanvas.getContext("2d");

function applyFilter(){

const light=document.getElementById("lightSelect").value;
const filter=document.getElementById("filterSelect").value;

const allowed={

red:["red","magenta","yellow"],
green:["green","cyan","yellow"],
blue:["blue","cyan","magenta"],
white:["red","green","blue","cyan","magenta","yellow"]

};

const pass=allowed[light].includes(filter);

filterCtx.clearRect(0,0,350,250);

filterCtx.fillStyle=light;
filterCtx.fillRect(0,0,150,250);

filterCtx.fillStyle=filter;
filterCtx.fillRect(150,0,80,250);

filterCtx.fillStyle=pass?light:"black";
filterCtx.fillRect(230,0,120,250);

document.getElementById("filterResult")
.innerHTML=pass
?"La lumière traverse"
:"La lumière est absorbée";

}

applyFilter();

// ======================================
// CONES
// ======================================

const waveSlider=document.getElementById("waveSlider");

waveSlider.addEventListener("input",()=>{

const wavelength=parseInt(waveSlider.value);

document.getElementById("waveValue")
.textContent=wavelength+" nm";

const s=Math.max(0,100-Math.abs(wavelength-420));
const m=Math.max(0,100-Math.abs(wavelength-530));
const l=Math.max(0,100-Math.abs(wavelength-565));

document.getElementById("sCone")
.style.width=s+"%";

document.getElementById("mCone")
.style.width=m+"%";

document.getElementById("lCone")
.style.width=l+"%";

});

// =========================================
// TEST ISHIHARA COMPLET
// =========================================

const ishCanvas =
document.getElementById("ishiharaCanvas");

const ishCtx =
ishCanvas.getContext("2d");

const visionMode =
document.getElementById("visionMode");

const answerInput =
document.getElementById("answerInput");

const resultBox =
document.getElementById("resultBox");

const plates = [

{
number:"12",
fg:"#ff7f50",
bg:"#6bbf59"
},

{
number:"8",
fg:"#ff8c42",
bg:"#4caf50"
},

{
number:"29",
fg:"#f78154",
bg:"#5cae5c"
},

{
number:"74",
fg:"#f79f79",
bg:"#60b060"
},

{
number:"5",
fg:"#f76f6f",
bg:"#58a858"
}

];

let currentPlate = null;

// =========================================
// GENERATE PLATE
// =========================================

function generatePlate(){

ishCtx.clearRect(0,0,500,500);

ishCtx.fillStyle="#222";

ishCtx.beginPath();
ishCtx.arc(175,175,160,0,Math.PI*2);
ishCtx.fill();

currentPlate =
plates[Math.floor(Math.random()*plates.length)];

drawDots(currentPlate);

}

// =========================================
// DRAW DOTS
// =========================================

function drawDots(plate){

const mode = visionMode.value;

for(let i=0;i<1400;i++){

let x = Math.random()*500;
let y = Math.random()*500;

let dx = x-250;
let dy = y-250;

if(dx*dx+dy*dy > 230*230){
continue;
}

let radius = 6 + Math.random()*10;

let inside =
isInsideNumber(x,y,plate.number);

let color =
inside ? plate.fg : plate.bg;

color =
applyColorBlindness(color,mode);

ishCtx.fillStyle=color;

ishCtx.beginPath();
ishCtx.arc(x,y,radius,0,Math.PI*2);
ishCtx.fill();

}

}

// =========================================
// DETECT NUMBER SHAPE
// =========================================

function isInsideNumber(x,y,number){

ishCtx.font="bold 170px Arial";

const textWidth =
ishCtx.measureText(number).width;

const tx = 250 - textWidth/2;
const ty = 290;

const temp =
document.createElement("canvas");

temp.width=500;
temp.height=500;

const tctx =
temp.getContext("2d");

tctx.font="bold 170px Arial";

tctx.fillStyle="white";

tctx.fillText(number,tx,ty);

const pixel =
tctx.getImageData(x,y,1,1).data;

return pixel[3] > 0;

}

// =========================================
// COLOR BLINDNESS SIMULATION
// =========================================

function applyColorBlindness(hex,mode){

let rgb = hexToRgb(hex);

let r=rgb.r;
let g=rgb.g;
let b=rgb.b;

switch(mode){

case "protanopia":

r = 0.567*r + 0.433*g;
g = 0.558*r + 0.442*g;
b = b;

break;

case "deuteranopia":

r = 0.625*r + 0.375*g;
g = 0.7*r + 0.3*g;
b = b;

break;

case "tritanopia":

r = r;
g = 0.95*g + 0.05*b;
b = 0.433*g + 0.567*b;

break;

}

return `rgb(${r},${g},${b})`;

}

// =========================================
// HEX TO RGB
// =========================================

function hexToRgb(hex){

hex = hex.replace("#","");

let bigint =
parseInt(hex,16);

return {

r:(bigint>>16)&255,
g:(bigint>>8)&255,
b:bigint&255

};

}

// =========================================
// VALIDATION
// =========================================

document
.getElementById("checkAnswer")
.addEventListener("click",()=>{

const userAnswer =
answerInput.value.trim();

if(userAnswer === currentPlate.number){

resultBox.innerHTML =
"<span class='good'>Bonne réponse ✔</span>";

}else{

resultBox.innerHTML =
`<span class='bad'>
Incorrect ❌ — réponse :
${currentPlate.number}
</span>`;

}

});

// =========================================
// NEW PLATE
// =========================================

document
.getElementById("newPlateBtn")
.addEventListener("click",()=>{

answerInput.value="";
resultBox.innerHTML="";

generatePlate();

});

// =========================================
// CHANGE MODE
// =========================================

visionMode.addEventListener("change",()=>{

generatePlate();

});

// =========================================
// INIT
// =========================================

generatePlate();

// ======================================
// QUIZ
// ======================================

function correctQuiz(){

let score=0;

if(document.querySelector('input[name="q1"]:checked')?.value==="true"){
score++;
}

if(document.querySelector('input[name="q2"]:checked')?.value==="true"){
score++;
}

document.getElementById("score")
.innerHTML=`<h3>Score : ${score}/2</h3>`;

}
