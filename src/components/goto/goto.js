var Goto = new Component("goto");
Goto.debug = false;

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