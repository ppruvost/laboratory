const content = document.getElementById("content");


/* ==========================
   NAVIGATION BOUTONS
========================== */

document.querySelectorAll(

"nav button"

).forEach(btn=>{

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
"Module introuvable"
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
   CHARGE SCRIPT MODULE
========================== */

const script =
document.createElement(
"script"
);

script.src =
`js/${name}.js?time=${Date.now()}`;

/* évite cache GitHub */

script.dataset.moduleScript =
name;

script.defer = true;


/* ==========================
   APRES CHARGEMENT SCRIPT
========================== */

script.onload = async ()=>{

console.log(
`${name}.js chargé`
);

/* initialise modules dynamiques */

try{

if(name === "frequence"){

const mod =
await import(
`./js/frequence.js?time=${Date.now()}`
);

if(mod.initFrequence){

mod.initFrequence();

}

}

}catch(e){

console.error(
"Erreur init module :",
e
);

}

};


script.onerror = ()=>{

console.error(
`Impossible de charger js/${name}.js`
);

};

document.body.appendChild(
script
);


/* ==========================
   PROGRESSION
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

<p>

Erreur :
${error.message}

</p>

</div>

`;

}

}

/* ==========================
   SAUVEGARDE
========================== */

function saveProgress(name){

localStorage.setItem(

"lastModule",

name

);

}


/* ==========================
   PROGRESSION
========================== */

function updateProgress(){

const bar =

document.getElementById(

"bar"

);

if(!bar) return;

const modules =

document.querySelectorAll(

"nav button"

).length;

const current =

localStorage.getItem(

"lastModule"

);

let index = 1;

document

.querySelectorAll(

"nav button"

)

.forEach(

(btn,i)=>{

if(

btn.dataset.module===current

){

index=i+1;

}

}

);

bar.style.width =

(

index/modules

)*100 +

"%";

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

) ||

"introduction";

loadModule(

last

);

});
