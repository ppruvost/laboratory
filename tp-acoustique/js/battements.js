window.initBattements=function(){

const f1 =
document.getElementById("freq1");

const f2 =
document.getElementById("freq2");

const beat =
document.getElementById("fb");

const ctx =
document
.getElementById(
"graph"
)
.getContext("2d");

function draw(){

const diff =

Math.abs(

f1.value-f2.value

);

beat.innerHTML=
diff;

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

x/15

)

*

Math.cos(

x*diff/400

)

*80;

if(x===0)

ctx.moveTo(x,y);

else

ctx.lineTo(x,y);

}

ctx.stroke();

}

f1.oninput=draw;

f2.oninput=draw;

draw();

};
