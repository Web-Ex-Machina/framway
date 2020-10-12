var BtnLoad = Object.getPrototypeOf(app).BtnLoad = new Component("btn-load");
// BtnLoad.debug = true;
BtnLoad.createdAt      = "1.0.0";
BtnLoad.lastUpdate     = "1.4.8";
BtnLoad.version        = "1.2.0";
// BtnLoad.loadingMsg     = "This message will display in the console when component will be loaded.";
//
BtnLoad.iconSelector = '.fas.fa-spinner.fa-pulse';
BtnLoad.icon = '<i class="'+BtnLoad.iconSelector.replace(/\./g,' ').trim()+'"></i>';

BtnLoad.prototype.onCreate = function(){
  var btn = this;

  btn.$clone = btn.$el.clone();
  btn.$clone.find('i,svg').remove();

  btn.process = window[btn.getData('process')];
  btn.icon = btn.getData('icon',true);
  btn.result = btn.getData('result',true);
  btn.reset = btn.getData('reset',true);
  btn.textIdle = btn.$el.html();
  btn.textLoading = btn.getData('text', btn.$el.html());
  if(btn.icon)
    btn.textLoading = btn.textLoading + BtnLoad.icon;

  var btnClick = function btnClick(){
    btn.$el.addClass('no-events');
    if(typeof btn.process == "function"){
      btn.$el.off('click');
      btn.toggleState();
      btn.process(btn).then(function(data){
        btn.toggleState('idle');
        btn.$el.removeClass('no-events');
        if(btn.reset)
          btn.$el.on('click', btnClick);
      }).catch(function(data){
        btn.toggleState('failed');
        btn.$el.removeClass('no-events');
        if(btn.reset)
          btn.$el.on('click', btnClick);
      });
    }
  };
  btn.$el.on('click', btnClick);

  btn.log('created');
}

BtnLoad.prototype.toggleState = function(state){
  var btn = this;
  switch(state){
    case 'idle':
      if(btn.result)
        btn.$el.html(btn.$clone.html() + '<i class="fas fa-check ft-green"></i>');
      else
        btn.$el.html(btn.textIdle);
    break;
    case 'failed':
      if(btn.result)
        btn.$el.html(btn.$clone.html() + '<i class="fas fa-exclamation-triangle ft-orange" title="An error occured. Please retry or reload the page."></i>');
      else
        btn.$el.html(btn.textIdle);
    break;
    case 'loading':
    default:
      btn.$el.html(btn.textLoading);
    break;
  }
};
