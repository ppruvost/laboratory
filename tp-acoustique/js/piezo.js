function piezoEmit(){

const signal=

Math.random()*5;

document
.getElementById(
"piezoOut"
)

.innerHTML=

"Tension : "

+

signal.toFixed(2)

+

" V";

}
