require('hammerjs'); // importing hammer.js
require('jquery-mousewheel'); // importing jquery-mousewheel

var config = require('../framway.config.js');
require('./scss/framway.scss');
require('./js/framway.js');

app.debug = false;
app.loadThemes(config.themes);
app.loadComponents(config.components);

$(function(){
  setTimeout(function(){
    if(app.debug){
      app.log('APP READY');
      console.log(app);
    }
  });
})