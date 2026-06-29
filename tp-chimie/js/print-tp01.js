/* ==========================================================
   TP01 — IMPRESSION DU COMPTE RENDU
   tp-chimie/js/print-tp01.js
   ========================================================== */

export function imprimerCompteRendu({ products, dangerDB, pictogrammes }) {

    const $ = id => document.getElementById(id);
    const val   = id => ($( id )?.value        ?? "").trim();
    const texte = id => ($( id )?.textContent  ?? "").trim();

    /* ── Produit ── */
    const cas     = $("reactif-dissolution")?.value ?? "";
    const produit = products.find(p => p.cas === cas) ?? { nom: "—", formule: "—" };

    /* ── Dangers H + P ── */
    const dangers = [];
    (produit.dangers   ?? []).forEach(code => {
        const d = dangerDB.find(x => x.code === code);
        if (d) dangers.push(`${code} : ${d.text ?? d.texte ?? ""}`);
    });
    (produit.prevention ?? []).forEach(code => {
        const d = dangerDB.find(x => x.code === code);
        if (d) dangers.push(`${code} : ${d.text ?? d.texte ?? ""}`);
    });

    /* ── Matériel coché ── */
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

    /* ── Solution ── */
    const masseTheo = texte("table-masse-dissolution") || val("pe-masse-theo") || "—";
    const solution  = {
        C:              val("c-dissolution")   || "—",
        V:              val("v-dissolution")   || "—",
        M:              val("m-dissolution")   || "—",
        masseTheorique: masseTheo,
    };

    /* ── Balance : prend la première balance renseignée ── */
    const masseLue = val("pe-lue-01") || val("pe-lue-1g") || null;
    let balance = { masse: "—", erreurAbs: "—", erreurRel: "—", conclusion: "—", analyse: "—" };

    if (masseLue && masseTheo !== "—") {
        const l = parseFloat(masseLue);
        const t = parseFloat(masseTheo);
        if (!isNaN(l) && !isNaN(t) && t > 0) {
            const abs = Math.abs(l - t);
            const rel = (abs / t) * 100;
            const signe = ((l - t) / t * 100).toFixed(2);
            let conclusion, analyse;
            if      (rel < 2) { conclusion = "Excellent (< 2 %)";   }
            else if (rel < 5) { conclusion = "Acceptable (2–5 %)";  }
            else              { conclusion = "Insuffisant (> 5 %)";  }
            analyse = `Écart relatif : ${signe} % — ${conclusion}`;
            balance = {
                masse:      l.toFixed(2),
                erreurAbs:  abs.toFixed(3),
                erreurRel:  rel.toFixed(2),
                conclusion,
                analyse,
            };
        }
    }

    /* ── Questions ── */
    const questions = [
        "Différence entre dissolution et dilution ?",
        "Pourquoi faut-il toujours verser l'acide dans l'eau et jamais l'inverse ?",
        "Calculer la quantité de matière n du réactif sélectionné.",
        "Calculer la concentration massique Cm du réactif sélectionné.",
        "Identifier les principales sources d'erreurs expérimentales.",
    ];
    const reponses = [
        val("question1"), val("question2"), val("question3"),
        val("question4"), val("question5"),
    ];

    genererPageImpression({ produit, dangers, materiel, equipements, solution, balance, questions, reponses });
}

/* ==========================================================
   GENERATEUR HTML — inchangé par rapport à l'original
   ========================================================== */

function genererPageImpression(data) {
    const {
        produit,
        dangers      = [],
        materiel     = [],
        equipements  = [],
        solution,
        balance,
        questions    = [],
        reponses     = [],
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

  <section class="bloc">
    <h3>Sécurité - Produits utilisés</h3>
    <p><strong>${produit.nom}</strong></p>
    <div class="small">
      <h4>Danger et prévention</h4>
      <ul>${dangers.map(d => `<li>${d}</li>`).join("")}</ul>
    </div>
  </section>

  <section class="bloc small">
    <h3>Matériel nécessaire</h3>
    <ul>${materielListe}</ul>
  </section>

  <section class="bloc small">
    <h3>Équipements</h3>
    <ul>${equipementsListe}</ul>
  </section>

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

  <section class="bloc small">
    <h3>Analyse de l'écart</h3>
    <p>${balance.analyse}</p>
  </section>

  <section class="bloc small">
    <h3>Questions / Réponses</h3>
    ${questions.map((q, i) => `
      <p><strong>Q :</strong> ${q}</p>
      <p><strong>R :</strong> ${reponses[i] || ""}</p>
    `).join("")}
  </section>
</div>
</body>
</html>`;

    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
}
