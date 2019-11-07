var pell = require('pell');

var TextEditor = Object.getPrototypeOf(app).TextEditor = new Component("text-editor");
// TextEditor.debug = true;
TextEditor.createdAt      = "1.4.14";
TextEditor.lastUpdate     = "1.4.14";
TextEditor.version        = "1";
// TextEditor.loadingMsg     = "This message will display in the console when component will be loaded.";

TextEditor.prototype.onCreate = function(){
  var editor = this;
  editor.$el.wrap('<div class="text-editor__wrapper"></div>');
  editor.$input = $('<div class="text-editor__input"></div>').insertAfter(editor.$el);
  editor.pell = pell.init({
    element: editor.$input[0],
    onChange: function(html){
      editor.$el.val(html);
    },
    classes:{
      // actionbar: 'pell-actionbar',
      // button: 'pell-button',
      // content: 'pell-content',
      // selected: 'pell-button-selected'
    },
    defaultParagraphSeparator: 'p',
    actions:[
      'bold',
      'italic',
      'underline',
      {
        name: 'olist',
        icon: '<i class="fas fa-list-ol"></i>',
      },
      {
        name: 'ulist',
        icon: '<i class="fas fa-list-ul"></i>',
      },
      'line',
      {
        name: 'link',
        icon: '<i class="fas fa-link"></i>',
      },
    ],
  });
  editor.$el.on('change',function(){
    editor.pell.content.innerHTML = editor.$el.val();
  }).trigger('change');
}

