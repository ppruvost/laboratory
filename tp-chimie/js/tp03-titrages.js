/**
 * ============================================================
 * tp03-titrages.js
 * TP03 — Titrages acido-basiques
 *
 * Architecture :
 * - dépend uniquement des modules communs
 * - aucun accès direct à PRODUITS
 * - aucun doublon de fonction avec utils.js
 * - initialisation via initTP()
 * ============================================================
 */


/* ============================================================
   IMPORTS
============================================================ */

import {
  initSections,
  initTabs,
  initProgression,
  initCompteRendu,
  initAutoEvaluation
} from "./utils.js";


import {
  initSecurite
} from "./securite.js";


import {
  initMateriel
} from "./materiel.js";


import {
  initRadar
} from "./radar.js";


import {
  calculerTitrage,
  initCalculsTitrage
} from "./calculs.js";



/* ============================================================
   CONFIGURATION TP03
============================================================ */


const TP_CONFIG = {

  id: "tp03-titrages",

  titre:
    "Titrages acido-basiques",

  images: {

    racine:
      "assets/images/",

    modeOperatoire:
      "c3-titrage.png"

  },


  competences: [

    "APP",
    "ANA",
    "REA",
    "VAL",
    "COM"

  ]

};




/* ============================================================
   INITIALISATION PRINCIPALE
============================================================ */


export function initTP03() {


  console.log(
    "Initialisation TP03 — Titrages acido-basiques"
  );



  initSections();



  initTabs();



  initProgression();



  initCompteRendu({

    tp:
      TP_CONFIG.id,

    titre:
      TP_CONFIG.titre

  });




  initAutoEvaluation(
    TP_CONFIG.competences
  );



  initSecurite({

    tp:
      TP_CONFIG.id

  });



  initMateriel({

    tp:
      TP_CONFIG.id

  });



  initCalculsTitrage();



  initRadar({

    competences:
      TP_CONFIG.competences

  });
/* ============================================================
   GESTION DES PARAMÈTRES DE TITRAGE
============================================================ */


/**
 * Valeurs par défaut du TP03
 * utilisées à l'ouverture de la page
 */

const TITRAGE_DEFAULT = {

  solutionTitree: {

    concentration:
      0.10,

    volume:
      20

  },


  solutionTitrante: {

    concentration:
      0.10

  },


  volumeAjoute:
    0


};





/* ============================================================
   RÉCUPÉRATION DES DONNÉES UTILISATEUR
============================================================ */


function getParametresTitrage() {


  const cTitree =
    Number(
      document.getElementById(
        "c-titree"
      )?.value
    )
    ||
    TITRAGE_DEFAULT.solutionTitree.concentration;



  const vTitree =
    Number(
      document.getElementById(
        "v-titree"
      )?.value
    )
    ||
    TITRAGE_DEFAULT.solutionTitree.volume;



  const cTitrante =
    Number(
      document.getElementById(
        "c-titrante"
      )?.value
    )
    ||
    TITRAGE_DEFAULT.solutionTitrante.concentration;



  const vAjoute =
    Number(
      document.getElementById(
        "v-ajoute"
      )?.value
    )
    ||
    TITRAGE_DEFAULT.volumeAjoute;



  return {

    cTitree,

    vTitree,

    cTitrante,

    vAjoute

  };


}





/* ============================================================
   CALCUL DU POINT D'ÉQUIVALENCE
============================================================ */


/**
 * Relation générale :
 *
 *     C₁ × V₁ = C₂ × V₂
 *
 * Les volumes sont convertis en litres.
 *
 */


export function calculerEquivalent() {


  const {

    cTitree,

    vTitree,

    cTitrante

  } = getParametresTitrage();



  if (

    !cTitree ||
    !vTitree ||
    !cTitrante

  ) {


    return null;


  }



  const veq =

    (

      cTitree
      *
      vTitree

    )
    /
    cTitrante;



  return {

    veq,

    veqML:
      veq * 1000


  };


}





/* ============================================================
   AFFICHAGE RÉSULTATS TITRAGE
============================================================ */


function afficherEquivalent() {


  const resultat =
    calculerEquivalent();



  const zone =
    document.getElementById(
      "resultat-equivalence"
    );



  if (
    !zone ||
    !resultat
  ) {

    return;

  }



  zone.innerHTML = `

    <div class="resultat-calcul">

      Volume équivalent :

      <strong>
        ${resultat.veqML.toFixed(2)}
        mL
      </strong>

    </div>

  `;


}





/* ============================================================
   ÉVÈNEMENTS INPUTS
============================================================ */


function initEvenementsTitrage() {


  const champs = [

    "c-titree",

    "v-titree",

    "c-titrante"

  ];



  champs.forEach(

    id => {


      const element =
        document.getElementById(id);



      if (!element) {

        return;

      }



      element.addEventListener(

        "input",

        afficherEquivalent

      );


    }

  );


}


/* ============================================================
   SIMULATION COURBE DE TITRAGE
============================================================ */


/**
 * Génération des points expérimentaux simulés
 * pour affichage graphique.
 *
 * Le calcul est volontairement séparé du rendu.
 * Le module graphique peut donc évoluer sans modifier
 * la logique chimique.
 */


function genererCourbeTitrage() {


  const parametres =
    getParametresTitrage();



  if (!parametres) {

    return [];

  }



  const {

    cTitree,

    vTitree,

    cTitrante

  } = parametres;



  const equivalent =
    calculerEquivalent();



  if (!equivalent) {

    return [];

  }



  const vEq =
    equivalent.veqML;



  const points = [];



  const vMax =
    vEq * 2;



  const pas =
    1;



  for (

    let v = 0;

    v <= vMax;

    v += pas

  ) {



    let pH;



    /*
       Avant équivalence :
       excès d'acide faible simulé
    */

    if (

      v < vEq

    ) {


      const nRestant =

        (

          cTitree
          *
          vTitree
          -
          cTitrante
          *
          v

        )
        /
        1000;



      const volumeTotal =

        (

          vTitree
          +
          v

        )
        /
        1000;



      const concentration =

        Math.abs(
          nRestant /
          volumeTotal
        );



      pH =

        concentration > 0

        ?

        -Math.log10(
          concentration
        )

        :

        7;



    }



    /*
       Zone équivalente
    */

    else if (

      Math.abs(v - vEq) < 0.5

    ) {


      pH = 7;



    }



    /*
       Après équivalence :
       excès de base
    */

    else {


      const exces =

        (

          cTitrante
          *
          (
            v - vEq
          )

        )
        /
        1000;



      const volumeTotal =

        (

          vTitree
          +
          v

        )
        /
        1000;



      const concentrationOH =

        exces /
        volumeTotal;



      pH =

        14
        +
        Math.log10(
          concentrationOH
        );


    }



    points.push({

      x:
        Number(
          v.toFixed(1)
        ),


      y:
        Number(
          pH.toFixed(2)
        )

    });



  }



  return points;


}






/* ============================================================
   AFFICHAGE CANVAS / GRAPHIQUE
============================================================ */


function afficherCourbeTitrage() {


  const canvas =
    document.getElementById(
      "courbe-titrage"
    );



  if (!canvas) {

    return;

  }



  const ctx =
    canvas.getContext(
      "2d"
    );



  const points =
    genererCourbeTitrage();



  if (

    points.length === 0

  ) {

    return;

  }



  ctx.clearRect(

    0,

    0,

    canvas.width,

    canvas.height

  );



  const marge = 40;



  const largeur =

    canvas.width
    -
    2 * marge;



  const hauteur =

    canvas.height
    -
    2 * marge;



  const xmax =
    points[
      points.length - 1
    ].x;



  const ymin =
    0;



  const ymax =
    14;



  ctx.beginPath();



  points.forEach(

    (p, index) => {


      const x =

        marge
        +
        (
          p.x /
          xmax
        )
        *
        largeur;



      const y =

        canvas.height
        -
        marge
        -
        (
          (
            p.y - ymin
          )
          /
          (
            ymax - ymin
          )
        )
        *
        hauteur;



      if (

        index === 0

      ) {

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

  );



  ctx.stroke();



}





/* ============================================================
   INITIALISATION GRAPHIQUE
============================================================ */


function initCourbeTitrage() {


  const bouton =

    document.getElementById(
      "btn-courbe"
    );



  if (!bouton) {

    return;

  }



  bouton.addEventListener(

    "click",

    afficherCourbeTitrage

  );


}
/* ============================================================
   EXPLOITATION DES MESURES EXPÉRIMENTALES
============================================================ */


/**
 * Gestion des valeurs relevées par l'élève :
 * - volume versé
 * - pH mesuré
 * - ajout dans le tableau
 * - calcul automatique dérivée
 */


const mesuresTitrage = [];





/* ============================================================
   AJOUT D'UNE MESURE
============================================================ */


function ajouterMesureTitrage() {


  const volume =
    Number(
      document.getElementById(
        "volume-mesure"
      )?.value
    );



  const pH =
    Number(
      document.getElementById(
        "ph-mesure"
      )?.value
    );



  if (

    Number.isNaN(volume)

    ||

    Number.isNaN(pH)

  ) {

    return;

  }



  mesuresTitrage.push({

    volume,

    pH

  });



  afficherTableauMesures();



  calculerDerivee();



}





/* ============================================================
   AFFICHAGE TABLEAU MESURES
============================================================ */


function afficherTableauMesures() {


  const tbody =

    document.getElementById(
      "table-mesures"
    );



  if (!tbody) {

    return;

  }



  tbody.innerHTML = "";



  mesuresTitrage.forEach(

    (m, index) => {


      const ligne =

        document.createElement(
          "tr"
        );



      ligne.innerHTML = `

        <td>
          ${index + 1}
        </td>

        <td>
          ${m.volume.toFixed(2)}
        </td>

        <td>
          ${m.pH.toFixed(2)}
        </td>

      `;



      tbody.appendChild(
        ligne
      );


    }

  );


}







/* ============================================================
   CALCUL DE LA DÉRIVÉE
============================================================ */


function calculerDerivee() {


  const derivees = [];



  for (

    let i = 1;

    i < mesuresTitrage.length;

    i++

  ) {


    const precedent =
      mesuresTitrage[i - 1];



    const actuel =
      mesuresTitrage[i];



    const deltaPH =

      actuel.pH
      -
      precedent.pH;



    const deltaV =

      actuel.volume
      -
      precedent.volume;



    if (

      deltaV !== 0

    ) {


      derivees.push({

        volume:

          (

            actuel.volume
            +
            precedent.volume

          )
          /
          2,


        valeur:

          deltaPH /
          deltaV


      });


    }



  }



  afficherDerivee(
    derivees
  );



  return derivees;


}





/* ============================================================
   AFFICHAGE DÉRIVÉE
============================================================ */


function afficherDerivee(
  derivees
) {


  const zone =

    document.getElementById(
      "resultat-derivee"
    );



  if (!zone) {

    return;

  }



  if (

    derivees.length === 0

  ) {


    zone.innerHTML =

      "Pas assez de mesures.";


    return;


  }



  const maximum =

    derivees.reduce(

      (max, d) =>

        d.valeur > max.valeur

        ?

        d

        :

        max

    );





  zone.innerHTML = `


    <div class="resultat-calcul">


      Maximum de pente :

      <strong>

        ${maximum.volume.toFixed(2)}
        mL

      </strong>


      <br>


      ΔpH/ΔV :

      <strong>

        ${maximum.valeur.toFixed(2)}

      </strong>


    </div>


  `;


}







/* ============================================================
   INITIALISATION MESURES
============================================================ */


function initMesuresTitrage() {


  const bouton =

    document.getElementById(
      "btn-ajouter-mesure"
    );



  if (!bouton) {

    return;

  }



  bouton.addEventListener(

    "click",

    ajouterMesureTitrage

  );


}
/* ============================================================
   MODE OPÉRATOIRE — AFFICHAGE DYNAMIQUE
============================================================ */


/**
 * Gestion des images de protocole TP03.
 * Les chemins sont centralisés dans TP_CONFIG.
 * Aucun chemin relatif dispersé dans le code.
 */


function initModeOperatoire() {


  const image =
    document.querySelector(
      "#mode-titrage img"
    );



  if (!image) {

    return;

  }



  image.src =

    TP_CONFIG.images.racine

    +

    TP_CONFIG.images.modeOperatoire;



  image.alt =

    "Mode opératoire - Titrage acido-basique";


}







/* ============================================================
   INITIALISATION GLOBALE TP03
============================================================ */


function initialiserTP03() {


  initTP03();



  initEvenementsTitrage();



  initCourbeTitrage();



  initMesuresTitrage();



  initModeOperatoire();



  afficherEquivalent();



}







/* ============================================================
   DÉTECTION CHARGEMENT MODULE SPA
============================================================ */


/**
 * navigation.js charge le fragment puis le JS.
 * Cette protection évite les doubles initialisations.
 */


if (

  !window.tp03Initialise

) {


  window.tp03Initialise = true;



  initialiserTP03();


}





}
