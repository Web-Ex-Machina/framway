function Framway(){
  var framway = this;
  framway.components = [];
  framway.$debug = $('<div id="debug"></div>').appendTo($('body'));

  return framway;
};

/**
 * load the components passed in parameters
 * @param  {Array of Strings} arrComponents [array containing the components names]
 */
Framway.prototype.loadComponents = function(arrComponents){
  var framway = this;
  $.each(arrComponents,function(index,name){
    try{
      require('../components/'+name+'/'+name+'.js');
      framway.components.push(name);
    } catch(e){
      framway.log('Component '+ name + ' failed to load.\n'+e);
    }
  });
  if(framway.components.length)
    framway.log('Component(s) sucessfully loaded: \n - '+ framway.components.join('\n - '));
  return framway;
};


/**
 * display things in the browser's console and in a custom debug window
 * @param  {[type]}  strLog
 * @param  {Boolean} blnDebug
 * TODO : style debug window
 */
Framway.prototype.log = function(strLog, blnDebug = false){
  var framway = this;
  if (blnDebug) {
      var content = framway.$debug.html();
      content += strLog.replace(/(?:\r\n|\r|\n)/g,'<br>') + '<br>';
      framway.$debug.html(content).show();
      framway.$debug.scrollTop(framway.$debug[0].scrollHeight);
  }
  console.log("------------------------------------");
  console.log(strLog);
  return framway;
};

/**
 * clear the custom debug window
 */
Framway.prototype.clearLogs = function(){
  var framway = this;
  framway.$debug.html('').hide();
  return framway;
};

$(function () {
  console.log(app);
});

global.utils = require('../js/utils.js');
global.app = new Framway();