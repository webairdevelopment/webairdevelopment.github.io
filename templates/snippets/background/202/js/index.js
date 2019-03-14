var $body = $('body'),
	$amp = $('.amp'),
	$amp1 = $('.amp1');

TweenMax.set('.container', {
	visibility: 'visible'
});

function initTilt() {
	TweenMax.set(".container", {perspective: 100, scale: 2});
	TweenMax.set('.amp', { transformStyle: "preserve-3d" });
	// thicker to thin
	TweenMax.set('.amp1', { z: -80, scale: 1.0 });
	TweenMax.set('.amp2', { z: -60, scale: .89 });
	TweenMax.set('.amp3', { z: -40, scale: .78 });
	TweenMax.set('.amp4', { z: -20, scale: .67 });
	TweenMax.set('.amp5', { z: 0, scale: .56 });
	
	TweenMax.staggerTo('.amp', 0.4, {
		// scale: '+=0.05',
		z: '+=10',
		yoyo: true, 
		repeat: -1,
		ease:Sine.easeInOut
	}, 0.07);
	
	$body.mousemove(function(e) {
		rotate(e.pageX, e.pageY)
	}); 
	
	window.addEventListener('touchstart', function(e) {
		clientX = e.touches[0].clientX;
		clientY = e.touches[0].clientY;
		// e.preventDefault();
		rotate(clientX, clientY);
	}, false);
};

function rotate(cx, cy) {
	var sxPos = (cx / $body.width()*100 - 50)*2 ;
	var syPos = (cy / $body.height()*100 - 50)*2;
	$amp.each(function() {
		TweenMax.to($(this), 3, {
			rotationY: -0.3 * sxPos,
			rotationX: 0.3 * syPos,
			transformOrigin: "center center -200",
			ease: Expo.easeOut
		});
	});
}

$body.mouseleave(function() {
	rotate($body.width()/2, $body.height()/2);
})

initTilt();

// console.clear();

/*  ==========================================================================
    Greensock Dev Tools
    ========================================================================== */  

//instantiate GSDevTools with default settings
// GSDevTools.create( );

/*  ==========================================================================
    FPS GUI stats.js
    ========================================================================== */  

// (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()