 var $el = $('.stopwatch'),
     $timer = $el.find('.timer'),
     $button = $el.find('.button');
$el.click(function() {
  if ($timer.hasClass('paused')) {
    $button.addClass('clicked');
    setTimeout(function(){ 
      $button.removeClass('clicked');
      $timer.removeClass('paused');
    }, 200);
  }
  else {
    $button.addClass('clicked');
    setTimeout(function(){ 
      $button.removeClass('clicked');
      $timer.addClass('paused');
    }, 200);
  }
})