import { products } from "./data/products.js";

const reactif = document.getElementById("reactif");
const fiche = document.getElementById("fiche");

let stock = new Map(products.map(p => [p.nom, p]));

// ---------------------
// INIT LISTE PRODUITS
// ---------------------
products
.sort((a,b)=>a.nom.localeCompare(b.nom))
.forEach(p=>{
  const opt=document.createElement("option");
  opt.value=p.nom;
  opt.textContent=p.nom;
  reactif.appendChild(opt);
});

// ---------------------
// UI
// ---------------------
document.getElementById("typePrep").addEventListener("change",e=>{
document.getElementById("blocMolaire").classList.toggle("hidden",e.target.value!=="molaire");
document.getElementById("blocMassique").classList.toggle("hidden",e.target.value!=="massique");
document.getElementById("blocDilution").classList.toggle("hidden",e.target.value!=="dilution");
});

// ---------------------
// STOCK SAFE
// ---------------------
function getProduit(nom){
return stock.get(nom);
}

// ---------------------
// PICTOGRAMMES
// ---------------------
function pictos(p){
if(!p?.pictogramme?.length) return "";
return `<div class="pictoZone">
${p.pictogramme.map(x=>`<img src="assets/img/pictogrammes/${x}">`).join("")}
</div>`;
}

// ---------------------
// DILUTION
// ---------------------
function calcDilution(){
const C1 = +document.getElementById("C1").value;
const C2 = +document.getElementById("C2").value;
const V2 = +document.getElementById("V2").value;

const V1 = (C2*V2)/C1;

return `
<div class="bloc">
<h3>Dilution</h3>
<p>C₁V₁ = C₂V₂</p>
<p>V₁ = ${V1.toFixed(2)} mL</p>
</div>
`;
}

// ---------------------
// GENERATION
// ---------------------
document.getElementById("generer").addEventListener("click",()=>{

const nom = reactif.value;
const p = getProduit(nom);
if(!p){
fiche.innerHTML="Produit absent du stock";
return;
}

const type = document.getElementById("typePrep").value;

let html = `
<h2>${p.nom}</h2>
<p><b>Formule :</b> ${p.formule}</p>
<p><b>Catégorie :</b> ${p.categorie}</p>

<div class="bloc">
<h3>EPI</h3>
<p>${(p.obligation||[]).join(", ")}</p>
</div>

<div class="bloc">
<h3>Risques</h3>
<p>${(p.dangers||[]).join(", ")}</p>
</div>

${pictos(p)}
`;

// ---------------- MOLÉCULAIRE ----------------
if(type==="molaire"){

const C = +document.getElementById("C").value;
const V = +document.getElementById("V").value/1000;

// approximation simple (Bac Pro)
const M = 40; // fallback pédagogique

const m = (C*V*M).toFixed(2);

html += `
<div class="bloc">
<h3>Préparation molaire</h3>
<p>m = ${m} g</p>
<ol>
<li>Peser ${m} g</li>
<li>Dissoudre dans eau distillée</li>
<li>Compléter à ${V*1000} mL</li>
</ol>
</div>
`;
}

// ---------------- MASSIQUE ----------------
if(type==="massique"){

const Cm = +document.getElementById("Cm").value;
const V = +document.getElementById("Vm").value/1000;

const m = (Cm*V).toFixed(2);

html += `
<div class="bloc">
<h3>Préparation massique</h3>
<p>m = ${m} g</p>
</div>
`;
}

// ---------------- DILUTION ----------------
if(type==="dilution"){
html += calcDilution();
}

// ---------------- AUTO ----------------
if(type==="auto"){
html += `
<div class="bloc">
<h3>Protocole automatique</h3>
<ol>
<li>Vérifier le stock</li>
<li>Port des EPI</li>
<li>Préparer sous hotte si nécessaire</li>
<li>Étiqueter la solution</li>
</ol>
</div>
`;
}

fiche.innerHTML = html;

});

// ---------------------
// EXPORT PDF
// ---------------------
document.getElementById("export").addEventListener("click",async()=>{

const canvas = await html2canvas(fiche);
const img = canvas.toDataURL("image/png");

const pdf = new jspdf.jsPDF("p","mm","a4");

pdf.addImage(img,"PNG",10,10,190,0);
pdf.save("protocole_tp.pdf");

});
