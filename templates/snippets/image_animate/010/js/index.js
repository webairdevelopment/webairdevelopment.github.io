var width = 0;
var tempo = 20;
var carga = document.querySelector('.carga');
var barra = setInterval(function(){
    width = width + 1;
    carga.style.width = width + '%';
    if (width === 100){ 
        clearInterval(barra);
        width = 0;
    }
},tempo);
