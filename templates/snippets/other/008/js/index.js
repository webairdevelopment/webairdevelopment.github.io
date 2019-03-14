var $buttons = $('<ul class="buttons"></ul>').appendTo('body');
var $space = $('.space');
$space.find('div').each(function(){
	$div = $(this);
	$button = $('<li>'+$div.attr('class')+'</li>').click(function(e){
		var offset = $(window).height() / 2;
		var $b = $(this);
		var $p = $('.'+$b.text());
		$('html,body').animate({
        scrollTop: $p.offset().top - offset + $p.height()/2
    });
	}).appendTo($buttons);
	$button.css('color', $div.css('color'));
	if ($div.parent().is(':not(.space)')) $button.addClass('moon');
});

var zoom = 1;
$(window).on('keypress',function(e) {
	switch(e.key){
		case '-':
			zoom*=.5;
			if(zoom<=0.01) zoom = 0.01;
			break;
		case '+':
			zoom/=.5;
			if(zoom>=2) zoom = 2;
			break;
	}
	$space.css('transform','scale('+zoom+')');
	resize();
});


function resize(){
	var scale = 500/zoom;
	var size = $(window).height();
	$('#pagesize').text( (size*scale).toFixed(2)+'km (or '+ (size*scale/12742).toFixed(2)+' earths)');
	$('#earthsize').text( (149600000 / (size*scale)).toFixed(2));
	$('#faroutsize').text( (17951744484 / (size*scale)).toFixed(2));
	$space.find('div').each(function(){
		$(this).css('font-size', (80 / zoom).toFixed(0)+'px');
	});
}
resize();