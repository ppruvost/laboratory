async function initMicro(){

const stream=

await navigator
.mediaDevices
.getUserMedia({

audio:true

});

const audioCtx=

new AudioContext();

const source=

audioCtx
.createMediaStreamSource(
stream
);

const analyser=

audioCtx
.createAnalyser();

source.connect(
analyser
);

const data=

new Uint8Array(
analyser.frequencyBinCount
);

function update(){

analyser
.getByteFrequencyData(
data
);

const avg=

data.reduce(

(a,b)=>a+b

)/data.length;

const db=

20*Math.log10(
avg+1
);

document
.getElementById(
"micValue"
)

.innerHTML=

db.toFixed(1)

+" dB";

requestAnimationFrame(
update
);

}

update();

}

initMicro();
