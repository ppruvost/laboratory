console.log("dangerDB:", window.dangerDB);
console.log("pictogrammes:", window.pictogrammes);

let progress=10;

function updateProgress(){

progress+=10;

if(progress>100)

progress=100;

document
.getElementById("bar")
.style.width=

progress+"%";

}
