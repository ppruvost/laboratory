window.analyser = function() {

  const lignes = document.querySelectorAll("#table-mesures tbody tr");

  let U = [];
  let I = [];

  lignes.forEach(ligne => {
    const u = parseFloat(ligne.querySelector(".U").value);
    const i = parseFloat(ligne.querySelector(".I").value);

    if (!isNaN(u)) U.push(u);
    if (!isNaN(i)) I.push(i);
  });

  if (U.length === 0 || I.length === 0) {
    alert("⚠️ Entre des valeurs !");
    return;
  }

  const statsU = calculStats(U);
  const statsI = calculStats(I);

  // =========================
  // PUISSANCE
  // =========================
  const P = statsU.moyenne * statsI.moyenne;

  // propagation incertitude
  const uP = P * (
    (statsU.incertitudeA / statsU.moyenne) +
    (statsI.incertitudeA / statsI.moyenne)
  );

  // =========================
  // LAMPE
  // =========================
  const Pnom = parseFloat(document.getElementById("puissanceLampe").value);

  const erreurAbs = Math.abs(P - Pnom);
  const erreurRel = erreurAbs / Pnom;

  // =========================
  // HISTOGRAMME
  // =========================
  construireHistogramme(U, "histogramme");

  // =========================
  // INTERPRÉTATION
  // =========================
  const interpretation = analyserDispersion(statsU);

  // conformité (niveau Bac)
  let conformite = "";
  if (erreurRel < 0.1) {
    conformite = "✅ Lampe conforme";
  } else {
    conformite = "❌ Lampe non conforme";
  }

  // =========================
  // AFFICHAGE RÉSULTATS
  // =========================
  document.getElementById("resultats").innerHTML = `
    <p><b>Tension :</b> ${formaterResultat(statsU.moyenne, statsU.incertitudeA)} V</p>
    <p><b>Intensité :</b> ${formaterResultat(statsI.moyenne, statsI.incertitudeA)} A</p>
    <p><b>Puissance :</b> ${formaterResultat(P, uP)} W</p>
    <hr>
    <p><b>Erreur absolue :</b> ${erreurAbs.toFixed(2)} W</p>
    <p><b>Erreur relative :</b> ${(erreurRel*100).toFixed(1)} %</p>
    <p><b>Conclusion :</b> ${conformite}</p>
  `;

  document.getElementById("analyse").innerHTML = `
    ${interpretation}
    <h3>⚡ Analyse puissance</h3>
    <ul>
      <li>La puissance dépend de U et I</li>
      <li>L’incertitude sur P dépend des deux mesures</li>
      <li>Plus U et I sont dispersées → plus P est incertaine</li>
      <li>Erreur relative = critère de conformité</li>
    </ul>
  `;

  document.getElementById("rapport").textContent =
    genererRapport(statsU, statsI, P, uP, erreurAbs, erreurRel, Pnom, conformite);
}

// ==========================
// Fonction impression PDF
// ==========================
window.imprimerPDF = function() {

  const boutons = document.querySelectorAll("button");

  boutons.forEach(btn => btn.style.display = "none");

  window.print();

  boutons.forEach(btn => btn.style.display = "inline-block");

}
