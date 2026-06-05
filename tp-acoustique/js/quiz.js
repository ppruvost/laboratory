// Variable globale pour stocker les questions
let questions = [];

// Fonction d'initialisation du quiz
function initQuiz() {
    // Récupère les éléments du DOM
    const quizContainer = document.getElementById("quiz-container");
    const correctBtn = document.getElementById("correct");
    const scoreElement = document.getElementById("score");

    // Si un élément manquant, on arrête l'initialisation
    if (!quizContainer || !correctBtn || !scoreElement) {
        console.error("Un ou plusieurs éléments du quiz sont introuvables !");
        return;
    }

    // Charge les questions depuis le fichier JSON
    fetch("data/questions.json")
        .then(response => {
            if (!response.ok) throw new Error("Fichier questions.json introuvable");
            return response.json();
        })
        .then(data => {
            questions = data; // Stocke les questions
            buildQuiz(data, quizContainer, correctBtn, scoreElement);
        })
        .catch(error => {
            quizContainer.innerHTML = `<p>Erreur : ${error.message}</p>`;
        });
}

// Fonction pour construire le quiz
function buildQuiz(qs, quizContainer, correctBtn, scoreElement) {
    let html = "";

    qs.forEach((q, i) => {
        html += `
            <div>
                <p>${q.question}</p>
                ${q.options.map(o => `
                    <label>
                        <input type="radio" name="q${i}" value="${o}">
                        ${o}
                    </label>
                `).join("")}
            </div>
        `;
    });

    quizContainer.innerHTML = html;

    // Attache l'événement pour corriger le quiz
    correctBtn.onclick = () => {
        let score = 0;

        questions.forEach((q, i) => {
            const rep = document.querySelector(`input[name="q${i}"]:checked`);
            if (rep && rep.value === q.answer) score++;
        });

        scoreElement.innerHTML = `${score}/${questions.length}`;
    };
}

// Appel de l'initialisation uniquement quand le DOM est prêt
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initQuiz();
} else {
    document.addEventListener('DOMContentLoaded', initQuiz);
}
