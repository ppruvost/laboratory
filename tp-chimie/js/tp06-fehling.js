window.initTp06Fehling = function () {

console.log("TP06 Fehling chargé");

const tube =
document.getElementById("tube");

const molecule =
document.getElementById("molecule");

const btnFehling =
document.getElementById("btnFehling");

const btnChauffe =
document.getElementById("btnChauffe");

const observation =
document.getElementById("observation");

let fehlingAjoutee = false;

btnFehling.addEventListener(

"click",

() => {

fehlingAjoutee = true;

tube.style.background =
"#1B6CA8";

observation.innerHTML =

`
🔵 Liqueur de Fehling ajoutée.

Solution bleue contenant
les ions Cu²⁺.
`;

}

);

btnChauffe.addEventListener(

"click",

() => {

if(!fehlingAjoutee){

observation.innerHTML =
"Ajouter d'abord la liqueur de Fehling.";
return;

}

const mol =
molecule.value;

switch(mol){

case "butanal":

tube.style.background =
"#A04000";

observation.innerHTML =

`
✅ Test positif

Précipité rouge brique.

Le butanal possède
une fonction aldéhyde.
`;

break;

case "acetone":

tube.style.background =
"#1B6CA8";

observation.innerHTML =

`
❌ Test négatif

La solution reste bleue.

L'acétone est une cétone.
`;

break;

case "glucose":

tube.style.background =
"#A04000";

observation.innerHTML =

`
✅ Test positif

Le glucose possède
une fonction aldéhyde.
`;

break;

case "fructose":

tube.style.background =
"#A04000";

observation.innerHTML =

`
✅ Test positif

Le fructose s'isomérise
en milieu basique et chaud.

Le test devient positif.
`;

break;

}

}

);

};
