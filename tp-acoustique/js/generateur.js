// Fonction d'initialisation du module Générateur
window.initGenerateur = function () {

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContextClass();

    let oscillator = null;
    let gainNode = null;

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;

    const bufferLength = analyser.frequencyBinCount;

    const timeArray = new Uint8Array(analyser.fftSize);
    const freqArray = new Uint8Array(bufferLength);

    // ===== DOM =====
    const freqSlider = document.getElementById("freqSlider");
    const gainSlider = document.getElementById("gainSlider");
    const freqValue = document.getElementById("freqValue");
    const gainValue = document.getElementById("gainValue");
    const periodInfo = document.getElementById("periodInfo");
    const soundType = document.getElementById("soundType");
    const waveCanvas = document.getElementById("waveCanvas");
    const fftCanvas = document.getElementById("fftCanvas");
    const playBtn = document.getElementById("playBtn");
    const stopBtn = document.getElementById("stopBtn");
    const exportBtn = document.getElementById("exportBtn");

    const analyseBloc = document.getElementById("analyseGenerateur");
    const explorationMessage = document.getElementById("explorationMessage");

    if (
        !freqSlider ||
        !gainSlider ||
        !freqValue ||
        !gainValue ||
        !periodInfo ||
        !soundType ||
        !waveCanvas ||
        !fftCanvas ||
        !playBtn ||
        !stopBtn ||
        !exportBtn
    ) {
        console.error("Éléments HTML manquants dans générateur.");
        return;
    }

    const waveCtx = waveCanvas.getContext("2d");
    const fftCtx = fftCanvas.getContext("2d");

    // ===== ANALYSE PEDAGOGIQUE =====

    let graveObserve = false;
    let mediumObserve = false;
    let aiguObserve = false;

    function updateProgressUI() {

        if (!explorationMessage) return;

        explorationMessage.textContent =
            `Exploration : Grave ${graveObserve ? "✓" : "✗"} | ` +
            `Médium ${mediumObserve ? "✓" : "✗"} | ` +
            `Aigu ${aiguObserve ? "✓" : "✗"}`;
    }

    function checkAnalyse() {

        if (!analyseBloc) return;

        if (graveObserve && mediumObserve && aiguObserve) {

            analyseBloc.classList.remove("hidden");
            analyseBloc.classList.add("visible");

            analyseBloc.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }

    // ===== TOOLTIP FFT =====

    const fftTooltip = document.createElement("div");

    fftTooltip.style.position = "fixed";
    fftTooltip.style.background = "rgba(0,0,0,0.85)";
    fftTooltip.style.color = "#fff";
    fftTooltip.style.padding = "6px 10px";
    fftTooltip.style.borderRadius = "6px";
    fftTooltip.style.fontSize = "13px";
    fftTooltip.style.pointerEvents = "none";
    fftTooltip.style.display = "none";
    fftTooltip.style.zIndex = "99999";

    document.body.appendChild(fftTooltip);

    fftCanvas.addEventListener("mousemove", (e) => {

        const rect = fftCanvas.getBoundingClientRect();

        const mouseX = e.clientX - rect.left;

        const displayedWidth = rect.width;

        const hoveredIndex = Math.floor(
            (mouseX / displayedWidth) * bufferLength
        );

        if (
            hoveredIndex < 0 ||
            hoveredIndex >= bufferLength
        ) {
            fftTooltip.style.display = "none";
            return;
        }

        // Recherche du pic le plus proche
        let bestIndex = hoveredIndex;
        let bestValue = freqArray[hoveredIndex];

        const searchRadius = 15;

        for (
            let i = Math.max(0, hoveredIndex - searchRadius);
            i < Math.min(bufferLength, hoveredIndex + searchRadius);
            i++
        ) {
            if (freqArray[i] > bestValue) {
                bestValue = freqArray[i];
                bestIndex = i;
            }
        }

        if (bestValue < 5) {
            fftTooltip.style.display = "none";
            return;
        }

        const frequency =
            bestIndex *
            audioCtx.sampleRate /
            analyser.fftSize;

        fftTooltip.innerHTML =
            "<strong>" +
            frequency.toFixed(1) +
            " Hz</strong>";

        fftTooltip.style.display = "block";

        fftTooltip.style.left =
            (e.clientX + 15) + "px";

        fftTooltip.style.top =
            (e.clientY + 15) + "px";
    });

    fftCanvas.addEventListener("mouseleave", () => {
        fftTooltip.style.display = "none";
    });

    // ===== INFOS =====

    function updateInfos() {

        const f = Number(freqSlider.value);

        freqValue.textContent = f + " Hz";

        gainValue.textContent =
            Math.round(Number(gainSlider.value) * 100) +
            " %";

        const T = 1000 / f;

        periodInfo.textContent =
            "Période : " +
            T.toFixed(2) +
            " ms";

        let type = "";

        if (f < 250) {
            type = "Grave";
        }
        else if (f < 2000) {
            type = "Médium";
        }
        else {
            type = "Aigu";
        }

        soundType.textContent =
            "Type : " + type;
    }

    updateInfos();
    updateProgressUI();

    // ===== CURSEURS =====

    freqSlider.addEventListener("input", () => {

        updateInfos();

        if (oscillator) {
            oscillator.frequency.value =
                Number(freqSlider.value);
        }
    });

    gainSlider.addEventListener("input", () => {

        updateInfos();

        if (gainNode) {
            gainNode.gain.value =
                Number(gainSlider.value);
        }
    });

    // ===== DEMARRAGE =====

    async function startSound() {

        if (audioCtx.state === "suspended") {
            await audioCtx.resume();
        }

        stopSound();

        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value =
            Number(freqSlider.value);

        gainNode.gain.value =
            Number(gainSlider.value);

        oscillator.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(audioCtx.destination);

        oscillator.start();

        const f = Number(freqSlider.value);

        if (f < 300) {
            graveObserve = true;
        }
        else if (f <= 1000) {
            mediumObserve = true;
        }
        else {
            aiguObserve = true;
        }

        updateProgressUI();
        checkAnalyse();
    }

    // ===== ARRET =====

    function stopSound() {

        if (oscillator) {

            try {
                oscillator.stop();
            }
            catch (e) {}

            oscillator.disconnect();

            oscillator = null;
        }
    }

    playBtn.onclick = startSound;
    stopBtn.onclick = stopSound;

    // ===== PRESETS =====

    document
        .querySelectorAll(".presets button")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                freqSlider.value = btn.dataset.f;

                updateInfos();

                startSound();
            });
        });

    // ===== OSCILLOGRAMME =====

    function drawWave() {

        requestAnimationFrame(drawWave);

        analyser.getByteTimeDomainData(timeArray);

        waveCtx.clearRect(
            0,
            0,
            waveCanvas.width,
            waveCanvas.height
        );

        waveCtx.beginPath();

        const sliceWidth =
            waveCanvas.width / timeArray.length;

        let x = 0;

        for (let i = 0; i < timeArray.length; i++) {

            const v = timeArray[i] / 128.0;

            const y =
                v * waveCanvas.height / 2;

            if (i === 0) {
                waveCtx.moveTo(x, y);
            }
            else {
                waveCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        waveCtx.stroke();
    }

    // ===== FFT =====

    function drawFFT() {

        requestAnimationFrame(drawFFT);

        analyser.getByteFrequencyData(freqArray);

        fftCtx.clearRect(
            0,
            0,
            fftCanvas.width,
            fftCanvas.height
        );

        const barWidth =
            fftCanvas.width / bufferLength;

        for (let i = 0; i < bufferLength; i++) {

            const value = freqArray[i];

            const height =
                (value / 255) *
                fftCanvas.height;

            fftCtx.fillRect(
                i * barWidth,
                fftCanvas.height - height,
                Math.max(barWidth, 1),
                height
            );
        }
    }

    drawWave();
    drawFFT();

    // ===== EXPORT WAV =====

    function createWav() {

        const sampleRate = 44100;
        const duration = 2;
        const length = sampleRate * duration;

        const buffer =
            new Float32Array(length);

        const freq =
            Number(freqSlider.value);

        for (let i = 0; i < length; i++) {

            buffer[i] =
                Math.sin(
                    2 *
                    Math.PI *
                    freq *
                    i /
                    sampleRate
                );
        }

        return encodeWAV(
            buffer,
            sampleRate
        );
    }

    function encodeWAV(samples, sampleRate) {

        const buffer =
            new ArrayBuffer(
                44 + samples.length * 2
            );

        const view =
            new DataView(buffer);

        function write(offset, str) {

            for (
                let i = 0;
                i < str.length;
                i++
            ) {
                view.setUint8(
                    offset + i,
                    str.charCodeAt(i)
                );
            }
        }

        write(0, "RIFF");
        view.setUint32(
            4,
            36 + samples.length * 2,
            true
        );

        write(8, "WAVE");
        write(12, "fmt ");

        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);

        view.setUint32(
            24,
            sampleRate,
            true
        );

        view.setUint32(
            28,
            sampleRate * 2,
            true
        );

        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);

        write(36, "data");

        view.setUint32(
            40,
            samples.length * 2,
            true
        );

        let offset = 44;

        for (let i = 0; i < samples.length; i++) {

            const s =
                Math.max(
                    -1,
                    Math.min(1, samples[i])
                );

            view.setInt16(
                offset,
                s * 32767,
                true
            );

            offset += 2;
        }

        return buffer;
    }

    exportBtn.onclick = () => {

        const wav = createWav();

        const blob = new Blob(
            [wav],
            { type: "audio/wav" }
        );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;
        a.download =
            freqSlider.value + "Hz.wav";

        a.click();

        URL.revokeObjectURL(url);
    };
};
