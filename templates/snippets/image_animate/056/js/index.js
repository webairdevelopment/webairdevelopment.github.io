var sea = document.querySelector('.sea');
var sand = document.querySelector('.sand');
var peach = document.querySelector('.peach');
var sun = document.querySelector('.sun');
var bg = document.querySelector('.background');
var container = document.querySelector('.container');



var tl = new TimelineMax();
tl.add(function (_) {return tl.timeScale(1.5);});

tl.set(container, { opacity: 1 }, 0.5);
tl.fromTo(sea, 5, { strokeDashoffset: 0 }, { strokeDashoffset: 2000, ease: Power2.easeInOut }, 0.5);
tl.fromTo(sand, 5, { strokeDashoffset: 0 }, { strokeDashoffset: 200, ease: Expo.easeInOut }, 0.5);
tl.fromTo(peach, 5, { strokeDashoffset: -75 }, { strokeDashoffset: -320, ease: Power3.easeInOut }, 0.5);

tl.fromTo(sea, 5, { strokeDasharray: '1 30' }, { strokeDasharray: '20 100', ease: Power2.easeInOut }, 0.5);
tl.fromTo(sand, 5, { strokeDasharray: '30 35' }, { strokeDasharray: '20 45', ease: Expo.easeInOut }, 0.5);
tl.fromTo(peach, 5, { strokeDasharray: '40 60' }, { strokeDasharray: '30 180', ease: Power3.easeInOut }, 0.5);

tl.fromTo(sea, 5, { strokeWidth: 20 }, { strokeWidth: 90, ease: Power2.easeInOut }, 0.5);
tl.fromTo(sand, 5, { strokeWidth: 10 }, { strokeWidth: 70, ease: Expo.easeInOut }, 0.5);
tl.fromTo(peach, 5, { strokeWidth: 16 }, { strokeWidth: 110, ease: Power3.easeInOut }, 0.5);

tl.fromTo(sea, 2, { attr: { r: 0 } }, { attr: { r: 300 }, ease: Power2.easeOut }, 0.5);
tl.fromTo(sand, 2, { attr: { r: 0 } }, { attr: { r: 340 }, ease: Expo.easeOut }, 0.5);
tl.fromTo(peach, 2, { attr: { r: 0 } }, { attr: { r: 240 }, ease: Power3.easeOut }, 0.5);

tl.fromTo(sea, 5, { attr: { r: 300 } }, { attr: { r: 340 }, ease: Power2.easeInOut }, 0.5);
tl.fromTo(sand, 5, { attr: { r: 340 } }, { attr: { r: 280 }, ease: Expo.easeInOut }, 0.5);
tl.fromTo(peach, 5, { attr: { r: 240 } }, { attr: { r: 340 }, ease: Power3.easeInOut }, 0.5);

tl.fromTo(sea, 5, { rotation: 0 }, { rotation: -1000, transformOrigin: 'center', ease: Power3.easeInOut }, 0.5);
tl.fromTo(sand, 5, { rotation: 0 }, { rotation: -180, transformOrigin: 'center', ease: Power3.easeInOut }, 0.5);
tl.fromTo(peach, 5, { rotation: 0 }, { rotation: 180, transformOrigin: 'center', ease: Power3.easeInOut }, 0.5);

tl.fromTo(sun, 3, { attr: { r: 0 } }, { attr: { r: 200 }, ease: Elastic.easeOut.config(0.2, 1) }, 2.5);
tl.fromTo(bg, 3, { opacity: 0 }, { opacity: 0.7, ease: Elastic.easeOut.config(0.2, 1) }, 2.5);

tl.add(function (_) {
	tl.timeScale(3);
	tl.reverse();
}, 5.25);


tl.eventCallback('onReverseComplete', function (_) {return tl.play();});