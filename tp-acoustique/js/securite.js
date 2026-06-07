window.initSecurite=function(){

const e=
document.getElementById("expo");

const t=
document.getElementById("expoTxt");

const r=
document.getElementById("risk");

function update(){

t.innerHTML=e.value;

if(e.value<80)

r.innerHTML=

"Risque faible";

else if(e.value<100)

r.innerHTML=

"Protection recommandée";

else

r.innerHTML=

"Danger auditif";

}

e.oninput=update;

update();

};
