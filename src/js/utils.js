function Utils(){
  var utils = this;
  /**
   * return a object containing the viewport width and height
   * @return {Object}
   */
  utils.getDimensions = function(){
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  };

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
  }

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

  /**
   * check the state of a checkbox
   * @return {Boolean}
   *  TODO : real test
   */
  $.fn.isChecked = function () {
    if ($(this).is(':checked')) return 1;else return 0;
  };

  global.viewport = utils.getDimensions();
  return utils;
}


$(function () {
  $(window).resize(function(){
    viewport = utils.getDimensions();
  });
});


module.exports = new Utils();