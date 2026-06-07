window.initResonance=function(){

const slider =
document.getElementById(
"resFreq"
);

const txt =
document.getElementById(
"resFreqTxt"
);

const amp =
document.getElementById(
"ampRes"
);

const ctx =
document
.getElementById(
"resCanvas"
)
.getContext("2d");

const f0 = 1200;

function update(){

const f =
Number(slider.value);

txt.innerHTML =
f+" Hz";

const A =

100/

(

1+

Math.pow(

(f-f0)/250,

2

)

);

amp.innerHTML =
A.toFixed(1);

draw(f,A);

}

function draw(f,A){

ctx.clearRect(
0,
0,
900,
300
);

ctx.beginPath();

for(let x=0;x<900;x++){

const y=

150+

Math.sin(

x/20

)

*A;

if(x===0)

ctx.moveTo(x,y);

else

ctx.lineTo(x,y);

}

ctx.stroke();

}

slider.oninput=update;

update();

};
