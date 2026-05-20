// =====================================
// NAVIGATION
// =====================================

const tabs = document.querySelectorAll(".tab");
const buttons = document.querySelectorAll(".tab-btn");

buttons.forEach(btn=>{

    btn.addEventListener("click",()=>{

        buttons.forEach(b=>b.classList.remove("active"));
        tabs.forEach(t=>t.classList.remove("active"));

        btn.classList.add("active");

        document
            .getElementById(btn.dataset.tab)
            .classList.add("active");

    });

});

// =====================================
// SPECTRE
// =====================================

const spectrumCanvas = document.getElementById("spectrumCanvas");
const sctx = spectrumCanvas.getContext("2d");

const gradient = sctx.createLinearGradient(0,0,900,0);

gradient.addColorStop(0,"violet");
gradient.addColorStop(0.2,"blue");
gradient.addColorStop(0.4,"cyan");
gradient.addColorStop(0.5,"green");
gradient.addColorStop(0.7,"yellow");
gradient.addColorStop(0.85,"orange");
gradient.addColorStop(1,"red");

sctx.fillStyle = gradient;
sctx.fillRect(0,0,900,180);

// =====================================
// ÉNERGIE PHOTON
// =====================================

const lambdaSlider = document.getElementById("lambdaSlider");
const energyResult = document.getElementById("energyResult");

function updateEnergy(){

    const lambda = lambdaSlider.value * 1e-9;

    const h = 6.626e-34;
    const c = 3e8;

    const E = (h*c)/lambda;

    energyResult.innerHTML = `
    Longueur d’onde :
    ${lambdaSlider.value} nm
    <br><br>
    Énergie :
    ${E.toExponential(3)} J
    `;

}

lambdaSlider.addEventListener("input",updateEnergy);

updateEnergy();

// =====================================
// CAPTEUR
// =====================================

const intensitySlider = document.getElementById("lightIntensity");
const sensorOutput = document.getElementById("sensorOutput");

function updateSensor(){

    const value = intensitySlider.value;

    sensorOutput.innerHTML = `
    Signal électrique :
    ${(value*0.05).toFixed(2)} V
    `;

}

intensitySlider.addEventListener("input",updateSensor);

updateSensor();

// =====================================
// TÉLÉCOMMANDE IR
// =====================================

const irCanvas = document.getElementById("irCanvas");
const irCtx = irCanvas.getContext("2d");

document
.getElementById("remoteBtn")
.addEventListener("click",()=>{

    irCtx.clearRect(0,0,400,250);

    irCtx.fillStyle="black";
    irCtx.fillRect(0,0,400,250);

    for(let i=0;i<12;i++){

        irCtx.beginPath();

        irCtx.fillStyle="rgba(255,0,0,0.5)";

        irCtx.arc(
            50+i*25,
            125,
            20,
            0,
            Math.PI*2
        );

        irCtx.fill();

    }

});

// =====================================
// QUIZ
// =====================================

const questions = [

{
question:"Les UV sont :",
choices:[
"plus énergétiques que le rouge",
"moins énergétiques que le rouge",
"invisibles mais froids"
],
answer:0
},

{
question:"Une télécommande utilise :",
choices:[
"des UV",
"des infrarouges",
"des rayons X"
],
answer:1
},

{
question:"La lumière blanche contient :",
choices:[
"une seule longueur d’onde",
"plusieurs longueurs d’onde",
"uniquement le rouge"
],
answer:1
}

];

const quizContainer =
document.getElementById("quizContainer");

questions.forEach((q,index)=>{

    const div = document.createElement("div");

    div.className="card";

    div.innerHTML = `
    <h3>${q.question}</h3>
    ${q.choices.map((c,i)=>`
    <label>
    <input type="radio" name="q${index}" value="${i}">
    ${c}
    </label>
    <br>
    `).join("")}
    `;

    quizContainer.appendChild(div);

});

document
.getElementById("correctQuiz")
.addEventListener("click",()=>{

    let score=0;

    questions.forEach((q,index)=>{

        const checked =
        document.querySelector(
            `input[name="q${index}"]:checked`
        );

        if(checked && parseInt(checked.value)===q.answer){

            score++;

        }

    });

    document.getElementById("score").innerHTML = `
    <div class="card">
    Score :
    ${score} / ${questions.length}
    </div>
    `;

});
