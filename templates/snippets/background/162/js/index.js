const mask = document.querySelector('#maskCircle'),
      maskGroup = document.querySelector('#maskGroup'),
      rope = document.querySelector('#rope'),
      lever = document.querySelector('#lever'),
      bulb = document.querySelector('#bulb'),
      bGlow = document.querySelector('#bulbGlow'),
      bg = document.querySelector('#BG'),
      rArm = document.querySelector('#rArm'),
      rArm2 = document.querySelector('#rArm2'),
      hand = document.querySelector('#hand'),
      handF = document.querySelector('#handFront'),
      lidsTop = document.querySelectorAll('.lidTop'),
      lidsBot = document.querySelectorAll('.lidBot'),
      smile = document.querySelector('#mouth'),
      awe = document.querySelector('#mouth2'),
      eyes = document.querySelector('#eyes'),
      lEye = document.querySelector('#lEye'),
      rEye = document.querySelector('#rEye'),
      body = document.querySelector('body'),
      svgEl = document.querySelector('svg'),
      ropeHandG = document.querySelector('#ropeHandGroup');

// Randomize function
const RandomMinMax = (min, max) => min + Math.floor(Math.random() * (max - min));

// lights off
let lightState = false;

// initial settings for svg els
TweenMax.set(bGlow,{opacity:0})
TweenMax.set(lidsTop,{y:-22})
TweenMax.set(lidsBot,{y:22})
TweenMax.set(svgEl,{visibility:"visible"})
TweenMax.set(eyes,{x:-400})
// Hide mask at the start
TweenMax.set(mask,{attr:{r:'60'},delay:4})


const lightsOn = () => {
  lightState = true
  let onTl = new TimelineLite();
  onTl.set(body,{backgroundColor:'#241C48'},'on')
      .to(bg,0.075,{fill:'#241C48'},'on')
      .to(bulb,0.2,{'fill-opacity':'0.7'},'on')
      .to(bGlow,0.2,{opacity:1},'on')
      .set(maskGroup,{attr:{'clip-path':""}},'on')
      .set('#head',{attr:{"fill":"url(#bodyHeadGrad)"}},'on')
      .set('#body',{attr:{"fill":"url(#bodyHeadGrad)"}},'on')
      .set('#rArm',{attr:{"stroke":"url(#rArmGrad)"}},'on')
  return onTl; 
}

const lightsOff = () => {
  lightState = false
  let offTl = new TimelineLite();
  offTl.to(body,0.05,{backgroundColor:'#000'},'off')
       .to(bg,0.075,{fill:'#0C1228'},'off') 
       .to(bulb,0.2,{'fill-opacity':'0'},'off')
       .to(bGlow,0.2,{opacity:0},'off')
       .to(smile,0.2,{morphSVG:smile},'off')
       .set(maskGroup,{attr:{'clip-path':"url(#circleMask)"}},'off') 
      .set('#head',{attr:{"fill":"#C56678"}},'off')
      .set('#body',{attr:{"fill":"#C56678"}},'off')
      .set('#rArm',{attr:{"stroke":"#C56678"}},'off')
  return offTl; 
}

const pullLever = () => {
  let tl = new TimelineLite();
  tl.to(hand,0.2,{y:20},'down')
    .to(handF,0.2,{y:20},'down')
    .to(rArm,0.2,{morphSVG:rArm2},'down')
    .to(lever,0.2,{y:20},'down')
    .to(rope,0.2,{y:20},'down')
    .to(rArm,0.2,{morphSVG:rArm},'up') 
    .to(hand,0.2,{y:0},'up')
    .to(handF,0.2,{y:0},'up')
    .to(lever,0.2,{y:0},'up')
    .to(rope,0.2,{y:0},'up') 
  return tl;
}

const lightGlows = () => {
  let tl = new TimelineMax({repeat:-1});
  tl.to('#bulbGlow path',2,{'fill-opacity':'1'})
    .to('#bulbGlow path',1,{'fill-opacity':'0.55'})
  return tl;
}

const blinkClick = () => {
  let tl = new TimelineMax();
  tl.to(lidsTop,0.1,{y:0},'in')
    .to(lidsBot,0.1,{y:0},'in')
    .to(lidsTop,0.1,{y:-22},'out')
    .to(lidsBot,0.1,{y:22},'out')
  return tl;
}

const randomBlink = () => {
  let tl = new TimelineMax({repeat:-1,repeatDelay:RandomMinMax(5,10),delay:2});
  tl.to(lidsTop,0.1,{y:0},'in')
    .to(lidsBot,0.1,{y:0},'in')
    .to(lidsTop,0.1,{y:-22},'out')
    .to(lidsBot,0.1,{y:22},'out')
}

const eyesIn = () => {
  let tl = new TimelineMax({id:"eyesIn"});
  tl.fromTo(eyes,4,{x:-400},{x:0,ease:Linear.easeNone},'in')
  return tl;  
}

const eyesInBounce = () => {
  let tl = new TimelineMax({repeat:5})
  .fromTo(eyes,0.35,{y:0},{y:-40,ease:Circ.easeOut},'in+=0')
  .to(eyes,0.35,{y:0,ease:Back.easeOut.config(1)},'in+=0.35')
  return tl;
}

// Character is in awe when mouse moves
const mouthAwe = () => {
  let tl = new TimelineLite();
  tl.to(smile,0.25,{morphSVG:awe})
  return tl;
}

// MASK MOVEMENT
// Create a point in the svg coord system
// https://developer.mozilla.org/en-US/docs/Web/API/SVGPoint
let svgPoint = svgEl.createSVGPoint();

const cursor = (e, svg) => {
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    // https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement
    return svgPoint.matrixTransform(svg.getScreenCTM().inverse());
}

const updateMaskCoords = (svgCoords) => {
    TweenMax.set(mask,{attr:{'cx':svgCoords.x,'cy':svgCoords.y}})
}
const updateEyeMouthCoords = (svgCoords) => {
   TweenMax.to( rEye, 0.5, {
    x: svgCoords.x/75, y: svgCoords.y/75,
    ease: Elastic.easeOut});
  TweenMax.to( lEye, 1, {
    x: svgCoords.x/75, y: svgCoords.y/75,
    ease: Elastic.easeOut});
   TweenMax.to( smile, 1, {
    x: svgCoords.x/75, y: svgCoords.y/75,
    ease: Elastic.easeOut});
   }

document.addEventListener('mousemove', (e) => {
  updateMaskCoords(cursor(e, svgEl));
  updateEyeMouthCoords(cursor(e,svgEl));
  if ( lightState === true) {
  mouthAwe();
  }
});
// touch
document.addEventListener('touchmove', (e) => {
    e.preventDefault();
    // https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches
    // https://developer.mozilla.org/en-US/docs/Web/API/TouchList
    let touch = e.targetTouches[0];
    if (touch) {
        updateMaskCoords(cursor(touch, svgEl));
        updateEyeMouthCoords(cursor(touch,svgEl));
    }
});

// 
setTimeout(() => {
ropeHandG.addEventListener('click',() => {
  !lightState ? lightsOn() : lightsOff() ;
  pullLever();
  blinkClick();
  lightGlows();
  //breathe();
}) 
},4000)

randomBlink();
eyesIn();
eyesInBounce();
//GSDevTools.create()


const breathe = () => {
  let tl = new TimelineMax({repeat:-1,repeatDelay:0.4});
  tl.to('#body',1,{scale:1.02,transformOrigin:"center center"},'bIn')
    .to('#body',1,{scale:1,ease:Power1.easeOut},'bOut')
    .to('#headGroup',1,{y:-1},'bIn')
    .to('#headGroup',1,{y:0},'bOut')
    .to('#eyes',1,{y:-1},'bIn')
    .to('#eyes',1,{y:0},'bOut')
  return tl;
}