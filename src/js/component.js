// constructor
var Component = function Component(name){
  var $name = utils.lowerize(name);

  // component's class creation
  var component = {
    [name]: function(el){
      var obj = this;
      obj.$el = $(el);
      obj.type = name;

      // event destroyed
      obj.$el.on('destroyed',function(){
        obj.log('destroyed');
        app.components_loaded['_'+$name].splice(app.components_loaded['_'+$name].indexOf(obj),1);
        obj = undefined;
      });
    }
  };
  component = component[name];
  component.prototype = Object.create(Component.prototype);
  component.prototype.constructor = component;

  // component's private vars and stuff
  component.debug = app.debug;

  // component's jQuery plugin creation
  $.fn[$name] = function(){
    app.components_loaded['_'+$name] = app.components_loaded['_'+$name] || [];
    $(this).each(function(){
      var obj = new component(this);
      app.components_loaded['_'+$name].push(obj);
      obj.onCreate();
    });
  }

  // component's events
  $(function () {
    if(component.debug){
      console.groupCollapsed('COMPONENT '+name+' DEBUG DISPLAY');
      console.group('Methods');
      console.log('Owned :',Object.getOwnPropertyNames(component.prototype));
      console.log('Inherited :',Object.getOwnPropertyNames(Object.getPrototypeOf(component.prototype)));
      console.groupEnd();
      // console.log('Methods :',utils.mergeArrays(Object.getOwnPropertyNames(Object.getPrototypeOf(component.prototype)),Object.getOwnPropertyNames(component.prototype)));
      console.group('Attributes');
      for (var prop in component) {
        console.log(prop+' ['+typeof component[prop]+'] : ', component[prop]);
      }
      console.groupEnd();
      console.groupEnd();
    }
    // dom initialisation hook
    $('.'+$name)[$name]();
    utils.addHtmlHook('.'+$name, function(item){
      item[$name]();
    });

    // resize hook
    var timerResize;
    $(window).resize(function(){
      clearTimeout(timerResize);
      timerResize = setTimeout(function(){
        $.each(app.components_loaded['_'+$name], function(index,obj){
          obj.onResize();
        });
      },300);
    });

  });

  return component;
}

/**
 * remove the component from the dom
 */
Component.prototype.destroy = function() {
  this.$el.remove();
};

/**
 * callback on resize event
 */
Component.prototype.onResize = function(){
  this.log('resized','This is the callback on resize event. You can overwrite it by redefining '+this.type+'.prototype.onResize');
};

/**
 * callback on component's creation
 */
Component.prototype.onCreate = function(){
  this.log('created','This is the callback on the component\'s creation. You can overwrite it by redefining '+this.type+'.prototype.onCreate');
};

/**
 * Display logs in console, if debug mode is enable
 * @param  {String} action [describe the action that was logged]
 */
Component.prototype.log = function(title,msg = false){
  if(this.constructor.debug){
    var tstamp = new Date();
    tstamp = '['+ tstamp.getHours() +':'+ tstamp.getMinutes() +':'+ tstamp.getSeconds() +']';
    app.log(tstamp+" Component "+this.type+": "+title);
    if(msg)
      console.log(msg);
    console.log(this);
  }
}

module.exports = Component;