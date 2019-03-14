var endTimeout;

$(function() {
	$.fn.extend({
		zzButton: function(action, callback) {
			if (action === 'start') {
				if ($(this).hasClass('zz-button-progress-done')) {
					$(this).removeClass('zz-button-progress-done')
					$(this).removeClass('zz-button-progress-done-active');
				}
				
				if (!$(this).hasClass('active')) {
					$(this).addClass('active');
					$(this).on('transitionend', function() {
						if ($(this).hasClass('active')) {
							callback();
						}
						else if ($(this).hasClass('zz-button-progress-done')) {
							$(this).addClass('zz-button-progress-done-active');
						}
					});
				}
			}
			else if (action === 'end') {
				$(this).on('animationend', function() {
					$(this).removeAttr('zz-button-progress');
					$(this).removeClass('active');
					$(this).addClass('zz-button-progress-done');
					$(this).on('animationend', function() {
						var elm = this;
						
						endTimeout = setTimeout(function() {
							$(elm).removeClass('zz-button-progress-active');
							$(elm).removeClass('zz-button-progress-done');
							$(elm).removeClass('zz-button-progress-done-active');
						}, 3000);
					});
				});
			}
		}
	});
});

$(function() {
	$.fn.zzButtonProgress = function(elm, progress, callback) {
		if (progress <= 100) {
			setTimeout(function() {
				$(elm).attr('zz-button-progress', progress);
				$.fn.zzButtonProgress(elm, progress + 1, callback);
			}, 10);
		}
		else {
			$('#zzButton').zzButton('end');
		}
	};
	
	$('#zzButton').on('click', function() {
		var elm = this;
		
		clearTimeout(endTimeout);
		
		$('#zzButton').zzButton('start', function() {
			$.fn.zzButtonProgress(elm, 0, function() {
				$(this).removeClass('active');
			});
		});
	});
});