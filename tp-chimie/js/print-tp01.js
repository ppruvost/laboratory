function genererPageImpression(data) {
  const {
    produit,
    dangers = [],
    materiel = [],
    equipements = [],
    solution,
    balance,
    questions = [],
    reponses = []
  } = data;

  const materielListe = materiel
    .filter(m => m.checked)
    .map(m => `<li>${m.nom}</li>`)
    .join("");

  const equipementsListe = equipements
    .filter(e => e.checked)
    .map(e => `<li>${e.nom}</li>`)
    .join("");

  const html = `
  <html>
  <head>
    <title>TP01 Impression</title>
    <link rel="stylesheet" href="print.css">
  </head>

  <body>

  <div class="page">

    <h2>TP01 - Préparation de solutions</h2>

    <!-- Sécurité -->
    <section class="bloc">
      <h3>Sécurité - Produits utilisés</h3>
      <p><strong>${produit.nom}</strong></p>

      <div class="small">
        <h4>Danger et prévention</h4>
        <ul>
          ${dangers.map(d => `<li>${d}</li>`).join("")}
        </ul>
      </div>
    </section>

    <!-- Matériel -->
    <section class="bloc small">
      <h3>Matériel nécessaire</h3>
      <ul>${materielListe}</ul>
    </section>

    <!-- Équipements -->
    <section class="bloc small">
      <h3>Équipements</h3>
      <ul>${equipementsListe}</ul>
    </section>

    <!-- Préparation -->
    <section class="bloc">
      <h3>Préparation par dissolution</h3>

      <p>C (mol/L) : ${solution.C}</p>
      <p>V (mL) : ${solution.V}</p>
      <p>M (g/mol) : ${solution.M}</p>
      <p><strong>Masse à peser (théorique)</strong> : ${solution.masseTheorique} g</p>
      <p><strong>Masse lue</strong> : ${balance.masse} g</p>

      <p><strong>Erreur absolue</strong> : ${balance.erreurAbs} g</p>
      <p><strong>Erreur relative</strong> : ${balance.erreurRel} %</p>

      <p><strong>Conclusion</strong> : ${balance.conclusion}</p>
    </section>

    <!-- Analyse -->
    <section class="bloc small">
      <h3>Analyse de l'écart</h3>
      <p>${balance.analyse}</p>
    </section>

    <!-- Q/R -->
    <section class="bloc small">
      <h3>Questions / Réponses</h3>
      ${questions.map((q, i) => `
        <p><strong>Q :</strong> ${q}</p>
        <p><strong>R :</strong> ${reponses[i] || ""}</p>
      `).join("")}
    </section>

  </div>

  </body>
  </html>
  `;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}
