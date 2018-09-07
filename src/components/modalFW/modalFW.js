global.ModalFW = new Component("modalFW");
// ModalFW.debug = true;

ModalFW.prototype.onResize = function(){};
ModalFW.prototype.onDestroy = function(){
  var modal = this;
  app.components_active.modalFW.splice(app.components_active.modalFW.indexOf(modal),1);
  modal = undefined;
  if(ModalFW.debug) console.log('Modal '+this.name+' has been destroyed \n ');
};
ModalFW.prototype.onCreate = function(){
  var modal = this;
  // attributes
  modal.name        = modal.name        || modal.getData('name', 'modalFW-'+utils.uniqid());
  modal.title       = modal.title       || modal.getData('title',false);
  modal.width       = modal.width       || modal.getData('width',false);
  modal.url         = modal.url         || modal.getData('url',false);
  modal.blnAutoload = modal.blnAutoload || modal.getData('autoload',true);
  modal.blnOpen     = modal.blnOpen     || modal.getData('open',false);
  modal.blnRefresh  = modal.blnRefresh  || modal.getData('refresh',false);
  modal.content     = modal.content     || modal.$el.html();
  modal.buttons     = modal.buttons     || {};
  modal.onOpen      = modal.onOpen      || false;
  modal.onClose     = modal.onClose     || false;
  modal.onRefresh   = modal.onRefresh   || false;
  modal.isOpen      = false;

  if(ModalFW.debug) console.log("Creating "+modal.name+" ... ");
  // abort if the modal already exist
  if(utils.getObjBy(app.components_active.modalFW,'name',modal.name).length){
    if(ModalFW.debug) console.log("Modal "+modal.name+" has been detected a duplicate and will be destroyed");
    modal.$el = modal.$el.clone().remove();
    return false;
  }

  // trigger's settings
  modal.$trigger = modal.$trigger || modal.name;
  if(modal.$trigger instanceof jQuery === false){
    modal.$trigger = $('*[data-modal="'+modal.name+'"]').addClass('modalFW__trigger');
  }

  // html construct
  modal.$el.attr('data-name',modal.name);
  modal.$wrapper = $('<div class="modalFW__wrapper"></div>');
  modal.$header  = $('<div class="modalFW__header"></div>');
  modal.$content = $('<div class="modalFW__content"></div>');
  modal.$loader  = $('<div class="modalFW__loader"><i class="fas fa-circle-notch fa-spin"></i></div>');
  modal.$refresh = $('<div class="modalFW__refresh"><i class="fas fa-sync-alt"></i></div>');
  modal.$close   = $('<div class="modalFW__close"><i class="fas fa-times"></i></div>');
  if(modal.blnRefresh)
    modal.$header.append(modal.$refresh);
  modal.$header.append(modal.$close) ;
  modal.$wrapper
    .append(modal.$header)
    .append(modal.$loader)
    .append(modal.$content)
  ;
  if(modal.width)
    modal.$wrapper.css({
      'width' : modal.width,
      'max-width' : '100%'
    });
  modal.$el.html('').append(modal.$wrapper);
  modal.$el.appendTo($('body'));

  // actions according to parameters
  if(modal.blnAutoload)
    modal.setContent();
  if(modal.$trigger)
    modal.$trigger.addClass('ready');
  if(modal.blnOpen)
    modal.open();

  if(ModalFW.debug) console.log("Modal "+modal.name+" has been created \n ");
  return modal;
}

/**
 * Set the modal's content & title according to its attributes
 */
ModalFW.prototype.setContent = function(){
  var modal = this;
  return new Promise(function(resolve,reject){
    modal.$el.removeClass('ready').find('.modalFW__title,.modalFW__footer').remove();
    if(modal.title)
      modal.$header.prepend('<div class="modalFW__title">'+modal.title+'</div>');
    if(utils.getObjSize(modal.buttons) > 0){
      modal.$footer = $('<div class="modalFW__footer"></div>');
      $.each(modal.buttons,function(index,button){
        var $button = $('<button></button>');
        if(button.url && button.url != '')
          $button = $('<a class="btn" href="'+button.url+'"></a>')
        if(button.label)
          $button.html(button.label);
        else
          $button.html(index);
        if(button.classes)
          $button.addClass(button.classes);
        if(button.action && typeof button.action == 'function' && !button.url)
          $button.on('click',button.action);
        modal.$footer.append($button);
      });
      modal.$wrapper.append(modal.$footer);
    }
    if(modal.url){
      if(utils.isImageUrl(modal.url)){
        var img = new Image();
        img.src = modal.url;
        img.onload = function(){
          modal.$content.html(img);
          modal.$el.addClass('modalFW--img ready');
        };
        img.onerror = function(){
          modal.$content.html('<p class="error">Error: unable to display this image <br>(url: '+modal.url+')</p>');
          modal.$el.addClass('ready');
        };
      } else {
        new Promise(function(resolve,reject){
          $.ajax({
            url: modal.url
          })
          .done(function(result){resolve(result)})
          .fail(function(error) {reject()});
        }).then(function(result){
          modal.$content.html(result);
          modal.$el.addClass('ready');
        }).catch(function(error){
          modal.$content.html('<p class="error">An error occured while requesting '+modal.url+'</p>');
          modal.$el.addClass('ready');
        });
      }
    } else if(modal.content != ''){
      modal.$content.html(modal.content);
      modal.$el.addClass('ready');
    }
    resolve();
  });
};
ModalFW.prototype.open = function(){
  this.$el.addClass('active');
  this.isOpen = true;
  if(!this.autoload && !this.$el.hasClass('ready'))
    this.setContent();
  if(this.onOpen)
    this.onOpen();
  return this;
};
ModalFW.prototype.close = function(){
  this.$el.removeClass('active');
  this.isOpen = false;
  if(this.onClose)
    this.onClose();
  return this;
};
ModalFW.prototype.refresh = function(){
  var modal = this;
  modal.setContent().then(function(){
    if(modal.onRefresh)
      modal.onRefresh();
  });
  return modal;
};

var createModalFromTrigger = function($trigger){
  $trigger = $($trigger).addClass('modalFW__trigger');
  if(ModalFW.debug) console.log("Trying to create modal "+$trigger.data('modal')+" ...");
  if(!$('.modalFW[data-name="'+$trigger.data('modal')+'"]').length){
    if(!$trigger.data('modal')){
      if(ModalFW.debug) console.log('Failed to create modal : please define data-modal\n ');
      return false;
    }
    if(!$trigger.data('content') && !$trigger.attr('href') && !$trigger.data('url')){
      if(ModalFW.debug) console.log('Failed to create modal "'+$trigger.data('modal')+'" : please define data-content, data-url or href attributes \n ');
      return false;
    }
    var objConfig = {
      name : $trigger.data('modal'),
      title: $trigger.data('title'),
      blnOpen : $trigger.data('open'),
      blnAutoload : $trigger.data('autoload'),
      blnRefresh : $trigger.data('refresh'),
      $trigger : $trigger
    };
    if($trigger.data('content'))
      objConfig.content = $trigger.data('content');
    else if($trigger.attr('href'))
      objConfig.url = $trigger.attr('href');
    else if($trigger.data('url'))
      objConfig.url = $trigger.data('url');
    var modal = new ModalFW(objConfig);
  } else {
    if(ModalFW.debug) console.log("Modal "+$trigger.data('modal')+" already exist. Aborting creation \n ");
    $trigger.addClass('ready')
  }
}

$(function () {
  $('body').on('click','.modalFW__refresh',function(e){
    $(this).closest('.modalFW').modalFW('get').refresh();
  });
  $('body').on('click','.modalFW__trigger',function(e){
    e.preventDefault();
    console.log($('.modalFW[data-name="'+$(this).data('modal')+'"]'));
    $('.modalFW[data-name="'+$(this).data('modal')+'"]').modalFW('get').open();
  });
  $('body').on('click','.modalFW',function(e){
    if(!$(e.target).attr('href'))
      e.preventDefault();
    if ($(e.target).hasClass('modalFW')) {
      $(this).modalFW('get').close();
    } else if($(e.target).hasClass('modalFW__close')){
      $(this).closest('.modalFW').modalFW('get').close();
    }
  });

  $('*[data-modal]').not('.modalFW__trigger').each(function(){
    createModalFromTrigger(this);
  });
  utils.addHtmlHook('*[data-modal]:not(.modalFW__trigger)', function(item){
    $(item).each(function(){
      if(ModalFW.debug) app.log("Trigger added to dom for modal "+$(this).data('modal'));
      createModalFromTrigger(this);
    })
  });

});
