
$(window).on('load', function() {

	let nbImg = 0;
	$('.slider .container-images img').each(function() {
		nbImg += 1;
	});

	$('.slider .arrow').click(function() {
		let n = imageActive();
		
		$('.slider').removeClass('right left');

		if($(this).hasClass('left')) { 
			n -= 1;
			$('.slider').addClass('left');
			setTimeout(function() {
				$('.slider .container-images img.active').addClass('to_left');
			}, 50)
		}
		else if($(this).hasClass('right')) { 
			n += 1;
			$('.slider').addClass('right');
			setTimeout(function() {
				$('.slider .container-images img.active').addClass('to_right');
			}, 50)
		}

		if(n > nbImg) n = 1;
		if(n < 1) n = nbImg;

		setTimeout(function() {
			$('.slider .container-images img').removeClass('active');
			$('.slider .container-images img:nth-child('+n+')').addClass('active');
		
			setTimeout(function() {
				$('.slider .container-images img').removeClass('to_left');
				$('.slider .container-images img').removeClass('to_right');
			}, 500)
		}, 50)
	});

	function imageActive() {
		let n = 1;
		$('.slider .container-images img').each(function(index) {
			if($(this).hasClass('active')) {
				n += index;
			}
		});
		return n;
	}

});