var HeroFW = Object.getPrototypeOf(app).HeroFW = new Component("heroFW");
// HeroFW.debug = true;
HeroFW.createdAt      = "1.0.0";
HeroFW.lastUpdate     = "1.4.15";
HeroFW.version        = "1.1.2";
// HeroFW.loadingMsg     = "This message will display in the console when component will be loaded.";

HeroFW.prototype.onCreate = function(){
  var heroFW = this;
  heroFW.content = {$el : heroFW.$el.find('.heroFW__content'),};
  heroFW.setHeight();
}

HeroFW.prototype.onResize = function(){
  var heroFW = this;
  heroFW.setHeight();
}

HeroFW.prototype.setHeight = function() {
  var heightBox = 0;
  if(this.$el.data('height') && this.$el.data('height') != ""){
    heightBox = this.$el.data('height');
    if(this.$el.data('height') == "viewport"){
      // heightBox = viewport.height - ($('#header').outerHeight() || 0) - ($('.topbar').outerHeight() || 0);
      heightBox = utils.getViewportHeight();
    }
  }
  if(heightBox != 0)
    this.$el.css('height',heightBox);
  return this;
};