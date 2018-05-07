$.fn.heroFW = function heroFW(){
  app._heroFW = app._heroFW || [];
  $(this).each(function(){
    app._heroFW.push(new HeroFW(this));
  });
};

var HeroFW = function HeroFW(item){
  var heroFW = this;
  heroFW.$el = $(item);
  heroFW.content = {$el : $(item).find('.heroFW__content'),};

  heroFW.setHeight();

  heroFW.$el.on('destroyed',function(){
    app._heroFW.splice(app._heroFW.indexOf(heroFW),1);
    heroFW = undefined;
  });

  return heroFW;
}

HeroFW.prototype.setHeight = function() {
  var heightBox = 0;
  if(this.$el.data('height') && this.$el.data('height') != ""){
    heightBox = this.$el.data('height');
    if(this.$el.data('height') == "viewport"){
      heightBox = viewport.height - $('#header').outerHeight();
    }
  }
  if(heightBox != 0)
    this.$el.height(heightBox);
  return this;
};

HeroFW.prototype.destroy = function() {
  this.$el.remove();
};

var timerResize;
HeroFW.prototype.resize = function() {
  var heroFW = this;
  clearTimeout(timerResize);
  timerResize = setTimeout(function(){
    heroFW.setHeight();
  },300);
};

$(function () {
  $('.heroFW').heroFW();
  utils.addHtmlHook('.heroFW', function(item){
    item.heroFW();
  });

  $(window).resize(function(){
    $.each(app._heroFW, function(){
      this.resize();
    });
  });
});
