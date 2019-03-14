TweenMax.set('svg', {
  visibility: 'visible'
})
TweenLite.defaultEase = Linear.easeNone;

var leftTl = new TimelineMax({paused: false, repeat: -1}).timeScale(1.92);
leftTl.to('.boxesL path:first-child', 1, {
 y: 26
}).to('.boxesL path:first-child', 1, {
 rotation: 180,
 transformOrigin: '127% 0%'/* ,
 ease: Elastic.easeOut.config(0.1, 0.8) */
}, 0)
 .to('.boxesL path:nth-child(2)', 1, {
 y: -40
}, 0)
 .to('.boxesL path:nth-child(3)', 1, {
 y: -40
}, 0)

.to('.boxesM path:first-child', 1, {
 y: 40
}, 0)
 .to('.boxesM path:nth-child(2)', 1, {
 y: 40
}, 0)
.to('.boxesM path:nth-child(3)', 1, {
 rotation: 180,
 transformOrigin: '-27% 100%'/* ,
 ease: Elastic.easeOut.config(0.8, 0.8) */
}, 0)
.to('.boxesM path:nth-child(3)', 1, {
 y: -26
}, 0)

/* var nestedTl = new TimelineMax();
nestedTl.add(leftTl);

var mainTl = new TimelineMax({repeat: -1})
mainTl.to(nestedTl, 10, {
 time: 2, 
 ease: Elastic.easeOut.config(0.7, 0.16)
}) */
TweenMax.set('.whole', {
 rotation: 90,
 transformOrigin: '50% 50%'
})