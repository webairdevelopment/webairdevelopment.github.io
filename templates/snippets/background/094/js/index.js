jQuery(document).ready(function($) {
	
	function generateKolor(){
		var red = Math.floor((Math.random() * 255) - 100);
		var green = Math.floor((Math.random() * 255) + 50);
		var blue =  Math.floor((Math.random() * 255) + 200);
		var alpha =  Math.random();
		var kolor = "rgba("+red+","+green+","+blue+","+alpha+")";
		return kolor;
	}
	var bgKolor = generateKolor();
	var bgKolor2 = generateKolor();
	var styles = {
		display : "block",
		position : "absolute",
		boxSizing : "border-box",
		width: "100vw",
		height: "100vh",
		margin : 0,
		padding : "100px 200px",
		overflow : "hidden",
		top : 0,
		left : 0,
		opacity : "1",
      backgroundImage : "linear-gradient("+bgKolor+","+bgKolor2+")",
     	backgroundSize : "100% 100vh",
		filter: "url(#goo)"
    };
	var contStyles = {
		display : "block",
		position : "absolute",
		boxSizing : "border-box",
		width: "100vw",
		height: "100vh",
		margin : 0,
		padding : "100px 200px",
		top : "60px",
		left : "40px",
		opacity : "0.7",
		transform : "scaleX(-1) scaleY(-1)",
		filter: "url(#goo)"
    };
	function makeBoxes(targetBox,minWidth,minHeight) {
		var i;
		for (i = 1; i <= 100; i++) { 
			var delayWiggle = Math.floor((Math.random() * 1000) ) +"ms";
			var durationWiggle = Math.floor((Math.random() * 1000) + 2000 ) +"ms";
			$(targetBox).append('<div class="boxouter" style="animation-delay: '+delayWiggle+'; animation-duration: '+durationWiggle+';"><div class="box box'+i+'"></div></div>');
			var thisBox = ".box"+i;
			var thisbgKolor = generateKolor();
			var thisbgKolor2 = generateKolor();
			var widthHeight =  Math.floor(((Math.random() * 120) + minWidth )) +"px";
			var thisStyle = {
				display : "inline-block",
				width : widthHeight,
				height : widthHeight,
				borderRadius : "50%",
				margin : "-5px",
				opacity: "1",
				backgroundImage : "linear-gradient("+thisbgKolor+","+thisbgKolor2+")",
				backgroundSize : "100% 100%",
				position : "relative",
				animationDelay : Math.floor((Math.random() * 2000) ) +"ms",
				animationDuration : Math.floor((Math.random() * 1000) + 8000 ) +"ms"
			};
			$(thisBox).css(thisStyle);
			
		}
	}
	$("body").css( styles );
	
	makeBoxes("body",10, 10 );
	$("body").append( '<div class="container"></div>' );
	$(".container").css( contStyles );
	makeBoxes(".container", 10, 10 ); 
});