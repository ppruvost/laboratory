/* ==========================================================
   TP06 - PHMETRIE
   Compatible Navigation.js V2
   ========================================================== */

let graphique = null;

export function init() {

    console.log("TP06 pHmétrie initialisé");

    const btnAjouter =
        document.getElementById("ajouterLigne");

    const btnTracer =
        document.getElementById("tracerCourbe");

    const btnTangentes =
        document.getElementById("methodeTangentes");

    const btnDerivee =
        document.getElementById("methodeDerivee");

    const btnPdf =
        document.getElementById("exportPdf");

    if (btnAjouter)
        btnAjouter.addEventListener(
            "click",
            ajouterLigne
        );

    if (btnTracer)
        btnTracer.addEventListener(
            "click",
            tracerCourbe
        );

    if (btnTangentes)
        btnTangentes.addEventListener(
            "click",
            analyseTangentes
        );

    if (btnDerivee)
        btnDerivee.addEventListener(
            "click",
            analyseDerivee
        );

    if (btnPdf)
        btnPdf.addEventListener(
            "click",
            exporterPDF
        );

}

/* ==========================================================
   AJOUT LIGNE TABLEAU
   ========================================================== */

function ajouterLigne() {

    const tbody =
        document.getElementById(
            "tableDonnees"
        );

    const tr =
        document.createElement("tr");

    tr.innerHTML =
        `
        <td>
            <input type="number"
                   class="volume"
                   step="0.1">
        </td>

        <td>
            <input type="number"
                   class="ph"
                   step="0.01">
        </td>
        `;

    tbody.appendChild(tr);

}

/* ==========================================================
   LECTURE DONNEES
   ========================================================== */

function lireDonnees() {

    const volumes =
        [];

    const phs =
        [];

    document
    .querySelectorAll(
        "#tableDonnees tr"
    )
    .forEach(ligne => {

        const v =
            parseFloat(
                ligne.querySelector(
                    ".volume"
                )?.value
            );

        const ph =
            parseFloat(
                ligne.querySelector(
                    ".ph"
                )?.value
            );

        if (
            !isNaN(v) &&
            !isNaN(ph)
        ) {

            volumes.push(v);
            phs.push(ph);

        }

    });

    return {
        volumes,
        phs
    };

}

/* ==========================================================
   TRACE COURBE
   ========================================================== */

function tracerCourbe() {

    const data =
        lireDonnees();

    const canvas =
        document.getElementById(
            "graphiquePH"
        );

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    if (graphique) {
        graphique.destroy();
    }

    graphique =
        new Chart(ctx, {

            type: "line",

            data: {

                labels:
                    data.volumes,

                datasets: [

                    {

                        label:
                            "pH = f(V)",

                        data:
                            data.phs,

                        tension: 0.2

                    }

                ]

            },

            options: {

                responsive: true,

                scales: {

                    x: {

                        title: {

                            display: true,

                            text:
                                "Volume versé (mL)"

                        }

                    },

                    y: {

                        title: {

                            display: true,

                            text: "pH"

                        }

                    }

                }

            }

        });

}

/* ==========================================================
   DERIVEE
   ========================================================== */

function analyseDerivee() {

    const data =
        lireDonnees();

    const volumes =
        data.volumes;

    const phs =
        data.phs;

    if (
        volumes.length < 3
    ) return;

    const derivees =
        [];

    let maxDerivee =
        -Infinity;

    let volumeEq =
        0;

    for (
        let i = 1;
        i < volumes.length;
        i++
    ) {

        const dph =
            phs[i] -
            phs[i - 1];

        const dv =
            volumes[i] -
            volumes[i - 1];

        const valeur =
            dph / dv;

        derivees.push(valeur);

        if (
            valeur >
            maxDerivee
        ) {

            maxDerivee =
                valeur;

            volumeEq =
                (
                    volumes[i]
                    +
                    volumes[i - 1]
                ) / 2;

        }

    }

    afficherResultat(

        `
        <strong>Méthode dérivée</strong><br>

        Pic maximum :
        ${maxDerivee.toFixed(2)}
        <br>

        Volume équivalent :
        <strong>
        ${volumeEq.toFixed(2)} mL
        </strong>
        `

    );

}

/* ==========================================================
   TANGENTES
   ========================================================== */

function analyseTangentes() {

    const data =
        lireDonnees();

    const volumes =
        data.volumes;

    const phs =
        data.phs;

    if (
        volumes.length < 5
    ) return;

    let penteMax =
        -Infinity;

    let indice =
        0;

    for (
        let i = 1;
        i < phs.length;
        i++
    ) {

        const pente =
            Math.abs(
                (
                    phs[i]
                    -
                    phs[i - 1]
                )
                /
                (
                    volumes[i]
                    -
                    volumes[i - 1]
                )
            );

        if (
            pente >
            penteMax
        ) {

            penteMax =
                pente;

            indice =
                i;

        }

    }

    const volumeEq =
        volumes[indice];

    afficherResultat(

        `
        <strong>Méthode des tangentes</strong>
        <br>

        Saut maximal observé
        autour de :

        <strong>
        ${volumeEq.toFixed(2)}
        mL
        </strong>
        `

    );

}

/* ==========================================================
   RESULTAT
   ========================================================== */

function afficherResultat(html) {

    const zone =
        document.getElementById(
            "resultatEquivalence"
        );

    if (zone) {
        zone.innerHTML =
            html;
    }

}

/* ==========================================================
   EXPORT PDF
   ========================================================== */

async function exporterPDF() {

    const element =
        document.getElementById(
            "tp06-container"
        );

    if (!element) return;

    const canvas =
        await html2canvas(
            element,
            {
                scale: 2
            }
        );

    const img =
        canvas.toDataURL(
            "image/png"
        );

    const {
        jsPDF
    } = window.jspdf;

    const pdf =
        new jsPDF(
            "p",
            "mm",
            "a4"
        );

    const date =
        new Date();

    pdf.setFontSize(10);

    pdf.text(
        "Laboratory - TP Chimie pHmétrie",
        10,
        10
    );

    pdf.text(
        date.toLocaleString(),
        150,
        10
    );

    pdf.addImage(
        img,
        "PNG",
        5,
        15,
        200,
        250
    );

    pdf.setFontSize(8);

    pdf.text(
        "Source : https://ppruvost.github.io/laboratory",
        10,
        290
    );

    pdf.save(
        "TP06_PHMETRIE.pdf"
    );

}
