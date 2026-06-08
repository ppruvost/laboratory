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


const audio =
new Audio(
"assets/sounds/grave.wav"
);


/* évite doubles listeners */

btn.onclick = null;


btn.onclick = ()=>{

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



if(
milieu.value==="air"
){

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
"Oreille reçoit";

message.textContent =
"Le son traverse l'air.";

audio.play();

}

else{

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
"Dans le vide : aucune propagation.";

}


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
