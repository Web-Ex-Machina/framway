var Utils = function Utils(){
  var utils = this;

  /**
   * Add a function callback to most of the jQuery dom modification functions, based on a selector.@async
   * When an element mathcing the selector is added to the dom, it fires the related callback
   * @param {String}   selector
   * @param {Function} callback [if the callback has a parameter called "item", the added element will be passed as param to the callback]
   */
  utils.addHtmlHook = function(selector,callback){

    // update html()
    var OldHtml = $.fn.html;
    $.fn.html = function () {
      var EnhancedHtml = OldHtml.apply(this, arguments);
      if (typeof EnhancedHtml != "string" && arguments.length && EnhancedHtml.find(selector).length) {
        if(utils.getParameters(callback).indexOf('item') != -1)
          callback(EnhancedHtml.find(selector));
        else
          callback();
      }
      return EnhancedHtml;
    }
  }

  // apply prefixed event handlers
  utils.prefixedEvent = function(element, type, callback) {
    var pfx = ["webkit", "moz", "MS", "o", ""];
    for (var p = 0; p < pfx.length; p++) {
      if (!pfx[p]) type = type.toLowerCase();
      element.addEventListener(pfx[p]+type, callback, false);
    }
  }

  utils.stringToColor = function(strText){
    strText = strText.replace(/\s+/g, '');
    strText = strText.replace(/[^a-zA-Z 0-9]+/g, '');
    var lengthC = strText.length; //length of the string
    var amount = Math.ceil(lengthC/3); //Determine length of the 3 parts that will define R, G, and B
    var add = amount*3 - lengthC; //Determine how many characters need to be added to reach the length needed
    if(strText.length > add) //if the string is longer than the number of characters to be added (if length != 1, basically)
        strText+=strText.substring(0, add); //x is the number of characters to be added, takes x characters from the start of the string and adds them to the end.
    else { //if length == 1, basically
        for(var i = 0; i < add; i++) {
            strText += strText.substring(0,1); //adds the first charecter until you have enough charecters
        }
    }
    var red36 = strText.substring(0, amount); //splits the string into 3 sections of equal length
    var green36 = strText.substring(amount, amount*2);
    var blue36 = strText.substring(amount*2, amount*3);
    if(red36 == '')
        red36 = '0';
    if(green36 =='')
        green36 = '0';
    if(blue36 == '')
        blue36 = '0';
    var red = parseInt(red36,36); //Turns the numbers from base-36 to base-10 (decimal)
    var green = parseInt(green36,36);
    var blue = parseInt(blue36,36);
    var max = Math.pow(36,amount)-1; // calculates the maximum possible value for a base-36 number of the length that each of the sections is
    if(max == 0)
        max = 1;
    var red16 = Math.round((red/max)*255).toString(16); //scales each value down to fit between 0 and 255, then converts them to base-16 (hexadecimal)
    var green16 = Math.round((green/max)*255).toString(16);
    var blue16 = Math.round((blue/max)*255).toString(16);
    if(red16.length < 2) //makes sure all 3 parts are 2 digits long
        red16 = "0" + red16;
    if(green16.length < 2)
        green16 = "0" + green16;
    if(blue16.length < 2)
        blue16 = "0" + blue16;
    var color = "#"+red16+green16+blue16; //creates the color
    return color; //returns the color
  }

  /**
   * return true if the url provided lead to an image.
   * @param  {String}  url [description]
   * @return {Boolean}     [description]
   */
  utils.isImageUrl = function(url){
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
  }

  /**
   * Build a string for css transforms, combining the existent properties of an element and the new string provided
   * @param  {jQuery} el  [can be a jQuery object or a Dom element]
   * @param  {String} str [expect a valid css transform string]
   * @return {String}
   */
  utils.mergeTransforms = function(el,str){
    try{el = el.get(0);} catch(e){}
    var strTransform = el.style.transform || $(el).css('content').replace(/"/g,'');
    var baseTransform = String(strTransform).split(' ');
    var targetTransform = str.split(' ');
    var objTransform = {};
    if(baseTransform[0] != "none"){
      $.each(baseTransform,function(index,value){
          var key = value.replace(/\((.+?)\)/,'');
          objTransform[key] = value.replace(key,'');
      });
    }
    $.each(targetTransform,function(index,value){
        var key = value.replace(/\((.+?)\)/,'');
        objTransform[key] = value.replace(key,'');
    });
    var strResult = '';
    $.each(objTransform,function(key,value){
        strResult += key+value+' ';
    })
    return strResult;
  }


  utils.mergeArrays = function(arr1,arr2){
    return [... new Set([...arr1,...arr2])];
  }

  /**
   * return an array of a function's parameters. Works only if the parameters don't have defaults values
   * @param  {Function} fn
   * @return {Array}
   */
  utils.getParameters = function(fn){
    var fnStr = fn.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
       result = [];
    return result;
  };
  var STRIP_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg;
  var ARGUMENT_NAMES = /([^\s,]+)/g;

  /**
   * return an array of method's names from an object
   * @param  {Object} obj
   * @return {Array}
   */
  utils.getObjMethods = function(obj){
    var res = [];
    for (var m in obj) {
      if (typeof obj[m] == "function")
          res.push(m);
    }
    return res;
  }

  /**
   * return an Object from an array of Objects that match a property and a specific value
   * @param  {Array of Objects} arrObj
   * @param  {String} property
   * @param  {[type]} value
   * @return {Object}
   */
  utils.getObjBy = function(arrObj,property,value){
    var items;
    if (Array.isArray(arrObj)) {
        items = arrObj.filter(function (obj) {
          if(obj[property] instanceof jQuery && value instanceof jQuery)
            return obj[property].is(value);
          else
            return obj[property] == value;
        });
        if (items.length > 1) return items;else return items[0];
    } else if ((typeof arrObj === "undefined" ? "undefined" : typeof arrObj ) == "object") {
        items = Object.filter(arrObj, property, value);
        if (utils.getObjSize(items) > 1) return items;else return items[Object.keys(items)[0]];
    }
  }
  // utility function used by getObjBy - not intended to be used out of this context
  Object.filter = function (obj, property, value) {
      return Object.keys(obj).filter(function (key) {
          return obj[key][property] == value;
      }).reduce(function (res, key) {
          return res[key] = obj[key], res;
      }, {});
  };

  /**
   * return true or false whether the object submitted has a key or not
   * @param  {Object}  obj
   * @param  {String}  key
   * @return {Boolean}
   */
  Object.hasKey = function(obj,key){
   if(Object.keys(obj).indexOf(key) != -1)
     return true;
   else
     return false;
  }

  /**
   * return the size of an Object
   * @param  {Object} obj
   * @return {Integer}
   */
  utils.getObjSize = function(obj){
    return Object.keys(obj).length;
  }

  /**
   * generate a unique ID based on the date and a random number
   * @return {String}
   */
  utils.uniqid = function() {
      var date = new Date();
      var components = [date.getYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds(), "-", Math.floor(Math.random() * (9999 - 1000) + 1000)];
      return components.join("");
  }

  /**
   * from an array of objects, return an object containing a set of grouped objects by properties values passed as parameters
   * @param  {Array of Objects} arrObj
   * @param  {Array of strings} arrOptions
   * @return {Object}
   */
  utils.groupByObj = function(arrObj, arrOptions){
    var results = {};
    $.each(arrObj, function (alias, value) {
        var strGroup = '';
        $.each(arrOptions, function (index, option) {
            if (index != 0) strGroup += ',';
            strGroup += value[option];
        });
        if (!results[strGroup]) results[strGroup] = {};
        results[strGroup][alias] = value;
    });
    return results;
  };

  /**
   * return a key of an object from a value
   * @param  {Object} obj
   * @param  {[type]} value
   * @return {String}
   */
  utils.getObjKeyByValue = function(obj,value){
    return Object.keys(obj).find(key => obj[key] === value);
  };

  /**
   * Copy the content of the element provided to the clipboard
   * @param  {DOM element} elem
   * @return {Boolean}
   */
  utils.copyToClipboard = function(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
  }


  utils.capitalize = function(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  utils.lowerize = function(str){
    return str.charAt(0).toLowerCase() + str.slice(1);
  }
  utils.normalize = function(str){
    return str.toLowerCase().replace(/ |\./g,'_');
  }

  utils.versionToInt = function(strVersion){
    return parseInt(strVersion.replace(/\./g,''));
  }


  // NOTIFICATIONS SETUP
  global.toastr = require('toastr');
  var toastrDefault = {"newestOnTop": false, "closeButton": true, "timeOut": 0, "extendedTimeOut": 0, "showMethod": "slideDown", "positionClass": "toast-bottom-left", "progressBar": false };
  var toastrTimeOut = {"newestOnTop": false, "closeButton": true, "timeOut": 5000, "extendedTimeOut": 1000, "showMethod": "slideDown", "positionClass": "toast-bottom-left", "progressBar": true };
  toastr.options = toastrDefault;

  /**
   * display a common notification
   * @type {Object}
   */
  global.notif = {
    error : function(str){
      if(app.useNotif)
        toastr.error(str);
    },
    success : function(str){
      if(app.useNotif)
        toastr.success(str);
    },
    warning : function(str){
      if(app.useNotif)
        toastr.warning(str);
    },
    info : function(str){
      if(app.useNotif)
        toastr.info(str);
    },
  };
  /**
   * display a notification that will fade past time
   */
  global.notif_fade = {
    error : function(str){
      if(app.useNotif){
        toastr.options = toastrTimeOut;
        toastr.error(str);
        toastr.options = toastrDefault;
      }
    },
    success : function(str){
      if(app.useNotif){
        toastr.options = toastrTimeOut;
        toastr.success(str);
        toastr.options = toastrDefault;
      }
    },
    warning : function(str){
      if(app.useNotif){
        toastr.options = toastrTimeOut;
        toastr.warning(str);
        toastr.options = toastrDefault;
      }
    },
    info : function(str){
      if(app.useNotif){
        toastr.options = toastrTimeOut;
        toastr.info(str);
        toastr.options = toastrDefault;
      }
    },
  };

  global.viewport = utils.getDimensions();
  return utils;
};
/**
 * return a object containing the viewport width and height
 * @return {Object}
 */
Utils.prototype.getDimensions = function(){
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
};

/**
 * return a set of jQuery object filtered by the data attribute value submitted
 * @param  {[type]} prop [description]
 * @param  {[type]} val  [description]
 * @return {[type]}      [description]
 */
$.fn.filterByData = function(prop, val) {
 return this.filter(
     function() { return $(this).data(prop)==val; }
 );
}

// check end of scrolling
$.fn.scrollEnd = function (callback, timeout) {
    $(this).scroll(function () {
        var $this = $(this);
        if ($this.data('scrollTimeout')) {
            clearTimeout($this.data('scrollTimeout'));
        }
        $this.data('scrollTimeout', setTimeout(callback, timeout));
    });
};

/**
 * check the state of a checkbox
 * @return {Boolean}
 *  TODO : real test
 */
$.fn.isChecked = function () {
  if ($(this).is(':checked')) return true;else return false;
};

$.event.special.destroyed = {
  remove: function(o) {
    if (o.handler) {
      o.handler()
    }
  }
}

$(function () {
  $(window).resize(function(){
    viewport = Utils.prototype.getDimensions();
  });
});

module.exports = new Utils();