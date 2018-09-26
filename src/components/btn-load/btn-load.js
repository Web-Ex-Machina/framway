var BtnLoad = Object.getPrototypeOf(app).BtnLoad = new Component("btn-load");
// BtnLoad.debug = true;
BtnLoad.iconSelector = '.fas.fa-spinner.fa-pulse';
BtnLoad.icon = '<i class="'+BtnLoad.iconSelector.replace(/\./g,' ').trim()+'"></i>';

BtnLoad.prototype.onCreate = function(){
  var btn = this;
  btn.process = window[btn.getData('process')];
  btn.icon = btn.getData('icon',true);
  btn.result = btn.getData('result',true);
  btn.reset = btn.getData('reset',true);
  btn.textIdle = btn.$el.text();
  btn.textLoading = btn.getData('text', btn.$el.text());
  if(btn.icon)
    btn.textLoading += BtnLoad.icon;

  var btnClick = function btnClick(){
    if(typeof btn.process == "function"){
      btn.$el.off('click');
      btn.toggleState();
      btn.process().then(function(data){
        btn.toggleState('idle');
        if(btn.reset)
          btn.$el.on('click', btnClick);
      }).catch(function(data){
        btn.toggleState('failed');
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
        btn.$el.html(btn.textIdle + '<i class="fas fa-check ft-green"></i>');
      else
        btn.$el.html(btn.textIdle);
    break;
    case 'failed':
      if(btn.result)
        btn.$el.html(btn.textIdle + '<i class="fas fa-exclamation-triangle ft-orange" title="An error occured. Please retry or reload the page."></i>');
      else
        btn.$el.html(btn.textIdle);
    break;
    case 'loading':
    default:
      btn.$el.html(btn.textLoading);
    break;
  }
  btn.$el.find('i').css({
    'margin-left':  parseInt(btn.$el.css('padding-right')) / 2,
    'margin-right': parseInt(btn.$el.css('padding-right')) / -2,
  });
};
