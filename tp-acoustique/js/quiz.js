window.initQuiz=function(){

const q=[

["Unité sonore ?",
["Hz","dB","m"],
1],

["Vitesse du son air ?",
["340","100","1000"],
0]

];

let html="";

q.forEach((e,i)=>{

html+=`

<div>

<p>${e[0]}</p>

`;

e[1].forEach((r,j)=>{

html+=`

<label>

<input
type="radio"
name="${i}"
value="${j}">

${r}

</label><br>

`;

});

html+="</div>";

});

quizContainer.innerHTML=

html;

corriger.onclick=()=>{

let s=0;

q.forEach((e,i)=>{

const c=

document.querySelector(

`input[name="${i}"]:checked`

);

if(

c &&

Number(c.value)===e[2]

)

s++;

});

score.innerHTML=

`${s}/${q.length}`;

};

};
