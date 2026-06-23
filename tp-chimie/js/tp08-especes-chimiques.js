/* =====================================================
   TP07 ESPECES CHIMIQUES
   ===================================================== */

export function init() {

    console.log(
        "TP07 Espèces chimiques initialisé"
    );

    const btnQuiz =
    document.getElementById(
        "corrigerQuiz"
    );

    const btnTest =
    document.getElementById(
        "testerIon"
    );

    if(btnQuiz){

        btnQuiz.addEventListener(
            "click",
            corrigerQuiz
        );

    }

    if(btnTest){

        btnTest.addEventListener(
            "click",
            realiserTest
        );

    }

}

/* =====================================================
   QUIZ
   ===================================================== */

function corrigerQuiz(){

    const selects =
    document.querySelectorAll(
        ".classification"
    );

    const reponses = [
        "ion",
        "molecule",
        "atome"
    ];

    let score = 0;

    selects.forEach(
        (s,i)=>{

            if(
                s.value ===
                reponses[i]
            ){
                score++;
            }

        }
    );

    document.getElementById(
        "resultatQuiz"
    ).innerHTML =
    `
    <div class="resultat">
        Score :
        <strong>
        ${score}/3
        </strong>
    </div>
    `;

}

/* =====================================================
   TEST IONS
   ===================================================== */

function realiserTest(){

    const solution =
    document.getElementById(
        "solution"
    ).value;

    const reactif =
    document.getElementById(
        "reactif"
    ).value;

    let resultat =
    "";

    if(
        solution==="chlorure"
        &&
        reactif==="nitrate"
    ){

        resultat =
        `
        Précipité blanc :
        présence d'ions Cl⁻
        `;

    }

    else if(
        solution==="sulfate"
        &&
        reactif==="soude"
    ){

        resultat =
        `
        Précipité bleu :
        présence d'ions Cu²⁺
        `;

    }

    else if(
        solution==="fer"
        &&
        reactif==="soude"
    ){

        resultat =
        `
        Précipité brun :
        présence d'ions Fe³⁺
        `;

    }

    else{

        resultat =
        `
        Aucun test caractéristique.
        `;

    }

    document.getElementById(
        "observation"
    ).innerHTML =
    resultat;

}
