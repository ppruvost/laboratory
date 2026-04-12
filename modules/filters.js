// ===============================
// /== FILTRES LABORATOIRE ==/
// ===============================

// 🔍 Recherche texte (nom, CAS, formule)

export function searchProduits(produits, query) {
  if (!query) return produits;

  const q = query.toLowerCase();

  return produits.filter(p =>
    (p.nom || "").toLowerCase().includes(q) ||
    (p.cas || "").toLowerCase().includes(q) ||
    (p.formule || "").toLowerCase().includes(q)
  );
}

// 🧪 Filtre par catégorie

export function filterByCategorie(produits, categorie) {
  if (!categorie || categorie === "all") return produits;

  return produits.filter(p => p.categorie === categorie);
}

// ⚠️ Filtre par danger (H-code)

export function filterByDanger(produits, dangerCode) {
  if (!dangerCode || dangerCode === "all") return produits;

  return produits.filter(p =>
    (p.dangers || []).includes(dangerCode)
  );
}

// 📍 Filtre par localisation

export function filterByLocalisation(produits, loc) {
  if (!loc || loc === "all") return produits;

  return produits.filter(p => p.localisation === loc);
}

// 🧠 FILTRE COMBINÉ (le plus puissant)

export function applyFilters(produits, { query, categorie, danger, localisation }) {
  let result = produits;

  result = searchProduits(result, query);
  result = filterByCategorie(result, categorie);
  result = filterByDanger(result, danger);
  result = filterByLocalisation(result, localisation);

  return result;
}
