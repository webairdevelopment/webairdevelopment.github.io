// /* JS only used to rotate the grid create the custom mouse cursor */

$(document).ready(function(){
  var windowH,
			windowW,
      wrapper = $('.wrapper'),
			// vertPos,
      horPos,
			mouseEl = $('.mouse'),
			mouseW = mouseEl.width()/2,
			mouseH = mouseEl.height()/2,
			ready = false,
      rate = .15;
	
  var getSizes = function() {
		// windowH = $(window).height()/2;
		windowW = $(window).width()/2;
	}
	
  var handleMouse = function(e){
      wrapper.css({
        'transform': 'rotateX(60deg) rotateZ('+ horPos*rate + 'deg)'
      });
			mouseEl.css({
				'transform': 'translateX('+ (e.pageX - mouseW)+ 'px) translateY('+ (e.pageY - mouseH) + 'px)'
			});
    }
	
	$(window).mousemove(function(e){
		// vertPos = e.pageY - windowH;  
		horPos = e.pageX - windowW;  
		requestAnimationFrame(handleMouse(e));
	});

	$(window).mousedown(function(){
		mouseEl.addClass('active');
	});
	$(window).mouseup(function(){
		mouseEl.removeClass('active');
	});
	
	$(window).resize(getSizes);
	getSizes();
	
	setTimeout(function(){
		ready = true;
		console.log(ready);
	}, 2000);
	$('body').addClass('custom-cursor');
});