// Audio Player
var audio;

function initAudioPlayer(){
       audio = new Audio();
       audio.src="http://144.217.195.24:9035/;stream/1";
       audio.loop = true;
       audio.play(); 
}
window.addEventListener("load", initAudioPlayer);