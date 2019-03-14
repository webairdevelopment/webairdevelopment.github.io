var root = document.documentElement;

root.classList.remove("nojs");

var pausePlayButton = document.getElementById("pause-snow")
var pausePlayLabel = pausePlayButton.querySelector(".pause-play");
pausePlayButton.addEventListener("click", pauseSnow);
function pauseSnow() {
  var paused = root.classList.toggle("snowing-paused");
}

requestAnimationFrame(run);
function run() {
  root.classList.add("night");
  root.classList.add("snowing");
}