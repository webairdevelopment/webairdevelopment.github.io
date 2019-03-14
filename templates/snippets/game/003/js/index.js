var mouseisdown = false;
var dotFadeAnim = "animation: dotfade 3s infinite;";

var box = document.getElementById("box");

box.addEventListener("mousedown", function(e) {
  e.preventDefault();
  var target = e.target || e.srcElement;
  mouseisdown = true;
  if (target.tagName == "I") {
    target.style.cssText = dotFadeAnim;
  }  
});

document.addEventListener("mouseup", function(e) {
  var target = e.target || e.srcElement;
  mouseisdown = false;
});

box.onmouseover = function(e) {
  var target = e.target || e.srcElement;
  if (target.tagName == "I" && mouseisdown) {
    target.style.cssText = dotFadeAnim;
  }
}

document.getElementById("reset").addEventListener("click", function(e) {
  var cells = document.getElementsByTagName("I");
  for (var i = 0; i < cells.length; i++) {
    cells[i].style.animation = "none";
  }
})