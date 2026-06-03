const AudioContextClass =
window.AudioContext ||
window.webkitAudioContext;

const audioCtx =
new AudioContextClass();

let oscillator;
let gainNode;

const analyser =
audioCtx.createAnalyser();

analyser.fftSize = 2048;

const bufferLength =
analyser.frequencyBinCount;

const dataArray =
new Uint8Array(bufferLength);

const freqSlider =
document.getElementById(
"freqSlider"
);

const gainSlider =
document.getElementById(
"gainSlider"
);

const freqValue =
document.getElementById(
"freqValue"
);

const gainValue =
document.getElementById(
"gainValue"
);

const periodInfo =
document.getElementById(
"periodInfo"
);

const soundType =
document.getElementById(
"soundType"
);

const waveCanvas =
document.getElementById(
"waveCanvas"
);

const fftCanvas =
document.getElementById(
"fftCanvas"
);

const waveCtx =
waveCanvas.getContext("2d");

const fftCtx =
fftCanvas.getContext("2d");



function updateInfos(){

const f =
Number(freqSlider.value);

freqValue.innerHTML =
f + " Hz";

gainValue.innerHTML =
Math.round(
gainSlider.value*100
) + " %";

const T =
1000/f;

periodInfo.innerHTML =

"Période : "

+T.toFixed(2)

+" ms";

let type;

if(f<250)

type="Grave";

else if(f<2000)

type="Médium";

else

type="Aigu";

soundType.innerHTML=

"Type : "

+type;

}

updateInfos();



freqSlider.oninput=
updateInfos;

gainSlider.oninput=
updateInfos;



function startSound(){

stopSound();

oscillator =
audioCtx.createOscillator();

gainNode =
audioCtx.createGain();

oscillator.type =
"sine";

oscillator.frequency.value =
freqSlider.value;

gainNode.gain.value =
gainSlider.value;

oscillator.connect(
gainNode
);

gainNode.connect(
analyser
);

analyser.connect(
audioCtx.destination
);

oscillator.start();

drawWave();

drawFFT();

}



function stopSound(){

if(oscillator){

oscillator.stop();

oscillator.disconnect();

oscillator=null;

}

}



playBtn.onclick=()=>{

startSound();

};



stopBtn.onclick=()=>{

stopSound();

};



document
.querySelectorAll(
".presets button"
)

.forEach(btn=>{

btn.onclick=()=>{

freqSlider.value =

btn.dataset.f;

updateInfos();

startSound();

};

});



function drawWave(){

requestAnimationFrame(
drawWave
);

analyser
.getByteTimeDomainData(
dataArray
);

waveCtx.clearRect(

0,

0,

waveCanvas.width,

waveCanvas.height

);

waveCtx.beginPath();

const slice =

waveCanvas.width /

bufferLength;

let x=0;

for(

let i=0;

i<bufferLength;

i++

){

const v=

dataArray[i]/128;

const y=

v*

waveCanvas.height/2;

if(i===0)

waveCtx.moveTo(
x,
y
);

else

waveCtx.lineTo(
x,
y
);

x+=slice;

}

waveCtx.stroke();

}



function drawFFT(){

requestAnimationFrame(
drawFFT
);

analyser
.getByteFrequencyData(
dataArray
);

fftCtx.clearRect(

0,

0,

fftCanvas.width,

fftCanvas.height

);

const barWidth =

fftCanvas.width /

bufferLength;

for(

let i=0;

i<bufferLength;

i++

){

const value=

dataArray[i];

const h=

value;

fftCtx.fillRect(

i*barWidth,

fftCanvas.height-h,

barWidth,

h

);

}

}



function createWav(){

const sampleRate =
44100;

const duration =
2;

const length =

sampleRate*
duration;

const buffer =

new Float32Array(
length
);

const freq =

Number(
freqSlider.value
);

for(

let i=0;

i<length;

i++

){

buffer[i]=

Math.sin(

2*Math.PI*

freq*

i/

sampleRate

);

}

return encodeWAV(

buffer,

sampleRate

);

}



function encodeWAV(

samples,

sampleRate

){

const buffer=

new ArrayBuffer(

44+

samples.length*2

);

const view=

new DataView(
buffer
);

function write(

offset,

str

){

for(

let i=0;

i<str.length;

i++

){

view.setUint8(

offset+i,

str.charCodeAt(i)

);

}

}

write(0,"RIFF");

view.setUint32(
4,
36+samples.length*2,
true
);

write(8,"WAVE");

write(12,"fmt ");

view.setUint32(
16,
16,
true
);

view.setUint16(
20,
1,
true
);

view.setUint16(
22,
1,
true
);

view.setUint32(
24,
sampleRate,
true
);

view.setUint32(
28,
sampleRate*2,
true
);

view.setUint16(
32,
2,
true
);

view.setUint16(
34,
16,
true
);

write(36,"data");

view.setUint32(
40,
samples.length*2,
true
);

let offset=44;

for(

let i=0;

i<samples.length;

i++

){

const s=

Math.max(

-1,

Math.min(

1,

samples[i]

)

);

view.setInt16(

offset,

s*32767,

true

);

offset+=2;

}

return buffer;

}



exportBtn.onclick=()=>{

const wav =

createWav();

const blob =

new Blob(

[wav],

{

type:

"audio/wav"

}

);

const url =

URL.createObjectURL(
blob
);

const a =

document.createElement(
"a"
);

a.href=url;

a.download=

freqSlider.value+

"Hz.wav";

a.click();

URL.revokeObjectURL(
url
);

};
