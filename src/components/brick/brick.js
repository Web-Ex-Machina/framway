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

      // var matrix = $(this).parent('.grid').css('transform');
      // var arrMatrix = $(this).parent('.grid').css('transform').replace(/^\w*\(/, '').replace(')', '').split(/\s*,\s*/);
      // console.log(arrMatrix);
      // if(arrMatrix.length == 16){
      //   var matrix = [];
      //   arrMatrix.map(function(item, i){
      //     if(i==0 || i == 4 || i == 8 || i == 12){
      //       var arr = [arrMatrix[i],arrMatrix[i+1],arrMatrix[i+2],arrMatrix[i+3]];
      //       matrix.push(arr);
      //     }
      //   });
      //   console.log(matrix);
      // }
      // $(this).parent('.grid').css('transform',utils.mergeTransforms($(this).parent('.grid'),'rotateX('+$(this).parent('.grid').parent('.scene').height() * -0.025 +'deg)'));

      // $(this).parent('.grid').css('transform',$(this).parent('.grid').css('transform') );
      // console.log($(this).parent('.grid').css('--transform-text'));
      var _getTransform = function($element) {
          var matrix = $element.css('transform'),
              translateX = 0,
              translateY = 0,
              rotateX = 0,
              rotateY = 0,
              rotateZ = 0;

          if (matrix !== 'none') {
              // do some magic
              var values = matrix.split('(')[1].split(')')[0].split(','),
                  pi = Math.PI,
                  sinB = parseFloat(values[8]),
                  rotateY = Math.asin(sinB) * 180 / pi || 0,
                  cosB = Math.cos(rotateY * pi / 180),
                  matrixVal10 = parseFloat(values[9]),
                  rotateX = Math.asin(-matrixVal10 / cosB) * 180 / pi || 0,
                  matrixVal1 = parseFloat(values[0]),
                  rotateZ = Math.acos(matrixVal1 / cosB) * 180 / pi || 0
                  translateX = matrix[12] || matrix[4],
                  translateY = matrix[13] || matrix[5];
              // console.log(values);
          }

          return {
              rotateX: +rotateX.toFixed(2),
              rotateY: +rotateY.toFixed(2),
              rotateZ: +rotateZ.toFixed(2),
              translateX: +translateX,
              translateY: +translateY,
          };
      }
      // console.log(_getTransform($(this).parent('.grid')));
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
