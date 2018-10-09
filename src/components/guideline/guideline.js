if($('#guideline').length){
  var config = require('../../scss/_config.scss');
  $.each(app.themes,function(index,theme){
    config = Object.assign(config,require('../../themes/'+theme+'/_config.scss'));
  });

  $.each(config,function(key,value){
    if(value[0] == '(' && value[value.length - 1] == ")"){
      var objValue = value.replace('(','{').replace(')','}').replace(/ /g, '')
              .replace(/([\w]+):/g, '"$1":')
              .replace(/:([\w]+)/g, ':"$1"')
              .replace(/:#([\w]+)/g, ':"#$1"')
              .replace(/:([\d]+)/g, function(m, num) {return ':'+parseFloat(num)})
              .replace(/:([[{])/g, ':$1');
      config[key] = JSON.parse(objValue);
    }
  });
  var configHtml = buildConfig(config,'global');
  var stylingHtml = buildStyling();
  var manualHtml = buildManual();
  var componentsHtml = buildComponents();

  var html = require('mustache-loader!html-loader?interpolate!./templates/index.html')({
    config: configHtml,
    manual: manualHtml,
    styling: stylingHtml,
    components: componentsHtml,
  });

  // html = $($.parseHTML(html));
  html = $(html);
  html.find('.editor textarea').each(function(index,editor){
    var editorText = $(editor).val();
    var timerEdit,timerEditValue;
    $(editor).bind('keyup change',function(e,forced){
      timerEditValue = 500;
      if(forced) timerEditValue = 0;
      clearTimeout(timerEdit);
      timerEdit = setTimeout(function(){
        var val = $(editor).val();
        if(val != editorText || forced){
          editorText = val;
          $(editor).closest('.item').find('.editor-target').html(val);
        }
      },timerEditValue);
    });
  });

  html.find('.constructor').each(function(index,constructor){
    var editor = $(constructor).closest('.item').find('.editor textarea');
    // SELECTS
    $(constructor).find('select').bind('change',function(e){
      applyConstructorChanges($(this));
    }).trigger('change');

    // CHECKBOXES
    $(constructor).find('.checkbox').bind('click',function(e){
      applyConstructorChanges($(this));
    }).each(function(){
      if($(this).data('default'))
        $(this).trigger('click');
    });

    // NUMBERS
    $(constructor).find('.number').bind('change',function(e){
      applyConstructorChanges($(this));
    }).each(function(){
        $(this).trigger('change');
    });
  });

  function applyConstructorChanges($el){
    var editor = $el.closest('.item').find('.editor textarea');

    var selector = $el.attr('name').split(',')[0];
    var attr = $el.attr('name').split(',')[1];
    var dummy = $(editor.val()).wrapAll('<div></div>');

    var match = false;
    var value = $el.val();
    if($el.hasClass('select')){
      match = [];
      $el.find('option').each(function(){
        if(this.value != '')
          match.push(this.value);
      });
      match = match.join(' ');
    }
    else if($el.hasClass('checkbox') && value == "undefined"){
      value = $el.isChecked();
    }
    else if($el.hasClass('checkbox') && value != "undefined" && attr != "class"){
      if($el.isChecked()) value = $el.val();
      else value = '';
    }
    else if($el.hasClass('number')){
      match = [];
      for (var i = $el.attr('min'); i <= $el.attr('max'); i++) {
        match.push($el.data('prefix')+i);
      }
      match = match.join(' ');
      if($el.val())
        value = $el.data('prefix') + $el.val();
    }

    if(attr == 'class'){
      if(match)
        dummy.parent().find('.'+selector).removeClass(match);
      dummy.parent().find('.'+selector).toggleClass(value);
    } else {
      dummy.parent().find('.'+selector).attr(attr,value);
    }

    editor.val(dummy.parent().get(0).innerHTML).trigger('keyup');
  };

  $('#guideline').append(html);

  // Building functions
  function buildComponents(){
    var components = {nav : '', content : ''};
    components.nav += '<ul>';
    $.each(app.components,function(index,component){
      var sampleText = '';
      try{
        sampleText = require('html-loader?interpolate!../'+component+'/sample.html');
      } catch(e){
        app.log('Failed to retrieve the '+component+' component sample.\n'+e);
      }
      if(sampleText != ''){
        sampleText = $(sampleText).wrapAll('<div></div>');
        var constructorText = '';
        if(sampleText.parent().find('.constructor').length){
          sampleText.parent().find('.constructor').addClass('col-12 col-lg-6 ').find('.input').each(function(){
            var ref = $(this);
            var target = ref.data('attr');
            var name = ref.data('label').replace(' ','-').toLowerCase();
            var desc = ref.html() || false;
            var inputGroup = '<div class="form-group col-12 col-xl-6">';

            if(desc){
              inputGroup += '<i class="descIcon fas fa-question-circle"></i>';
              inputGroup += '<div class="descText">'+desc+'</div>';
            }

            if(ref.hasClass('select')){
              var arrVal = ref.data('value').split(',');
              var arrOutput = ref.data('output').split(',');
              if(arrVal[0].indexOf('#colors') != -1){
                var baseValue = arrVal[0].replace('#colors','');
                arrVal = [];
                $.each(config.colors,function(key,color){
                  arrVal.push(baseValue+key);
                });
              }
              if(arrOutput[0].indexOf('#colors') != -1){
                var baseValue = arrOutput[0].replace('#colors','');
                arrOutput = [];
                $.each(config.colors,function(key,color){
                  arrOutput.push(baseValue+key);
                });
              }
              inputGroup += '<label for="'+component+','+target+','+name+'">'+ref.data('label')+'</label>'
                          + '<select class="select" name="'+component+','+target+','+name+'" id="'+component+','+target+','+name+'">'
                          + '<option value=""> - </option>';
              $.each(arrVal,function(index,val){
                if(val == ref.data('selected'))
                  inputGroup += '<option value="'+val+'" selected>'+arrOutput[index]+'</option>';
                else
                  inputGroup += '<option value="'+val+'">'+arrOutput[index]+'</option>';
              });
              inputGroup += '</select>';
            } else if(ref.hasClass('checkbox')){
              inputGroup += '<input type="checkbox" value="'+ref.data('value')+'" class="checkbox" name="'+component+','+target+','+name+'" id="'+component+','+target+','+name+'" data-default="'+ref.data('selected')+'" >'
                          + '<label for="'+component+','+target+','+name+'">'+ref.data('label')+'</label>';
            } else if(ref.hasClass('number')){
              var range = ref.data('range').split('-');
              inputGroup += '<label for="'+component+','+target+','+name+'">'+ref.data('label')+'</label>'
              inputGroup += '<input type="number" min="'+range[0]+'" max="'+range[1]+'" data-prefix="'+ref.data('prefix')+'" value="'+ref.data('value')+'" class="number" name="'+component+','+target+','+name+'" id="'+component+','+target+','+name+'">';
            }

            inputGroup += '</div>';
            ref.replaceWith(inputGroup);
          });
          constructorText = sampleText.parent().find('.constructor').wrapInner('<div class="row"></div>').remove().get(0).outerHTML;
        }
        sampleText = sampleText.parent().get(0).innerHTML;

        if(typeof sampleText == 'undefined')
          sampleText = 'error while retrieving sample';

        components.content += '<div class="item row" id="framway__components-'+component+'">'
                           + '<h2 class="ft-i col-12 sep-bottom">'+component+'</h2>'
                           + '<div class="col-12 editor-target">'
                           + sampleText
                           + '</div>'
                           + '<div class="col">'
                           + '<div class="editor"><button class="copy">Copy</button>'
                           + '<textarea name="" id="">'+sampleText.replace(/</g,'&lt;').replace(/>/g,'&gt;')+'</textarea>'
                           + '</div>'
                           + '</div>'
                           + constructorText
                           + '</div>'
        components.nav += '<li><a href="#framway__components-'+component+'">'+component+'</a></li>';
      } else {
        app.log('Failed to display the '+component+' component sample.\n');
      }
    });
    components.nav += '</ul>';

    if(app.components.length == 0)
      components.content = 'No components loaded';
    return components;
  };

  function buildStyling(){
    var styling = {nav : '', content : ''};
    var objConfig;

    styling.nav += '<ul>';
    // TEXTS
    objConfig = {'Default': 'texts'};
    if(config['enable-bg'] == 'true') objConfig['Backgrounded'] = 'texts_bg';
    if(config['enable-bd'] == 'true') objConfig['Bordered'] = 'texts_bd';
    styling.nav += '<li><a href="#framway__styling-text">Texts</a></li>';
    styling.content += '<div class="item active" id="framway__styling-text">'
                      + '<h2 class="ft-i sep-bottom">Texts</h2>'
                      + buildTabs(objConfig)
                      +  '</div>';

    // TITLES
    objConfig = {'Default': 'titles','With separators' : 'titles_sep',};
    if(config['enable-bg'] == 'true') objConfig['Backgrounded'] = 'titles_bg';
    styling.nav += '<li><a href="#framway__styling-titles">Titles</a></li>';
    styling.content += '<div class="item" id="framway__styling-titles">'
                      + '<h2 class="ft-i sep-bottom">Titles</h2>'
                      + buildTabs(objConfig)
                      + '</div>';
    // BUTTONS
    objConfig = {'Default': 'buttons', 'Colored' : 'buttons_colors',};
    styling.nav += '<li><a href="#framway__styling-buttons">Buttons</a></li>';
    styling.content += '<div class="item" id="framway__styling-buttons">'
                      + '<h2 class="ft-i sep-bottom">Buttons</h2>'
                      + buildTabs(objConfig)
                      + '</div>';
    // INPUTS
    objConfig = {'Type text': 'inputs', 'Type text extra' : 'inputs_texts', 'Others' : 'inputs_others'};
    if(config['enable-bg'] == 'true') objConfig['Backgrounded'] = 'inputs_bg';
    styling.nav += '<li><a href="#framway__styling-inputs">Inputs</a></li>';
    styling.content += '<div class="item" id="framway__styling-inputs">'
                      + '<h2 class="ft-i sep-bottom">Inputs</h2>'
                      + buildTabs(objConfig)
                      + '</div>';
    // BACKGROUNDS
    if(config['enable-bg'] == 'true'){
      styling.nav += '<li><a href="#framway__styling-backgrounds">Backgrounds</a></li>';
      styling.content += '<div class="item" id="framway__styling-backgrounds">'
                        + '<h2 class="ft-i sep-bottom">Backgrounds</h2>';
      $.each(config.colors,function(key,value){
        styling.content += require('mustache-loader!html-loader?interpolate!./templates/styling_backgrounds.html')({color: key});
      })
      styling.content += '</div>';
    }
    // BORDERS
    if(config['enable-bd'] == 'true'){
      objConfig = {'Default': 'borders', 'Colored' : 'borders_colors',};
      styling.nav += '<li><a href="#framway__styling-borders">Borders</a></li>';
      styling.content += '<div class="item" id="framway__styling-borders">'
                        + '<h2 class="ft-i sep-bottom">Borders</h2>'
                        + buildTabs(objConfig)
                        + '</div>';
    }

    styling.nav += '</ul>';

    return styling;
  };

  function buildManual(){
    var manual = {nav : '', content : ''};
    var arrManuals = ['flex','opacity','margin-padding'];
    if(app.components.indexOf('modalFW')!=-1)
      arrManuals.push('modalFW');
    manual.nav += '<ul>';
    $.each(arrManuals,function(index,className){
      manual.nav += '<li><a href="#framway__manual-'+className+'">'+className.replace(className[0], className[0].toUpperCase())+'</a></li>';
      manual.content += '<div class="item active" id="framway__manual-'+className+'">'
                        + '<h2 class="ft-i sep-bottom">'+className.replace(className[0], className[0].toUpperCase())+'</h2>'
                        + require('mustache-loader!html-loader?interpolate!./manuals/'+className+'.html')()
                        + '</div>';
    });
    manual.nav += '</ul>';
    $(manual.content).find('pre').each(function(){
      var trimHtml = $(this).html().split('\n').map(function(line){
        if(line.substr(0,4) == '    ') return line.substr(4);
        else return line;
      }).join('\n');
      manual.content = manual.content.replace($(this).html(),trimHtml.replace(/</g,'&lt;').trim());
    });
    return manual;
  };

  function buildTabs(tabsConfig){
    var template = require('mustache-loader?noShortcut!html-loader?interpolate!./templates/tabs.html');
    var nav = '';
    var content = '';

    $.each(tabsConfig,function(title,templateName){
      nav += '<button class="btn-sm btn-bg-greystronger">'+title+'</button> ';
      if(title.toLowerCase() != "bordered" && title.toLowerCase() != "backgrounded" && title.toLowerCase() != "colored")
        content += require('mustache-loader!html-loader?interpolate!./templates/styling_'+templateName+'.html')();
      else{
        content += '<div class="tab">';
        $.each(config.colors,function(key,value){
          content += require('mustache-loader!html-loader?interpolate!./templates/styling_'+templateName+'.html')({color: key});
        })
        content += '</div>';
      }
    });

    return template.render({},{nav: nav,content: content});
  };

  function buildConfig(obj,title = ''){
    var template = require('mustache-loader?noShortcut!html-loader?interpolate!./templates/config_section.html');  // noShortcut is used to insert partials later into the final template
    var rows = ''; // the partials mentionned above
    var arrObjects = {}; // used to store and process later the sub-object of config
    var htmlStack = ''; // used to stack the multiple results form arrObjects results
    $.each(obj,function(key,value){
      if(typeof value != 'object'){
        var str = '<span class="ellipsis" title="'+key+'">'+key+' :</span><span>'+value+'</span>';
        if(value.indexOf('#') != -1)
          str = '<span class="ellipsis" title="'+key+'">'+key+' :</span><span class="bd-bottom-'+utils.getObjKeyByValue(config.colors, value)+'-5 p-bottom-0">'+value+'</span>';
        rows += require('mustache-loader!html-loader?interpolate!./templates/config_row.html')({str: str});
      }
      else
        arrObjects[key] = value;
    });
    $.each(arrObjects,function(key,value){
      htmlStack += buildConfig(value, key);
    });
    return template.render({title: title},{rows: rows})+htmlStack; // return the initial template filled with his rows PLUS the stack we get by processing recursively the config
  };


  $(function () {
    $('#guideline nav a').bind('click',function(e){
      e.preventDefault();
      var target = $(this).addClass('active').attr('href');
      $('#guideline nav a').not(this).removeClass('active');
      $('#guideline .content .item').removeClass('active');

      window.location.hash = target;
      window.location.replace(window.location);

      $('#guideline .content .item'+target).addClass('active').find('.item').addClass('active');
      if(target.split('-').length > 1){
        $.each(target.split('-'),function(index,tgt){
          $('#guideline .content .item#'+tgt.replace('#','')).addClass('active');
        })
      }
      $('#guideline .content .item'+target).find('.editor textarea').trigger('change',true);
    });

    $('.editor textarea').bind('keyup change',function(e){
      this.style.height = "auto";
      this.style.height = (this.scrollHeight + 10) + "px";
    });

    $('body').on('click','.editor .copy',function(e){
      var elem = $(this).parent().find('textarea').get(0);
      if(utils.copyToClipboard(elem))
        notif_fade.success('Copied to clipboard !');
    });

    if(window.location.hash != "")
      $('#guideline nav a[href="'+window.location.hash+'"]').trigger('click');
    else
      $('#guideline nav a').first().trigger('click');
  });
};
