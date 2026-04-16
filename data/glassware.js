const glassware = [
  // Verrerie de base
  { nom: "Bécher", contenance_ml: "50 / 100 / 250 / 500 / 1000", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Beaker.jpg/320px-Beaker.jpg" },

  { nom: "Erlenmeyer", contenance_ml: "50 / 100 / 250 / 500 / 1000", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Erlenmeyer_flask.jpg/320px-Erlenmeyer_flask.jpg" },

  { nom: "Fiole jaugée", contenance_ml: "50 / 100 / 200 / 250 / 500 / 1000", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Volumetric_flask.jpg/320px-Volumetric_flask.jpg" },

  { nom: "Éprouvette graduée", contenance_ml: "10 / 25 / 50 / 100 / 250 / 500 / 1000", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Graduated_cylinder.jpg/320px-Graduated_cylinder.jpg" },

  { nom: "Tube à essai", contenance_ml: "5 / 10 / 20", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Test_tubes.jpg/320px-Test_tubes.jpg" },

  // Ballons
  { nom: "Ballon fond rond", contenance_ml: "50 / 100 / 250 / 500 / 1000", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Round-bottom_flask.jpg/320px-Round-bottom_flask.jpg" },

  { nom: "Ballon fond plat", contenance_ml: "100 / 250 / 500 / 1000", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Flat_bottom_flask.jpg/320px-Flat_bottom_flask.jpg" },

  { nom: "Ballon à col long", contenance_ml: "100 / 250 / 500", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Round-bottom_flask.jpg/320px-Round-bottom_flask.jpg" },

  // Mesure précise
  { nom: "Burette", contenance_ml: "25 / 50", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Burette.jpg/320px-Burette.jpg" },

  { nom: "Pipette graduée", contenance_ml: "1 / 2 / 5 / 10 / 20", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Graduated_pipette.jpg/320px-Graduated_pipette.jpg" },

  { nom: "Pipette jaugée", contenance_ml: "5 / 10 / 20 / 25", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Volumetric_pipette.jpg/320px-Volumetric_pipette.jpg" },

  { nom: "Micropipette", contenance_ml: "0.1 à 1000 µL", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Micropipette.jpg/320px-Micropipette.jpg" },

  // Transfert / séparation
  { nom: "Ampoule à décanter", contenance_ml: "100 / 250 / 500 / 1000", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Separatory_funnel.jpg/320px-Separatory_funnel.jpg" },

  { nom: "Entonnoir simple", contenance_ml: "50 / 100 / 150", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Funnel.jpg/320px-Funnel.jpg" },

  { nom: "Entonnoir Büchner", contenance_ml: "50 / 100 / 250", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Buchner_funnel.jpg/320px-Buchner_funnel.jpg" },

  { nom: "Fiole à vide (Kitasato)", contenance_ml: "250 / 500 / 1000", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kitasato_flask.jpg/320px-Kitasato_flask.jpg" },

  // Chauffage / réaction
  { nom: "Tube à essai gradué", contenance_ml: "10 / 20", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Test_tubes.jpg/320px-Test_tubes.jpg" },

  { nom: "Tube de culture", contenance_ml: "5 / 10", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Test_tubes.jpg/320px-Test_tubes.jpg" },

  // Distillation
  { nom: "Réfrigérant droit (Liebig)", contenance_ml: "N/A", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Liebig_condenser.jpg/320px-Liebig_condenser.jpg" },

  { nom: "Réfrigérant à boules (Allihn)", contenance_ml: "N/A", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Allihn_condenser.jpg/320px-Allihn_condenser.jpg" },

  { nom: "Colonne de distillation", contenance_ml: "N/A", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Fractionating_column.jpg/320px-Fractionating_column.jpg" },

  // Divers
  { nom: "Cristallisoir", contenance_ml: "100 / 250 / 500", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Crystallizing_dish.jpg/320px-Crystallizing_dish.jpg" },

  { nom: "Verre de montre", contenance_ml: "50 / 100", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Watch_glass.jpg/320px-Watch_glass.jpg" },

  { nom: "Flacon réactif", contenance_ml: "100 / 250 / 500 / 1000", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Reagent_bottle.jpg/320px-Reagent_bottle.jpg" },

  { nom: "Flacon compte-gouttes", contenance_ml: "10 / 20 / 50", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Dropper_bottle.jpg/320px-Dropper_bottle.jpg" },

  { nom: "Pissette", contenance_ml: "250 / 500", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Wash_bottle.jpg/320px-Wash_bottle.jpg" },

  // Verrerie spécialisée
  { nom: "Dessiccateur", contenance_ml: "N/A", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Desiccator.jpg/320px-Desiccator.jpg" },

  { nom: "Ampoule de coulée", contenance_ml: "100 / 250", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Separatory_funnel.jpg/320px-Separatory_funnel.jpg" },

  { nom: "Tube de Thiele", contenance_ml: "N/A", lieu: "", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Thiele_tube.jpg/320px-Thiele_tube.jpg" }
];

export default glassware;
