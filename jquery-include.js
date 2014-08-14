/**
* Title:   jQuery Include
* Author:  Lawrence Okoth-Odida
* Version: 0.1
*/

(function($, window, document) {
$.include = function(options, callbackComplete) {
  /**
  * Check the type-signature and fix the options accordingly
  */
  if (typeof options == 'string' || Array.isArray(options)) {
    var tmpOptions = {};
    tmpOptions.scripts = Array.isArray(options) ? options : [options];

    options = tmpOptions;
  }

  if (typeof callbackComplete !== 'undefined') {
    options.complete = callbackComplete;
  }

  /**
  * jQuery Include Default Settings
  *
  * @property settings
  * @type {Object}
  */
  var settings = $.extend({
    scripts: [],
    success : function () {
      // ...
    },
    error: function () {
      // ...
    },
    complete : function() {
      // ...
    }
  }, options);

  /**
  * Recursively loads an array of scripts in order given
  *
  * @method loadScripts
  * @param {Array} scripts URLs of the scripts to load
  */
  var loadScripts = function(scripts) {
    if (scripts.length) {
      var url = scripts.shift();

      $.ajax({
        url: url,
        dataType: 'script',
        success: function() {
          // ...
        },
        error: function() {
          // ...
        },
        complete: function() {
          loadScripts(scripts);
        }
      });
    } else {
      settings.complete();
    }
  };

  /**
  * Procedures
  */
  loadScripts(settings.scripts);
};
})(jQuery, window, document);
