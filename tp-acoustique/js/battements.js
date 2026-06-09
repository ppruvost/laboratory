window.initBattements = function () {

    console.log("initBattements exécuté");

    const f1 = document.getElementById("freq1");
    const f2 = document.getElementById("freq2");
    const beat = document.getElementById("fb");
    const canvas = document.getElementById("graph");

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

        const diff = Math.abs(
            Number(f1.value) -
            Number(f2.value)
        );

        beat.textContent = diff + " Hz";

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.beginPath();

        for (let x = 0; x < canvas.width; x++) {

            const y =
                canvas.height / 2 +

                Math.sin(x / 15) *

                Math.cos(
                    x * diff / 400
                ) * 80;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
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

    draw();

};
