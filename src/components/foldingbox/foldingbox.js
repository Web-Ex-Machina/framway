$.fn.foldingbox = function foldingbox(){
  app._foldingbox = app._foldingbox || [];
  $(this).each(function(){
    app._foldingbox.push(new Foldingbox(this));
  });
  $(window).trigger('resize');
};

var Foldingbox = function Foldingbox(item){
  var foldingbox = this;
  foldingbox.$el = $(item);
  foldingbox.break =$(item).data('break');
  foldingbox.title ={$el : $(item).children('.foldingbox__title'), text: $(item).children('.foldingbox__title').html()};
  foldingbox.content = {$el : $(item).find('.foldingbox__container'),};
  foldingbox.content.items = foldingbox.content.$el.children('.foldingbox__item');

  foldingbox.setHeight();

  foldingbox.$el.on('destroyed',function(){
    app._foldingbox.splice(app._foldingbox.indexOf(foldingbox),1);
    foldingbox = undefined;
  });

  return foldingbox;
}

Foldingbox.prototype.setHeight = function() {
  var heightBox = 0;
  if(this.$el.data('height') && this.$el.data('height') != ""){
    heightBox = this.$el.data('height');
  }
  else{
    this.content.items.each(function(index,item){
      var $clone = $(item).children('.foldingbox__item__content').clone().css({
        'transition':'none',
        'opacity':'1',
        'visibility':'hidden'
      }).appendTo('body');
      if($clone.outerHeight() > heightBox)
        heightBox = $clone.outerHeight() + (parseInt($(item).css('padding-top'))*2);
      $clone.remove();
    });
  }
  this.content.items.height(heightBox);
  return this;
};

Foldingbox.prototype.destroy = function() {
  this.$el.remove();
};

var timerResize;
Foldingbox.prototype.resize = function() {
  var foldingbox = this;
  clearTimeout(timerResize);
  timerResize = setTimeout(function(){
    foldingbox.setHeight();
    if(typeof foldingbox.break == "number"){
      if(foldingbox.$el.width() <= foldingbox.break)
        foldingbox.$el.addClass('break');
      else
        foldingbox.$el.removeClass('break');
    }
  },300);
};

$(function () {
  $('.foldingbox').foldingbox();
  utils.addHtmlHook('.foldingbox', function(item){
    item.foldingbox();
  });

  $(window).resize(function(){
    $.each(app._foldingbox, function(){
      this.resize();
    });
  });
});
