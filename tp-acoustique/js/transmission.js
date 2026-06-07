console.log("module transmission chargé");

window.initTransmission=function(){

const m=
document.getElementById("medium");

const d=
document.getElementById("distance");

const out=
document.getElementById("timeResult");

function calc(){

out.innerHTML=

(

d.value/

m.value

).toFixed(4);

}

m.onchange=calc;

d.oninput=calc;

calc();

};
