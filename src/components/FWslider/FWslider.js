$.fn.FWslider = function FWslider(){
  app._FWsliders = app._FWsliders || [];
  $(this).each(function(){
    var slider = {
      $el : $(this),
      content : {$el : $(this).find('.FWslider__container'),},
    };
    slider.content.items = slider.content.$el.find('.FWslider__item');
    slider.$nav = $('<div class="FWslider__nav"></div>').appendTo(slider.content.$el);
    for (var i = 0; i < slider.content.items.length; i++) {
      $('<span class="FWslider__nav__item"></span>').appendTo(slider.$nav);
    };
    slider.$nav.children().first().addClass('active');
    slider.$nav.children().bind('click',function(e){
      var index = $(this).index();
      slider.$nav.children().removeClass('active');
      $(this).addClass('active');
      slider.content.$el.find('.FWslider__rail').css('transform', 'translateX('+ (-100 * index) +'%)');
    });

    var setHeight = function(){
      var heightBox = 0;
      if(slider.$el.attr('data-height') && slider.$el.attr('data-height') != ""){
        heightBox = slider.$el.attr('data-height');
      }
      else{
        slider.content.items.each(function(index,item){
          var $clone = $(item).children('.FWslider__item__content').clone().css({
            'transition':'none',
            'opacity':'1',
            'visibility':'hidden'
          }).appendTo('body');
          if($clone.outerHeight() > heightBox)
            heightBox = $clone.outerHeight() + slider.$nav.height();
          $clone.remove();
        });
      }
      slider.content.$el.height(heightBox);
    };

    $(window).resize(setHeight);
    setHeight();


    // console.log(slider);
    app._FWsliders.push(slider);
  });
};

$(function () {
  $('.FWslider').FWslider();
  utils.addHtmlHook('.FWslider', function(item){
    console.log("FWslider added to dom");
    item.FWslider();
  });
});
