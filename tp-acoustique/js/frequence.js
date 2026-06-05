document.addEventListener("DOMContentLoaded", () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContextClass();

    let oscillator = null;
    let gainNode = null;
    let analyser = null;
    let dataArray = null;
    let animationId = null;
    let isPlaying = false;

    const freqSlider = document.getElementById("freq");
    const freqText = document.getElementById("freqText");
    const periodText = document.getElementById("periodText");
    const playBtn = document.getElementById("playBtn");
    const stopBtn = document.getElementById("stopBtn");
    const canvas = document.getElementById("oscillo");
    const info = document.getElementById("info");

    const ctx = canvas.getContext("2d");

    // ⚠️ sécurité DOM
    if (!freqSlider || !playBtn || !stopBtn) return;

    function updateDisplay() {
        const f = Number(freqSlider.value);
        freqText.textContent = `${f} Hz`;
        periodText.textContent = `Période : ${(1000 / f).toFixed(2)} ms`;

        if (oscillator) {
            oscillator.frequency.setValueAtTime(f, audioCtx.currentTime);
        }

        if (f < 80) {
            info.textContent = "Zone grave (basses fréquences)";
        } else if (f > 5000) {
            info.textContent = "Zone aiguë (hautes fréquences)";
        } else {
            info.textContent = "Zone médium";
        }
    }

    async function startSound() {
        if (isPlaying) return;

        await audioCtx.resume(); // 🔥 CRUCIAL

        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();
        analyser = audioCtx.createAnalyser();

        analyser.fftSize = 2048;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        oscillator.type = "sine";
        oscillator.frequency.value = Number(freqSlider.value);

        gainNode.gain.value = 0.3;

        oscillator.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(audioCtx.destination);

        oscillator.start();

        isPlaying = true;
        draw();
    }

    function stopSound() {
        if (!isPlaying) return;

        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();

        oscillator = null;
        isPlaying = false;

        cancelAnimationFrame(animationId);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function draw() {
        if (!isPlaying) return;

        animationId = requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.lineWidth = 2;

        const slice = canvas.width / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            const v = dataArray[i] / 128;
            const y = v * canvas.height / 2;

            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            x += slice;
        }

        ctx.stroke();
    }

    freqSlider.addEventListener("input", updateDisplay);
    playBtn.addEventListener("click", startSound);
    stopBtn.addEventListener("click", stopSound);

    updateDisplay();
});
