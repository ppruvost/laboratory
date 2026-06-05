// Fonction d'initialisation du module Sécurité
function initSecurite() {
    // Récupère tous les éléments nécessaires
    const riskSlider = document.getElementById("risk");
    const durationSlider = document.getElementById("duration");
    const riskText = document.getElementById("riskText");
    const riskLevel = document.getElementById("riskLevel");
    const advice = document.getElementById("advice");

    // Vérifie que tous les éléments existent
    if (!riskSlider || !durationSlider || !riskText || !riskLevel || !advice) {
        console.error("Un ou plusieurs éléments du module Sécurité sont introuvables !");
        return;
    }

    // Fonction pour évaluer le risque
    function evaluateRisk() {
        const db = Number(riskSlider.value);
        const duration = Number(durationSlider.value);

        riskText.innerHTML = db + " dB pendant " + duration + " min";

        let level = "";
        let message = "";
        let cssClass = "";

        if (db < 70) {
            level = "Zone sûre";
            message = "Pas de risque particulier.";
            cssClass = "success";
        } else if (db < 85) {
            level = "Vigilance";
            message = "Exposition prolongée déconseillée.";
            cssClass = "warning";
        } else if (db < 100) {
            level = "Danger auditif";
            message = "Protection auditive recommandée.";
            cssClass = "warning";
        } else {
            level = "Risque élevé";
            message = "Limiter fortement l'exposition.";
            cssClass = "danger";
        }

        if (db > 85 && duration > 60) {
            message += " Temps d'exposition trop long.";
        }

        riskLevel.innerHTML = level;
        riskLevel.className = cssClass;
        advice.innerHTML = message;
    }

    // Attache les écouteurs d'événements
    riskSlider.addEventListener("input", evaluateRisk);
    durationSlider.addEventListener("input", evaluateRisk);

    // Évalue le risque une première fois
    evaluateRisk();
}

// Appel de l'initialisation uniquement quand le DOM est prêt
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initSecurite();
} else {
    document.addEventListener('DOMContentLoaded', initSecurite);
}
