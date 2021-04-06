require('hammerjs'); // importing hammer.js
require('jquery-mousewheel'); // importing jquery-mousewheel

var config = require('../framway.config.js');
require('./scss/framway.scss');
require('./js/framway.js');

app.debug = false;
app.loadComponents(config.components);
app.loadThemes(config.themes);


app.configCSS = require('./scss/_config.scss');
$.each(app.themes,function(index,theme){
	config = Object.assign(config,require('./themes/'+theme+'/_config.scss'));
});
$.each(app.configCSS,function(key,value){
	if(value[0] == '(' && value[value.length - 1] == ")"){
	  var objValue = value.replace('(','{').replace(')','}').replace(/ /g, '')
	          .replace(/([\w]+):/g, '"$1":')
	          .replace(/:([\w]+)/g, ':"$1"')
	          .replace(/:#([\w]+)/g, ':"#$1"')
	          .replace(/:([\d]+)/g, function(m, num) {return ':'+parseFloat(num)})
	          .replace(/:([[{])/g, ':$1');
	  app.configCSS[key] = JSON.parse(objValue);
	}
});
$(function(){
  setTimeout(function(){
    if(app.debug){
      app.log('APP READY');
      console.log(app);
    }
  });
})