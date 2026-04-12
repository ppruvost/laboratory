// ===============================
// /== STORAGE LOCAL (LAB DB) ==/
// ===============================

const STORAGE_KEY = "produits";

// ===============================
// /== CHARGER DONNÉES ==/
// ===============================

export function loadProduits() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// ===============================
// /== SAUVEGARDER DONNÉES ==/
// ===============================

export function saveProduits(produits) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(produits));
}

// ===============================
// /== RESET BASE (OPTIONNEL DEBUG) ==/
// ===============================

export function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}
