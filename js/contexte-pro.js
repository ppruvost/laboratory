/**
 * js/contexte-pro.js
 * Module partagé : menu déroulant "filière professionnelle" affiché
 * juste après "Capacités évaluées" dans chaque TP, et rendu du
 * contexte professionnel + de la problématique associée.
 *
 * Les niveaux de classe proposés dans le menu sont déduits dynamiquement
 * des tags affichés dans le cadre bleu de l'en-tête (.tp-meta .tag) :
 * seuls les niveaux réellement annoncés par le TP (2nde / 1ère / Term)
 * génèrent un groupe d'options. Le contenu (contexte + problématique)
 * est propre à chaque TP et fourni par l'appelant via `contextes`.
 */

const LIBELLES_NIVEAU = {
    "2nde": "2nde",
    "1ere": "1ère",
    "tle": "Tle"
};

function normaliserNiveau(texte) {
    const t = (texte || "").trim().toLowerCase();
    if (t === "2nde") return "2nde";
    if (t === "1ère" || t === "1ere") return "1ere";
    if (t === "term" || t === "tle" || t === "terminale") return "tle";
    return null;
}

function detecterNiveauxPresents() {
    const niveaux = new Set();
    document.querySelectorAll(".tp-meta .tag").forEach(tag => {
        const niveau = normaliserNiveau(tag.textContent);
        if (niveau) niveaux.add(niveau);
    });
    return niveaux;
}

// Libellés d'activité utilisés uniquement pour l'affichage du bloc
// "Contexte professionnel" lorsqu'un TP fournit plusieurs problématiques
// (une par onglet de manipulation) via `data.problematiques`.
const LIBELLES_ACTIVITE = {
    "dissolution-dilution": "Dissolution / Dilution",
    "identification-ions": "Identification d'ions"
};

function rendreContexte(data) {
    if (!data) {
        return "<p>Sélectionner votre filière professionnelle pour afficher le contexte et la problématique associée.</p>";
    }

    let blocProblematiques;

    if (data.problematiques && typeof data.problematiques === "object") {
        const entrees = Object.entries(data.problematiques);
        const plusieurs = entrees.length > 1;
        blocProblematiques = entrees.map(([activite, texte]) => `
      <h3>Problématique${plusieurs ? ` — ${LIBELLES_ACTIVITE[activite] || activite}` : ""}</h3>
      <p class="problematique-txt" data-activite="${activite}">${texte}</p>`).join("");
    } else {
        blocProblematiques = `
      <h3>Problématique</h3>
      <p class="problematique-txt">${data.problematique}</p>`;
    }

    return `
    <div class="contexte-pro-bloc">
      <h3>Contexte professionnel</h3>
      <p>${data.contexte}</p>${blocProblematiques}
    </div>`;
}

/**
 * Répercute la problématique choisie dans tous les rappels affichés au fil
 * du TP (dernière question de chaque bloc « questions-tp »), sans que
 * l'élève ait à retourner consulter le Contexte professionnel.
 * Cible tout élément portant la classe .problematique-rappel.
 *
 * Si le TP fournit plusieurs problématiques (`data.problematiques`, une par
 * activité), chaque rappel doit porter un attribut `data-activite` pour
 * recevoir la problématique qui lui correspond (ex : le rappel du bloc de
 * questions « identification-ions » porte `data-activite="identification-ions"`).
 * Un rappel sans cet attribut reçoit la problématique unique `data.problematique`
 * (comportement historique, inchangé pour les TP à une seule activité).
 */
function rendreRappelsProblematique(data) {
    const placeholder = "Sélectionner votre filière professionnelle dans la section « Contexte professionnel » ci-dessus pour afficher ici la problématique.";

    document.querySelectorAll(".problematique-rappel").forEach(el => {
        if (!data) {
            el.textContent = placeholder;
            return;
        }

        const activite = el.dataset.activite;

        if (activite && data.problematiques && data.problematiques[activite]) {
            el.textContent = data.problematiques[activite];
        } else if (typeof data.problematique === "string") {
            el.textContent = data.problematique;
        } else if (data.problematiques) {
            el.textContent = Object.values(data.problematiques)[0];
        } else {
            el.textContent = placeholder;
        }
    });
}

/**
 * Initialise le sélecteur de filière professionnelle.
 * @param {Object} params
 * @param {Object} params.filieres  - Catalogue FILIERES_PRO (data/filieres.js)
 * @param {Object} params.contextes - Dictionnaire { "niveau-filiereId": {contexte, problematique} } propre au TP
 * @param {string} [params.selectId]
 * @param {string} [params.resultatId]
 */
export function initContextePro({
    filieres,
    contextes,
    selectId = "select-filiere-pro",
    resultatId = "contexte-pro-resultat"
} = {}) {
    const select = document.getElementById(selectId);
    const resultat = document.getElementById(resultatId);
    if (!select || !resultat || !filieres || !contextes) return;

    const niveauxPresents = detecterNiveauxPresents();

    select.innerHTML = '<option value="">-- Sélectionner une filière --</option>';

    ["2nde", "1ere", "tle"].forEach(niveau => {
        if (!niveauxPresents.has(niveau)) return;
        const options = filieres[niveau];
        if (!options || !options.length) return;

        const optgroup = document.createElement("optgroup");
        optgroup.label = LIBELLES_NIVEAU[niveau];

        options.forEach(f => {
            const opt = document.createElement("option");
            opt.value = `${niveau}-${f.id}`;
            opt.textContent = f.label;
            optgroup.appendChild(opt);
        });

        select.appendChild(optgroup);
    });

    select.addEventListener("change", () => {
        const data = contextes[select.value];
        resultat.innerHTML = rendreContexte(data);
        rendreRappelsProblematique(data);
    });

    resultat.innerHTML = rendreContexte(null);
    rendreRappelsProblematique(null);
}

/**
 * Renvoie la filière actuellement sélectionnée, ou null.
 * Utile pour l'inclure dans le compte-rendu.
 */
export function getFiliereSelectionnee(selectId = "select-filiere-pro") {
    const select = document.getElementById(selectId);
    if (!select || !select.value) return null;
    const option = select.options[select.selectedIndex];
    return {
        cle: select.value,
        filiere: option ? option.textContent : select.value,
        niveau: LIBELLES_NIVEAU[select.value.split("-")[0]] || ""
    };
}
