var $cta = $('.cta');

var createBtnsMarkup = function createBtnsMarkup() {
	$cta.each(function (i, btn) {
		var $t = $(btn);
		var $btnText = $t.text();
		var $splitText = $btnText.split("");

		$t.html("").append("\n\t\t\t\t<span class=\"btn-text-parent\">\n\t\t\t\t\t<span class=\"wrap_text current-btn-text\"></span>\n\t\t\t\t\t<span class=\"wrap_text buildin-btn-text\"></span>\n\t\t\t\t</span>\n\t\t\t");






		for (var _i = 0; _i < $splitText.length; _i++) {
			$t.
			find(".wrap_text").
			append("<span class=\"btn-letter\">" + $splitText[_i] + "</span>");
		}
	});
};


window.onLoad = createBtnsMarkup();