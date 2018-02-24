if($('#guideline').length){
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
  var config_html = buildConfig(config,'global');
  var guideline_html = buildGuideline();

  var html = require('mustache-loader!html-loader?interpolate!./templates/index.html')({config: config_html,guideline: guideline_html });
  $('#guideline').append(html);

  // Building functions
  function buildGuideline(){
    var template = require('mustache-loader?noShortcut!html-loader?interpolate!./templates/guideline.html');
    var nav = '';
    var content = '';
    var objConfig;

    // TEXTS
    objConfig = {'Default': 'texts'};
    if(config['enable-bg'] == 'true') objConfig['Backgrounded'] = 'texts_bg';
    if(config['enable-bd'] == 'true') objConfig['Bordered'] = 'texts_bd';
    nav += '<button class="btn">TEXTS</button> ';
    content += '<div class="tab">'
            + buildTabs(objConfig)
            + '</div>';
    // TITLES
    objConfig = {'Default': 'titles','With separators' : 'titles_sep',};
    if(config['enable-bg'] == 'true') objConfig['Backgrounded'] = 'titles_bg';
    nav += '<button class="btn">TITLES</button> ';
    content += '<div class="tab">'
            + buildTabs(objConfig)
            + '</div>';
    // BUTTONS
    objConfig = {'Default': 'buttons', 'Colored' : 'buttons_colors',};
    nav += '<button class="btn ">BUTTONS</button> ';
    content += '<div class="tab">'
            + buildTabs(objConfig)
            + '</div>';
    // INPUTS
    objConfig = {'Type text': 'inputs', 'Type text extra' : 'inputs_texts', 'Others' : 'inputs_others'};
    if(config['enable-bg'] == 'true') objConfig['Backgrounded'] = 'inputs_bg';
    nav += '<button class="btn">INPUTS</button> ';
    content += '<div class="tab">'
            + buildTabs(objConfig)
            + '</div>';
    // BACKGROUNDS
    if(config['enable-bg'] == 'true'){
      nav += '<button class="btn">BACKGROUNDS</button> ';
      content += '<div class="tab">'
      $.each(config.colors,function(key,value){
        content += require('mustache-loader!html-loader?interpolate!./templates/guideline_backgrounds.html')({color: key});
      })
      content += '</div>';
    }
    // BORDERS
    if(config['enable-bd'] == 'true'){
      objConfig = {'Default': 'borders', 'Colored' : 'borders_colors',};
      nav += '<button class="btn">BORDERS</button> ';
      content += '<div class="tab">'
              + buildTabs(objConfig)
              + '</div>';
    }

    return template.render({},{nav: nav,content: content});
  }

  function buildTabs(tabsConfig){
    var template = require('mustache-loader?noShortcut!html-loader?interpolate!./templates/guideline.html');
    var nav = '';
    var content = '';

    $.each(tabsConfig,function(title,templateName){
      nav += '<button class="btn-sm btn-bg-greystronger">'+title+'</button> ';
      if(title.toLowerCase() != "bordered" && title.toLowerCase() != "backgrounded" && title.toLowerCase() != "colored")
        content += require('mustache-loader!html-loader?interpolate!./templates/guideline_'+templateName+'.html')();
      else{
        content += '<div class="tab">';
        $.each(config.colors,function(key,value){
          content += require('mustache-loader!html-loader?interpolate!./templates/guideline_'+templateName+'.html')({color: key});
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



// TODO --> MOVE THIS TO THE UTILS JS FILE
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

