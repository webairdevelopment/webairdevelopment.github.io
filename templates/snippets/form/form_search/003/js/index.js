$(function(){
  var tags = $(".tags span");
  var options = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: ['innerHTML']
  };
  var fuse = new Fuse(tags, options);
  
  $("#inline-search-term").on("keyup", function(){
    var search_term = $(this).val();
    $(".tags span").hide();
    var result = fuse.search(search_term);
    if(result.length){
      $.each(result, function(i,val){
        $(".tags").find("span:contains('"+$(val).text()+"')").show()
        $(val).addClass("bg-red").addClass("text-white")
      })
    } else {
      $(".tags span").removeClass("bg-red").removeClass("text-white").show();
    }
  })
})