$(function () {
  var score = 0 ;
  var timeout = false;
  var delay = 250;
  $('body').on('click','.bubble', clickOnBubble);
  setTimeout(test,25000);
  function clickOnBubble(e){
    if(!$(e.target).hasClass('clicked')){
    disappears(e);
    scored(e) 
      $(e.target).addClass('clicked');
    }
  }
  function disappears(e){
    $(e.target).css({'height':'0','width':'0','border':'none'});
  }
  function scored(e){
    score +=  Math.floor((140 - $(e.target).css('z-index'))/2);
    $('.score_value').html(score);
  }
  function test(){
    $('body').addClass('ended');
  }
});
function refreshPage() {
  window.location.href = window.location.href;
}