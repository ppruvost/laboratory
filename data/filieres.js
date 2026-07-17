/**
 * data/filieres.js
 * Catalogue des filières professionnelles (Bac Pro) proposées par niveau
 * de classe, pour contextualiser les problématiques de chimie de SciLab
 * selon le domaine professionnel de l'élève.
 *
 * Source d'inspiration pour la démarche « situation professionnelle » :
 * https://sti.eduscol.education.fr/actualites/affronter-les-situations-professionnelles-en-bac-pro-mcc
 *
 * Les clés de niveau ("2nde", "1ere", "tle") sont volontairement sans
 * accent / abréviées pour correspondre aux identifiants utilisés dans
 * js/contexte-pro.js. L'affichage (libellé) est géré séparément.
 */
const FILIERES_PRO = {
    "2nde": [
        { id: "remi", label: "Réalisation d’Ensembles Mécaniques et Industriels" },
        { id: "mcc",  label: "Métiers de la couture et de la confection" }
    ],
    "1ere": [
        { id: "tci",  label: "Technicien en chaudronnerie industrielle" },
        { id: "trpm", label: "Technicien en réalisation de produits mécaniques — option réalisation et maintenance des outillages" },
        { id: "mcc",  label: "Métiers de la couture et de la confection" }
    ],
    "tle": [
        { id: "tci",  label: "Technicien en chaudronnerie industrielle" },
        { id: "trpm", label: "Technicien en réalisation de produits mécaniques — option réalisation et maintenance des outillages" },
        { id: "mcc",  label: "Métiers de la couture et de la confection" }
    ]
};

export default FILIERES_PRO;
