$.fn.tabs = function tabs(){
  app._tabs = app._tabs || [];
  $(this).each(function(){
    app._tabs.push(new Tabs(this));
  });
};

var Tabs = function Tabs(item){
  var tabs = this;
  tabs.$el = $(item);
  tabs.nav = {$el : tabs.$el.children('.tabs__nav,tabs__nav'),};
  tabs.content = {$el : tabs.$el.children('.tabs__content,tabs__content'),};

  tabs.nav.buttons = tabs.nav.$el.children('button');
  tabs.content.tabs = tabs.content.$el.children('.tab,tab');

  tabs.nav.buttons.each(function(index,button){
    button = $(button);
    button.bind('click',function(event){
      tabs.nav.buttons.removeClass('active');
      tabs.content.tabs.removeClass('active');
      button.addClass('active');
      $(tabs.content.tabs[index]).addClass('active');
    });
  });
  if(!tabs.nav.buttons.hasClass('active'))
    tabs.nav.buttons.first().trigger('click');
  else
    tabs.nav.buttons.filter('.active').trigger('click');

  tabs.$el.on('destroyed',function(){
    app._tabs.splice(app._tabs.indexOf(tabs),1);
    tabs = undefined;
  });
};

var timerResize;
Tabs.prototype.resize = function() {
  var tabs = this;
  clearTimeout(timerResize);
  timerResize = setTimeout(function(){},300);
};

Tabs.prototype.destroy = function() {
  this.$el.remove();
};

$(function () {
  $('.tabs,tabs').tabs();
  utils.addHtmlHook('.tabs,tabs', function(item){
    item.tabs();
  });

  $(window).resize(function(){
    $.each(app._tabs, function(index,tabs){
      this.resize();
    });
  });
});
