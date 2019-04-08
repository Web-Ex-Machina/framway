var Konami = Object.getPrototypeOf(app).Konami = new Component("konami");
Konami.debug = true;
Konami.createdAt      = "1.4.11";
Konami.lastUpdate     = "1.4.11";
Konami.version        = "1";
// Konami.loadingMsg     = "This message will display in the console when component will be loaded.";

Konami.prototype.onCreate = function(){
  var konami = this;
  konami.keys = [];
  konami.code = konami.code || function(){
    console.log('Konami code fired !');
  };

  konami.exec = function(){
    konami.code();
    $(document).bind('keydown', konami.press);
    konami.keys = [];
  }

  konami.press = function(e){
    konami.keys.push(e.keyCode);
    if (konami.keys.toString().indexOf("38,38,40,40,37,39,37,39,66,65") >= 0) {
      $(document).unbind('keydown', konami.press);
      konami.exec();
    }
  }

  $(document).bind('keydown', konami.press);
}

/**
 * execute code when the correct key sequence is confirmed
 */
// Konami.prototype.exec = function(){
//   var konami = this;
//   konami.code();
//   $(this).bind('keydown', konami.press);
//   konami.keys = [];
// }

/**
 * record key sequences
 */
// Konami.prototype.press = function(e,konami){
//   konami.keys.push(e.keyCode);
//   if (konami.keys.toString().indexOf("38,38,40,40,37,39,37,39,66,65") >= 0) {
//     $(this).unbind('keydown', konami.press);
//     konami.exec();
//   }
// }



// // Konami code
// var kKeys = [];
// function Kpress(e){
//     kKeys.push(e.keyCode);
//     if (kKeys.toString().indexOf("38,38,40,40,37,39,37,39,66,65") >= 0) {
//         jQuery(this).unbind('keydown', Kpress);
//         kExec();
//     }
// }
// function kExec()
// {
//   $('html,body').animate({scrollTop:0}, '500', 'swing');
//   $('body').css('overflow', 'hidden');

//   $('body').append('<div class="secret_window"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/y8-LH_VUROk?autoplay=1&controls=0&iv_load_policy=3&showsearch=0&showinfo=0&rel=0&loop=1&fs=0&start=9" frameborder="0" allowfullscreen></iframe><div class="mask"></div></div>');
//   doBounce($("div.secret_window"), 3, '100px', 300);
//   function doBounce(element, times, distance, speed)
//   {
//       element.animate({ width: '-='+distance, height: '-='+distance, marginTop: '+=100px'}, speed)
//       .animate({ width: '+='+distance, height: '+='+distance, marginTop: '-=100px'}, speed);

//       doBounce($("div.secret_window"), 3, '100px', 300);
//   }
//   jQuery(this).bind('keydown', Kpress);
//   kKeys = [];
// }