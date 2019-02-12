var HeroFW = Object.getPrototypeOf(app).HeroFW = new Component("heroFW");
HeroFW.debug = false;

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
      heightBox = viewport.height - ($('#header').outerHeight() || 0);
    }
  }
  if(heightBox != 0)
    this.$el.height(heightBox);
  return this;
};