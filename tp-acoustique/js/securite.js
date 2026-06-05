const riskSlider =
document.getElementById(
"risk"
);

const durationSlider =
document.getElementById(
"duration"
);

const riskText =
document.getElementById(
"riskText"
);

const riskLevel =
document.getElementById(
"riskLevel"
);

const advice =
document.getElementById(
"advice"
);

function evaluateRisk(){

const db =
Number(
riskSlider.value
);

const duration =
Number(
durationSlider.value
);

riskText.innerHTML =

db +

" dB pendant "

+

duration +

" min";

let level = "";
let message = "";
let cssClass = "";

if(db < 70){

level =
"Zone sûre";

message =

"Pas de risque particulier.";

cssClass =
"success";

}

else if(db < 85){

level =
"Vigilance";

message =

"Exposition prolongée déconseillée.";

cssClass =
"warning";

}

else if(db < 100){

level =
"Danger auditif";

message =

"Protection auditive recommandée.";

cssClass =
"warning";

}

else{

level =
"Risque élevé";

message =

"Limiter fortement l'exposition.";

cssClass =
"danger";

}


if(

db > 85 &&

duration > 60

){

message +=

" Temps d'exposition trop long.";

}


riskLevel.innerHTML =
level;

riskLevel.className =
cssClass;

advice.innerHTML =
message;

}


riskSlider.addEventListener(

"input",

evaluateRisk

);

durationSlider.addEventListener(

"input",

evaluateRisk

);

evaluateRisk();
