require('hammerjs'); // importing hammer.js
require('jquery-mousewheel'); // importing jquery-mousewheel

require('./scss/framway.scss');
require('./js/framway.js');
app.loadComponents([
  'tabs',
  'goto',
  'foldingbox',
  'sliderFW',
  'heroFW',
  'block-std',
  'block-img',
  'list-block',
  'guideline',
]);
console.log(app);
