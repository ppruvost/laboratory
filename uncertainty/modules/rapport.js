function genererRapport(U, I, P, uP, eAbs, eRel, Pnom, conformite) {

  return `
=============================
📄 RAPPORT TP - INCERTITUDES
=============================

📊 TENSION
U = ${formaterResultat(U.moyenne, U.incertitudeA)} V

- Moyenne = ${U.moyenne.toFixed(3)} (meilleur estimateur de la grandeur)
- Écart-type = ${U.ecartType.toFixed(3)} (dispersion des mesures)
- Incertitude type A = ${U.incertitudeA.toFixed(3)}
- Qualité de la mesure : ${evaluerQualite(U)}

📊 INTENSITÉ
I = ${formaterResultat(I.moyenne, I.incertitudeA)} A

- Moyenne = ${I.moyenne.toFixed(3)} (valeur la plus probable)
- Écart-type = ${I.ecartType.toFixed(3)}
- Incertitude type A = ${I.incertitudeA.toFixed(3)}
- Qualité de la mesure : ${evaluerQualite(I)}

⚡ PUISSANCE
P = ${formaterResultat(P, uP)} W
- Calcul : P = U × I
- Incertitude sur P = ${uP.toFixed(3)}

📊 ERREURS
- Erreur absolue e₁ = ${eAbs.toFixed(2)} W
- Erreur relative e₂ = ${(eRel*100).toFixed(1)} %

💡 COMPARAISON À LA LAMPE
- Puissance nominale = ${Pnom} W
- ${conformite}

🧠 ANALYSE STATISTIQUE
- La dispersion des mesures traduit la variabilité expérimentale
- L’écart-type est un estimateur de cette dispersion
- La moyenne est le meilleur estimateur de la grandeur physique

- La puissance dépend de deux grandeurs mesurées → incertitude amplifiée
- Plus les mesures sont dispersées, plus l’incertitude sur P augmente
- L’erreur relative permet de juger la conformité

⚠️ SOURCES D’INCERTITUDE
- Instrument de mesure (résolution, précision constructeur)
- Manipulation expérimentale (lecture, contact, réglage)
- Variations du circuit électrique

📌 INTERPRÉTATION BAC PRO
- Faible dispersion → mesure fiable
- Forte dispersion → refaire les mesures
- L’incertitude augmente avec la variabilité

✔ CONCLUSION
La valeur retenue est la moyenne des mesures, associée à une incertitude liée à la dispersion et aux instruments de mesure.
La lampe est considérée conforme si l’erreur relative reste faible (≈ < 10%).

=============================
`;
}
