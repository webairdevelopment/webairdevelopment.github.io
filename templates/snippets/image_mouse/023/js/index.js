const shareBtn = document.getElementById("share-btn");
const main = document.getElementById("main");
const toggleClass = "share-open";
const activeClass = "active";

shareBtn.onclick = function() {
  main.classList.toggle(toggleClass);
  this.classList.toggle(activeClass);
};

// Animate on load
setTimeout(function() {
  main.classList.add(toggleClass);
  shareBtn.classList.add(activeClass);
}, 1000);