$("#go").click(testAndDisplay);
$("#regex").on("input", testAndDisplay);
$(".tryThisRegex").click(tryThisRegex);

function testAndDisplay() {
  $(".table tr td:nth-child(2)").html("").removeClass("result-positive").removeClass("result-negative");
  
  var rowsToCheck = $(".table tr:not(#tableHeader)");
  var patt;
  $("#regex").removeClass("invalid-input");
  try {
    patt = new RegExp($("#regex").val());
  }
  catch (e) {
    $("#regex").addClass("invalid-input");
    return false;
  }
  
  for (var i=0; i<rowsToCheck.length; i++) {
    if (patt.test($(rowsToCheck[i]).children()[0].innerHTML)) {
      $($(rowsToCheck[i]).children()[1]).html('<i class="fas fa-check"></i>').addClass("result-positive");
    }
    else {
      $($(rowsToCheck[i]).children()[1]).html('<i class="fas fa-times"></i>').addClass("result-negative");
    }
  }
}
function tryThisRegex(e) {
  $("#regex").val($(e.target).parents(".proposal").children(".regex").children(".horiz-scroll").html());
  window.scrollTo(0, 0);
  testAndDisplay();
  return true;
}