console.log("module piezo chargé");

window.initPiezo = function () {

    const canvas = document.getElementById("piezoCanvas");

    if (!canvas) {
        console.error("Canvas piezo introuvable");
        return;
    }

    const ctx = canvas.getContext("2d");

    const piezoVal = document.getElementById("piezoVal");
    const freqVal = document.getElementById("freqVal");
    const dampingSlider = document.getElementById("damping");

    const impactBtn = document.getElementById("impact");

    const analyseBloc = document.getElementById("analysePiezo");
    const explorationMessage = document.getElementById("explorationMessage");

    let nbTests = 0;

    function updateMission() {

        if (!explorationMessage) return;

        if (nbTests < 3) {

            explorationMessage.innerHTML = `
                Mission :
                réaliser des chocs avec différents amortissements<br>
                essais réalisés : <b>${nbTests}/3</b>
            `;

        } else {

            explorationMessage.innerHTML = `
                ✔ Mission terminée : analyse débloquée
            `;
        }
    }

    function checkAnalyse() {

        if (
            nbTests >= 3 &&
            analyseBloc &&
            !analyseBloc.classList.contains("visible")
        ) {

            analyseBloc.classList.remove("hidden");
            analyseBloc.classList.add("visible");

            analyseBloc.scrollIntoView({
                behavior: "smooth"
            });
        }
    }

    impactBtn.onclick = () => {

        nbTests++;

        const amplitude = 1 + Math.random() * 4;
        const frequency = 20 + Math.random() * 80;
        const damping = Number(dampingSlider.value);

        piezoVal.textContent = amplitude.toFixed(2);
        freqVal.textContent = frequency.toFixed(1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();

        let maxValue = 0;

        for (let x = 0; x < canvas.width; x++) {

            const signal =
                Math.exp(-x / damping) *
                Math.sin(2 * Math.PI * frequency * x / 1000);

            const y = 125 - signal * amplitude * 60;

            maxValue = Math.max(maxValue, Math.abs(signal));

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.stroke();

        // axe central
        ctx.beginPath();
        ctx.moveTo(0, 125);
        ctx.lineTo(canvas.width, 125);
        ctx.strokeStyle = "#999";
        ctx.stroke();

        updateMission();
        checkAnalyse();
    };

    updateMission();

    console.log("initPiezo exécuté");
};
