$('#font-changer').change(function(){
  $( ".exercise1" ).removeClass().addClass('exercise1 field ' + $('input[name=font]:checked', '#font-changer').val());
});

$('#parallax-base').mousemove(function(){
  var offset = $(this).offset();
  var corX = event.pageX - offset.left;
  var corY = event.pageY - offset.top;
  var prcX = corX / $(this).width() * 100;
  var prcY = corY / $(this).height() * 100;
  if(prcX < 0) prcX = 0;
  if(prcX > 100) prcX = 100;
  if(prcY < 0) prcY = 0;
  if(prcY > 100) prcY = 100;
  $( "#log" ).text( "pageX: " + corX + "(" + prcX + "%), pageY: " + corY + "(" + prcY + "%)");
  $("#parallax-base div").css({"top": prcY / 9 + "%", "left": prcX / 9 + "%"});
});
