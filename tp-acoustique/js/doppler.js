window.initDoppler=function(){

const c = 340;

const sourceFreq = 1000;

const speed =
document.getElementById(
"speed"
);

const txt =
document.getElementById(
"speedTxt"
);

const out =
document.getElementById(
"dopplerFreq"
);

function update(){

const v =

Number(speed.value);

txt.innerHTML=v;

const fp =

sourceFreq *

(

c/

(c-v)

);

out.innerHTML=

fp.toFixed(1);

}

speed.oninput=update;

update();

};
