var currX = -150;
changeImage(0);
function changeImage(index) {
  var img = document.createElement("img");
  img.src = document.getElementById("sel" + index).src;
  img.className = "pic";
  console.log(index);
  src = document.getElementById("displayPic");
  src.replaceChild(img, src.childNodes[0])
}

function scrollDown() {
  if ( currX > -300) {
    currX-=50;
  }
  var div = document.getElementById("pictures")
  div.style.transform = `translatey(${currX}px)`;
  console.log(div.style.transform);
 }
function scrollUp() {
  if ( currX < 0) {
    currX+=50;
  }
  var div = document.getElementById("pictures")
  div.style.transform = `translatey(${currX}px)`;
  console.log(div.style.transform);
 }

document.getElementById("pictures-container").addEventListener("mouseover", function() {
  document.getElementById("upBtn").classList.remove('no-show-btn');
  document.getElementById("downBtn").classList.remove('no-show-btn'); 
  document.getElementById("upBtn").classList.add('show-btn');
  document.getElementById("downBtn").classList.add('show-btn');
})
document.getElementById("pictures-container").addEventListener("mouseleave", function() {
  document.getElementById("upBtn").classList.remove('show-btn');
  document.getElementById("downBtn").classList.remove('show-btn');               
  document.getElementById("upBtn").classList.add('no-show-btn');
  document.getElementById("downBtn").classList.add('no-show-btn');
})