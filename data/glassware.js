const glassware = [
  // Verrerie de base
  { nom: "Bécher", contenance_ml: "50 / 100 / 250 / 500 / 1000", lieu: "Salle B27 / étagère D3", categorie: "Dissolution", image: "assets/img/glassware/becher.png" },
  { nom: "Erlenmeyer", contenance_ml: "50 / 100 / 250 / 500 / 1000", lieu: "Salle B27 / étagère D3", image: "assets/img/glassware/erlenmeyer.png" },
  { nom: "Fiole jaugée", contenance_ml: "50 / 100 / 200 / 250 / 500 / 1000", lieu: "Salle B27 / étagère D3", categorie: "Dissolution", image: "assets/img/glassware/fiole_jaugee.png" },
  { nom: "Éprouvette graduée", contenance_ml: "10 / 25 / 50 / 100 / 250 / 500 / 1000", lieu: "Salle B27 / étagère D1", image: "assets/img/glassware/eprouvette_graduee.png" },
  { nom: "Tube à essai", contenance_ml: "5 / 10 / 20", lieu: "Salle B27 / étagère D1", image: "assets/img/glassware/tube_essai.png" },

  // Ballons
  { nom: "Ballon fond rond", contenance_ml: "50 / 100 / 250 / 500 / 1000", lieu: "Salle B27 / étagère D3", categorie: "Dissolution", image: "assets/img/glassware/ballon_fond_rond.png" },
  { nom: "Ballon fond plat", contenance_ml: "100 / 250 / 500 / 1000", lieu: "Salle B27 / étagère D3", categorie: "Dissolution", image: "assets/img/glassware/ballon_fond_plat.png" },
  { nom: "Ballon à col long", contenance_ml: "100 / 250 / 500", lieu: "Salle B27 / étagère D3", categorie: "Dissolution", "assets/img/glassware/ballon_col_long.png" },

  // Mesure précise
  { nom: "Burette", contenance_ml: "25 / 50", lieu: "Salle B27 / pallasse E2", image: "assets/img/glassware/burette.png" },
  { nom: "Pipette graduée", contenance_ml: "1 / 2 / 5 / 10 / 20", lieu: "Salle B27 / pallasse E2", categorie: "Dissolution", image: "assets/img/glassware/pipette_graduee.png" },
  { nom: "Pipette jaugée", contenance_ml: "5 / 10 / 20 / 25", lieu: "Salle B27 / pallasse E2", categorie: "Dissolution", image: "assets/img/glassware/pipette_jaugee.png" },
  
  // Transfert / séparation
  { nom: "Ampoule à décanter", contenance_ml: "100 / 250 / 500 / 1000", lieu: "Salle B27 / étagère D4", image: "assets/img/glassware/ampoule_decanter.png" },
  { nom: "Entonnoir", contenance_ml: "50 / 100 / 150", lieu: "Salle B27 / étagère D3", image: "assets/img/glassware/entonnoir.png" },
  { nom: "Fiole à vide", contenance_ml: "250 / 500 / 1000", lieu: "Salle B27 / étagère D3", image: "assets/img/glassware/fiole_vide.png" },

  // Chauffage / réaction
  { nom: "Tube à essai gradué", contenance_ml: "10 / 20", lieu: "", image: "assets/img/glassware/tube_gradue.png" },

  { nom: "Tube de culture", contenance_ml: "5 / 10", lieu: "", image: "assets/img/glassware/tube_culture.png" },

  // Distillation
  { nom: "Réfrigérant droit (Liebig)", contenance_ml: "N/A", lieu: "", image: "assets/img/glassware/refrigerant_droit.png" },
  { nom: "Réfrigérant à boules (Allihn)", contenance_ml: "N/A", lieu: "", image: "assets/img/glassware/refrigerant_a_boule.png" },
  
  // Divers
  { nom: "Cristallisoir", contenance_ml: "100 / 250 / 500", lieu: "Salle B27 / étagère D1", categorie: "Dissolution", image: "assets/img/glassware/cristallisoir.png" },

  { nom: "Verre de montre", contenance_ml: "50 / 100", lieu: "Salle B27 / étagère D3", categorie: "Dissolution", image: "assets/img/glassware/verre_montre.png" },
  { nom: "Flacon réactif", contenance_ml: "100 / 250 / 500 / 1000", lieu: "Salle B27 / étagère D3", image: "assets/img/glassware/flacon_reactif.png" },
  { nom: "Flacon compte-gouttes", contenance_ml: "10 / 20 / 50", lieu: "Salle B27 / étagère D3", image: "assets/img/glassware/flacon_compte_goutte.png" },
  { nom: "Pissette", contenance_ml: "250 / 500", lieu: "Salle B27 / étagère D3", categorie: "Dissolution", image: "assets/img/glassware/pissette.png" },

  // Verrerie spécialisée
  { nom: "Dessiccateur", contenance_ml: "N/A", lieu: "", image: "assets/img/glassware/dessicateur.png" },

  { nom: "Ampoule de coulée", contenance_ml: "100 / 250", lieu: "", image: "assets/img/glassware/ampoule_coulee.png" },

  { nom: "Tube de Thiele", contenance_ml: "N/A", lieu: "", image: "assets/img/glassware/thiele.png" }
];

export default glassware;
