
function forceLower(strInput) 
{
strInput.value=strInput.value.toLowerCase();
}

Splitting();

$('.signup').submit(function(event){
 event.preventDefault();
 
 var emailText = $('.email').val();
 $(".field").append("<p data-splitting='chars'>" + emailText + "</p>");
  Splitting();
  $("#wrap").addClass("flip");
  setTimeout(function(){	
    $(".char, .word").addClass("slide");
}, 1);
  setTimeout(function(){	
    $('.email').val('');
    $( ".field p" ).remove();
    $("#wrap").removeClass("flip");
}, 3000);
});