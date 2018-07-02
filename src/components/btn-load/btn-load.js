var BtnLoad = new Component("btn-load");
// BtnLoad.debug = true;
BtnLoad.iconSelector = '.fas.fa-spinner.fa-pulse';
BtnLoad.icon = '<i class="'+BtnLoad.iconSelector.replace(/\./g,' ').trim()+'"></i>';

BtnLoad.prototype.onCreate = function(){
  var btn = this;
  btn.process = window[btn.$el.data('process')];
  btn.icon = btn.$el.data('icon');
  btn.textIdle = btn.$el.text();
  btn.textLoading = btn.$el.data('text') || btn.$el.text();
  if(btn.icon)
    btn.textLoading += BtnLoad.icon;

  btn.$el.bind('click',function(){
    if(typeof btn.process == "function"){
      btn.toggleState();
      btn.process().then(function(data){
        btn.toggleState('idle');
      }).catch(function(data){
        btn.toggleState('failed');
      });
    }
  });
  btn.log('created');
}

BtnLoad.prototype.toggleState = function(state){
  var btn = this;
  switch(state){
    case 'idle':
      btn.$el.html(btn.textIdle);
    break;
    case 'failed':
      btn.$el.html(btn.textIdle);
    break;
    case 'loading':
    default:
      btn.$el.html(btn.textLoading);
      if(btn.icon){
        btn.$el.find(BtnLoad.iconSelector).css({
          'margin-left':  parseInt(btn.$el.css('padding-right')) / 2,
          'margin-right': parseInt(btn.$el.css('padding-right')) / -2,
        });
      }
    break;
  }
};
