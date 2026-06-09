window.initBattements = function () {

    console.log("initBattements exécuté");

    const f1 = document.getElementById("freq1");
    const f2 = document.getElementById("freq2");

    const f1Val = document.getElementById("f1Val");
    const f2Val = document.getElementById("f2Val");

    const beat = document.getElementById("fb");
    const fbMesure = document.getElementById("fbMesure");

    const canvas = document.getElementById("graph");

    const casReel =
    document.getElementById("casReel");

    const explication =
    document.getElementById("explication");

    if (!f1) {
        console.error("Element #freq1 introuvable");
        return;
    }

    if (!f2) {
        console.error("Element #freq2 introuvable");
        return;
    }

    if (!beat) {
        console.error("Element #fb introuvable");
        return;
    }

    if (!canvas) {
        console.error("Canvas #graph introuvable");
        return;
    }

    const ctx = canvas.getContext("2d");

    function draw() {

        const freq1 =
        Number(f1.value);

        const freq2 =
        Number(f2.value);

        const diff =
        Math.abs(
            freq1 - freq2
        );

        if (f1Val) {
            f1Val.textContent = freq1;
        }

        if (f2Val) {
            f2Val.textContent = freq2;
        }

        beat.textContent =
        diff + " Hz";

        if (fbMesure) {
            fbMesure.textContent =
            diff;
        }

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        /* Axe horizontal */

        ctx.beginPath();

        ctx.strokeStyle = "#999";

        ctx.moveTo(
            0,
            canvas.height / 2
        );

        ctx.lineTo(
            canvas.width,
            canvas.height / 2
        );

        ctx.stroke();

        /* Courbe */

        ctx.beginPath();

        ctx.strokeStyle =
        "#1f77b4";

        for (
            let x = 0;
            x < canvas.width;
            x++
        ) {

            const y =

                canvas.height / 2 +

                Math.sin(
                    x / 15
                )

                *

                Math.cos(
                    x * diff / 400
                )

                * 80;

            if (x === 0) {

                ctx.moveTo(
                    x,
                    y
                );

            }

            else {

                ctx.lineTo(
                    x,
                    y
                );

            }

        }

        ctx.lineWidth = 2;

        ctx.stroke();

    }

    f1.addEventListener(
        "input",
        draw
    );

    f2.addEventListener(
        "input",
        draw
    );

    if (casReel) {

        casReel.addEventListener(

            "change",

            () => {

                switch (
                    casReel.value
                ) {

                    case "ventilo":

                        f1.value = 120;
                        f2.value = 124;

                        explication.textContent =
                        "Deux ventilateurs tournant à des vitesses très proches produisent des battements audibles. Le son semble varier périodiquement entre plus fort et plus faible.";

                        break;

                    case "moteur":

                        f1.value = 300;
                        f2.value = 307;

                        explication.textContent =
                        "Deux moteurs industriels fonctionnant à des fréquences proches peuvent générer des battements vibratoires. Cette observation est utilisée pour le diagnostic de certaines machines.";

                        break;

                    case "accordage":

                        f1.value = 440;
                        f2.value = 442;

                        explication.textContent =
                        "Lors de l'accordage d'une guitare ou d'un piano, les battements ralentissent puis disparaissent lorsque les fréquences deviennent identiques.";

                        break;

                    default:

                        explication.textContent =
                        "";

                }

                draw();

            }

        );

    }

    draw();

};
