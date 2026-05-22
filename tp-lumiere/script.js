// ======================================
// NAVIGATION
// ======================================

const navButtons = document.querySelectorAll("nav button");
const sections = document.querySelectorAll(".section");

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        sections.forEach(section => {
            section.classList.remove("active");
        });

        document
            .getElementById(button.dataset.target)
            .classList.add("active");

    });

});

// ======================================
// RGB TO HEX
// ======================================

function rgbToHex(r, g, b) {

    return "#" + [r, g, b]
        .map(x => x.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();

}

// ======================================
// RESPONSIVE CANVAS
// ======================================

function resizeCanvas(canvas, ratio = 0.7) {

    const container = canvas.parentElement;

    const width = Math.min(
        container.clientWidth * ratio,
        500
    );

    canvas.width = width;
    canvas.height = width * 0.7;

}

// ======================================
// RVB
// ======================================

const red = document.getElementById("red");
const green = document.getElementById("green");
const blue = document.getElementById("blue");

const rgbCanvas = document.getElementById("rgbCanvas");
const rgbCtx = rgbCanvas.getContext("2d");

function updateRGB() {

    resizeCanvas(rgbCanvas);

    const w = rgbCanvas.width;
    const h = rgbCanvas.height;

    const r = parseInt(red.value);
    const g = parseInt(green.value);
    const b = parseInt(blue.value);

    document.getElementById("rVal").textContent = r;
    document.getElementById("gVal").textContent = g;
    document.getElementById("bVal").textContent = b;

    const color = `rgb(${r},${g},${b})`;

    document.getElementById("rgbPreview")
        .style.background = color;

    document.getElementById("rgbResult")
        .innerHTML = `
        Couleur : ${color}<br>
        HEX : ${rgbToHex(r, g, b)}
    `;

    rgbCtx.clearRect(0, 0, w, h);

    rgbCtx.fillStyle = "black";
    rgbCtx.fillRect(0, 0, w, h);

    rgbCtx.globalCompositeOperation = "lighter";

    const radius = w * 0.18;

    rgbCtx.fillStyle = `rgba(${r},0,0,0.8)`;
    rgbCtx.beginPath();
    rgbCtx.arc(w * 0.38, h * 0.62, radius, 0, Math.PI * 2);
    rgbCtx.fill();

    rgbCtx.fillStyle = `rgba(0,${g},0,0.8)`;
    rgbCtx.beginPath();
    rgbCtx.arc(w * 0.62, h * 0.62, radius, 0, Math.PI * 2);
    rgbCtx.fill();

    rgbCtx.fillStyle = `rgba(0,0,${b},0.8)`;
    rgbCtx.beginPath();
    rgbCtx.arc(w * 0.50, h * 0.35, radius, 0, Math.PI * 2);
    rgbCtx.fill();

    rgbCtx.globalCompositeOperation = "source-over";

}

[red, green, blue].forEach(el => {
    el.addEventListener("input", updateRGB);
});

// ======================================
// CMJ
// ======================================

const cyan = document.getElementById("cyan");
const magenta = document.getElementById("magenta");
const yellow = document.getElementById("yellow");

const cmyCanvas = document.getElementById("cmyCanvas");
const cmyCtx = cmyCanvas.getContext("2d");

function updateCMY() {

    resizeCanvas(cmyCanvas);

    const w = cmyCanvas.width;
    const h = cmyCanvas.height;

    const c = parseInt(cyan.value);
    const m = parseInt(magenta.value);
    const y = parseInt(yellow.value);

    document.getElementById("cVal").textContent = c + "%";
    document.getElementById("mVal").textContent = m + "%";
    document.getElementById("yVal").textContent = y + "%";

    const r = Math.round(255 * (1 - c / 100));
    const g = Math.round(255 * (1 - m / 100));
    const b = Math.round(255 * (1 - y / 100));

    const color = `rgb(${r},${g},${b})`;

    document.getElementById("cmyPreview")
        .style.background = color;

    document.getElementById("cmyResult")
        .innerHTML = `
        Couleur : ${color}<br>
        HEX : ${rgbToHex(r, g, b)}
    `;

    cmyCtx.clearRect(0, 0, w, h);

    cmyCtx.fillStyle = "white";
    cmyCtx.fillRect(0, 0, w, h);

    cmyCtx.fillStyle = `rgba(0,255,255,${c / 100})`;
    cmyCtx.fillRect(w * 0.10, h * 0.15, w * 0.35, h * 0.6);

    cmyCtx.fillStyle = `rgba(255,0,255,${m / 100})`;
    cmyCtx.fillRect(w * 0.32, h * 0.15, w * 0.35, h * 0.6);

    cmyCtx.fillStyle = `rgba(255,255,0,${y / 100})`;
    cmyCtx.fillRect(w * 0.54, h * 0.15, w * 0.35, h * 0.6);

    cmyCtx.fillStyle = color;
    cmyCtx.fillRect(w * 0.40, h * 0.35, w * 0.20, h * 0.18);

}

[cyan, magenta, yellow].forEach(el => {
    el.addEventListener("input", updateCMY);
});

// ======================================
// FILTRES
// ======================================

const filterCanvas = document.getElementById("filterCanvas");
const filterCtx = filterCanvas.getContext("2d");

function applyFilter() {

    resizeCanvas(filterCanvas);

    const w = filterCanvas.width;
    const h = filterCanvas.height;

    const light =
        document.getElementById("lightSelect").value;

    const filter =
        document.getElementById("filterSelect").value;

    const allowed = {

        red: ["red", "magenta", "yellow"],
        green: ["green", "cyan", "yellow"],
        blue: ["blue", "cyan", "magenta"],
        white: ["red", "green", "blue", "cyan", "magenta", "yellow"]

    };

    const pass =
        allowed[light].includes(filter);

    filterCtx.clearRect(0, 0, w, h);

    filterCtx.fillStyle = light;
    filterCtx.fillRect(0, 0, w * 0.4, h);

    filterCtx.fillStyle = filter;
    filterCtx.fillRect(w * 0.4, 0, w * 0.2, h);

    filterCtx.fillStyle = pass ? light : "black";
    filterCtx.fillRect(w * 0.6, 0, w * 0.4, h);

    document.getElementById("filterResult")
        .innerHTML = pass
        ? "✅ La lumière traverse"
        : "❌ La lumière est absorbée";

}

document
    .getElementById("lightSelect")
    .addEventListener("change", applyFilter);

document
    .getElementById("filterSelect")
    .addEventListener("change", applyFilter);

// ======================================
// CONES
// ======================================

const waveSlider =
    document.getElementById("waveSlider");

waveSlider.addEventListener("input", () => {

    const wavelength =
        parseInt(waveSlider.value);

    document.getElementById("waveValue")
        .textContent = wavelength + " nm";

    const s =
        Math.max(0, 100 - Math.abs(wavelength - 420));

    const m =
        Math.max(0, 100 - Math.abs(wavelength - 530));

    const l =
        Math.max(0, 100 - Math.abs(wavelength - 565));

    document.getElementById("sCone")
        .style.width = s + "%";

    document.getElementById("mCone")
        .style.width = m + "%";

    document.getElementById("lCone")
        .style.width = l + "%";

});

// ======================================
// TEST ISHIHARA RESPONSIVE
// ======================================

const ishCanvas =
    document.getElementById("ishiharaCanvas");

const ishCtx =
    ishCanvas.getContext("2d");

const visionMode =
    document.getElementById("visionMode");

const answerInput =
    document.getElementById("answerInput");

const resultBox =
    document.getElementById("resultBox");

let canvasSize;
let center;
let bigRadius;

const plates = [

    {
        number: "12",
        fg: "#ff7f50",
        bg: "#6bbf59"
    },

    {
        number: "8",
        fg: "#ff8c42",
        bg: "#4caf50"
    },

    {
        number: "29",
        fg: "#f78154",
        bg: "#5cae5c"
    },

    {
        number: "74",
        fg: "#f79f79",
        bg: "#60b060"
    },

    {
        number: "5",
        fg: "#f76f6f",
        bg: "#58a858"
    }

];

let currentPlate = null;

// ======================================
// RESIZE ISHIHARA
// ======================================

function resizeIshihara() {

    canvasSize =
        Math.min(window.innerWidth * 0.65, 420);

    ishCanvas.width = canvasSize;
    ishCanvas.height = canvasSize;

    center = canvasSize / 2;

    bigRadius = canvasSize * 0.42;

    generatePlate();

}

// ======================================
// GENERATE PLATE
// ======================================

function generatePlate() {

    ishCtx.clearRect(
        0,
        0,
        canvasSize,
        canvasSize
    );

    ishCtx.fillStyle = "#222";

    ishCtx.beginPath();

    ishCtx.arc(
        center,
        center,
        bigRadius,
        0,
        Math.PI * 2
    );

    ishCtx.fill();

    currentPlate =
        plates[
            Math.floor(
                Math.random() * plates.length
            )
        ];

    drawDots(currentPlate);

}

// ======================================
// DRAW DOTS
// ======================================

function drawDots(plate) {

    const mode = visionMode.value;

    const dots =
        Math.floor(canvasSize * 5);

    for (let i = 0; i < dots; i++) {

        let x =
            Math.random() * canvasSize;

        let y =
            Math.random() * canvasSize;

        let dx = x - center;
        let dy = y - center;

        if (
            dx * dx + dy * dy >
            bigRadius * bigRadius
        ) {
            continue;
        }

        let dotRadius =
            canvasSize * 0.004 +
            Math.random() *
            canvasSize * 0.008;

        let inside =
            isInsideNumber(
                x,
                y,
                plate.number
            );

        let color =
            inside ? plate.fg : plate.bg;

        color =
            applyColorBlindness(
                color,
                mode
            );

        ishCtx.fillStyle = color;

        ishCtx.beginPath();

        ishCtx.arc(
            x,
            y,
            dotRadius,
            0,
            Math.PI * 2
        );

        ishCtx.fill();

    }

}

// ======================================
// INSIDE NUMBER
// ======================================

function isInsideNumber(x, y, number) {

    const temp =
        document.createElement("canvas");

    temp.width = canvasSize;
    temp.height = canvasSize;

    const tctx =
        temp.getContext("2d");

    const fontSize =
        canvasSize * 0.28;

    tctx.font =
        `bold ${fontSize}px Arial`;

    const textWidth =
        tctx.measureText(number).width;

    const tx =
        center - textWidth / 2;

    const ty =
        center + canvasSize * 0.1;

    tctx.fillStyle = "white";

    tctx.fillText(
        number,
        tx,
        ty
    );

    const pixel =
        tctx.getImageData(
            x,
            y,
            1,
            1
        ).data;

    return pixel[3] > 0;

}

// ======================================
// COLOR BLINDNESS
// ======================================

function applyColorBlindness(hex, mode) {

    let rgb = hexToRgb(hex);

    let r = rgb.r;
    let g = rgb.g;
    let b = rgb.b;

    switch (mode) {

        case "protanopia":

            r = 0.567 * r + 0.433 * g;
            g = 0.558 * r + 0.442 * g;

            break;

        case "deuteranopia":

            r = 0.625 * r + 0.375 * g;
            g = 0.7 * r + 0.3 * g;

            break;

        case "tritanopia":

            g = 0.95 * g + 0.05 * b;
            b = 0.433 * g + 0.567 * b;

            break;

    }

    return `rgb(${r},${g},${b})`;

}

// ======================================
// HEX TO RGB
// ======================================

function hexToRgb(hex) {

    hex = hex.replace("#", "");

    let bigint =
        parseInt(hex, 16);

    return {

        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255

    };

}

// ======================================
// ISHIHARA EVENTS
// ======================================

document
    .getElementById("checkAnswer")
    .addEventListener("click", () => {

        const userAnswer =
            answerInput.value.trim();

        if (
            userAnswer === currentPlate.number
        ) {

            resultBox.innerHTML =
                "<span class='good'>✔ Bonne réponse</span>";

        } else {

            resultBox.innerHTML = `
            <span class='bad'>
            ❌ Réponse :
            ${currentPlate.number}
            </span>
        `;

        }

    });

document
    .getElementById("newPlateBtn")
    .addEventListener("click", () => {

        answerInput.value = "";
        resultBox.innerHTML = "";

        generatePlate();

    });

visionMode.addEventListener(
    "change",
    generatePlate
);

window.addEventListener(
    "resize",
    () => {

        updateRGB();
        updateCMY();
        applyFilter();
        resizeIshihara();

    }
);

// ======================================
// QUIZ
// ======================================

function correctQuiz() {

    let score = 0;

    if (
        document.querySelector(
            'input[name="q1"]:checked'
        )?.value === "true"
    ) {
        score++;
    }

    if (
        document.querySelector(
            'input[name="q2"]:checked'
        )?.value === "true"
    ) {
        score++;
    }

    document.getElementById("score")
        .innerHTML =
        `<h3>Score : ${score}/2</h3>`;

}

// ======================================
// INIT
// ======================================

updateRGB();
updateCMY();
applyFilter();
resizeIshihara();
