function initIntroduction(){

const btn =
document.getElementById(
"startAnim"
);

const milieu =
document.getElementById(
"milieu"
);

const marteau =
document.getElementById(
"marteau"
);

const diapason =
document.getElementById(
"diapason"
);

const onde =
document.getElementById(
"ondeImg"
);

const milieuTxt =
document.getElementById(
"milieuTxt"
);

const message =
document.getElementById(
"message"
);

const milieuBloc =
document.getElementById(
"milieuBloc"
);

const croixBloc =
document.getElementById(
"croixBloc"
);

const receiverText =
document.getElementById(
"receiverText"
);

const analyseBloc =
document.getElementById(
"analyseBloc"
);

/* sécurité */

if(
!btn ||
!milieu ||
!marteau ||
!diapason ||
!onde
){

console.warn(
"Elements introduction manquants"
);

return;

}

/* état initial */

milieuBloc.style.display =
"none";

croixBloc.style.display =
"none";

onde.style.display =
"none";

if(analyseBloc){

analyseBloc.classList.add(
"hidden"
);

}

/* suivi pédagogique */

let airObserve = false;
let videObserve = false;

/* audio */

const audio =
new Audio(
"assets/sounds/grave.wav"
);

/* fonction analyse */

function verifierAnalyse(){

if(
airObserve &&
videObserve &&
analyseBloc
){

analyseBloc.classList.remove(
"hidden"
);

analyseBloc.classList.add(
"visible"
);

analyseBloc.scrollIntoView({

behavior:"smooth",
block:"start"

});

}

}

/* évite doubles listeners */

btn.onclick = null;

btn.onclick = ()=>{

/* nettoyage animation précédente */

if(window.currentTimeout){

clearTimeout(
window.currentTimeout
);

}

audio.pause();
audio.currentTime = 0;

marteau.classList.add(
"frappe"
);

diapason.classList.add(
"vibre"
);

setTimeout(()=>{

marteau.classList.remove(
"frappe"
);

},400);

/* AIR */

if(
milieu.value === "air"
){

airObserve = true;

milieuBloc.style.display =
"block";

croixBloc.style.display =
"none";

milieuTxt.textContent =
"AIR";

onde.style.display =
"block";

onde.classList.remove(
"ondeMove"
);

void onde.offsetWidth;

onde.classList.add(
"ondeMove"
);

receiverText.textContent =
"Oreille reçoit le son";

message.textContent =
"Le son se propage dans l'air jusqu'au récepteur.";

audio.play().catch(()=>{});

}

/* VIDE */

else{

videObserve = true;

milieuBloc.style.display =
"block";

croixBloc.style.display =
"block";

milieuTxt.textContent =
"VIDE";

onde.style.display =
"none";

receiverText.textContent =
"Silence";

message.textContent =
"Dans le vide, le son ne peut pas se propager.";

}

/* vérification pédagogique */

verifierAnalyse();

/* arrêt animations */

window.currentTimeout =
setTimeout(()=>{

diapason.classList.remove(
"vibre"
);

onde.classList.remove(
"ondeMove"
);

audio.pause();

audio.currentTime = 0;

},3000);

};

console.log(
"initIntroduction exécuté"
);

}

/* export module */

window.initIntroduction =
initIntroduction;
