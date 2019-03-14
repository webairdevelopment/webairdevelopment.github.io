var windowH,
		windowW,
		containerW,
		containerH,
		mouseX,
		mouseY,
		irisColors = ['red', 'green', 'blue', 'yellow'],
		section = document.querySelector('section'),
		container = document.querySelector('.container'),
		eyeEls = document.querySelectorAll('.eye-element-container'),
		eyeSVGs = document.querySelectorAll('.eye-svg'),
		irisEls = document.querySelectorAll('.eye-moving-elements'),
		debugPanel = document.querySelector('.debug-panel'),
		generateColors = document.querySelector('.generate-new-colors'),
		eyeW,
		eyeH,
		zDist,
		irisDist,
		xMove,
		yMove
;

var debugMe = function() {
	var eyeOffsetX = eyeEls[4].offsetLeft + eyeW;
	var eyeOffsetY = eyeEls[4].offsetTop + eyeH;
	var eyePosX = ((containerW/2) - eyeOffsetX);
	var eyePosY = ((containerH/2) - eyeOffsetY);
	debugPanel.innerHTML = 
		'windowW: ' + windowW + '<br/>' + 
		'windowH: ' + windowH + '<br/>' +
		'containerW: ' + containerW + '<br/>' + 
		'containerH: ' + containerH + '<br/>' +  
		'eyeW: ' + eyeW + '<br/>' +
		'eyeH: ' + eyeH + '<br/>' + 
		'zDist: ' + zDist + '<br/>' + 
		'eyeOffsetX: ' + eyeOffsetX + '<br/>' + 
		'eyePosX: ' + eyePosX + '<br/>' + 
		'eyeOffsetY: ' + eyeOffsetY + '<br/>' + 
		'eyePosY: ' + eyePosY + '<br/>' + 
		'mouseY: ' + mouseY + '<br/>' + 
		'translateY: ' + (Math.atan((mouseY - eyePosY)/zDist)) + '<br/>' + 
		"yMove: " + yMove;
}


var getSizes = function() {
	windowW = window.innerWidth;
	windowH = window.innerHeight;
	containerW = container.offsetWidth;
	containerH = container.offsetHeight;
	eyeW = eyeEls[0].offsetWidth/2;
	eyeH = eyeEls[0].offsetHeight/2;
	
	//Orientation Detect
	if (windowW >= windowH) {
		section.classList.add('landscape');
		section.classList.remove('portrait');
	} else {
		section.classList.add('portrait');
		section.classList.remove('landscape');
	}
	
	//JS Breakpoints
	zDist = eyeW*3;
	if (windowW >= 500) {
		zDist = eyeW*2;		
	}
	if (windowW >= 700) {
		zDist = eyeW*1.75;		
	}
	if (windowW >= 800) {
		zDist = eyeW*1.5;		
	}
	if (windowW >= 1000) {
		zDist = eyeW*1;		
	}
}

var handleIrisMove = function(activate) {
	if (activate) {
			irisEls.forEach(function(i){
			var myPosX = (i.closest('.eye-element-container').offsetLeft + eyeW) - (containerW/2);
			var myPosY = (i.closest('.eye-element-container').offsetTop + eyeH) - (containerH/2);
			xMove = Math.atan((mouseX - myPosX)/zDist)*.5;
			yMove = Math.atan((mouseY - myPosY)/zDist)*.5;
			i.setAttribute('style', 'transform: rotateY('+ xMove +'rad) rotateX(' + -1*yMove +'rad) translateZ(' + zDist + 'px)');
			i.querySelector('.pupil-group').setAttribute('style', 'transform: rotateY('+ xMove*.35 +'rad) rotateX(' + -1*yMove*.35 +'rad) translateZ(' + zDist + 'px)');
			i.querySelector('.highlight').setAttribute('style', 'transform: rotateY('+ xMove*.35 +'rad) rotateX(' + -1*yMove*.35 +'rad) translateZ(' + zDist + 'px)');	
		});
	} if(!activate) {
		irisEls.forEach(function(i){
			i.setAttribute('style', 'transform: rotateY(0rad) rotateX(0rad) translateZ(0px)');
			i.querySelector('.pupil-group').setAttribute('style', 'transform: rotateY(0rad) rotateX(0rad) translateZ(0px)');
			i.querySelector('.highlight').setAttribute('style', 'transform: rotateY(0rad) rotateX(0rad) translateZ(0px)');
		});
	}
	// debugMe();
}

//Mouse Move Actions
section.addEventListener('mousemove', function(e){
	mouseX = e.clientX - windowW/2;
	mouseY = e.clientY - windowH/2;
	requestAnimationFrame(function(){
		handleIrisMove(true);
	});
}, false);

section.addEventListener('mouseout', function(e){
	requestAnimationFrame(function(){
		handleIrisMove(false);
	});
}, false);


//Touch Move Actions
section.addEventListener('touchmove', function(e){
  e.preventDefault();
  mouseX = e.touches[0].pageX - windowW/2;
	mouseY = e.touches[0].pageY - windowH/2;
	requestAnimationFrame(function(){
		handleIrisMove(true);
	});
}, false);

section.addEventListener('touchend', function(e){
  e.preventDefault();
	requestAnimationFrame(function(){
		handleIrisMove(false);
	});
}, false);

// Auto Blink Actions
var randRange = function(min, max) {
  return Math.random() * (max - min) + min;
}

var blinkAction = function(el) {	
	el.classList.add('blink');
	el.addEventListener("webkitAnimationEnd", function(){
		el.classList.remove('blink');
	}, false);
	autoBlink(el);
}

var autoBlink = function() {
	setTimeout(function() {
blinkAction(eyeSVGs[Math.floor(randRange(0, eyeSVGs.length))]);
	}, randRange(500, 4000));
}


generateColors.addEventListener('click', function(){
	irisEls.forEach(function(i){
		var newColor = irisColors[Math.floor(Math.random()*irisColors.length)];
		i.querySelector('.iris').classList = 'iris ' + newColor;
	});
	console.log('test');
}, false);

var changeEyeColor = function(el){
	var myIris = this.querySelector('.iris');
	var currentColor = myIris.classList.item(1);
	var newColor;
	var pickNewColor = function(){
		newColor = irisColors[Math.floor(Math.random()*irisColors.length)]
		if (currentColor === newColor) {
			pickNewColor();
		};
	}
	pickNewColor();
	myIris.className = '';
	myIris.classList =  'iris ' + newColor;
}


eyeSVGs.forEach(function(i){
	i.addEventListener('click', changeEyeColor);
	i.addEventListener('touchstart', changeEyeColor);
});

//Window actions
window.addEventListener('resize', getSizes);

//Init Actions
getSizes();
autoBlink();