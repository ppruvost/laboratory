console.log("module piezo chargé");

window.initPiezo=function(){

const canvas=
document.getElementById("piezoCanvas");

const ctx=
canvas.getContext("2d");

document
.getElementById("impact")
.onclick=()=>{

const amp=

Math.random()*5;

document
.getElementById("piezoVal")
.innerHTML=

amp.toFixed(2);

ctx.clearRect(
0,
0,
900,
250
);

ctx.beginPath();

for(let x=0;x<900;x++){

const y=

120+

Math.exp(

-x/100

)

*

Math.sin(x/10)

*

amp*20;

if(x===0)

ctx.moveTo(x,y);

else

ctx.lineTo(x,y);

}

ctx.stroke();

};

};
