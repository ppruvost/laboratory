<script>

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


milieuBloc.style.display="none";

croixBloc.style.display="none";


const audio =

new Audio(

"assets/sounds/grave.wav"

);


btn.onclick=()=>{

audio.pause();

audio.currentTime=0;


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

milieuBloc.style.display=

"flex";

croixBloc.style.display=

"none";

milieuTxt.innerHTML=

"AIR";

onde.style.display=

"block";

onde.classList.add(
"ondeMove"
);

receiverText.innerHTML=

"Oreille reçoit";

message.innerHTML=

"Le son traverse l'air.";

audio.play();

}

else{

milieuBloc.style.display=

"flex";

croixBloc.style.display=

"block";

milieuTxt.innerHTML=

"VIDE";

onde.style.display=

"none";

receiverText.innerHTML=

"Silence";

message.innerHTML=

"Dans le vide : aucune propagation.";

}


setTimeout(()=>{

diapason.classList.remove(
"vibre"
);

onde.classList.remove(
"ondeMove"
);

audio.pause();

audio.currentTime=0;

},3000);

};

</script>
