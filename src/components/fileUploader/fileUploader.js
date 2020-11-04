var FileUploader = Object.getPrototypeOf(app).FileUploader = new Component("fileUploader");
// FileUploader.debug = true;
FileUploader.createdAt      = "1.4.18";
FileUploader.lastUpdate     = "1.4.18";
FileUploader.version        = "1";
// FileUploader.loadingMsg     = "This message will display in the console when component will be loaded.";

var iconsFiles = {
  'pdf': 'pdf',
  'docx': 'word',
  'xlsx': 'excel',
  'csv': 'csv',
  'pptx': 'powerpoint',
}

FileUploader.prototype.onCreate = function(){
	var fileUploader = this;
	fileUploader.id 		        = (fileUploader.id !== undefined) 			      ? fileUploader.id 			       : (fileUploader.$el.attr('id') ? fileUploader.$el.attr('id') : 'fileUploader--'+utils.uniqid());
	fileUploader.mode           = (fileUploader.mode !== undefined)           ? fileUploader.mode            : fileUploader.getData('mode', 'b64');
	fileUploader.maxFiles 		  = (fileUploader.maxFiles !== undefined) 			? fileUploader.maxFiles 		   : parseInt(fileUploader.getData('maxfiles', 0));
	fileUploader.maxSize        = (fileUploader.maxSize !== undefined) 	      ? fileUploader.maxSize         : fileUploader.getData('maxsize', false);
	fileUploader.classLabel     = (fileUploader.classLabel !== undefined) 	  ? fileUploader.classLabel 	   : fileUploader.getData('classlabel', '');
	fileUploader.classWrapper   = (fileUploader.classWrapper !== undefined)   ? fileUploader.classWrapper    : fileUploader.getData('classwrapper', '');
	fileUploader.files          = (fileUploader.files !== undefined)          ? fileUploader.files           : fileUploader.getData('files', '').split(',');
	fileUploader.allowed        = (fileUploader.allowed !== undefined)        ? fileUploader.allowed         : fileUploader.getData('allowed', '').split(',');
	fileUploader.multiple       = (fileUploader.multiple !== undefined)       ? fileUploader.multiple        : (fileUploader.$el.attr('multiple') !== undefined ? true : false);
	fileUploader.dataAttr       = (fileUploader.dataAttr !== undefined)       ? fileUploader.dataAttr        : (fileUploader.getData('wizardkey',false) ? 'data-wizardkey':'name');
	fileUploader.name           = (fileUploader.name !== undefined)           ? fileUploader.name            : (fileUploader.multiple ? fileUploader.$el.attr(fileUploader.dataAttr)+'[]' : fileUploader.$el.attr(fileUploader.dataAttr));
	fileUploader.nbPreviewItems = (fileUploader.nbPreviewItems !== undefined) ? fileUploader.nbPreviewItems  : fileUploader.getData('nbpreviewitems', false);

	fileUploader.$el.attr('id',fileUploader.id);
	fileUploader.$el.attr('data-name',fileUploader.name);
	fileUploader.$el.addClass('fileUploader').attr('id',fileUploader.id).wrap('<div class="fileUploader__wrapper '+fileUploader.classWrapper+'"></div>');
	fileUploader.$wrapper = fileUploader.$el.parent('.fileUploader__wrapper');
	fileUploader.$label = $('<label class="'+fileUploader.classLabel+'" for="'+fileUploader.id+'">'+(fileUploader.$el.attr('placeholder') || 'Fichier')+'</label>').appendTo(fileUploader.$wrapper)
  	fileUploader.$preview = $(` <div class="fileUploader__preview"></div>`).appendTo(fileUploader.$wrapper);
  	if (fileUploader.nbPreviewItems)
  		fileUploader.$preview.addClass('d-grid cols-'+fileUploader.nbPreviewItems+' cols-md-3 cols-xs-2 cols-xxs-1');
	fileUploader.$previewItem = $(`
    <div class="preview__item">
      <div class="preview__img"></div>
      <div class="preview__label">
        <div class="preview__name"></div>
        <div class="preview__size"></div>
      </div>
      <div class="preview__delete"><i class="fa fa-times"></i></div>
    </div>
  `);
  fileUploader.$error = $(` <div class="fileUploader__error"></div>`).appendTo(fileUploader.$wrapper);

  if (app.components.includes('modalFW') && !fileUploader.$el.closest('.modalFW').length)
    fileUploader.$previewItem.append('<div class="preview__zoomin"><i class="fa fa-search"></i></div>');

	if (fileUploader.mode == "b64")
		fileUploader.$el.removeAttr(fileUploader.dataAttr);
	
  // load default file(s) in the preview
  for(var fileUrl of fileUploader.files){
    fileUploader.addFileFromPath(fileUrl)
  }

	// on change event
	fileUploader.$el.on('change',function(){
		if (this.files.length){
      fileUploader.displayError(false);
      fileUploader.$wrapper.find('input[type=hidden]').remove();
      fileUploader.$preview.find('.preview__item').remove();
      var i = 1;
      for(var file of this.files){
        var valid = true;
        if (fileUploader.maxFiles && i > fileUploader.maxFiles){
          fileUploader.displayError('You can\'t upload more than '+fileUploader.maxFiles+' files.');
          valid = false;
        }
        if (fileUploader.allowed && !fileUploader.allowed.includes(file.type.split('/')[1])){
          fileUploader.displayError('You can\'t upload a '+file.type.split('/')[1]+' file. Allowed extensions: '+fileUploader.allowed.join(', '));
          valid = false;
        }
        if (valid) {
  		    fileUploader.addPreviewImg(file);
          if (fileUploader.mode == "b64") 
            fileUploader.addBase64File(file);
          i++;
        }
      }
    }
	});

	// console.log(fileUploader);
	return fileUploader;
}


FileUploader.prototype.displayError = function(msg,reset=false){
  var fileUploader = this;
  if (reset || !msg)
    fileUploader.$error.html('');
  if (msg)
    fileUploader.$error.append('<p class="error">'+msg+'</p>');
}
FileUploader.prototype.addBase64File = function(file){
  var fileUploader = this;
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function(){
    fileUploader.$wrapper.append('<input type="hidden" class="fileUploader__input" '+fileUploader.dataAttr+'="'+fileUploader.name+'" value="'+reader.result+'" />')
  }
}
FileUploader.prototype.addFileFromPath = function(path){
  var fileUploader = this;
  if (utils.isImageUrl(path.split('?v=')[0])){
    var request = async (url) => {
      await fetch(url).then(function(response) {
        return response.blob();
      }).then(function(blob) {
        blob.name = url.replace(/^.*[\\\/]/, '');
        fileUploader.addPreviewImg(blob);
        if (fileUploader.mode == "b64") 
          fileUploader.addBase64File(blob);
      });
    };
    request(path);
  }
}
FileUploader.prototype.addPreviewImg = function(file,name=false){
  var fileUploader = this;
  var $item = fileUploader.$previewItem.clone();
  var img = document.createElement('img');
  if (file instanceof File || file instanceof Blob){
    if (file.type.split('/')[0] == 'image')
      img.src = window.URL.createObjectURL(file);
    else {
      if (file.type.split('/')[0] == 'application'){
        var ext = file.name.split('.').pop();
        if (Object.keys(iconsFiles).includes(ext))
          img = '<i class="fa fa-file-'+iconsFiles[ext]+'"></i>';
        else
          img = '<i class="fa fa-file"></i>';
      } else {
        img = '<i class="fa fa-question-circle"></i>';
      }
      $item.find('.preview__zoomin').remove();
    }
    $item.attr('title',name ? name : file.name);
    $item.find('.preview__name').html(name ? name : file.name);
    $item.find('.preview__size').html(getFileSize(file.size));
  } else {
    if (utils.isImageUrl(file))
      img.src = file;
  }
  $item.find('.preview__img').html(img);
  fileUploader.$preview.append($item);
  fileUploader.setFilesActions();
}

FileUploader.prototype.setFilesActions = function(){
  var fileUploader = this;
  fileUploader.$preview.find('.preview__item .preview__delete').off('click').on('click',function(){
    var index = $(this).closest('.preview__item').index();
    $(this).closest('.preview__item').remove();
    fileUploader.$wrapper.find('input[type=hidden]').eq(index).remove();
  });

  fileUploader.$preview.find('.preview__item .preview__zoomin').off('click').on('click',function(){
    var img = $(this).closest('.preview__item').find('img');
    var modalScript = new app.ModalFW({
      name : 'modalFileUploader--'+utils.uniqid(),
      content: img.clone(),
      onClose: function(){
        modalScript.destroy();
      }
    });
    modalScript.$el.addClass('modalFW--img');
    modalScript.open();
  });
}

function getFileSize(number) {
  if(number < 1024) {
    return number + ' octets';
  } else if(number >= 1024 && number < 1048576) {
    return (number/1024).toFixed(1) + ' Ko';
  } else if(number >= 1048576) {
    return (number/1048576).toFixed(1) + ' Mo';
  }
}

$(function () {
  $('input[type=file]').not('.custom').fileUploader();
  utils.addHtmlHook('input[type=file]:not(.custom)', function(item){
    item.fileUploader();
  });
});
