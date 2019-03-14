
$(document).on('mousemove', function(e){
        var eye_x = $('.eye').offset().left - $('.eye').width()/2;
        var eye_y = $('.eye').offset().top - $('.eye').height()/2;
    
        var theta = (Math.atan2((e.pageY - eye_y),(e.pageX - eye_x)) *(180/Math.PI))+85;
        var mousex_constrained = constrain(e.pageX); 
        var mousey_constrained = constrain(e.pageY); 
        var transformString = "rotateZ("+theta+"deg)" + " translateX("+mousex_constrained+"px)" + " translateY("+mousey_constrained+"px)";
        
        $('.eye').css("transform", transformString);

        console.log(transformString);
     });

     function constrain (n) {
         return -n/150;
     }