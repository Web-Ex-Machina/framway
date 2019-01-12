// constructor
var Component = function Component(name){
  var $name = utils.lowerize(name);

  // component's class creation
  var component = {
    [name]: function(el){
      var obj = this;
      if(el instanceof HTMLElement || el instanceof jQuery)
        obj.$el = $(el);
      else{
        obj.$el = $('<div></div>').addClass($name);
        if(typeof el === 'object'){
          $.each(el,function(attr,value){
            obj[attr] = value;
          });
        }
      }
      obj.type = name;

      // event destroyed
      obj.$el.on('destroyed',function(){
        app.components_active[$name].splice(app.components_active[$name].indexOf(obj),1);
        obj.onDestroy();
        obj = undefined;
      });
      app.components_active[$name] = app.components_active[$name] || [];
      app.components_active[$name].push(obj);
      obj.onCreate();
    }
  };
  component = component[name];
  component.prototype = Object.create(Component.prototype);
  component.prototype.constructor = component;

  // component's private vars and stuff
  component.debug = false;

  // component's jQuery plugin creation
  $.fn[$name] = function(args = false){
    if(actions[args]){
      return actions[args].apply(this, arguments);
    } else if(typeof args === 'object' || !args){
      return actions.init.apply(this,arguments);
    } else{
      throw new Error('Unknown argument provided on jQuery.'+$name+': '+args);
    }
  }
  // component's actions
  var actions = {
    init: function(){
      $(this).each(function(){
        var obj = new component(this);
      });
    },
    get: function(){
      var arrResult = [];
      $(this).each(function(){
        if(utils.getObjBy(app.components_active[$name],'$el',$(this)))
          arrResult.push(utils.getObjBy(app.components_active[$name],'$el',$(this)));
      });
      if(arrResult.length > 1)
        return arrResult;
      else
        return arrResult[0];
    },
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
        $.each(app.components_active[$name], function(index,obj){
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
 * callback on destroy event
 */
Component.prototype.onDestroy = function(){
  this.log('destroyed','This is the callback on destroy event. You can overwrite it by redefining '+this.type+'.prototype.onDestroy');
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

Component.prototype.getData = function(label, placeholder = undefined){
  var component = this;
  if(component.$el.data(label) !== undefined && component.$el.data(label) !== "")
      return component.$el.data(label);
    else
      return placeholder;
}

module.exports = Component;