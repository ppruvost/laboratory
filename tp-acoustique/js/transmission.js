console.log("module transmission chargé");

window.initTransmission = function () {

    const $ = (id) => document.getElementById(id);

    const m = $("medium");
    const d = $("distance");
    const out = $("timeResult");

    const analyseBloc =
        $("analyseTransmission");

    const explorationMsg =
        $("explorationTransmission");

    /* =========================
       SECURITE
    ========================= */

    if (!m || !d || !out) {

        console.error(
            "transmission : éléments HTML manquants"
        );

        return;
    }

    /* =========================
       SUIVI PEDAGOGIQUE
    ========================= */

    let airObserve = false;
    let eauObserve = false;
    let acierObserve = false;

    /* =========================
       CALCUL
    ========================= */

    function calc() {

        const distance =
            Number(d.value);

        const vitesse =
            Number(m.value);

        const temps =
            distance / vitesse;

        out.innerHTML =
            temps.toFixed(4);

        /* ---------- suivi ---------- */

        if (vitesse === 340)
            airObserve = true;

        if (vitesse === 1480)
            eauObserve = true;

        if (vitesse === 5000)
            acierObserve = true;

        updateProgress();
        checkAnalyse();
    }

    /* =========================
       PROGRESSION
    ========================= */

    function updateProgress() {

        if (!explorationMsg) return;

        explorationMsg.innerHTML =

            `
            Air ${airObserve ? "✓" : "✗"}<br>
            Eau ${eauObserve ? "✓" : "✗"}<br>
            Acier ${acierObserve ? "✓" : "✗"}
            `;
    }

    /* =========================
       ANALYSE
    ========================= */

    function checkAnalyse() {

        const done =
            airObserve &&
            eauObserve &&
            acierObserve;

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
       EVENTS
    ========================= */

    m.addEventListener(
        "change",
        calc
    );

    d.addEventListener(
        "input",
        calc
    );

    calc();
};
