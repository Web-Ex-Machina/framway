require('select2');

$.fn.select2FW = function select2FW(){
  app._select2FW = app._select2FW || [];
  $(this).each(function(){
    app._select2FW.push(new Select2FW(this));
  });
};

var Select2FW = function Select2FW(item){
  var select2FW = this;
  select2FW.$el = $(item);

  select2FW.$el.select2({
    minimumResultsForSearch: 5,
    width: '100%'
  });

  select2FW.$el.on('destroyed',function(){
    app._select2FW.splice(app._select2FW.indexOf(select2FW),1);
    select2FW = undefined;
  });

  return select2FW;
}

Select2FW.prototype.destroy = function() {
  this.$el.remove();
};


$(function () {
  $('select').not('.custom').select2FW();
  utils.addHtmlHook('select:not(.custom)', function(item){
    item.select2FW();
  });
});
