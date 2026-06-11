console.log("module transmission chargé");

window.initTransmission = function () {

    const $ = (id) => document.getElementById(id);

    const m = $("medium");
    const d = $("distance");
    const out = $("timeResult");

    /* =========================
       SAFE CHECK (IMPORTANT)
    ========================= */

    if (!m || !d || !out) {
        console.error("transmission : éléments HTML manquants");
        return;
    }

    function calc() {

        const val =
            (Number(d.value) / Number(m.value)).toFixed(4);

        out.innerHTML = val;
    }

    /* =========================
       EVENTS SAFE
    ========================= */

    m.addEventListener("change", calc);
    d.addEventListener("input", calc);

    calc();
};
