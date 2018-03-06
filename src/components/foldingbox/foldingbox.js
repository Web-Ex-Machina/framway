$.fn.Foldingbox = function Foldingbox(){
  app._foldingboxes = app._foldingboxes || [];
  $(this).each(function(){
    var foldingbox = {
      $el : $(this),
      title: {$el : $(this).children('.foldingbox__title'), text: $(this).children('.foldingbox__title').html()},
      content : {$el : $(this).find('.foldingbox__container'),},
    };
    foldingbox.content.items = foldingbox.content.$el.children('.foldingbox__item');

    var setHeight = function(){
      var heightBox = 0;
      if(foldingbox.$el.attr('data-height') && foldingbox.$el.attr('data-height') != ""){
        heightBox = foldingbox.$el.attr('data-height');
      }
      else{
        foldingbox.content.items.each(function(index,item){
          var $clone = $(item).children('.foldingbox__item__content').clone().css({
            'transition':'none',
            'opacity':'1',
            // 'visibility':'hidden'
          }).appendTo('body');
          if($clone.height() > heightBox)
            heightBox = $clone.height() + (parseInt($(item).css('padding-top'))*2);
          $clone.remove();
        });
      }
      foldingbox.content.items.height(heightBox);
    };

    $(window).resize(setHeight);
    setHeight();

    app._foldingboxes.push(foldingbox);
  });
};

$(function () {
  $('.foldingbox').Foldingbox();
});