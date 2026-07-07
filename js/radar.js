/**
 * radar.js
 * Radar des compétences élève
 *
 * Compétences :
 * APP
 * ANA
 * REA
 * VAL
 * COM
 *
 * Gestion :
 * - récupération auto-évaluation
 * - affichage canvas
 * - mise à jour dynamique
 */


/* ==========================================================
   CONSTANTES
   ========================================================== */

const COMPETENCES = [
    "APP",
    "ANA",
    "REA",
    "VAL",
    "COM"
];


/* ==========================================================
   RECUPERATION SCORES
   ========================================================== */

export function getAutoEvalScores() {


    return COMPETENCES.map(comp => {


        const radio =
            document.querySelector(
                `input[name="${comp}"]:checked`
            );


        return radio
            ? Number(radio.value)
            : 0;


    });

}



/* ==========================================================
   INITIALISATION RADAR
   ========================================================== */

export function initRadarCompetences() {


    const bouton =
        document.getElementById(
            "btn-radar"
        );


    if (bouton) {

        bouton.addEventListener(
            "click",
            afficherRadarCompetences
        );

    }



    document
    .querySelectorAll(
        '[data-type="auto-evaluation"] input[type="radio"]'
    )
    .forEach(radio => {


        radio.addEventListener(
            "change",
            afficherRadarCompetences
        );


    });

}



/* ==========================================================
   AFFICHAGE
   ========================================================== */

export function afficherRadarCompetences() {


    const zone =
        document.getElementById(
            "radar-resultat"
        );


    if (!zone)
        return;



    zone.innerHTML = `

        <canvas
            id="canvasRadarCompetences"
            width="420"
            height="420">
        </canvas>

    `;



    const canvas =
        document.getElementById(
            "canvasRadarCompetences"
        );


    if (!canvas)
        return;



    const ctx =
        canvas.getContext(
            "2d"
        );



    dessinerRadar(
        ctx,
        getAutoEvalScores()
    );


}



/* ==========================================================
   DESSIN RADAR
   ========================================================== */

export function dessinerRadar(
    ctx,
    valeurs
) {


    const largeur =
        ctx.canvas.width;


    const hauteur =
        ctx.canvas.height;



    const cx =
        largeur / 2;


    const cy =
        hauteur / 2;



    const rayon =
        140;



    ctx.clearRect(
        0,
        0,
        largeur,
        hauteur
    );



    /* ───── GRILLE ───── */


    for (
        let niveau = 1;
        niveau <= 2;
        niveau++
    ) {


        ctx.beginPath();


        COMPETENCES.forEach(
            (_,i)=>{


                const angle =
                    -Math.PI / 2
                    +
                    i *
                    2 *
                    Math.PI /
                    COMPETENCES.length;



                const r =
                    rayon *
                    (niveau / 2);



                const x =
                    cx +
                    Math.cos(angle)
                    *
                    r;



                const y =
                    cy +
                    Math.sin(angle)
                    *
                    r;



                if (i===0)
                    ctx.moveTo(x,y);
                else
                    ctx.lineTo(x,y);


            }
        );



        ctx.closePath();

        ctx.stroke();

    }



    /* ───── AXES ───── */


    COMPETENCES.forEach(
        (comp,i)=>{


            const angle =
                -Math.PI / 2
                +
                i *
                2 *
                Math.PI /
                COMPETENCES.length;



            const x =
                cx +
                Math.cos(angle)
                *
                rayon;



            const y =
                cy +
                Math.sin(angle)
                *
                rayon;



            ctx.beginPath();

            ctx.moveTo(
                cx,
                cy
            );


            ctx.lineTo(
                x,
                y
            );


            ctx.stroke();



            ctx.font =
                "15px Arial";


            ctx.fillText(
                comp,
                cx +
                Math.cos(angle)
                *
                (rayon+25)
                -
                12,

                cy +
                Math.sin(angle)
                *
                (rayon+25)
                +
                5
            );


        }
    );



    /* ───── COURBE ───── */


    ctx.beginPath();



    valeurs.forEach(
        (valeur,i)=>{


            const angle =
                -Math.PI / 2
                +
                i *
                2 *
                Math.PI /
                COMPETENCES.length;



            const r =
                rayon *
                (valeur / 2);



            const x =
                cx +
                Math.cos(angle)
                *
                r;



            const y =
                cy +
                Math.sin(angle)
                *
                r;



            if(i===0)
                ctx.moveTo(
                    x,
                    y
                );
            else
                ctx.lineTo(
                    x,
                    y
                );


        }
    );



    ctx.closePath();



    ctx.fillStyle =
        "rgba(27,108,168,0.35)";


    ctx.fill();



    ctx.lineWidth =
        3;


    ctx.stroke();


}
