$.fn.Brick = function Brick(){
  var htmlStud = require('html-loader?interpolate!./templates/stud.html');
  var htmlBrick = require('html-loader?interpolate!./templates/brick.html');
  $(this).each(function(){
    var $brick = $(this);
    var dim = {
        rows: $brick.attr('rows'),
        cols: $brick.attr('cols'),
        studs: $brick.attr('rows') * $brick.attr('cols'),
    }
    var pos = {
        z : $brick.attr('z'),
        x : $brick.attr('x'),
        y : $brick.attr('y'),
    }
    var text = $brick.attr('text') || false;
    var $content = $(htmlBrick);

    // brick construction
    $brick.append($content);
    for (var i = 0; i < dim.studs; i++) {
        $brick.find('.top').append(htmlStud);
    }
    if(text)
      $brick.find('.front,.right,.back,.left').append(text);
    // brick dimensionning
    var unitWidth = $brick.outerWidth();
    var unitHeight = $brick.outerHeight();
    $brick.css({'width' : unitWidth * dim.rows, });
    $brick.find('.top').css('height', unitWidth * dim.cols);
    $brick.find('.left,.right').css('width', unitWidth * dim.cols);
    $brick.find('.front,.back').css({
        'height': unitHeight,
        'width': $brick.find('.top').outerWidth(),
    });
    // studs dimensionning
    $brick.find('.stud').css({'width': (100 / dim.rows) + '%', 'height': (100 / dim.cols) + '%', });

    // brick placement
    $brick.css('transform', utils.mergeTransforms(this,'translateZ('+ unitWidth*pos.y+'px) translateY('+unitHeight*pos.z*-1+'px) translateX('+unitWidth*pos.x+'px)'));
  });

  // grid dimensionning
  if($(this).parent('.grid').length){
    var arrZ = $(this).map(function(){
      return $(this).attr('z');
    }).toArray();
    var nbLayers = Math.max.apply(null,arrZ) + 1; // count one more for layer "0"
    $(this).parent('.grid').height(nbLayers * $(this).outerHeight());

    if($(this).parent('.grid').parent('.scene').length){
      // add a bit of spacing to scene, to avoid clipping with other elements
      $(this).parent('.grid').parent('.scene').css('padding',$(this).outerHeight() + 'px 0');
    }
  }
};

$(function () {
  $('.brick').Brick();
  utils.addHtmlHook('.brick', function(item){
    console.log("brick added to dom");
    item.Brick();
  });
});
