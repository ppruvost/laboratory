/* ==========================================================
   TP01 — IMPRESSION DU COMPTE RENDU
   tp-chimie/js/print-tp01.js
   ========================================================== */

export function imprimerCompteRendu({ products, dangerDB, pictogrammes }) {

    const $ = id => document.getElementById(id);
    const val   = id => ($( id )?.value        ?? "").trim();
    const texte = id => ($( id )?.textContent  ?? "").trim();

    const identite = {
        nom:     val("nom-eleve")    || "—",
        prenom:  val("prenom-eleve") || "—",
        classe:  val("classe-eleve") || "—",
        date:    val("date-eleve")   || "—",
    };

    const cas     = $("reactif-dissolution")?.value ?? "";
    const produit = products.find(p => p.cas === cas) ?? { nom: "—", formule: "—" };

    const dangers = [];
    (produit.dangers   ?? []).forEach(code => {
        const d = dangerDB.find(x => x.code === code);
        if (d) dangers.push(`${code} : ${d.text ?? d.texte ?? ""}`);
    });
    (produit.prevention ?? []).forEach(code => {
        const d = dangerDB.find(x => x.code === code);
        if (d) dangers.push(`${code} : ${d.text ?? d.texte ?? ""}`);
    });

    const materiel = [];
    document.querySelectorAll("#materiel-verrerie .item-materiel").forEach(lbl => {
        const checked = lbl.querySelector("input[type=checkbox]")?.checked ?? false;
        const nom     = lbl.querySelector("strong")?.textContent.trim() ?? "";
        if (nom) materiel.push({ checked, nom });
    });

    const equipements = [];
    document.querySelectorAll("#materiel-equipements .item-materiel").forEach(lbl => {
        const checked = lbl.querySelector("input[type=checkbox]")?.checked ?? false;
        const nom     = lbl.querySelector("strong")?.textContent.trim() ?? "";
        if (nom) equipements.push({ checked, nom });
    });

    const masseTheo = texte("table-masse-dissolution") || val("pe-masse-theo") || "—";
    const solution  = {
        C:              val("c-dissolution")   || "—",
        V:              val("v-dissolution")   || "—",
        M:              val("m-dissolution")   || "—",
        masseTheorique: masseTheo,
    };

    const masseLue = val("pe-lue-01") || val("pe-lue-1g") || null;
    let balance = { masse: "—", erreurAbs: "—", erreurRel: "—", conclusion: "—", analyse: "—" };

    if (masseLue && masseTheo !== "—") {
        const l = parseFloat(masseLue);
        const t = parseFloat(masseTheo);
        if (!isNaN(l) && !isNaN(t) && t > 0) {
            const abs = Math.abs(l - t);
            const rel = (abs / t) * 100;
            const signe = ((l - t) / t * 100).toFixed(2);
            let conclusion;
            if      (rel < 2) { conclusion = "Excellent (< 2 %)";   }
            else if (rel < 5) { conclusion = "Acceptable (2–5 %)";  }
            else              { conclusion = "Insuffisant (> 5 %)"; }
            balance = {
                masse:      l.toFixed(2),
                erreurAbs:  abs.toFixed(3),
                erreurRel:  rel.toFixed(2),
                conclusion,
                analyse: `Écart relatif : ${signe} % — ${conclusion}`,
            };
        }
    }

    const questions = [
        { num: "1A",  comp: "APP",     texte: "Qu'est-ce qu'une dissolution ? Qu'est-ce qu'une dilution ? Expliquer la différence." },
        { num: "2A",  comp: "APP",     texte: "Pourquoi faut-il toujours verser l'acide dans l'eau et jamais l'inverse ?" },
        { num: "3A",  comp: "REA",     texte: "Convertir le volume V utilisé pour la dissolution de mL en L, puis de L en mL si une autre valeur est donnée en L." },
        { num: "4A",  comp: "REA",     texte: "Calculer la quantité de matière n (en mol) du réactif sélectionné à partir de la masse théorique et de la masse molaire M." },
        { num: "5A",  comp: "REA",     texte: "Convertir la masse théorique calculée de g en mg." },
        { num: "6A",  comp: "REA",     texte: "Calculer la concentration massique Cm (en g/L) de la solution préparée à partir de la masse théorique et du volume V." },
        { num: "7A",  comp: "ANA RAI", texte: "Calculer l'erreur absolue Δm entre la masse théorique et la masse réellement pesée." },
        { num: "8A",  comp: "ANA RAI", texte: "Calculer l'erreur relative (en %) associée à cette pesée. Cette erreur est-elle acceptable au regard du seuil de 2 % ?" },
        { num: "9A",  comp: "VAL",     texte: "Identifier les principales sources d'erreurs expérimentales et proposer une amélioration du protocole." },
        { num: "10A", comp: "COM",     texte: "Rédiger une conclusion synthétique présentant la solution préparée et la qualité de la pesée, avec un vocabulaire scientifique précis." },
    ];
    const reponses = questions.map((q, i) => val(`question${i + 1}`));

    genererPageImpression({ identite, produit, dangers, materiel, equipements, solution, balance, questions, reponses });
}

/* ==========================================================
   GENERATEUR HTML — rapport académique
   ========================================================== */

function genererPageImpression(data) {
    const {
        identite, produit, dangers = [], materiel = [], equipements = [],
        solution, balance, questions = [], reponses = [],
    } = data;

    const cssUrl = new URL("../css/print-tp01.css", window.location.href).href;

    const materielListe = materiel
        .filter(m => m.checked)
        .map(m => `<li>${m.nom}</li>`)
        .join("") || `<li class="vide">Aucun élément coché</li>`;

    const equipementsListe = equipements
        .filter(e => e.checked)
        .map(e => `<li>${e.nom}</li>`)
        .join("") || `<li class="vide">Aucun élément coché</li>`;

    const dangersListe = dangers.length
        ? dangers.map(d => `<li>${d}</li>`).join("")
        : `<li class="vide">Aucune mention renseignée</li>`;

    const dateAffichee = identite.date !== "—"
        ? new Date(identite.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
        : "—";

    /* Cartouche de compétence alignée à droite, avec grille de cotation 0 / 1 / 2 */
    const questionsHtml = questions.map((q, i) => `
      <div class="qr-bloc">
        <div class="qr-entete">
          <div class="qr-entete-texte">
            <span class="qr-num">${q.num}.</span>
            <span class="qr-texte">${q.texte}</span>
          </div>
          <div class="qr-comp-bloc">
            <div class="qr-comp-label">${q.comp}</div>
            <div class="qr-comp-cotation">
              <div class="qr-comp-case">0</div>
              <div class="qr-comp-case">1</div>
              <div class="qr-comp-case">2</div>
            </div>
          </div>
        </div>
        <div class="qr-reponse">${reponses[i] ? reponses[i].replace(/\n/g, "<br>") : "<em>Sans réponse</em>"}</div>
      </div>
    `).join("");

    const html = `
<html>
<head>
  <title>TP01 — Compte rendu — ${identite.nom} ${identite.prenom}</title>
  <link rel="stylesheet" href="${cssUrl}">
</head>
<body>
<div class="page">

  <header class="cr-header">
    <div class="cr-header-titre">
      <div class="cr-logo">SciLab</div>
      <h1>Compte rendu — TP01<br><span>Préparation de solutions</span></h1>
    </div>
    <table class="cr-identite">
      <tbody>
        <tr><th>Nom</th><td>${identite.nom}</td></tr>
        <tr><th>Prénom</th><td>${identite.prenom}</td></tr>
        <tr><th>Classe</th><td>${identite.classe}</td></tr>
        <tr><th>Date</th><td>${dateAffichee}</td></tr>
      </tbody>
    </table>
  </header>

  <section class="cr-section">
    <h2>1. Sécurité — Produit utilisé</h2>
    <p class="cr-produit-nom">${produit.nom} <span class="cr-formule">(${produit.formule})</span></p>
    <ul class="cr-liste-dangers">${dangersListe}</ul>
  </section>

  <section class="cr-section cr-grid-2">
    <div>
      <h2>2. Verrerie</h2>
      <ul class="cr-liste-materiel">${materielListe}</ul>
    </div>
    <div>
      <h2>3. Équipements</h2>
      <ul class="cr-liste-materiel">${equipementsListe}</ul>
    </div>
  </section>

  <section class="cr-section">
    <h2>4. Préparation par dissolution</h2>
    <table class="cr-tableau-donnees">
      <thead>
        <tr><th>C (mol/L)</th><th>V (mL)</th><th>M (g/mol)</th><th>Masse théorique (g)</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>${solution.C}</td>
          <td>${solution.V}</td>
          <td>${solution.M}</td>
          <td><strong>${solution.masseTheorique}</strong></td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="cr-section">
    <h2>5. Analyse de la pesée</h2>
    <table class="cr-tableau-donnees">
      <thead>
        <tr>
          <th>Masse théorique (g)</th>
          <th>Masse lue (g)</th>
          <th>Erreur absolue Δm (g)</th>
          <th>Erreur relative (%)</th>
          <th>Conclusion</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${solution.masseTheorique}</td>
          <td>${balance.masse}</td>
          <td>${balance.erreurAbs}</td>
          <td>${balance.erreurRel}</td>
          <td class="cr-conclusion">${balance.conclusion}</td>
        </tr>
      </tbody>
    </table>
    <p class="cr-analyse-texte">${balance.analyse}</p>
  </section>

  <section class="cr-section cr-questions">
    <h2>6. Questions — Évaluation des compétences</h2>
    ${questionsHtml}
  </section>

  <footer class="cr-footer">
    Document généré le ${new Date().toLocaleDateString("fr-FR")} — SciLab TP Chimie
  </footer>

</div>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (!win) {
        alert("La fenêtre d'impression a été bloquée par le navigateur. Autorisez les popups pour ce site puis réessayez.");
        return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();

    /* Laisser le temps au navigateur de charger le CSS avant d'imprimer */
    win.onload = () => {
        win.print();
    };
}
