$.fn.sliderFW = function sliderFW(){
  app._sliderFW = app._sliderFW || [];
  $(this).each(function(){
    app._sliderFW.push(new SliderFW(this));
  });
  $(window).trigger('resize');
};

var SliderFW = function SliderFW(item){
  var slider = this;
  slider.$el = $(item);
  slider.content = {$el : $(item).find('.sliderFW__container'),};
  slider.content.items = slider.content.$el.find('.sliderFW__item');
  slider.$nav = $('<div class="sliderFW__nav"></div>').appendTo(slider.content.$el);
  for (var i = 0; i < slider.content.items.length; i++) {
    $('<span class="sliderFW__nav__item"></span>').appendTo(slider.$nav);
  };
  slider.$nav.children().first().addClass('active');
  slider.$nav.children().bind('click',function(e){
    var index = $(this).index();
    slider.$nav.children().removeClass('active');
    $(this).addClass('active');
    slider.content.$el.find('.sliderFW__rail').css('transform', 'translate3d('+ (-100 * index) +'%,0,0)');
  });

  slider.setHeight();

  slider.$el.on('destroyed',function(){
    app._sliderFW.splice(app._sliderFW.indexOf(slider),1);
    slider = undefined;
  });

  return slider;
};

SliderFW.prototype.setHeight = function() {
  var slider = this;
  var heightBox = 0;
  if(slider.$el.attr('data-height') && slider.$el.attr('data-height') != ""){
    heightBox = slider.$el.attr('data-height');
  }
  else{
    slider.content.items.each(function(index,item){
      var $clone = $(item).children('.sliderFW__item__content').clone().css({
        'transition':'none',
        'opacity':'1',
        'visibility':'hidden'
      }).appendTo('body');
      if($clone.outerHeight() > heightBox){
        heightBox = $clone.outerHeight() + slider.$nav.height();
      }
      $clone.remove();
    });
  }
  slider.content.$el.height(heightBox);
  return this;
};

SliderFW.prototype.destroy = function() {
  this.$el.remove();
};

var timerResize;
SliderFW.prototype.resize = function() {
  var slider = this;
  clearTimeout(timerResize);
  timerResize = setTimeout(function(){
    // slider.setHeight();
  },300);
};


$(function () {
  $('.sliderFW').sliderFW();
  utils.addHtmlHook('.sliderFW', function(item){
    item.sliderFW();
  });

  $(window).resize(function(){
    $.each(app._sliderFW, function(){
      this.resize();
    });
  });
});

