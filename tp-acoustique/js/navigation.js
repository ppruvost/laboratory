const content=
document.getElementById(
"content"
);

document
.querySelectorAll("nav button")

.forEach(btn=>{

btn.onclick=()=>{

loadModule(

btn.dataset.module

);

};

});

async function loadModule(name){

const html=

await fetch(

`modules/${name}.html`

);

content.innerHTML=

await html.text();

updateProgress();

}
