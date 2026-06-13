window.initSecurite = function () {

    const expo =
    document.getElementById("expo");

    const expoTxt =
    document.getElementById("expoTxt");

    const risk =
    document.getElementById("risk");

    const analyseBloc =
    document.getElementById("analyseSecurite");

    const explorationMsg =
    document.getElementById("explorationSecurite");

    if(
        !expo ||
        !expoTxt ||
        !risk
    ){
        console.error(
            "module sécurité : éléments manquants"
        );
        return;
    }

    /* ==========================
       SUIVI PEDAGOGIQUE
    ========================== */

    let faibleObserve = false;
    let moyenObserve = false;
    let dangerObserve = false;

    /* ==========================
       PROGRESSION
    ========================== */

    function updateProgress(){

        if(!explorationMsg) return;

        explorationMsg.innerHTML =

        `Zone faible ${
            faibleObserve ? "✓" : "✗"
        }<br>

        Zone moyenne ${
            moyenObserve ? "✓" : "✗"
        }<br>

        Zone dangereuse ${
            dangerObserve ? "✓" : "✗"
        }`;

    }

    /* ==========================
       ANALYSE
    ========================== */

    function checkAnalyse(){

        const done =

        faibleObserve &&
        moyenObserve &&
        dangerObserve;

        if(
            done &&
            analyseBloc
        ){

            analyseBloc.classList.remove(
                "hidden"
            );

            analyseBloc.classList.add(
                "visible"
            );

        }

        updateProgress();

    }

    /* ==========================
       UPDATE
    ========================== */

    function update(){

        const value =
        Number(expo.value);

        expoTxt.innerHTML =
        value;

        if(value < 80){

            risk.innerHTML =
            "🟢 Risque faible";

            risk.className =
            "result success";

            faibleObserve = true;

        }

        else if(value < 100){

            risk.innerHTML =
            "🟡 Protection recommandée";

            risk.className =
            "result warning";

            moyenObserve = true;

        }

        else{

            risk.innerHTML =
            "🔴 Danger auditif";

            risk.className =
            "result danger";

            dangerObserve = true;

        }

        checkAnalyse();

    }

    expo.addEventListener(
        "input",
        update
    );

    updateProgress();
    update();

};
