/**
 * calculs.js
 * Bibliothèque commune de calculs chimiques
 *
 * Utilisé par :
 * TP01 - Solutions
 * TP03 - Titrages
 * futurs TP
 *
 * Aucune dépendance DOM
 * Aucune dépendance aux produits
 */


/* ============================================================
   OUTILS INTERNES
   ============================================================ */


function valide(...valeurs){

    return valeurs.every(
        v =>
        Number.isFinite(Number(v))
        &&
        Number(v) > 0
    );

}


function n(v){

    const x =
        parseFloat(v);

    return Number.isFinite(x)
        ?
        x
        :
        0;

}



/* ============================================================
   DISSOLUTION
   m = C × V × M
   ============================================================ */


export function masseDissolution({

    concentration,
    volume,
    masseMolaire

}){


    concentration =
        n(concentration);

    volume =
        n(volume);

    masseMolaire =
        n(masseMolaire);



    if(
        !valide(
            concentration,
            volume,
            masseMolaire
        )
    )
        return null;



    // volume fourni en mL

    return (
        concentration *
        volume / 1000 *
        masseMolaire
    );


}



/* ============================================================
   QUANTITE DE MATIERE
   n = m / M
   ============================================================ */


export function calculQuantiteMatiere({

    masse,
    masseMolaire

}){


    masse =
        n(masse);

    masseMolaire =
        n(masseMolaire);



    if(
        !valide(
            masse,
            masseMolaire
        )
    )
        return null;



    return masse / masseMolaire;


}



/* ============================================================
   CONCENTRATION MOLAIRE
   C = n / V
   ============================================================ */


export function calculConcentrationMolaire({

    quantite,
    volume

}){


    quantite =
        n(quantite);


    volume =
        n(volume);



    if(
        !valide(
            quantite,
            volume
        )
    )
        return null;



    return quantite / volume;


}



/* ============================================================
   CONCENTRATION MASSIQUE
   Cm = m / V
   ============================================================ */


export function calculConcentrationMassique({

    masse,
    volume

}){


    masse =
        n(masse);


    volume =
        n(volume);



    if(
        !valide(
            masse,
            volume
        )
    )
        return null;



    return masse / volume;


}



/* ============================================================
   DILUTION
   C1V1 = C2V2
   ============================================================ */


export function calculV1Dilution({

    C1,
    C2,
    V2

}){


    C1 =
        n(C1);

    C2 =
        n(C2);

    V2 =
        n(V2);



    if(
        !valide(
            C1,
            C2,
            V2
        )
    )
        return null;



    return (
        C2 *
        V2 /
        C1
    );


}



/* ============================================================
   FACTEUR DE DILUTION
   F = C1/C2
   ============================================================ */


export function facteurDilution({

    C1,
    C2

}){


    C1 =
        n(C1);

    C2 =
        n(C2);



    if(
        !valide(
            C1,
            C2
        )
    )
        return null;



    return C1 / C2;


}



/* ============================================================
   TITRAGE
   nA = nB
   CA×VA = CB×VB
   ============================================================ */


export function concentrationTitrage({

    concentrationTitree,
    volumeTitre,
    volumeVersant

}){


    const CB =
        n(concentrationTitree);


    const VB =
        n(volumeTitre);


    const VA =
        n(volumeVersant);



    if(
        !valide(
            CB,
            VB,
            VA
        )
    )
        return null;



    return (
        CB *
        VB /
        VA
    );


}



/* ============================================================
   VOLUME EQUIVALENCE
   ============================================================ */


export function volumeEquivalence({

    concentration1,
    volume1,
    concentration2

}){


    const C1 =
        n(concentration1);


    const V1 =
        n(volume1);


    const C2 =
        n(concentration2);



    if(
        !valide(
            C1,
            V1,
            C2
        )
    )
        return null;



    return (
        C1 *
        V1 /
        C2
    );


}



/* ============================================================
   ERREURS EXPERIMENTALES
   ============================================================ */


export function erreurAbsolue(
    experimental,
    theorique
){

    return Math.abs(
        n(experimental)
        -
        n(theorique)
    );

}



export function erreurRelativePourcent(
    experimental,
    theorique
){


    theorique =
        n(theorique);



    if(theorique===0)
        return null;



    return (
        Math.abs(
            n(experimental)
            -
            theorique
        )
        /
        theorique
    )
    *
    100;


}



/* ============================================================
   ARRONDIS SCIENTIFIQUES
   ============================================================ */


export function arrondi(
    valeur,
    chiffres=3
){

    if(!Number.isFinite(valeur))
        return "—";


    return Number(
        valeur.toPrecision(chiffres)
    );

}



/* ============================================================
   CONVERSIONS
   ============================================================ */


export function mLversL(volume){

    return n(volume)/1000;

}



export function gversmg(masse){

    return n(masse)*1000;

}



export function mgversg(masse){

    return n(masse)/1000;

}



/* ============================================================
   pH
   ============================================================ */


export function calculPH(concentrationH){

    const c =
        n(concentrationH);


    if(c<=0)
        return null;


    return -Math.log10(c);

}



/* ============================================================
   EXPORT GLOBAL OPTIONNEL
   ============================================================ */


export default {

    masseDissolution,

    calculQuantiteMatiere,

    calculConcentrationMolaire,

    calculConcentrationMassique,

    calculV1Dilution,

    facteurDilution,

    concentrationTitrage,

    volumeEquivalence,

    erreurAbsolue,

    erreurRelativePourcent,

    arrondi,

    mLversL,

    gversmg,

    mgversg,

    calculPH

};
