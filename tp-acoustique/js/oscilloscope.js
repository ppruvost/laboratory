const slider=

document.getElementById(
"freq"
);

const canvas=

document.getElementById(
"oscillo"
);

const ctx=

canvas.getContext("2d");

slider.oninput=()=>{

const f=

Number(slider.value);

freqText.innerHTML=

f+" Hz";

periodText.innerHTML=

"Période : "

+(1000/f).toFixed(2)

+" ms";

draw(f);

};

function draw(freq){

ctx.clearRect(

0,

0,

canvas.width,

canvas.height

);

ctx.beginPath();

for(let x=0;x<canvas.width;x++){

const y=

Math.sin(

x*freq/2000

)

*60;

ctx.lineTo(

x,

150+y

);

}

ctx.stroke();

}

draw(440);
