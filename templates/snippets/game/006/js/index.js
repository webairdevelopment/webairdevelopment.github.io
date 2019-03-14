$(function(){
		$('.grid span').hover(function(){
			$(this).addClass('clicked');
		});

		$('a').on('click touchstart', function(){
			$(this).css('box-shadow', '3px 3px #ccc')
			$('span').removeClass('clicked');
		})
	});