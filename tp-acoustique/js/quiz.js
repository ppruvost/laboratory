fetch(
"data/questions.json"
)

.then(r=>r.json())

.then(data=>{

buildQuiz(data);

});

function buildQuiz(qs){

let html="";

qs.forEach((q,i)=>{

html+=`

<div>

<p>

${q.question}

</p>

${q.options.map(

o=>`

<label>

<input
type="radio"
name="q${i}"
value="${o}">

${o}

</label>

`

).join("")}

</div>

`;

});

quizContainer.innerHTML=

html;

}

correct.onclick=()=>{

let score=0;

questions.forEach((q,i)=>{

const rep=

document.querySelector(

`input[name=q${i}]:checked`

);

if(rep?.value===q.answer)

score++;

});

score.innerHTML=

score+

"/10";

}
