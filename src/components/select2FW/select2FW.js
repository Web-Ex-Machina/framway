require('select2');
var Select2FW = Object.getPrototypeOf(app).Select2FW = new Component("select2FW");
// Select2FW.debug = true;

Select2FW.prototype.onCreate = function(){
  var select2FW = this;
  select2FW.$el.select2({
    minimumResultsForSearch: 5,
    width: '100%'
  });
  if(Select2FW.debug) console.log('Select2FW has been created \n ',select2FW);
}

Select2FW.prototype.onDestroy = function(){
  var select2FW = this;
  select2FW.$el.select2('destroy');
  if(Select2FW.debug) console.log('Select2FW has been destroyed \n ',select2FW);
}

$(function () {
  $('select').not('.custom').select2FW();
  utils.addHtmlHook('select:not(.custom)', function(item){
    item.select2FW();
  });
});
