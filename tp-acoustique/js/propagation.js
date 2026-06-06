function attenuation(dMeters) {
    return 94 - 20 * Math.log10(dMeters);
}

function update() {
    const slider = document.getElementById("distance");

    const dCm = parseInt(slider.value);
    const dM = dCm / 100;

    const L = attenuation(dM);

    document.getElementById("d-value").textContent = dCm;
    document.getElementById("d-m").textContent = dM.toFixed(2);
    document.getElementById("l-value").textContent = L.toFixed(1);
}

function buildTable() {
    const tbody = document.getElementById("table-body");
    tbody.innerHTML = "";

    const distances = [5,10,15,20,25,30,35,40,45,50];

    distances.forEach(dCm => {
        const dM = dCm / 100;
        const L = attenuation(dM);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${dCm}</td>
            <td>${L.toFixed(1)}</td>
        `;

        tbody.appendChild(row);
    });
}

function initPropagation() {
    const slider = document.getElementById("distance");

    slider.addEventListener("input", update);

    update();
    buildTable();
}

// auto-start (important pour chargement dynamique via fetch)
document.addEventListener("DOMContentLoaded", initPropagation);
initPropagation();
