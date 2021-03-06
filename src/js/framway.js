function Framway(){
  var framway = this;
  framway.components = [];
  framway.components_active = {};
  framway.themes = [];
  framway.$debug = $('<div id="debug"></div>').appendTo($('body'));
  framway.debug = true;
  framway.useNotif = true;
  framway.version = require('../../package.json').version;

  return framway;
};
/**
 * load the components passed in parameters
 * @param  {Array of Strings} arrComponents [array containing the components names]
 */
Framway.prototype.loadComponents = function(arrComponents){
  var framway = this;
  return new Promise(function(resolve,reject){
    var className = '';
    $.each(arrComponents,function(index,name){
      try{
        for (var i in name.split('-')){
          className += name.split('-')[i].charAt(0).toUpperCase() + name.split('-')[i].slice(1);
        }
        var component = require('../components/'+name+'/'+name+'.js');
        if(framway[className]){
          if(utils.versionToInt(framway.version) < utils.versionToInt(framway[className].createdAt))
            throw 'This component was created in a later framway\'s version ('+framway[className].createdAt+'). Please update the framway before using this component.\nFramway\'s current version: '+framway.version+'';
          if(utils.versionToInt(framway.version) < utils.versionToInt(framway[className].lastUpdate))
            framway.log('Component '+ name + ' is compatible with the current version of the framway, but was updated in a later iteration ('+framway[className].lastUpdate+'). Be aware that problems might occur when using it without upgrading the framway first.\nFramway\'s current version: '+framway.version+'');
          if(framway[className].loadingMsg)
            framway.log('Component '+ name +': \n'+framway[className].loadingMsg);
        }
        framway.components.push(name);
      } catch(e){
        framway.log('Component '+ name + ' failed to load.\n'+e);
      }
    });
    if(framway.components.length && framway.debug)
      framway.log('Component(s) sucessfully loaded: \n - '+ framway.components.join('\n - '));
    resolve();
  });
};

/**
 * load the components passed in parameters
 * @param  {Array of Strings} arrComponents [array containing the components names]
 */
Framway.prototype.loadThemes = function(arrThemes){
  var framway = this;
  return new Promise(function(resolve,reject){
    $.each(arrThemes,function(index,name){
      try{
        require('../themes/'+name+'/'+name+'.js');
        framway.themes.push(name);
      } catch(e){
        framway.log('Theme '+ name + ' failed to load.\n'+e);
      }
    });
    if(framway.themes.length && framway.debug)
      framway.log('Theme(s) sucessfully loaded: \n - '+ framway.themes.join('\n - '));
    resolve();
  });
};

var requireAll = function(r){
  r.keys().forEach(r);
}

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
  console.log('───────────────');
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
global.Component = require('../js/component.js');
global.utils = utils;
global.$ = global.jQuery = $;
global.app = new Framway();
