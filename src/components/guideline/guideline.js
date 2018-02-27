if($('#guideline').length){
  require('./_guideline.scss');
  var config = require('../../scss/_config.scss');
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
  var componentsHtml = buildComponents();

  var html = require('mustache-loader!html-loader?interpolate!./templates/index.html')({
    config: configHtml,
    styling: stylingHtml,
    components: componentsHtml,
  });
  $('#guideline').append(html);

  // Building functions
  function buildComponents(){
    var components = {nav : '', content : ''};
    components.nav += '<ul>';
    $.each(app.components,function(index,component){
      try{
        components.content += '<div class="item row" id="framway__components-'+component+'">'
                           + '<div class="col-12 col-md-6">'
                           + require('html-loader?interpolate!../'+component+'/sample.html')
                           + '</div>'
                           + '<div class="col-12 col-md-6">'
                           + '<pre><code class="language-html"><button class="copy">Copy</button>'
                           + require('html-loader!../'+component+'/sample.html').replace(/</g,'&lt;').replace(/>/g,'&gt;')
                           + '</code></pre>'
                           + '</div>'
                           + '</div>'
        components.nav += '<li><a href="#framway__components-'+component+'">'+component+'</a></li>';
      } catch(e){

      }
    });
    components.nav += '</ul>';

    if(app.components.length == 0)
      components.content = 'No components loaded';
    return components;
  }

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
                      + '<h2 class="ft-i">Texts</h2>'
                      + buildTabs(objConfig)
                      +  '</div>';

    // TITLES
    objConfig = {'Default': 'titles','With separators' : 'titles_sep',};
    if(config['enable-bg'] == 'true') objConfig['Backgrounded'] = 'titles_bg';
    styling.nav += '<li><a href="#framway__styling-titles">Titles</a></li>';
    styling.content += '<div class="item" id="framway__styling-titles">'
                      + '<h2 class="ft-i">Titles</h2>'
                      + buildTabs(objConfig)
                      + '</div>';
    // BUTTONS
    objConfig = {'Default': 'buttons', 'Colored' : 'buttons_colors',};
    styling.nav += '<li><a href="#framway__styling-buttons">Buttons</a></li>';
    styling.content += '<div class="item" id="framway__styling-buttons">'
                      + '<h2 class="ft-i">Buttons</h2>'
                      + buildTabs(objConfig)
                      + '</div>';
    // INPUTS
    objConfig = {'Type text': 'inputs', 'Type text extra' : 'inputs_texts', 'Others' : 'inputs_others'};
    if(config['enable-bg'] == 'true') objConfig['Backgrounded'] = 'inputs_bg';
    styling.nav += '<li><a href="#framway__styling-inputs">Inputs</a></li>';
    styling.content += '<div class="item" id="framway__styling-inputs">'
                      + '<h2 class="ft-i">Inputs</h2>'
                      + buildTabs(objConfig)
                      + '</div>';
    // BACKGROUNDS
    if(config['enable-bg'] == 'true'){
      styling.nav += '<li><a href="#framway__styling-backgrounds">Backgrounds</a></li>';
      styling.content += '<div class="item" id="framway__styling-backgrounds">'
                        + '<h2 class="ft-i">Backgrounds</h2>';
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
                        + '<h2 class="ft-i">Borders</h2>'
                        + buildTabs(objConfig)
                        + '</div>';
    }

    styling.nav += '</ul>';

    return styling;
  }

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
  }

  function buildConfig(obj,title = ''){
    var template = require('mustache-loader?noShortcut!html-loader?interpolate!./templates/config_section.html');  // noShortcut is used to insert partials later into the final template
    var rows = ''; // the partials mentionned above
    var arrObjects = {}; // used to store and process later the sub-object of config
    var htmlStack = ''; // used to stack the multiple results form arrObjects results
    $.each(obj,function(key,value){
      if(typeof value != 'object'){
        var str = '<span>'+key+' :</span><span>'+value+'</span>';
        if(value.indexOf('#') != -1)
          str = '<span>'+key+' :</span><span class="bd-'+getKeyByValue(config.colors, value)+'-bottom-5 p-bottom-0">'+value+'</span>';
        rows += require('mustache-loader!html-loader?interpolate!./templates/config_row.html')({str: str});
      }
      else
        arrObjects[key] = value;
    });
    $.each(arrObjects,function(key,value){
      htmlStack += buildConfig(value, key);
    });
    return template.render({title: title},{rows: rows})+htmlStack; // return the initial template filled with his rows PLUS the stack we get by processing recursively the config
  }
}

$(function () {
  $('#guideline nav a').bind('click',function(e){
    e.preventDefault();
    var target = $(this).addClass('active').attr('href');
    $('#guideline nav a').not(this).removeClass('active');
    $('#guideline .content .item').removeClass('active');

    $('#guideline .content .item'+target).addClass('active').find('.item').addClass('active');
    if(target.split('-').length > 1){
      $.each(target.split('-'),function(index,tgt){
        $('#guideline .content .item#'+tgt.replace('#','')).addClass('active');
      })
    }
  });
  $('#guideline nav a').last().trigger('click');
});



// TODO --> MOVE THIS TO THE UTILS JS FILE
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

