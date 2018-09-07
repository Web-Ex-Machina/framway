require('hammerjs'); // importing hammer.js
require('jquery-mousewheel'); // importing jquery-mousewheel

require('./scss/framway.scss');
var config = require('../framway.config.js');

require('./js/framway.js');
app.loadThemes(config.themes);
app.loadComponents(config.components);

$(function(){
  setTimeout(function(){
    app.log('APP READY');
    console.log(app);
  });
})