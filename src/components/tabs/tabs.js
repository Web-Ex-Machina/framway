var Tabs = Object.getPrototypeOf(app).Tabs = new Component("tabs");
Tabs.debug = false;

Tabs.prototype.onCreate = function(){
  var tabs = this;
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
}
