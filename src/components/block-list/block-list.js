var BlockList = Object.getPrototypeOf(app).BlockList = new Component("block-list");
BlockList.debug = true;

BlockList.prototype.onCreate = function(){
  var block = this;
  if(block.$el.hasClass('content--inline')){
    block.$el.find('.block-list__headline,.block-list__content,.block-list__footer').wrapAll('<div class="block-list__wrapper__inner"></div>')
  }
}