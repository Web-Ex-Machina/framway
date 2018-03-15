// require('./_tabs.scss');
$.fn.Tabs = function Tabs(){
  app._tabs = app._tabs || [];
  $(this).each(function(){
    var tabs = {
      $el : $(this),
      nav : {$el : $(this).children('.tabs__nav,tabs__nav'),},
      content : {$el : $(this).children('.tabs__content,tabs__content'),},
    };

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

    app._tabs.push(tabs);
  });
};
$(function () {
  $('.tabs,tabs').Tabs();

  utils.addHtmlHook('.tabs,tabs', function(item){
    console.log("tabs added to dom");
    $(item).Tabs();
  });
});

// module.exports = $.fn.Tabs;
