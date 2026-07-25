// ==========================
// STATISTIQUES
// ==========================
function calculStats(tab) {

  const n = tab.length;

  const moyenne = tab.reduce((a, b) => a + b, 0) / n;

  const variance = tab.reduce((s, v) => s + Math.pow(v - moyenne, 2), 0) / n;

  const ecartType = Math.sqrt(variance);

  // incertitude type A (statistique)
  const incertitudeA = ecartType / Math.sqrt(n);

  return {
    n,
    moyenne,
    variance,
    ecartType,
    incertitudeA
  };
}
// ==========================
// CHIFFRES SIGNIFICATIFS
// ==========================

function formaterResultat(valeur, incertitude) {

  // règle BAC Pro : 1 chiffre significatif sur l'incertitude
  const incArrondie = parseFloat(incertitude.toPrecision(1));

  // on aligne la valeur sur l'incertitude
  const decimales = (incArrondie.toString().split(".")[1] || "").length;

  const valArrondie = valeur.toFixed(decimales);

  return `${valArrondie} ± ${incArrondie}`;
}
//=======================
// 🧠 QUALITÉ DE MESURE
//=======================

function evaluerQualite(U) {

  if (U.ecartType < 0.1) return "🟢 Très bonne qualité de mesure";
  if (U.ecartType < 0.5) return "🟠 Qualité moyenne";
  return "🔴 Mesures à refaire";
}
