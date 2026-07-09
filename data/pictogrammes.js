const PICTO = "assets/picto/";

const pictogrammes = [
  // =========================================
  // PICTOGRAMMES SGH (DANGERS CHIMIQUES)
  // =========================================

  // Explosif
  { H200: PICTO + "SGH01_BombeExplosant.jpg" },
  { H201: PICTO + "SGH01_BombeExplosant.jpg" },
  { H202: PICTO + "SGH01_BombeExplosant.jpg" },
  { H203: PICTO + "SGH01_BombeExplosant.jpg" },

  // Inflammable
  { H220: PICTO + "SGH02_Flamme.jpg" },
  { H221: PICTO + "SGH02_Flamme.jpg" },
  { H222: PICTO + "SGH02_Flamme.jpg" },
  { H223: PICTO + "SGH02_Flamme.jpg" },
  { H224: PICTO + "SGH02_Flamme.jpg" },
  { H225: PICTO + "SGH02_Flamme.jpg" },
  { H226: PICTO + "SGH02_Flamme.jpg" },

  // Comburant
  { H270: PICTO + "SGH03_FlammeSurCercle.jpg" },
  { H271: PICTO + "SGH03_FlammeSurCercle.jpg" },
  { H272: PICTO + "SGH03_FlammeSurCercle.jpg" },

  // Gaz sous pression
  { H230: PICTO + "SGH04_BouteilleGaz.jpg" },
  { H231: PICTO + "SGH04_BouteilleGaz.jpg" },
  { H280: PICTO + "SGH04_BouteilleGaz.jpg" },
  { H281: PICTO + "SGH04_BouteilleGaz.jpg" },

  // Corrosif
  { H290: PICTO + "SGH05_Corrosion.jpg" },
  { H314: PICTO + "SGH05_Corrosion.jpg" },
  { H318: PICTO + "SGH05_Corrosion.jpg" },

  // Toxicité aiguë
  { H300: PICTO + "SGH06_TeteDeMort.jpg" },
  { H301: PICTO + "SGH06_TeteDeMort.jpg" },
  { H302: PICTO + "SGH06_TeteDeMort.jpg" },
  { H310: PICTO + "SGH06_TeteDeMort.jpg" },
  { H311: PICTO + "SGH06_TeteDeMort.jpg" },
  { H330: PICTO + "SGH06_TeteDeMort.jpg" },
  { H331: PICTO + "SGH06_TeteDeMort.jpg" },

  // Irritant / nocif
  { H315: PICTO + "SGH07_PointExclamation.jpg" },
  { H317: PICTO + "SGH07_PointExclamation.jpg" },
  { H319: PICTO + "SGH07_PointExclamation.jpg" },
  { H332: PICTO + "SGH07_PointExclamation.jpg" },
  { H335: PICTO + "SGH07_PointExclamation.jpg" },
  { H336: PICTO + "SGH07_PointExclamation.jpg" },

  // Danger grave pour la santé
  { H304: PICTO + "SGH08_DangerSante.jpg" },
  { H334: PICTO + "SGH08_DangerSante.jpg" },
  { H340: "SGH08_DangerSante.jpg" },
  { H341: PICTO + "SGH08_DangerSante.jpg" },
  { H350: PICTO + "SGH08_DangerSante.jpg" },
  { H351: PICTO + "SGH08_DangerSante.jpg" },
  { H360: PICTO + "SGH08_DangerSante.jpg" },
  { H360FD: PICTO + "SGH08_DangerSante.jpg" },
  { H361: PICTO + "SGH08_DangerSante.jpg" },
  { H370: PICTO + "SGH08_DangerSante.jpg" },
  { H372: PICTO + "SGH08_DangerSante.jpg" },

  // Environnement
  { H400: PICTO + "SGH09_Environnement.jpg" },
  { H410: PICTO + "SGH09_Environnement.jpg" },
  { H411: PICTO + "SGH09_Environnement.jpg" },
  { H412: PICTO + "SGH09_Environnement.jpg" },

  // =========================================
  // OBLIGATIONS (EPI)
  // =========================================

  { OBLIGATION_GENERAL: PICTO + "OBLIGATION-general.jpg" },
  { CASQUE: PICTO + "OBLIGATION-casque.jpg" },
  { CASQUE_ANTIBRUIT: PICTO + "OBLIGATION-casque-antibruit.jpg" },
  { HOTTE: PICTO + "OBLIGATION-hotte.jpeg" },
  { BLOUSE: PICTO + "OBLIGATION-blouse.jpg" },
  { LUNETTES: PICTO + "OBLIGATION-lunettes.jpg" },
  { VISIERE: PICTO + "OBLIGATION-visiere.jpg" },
  { GANTS: "OBLIGATION-gants.jpg" },
  { CHAUSSURES_SECURITE: PICTO + "OBLIGATION-chaussures.jpg" },
  { COMBINAISON: PICTO + "OBLIGATION-combinaison.jpg" },
  { HARNAIS: PICTO + "OBLIGATION-harnais.jpg" },
  { PROTECTION_RESPIRATOIRE: PICTO + "OBLIGATION-protection-voies-espiratoires.jpg" },
  { PIETON: PICTO + "OBLIGATION-pieton.jpg" },
  { CONSULTER_NOTICE: PICTO + "OBLIGATION-consulter-notice.jpg" },

  // =========================================
  // DANGERS GÉNÉRAUX (TRIANGLE JAUNE)
  // =========================================

  { DANGER_GENERAL: PICTO + "DANGER-general.jpg" },
  { DANGER_ELECTRICITE: PICTO + "DANGER-electricite.jpg" },
  { DANGER_CHUTE: PICTO + "DANGER-chute.jpg" },
  { DANGER_TREBUCHEMENT: PICTO + "DANGER-trebuchement.jpg" },
  { DANGER_CHARIOT: PICTO + "DANGER-chariot.jpg" },
  { DANGER_CHARGE_SUSPENDUE: PICTO + "DANGER-charge-suspendue.jpg" },
  { DANGER_CHAMP_MAGNETIQUE: PICTO + "DANGER-champ-magnetique.jpg" },
  { DANGER_LASER: PICTO + "DANGER-laser.jpg" },
  { DANGER_FROID_GEL: PICTO + "DANGER-froid-gel.jpg" },
  { DANGER_COMBURANT: PICTO + "DANGER-comburant.jpg" },
  { DANGER_PRODUIT_CORROSIF: PICTO + "DANGER-produit-corrosif.jpg" },
  { DANGER_PRODUIT_INFLAMMABLE: PICTO + "DANGER-produit-inflammable.jpg" },
  { DANGER_PRODUIT_EXPLOSIF: PICTO + "DANGER-produit-explosif.jpg" },
  { DANGER_PRODUIT_TOXIQUE: PICTO + "DANGER-produit-toxique.jpg" },
  { DANGER_PRODUIT_NOCIF: PICTO + "DANGER-produit-nocif.jpg" },
  { DANGER_ATMOSPHERE_EXPLOSIVE: PICTO + "DANGER-atmosphere-explosive.jpg" },
  { DANGER_RISQUE_BIOLOGIQUE: PICTO + "DANGER-risque-biologique.jpg" },
  { DANGER_RADIOACTIVITE: PICTO + "DANGER-radioactivite.jpg" },
  { DANGER_RADIATIONS_NON_IONISANTES: PICTO + "DANGER-radiations-non-ionisantes.jpg" },
  { DANGER_BANDE_SIGNALISATION: PICTO + "DANGER-bande-signalisation.jpg" },

  // =========================================
  // INTERDICTIONS (ROND ROUGE)
  // =========================================

  { INTERDIT_BOIRE: PICTO + "INTERDIT-boire.jpg" },
  { INTERDIT_CHARIOT: PICTO + "INTERDIT-chariot.jpg" },
  { INTERDIT_ENTRER: "INTERDIT-entrer.jpg" },
  { INTERDIT_FLAMME: PICTO + "INTERDIT-flamme.jpg" },
  { INTERDIT_FUMER: PICTO + "INTERDIT-fumer.jpg" },
  { INTERDIT_PIETONS: PICTO + "INTERDIT-pietons.jpg" },
  { INTERDIT_SEAU_EAU: PICTO + "INTERDIT-seau-eau.jpg" },
  { INTERDIT_TOUCHER: PICTO + "INTERDIT-toucher.jpg" },

  // =========================================
  // INCENDIE (ROUGE)
  // =========================================

  { INCENDIE_ALARME: PICTO + "INCENDIE-alarme.jpg" },
  { INCENDIE_ECHELLE: PICTO + "INCENDIE-echelle.jpg" },
  { INCENDIE_EQUIPEMENT: PICTO + "INCENDIE-equipement.jpg" },
  { INCENDIE_EXTINCTEUR: PICTO + "INCENDIE-extincteur.jpg" },
  { INCENDIE_LANCE: PICTO + "INCENDIE-lance.jpg" },
  { INCENDIE_TELEPHONE: PICTO + "INCENDIE-telephone.jpg" },

  { INCENDIE_FLECHE_HAUT: PICTO + "INCENDIE-fleche-haut.jpg" },
  { INCENDIE_FLECHE_BAS: PICTO + "INCENDIE-fleche-bas.jpg" },
  { INCENDIE_FLECHE_GAUCHE: PICTO + "INCENDIE-fleche-gauche.jpg" },
  { INCENDIE_FLECHE_DROITE: PICTO + "INCENDIE-fleche-droite.jpg" },
  { INCENDIE_FLECHE_HAUT_GAUCHE: PICTO + "INCENDIE-fleche-haut-gauche.jpg" },
  { INCENDIE_FLECHE_HAUT_DROIT: PICTO + "INCENDIE-fleche-haut-droit.jpg" },
  { INCENDIE_FLECHE_BAS_GAUCHE: PICTO + "INCENDIE-fleche-bas-gauche.jpg" },
  { INCENDIE_FLECHE_BAS_DROIT: PICTO + "INCENDIE-fleche-bas-droit.jpg" },

  // =========================================
  // SECOURS (VERT)
  // =========================================

  { SECOURS_TELEPHONE_URGENCE: PICTO + "SECOURS-telephone-urgence.jpg" },
  { SECOURS_CROIX: PICTO + "SECOURS-croix.jpg" },
  { SECOURS_CIVIERE: PICTO + "SECOURS-civiere.jpg" },
  { SECOURS_DEFIBRILLATEUR: PICTO + "SECOURS-defibrillateur.jpg" },
  { SECOURS_DOUCHE_OEIL: PICTO + "SECOURS-douche-oeil.jpg" },
  { SECOURS_DOUCHE_SECURITE: PICTO + "SECOURS-douche-securite.jpg" },

  { SECOURS_POINT_RASSEMBLEMENT: PICTO + "SECOURS-point-rassemblement.jpg" },
  { SECOURS_REFUGE_TEMPORAIRE_EVACUATION: PICTO + "SECOURS-refuge-temporaire-evacuation.jpg" },

  { SECOURS_SORTIE_VERS_DROITE: PICTO + "SECOURS-sortie-vers-droite.jpg" },
  { SECOURS_SORTIE_VERS_GAUCHE: PICTO + "SECOURS-sortie-vers-gauche.jpg" },

  { SECOURS_FLECHE_HAUT: PICTO + "SECOURS-fleche-haut.jpg" },
  { SECOURS_FLECHE_BAS: PICTO + "SECOURS-fleche-bas.jpg" },
  { SECOURS_FLECHE_GAUCHE: PICTO + "SECOURS-fleche-gauche.jpg" },
  { SECOURS_FLECHE_DROITE: PICTO + "SECOURS-fleche-droite.jpg" },

  { SECOURS_FLECHE_HAUT_GAUCHE: PICTO + "SECOURS-fleche-haut-gauche.jpg" },
  { SECOURS_FLECHE_HAUT_DROIT: PICTO + "SECOURS-fleche-haut-droit.jpg" },
  { SECOURS_FLECHE_BAS_GAUCHE: PICTO + "SECOURS-fleche-bas-gauche.jpg" },
  { SECOURS_FLECHE_BAS_DROIT: PICTO + "SECOURS-fleche-bas-droit.jpg" }
];

export default pictogrammes;
