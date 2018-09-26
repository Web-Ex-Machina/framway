var SliderFW = Object.getPrototypeOf(app).SliderFW = new Component("sliderFW");
SliderFW.debug = false;

SliderFW.prototype.onCreate = function(){
  var slider = this;
  slider.content = {$el : slider.$el.find('.sliderFW__container'),};
  slider.content.items = slider.content.$el.find('.sliderFW__item');
  slider.$nav = $('<div class="sliderFW__nav"></div>').appendTo(slider.content.$el);
  slider.content.items.each(function(){
    $('<span class="sliderFW__nav__item"></span>').appendTo(slider.$nav);
  });
  slider.arrowed = slider.getData('arrows',false);
  slider.loop = slider.getData('loop',false);
  slider.auto = slider.getData('auto',false);
  slider.timerAuto;

  slider.$nav.children().first().addClass('active');
  slider.$nav.children().bind('click',function(e){
    slider.$nav.children().removeClass('active');
    var index = $(this).addClass('active').index();
    $(slider.content.items.removeClass('active').get(index)).addClass('active');
    slider.content.$el.find('.sliderFW__rail').css('transform', 'translate3d('+ (-slider.content.items.get(index).offsetLeft) +'px,0,0)');
  });

  if(slider.loop){
    slider.content.$el.find('.sliderFW__rail').on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e){
      var rail = $(this);
      if(rail.get(0) == e.target){
        rail.addClass('no-transition');
        if(slider.content.items.filter('.active').next().length == 0)
          rail.find('.sliderFW__item').first().appendTo(rail);
        else if(slider.content.items.filter('.active').prev().length == 0)
          rail.find('.sliderFW__item').last().prependTo(rail);
        rail.css('transform', 'translate3d('+ (-slider.content.items.filter('.active').get(0).offsetLeft) +'px,0,0)');
        setTimeout(function () {
          rail.removeClass('no-transition');
        }, 1);
      }
    });
    slider.$nav.children().first().trigger('click');
  }

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
  slider.setBlur();

  // manage swipe event
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

  if(slider.auto)
    slider.autoTrigger();

  $(window).resize(function(){slider.setBlur(); });
  $(document).on('keyup',function(event){slider.keyEvent(event); });
}

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
  if(this.loop){
    if(this.$nav.find('.sliderFW__nav__item.active').next('.sliderFW__nav__item').length)
      this.$nav.find('.sliderFW__nav__item.active').next('.sliderFW__nav__item').trigger('click');
    else
      this.$nav.find('.sliderFW__nav__item').first().trigger('click');
  } else{
    this.$nav.find('.sliderFW__nav__item.active').next('.sliderFW__nav__item').trigger('click');
  }
  if(this.auto){
    clearTimeout(this.timerAuto);
    this.autoTrigger();
  }
};
SliderFW.prototype.goToPrev = function() {
  if(this.loop){
    if(this.$nav.find('.sliderFW__nav__item.active').prev('.sliderFW__nav__item').length)
      this.$nav.find('.sliderFW__nav__item.active').prev('.sliderFW__nav__item').trigger('click');
    else
      this.$nav.find('.sliderFW__nav__item').last().trigger('click');
  } else{
    this.$nav.find('.sliderFW__nav__item.active').prev('.sliderFW__nav__item').trigger('click');
  }
  if(this.auto){
    clearTimeout(this.timerAuto);
    this.autoTrigger();
  }
};

SliderFW.prototype.setBlur = function() {
  var slider = this;

  slider.content.items.each(function(index,item){
    if($(item).find('.sliderFW__item__blur').length){
      $(item).find('.sliderFW__item__blur').width($(item).find('.sliderFW__item__content').outerWidth());
      $(item).find('.sliderFW__item__blur img').width($(item).find('.sliderFW__item__bg img').outerWidth());
    } else {
      var container = $(item).find('.sliderFW__item__bg');
      var imgClone = $('<div class="sliderFW__item__blur"></div>').append($(item).find('.sliderFW__item__bg img').clone()).appendTo(container);
      slider.setBlur();
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
    heightBox = viewport.height - $('#header').outerHeight();
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
