var Goto = Object.getPrototypeOf(app).Goto = new Component("goto");
Goto.debug = false;
Goto.createdAt      = "1.0.0";
Goto.lastUpdate     = "1.4.3";
Goto.version        = "1";
// Goto.loadingMsg     = "This message will display in the console when component will be loaded.";

Goto.prototype.onCreate = function(){
  var goto = this;
  goto.$el.on('click',function(e){
    e.preventDefault();
    var target = $(this).data('goto').split(',');
    if (target.length == 1) target = target[0];else {
      $.each(target, function (index, item) {
        if ($('#' + item).length) {
          target = item;
          return false;
        }
      });
    }
    if ($('#' + target).length) {
      var scrollValue = $('#' + target).offset().top - $('header').outerHeight();
      $('body,html').animate({
        scrollTop: scrollValue
      }, 600).promise().then(function(){
        window.location.hash = '#' + target;
        window.location.replace(window.location);
      });
    }
  });
}