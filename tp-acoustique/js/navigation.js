const content =
document.getElementById("content");


/* ==========================
   NAVIGATION BOUTONS
========================== */

document
.querySelectorAll("nav button")
.forEach(btn=>{

btn.addEventListener(

"click",

()=>{

loadModule(
btn.dataset.module
);

}

);

});


/* ==========================
   CHARGEMENT MODULE
========================== */

async function loadModule(name){

try{

console.log(
"Chargement module :",
name
);


/* ==========================
   CHARGE HTML
========================== */

const response =
await fetch(
`modules/${name}.html`
);

if(!response.ok){

throw new Error(
`Module ${name} introuvable`
);

}

const html =
await response.text();

content.innerHTML =
html;


/* ==========================
   SUPPRIME ANCIENS SCRIPTS
========================== */

document
.querySelectorAll(
"script[data-module-script]"
)
.forEach(
s => s.remove()
);


/* ==========================
   AJOUT SCRIPT MODULE
========================== */

const script =
document.createElement(
"script"
);

script.src =
`js/${name}.js?time=${Date.now()}`;

script.dataset.moduleScript =
name;


/* ==========================
   SCRIPT CHARGÉ
========================== */

script.onload = ()=>{

console.log(
`${name}.js chargé`
);

/* nom attendu :
frequence -> initFrequence
quiz -> initQuiz
etc.
*/

const initName =

"init" +

name.charAt(0)
.toUpperCase()

+

name.slice(1);


if(

typeof window[initName]
=== "function"

){

window[initName]();

console.log(
`${initName} exécuté`
);

}else{

console.log(
`Pas de ${initName}()`
);

}

};


script.onerror = ()=>{

console.error(
`Impossible charger js/${name}.js`
);

};


document.body.appendChild(
script);


/* ==========================
   SAUVEGARDE + BARRE
========================== */

saveProgress(
name
);

updateProgress();

}catch(error){

console.error(error);

content.innerHTML =

`
<div class="card">

<h2>

Erreur

</h2>

<p>

${error.message}

</p>

</div>

`;

}

}


/* ==========================
   SAUVEGARDE MODULE
========================== */

function saveProgress(name){

localStorage.setItem(

"lastModule",

name

);

}


/* ==========================
   BARRE DE PROGRESSION
========================== */

function updateProgress(){

const bar =

document.getElementById(
"bar"
);

if(!bar) return;


const buttons =

document.querySelectorAll(
"nav button"
);

const current =

localStorage.getItem(
"lastModule"
);

let index = 1;


buttons.forEach(

(btn,i)=>{

if(

btn.dataset.module
=== current

){

index = i + 1;

}

}

);


const percent =

(index / buttons.length)

* 100;


bar.style.width =

percent + "%";

}


/* ==========================
   CHARGEMENT INITIAL
========================== */

window.addEventListener(

"DOMContentLoaded",

()=>{

const last =

localStorage.getItem(
"lastModule"
)

||

"introduction";


loadModule(
last
);

});
