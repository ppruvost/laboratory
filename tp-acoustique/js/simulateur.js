db.oninput=()=>{

const value=

Number(db.value);

dbValue.innerHTML=

value+" dB";

if(value>85)

danger.innerHTML=

"⚠ danger auditif";

else

danger.innerHTML="";

}
