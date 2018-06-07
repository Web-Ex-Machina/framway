function Framway(){
  var framway = this;
  framway.components = [];
  framway.themes = [];
  framway.useNotif = true;
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
 * load the components passed in parameters
 * @param  {Array of Strings} arrComponents [array containing the components names]
 */
Framway.prototype.loadThemes = function(arrThemes){
  var framway = this;
  $.each(arrThemes,function(index,name){
    try{
      require('../themes/'+name+'/'+name+'.js');
      framway.themes.push(name);
    } catch(e){
      framway.log('Component '+ name + ' failed to load.\n'+e);
    }
  });
  if(framway.themes.length)
    framway.log('Theme(s) sucessfully loaded: \n - '+ framway.themes.join('\n - '));
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
  $('body').on('click','pre .copy',function(e){
    var elem = $(this).parent().clone();
    elem.find('.copy').remove();
    if(utils.copyToClipboard(elem.get(0)))
      notif_fade.success('Copied to clipboard !');
  });
});

require('../js/polyfills.js');
require('../js/component.js');
global.app = new Framway();
global.utils = utils;
global.$ = global.jQuery = $;
