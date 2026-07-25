function genererAnalyse(U, I) {

  let texte = "<ul>";

  texte += "<li>📌 Variations possibles de la tension : mauvais contact, alimentation instable</li>";
  texte += "<li>📌 Variations du courant : résistance interne des fils, échauffement</li>";

  if (U.incertitudeA > 0.5) {
    texte += "<li>⚠️ Incertitude tension élevée → vérifier le voltmètre</li>";
  }

  if (I.incertitudeA > 0.05) {
    texte += "<li>⚠️ Incertitude courant élevée → vérifier le calibre de l’ampèremètre</li>";
  }

  texte += "<li>🧪 Hypothèse globale : incertitudes principalement instrumentales + manipulation</li>";

  texte += "</ul>";

  return texte;
}

function analyserDispersion(stats) {

  let texte = "<h3>📌 Analyse de la dispersion</h3><ul>";

  // lien référentiel : dispersion = incertitude expérimentale
  if (stats.ecartType < 0.1) {
    texte += "<li>✔ Faible dispersion → mesures homogènes</li>";
  } else if (stats.ecartType < 0.5) {
    texte += "<li>⚠ Dispersion moyenne → variabilité modérée</li>";
  } else {
    texte += "<li>❌ Forte dispersion → mesures peu fiables</li>";
  }

  texte += `
    <li>📊 Moyenne = meilleur estimateur de la grandeur</li>
    <li>📉 Écart-type = estimation de la dispersion</li>
    <li>📌 Incertitude expérimentale liée à la variabilité des mesures</li>
  `;

  texte += "</ul>";

  return texte;
}
function explicationReferentiel() {

  return `
📚 NOTIONS IMPORTANTES :

✔ Toute mesure est entachée d'une incertitude
✔ La moyenne est le meilleur estimateur de la grandeur
✔ L'écart-type mesure la dispersion des valeurs
✔ La dispersion représente une incertitude expérimentale
✔ L'instrument impose une incertitude supplémentaire

👉 Incertitude totale = combinaison :
- variabilité des mesures
- instrument de mesure
- conditions expérimentales
`;
}
