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
    if(dim.cols % 2 == 1)
      pos.y = +pos.y + 0.5;
    if(dim.rows % 2 == 1)
      pos.x = +pos.x + 0.5;

    var tZ = unitWidth*pos.y;
    var tY = unitHeight*pos.z*-1;
    var tX = unitWidth*pos.x;

    $brick.css('transform', utils.mergeTransforms(this,'translateZ('+ tZ +'px) translateY('+tY+'px) translateX('+tX+'px)'));

    // brick events listeners
    this.addEventListener("animationstart",brickAnimListener,false);
    this.addEventListener("animationiteration", brickAnimListener, false);
    this.addEventListener("animationend", brickAnimListener, false);

    utils.prefixedEvent(this, "animationstart", brickAnimListener);
    utils.prefixedEvent(this, "animationiteration", brickAnimListener);
    utils.prefixedEvent(this, "animationend", brickAnimListener);

    $(this).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', brickAnimListener);
  });

  // grid dimensionning
  if($(this).closest('.grid').length){
    $(this).closest('.grid').wrapInner('<div class="wrapper"></div>'); // wrap the grid content so we can animate it separatly

    var arrZ = $(this).map(function(){
      return $(this).attr('z');
    }).toArray();
    var nbLayers = Math.max.apply(null,arrZ) + 1; // count one more for layer "0"
    $(this).closest('.grid').height(nbLayers * $(this).outerHeight());

    // grid events listeners
    $(this).closest('.grid').each(function(index,grid){
      grid.addEventListener("animationstart",gridAnimListener,false);
      grid.addEventListener("animationiteration", gridAnimListener, false);
      grid.addEventListener("animationend", gridAnimListener, false);

      utils.prefixedEvent(grid, "animationstart", gridAnimListener);
      utils.prefixedEvent(grid, "animationiteration", gridAnimListener);
      utils.prefixedEvent(grid, "animationend", gridAnimListener);

      $(grid).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', gridAnimListener);
    });
  }

  // scene dimensionning
  if($(this).closest('.scene').length){// add a bit of spacing to scene, to avoid clipping with other elements
    $(this).closest('.scene').css('padding',$(this).outerHeight() + 'px 0');
  }

  // events
  $(this).on('click',function(){
    $(this).toggleClass('animate');
  });

  $(this).closest('.grid').on('click',function(){
    // $(this).addClass('animate');
  });
  return this;
};

$(function () {
  $('.brick').Brick();
  utils.addHtmlHook('.brick', function(item){
    console.log("brick added to dom");
    item.Brick();
  });
});


function brickAnimListener(e){
  if(e.type == "animationend"){
    console.log('Brick animation end');
    $(this).removeClass('animate');
  }
}

function gridAnimListener(e){
  if(e.type == "animationend"){
    console.log('Grid animation end');
    $(this).removeClass('animate');
  }
}
