function saveProgress(module){

localStorage.setItem(

"tpAudio",

module

);

}

function loadProgress(){

return localStorage.getItem(

"tpAudio"

);

}
