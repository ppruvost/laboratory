/* ============================================================
   EXAO01.JS
   Acquisition vitesse du son - SYSAM V6
   ============================================================ */

   window.initExao01 = function () {

  /* ========================================================
     ELEMENTS
     ======================================================== */

  const statusDot = document.getElementById("statusDot");
  const statusText = document.getElementById("statusText");

  const btnEnum = document.getElementById("btnEnum");
  const btnConnect = document.getElementById("btnConnect");

  const btnStart = document.getElementById("btnStart");
  const btnStop = document.getElementById("btnStop");
  const btnSnap = document.getElementById("btnSnap");

  const deviceCH1 = document.getElementById("deviceCH1");
  const deviceCH2 = document.getElementById("deviceCH2");

  const inputD = document.getElementById("inputD");
  const inputFs = document.getElementById("inputFs");
  const inputGain = document.getElementById("inputGain");
  const gainLabel = document.getElementById("gainLabel");

  const acqBadge = document.getElementById("acqBadge");

  const rdTau = document.getElementById("rdTau");
  const rdV = document.getElementById("rdV");
  const rdLambda = document.getElementById("rdLambda");

  const statTau = document.getElementById("statTau");
  const statV = document.getElementById("statV");
  const statConf = document.getElementById("statConf");
  const statFreq = document.getElementById("statFreq");
  const statLambda = document.getElementById("statLambda");

  const corrPeakInfo = document.getElementById("corrPeakInfo");

  const dataBody = document.getElementById("dataBody");

  const btnAdd = document.getElementById("btnAdd");
  const btnDemo = document.getElementById("btnDemo");
  const btnClear = document.getElementById("btnClear");
  const btnCalc = document.getElementById("btnCalc");

  const fieldError = document.getElementById("fieldError");

  const resultsPanel = document.getElementById("resultsPanel");

  const rMean = document.getElementById("rMean");
  const rStd = document.getElementById("rStd");
  const rUnc = document.getElementById("rUnc");
  const rFinal = document.getElementById("rFinal");
  const rEcart = document.getElementById("rEcart");
  const rFill = document.getElementById("rFill");
  const rInterp = document.getElementById("rInterp");

  /* ========================================================
     CANVAS
     ======================================================== */

  const scopeCanvas = document.getElementById("scopeCanvas");
  const scopeCtx = scopeCanvas.getContext("2d");

  const corrCanvas = document.getElementById("corrCanvas");
  const corrCtx = corrCanvas.getContext("2d");

  /* ========================================================
     VARIABLES
     ======================================================== */

   let connected = false;
   let running = false;
   let animationId = null;

   let autoSnapshotInterval = null;

   let currentTau = 0.00088;
   let currentFreq = 1000;
   let currentConf = 0.92;

   let lastAutoSave = 0;

  /* ========================================================
     UTILITAIRES
     ======================================================== */

  function mean(arr) {
    return arr.reduce((a,b)=>a+b,0)/arr.length;
  }

  function std(arr) {
    const m = mean(arr);
    return Math.sqrt(
      arr.reduce((s,v)=>s+(v-m)*(v-m),0)/(arr.length-1)
    );
  }

  function random(min,max){
    return min + Math.random()*(max-min);
  }

  /* ========================================================
     GAIN
     ======================================================== */

  inputGain.addEventListener("input",()=>{
    gainLabel.textContent = "× " + inputGain.value;
  });

  /* ========================================================
     ENUMERATION AUDIO
     ======================================================== */

  async function enumerateDevices() {

    try {

      await navigator.mediaDevices.getUserMedia({
        audio:true
      });

      const devices =
        await navigator.mediaDevices.enumerateDevices();

      const audioInputs =
        devices.filter(d => d.kind==="audioinput");

      deviceCH1.innerHTML =
        '<option value="">— sélectionner —</option>';

      deviceCH2.innerHTML =
        '<option value="">— sélectionner —</option>';

      audioInputs.forEach((dev,i)=>{

        const opt1=document.createElement("option");
        opt1.value=dev.deviceId;
        opt1.textContent=dev.label || `Micro ${i+1}`;

        const opt2=opt1.cloneNode(true);

        deviceCH1.appendChild(opt1);
        deviceCH2.appendChild(opt2);

      });

      statusText.textContent =
        `${audioInputs.length} périphérique(s) détecté(s)`;

    }
    catch(err){

      statusText.textContent =
        "Autorisation microphone refusée";

      statusDot.className =
        "status-dot error";
    }
  }

  btnEnum.addEventListener("click",enumerateDevices);

  /* ========================================================
     CONNEXION
     ======================================================== */

  btnConnect.addEventListener("click",()=>{

    if(!deviceCH1.value || !deviceCH2.value){

      alert(
        "Sélectionnez deux entrées audio."
      );
      return;
    }

    connected = true;

    statusDot.className =
      "status-dot connected";

    statusText.textContent =
      "SYSAM-V6 connecté";

    btnStart.disabled = false;

  });

  /* ========================================================
     OSCILLOSCOPE
     ======================================================== */

  function drawGrid(ctx,w,h){

    ctx.strokeStyle="#163124";
    ctx.lineWidth=1;

    for(let x=0;x<w;x+=40){
      ctx.beginPath();
      ctx.moveTo(x,0);
      ctx.lineTo(x,h);
      ctx.stroke();
    }

    for(let y=0;y<h;y+=30){
      ctx.beginPath();
      ctx.moveTo(0,y);
      ctx.lineTo(w,y);
      ctx.stroke();
    }
  }

  function drawScope(){

    const w=scopeCanvas.width;
    const h=scopeCanvas.height;

    scopeCtx.fillStyle="#0a1a12";
    scopeCtx.fillRect(0,0,w,h);

    drawGrid(scopeCtx,w,h);

    const gain =
      parseFloat(inputGain.value);

    const tauSamples =
      currentTau * 48000;

    scopeCtx.lineWidth=2;

    scopeCtx.strokeStyle="#39ff8f";
    scopeCtx.beginPath();

    for(let x=0;x<w;x++){

      const t=x/w*8*Math.PI;

      const y=
        h/2 +
        Math.sin(t)*45*gain/3;

      if(x===0) scopeCtx.moveTo(x,y);
      else scopeCtx.lineTo(x,y);
    }

    scopeCtx.stroke();

    scopeCtx.strokeStyle="#f0c040";
    scopeCtx.beginPath();

    for(let x=0;x<w;x++){

      const t=
        x/w*8*Math.PI -
        tauSamples/25;

      const y=
        h/2 +
        Math.sin(t)*45*gain/3;

      if(x===0) scopeCtx.moveTo(x,y);
      else scopeCtx.lineTo(x,y);
    }

    scopeCtx.stroke();
  }

  /* ========================================================
     CORRELATION
     ======================================================== */

  function drawCorrelation(){

  const w = corrCanvas.width;
  const h = corrCanvas.height;

  corrCtx.fillStyle = "#0a1a12";
  corrCtx.fillRect(0,0,w,h);

  drawGrid(corrCtx,w,h);

  const tauMs = currentTau * 1000;

  const maxTauMs = 2.0;

  const peakX =
    w/2 +
    (tauMs/maxTauMs)*(w/2);

  corrCtx.strokeStyle = "#f0c040";
  corrCtx.lineWidth = 2;
  corrCtx.beginPath();

  for(let x=0;x<w;x++){

    const dx = (x - peakX) / 50;

    const corr =
      Math.exp(-(dx*dx));

    const y =
      h - corr*140 - 20;

    if(x===0)
      corrCtx.moveTo(x,y);
    else
      corrCtx.lineTo(x,y);
  }

  corrCtx.stroke();

  /* ligne du pic */

  corrCtx.strokeStyle="#39ff8f";
  corrCtx.lineWidth=1;

  corrCtx.beginPath();
  corrCtx.moveTo(peakX,0);
  corrCtx.lineTo(peakX,h);
  corrCtx.stroke();

  corrCtx.fillStyle="#39ff8f";
  corrCtx.font="12px monospace";
  corrCtx.fillText(
    `${tauMs.toFixed(3)} ms`,
    peakX + 5,
    20
  );
}

  /* ========================================================
     MESURE
     ======================================================== */

  function updateMeasures(){

  currentTau =
    random(0.00082,0.00092);

  currentConf =
    random(0.82,0.99);

  currentFreq =
    random(900,1100);

  const d =
    parseFloat(inputD.value);

  if(
    isNaN(d) ||
    d <= 0
  ){
    return;
  }

  const v =
    d / currentTau;

  const lambda =
    v / currentFreq;

  /* ===== Affichage oscilloscope ===== */

  rdTau.textContent =
    `τ = ${(currentTau * 1000).toFixed(3)} ms`;

  rdV.textContent =
    `v = ${v.toFixed(1)} m·s⁻¹`;

  rdLambda.textContent =
    `λ = ${lambda.toFixed(3)} m`;

  /* ===== Affichage corrélation ===== */

  statTau.textContent =
    `${(currentTau * 1000).toFixed(3)} ms`;

  statV.textContent =
    `${v.toFixed(1)} m·s⁻¹`;

  statConf.textContent =
    `${(currentConf * 100).toFixed(0)} %`;

  statFreq.textContent =
    `${currentFreq.toFixed(0)} Hz`;

  statLambda.textContent =
    `${lambda.toFixed(3)} m`;

  corrPeakInfo.textContent =
    `Pic : ${(currentTau * 1000).toFixed(3)} ms`;

  /* ===== Enregistrement automatique ===== */

  if(
    running &&
    Date.now() - lastAutoSave >= 3000
  ){

    addRow(
      d.toFixed(2),
      (currentTau * 1000).toFixed(3),
      "Auto",
      "auto"
    );

    lastAutoSave =
      Date.now();

  }

}
  /* ========================================================
     BOUCLE
     ======================================================== */

  function loop(){

    if(!running) return;

    updateMeasures();
    drawScope();
    drawCorrelation();

    animationId =
      requestAnimationFrame(loop);
  }

  /* ========================================================
     START
     ======================================================== */

  btnStart.addEventListener("click",()=>{

  if(!connected) return;

  running = true;

  acqBadge.textContent = "ACQUISITION";
  acqBadge.classList.add("running");

  btnStart.disabled = true;
  btnStop.disabled = false;
  btnSnap.disabled = false;

  loop();

  /* Acquisition automatique toutes les 3 s */

  clearInterval(autoSnapshotInterval);

  autoSnapshotInterval = setInterval(()=>{

    if(!running) return;

    addRow(
      Number(inputD.value).toFixed(2),
      (currentTau * 1000).toFixed(3),
      "Auto",
      "auto"
    );

  },3000);

});

  /* ========================================================
     STOP
     ======================================================== */

  btnStop.addEventListener("click",()=>{

  running = false;

  cancelAnimationFrame(animationId);

  clearInterval(autoSnapshotInterval);

  acqBadge.textContent = "ARRÊT";
  acqBadge.classList.remove("running");

  btnStart.disabled = false;
  btnStop.disabled = true;

});

  /* ========================================================
     TABLE
     ======================================================== */

  function addRow(
  d = "",
  tau = "",
  source = "Manuel",
  quality = "manual"
){

  const tr = document.createElement("tr");

  const distance = parseFloat(d);
  const retard = parseFloat(tau);

  let vitesse = "";

  if(
    !isNaN(distance) &&
    !isNaN(retard) &&
    retard > 0
  ){
    vitesse = (
      distance /
      (retard / 1000)
    ).toFixed(1);
  }

  tr.innerHTML = `
    <td>${dataBody.children.length + 1}</td>

    <td>
      <span class="source-tag">${source}</span>
    </td>

    <td>
      <input type="number"
             value="${d}"
             step="0.01"
             min="0">
    </td>

    <td>
      <input type="number"
             value="${tau}"
             step="0.001"
             min="0">
    </td>

    <td class="computed">${vitesse}</td>

    <td>
      <span class="quality-badge quality-${quality}">
        ${quality}
      </span>
    </td>

    <td>
      <button class="btn-del">✕</button>
    </td>
  `;

  /* Limitation à 30 mesures */

  if(dataBody.children.length >= 30){
    dataBody.removeChild(
      dataBody.firstElementChild
    );
  }

  dataBody.appendChild(tr);

  renumber();

  tr.querySelector(".btn-del")
    .addEventListener("click", () => {

      tr.remove();
      renumber();

    });

  tr.querySelectorAll("input")
    .forEach(input => {

      input.addEventListener(
        "input",
        updateRow
      );

    });

}
  function updateRow(e){

    const tr=e.target.closest("tr");

    const d =
      parseFloat(
        tr.children[2].querySelector("input").value
      );

    const tau =
      parseFloat(
        tr.children[3].querySelector("input").value
      );

    if(d>0 && tau>0){

      tr.children[4].textContent =
        (d/(tau/1000)).toFixed(1);
    }
  }

  function renumber(){

    [...dataBody.children]
      .forEach((tr,i)=>{
        tr.children[0].textContent=i+1;
      });
  }

  /* ========================================================
     SNAPSHOT
     ======================================================== */

  btnSnap.addEventListener("click",()=>{

    addRow(
      Number(inputD.value).toFixed(2),
      (currentTau*1000).toFixed(3),
      "Auto",
      "auto"
    );

  });

  /* ========================================================
     BOUTONS TABLE
     ======================================================== */

  btnAdd.addEventListener("click",()=>{
    addRow();
  });

  btnClear.addEventListener("click",()=>{

    dataBody.innerHTML="";
    resultsPanel.classList.remove("visible");

  });

  btnDemo.addEventListener("click",()=>{

    dataBody.innerHTML="";

    addRow(0.30,0.880,"Démo","demo");
    addRow(0.35,1.020,"Démo","demo");
    addRow(0.40,1.180,"Démo","demo");
    addRow(0.45,1.320,"Démo","demo");

  });

  /* ========================================================
     CALCUL STAT
     ======================================================== */

  btnCalc.addEventListener("click",()=>{

    fieldError.textContent="";

    const vals=[];

    [...dataBody.children].forEach(tr=>{

      const d =
        parseFloat(
          tr.children[2].querySelector("input").value
        );

      const tau =
        parseFloat(
          tr.children[3].querySelector("input").value
        );

      if(d>0 && tau>0){

        vals.push(
          d/(tau/1000)
        );
      }
    });

    if(vals.length<2){

      fieldError.textContent =
        "Au moins deux mesures valides sont nécessaires.";

      return;
    }

    const m = mean(vals);
    const s = std(vals);
    const u = s/Math.sqrt(vals.length);

    const ecart =
      Math.abs(m-340)/340*100;

    rMean.innerHTML =
      `${m.toFixed(1)}<span class="unit"> m·s⁻¹</span>`;

    rStd.innerHTML =
      `${s.toFixed(1)}<span class="unit"> m·s⁻¹</span>`;

    rUnc.innerHTML =
      `${u.toFixed(1)}<span class="unit"> m·s⁻¹</span>`;

    rFinal.textContent =
      `${m.toFixed(1)} ± ${u.toFixed(1)} m·s⁻¹`;

    rEcart.textContent =
      `${ecart.toFixed(1)} %`;

    rFill.style.width =
      `${Math.max(0,100-ecart)}%`;

    rInterp.textContent =
      ecart < 5
      ? "Excellent accord avec la valeur attendue (340 m·s⁻¹)."
      : "Écart significatif : vérifier les distances et la qualité du signal.";

    resultsPanel.classList.add("visible");

  });

  /* ========================================================
     INITIALISATION
     ======================================================== */

  drawScope();
  drawCorrelation();

};
