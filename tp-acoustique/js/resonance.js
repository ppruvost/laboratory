window.initResonance = function () {

    const slider =
        document.getElementById("resFreq");

    const txt =
        document.getElementById("resFreqTxt");

    const amp =
        document.getElementById("ampRes");

    const canvas =
        document.getElementById("resCanvas");

    if (!slider || !txt || !amp || !canvas) {

        console.error(
            "resonance : éléments HTML manquants"
        );

        return;
    }

    const ctx =
        canvas.getContext("2d");

    const analyseBloc =
        document.getElementById(
            "analyseResonance"
        );

    const explorationMsg =
        document.getElementById(
            "explorationResonance"
        );

    /* =========================
       SUIVI PEDAGOGIQUE
    ========================= */

    let basseObserve = false;
    let resonanceObserve = false;
    let hauteObserve = false;

    const f0 = 1200;

    function update() {

        const f =
            Number(slider.value);

        txt.textContent =
            f + " Hz";

        const A =

            100 /

            (
                1 +
                Math.pow(
                    (f - f0) / 250,
                    2
                )
            );

        amp.textContent =
            A.toFixed(1);

        /* =====================
           OBSERVATIONS
        ===================== */

        if (f < 600)
            basseObserve = true;

        if (
            f >= 1000 &&
            f <= 1400
        )
            resonanceObserve = true;

        if (f > 2000)
            hauteObserve = true;

        draw(A);

        updateProgress();
        checkAnalyse();
    }

    function draw(A) {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.beginPath();

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#1f3c63";

        for (
            let x = 0;
            x < canvas.width;
            x++
        ) {

            const y =

                150 +

                Math.sin(
                    x / 20
                ) * A;

            if (x === 0)
                ctx.moveTo(x, y);
            else
                ctx.lineTo(x, y);
        }

        ctx.stroke();
    }

    function updateProgress() {

        if (!explorationMsg)
            return;

        explorationMsg.innerHTML =

            `
            Fréquence basse ${basseObserve ? "✓" : "✗"}<br>
            Zone de résonance ${resonanceObserve ? "✓" : "✗"}<br>
            Fréquence élevée ${hauteObserve ? "✓" : "✗"}
            `;
    }

    function checkAnalyse() {

        const done =

            basseObserve &&
            resonanceObserve &&
            hauteObserve;

        if (
            done &&
            analyseBloc
        ) {

            analyseBloc.classList.remove(
                "hidden"
            );

            analyseBloc.classList.add(
                "visible"
            );

            analyseBloc.scrollIntoView({
                behavior: "smooth"
            });
        }
    }

    slider.addEventListener(
        "input",
        update
    );

    update();
};
