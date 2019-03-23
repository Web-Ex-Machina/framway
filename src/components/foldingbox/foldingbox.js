var Foldingbox = Object.getPrototypeOf(app).Foldingbox = new Component("foldingbox");
// Foldingbox.debug = true;
Foldingbox.createdAt      = "1.0.0";
Foldingbox.lastUpdate     = "1.4.3";
Foldingbox.version        = "1";
// Foldingbox.loadingMsg     = "This message will display in the console when component will be loaded.";

Foldingbox.prototype.onCreate = function(){
  var foldingbox = this;
  foldingbox.break =foldingbox.$el.data('break');
  foldingbox.title ={$el : foldingbox.$el.children('.foldingbox__title'), text: foldingbox.$el.children('.foldingbox__title').html()};
  foldingbox.content = {$el : foldingbox.$el.find('.foldingbox__container'),};
  foldingbox.content.items = foldingbox.content.$el.children('.foldingbox__item');

  foldingbox.setHeight();
}

Foldingbox.prototype.onResize = function(){
  var foldingbox = this;
  foldingbox.setHeight();
  if(typeof foldingbox.break == "number"){
    if(foldingbox.$el.width() <= foldingbox.break)
      foldingbox.$el.addClass('break');
    else
      foldingbox.$el.removeClass('break');
  }
}

Foldingbox.prototype.setHeight = function() {
  var foldingbox = this;
  var heightBox = 0;
  if(foldingbox.$el.data('height') && foldingbox.$el.data('height') != ""){
    heightBox = foldingbox.$el.data('height');
  }
  else{
    foldingbox.content.items.each(function(index,item){
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
  foldingbox.content.items.height(heightBox);
};