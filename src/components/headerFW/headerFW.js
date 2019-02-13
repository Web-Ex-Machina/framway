var HeaderFW = Object.getPrototypeOf(app).HeaderFW = new Component("headerFW");
// HeaderFW.debug = false;
HeaderFW.createdAt      = "1.0.0";
HeaderFW.lastUpdate     = "1.4.4";
HeaderFW.version        = "1";
// HeaderFW.loadingMsg     = "This message will display in the console when component will be loaded.";

HeaderFW.prototype.onCreate = function(){
  var header = this;
  header.$clone = header.$el.clone().attr('id','headerFW--clone').addClass('stick').insertAfter(header.$el);
  header.$headbanner = header.$el.find('.headerFW__headbanner');
  header.$nav = header.$el.find('.headerFW__nav');
  header.$navInline = header.$nav.find('.headerFW__nav__inline');
  header.$navPanel = $('<div class="headerFW__nav__panel"></div>').appendTo(header.$nav);
  header.$toggler = $('<div class="headerFW__nav__toggler"><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>').appendTo(header.$nav);
  header.$loader = $('<div class="loader"><i class="fas fa-circle-notch fa-spin"></i></div>').insertAfter(header.$nav);
  header.hasStick = header.getData('stick',true);
  header.$stickyEl = header.$el;
  if(header.$el.hasClass('headbanner--above'))
    header.$stickyEl = header.$nav;

  header.$clone.find('.headerFW__nav').addClass('active');
  header.$clone.find('a,nav,h1').each(function(index,item){
    $(item).replaceWith($('<span/>').addClass(item.className).attr('id',item.id).html($(item).html()));
  });
  header.$clone.find("[itemtype],[itemscope],[itemprop]").removeAttr('itemtype itemscope itemprop');

  // PANEL CONSTRUCT
  header.navPanelMenus = {};
  header.$navInline.find('ul').each(function(index,menu){
    var ID = 'root';
    // define menu's id from it's parent's label
    if($(menu).parent('li').length)
      ID = utils.normalize($(menu).parent('li').children().not('ul').text());

    // clone the corresponding html
    header.navPanelMenus[ID] = {$el : $(menu).clone()};

    // search for li that have sub ul
    header.navPanelMenus[ID].$el.children('li').each(function(index,item){
      if($(item).children('ul').length){
        $(item).append('<div class="toggler"></div>');
      }
    });
    // remove useless html
    header.navPanelMenus[ID].$el.find('ul').remove();

    // set parent toggler
    if(ID != 'root'){
      var label = 'Retour ';
      if($(menu).parent('li').parent('ul').parent('li').length){
        label += $(menu).parent('li').parent('ul').parent('li').clone().children().not('ul').text();
        header.navPanelMenus[ID].parentID = utils.normalize($(menu).parent('li').parent('ul').parent('li').clone().children().not('ul').text());
      }
      else
        header.navPanelMenus[ID].parentID = 'root';
      header.navPanelMenus[ID].$el.prepend('<div class="toggler--parent" data-parent="'+header.navPanelMenus[ID].parentID+'"><i class="fas fa-long-arrow-alt-left"></i><span>'+label+'</span></div>');
    }
    header.$navPanel.append(header.navPanelMenus[ID].$el);
  });

  // EVENTS
  // click on global toggler
  header.$toggler.on('click',function(e){
    header.$toggler.toggleClass('active');
    header.$navPanel.toggleClass('active');
    if(header.$toggler.hasClass('active')){
      // if(header.hasStick)
        // header.$el.addClass('stick');
      header.$clone.addClass('reduced');
      header.$el.addClass('reduced');
    }
    else{
      if(header.hasStick)
        header.$el.removeClass('stick');
      window.dispatchEvent( new Event('scroll') );
    }
  });

  // click on submenu toggler
  $('body').on('click','.headerFW__nav__panel .toggler',function(e){
    var targetID = utils.normalize($(this).parent('li').children().not('ul').text());
    header.$navPanel.find('ul').removeClass('active');
    header.navPanelMenus[targetID].$el.addClass('active');
  });
  // click on back from submenu toggler
  $('body').on('click','.headerFW__nav__panel .toggler--parent',function(e){
    header.$navPanel.find('ul').removeClass('active');
    header.navPanelMenus[$(this).data('parent')].$el.addClass('active');
  });

  delete Hammer.defaults.cssProps.userSelect;
  header.menuSwipe = new Hammer($('body').get(0));
  header.menuSwipe.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 150 });
  header.menuEvents = function(event){
      switch(event.type){
          case 'swipeleft':
            if(header.$navPanel.hasClass('active'))
              header.$toggler.trigger('click');
          break;
          case 'swiperight':
            if(!header.$navPanel.hasClass('active'))
              header.$toggler.trigger('click');
            break;
          default: break;
      }
  };

  // scroll listener
  window.addEventListener('scroll', function(){
    if(header.hasStick){
      header.$el.removeClass('stick');
      if(header.$stickyEl.offset().top - $(window).scrollTop() < 0 || header.$navPanel.hasClass('active'))
        header.$el.addClass('stick');
    }
    // $(window).trigger('resize');
    header.resizeOnTheFly();
  }, true);

  $(window).resize(function(){
    header.resizeOnTheFly();
  });

  // PANEL INIT STATE
  if(utils.getObjSize(header.navPanelMenus) > 0)
    header.navPanelMenus.root.$el.addClass('active');
  else
    header.$el.addClass('no-items');
  $(window).trigger('resize');
  header.onResize();
  // setTimeout(function(){header.$toggler.trigger('click');},1);
};


HeaderFW.prototype.resizeOnTheFly = function(){
  var header = this;
  var isOffset = false;
  if((header.$nav.position().left + header.$navInline.children().outerWidth()).toFixed(2) > header.$el.outerWidth() || header.$nav.position().left.toFixed(2) < 0)
    isOffset = true;
  if(isOffset){
    header.$clone.addClass('reduced');
    header.$el.addClass('reduced');
    header.menuSwipe.on('swipeleft swiperight', header.menuEvents);
  }
  else{
    if(!header.$navPanel.hasClass('active')){
      header.$clone.removeClass('reduced');
      header.$el.removeClass('reduced');
    }
    header.menuSwipe.off('swipeleft swiperight');
  }
};
HeaderFW.prototype.onResize = function(){
  var header = this;
  header.$navInline.find('ul ul').addClass('no-transition').removeClass('offset-right').each(function(){
    var offsetRight = $(this).offset().left + $(this).outerWidth();
    if(offsetRight > viewport.width)
      $(this).addClass('offset-right');
  }).removeClass('no-transition');
  header.$nav.addClass('active');
};

