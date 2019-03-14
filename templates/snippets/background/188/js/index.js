const pika = document.querySelector('#pika');
let toggle = false;

setInterval(function(){
  {
  if(toggle) {
    pika.setAttribute("viewBox", "0 145 150 180");
  } else {
    pika.setAttribute("viewBox", ".4 468 150 180");
  }
  toggle = !toggle;
}
}, .1);

document.addEventListener('mousemove',function(evt){
  pika.style.top = evt.clientY - 150 + 'px';
  pika.style.left = evt.clientX + 'px';
});