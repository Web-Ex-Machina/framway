var select2 = require('select2');
var Select2FW = Object.getPrototypeOf(app).Select2FW = new Component("select2FW");
// Select2FW.debug = true;
Select2FW.createdAt      = "1.0.0";
Select2FW.lastUpdate     = "1.4.14";
Select2FW.version        = "1.1.1";
// Select2FW.loadingMsg     = "This message will display in the console when component will be loaded.";

Select2FW.prototype.onCreate = function(){
  var select2FW = this;
  select2FW.select2 = new select2(select2FW.$el,{
    minimumResultsForSearch: 5,
    width: '100%',
    dropdownParent: select2FW.$el.parent()
  });
  if(Select2FW.debug) console.log('Select2FW has been created \n ',select2FW);
}

Select2FW.prototype.onDestroy = function(){
  var select2FW = this;
  select2FW.select2.destroy();
  if(Select2FW.debug) console.log('Select2FW has been destroyed \n ',select2FW);
}

$(function () {
  $('select').not('.custom').select2FW();
  utils.addHtmlHook('select:not(.custom)', function(item){
    item.select2FW();
  });
});
