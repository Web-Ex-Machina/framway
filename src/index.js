require('hammerjs'); // importing hammer.js
require('jquery-mousewheel'); // importing jquery-mousewheel

require('./scss/framway.scss');
require('./js/framway.js');
app.loadComponents([
  'tabs',
  'goto',
  'foldingbox',
  'block-std',
  'sliderFW',
  'block-img',
  // 'brick',
  'guideline',
]);
console.log(app);
