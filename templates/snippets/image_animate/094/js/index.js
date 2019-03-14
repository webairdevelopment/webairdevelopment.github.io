/* Shapes */
var svgContainer = document.getElementById('svgContainer');
var animItem = bodymovin.loadAnimation({
  wrapper: svgContainer,
  animType: 'svg',
  loop: true,
  path: 'https://labs.nearpod.com/bodymovin/demo/markus/walk/girl.json'
});
animItem.setSubframe(false);
/* Shapes */
var svgContainer = document.getElementById('svgContainer2');
var animItem2 = bodymovin.loadAnimation({
  wrapper: svgContainer,
  animType: 'canvas',
  loop: true,
  path: 'https://labs.nearpod.com/bodymovin/demo/markus/walk/parents.json'
});
animItem2.setSubframe(false);
/* Shapes */
var svgContainer = document.getElementById('svgContainer3');
var animItem3 = bodymovin.loadAnimation({
  wrapper: svgContainer,
  animType: 'canvas',
  loop: true,
  path: 'https://labs.nearpod.com/bodymovin/demo/markus/walk/sasquatch.json'
});
animItem3.setSubframe(false);
animItem.setSpeed(0.8)
animItem2.setSpeed(0.8)
animItem3.setSpeed(0.8)
window.onresize = function(){
  animItem.resize()
  animItem2.resize()
  animItem3.resize()
}