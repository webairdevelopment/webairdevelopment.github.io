	$(".drag").draggable().css('cursor', 'pointer');

	$('#tape-dispenser, #coffee-cup, #clock, #plant, #big-box, #stack-binder, #stack-book, #shelf-2-box, #take-out').hover(
		function () {
			var sound = $(this).children('.sound')[0];
			sound.play();
		},
		function () {
      var sound = $(this).children('.sound')[0];
			sound.pause();
			sound.currentTime = 0;
		}
	);

	$("#chair-seat, #bag, #chair").bind("webkitAnimationEnd mozAnimationEnd animationEnd", function () {
		$(this).removeClass("animated");
		var sound = $(this).children('.sound')[0];
		sound.play();
	});

	$("#chair-seat, #bag, #chair").hover(function () {
		$(this).addClass("animated");
		var sound = $(this).children('.sound')[0];
		sound.play();
	});