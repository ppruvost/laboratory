window.initDoppler = function () {

    const c = 340;
    const sourceFreq = 1000;

    const speed =
        document.getElementById("speed");

    const txt =
        document.getElementById("speedTxt");

    const out =
        document.getElementById("dopplerFreq");

    const analyseBloc =
        document.getElementById(
            "analyseDoppler"
        );

    const explorationMsg =
        document.getElementById(
            "explorationDoppler"
        );

    if (
        !speed ||
        !txt ||
        !out
    ) {

        console.error(
            "doppler : éléments HTML manquants"
        );

        return;
    }

    /* =========================
       SUIVI PEDAGOGIQUE
    ========================= */

    let eloignementObserve = false;
    let immobileObserve = false;
    let rapprochementObserve = false;

    /* =========================
       PROGRESSION
    ========================= */

    function updateProgress() {

        if (!explorationMsg) return;

        explorationMsg.innerHTML =

            `
            Source qui s'éloigne ${eloignementObserve ? "✓" : "✗"}<br>
            Source immobile ${immobileObserve ? "✓" : "✗"}<br>
            Source qui se rapproche ${rapprochementObserve ? "✓" : "✗"}
            `;
    }

    function checkAnalyse() {

        const done =

            eloignementObserve &&
            immobileObserve &&
            rapprochementObserve;

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

    /* =========================
       CALCUL
    ========================= */

    function update() {

        const v =
            Number(speed.value);

        txt.textContent = v;

        const fp =

            sourceFreq *

            (
                c /
                (c - v)
            );

        out.textContent =
            fp.toFixed(1);

        /* =====================
           OBSERVATIONS
        ===================== */

        if (v < -10)
            eloignementObserve = true;

        if (
            v >= -2 &&
            v <= 2
        )
            immobileObserve = true;

        if (v > 10)
            rapprochementObserve = true;

        updateProgress();
        checkAnalyse();
    }

    speed.addEventListener(
        "input",
        update
    );

    update();
};
