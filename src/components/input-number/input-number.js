var InputNumber = Object.getPrototypeOf(app).InputNumber = new Component("input-number");
// InputNumber.debug = true;
InputNumber.createdAt      = "1.4.10";
InputNumber.lastUpdate     = "1.4.10";
InputNumber.version        = "1";
// InputNumber.loadingMsg     = "This message will display in the console when component will be loaded.";

InputNumber.prototype.onCreate = function(){
  var input = this;
  input.$el.addClass('input-number__input');
  input.$container = $('<div class="input-number__container"></div>');
  input.$el.wrapAll(input.$container);
  input.$buttonsContainer = $('<div class="input-number__buttonsContainer"></div>').insertAfter(input.$el);
  input.$buttonPlus= $('<div class="input-number__btn plus">+</div>').appendTo(input.$buttonsContainer);
  input.$buttonMinus = $('<div class="input-number__btn minus">-</div>').appendTo(input.$buttonsContainer);

  input.$buttonPlus.on('click',function(){input.$el.get(0).stepUp();});
  input.$buttonMinus.on('click',function(){input.$el.get(0).stepDown();});
}


$(function () {
  $('input[type="number"]').not('.custom')['input-number']();
  utils.addHtmlHook('input[type="number"]:not(.custom)', function(item){
    item['input-number']();
  });
});