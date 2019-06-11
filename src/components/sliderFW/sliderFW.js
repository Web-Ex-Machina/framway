var SliderFW = Object.getPrototypeOf(app).SliderFW = new Component("sliderFW");
// SliderFW.debug = true;
SliderFW.createdAt      = "1.0.0";
SliderFW.lastUpdate     = "1.4.13";
SliderFW.version        = "1.1.3";
// SliderFW.loadingMsg     = "This message will display in the console when component will be loaded.";

SliderFW.prototype.onCreate = function(){
  var slider = this;
  slider.content = {$el : slider.$el.find('.sliderFW__container'),};
  slider.content.items = slider.content.$el.find('.sliderFW__item');
  slider.$nav = $('<div class="sliderFW__nav"></div>').appendTo(slider.content.$el);
  slider.content.items.each(function(){
    $('<span class="sliderFW__nav__item"></span>').appendTo(slider.$nav);
  });
  slider.$rail = slider.content.$el.find('.sliderFW__rail');
  slider.arrowed = slider.getData('arrows',false);
  slider.loop = slider.getData('loop',false);
  slider.auto = slider.getData('auto',false);
  slider.swipe = slider.getData('swipe',true);
  slider.transition = slider.getData('transition','translate');
  slider.blur = (slider.$el.hasClass('content--noblur')) ? false : true;
  slider.timerAuto;

  slider.transitionStart = function(){ if(SliderFW.debug) slider.log('transition started') };
  slider.transitionEnd   = function(){ if(SliderFW.debug) slider.log('transition ended') };
  slider.setTransitions();

  // manage navigation
  slider.$nav.children().first().addClass('active');
  slider.$nav.children().bind('click',function(e){
    slider.$nav.children().removeClass('active');
    var index = $(this).addClass('active').index();
    $(slider.content.items.removeClass('active').get(index)).addClass('active');
    slider.transitionStart();
  });


  // manage arrows
  if(slider.arrowed){
    slider.content.$el.append('<div class="sliderFW__arrow prev"></div><div class="sliderFW__arrow next"></div>');
    slider.$el.find('.sliderFW__arrow').bind('click',function(e){
      if($(this).hasClass('prev'))
        slider.goToPrev();
      if($(this).hasClass('next'))
        slider.goToNext();
    });
  }

  slider.setHeight();
  if(slider.blur) slider.setBlur();
  if(slider.auto) slider.autoTrigger();

  $(window).resize(function(){
    if(slider.blur) slider.setBlur();
  });
  $(document).on('keyup',function(event){ slider.keyEvent(event); });

  slider.onResize();
}

SliderFW.prototype.railSwap = function(){
  var slider = this;
  return new Promise(function(resolve,reject){
    if(SliderFW.debug) slider.log('swapping rail items')
    slider.$rail.addClass('no-transition');
    if(slider.content.items.filter('.active').next().length == 0)
      slider.$rail.find('.sliderFW__item').first().appendTo(slider.$rail);
    else if(slider.content.items.filter('.active').prev().length == 0)
      slider.$rail.find('.sliderFW__item').last().prependTo(slider.$rail);
    setTimeout(function () {
      slider.$rail.removeClass('no-transition');
    }, 1);
      resolve();
  });
}

SliderFW.prototype.setTransitions = function(transition = this.transition){
  var slider = this;

  if(slider.swipe){
    var swipeSlide = new Hammer(slider.$el.get(0));
      swipeSlide.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });

    var swipeEvents = function(event){
      switch(event.type){
          case 'swipeleft':
            slider.goToNext(); break;
          case 'swiperight':
            slider.goToPrev(); break;
          default: break;
      }
    };
    swipeSlide.on('swipeleft swiperight', swipeEvents);
  }

  switch(transition){
    case 'translate':
      slider.transitionStart = function(){
        if(SliderFW.debug) slider.log('transition started - '+transition)

        if(slider.loop && slider.swipe)
          swipeSlide.off('swipeleft swiperight', swipeEvents);
        // slider.railSwap().then(function(){
          slider.$rail.css('transform', 'translate3d('+ (-slider.content.items.filter('.active').get(0).offsetLeft + (slider.content.$el.outerWidth() - slider.content.items.filter('.active').outerWidth())/2) +'px,0,0)');
        // });
      };

      slider.transitionEnd = function(){
        if(SliderFW.debug) slider.log('transition ended - '+transition)
        slider.$rail.css('transform', 'translate3d('+ (-slider.content.items.filter('.active').get(0).offsetLeft + (slider.content.$el.outerWidth() - slider.content.items.filter('.active').outerWidth())/2) +'px,0,0)');
        if(slider.loop && slider.swipe)
          swipeSlide.on('swipeleft swiperight', swipeEvents);
      };

      if(slider.loop){
        slider.$rail.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e){
          if(slider.$rail.get(0) == e.target){
            slider.railSwap().then(function(){
              slider.transitionEnd();
            })
          }
        });
        slider.$nav.children().first().trigger('click');
      } else {
        slider.$rail.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e){
          slider.transitionEnd();
        });
      }
    break;
    case 'fade':
    case 'none':
      slider.transitionStart = function(){ if(SliderFW.debug) slider.log('transition started - '+transition) };
      slider.transitionEnd   = function(){ if(SliderFW.debug) slider.log('transition ended - '+transition) };
    break
    default: break;
  }
};

SliderFW.prototype.onResize = function(){
  var slider = this;
  slider.$nav.find('.sliderFW__nav__item.active').trigger('click');
  slider.setHeight();
}

SliderFW.prototype.autoTrigger = function() {
  var slider = this;
  slider.timerAuto = setTimeout(function(){
      slider.goToNext()
  },5600);
};

SliderFW.prototype.goToNext = function() {
  var slider = this;
  if(slider.loop){
    if(slider.$nav.find('.sliderFW__nav__item.active').next('.sliderFW__nav__item').length)
      slider.$nav.find('.sliderFW__nav__item.active').next('.sliderFW__nav__item').trigger('click');
    else
      slider.$nav.find('.sliderFW__nav__item').first().trigger('click');
  } else{
    slider.$nav.find('.sliderFW__nav__item.active').next('.sliderFW__nav__item').trigger('click');
  }
  if(slider.auto){
    clearTimeout(slider.timerAuto);
    slider.autoTrigger();
  }
};
SliderFW.prototype.goToPrev = function() {
  var slider = this;
  if(slider.loop){
    if(slider.$nav.find('.sliderFW__nav__item.active').prev('.sliderFW__nav__item').length)
      slider.$nav.find('.sliderFW__nav__item.active').prev('.sliderFW__nav__item').trigger('click');
    else
      slider.$nav.find('.sliderFW__nav__item').last().trigger('click');
  } else{
    slider.$nav.find('.sliderFW__nav__item.active').prev('.sliderFW__nav__item').trigger('click');
  }
  if(slider.auto){
    clearTimeout(slider.timerAuto);
    slider.autoTrigger();
  }
};

SliderFW.prototype.setBlur = function() {
  var slider = this;
  slider.content.items.each(function(index,item){
    if($(item).find('.sliderFW__item__content').length){
      if($(item).find('.sliderFW__item__blur').length){
        $(item).find('.sliderFW__item__blur').width($(item).find('.sliderFW__item__content').outerWidth());
        $(item).find('.sliderFW__item__blur img').width($(item).find('.sliderFW__item__bg img').outerWidth());
      } else {
        var container = $(item).find('.sliderFW__item__bg');
        var imgClone = $('<div class="sliderFW__item__blur"></div>').append($(item).find('.sliderFW__item__bg img').clone()).appendTo(container);
        slider.setBlur();
      }
    }
  })
};

SliderFW.prototype.setHeight = function() {
  var slider = this;
  var heightBox = 0;
  if(slider.$el.data('height') && slider.$el.data('height') != ""){
    heightBox = slider.$el.data('height');
  }
  else{
    slider.$el.find('.sliderFW__item__content').css('height','auto');
    slider.content.items.each(function(index,item){
      if($(item).children('.sliderFW__item__content').get(0).scrollHeight + slider.$nav.height() > heightBox){
        heightBox = $(item).children('.sliderFW__item__content').get(0).scrollHeight + slider.$nav.height();
      }
    });
    slider.$el.find('.sliderFW__item__content').css('height','100%');
  }
  if(this.$el.data('height') == "viewport"){
    heightBox = viewport.height - ($('#header').outerHeight() || 0) - ($('.topbar').outerHeight() || 0);
  }
  slider.content.$el.height(heightBox);
  return this;
};

SliderFW.prototype.keyEvent = function(event){
  switch(event.which){
      case 37: // left
          this.goToPrev(); break;
      case 39: // right
          this.goToNext(); break;
      case 38: // up
      case 40: // down
      default: return; // exit this handler for other keys
  }
  event.preventDefault();
};
