var Sidepanel = Object.getPrototypeOf(app).Sidepanel = new Component("sidepanel");
// Sidepanel.debug = true;
Sidepanel.createdAt      = "1.4.12";
Sidepanel.lastUpdate     = "1.4.12";
Sidepanel.version        = "1";
// Sidepanel.loadingMsg     = "This message will display in the console when component will be loaded.";

Sidepanel.prototype.onCreate = function(){
  var panel = this;
  panel.$el.wrapInner('<div class="sidepanel__content"></div>');
  panel.$backdrop  = $('<div class="sidepanel__backdrop"></div>').appendTo(panel.$el);
  panel.$content   = panel.$el.find('.sidepanel__content');
  panel.$close     = $('<div class="sidepanel__close"><i class="fas fa-times"></i></div>').prependTo(panel.$content);
  panel.name       = (panel.name !== undefined)       ? panel.name           : panel.getData('name', 'sidepanel-'+utils.uniqid());
  panel.direction  = (panel.direction !== undefined)  ? panel.direction      : panel.getData('direction','left'); // left, right, top, bottom
  panel.width      = (panel.width !== undefined)      ? panel.width          : panel.getData('width',false);
  panel.background = (panel.background !== undefined) ? panel.background     : panel.getData('bg',false);
  panel.openAuto   = (panel.openAuto !== undefined)   ? panel.openAuto       : panel.getData('openauto',false);
  panel.openDelay  = (panel.openDelay !== undefined)  ? panel.openDelay      : panel.getData('opendelay',0);
  panel.isOpen     = false;

  if(panel.direction)  panel.$content.addClass('from--'+panel.direction);
  if(panel.width)      panel.$content.css('max-width',panel.width);
  if(panel.background) panel.$content.addClass('bg-'+panel.background);

  panel.$el.attr('data-name',panel.name);

  // panel.$el.appendTo($('body'));
  if(Sidepanel.debug) panel.log('panel created');
  if(panel.openAuto)
    setTimeout(function(){panel.open()},panel.openDelay);
}

Sidepanel.prototype.onDestroy = function(){
  var panel = this;
  if(Sidepanel.debug) panel.log('panel destroyed');
}

Sidepanel.prototype.onResize = function(){
  var panel = this;
  if(panel.direction == 'bottom'){
    if(panel.$content.outerHeight() >= viewport.height)
      panel.$content.addClass('forced--top');
    else
      panel.$content.removeClass('forced--top');
  }
}

Sidepanel.prototype.onOpen = function(){
  var panel = this;
  // panel.$content.focus();
  return panel;
}

Sidepanel.prototype.onClose = function(){
  var panel = this;
  return panel;
}

Sidepanel.prototype.close = function(){
  var panel = this;
  $('html').removeClass('no-overflow');
  panel.$el.removeClass('active');
  panel.isOpen = false;
  if(panel.onClose)
    panel.onClose();
  return panel;
};

Sidepanel.prototype.open = function(){
  var panel = this;
  $.each(app.components_active.sidepanel.filter(function(item){return !Object.is(item,panel);}),function(){ this.close(); });
  $('html').addClass('no-overflow');
  panel.onResize();
  panel.$el.addClass('active');
  panel.isOpen = true;
  if(panel.onOpen)
    panel.onOpen();
  return panel;
};

$(function(){
  $('body').on('click','.sidepanel',function(e){
    if(!$(e.target).attr('href'))
      e.preventDefault();
    if ($(e.target).hasClass('sidepanel__backdrop')) {
      $(this).sidepanel('get').close();
    } else if($(e.target).hasClass('sidepanel__close')){
      $(this).closest('.sidepanel').sidepanel('get').close();
    }
  });

  $('body').on('click','*[data-sidepanel]',function(e){
    e.preventDefault();
    if($('.sidepanel[data-name="'+$(this).data('sidepanel')+'"]').length)
      $('.sidepanel[data-name="'+$(this).data('sidepanel')+'"]').sidepanel('get').open();
  });

});