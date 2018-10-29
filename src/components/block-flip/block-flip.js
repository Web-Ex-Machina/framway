var BlockFlip = Object.getPrototypeOf(app).BlockFlip = new Component("block-flip");
BlockFlip.debug = false;

BlockFlip.prototype.onCreate = function(){
  var block = this;
  if(!block.$el.find('.block-flip__back .block-flip__back__wrapper').length)
    block.$el.find('.block-flip__back').wrapInner('<div class="block-flip__back__wrapper"></div>');
}