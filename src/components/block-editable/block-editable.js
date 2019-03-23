var BlockEditable = Object.getPrototypeOf(app).BlockEditable = new Component("block-editable");
BlockEditable.debug = false;
BlockEditable.createdAt      = "1.4.10";
BlockEditable.lastUpdate     = "1.4.10";
BlockEditable.version        = "1";
// BlockEditable.loadingMsg     = "This message will display in the console when component will be loaded.";

BlockEditable.prototype.onCreate = function(){
  var block = this;
  block.$wrapper = block.$el.wrapAll('<div class="block-editable__wrapper"></div>').parent();
  block.$buttons = $('<div class="block-editable__buttons"></div>').appendTo(block.$wrapper);
  block.buttons  = (block.buttons !== undefined) ? block.buttons : {};

  if(!block.buttons['editStart']){
    block.buttons['editStart'] = {
      $el : $('<button><i class="fas fa-pencil-alt"></i></button>'),
      onClick : function(){
        block.previousContent = block.$el.html();
        block.$el.attr('contenteditable',true).focus();
        this.$el.addClass('hidden');
        block.buttons.editConfirm.$el.removeClass('hidden');
        block.buttons.editCancel.$el.removeClass('hidden');
      },
    }
  }
  if(!block.buttons['editConfirm']){
    block.buttons['editConfirm'] = {
      $el : $('<button class="hidden btn-bg-green"><i class="fas fa-check"></i></button>'),
      onClick : function(){
        block.$el.attr('contenteditable',false);
        this.$el.addClass('hidden');
        block.buttons.editCancel.$el.addClass('hidden');
        block.buttons.editStart.$el.removeClass('hidden');
      },
    }
  }
  if(!block.buttons['editCancel']){
    block.buttons['editCancel'] = {
      $el : $('<button class="hidden btn-bg-orange"><i class="fas fa-times"></i></button>'),
      onClick : function(){
        block.$el.html(block.previousContent);
        block.$el.attr('contenteditable',false);
        this.$el.addClass('hidden');
        block.buttons.editConfirm.$el.addClass('hidden');
        block.buttons.editStart.$el.removeClass('hidden');
      },
    }
  }

  $.each(block.buttons,function(index,button){
    button.$el.appendTo(block.$buttons);
    button.$el.on('click',function(){
      button.onClick();
    });
  });
}