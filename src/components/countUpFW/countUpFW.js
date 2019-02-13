var CountUp = require('countUp');
var CountUpFW = Object.getPrototypeOf(app).CountUpFW = new Component("countUpFW");
// CountUpFW.debug = true;
CountUpFW.createdAt      = "1.0.0";
CountUpFW.lastUpdate     = "1.4.3";
CountUpFW.version        = "1";
// CountUpFW.loadingMsg     = "This message will display in the console when component will be loaded.";

CountUpFW.prototype.onCreate = function(){
  var countUp = this;
  countUp.startVal = (countUp.startVal !== undefined) ? countUp.startVal : countUp.getData('startval',0);
  countUp.endVal = (countUp.endVal !== undefined) ? countUp.endVal : countUp.getData('endval',0);
  countUp.decimals = (countUp.decimals !== undefined) ? countUp.decimals : countUp.getData('decimals',0);
  countUp.duration = (countUp.duration !== undefined) ? countUp.duration : countUp.getData('duration',2);
  countUp.delay = (countUp.delay !== undefined) ? countUp.delay : countUp.getData('delay',0);
  countUp.target = (countUp.$el.find('.countUpFW__num').length) ? countUp.$el.find('.countUpFW__num').get(0) : countUp.$el.get(0);
  countUp.options = {
    useEasing: true,
    useGrouping: true,
    separator: '',
    decimal: '.',
  }

  countUp.anim = new CountUp(countUp.target,countUp.startVal,countUp.endVal,countUp.decimals,countUp.duration,countUp.options);
  if(!countUp.anim.error)
    setTimeout(function(){countUp.anim.start()},countUp.delay*1000);
  else
    console.log(countUp.anim.error);
}
