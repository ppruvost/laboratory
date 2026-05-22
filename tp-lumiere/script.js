const buttons = document.querySelectorAll("nav button");
const sections = document.querySelectorAll("section");

buttons.forEach(btn=>{
  btn.addEventListener("click", ()=>{

    sections.forEach(sec=>sec.classList.remove("active"));

    document
      .getElementById(btn.dataset.section)
      .classList.add("active");
  });
});

const r = document.getElementById("r");
const g = document.getElementById("g");
const b = document.getElementById("b");

const colorBox = document.getElementById("colorBox");

function updateColor(){

  const red = r.value;
  const green = g.value;
  const blue = b.value;

  colorBox.style.background =
    `rgb(${red},${green},${blue})`;
}

[r,g,b].forEach(slider=>{
  slider.addEventListener("input", updateColor);
});

updateColor();

const quiz = [
  {
    q:"Quelle couleur obtient-on avec Rouge + Vert ?",
    a:"Jaune"
  },
  {
    q:"Quels cônes détectent le bleu ?",
    a:"Cônes S"
  },
  {
    q:"Quelle radiation est invisible après le rouge ?",
    a:"Infrarouge"
  }
];

let current = 0;

const quizContainer =
  document.getElementById("quizContainer");

function showQuestion(){

  quizContainer.innerHTML = `
    <h3>${quiz[current].q}</h3>
    <p><strong>Réponse :</strong> ${quiz[current].a}</p>
  `;
}

document
.getElementById("nextQuestion")
.addEventListener("click", ()=>{

  current++;

  if(current >= quiz.length){
    current = 0;
  }

  showQuestion();
});

showQuestion();
